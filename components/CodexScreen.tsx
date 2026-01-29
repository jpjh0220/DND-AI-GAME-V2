import React, { useState, useMemo } from 'react';
import { X, User, Shield, BookOpen, ScrollText } from 'lucide-react';
import { Player, World } from '../types';
import { NPCS_DB, FACTIONS_DB, DEITIES_DB } from '../registries/index';

type CodexTab = 'npcs' | 'factions' | 'deities';

export const CodexScreen: React.FC<{player: Player, onClose: () => void}> = ({ player, onClose }) => {
    const [activeTab, setActiveTab] = useState<CodexTab>('npcs');

    const knownNPCs = useMemo(() => {
        return player.knownNPCs.map(knownNpc => NPCS_DB.find(dbNpc => dbNpc.id === knownNpc.id) || knownNpc);
    }, [player.knownNPCs]);

    const playerFactions = useMemo(() => {
        return Object.keys(player.factions || {}).map(factionId => FACTIONS_DB.find(f => f.id === factionId));
    }, [player.factions]);

    const TabButton = ({ tab, icon, label }: { tab: CodexTab, icon: React.ReactNode, label: string }) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex flex-col items-center py-2 transition-all border-b-2 ${activeTab === tab ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            {icon}
            <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">{label}</span>
        </button>
    );

    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
                <h2 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                    <BookOpen className="text-slate-400" size={20} /> The Grand Codex
                </h2>
                <button onClick={onClose}><X size={20}/></button>
            </div>

            <div className="flex bg-slate-900 border-b border-slate-800 shrink-0">
                <TabButton tab="npcs" icon={<User size={16}/>} label="NPCs" />
                <TabButton tab="factions" icon={<Shield size={16}/>} label="Factions" />
                <TabButton tab="deities" icon={<ScrollText size={16}/>} label="Deities" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'npcs' && (
                    <>
                        {knownNPCs.length === 0 && <div className="text-center text-slate-500 p-4 border border-dashed border-slate-800 rounded-xl">No NPCs discovered yet.</div>}
                        {knownNPCs.map(npc => npc && (
                            <div key={npc.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 shrink-0 bg-slate-800 flex items-center justify-center">
                                    {npc.portrait ? <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" /> : <User size={24} className="text-slate-700"/>}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white">{npc.name}</div>
                                    <div className="text-xs text-indigo-400 uppercase tracking-widest">{npc.role}</div>
                                    <p className="text-xs text-slate-400 mt-2">{npc.description || "No further details known."}</p>
                                    {npc.questGiver && <span className="text-[10px] text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded-md mt-1 inline-block">Quest Giver</span>}
                                    {npc.shopkeeper && <span className="text-[10px] text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-md mt-1 ml-1 inline-block">Shopkeeper</span>}
                                    {npc.factionAffiliation && <span className="text-[10px] text-sky-400 bg-sky-900/20 px-2 py-0.5 rounded-md mt-1 ml-1 inline-block">Affiliation: {FACTIONS_DB.find(f => f.id === npc.factionAffiliation)?.name || npc.factionAffiliation}</span>}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'factions' && (
                    <>
                        {playerFactions.length === 0 && <div className="text-center text-slate-500 p-4 border border-dashed border-slate-800 rounded-xl">No known factions.</div>}
                        {FACTIONS_DB.map(faction => (
                            <div key={faction.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <div className="font-bold text-white text-lg">{faction.name}</div>
                                <div className="text-xs text-indigo-400 uppercase tracking-widest mt-1">Alignment: {faction.alignment}</div>
                                <p className="text-sm text-slate-400 mt-2">{faction.description}</p>
                                {faction.headquarters && <div className="text-xs text-slate-500 mt-1">Headquarters: {faction.headquarters}</div>}
                                {player.factions[faction.id] !== undefined && <div className="text-sm font-bold text-emerald-400 mt-2">Your Reputation: {player.factions[faction.id]}</div>}
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'deities' && (
                    <>
                        {DEITIES_DB.length === 0 && <div className="text-center text-slate-500 p-4 border border-dashed border-slate-800 rounded-xl">No known deities.</div>}
                        {DEITIES_DB.map(deity => (
                            <div key={deity.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <div className="font-bold text-white text-lg">{deity.name}</div>
                                <div className="text-xs text-indigo-400 uppercase tracking-widest mt-1">Domain: {deity.domain} • Alignment: {deity.alignment}</div>
                                <p className="text-sm text-slate-400 mt-2">{deity.description}</p>
                                <div className="text-sm text-slate-500 mt-1">Symbol: {deity.symbol}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};