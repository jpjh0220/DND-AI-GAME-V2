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
    }
];
