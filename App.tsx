

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { RefreshCw, Heart, Zap, Wind, Coins, Map, User, Backpack, Star, Menu, Shield, MapPin, Anchor, CloudRain, CloudLightning, Globe, Save } from 'lucide-react';

import { Player, World, LogEntry, Choice, Item, Enemy, SkillCheckDetails, NPC, Achievement, PlayerStats, Recipe, ShopData, Encounter, StatusEffect } from './types';
import { getFirebaseConfig } from './firebase/index';
import { formatCurrency, createCharacter, checkSurvival, calculatePlayerAC, calculateXpToNextLevel, handleLevelUp, ALL_SKILLS, getMod, parseDamageRoll, createDefaultCharacter, getCurrentLocation, calculateEncumbrance, calculateMaxCarry, MemoryStore, logEntryToMemory, getActionModifiers, getChoiceEffectiveCost, getProficiencyBonus, resolvePlayerAttack, resolveEnemyDamage, resolveCompanionAttack, resolveCompanionTakeDamage, computeGameSnapshot, tickStatusEffects, getAvailableEncounterIds, spawnEncounterEnemies, scaleEnemy, calculateEncounterXP, calculateEncounterCurrency, collectEncounterLoot } from './systems/index';
import { callGeminiAPI, buildPrompt, generateSceneImage, callLLM, loadProviderConfig } from './api/index'; // generateSceneImage kept for portrait generation only
import type { ProviderConfig } from './api/index';
import { saveGame as saveGameCloud } from './persistence/cloud';
import { saveGameLocal, loadGameLocal, deleteSaveLocal, GameState, SaveSlotSummary, getAllSaveSlotSummaries } from './persistence/local';
import {
  Landing, CharacterCreator, GameView, CharacterSheet, InventoryScreen, SpellScreen, QuestScreen, JournalScreen, CodexScreen, MainMenu,
  FeatScreen, FactionScreen, PartyScreen, MapScreen, SettingsPage, EquipmentScreen, ShopScreen, CombatScreen, StartScreen, RestScreen,
  AchievementScreen, CraftingScreen
} from './components/index';
import { Bar, NavBtn, ToastContainer, ToastMessage, AtmosphereOverlay, DiceRollOverlay } from './components/ui';
import { ITEMS_DB, ACHIEVEMENTS_DB, NPCS_DB, SHOPS_DB, ENCOUNTERS_DB, RECIPES_DB, LOCATIONS_DB, ENEMIES_DB } from './registries/index';

