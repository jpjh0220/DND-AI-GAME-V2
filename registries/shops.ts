import { ShopData } from '../types';

export const SHOPS_DB: ShopData[] = [
    {
        id: 'general_store',
        name: "The Wayfarer's Respite",
        description: "A general store selling common goods, supplies, and basic necessities for any traveler.",
        type: 'general',
        inventory: [
            { itemId: 'ration', quantity: 5 },
            { itemId: 'waterskin', quantity: 3 },
            { itemId: 'rope_50ft', quantity: 2 },
            { itemId: 'torch', quantity: 10 },
            { itemId: 'healing_herb', quantity: 5 },
            { itemId: 'tattered_clothes', quantity: 2 },
            { itemId: 'small_knife', quantity: 1 },
            { itemId: 'vial_empty', quantity: 5 }
        ]
    },
    {
        id: 'apothecary',
        name: "Elara's Potions & Poisons",
        description: "A reclusive apothecary specializing in herbal remedies, potent potions, and occasionally, darker concoctions.",
        type: 'alchemist',
        inventory: [
            { itemId: 'pot_heal', quantity: 3 },
            { itemId: 'pot_mana', quantity: 2 },
            { itemId: 'pot_stamina', quantity: 2 },
            { itemId: 'antitoxin', quantity: 1 },
            { itemId: 'oil_slipperiness', quantity: 1 },
            { itemId: 'healing_herb', quantity: 10 },
            { itemId: 'poisonous_plant', quantity: 3 },
            { itemId: 'vial_empty', quantity: 5 }
        ]
    },
    {
        id: 'dwarven_armory',
        name: "Gimli's Grimy Gear",
        description: "A dwarven armory offering sturdy weapons and heavy armor, forged deep within the mountains.",
        type: 'weapon',
        inventory: [
            { itemId: 'armor_chain_mail', quantity: 1 },
            { itemId: 'armor_scale_mail', quantity: 1 },
            { itemId: 'shield_steel', quantity: 1 },
            { itemId: 'axe_standard', quantity: 1 },
            { itemId: 'hammer_standard', quantity: 1 },
            { itemId: 'sword_iron', quantity: 1 },
            { itemId: 'iron_ingot', quantity: 5 }
        ]
    },
    {
        id: 'grand_bazaar',
        name: "The Sunstone Bazaar",
        description: "A bustling marketplace in Silverspire, offering a wide array of goods from all corners of the realm.",
        type: 'general',
        inventory: [
            { itemId: 'pot_heal', quantity: 5 },
            { itemId: 'ration', quantity: 10 },
            { itemId: 'waterskin', quantity: 5 },
            { itemId: 'armor_leather', quantity: 1 },
            { itemId: 'dagger_standard', quantity: 2 },
            { itemId: 'fine_clothes', quantity: 1 },
            { itemId: 'holy_symbol', quantity: 1 },
            { itemId: 'arcane_focus', quantity: 1 },
            { itemId: 'rope_50ft', quantity: 3 },
            { itemId: 'torch', quantity: 10 },
            { itemId: 'gem_dust', quantity: 2 }
        ]
    },
    {
        id: 'enchanter',
        name: "The Whispering Glyphs",
        description: "A shop run by a reclusive enchanter, specializing in magical trinkets, enchanted items, and rare spell components.",
        type: 'magic',
        inventory: [
            { itemId: 'pot_mana', quantity: 3 },
            { itemId: 'ring_protection', quantity: 1 }, // Example magic item
            { itemId: 'amulet_health', quantity: 1 },
            { itemId: 'spellbook', quantity: 1 },
            { itemId: 'gem_dust', quantity: 5 },
            { itemId: 'arcane_focus', quantity: 1 }
        ]
    },
    // New Shops based on locations.ts
    {
        id: 'tavern',
        name: "The Drunken Dwarf Tavern",
        description: "A lively tavern serving strong ale and hearty food, a common gathering place for locals and travelers.",
        type: 'general', // Or 'food'
        inventory: [
            { itemId: 'ration', quantity: 10 },
            { itemId: 'waterskin', quantity: 5 },
            { itemId: 'pot_stamina', quantity: 2 }
        ]
    },
    {
        id: 'dockside_outfitter',
        name: "Dockside Outfitter",
        description: "A salty storefront packed with ropes, lanterns, and weatherproof gear for sea-bound expeditions.",
        type: 'general',
        inventory: [
            { itemId: 'ration', quantity: 8 },
            { itemId: 'waterskin', quantity: 5 },
            { itemId: 'rope_50ft', quantity: 4 },
            { itemId: 'storm_lantern', quantity: 3 },
            { itemId: 'mariners_compass', quantity: 2 },
            { itemId: 'belaying_pin', quantity: 2 },
            { itemId: 'cloak_saltward', quantity: 2 },
            { itemId: 'pot_water_breathing', quantity: 1 }
        ]
    },
    {
        id: 'curiosities',
        name: "Curiosities & Oddities",
        description: "A dusty shop filled with strange artifacts, unusual trinkets, and forgotten relics.",
        type: 'special',
        inventory: [
            { itemId: 'goggles_night', quantity: 1 },
            { itemId: 'eyes_eagle', quantity: 1 },
            { itemId: 'immovable_rod', quantity: 1 },
            { itemId: 'gem_seeing', quantity: 1 },
            { itemId: 'lucky_charm', quantity: 3 }
        ]
    },
    {
        id: 'gem_merchant',
        name: "The Gemstone Grotto",
        description: "A merchant specializing in precious stones, raw crystals, and fine jewelry.",
        type: 'special',
        inventory: [
            { itemId: 'gem_dust', quantity: 10 },
            { itemId: 'ioun_fortitude', quantity: 1 },
            { itemId: 'ioun_insight', quantity: 1 },
            { itemId: 'ioun_intellect', quantity: 1 }
        ]
    },
    {
        id: 'royal_armory',
        name: "The Royal Armory",
        description: "The kingdom's official armory, offering high-quality weapons and armor to sanctioned individuals.",
        type: 'weapon',
        inventory: [
            { itemId: 'sword_iron', quantity: 3 },
            { itemId: 'armor_plate', quantity: 1 },
            { itemId: 'shield_steel', quantity: 2 },
            { itemId: 'armor_chain_mail', quantity: 2 }
        ]
    },
    {
        id: 'spell_components',
        name: "Arcane Reagents",
        description: "A shop providing rare and common magical ingredients for spellcasters.",
        type: 'magic',
        inventory: [
            { itemId: 'component_pouch', quantity: 2 },
            { itemId: 'gem_dust', quantity: 5 },
            { itemId: 'vial_empty', quantity: 10 },
            { itemId: 'arcane_focus', quantity: 2 }
        ]
    },
    {
        id: 'scroll_shop',
        name: "Scrolls & Tomes",
        description: "A scholarly establishment selling spell scrolls, ancient texts, and blank parchment.",
        type: 'magic',
        inventory: [
            { itemId: 'spell_scroll_1', quantity: 5 },
            { itemId: 'spell_scroll_3', quantity: 3 },
            { itemId: 'spellbook', quantity: 1 },
            { itemId: 'bg_ink_bottle', quantity: 2 },
            { itemId: 'bg_quill', quantity: 5 }
        ]
    },
    {
        id: 'black_market',
        name: "The Black Market",
        description: "A shadowy bazaar dealing in illicit and contraband goods not found anywhere else.",
        type: 'special',
        inventory: [
            { itemId: 'dagger_assassin', quantity: 1 },
            { itemId: 'poisonous_plant', quantity: 5 },
            { itemId: 'ring_invisibility', quantity: 1 },
            { itemId: 'bg_dark_clothes', quantity: 2 },
            { itemId: 'thieves_tools', quantity: 1 }
        ]
    },
    {
        id: 'poison_vendor',
        name: "The Poisoner's Pantry",
        description: "A specialized vendor of toxins, venoms, and other nefarious concoctions.",
        type: 'alchemist',
        inventory: [
            { itemId: 'poisonous_plant', quantity: 10 },
            { itemId: 'dagger_venom', quantity: 1 },
            { itemId: 'antitoxin', quantity: 2 }
        ]
    },

    // === Location-Specific Shops ===
    {
        id: 'frontier_supplies',
        name: "Thornhaven Trading Post",
        description: "A frontier outpost shop selling essentials for wilderness survival and basic adventuring gear.",
        type: 'general',
        inventory: [
            { itemId: 'ration', quantity: 10 },
            { itemId: 'waterskin', quantity: 5 },
            { itemId: 'torch', quantity: 15 },
            { itemId: 'rope_50ft', quantity: 3 },
            { itemId: 'healing_herb', quantity: 8 },
            { itemId: 'armor_leather', quantity: 1 },
            { itemId: 'sword_iron', quantity: 1 },
            { itemId: 'dagger_standard', quantity: 3 }
        ]
    },
    {
        id: 'alehouse',
        name: "The Thorny Rose Alehouse",
        description: "A cozy frontier tavern serving warm meals and cold ale to weary travelers.",
        type: 'general',
        inventory: [
            { itemId: 'ration', quantity: 15 },
            { itemId: 'waterskin', quantity: 8 },
            { itemId: 'pot_stamina', quantity: 3 }
        ]
    },
    {
        id: 'ship_supplies',
        name: "Harbor Outfitters",
        description: "A maritime shop stocking everything a sailor or coastal adventurer could need.",
        type: 'general',
        inventory: [
            { itemId: 'rope_50ft', quantity: 5 },
            { itemId: 'ration', quantity: 10 },
            { itemId: 'waterskin', quantity: 10 },
            { itemId: 'dagger_standard', quantity: 2 },
            { itemId: 'crossbow_standard', quantity: 1 },
            { itemId: 'pot_water_breathing', quantity: 2 },
            { itemId: 'cap_water_breathing', quantity: 1 }
        ]
    },
    {
        id: 'inn_supplies',
        name: "Wayward Inn Shop",
        description: "A small shop within the famous Wayward Inn, selling travel essentials.",
        type: 'general',
        inventory: [
            { itemId: 'ration', quantity: 20 },
            { itemId: 'waterskin', quantity: 10 },
            { itemId: 'pot_heal', quantity: 3 },
            { itemId: 'torch', quantity: 10 },
            { itemId: 'healing_herb', quantity: 5 }
        ]
    },
    {
        id: 'nomad_trader',
        name: "Windrunner's Wares",
        description: "A nomadic trader selling exotic goods from across the plains and desert.",
        type: 'special',
        inventory: [
            { itemId: 'ration', quantity: 8 },
            { itemId: 'waterskin', quantity: 10 },
            { itemId: 'scimitar_standard', quantity: 2 },
            { itemId: 'armor_hide', quantity: 1 },
            { itemId: 'pot_resistance_fire', quantity: 1 },
            { itemId: 'gem_dust', quantity: 3 }
        ]
    },
    {
        id: 'desert_trader',
        name: "Oasis Merchants",
        description: "Traders at the Oasis of Stars selling rare desert goods and water supplies.",
        type: 'special',
        inventory: [
            { itemId: 'waterskin', quantity: 15 },
            { itemId: 'ration', quantity: 10 },
            { itemId: 'pot_resistance_fire', quantity: 2 },
            { itemId: 'pot_heal_greater', quantity: 2 },
            { itemId: 'scimitar_speed', quantity: 1 },
            { itemId: 'cloak_protection', quantity: 1 }
        ]
    },
    {
        id: 'dwarven_armory',
        name: "Karak Azgal Armory",
        description: "A dwarven fortress armory with the finest mountain-forged weapons and armor.",
        type: 'weapon',
        inventory: [
            { itemId: 'armor_chain_mail', quantity: 2 },
            { itemId: 'armor_plate', quantity: 1 },
            { itemId: 'shield_steel', quantity: 3 },
            { itemId: 'axe_standard', quantity: 3 },
            { itemId: 'hammer_standard', quantity: 3 },
            { itemId: 'axe_dwarvish', quantity: 1 },
            { itemId: 'hammer_dwarven', quantity: 1 },
            { itemId: 'iron_ingot', quantity: 10 },
            { itemId: 'mithral_ore', quantity: 2 }
        ]
    },
    {
        id: 'elven_armory',
        name: "Aelindra Bladeworks",
        description: "An elven weapon shop crafting elegant and deadly weapons of exceptional quality.",
        type: 'weapon',
        inventory: [
            { itemId: 'sword_iron', quantity: 2 },
            { itemId: 'bow_standard', quantity: 2 },
            { itemId: 'bow_elven', quantity: 1 },
            { itemId: 'armor_elven', quantity: 1 },
            { itemId: 'cloak_elven', quantity: 2 },
            { itemId: 'boots_elven', quantity: 2 }
        ]
    },
    {
        id: 'elven_enchanter',
        name: "Starweaver's Enchantments",
        description: "An elven magic shop selling enchanted items and arcane components.",
        type: 'magic',
        inventory: [
            { itemId: 'pot_mana', quantity: 5 },
            { itemId: 'pot_mana_greater', quantity: 2 },
            { itemId: 'spell_scroll_1', quantity: 5 },
            { itemId: 'spell_scroll_3', quantity: 3 },
            { itemId: 'spell_scroll_5', quantity: 1 },
            { itemId: 'arcane_focus', quantity: 2 },
            { itemId: 'gem_dust', quantity: 10 }
        ]
    },
    {
        id: 'sailor_supplies',
        name: "Captain's Cache",
        description: "A dockside shop catering to sailors, pirates, and seafaring adventurers.",
        type: 'general',
        inventory: [
            { itemId: 'rope_50ft', quantity: 5 },
            { itemId: 'ration', quantity: 15 },
            { itemId: 'waterskin', quantity: 8 },
            { itemId: 'cutlass', quantity: 2 },
            { itemId: 'crossbow_standard', quantity: 1 },
            { itemId: 'pot_water_breathing', quantity: 3 },
            { itemId: 'trident_fish', quantity: 1 }
        ]
    },
    {
        id: 'luxury_goods',
        name: "The Golden Chalice",
        description: "An upscale boutique selling fine goods, jewelry, and luxury items for the wealthy.",
        type: 'special',
        inventory: [
            { itemId: 'bg_fine_clothes', quantity: 3 },
            { itemId: 'signet_ring', quantity: 2 },
            { itemId: 'ring_protection', quantity: 1 },
            { itemId: 'amulet_health', quantity: 1 },
            { itemId: 'cloak_protection', quantity: 1 },
            { itemId: 'headband_intellect', quantity: 1 }
        ]
    },
    {
        id: 'fine_jeweler',
        name: "Silvergleam Jewelers",
        description: "A prestigious jeweler specializing in magical rings, amulets, and precious gems.",
        type: 'special',
        inventory: [
            { itemId: 'ring_protection', quantity: 1 },
            { itemId: 'ring_resist_fire', quantity: 1 },
            { itemId: 'ring_resist_cold', quantity: 1 },
            { itemId: 'ring_evasion', quantity: 1 },
            { itemId: 'amulet_health', quantity: 1 },
            { itemId: 'periapt_health', quantity: 1 },
            { itemId: 'ioun_fortitude', quantity: 1 },
            { itemId: 'ioun_insight', quantity: 1 },
            { itemId: 'gem_dust', quantity: 15 }
        ]
    },
    {
        id: 'guild_supplies',
        name: "Adventurer's Guild Quartermaster",
        description: "The guild's official supply shop, offering gear at fair prices to registered adventurers.",
        type: 'general',
        inventory: [
            { itemId: 'pot_heal', quantity: 10 },
            { itemId: 'pot_heal_greater', quantity: 5 },
            { itemId: 'pot_mana', quantity: 5 },
            { itemId: 'ration', quantity: 20 },
            { itemId: 'waterskin', quantity: 10 },
            { itemId: 'torch', quantity: 20 },
            { itemId: 'rope_50ft', quantity: 5 },
            { itemId: 'thieves_tools', quantity: 2 },
            { itemId: 'herbalism_kit', quantity: 2 }
        ]
    },
    {
        id: 'swamp_trader',
        name: "Sseth'ka Trading Post",
        description: "A lizardfolk-run trading post selling swamp resources and exotic goods.",
        type: 'special',
        inventory: [
            { itemId: 'poisonous_plant', quantity: 8 },
            { itemId: 'healing_herb', quantity: 10 },
            { itemId: 'antitoxin', quantity: 5 },
            { itemId: 'leather_hide', quantity: 5 },
            { itemId: 'spear_standard', quantity: 2 }
        ]
    },

    // === Specialty Magic Shops ===
    {
        id: 'legendary_arms',
        name: "Hall of Heroes",
        description: "An exclusive armory dealing in legendary and artifact-level weapons and armor.",
        type: 'weapon',
        inventory: [
            { itemId: 'sword_flame', quantity: 1 },
            { itemId: 'sword_frost', quantity: 1 },
            { itemId: 'sword_sunblade', quantity: 1 },
            { itemId: 'armor_adamantine', quantity: 1 },
            { itemId: 'armor_mithral', quantity: 1 },
            { itemId: 'shield_animated', quantity: 1 },
            { itemId: 'hammer_thunder', quantity: 1 }
        ]
    },
    {
        id: 'arcane_emporium',
        name: "The Arcane Emporium",
        description: "A high-end magic shop selling rare wands, staves, and powerful magical items.",
        type: 'magic',
        inventory: [
            { itemId: 'wand_magic_missile', quantity: 1 },
            { itemId: 'wand_fireballs', quantity: 1 },
            { itemId: 'staff_power', quantity: 1 },
            { itemId: 'staff_frost', quantity: 1 },
            { itemId: 'staff_fire', quantity: 1 },
            { itemId: 'robe_stars', quantity: 1 },
            { itemId: 'crystal_ball', quantity: 1 },
            { itemId: 'bag_holding', quantity: 2 }
        ]
    },
    {
        id: 'potion_emporium',
        name: "Mama Elixir's Potions",
        description: "A cramped shop overflowing with potions of every variety, run by an eccentric old woman.",
        type: 'alchemist',
        inventory: [
            { itemId: 'pot_heal', quantity: 10 },
            { itemId: 'pot_heal_greater', quantity: 5 },
            { itemId: 'pot_heal_superior', quantity: 2 },
            { itemId: 'pot_mana', quantity: 5 },
            { itemId: 'pot_mana_greater', quantity: 3 },
            { itemId: 'pot_stamina', quantity: 5 },
            { itemId: 'pot_giant_str', quantity: 1 },
            { itemId: 'pot_heroism', quantity: 1 },
            { itemId: 'pot_speed', quantity: 1 },
            { itemId: 'pot_flying', quantity: 1 },
            { itemId: 'pot_invisibility', quantity: 1 },
            { itemId: 'antitoxin', quantity: 5 }
        ]
    },
    {
        id: 'monster_parts',
        name: "The Creature Collector",
        description: "A grim shop buying and selling monster parts, rare crafting materials, and exotic components.",
        type: 'special',
        inventory: [
            { itemId: 'dragon_scale_red', quantity: 2 },
            { itemId: 'dragon_scale_blue', quantity: 2 },
            { itemId: 'dragon_blood', quantity: 3 },
            { itemId: 'beholder_eye', quantity: 1 },
            { itemId: 'demon_ichor', quantity: 2 },
            { itemId: 'elemental_core', quantity: 3 },
            { itemId: 'phoenix_feather', quantity: 1 }
        ]
    },
    {
        id: 'temple_goods',
        name: "Sacred Relics",
        description: "A temple shop selling holy items, healing supplies, and divine spell components.",
        type: 'magic',
        inventory: [
            { itemId: 'holy_symbol', quantity: 5 },
            { itemId: 'pot_heal', quantity: 10 },
            { itemId: 'pot_heal_greater', quantity: 5 },
            { itemId: 'antitoxin', quantity: 5 },
            { itemId: 'mace_disruption', quantity: 1 },
            { itemId: 'angel_tears', quantity: 1 },
            { itemId: 'periapt_wound', quantity: 1 }
        ]
    },
    {
        id: 'thieves_guild',
        name: "The Silent Coin",
        description: "A hidden shop accessible only to those in the know, selling tools of the trade for rogues.",
        type: 'special',
        inventory: [
            { itemId: 'thieves_tools', quantity: 3 },
            { itemId: 'bg_dark_clothes', quantity: 3 },
            { itemId: 'bg_disguise_kit', quantity: 2 },
            { itemId: 'dagger_assassin', quantity: 1 },
            { itemId: 'cloak_elven', quantity: 1 },
            { itemId: 'boots_elven', quantity: 1 },
            { itemId: 'gloves_thievery', quantity: 1 },
            { itemId: 'pot_invisibility', quantity: 2 }
        ]
    },
    {
        id: 'planar_imports',
        name: "Beyond the Veil",
        description: "A mysterious shop dealing in items from other planes of existence.",
        type: 'special',
        inventory: [
            { itemId: 'amulet_planes', quantity: 1 },
            { itemId: 'ring_air_elemental', quantity: 1 },
            { itemId: 'ring_fire_elemental', quantity: 1 },
            { itemId: 'elemental_core', quantity: 5 },
            { itemId: 'demon_ichor', quantity: 3 },
            { itemId: 'angel_tears', quantity: 2 },
            { itemId: 'cubic_gate', quantity: 1 }
        ]
    }
];
