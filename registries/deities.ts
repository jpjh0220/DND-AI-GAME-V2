import { DeityData } from '../types';

export const DEITIES_DB: DeityData[] = [
    {
        id: 'solara',
        name: "Solara, The Sunweaver",
        domain: "Light, Life, Healing",
        alignment: "Lawful Good",
        symbol: "Radiant Sunburst",
        description: "Solara is the benevolent goddess of the sun, healing, and justice. She brings warmth to the world, illuminates truth, and guides those who champion the good. Her clerics often serve as healers and protectors, fighting against darkness and despair.",
        worshippers: ["Paladins", "Clerics", "Farmers", "Common Folk"]
    },
    {
        id: 'morwen',
        name: "Morwen, The Shadowed Whisper",
        domain: "Night, Secrets, Death",
        alignment: "Neutral Evil",
        symbol: "Crescent Moon obscured by shadows",
        description: "Morwen is the enigmatic deity of night, secrets, and the natural cycle of death. While not inherently malicious, her followers often embrace shadows, illicit knowledge, and the inevitability of the grave. Rogues and necromancers sometimes pay her homage.",
        worshippers: ["Rogues", "Warlocks", "Necromancers", "Those who dwell in shadows"]
    },
    {
        id: 'terra',
        name: "Terra, The Earthshaper",
        domain: "Nature, Earth, Resilience",
        alignment: "Neutral Good",
        symbol: "Flowering Mountain",
        description: "Terra is the ancient goddess of the earth, nature, and the wild. She embodies resilience, growth, and the raw power of the land. Druids and rangers revere her, seeking balance and protecting the natural world from destruction.",
        worshippers: ["Druids", "Rangers", "Farmers", "Miners"]
    },
    {
        id: 'ignis',
        name: "Ignis, The Forgemaster",
        domain: "Fire, Craft, War",
        alignment: "Lawful Neutral",
        symbol: "Flaming Hammer",
        description: "Ignis is the god of fire, creation, and warfare. Revered by artisans and warriors alike, he represents the spark of invention and the disciplined heat of the forge. His followers value skill, courage, and the mastery of their craft.",
        worshippers: ["Fighters", "Artificers", "Dwarves", "Blacksmiths"]
    },
    {
        id: 'aetheria',
        name: "Aetheria, The Starweaver",
        domain: "Magic, Knowledge, Destiny",
        alignment: "Chaotic Neutral",
        symbol: "Swirling Galaxy Eye",
        description: "Aetheria is the cosmic deity of magic, knowledge, and the intertwined threads of destiny. She is the source of all arcane power, inspiring mages, scholars, and those who seek to unravel the universe's mysteries. Her influence is unpredictable, like magic itself.",
        worshippers: ["Wizards", "Sorcerers", "Bards", "Scholars"]
    }
];
