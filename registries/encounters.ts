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
        enemyIds: ['sahuagin', 'sahuagin'], // Assuming 'sahuagin' enemy exists
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
    {
        id: 'coast_crab_scavengers',
        name: "Crab Scavengers",
        type: 'combat',
        description: "A tide pool erupts with chittering claws as oversized sand crabs scuttle toward your supplies.",
        challengeRating: 1,
        enemyIds: ['sand_crab', 'sand_crab'],
        rewards: { xp: 120, itemIds: ['dried_meat'] }
    },
    {
        id: 'coast_salvage_cache',
        name: "Salvage Cache",
        type: 'discovery',
        description: "Wedged between rocks lies a barnacle-crusted chest with a faded shipping mark.",
        rewards: { xp: 60, currency: 80, itemIds: ['sea_chart'] },
        choices: [
            { id: 'pry_cache', label: 'Pry it open', intent: 'discovery' },
            { id: 'haul_cache', label: 'Haul it back to harbor', intent: 'travel' }
        ]
    },
    {
        id: 'coast_pirate_pressgang',
        name: "Pirate Pressgang",
        type: 'combat',
        description: "A skiff scrapes the shore and a band of pirates rushes in, demanding you join their crew or pay in coin.",
        challengeRating: 2,
        enemyIds: ['pirate_raider', 'pirate_raider'],
        rewards: { xp: 260, currency: 120, itemIds: ['signal_flare'] }
    },
    {
        id: 'coast_reef_serpent',
        name: "Reef Serpent",
        type: 'combat',
        description: "The water churns as a reef serpent lunges from below, coils gleaming with wet sand.",
        challengeRating: 2,
        enemyIds: ['reef_serpent'],
        rewards: { xp: 280, itemIds: ['harpoon'] }
    },
    {
        id: 'coast_kelp_wraith',
        name: "Kelp Wraith",
        type: 'combat',
        description: "A spectral figure rises from the kelp, dragging strands of seaweed like chains.",
        challengeRating: 2,
        enemyIds: ['kelp_wraith'],
        rewards: { xp: 260, currency: 70, itemIds: ['storm_lantern'] }
    },
    {
        id: 'coast_stormwatch_patrol',
        name: "Stormwatch Patrol",
        type: 'social',
        description: "Harbor guards wave you down, checking for smugglers and warning of pirate sails near the reef.",
        rewards: { xp: 40 },
        choices: [
            { id: 'share_info', label: 'Share what you know', intent: 'social' },
            { id: 'offer_help', label: 'Offer to help the patrol', intent: 'social' },
            { id: 'move_along', label: 'Move along quietly', intent: 'travel' }
        ]
    },
    {
        id: 'coast_shipwright_request',
        name: "Shipwright's Request",
        type: 'discovery',
        description: "A shipwright calls for extra hands to haul a damaged hull into the yard before the tide shifts.",
        rewards: { xp: 45, itemIds: ['shipwright_tools'] },
        choices: [
            { id: 'assist_shipwright', label: 'Lend your strength', intent: 'discovery' },
            { id: 'decline_shipwright', label: 'Decline politely', intent: 'travel' }
        ]
    }
];
