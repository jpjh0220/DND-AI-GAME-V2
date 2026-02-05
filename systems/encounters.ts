/**
 * Encounter Scaling System
 * - Filters encounters by player level
 * - Scales enemy stats based on level difference
 * - Supports multi-enemy encounters
 */

import { Enemy, Encounter, Player } from '../types';
import { ENCOUNTERS_DB, ENEMIES_DB } from '../registries/index';

// CR to player level mapping (D&D 5E approximate)
const CR_TO_LEVEL: Record<number, { min: number; max: number }> = {
    0: { min: 1, max: 4 },
    0.125: { min: 1, max: 3 },
    0.25: { min: 1, max: 3 },
    0.5: { min: 1, max: 4 },
    1: { min: 1, max: 5 },
    2: { min: 2, max: 6 },
    3: { min: 3, max: 7 },
    4: { min: 4, max: 8 },
    5: { min: 5, max: 9 },
    6: { min: 5, max: 10 },
    7: { min: 6, max: 11 },
    8: { min: 7, max: 12 },
    9: { min: 8, max: 13 },
    10: { min: 9, max: 14 },
    11: { min: 10, max: 15 },
    12: { min: 11, max: 16 },
    13: { min: 12, max: 17 },
    14: { min: 13, max: 18 },
    15: { min: 14, max: 19 },
    16: { min: 15, max: 20 },
    17: { min: 16, max: 20 },
    18: { min: 17, max: 20 },
    19: { min: 18, max: 20 },
    20: { min: 19, max: 20 },
    21: { min: 20, max: 20 },
    22: { min: 20, max: 20 },
    23: { min: 20, max: 20 },
    24: { min: 20, max: 20 },
    30: { min: 20, max: 20 },
};

/**
 * Get encounters appropriate for a player's level
 */
export function getScaledEncounters(playerLevel: number, locationEncounterIds?: string[]): Encounter[] {
    // Filter by location first if provided
    let available = locationEncounterIds
        ? ENCOUNTERS_DB.filter(e => locationEncounterIds.includes(e.id))
        : ENCOUNTERS_DB;

    // Filter by challenge rating appropriate for player level
    return available.filter(encounter => {
        if (!encounter.challengeRating) return true; // Non-combat encounters always available

        const cr = encounter.challengeRating;
        const range = CR_TO_LEVEL[cr] || CR_TO_LEVEL[Math.floor(cr)] || { min: 1, max: 20 };

        // Allow encounters within level range, with some stretch for higher levels
        const minLevel = range.min;
        const maxLevel = range.max + Math.floor(playerLevel / 5); // Higher level players can face tougher stuff

        return playerLevel >= minLevel && playerLevel <= maxLevel + 3;
    });
}

/**
 * Get encounter IDs appropriate for the player's level
 */
export function getAvailableEncounterIds(playerLevel: number, locationEncounterIds?: string[]): string[] {
    return getScaledEncounters(playerLevel, locationEncounterIds).map(e => e.id);
}

/**
 * Scale an enemy's stats based on player level vs enemy CR
 */
export function scaleEnemy(enemy: Enemy, playerLevel: number): Enemy {
    const cr = enemy.challenge || 1;
    const range = CR_TO_LEVEL[cr] || CR_TO_LEVEL[Math.floor(cr)] || { min: 1, max: 20 };
    const idealLevel = (range.min + range.max) / 2;

    // Calculate level difference
    const levelDiff = playerLevel - idealLevel;

    // Scale HP: +10% per level above, -5% per level below (minimum 50%)
    let hpMultiplier = 1 + (levelDiff * 0.1);
    hpMultiplier = Math.max(0.5, Math.min(2.0, hpMultiplier));

    // Scale damage: +5% per level above (max 50% bonus)
    let damageBonus = Math.max(0, Math.floor(levelDiff * 0.5));
    damageBonus = Math.min(5, damageBonus); // Cap at +5 damage

    const scaledHp = Math.max(1, Math.floor(enemy.hp * hpMultiplier));

    // Modify damage roll if scaling up
    let scaledDamageRoll = enemy.damageRoll;
    if (damageBonus > 0) {
        // Add bonus to damage roll (e.g., "2d6+3" becomes "2d6+8")
        const match = enemy.damageRoll.match(/^(.+?)([+-]\d+)?$/);
        if (match) {
            const baseDice = match[1];
            const existingBonus = parseInt(match[2] || '0', 10);
            scaledDamageRoll = `${baseDice}+${existingBonus + damageBonus}`;
        }
    }

    return {
        ...enemy,
        hp: scaledHp,
        hpMax: scaledHp,
        damageRoll: scaledDamageRoll,
    };
}

/**
 * Spawn all enemies from an encounter, scaled to player level
 */
export function spawnEncounterEnemies(encounter: Encounter, playerLevel: number): Enemy[] {
    if (!encounter.enemyIds || encounter.enemyIds.length === 0) return [];

    return encounter.enemyIds
        .map(enemyId => ENEMIES_DB.find(e => e.id === enemyId))
        .filter((e): e is Enemy => e !== undefined)
        .map((enemy, index) => scaleEnemy({
            ...enemy,
            id: `${enemy.id}_${index}`, // Unique ID for each instance
        }, playerLevel));
}

/**
 * Calculate total XP from defeating all enemies
 */
export function calculateEncounterXP(enemies: Enemy[]): number {
    return enemies.reduce((total, enemy) => total + (enemy.xp || 0), 0);
}

/**
 * Calculate total currency from defeating all enemies
 */
export function calculateEncounterCurrency(enemies: Enemy[]): number {
    return enemies.reduce((total, enemy) => {
        const cr = enemy.challenge || 1;
        return total + Math.floor(cr * 50);
    }, 0);
}

/**
 * Collect all loot from defeated enemies
 */
export function collectEncounterLoot(enemies: Enemy[]): string[] {
    const loot: string[] = [];
    for (const enemy of enemies) {
        if (enemy.loot) {
            loot.push(...enemy.loot);
        }
    }
    return loot;
}
