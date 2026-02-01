import { Encounter } from '../types';

export const ENCOUNTERS_DB: Encounter[] = [
    // === Forest Encounters ===
    {
        id: 'forest_goblin_ambush',
        name: "Goblin Ambush",
        type: 'combat',
        description: "As you traverse the dense woods, a crude net drops from above, followed by the cackles of goblins. It's an ambush!",
        challengeRating: 1,
        enemyIds: ['goblin', 'goblin', 'goblin'],
        rewards: { xp: 150, currency: 50, itemIds: ['dagger_standard'] }
    },
    {
        id: 'forest_lost_traveler',
        name: "Lost Traveler",
        type: 'social',
        description: "You stumble upon a disheveled traveler, clearly lost and frightened by the sounds of the forest. They offer a small reward for safe passage to the nearest town.",
        npcId: 'lost_traveler_generic', // Will be generated or picked from NPCS_DB
        rewards: { xp: 50, currency: 100 },
        choices: [
            { id: 'escort_traveler', label: 'Escort the traveler', intent: 'social' },
            { id: 'rob_traveler', label: 'Rob the traveler', intent: 'combat' }
        ]
    },
    {
        id: 'forest_wild_boar',
        name: "Charging Wild Boar",
        type: 'combat',
        description: "A wild boar, disturbed from its foraging, snorts aggressively and charges, tusks gleaming.",
        challengeRating: 0.5,
        enemyIds: ['wild_boar'], // Assuming a 'wild_boar' enemy exists in ENEMIES_DB
        rewards: { xp: 50, itemIds: ['dried_meat'] }
    },
    {
        id: 'forest_mysterious_ruins',
        name: "Mysterious Ruins",
        type: 'discovery',
        description: "Hidden deep within the foliage, you discover the overgrown ruins of a small, ancient shrine. Faint carvings suggest forgotten deities.",
        rewards: { xp: 25, itemIds: ['gem_dust'] },
        choices: [
            { id: 'investigate_ruins', label: 'Investigate the ruins', intent: 'discovery' },
            { id: 'leave_ruins', label: 'Leave the ruins untouched', intent: 'travel' }
        ]
    },

    // === Road/Plains Encounters ===
    {
        id: 'road_merchant_caravan',
        name: "Merchant Caravan",
        type: 'social',
        description: "A small merchant caravan is halted by a broken wheel. They offer to trade goods or pay for assistance.",
        npcId: 'merchant_generic',
        rewards: { xp: 30, currency: 50 },
        choices: [
            { id: 'help_caravan', label: 'Offer assistance', intent: 'social' },
            { id: 'trade_caravan', label: 'Trade with the merchants', intent: 'buy' },
            { id: 'ignore_caravan', label: 'Pass them by', intent: 'travel' }
        ]
    },
    {
        id: 'road_highway_bandits',
        name: "Highway Bandits",
        type: 'combat',
        description: "A group of rough-looking bandits emerges from the roadside, demanding your valuables. 'Your coin or your life!'",
        challengeRating: 1.5,
        enemyIds: ['goblin', 'orc'],
        rewards: { xp: 250, currency: 100 }
    },
    {
        id: 'plains_sudden_storm',
        name: "Sudden Storm",
        type: 'environmental',
        description: "The sky quickly darkens, and a fierce thunderstorm rolls in. The wind howls, and rain begins to lash down.",
        choices: [
            { id: 'seek_shelter', label: 'Seek immediate shelter', intent: 'travel', staminaCost: 5 },
            { id: 'brave_storm', label: 'Brave the elements', intent: 'travel', staminaCost: 10 }
        ]
    },

    // === Dungeon Encounters ===
    {
        id: 'dungeon_kobold_trap',
        name: "Kobold Trap",
        type: 'combat',
        description: "You trigger a hidden tripwire, and a hail of darts flies from the walls! Kobolds scurry from the shadows.",
        challengeRating: 1,
        enemyIds: ['kobold', 'kobold', 'kobold'],
        rewards: { xp: 100, itemIds: ['dagger_standard'] }
    },
    {
        id: 'dungeon_rotting_corpse',
        name: "Rotting Corpse",
        type: 'discovery',
        description: "A foul stench leads you to a partially devoured corpse. It looks like it might have been an adventurer, and a few items are scattered nearby.",
        rewards: { xp: 10, currency: 25, itemIds: ['pot_heal'] },
        choices: [
            { id: 'loot_corpse', label: 'Search the corpse', intent: 'discovery' },
            { id: 'leave_corpse', label: 'Leave the corpse', intent: 'travel' }
        ]
    },

    // === Water/Coastal Encounters ===
    {
        id: 'water_sahuagin_patrol',
        name: "Sahuagin Patrol",
        type: 'combat',
        description: "While near the coastline, a group of sahuagin (fish-folk) emerge from the waves, hostile and brandishing tridents.",
        challengeRating: 2,
        enemyIds: ['sahuagin', 'sahuagin'],
        rewards: { xp: 300, currency: 75 }
    },

    // === Coastal Encounters ===
    {
        id: 'coast_drowned_sailors',
        name: "Drowned Sailors",
        type: 'combat',
        description: "A sudden fog rolls in, and waterlogged figures shamble from the surf, dragging rusted anchors behind them.",
        challengeRating: 1,
        enemyIds: ['drowned_sailor', 'drowned_sailor'],
        rewards: { xp: 180, currency: 40, itemIds: ['storm_lantern'] }
    },
    {
        id: 'coast_reef_stalker',
        name: "Reef Stalker",
        type: 'combat',
        description: "The tide pools shimmer unnaturally before a reef stalker lunges from the rocks, teeth flashing like coral blades.",
        challengeRating: 2,
        enemyIds: ['reef_stalker'],
        rewards: { xp: 300, currency: 60, itemIds: ['mariners_compass'] }
    },
    {
        id: 'coast_lighthouse_signal',
        name: "The Lighthouse Signal",
        type: 'discovery',
        description: "From the cliffs, a distant lighthouse flares a warning pattern. Someone is signaling for help across the stormy channel.",
        rewards: { xp: 50, itemIds: ['storm_lantern'] },
        choices: [
            { id: 'answer_signal', label: 'Answer the signal', intent: 'discovery' },
            { id: 'mark_on_map', label: 'Mark the pattern on your map', intent: 'discovery' },
            { id: 'ignore_signal', label: 'Ignore it for now', intent: 'travel' }
        ]
    },
    // === Additional Forest Encounters ===
    {
        id: 'forest_wolf_pack',
        name: "Hungry Wolf Pack",
        type: 'combat',
        description: "A pack of wolves emerges from the underbrush, driven by hunger. Their eyes gleam with predatory intent.",
        challengeRating: 1,
        enemyIds: ['wolf', 'wolf', 'wolf', 'dire_wolf'],
        rewards: { xp: 200, itemIds: ['leather_hide'] }
    },
    {
        id: 'forest_treant_guardian',
        name: "Treant Guardian",
        type: 'social',
        description: "An ancient treant blocks your path, demanding to know your purpose in these woods. Its eyes glow with ancient wisdom.",
        npcId: 'treant_guardian',
        rewards: { xp: 100 },
        choices: [
            { id: 'speak_treant', label: 'Speak respectfully', intent: 'social' },
            { id: 'attack_treant', label: 'Attack the treant', intent: 'combat' },
            { id: 'flee_treant', label: 'Flee into the woods', intent: 'travel' }
        ]
    },
    {
        id: 'forest_pixie_mischief',
        name: "Pixie Mischief",
        type: 'social',
        description: "Tiny laughter echoes through the trees as pixies flit about, clearly up to some mischief. One offers to trade secrets.",
        rewards: { xp: 50 },
        choices: [
            { id: 'trade_pixie', label: 'Trade with the pixies', intent: 'social' },
            { id: 'ignore_pixie', label: 'Ignore them and move on', intent: 'travel' },
            { id: 'catch_pixie', label: 'Try to catch one', intent: 'combat' }
        ]
    },
    {
        id: 'forest_owlbear_den',
        name: "Owlbear Den",
        type: 'combat',
        description: "You stumble upon an owlbear's den. The massive creature rises, protecting its territory with a fearsome screech.",
        challengeRating: 3,
        enemyIds: ['owlbear'],
        rewards: { xp: 700, itemIds: ['healing_herb', 'healing_herb'] }
    },
    {
        id: 'forest_druid_circle',
        name: "Druid Circle",
        type: 'social',
        description: "You discover a hidden druid circle, where robed figures perform a ritual around standing stones. They notice your approach.",
        npcId: 'druid_elder',
        rewards: { xp: 75, itemIds: ['healing_herb'] },
        choices: [
            { id: 'observe_druid', label: 'Observe respectfully', intent: 'social' },
            { id: 'approach_druid', label: 'Approach and introduce yourself', intent: 'social' },
            { id: 'leave_druid', label: 'Leave quietly', intent: 'travel' }
        ]
    },
    {
        id: 'forest_spider_nest',
        name: "Spider Nest",
        type: 'combat',
        description: "Webs cover the trees ahead. You've wandered into a giant spider's territory, and its children are hungry.",
        challengeRating: 2,
        enemyIds: ['giant_spider', 'giant_spider'],
        rewards: { xp: 450, itemIds: ['poisonous_plant'] }
    },
    {
        id: 'forest_elven_patrol',
        name: "Elven Patrol",
        type: 'social',
        description: "Elven rangers materialize from the trees, arrows nocked. They demand to know your business in their forest.",
        npcId: 'elven_ranger',
        rewards: { xp: 50 },
        choices: [
            { id: 'explain_elf', label: 'Explain your peaceful purpose', intent: 'social' },
            { id: 'bribe_elf', label: 'Offer a gift', intent: 'social' },
            { id: 'fight_elf', label: 'Refuse to answer', intent: 'combat' }
        ]
    },

    // === Mountain Encounters ===
    {
        id: 'mountain_harpy_nest',
        name: "Harpy Nest",
        type: 'combat',
        description: "Screeching fills the air as harpies descend from their cliff-side nests, their song already trying to lure you closer.",
        challengeRating: 2,
        enemyIds: ['harpy', 'harpy'],
        rewards: { xp: 400, currency: 100 }
    },
    {
        id: 'mountain_giant_ambush',
        name: "Giant Ambush",
        type: 'combat',
        description: "Boulders come crashing down the mountainside! Hill giants have spotted you and are launching an attack.",
        challengeRating: 5,
        enemyIds: ['hill_giant'],
        rewards: { xp: 1800, currency: 500 }
    },
    {
        id: 'mountain_griffon_encounter',
        name: "Griffon Encounter",
        type: 'combat',
        description: "A griffon swoops down from a nearby peak, viewing you as prey or perhaps protecting its nest.",
        challengeRating: 2,
        enemyIds: ['griffon'],
        rewards: { xp: 450, itemIds: ['phoenix_feather'] }
    },
    {
        id: 'mountain_dwarf_miners',
        name: "Dwarven Miners",
        type: 'social',
        description: "You encounter a group of dwarven miners, their pickaxes ringing against stone. They eye you warily.",
        npcId: 'dwarf_miner',
        rewards: { xp: 50, itemIds: ['iron_ingot'] },
        choices: [
            { id: 'trade_dwarf', label: 'Trade with them', intent: 'buy' },
            { id: 'help_dwarf', label: 'Offer to help', intent: 'social' },
            { id: 'pass_dwarf', label: 'Pass by politely', intent: 'travel' }
        ]
    },
    {
        id: 'mountain_avalanche',
        name: "Avalanche",
        type: 'environmental',
        description: "A rumble from above signals disaster—an avalanche is bearing down on you!",
        choices: [
            { id: 'run_avalanche', label: 'Run for cover', intent: 'travel', staminaCost: 15 },
            { id: 'dig_in', label: 'Dig in and brace', intent: 'travel', staminaCost: 10 }
        ]
    },
    {
        id: 'mountain_wyvern_attack',
        name: "Wyvern Attack",
        type: 'combat',
        description: "The shadow of a wyvern passes overhead, and then the venomous beast dives toward you, stinger gleaming.",
        challengeRating: 6,
        enemyIds: ['wyvern'],
        rewards: { xp: 2300, itemIds: ['poisonous_plant', 'poisonous_plant'] }
    },

    // === Desert/Wasteland Encounters ===
    {
        id: 'desert_sandstorm',
        name: "Sandstorm",
        type: 'environmental',
        description: "The sky darkens as a massive sandstorm approaches. You need to find shelter or face the scouring winds.",
        choices: [
            { id: 'shelter_sandstorm', label: 'Find shelter quickly', intent: 'travel', staminaCost: 10 },
            { id: 'brave_sandstorm', label: 'Push through', intent: 'travel', staminaCost: 20 }
        ]
    },
    {
        id: 'desert_scorpion_swarm',
        name: "Giant Scorpion Attack",
        type: 'combat',
        description: "The sand shifts beneath your feet as giant scorpions burst forth, their stingers dripping venom.",
        challengeRating: 3,
        enemyIds: ['giant_scorpion', 'giant_scorpion'],
        rewards: { xp: 700, itemIds: ['poisonous_plant'] }
    },
    {
        id: 'desert_mirage',
        name: "Mirage or Oasis?",
        type: 'discovery',
        description: "In the distance, you see what appears to be an oasis. Is it real, or just another cruel desert mirage?",
        rewards: { xp: 25 },
        choices: [
            { id: 'investigate_mirage', label: 'Investigate the oasis', intent: 'discovery' },
            { id: 'ignore_mirage', label: 'Assume it\'s a mirage', intent: 'travel' }
        ]
    },
    {
        id: 'desert_mummy_tomb',
        name: "Ancient Tomb",
        type: 'discovery',
        description: "You discover the entrance to an ancient tomb, half-buried in the sand. Ancient warnings are carved above the entrance.",
        rewards: { xp: 100 },
        choices: [
            { id: 'enter_tomb', label: 'Enter the tomb', intent: 'discovery' },
            { id: 'leave_tomb', label: 'Leave it undisturbed', intent: 'travel' }
        ]
    },
    {
        id: 'desert_blue_dragon',
        name: "Blue Dragon Ambush",
        type: 'combat',
        description: "Lightning crackles across the dunes as a blue dragon erupts from beneath the sand, electricity arcing from its jaws.",
        challengeRating: 9,
        enemyIds: ['young_dragon_blue'],
        rewards: { xp: 5000, currency: 2000, itemIds: ['dragon_scale_blue'] }
    },
    {
        id: 'desert_nomad_camp',
        name: "Nomad Camp",
        type: 'social',
        description: "You spot a nomad encampment in the distance. Colorful tents flutter in the desert wind.",
        npcId: 'nomad_chief',
        rewards: { xp: 50, itemIds: ['waterskin'] },
        choices: [
            { id: 'approach_nomads', label: 'Approach peacefully', intent: 'social' },
            { id: 'trade_nomads', label: 'Request to trade', intent: 'buy' },
            { id: 'avoid_nomads', label: 'Avoid the camp', intent: 'travel' }
        ]
    },

    // === Swamp Encounters ===
    {
        id: 'swamp_hag_coven',
        name: "Hag Coven",
        type: 'social',
        description: "Three hags cackle around a bubbling cauldron. They offer a deal—power in exchange for something precious.",
        npcId: 'hag_coven',
        rewards: { xp: 100 },
        choices: [
            { id: 'deal_hags', label: 'Hear their offer', intent: 'social' },
            { id: 'attack_hags', label: 'Attack the hags', intent: 'combat' },
            { id: 'flee_hags', label: 'Flee before they notice', intent: 'travel' }
        ]
    },
    {
        id: 'swamp_shambling_mound',
        name: "Shambling Mound",
        type: 'combat',
        description: "What you thought was a pile of rotting vegetation rises up—a shambling mound, hungry for life force.",
        challengeRating: 5,
        enemyIds: ['shambling_mound'],
        rewards: { xp: 1800, itemIds: ['healing_herb', 'healing_herb'] }
    },
    {
        id: 'swamp_lizardfolk',
        name: "Lizardfolk Hunters",
        type: 'social',
        description: "Lizardfolk hunters emerge from the murky water, regarding you with alien curiosity. They seem more curious than hostile.",
        npcId: 'lizardfolk_hunter',
        rewards: { xp: 50 },
        choices: [
            { id: 'trade_lizard', label: 'Attempt to trade', intent: 'buy' },
            { id: 'talk_lizard', label: 'Try to communicate', intent: 'social' },
            { id: 'attack_lizard', label: 'Attack them', intent: 'combat' }
        ]
    },
    {
        id: 'swamp_will_o_wisp',
        name: "Will-o'-Wisp",
        type: 'combat',
        description: "Strange lights dance in the mist, leading you deeper into the swamp. Too late, you realize they're will-o'-wisps!",
        challengeRating: 2,
        enemyIds: ['will_o_wisp', 'will_o_wisp'],
        rewards: { xp: 450, itemIds: ['gem_dust'] }
    },
    {
        id: 'swamp_hydra',
        name: "Hydra Lair",
        type: 'combat',
        description: "The water churns as multiple serpentine heads rise from the murk—you've stumbled into a hydra's territory.",
        challengeRating: 8,
        enemyIds: ['hydra'],
        rewards: { xp: 3900, currency: 500 }
    },

    // === Underdark/Cave Encounters ===
    {
        id: 'cave_drow_patrol',
        name: "Drow Patrol",
        type: 'combat',
        description: "Dark elves materialize from the shadows, their eyes glinting with malice. You've been spotted by a drow patrol.",
        challengeRating: 4,
        enemyIds: ['drow', 'drow', 'drow'],
        rewards: { xp: 1100, currency: 200 }
    },
    {
        id: 'cave_mind_flayer',
        name: "Mind Flayer Ambush",
        type: 'combat',
        description: "Pain lances through your mind as a mind flayer's telepathic assault hits you. It hungers for your brain.",
        challengeRating: 7,
        enemyIds: ['mind_flayer'],
        rewards: { xp: 2900, itemIds: ['gem_dust', 'gem_dust'] }
    },
    {
        id: 'cave_myconid_colony',
        name: "Myconid Colony",
        type: 'social',
        description: "Mushroom folk emerge from the fungal forest, communicating through spores. They seem peaceful but wary.",
        npcId: 'myconid_sovereign',
        rewards: { xp: 75, itemIds: ['healing_herb'] },
        choices: [
            { id: 'commune_myconid', label: 'Share spores to communicate', intent: 'social' },
            { id: 'leave_myconid', label: 'Leave peacefully', intent: 'travel' }
        ]
    },
    {
        id: 'cave_gelatinous_cube',
        name: "Gelatinous Cube",
        type: 'combat',
        description: "The corridor ahead seems clear, until you realize the entire passage is filled with a translucent, acidic cube.",
        challengeRating: 2,
        enemyIds: ['gelatinous_cube'],
        rewards: { xp: 450, currency: 100 }
    },
    {
        id: 'cave_beholder',
        name: "Beholder's Domain",
        type: 'combat',
        description: "A massive eye opens in the darkness—you've wandered into a beholder's lair. Multiple smaller eyes swivel toward you.",
        challengeRating: 13,
        enemyIds: ['beholder'],
        rewards: { xp: 10000, currency: 3000, itemIds: ['beholder_eye'] }
    },
    {
        id: 'cave_rust_monster',
        name: "Rust Monster Infestation",
        type: 'combat',
        description: "Your metal equipment begins to tingle—rust monsters! They're attracted to your gear and moving fast.",
        challengeRating: 0.5,
        enemyIds: ['rust_monster', 'rust_monster'],
        rewards: { xp: 200 }
    },

    // === Urban Encounters ===
    {
        id: 'city_pickpocket',
        name: "Pickpocket",
        type: 'social',
        description: "You feel a hand brush against your coin purse. A young pickpocket is trying to steal from you!",
        rewards: { xp: 25 },
        choices: [
            { id: 'catch_pickpocket', label: 'Grab the thief', intent: 'combat' },
            { id: 'let_go', label: 'Let them go', intent: 'social' },
            { id: 'follow_pickpocket', label: 'Follow them discreetly', intent: 'discovery' }
        ]
    },
    {
        id: 'city_street_performer',
        name: "Street Performer",
        type: 'social',
        description: "A talented bard performs in the square, drawing quite a crowd. They spot you and call out for a volunteer.",
        npcId: 'street_bard',
        rewards: { xp: 25 },
        choices: [
            { id: 'volunteer', label: 'Volunteer to help', intent: 'social' },
            { id: 'watch_perform', label: 'Watch the performance', intent: 'social' },
            { id: 'move_on', label: 'Move on', intent: 'travel' }
        ]
    },
    {
        id: 'city_guard_checkpoint',
        name: "Guard Checkpoint",
        type: 'social',
        description: "City guards have set up a checkpoint, questioning everyone who passes. They eye your weapons suspiciously.",
        npcId: 'city_guard',
        rewards: { xp: 25 },
        choices: [
            { id: 'comply_guard', label: 'Answer their questions', intent: 'social' },
            { id: 'bribe_guard', label: 'Slip them a bribe', intent: 'social' },
            { id: 'evade_guard', label: 'Try to slip past', intent: 'travel' }
        ]
    },
    {
        id: 'city_tavern_brawl',
        name: "Tavern Brawl",
        type: 'combat',
        description: "The tavern erupts into chaos as a brawl breaks out. Someone swings a chair at your head!",
        challengeRating: 0.5,
        enemyIds: ['bandit', 'bandit'],
        rewards: { xp: 100, currency: 25 }
    },
    {
        id: 'city_mysterious_stranger',
        name: "Mysterious Stranger",
        type: 'social',
        description: "A cloaked figure approaches you in an alley, offering information about a hidden treasure for a price.",
        npcId: 'mysterious_stranger',
        rewards: { xp: 50 },
        choices: [
            { id: 'pay_stranger', label: 'Pay for the information', intent: 'buy' },
            { id: 'refuse_stranger', label: 'Refuse and walk away', intent: 'travel' },
            { id: 'threaten_stranger', label: 'Demand the information', intent: 'combat' }
        ]
    },

    // === Planar Encounters ===
    {
        id: 'planar_demon_encounter',
        name: "Demonic Incursion",
        type: 'combat',
        description: "Reality tears open as demons pour through a rift! They howl with bloodlust as they spot you.",
        challengeRating: 6,
        enemyIds: ['vrock', 'hezrou'],
        rewards: { xp: 6200, itemIds: ['demon_ichor'] }
    },
    {
        id: 'planar_angel_messenger',
        name: "Celestial Messenger",
        type: 'social',
        description: "A being of pure light descends—a celestial messenger bearing divine news or perhaps a warning.",
        npcId: 'celestial_messenger',
        rewards: { xp: 200 },
        choices: [
            { id: 'listen_angel', label: 'Listen to its message', intent: 'social' },
            { id: 'ask_angel', label: 'Ask for guidance', intent: 'social' },
            { id: 'attack_angel', label: 'Attack it (evil only)', intent: 'combat' }
        ]
    },
    {
        id: 'planar_elemental_surge',
        name: "Elemental Surge",
        type: 'combat',
        description: "The boundary between planes weakens, and elementals surge through! Fire, water, air, and earth collide.",
        challengeRating: 5,
        enemyIds: ['fire_elemental', 'water_elemental'],
        rewards: { xp: 3600, itemIds: ['elemental_core'] }
    },

    // === Special/Rare Encounters ===
    {
        id: 'special_dragon_flight',
        name: "Dragon Flight",
        type: 'discovery',
        description: "An ancient dragon soars overhead, its shadow blocking out the sun. It seems focused on something in the distance.",
        rewards: { xp: 100 },
        choices: [
            { id: 'hide_dragon', label: 'Hide and observe', intent: 'discovery' },
            { id: 'follow_dragon', label: 'Follow from a distance', intent: 'travel' },
            { id: 'ignore_dragon', label: 'Continue on your way', intent: 'travel' }
        ]
    },
    {
        id: 'special_unicorn_blessing',
        name: "Unicorn Blessing",
        type: 'social',
        description: "A unicorn appears in a clearing, its horn glowing with pure light. It regards you with knowing eyes.",
        npcId: 'unicorn_spirit',
        rewards: { xp: 200, itemIds: ['pot_heal_greater'] },
        choices: [
            { id: 'approach_unicorn', label: 'Approach respectfully', intent: 'social' },
            { id: 'bow_unicorn', label: 'Bow in reverence', intent: 'social' },
            { id: 'leave_unicorn', label: 'Leave it in peace', intent: 'travel' }
        ]
    },
    {
        id: 'special_merchant_fair',
        name: "Wandering Merchant",
        type: 'social',
        description: "A peculiar merchant with a cart full of odd items waves you over. 'Rare goods! Wonders from distant lands!'",
        npcId: 'wandering_merchant',
        rewards: { xp: 25 },
        choices: [
            { id: 'browse_merchant', label: 'Browse the wares', intent: 'buy' },
            { id: 'chat_merchant', label: 'Ask about travels', intent: 'social' },
            { id: 'pass_merchant', label: 'Politely decline', intent: 'travel' }
        ]
    },
    {
        id: 'special_time_distortion',
        name: "Time Distortion",
        type: 'environmental',
        description: "The world around you shimmers and distorts. Time seems to flow strangely here.",
        rewards: { xp: 50 },
        choices: [
            { id: 'wait_distortion', label: 'Wait for it to pass', intent: 'travel' },
            { id: 'explore_distortion', label: 'Explore the phenomenon', intent: 'discovery' },
            { id: 'flee_distortion', label: 'Run away quickly', intent: 'travel', staminaCost: 10 }
        ]
    },

    // === NEW: Desert Region Encounters ===
    {
        id: 'desert_dust_devil',
        name: "Dust Devil",
        type: 'environmental',
        description: "A swirling column of sand and debris races across the dunes toward you, growing larger by the second.",
        choices: [
            { id: 'dodge_devil', label: 'Dive to the side', intent: 'travel', staminaCost: 8 },
            { id: 'hunker_down', label: 'Drop flat and cover up', intent: 'travel', staminaCost: 5 }
        ]
    },
    {
        id: 'desert_pyramid_guardian',
        name: "Pyramid Guardian",
        type: 'combat',
        description: "As you approach the ancient pyramid, a massive animated suit of armor steps from the entrance, its eyes blazing with arcane fire.",
        challengeRating: 4,
        enemyIds: ['helmed_horror'],
        rewards: { xp: 1100, currency: 300, itemIds: ['armor_chain_mail'] }
    },
    {
        id: 'desert_buried_treasure',
        name: "Buried Treasure",
        type: 'discovery',
        description: "The wind shifts the sand to reveal the corner of a buried chest. Ancient runes are carved into its surface.",
        rewards: { xp: 75, currency: 200 },
        choices: [
            { id: 'dig_treasure', label: 'Dig it up carefully', intent: 'discovery' },
            { id: 'detect_traps', label: 'Check for traps first', intent: 'discovery' },
            { id: 'leave_buried', label: 'Leave it alone', intent: 'travel' }
        ]
    },

    // === NEW: Underdark Encounters ===
    {
        id: 'underdark_hook_horror',
        name: "Hook Horror Ambush",
        type: 'combat',
        description: "Clicking echoes through the cavern before hook-clawed monstrosities drop from the ceiling, their vulture-like heads screeching.",
        challengeRating: 3,
        enemyIds: ['hook_horror', 'hook_horror'],
        rewards: { xp: 1400, itemIds: ['iron_ingot'] }
    },
    {
        id: 'underdark_drider_web',
        name: "Drider's Web",
        type: 'combat',
        description: "Sticky webs cover the tunnel ahead. A drider — a drow cursed into spider-form — emerges from the darkness above.",
        challengeRating: 6,
        enemyIds: ['drider'],
        rewards: { xp: 2300, currency: 300 }
    },
    {
        id: 'underdark_aboleth_whisper',
        name: "Aboleth's Whisper",
        type: 'social',
        description: "A voice echoes in your mind, ancient and alien. An aboleth reaches out telepathically, offering forbidden knowledge.",
        rewards: { xp: 150 },
        choices: [
            { id: 'listen_aboleth', label: 'Open your mind to it', intent: 'social' },
            { id: 'resist_aboleth', label: 'Resist the telepathy', intent: 'social' },
            { id: 'flee_aboleth', label: 'Get away immediately', intent: 'travel', staminaCost: 10 }
        ]
    },
    {
        id: 'underdark_purple_worm',
        name: "Purple Worm Tremor",
        type: 'combat',
        description: "The ground shakes violently before a colossal purple worm erupts through the stone floor, its maw wide enough to swallow a horse.",
        challengeRating: 15,
        enemyIds: ['purple_worm'],
        rewards: { xp: 13000, currency: 1000 }
    },

    // === NEW: Feywild Encounters ===
    {
        id: 'fey_displacer_hunt',
        name: "Displacer Beast Hunt",
        type: 'combat',
        description: "A sleek panther-like beast flickers and shifts, never quite where it appears to be. Its tentacles lash out from impossible angles.",
        challengeRating: 3,
        enemyIds: ['displacer_beast'],
        rewards: { xp: 700, itemIds: ['displacer_cloak'] }
    },
    {
        id: 'fey_green_hag_bargain',
        name: "The Hag's Bargain",
        type: 'social',
        description: "A green hag blocks the forest path, offering enchantments in exchange for a year of your memories.",
        rewards: { xp: 100 },
        choices: [
            { id: 'accept_hag', label: 'Accept her bargain', intent: 'social' },
            { id: 'refuse_hag', label: 'Politely refuse', intent: 'social' },
            { id: 'fight_hag', label: 'Attack her', intent: 'combat' }
        ]
    },
    {
        id: 'fey_enchanted_pool',
        name: "Enchanted Pool",
        type: 'discovery',
        description: "A pool of liquid moonlight shimmers in a clearing. Drinking from it could bestow a blessing — or a curse.",
        rewards: { xp: 75 },
        choices: [
            { id: 'drink_pool', label: 'Drink from the pool', intent: 'discovery' },
            { id: 'fill_flask', label: 'Fill a flask with the water', intent: 'discovery' },
            { id: 'walk_away_pool', label: 'Walk away', intent: 'travel' }
        ]
    },

    // === NEW: Volcanic / Fire Encounters ===
    {
        id: 'volcano_lava_flow',
        name: "Lava Flow",
        type: 'environmental',
        description: "The ground cracks open ahead of you and molten lava begins to ooze across the path, cutting off your route.",
        choices: [
            { id: 'jump_lava', label: 'Leap across the flow', intent: 'travel', staminaCost: 15 },
            { id: 'find_path', label: 'Find another way around', intent: 'travel', staminaCost: 8 },
            { id: 'wait_lava', label: 'Wait for it to cool', intent: 'rest' }
        ]
    },
    {
        id: 'volcano_fire_elemental',
        name: "Fire Elemental Eruption",
        type: 'combat',
        description: "A pillar of magma erupts and takes humanoid form — a fire elemental, crackling with fury.",
        challengeRating: 5,
        enemyIds: ['fire_elemental'],
        rewards: { xp: 1800, itemIds: ['elemental_core'] }
    },
    {
        id: 'volcano_iron_golem',
        name: "The Iron Sentinel",
        type: 'combat',
        description: "Deep in the fire giant's forge, an iron golem stands sentinel. Its eyes glow red as it activates, steam hissing from its joints.",
        challengeRating: 16,
        enemyIds: ['iron_golem'],
        rewards: { xp: 15000, currency: 2000, itemIds: ['armor_plate'] }
    },

    // === NEW: Coastal Expansion ===
    {
        id: 'coast_kraken_tentacle',
        name: "Kraken Tentacle",
        type: 'combat',
        description: "The sea churns as a massive tentacle erupts from the waves, smashing against the dock. Something immense lurks below.",
        challengeRating: 23,
        enemyIds: ['kraken'],
        rewards: { xp: 50000, currency: 10000 }
    },
    {
        id: 'coast_pirate_ambush',
        name: "Pirate Ambush",
        type: 'combat',
        description: "A jolly roger unfurls as a hidden pirate skiff emerges from behind the rocks. 'Hand over your cargo!'",
        challengeRating: 2,
        enemyIds: ['bandit', 'bandit', 'orc'],
        rewards: { xp: 350, currency: 150 }
    },
    {
        id: 'coast_message_bottle',
        name: "Message in a Bottle",
        type: 'discovery',
        description: "A glass bottle washes ashore, containing a weathered letter. The handwriting is desperate and the ink smeared by sea water.",
        rewards: { xp: 50 },
        choices: [
            { id: 'read_message', label: 'Read the message', intent: 'discovery' },
            { id: 'toss_bottle', label: 'Throw it back to sea', intent: 'travel' }
        ]
    },

    // === NEW: Northern Wastes Encounters ===
    {
        id: 'tundra_yeti_attack',
        name: "Abominable Yeti",
        type: 'combat',
        description: "A towering white shape charges through the blizzard — an abominable yeti, its freezing gaze already turning your blood to ice.",
        challengeRating: 9,
        enemyIds: ['abominable_yeti'],
        rewards: { xp: 5000, itemIds: ['yeti_pelt'] }
    },
    {
        id: 'tundra_blizzard',
        name: "Blinding Blizzard",
        type: 'environmental',
        description: "A devastating blizzard rolls in from the north. Visibility drops to nothing and the cold cuts through every layer.",
        choices: [
            { id: 'build_shelter', label: 'Build an emergency shelter', intent: 'rest', staminaCost: 15 },
            { id: 'push_blizzard', label: 'Push through the storm', intent: 'travel', staminaCost: 25 }
        ]
    },
    {
        id: 'tundra_frozen_traveler',
        name: "Frozen Traveler",
        type: 'discovery',
        description: "You find a traveler frozen solid in the ice, their expression one of terror. They clutch a leather satchel to their chest.",
        rewards: { xp: 50, currency: 75 },
        choices: [
            { id: 'thaw_traveler', label: 'Try to thaw and revive them', intent: 'social' },
            { id: 'take_satchel', label: 'Take the satchel', intent: 'discovery' },
            { id: 'mark_location', label: 'Mark the location and move on', intent: 'travel' }
        ]
    },

    // === NEW: Urban Expansion ===
    {
        id: 'city_sewer_encounter',
        name: "Sewer Ambush",
        type: 'combat',
        description: "In the fetid tunnels beneath the city, a gelatinous cube oozes toward you, dissolving everything in its path.",
        challengeRating: 2,
        enemyIds: ['gelatinous_cube'],
        rewards: { xp: 450, currency: 100, itemIds: ['pot_heal'] }
    },
    {
        id: 'city_cult_ritual',
        name: "Cult Ritual",
        type: 'discovery',
        description: "In the abandoned basement of a clock tower, hooded figures chant around a glowing sigil. Dark energy crackles in the air.",
        rewards: { xp: 100 },
        choices: [
            { id: 'interrupt_ritual', label: 'Interrupt the ritual', intent: 'combat' },
            { id: 'spy_ritual', label: 'Observe from the shadows', intent: 'discovery' },
            { id: 'report_ritual', label: 'Report to the guards', intent: 'social' }
        ]
    },
    {
        id: 'city_gladiator_challenge',
        name: "Gladiator Challenge",
        type: 'combat',
        description: "The arena master calls for challengers! A minotaur champion paws the ground in the fighting pit, eager for blood.",
        challengeRating: 3,
        enemyIds: ['minotaur'],
        rewards: { xp: 700, currency: 500 }
    },

    // === NEW: Celestial/Planar Encounters ===
    {
        id: 'planar_death_knight',
        name: "Death Knight's Challenge",
        type: 'combat',
        description: "A death knight materializes from shadow, its burning eyes fixed on you. 'Prove your worth or perish,' it intones.",
        challengeRating: 17,
        enemyIds: ['death_knight'],
        rewards: { xp: 18000, currency: 5000, itemIds: ['armor_plate'] }
    },
    {
        id: 'planar_solar_trial',
        name: "Solar's Trial",
        type: 'social',
        description: "A radiant solar descends, wings of pure light spreading across the sky. It offers to test your worthiness with a trial of character.",
        rewards: { xp: 500 },
        choices: [
            { id: 'accept_trial', label: 'Accept the trial', intent: 'social' },
            { id: 'decline_trial', label: 'Respectfully decline', intent: 'travel' },
            { id: 'ask_purpose', label: 'Ask why you were chosen', intent: 'social' }
        ]
    },
    {
        id: 'planar_balor_invasion',
        name: "Balor Invasion",
        type: 'combat',
        description: "The sky splits red as a balor — a demon lord wreathed in flame — strides through a portal, whip cracking like thunder.",
        challengeRating: 19,
        enemyIds: ['balor'],
        rewards: { xp: 22000, currency: 5000 }
    }
];
