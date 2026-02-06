/**
 * Game Engine "Brain"
 *
 * Centralized module that computes the full mechanical state of a character
 * from raw Player data. This is the single source of truth for:
 * - Effective stats (base + equipment + status effects)
 * - AC (with armor type / DEX cap rules)
 * - Attack rolls and damage
 * - Feat effects on mechanics
 * - Condition penalties (exhaustion, encumbrance)
 * - Skill check bonuses
 * - Available actions based on current state
 *
 * The AI prompt and all game logic should read from the GameState snapshot
 * rather than computing things ad-hoc.
 */

import { Player, PlayerStats, Item, Enemy, StatusEffect } from '../types';
import { getMod, calculateEncumbrance, calculateMaxCarry, getProficiencyBonus, parseDamageRoll, getSpellcastingAbility } from './calculations';
import { ALL_SKILLS } from './constants';
import { FEATS_DB } from '../registries/feats';

// --- Types ---

export interface FeatEffect {
    id: string;
    name: string;
    mechanical: string; // human-readable summary for the AI
}

export interface WeaponInfo {
    name: string;
    damageRoll: string;
    damageBonus: number; // ability mod + magic + feat bonuses
    totalAvgDamage: number;
    isTwoHanded: boolean;
    slot: string;
}

export interface ArmorInfo {
    name: string;
    baseAC: number;
    type: 'light' | 'medium' | 'heavy' | 'shield' | 'unarmored';
}

export interface ConditionSummary {
    exhaustionLevel: number;
    exhaustionPenalties: string[];
    isStarving: boolean;
    isDehydrated: boolean;
    isEncumbered: boolean;
    activeEffects: { name: string; duration: string; mechanical: string }[];
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    disabledActions: string[];
}

export interface CombatStats {
    attackBonus: number;
    damageRoll: string;
    damageBonus: number;
    ac: number;
    initiative: number;
    savingThrows: { [key: string]: number };
    spellSaveDC: number;
    spellAttackBonus: number;
}

export interface SkillBonus {
    skill: string;
    stat: keyof PlayerStats;
    bonus: number;
    proficient: boolean;
    hasFeatBonus: boolean;
}

export interface GameSnapshot {
    // Identity
    name: string;
    race: string;
    class: string;
    level: number;
    background: string;

    // Effective stats (base + gear + effects)
    effectiveStats: PlayerStats;
    baseStats: PlayerStats;

    // Resources
    hp: { current: number; max: number };
    mana: { current: number; max: number };
    stamina: { current: number; max: number };
    xp: number;
    currency: number;

    // Combat
    combat: CombatStats;
    weapon: WeaponInfo | null;
    offhand: WeaponInfo | null;

    // Conditions
    conditions: ConditionSummary;

    // Proficiency
    proficiencyBonus: number;
    skills: SkillBonus[];
    proficientSavingThrows: string[];

    // Equipment summary
    equippedGear: { slot: string; name: string; properties: string }[];

    // Active feats with mechanical effects
    activeFeats: FeatEffect[];

    // Inventory summary
    inventorySummary: string;
    carryWeight: { current: number; max: number };

    // Quests & social
    activeQuests: string[];
    knownNPCNames: string[];
    factionStandings: { faction: string; reputation: number }[];

    // Spells
    spells: { name: string; school: string; cost: number; damage: number; heal: number; target: string; description: string }[];

    // Personality (for GM consistency)
    personality: Player['personality'];
    concept: string;

    // Combat record
    killCount: number;
    totalDamageDealt: number;
}

// --- Exhaustion Penalties (D&D 5E) ---

const EXHAUSTION_PENALTIES: string[][] = [
    [], // Level 0: none
    ['Disadvantage on ability checks'], // Level 1
    ['Speed halved'], // Level 2
    ['Disadvantage on attack rolls and saving throws'], // Level 3
    ['HP maximum halved'], // Level 4
    ['Speed reduced to 0'], // Level 5
    ['Death'], // Level 6
];

// --- Feat Mechanical Effects ---

