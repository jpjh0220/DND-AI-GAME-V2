import { Achievement } from '../types';

export const ACHIEVEMENTS_DB: Achievement[] = [
    // === Combat Achievements ===
    { id: 'first_blood', name: "First Blood", description: "Defeat your first enemy in combat.", icon: "⚔️", category: "combat", requirement: { type: "kills", count: 1 }, reward: { xp: 50 } },
    { id: 'goblin_slayer', name: "Goblin Slayer", description: "Defeat 10 goblins.", icon: "💀", category: "combat", requirement: { type: "kills", target: "goblin", count: 10 }, reward: { xp: 200, title: "Goblin Slayer" } },
    { id: 'undead_hunter', name: "Undead Hunter", description: "Defeat 25 undead creatures.", icon: "👻", category: "combat", requirement: { type: "kills", target: "undead", count: 25 }, reward: { xp: 500, title: "Undead Hunter" } },
    { id: 'dragon_slayer', name: "Dragon Slayer", description: "Defeat any dragon.", icon: "🐲", category: "combat", requirement: { type: "kills", target: "dragon", count: 1 }, reward: { xp: 2000, title: "Dragon Slayer", item: "ring_protection" } },
    { id: 'giant_killer', name: "Giant Killer", description: "Defeat 5 giants of any type.", icon: "⛰️", category: "combat", requirement: { type: "kills", target: "giant", count: 5 }, reward: { xp: 1000, title: "Giant Killer" } },
    { id: 'monster_hunter', name: "Monster Hunter", description: "Defeat 100 enemies.", icon: "🎯", category: "combat", requirement: { type: "kills", count: 100 }, reward: { xp: 1500, title: "Monster Hunter" } },
    { id: 'legendary_warrior', name: "Legendary Warrior", description: "Defeat 500 enemies.", icon: "👑", category: "combat", requirement: { type: "kills", count: 500 }, reward: { xp: 5000, title: "Legendary Warrior" } },
    { id: 'lich_bane', name: "Lich Bane", description: "Defeat a lich.", icon: "💀", category: "combat", requirement: { type: "kills", target: "lich", count: 1 }, reward: { xp: 5000, title: "Lich Bane" } },
    { id: 'beholder_slayer', name: "Beholder Slayer", description: "Defeat a beholder.", icon: "👁️", category: "combat", requirement: { type: "kills", target: "beholder", count: 1 }, reward: { xp: 3000, title: "Eye Closer" } },
 
    // === Exploration Achievements ===
    { id: 'first_steps', name: "First Steps", description: "Visit your first location outside the starting village.", icon: "🗺️", category: "exploration", requirement: { type: "visits", count: 2 }, reward: { xp: 25 } },
    { id: 'wanderer', name: "Wanderer", description: "Visit 10 different locations.", icon: "🧭", category: "exploration", requirement: { type: "visits", count: 10 }, reward: { xp: 300, title: "Wanderer" } },
    { id: 'explorer', name: "Explorer", description: "Visit 25 different locations.", icon: "📍", category: "exploration", requirement: { type: "visits", count: 25 }, reward: { xp: 1000, title: "Explorer" } },
    { id: 'world_traveler', name: "World Traveler", description: "Visit every location in the world.", icon: "🌍", category: "exploration", requirement: { type: "visits", count: 30 }, reward: { xp: 3000, title: "World Traveler" } },
    { id: 'dungeon_delver', name: "Dungeon Delver", description: "Explore 5 dungeons.", icon: "🔦", category: "exploration", requirement: { type: "visits", target: "dungeon", count: 5 }, reward: { xp: 500, title: "Dungeon Delver" } },
    { id: 'underdark_explorer', name: "Underdark Explorer", description: "Venture into the Underdark.", icon: "🚇", category: "exploration", requirement: { type: "visits", target: "underdark_gate", count: 1 }, reward: { xp: 1000 } },
    { id: 'dragon_lair', name: "Into the Dragon's Den", description: "Enter a dragon's lair.", icon: "🔥", category: "exploration", requirement: { type: "visits", target: "dragon_eyrie", count: 1 }, reward: { xp: 500 } },
 
    // === Collection Achievements ===
    { id: 'collector', name: "Collector", description: "Collect 25 different items.", icon: "📦", category: "collection", requirement: { type: "items", count: 25 }, reward: { xp: 300 } },
    { id: 'hoarder', name: "Hoarder", description: "Collect 100 items total.", icon: "🧳", category: "collection", requirement: { type: "items", count: 100 }, reward: { xp: 1000, title: "Hoarder" } },
    { id: 'wealthy', name: "Wealthy", description: "Accumulate 10,000 gold.", icon: "💰", category: "collection", requirement: { type: "gold", count: 10000 }, reward: { xp: 500 } },
    { id: 'rich', name: "Rich", description: "Accumulate 50,000 gold.", icon: "💎", category: "collection", requirement: { type: "gold", count: 50000 }, reward: { xp: 1500, title: "Wealthy Adventurer" } },
    { id: 'filthy_rich', name: "Filthy Rich", description: "Accumulate 250,000 gold.", icon: "👑", category: "collection", requirement: { type: "gold", count: 250000 }, reward: { xp: 5000, title: "Tycoon" } },
    { id: 'spell_collector', name: "Spell Collector", description: "Learn 10 different spells.", icon: "📜", category: "collection", requirement: { type: "spells", count: 10 }, reward: { xp: 500 } },
    { id: 'arcane_master', name: "Arcane Master", description: "Learn 25 different spells.", icon: "✨", category: "collection", requirement: { type: "spells", count: 25 }, reward: { xp: 1500, title: "Arcane Master" } },
 
    // === Progression Achievements ===
    { id: 'level_5', name: "Adventurer", description: "Reach level 5.", icon: "📈", category: "progression", requirement: { type: "level", count: 5 }, reward: { xp: 200 } },
    { id: 'level_10', name: "Veteran", description: "Reach level 10.", icon: "🎖️", category: "progression", requirement: { type: "level", count: 10 }, reward: { xp: 500, title: "Veteran" } },
    { id: 'level_15', name: "Champion", description: "Reach level 15.", icon: "⭐", category: "progression", requirement: { type: "level", count: 15 }, reward: { xp: 1000, title: "Champion" } },
    { id: 'level_20', name: "Legend", description: "Reach level 20.", icon: "👑", category: "progression", requirement: { type: "level", count: 20 }, reward: { xp: 3000, title: "Living Legend" } },
    { id: 'quest_complete', name: "Quest Complete", description: "Complete your first quest.", icon: "✅", category: "progression", requirement: { type: "quests", count: 1 }, reward: { xp: 100 } },
    { id: 'quest_master', name: "Quest Master", description: "Complete 25 quests.", icon: "📋", category: "progression", requirement: { type: "quests", count: 25 }, reward: { xp: 2000, title: "Quest Master" } },
 
    // === Social Achievements ===
    { id: 'friendly', name: "Friendly", description: "Meet 5 different NPCs.", icon: "👥", category: "social", requirement: { type: "custom", count: 5 }, reward: { xp: 100 } },
    { id: 'diplomat', name: "Diplomat", description: "Resolve a conflict peacefully.", icon: "🤝", category: "social", requirement: { type: "custom", count: 1 }, reward: { xp: 300, title: "Diplomat" } },
    { id: 'guild_member', name: "Guild Member", description: "Join a guild.", icon: "🛡️", category: "social", requirement: { type: "custom", count: 1 }, reward: { xp: 200 } },
 
    // === Secret Achievements ===
    { id: 'tarrasque_survivor', name: "Tarrasque Survivor", description: "Survive an encounter with a tarrasque.", icon: "💀", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 10000, title: "World's Luckiest" } },
    { id: 'mind_flayer_escape', name: "Mind Intact", description: "Escape from a mind flayer without losing your mind.", icon: "🧠", category: "secret", requirement: { type: "kills", target: "mind_flayer", count: 1 }, reward: { xp: 2000 } },
    { id: 'pacifist', name: "Pacifist", description: "Complete a dungeon without killing anyone.", icon: "🕊️", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 1000, title: "Pacifist" } },
    { id: 'from_ashes', name: "From the Ashes", description: "Be revived from death.", icon: "❤️", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 500 } },
    { id: 'against_odds', name: "Against All Odds", description: "Win a battle with less than 5 HP remaining.", icon: "⚡", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 500, title: "Lucky" } },

    // === Additional Combat Achievements ===
    { id: 'orc_slayer', name: "Orc Slayer", description: "Defeat 20 orcs.", icon: "🪓", category: "combat", requirement: { type: "kills", target: "orc", count: 20 }, reward: { xp: 400, title: "Orc Bane" } },
    { id: 'troll_hunter', name: "Troll Hunter", description: "Defeat 5 trolls.", icon: "🔥", category: "combat", requirement: { type: "kills", target: "troll", count: 5 }, reward: { xp: 600, title: "Troll Hunter" } },
    { id: 'demon_slayer', name: "Demon Slayer", description: "Defeat 10 demons or devils.", icon: "😈", category: "combat", requirement: { type: "kills", target: "fiend", count: 10 }, reward: { xp: 2000, title: "Demon Slayer" } },
    { id: 'elemental_master', name: "Elemental Master", description: "Defeat one of each elemental type.", icon: "🌪️", category: "combat", requirement: { type: "kills", target: "elemental", count: 4 }, reward: { xp: 1500, title: "Elemental Master" } },
    { id: 'aberration_hunter', name: "Mind Hunter", description: "Defeat 10 aberrations.", icon: "🐙", category: "combat", requirement: { type: "kills", target: "aberration", count: 10 }, reward: { xp: 1500, title: "Mind Hunter" } },
    { id: 'beast_master', name: "Beast Master", description: "Defeat 50 beasts.", icon: "🐺", category: "combat", requirement: { type: "kills", target: "beast", count: 50 }, reward: { xp: 500, title: "Beast Master" } },
    { id: 'ancient_slayer', name: "Ancient Slayer", description: "Defeat an ancient dragon.", icon: "🐉", category: "combat", requirement: { type: "kills", target: "ancient_dragon", count: 1 }, reward: { xp: 10000, title: "Dragonbane", item: "sword_sunblade" } },
    { id: 'vampire_killer', name: "Vampire Hunter", description: "Defeat a vampire lord.", icon: "🧛", category: "combat", requirement: { type: "kills", target: "vampire", count: 1 }, reward: { xp: 3000, title: "Vampire Hunter" } },
    { id: 'critical_master', name: "Critical Master", description: "Land 50 critical hits.", icon: "💥", category: "combat", requirement: { type: "custom", count: 50 }, reward: { xp: 1000, title: "Critical Master" } },
    { id: 'combo_king', name: "Combo King", description: "Win 10 battles in a row without resting.", icon: "🔗", category: "combat", requirement: { type: "custom", count: 10 }, reward: { xp: 1500, title: "Unstoppable" } },
    { id: 'pit_fiend_slayer', name: "Hell's Bane", description: "Defeat a pit fiend.", icon: "🔱", category: "combat", requirement: { type: "kills", target: "pit_fiend", count: 1 }, reward: { xp: 8000, title: "Hell's Bane" } },
    { id: 'balor_slayer', name: "Demon's End", description: "Defeat a balor.", icon: "🗡️", category: "combat", requirement: { type: "kills", target: "balor", count: 1 }, reward: { xp: 8000, title: "Demon's End" } },
    { id: 'kraken_slayer', name: "Kraken Slayer", description: "Defeat a kraken.", icon: "🦑", category: "combat", requirement: { type: "kills", target: "kraken", count: 1 }, reward: { xp: 10000, title: "Sea's Champion" } },

    // === Additional Exploration Achievements ===
    { id: 'cave_explorer', name: "Cave Explorer", description: "Explore 10 caves or underground locations.", icon: "🕳️", category: "exploration", requirement: { type: "visits", target: "cave", count: 10 }, reward: { xp: 400 } },
    { id: 'city_hopper', name: "City Hopper", description: "Visit 5 different cities.", icon: "🏰", category: "exploration", requirement: { type: "visits", target: "city", count: 5 }, reward: { xp: 500, title: "City Hopper" } },
    { id: 'planar_traveler', name: "Planar Traveler", description: "Visit an extraplanar location.", icon: "🌀", category: "exploration", requirement: { type: "visits", target: "plane", count: 1 }, reward: { xp: 1000, title: "Planar Traveler" } },
    { id: 'deep_delver', name: "Deep Delver", description: "Reach the deepest level of the Underdark.", icon: "⬇️", category: "exploration", requirement: { type: "visits", target: "underdark", count: 1 }, reward: { xp: 2000, title: "Deep Delver" } },
    { id: 'mountain_climber', name: "Mountain Climber", description: "Visit 3 mountain peak locations.", icon: "⛰️", category: "exploration", requirement: { type: "visits", target: "mountain", count: 3 }, reward: { xp: 500, title: "Mountaineer" } },
    { id: 'sea_voyager', name: "Sea Voyager", description: "Visit 5 coastal or underwater locations.", icon: "🌊", category: "exploration", requirement: { type: "visits", target: "ocean", count: 5 }, reward: { xp: 600, title: "Sea Voyager" } },
    { id: 'haunted_explorer', name: "Ghost Hunter", description: "Explore 3 haunted locations.", icon: "👻", category: "exploration", requirement: { type: "visits", target: "haunted", count: 3 }, reward: { xp: 700, title: "Ghost Hunter" } },
    { id: 'desert_wanderer', name: "Desert Wanderer", description: "Survive crossing the Scorched Wastes.", icon: "🏜️", category: "exploration", requirement: { type: "visits", target: "desert", count: 1 }, reward: { xp: 500 } },
    { id: 'temple_raider', name: "Temple Raider", description: "Explore 5 temples or shrines.", icon: "🛕", category: "exploration", requirement: { type: "visits", target: "temple", count: 5 }, reward: { xp: 600, title: "Temple Raider" } },

    // === Additional Collection Achievements ===
    { id: 'legendary_collector', name: "Legendary Collector", description: "Collect 5 legendary items.", icon: "👑", category: "collection", requirement: { type: "items", count: 5 }, reward: { xp: 5000, title: "Legendary Collector" } },
    { id: 'rare_collector', name: "Rare Collector", description: "Collect 20 rare items.", icon: "💎", category: "collection", requirement: { type: "items", count: 20 }, reward: { xp: 2000 } },
    { id: 'weapon_collector', name: "Arsenal", description: "Collect 25 different weapons.", icon: "🗡️", category: "collection", requirement: { type: "items", count: 25 }, reward: { xp: 1000, title: "Arms Dealer" } },
    { id: 'armor_collector', name: "Armory", description: "Collect 15 different armors.", icon: "🛡️", category: "collection", requirement: { type: "items", count: 15 }, reward: { xp: 800 } },
    { id: 'potion_hoarder', name: "Potion Hoarder", description: "Collect 50 potions.", icon: "🧪", category: "collection", requirement: { type: "items", count: 50 }, reward: { xp: 600, title: "Alchemist" } },
    { id: 'ring_bearer', name: "Ring Bearer", description: "Collect 10 magical rings.", icon: "💍", category: "collection", requirement: { type: "items", count: 10 }, reward: { xp: 1500 } },
    { id: 'dragon_hoard', name: "Dragon's Hoard", description: "Accumulate 500,000 gold.", icon: "🐲", category: "collection", requirement: { type: "gold", count: 500000 }, reward: { xp: 10000, title: "Dragonwealthy" } },
    { id: 'artifact_keeper', name: "Artifact Keeper", description: "Possess an artifact-level item.", icon: "✨", category: "collection", requirement: { type: "items", count: 1 }, reward: { xp: 8000, title: "Artifact Keeper" } },
    { id: 'material_gatherer', name: "Material Gatherer", description: "Collect 100 crafting materials.", icon: "🧱", category: "collection", requirement: { type: "items", count: 100 }, reward: { xp: 800, title: "Gatherer" } },

    // === Additional Progression Achievements ===
    { id: 'level_3', name: "Promising", description: "Reach level 3.", icon: "🌱", category: "progression", requirement: { type: "level", count: 3 }, reward: { xp: 100 } },
    { id: 'max_level', name: "Maximum Power", description: "Reach the maximum level.", icon: "🌟", category: "progression", requirement: { type: "level", count: 30 }, reward: { xp: 10000, title: "Transcendent" } },
    { id: 'multiclasser', name: "Jack of All Trades", description: "Learn abilities from multiple classes.", icon: "🎭", category: "progression", requirement: { type: "custom", count: 2 }, reward: { xp: 1500, title: "Jack of All Trades" } },
    { id: 'quest_veteran', name: "Quest Veteran", description: "Complete 50 quests.", icon: "📜", category: "progression", requirement: { type: "quests", count: 50 }, reward: { xp: 4000, title: "Quest Veteran" } },
    { id: 'quest_legend', name: "Quest Legend", description: "Complete 100 quests.", icon: "🏆", category: "progression", requirement: { type: "quests", count: 100 }, reward: { xp: 8000, title: "Quest Legend" } },
    { id: 'feat_collector', name: "Feat Collector", description: "Acquire 5 feats.", icon: "📖", category: "progression", requirement: { type: "feats", count: 5 }, reward: { xp: 1500 } },
    { id: 'spell_master', name: "Spell Master", description: "Learn 50 different spells.", icon: "🔮", category: "progression", requirement: { type: "spells", count: 50 }, reward: { xp: 3000, title: "Spell Master" } },
    { id: 'skill_master', name: "Skill Master", description: "Max out a skill.", icon: "📊", category: "progression", requirement: { type: "custom", count: 1 }, reward: { xp: 2000, title: "Skill Master" } },

    // === Faction Achievements ===
    { id: 'faction_initiate', name: "Faction Initiate", description: "Join a faction.", icon: "🤝", category: "social", requirement: { type: "faction", count: 1 }, reward: { xp: 200 } },
    { id: 'faction_trusted', name: "Faction Trusted", description: "Reach the second rank in any faction.", icon: "⬆️", category: "social", requirement: { type: "custom", count: 2 }, reward: { xp: 500 } },
    { id: 'faction_leader', name: "Faction Leader", description: "Reach the highest rank in any faction.", icon: "👑", category: "social", requirement: { type: "custom", count: 5 }, reward: { xp: 3000, title: "Faction Leader" } },
    { id: 'multi_faction', name: "Faction Diplomat", description: "Be a member of 3 different factions.", icon: "🕊️", category: "social", requirement: { type: "factions", count: 3 }, reward: { xp: 2000, title: "Diplomat" } },
    { id: 'faction_enemy', name: "Faction Enemy", description: "Become hostile with a faction.", icon: "💔", category: "social", requirement: { type: "custom", count: 1 }, reward: { xp: 500, title: "Outlaw" } },

    // === NPC & Social Achievements ===
    { id: 'socialite', name: "Socialite", description: "Meet 25 different NPCs.", icon: "💬", category: "social", requirement: { type: "npcs", count: 25 }, reward: { xp: 500, title: "Socialite" } },
    { id: 'everybody_knows', name: "Everybody Knows Your Name", description: "Meet 50 different NPCs.", icon: "🌟", category: "social", requirement: { type: "npcs", count: 50 }, reward: { xp: 1500, title: "Famous" } },
    { id: 'shopaholic', name: "Shopaholic", description: "Buy 100 items from shops.", icon: "🛒", category: "social", requirement: { type: "purchases", count: 100 }, reward: { xp: 500 } },
    { id: 'haggler', name: "Haggler", description: "Complete 50 trades.", icon: "💰", category: "social", requirement: { type: "trades", count: 50 }, reward: { xp: 600, title: "Haggler" } },
    { id: 'royal_audience', name: "Royal Audience", description: "Speak with a monarch.", icon: "👸", category: "social", requirement: { type: "custom", count: 1 }, reward: { xp: 500 } },
    { id: 'dragon_friend', name: "Dragon Friend", description: "Successfully negotiate with a dragon.", icon: "🐲", category: "social", requirement: { type: "custom", count: 1 }, reward: { xp: 2000, title: "Dragon Friend" } },

    // === Crafting Achievements ===
    { id: 'first_craft', name: "First Creation", description: "Craft your first item.", icon: "🔨", category: "crafting", requirement: { type: "crafts", count: 1 }, reward: { xp: 100 } },
    { id: 'apprentice_crafter', name: "Apprentice Crafter", description: "Craft 10 items.", icon: "🛠️", category: "crafting", requirement: { type: "crafts", count: 10 }, reward: { xp: 300 } },
    { id: 'master_crafter', name: "Master Crafter", description: "Craft 50 items.", icon: "⚒️", category: "crafting", requirement: { type: "crafts", count: 50 }, reward: { xp: 1000, title: "Master Crafter" } },
    { id: 'legendary_crafter', name: "Legendary Crafter", description: "Craft a legendary item.", icon: "🌟", category: "crafting", requirement: { type: "crafts", count: 1 }, reward: { xp: 5000, title: "Legendary Crafter" } },
    { id: 'potion_brewer', name: "Potion Brewer", description: "Brew 20 potions.", icon: "🍾", category: "crafting", requirement: { type: "crafts", count: 20 }, reward: { xp: 600, title: "Alchemist" } },
    { id: 'weaponsmith', name: "Weaponsmith", description: "Forge 10 weapons.", icon: "⚔️", category: "crafting", requirement: { type: "crafts", count: 10 }, reward: { xp: 800, title: "Weaponsmith" } },
    { id: 'armorsmith', name: "Armorsmith", description: "Craft 10 pieces of armor.", icon: "🛡️", category: "crafting", requirement: { type: "crafts", count: 10 }, reward: { xp: 800, title: "Armorsmith" } },

    // === Additional Secret Achievements ===
    { id: 'one_hp', name: "By a Thread", description: "Survive a battle with exactly 1 HP.", icon: "🎯", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 800, title: "Death Cheater" } },
    { id: 'overkill', name: "Overkill", description: "Deal 100+ damage in a single attack.", icon: "💥", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 1000, title: "Devastator" } },
    { id: 'genocide', name: "Extinction", description: "Defeat 1000 creatures.", icon: "💀", category: "secret", requirement: { type: "kills", count: 1000 }, reward: { xp: 10000, title: "Extinction" } },
    { id: 'fey_touched', name: "Fey Touched", description: "Visit the Feywild.", icon: "🧚", category: "secret", requirement: { type: "visits", count: 1 }, reward: { xp: 1500, title: "Fey Touched" } },
    { id: 'shadow_touched', name: "Shadow Touched", description: "Visit the Shadowfell.", icon: "🌑", category: "secret", requirement: { type: "visits", count: 1 }, reward: { xp: 1500, title: "Shadow Touched" } },
    { id: 'hell_walker', name: "Hell Walker", description: "Visit the Nine Hells.", icon: "🔥", category: "secret", requirement: { type: "visits", count: 1 }, reward: { xp: 2000, title: "Hell Walker" } },
    { id: 'abyss_survivor', name: "Abyss Survivor", description: "Visit the Abyss and return alive.", icon: "😈", category: "secret", requirement: { type: "visits", count: 1 }, reward: { xp: 2000, title: "Abyss Survivor" } },
    { id: 'deck_drawer', name: "Fate's Gambler", description: "Draw from the Deck of Many Things.", icon: "🃏", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 5000, title: "Fate's Gambler" } },
    { id: 'wish_maker', name: "Wish Maker", description: "Cast the Wish spell.", icon: "⭐", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 10000, title: "Wish Maker" } },
    { id: 'true_hero', name: "True Hero", description: "Save a village from destruction.", icon: "🦸", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 3000, title: "Hero" } },
    { id: 'villain', name: "Villain", description: "Destroy a village.", icon: "💀", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 3000, title: "Villain" } },
    { id: 'speedrunner', name: "Speedrunner", description: "Reach level 10 within 100 turns.", icon: "⏱️", category: "secret", requirement: { type: "custom", count: 1 }, reward: { xp: 5000, title: "Speedrunner" } },
    { id: 'completionist', name: "Completionist", description: "Unlock all other achievements.", icon: "🏅", category: "secret", requirement: { type: "achievements", count: 99 }, reward: { xp: 20000, title: "Completionist" } },
];