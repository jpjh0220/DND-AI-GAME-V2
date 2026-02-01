import { StatusEffect } from '../types';

/**
 * Status Effects Registry
 *
 * Centralized definitions for all status conditions that can be applied
 * to players or enemies. Each effect has mechanical properties that
 * the engine reads to modify combat, stats, and available actions.
 */

export const STATUS_EFFECTS_DB: StatusEffect[] = [
    // === DEBUFFS: Damage Over Time ===
    { id: 'poisoned', name: "Poisoned", description: "Disadvantage on attack rolls and ability checks. Taking poison damage each turn.", duration: 5, effect: { hpPerTurn: -3, damageModifier: -2 } },
    { id: 'burning', name: "Burning", description: "Engulfed in flames, taking fire damage each turn.", duration: 3, effect: { hpPerTurn: -5 } },
    { id: 'bleeding', name: "Bleeding", description: "An open wound causes ongoing blood loss.", duration: 4, effect: { hpPerTurn: -2 } },
    { id: 'acid_splash', name: "Acid Burn", description: "Corrosive acid eats through armor and flesh.", duration: 3, effect: { hpPerTurn: -4, acModifier: -1 } },
    { id: 'necrotic_rot', name: "Necrotic Rot", description: "Dark energy saps your life force, reducing max HP recovery.", duration: 5, effect: { hpPerTurn: -3, con: -2 } },
    { id: 'frostbitten', name: "Frostbitten", description: "Extreme cold slows your movements and numbs your limbs.", duration: 4, effect: { hpPerTurn: -1, dex: -2, speedModifier: -10 } },

    // === DEBUFFS: Stat/Combat Penalties ===
    { id: 'frightened', name: "Frightened", description: "You are terrified and have disadvantage on ability checks and attack rolls while the source of fear is in sight.", duration: 3, effect: { damageModifier: -3, str: -2, cha: -2 } },
    { id: 'stunned', name: "Stunned", description: "You are incapacitated, can't move, and can speak only falteringly.", duration: 1, effect: { disableAction: 'attack', acModifier: -4 } },
    { id: 'paralyzed', name: "Paralyzed", description: "You are incapacitated and can't move or speak. Auto-crit within 5 feet.", duration: 2, effect: { disableAction: 'attack', acModifier: -5, speedModifier: -999 } },
    { id: 'blinded', name: "Blinded", description: "You can't see. Attacks against you have advantage, your attacks have disadvantage.", duration: 3, effect: { damageModifier: -4, acModifier: -3 } },
    { id: 'deafened', name: "Deafened", description: "You can't hear. Auto-fail any check requiring hearing.", duration: 3, effect: {} },
    { id: 'prone', name: "Prone", description: "You are lying on the ground. Melee attacks against you have advantage. Ranged attacks have disadvantage.", duration: 1, effect: { acModifier: -2 } },
    { id: 'restrained', name: "Restrained", description: "Your speed is 0 and attacks against you have advantage.", duration: 2, effect: { speedModifier: -999, acModifier: -2, damageModifier: -2 } },
    { id: 'charmed', name: "Charmed", description: "You can't attack the charmer and the charmer has advantage on social checks against you.", duration: 5, effect: { wis: -4 } },
    { id: 'confused', name: "Confused", description: "You act randomly — may attack allies, stand still, or move aimlessly.", duration: 3, effect: { int: -4, wis: -4, damageModifier: -3 } },
    { id: 'exhaustion_1', name: "Exhaustion (Tier 1)", description: "Disadvantage on ability checks.", duration: 'permanent', effect: {} },
    { id: 'silenced', name: "Silenced", description: "You cannot cast spells with verbal components.", duration: 3, effect: { disableAction: 'cast' } },
    { id: 'cursed', name: "Cursed", description: "A dark curse weakens your abilities. -1 to all stats.", duration: 'permanent', effect: { str: -1, dex: -1, con: -1, int: -1, wis: -1, cha: -1 } },
    { id: 'slowed', name: "Slowed", description: "Your movement speed is halved and you can't use reactions.", duration: 4, effect: { speedModifier: -15, dex: -2 } },
    { id: 'weakened', name: "Weakened", description: "Your physical strength is sapped.", duration: 5, effect: { str: -4, damageModifier: -3 } },
    { id: 'vulnerability_fire', name: "Fire Vulnerability", description: "You take double damage from fire.", duration: 5, effect: { vulnerabilities: ['fire'] } },
    { id: 'vulnerability_cold', name: "Cold Vulnerability", description: "You take double damage from cold.", duration: 5, effect: { vulnerabilities: ['cold'] } },

    // === BUFFS: Stat Boosts ===
    { id: 'blessed', name: "Blessed", description: "Divine favor grants +1d4 to attack rolls and saving throws.", duration: 10, effect: { damageModifier: 2, str: 1, dex: 1, con: 1 } },
    { id: 'inspired', name: "Inspired", description: "Bardic inspiration fills you with confidence and determination.", duration: 5, effect: { cha: 3, str: 1, damageModifier: 2 } },
    { id: 'haste', name: "Hasted", description: "Your speed is doubled, +2 AC, advantage on DEX saves, and one additional action.", duration: 10, effect: { dex: 4, acModifier: 2, speedModifier: 30 } },
    { id: 'enlarged', name: "Enlarged", description: "You grow larger, dealing an extra 1d4 damage and having advantage on STR checks.", duration: 10, effect: { str: 4, damageModifier: 3 } },
    { id: 'heroism', name: "Heroism", description: "You are immune to the frightened condition and gain temp HP each turn.", duration: 10, effect: { hpPerTurn: 3, str: 2 } },
    { id: 'shield_of_faith', name: "Shield of Faith", description: "A shimmering field surrounds you, granting +2 AC.", duration: 10, effect: { acModifier: 2 } },
    { id: 'barkskin', name: "Barkskin", description: "Your skin hardens to bark, giving a minimum AC of 16.", duration: 10, effect: { acModifier: 3, con: 2 } },
    { id: 'rage', name: "Rage", description: "Barbarian rage grants resistance to physical damage and bonus melee damage.", duration: 10, effect: { str: 2, damageModifier: 4, resistances: ['bludgeoning', 'piercing', 'slashing'] } },
    { id: 'divine_favor', name: "Divine Favor", description: "Your weapon strikes glow with radiant energy, dealing extra damage.", duration: 10, effect: { damageModifier: 3 } },
    { id: 'stoneskin', name: "Stoneskin", description: "Your flesh turns stone-hard, granting resistance to nonmagical physical damage.", duration: 'permanent', effect: { acModifier: 2, resistances: ['bludgeoning', 'piercing', 'slashing'] } },
    { id: 'mage_armor', name: "Mage Armor", description: "An invisible magical force field surrounds you. AC becomes 13 + DEX.", duration: 'permanent', effect: { acModifier: 3 } },
    { id: 'mirror_image', name: "Mirror Image", description: "Three illusory duplicates of yourself appear, causing attacks to miss.", duration: 10, effect: { acModifier: 3 } },

    // === BUFFS: Regeneration & Resource ===
    { id: 'regeneration', name: "Regenerating", description: "Your wounds knit together magically.", duration: 5, effect: { hpPerTurn: 5 } },
    { id: 'rejuvenation', name: "Rejuvenated", description: "Magical energy flows through you, restoring mana.", duration: 5, effect: { mpPerTurn: 3 } },
    { id: 'second_wind', name: "Second Wind", description: "A burst of stamina fills your muscles.", duration: 3, effect: { staminaPerTurn: 5 } },
    { id: 'well_rested', name: "Well Rested", description: "You are fully rested and alert, performing at peak efficiency.", duration: 'permanent', effect: { str: 1, dex: 1, con: 1 } },

    // === BUFFS: Resistance ===
    { id: 'fire_resistance', name: "Fire Resistance", description: "You have resistance to fire damage.", duration: 10, effect: { resistances: ['fire'] } },
    { id: 'cold_resistance', name: "Cold Resistance", description: "You have resistance to cold damage.", duration: 10, effect: { resistances: ['cold'] } },
    { id: 'lightning_resistance', name: "Lightning Resistance", description: "You have resistance to lightning damage.", duration: 10, effect: { resistances: ['lightning'] } },
    { id: 'poison_resistance', name: "Poison Resistance", description: "You have resistance to poison damage and advantage on saves vs poison.", duration: 10, effect: { resistances: ['poison'], con: 2 } },
    { id: 'necrotic_resistance', name: "Necrotic Resistance", description: "You have resistance to necrotic damage.", duration: 10, effect: { resistances: ['necrotic'] } },
    { id: 'psychic_resistance', name: "Psychic Resistance", description: "You have resistance to psychic damage.", duration: 10, effect: { resistances: ['psychic'] } },
    { id: 'protection_from_evil', name: "Protected from Evil", description: "Aberrations, celestials, elementals, fey, fiends, and undead have disadvantage on attacks against you.", duration: 10, effect: { acModifier: 2 } },

    // === ENVIRONMENTAL / EXPLORATION ===
    { id: 'waterbreathing', name: "Water Breathing", description: "You can breathe underwater.", duration: 'permanent', effect: {} },
    { id: 'darkvision_spell', name: "Darkvision (Magical)", description: "You can see in darkness out to 60 feet.", duration: 'permanent', effect: {} },
    { id: 'invisible', name: "Invisible", description: "You are invisible. Attacks against you have disadvantage; your attacks have advantage.", duration: 5, effect: { acModifier: 4, damageModifier: 3 } },
    { id: 'flying', name: "Flying", description: "You have a flying speed equal to your walking speed.", duration: 10, effect: { speedModifier: 10 } },
    { id: 'polymorphed', name: "Polymorphed", description: "You have been transformed into another creature.", duration: 'permanent', effect: {} },
    { id: 'petrified', name: "Petrified", description: "You are transformed to stone. Incapacitated, can't move, unaware of surroundings.", duration: 'permanent', effect: { disableAction: 'attack', speedModifier: -999, acModifier: 5 } },

    // === DISEASE / CURSE ===
    { id: 'lycanthropy', name: "Lycanthropy", description: "You are afflicted with lycanthropy. Under full moon, you may lose control.", duration: 'permanent', effect: { str: 3, con: 2, wis: -2 } },
    { id: 'mummy_rot', name: "Mummy Rot", description: "A terrible curse prevents all healing. HP max decreases each day.", duration: 'permanent', effect: { hpPerTurn: -2, con: -3 } },
    { id: 'sewer_plague', name: "Sewer Plague", description: "A bacterial infection causes exhaustion and cramps.", duration: 'permanent', effect: { str: -2, con: -2, staminaPerTurn: -2 } },
    { id: 'sight_rot', name: "Sight Rot", description: "A painful infection clouds your vision, eventually leading to blindness.", duration: 'permanent', effect: { dex: -2, wis: -2 } },
    { id: 'cackle_fever', name: "Cackle Fever", description: "Bouts of cackling fits exhaust you and make stealth impossible.", duration: 'permanent', effect: { cha: -3, staminaPerTurn: -1 } },
];