function getActiveFeatEffects(player: Player): FeatEffect[] {
    const effects: FeatEffect[] = [];
    const feats = player.feats || [];

    for (const featId of feats) {
        const feat = FEATS_DB.find(f => f.id === featId);
        if (!feat) continue;

        switch (featId) {
            case 'alert':
                effects.push({ id: featId, name: feat.name, mechanical: '+5 to initiative. Cannot be surprised while conscious.' });
                break;
            case 'tough':
                effects.push({ id: featId, name: feat.name, mechanical: `+${player.level * 2} max HP (already applied).` });
                break;
            case 'great_weapon_master':
                effects.push({ id: featId, name: feat.name, mechanical: 'Can choose -5 attack / +10 damage with heavy weapons. Bonus action attack on crit or kill.' });
                break;
            case 'sharpshooter':
                effects.push({ id: featId, name: feat.name, mechanical: 'Can choose -5 attack / +10 damage with ranged. No disadvantage at long range. Ignores half/three-quarters cover.' });
                break;
            case 'sentinel':
                effects.push({ id: featId, name: feat.name, mechanical: 'Opportunity attacks reduce speed to 0. Can attack creatures that disengage. Reaction attack when ally is attacked.' });
                break;
            case 'mobile':
                effects.push({ id: featId, name: feat.name, mechanical: '+10 speed. No opportunity attacks from creatures you melee. Difficult terrain ignored when Dashing.' });
                break;
            case 'war_caster':
                effects.push({ id: featId, name: feat.name, mechanical: 'Advantage on concentration saves. Can cast spells with hands full. Can cast spell as opportunity attack.' });
                break;
            case 'lucky':
                effects.push({ id: featId, name: feat.name, mechanical: '3 luck points per long rest. Spend to reroll any d20 (attack, check, save, or force enemy reroll).' });
                break;
            case 'defensive_duelist':
                effects.push({ id: featId, name: feat.name, mechanical: `Reaction: +${getProficiencyBonus(player.level)} AC vs one melee attack (requires finesse weapon).` });
                break;
            case 'dual_wielder':
                effects.push({ id: featId, name: feat.name, mechanical: '+1 AC when dual wielding. Can use non-light weapons for two-weapon fighting.' });
                break;
            case 'shield_master':
                effects.push({ id: featId, name: feat.name, mechanical: 'Bonus action shove with shield. Add shield AC to DEX saves vs single-target effects.' });
                break;
            case 'savage_attacker':
                effects.push({ id: featId, name: feat.name, mechanical: 'Once per turn, reroll weapon damage dice and use either result.' });
                break;
            case 'polearm_master':
                effects.push({ id: featId, name: feat.name, mechanical: 'Bonus action 1d4 attack with polearm butt end. Opportunity attack when enemy enters reach.' });
                break;
            case 'crossbow_expert':
                effects.push({ id: featId, name: feat.name, mechanical: 'Ignore loading. No disadvantage at melee range. Bonus action hand crossbow attack after one-handed attack.' });
                break;
            case 'mage_slayer':
                effects.push({ id: featId, name: feat.name, mechanical: 'Reaction attack when adjacent creature casts spell. Disadvantage on their concentration. Advantage on saves vs spells cast within 5ft.' });
                break;
            case 'heavy_armor_master':
                effects.push({ id: featId, name: feat.name, mechanical: 'Reduce nonmagical bludgeoning/piercing/slashing damage by 3.' });
                break;
            case 'observant':
                effects.push({ id: featId, name: feat.name, mechanical: '+5 to passive Perception and Investigation. Can read lips.' });
                break;
            case 'skulker':
                effects.push({ id: featId, name: feat.name, mechanical: 'Can hide in lightly obscured areas. Ranged attack misses don\'t reveal position. No disadvantage on Perception in dim light.' });
                break;
            case 'healer':
                effects.push({ id: featId, name: feat.name, mechanical: 'Stabilize grants 1 HP. Use healer\'s kit: restore 1d6+4+max HD HP (once per creature per rest).' });
                break;
            case 'inspiring_leader':
                effects.push({ id: featId, name: feat.name, mechanical: `Grant ${player.level + getMod(player.stats.cha)} temp HP to up to 6 allies after 10-min speech.` });
                break;
            case 'resilient':
                effects.push({ id: featId, name: feat.name, mechanical: '+1 to one ability score. Proficiency in that ability\'s saving throws.' });
                break;
            case 'elven_accuracy':
                effects.push({ id: featId, name: feat.name, mechanical: 'When you have advantage on attack using DEX/INT/WIS/CHA, reroll one die.' });
                break;
            case 'orcish_fury':
                effects.push({ id: featId, name: feat.name, mechanical: 'Once per rest: extra weapon damage die on hit. When Relentless Endurance triggers, bonus action attack.' });
                break;
            case 'dragon_fear':
                effects.push({ id: featId, name: feat.name, mechanical: 'Breath Weapon can instead cause Frightened (WIS save DC 8 + proficiency + CHA mod).' });
                break;
            case 'dragon_hide':
                effects.push({ id: featId, name: feat.name, mechanical: 'Unarmored AC = 13 + DEX mod. Retractable claws: 1d4 slashing.' });
                break;
            case 'dwarven_fortitude':
                effects.push({ id: featId, name: feat.name, mechanical: 'When you Dodge, spend one Hit Die to heal.' });
                break;
            case 'original_spell_creator': {
                const hasFullPower = player.stats.int >= 100 || player.stats.wis >= 100;
                const desc = hasFullPower
                    ? 'FULL POWER UNLOCKED: Can create, teach, and learn original spells with no restrictions. Created spells cost 25% less mana. Can invent legendary-tier spells.'
                    : 'Can attempt to create original spells (describe desired effect to GM). Created spells cost 25% less mana. Reach 100+ INT or WIS to unlock full spell creation mastery.';
                effects.push({ id: featId, name: feat.name, mechanical: desc });
                break;
            }
            default:
                effects.push({ id: featId, name: feat.name, mechanical: feat.desc });
                break;
        }
    }
    return effects;
}

