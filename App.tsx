

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { RefreshCw, Heart, Zap, Wind, Coins, Map, User, Backpack, Star, Menu, Shield, MapPin, Anchor, CloudRain, CloudLightning, Globe } from 'lucide-react';

import { Player, World, LogEntry, Choice, Item, Enemy, SkillCheckDetails, NPC, Achievement, PlayerStats, Recipe, ShopData, Encounter, StatusEffect } from './types';
import { getFirebaseConfig } from './firebase/index';
import { formatCurrency, createCharacter, checkSurvival, calculatePlayerAC, calculateXpToNextLevel, handleLevelUp, ALL_SKILLS, getMod, parseDamageRoll, createDefaultCharacter, getCurrentLocation, calculateEncumbrance, calculateMaxCarry, MemoryStore, logEntryToMemory, getActionModifiers, getChoiceEffectiveCost } from './systems/index';
import { callGeminiAPI, buildPrompt, generateSceneImage } from './api/index';
import { saveGame as saveGameCloud } from './persistence/cloud';
import { saveGameLocal, loadGameLocal, deleteSaveLocal, GameState, SaveSlotSummary, getAllSaveSlotSummaries } from './persistence/local';
import {
  Landing, CharacterCreator, GameView, CharacterSheet, InventoryScreen, SpellScreen, QuestScreen, JournalScreen, CodexScreen, MainMenu,
  FeatScreen, FactionScreen, PartyScreen, MapScreen, SettingsPage, EquipmentScreen, ShopScreen, CombatScreen, StartScreen, RestScreen,
  AchievementScreen, CraftingScreen
} from './components/index';
import { Bar, NavBtn, ToastContainer, ToastMessage, AtmosphereOverlay, DiceRollOverlay } from './components/ui';
import { ITEMS_DB, ACHIEVEMENTS_DB, NPCS_DB, SHOPS_DB, ENCOUNTERS_DB, RECIPES_DB, LOCATIONS_DB, ENEMIES_DB } from './registries/index';

