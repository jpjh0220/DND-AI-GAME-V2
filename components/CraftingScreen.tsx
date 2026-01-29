

import React, { useState, useMemo } from 'react';
import { X, Hammer, FlaskConical, ScrollText, CheckCircle2 } from 'lucide-react';
import { Player, Item, Recipe, StatusEffect } from '../types';
import { RECIPES_DB, ITEMS_DB } from '../registries/index';
// FIX: Corrected import path for ALL_SKILLS
import { formatCurrency, getMod, ALL_SKILLS } from '../systems/index';

interface CraftingScreenProps {
    player: Player;
    onClose: () => void;
    onCraft: (recipe: Recipe, materialsConsumed: {itemId: string, quantity: number}[], results: {itemId: string, quantity: number}[], skillCheckResult: { success: boolean, message: string } | null) => void;
    addToast: (message: string, type?: 'info' | 'success' | 'danger') => void;
}

export const CraftingScreen: React.FC<CraftingScreenProps> = ({ player, onClose, onCraft, addToast }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const playerInventoryMap = useMemo(() => {
        const map = new Map<string, number>();
        player.inventory.forEach(item => {
            if (item.id) {
                map.set(item.id, (map.get(item.id) || 0) + 1);
            }
        });
        return map;
    }, [player.inventory]);

    const canCraft = (recipe: Recipe): { can: boolean, missing: { itemId: string, quantity: number }[] } => {
        const missing: { itemId: string, quantity: number }[] = [];
        let hasAll = true;
        recipe.materials.forEach(mat => {
            const owned = playerInventoryMap.get(mat.itemId) || 0;
            if (owned < mat.quantity) {
                hasAll = false;
                missing.push({ itemId: mat.itemId, quantity: mat.quantity - owned });
            }
        });
        return { can: hasAll, missing };
    };

    const handleCraftAttempt = (recipe: Recipe) => {
        const { can, missing } = canCraft(recipe);
        if (!can) {
            const missingNames = missing.map(m => `${m.quantity}x ${ITEMS_DB.find(i => i.id === m.itemId)?.name || m.itemId}`).join(', ');
            addToast(`Missing materials: ${missingNames}`, 'danger');
            return;
        }

        let skillCheckResult: { success: boolean, message: string } | null = null;
        if (recipe.skillRequired && recipe.dc) {
            const statKey = ALL_SKILLS[recipe.skillRequired as keyof typeof ALL_SKILLS];
            const bonus = getMod(player.stats[statKey]) + (player.proficiencies.skills.includes(recipe.skillRequired) ? 2 : 0);
            const roll = Math.floor(Math.random() * 20) + 1;
            const total = roll + bonus;
            const success = total >= recipe.dc;
            skillCheckResult = {
                success,
                message: `${recipe.skillRequired} Check: Rolled ${roll} + ${bonus} (DC ${recipe.dc}) = ${total}. ${success ? 'Success!' : 'Failure!'}`
            };
            
            addToast(skillCheckResult.message, success ? 'success' : 'danger');

            if (!success) {
                // On failure, maybe waste some materials or get a lesser item
                const wastedMaterials = recipe.materials.map(mat => ({
                    itemId: mat.itemId,
                    quantity: Math.ceil(mat.quantity / 2) // Waste half materials
                }));
                onCraft(recipe, wastedMaterials, [], skillCheckResult);
                return;
            }
        }

        // If successful or no skill check, proceed with crafting
        onCraft(recipe, recipe.materials, recipe.result, skillCheckResult);
        addToast(`Successfully crafted ${recipe.result.map(r => `${r.quantity}x ${ITEMS_DB.find(i => i.id === r.itemId)?.name || r.itemId}`).join(', ')}!`, 'success');
    };

    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
                <h2 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                    <Hammer className="text-amber-500" size={20} /> The Artisan's Bench
                </h2>
                <button onClick={onClose}><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                <div className="col-span-1 space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Recipes</h3>
                    {RECIPES_DB.map(recipe => {
                        const { can } = canCraft(recipe);
                        return (
                            <button
                                key={recipe.id}
                                onClick={() => setSelectedRecipe(recipe)}
                                className={`w-full p-3 rounded-xl border text-left transition-all ${selectedRecipe?.id === recipe.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                                <div className="font-bold">{recipe.name}</div>
                                <div className={`text-xs ${can ? 'text-emerald-400' : 'text-red-400'}`}>
                                    Materials: {can ? 'Ready' : 'Missing'}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="col-span-1 space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Details</h3>
                    {selectedRecipe ? (
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-4">
                            <h4 className="font-bold text-white text-lg">{selectedRecipe.name}</h4>
                            <p className="text-sm text-slate-400">{selectedRecipe.description}</p>

                            <div>
                                <h5 className="text-xs font-bold text-indigo-400 uppercase mb-2">Materials Needed:</h5>
                                <ul className="space-y-1">
                                    {selectedRecipe.materials.map((mat, i) => {
                                        const item = ITEMS_DB.find(it => it.id === mat.itemId);
                                        const owned = playerInventoryMap.get(mat.itemId) || 0;
                                        const hasEnough = owned >= mat.quantity;
                                        return (
                                            <li key={i} className="flex justify-between text-sm">
                                                <span className={`${hasEnough ? 'text-slate-300' : 'text-red-400'}`}>{mat.quantity}x {item?.name || mat.itemId}</span>
                                                <span className={`font-mono ${hasEnough ? 'text-emerald-400' : 'text-red-400'}`}>({owned} owned)</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-bold text-indigo-400 uppercase mb-2">Result:</h5>
                                <ul className="space-y-1">
                                    {selectedRecipe.result.map((res, i) => {
                                        const item = ITEMS_DB.find(it => it.id === res.itemId);
                                        return (
                                            <li key={i} className="flex justify-between text-sm text-emerald-400">
                                                <span>{res.quantity}x {item?.name || res.itemId}</span>
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {selectedRecipe.skillRequired && selectedRecipe.dc && (
                                <div>
                                    <h5 className="text-xs font-bold text-indigo-400 uppercase mb-2">Skill Check:</h5>
                                    <p className="text-sm text-slate-300">Requires <span className="font-bold">{selectedRecipe.skillRequired} (DC {selectedRecipe.dc})</span></p>
                                </div>
                            )}

                            <button
                                onClick={() => handleCraftAttempt(selectedRecipe)}
                                disabled={!canCraft(selectedRecipe).can}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all hover:bg-indigo-500 active:scale-95 disabled:bg-slate-700 disabled:text-slate-500"
                            >
                                <Hammer size={16} className="inline-block mr-2" /> Craft
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600 p-4 rounded-xl border border-dashed border-slate-800 mt-2">Select a recipe to view details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};