// --- Effective Stats ---

function computeEffectiveStats(player: Player): PlayerStats {
    const stats = { ...player.stats };

    // Equipment stat bonuses
    for (const slot of Object.keys(player.equipment)) {
        const item = player.equipment[slot];
        if (item?.statsBonus) {
            for (const [stat, bonus] of Object.entries(item.statsBonus)) {
                if (stat in stats) {
                    stats[stat as keyof PlayerStats] += bonus as number;
                }
            }
        }
    }

    // Status effect stat bonuses
    for (const effect of player.statusEffects) {
        for (const stat of ['str', 'dex', 'con', 'int', 'wis', 'cha'] as (keyof PlayerStats)[]) {
            if (effect.effect[stat]) {
                stats[stat] += effect.effect[stat] as number;
            }
        }
    }

    return stats;
}

// --- AC Calculation (proper D&D rules) ---

function computeAC(player: Player, effectiveStats: PlayerStats): number {
    const dexMod = getMod(effectiveStats.dex);
    const equipment = player.equipment;
    let baseAC = 10 + dexMod; // Unarmored default
    let shieldBonus = 0;

    // Check for dragon_hide feat (unarmored AC = 13 + DEX)
    if (player.feats.includes('dragon_hide') && !equipment.armor) {
        baseAC = 13 + dexMod;
    }

    // Armor
    if (equipment.armor?.ac) {
        const armorAC = equipment.armor.ac;
        const armorType = equipment.armor.type?.toLowerCase() || '';

        if (armorType.includes('heavy') || armorAC >= 16) {
            // Heavy armor: no DEX bonus
            baseAC = armorAC;
        } else if (armorType.includes('medium') || (armorAC >= 13 && armorAC < 16)) {
            // Medium armor: DEX capped at +2 (or +3 with medium_armor_master)
            const dexCap = player.feats.includes('medium_armor_master') ? 3 : 2;
            baseAC = armorAC + Math.min(dexMod, dexCap);
        } else {
            // Light armor: full DEX
            baseAC = armorAC + dexMod;
        }
    }

    // Shield
    if (equipment.offHand?.ac) {
        shieldBonus = equipment.offHand.ac;
    }

    // Dual wielder feat: +1 AC when wielding two weapons
    if (player.feats.includes('dual_wielder') && equipment.mainHand && equipment.offHand && !equipment.offHand.ac) {
        shieldBonus += 1;
    }

    // Status effect AC modifiers
    let acMod = 0;
    for (const effect of player.statusEffects) {
        if (effect.effect.acModifier) {
            acMod += effect.effect.acModifier;
        }
    }

    return baseAC + shieldBonus + acMod;
}

// --- Weapon Info ---