export default function App() {
  const [view, setView] = useState<string>('landing');
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [world, setWorld] = useState<World>({ day: 1, hour: 8, weather: "Clear", facts: [], eventLog: [] });
  const [log, setLog] = useState<LogEntry[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [shop, setShop] = useState<{name: string, inventory: Item[]}|null>(null);
  // NEW: State for crafting system
  const [craftingInventory, setCraftingInventory] = useState<{name: string, recipes: Recipe[]}|null>(null);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeSkillCheck, setActiveSkillCheck] = useState<SkillCheckDetails & { dc: number, text: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>("");
  const memoryStoreRef = useRef<MemoryStore | null>(null);


  useEffect(() => {
    const init = async () => {
      try {
        const config = getFirebaseConfig();
        if (config) {
          const app: FirebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();
          const auth: Auth = getAuth(app);
          const firestore: Firestore = getFirestore(app);
          setDb(firestore);
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
          else await signInAnonymously(auth);
          onAuthStateChanged(auth, (u: FirebaseUser | null) => { setUser(u); setLoading(false); });
        } else { setLoading(false); }
      } catch (e) { setLoading(false); }
    };
    init();
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateGameState = useCallback((newGameState: GameState) => {
    setPlayer(newGameState.player);
    setWorld(newGameState.world);
    setLog(newGameState.log);
    setChoices(newGameState.choices);
    setView(newGameState.view);
    setEnemy(newGameState.enemy);
  }, []);

  const handleLoadGame = useCallback(async (slotId: string) => {
    const loadedState = loadGameLocal(slotId);
    if (loadedState && loadedState.player) {
      updateGameState(loadedState);
      setCurrentSlotId(slotId);
      localStorage.setItem('lastPlayedSlotId', slotId);
      setView('game');
    } else {
      setCurrentSlotId(slotId);
      setView('creator');
    }
    // Initialize RAG memory store for this save slot
    const store = new MemoryStore(slotId);
    await store.load();
    memoryStoreRef.current = store;
    console.log(`MemoryStore loaded for slot ${slotId}: ${store.count} memories`);
  }, [updateGameState]);

  useEffect(() => {
    if (!loading) {
      setView('startScreen');
    }
  }, [loading, handleLoadGame]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (currentSlotId && event.key === `mythicRealmsSaveData_${currentSlotId}`) handleLoadGame(currentSlotId);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentSlotId, handleLoadGame]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [log, processing]);

  const handleNewGameStart = (summary: SaveSlotSummary) => {
    const { slotId, exists, playerName, playerLevel } = summary;
    if (exists) {
      const confirmed = window.confirm(`Overwrite ${playerName}'s save?`);
      if (!confirmed) return;
    }
    deleteSaveLocal(slotId);
    setCurrentSlotId(slotId);
    localStorage.setItem('lastPlayedSlotId', slotId);
    setPlayer(null);
    setWorld({ day: 1, hour: 8, weather: "Clear", facts: [], eventLog: [] });
    setLog([]);
    setChoices([]);
    setEnemy(null);
    setView('creator');
  };

  const handleQuickStart = useCallback(async () => {
    try {
      const summaries = await getAllSaveSlotSummaries(5);
      let targetSlotId: string | null = null;
      for (const summary of summaries) { if (!summary.exists) { targetSlotId = summary.slotId; break; } }
      if (!targetSlotId) targetSlotId = 'slot1';
      deleteSaveLocal(targetSlotId);
      // FIX: Initialize player with empty statusEffects array
      const { player: dp, world: dw, log: dl, choices: dc } = createDefaultCharacter();
      dp.statusEffects = [];
      setPlayer(dp); setWorld(dw); setLog(dl); setChoices(dc);
      setCurrentSlotId(targetSlotId); localStorage.setItem('lastPlayedSlotId', targetSlotId);
      saveGameLocal(targetSlotId, { player: dp, world: dw, log: dl, choices: dc, view: 'game', enemy: null });
      // Initialize fresh memory store for new game
      const store = new MemoryStore(targetSlotId);
      await store.load();
      memoryStoreRef.current = store;
      setView('game');
      addToast(`Quick Start: ${dp.name}!`, "success");
    } catch (error) {
      console.error('Quick Start failed:', error);
      setView('startScreen');
      addToast('Quick Start failed. Please try again.', 'danger');
    }
  }, [addToast]);

  const tickWorld = (p: Player, w: World, hoursPassed: number): { player: Player, world: World, logs: string[] } => {
    const nextPlayer = { ...p };
    const nextWorld = { ...w };
    const logs: string[] = [];

    nextWorld.hour += hoursPassed;
    if (nextWorld.hour >= 24) {
      nextWorld.day += Math.floor(nextWorld.hour / 24);
      nextWorld.hour %= 24;
      const survival = checkSurvival(nextPlayer);
      nextPlayer.hpCurrent = survival.player.hpCurrent;
      nextPlayer.exhaustion = survival.player.exhaustion;
      nextPlayer.inventory = survival.player.inventory;
      // FIX: Apply status effects directly to nextPlayer within tickWorld
      nextPlayer.statusEffects = survival.player.statusEffects;
      logs.push(...survival.messages);
    }
    return { player: nextPlayer, world: nextWorld, logs };
  };

  const executeTurn = async (actionText: string, choice?: Choice, rollOverride?: SkillCheckDetails & { dc: number, text: string }) => {
    if (choice?.intent === 'system') { if (choice.id === 'settings') setView('settings'); return; }
    // NEW: Handle crafting intent
    if (choice?.intent === 'craft') { if (choice.id === 'crafting') setView('crafting'); return; }

    if (processing || !actionText || !actionText.trim() || !player || !currentSlotId) return;
    
    let nextPlayer = { ...player, inventory: [...player.inventory], quests: [...(player.quests || [])], statusEffects: [...player.statusEffects] };
    let nextWorld = { ...world, facts: [...world.facts] };
    const currentWeight = calculateEncumbrance(nextPlayer.inventory);
    const maxWeight = calculateMaxCarry(nextPlayer.stats.str);
    const isEncumbered = currentWeight > maxWeight;

    if (choice) {
      let mCost = choice.manaCost || 0;
      let sCost = choice.staminaCost || 0;
      const weatherLower = nextWorld.weather.toLowerCase();
      if (weatherLower.includes('storm')) { mCost += 3; sCost += 2; }
      else if (weatherLower.includes('rain')) sCost += 2;
      if (isEncumbered && (choice.intent === 'travel' || choice.intent === 'combat')) sCost *= 2;

      if (nextPlayer.manaCurrent < mCost || nextPlayer.staminaCurrent < sCost) {
        addToast("Too tired/drained to do that!", "danger");
        return;
      }
      nextPlayer.manaCurrent -= mCost;
      nextPlayer.staminaCurrent -= sCost;
      if (mCost > 0) addToast(`-${mCost} MP`, "info");
      if (sCost > 0) addToast(`-${sCost} ST`, isEncumbered ? 'danger' : 'info');
    }

    // Determine if world event should be triggered - now also for encounters
    const currentLocationFacts = getCurrentLocation(nextWorld.facts);
    const currentLocData = LOCATIONS_DB.find(loc => loc.name === currentLocationFacts);
    const hasEncounters = (currentLocData?.encounters?.length || 0) > 0;
    const isExploration = !enemy && (choice?.intent === 'travel' || choice?.intent === 'social' || !choice);
    const worldEventTriggered = isExploration && hasEncounters && Math.random() < 0.15; // 15% chance for encounter

    setProcessing(true); setInput("");
    let nextLog = [...log];
    if (!rollOverride) {
      nextLog = [...log, { type: 'player' as const, text: actionText }];
      setLog(nextLog);
    }

    try {
      const model = "gemini-3-flash-preview";
      // RAG: Retrieve relevant past memories to augment the prompt
      const retrievedMemories = memoryStoreRef.current
          ? memoryStoreRef.current.retrieve(actionText, 5)
          : [];
      const prompt = buildPrompt(nextPlayer, nextWorld, actionText, enemy, rollOverride, worldEventTriggered, retrievedMemories);
      const aiData = await callGeminiAPI(prompt, model);
      const p = aiData.patch || {};
      let finalLog = [...nextLog];

      if (!rollOverride && p.skillCheck?.skill) {
          const { skill, dc } = p.skillCheck;
          const statKey = ALL_SKILLS[skill as keyof typeof ALL_SKILLS];
          const bonus = getMod(nextPlayer.stats[statKey]) + (nextPlayer.proficiencies.skills.includes(skill) ? 2 : 0);
          const roll = Math.floor(Math.random() * 20) + 1;
          // FIX: Add 'text: actionText' to activeSkillCheck state.
          setActiveSkillCheck({ skill, roll, bonus, total: roll + bonus, dc, success: roll + bonus >= dc, text: actionText });
          setPlayer(nextPlayer); setProcessing(false); 
          return;
      }

      // NEW: Handle NPC introduction (now using NPC ID from DB)
      if (p.npc?.id) {
        const npcData = NPCS_DB.find(n => n.id === p.npc.id);
        if (npcData) {
            const existing = nextPlayer.knownNPCs.find(n => n.id === npcData.id);
            if (!existing) {
                const npcImg = await generateSceneImage(`Fantasy portrait: ${npcData.name}, ${npcData.role}.`);
                const newNPC = { ...npcData, portrait: npcImg };
                nextPlayer.knownNPCs.push(newNPC); 
                nextPlayer.activeNPC = newNPC;
            } else { nextPlayer.activeNPC = existing; }
        } else {
            console.warn(`NPC with ID ${p.npc.id} not found in NPCS_DB.`);
        }
      } else if (choice?.intent === 'travel') nextPlayer.activeNPC = null;

      if (rollOverride) {
        finalLog.push({ type: 'skillcheck' as const, text: `${rollOverride.skill} Roll: ${rollOverride.total} (DC ${rollOverride.dc})`, details: rollOverride });
        setActiveSkillCheck(null);
      }

      if (p.eventTitle) {
          finalLog.push({ type: 'worldevent', text: p.eventTitle });
      }

      if (!enemy && p.hpDelta) {
        nextPlayer.hpCurrent = Math.min(nextPlayer.hpMax, Math.max(0, nextPlayer.hpCurrent + p.hpDelta));
        addToast(`${p.hpDelta > 0 ? '+' : ''}${p.hpDelta} HP`, p.hpDelta > 0 ? 'success' : 'danger');
      }
      
      // NEW: Apply/remove status effects
      if (p.addStatusEffect) {
          const newEffect: StatusEffect = p.addStatusEffect;
          // Check if effect already exists
          if (!nextPlayer.statusEffects.some(e => e.id === newEffect.id)) {
              nextPlayer.statusEffects.push(newEffect);
              addToast(`Status Effect: ${newEffect.name} applied!`, 'info');
          }
      }
      if (p.removeStatusEffect) {
          const removedEffect = nextPlayer.statusEffects.find(e => e.id === p.removeStatusEffect);
          if (removedEffect) {
              nextPlayer.statusEffects = nextPlayer.statusEffects.filter(e => e.id !== p.removeStatusEffect);
              addToast(`Status Effect: ${removedEffect.name} removed!`, 'info');
          }
      }

      if (!enemy) {
        const tick = tickWorld(nextPlayer, nextWorld, p.timeDelta || 1);
        nextPlayer.hpCurrent = tick.player.hpCurrent;
        nextPlayer.exhaustion = tick.player.exhaustion;
        nextPlayer.inventory = tick.player.inventory;
        nextPlayer.statusEffects = tick.player.statusEffects; // Update with processed status effects
        nextWorld.hour = tick.world.hour;
        nextWorld.day = tick.world.day;
        tick.logs.forEach(m => addToast(m, 'info'));
        if (p.weather) nextWorld.weather = p.weather;
      }

      nextPlayer.currency = Math.max(0, nextPlayer.currency + Math.floor(p.currencyDelta || 0)); 
      if (p.addItemId) {
        const item = ITEMS_DB.find(i => i.id === p.addItemId);
        if (item) nextPlayer.inventory.push({ ...item });
      }
      if (p.xpDelta > 0) {
          nextPlayer.xp += p.xpDelta;
          addToast(`+${p.xpDelta} XP`, 'info');
      }

      // Achievement processing
      if (p.achievement && !nextPlayer.achievements.includes(p.achievement)) {
          const achievement = ACHIEVEMENTS_DB.find(a => a.id === p.achievement);
          if (achievement) {
              nextPlayer.achievements.push(p.achievement);
              finalLog.push({ type: 'milestone', text: `ACHIEVEMENT UNLOCKED: ${achievement.name} - ${achievement.description}` });
              addToast(`Achievement: ${achievement.name}!`, 'success');
          }
      }

      let currentEnemy = enemy;
      // NEW: Handle starting a combat encounter based on AI patch
      if (p.startEncounter?.id) {
          const encounterData = ENCOUNTERS_DB.find(e => e.id === p.startEncounter.id);
          if (encounterData && encounterData.type === 'combat' && encounterData.enemyIds && encounterData.enemyIds.length > 0) {
              // For simplicity, pick the first enemy in the list as the primary one for the current combat UI
              const enemyId = encounterData.enemyIds[0];
              const enemyDetails = ENEMIES_DB.find(e => e.id === enemyId);
              if (enemyDetails) {
                  currentEnemy = { ...enemyDetails, hpMax: enemyDetails.hp };
                  setEnemy(currentEnemy); 
                  setView('combat');
                  finalLog.push({ type: 'worldevent', text: `You are ambushed by a ${currentEnemy.name}!` });
              }
          }
      } else if (p.startCombat) {
        currentEnemy = { ...p.startCombat, hpMax: p.startCombat.hp };
        setEnemy(currentEnemy); setView('combat');
      } else if (currentEnemy) {
        if (p.playerAttackHitsEnemy) {
          const weapon = nextPlayer.equipment.mainHand;
          let baseDmg = 0;
          if (weapon?.damageRoll) baseDmg = parseDamageRoll(weapon.damageRoll);
          else if (weapon?.power) baseDmg = weapon.power;
          else baseDmg = parseDamageRoll("1d4");
          
          const effectDmg = weapon?.effect ? Object.values(weapon.effect).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) : 0;
          let totalDmg = baseDmg + effectDmg + getMod(nextPlayer.stats.str);
          
          // Apply damage modifiers from status effects
          nextPlayer.statusEffects.forEach(se => {
              if (se.effect.damageModifier) totalDmg += se.effect.damageModifier;
          });

          currentEnemy.hp = Math.max(0, currentEnemy.hp - totalDmg);
        }
        if (p.enemyAttackHitsPlayer) {
          const dmg = parseDamageRoll(currentEnemy.damageRoll);
          nextPlayer.hpCurrent = Math.max(0, nextPlayer.hpCurrent - dmg);
        }
        if (p.endCombat || currentEnemy.hp <= 0) {
          if (currentEnemy.hp <= 0) finalLog.push({ type: 'milestone', text: `${currentEnemy.name} slain.` });
          setEnemy(null); currentEnemy = null; setView('game');
        }
      }

      if (nextPlayer.xp >= calculateXpToNextLevel(nextPlayer.level)) {
          const lvl = handleLevelUp(nextPlayer);
          nextPlayer.level = lvl.player.level; nextPlayer.hpMax = lvl.player.hpMax;
          lvl.messages.forEach(m => finalLog.push({ type: 'levelup', text: m }));
      }

      // NEW: Handle starting a shop (now using shopId from DB)
      if (p.startShop?.shopId) {
          const shopData = SHOPS_DB.find(s => s.id === p.startShop.shopId);
          if (shopData) {
              const shopInventoryItems: Item[] = shopData.inventory
                  .map(invItem => {
                      const item = ITEMS_DB.find(dbItem => dbItem.id === invItem.itemId);
                      return item ? Array(invItem.quantity).fill({ ...item }) : null;
                  })
                  .filter((item): item is Item[] => !!item)
                  .flat();
              setShop({ name: shopData.name, inventory: shopInventoryItems });
              setView('shop');
          } else {
              console.warn(`Shop with ID ${p.startShop.shopId} not found in SHOPS_DB.`);
          }
      }

      let newImg: string | null = null;
      if (p.scenePrompt) {
          newImg = await generateSceneImage(p.scenePrompt);
      }
      finalLog.push({ type: 'narration' as const, text: aiData.narration, image: newImg });
      
      const cleanedChoices = (aiData.choices || []).map((c: Choice) => ({
        ...c,
        label: c.label
            .replace(/\s*\(\)$/, '')
            .replace(/commotior/gi, 'commotion')
            .replace(/^Speak again, inq$/, 'Speak again, inquire further')
            .trim()
      }));

      // RAG: Store new narration and events as memories for future retrieval
      if (memoryStoreRef.current && aiData.narration) {
          const narrationMemory = logEntryToMemory(
              { type: 'narration', text: aiData.narration },
              nextWorld,
              nextPlayer
          );
          if (narrationMemory) {
              // Add action context tags
              if (enemy) narrationMemory.tags.push(enemy.name, 'combat');
              if (p.eventTitle) narrationMemory.tags.push(p.eventTitle);
              if (p.achievement) narrationMemory.tags.push(p.achievement);
              if (p.npc?.id) {
                  const npc = NPCS_DB.find(n => n.id === p.npc.id);
                  if (npc) narrationMemory.tags.push(npc.name);
                  narrationMemory.category = 'npc_interaction';
              }
              if (enemy) narrationMemory.category = 'combat';
              if (p.startEncounter?.id) narrationMemory.category = 'world_event';
              memoryStoreRef.current.addMemory(narrationMemory);
          }

          // Store milestone/achievement events separately
          if (p.achievement) {
              const achievement = ACHIEVEMENTS_DB.find(a => a.id === p.achievement);
              if (achievement) {
                  memoryStoreRef.current.addMemory({
                      text: `Achievement unlocked: ${achievement.name} — ${achievement.description}`,
                      category: 'milestone',
                      tags: [achievement.name, achievement.category, nextPlayer.name],
                      timestamp: Date.now(),
                      sessionDay: nextWorld.day,
                      sessionHour: nextWorld.hour,
                  });
              }
          }

          // Persist memories to IndexedDB (async, non-blocking)
          memoryStoreRef.current.save().catch(err => console.warn('Memory save failed:', err));
      }

      setPlayer(nextPlayer); setWorld(nextWorld); setLog(finalLog); setChoices(cleanedChoices);
      saveGameLocal(currentSlotId, { player: nextPlayer, world: nextWorld, log: finalLog, choices: cleanedChoices, view: currentEnemy ? 'combat' : 'game', enemy: currentEnemy });
    } catch (err) {
      console.error(err);
      addToast("The ethereal plane feels distant... (AI Error)", "danger");
    }
    setProcessing(false);
  };

  const handleCharacterCreation = async (data: Player) => {
    if (!currentSlotId) return;
    // FIX: Initialize player with empty statusEffects array
    const { player: p, world: w, log: l, choices: c } = createCharacter(data);
    p.achievements = [];
    p.statusEffects = [];
    setPlayer(p); setWorld(w); setLog(l); setChoices(c); setView('game');
    saveGameLocal(currentSlotId, { player: p, world: w, log: l, choices: c, view: 'game', enemy: null });
    // Initialize fresh memory store for new character
    const store = new MemoryStore(currentSlotId);
    await store.load();
    memoryStoreRef.current = store;
  };

  const handleEquip = (i: Item) => {
    if (!player) return;
    const next = JSON.parse(JSON.stringify(player)) as Player;
    const idx = next.inventory.findIndex((it: Item) => it.id === i.id || it.name === i.name);
    if (idx > -1) {
        const [it] = next.inventory.splice(idx, 1);
        let s = it.slot || ''; 
        if (s === 'ring') s = !next.equipment.ring1 ? 'ring1' : 'ring2';
        
        // Unequip current item in slot
        const oldItem = next.equipment[s];
        if (oldItem) {
            if (oldItem.statsBonus) {
                // FIX: Explicitly cast indexed stat property to number and use intermediate variable to avoid "unknown" type error.
                const bonuses = oldItem.statsBonus;
                // FIX: Ensure next.stats is treated as PlayerStats for type safety.
                const currentStats: PlayerStats = next.stats; 
                (Object.keys(bonuses) as Array<keyof PlayerStats>).forEach((stat) => {
                    const bValue = bonuses[stat];
                    if (typeof bValue === 'number') {
                        currentStats[stat] = currentStats[stat] - bValue;
                    }
                });
            }
            next.inventory.push(oldItem);
        }

        // Two-Handed logic
        if (s === 'mainHand' && it.twoHanded) {
            const offHandItem = next.equipment.offHand;
            if (offHandItem) {
                if (offHandItem.statsBonus) {
                    // FIX: Explicitly cast indexed stat property to number and use intermediate variable to avoid "unknown" type error.
                    const bonuses = offHandItem.statsBonus;
                    // FIX: Ensure next.stats is treated as PlayerStats for type safety.
                    const currentStats: PlayerStats = next.stats; 
                    (Object.keys(bonuses) as Array<keyof PlayerStats>).forEach((stat) => {
                        const bValue = bonuses[stat];
                        if (typeof bValue === 'number') {
                            currentStats[stat] = currentStats[stat] - bValue;
                        }
                    });
                }
                next.inventory.push(offHandItem);
                delete next.equipment.offHand;
            }
        }
        
        if (s === 'offHand' && next.equipment.mainHand?.twoHanded) {
            const mainHandItem = next.equipment.mainHand;
            if (mainHandItem.statsBonus) {
                // FIX: Explicitly cast indexed stat property to number and use intermediate variable to avoid "unknown" type error.
                const bonuses = mainHandItem.statsBonus;
                // FIX: Ensure next.stats is treated as PlayerStats for type safety.
                const currentStats: PlayerStats = next.stats; 
                (Object.keys(bonuses) as Array<keyof PlayerStats>).forEach((stat) => {
                        const bValue = bonuses[stat];
                        if (typeof bValue === 'number') {
                            currentStats[stat] = currentStats[stat] - bValue;
                        }
                    });
                }
            next.inventory.push(mainHandItem);
            delete next.equipment.mainHand;
        }

        // Apply new item and bonuses
        next.equipment[s] = it;
        if (it.statsBonus) {
            // FIX: Explicitly cast indexed stat property to number during addition to avoid "unknown" type error on lines 276-277.
            const bonuses = it.statsBonus;
            // FIX: Ensure next.stats is treated as PlayerStats for type safety.
            const currentStats: PlayerStats = next.stats; 
            (Object.keys(bonuses) as Array<keyof PlayerStats>).forEach((stat) => {
                const bValue = bonuses[stat];
                if (typeof bValue === 'number') {
                    currentStats[stat] = currentStats[stat] + bValue;
                }
            });
        }

        next.ac = calculatePlayerAC(next);
        setPlayer(next);
        addToast(`Equipped ${it.name}`, 'success');
        if (currentSlotId) saveGameLocal(currentSlotId, { player: next, world, log, choices, view, enemy });
    }
  };

  const handleUnequip = (s: string) => {
    if (!player) return;
    const next = JSON.parse(JSON.stringify(player)) as Player;
    const it = next.equipment[s]; 
    if (!it) return;
    
    if (it.statsBonus) {
        // FIX: Explicitly cast indexed stat property to number and use intermediate variable to avoid "unknown" type error.
        const bonuses = it.statsBonus;
        // FIX: Ensure next.stats is treated as PlayerStats for type safety.
        const currentStats: PlayerStats = next.stats; 
        (Object.keys(bonuses) as Array<keyof PlayerStats>).forEach((stat) => {
            const bValue = bonuses[stat];
            if (typeof bValue === 'number') {
                currentStats[stat] = currentStats[stat] - bValue;
            }
        });
    }
    
    delete next.equipment[s]; 
    next.inventory.push(it); 
    next.ac = calculatePlayerAC(next);
    setPlayer(next);
    addToast(`Unequipped ${it.name}`, 'info');
    if (currentSlotId) saveGameLocal(currentSlotId, { player: next, world, log, choices, view, enemy });
  };

  const handleGeneratePortrait = async () => {
    if (!player || !currentSlotId) return;
    setProcessing(true);
    const prompt = `Fantasy character portrait of ${player.name}, a ${player.race} ${player.class}. ${player.concept}`;
    try {
      const portrait = await generateSceneImage(prompt);
      if (portrait) {
        const nextPlayer = { ...player, portrait };
        setPlayer(nextPlayer);
        addToast("Portrait manifested!", "success");
        saveGameLocal(currentSlotId, { player: nextPlayer, world, log, choices, view, enemy });
      }
    } catch (e) {
      addToast("Failed to generate portrait", "danger");
    } finally {
      setProcessing(false);
    }
  };

  const handleUseItem = (index: number) => {
    if (!player || !currentSlotId) return;
    const nextPlayer = { ...player, inventory: [...player.inventory] };
    const item = nextPlayer.inventory[index];
    if (!item) return;

    if (item.effect) {
      if (item.effect.hp) nextPlayer.hpCurrent = Math.min(nextPlayer.hpMax, nextPlayer.hpCurrent + item.effect.hp);
      if (item.effect.mp) nextPlayer.manaCurrent = Math.min(nextPlayer.manaMax, nextPlayer.manaCurrent + item.effect.mp);
      if (item.effect.st) nextPlayer.staminaCurrent = Math.min(nextPlayer.staminaMax, nextPlayer.staminaCurrent + item.effect.st);
      if (item.effect.hunger) nextPlayer.hungerDays = Math.max(0, nextPlayer.hungerDays + item.effect.hunger);
      if (item.effect.thirst) nextPlayer.thirstDays = Math.max(0, nextPlayer.thirstDays + item.effect.thirst);
    }

    nextPlayer.inventory.splice(index, 1);
    setPlayer(nextPlayer);
    addToast(`Used ${item.name}`, "info");
    saveGameLocal(currentSlotId, { player: nextPlayer, world, log, choices, view, enemy });
  };

  const handleBuyItem = (item: Item) => {
      if (!player || !currentSlotId || !shop) return;
      if (player.currency < (item.value || 0)) {
          addToast("Not enough coin!", 'danger');
          return;
      }
  
      const nextPlayer = { ...player, inventory: [...player.inventory] };
      nextPlayer.currency -= (item.value || 0);
      nextPlayer.inventory.push(item);
  
      const nextShop = { ...shop };
      nextShop.inventory = nextShop.inventory.filter(i => i.id !== item.id);
      setShop(nextShop);
  
      setPlayer(nextPlayer);
      addToast(`Bought ${item.name}`, 'success');
      saveGameLocal(currentSlotId, { player: nextPlayer, world, log, choices, view: 'shop', enemy });
  };
  
  const handleSellItem = (item: Item, index: number) => {
      if (!player || !currentSlotId || !shop) return;
  
      const nextPlayer = { ...player, inventory: [...player.inventory] };
      const sellValue = Math.floor((item.value || 0) / 2);
      nextPlayer.currency += sellValue;
      nextPlayer.inventory.splice(index, 1);
  
      const nextShop = { ...shop };
      nextShop.inventory = [...nextShop.inventory, item];
      setShop(nextShop);
  
      setPlayer(nextPlayer);
      addToast(`Sold ${item.name} for ${sellValue}c`, 'info');
      saveGameLocal(currentSlotId, { player: nextPlayer, world, log, choices, view: 'shop', enemy });
  };

  // NEW: handleCraft function
  const handleCraft = (recipe: Recipe, materialsConsumed: {itemId: string, quantity: number}[], results: {itemId: string, quantity: number}[], skillCheckResult: { success: boolean, message: string } | null) => {
      if (!player || !currentSlotId) return;

      let nextPlayer = { ...player, inventory: [...player.inventory] };
      let nextLog = [...log];

      // Consume materials
      materialsConsumed.forEach(mat => {
          for (let i = 0; i < mat.quantity; i++) {
              const idx = nextPlayer.inventory.findIndex(item => item.id === mat.itemId);
              if (idx > -1) {
                  nextPlayer.inventory.splice(idx, 1);
              }
          }
      });

      // Add results (if successful)
      if (skillCheckResult?.success !== false) { // If null (no check) or true
          results.forEach(res => {
              for (let i = 0; i < res.quantity; i++) {
                  const item = ITEMS_DB.find(dbItem => dbItem.id === res.itemId);
                  if (item) nextPlayer.inventory.push({ ...item });
              }
          });
      }
      
      nextLog.push({ type: 'milestone', text: `Crafted ${recipe.name}. ${skillCheckResult?.message || ''}` });
      setLog(nextLog);
      setPlayer(nextPlayer);
      saveGameLocal(currentSlotId, { player: nextPlayer, world, log: nextLog, choices, view: 'crafting', enemy });
  };

  const actionModifiers = useMemo(() => (player ? getActionModifiers(player, world) : []), [player, world]);
  const isEncumbered = actionModifiers.some(mod => mod.id === 'encumbered');
  const actionHints = useMemo(() => (
    actionModifiers.map(mod => ({
      icon: mod.id === 'storm' ? <CloudLightning size={12} className="text-amber-400" /> : mod.id === 'rain' ? <CloudRain size={12} className="text-blue-400" /> : <Anchor size={12} className="text-orange-400" />,
      text: mod.description,
    }))
  ), [actionModifiers]);

  const getChoiceCost = useCallback((choice: Choice) => {
    if (!player) {
      return { mana: choice.manaCost || 0, stamina: choice.staminaCost || 0 };
    }
    const { manaCost, staminaCost } = getChoiceEffectiveCost(choice, player, world);
    return { mana: manaCost, stamina: staminaCost };
  }, [player, world]);

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-indigo-500"><RefreshCw className="animate-spin"/></div>;
  if (view === 'landing' || view === 'startScreen') return <StartScreen onLoadGame={handleLoadGame} onNewGameStart={handleNewGameStart} onQuickStart={handleQuickStart} onResumeLast={handleLoadGame} lastPlayedSlotId={localStorage.getItem('lastPlayedSlotId')} />;
  if (view === 'creator' && !player) return <CharacterCreator onComplete={handleCharacterCreation} onBack={() => setView('startScreen')} />;
  if (view === 'game' && !player) return <StartScreen onLoadGame={handleLoadGame} onNewGameStart={handleNewGameStart} onQuickStart={handleQuickStart} onResumeLast={handleLoadGame} lastPlayedSlotId={localStorage.getItem('lastPlayedSlotId')} />;

  const gameViewProps = { log, choices, processing, input, setInput, onAction: executeTurn, scrollRef, activeNPC: player?.activeNPC, playerResources: {mp: player?.manaCurrent || 0, st: player?.staminaCurrent || 0}, actionHints, getChoiceCost };

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden font-sans relative">
      <AtmosphereOverlay world={world} />
      {activeSkillCheck && <DiceRollOverlay {...activeSkillCheck} onComplete={() => executeTurn(activeSkillCheck.text, undefined, activeSkillCheck)} />}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex flex-col gap-2 shrink-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/50 shadow-lg bg-slate-800">
                {player?.portrait ? <img src={player.portrait} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-xs font-black">{player?.level}</div>}
            </div>
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-1.5 leading-none">{player?.name} {isEncumbered && <Anchor size={12} className="text-orange-500" />}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-black">{player?.race} {player?.class}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-amber-400 font-mono text-xs mb-1"><Coins size={12} /> {formatCurrency(player?.currency || 0)}</div>
              <div className="text-[10px] text-slate-500 flex gap-2 uppercase font-mono tracking-tighter items-center">
                <span>D{world.day} • {world.hour}:00</span>
                {world.weather.toLowerCase().includes('storm') ? <CloudLightning size={14} className="text-amber-400" /> : world.weather.toLowerCase().includes('rain') ? <CloudRain size={14} className="text-blue-400" /> : null}
                <span className="flex items-center gap-1 text-slate-400"><MapPin size={10}/>{getCurrentLocation(world.facts)}</span>
              </div>
            </div>
        </div>
        <div className="flex gap-2">
          <Bar color="bg-red-500" cur={player?.hpCurrent || 0} max={player?.hpMax || 1} label="HP" icon={<Heart size={8}/>} warningThreshold={0.35} criticalThreshold={0.18} />
          <Bar color="bg-blue-500" cur={player?.manaCurrent || 0} max={player?.manaMax || 1} label="MP" icon={<Zap size={8}/>} warningThreshold={0.3} criticalThreshold={0.15} />
          <Bar color="bg-green-500" cur={player?.staminaCurrent || 0} max={player?.staminaMax || 1} label="ST" icon={<Wind size={8}/>} warningThreshold={0.3} criticalThreshold={0.15} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {(() => {
            switch (view) {
                case 'combat': return enemy ? <CombatScreen player={player!} enemy={enemy} onAction={executeTurn} log={log} scrollRef={scrollRef} processing={processing} input={input} setInput={setInput} /> : <GameView {...gameViewProps} />;
                case 'game': return <GameView {...gameViewProps} />;
                case 'sheet': return <CharacterSheet player={player!} onClose={() => setView('game')} onGeneratePortrait={handleGeneratePortrait} />;
                case 'inventory': return <InventoryScreen player={player!} onClose={() => setView('game')} onUseItem={handleUseItem} onEquip={handleEquip} />;
                case 'equipment': return <EquipmentScreen player={player!} onClose={() => setView('game')} onEquip={handleEquip} onUnequip={handleUnequip} />;
                case 'quests': return <QuestScreen player={player!} onClose={() => setView('game')} />;
                case 'menu': return <MainMenu setView={setView} onClose={() => setView('game')} onSaveGame={() => addToast("Progress Saved", "success")} onNewGame={() => setView('startScreen')} />;
                case 'rest': return <RestScreen player={player!} onRest={(t) => { setView('game'); executeTurn(t === 'short' ? "I take a short rest." : "I set up camp for a long rest."); }} onClose={() => setView('game')} />;
                case 'journal': return <JournalScreen log={log} world={world} onClose={() => setView('game')} />;
                case 'map': return <MapScreen world={world} onClose={() => setView('game')} />;
                case 'settings': return <SettingsPage onClose={() => setView('game')} />;
                case 'spells': return <SpellScreen player={player!} onClose={() => setView('game')} onCast={(spellName) => { setView('game'); executeTurn(`I cast ${spellName}`); }} />;
                case 'codex': return <CodexScreen player={player!} onClose={() => setView('game')} />;
                case 'party': return <PartyScreen player={player!} onClose={() => setView('game')} />;
                case 'feats': return <FeatScreen player={player!} onClose={() => setView('game')} />;
                case 'shop': return shop ? <ShopScreen player={player!} shop={shop} onClose={() => setView('game')} onBuy={handleBuyItem} onSell={handleSellItem} /> : <GameView {...gameViewProps} />;
                case 'achievements': return <AchievementScreen player={player!} onClose={() => setView('game')} />;
                // NEW: Crafting Screen
                case 'crafting': return <CraftingScreen player={player!} onClose={() => setView('game')} onCraft={handleCraft} addToast={addToast} />;
                default: return <GameView {...gameViewProps} />;
            }
        })()}
      </div>

      <nav className="bg-slate-900 border-t border-slate-800 p-2 grid grid-cols-5 gap-1 shrink-0 z-10">
        <NavBtn icon={<Map size={20}/>} label="World" active={view==='game'} onClick={() => setView('game')} />
        <NavBtn icon={<User size={20}/>} label="Hero" active={view==='sheet'} onClick={() => setView('sheet')} />
        <NavBtn icon={<Backpack size={20}/>} label="Bag" active={view==='inventory'} onClick={() => setView('inventory')} />
        <NavBtn icon={<Shield size={20}/>} label="Gear" active={view==='equipment'} onClick={() => setView('equipment')} />
        <NavBtn icon={<Menu size={20}/>} label="Menu" active={view==='menu'} onClick={() => setView('menu')} />
      </nav>
    </div>
  );
}
