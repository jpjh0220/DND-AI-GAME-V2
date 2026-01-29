

import { GoogleGenAI, Modality } from "@google/genai";
import { Player, World, Enemy, Item } from '../types';
import { calculateEncumbrance, calculateMaxCarry } from '../systems/calculations';
import { ITEMS_DB, LOCATIONS_DB, ENEMIES_DB, ACHIEVEMENTS_DB, NPCS_DB, SHOPS_DB, ENCOUNTERS_DB } from '../registries/index';

const MODEL_IMAGE = "gemini-2.5-flash-image";
const MODEL_TTS = "gemini-2.5-flash-preview-tts";

export const buildPrompt = (
    player: Player, 
    world: World, 
    actionText: string, 
    enemy?: Enemy | null,
    skillCheckResult?: { skill: string; success: boolean },
    isWorldEventTriggered: boolean = false // Now implies a roll on ENCOUNTERS_DB
): string => {
    const activeQuests = player.quests?.filter(q => q.status === 'active').map(q => q.title).join(', ') || 'None';
    const playerWeaponDamage = player.equipment.mainHand?.damageRoll || "1d4";
    const playerFeats = player.feats?.join(', ') || 'None';
    const playerStatusEffects = player.statusEffects.map(se => se.name).join(', ') || 'None';
    
    // Summary of world geography to guide the DM
    const worldAtlas = LOCATIONS_DB.map(loc => 
      `${loc.name} (${loc.type}, Danger: ${loc.dangerLevel}): ${loc.description}. Connected to: ${loc.connections?.join(', ') || 'None'}. Available NPCs: ${loc.npcs?.map(id => NPCS_DB.find(n => n.id === id)?.name || id).join(', ') || 'None'}. Available Shops: ${loc.shopIds?.map(id => SHOPS_DB.find(s => s.id === id)?.name || id).join(', ') || 'None'}.`
    ).join('\n');

    let prompt = `Role: D&D 5E DM. Output JSON ONLY.
      World: Day ${world.day}, ${world.hour}:00. Weather: ${world.weather}.
      Current Location Facts: ${(world?.facts || []).join(", ")}.
      Geography & Atlas:
      ${worldAtlas}

      Player: ${player.name} (${player.race} ${player.class}, Lvl ${player.level}).
      HP: ${player.hpCurrent}/${player.hpMax}. MP: ${player.manaCurrent}/${player.manaMax}. ST: ${player.staminaCurrent}/${player.staminaMax}. AC: ${player.ac}.
      Feats: ${playerFeats}.
      Active Quests: ${activeQuests}.
      Inventory: ${player.inventory.map(i => i.name).join(", ")}.
      Status Effects: ${playerStatusEffects}.
      Action: "${actionText}"
      `;

    if (isWorldEventTriggered) {
        prompt += `
        RANDOM WORLD ENCOUNTER TRIGGERED: Based on the current location facts, choose one encounter from the ENCOUNTERS_DB.
        Instruction: Narrate the action AND the encounter as a cohesive turn. If the player has the 'Alert' feat, they CANNOT be surprised by an ambush type encounter.
        If the encounter is combat, start combat with the specified enemy. If social, introduce the NPC. If discovery, provide choices.
        ENCOUNTERS_DB for reference (only use IDs, not full objects): ${JSON.stringify(ENCOUNTERS_DB.map(e => e.id))}
        `;
    }

    if (skillCheckResult) {
        prompt += `
        Skill Check Result: The player attempted a "${skillCheckResult.skill}" check and it was a ${skillCheckResult.success ? 'SUCCESS' : 'FAILURE'}.
        Action Context: The player's original action was "${actionText}".
        Instruction: Narrate the outcome based on this result. The turn is resolved.
        `;
    } else if (enemy) {
        prompt += `
      COMBAT SCENE: ${enemy.name}.
      Monster Lore: ${enemy.description || 'A dangerous foe.'}
      Instructions:
      1. This is the player's turn. Narrate the result.
      2. Return 'playerAttackHitsEnemy' and 'enemyAttackHitsPlayer' booleans.
      3. If the enemy dies, suggest an achievement ID like 'first_blood' or monster-specific killers in the patch 'achievement' field if applicable.
      JSON Schema: { 
        "narration": "string", 
        "patch": { 
            "playerAttackHitsEnemy": "boolean",
            "enemyAttackHitsPlayer": "boolean",
            "xpDelta": 0, 
            "endCombat": false,
            "scenePrompt": "cinematic battle art",
            "achievement": "string (optional achievement id)",
            "addStatusEffect": {"id": "string", "duration": "number|'permanent'"}, // New
            "removeStatusEffect": "string" // New (id of status effect to remove)
        } 
      }`;
    } else {
        prompt += `
      Instructions:
      1. Assign resource costs: 'manaCost' (MP) or 'staminaCost' (ST).
      2. If an NPC is introduced, include 'npc' object in patch, using IDs from NPCS_DB.
      3. If a shop is to be opened, use 'startShop' with 'shopId' from SHOPS_DB.
      4. If a world encounter was triggered, ensure 'startEncounter' is used in patch if applicable.
      5. If the player completes a milestone (visited 10 locations, reached wealth, etc.), include the 'achievement' ID from the database in the patch.
      Available Achievement IDs: ${ACHIEVEMENTS_DB.map(a => a.id).join(', ')}
      Available NPC IDs: ${NPCS_DB.map(n => n.id).join(', ')}
      Available Shop IDs: ${SHOPS_DB.map(s => s.id).join(', ')}
      Available Encounter IDs: ${ENCOUNTERS_DB.map(e => e.id).join(', ')}
      JSON Schema: { 
        "narration": "string", 
        "choices": [{ "id": "str", "label": "str", "intent": "travel|combat|social|buy|rest|system|craft", "manaCost": 0, "staminaCost": 0 }], 
        "patch": { 
            "timeDelta": 1, "currencyDelta": 0, "hpDelta": 0, "addItemId": "string", "addFact": "string", "xpDelta": 0,
            "scenePrompt": "fantasy environment concept art",
            "startCombat": {"name": "string", "hp": "number", "ac": "number", "damageRoll": "string"},
            "startShop": { "shopId": "string" }, // Updated: now refers to an ID from SHOPS_DB
            "skillCheck": { "skill": "string", "dc": "number" },
            "npc": { "id": "string" }, // Updated: now refers to an ID from NPCS_DB
            "achievement": "string (optional achievement id)",
            "eventTitle": "string (optional if event triggered)",
            "addStatusEffect": {"id": "string", "duration": "number|'permanent'"}, // New
            "removeStatusEffect": "string", // New
            "startEncounter": {"id": "string"} // New
        } 
      }`;
    }
    
    return prompt;
}

export const generateSceneImage = async (prompt: string): Promise<string | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: MODEL_IMAGE,
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        const part = response.candidates[0].content.parts.find(p => p.inlineData);
        return part ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (err) {
        console.error("Image Gen Error:", err);
        return null;
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: MODEL_TTS,
            contents: [{ parts: [{ text: `Dungeon Master voice: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (err) {
        console.error("TTS Error:", err);
        return null;
    }
};

export const callGeminiAPI = async (userQuery: string, model: string): Promise<any> => {
    if (!process.env.API_KEY) throw new Error("API key not found.");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({ model: model, contents: userQuery });
        const rawText = response.text;
        if (!rawText) throw new Error("No response text from Gemini.");
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        const parsableText = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(parsableText);
    } catch (err) {
        throw new Error(`Gemini Error: ${err}`);
    }
};