function getWeaponInfo(player: Player, effectiveStats: PlayerStats, slot: 'mainHand' | 'offHand'): WeaponInfo | null {
    const weapon = player.equipment[slot];
    if (!weapon || !weapon.damageRoll) return null;

    // Determine ability mod for damage
    const isFinesse = weapon.type?.toLowerCase().includes('finesse');
    const isRanged = weapon.type?.toLowerCase().includes('ranged') || weapon.type?.toLowerCase().includes('bow');
    let abilityMod: number;

    if (isRanged) {
        abilityMod = getMod(effectiveStats.dex);
    } else if (isFinesse) {
        abilityMod = Math.max(getMod(effectiveStats.str), getMod(effectiveStats.dex));
    } else {
        abilityMod = getMod(effectiveStats.str);
    }

    // Status effect damage modifiers
    let damageBonus = abilityMod;
    for (const effect of player.statusEffects) {
        if (effect.effect.damageModifier) {
            damageBonus += effect.effect.damageModifier;
        }
    }

    // Heavy armor master damage reduction is on the receiving end, not here

    const avgRoll = estimateAvgDamage(weapon.damageRoll);

    return {
        name: weapon.name,
        damageRoll: weapon.damageRoll,
        damageBonus,
        totalAvgDamage: avgRoll + damageBonus,
        isTwoHanded: !!weapon.twoHanded,
        slot,
    };
}

function estimateAvgDamage(roll: string): number {
    const match = roll.match(/(\d+)d(\d+)/);
    if (!match) return parseInt(roll) || 0;
    const [, count, sides] = match;
    const bonus = roll.includes('+') ? parseInt(roll.split('+')[1]) || 0 : 0;
    return (parseInt(count) * (parseInt(sides) + 1)) / 2 + bonus;
}

// --- Conditions ---

function computeConditions(player: Player): ConditionSummary {
    const exLevel = Math.min(player.exhaustion, 6);
    const penalties: string[] = [];
    for (let i = 1; i <= exLevel; i++) {
        penalties.push(...EXHAUSTION_PENALTIES[i]);
    }

    const resistances: string[] = [];
    const vulnerabilities: string[] = [];
    const immunities: string[] = [];
    const disabledActions: string[] = [];

    const activeEffects = player.statusEffects.map(e => {
        if (e.effect.resistances) resistances.push(...e.effect.resistances);
        if (e.effect.vulnerabilities) vulnerabilities.push(...e.effect.vulnerabilities);
        if (e.effect.disableAction) disabledActions.push(e.effect.disableAction);
        return {
            name: e.name,
            duration: e.duration === 'permanent' ? 'Permanent' : `${e.duration} turns`,
            mechanical: e.description,
        };
    });

    return {
        exhaustionLevel: exLevel,
        exhaustionPenalties: penalties,
        isStarving: player.hungerDays > 3,
        isDehydrated: player.thirstDays > 0,
        isEncumbered: calculateEncumbrance(player.inventory) > calculateMaxCarry(player.stats.str),
        activeEffects,
        immunities,
        resistances: [...new Set(resistances)],
        vulnerabilities: [...new Set(vulnerabilities)],
        disabledActions,
    };
}

// --- Skill Bonuses ---

function computeSkills(player: Player, effectiveStats: PlayerStats): SkillBonus[] {
    const profBonus = getProficiencyBonus(player.level);
    const skills: SkillBonus[] = [];

    for (const [skill, stat] of Object.entries(ALL_SKILLS)) {
        const proficient = player.proficiencies.skills.includes(skill);
        let bonus = getMod(effectiveStats[stat as keyof PlayerStats]);
        if (proficient) bonus += profBonus;

        // Observant feat: +5 passive Perception/Investigation
        const hasFeatBonus = (skill === 'Perception' || skill === 'Investigation') && player.feats.includes('observant');

        skills.push({ skill, stat: stat as keyof PlayerStats, bonus, proficient, hasFeatBonus });
    }

    return skills;
}

// --- Combat Stats ---

