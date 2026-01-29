import { Choice, Player, World } from '../types';
import { calculateEncumbrance, calculateMaxCarry } from './calculations';

export type ActionModifierId = 'storm' | 'rain' | 'encumbered';

export interface ActionModifier {
    id: ActionModifierId;
    label: string;
    description: string;
}

export interface ActionCostResult {
    manaCost: number;
    staminaCost: number;
    modifiers: ActionModifier[];
}

export const getActionModifiers = (player: Player, world: World): ActionModifier[] => {
    const modifiers: ActionModifier[] = [];
    const weatherLower = world.weather.toLowerCase();

    if (weatherLower.includes('storm')) {
        modifiers.push({
            id: 'storm',
            label: 'Storm',
            description: 'Storm: actions cost +3 MP and +2 ST.',
        });
    } else if (weatherLower.includes('rain')) {
        modifiers.push({
            id: 'rain',
            label: 'Rain',
            description: 'Rain: actions cost +2 ST.',
        });
    }

    const currentWeight = calculateEncumbrance(player.inventory);
    const maxCarry = calculateMaxCarry(player.stats.str);
    if (currentWeight > maxCarry) {
        modifiers.push({
            id: 'encumbered',
            label: 'Encumbered',
            description: 'Encumbered: travel/combat stamina costs are doubled.',
        });
    }

    return modifiers;
};

export const getChoiceEffectiveCost = (
    choice: Choice,
    player: Player,
    world: World
): ActionCostResult => {
    let manaCost = choice.manaCost || 0;
    let staminaCost = choice.staminaCost || 0;
    const modifiers = getActionModifiers(player, world);

    modifiers.forEach(mod => {
        if (mod.id === 'storm') {
            manaCost += 3;
            staminaCost += 2;
        } else if (mod.id === 'rain') {
            staminaCost += 2;
        } else if (mod.id === 'encumbered') {
            if (choice.intent === 'travel' || choice.intent === 'combat') {
                staminaCost *= 2;
            }
        }
    });

    return { manaCost, staminaCost, modifiers };
};
