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
    {
        id: 'craft_harpoon',
        name: "Forge Harpoon",
        description: "Forge a barbed harpoon for coastal hunting.",
        materials: [
            { itemId: 'iron_ingot', quantity: 2 },
            { itemId: 'wood_scrap', quantity: 2 }
        ],
        result: [
            { itemId: 'harpoon', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 12
    },
    {
        id: 'craft_weighted_net',
        name: "Weave Weighted Net",
        description: "Weave a weighted net for capturing sea creatures.",
        materials: [
            { itemId: 'netting', quantity: 2 },
            { itemId: 'iron_ingot', quantity: 1 }
        ],
        result: [
            { itemId: 'weighted_net', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 11
    },
    {
        id: 'craft_storm_lantern',
        name: "Build Storm Lantern",
        description: "Assemble a lantern reinforced for heavy winds.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'glass_shard', quantity: 2 },
            { itemId: 'tar_resin', quantity: 1 }
        ],
        result: [
            { itemId: 'storm_lantern', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 12
    },
    {
        id: 'craft_sea_chart',
        name: "Draft Sea Chart",
        description: "Chart coastal waters and safe routes.",
        materials: [
            { itemId: 'sea_glass', quantity: 1 },
            { itemId: 'bg_ink_bottle', quantity: 1 }
        ],
        result: [
            { itemId: 'sea_chart', quantity: 1 }
        ],
        skillRequired: 'Investigation',
        dc: 10
    },
    {
        id: 'craft_hull_repair_kit',
        name: "Assemble Hull Repair Kit",
        description: "Bundle pitch, planks, and resin for quick repairs.",
        materials: [
            { itemId: 'ship_planks', quantity: 2 },
            { itemId: 'pitch', quantity: 1 },
            { itemId: 'tar_resin', quantity: 1 }
        ],
        result: [
            { itemId: 'hull_repair_kit', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 11
    },
    {
        id: 'craft_saltward_cloak',
        name: "Reproof Saltward Cloak",
        description: "Treat a cloak with oils and salt to repel sea spray.",
        materials: [
            { itemId: 'cloak_saltward', quantity: 1 },
            { itemId: 'rigging_oil', quantity: 1 },
            { itemId: 'brine_salt', quantity: 1 }
        ],
        result: [
            { itemId: 'cloak_saltward', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 12
    },
    {
        id: 'craft_shipwright_tools',
        name: "Assemble Shipwright's Tools",
        description: "Create a full shipwright toolkit.",
        materials: [
            { itemId: 'iron_ingot', quantity: 2 },
            { itemId: 'wood_scrap', quantity: 2 },
            { itemId: 'canvas_roll', quantity: 1 }
        ],
        result: [
            { itemId: 'shipwright_tools', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 13
    },
    {
        id: 'craft_siren_charm',
        name: "Craft Siren Charm",
        description: "Bind a charm to resist the pull of ocean songs.",
        materials: [
            { itemId: 'siren_scale', quantity: 1 },
            { itemId: 'pearl_shard', quantity: 1 },
            { itemId: 'sea_glass', quantity: 1 }
        ],
        result: [
            { itemId: 'lucky_charm', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 14
    }
];
