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
    }
];
