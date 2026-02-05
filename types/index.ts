

// --- TYPE DEFINITIONS ---
declare global {
  var __firebase_config: any;
  var __app_id: string;
  var __initial_auth_token: string;
}

export interface PlayerStats { str: number; dex: number; con: number; int: number; wis: number; cha: number; }
export interface Item { id?: string; name: string; type: string; rarity?: string; value?: number; weight?: number; effect?: { [key: string]: number }; slot?: string; damageRoll?: string; ac?: number; power?: number; twoHanded?: boolean; statsBonus?: Partial<PlayerStats>; description?: string; }
export interface Spell { id: string; name: string; cost: number; damage?: number; heal?: number; buff?: string; duration?: number; school: string; target: 'enemy' | 'ally' | 'self'; description?: string; }
export interface Quest { title: string; description: string; status: 'active' | 'completed'; }
export interface NPC {
  id: string;
  name: string;
  role: string;
  location: string;
  portrait?: string | null;
  description?: string;
  questGiver?: boolean;
  shopkeeper?: boolean;
  factionAffiliation?: string;
  disposition?: number; // -100 (hostile) to 100 (ally), default 0 (neutral)
  memories?: string[]; // Things this NPC remembers about the player
}

export interface Companion {
  id: string;
  name: string;
  class?: string;
  level: number;
  hp: number;
  hpMax: number;
  ac: number;
  attackBonus: number;
  damageRoll: string;
  portrait?: string | null;
  abilities?: string[];
  isActive: boolean; // Currently in party
  loyalty: number; // 0-100, affects combat behavior
}

export interface Enemy { 
  id?: string;
  name: string; 
  hp: number; 
  hpMax: number; 
  ac: number; 
  damageRoll: string; 
  type?: string; 
  challenge?: number;
  speed?: number;
  xp?: number;
  loot?: string[];
  description?: string;
  abilities?: string[];
  resistances?: string[];
  vulnerabilities?: string[];
  immunities?: string[];
}

export interface Achievement { 
  id: string; 
  name: string; 
  description: string; 
  icon: string; 
  category: string; 
  requirement?: { type: string; target?: string; count: number };
  reward?: { xp?: number; title?: string; item?: string };
}

export interface Location { 
  id: string; 
  name: string; 
  description: string; 
  type: string; 
  dangerLevel: number; 
  connections?: string[];
  npcs?: string[]; // References NPC.id
  shopIds?: string[]; // References ShopData.id
  monsters?: string[]; // References Enemy.id
  encounters?: string[]; // References Encounter.id
}

// New Interfaces
export interface Recipe {
  id: string;
  name: string;
  description: string;
  materials: { itemId: string; quantity: number }[];
  result: { itemId: string; quantity: number }[];
  skillRequired?: string;
  dc?: number;
}

export interface FactionData {
  id: string;
  name: string;
  description: string;
  alignment: string;
  headquarters?: string;
  ranks?: string[];
  reputationEffects?: { minRep: number; effect: string }[];
}

export interface DeityData {
  id: string;
  name: string;
  domain: string;
  alignment: string;
  symbol: string;
  description: string;
  worshippers?: string[];
}

export interface ShopData {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'weapon' | 'armor' | 'magic' | 'alchemist' | 'special';
  inventory: { itemId: string; quantity: number }[];
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number | 'permanent'; // in turns, or 'permanent'
  effect: Partial<PlayerStats> & {
    hpPerTurn?: number;
    mpPerTurn?: number;
    staminaPerTurn?: number;
    acModifier?: number;
    speedModifier?: number;
    damageModifier?: number; // Raw damage modifier to player attacks
    disableAction?: string; // e.g., 'attack', 'cast'
    resistances?: string[]; // damage types
    vulnerabilities?: string[]; // damage types
  };
}

export interface Encounter {
  id: string;
  name: string;
  type: 'combat' | 'social' | 'environmental' | 'discovery';
  description: string;
  challengeRating?: number; // For combat encounters
  enemyIds?: string[]; // References Enemy.id for combat
  npcId?: string; // References NPC.id for social
  rewards?: { xp?: number; currency?: number; itemIds?: string[] };
  choices?: Choice[]; // Specific choices for social/discovery
}

export interface LoreEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags?: string[];
  location?: string;
}

export interface RumorEntry {
  id: string;
  title: string;
  region: string;
  tone: string;
  source: string;
  detail: string;
}


export interface Player { 
  name: string; 
  race: string; 
  class: string; 
  level: number; 
  xp: number; 
  hpMax: number; 
  hpCurrent: number; 
  manaMax: number; 
  manaCurrent: number; 
  staminaMax: number; 
  staminaCurrent: number; 
  currency: number; 
  stats: PlayerStats; 
  inventory: Item[]; 
  equipment: { [key: string]: Item }; 
  spells: Spell[]; 
  quests: Quest[]; 
  factions: { [key: string]: number }; 
  knownNPCs: NPC[]; 
  achievements: string[]; 
  exhaustion: number; 
  hungerDays: number; 
  thirstDays: number; 
  ac: number; 
  background: string; 
  concept: string; 
  proficiencies: { skills: string[]; savingThrows: string[]; }; 
  personality: { traits: string; ideals: string; bonds: string; flaws: string; }; 
  portrait?: string | null;
  activeNPC?: NPC | null;
  feats: string[];
  statusEffects: StatusEffect[];
  companions?: Companion[]; // Party members that fight alongside player
}

export interface WorldConsequence {
  id: string;
  description: string;
  location?: string;
  timestamp: { day: number; hour: number };
  impact: 'minor' | 'moderate' | 'major' | 'world-altering';
  affectedNPCs?: string[]; // NPC IDs
  affectedFactions?: string[]; // Faction IDs
}

export interface World {
  day: number;
  hour: number;
  weather: string;
  facts: string[];
  eventLog: any[];
  consequences?: WorldConsequence[]; // Player choices that changed the world
}
// FIX: Add 'text: string' to SkillCheckDetails
export interface SkillCheckDetails { skill: string; roll: number; bonus: number; total: number; dc: number; success: boolean; text: string; }
// FIX: Add 'discovery' to Choice intent type
export interface LogEntry { type: 'player' | 'narration' | 'error' | 'levelup' | 'combat' | 'skillcheck' | 'milestone' | 'worldevent'; text: string; details?: SkillCheckDetails; image?: string | null; }
export interface Choice { id: string; label: string; intent: 'travel' | 'combat' | 'social' | 'buy' | 'rest' | 'system' | 'craft' | 'discovery'; manaCost?: number; staminaCost?: number; }
export interface RaceData { traits: string[]; speed: number; bonus?: { [key: string]: number }; subraces?: string[]; startingLocation?: string; }
export interface ClassData { hd: number; mana: number; stamina: number; gear: string; savingThrows: string[]; skills: string[]; features: string[]; primaryStats: (keyof PlayerStats)[]; spells?: string[]; startingLocation?: string; }
export interface BackgroundData { skills: string[]; gear: string; feature: string; }
