


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
  try {
    // Truncate the log to prevent save file from growing too large
    const gameStateToSave = {
      ...gameState,
      log: gameState.log.slice(-MAX_LOG_ENTRIES),
    };
    const newStateString = JSON.stringify(gameStateToSave);
    localStorage.setItem(primaryKey, newStateString);
    console.log(`Game saved to localStorage slot: ${slotId} (log truncated)`);
  } catch (error) {
    console.error(`Failed to save game to localStorage slot ${slotId}. The browser's storage quota may be full.`, error);
    // Re-throw the error so the UI could potentially be notified.
    throw error;
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