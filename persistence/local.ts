


import { Player, World, LogEntry, Choice, Enemy } from '../types';

const SAVE_KEY_PREFIX = 'mythicRealmsSaveData_';
const MAX_LOG_ENTRIES = 50; // Keep the last 50 log entries in save file

export interface GameState {
  player: Player | null;
  world: World;
  log: LogEntry[];
  choices: Choice[];
  view: string;
  enemy: Enemy | null;
}

export interface SaveSlotSummary {
  slotId: string;
  exists: boolean;
  playerName?: string;
  playerLevel?: number;
  worldDay?: number;
  portrait?: string | null;
}

export const saveGameLocal = (slotId: string, gameState: GameState): void => {
  const primaryKey = `${SAVE_KEY_PREFIX}${slotId}`;
  // Truncate the log to prevent save file from growing too large
  const gameStateToSave = {
    ...gameState,
    log: gameState.log.slice(-MAX_LOG_ENTRIES),
  };

  // Strip non-serializable values and circular references
  let newStateString: string;
  try {
    newStateString = JSON.stringify(gameStateToSave);
  } catch (serializeError) {
    // Fallback: try with a replacer that skips problematic values
    console.warn('Save serialization issue, retrying with safe replacer:', serializeError);
    const seen = new WeakSet();
    newStateString = JSON.stringify(gameStateToSave, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return undefined; // circular ref
        seen.add(value);
      }
      if (typeof value === 'function') return undefined;
      return value;
    });
  }

  try {
    localStorage.setItem(primaryKey, newStateString);
  } catch (storageError) {
    // Storage quota exceeded — try clearing old data and retry once
    console.warn(`Storage quota issue for slot ${slotId}, attempting cleanup...`);
    try {
      // Remove the existing save first to free space, then re-save
      localStorage.removeItem(primaryKey);
      localStorage.setItem(primaryKey, newStateString);
    } catch (retryError) {
      console.error(`Failed to save game to localStorage slot ${slotId}.`, retryError);
      throw retryError;
    }
  }
};

export const loadGameLocal = (slotId: string): GameState | null => {
  try {
    const savedStateString = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
    if (savedStateString === null) {
      return null;
    }
    console.log(`Game loaded from localStorage slot: ${slotId}`);
    return JSON.parse(savedStateString);
  } catch (error) {
    console.error(`Failed to load game from localStorage slot ${slotId}:`, error);
    return null;
  }
};

export const deleteSaveLocal = (slotId: string): void => {
  try {
    localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotId}`);
    console.log(`Local save deleted for slot: ${slotId}`);
  } catch (error) {
    console.error(`Failed to delete local save for slot ${slotId}:`, error);
  }
};

export const getAllSaveSlotSummaries = async (numSlots: number): Promise<SaveSlotSummary[]> => {
  const summaries: SaveSlotSummary[] = [];
  for (let i = 1; i <= numSlots; i++) {
    const slotId = `slot${i}`;
    const savedStateString = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
    if (savedStateString) {
      try {
        const gameState: GameState = JSON.parse(savedStateString);
        summaries.push({
          slotId: slotId,
          exists: true,
          playerName: gameState.player?.name || 'Unknown Hero',
          playerLevel: gameState.player?.level || 1,
          worldDay: gameState.world?.day || 1,
          portrait: gameState.player?.portrait || null,
        });
      } catch (error) {
        console.error(`Error parsing save data for slot ${slotId}:`, error);
        summaries.push({ slotId: slotId, exists: false });
      }
    } else {
      summaries.push({ slotId: slotId, exists: false });
    }
  }
  return summaries;
};