const normalizeCurrencyDelta = (delta: number, context: string) => {
  if (!delta) return 0;
  const lowerContext = context.toLowerCase();
  const absDelta = Math.abs(delta);
  const mentionsGold = /\b(gold|gp)\b/.test(lowerContext);
  const mentionsSilver = /\b(silver|sp)\b/.test(lowerContext);
  const mentionsCopper = /\b(copper|cp)\b/.test(lowerContext);

  let result = delta;
  if (mentionsGold && absDelta < 10000) result = delta * 10000;
  else if (mentionsSilver && absDelta < 100) result = delta * 100;
  else if (mentionsCopper) result = delta;

  // Cap: gains max 500k copper (50 gold), losses max 200k copper (20 gold) per action
  const maxGain = 500000;
  const maxLoss = -200000;
  return Math.max(maxLoss, Math.min(maxGain, result));
};

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
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  // Computed: the current target enemy (first alive enemy)
  const enemy = enemies.find(e => e.hp > 0) || null;
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeSkillCheck, setActiveSkillCheck] = useState<SkillCheckDetails & { dc: number, text: string } | null>(null);
  const [pendingSkillCheckChoice, setPendingSkillCheckChoice] = useState<Choice | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>("");
  const memoryStoreRef = useRef<MemoryStore | null>(null);
  const [llmConfig, setLlmConfig] = useState<ProviderConfig | null>(() => loadProviderConfig());
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);


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

  const persistGame = useCallback((slotId: string | null, state: GameState, options?: { showIndicator?: boolean; silent?: boolean }) => {
    if (!slotId) return false;
    try {
      saveGameLocal(slotId, state);
      if (options?.showIndicator) {
        setShowSaveIndicator(true);
        setTimeout(() => setShowSaveIndicator(false), 1500);
      }
      return true;
    } catch (error) {
      console.error('Failed to save game state:', error);
      if (!options?.silent) {
        addToast("Unable to save progress. Your browser storage may be full.", "danger");
      }
      return false;
    }
  }, [addToast]);

  const updateGameState = useCallback((newGameState: GameState) => {
    setPlayer(newGameState.player);
    setWorld(newGameState.world);
    setLog(newGameState.log);
    setChoices(newGameState.choices);
    setView(newGameState.view);
    setEnemies(newGameState.enemy ? [newGameState.enemy] : (newGameState.enemies || []));
  }, []);

  const handleLoadGame = useCallback(async (slotId: string, options?: { auto?: boolean }) => {
    const loadedState = loadGameLocal(slotId);
    if (loadedState && loadedState.player) {
      updateGameState(loadedState);
      setCurrentSlotId(slotId);
      localStorage.setItem('lastPlayedSlotId', slotId);
      setView('game');
    } else if (options?.auto) {
      localStorage.removeItem('lastPlayedSlotId');
      setCurrentSlotId(null);
      setView('startScreen');
      return;
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
      const lastPlayedSlot = localStorage.getItem('lastPlayedSlotId');
      if (lastPlayedSlot) handleLoadGame(lastPlayedSlot, { auto: true });
      else setView('startScreen');
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
    setEnemies([]);
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
      persistGame(targetSlotId, { player: dp, world: dw, log: dl, choices: dc, view: 'game', enemy: null });
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
    if (choice?.intent === 'system') {
      if (choice.id === 'settings') setView('settings');
      else if (choice.id === 'death_menu') { setView('landing'); setPlayer(null); setLog([]); setChoices([]); }
      else if (choice.id === 'death_load' && currentSlotId) {
        const saved = loadGameLocal(currentSlotId);
        if (saved) { setPlayer(saved.player); setWorld(saved.world); setLog(saved.log); setChoices(saved.choices || []); setView(saved.view || 'game'); addToast('Save loaded.', 'success'); }
        else { addToast('No save found.', 'danger'); setView('landing'); }
      }
      return;
    }
    if (choice?.intent === 'craft') { setView('crafting'); return; }
    if (choice?.intent === 'rest') { setView('rest'); return; }

    if (processing || !actionText || !actionText.trim() || !player || !currentSlotId) return;

    if (!llmConfig && !process.env.API_KEY) {
        addToast('Configure an AI provider in Settings first.', 'danger');
        setView('settings');
        return;
    }

    let nextPlayer = JSON.parse(JSON.stringify(player)) as Player;
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

    // Flee mechanic: DEX check when player tries to flee during combat
    if (enemy && actionText.toLowerCase().includes('flee')) {
      const dexMod = getMod(nextPlayer.stats.dex);
      const fleeRoll = Math.floor(Math.random() * 20) + 1 + dexMod;
      const fleeDC = Math.max(8, (enemy.speed || 30) >= 40 ? 15 : 10);
      if (fleeRoll >= fleeDC) {
        setProcessing(true);
        const fleeLog = [...log, { type: 'player' as const, text: actionText }, { type: 'narration' as const, text: `You dash away from the ${enemy.name}! (DEX check: ${fleeRoll} vs DC ${fleeDC} - Success!) You escape into the wilds, heart pounding.` }];
        setEnemies([]); setView('game'); setLog(fleeLog);
        setChoices([{ id: 'explore', label: 'Catch your breath', intent: 'rest' as const, manaCost: 0, staminaCost: 0 }, { id: 'continue', label: 'Keep moving', intent: 'travel' as const, manaCost: 0, staminaCost: 0 }]);
        persistGame(currentSlotId, { player: nextPlayer, world, log: fleeLog, choices: [], view: 'game', enemy: null });
        addToast('Escaped!', 'success');
        setPlayer(nextPlayer); setProcessing(false);
        return;
      } else {
        // Failed flee: enemy gets a free attack
        const { damage } = resolveEnemyDamage(nextPlayer, enemy);
        nextPlayer.hpCurrent = Math.max(0, nextPlayer.hpCurrent - damage);
        const fleeFailLog = [...log, { type: 'player' as const, text: actionText }, { type: 'narration' as const, text: `You try to flee but the ${enemy.name} blocks your escape! (DEX check: ${fleeRoll} vs DC ${fleeDC} - Failed!) The ${enemy.name} strikes you as you turn. (-${damage} HP)` }];
        setLog(fleeFailLog); setPlayer(nextPlayer);
        if (nextPlayer.hpCurrent <= 0) {
          const deathChoices: Choice[] = [
            { id: 'death_load', label: 'Load Last Save', intent: 'system', manaCost: 0, staminaCost: 0 },
            { id: 'death_menu', label: 'Return to Main Menu', intent: 'system', manaCost: 0, staminaCost: 0 },
          ];
          setEnemies([]); setView('game'); setChoices(deathChoices);
          addToast('You have died.', 'danger');
        }
        setProcessing(false);
        return;
      }
    }

    // Combat Item Use: "I use my [item]" - apply effects immediately
    if (enemy && actionText.toLowerCase().includes('use my ')) {
      const itemMatch = actionText.match(/use my\s+(.+)/i);
      if (itemMatch) {
        const itemName = itemMatch[1].replace(/[.!?]$/, '').trim().toLowerCase();
        const itemIndex = nextPlayer.inventory.findIndex(i =>
          i.name.toLowerCase() === itemName ||
          i.name.toLowerCase().includes(itemName) ||
          itemName.includes(i.name.toLowerCase())
        );

        if (itemIndex >= 0) {
          const item = nextPlayer.inventory[itemIndex];
          const isConsumable = item.type === 'potion' || item.type === 'consumable' || item.effect;

          if (isConsumable && item.effect) {
            // Apply item effects
            if (item.effect.hp) {
              const oldHp = nextPlayer.hpCurrent;
              nextPlayer.hpCurrent = Math.min(nextPlayer.hpMax, nextPlayer.hpCurrent + item.effect.hp);
              addToast(`+${nextPlayer.hpCurrent - oldHp} HP from ${item.name}`, 'success');
            }
            if (item.effect.mp) {
              nextPlayer.manaCurrent = Math.min(nextPlayer.manaMax, nextPlayer.manaCurrent + item.effect.mp);
              addToast(`+${item.effect.mp} MP from ${item.name}`, 'success');
            }
            if (item.effect.st) {
              nextPlayer.staminaCurrent = Math.min(nextPlayer.staminaMax, nextPlayer.staminaCurrent + item.effect.st);
              addToast(`+${item.effect.st} ST from ${item.name}`, 'success');
            }

            // Remove consumed item
            nextPlayer.inventory.splice(itemIndex, 1);

            // Don't return - continue to AI for narration, but effects are already applied
          }
        }
      }
    }

    // Combat Spell Casting: "I cast [spell]" - deduct mana, apply damage/healing
    if (enemy && actionText.toLowerCase().includes('cast ')) {
      const spellMatch = actionText.match(/cast\s+(.+?)(?:\s+(?:upon|on|at)\s+|$)/i);
      if (spellMatch) {
        const spellName = spellMatch[1].replace(/[.!?]$/, '').trim().toLowerCase();
        const spell = nextPlayer.spells.find(s => s.name.toLowerCase() === spellName);

        if (spell) {
          if (nextPlayer.manaCurrent < spell.cost) {
            addToast(`Not enough mana for ${spell.name}! (${spell.cost} MP required)`, 'danger');
            setProcessing(false);
            return;
          }

          // Deduct mana cost
          nextPlayer.manaCurrent -= spell.cost;
          addToast(`-${spell.cost} MP (${spell.name})`, 'info');

          // Apply healing spells immediately (self-target)
          if (spell.target === 'self' && spell.heal) {
            const oldHp = nextPlayer.hpCurrent;
            nextPlayer.hpCurrent = Math.min(nextPlayer.hpMax, nextPlayer.hpCurrent + spell.heal);
            addToast(`+${nextPlayer.hpCurrent - oldHp} HP from ${spell.name}`, 'success');
          }

          // Note: Damage spells are handled by the AI patch (playerAttackHitsEnemy)
          // The damage from spell.damage could be used to inform the AI or override
        }
      }
    }

    // Determine if world event should be triggered - now also for encounters
    const currentLocationFacts = getCurrentLocation(nextWorld.facts);
    const currentLocData = LOCATIONS_DB.find(loc => loc.name === currentLocationFacts);
    const hasEncounters = (currentLocData?.encounters?.length || 0) > 0;
    const isExploration = !enemy && (choice?.intent === 'travel' || choice?.intent === 'social' || !choice);
    const worldEventTriggered = isExploration && hasEncounters && Math.random() < 0.08; // 8% chance for encounter

    setProcessing(true); setInput("");
    let nextLog = [...log];
    if (!rollOverride) {
      nextLog = [...log, { type: 'player' as const, text: actionText }];
      setLog(nextLog);
    }

    try {
      // RAG: Retrieve relevant past memories to augment the prompt
      const retrievedMemories = memoryStoreRef.current
          ? memoryStoreRef.current.retrieve(actionText, 5)
          : [];
      const prompt = buildPrompt(nextPlayer, nextWorld, actionText, enemy, rollOverride, worldEventTriggered, retrievedMemories, choice?.intent);
      const aiData = llmConfig
          ? await callLLM(prompt, llmConfig)
          : await callGeminiAPI(prompt, "gemini-2.0-flash");
      const p = aiData.patch || {};
      let finalLog = [...nextLog];

      if (!rollOverride && p.skillCheck?.skill) {
          const { skill, dc } = p.skillCheck;
          const statKey = ALL_SKILLS[skill as keyof typeof ALL_SKILLS];
          const bonus = getMod(nextPlayer.stats[statKey]) + (nextPlayer.proficiencies.skills.includes(skill) ? getProficiencyBonus(nextPlayer.level) : 0);
          const roll = Math.floor(Math.random() * 20) + 1;
          setActiveSkillCheck({ skill, roll, bonus, total: roll + bonus, dc, success: roll + bonus >= dc, text: actionText });
          setPendingSkillCheckChoice(choice); // Preserve choice context for the follow-up call
          setPlayer(nextPlayer); setProcessing(false);
          return;
      }

      // NEW: Handle NPC introduction (now using NPC ID from DB)
      if (p.npc?.id) {
        const npcData = NPCS_DB.find(n => n.id === p.npc.id);
        if (npcData) {
            const existing = nextPlayer.knownNPCs.find(n => n.id === npcData.id);
            if (!existing) {
                const newNPC = { ...npcData, portrait: null };
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

      // Tick status effects each turn (apply per-turn hp/mp/st, count down durations)
      if (nextPlayer.statusEffects.length > 0) {
        const statusTick = tickStatusEffects(nextPlayer);
        nextPlayer = statusTick.player;
        statusTick.messages.forEach(m => {
          const isDamage = m.includes('-');
          addToast(m, isDamage ? 'danger' : 'info');
        });
      }

      // Handle addFact with location change validation
      if (p.addFact && typeof p.addFact === 'string') {
        const fact = p.addFact.trim();
        if (fact.startsWith('Arrived at ')) {
          // Only allow location changes on travel actions
          if (choice?.intent === 'travel') {
            nextWorld.facts.push(fact);
            const newLoc = fact.substring('Arrived at '.length);
            addToast(`Traveled to ${newLoc}`, 'info');
            finalLog.push({ type: 'milestone' as const, text: `TRAVELED: ${newLoc}` });
          } else {
            // Block AI from changing location on non-travel actions
            console.warn(`Blocked location change to "${fact}" — player did not choose travel.`);
          }
        } else {
          // Non-location facts are always allowed
          nextWorld.facts.push(fact);
        }
      }

      if (!enemy) {
        const tick = tickWorld(nextPlayer, nextWorld, p.timeDelta || 1);
        nextPlayer.hpCurrent = tick.player.hpCurrent;
        nextPlayer.exhaustion = tick.player.exhaustion;
        nextPlayer.inventory = tick.player.inventory;
        nextPlayer.statusEffects = tick.player.statusEffects;
        nextWorld.hour = tick.world.hour;
        nextWorld.day = tick.world.day;
        tick.logs.forEach(m => addToast(m, 'info'));
        if (p.weather) nextWorld.weather = p.weather;
      }

      const currencyContext = `${actionText} ${aiData.narration || ''}`;
      const normalizedCurrencyDelta = normalizeCurrencyDelta(p.currencyDelta || 0, currencyContext);
      nextPlayer.currency = Math.max(0, nextPlayer.currency + Math.floor(normalizedCurrencyDelta)); 
      if (p.addItemId) {
        const item = ITEMS_DB.find(i => i.id === p.addItemId);
        if (item) nextPlayer.inventory.push({ ...item });
      }
      // Handle spell learning / original spell creation
      if (p.addSpell) {
        const spellData = p.addSpell;
        // Check if spell already known
        if (!nextPlayer.spells.some(s => s.id === spellData.id)) {
          const newSpell = {
            id: spellData.id || `custom_${Date.now()}`,
            name: spellData.name,
            cost: spellData.cost || 5,
            damage: spellData.damage || 0,
            heal: spellData.heal || 0,
            school: spellData.school || 'evocation',
            target: spellData.target || 'enemy' as const,
            description: spellData.description || '',
          };
          nextPlayer.spells.push(newSpell);
          addToast(`New spell learned: ${newSpell.name}!`, 'success');
          finalLog.push({ type: 'milestone', text: `SPELL LEARNED: ${newSpell.name} — ${newSpell.description}` });
        }
      }
      // Handle quest system
      if (p.addQuest?.title) {
        const existing = nextPlayer.quests.find(q => q.title === p.addQuest.title);
        if (!existing) {
          nextPlayer.quests.push({ title: p.addQuest.title, description: p.addQuest.description || '', status: 'active' });
          addToast(`New Quest: ${p.addQuest.title}`, 'success');
          finalLog.push({ type: 'milestone', text: `QUEST STARTED: ${p.addQuest.title} — ${p.addQuest.description || ''}` });
        }
      }
      if (p.completeQuest) {
        const quest = nextPlayer.quests.find(q => q.title === p.completeQuest && q.status === 'active');
        if (quest) {
          quest.status = 'completed';
          addToast(`Quest Complete: ${quest.title}!`, 'success');
          finalLog.push({ type: 'milestone', text: `QUEST COMPLETED: ${quest.title}` });
        }
      }
      if (p.updateQuest?.title) {
        const quest = nextPlayer.quests.find(q => q.title === p.updateQuest.title && q.status === 'active');
        if (quest) {
          quest.description = p.updateQuest.description || quest.description;
          addToast(`Quest Updated: ${quest.title}`, 'info');
        }
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

      // NPC disposition and memory updates
      if (p.updateNPC?.id) {
          const npcIndex = nextPlayer.knownNPCs.findIndex(n => n.id === p.updateNPC.id);
          if (npcIndex >= 0) {
              const npc = { ...nextPlayer.knownNPCs[npcIndex] };
              // Update disposition
              if (p.updateNPC.dispositionDelta) {
                  npc.disposition = Math.max(-100, Math.min(100, (npc.disposition || 0) + p.updateNPC.dispositionDelta));
                  const feeling = npc.disposition >= 50 ? 'friendly' : npc.disposition >= 20 ? 'warm' : npc.disposition >= -20 ? 'neutral' : npc.disposition >= -50 ? 'cold' : 'hostile';
                  addToast(`${npc.name} feels ${feeling} toward you`, npc.disposition >= 0 ? 'info' : 'danger');
              }
              // Add memory
              if (p.updateNPC.memory) {
                  npc.memories = npc.memories || [];
                  npc.memories.push(p.updateNPC.memory);
                  // Keep only last 10 memories per NPC
                  if (npc.memories.length > 10) npc.memories = npc.memories.slice(-10);
              }
              nextPlayer.knownNPCs[npcIndex] = npc;
          }
      }

      // World consequences - player choices that change the world
      if (p.addConsequence?.description) {
          nextWorld.consequences = nextWorld.consequences || [];
          nextWorld.consequences.push({
              id: `consequence_${Date.now()}`,
              description: p.addConsequence.description,
              location: p.addConsequence.location || getCurrentLocation(nextWorld.facts),
              timestamp: { day: nextWorld.day, hour: nextWorld.hour },
              impact: p.addConsequence.impact || 'minor',
          });
          // Log major+ consequences
          if (p.addConsequence.impact === 'major' || p.addConsequence.impact === 'world-altering') {
              finalLog.push({ type: 'worldevent', text: `WORLD CHANGED: ${p.addConsequence.description}` });
              addToast(`Your choice has changed the world!`, 'success');
          }
      }

      // Companion recruitment - NPC joins the player's party
      if (p.recruitCompanion?.name) {
          nextPlayer.companions = nextPlayer.companions || [];
          // Check if already in party
          const existingIdx = nextPlayer.companions.findIndex(c => c.id === p.recruitCompanion.id);
          if (existingIdx < 0 && nextPlayer.companions.filter(c => c.isActive).length < 4) {
              const newCompanion = {
                  id: p.recruitCompanion.id || `companion_${Date.now()}`,
                  name: p.recruitCompanion.name,
                  class: p.recruitCompanion.class || 'Ally',
                  level: p.recruitCompanion.level || 1,
                  hp: p.recruitCompanion.hp || 20,
                  hpMax: p.recruitCompanion.hp || 20,
                  ac: p.recruitCompanion.ac || 12,
                  attackBonus: p.recruitCompanion.attackBonus || 3,
                  damageRoll: p.recruitCompanion.damageRoll || '1d6+1',
                  abilities: p.recruitCompanion.abilities || [],
                  loyalty: p.recruitCompanion.loyalty || 50,
                  isActive: true,
                  portrait: null,
              };
              nextPlayer.companions.push(newCompanion);
              finalLog.push({ type: 'milestone', text: `${newCompanion.name} has joined your party!` });
              addToast(`${newCompanion.name} joins the party!`, 'success');
          } else if (existingIdx >= 0) {
              // Reactivate existing companion
              nextPlayer.companions[existingIdx].isActive = true;
              addToast(`${p.recruitCompanion.name} rejoins your party!`, 'success');
          } else {
              addToast('Your party is full (max 4 companions)', 'danger');
          }
      }

      let currentEnemy = enemy;
      let currentEnemies = [...enemies]; // Track all enemies in encounter

      // NEW: Handle starting a combat encounter based on AI patch
      if (p.startEncounter?.id) {
          const encounterData = ENCOUNTERS_DB.find(e => e.id === p.startEncounter.id);
          if (encounterData && encounterData.type === 'combat' && encounterData.enemyIds && encounterData.enemyIds.length > 0) {
              // Spawn all enemies from encounter, scaled to player level
              const spawnedEnemies = spawnEncounterEnemies(encounterData, nextPlayer.level);
              if (spawnedEnemies.length > 0) {
                  currentEnemies = spawnedEnemies;
                  currentEnemy = currentEnemies[0];
                  setEnemies(currentEnemies);
                  setView('combat');
                  const enemyNames = spawnedEnemies.map(e => e.name).join(', ');
                  finalLog.push({ type: 'worldevent', text: `You are ambushed by ${spawnedEnemies.length > 1 ? `${spawnedEnemies.length} foes: ${enemyNames}` : `a ${currentEnemy.name}`}!` });
              }
          }
      } else if (p.startCombat) {
        // AI-initiated combat with single enemy
        const scaledEnemy = scaleEnemy({ ...p.startCombat, hpMax: p.startCombat.hp }, nextPlayer.level);
        currentEnemies = [scaledEnemy];
        currentEnemy = scaledEnemy;
        setEnemies(currentEnemies); setView('combat');
      } else if (currentEnemy && currentEnemies.length > 0) {
        // Player attacks current target
        if (p.playerAttackHitsEnemy) {
          const { damage } = resolvePlayerAttack(nextPlayer, currentEnemy);
          currentEnemy.hp = Math.max(0, currentEnemy.hp - damage);
          // Update enemy in array
          currentEnemies = currentEnemies.map(e => e.id === currentEnemy!.id ? currentEnemy! : e);
        }

        // Companion attacks (active companions assist in combat)
        const activeCompanions = nextPlayer.companions?.filter(c => c.isActive && c.hp > 0) || [];
        if (activeCompanions.length > 0 && p.playerAttackHitsEnemy) {
          for (const companion of activeCompanions) {
            // Find an alive enemy to attack (prioritize current target, then others)
            const targetEnemy = currentEnemies.find(e => e.hp > 0);
            if (targetEnemy) {
              const { hit, damage, details } = resolveCompanionAttack(companion, targetEnemy);
              if (hit) {
                targetEnemy.hp = Math.max(0, targetEnemy.hp - damage);
                currentEnemies = currentEnemies.map(e => e.id === targetEnemy.id ? targetEnemy : e);
                addToast(`${companion.name}: ${damage} dmg!`, 'success');
              }
            }
          }
        }

        // ALL alive enemies attack the player and companions (multi-enemy combat)
        if (p.enemyAttackHitsPlayer) {
          const aliveEnemies = currentEnemies.filter(e => e.hp > 0);
          const aliveCompanions = nextPlayer.companions?.filter(c => c.isActive && c.hp > 0) || [];
          let totalDamageTaken = 0;
          const attackers: string[] = [];
          const companionDamage: { name: string; damage: number; knocked: boolean }[] = [];

          for (const attacker of aliveEnemies) {
            // Each enemy has diminishing hit chance in groups to prevent instant death
            const hitChance = aliveEnemies.length > 1 ? 0.6 : 1.0;
            if (Math.random() < hitChance) {
              const { damage } = resolveEnemyDamage(nextPlayer, attacker);

              // 30% chance to target a companion if companions are present
              if (aliveCompanions.length > 0 && Math.random() < 0.3) {
                const targetIdx = Math.floor(Math.random() * aliveCompanions.length);
                const targetCompanion = aliveCompanions[targetIdx];
                const { newHp, knocked } = resolveCompanionTakeDamage(targetCompanion, damage);
                targetCompanion.hp = newHp;
                companionDamage.push({ name: targetCompanion.name, damage, knocked });
                if (knocked) {
                  // Remove knocked out companion from active list
                  aliveCompanions.splice(targetIdx, 1);
                }
              } else {
                totalDamageTaken += damage;
                attackers.push(attacker.name);
              }
            }
          }

          // Apply damage to player
          nextPlayer.hpCurrent = Math.max(0, nextPlayer.hpCurrent - totalDamageTaken);
          if (attackers.length > 1) {
            addToast(`${attackers.join(', ')} strike! -${totalDamageTaken} HP`, 'danger');
          }

          // Report companion damage
          for (const cd of companionDamage) {
            if (cd.knocked) {
              addToast(`${cd.name} is knocked out!`, 'danger');
              finalLog.push({ type: 'worldevent', text: `${cd.name} falls unconscious from the blow!` });
            } else {
              addToast(`${cd.name} hit for ${cd.damage}!`, 'danger');
            }
          }
        }

        // Player dies in combat
        if (nextPlayer.hpCurrent <= 0) {
          nextPlayer.hpCurrent = 0;
          const killerName = currentEnemies.filter(e => e.hp > 0).map(e => e.name).join(' and ') || currentEnemy.name;
          finalLog.push({ type: 'worldevent', text: `${killerName} strikes a fatal blow. ${nextPlayer.name} has fallen in battle...` });
          const deathChoices: Choice[] = [
            { id: 'death_load', label: 'Load Last Save', intent: 'system', manaCost: 0, staminaCost: 0 },
            { id: 'death_menu', label: 'Return to Main Menu', intent: 'system', manaCost: 0, staminaCost: 0 },
          ];
          setEnemies([]); setView('game');
          setPlayer(nextPlayer); setWorld(nextWorld); setLog(finalLog); setChoices(deathChoices);
          persistGame(currentSlotId, { player: nextPlayer, world: nextWorld, log: finalLog, choices: deathChoices, view: 'game', enemy: null });
          addToast('You have died.', 'danger');
          setProcessing(false);
          return;
        }

        // Check if current target died
        if (currentEnemy.hp <= 0) {
          finalLog.push({ type: 'milestone', text: `${currentEnemy.name} slain.` });
          // Award XP from this enemy
          if (currentEnemy.xp && currentEnemy.xp > 0) {
            nextPlayer.xp += currentEnemy.xp;
            addToast(`+${currentEnemy.xp} XP`, 'success');
          }
          // Drop loot from this enemy
          if (currentEnemy.loot && currentEnemy.loot.length > 0) {
            for (const lootId of currentEnemy.loot) {
              const lootItem = ITEMS_DB.find(i => i.id === lootId);
              if (lootItem) {
                nextPlayer.inventory.push({ ...lootItem });
                addToast(`Loot: ${lootItem.name}`, 'success');
                finalLog.push({ type: 'milestone', text: `LOOT: ${lootItem.name}` });
              }
            }
          }
          // Award currency for this enemy
          const challengeGold = Math.floor((currentEnemy.challenge || 1) * 50);
          if (challengeGold > 0) {
            nextPlayer.currency += challengeGold;
            addToast(`+${challengeGold} copper`, 'info');
          }
        }

        // Check if ALL enemies are dead (combat ends)
        const allDead = currentEnemies.every(e => e.hp <= 0);
        if (p.endCombat || allDead) {
          if (allDead && currentEnemies.length > 1) {
            finalLog.push({ type: 'worldevent', text: `All foes vanquished! The battle is won.` });
          }
          setEnemies([]); currentEnemy = null; setView('game');
        } else {
          // Update enemies state with current HP values
          setEnemies(currentEnemies);
          // Switch target to next alive enemy
          currentEnemy = currentEnemies.find(e => e.hp > 0) || null;
        }
      }

      if (nextPlayer.xp >= calculateXpToNextLevel(nextPlayer.level)) {
          const lvl = handleLevelUp(nextPlayer);
          Object.assign(nextPlayer, lvl.player);
          lvl.messages.forEach(m => finalLog.push({ type: 'levelup', text: m }));
          addToast(`Level ${nextPlayer.level}! HP fully restored.`, 'success');
      }

      // NEW: Handle starting a shop (now using shopId from DB)
      if (p.startShop?.shopId) {
          const shopData = SHOPS_DB.find(s => s.id === p.startShop.shopId);
          if (shopData) {
              const shopInventoryItems: Item[] = shopData.inventory
                  .map(invItem => {
                      const item = ITEMS_DB.find(dbItem => dbItem.id === invItem.itemId);
                      return item ? Array.from({ length: invItem.quantity }, () => ({ ...item })) : null;
                  })
                  .filter((item): item is Item[] => !!item)
                  .flat();
              setShop({ name: shopData.name, inventory: shopInventoryItems });
              setView('shop');
          } else {
              console.warn(`Shop with ID ${p.startShop.shopId} not found in SHOPS_DB.`);
          }
      }

      if (aiData.narration) {
        finalLog.push({ type: 'narration' as const, text: aiData.narration });
      } else if (rollOverride) {
        // Fallback narration if AI returned no text after a skill check
        const outcomeText = rollOverride.success
          ? `Your ${rollOverride.skill} check succeeds! (Rolled ${rollOverride.total} vs DC ${rollOverride.dc})`
          : `Your ${rollOverride.skill} check fails. (Rolled ${rollOverride.total} vs DC ${rollOverride.dc})`;
        finalLog.push({ type: 'narration' as const, text: outcomeText });
      }
      
      const cleanedChoices = (aiData.choices || [])
        .map((c: Choice) => ({
          ...c,
          label: c.label
              .replace(/\s*\(\)$/, '')
              .replace(/commotior/gi, 'commotion')
              .replace(/^Speak again, inq$/, 'Speak again, inquire further')
              .trim()
        }))
        .filter((c: Choice) => {
          // Filter out choices that reference abilities the player doesn't have
          const labelLower = c.label.toLowerCase();

          // Filter spell-casting choices if player has no spells
          if (nextPlayer.spells.length === 0 && (labelLower.includes('cast ') || labelLower.includes('spell'))) {
            return false;
          }

          // Filter specific "Cast X" choices if player doesn't know that spell
          const castMatch = labelLower.match(/^cast\s+(.+)/);
          if (castMatch && nextPlayer.spells.length > 0) {
            const spellName = castMatch[1].replace(/[.!?]$/, '').trim();
            const hasSpell = nextPlayer.spells.some(s => s.name.toLowerCase() === spellName);
            if (!hasSpell) return false;
          }

          // Filter empty or invalid labels
          if (!c.label || c.label.length < 2) return false;

          return true;
        });

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

      // Check for player death
      if (nextPlayer.hpCurrent <= 0 && !currentEnemy) {
          nextPlayer.hpCurrent = 0;
          finalLog.push({ type: 'worldevent', text: `${nextPlayer.name} has fallen. The light fades from your eyes as darkness claims you...` });
          const deathChoices: Choice[] = [
            { id: 'death_load', label: 'Load Last Save', intent: 'system', manaCost: 0, staminaCost: 0 },
            { id: 'death_menu', label: 'Return to Main Menu', intent: 'system', manaCost: 0, staminaCost: 0 },
          ];
          setPlayer(nextPlayer); setWorld(nextWorld); setLog(finalLog); setChoices(deathChoices);
          persistGame(currentSlotId, { player: nextPlayer, world: nextWorld, log: finalLog, choices: deathChoices, view: 'game', enemy: null });
          addToast('You have died.', 'danger');
          setProcessing(false);
          return;
      }

      setPlayer(nextPlayer); setWorld(nextWorld); setLog(finalLog); setChoices(cleanedChoices);
      persistGame(currentSlotId, { player: nextPlayer, world: nextWorld, log: finalLog, choices: cleanedChoices, view: currentEnemy ? 'combat' : 'game', enemy: currentEnemy }, { showIndicator: true });
    } catch (err) {
      console.error(err);
      // If this was a skill check follow-up, provide fallback narration so the story doesn't break
      if (rollOverride) {
        const outcomeText = rollOverride.success
          ? `Your ${rollOverride.skill} check succeeds! (Rolled ${rollOverride.total} vs DC ${rollOverride.dc})`
          : `Your ${rollOverride.skill} check fails. (Rolled ${rollOverride.total} vs DC ${rollOverride.dc})`;
        const fallbackLog = [...log, { type: 'skillcheck' as const, text: `${rollOverride.skill} Roll: ${rollOverride.total} (DC ${rollOverride.dc})`, details: rollOverride }, { type: 'narration' as const, text: outcomeText }];
        setActiveSkillCheck(null);
        setLog(fallbackLog);
        addToast("AI couldn't narrate the outcome, but your roll still counts.", "danger");
      } else {
        addToast("The ethereal plane feels distant... (AI Error)", "danger");
      }
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
    persistGame(currentSlotId, { player: p, world: w, log: l, choices: c, view: 'game', enemy: null });
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
        persistGame(currentSlotId, { player: next, world, log, choices, view, enemy });
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
    persistGame(currentSlotId, { player: next, world, log, choices, view, enemy });
  };

  const handleGeneratePortrait = async () => {
    if (!player || !currentSlotId) return;
    setProcessing(true);
    const prompt = `Fantasy character portrait of ${player.name}, a ${player.race} ${player.class}. ${player.concept}`;
    try {
      const portrait = await generateSceneImage(prompt, llmConfig?.providerId === 'gemini' ? llmConfig.apiKey : undefined);
      if (portrait) {
        const nextPlayer = { ...player, portrait };
        setPlayer(nextPlayer);
        addToast("Portrait manifested!", "success");
        persistGame(currentSlotId, { player: nextPlayer, world, log, choices, view, enemy });
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
    persistGame(currentSlotId, { player: nextPlayer, world, log, choices, view, enemy });
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
  
      const nextShop = { ...shop, inventory: [...shop.inventory] };
      const shopIdx = nextShop.inventory.findIndex(i => i.id === item.id);
      if (shopIdx > -1) nextShop.inventory.splice(shopIdx, 1);
      setShop(nextShop);
  
      setPlayer(nextPlayer);
      addToast(`Bought ${item.name}`, 'success');
      persistGame(currentSlotId, { player: nextPlayer, world, log, choices, view: 'shop', enemy });
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
      persistGame(currentSlotId, { player: nextPlayer, world, log, choices, view: 'shop', enemy });
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
      persistGame(currentSlotId, { player: nextPlayer, world, log: nextLog, choices, view: 'crafting', enemy });
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
      {activeSkillCheck && <DiceRollOverlay {...activeSkillCheck} onComplete={() => { const sc = activeSkillCheck; const ch = pendingSkillCheckChoice; setPendingSkillCheckChoice(undefined); executeTurn(sc.text, ch, sc); }} />}
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
                {showSaveIndicator && <Save size={10} className="text-emerald-400 animate-pulse" />}
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
                case 'combat': return enemy ? <CombatScreen player={player!} enemy={enemy} enemies={enemies} onAction={executeTurn} log={log} scrollRef={scrollRef} processing={processing} input={input} setInput={setInput} /> : <GameView {...gameViewProps} />;
                case 'game': return <GameView {...gameViewProps} />;
                case 'sheet': return <CharacterSheet player={player!} onClose={() => setView('game')} onGeneratePortrait={handleGeneratePortrait} />;
                case 'inventory': return <InventoryScreen player={player!} onClose={() => setView('game')} onUseItem={handleUseItem} onEquip={handleEquip} />;
                case 'equipment': return <EquipmentScreen player={player!} onClose={() => setView('game')} onEquip={handleEquip} onUnequip={handleUnequip} />;
                case 'quests': return <QuestScreen player={player!} onClose={() => setView('game')} />;
                case 'menu': return <MainMenu setView={setView} onClose={() => setView('game')} onSaveGame={() => { if (player && persistGame(currentSlotId, { player, world, log, choices, view: 'game', enemy })) addToast("Progress Saved", "success"); }} onNewGame={() => setView('startScreen')} />;
                case 'rest': return <RestScreen player={player!} onRest={(t) => {
                    if (player) {
                        const rested = { ...player, inventory: [...player.inventory], statusEffects: [...player.statusEffects] };
                        if (t === 'short') {
                            const hitDieRoll = Math.floor(Math.random() * 10) + 1;
                            rested.hpCurrent = Math.min(rested.hpMax, rested.hpCurrent + hitDieRoll);
                            rested.staminaCurrent = rested.staminaMax;
                            addToast(`+${hitDieRoll} HP (1d10), Stamina restored`, 'success');
                        } else {
                            rested.hpCurrent = rested.hpMax;
                            rested.manaCurrent = rested.manaMax;
                            rested.staminaCurrent = rested.staminaMax;
                            rested.exhaustion = Math.max(0, rested.exhaustion - 1);
                            // Consume 1 ration and 1 waterskin
                            const rationIdx = rested.inventory.findIndex(i => i.id === 'ration');
                            if (rationIdx > -1) rested.inventory.splice(rationIdx, 1);
                            const waterIdx = rested.inventory.findIndex(i => i.id === 'waterskin');
                            if (waterIdx > -1) rested.inventory.splice(waterIdx, 1);
                            addToast('HP, Mana & Stamina fully restored (-1 Ration, -1 Water)', 'success');
                        }
                        setPlayer(rested);
                        persistGame(currentSlotId, { player: rested, world, log, choices, view: 'game', enemy });
                    }
                    setView('game');
                    executeTurn(t === 'short' ? "I take a short rest." : "I set up camp for a long rest.");
                }} onClose={() => setView('game')} />;
                case 'journal': return <JournalScreen log={log} world={world} onClose={() => setView('game')} />;
                case 'map': return <MapScreen world={world} onClose={() => setView('game')} />;
                case 'settings': return <SettingsPage onClose={() => setView('game')} onConfigChange={(c) => setLlmConfig(c)} />;
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
