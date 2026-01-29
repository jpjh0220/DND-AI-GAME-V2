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
        id: 'harpers',
        name: "The Harpers",
        description: "A secretive network of spellcasters and spies who covertly oppose tyranny and promote good. They work behind the scenes to maintain the balance of power.",
        alignment: "Neutral Good",
        headquarters: "Various safe houses",
        ranks: ["Watcher", "Harper", "Brightcandle", "Wise Owl", "High Harper"],
        reputationEffects: [
            { minRep: 50, effect: "Receive secret information and safe passage through Harper networks." },
            { minRep: 100, effect: "Gain access to Harper magic items and influential contacts." },
            { minRep: 200, effect: "Can call upon Harper agents for aid in desperate times." }
        ]
    },
    {
        id: 'zhentarim',
        name: "The Zhentarim",
        description: "A shadowy organization that seeks to expand its influence and power through legitimate and illegitimate means. They value profit and loyalty above all else.",
        alignment: "Lawful Evil",
        headquarters: "Zhentil Keep (rumored)",
        ranks: ["Recruit", "Associate", "Fang", "Viper", "Serpent King"],
        reputationEffects: [
            { minRep: 50, effect: "Access to Zhentarim safe houses and black market goods." },
            { minRep: 100, effect: "Zhentarim muscle available for hire at reduced rates." },
            { minRep: 200, effect: "Receive cuts from Zhentarim operations in your area." }
        ]
    },
    {
        id: 'order_gauntlet',
        name: "Order of the Gauntlet",
        description: "A devoted group of holy warriors who seek to destroy evil in all its forms. They are unwavering in their pursuit of justice and righteousness.",
        alignment: "Lawful Good",
        headquarters: "Temple of the Dawn",
        ranks: ["Chevall", "Marcheon", "Whitehawk", "Vindicator", "Righteous Hand"],
        reputationEffects: [
            { minRep: 50, effect: "Divine blessings before dangerous missions." },
            { minRep: 100, effect: "Free healing and resurrection services." },
            { minRep: 200, effect: "Holy weapons and armor provided for righteous causes." }
        ]
    },
    {
        id: 'emerald_enclave',
        name: "The Emerald Enclave",
        description: "A far-reaching group that opposes threats to the natural world and helps others survive in the wilderness. They are dedicated to maintaining the balance of nature.",
        alignment: "Neutral",
        headquarters: "Various wilderness lodges",
        ranks: ["Springwarden", "Summerstrider", "Autumnreaver", "Winterstalker", "Master of the Wild"],
        reputationEffects: [
            { minRep: 50, effect: "Animal companions available for dangerous missions." },
            { minRep: 100, effect: "Access to rare natural spell components and healing herbs." },
            { minRep: 200, effect: "Powerful druid allies answer your call in times of need." }
        ]
    },
    {
        id: 'lords_alliance',
        name: "The Lords' Alliance",
        description: "A coalition of rulers from cities across the realms who have banded together for mutual security and prosperity. They seek to maintain civilization against the forces of chaos.",
        alignment: "Lawful Neutral",
        headquarters: "Waterdeep (and various city halls)",
        ranks: ["Cloak", "Redknife", "Stingblade", "Warduke", "Lioncrown"],
        reputationEffects: [
            { minRep: 50, effect: "Reduced prices at Alliance-affiliated merchants." },
            { minRep: 100, effect: "Can requisition soldiers and supplies for approved missions." },
            { minRep: 200, effect: "Political immunity and noble titles in Alliance cities." }
        ]
    },
    {
        id: 'cult_dragon',
        name: "Cult of the Dragon",
        description: "A fanatical cult that venerates dragons and seeks to create dracoliches—undead dragons of terrible power. They believe dragons will one day rule the world.",
        alignment: "Chaotic Evil",
        headquarters: "Various hidden lairs",
        ranks: ["Initiate", "Dragonclaw", "Dragonwing", "Dragonfang", "Wyrmspeaker"],
        reputationEffects: [
            { minRep: 50, effect: "Receive draconic lore and dragon-related quests." },
            { minRep: 100, effect: "Gain resistance to a dragon breath type of your choice." },
            { minRep: 200, effect: "Dragons may consider you an ally rather than prey." }
        ]
    },
    {
        id: 'blacktide_pirates',
        name: "Blacktide Pirates",
        description: "A loose confederation of pirates, smugglers, and privateers who prey on merchant shipping. They follow their own code of conduct and answer to the Pirate Queen.",
        alignment: "Chaotic Neutral",
        headquarters: "Port Blackwater",
        ranks: ["Swab", "Mate", "Boatswain", "First Mate", "Captain"],
        reputationEffects: [
            { minRep: 50, effect: "Safe harbor in pirate ports and reduced fence prices." },
            { minRep: 100, effect: "Access to smuggling routes and pirate crews for hire." },
            { minRep: 200, effect: "Command of your own ship and share of pirate plunder." }
        ]
    },
    {
        id: 'undead_cult',
        name: "Cult of the Undying",
        description: "A secretive cult that worships death and undeath, seeking to achieve immortality through necromancy. They believe death is the ultimate transformation.",
        alignment: "Neutral Evil",
        headquarters: "Lich's Sanctum",
        ranks: ["Acolyte", "Grave Tender", "Death's Hand", "Lich Servant", "Undying One"],
        reputationEffects: [
            { minRep: 50, effect: "Learn necromantic rituals and create minor undead." },
            { minRep: 100, effect: "Undead creatures ignore you unless commanded to attack." },
            { minRep: 200, effect: "Begin the path to lichdom with secret knowledge." }
        ]
    },
    {
        id: 'merchant_guild',
        name: "The Merchant Consortium",
        description: "A powerful guild of traders, merchants, and craftsmen who control much of the realm's commerce. Money is their god, and profit is their prayer.",
        alignment: "True Neutral",
        headquarters: "Grand Bazaar (Silverspire)",
        ranks: ["Apprentice", "Journeyman", "Master Trader", "Merchant Prince", "Guildmaster"],
        reputationEffects: [
            { minRep: 50, effect: "10% discount at all Consortium-affiliated shops." },
            { minRep: 100, effect: "Access to rare goods and preferential trade routes." },
            { minRep: 200, effect: "Investment opportunities and passive income from guild operations." }
        ]
    },
    {
        id: 'monster_hunters',
        name: "The Monster Slayers' Guild",
        description: "A professional organization of monster hunters who take contracts to eliminate dangerous creatures. They are experts in tracking and killing the most fearsome beasts.",
        alignment: "Neutral Good",
        headquarters: "Adventurer's Guild Hall",
        ranks: ["Tracker", "Hunter", "Slayer", "Veteran Slayer", "Grand Hunter"],
        reputationEffects: [
            { minRep: 50, effect: "Access to monster lore and hunting supplies." },
            { minRep: 100, effect: "Receive monster hunting contracts with bonus rewards." },
            { minRep: 200, effect: "Legendary monster weapons and armor crafted for you." }
        ]
    },
    {
        id: 'planar_seekers',
        name: "The Planar Seekers",
        description: "A group of scholars, mages, and adventurers dedicated to exploring and mapping the planes of existence. They seek knowledge of the multiverse.",
        alignment: "Neutral",
        headquarters: "Arcane Academy",
        ranks: ["Novice Seeker", "Planar Scout", "Plane Walker", "Dimensional Master", "Seeker Supreme"],
        reputationEffects: [
            { minRep: 50, effect: "Access to planar knowledge and minor teleportation magic." },
            { minRep: 100, effect: "Receive plane shift scrolls and planar maps." },
            { minRep: 200, effect: "Establish permanent gates to planes of your choosing." }
        ]
    }
];
