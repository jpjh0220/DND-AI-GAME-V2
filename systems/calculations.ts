import { Player, PlayerStats, Item, StatusEffect } from '../types';

export const getMod = (score: number) => Math.floor(((score || 10) - 10) / 2);

export const calculateEncumbrance = (inventory: Item[]) => (inventory || []).reduce((total, item) => total + (item.weight || 0), 0);

export const calculateMaxCarry = (str: number) => (str || 10) * 15;

/** @deprecated Use computeAC from engine.ts for full D&D 5E rules. This wrapper delegates to it. */
export const calculatePlayerAC = (player: Player): number => {
    const dexMod = getMod(player.stats.dex);
    const equipment = player.equipment;
    let baseAC = 10 + dexMod;
    let shieldBonus = 0;

    if (player.feats.includes('dragon_hide') && !equipment.armor) {
        baseAC = 13 + dexMod;
    }

    if (equipment.armor?.ac) {
        const armorAC = equipment.armor.ac;
        if (armorAC >= 16) {
            baseAC = armorAC; // Heavy: no DEX
        } else if (armorAC >= 13) {
            const dexCap = player.feats.includes('medium_armor_master') ? 3 : 2;
            baseAC = armorAC + Math.min(dexMod, dexCap); // Medium: capped DEX
        } else {
            baseAC = armorAC + dexMod; // Light: full DEX
        }
    }

    if (equipment.offHand?.ac) shieldBonus = equipment.offHand.ac;
    if (player.feats.includes('dual_wielder') && equipment.mainHand && equipment.offHand && !equipment.offHand.ac) {
        shieldBonus += 1;
    }

    let acMod = 0;
    for (const effect of player.statusEffects) {
        if (effect.effect.acModifier) acMod += effect.effect.acModifier;
    }

    return baseAC + shieldBonus + acMod;
};

export const getProficiencyBonus = (level: number): number => Math.ceil(level / 4) + 1;

export const calculateXpToNextLevel = (level: number): number => {
  return (level * 100) + 150;
};

export const getSpellcastingAbility = (className: string): keyof PlayerStats => {
    switch (className) {
        case 'Wizard':
        case 'Artificer':
            return 'int';
        case 'Cleric':
        case 'Druid':
        case 'Ranger':
            return 'wis';
        case 'Bard':
        case 'Paladin':
        case 'Sorcerer':
        case 'Warlock':
            return 'cha';
        default:
            return 'int'; // Fallback
    }
};

/**
 * Rolls dice based on a string (e.g., "1d6", "2d8+2").
 * @param damageString The dice roll string.
 * @returns The total damage rolled.
 */
export const parseDamageRoll = (damageString: string): number => {
    let totalDamage = 0;
    const parts = damageString.split('+');
    let bonus = 0;

    // Extract flat bonus if present
    if (parts.length > 1) {
        bonus = parseInt(parts[1].trim(), 10);
        if (isNaN(bonus)) bonus = 0;
    }

    const dicePart = parts[0].trim();
    const diceMatch = dicePart.match(/(\d*)d(\d+)/);

    if (diceMatch) {
        const numDice = parseInt(diceMatch[1] || '1', 10); // Default to 1 die if not specified
        const dieType = parseInt(diceMatch[2], 10);

        for (let i = 0; i < numDice; i++) {
            totalDamage += Math.floor(Math.random() * dieType) + 1;
        }
    } else {
        // If not a dice roll (e.g., "5"), just parse as an integer
        const flatValue = parseInt(dicePart, 10);
        if (!isNaN(flatValue)) {
            totalDamage = flatValue;
        }
    }

    return totalDamage + bonus;
};

/**
 * Processes all active status effects for one turn:
 * - Applies hpPerTurn, mpPerTurn, staminaPerTurn
 * - Decrements numeric durations
 * - Removes effects whose duration reaches 0
 * Returns the mutated player and an array of log messages.
 */
export const tickStatusEffects = (player: Player): { player: Player; messages: string[] } => {
    const messages: string[] = [];
    const remaining: StatusEffect[] = [];

    for (const eff of player.statusEffects) {
        // Apply per-turn effects
        if (eff.effect.hpPerTurn) {
            player.hpCurrent = Math.min(player.hpMax, Math.max(0, player.hpCurrent + eff.effect.hpPerTurn));
            if (eff.effect.hpPerTurn > 0) {
                messages.push(`${eff.name}: +${eff.effect.hpPerTurn} HP`);
            } else {
                messages.push(`${eff.name}: ${eff.effect.hpPerTurn} HP`);
            }
        }
        if (eff.effect.mpPerTurn) {
            player.manaCurrent = Math.min(player.manaMax, Math.max(0, player.manaCurrent + eff.effect.mpPerTurn));
            if (eff.effect.mpPerTurn > 0) {
                messages.push(`${eff.name}: +${eff.effect.mpPerTurn} MP`);
            } else {
                messages.push(`${eff.name}: ${eff.effect.mpPerTurn} MP`);
            }
        }
        if (eff.effect.staminaPerTurn) {
            player.staminaCurrent = Math.min(player.staminaMax, Math.max(0, player.staminaCurrent + eff.effect.staminaPerTurn));
            if (eff.effect.staminaPerTurn > 0) {
                messages.push(`${eff.name}: +${eff.effect.staminaPerTurn} ST`);
            } else {
                messages.push(`${eff.name}: ${eff.effect.staminaPerTurn} ST`);
            }
        }

        // Decrement duration
        if (typeof eff.duration === 'number') {
            eff.duration -= 1;
            if (eff.duration <= 0) {
                messages.push(`${eff.name} has worn off.`);
                continue; // Don't keep this effect
            }
        }
        // 'permanent' effects persist indefinitely
        remaining.push(eff);
    }

    player.statusEffects = remaining;
    return { player, messages };
};