function computeCombatStats(player: Player, effectiveStats: PlayerStats, weapon: WeaponInfo | null): CombatStats {
    const profBonus = getProficiencyBonus(player.level);
    const strMod = getMod(effectiveStats.str);
    const dexMod = getMod(effectiveStats.dex);

    // Attack bonus: proficiency + ability mod
    const isRanged = weapon?.name.toLowerCase().includes('bow') || weapon?.name.toLowerCase().includes('crossbow');
    const attackAbilityMod = isRanged ? dexMod : strMod;
    let attackBonus = profBonus + attackAbilityMod;

    // Alert feat: +5 initiative
    let initiative = dexMod;
    if (player.feats.includes('alert')) initiative += 5;

    // Saving throws
    const savingThrows: { [key: string]: number } = {};
    for (const stat of ['str', 'dex', 'con', 'int', 'wis', 'cha']) {
        const mod = getMod(effectiveStats[stat as keyof PlayerStats]);
        const proficient = player.proficiencies.savingThrows.includes(stat);
        savingThrows[stat] = mod + (proficient ? profBonus : 0);
    }

    // Spellcasting
    const spellStat = getSpellcastingAbility(player.class);
    const spellMod = getMod(effectiveStats[spellStat]);
    const spellSaveDC = 8 + profBonus + spellMod;
    const spellAttackBonus = profBonus + spellMod;

    return {
        attackBonus,
        damageRoll: weapon?.damageRoll || '1d4',
        damageBonus: weapon?.damageBonus || strMod,
        ac: computeAC(player, effectiveStats),
        initiative,
        savingThrows,
        spellSaveDC,
        spellAttackBonus,
    };
}

// ============================================================
// PUBLIC API: Compute full game snapshot
// ============================================================

export function computeGameSnapshot(player: Player): GameSnapshot {
    const effectiveStats = computeEffectiveStats(player);
    const weapon = getWeaponInfo(player, effectiveStats, 'mainHand');
    const offhand = getWeaponInfo(player, effectiveStats, 'offHand');
    const combat = computeCombatStats(player, effectiveStats, weapon);
    const conditions = computeConditions(player);
    const skills = computeSkills(player, effectiveStats);
    const activeFeats = getActiveFeatEffects(player);
    const carryWeight = calculateEncumbrance(player.inventory);
    const maxCarry = calculateMaxCarry(effectiveStats.str);

    // Equipped gear summary
    const equippedGear = Object.entries(player.equipment)
        .filter(([, item]) => item)
        .map(([slot, item]) => ({
            slot,
            name: item.name,
            properties: [
                item.damageRoll && `Dmg: ${item.damageRoll}`,
                item.ac && `AC: +${item.ac}`,
                item.twoHanded && 'Two-handed',
                item.statsBonus && Object.entries(item.statsBonus).map(([s, b]) => `+${b} ${s.toUpperCase()}`).join(', '),
            ].filter(Boolean).join(', ') || item.type || '',
        }));

    // Inventory summary (grouped)
    const invGroups: { [type: string]: string[] } = {};
    for (const item of player.inventory) {
        const t = item.type || 'misc';
        if (!invGroups[t]) invGroups[t] = [];
        invGroups[t].push(item.name);
    }
    const inventorySummary = Object.entries(invGroups)
        .map(([type, items]) => `${type}: ${items.join(', ')}`)
        .join('. ') || 'Empty';

    return {
        name: player.name,
        race: player.race,
        class: player.class,
        level: player.level,
        background: player.background,
        effectiveStats,
        baseStats: { ...player.stats },
        hp: { current: player.hpCurrent, max: player.hpMax },
        mana: { current: player.manaCurrent, max: player.manaMax },
        stamina: { current: player.staminaCurrent, max: player.staminaMax },
        xp: player.xp,
        currency: player.currency,
        combat,
        weapon,
        offhand,
        conditions,
        proficiencyBonus: getProficiencyBonus(player.level),
        skills,
        proficientSavingThrows: player.proficiencies.savingThrows,
        equippedGear,
        activeFeats,
        inventorySummary,
        carryWeight: { current: carryWeight, max: maxCarry },
        activeQuests: player.quests?.filter(q => q.status === 'active').map(q => q.title) || [],
        knownNPCNames: player.knownNPCs?.map(n => n.name) || [],
        factionStandings: Object.entries(player.factions || {}).map(([f, r]) => ({ faction: f, reputation: r })),
        spells: (player.spells || []).map(s => ({
            name: s.name,
            school: s.school || 'evocation',
            cost: s.cost || 0,
            damage: s.damage || 0,
            heal: s.heal || 0,
            target: s.target || 'enemy',
            description: s.description || '',
        })),
        personality: player.personality,
        concept: player.concept,
        killCount: player.killCount || 0,
        totalDamageDealt: player.totalDamageDealt || 0,
    };
}

// ============================================================
// Resolve player damage (with feat/effect integration)
// ============================================================

