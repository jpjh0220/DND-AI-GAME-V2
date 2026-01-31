import { Player, PlayerStats, Item } from '../types';

export const getMod = (score: number) => Math.floor(((score || 10) - 10) / 2);

export const calculateEncumbrance = (inventory: Item[]) => (inventory || []).reduce((total, item) => total + (item.weight || 0), 0);

export const calculateMaxCarry = (str: number) => (str || 10) * 15;

export const calculatePlayerAC = (player: Player): number => {
    let totalAC = 0;
    const armorItems = Object.values(player.equipment).filter(item => item && typeof item.ac === 'number');
    
    if (armorItems.length === 0) {
        return 10 + getMod(player.stats.dex); // Unarmored AC
    }
    // Simplified AC: Sum of all equipped items with an AC value.
    armorItems.forEach(item => {
        totalAC += item.ac || 0;
    });
    return totalAC;
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
