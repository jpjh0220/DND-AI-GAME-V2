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

    // === Frontier & Village NPCs ===
    {
        id: 'captain_brynn',
        name: "Captain Brynn Steelhart",
        role: "Town Guard Captain",
        location: "Thornhaven",
        description: "A stern but fair woman who leads Thornhaven's small militia. She worries about increasing goblin raids.",
        questGiver: true,
        factionAffiliation: "Iron Guard"
    },
    {
        id: 'herbalist_sage',
        name: "Sage Willowmoss",
        role: "Herbalist",
        location: "Thornhaven",
        description: "An elderly herbalist with extensive knowledge of medicinal plants. She trades in rare ingredients.",
        shopkeeper: true
    },
    {
        id: 'innkeeper_martha',
        name: "Martha Goodbarrel",
        role: "Innkeeper",
        location: "The Wayward Inn",
        description: "A jolly halfling woman who runs the famous Wayward Inn. She knows all the local gossip.",
        shopkeeper: true,
        questGiver: true
    },
    {
        id: 'mysterious_traveler',
        name: "The Hooded Stranger",
        role: "Mysterious Traveler",
        location: "The Wayward Inn",
        description: "A cloaked figure who sits in the corner, paying in ancient coins. No one knows their true identity.",
        questGiver: true
    },
    {
        id: 'farmer_giles',
        name: "Old Giles",
        role: "Farmer",
        location: "Millbrook Farm",
        description: "A weathered farmer who has worked the land for sixty years. He's seen strange things in the woods lately.",
        questGiver: true
    },

    // === City & Noble NPCs ===
    {
        id: 'duke_aldric',
        name: "Duke Aldric von Stern",
        role: "Noble",
        location: "Noble Quarter",
        description: "A wealthy duke with political ambitions. He hires adventurers for delicate matters.",
        questGiver: true,
        factionAffiliation: "Silverspire Nobility"
    },
    {
        id: 'lady_vivienne',
        name: "Lady Vivienne Thornwood",
        role: "Noblewoman",
        location: "Noble Quarter",
        description: "A cunning noblewoman who runs a network of spies. Information is her currency.",
        questGiver: true,
        factionAffiliation: "Shadow Syndicate"
    },
    {
        id: 'royal_advisor',
        name: "Lord Chamberlain Edmure",
        role: "Royal Advisor",
        location: "Royal Palace",
        description: "The queen's trusted advisor, a shrewd politician who handles matters of state.",
        questGiver: true,
        factionAffiliation: "Silverspire Monarchy"
    },
    {
        id: 'guildmaster_valor',
        name: "Guildmaster Valor Brightblade",
        role: "Adventurer's Guild Leader",
        location: "Adventurer's Guild Hall",
        description: "A retired adventurer who now manages the guild, assigning quests and settling disputes.",
        questGiver: true,
        shopkeeper: true
    },

    // === Maritime & Pirate NPCs ===
    {
        id: 'harbormaster_reef',
        name: "Harbormaster Coral Reef",
        role: "Harbormaster",
        location: "Fisherman's Wharf",
        description: "A sea-elf who manages the docks, keeping track of every ship that enters the harbor.",
        questGiver: true
    },
    {
        id: 'pirate_queen_morgan',
        name: "Captain Morgan Blacktide",
        role: "Pirate Queen",
        location: "Port Blackwater",
        description: "The notorious queen of the pirates, commanding respect and fear in equal measure.",
        questGiver: true,
        factionAffiliation: "Blacktide Pirates"
    },
    {
        id: 'fence_whispers',
        name: "Whispers",
        role: "Fence",
        location: "Port Blackwater",
        description: "A shadowy figure who buys and sells stolen goods, no questions asked.",
        shopkeeper: true,
        factionAffiliation: "Shadow Syndicate"
    },
    {
        id: 'old_seadog',
        name: "Old Barnacle Ben",
        role: "Retired Sailor",
        location: "Fisherman's Wharf",
        description: "A retired sailor who claims to have seen the kraken. He knows the secrets of the sea.",
        questGiver: true
    },

    // === Dwarven NPCs ===
    {
        id: 'foreman_grimstone',
        name: "Foreman Durgan Grimstone",
        role: "Mine Foreman",
        location: "Karak Azgal",
        description: "A gruff dwarf who runs the mining operations. He's worried about things awakening in the deep.",
        questGiver: true,
        factionAffiliation: "Ironhold Mining Guild"
    },
    {
        id: 'runesmith_ember',
        name: "Runesmith Ember Forgefire",
        role: "Runesmith",
        location: "Ironhold Citadel",
        description: "A master runesmith who can enchant weapons with ancient dwarven runes.",
        shopkeeper: true,
        factionAffiliation: "Artisan's Guild"
    },
    {
        id: 'brewmaster_stout',
        name: "Brewmaster Barley Stout",
        role: "Brewmaster",
        location: "Ironhold Citadel",
        description: "The creator of the finest dwarven ale in the realm. His brews have magical properties.",
        shopkeeper: true
    },

    // === Elven NPCs ===
    {
        id: 'high_mage_lyralei',
        name: "High Mage Lyralei Starweaver",
        role: "High Mage",
        location: "Aelindra",
        description: "An ancient elven mage who has lived for millennia. She guards secrets of the old world.",
        questGiver: true,
        factionAffiliation: "Circle of Mages"
    },
    {
        id: 'ranger_captain_thalion',
        name: "Captain Thalion Swiftarrow",
        role: "Ranger Captain",
        location: "Aelindra",
        description: "The leader of the elven rangers who patrol the forest borders against threats.",
        questGiver: true,
        factionAffiliation: "Forest Guardians"
    },
    {
        id: 'elven_smith',
        name: "Celeborn Silvervein",
        role: "Elven Smith",
        location: "Aelindra",
        description: "An elven smith who crafts weapons of legendary beauty and sharpness.",
        shopkeeper: true
    },

    // === Religious & Temple NPCs ===
    {
        id: 'high_priestess',
        name: "High Priestess Seraphina",
        role: "High Priestess of the Dawn",
        location: "Temple of the Dawn",
        description: "The spiritual leader of the sun god's faithful, a beacon of hope and healing.",
        questGiver: true,
        factionAffiliation: "Order of the Silver Hand"
    },
    {
        id: 'storm_priest_thunder',
        name: "Storm Priest Tormund",
        role: "Priest of Storms",
        location: "Shrine of Storms",
        description: "A wild-eyed priest who communes with the storm, speaking in riddles and prophecy.",
        questGiver: true
    },
    {
        id: 'dark_priest',
        name: "Father Mortis",
        role: "Priest of Death",
        location: "Catacombs",
        description: "A priest who tends to the dead, ensuring they stay at rest. Not all who serve death are evil.",
        questGiver: true
    },
    {
        id: 'grandmaster_chen',
        name: "Grandmaster Chen",
        role: "Monastery Leader",
        location: "Monastery of the Four Winds",
        description: "An ancient human who has achieved enlightenment, teaching the way of the open hand.",
        questGiver: true
    },

    // === Wilderness & Tribal NPCs ===
    {
        id: 'chieftain_windrunner',
        name: "Chieftain Windrunner",
        role: "Nomad Chieftain",
        location: "Nomad Camp",
        description: "The leader of the plains nomads, a fierce warrior who values honor above all.",
        questGiver: true
    },
    {
        id: 'oracle_sienna',
        name: "Oracle Sienna",
        role: "Desert Oracle",
        location: "Oasis of Stars",
        description: "A blind oracle who sees the future in the reflections of the starlit pool.",
        questGiver: true
    },
    {
        id: 'chieftain_scale',
        name: "Chieftain Scale-of-Stars",
        role: "Lizardfolk Chieftain",
        location: "Sseth'ka Village",
        description: "A wise lizardfolk leader who seeks to build bridges with the warm-blooded races.",
        questGiver: true
    },
    {
        id: 'satyr_pan',
        name: "Pan Wildfoot",
        role: "Satyr Bard",
        location: "Satyr's Glade",
        description: "A mischievous satyr who leads the eternal celebration in the glade.",
        questGiver: true
    },

    // === Underworld & Criminal NPCs ===
    {
        id: 'assassin_widow',
        name: "The Black Widow",
        role: "Assassin",
        location: "Shadow Market",
        description: "A legendary assassin who never fails a contract. Her services come at a steep price.",
        questGiver: true,
        factionAffiliation: "Shadow Syndicate"
    },
    {
        id: 'information_broker',
        name: "The Listener",
        role: "Information Broker",
        location: "Shadow Market",
        description: "A figure with ears everywhere, selling secrets to the highest bidder.",
        shopkeeper: true,
        factionAffiliation: "Shadow Syndicate"
    },
    {
        id: 'smuggler_captain',
        name: "Captain Sly",
        role: "Smuggler",
        location: "Smuggler's Cove",
        description: "A charming rogue who can get anything past any border, for the right price.",
        questGiver: true,
        shopkeeper: true
    },

    // === Magical & Scholarly NPCs ===
    {
        id: 'alchemist_fizzbang',
        name: "Professor Fizzbang",
        role: "Alchemist",
        location: "Arcane Academy",
        description: "A gnome alchemist whose experiments are legendary—both for their success and explosions.",
        shopkeeper: true,
        questGiver: true,
        factionAffiliation: "Circle of Mages"
    },
    {
        id: 'librarian_dust',
        name: "Keeper Dust",
        role: "Librarian",
        location: "Arcane Academy",
        description: "A skeletal construct who has tended the library for centuries, knowing every book by heart.",
        questGiver: true
    },
    {
        id: 'artificer_cogsworth',
        name: "Master Cogsworth",
        role: "Artificer",
        location: "Silverspire City",
        description: "A brilliant inventor who creates magical constructs and devices.",
        shopkeeper: true,
        factionAffiliation: "Circle of Mages"
    },
    {
        id: 'diviner_stars',
        name: "Madame Celestia",
        role: "Diviner",
        location: "Silverspire City",
        description: "A fortune teller whose predictions have an uncanny habit of coming true.",
        questGiver: true
    },

    // === Antagonist & Villain NPCs ===
    {
        id: 'necromancer_bones',
        name: "Malthus the Undying",
        role: "Necromancer",
        location: "Lich's Sanctum",
        description: "A powerful lich who seeks to cover the world in eternal darkness.",
        questGiver: false,
        factionAffiliation: "Cult of the Undying"
    },
    {
        id: 'vampire_lord',
        name: "Count Strahd von Zarovich",
        role: "Vampire Lord",
        location: "Castle Ravenloft",
        description: "An ancient vampire who rules his domain with an iron fist, eternally seeking his lost love.",
        questGiver: true // Vampires can give quests in complex narratives
    },
    {
        id: 'cultist_leader',
        name: "High Priest Azaroth",
        role: "Cult Leader",
        location: "Temple of Elemental Fire",
        description: "The fanatical leader of a cult seeking to unleash elemental chaos upon the world.",
        questGiver: false
    },
    {
        id: 'dragon_sage',
        name: "Aurixalinth the Gold",
        role: "Ancient Gold Dragon",
        location: "Dragon's Eyrie",
        description: "An ancient gold dragon who has taken humanoid form to observe the world. Incredibly wise.",
        questGiver: true
    },
    {
        id: 'demon_prince_servant',
        name: "Xirix the Corrupted",
        role: "Demon Cultist",
        location: "Abyssal Rift",
        description: "A tiefling who serves demon lords, seeking to tear open permanent rifts to the Abyss.",
        questGiver: false
    },

    // === Merchant & Trade NPCs ===
    {
        id: 'caravan_master',
        name: "Master Trader Rashid",
        role: "Caravan Master",
        location: "Oasis of Stars",
        description: "A wealthy merchant who runs caravans through dangerous territory, always looking for guards.",
        questGiver: true,
        shopkeeper: true
    },
    {
        id: 'rare_goods_dealer',
        name: "Zara the Collector",
        role: "Rare Goods Dealer",
        location: "Silverspire City",
        description: "A dealer in rare and exotic items from across the planes.",
        shopkeeper: true
    },
    {
        id: 'weapon_master',
        name: "Blademaster Kira",
        role: "Weapon Master",
        location: "The Colosseum",
        description: "A retired champion who now trains fighters and evaluates weapons.",
        shopkeeper: true,
        questGiver: true
    },
    {
        id: 'potion_master',
        name: "Mama Elixir",
        role: "Potion Seller",
        location: "Ravenshollow",
        description: "An old woman who brews potions of questionable origin but undeniable potency.",
        shopkeeper: true
    },

    // === Companion & Helper NPCs ===
    {
        id: 'squire_tim',
        name: "Young Tim",
        role: "Aspiring Squire",
        location: "Willowmere Village",
        description: "An eager young man who dreams of becoming an adventurer. He'd follow anyone who'd take him.",
        questGiver: false
    },
    {
        id: 'healer_sera',
        name: "Sister Sera",
        role: "Traveling Healer",
        location: "The Wayward Inn",
        description: "A wandering healer who tends to those in need, asking nothing in return.",
        shopkeeper: true
    },
    {
        id: 'bard_lyric',
        name: "Lyric Silverton",
        role: "Wandering Bard",
        location: "The Wayward Inn",
        description: "A bard who collects stories of heroes. She'll pay well for tales of adventure.",
        questGiver: true
    },
    {
        id: 'bounty_hunter',
        name: "Grimjaw",
        role: "Bounty Hunter",
        location: "Port Blackwater",
        description: "A scarred half-orc who tracks down criminals and monsters for coin.",
        questGiver: true
    }
];
