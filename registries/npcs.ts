import { NPC } from '../types';

export const NPCS_DB: NPC[] = [
    { 
        id: 'elder_mira', 
        name: "Elder Mira", 
        role: "Village Elder", 
        location: "Willowmere Village", 
        description: "A wise and kind old woman, the spiritual leader of Willowmere. She often has advice, and sometimes, desperate pleas for help.",
        questGiver: true,
        factionAffiliation: "Willowmere Council"
    },
    { 
        id: 'blacksmith_thorn', 
        name: "Thorn Ironhand", 
        role: "Blacksmith", 
        location: "Willowmere Village", 
        description: "A burly dwarf with a booming laugh and calloused hands, known for his sturdy craftsmanship. He buys and sells simple weapons and armor.",
        shopkeeper: true,
        factionAffiliation: "Artisan's Guild"
    },
    { 
        id: 'mayor_corvus', 
        name: "Mayor Corvus", 
        role: "Mayor of Ravenshollow", 
        location: "Ravenshollow", 
        description: "A nervous, stern man burdened by the troubles plaguing his fog-choked town. He seeks brave souls to investigate the marsh.",
        questGiver: true,
        factionAffiliation: "Ravenshollow Town Guard"
    },
    { 
        id: 'witch_elara', 
        name: "Elara Shadowbrook", 
        role: "Hedge Witch", 
        location: "Ravenshollow", 
        description: "A reclusive woman who lives on the outskirts of town, whispered to possess forbidden knowledge and powerful charms. She trades in rare herbs and concoctions.",
        shopkeeper: true
    },
    { 
        id: 'king_thorin', 
        name: "King Thorin Stonebeard", 
        role: "King of Ironhold", 
        location: "Ironhold Citadel", 
        description: "The proud and unyielding ruler of the dwarven kingdom, deeply concerned by the encroaching darkness in the deep mines.",
        questGiver: true,
        factionAffiliation: "Ironhold Royal Family"
    },
    { 
        id: 'archmage_vexis', 
        name: "Archmage Vexis", 
        role: "Head of Arcane Academy", 
        location: "Arcane Academy", 
        description: "A brilliant, enigmatic elven archmage who oversees the most prestigious magical institution in the realms. He is perpetually engrossed in ancient research.",
        factionAffiliation: "Circle of Mages"
    },
    { 
        id: 'queen_alara', 
        name: "Queen Alara Sundancer", 
        role: "Queen of Silverspire", 
        location: "Silverspire City", 
        description: "The graceful and just queen who rules Silverspire, beloved by her people. She strives to maintain peace and prosperity.",
        factionAffiliation: "Silverspire Monarchy"
    },
    {
        id: 'guildmaster_shade',
        name: "Guildmaster Shade",
        role: "Leader of the Shadow Syndicate",
        location: "Shadow Market",
        description: "A shadowy figure whose true identity is unknown. They control the flow of illicit goods and information through the Shadow Market.",
        questGiver: true,
        shopkeeper: true, // For illegal goods
        factionAffiliation: "Shadow Syndicate"
    },
    {
        id: 'archdruid_oak',
        name: "Archdruid Oakheart",
        role: "Guardian of the Grove",
        location: "Druid's Grove",
        description: "An ancient, tree-like druid deeply attuned to the Whispering Woods. They speak for nature and guard its secrets.",
        questGiver: true,
        factionAffiliation: "Circle of the Wild"
    },
    {
        id: 'arena_master',
        name: "Valerius Grimspear",
        role: "Arena Master",
        location: "The Colosseum",
        description: "A grizzled veteran gladiator who now runs the city's colosseum. He's always looking for new champions to entertain the crowds.",
        questGiver: true
    },
    {
        id: 'captain_maris',
        name: "Captain Maris Tideborn",
        role: "Harbor Master",
        location: "Stormwatch Harbor",
        description: "A seasoned navigator who keeps Stormwatch's ships and sailors in line. She seeks brave hands to investigate recent disappearances at sea.",
        questGiver: true,
        factionAffiliation: "Stormwatch Mariners"
    },
    {
        id: 'keeper_nessa',
        name: "Nessa Rayward",
        role: "Lighthouse Keeper",
        location: "Saltwind Lighthouse",
        description: "A vigilant keeper who watches the tides and storms, maintaining the beacon through long, stormy nights.",
        questGiver: true
    },
    {
        id: 'dockmaster_renn',
        name: "Dockmaster Renn",
        role: "Outfitter",
        location: "Stormwatch Harbor",
        description: "A quick-smiling merchant who outfits crews with ropes, lanterns, and navigation gear.",
        shopkeeper: true
    },

    // === Silverspire City NPCs ===
    {
        id: 'captain_voss',
        name: "Captain Helena Voss",
        role: "Commander of the Iron Guard",
        location: "Silverspire City",
        description: "A battle-scarred veteran who commands the city garrison with an iron will. She's always seeking capable adventurers for dangerous missions beyond the walls.",
        questGiver: true,
        factionAffiliation: "Iron Guard"
    },
    {
        id: 'merchant_goldweave',
        name: "Silara Goldweave",
        role: "Master Merchant",
        location: "Silverspire City",
        description: "A shrewd half-elf trader who runs the Golden Exchange. She deals in rare goods from across the realms and always knows the best price for everything.",
        shopkeeper: true,
        factionAffiliation: "Merchant Consortium"
    },
    {
        id: 'spy_whisper',
        name: "Whisper",
        role: "Harper Agent",
        location: "Silverspire City",
        description: "A nondescript figure who blends into any crowd. They pass coded messages in taverns and always seem to know more than they should.",
        questGiver: true,
        factionAffiliation: "Harpers"
    },
    {
        id: 'librarian_aldric',
        name: "Sage Aldric the Chronicler",
        role: "Head Librarian",
        location: "Great Library of Silverspire",
        description: "An elderly gnome with spectacles perched on his nose, surrounded by towering stacks of books. He possesses encyclopedic knowledge of the realm's history.",
        questGiver: true,
        factionAffiliation: "Explorers' League"
    },
    {
        id: 'priest_solana',
        name: "High Priestess Solana",
        role: "Temple Leader",
        location: "Sunspire Cathedral",
        description: "A radiant aasimar who leads the temple of Solarius. Her healing magic is legendary, and she offers blessings to those who fight against darkness.",
        questGiver: true,
        shopkeeper: true,
        factionAffiliation: "Dawn Templars"
    },

    // === Wilderness NPCs ===
    {
        id: 'ranger_fenwick',
        name: "Fenwick Thornwalker",
        role: "Wilderness Guide",
        location: "Whispering Woods",
        description: "A weathered wood elf ranger who knows every trail, den, and hidden glade in the forest. He tracks poachers and protects travelers from beasts.",
        questGiver: true,
        factionAffiliation: "Forest Guardians"
    },
    {
        id: 'hermit_grok',
        name: "Grok the Hermit",
        role: "Alchemist",
        location: "Misty Hollow",
        description: "A half-orc herbalist who lives alone in the swamp, brewing potions from rare fungi and bog plants. His remedies are potent, if foul-smelling.",
        shopkeeper: true
    },
    {
        id: 'dragonborn_hunter',
        name: "Karath Flamescale",
        role: "Monster Hunter",
        location: "Dragon's Spine Mountains",
        description: "A silver dragonborn who hunts the most dangerous creatures in the mountains. He pays well for information about monster lairs.",
        questGiver: true
    },
    {
        id: 'fairy_queen',
        name: "Queen Titania's Emissary",
        role: "Fey Ambassador",
        location: "Feywild Crossing",
        description: "A diminutive but impossibly regal fairy who speaks on behalf of the Summer Court. She offers boons to those who complete fey bargains.",
        questGiver: true
    },
    {
        id: 'centaur_chief',
        name: "Chief Windrunner",
        role: "Centaur Tribal Leader",
        location: "Emerald Plains",
        description: "A proud centaur warrior who leads the plains tribes. He values honor and strength, and may challenge travelers to prove their worth.",
        questGiver: true,
        factionAffiliation: "Emerald Enclave"
    },

    // === Underworld NPCs ===
    {
        id: 'fence_jinx',
        name: "Jinx",
        role: "Fence & Information Broker",
        location: "Shadow Market",
        description: "A wiry halfling with darting eyes who can acquire anything—for the right price. She buys stolen goods and sells secrets.",
        shopkeeper: true,
        factionAffiliation: "Shadow Syndicate"
    },
    {
        id: 'assassin_veil',
        name: "The Veil",
        role: "Nightblade Contact",
        location: "The Hollow (various cities)",
        description: "A figure draped in shadow whose face is never seen. They deliver assassination contracts and collect payment in gold—or souls.",
        questGiver: true,
        factionAffiliation: "Nightblades"
    },
    {
        id: 'pirate_captain_red',
        name: "Captain Redtide",
        role: "Pirate Captain",
        location: "Blacktide Cove",
        description: "A boisterous half-orc pirate captain with a mechanical arm and a heart of questionable gold. She's always recruiting for the next big heist.",
        questGiver: true,
        shopkeeper: true,
        factionAffiliation: "Blacktide Pirates"
    },
    {
        id: 'rat_king_skritch',
        name: "Skritch",
        role: "Rat King",
        location: "The Undercity",
        description: "A hunched figure wrapped in rags who commands an army of rats. He knows every secret passage beneath the cities and trades information for cheese—and coin.",
        questGiver: true,
        factionAffiliation: "Rat Catchers"
    },

    // === Ironhold & Dwarven NPCs ===
    {
        id: 'forgemaster_brunhild',
        name: "Forgemaster Brunhild",
        role: "Master Smith",
        location: "Ironhold Citadel",
        description: "The finest dwarven smith in the realm, her weapons and armor are sought by kings. She only crafts for those who bring her worthy materials.",
        shopkeeper: true,
        factionAffiliation: "Ironhold Royal Family"
    },
    {
        id: 'miner_deep_delve',
        name: "Thurgrim Deep-Delve",
        role: "Mining Foreman",
        location: "Ironhold Mines",
        description: "A grizzled dwarf who oversees the deepest mining operations. He's encountered strange things in the dark and needs help investigating.",
        questGiver: true
    },
    {
        id: 'runesmith_agna',
        name: "Agna Runecarver",
        role: "Runesmith",
        location: "Ironhold Citadel",
        description: "A meticulous dwarven artificer who inscribes magical runes onto weapons and armor. Her enchantments are expensive but powerful.",
        shopkeeper: true
    },

    // === Ravenshollow & Dark NPCs ===
    {
        id: 'gravedigger_mort',
        name: "Mort the Gravedigger",
        role: "Cemetery Keeper",
        location: "Ravenshollow",
        description: "A gaunt, quiet man who tends the ever-expanding cemetery. He's noticed the dead don't always stay buried and whispers of things moving at night.",
        questGiver: true
    },
    {
        id: 'fortune_teller_zara',
        name: "Madame Zara",
        role: "Fortune Teller",
        location: "Ravenshollow",
        description: "A mysterious tiefling seer who reads tarot cards and crystal balls. Her predictions are unsettlingly accurate, and she offers cryptic guidance for a fee.",
        shopkeeper: true
    },
    {
        id: 'vampire_lord_strahd',
        name: "Lord Kazimir",
        role: "Vampire Lord",
        location: "Castle Shadowmere",
        description: "An ancient vampire who rules a domain of dread from his crumbling castle. He is cultured and cruel, inviting adventurers to his domain as entertainment.",
        questGiver: true
    },

    // === Traveling NPCs ===
    {
        id: 'bard_melody',
        name: "Melody Songweaver",
        role: "Traveling Bard",
        location: "Various Taverns",
        description: "A charismatic half-elf bard who travels between taverns, collecting stories and spreading news. She pays handsomely for tales of adventure.",
        questGiver: true
    },
    {
        id: 'tinker_cogsworth',
        name: "Cogsworth",
        role: "Gnome Tinker",
        location: "Traveling Wagon",
        description: "An eccentric rock gnome inventor who travels in a clockwork wagon. He sells bizarre but useful gadgets and always needs rare components.",
        shopkeeper: true
    },
    {
        id: 'bounty_hunter_kael',
        name: "Kael Ironfist",
        role: "Bounty Hunter",
        location: "Various",
        description: "A taciturn goliath bounty hunter covered in scars and trophies. He posts bounties on dangerous criminals and monsters at tavern boards.",
        questGiver: true
    },
    {
        id: 'traveling_merchant_silk',
        name: "Silk",
        role: "Exotic Merchant",
        location: "Trade Roads",
        description: "A mysterious tabaxi merchant who appears seemingly from nowhere, carrying goods from distant and exotic lands. Her prices are fair but her origins unknown.",
        shopkeeper: true
    },

    // === Arcane Academy NPCs ===
    {
        id: 'professor_ignis',
        name: "Professor Ignis",
        role: "Evocation Teacher",
        location: "Arcane Academy",
        description: "A fiery-tempered fire genasi who teaches combat magic. His demonstrations are spectacular and occasionally set things on fire.",
        questGiver: true,
        factionAffiliation: "Circle of Mages"
    },
    {
        id: 'librarian_whisp',
        name: "Whisp",
        role: "Arcane Librarian",
        location: "Arcane Academy",
        description: "A ghostly figure bound to the academy library for centuries. She guides researchers through the stacks and guards the restricted section.",
        shopkeeper: true,
        factionAffiliation: "Circle of Mages"
    },
    {
        id: 'student_nim',
        name: "Nim Sparkfinger",
        role: "Apprentice Wizard",
        location: "Arcane Academy",
        description: "An eager young halfling student whose experiments frequently go wrong. She needs adventurers to help recover escaped magical creatures.",
        questGiver: true,
        factionAffiliation: "Circle of Mages"
    },

    // === Planar NPCs ===
    {
        id: 'djinni_ambassador',
        name: "Zephyros the Windlord",
        role: "Djinni Ambassador",
        location: "Elemental Conflux",
        description: "A noble djinni who serves as diplomat between the elemental planes and the material world. He grants wishes—but always with conditions.",
        questGiver: true
    },
    {
        id: 'githzerai_monk',
        name: "Zerth Kal'thani",
        role: "Githzerai Monk",
        location: "Astral Plane",
        description: "A disciplined githzerai who has achieved mastery over mind and body. She seeks allies against the githyanki and offers psychic training.",
        questGiver: true,
        factionAffiliation: "Planar Watchers"
    },
    {
        id: 'modron_guide',
        name: "Primus-7",
        role: "Modron Guide",
        location: "Mechanus Gate",
        description: "A rogue modron that has gained individuality. It serves as a guide to the plane of absolute order and speaks in precise, logical terms.",
        questGiver: true
    },

    // === Faction Leaders ===
    {
        id: 'zhentarim_boss',
        name: "Darkmaster Ravok",
        role: "Zhentarim Commander",
        location: "Darkhold Fortress",
        description: "A ruthless human warlock who commands the local Zhentarim operations. He offers lucrative but morally questionable contracts.",
        questGiver: true,
        factionAffiliation: "Zhentarim"
    },
    {
        id: 'explorer_league_master',
        name: "Grand Explorer Thessa",
        role: "League Guildmaster",
        location: "Cartographer's Hall",
        description: "A weathered half-elf woman covered in maps and expedition notes. She sends adventurers to uncharted territories and lost ruins.",
        questGiver: true,
        factionAffiliation: "Explorers' League"
    },
    {
        id: 'dragon_cult_leader',
        name: "Wyrmspeaker Malzeth",
        role: "Cult Leader",
        location: "Dragon Shrine",
        description: "A fanatical dragonborn sorcerer who channels the power of Tiamat. He seeks dragon eggs and ancient draconic artifacts.",
        questGiver: true,
        factionAffiliation: "Cult of the Dragon"
    }
];