export function resolvePlayerAttack(player: Player, enemy: Enemy): { damage: number; details: string } {
    const effectiveStats = computeEffectiveStats(player);
    const weapon = player.equipment.mainHand;
    const roll = weapon?.damageRoll || '1d4';
    let baseDamage = parseDamageRoll(roll);

    // Ability modifier
    const isRanged = weapon?.type?.toLowerCase().includes('ranged') || weapon?.type?.toLowerCase().includes('bow');
    const abilityMod = isRanged ? getMod(effectiveStats.dex) : getMod(effectiveStats.str);
    baseDamage += abilityMod;

    // Effect bonuses (item effects)
    if (weapon?.effect) {
        for (const val of Object.values(weapon.effect)) {
            if (typeof val === 'number') baseDamage += val;
        }
    }

    // Status effect damage modifiers
    for (const effect of player.statusEffects) {
        if (effect.effect.damageModifier) baseDamage += effect.effect.damageModifier;
    }

    // Savage attacker: reroll and take higher (simulate by adding ~1-2)
    if (player.feats.includes('savage_attacker')) {
        const reroll = parseDamageRoll(roll);
        if (reroll > baseDamage - abilityMod) {
            baseDamage = reroll + abilityMod;
        }
    }

    // Great Weapon Master: +10 damage with heavy/two-handed weapons
    if (player.feats.includes('great_weapon_master') && weapon) {
        const wType = (weapon.type || '').toLowerCase();
        const wName = (weapon.name || '').toLowerCase();
        if (wType.includes('heavy') || wType.includes('two-handed') || wName.includes('great') || wName.includes('maul') || wName.includes('halberd') || wName.includes('pike')) {
            baseDamage += 10;
        }
    }

    // Sharpshooter: +10 damage with ranged weapons
    if (player.feats.includes('sharpshooter') && isRanged) {
        baseDamage += 10;
    }

    // Exhaustion level 3+: disadvantage on attacks (reduce by ~25%)
    if (player.exhaustion >= 3) {
        baseDamage = Math.max(1, Math.floor(baseDamage * 0.75));
    }

    const damage = Math.max(1, baseDamage);
    const weaponName = weapon?.name || 'unarmed strike';
    return { damage, details: `${weaponName} for ${damage} damage` };
}

export function resolveEnemyDamage(player: Player, enemy: Enemy): { damage: number; details: string } {
    let damage = parseDamageRoll(enemy.damageRoll);

    // Heavy armor master: -3 nonmagical damage
    if (player.feats.includes('heavy_armor_master')) {
        damage = Math.max(0, damage - 3);
    }

    // Status effect resistances would apply here in a more complex system

    return { damage: Math.max(0, damage), details: `${enemy.name} deals ${damage} damage` };
}

// ============================================================
// Feat prerequisite checking
// ============================================================

export interface FeatPrerequisite {
    id: string;
    name: string;
    desc: string;
    req: string;
    eligible: boolean;
    reason?: string; // why ineligible
}

