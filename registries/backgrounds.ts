import { BackgroundData } from '../types';

export const BACKGROUNDS: { [key: string]: BackgroundData } = {
    "Acolyte": { skills: ["Insight", "Religion"], gear: "Holy Symbol, Prayer Book", feature: "Shelter of the Faithful" },
    "Soldier": { skills: ["Athletics", "Intimidation"], gear: "Insignia of Rank, Trophy", feature: "Military Rank" },
    "Criminal": { skills: ["Deception", "Stealth"], gear: "Crowbar, Dark Clothes", feature: "Criminal Contact" },
    "Folk Hero": { skills: ["Animal Handling", "Survival"], gear: "Shovel, Iron Pot", feature: "Rustic Hospitality" },
    "Sage": { skills: ["Arcana", "History"], gear: "Bottle of Ink, Quill", feature: "Researcher" },
    "Charlatan": { skills: ["Deception", "Sleight of Hand"], gear: "Fine Clothes, Disguise Kit", feature: "False Identity" },
    "Hermit": { skills: ["Medicine", "Religion"], gear: "Herbalism Kit, Common Clothes", feature: "Discovery" },
    "Urchin": { skills: ["Sleight of Hand", "Stealth"], gear: "Small Knife, Map of the City, Tattered Clothes", feature: "City Secrets" },
    "Guild Artisan": { skills: ["Insight", "Persuasion"], gear: "Artisan's Tools, Letter of Introduction, Fine Clothes", feature: "Guild Membership" },
    "Noble": { skills: ["History", "Persuasion"], gear: "Fine Clothes, Signet Ring, Scroll of Pedigree", feature: "Position of Privilege" },
    "Sailor": { skills: ["Athletics", "Perception"], gear: "Belaying Pin, Rope (50ft), Lucky Charm", feature: "Ship's Passage" }
};