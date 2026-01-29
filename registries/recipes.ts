import { Recipe } from '../types';

export const RECIPES_DB: Recipe[] = [
    {
        id: 'craft_pot_heal',
        name: "Craft Healing Potion",
        description: "Brew a basic healing potion to restore vitality.",
        materials: [
            { itemId: 'herb_healing', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_heal', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 10
    },
    {
        id: 'craft_ration',
        name: "Prepare Rations",
        description: "Assemble a day's worth of travel rations.",
        materials: [
            { itemId: 'grain_sack', quantity: 1 },
            { itemId: 'dried_meat', quantity: 1 }
        ],
        result: [
            { itemId: 'ration', quantity: 2 }
        ],
        skillRequired: 'Survival',
        dc: 8
    },
    {
        id: 'craft_leather_armor',
        name: "Craft Leather Armor",
        description: "Fashion a simple set of leather armor.",
        materials: [
            { itemId: 'leather_hide', quantity: 3 },
            { itemId: 'thread_tough', quantity: 1 }
        ],
        result: [
            { itemId: 'armor_leather', quantity: 1 }
        ],
        skillRequired: 'Smithing', // Assuming a generic crafting skill for armor
        dc: 12
    },
    {
        id: 'craft_iron_longsword',
        name: "Forge Iron Longsword",
        description: "Forge a sturdy iron longsword.",
        materials: [
            { itemId: 'iron_ingot', quantity: 2 },
            { itemId: 'leather_hide', quantity: 1 } // For grip
        ],
        result: [
            { itemId: 'sword_iron', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 13
    },
    {
        id: 'craft_dagger',
        name: "Forge Dagger",
        description: "Forge a simple dagger.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'wood_scrap', quantity: 1 } // For handle
        ],
        result: [
            { itemId: 'dagger_standard', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 10
    },
    {
        id: 'craft_arcane_focus',
        name: "Craft Arcane Focus",
        description: "Create a basic arcane focus for spellcasting.",
        materials: [
            { itemId: 'wood_scrap', quantity: 2 },
            { itemId: 'gem_dust', quantity: 1 }
        ],
        result: [
            { itemId: 'arcane_focus', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 10
    },

    // === Alchemy Recipes ===
    {
        id: 'craft_pot_heal_greater',
        name: "Brew Greater Healing Potion",
        description: "Create a more potent healing elixir.",
        materials: [
            { itemId: 'healing_herb', quantity: 4 },
            { itemId: 'vial_empty', quantity: 1 },
            { itemId: 'gem_dust', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_heal_greater', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 14
    },
    {
        id: 'craft_pot_mana',
        name: "Brew Mana Potion",
        description: "Create a potion that restores magical energy.",
        materials: [
            { itemId: 'gem_dust', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 },
            { itemId: 'healing_herb', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_mana', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 12
    },
    {
        id: 'craft_pot_stamina',
        name: "Brew Stamina Potion",
        description: "Create a potion that restores physical energy.",
        materials: [
            { itemId: 'healing_herb', quantity: 2 },
            { itemId: 'dried_meat', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_stamina', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 10
    },
    {
        id: 'craft_antitoxin',
        name: "Brew Antitoxin",
        description: "Create a potion that neutralizes poison.",
        materials: [
            { itemId: 'poisonous_plant', quantity: 1 },
            { itemId: 'healing_herb', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'antitoxin', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 12
    },
    {
        id: 'craft_oil_slipperiness',
        name: "Brew Oil of Slipperiness",
        description: "Create slippery oil for escaping grapples.",
        materials: [
            { itemId: 'healing_herb', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 },
            { itemId: 'grain_sack', quantity: 1 }
        ],
        result: [
            { itemId: 'oil_slipperiness', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 13
    },

    // === Weapon Smithing Recipes ===
    {
        id: 'craft_axe',
        name: "Forge Battle Axe",
        description: "Forge a sturdy battle axe.",
        materials: [
            { itemId: 'iron_ingot', quantity: 3 },
            { itemId: 'wood_scrap', quantity: 2 }
        ],
        result: [
            { itemId: 'axe_standard', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 13
    },
    {
        id: 'craft_hammer',
        name: "Forge Warhammer",
        description: "Forge a heavy warhammer.",
        materials: [
            { itemId: 'iron_ingot', quantity: 3 },
            { itemId: 'wood_scrap', quantity: 1 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'hammer_standard', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 13
    },
    {
        id: 'craft_spear',
        name: "Forge Spear",
        description: "Create a simple but effective spear.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'wood_scrap', quantity: 2 }
        ],
        result: [
            { itemId: 'spear_standard', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 10
    },
    {
        id: 'craft_crossbow',
        name: "Craft Crossbow",
        description: "Build a light crossbow.",
        materials: [
            { itemId: 'wood_scrap', quantity: 3 },
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'thread_tough', quantity: 2 }
        ],
        result: [
            { itemId: 'crossbow_standard', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 14
    },
    {
        id: 'craft_bow',
        name: "Craft Bow",
        description: "Build a simple shortbow.",
        materials: [
            { itemId: 'wood_scrap', quantity: 2 },
            { itemId: 'thread_tough', quantity: 2 }
        ],
        result: [
            { itemId: 'bow_standard', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 12
    },

    // === Armor Crafting Recipes ===
    {
        id: 'craft_chain_mail',
        name: "Forge Chain Mail",
        description: "Forge a suit of chain mail armor.",
        materials: [
            { itemId: 'iron_ingot', quantity: 5 },
            { itemId: 'thread_tough', quantity: 2 }
        ],
        result: [
            { itemId: 'armor_chain_mail', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 15
    },
    {
        id: 'craft_scale_mail',
        name: "Forge Scale Mail",
        description: "Forge a suit of scale mail armor.",
        materials: [
            { itemId: 'iron_ingot', quantity: 4 },
            { itemId: 'leather_hide', quantity: 2 }
        ],
        result: [
            { itemId: 'armor_scale_mail', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 14
    },
    {
        id: 'craft_hide_armor',
        name: "Craft Hide Armor",
        description: "Craft basic hide armor from animal pelts.",
        materials: [
            { itemId: 'leather_hide', quantity: 4 },
            { itemId: 'thread_tough', quantity: 2 }
        ],
        result: [
            { itemId: 'armor_hide', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 11
    },
    {
        id: 'craft_wooden_shield',
        name: "Craft Wooden Shield",
        description: "Create a simple wooden shield.",
        materials: [
            { itemId: 'wood_scrap', quantity: 3 },
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'shield_wooden', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 11
    },
    {
        id: 'craft_steel_shield',
        name: "Forge Steel Shield",
        description: "Forge a sturdy steel shield.",
        materials: [
            { itemId: 'iron_ingot', quantity: 3 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'shield_steel', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 13
    },

    // === Tool & Utility Recipes ===
    {
        id: 'craft_torch',
        name: "Make Torch",
        description: "Create a simple torch for illumination.",
        materials: [
            { itemId: 'wood_scrap', quantity: 1 }
        ],
        result: [
            { itemId: 'torch', quantity: 3 }
        ],
        skillRequired: 'Survival',
        dc: 5
    },
    {
        id: 'craft_rope',
        name: "Braid Rope",
        description: "Braid a length of sturdy rope.",
        materials: [
            { itemId: 'thread_tough', quantity: 3 }
        ],
        result: [
            { itemId: 'rope_50ft', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 8
    },
    {
        id: 'craft_thieves_tools',
        name: "Craft Thieves' Tools",
        description: "Create a set of lockpicks and disarming tools.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'thieves_tools', quantity: 1 }
        ],
        skillRequired: 'Sleight of Hand',
        dc: 14
    },
    {
        id: 'craft_herbalism_kit',
        name: "Assemble Herbalism Kit",
        description: "Put together a kit for gathering and preparing herbs.",
        materials: [
            { itemId: 'healing_herb', quantity: 3 },
            { itemId: 'leather_hide', quantity: 1 },
            { itemId: 'vial_empty', quantity: 3 }
        ],
        result: [
            { itemId: 'herbalism_kit', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 10
    },

    // === Magical Crafting Recipes ===
    {
        id: 'craft_scroll_1',
        name: "Inscribe Spell Scroll (Level 1)",
        description: "Inscribe a 1st-level spell onto a scroll.",
        materials: [
            { itemId: 'gem_dust', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'spell_scroll_1', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 12
    },
    {
        id: 'craft_scroll_3',
        name: "Inscribe Spell Scroll (Level 3)",
        description: "Inscribe a 3rd-level spell onto a scroll.",
        materials: [
            { itemId: 'gem_dust', quantity: 3 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'spell_scroll_3', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 15
    },
    {
        id: 'craft_holy_symbol',
        name: "Craft Holy Symbol",
        description: "Create a holy symbol dedicated to a deity.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'gem_dust', quantity: 1 }
        ],
        result: [
            { itemId: 'holy_symbol', quantity: 1 }
        ],
        skillRequired: 'Religion',
        dc: 10
    },

    // === Advanced Recipes (Require Rare Materials) ===
    {
        id: 'craft_mithral_shirt',
        name: "Forge Mithral Chain Shirt",
        description: "Craft a lightweight chain shirt from mithral.",
        materials: [
            { itemId: 'mithral_ore', quantity: 2 },
            { itemId: 'thread_tough', quantity: 2 }
        ],
        result: [
            { itemId: 'armor_mithral', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 18
    },
    {
        id: 'craft_dragon_armor',
        name: "Forge Dragon Scale Mail",
        description: "Craft armor from dragon scales.",
        materials: [
            { itemId: 'dragon_scale_red', quantity: 5 },
            { itemId: 'leather_hide', quantity: 3 },
            { itemId: 'thread_tough', quantity: 2 }
        ],
        result: [
            { itemId: 'armor_dragon_red', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 20
    },
    {
        id: 'craft_pot_fire_resistance',
        name: "Brew Fire Resistance Potion",
        description: "Create a potion that grants fire resistance.",
        materials: [
            { itemId: 'dragon_blood', quantity: 1 },
            { itemId: 'healing_herb', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_resistance_fire', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 15
    },
    {
        id: 'craft_pot_cold_resistance',
        name: "Brew Cold Resistance Potion",
        description: "Create a potion that grants cold resistance.",
        materials: [
            { itemId: 'dragon_scale_white', quantity: 1 },
            { itemId: 'healing_herb', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_resistance_cold', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 15
    },
    {
        id: 'craft_pot_superior_heal',
        name: "Brew Superior Healing Potion",
        description: "Create the most potent healing elixir.",
        materials: [
            { itemId: 'unicorn_horn', quantity: 1 },
            { itemId: 'healing_herb', quantity: 5 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_heal_superior', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 18
    },
    {
        id: 'craft_pot_heroism',
        name: "Brew Potion of Heroism",
        description: "Create a potion that bolsters courage and strength.",
        materials: [
            { itemId: 'dragon_blood', quantity: 1 },
            { itemId: 'angel_tears', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_heroism', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 17
    },
    {
        id: 'craft_enchanted_weapon',
        name: "Enchant Weapon",
        description: "Imbue a weapon with magical power.",
        materials: [
            { itemId: 'sword_iron', quantity: 1 },
            { itemId: 'elemental_core', quantity: 1 },
            { itemId: 'gem_dust', quantity: 3 }
        ],
        result: [
            { itemId: 'sword_flame', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 18
    }
];
