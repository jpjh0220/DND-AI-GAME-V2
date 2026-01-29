import React from 'react';
import { X, Shield } from 'lucide-react';
import { Player } from '../types';
import { FACTIONS_DB } from '../registries/index';

interface ScreenProps { player: Player; onClose: () => void; }

export const FactionScreen: React.FC<ScreenProps> = ({ player, onClose }) => {
    const knownFactions = Object.keys(player.factions || {});

    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
                <h2 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                    <Shield className="text-indigo-400" size={20} /> Known Factions
                </h2>
                <button onClick={onClose}><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {FACTIONS_DB.map(faction => {
                    const playerReputation = player.factions[faction.id];
                    const isKnown = knownFactions.includes(faction.id);
                    return (
                        <div 
                            key={faction.id} 
                            className={`bg-slate-900 p-4 rounded-xl border transition-all ${
                                isKnown ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800 opacity-60 grayscale'
                            }`}
                        >
                            <h3 className={`font-bold text-lg ${isKnown ? 'text-white' : 'text-slate-500'}`}>{faction.name}</h3>
                            <div className="text-xs text-indigo-400 uppercase tracking-widest mt-1">Alignment: {faction.alignment}</div>
                            <p className="text-sm text-slate-400 mt-2">{faction.description}</p>
                            {faction.headquarters && <div className="text-xs text-slate-500 mt-1">Headquarters: {faction.headquarters}</div>}
                            {faction.ranks && faction.ranks.length > 0 && <div className="text-xs text-slate-500 mt-1">Ranks: {faction.ranks.join(', ')}</div>}
                            
                            {isKnown && (
                                <>
                                    <div className="text-sm font-bold text-emerald-400 mt-3">Your Reputation: {playerReputation !== undefined ? playerReputation : 'Unknown'}</div>
                                    {faction.reputationEffects && faction.reputationEffects.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase">Reputation Perks:</h4>
                                            <ul className="list-disc list-inside text-xs text-slate-400 pl-2">
                                                {faction.reputationEffects.map((effect, i) => (
                                                    <li key={i}>{effect.minRep} Rep: {effect.effect}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
                {FACTIONS_DB.length === 0 && <div className="text-center text-slate-600 p-4 border border-dashed border-slate-800 rounded-xl">No factions have been defined.</div>}
            </div>
        </div>
    );
};