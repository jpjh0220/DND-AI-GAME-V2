

import { Player, World, LogEntry, Choice, Item, PlayerStats, Spell } from '../types';
// FIX: Corrected import path to point to the index file within the directory.
import { CLASSES, ITEMS_DB, RACES, BACKGROUNDS, SPELLS_DB } from '../registries/index';
import { getMod, calculatePlayerAC, calculateXpToNextLevel } from './calculations';

export const assignDefaultStats = (raceName: string, className: string): PlayerStats => {
    const classData = CLASSES[className];
    const raceData = RACES[raceName];
    if (!classData || !raceData) {
        return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    }

    const standardArray = [15, 14, 13, 12, 10, 8];
    const stats: PlayerStats = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    const assignedStats: (keyof PlayerStats)[] = [];
    const allStatKeys: (keyof PlayerStats)[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    // 1. Assign primary stats from class data
    const primaryStats = classData.primaryStats;
    stats[primaryStats[0]] = standardArray.shift()!;
    assignedStats.push(primaryStats[0]);
    
    if (primaryStats[1] && !assignedStats.includes(primaryStats[1])) {
        stats[primaryStats[1]] = standardArray.shift()!;
        assignedStats.push(primaryStats[1]);
    }

    // 2. Assign remaining scores to other stats in a fixed order
    for (const statKey of allStatKeys) {
        if (!assignedStats.includes(statKey)) {
            stats[statKey] = standardArray.shift()!;
        }
    }

    // 3. Apply racial bonuses
    if (raceData.bonus) {
        for (const [stat, bonus] of Object.entries(raceData.bonus)) {
            if (stat === 'all') {
                // FIX: Cast bonus to number to resolve operator '+' cannot be applied to types 'number' and 'unknown'.
                allStatKeys.forEach(s => stats[s] += bonus as number);
            } else {
                // FIX: Cast bonus to number to resolve operator '+' cannot be applied to types 'number' and 'unknown'.
                stats[stat as keyof PlayerStats] += bonus as number;
            }
        }
    }
    
    return stats;
};

export const createCharacter = (data: Player) => {
    const cls = CLASSES[data.class];
    const background = BACKGROUNDS[data.background];
    const race = RACES[data.race];
    
    const conMod = getMod(data.stats.con);
    let hp = cls.hd + conMod;

    if (data.feats?.includes('tough')) {
        hp += 2; // Level 1 bonus
    }

    const initialPlayer: Player = { 
        ...data,
        hpMax: hp, hpCurrent: hp, 
        manaMax: cls.mana, manaCurrent: cls.mana, 
        staminaMax: cls.stamina, staminaCurrent: cls.stamina, 
        inventory: [ITEMS_DB.find(i => i.id === 'ration'), ITEMS_DB.find(i => i.id === 'waterskin')].filter(Boolean) as Item[],
        spells: [],
    };

    const startingGear = [...(cls.gear.split(', ')), ...(background.gear.split(', '))];
    startingGear.forEach(gearName => {
        const item = ITEMS_DB.find(i => i.name === gearName.trim());
        if(item) {
            initialPlayer.inventory.push(item);
        } else {
            initialPlayer.inventory.push({ name: gearName, type: "gear", weight: 1, value: 10 } as Item)
        }
    });

    if (cls.spells) {
        initialPlayer.spells = cls.spells
            .map(spellId => SPELLS_DB.find(s => s.id === spellId))
            .filter((s): s is Spell => s !== undefined);
    }

    initialPlayer.ac = calculatePlayerAC(initialPlayer);
    
    // Determine starting location based on class, then race, then default
    const startingTown = cls.startingLocation || race.startingLocation || "Oakhaven";
    
    const initialWorld: World = { day: 1, hour: 8, weather: "Clear", facts: [`Arrived at ${startingTown}`], eventLog: [] };
    // FIX: Add 'as const' to the 'type' property to prevent type widening to 'string'.
    const startLog: LogEntry[] = [{ type: 'narration' as const, text: `Welcome, ${data.name}. You stand at the gates of ${startingTown}.` }];
    const startChoices: Choice[] = [{ id: 'enter', label: 'Enter Town', intent: 'travel' }];
    
    return { player: initialPlayer, world: initialWorld, log: startLog, choices: startChoices };
};

export const createDefaultCharacter = () => {
    const defaultName = "Aella Stonehand";
    const defaultRace = "Human";
    const defaultClass = "Fighter";
    const defaultBackground = "Soldier";
    const defaultConcept = "A valiant warrior seeking to defend the innocent.";
    const defaultPersonality = {
        traits: "Brave, honorable, and fiercely loyal.",
        ideals: "Justice and protection for all.",
        bonds: "My blade is sworn to a just cause.",
        flaws: "Impulsive and quick to anger."
    };

    const defaultStats = assignDefaultStats(defaultRace, defaultClass);

    const defaultPlayerData: Player = {
        name: defaultName,
        race: defaultRace,
        class: defaultClass,
        background: defaultBackground,
        concept: defaultConcept,
        personality: defaultPersonality,
        stats: defaultStats,
        level: 1,
        xp: 0,
        currency: 1000,
        inventory: [],
        equipment: {},
        spells: [],
        quests: [],
        factions: {},
        knownNPCs: [],
        // FIX: Added missing 'achievements' property to satisfy Player interface.
        achievements: [],
        exhaustion: 0,
        hungerDays: 0,
        thirstDays: 0,
        feats: ['tough'],
        hpMax: 0, hpCurrent: 0, manaMax: 0, manaCurrent: 0, staminaMax: 0, staminaCurrent: 0, ac: 0, // These will be calculated by createCharacter
        proficiencies: { skills: [...(BACKGROUNDS[defaultBackground]?.skills || []), ...(CLASSES[defaultClass]?.skills || [])], savingThrows: CLASSES[defaultClass]?.savingThrows || [] },
        // FIX: Added missing 'statusEffects' property to satisfy Player interface.
        statusEffects: [],
    };

    return createCharacter(defaultPlayerData);
};

const rollHitDie = (hd: number): number => {
    return Math.floor(Math.random() * hd) + 1;
}

export const handleLevelUp = (player: Player): { player: Player, messages: string[] } => {
    const nextPlayer = { ...player };
    const messages: string[] = [];
    
    const xpRequired = calculateXpToNextLevel(nextPlayer.level);
    nextPlayer.xp = Math.max(0, nextPlayer.xp - xpRequired);
    nextPlayer.level += 1;

    const classData = CLASSES[nextPlayer.class];
    const conMod = getMod(nextPlayer.stats.con);
    let hpGain = rollHitDie(classData.hd) + conMod;

    if (nextPlayer.feats?.includes('tough')) {
        hpGain += 2;
    }
    
    nextPlayer.hpMax += Math.max(1, hpGain);
    
    nextPlayer.hpCurrent = nextPlayer.hpMax;
    nextPlayer.manaCurrent = nextPlayer.manaMax;
    nextPlayer.staminaCurrent = nextPlayer.staminaMax;

    messages.push(`LEVEL UP! You are now Level ${nextPlayer.level}! You feel stronger. (HP +${hpGain})`);

    return { player: nextPlayer, messages };
};