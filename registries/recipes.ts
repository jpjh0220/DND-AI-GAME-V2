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
    },

    // === Alchemy Recipes ===
    {
        id: 'craft_pot_greater_heal',
        name: "Brew Greater Healing Potion",
        description: "Brew a potent healing potion that restores significant vitality.",
        materials: [
            { itemId: 'herb_healing', quantity: 4 },
            { itemId: 'gem_dust', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_greater_heal', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 15
    },
    {
        id: 'craft_pot_superior_heal',
        name: "Brew Superior Healing Potion",
        description: "Create the finest healing potion known to alchemists.",
        materials: [
            { itemId: 'herb_healing', quantity: 6 },
            { itemId: 'phoenix_feather', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_superior_heal', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 20
    },
    {
        id: 'craft_antitoxin',
        name: "Brew Antitoxin",
        description: "Distill a remedy that neutralizes most common poisons.",
        materials: [
            { itemId: 'herb_healing', quantity: 1 },
            { itemId: 'snake_venom', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'antitoxin', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 12
    },
    {
        id: 'craft_poison_basic',
        name: "Brew Basic Poison",
        description: "Concoct a simple contact poison to coat a weapon.",
        materials: [
            { itemId: 'snake_venom', quantity: 2 },
            { itemId: 'nightshade', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'poison_basic', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 14
    },
    {
        id: 'craft_pot_fire_resist',
        name: "Brew Potion of Fire Resistance",
        description: "Create a potion that grants temporary resistance to fire damage.",
        materials: [
            { itemId: 'fire_essence', quantity: 1 },
            { itemId: 'herb_healing', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_fire_resist', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 14
    },
    {
        id: 'craft_pot_cold_resist',
        name: "Brew Potion of Cold Resistance",
        description: "Create a potion that grants temporary resistance to cold damage.",
        materials: [
            { itemId: 'frost_essence', quantity: 1 },
            { itemId: 'herb_healing', quantity: 2 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_cold_resist', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 14
    },
    {
        id: 'craft_pot_invisibility',
        name: "Brew Potion of Invisibility",
        description: "Distill a rare potion that renders the drinker invisible for a short time.",
        materials: [
            { itemId: 'shadow_essence', quantity: 2 },
            { itemId: 'gem_dust', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_invisibility', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 18
    },
    {
        id: 'craft_pot_strength',
        name: "Brew Potion of Giant Strength",
        description: "A powerful concoction that temporarily grants the strength of a hill giant.",
        materials: [
            { itemId: 'giant_toe', quantity: 1 },
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'pot_giant_strength', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 16
    },
    {
        id: 'craft_alchemist_fire',
        name: "Brew Alchemist's Fire",
        description: "Create a flask of volatile, sticky fire that ignites on impact.",
        materials: [
            { itemId: 'fire_essence', quantity: 1 },
            { itemId: 'tar_resin', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'alchemist_fire', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 13
    },

    // === Smithing Recipes ===
    {
        id: 'craft_steel_longsword',
        name: "Forge Steel Longsword",
        description: "Forge a superior quality steel longsword.",
        materials: [
            { itemId: 'steel_ingot', quantity: 2 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'sword_steel', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 15
    },
    {
        id: 'craft_chain_mail',
        name: "Forge Chain Mail",
        description: "Craft a suit of interlocking metal rings for solid protection.",
        materials: [
            { itemId: 'iron_ingot', quantity: 4 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'armor_chain_mail', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 15
    },
    {
        id: 'craft_plate_armor',
        name: "Forge Plate Armor",
        description: "Forge a full suit of plate armor, the pinnacle of mundane protection.",
        materials: [
            { itemId: 'steel_ingot', quantity: 6 },
            { itemId: 'leather_hide', quantity: 2 },
            { itemId: 'iron_ingot', quantity: 2 }
        ],
        result: [
            { itemId: 'armor_plate', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 18
    },
    {
        id: 'craft_shield',
        name: "Forge Steel Shield",
        description: "Craft a sturdy steel shield.",
        materials: [
            { itemId: 'steel_ingot', quantity: 2 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'shield_steel', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 13
    },
    {
        id: 'craft_greataxe',
        name: "Forge Greataxe",
        description: "Forge a massive two-handed greataxe.",
        materials: [
            { itemId: 'steel_ingot', quantity: 3 },
            { itemId: 'wood_scrap', quantity: 2 }
        ],
        result: [
            { itemId: 'greataxe_steel', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 14
    },
    {
        id: 'craft_mithral_chain',
        name: "Forge Mithral Chain Shirt",
        description: "Craft an extraordinarily light chain shirt from precious mithral.",
        materials: [
            { itemId: 'mithral_ingot', quantity: 3 },
            { itemId: 'gem_dust', quantity: 1 }
        ],
        result: [
            { itemId: 'armor_mithral_chain', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 20
    },
    {
        id: 'craft_adamantine_sword',
        name: "Forge Adamantine Longsword",
        description: "Forge a blade from near-indestructible adamantine metal.",
        materials: [
            { itemId: 'adamantine_ingot', quantity: 3 },
            { itemId: 'fire_essence', quantity: 1 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'sword_adamantine', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 22
    },
    {
        id: 'craft_arrows',
        name: "Fletch Arrows",
        description: "Craft a bundle of arrows from wood and iron.",
        materials: [
            { itemId: 'wood_scrap', quantity: 1 },
            { itemId: 'iron_ingot', quantity: 1 }
        ],
        result: [
            { itemId: 'arrows_bundle', quantity: 20 }
        ],
        skillRequired: 'Survival',
        dc: 8
    },

    // === Enchanting Recipes ===
    {
        id: 'enchant_flaming_weapon',
        name: "Enchant Weapon: Flaming",
        description: "Imbue a weapon with the power of fire, causing it to deal additional fire damage.",
        materials: [
            { itemId: 'fire_essence', quantity: 3 },
            { itemId: 'gem_dust', quantity: 2 },
            { itemId: 'ruby', quantity: 1 }
        ],
        result: [
            { itemId: 'enchant_flame', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 18
    },
    {
        id: 'enchant_frost_weapon',
        name: "Enchant Weapon: Frost",
        description: "Imbue a weapon with biting cold, dealing additional cold damage.",
        materials: [
            { itemId: 'frost_essence', quantity: 3 },
            { itemId: 'gem_dust', quantity: 2 },
            { itemId: 'sapphire', quantity: 1 }
        ],
        result: [
            { itemId: 'enchant_frost', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 18
    },
    {
        id: 'enchant_protection_armor',
        name: "Enchant Armor: Protection",
        description: "Weave protective wards into a suit of armor, increasing its defensive value.",
        materials: [
            { itemId: 'gem_dust', quantity: 3 },
            { itemId: 'holy_water', quantity: 1 },
            { itemId: 'diamond_shard', quantity: 1 }
        ],
        result: [
            { itemId: 'enchant_protection', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 17
    },
    {
        id: 'craft_spell_scroll',
        name: "Scribe Spell Scroll",
        description: "Inscribe a spell onto a scroll for single use.",
        materials: [
            { itemId: 'parchment', quantity: 1 },
            { itemId: 'gem_dust', quantity: 1 },
            { itemId: 'ink_arcane', quantity: 1 }
        ],
        result: [
            { itemId: 'spell_scroll_blank', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 14
    },

    // === Survival & Utility Recipes ===
    {
        id: 'craft_torch_bundle',
        name: "Bundle Torches",
        description: "Prepare a bundle of long-lasting torches for dungeon exploration.",
        materials: [
            { itemId: 'wood_scrap', quantity: 2 },
            { itemId: 'tar_resin', quantity: 1 }
        ],
        result: [
            { itemId: 'torch_bundle', quantity: 5 }
        ],
        skillRequired: 'Survival',
        dc: 6
    },
    {
        id: 'craft_rope',
        name: "Braid Rope",
        description: "Braid strong hemp rope for climbing and binding.",
        materials: [
            { itemId: 'hemp_fiber', quantity: 3 }
        ],
        result: [
            { itemId: 'rope_50ft', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 8
    },
    {
        id: 'craft_trap_basic',
        name: "Set Hunting Trap",
        description: "Construct a basic hunting trap from metal and wood.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'wood_scrap', quantity: 1 }
        ],
        result: [
            { itemId: 'trap_hunting', quantity: 1 }
        ],
        skillRequired: 'Survival',
        dc: 10
    },
    {
        id: 'craft_lockpicks',
        name: "Craft Thieves' Tools",
        description: "Assemble a set of lockpicks and bypass tools.",
        materials: [
            { itemId: 'iron_ingot', quantity: 1 },
            { itemId: 'leather_hide', quantity: 1 }
        ],
        result: [
            { itemId: 'thieves_tools', quantity: 1 }
        ],
        skillRequired: 'Sleight of Hand',
        dc: 12
    },
    {
        id: 'craft_healer_kit',
        name: "Assemble Healer's Kit",
        description: "Put together a comprehensive healer's kit with bandages and salves.",
        materials: [
            { itemId: 'herb_healing', quantity: 3 },
            { itemId: 'leather_hide', quantity: 1 },
            { itemId: 'thread_tough', quantity: 1 }
        ],
        result: [
            { itemId: 'healers_kit', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 10
    },
    {
        id: 'craft_smoke_bomb',
        name: "Craft Smoke Bomb",
        description: "Create a small bomb that releases a cloud of obscuring smoke.",
        materials: [
            { itemId: 'tar_resin', quantity: 1 },
            { itemId: 'nightshade', quantity: 1 },
            { itemId: 'vial_empty', quantity: 1 }
        ],
        result: [
            { itemId: 'smoke_bomb', quantity: 2 }
        ],
        skillRequired: 'Arcana',
        dc: 12
    },

    // === Legendary Recipes ===
    {
        id: 'craft_holy_avenger',
        name: "Forge Holy Avenger",
        description: "Forge a legendary holy sword blessed by the gods themselves. Requires divine favor.",
        materials: [
            { itemId: 'adamantine_ingot', quantity: 5 },
            { itemId: 'holy_water', quantity: 3 },
            { itemId: 'diamond_shard', quantity: 2 },
            { itemId: 'phoenix_feather', quantity: 1 }
        ],
        result: [
            { itemId: 'holy_avenger', quantity: 1 }
        ],
        skillRequired: 'Smithing',
        dc: 25
    },
    {
        id: 'craft_bag_of_holding',
        name: "Craft Bag of Holding",
        description: "Sew an extradimensional space into an ordinary bag. A prized adventuring tool.",
        materials: [
            { itemId: 'shadow_essence', quantity: 2 },
            { itemId: 'gem_dust', quantity: 3 },
            { itemId: 'leather_hide', quantity: 2 }
        ],
        result: [
            { itemId: 'bag_of_holding', quantity: 1 }
        ],
        skillRequired: 'Arcana',
        dc: 20
    },
    {
        id: 'craft_elixir_life',
        name: "Brew Elixir of Life",
        description: "Distill the legendary elixir that can restore life to the recently dead.",
        materials: [
            { itemId: 'phoenix_feather', quantity: 2 },
            { itemId: 'herb_healing', quantity: 6 },
            { itemId: 'diamond_shard', quantity: 1 },
            { itemId: 'holy_water', quantity: 1 }
        ],
        result: [
            { itemId: 'elixir_of_life', quantity: 1 }
        ],
        skillRequired: 'Medicine',
        dc: 25
    }
];
