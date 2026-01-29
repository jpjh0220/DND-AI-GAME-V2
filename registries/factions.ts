import { FactionData } from '../types';

export const FACTIONS_DB: FactionData[] = [
    {
        id: 'iron_guard',
        name: "The Iron Guard",
        description: "The disciplined and unwavering military force of the central kingdom, dedicated to law, order, and protecting the innocent. They are often seen patrolling trade routes and fortifying borders.",
        alignment: "Lawful Good",
        headquarters: "Silverspire Citadel",
        ranks: ["Recruit", "Guard", "Sergeant", "Captain", "Commander"],
        reputationEffects: [
            { minRep: 50, effect: "Gain access to military supplies." },
            { minRep: 100, effect: "Receive aid in combat from patrols." }
        ]
    },
    {
        id: 'shadow_syndicate',
        name: "The Shadow Syndicate",
        description: "A sprawling criminal network operating in the underbellies of major cities. They deal in illicit goods, information, and clandestine services, maintaining a brutal hierarchy.",
        alignment: "Neutral Evil",
        headquarters: "Shadow Market (Silverspire)",
        ranks: ["Cutpurse", "Thug", "Enforcer", "Boss", "Kingpin"],
        reputationEffects: [
            { minRep: 50, effect: "Access to black market goods." },
            { minRep: 100, effect: "Information on targets and safe passage through criminal territories." }
        ]
    },
    {
        id: 'silver_hand',
        name: "Order of the Silver Hand",
        description: "A zealous order of paladins and clerics dedicated to eradicating evil, particularly undeath and fiends. They are uncompromising and often radical in their methods.",
        alignment: "Lawful Good",
        headquarters: "Temple of the Dawn",
        ranks: ["Acolyte", "Initiate", "Knight of the Silver Hand", "High Paladin", "Grand Inquisitor"],
        reputationEffects: [
            { minRep: 50, effect: "Receive divine blessings and healing." },
            { minRep: 100, effect: "Gain powerful holy relics and aid in holy crusades." }
        ]
    },
    {
        id: 'circle_of_mages',
        name: "The Circle of Mages",
        description: "The primary authority on arcane knowledge and magic in the realms, based out of the prestigious Arcane Academy. They pursue magical advancement and regulate its use.",
        alignment: "Neutral",
        headquarters: "Arcane Academy (Silverspire)",
        ranks: ["Apprentice", "Journeyman Mage", "Master Mage", "Archmage"],
        reputationEffects: [
            { minRep: 50, effect: "Access to advanced spell components and rare scrolls." },
            { minRep: 100, effect: "Training in new spells and magical research opportunities." }
        ]
    },
    {
        id: 'forest_guardians',
        name: "The Forest Guardians",
        description: "A reclusive collective of druids, rangers, and nature spirits dedicated to protecting the ancient forests and wild places from corruption and encroachment by civilization.",
        alignment: "Neutral Good",
        headquarters: "Druid's Grove",
        ranks: ["Initiate", "Wildheart", "Grove Warden", "Archdruid"],
        reputationEffects: [
            { minRep: 50, effect: "Receive natural remedies and guidance in the wilderness." },
            { minRep: 100, effect: "Gain access to hidden paths and the aid of powerful nature spirits." }
        ]
    },
    {
        id: 'stormwatch_mariners',
        name: "Stormwatch Mariners",
        description: "A proud coalition of captains, shipwrights, and harbormasters who keep the coastal trade lanes safe and the harbor supplied.",
        alignment: "Neutral Good",
        headquarters: "Stormwatch Harbor",
        ranks: ["Deckhand", "Quartermaster", "First Mate", "Harbor Captain", "Fleet Admiral"],
        reputationEffects: [
            { minRep: 25, effect: "Access to harbor services and discounted repairs." },
            { minRep: 60, effect: "Priority contracts for salvage and escort missions." },
            { minRep: 100, effect: "Unlock rare maritime gear and trusted crew support." }
        ]
    },

    // === Underworld & Criminal Factions ===
    {
        id: 'blacktide_pirates',
        name: "The Blacktide Pirates",
        description: "A fearsome pirate fleet that terrorizes coastal trade routes. Led by a council of captains, they value freedom, plunder, and loyalty above all else.",
        alignment: "Chaotic Neutral",
        headquarters: "Blacktide Cove",
        ranks: ["Swab", "Sailor", "Bosun", "First Mate", "Captain", "Pirate Lord"],
        reputationEffects: [
            { minRep: 30, effect: "Safe passage through pirate-controlled waters." },
            { minRep: 70, effect: "Access to smuggled goods and hidden coves." },
            { minRep: 100, effect: "Command your own pirate vessel and crew." }
        ]
    },
    {
        id: 'nightblades',
        name: "The Nightblades",
        description: "An elite guild of assassins that operates in absolute secrecy. They accept contracts from the highest bidders and leave no witnesses.",
        alignment: "Neutral Evil",
        headquarters: "The Hollow (unknown location)",
        ranks: ["Initiate", "Blade", "Shadow", "Phantom", "Grandmaster"],
        reputationEffects: [
            { minRep: 40, effect: "Access to poisons and assassination tools." },
            { minRep: 80, effect: "Contract other Nightblades for assistance." },
            { minRep: 100, effect: "Learn the secret arts of the Phantom rank." }
        ]
    },
    {
        id: 'rat_catchers',
        name: "The Rat Catchers",
        description: "A guild of sewer-dwelling outcasts and information brokers who know every tunnel, passage, and secret beneath the cities. They trade in secrets and favors.",
        alignment: "Chaotic Neutral",
        headquarters: "The Undercity (Silverspire sewers)",
        ranks: ["Gutter Runner", "Tunnel Rat", "Whisper", "Broker", "Rat King"],
        reputationEffects: [
            { minRep: 20, effect: "Learn secret passages through cities." },
            { minRep: 60, effect: "Buy intelligence on any person or place." },
            { minRep: 100, effect: "The entire sewer network becomes your domain." }
        ]
    },

    // === Religious & Holy Orders ===
    {
        id: 'dawn_templars',
        name: "The Dawn Templars",
        description: "A militant religious order devoted to Solarius, god of the sun. They wage an eternal crusade against undead and fiends, wielding holy fire and divine justice.",
        alignment: "Lawful Good",
        headquarters: "Sunspire Cathedral",
        ranks: ["Acolyte", "Templar", "Sun Knight", "Radiant Champion", "High Templar"],
        reputationEffects: [
            { minRep: 30, effect: "Receive blessings of radiant protection." },
            { minRep: 70, effect: "Access to holy weapons and sacred relics." },
            { minRep: 100, effect: "Command a chapter of Dawn Templars." }
        ]
    },
    {
        id: 'cult_of_the_void',
        name: "Cult of the Void",
        description: "A secretive doomsday cult that worships entities from the Far Realm. They seek to tear open the fabric of reality and usher in an age of madness.",
        alignment: "Chaotic Evil",
        headquarters: "The Spiral (shifting location)",
        ranks: ["Whispered", "Touched", "Vessel", "Prophet", "Voice of the Void"],
        reputationEffects: [
            { minRep: 30, effect: "Learn forbidden aberrant rituals." },
            { minRep: 70, effect: "Gain resistance to psychic damage." },
            { minRep: 100, effect: "Open a gateway to the Far Realm." }
        ]
    },
    {
        id: 'raven_queen_servants',
        name: "Servants of the Raven Queen",
        description: "Devoted followers of the goddess of death who ensure the natural cycle of life and death is maintained. They hunt undead and those who would cheat death.",
        alignment: "Lawful Neutral",
        headquarters: "The Shrouded Sanctum",
        ranks: ["Mourner", "Grave Tender", "Soul Warden", "Revenant Hunter", "Hand of the Raven"],
        reputationEffects: [
            { minRep: 30, effect: "Detect undead within a wide radius." },
            { minRep: 70, effect: "Receive death-ward protections." },
            { minRep: 100, effect: "Gain the ability to speak with the recently dead." }
        ]
    },

    // === Political & Trade Factions ===
    {
        id: 'merchant_consortium',
        name: "The Merchant Consortium",
        description: "A powerful trade alliance of wealthy merchants and bankers who control commerce across the realms. Their gold speaks louder than any sword.",
        alignment: "Neutral",
        headquarters: "The Golden Exchange (Silverspire)",
        ranks: ["Associate", "Trader", "Factor", "Trade Prince", "Grand Financier"],
        reputationEffects: [
            { minRep: 25, effect: "10% discount at all consortium-affiliated shops." },
            { minRep: 60, effect: "Access to rare trade goods and investment opportunities." },
            { minRep: 100, effect: "Establish your own trade empire with consortium backing." }
        ]
    },
    {
        id: 'harpers',
        name: "The Harpers",
        description: "A secretive network of spies, informants, and adventurers who work behind the scenes to promote good, preserve history, and maintain the balance of power.",
        alignment: "Neutral Good",
        headquarters: "Various safehouses",
        ranks: ["Watcher", "Harper Agent", "Brightcandle", "Wise Owl", "High Harper"],
        reputationEffects: [
            { minRep: 30, effect: "Receive intelligence reports and safe house locations." },
            { minRep: 70, effect: "Harper agents assist you on missions." },
            { minRep: 100, effect: "Influence political events through the Harper network." }
        ]
    },
    {
        id: 'zhentarim',
        name: "The Zhentarim",
        description: "A mercenary company and trade network that operates through intimidation and monopoly. They seek to control trade routes and amass wealth and influence by any means.",
        alignment: "Lawful Evil",
        headquarters: "Darkhold Fortress",
        ranks: ["Fang", "Wolf", "Viper", "Ardragon", "Pereghost"],
        reputationEffects: [
            { minRep: 30, effect: "Hire Zhentarim mercenaries at discount rates." },
            { minRep: 70, effect: "Access smuggling routes and contraband." },
            { minRep: 100, effect: "Command a Zhentarim outpost and its forces." }
        ]
    },

    // === Adventuring & Scholarly Factions ===
    {
        id: 'explorers_league',
        name: "The Explorers' League",
        description: "A guild of adventurers, archaeologists, and cartographers dedicated to mapping the unknown reaches of the world and uncovering ancient ruins.",
        alignment: "Chaotic Good",
        headquarters: "The Cartographer's Hall (Silverspire)",
        ranks: ["Scout", "Pathfinder", "Expedition Leader", "Lorekeeper", "Grand Explorer"],
        reputationEffects: [
            { minRep: 25, effect: "Access to maps of uncharted territories." },
            { minRep: 60, effect: "Hire expedition teams and receive exploration contracts." },
            { minRep: 100, effect: "Name newly discovered locations and claim exploration rights." }
        ]
    },
    {
        id: 'order_of_the_gauntlet',
        name: "Order of the Gauntlet",
        description: "A devout faction of holy warriors and vigilantes who strike hard and fast against evil. They believe in direct action and righteous fury.",
        alignment: "Lawful Good",
        headquarters: "Summit Hall",
        ranks: ["Chevall", "Marcheon", "Whitehawk", "Vindicator", "Righteous Hand"],
        reputationEffects: [
            { minRep: 30, effect: "Receive healing and shelter at Order outposts." },
            { minRep: 70, effect: "Gauntlet knights join you against evil foes." },
            { minRep: 100, effect: "Lead a holy crusade with full Order support." }
        ]
    },
    {
        id: 'emerald_enclave',
        name: "The Emerald Enclave",
        description: "A far-reaching group of wilderness survivalists who oppose threats to the natural world. They maintain the balance between civilization and wild places.",
        alignment: "Neutral",
        headquarters: "Various wilderness lodges",
        ranks: ["Springwarden", "Summerstrider", "Autumnreap", "Winterstalker", "Master of the Wild"],
        reputationEffects: [
            { minRep: 25, effect: "Animal companions are friendlier and more helpful." },
            { minRep: 60, effect: "Access to druidic healing and natural refuges." },
            { minRep: 100, effect: "Command the forces of nature in your region." }
        ]
    },

    // === Monstrous & Exotic Factions ===
    {
        id: 'dragon_cult',
        name: "Cult of the Dragon",
        description: "Fanatical worshippers who seek to raise dracoliches and bring about a world ruled by dragonkind. They infiltrate positions of power across the realms.",
        alignment: "Neutral Evil",
        headquarters: "The Dragon Shrine (hidden)",
        ranks: ["Dragonclaw", "Dragonwing", "Dragonfang", "Dragonsoul", "Wyrmspeaker"],
        reputationEffects: [
            { minRep: 40, effect: "Learn draconic magic and gain dragon-themed gear." },
            { minRep: 80, effect: "Communicate with chromatic dragons safely." },
            { minRep: 100, effect: "Ride a young dragon into battle." }
        ]
    },
    {
        id: 'underdark_alliance',
        name: "The Underdark Alliance",
        description: "A tenuous coalition of drow outcasts, deep gnomes, and myconids who seek peaceful coexistence in the Underdark, opposing the tyranny of Lolth's followers.",
        alignment: "Chaotic Good",
        headquarters: "Blingdenstone",
        ranks: ["Surface Friend", "Tunnel Walker", "Deep Ally", "Darklight Champion", "Voice of the Deep"],
        reputationEffects: [
            { minRep: 30, effect: "Safe passage through Underdark tunnels." },
            { minRep: 70, effect: "Access to rare Underdark fungi and minerals." },
            { minRep: 100, effect: "Command Underdark forces against common enemies." }
        ]
    },
    {
        id: 'lycanthrope_pack',
        name: "The Moonbound Pack",
        description: "A secret society of lycanthropes who have learned to control their transformations. They protect their own kind and hunt those who would expose or destroy them.",
        alignment: "Chaotic Neutral",
        headquarters: "The Howling Den (deep forest)",
        ranks: ["Pup", "Packmate", "Hunter", "Beta", "Alpha"],
        reputationEffects: [
            { minRep: 30, effect: "Lycanthropes will not attack you on sight." },
            { minRep: 70, effect: "Learn to partially control shapeshifting abilities." },
            { minRep: 100, effect: "Gain a controlled lycanthrope transformation." }
        ]
    },

    // === Planar Factions ===
    {
        id: 'planar_watchers',
        name: "The Planar Watchers",
        description: "An interplanar organization of scholars and guardians who monitor portals between planes and prevent extraplanar incursions into the Material Plane.",
        alignment: "Lawful Neutral",
        headquarters: "The Nexus Tower (Astral Plane)",
        ranks: ["Observer", "Warden", "Gate Keeper", "Plane Walker", "Nexus Master"],
        reputationEffects: [
            { minRep: 30, effect: "Detect planar disturbances in your vicinity." },
            { minRep: 70, effect: "Access to planar travel and interplanar safe houses." },
            { minRep: 100, effect: "Open and close portals between planes at will." }
        ]
    },
    {
        id: 'infernal_bargainers',
        name: "The Infernal Bargainers",
        description: "A clandestine cabal of warlocks and dealmakers who negotiate contracts with devils and demons. They trade in souls, favors, and forbidden power.",
        alignment: "Lawful Evil",
        headquarters: "The Pact Hall (Silverspire underground)",
        ranks: ["Petitioner", "Pactbound", "Soul Broker", "Devil's Advocate", "Archpact Master"],
        reputationEffects: [
            { minRep: 40, effect: "Negotiate minor infernal contracts for power." },
            { minRep: 80, effect: "Summon lesser fiends to do your bidding." },
            { minRep: 100, effect: "Broker deals with archdevils themselves." }
        ]
    }
];