export function getEligibleFeats(race: string, className: string, background: string, stats: PlayerStats, feats: string[]): FeatPrerequisite[] {
    const raceLower = race.toLowerCase();
    const hasSpellcasting = ['Wizard', 'Sorcerer', 'Warlock', 'Cleric', 'Druid', 'Bard', 'Ranger', 'Paladin', 'Artificer'].includes(className);

    return FEATS_DB.map(feat => {
        // Skip already taken feats
        if (feats.includes(feat.id)) {
            return { ...feat, eligible: false, reason: 'Already taken' };
        }

        const req = feat.req.toLowerCase();

        // "None" or empty — universally available
        if (req === 'none' || req === '') {
            return { ...feat, eligible: true };
        }

        // Stat requirements (e.g., "Dex 13+", "Str 13+", "Int 100+ or Wis 100+")
        const statMatches = [...req.matchAll(/(str|dex|con|int|wis|cha)\s*(\d+)\+?/gi)];
        if (statMatches.length > 0) {
            const isOrRequirement = req.includes(' or ');
            if (isOrRequirement) {
                // OR: at least one stat must meet the threshold
                const anyMet = statMatches.some(m => {
                    const stat = m[1].toLowerCase() as keyof PlayerStats;
                    const minVal = parseInt(m[2]);
                    return stats[stat] >= minVal;
                });
                if (!anyMet) {
                    const reqStr = statMatches.map(m => `${m[1].toUpperCase()} ${m[2]}+`).join(' or ');
                    return { ...feat, eligible: false, reason: `Requires ${reqStr}` };
                }
            } else {
                // AND: all stat requirements must be met
                for (const m of statMatches) {
                    const stat = m[1].toLowerCase() as keyof PlayerStats;
                    const minVal = parseInt(m[2]);
                    if (stats[stat] < minVal) {
                        return { ...feat, eligible: false, reason: `Requires ${stat.toUpperCase()} ${minVal}+` };
                    }
                }
            }
        }

        // Spellcasting requirement
        if (req.includes('ability to cast') || req.includes('spellcasting')) {
            if (!hasSpellcasting) {
                return { ...feat, eligible: false, reason: 'Requires spellcasting ability' };
            }
        }

        // Race requirements
        const raceChecks: { [key: string]: string[] } = {
            'elf': ['elf', 'half-elf', 'eladrin', 'shadar-kai', 'sea elf', 'astral elf'],
            'half-elf': ['half-elf'],
            'half-orc': ['half-orc', 'orc'],
            'dwarf': ['dwarf', 'duergar'],
            'halfling': ['halfling'],
            'gnome': ['gnome', 'deep gnome'],
            'dragonborn': ['dragonborn'],
            'tiefling': ['tiefling'],
            'human': ['human'],
        };

        // Check if feat has race restriction
        let hasRaceReq = false;
        let raceEligible = false;
        for (const [raceKey, aliases] of Object.entries(raceChecks)) {
            if (req.includes(raceKey)) {
                hasRaceReq = true;
                if (aliases.some(a => raceLower.includes(a))) {
                    raceEligible = true;
                }
            }
        }

        if (hasRaceReq && !raceEligible) {
            return { ...feat, eligible: false, reason: `Race restriction: ${feat.req}` };
        }

        // Armor proficiency requirements
        if (req.includes('heavy armor proficiency')) {
            const heavyArmorClasses = ['fighter', 'paladin', 'cleric'];
            if (!heavyArmorClasses.includes(className.toLowerCase())) {
                return { ...feat, eligible: false, reason: 'Requires Heavy Armor Proficiency' };
            }
        }
        if (req.includes('medium armor proficiency')) {
            const medArmorClasses = ['fighter', 'paladin', 'cleric', 'ranger', 'barbarian', 'druid', 'artificer'];
            if (!medArmorClasses.includes(className.toLowerCase())) {
                return { ...feat, eligible: false, reason: 'Requires Medium Armor Proficiency' };
            }
        }

        return { ...feat, eligible: true };
    });
}

// ============================================================
// Format snapshot for AI prompt injection
// ============================================================

