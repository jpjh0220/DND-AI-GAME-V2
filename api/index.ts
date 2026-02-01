

import { GoogleGenAI, Modality } from "@google/genai";
import { Player, World, Enemy, Item } from '../types';
import { calculateEncumbrance, calculateMaxCarry } from '../systems/calculations';
import { ITEMS_DB, LOCATIONS_DB, ENEMIES_DB, ACHIEVEMENTS_DB, NPCS_DB, SHOPS_DB, ENCOUNTERS_DB, SPELLS_DB } from '../registries/index';
import { RetrievedMemory, formatRetrievedMemories } from '../systems/memory';
import { GMMode, determineGMMode, getSystemPrompt } from '../systems/prompts';
import { computeGameSnapshot, formatSnapshotForPrompt, GameSnapshot } from '../systems/engine';

const MODEL_IMAGE = "gemini-2.5-flash-image";
const MODEL_TTS = "gemini-2.5-flash-preview-tts";

export const buildPrompt = (
    player: Player,
    world: World,
    actionText: string,
    enemy?: Enemy | null,
    skillCheckResult?: { skill: string; success: boolean },
    isWorldEventTriggered: boolean = false,
    retrievedMemories: RetrievedMemory[] = []
): string => {
    // --- Compute full mechanical state via engine ---
    const snapshot: GameSnapshot = computeGameSnapshot(player);
    const characterState = formatSnapshotForPrompt(snapshot);

    // --- Prompt Chaining: Select specialized GM mode ---
    const gmMode: GMMode = determineGMMode(
        !!enemy,
        undefined,
        !!skillCheckResult,
        !!player.activeNPC,
        isWorldEventTriggered
    );
    const systemPrompt = getSystemPrompt(gmMode);

    // --- RAG: Format retrieved memories for context injection ---
    const memoryContext = formatRetrievedMemories(retrievedMemories);

    // World geography (compact: only current location + connections)
    const currentFacts = (world?.facts || []);
    const currentLocName = currentFacts[0]?.replace('Arrived at ', '') || 'Unknown';
    const currentLoc = LOCATIONS_DB.find(l => currentFacts.some(f => f.includes(l.name)));
    const nearbyLocs = currentLoc?.connections
        ?.map(id => LOCATIONS_DB.find(l => l.id === id))
        .filter(Boolean)
        .map(l => `${l!.name} (${l!.type}, Danger: ${l!.dangerLevel})`) || [];

    let prompt = `${systemPrompt}

IMPORTANT: Output JSON ONLY. No markdown, no code fences.
GM Mode: ${gmMode.toUpperCase()}

=== CRITICAL RULES ===
1. NEVER change the subject, scene, or location unless the player explicitly requests it.
2. STAY in the current scene. Do not skip ahead, fast-forward time, or introduce unrelated events.
3. Respond ONLY to the player's stated action. Do not add extra actions the player didn't take.
4. RESPECT the character's mechanical state below. A wounded, exhausted, or encumbered character should struggle. A well-equipped character should feel powerful.
5. ONLY reference gear the player ACTUALLY HAS EQUIPPED (listed under EQUIPPED GEAR). NEVER mention, describe, or narrate the player using weapons, armor, or items they do not have. If EQUIPPED GEAR is empty, the player is unarmed/unarmored. Do NOT invent or assume equipment.
6. ONLY reference items the player has in their INVENTORY. Do not mention potions, scrolls, tools, or other items the player does not possess.
7. If the player has active STATUS EFFECTS or CONDITIONS, narrate their impact.
8. Choices you offer MUST be relevant to the current scene. No random topic changes.
9. NEVER teleport the player, introduce deus-ex-machina rescues, or resolve conflicts without player input.
10. Maintain continuity with established world facts and previous events.
11. The character's PERSONALITY (traits, ideals, bonds, flaws) should influence NPC reactions and available dialogue.
12. Do NOT narrate the player performing actions they did not choose. Only describe the outcome of the player's stated action.

=== WORLD STATE ===
Day ${world.day}, ${world.hour}:00. Weather: ${world.weather}.
Location Facts: ${currentFacts.join(", ")}.
${currentLoc ? `Current Location: ${currentLoc.name} (${currentLoc.type}, Danger Level: ${currentLoc.dangerLevel}). ${currentLoc.description}` : ''}
${nearbyLocs.length > 0 ? `Nearby: ${nearbyLocs.join(', ')}` : ''}
${currentLoc?.npcs ? `NPCs here: ${currentLoc.npcs.map(id => NPCS_DB.find(n => n.id === id)?.name || id).join(', ')}` : ''}
${currentLoc?.shopIds ? `Shops here: ${currentLoc.shopIds.map(id => SHOPS_DB.find(s => s.id === id)?.name || id).join(', ')}` : ''}

${characterState}
${memoryContext}
${player.quests.length > 0 ? `=== ACTIVE QUESTS ===
${player.quests.filter(q => q.status === 'active').map(q => `- ${q.title}: ${q.description}`).join('\n')}
${player.quests.filter(q => q.status === 'completed').length > 0 ? `Completed: ${player.quests.filter(q => q.status === 'completed').map(q => q.title).join(', ')}` : ''}
QUEST RULES: When the player completes a quest objective, use "completeQuest" in the patch. When an NPC gives the player a task, use "addQuest". When partial progress is made, use "updateQuest" to update the description. Do NOT re-add quests that already exist.` : 'The player has NO active quests. When NPCs interact with the player, consider offering quests via "addQuest" in the patch when it makes narrative sense.'}

Player Action: "${actionText}"
`;

    if (isWorldEventTriggered) {
        prompt += `
RANDOM WORLD ENCOUNTER TRIGGERED: Pick an encounter appropriate to this location.
- If the player has the 'Alert' feat, they CANNOT be surprised.
- Narrate the player's action FIRST, then weave the encounter in naturally.
- Do NOT abandon the current scene to introduce the encounter.
Available Encounter IDs: ${JSON.stringify(ENCOUNTERS_DB.map(e => e.id))}
`;
    }

    if (skillCheckResult) {
        const skillBonus = snapshot.skills.find(s => s.skill === skillCheckResult.skill);
        prompt += `
=== SKILL CHECK RESOLVED ===
Skill: ${skillCheckResult.skill} (Player bonus: ${skillBonus ? `+${skillBonus.bonus}` : 'unknown'}, ${skillBonus?.proficient ? 'Proficient' : 'Not proficient'})
Result: ${skillCheckResult.success ? 'SUCCESS' : 'FAILURE'}
Original Action: "${actionText}"
Instruction: Narrate the outcome. Describe what the player attempted and what happened. The turn is resolved. Offer new choices that follow from this outcome.
`;
    } else if (enemy) {
        prompt += `
=== COMBAT ===
Enemy: ${enemy.name} (HP: ${enemy.hp}/${enemy.hpMax}, AC: ${enemy.ac}, Damage: ${enemy.damageRoll})
${enemy.description ? `Lore: ${enemy.description}` : ''}
${enemy.resistances?.length ? `Resistances: ${enemy.resistances.join(', ')}` : ''}
${enemy.vulnerabilities?.length ? `Vulnerabilities: ${enemy.vulnerabilities.join(', ')}` : ''}

Player weapon: ${snapshot.weapon ? `${snapshot.weapon.name} (${snapshot.weapon.damageRoll}+${snapshot.weapon.damageBonus})` : 'Unarmed (1d4)'}
Player AC: ${snapshot.combat.ac} | Attack bonus: +${snapshot.combat.attackBonus}
${snapshot.activeFeats.length > 0 ? `Combat-relevant feats: ${snapshot.activeFeats.map(f => `${f.name}: ${f.mechanical}`).join('; ')}` : ''}
${snapshot.conditions.exhaustionLevel >= 3 ? 'WARNING: Player has disadvantage on attacks (Exhaustion 3+)' : ''}

Instructions:
1. This is the player's turn. Narrate what happens based on their action.
2. ONLY reference the weapon listed above under "Player weapon". If the player is Unarmed, describe fists/kicks — do NOT invent weapons. NEVER describe the player using a sword, staff, bow, or any weapon they do not have equipped.
3. Return playerAttackHitsEnemy and enemyAttackHitsPlayer booleans.
4. If enemy HP would drop to 0, set endCombat: true and describe the killing blow.
5. Account for the player's feats and conditions in the narration.

JSON Schema: {
  "narration": "string",
  "patch": {
    "playerAttackHitsEnemy": "boolean",
    "enemyAttackHitsPlayer": "boolean",
    "xpDelta": 0,
    "endCombat": false,
    "achievement": "string (optional achievement id)",
    "addStatusEffect": {"id": "string", "duration": "number|'permanent'"},
    "removeStatusEffect": "string",
    "addSpell": {"id": "unique_snake_case_id", "name": "Spell Name", "cost": 5, "damage": 0, "heal": 0, "school": "evocation|necromancy|abjuration|etc", "target": "enemy|ally|self", "description": "what the spell does"},
    "addQuest": {"title": "Quest Title", "description": "What needs to be done"},
    "completeQuest": "Quest Title (exact match)",
    "updateQuest": {"title": "Quest Title (exact match)", "description": "Updated description with progress"}
  }
}`;
    } else {
        prompt += `
=== EXPLORATION / SOCIAL ===
Instructions:
1. Respond ONLY to the player's stated action. Stay in the current scene.
2. If the action costs resources, set manaCost/staminaCost in choices.
3. ONLY reference gear the player actually has equipped (see EQUIPPED GEAR above). NEVER describe the player wearing, carrying, or using items they don't have. Do NOT invent gear.
4. Offer 2-4 choices that are NATURAL CONTINUATIONS of the current scene.
5. Each choice should feel different (cautious vs bold, social vs physical, etc).
6. If the player is wounded, starving, exhausted, or encumbered — reflect it in the narration.

Available NPC IDs (only use these): ${NPCS_DB.map(n => n.id).join(', ')}
Available Shop IDs (only use these): ${SHOPS_DB.map(s => s.id).join(', ')}
Available Encounter IDs: ${ENCOUNTERS_DB.map(e => e.id).join(', ')}
Available Achievement IDs: ${ACHIEVEMENTS_DB.map(a => a.id).join(', ')}
${player.feats.includes('original_spell_creator') ? `\nSPELL CREATION: This player has the Original Spell Creator feat. When they attempt to create, learn, or teach a spell, use "addSpell" in the patch to add it to their spellbook. Create a unique id, name, cost (mana), damage/heal values, school, target, and description. Original spells should be creative and unique but balanced for the player's level (${player.level}).${player.stats.int >= 100 || player.stats.wis >= 100 ? ' FULL POWER UNLOCKED: Player has 100+ INT/WIS — they can create legendary-tier spells.' : ''}` : ''}

JSON Schema: {
  "narration": "string",
  "choices": [{ "id": "str", "label": "str", "intent": "travel|combat|social|buy|rest|system|craft", "manaCost": 0, "staminaCost": 0 }],
  "patch": {
    "timeDelta": 1, "currencyDelta": 0, "hpDelta": 0,
    "addItemId": "string", "addFact": "string", "xpDelta": 0,
    "startCombat": {"name": "string", "hp": "number", "ac": "number", "damageRoll": "string"},
    "startShop": { "shopId": "string" },
    "skillCheck": { "skill": "string", "dc": "number" },
    "npc": { "id": "string" },
    "achievement": "string (optional)",
    "eventTitle": "string (optional)",
    "addStatusEffect": {"id": "string", "duration": "number|'permanent'"},
    "removeStatusEffect": "string",
    "startEncounter": {"id": "string"},
    "addSpell": {"id": "unique_snake_case_id", "name": "Spell Name", "cost": 5, "damage": 0, "heal": 0, "school": "evocation|necromancy|abjuration|etc", "target": "enemy|ally|self", "description": "what the spell does"},
    "addQuest": {"title": "Quest Title", "description": "What the player needs to do"},
    "completeQuest": "Quest Title (exact match)",
    "updateQuest": {"title": "Quest Title (exact match)", "description": "Updated description with progress"}
  }
}`;
    }
    
    return prompt;
}

export const generateSceneImage = async (prompt: string, apiKeyOverride?: string): Promise<string | null> => {
    const key = apiKeyOverride || process.env.API_KEY;
    if (!key) return null;
    const ai = new GoogleGenAI({ apiKey: key });
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

export const generateSpeech = async (text: string, apiKeyOverride?: string): Promise<string | null> => {
    const key = apiKeyOverride || process.env.API_KEY;
    if (!key) return null;
    const ai = new GoogleGenAI({ apiKey: key });
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

export { callLLM, loadProviderConfig, saveProviderConfig, clearProviderConfig, loadProviderCredentials, PROVIDERS } from './providers';
export type { ProviderConfig, ProviderId } from './providers';

/** @deprecated Use callLLM with ProviderConfig instead. Kept for backwards compatibility. */
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