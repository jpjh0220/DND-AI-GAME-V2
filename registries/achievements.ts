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
];