export function formatSnapshotForPrompt(snap: GameSnapshot): string {
    const lines: string[] = [];

    lines.push(`=== CHARACTER STATE ===`);
    lines.push(`${snap.name} | ${snap.race} ${snap.class} | Level ${snap.level} | Background: ${snap.background}`);
    lines.push(`Concept: ${snap.concept}`);
    lines.push(`Personality: Traits: ${snap.personality.traits} | Ideals: ${snap.personality.ideals} | Bonds: ${snap.personality.bonds} | Flaws: ${snap.personality.flaws}`);
    lines.push('');

    lines.push(`=== RESOURCES ===`);
    lines.push(`HP: ${snap.hp.current}/${snap.hp.max} | Mana: ${snap.mana.current}/${snap.mana.max} | Stamina: ${snap.stamina.current}/${snap.stamina.max}`);
    lines.push(`Gold: ${snap.currency} | XP: ${snap.xp} | Proficiency: +${snap.proficiencyBonus}`);
    lines.push('');

    lines.push(`=== COMBAT STATS ===`);
    lines.push(`AC: ${snap.combat.ac} | Attack Bonus: +${snap.combat.attackBonus} | Damage: ${snap.combat.damageRoll}+${snap.combat.damageBonus}`);
    lines.push(`Initiative: +${snap.combat.initiative} | Spell DC: ${snap.combat.spellSaveDC} | Spell Attack: +${snap.combat.spellAttackBonus}`);
    lines.push(`Saves: ${Object.entries(snap.combat.savingThrows).map(([s, v]) => `${s.toUpperCase()}: ${v >= 0 ? '+' : ''}${v}${snap.proficientSavingThrows.includes(s) ? '(P)' : ''}`).join(' | ')}`);
    lines.push('');

    lines.push(`=== EFFECTIVE STATS ===`);
    lines.push(Object.entries(snap.effectiveStats).map(([s, v]) => `${s.toUpperCase()}: ${v} (${getMod(v) >= 0 ? '+' : ''}${getMod(v)})`).join(' | '));
    lines.push('');

    if (snap.equippedGear.length > 0) {
        lines.push(`=== EQUIPPED GEAR ===`);
        for (const g of snap.equippedGear) {
            lines.push(`[${g.slot}] ${g.name}${g.properties ? ` (${g.properties})` : ''}`);
        }
        lines.push('');
    }

    if (snap.activeFeats.length > 0) {
        lines.push(`=== ACTIVE FEATS ===`);
        for (const f of snap.activeFeats) {
            lines.push(`- ${f.name}: ${f.mechanical}`);
        }
        lines.push('');
    }

    if (snap.conditions.exhaustionLevel > 0 || snap.conditions.activeEffects.length > 0 || snap.conditions.isStarving || snap.conditions.isDehydrated || snap.conditions.isEncumbered) {
        lines.push(`=== CONDITIONS ===`);
        if (snap.conditions.exhaustionLevel > 0) lines.push(`Exhaustion Level ${snap.conditions.exhaustionLevel}: ${snap.conditions.exhaustionPenalties.join(', ')}`);
        if (snap.conditions.isStarving) lines.push(`STARVING (no food for days)`);
        if (snap.conditions.isDehydrated) lines.push(`DEHYDRATED (no water)`);
        if (snap.conditions.isEncumbered) lines.push(`ENCUMBERED (carrying ${snap.carryWeight.current.toFixed(1)}/${snap.carryWeight.max} lbs)`);
        if (snap.conditions.resistances.length > 0) lines.push(`Resistances: ${snap.conditions.resistances.join(', ')}`);
        if (snap.conditions.vulnerabilities.length > 0) lines.push(`Vulnerabilities: ${snap.conditions.vulnerabilities.join(', ')}`);
        if (snap.conditions.disabledActions.length > 0) lines.push(`DISABLED: ${snap.conditions.disabledActions.join(', ')}`);
        for (const e of snap.conditions.activeEffects) {
            lines.push(`- ${e.name} (${e.duration}): ${e.mechanical}`);
        }
        lines.push('');
    }

    if (snap.spells && snap.spells.length > 0) {
        lines.push(`=== KNOWN SPELLS ===`);
        lines.push(`The player knows ONLY these spells. Do NOT offer choices to cast spells not in this list.`);
        for (const sp of snap.spells) {
            lines.push(`- ${sp.name} (${sp.school}, ${sp.cost} MP, ${sp.target}): ${sp.description || `${sp.damage ? `${sp.damage} dmg` : ''}${sp.heal ? `${sp.heal} heal` : ''}`}`);
        }
        lines.push('');
    } else {
        lines.push(`=== SPELLS: NONE ===`);
        lines.push(`This character knows NO spells. Do NOT offer choices involving spellcasting.`);
        lines.push('');
    }

    lines.push(`=== SKILLS ===`);
    lines.push(snap.skills.map(s => `${s.skill}: ${s.bonus >= 0 ? '+' : ''}${s.bonus}${s.proficient ? '(P)' : ''}${s.hasFeatBonus ? '(+5 passive)' : ''}`).join(' | '));
    lines.push('');

    lines.push(`=== INVENTORY (${snap.carryWeight.current.toFixed(1)}/${snap.carryWeight.max} lbs) ===`);
    lines.push(snap.inventorySummary);
    lines.push('');

    if (snap.activeQuests.length > 0) {
        lines.push(`=== ACTIVE QUESTS ===`);
        lines.push(snap.activeQuests.join(', '));
        lines.push('');
    }

    if (snap.factionStandings.length > 0) {
        lines.push(`=== FACTION STANDINGS ===`);
        lines.push(snap.factionStandings.map(f => `${f.faction}: ${f.reputation}`).join(', '));
        lines.push('');
    }

    // Combat stats summary
    if (snap.killCount > 0 || snap.totalDamageDealt > 0) {
        lines.push(`=== COMBAT RECORD ===`);
        lines.push(`Enemies Slain: ${snap.killCount} | Total Damage Dealt: ${snap.totalDamageDealt}`);
        lines.push('');
    }

    return lines.join('\n');
}
