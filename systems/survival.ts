import { Player, StatusEffect } from '../types';

export const checkSurvival = (p: Player) => {
    const messages: string[] = [];
    // Deep clone player to avoid direct state mutation issues, especially for nested arrays
    const player = JSON.parse(JSON.stringify(p)) as Player; 
    
    // --- Food & Water ---
    let rationIdx = (player.inventory || []).findIndex(i => i.id === 'ration');
    let waterIdx = (player.inventory || []).findIndex(i => i.id === 'waterskin');
    
    if (rationIdx > -1) { 
        player.inventory.splice(rationIdx, 1); 
        player.hungerDays = 0; 
        messages.push("Consumed 1 Ration."); 
    } else { 
        player.hungerDays += 1; 
        if (player.hungerDays > 3) { 
            player.exhaustion = Math.min(6, player.exhaustion + 1); // Max exhaustion level 6
            messages.push("Starving! Exhaustion +1."); 
        } 
    }
    
    if (waterIdx > -1) {
        // Re-find index since ration splice may have shifted indices
        waterIdx = player.inventory.findIndex(i => i.id === 'waterskin');
        if (waterIdx > -1) player.inventory.splice(waterIdx, 1);
        player.thirstDays = 0;
        messages.push("Drank water.");
    } else {
        player.thirstDays += 1; 
        player.exhaustion = Math.min(6, player.exhaustion + 1); // Max exhaustion level 6
        messages.push("Dehydrated! Exhaustion +1."); 
    }

    // --- Process Status Effects ---
    const nextStatusEffects: StatusEffect[] = [];
    player.statusEffects.forEach(effect => {
        let shouldRemove = false;
        if (effect.duration !== 'permanent') {
            effect.duration -= 1;
            if (effect.duration <= 0) {
                shouldRemove = true;
                messages.push(`${effect.name} has worn off.`);
            }
        }

        if (!shouldRemove) {
            // Apply periodic effects
            if (effect.effect.hpPerTurn) {
                player.hpCurrent = Math.min(player.hpMax, Math.max(0, player.hpCurrent + effect.effect.hpPerTurn));
                if (effect.effect.hpPerTurn > 0) messages.push(`+${effect.effect.hpPerTurn} HP from ${effect.name}.`);
                else messages.push(`${effect.effect.hpPerTurn} HP from ${effect.name}.`);
            }
            if (effect.effect.mpPerTurn) {
                player.manaCurrent = Math.min(player.manaMax, Math.max(0, player.manaCurrent + effect.effect.mpPerTurn));
                if (effect.effect.mpPerTurn > 0) messages.push(`+${effect.effect.mpPerTurn} MP from ${effect.name}.`);
                else messages.push(`${effect.effect.mpPerTurn} MP from ${effect.name}.`);
            }
            if (effect.effect.staminaPerTurn) {
                player.staminaCurrent = Math.min(player.staminaMax, Math.max(0, player.staminaCurrent + effect.effect.staminaPerTurn));
                if (effect.effect.staminaPerTurn > 0) messages.push(`+${effect.effect.staminaPerTurn} ST from ${effect.name}.`);
                else messages.push(`${effect.effect.staminaPerTurn} ST from ${effect.name}.`);
            }
            // Other continuous effects (AC, speed, damage) are handled in calculations or combat logic.

            nextStatusEffects.push(effect);
        }
    });
    player.statusEffects = nextStatusEffects;

    return { player, messages };
};