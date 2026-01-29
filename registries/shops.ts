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
    }
];
