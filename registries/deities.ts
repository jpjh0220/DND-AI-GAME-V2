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
    },

    // === Gods of War & Combat ===
    {
        id: 'tempus',
        name: "Tempus, The Lord of Battles",
        domain: "War, Strength, Victory",
        alignment: "Chaotic Neutral",
        symbol: "Flaming Sword",
        description: "Tempus is the god of war, favoring neither side in any conflict. He values honorable combat, courage in battle, and the glory of victory. Warriors of all kinds pray to him before entering battle.",
        worshippers: ["Fighters", "Barbarians", "Soldiers", "Mercenaries"]
    },
    {
        id: 'tyr',
        name: "Tyr, The Maimed God",
        domain: "Justice, Law, Honor",
        alignment: "Lawful Good",
        symbol: "Balanced Scales on a Warhammer",
        description: "Tyr is the god of justice, law, and righteous warfare. He lost his hand to uphold a sacred oath, and his followers believe in truth, fairness, and punishment of the guilty.",
        worshippers: ["Paladins", "Judges", "Knights", "Lawyers"]
    },
    {
        id: 'gruumsh',
        name: "Gruumsh, The One-Eyed God",
        domain: "War, Conquest, Orcs",
        alignment: "Chaotic Evil",
        symbol: "Single Eye",
        description: "Gruumsh is the savage god of orcs, conquest, and destruction. He lost an eye in battle with the elven god Corellon, and his rage knows no bounds. His followers seek to dominate and destroy.",
        worshippers: ["Orcs", "Half-Orcs", "Barbarians", "Warlords"]
    },

    // === Gods of Nature & Elements ===
    {
        id: 'silvanus',
        name: "Silvanus, The Oak Father",
        domain: "Nature, Forests, Wild Things",
        alignment: "True Neutral",
        symbol: "Oak Leaf",
        description: "Silvanus is the ancient god of wild nature, forests, and all living things within them. He opposes the overreach of civilization and protects the balance of the natural world.",
        worshippers: ["Druids", "Rangers", "Farmers", "Woodcutters"]
    },
    {
        id: 'talos',
        name: "Talos, The Stormlord",
        domain: "Storms, Destruction, Chaos",
        alignment: "Chaotic Evil",
        symbol: "Three Lightning Bolts",
        description: "Talos is the destructive god of storms, earthquakes, and fire. He revels in natural disasters and the fear they inspire. His followers seek power through destruction.",
        worshippers: ["Storm Sorcerers", "Pirates", "Cultists", "Barbarians"]
    },
    {
        id: 'umberlee',
        name: "Umberlee, The Bitch Queen",
        domain: "Sea, Storms, Drowning",
        alignment: "Chaotic Evil",
        symbol: "Wave curling left and right",
        description: "Umberlee is the cruel goddess of the sea. Sailors pray to her not out of love but fear, hoping to avoid her wrath during their voyages.",
        worshippers: ["Sailors", "Pirates", "Coastal Dwellers", "Storm Giants"]
    },
    {
        id: 'auril',
        name: "Auril, The Frostmaiden",
        domain: "Cold, Winter, Ice",
        alignment: "Neutral Evil",
        symbol: "White Snowflake",
        description: "Auril is the goddess of cold and winter. She brings harsh winters and freezing death, and her followers embrace the cold's power to preserve or destroy.",
        worshippers: ["Frost Giants", "Northern Tribes", "Cold Wizards"]
    },

    // === Gods of Death & Undeath ===
    {
        id: 'kelemvor',
        name: "Kelemvor, Lord of the Dead",
        domain: "Death, The Dead, Judgment",
        alignment: "Lawful Neutral",
        symbol: "Skeletal Arm Holding Scales",
        description: "Kelemvor is the fair judge of the dead. He ensures souls reach their proper afterlife and opposes undeath as an affront to the natural order.",
        worshippers: ["Grave Clerics", "Undertakers", "Mourners", "Ghost Hunters"]
    },
    {
        id: 'vecna',
        name: "Vecna, The Whispered One",
        domain: "Secrets, Undeath, Magic",
        alignment: "Neutral Evil",
        symbol: "Hand with an Eye in Palm",
        description: "Vecna is the lich-god of secrets, forbidden knowledge, and undeath. He seeks to know all secrets and control all magic, and his cult works in shadow to achieve his goals.",
        worshippers: ["Necromancers", "Liches", "Evil Wizards", "Secret Keepers"]
    },
    {
        id: 'myrkul',
        name: "Myrkul, Lord of Bones",
        domain: "Death, Decay, Undeath",
        alignment: "Neutral Evil",
        symbol: "White Human Skull",
        description: "Myrkul is the god of death, decay, and the fear of dying. Unlike Kelemvor, he revels in undeath and the terror death inspires in mortals.",
        worshippers: ["Necromancers", "Undead", "Liches", "Death Cultists"]
    },

    // === Gods of Trickery & Shadow ===
    {
        id: 'mask',
        name: "Mask, Lord of Shadows",
        domain: "Thieves, Shadows, Intrigue",
        alignment: "Chaotic Neutral",
        symbol: "Black Velvet Mask",
        description: "Mask is the god of thieves, shadows, and intrigue. He delights in cunning schemes and rewards those who take what they want through stealth and guile.",
        worshippers: ["Rogues", "Assassins", "Spies", "Thieves"]
    },
    {
        id: 'lolth',
        name: "Lolth, Queen of Spiders",
        domain: "Spiders, Drow, Darkness",
        alignment: "Chaotic Evil",
        symbol: "Spider",
        description: "Lolth is the spider queen of the drow, ruling the Underdark through fear, manipulation, and cruelty. She demands absolute devotion from her followers.",
        worshippers: ["Drow", "Dark Elves", "Spider Cultists"]
    },
    {
        id: 'cyric',
        name: "Cyric, Prince of Lies",
        domain: "Lies, Murder, Strife",
        alignment: "Chaotic Evil",
        symbol: "Dark Sun",
        description: "Cyric is the mad god of lies, murder, and conflict. He delights in betrayal, deception, and the chaos that follows in their wake.",
        worshippers: ["Assassins", "Liars", "Murderers", "Cultists"]
    },

    // === Gods of Good & Protection ===
    {
        id: 'helm',
        name: "Helm, The Vigilant One",
        domain: "Protection, Vigilance, Guardians",
        alignment: "Lawful Neutral",
        symbol: "Staring Eye on Gauntlet",
        description: "Helm is the god of protection and guardians. He never sleeps, never falters, and his followers dedicate themselves to protecting others above all else.",
        worshippers: ["Paladins", "Guards", "Knights", "Bodyguards"]
    },
    {
        id: 'ilmater',
        name: "Ilmater, The Crying God",
        domain: "Suffering, Martyrdom, Perseverance",
        alignment: "Lawful Good",
        symbol: "Pair of Bound Hands",
        description: "Ilmater is the god of suffering and martyrdom. His followers take on the pain of others and endure hardship so that others might be spared.",
        worshippers: ["Healers", "Monks", "Prisoners", "The Persecuted"]
    },
    {
        id: 'lathander',
        name: "Lathander, The Morninglord",
        domain: "Dawn, Renewal, Birth",
        alignment: "Neutral Good",
        symbol: "Rising Sun",
        description: "Lathander is the god of dawn, renewal, and new beginnings. He represents hope, creativity, and the promise of a new day.",
        worshippers: ["Artists", "Athletes", "Optimists", "Healers"]
    },
    {
        id: 'torm',
        name: "Torm, The True",
        domain: "Duty, Loyalty, Righteousness",
        alignment: "Lawful Good",
        symbol: "White Right Gauntlet",
        description: "Torm is the god of duty, loyalty, and self-sacrifice. His paladins are among the most dedicated warriors of good in the realms.",
        worshippers: ["Paladins", "Knights", "Soldiers", "Guards"]
    },

    // === Gods of Knowledge & Magic ===
    {
        id: 'mystra',
        name: "Mystra, Lady of Mysteries",
        domain: "Magic, Spells, The Weave",
        alignment: "Neutral Good",
        symbol: "Circle of Seven Stars",
        description: "Mystra is the goddess of magic itself, maintaining the Weave that allows spellcasting. She is worshipped by all who use magic responsibly.",
        worshippers: ["Wizards", "Sorcerers", "Magical Creatures", "Elves"]
    },
    {
        id: 'oghma',
        name: "Oghma, The Binder of What Is Known",
        domain: "Knowledge, Invention, Inspiration",
        alignment: "True Neutral",
        symbol: "Blank Scroll",
        description: "Oghma is the god of knowledge, bards, and inspiration. He values the pursuit of knowledge for its own sake and the sharing of information.",
        worshippers: ["Bards", "Scholars", "Inventors", "Writers"]
    },
    {
        id: 'gond',
        name: "Gond, Lord of All Smiths",
        domain: "Craft, Smithing, Invention",
        alignment: "True Neutral",
        symbol: "Toothed Cog with Four Spokes",
        description: "Gond is the god of craft, smithwork, and invention. He inspires artificers and craftsmen to create ever more wondrous devices.",
        worshippers: ["Artificers", "Blacksmiths", "Gnomes", "Inventors"]
    },

    // === Racial Deities ===
    {
        id: 'corellon',
        name: "Corellon Larethian, Creator of Elves",
        domain: "Elves, Magic, Arts, Beauty",
        alignment: "Chaotic Good",
        symbol: "Crescent Moon",
        description: "Corellon is the creator and protector of elvenkind. They embody beauty, magic, and the arts, and their followers value freedom and artistic expression.",
        worshippers: ["Elves", "Half-Elves", "Artists", "Archers"]
    },
    {
        id: 'moradin',
        name: "Moradin, The All-Father",
        domain: "Dwarves, Creation, Smithing",
        alignment: "Lawful Good",
        symbol: "Hammer and Anvil",
        description: "Moradin is the creator of dwarves and the god of smithing and creation. He values hard work, craftsmanship, and the defense of dwarven kind.",
        worshippers: ["Dwarves", "Smiths", "Miners", "Craftsmen"]
    },
    {
        id: 'garl_glittergold',
        name: "Garl Glittergold, The Watchful Protector",
        domain: "Gnomes, Humor, Trickery",
        alignment: "Lawful Good",
        symbol: "Gold Nugget",
        description: "Garl Glittergold is the chief deity of gnomes, a trickster god who values humor, cleverness, and protecting his people through wit rather than force.",
        worshippers: ["Gnomes", "Tricksters", "Illusionists", "Inventors"]
    },
    {
        id: 'yondalla',
        name: "Yondalla, The Protector and Provider",
        domain: "Halflings, Fertility, Protection",
        alignment: "Lawful Good",
        symbol: "Cornucopia on Shield",
        description: "Yondalla is the creator and protector of halflings. She values home, family, community, and the simple pleasures of life.",
        worshippers: ["Halflings", "Farmers", "Homemakers", "Protectors"]
    },
    {
        id: 'bahamut',
        name: "Bahamut, The Platinum Dragon",
        domain: "Good Dragons, Justice, Honor",
        alignment: "Lawful Good",
        symbol: "Dragon's Head in Profile",
        description: "Bahamut is the king of good dragons and a god of justice, honor, and wisdom. He opposes evil dragons and protects the innocent.",
        worshippers: ["Paladins", "Good Dragons", "Knights", "Dragonborn"]
    },
    {
        id: 'tiamat',
        name: "Tiamat, Queen of Evil Dragons",
        domain: "Evil Dragons, Greed, Conquest",
        alignment: "Lawful Evil",
        symbol: "Five-Headed Dragon",
        description: "Tiamat is the five-headed queen of evil dragons, embodying greed, vengeance, and tyranny. Her cult seeks to free her from her prison.",
        worshippers: ["Evil Dragons", "Cultists", "Evil Dragonborn", "Kobolds"]
    },

    // === Demon Lords & Archdevils (as dark deities) ===
    {
        id: 'asmodeus',
        name: "Asmodeus, Lord of the Nine Hells",
        domain: "Tyranny, Devils, Contracts",
        alignment: "Lawful Evil",
        symbol: "Three Triangles in Tight Formation",
        description: "Asmodeus is the supreme ruler of the Nine Hells and the god of tyranny and domination. He offers power through diabolic contracts.",
        worshippers: ["Warlocks", "Tyrants", "Lawyers", "Ambitious Nobles"]
    },
    {
        id: 'orcus',
        name: "Orcus, Demon Prince of Undeath",
        domain: "Undeath, Demons, Necromancy",
        alignment: "Chaotic Evil",
        symbol: "Skull-Topped Wand",
        description: "Orcus is the demon prince of undeath, seeking to transform all life into undead servitors. His cult creates and commands the undead.",
        worshippers: ["Necromancers", "Liches", "Undead", "Death Cultists"]
    },
    {
        id: 'demogorgon',
        name: "Demogorgon, Prince of Demons",
        domain: "Demons, Madness, Destruction",
        alignment: "Chaotic Evil",
        symbol: "Two Baboon Heads",
        description: "Demogorgon is the most powerful demon prince, a being of primal destruction and madness. His very presence drives mortals insane.",
        worshippers: ["Cultists", "Mad Wizards", "Aberrations"]
    }
];
