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
    }
];
