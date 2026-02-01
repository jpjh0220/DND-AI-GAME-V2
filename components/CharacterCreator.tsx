

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Player } from '../types';
import { RACES, CLASSES, BACKGROUNDS, FEATS_DB } from '../registries/index';
import { getMod, assignDefaultStats, getEligibleFeats } from '../systems/index';
import type { FeatPrerequisite } from '../systems/engine';
import { CreationInput, CreationGrid } from './ui';

const STATS: (keyof Player['stats'])[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const CharacterCreator: React.FC<{ onComplete: (data: Player) => void, onBack: () => void }> = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(1);
    
    const [data, setData] = useState<{
        name: string;
        concept: string;
        race: string;
        class: string;
        background: string;
        stats: Player['stats'];
        personality: Player['personality'];
        feats: string[];
    }>(() => {
        const initialRace = "Human";
        const initialClass = "Fighter";
        const initialStats = assignDefaultStats(initialRace, initialClass);
        return { 
            name: "Kael", 
            concept: "A heroic warrior destined for greatness.", 
            race: initialRace, 
            class: initialClass, 
            background: "Soldier", 
            stats: initialStats, 
            personality: { traits: "Brave and honorable.", ideals: "Justice for all.", bonds: "My family's legacy.", flaws: "Too trusting." },
            feats: []
        };
    });

    useEffect(() => {
        setData(d => ({ ...d, stats: assignDefaultStats(d.race, d.class) }));
    }, [data.race, data.class]);

    const finalPlayer = useMemo((): Player | null => {
        if (Object.keys(data.stats).length < 6 || Object.values(data.stats).some(s => isNaN(Number(s)))) {
            return null;
        }
        return {
            ...data,
            level: 1, xp: 0,
            proficiencies: { skills: [...(BACKGROUNDS[data.background]?.skills || []), ...(CLASSES[data.class]?.skills || [])], savingThrows: CLASSES[data.class]?.savingThrows || [] },
            exhaustion: 0, hungerDays: 0, thirstDays: 0,
            spells: [], quests: [], factions: {}, knownNPCs: [], equipment: {},
            currency: 1000,
            inventory: [],
            hpMax: 0, hpCurrent: 0, manaMax: 0, manaCurrent: 0, staminaMax: 0, staminaCurrent: 0, ac: 0,
            // FIX: Add missing properties to satisfy Player interface
            achievements: [],
            statusEffects: []
        };
    }, [data]);
    
    const isStepComplete = () => {
        switch(step) {
            case 1: return !!(data.name.trim() && data.concept.trim());
            case 5: return Object.values(data.stats).every(val => typeof val === 'number' && !isNaN(val));
            case 6: return !!(data.personality.traits.trim() && data.personality.ideals.trim() && data.personality.bonds.trim() && data.personality.flaws.trim());
            case 7: return data.feats.length > 0;
            default: return true;
        }
    };

    const handleComplete = () => {
        if(finalPlayer) onComplete(finalPlayer);
    }
    
    const renderStep = () => {
        switch (step) {
            case 1: return (<>
                <CreationInput label="Name" value={data.name} onChange={v => setData({...data, name: v})} placeholder="Enter your hero's name" />
                <CreationInput label="Concept" value={data.concept} onChange={v => setData({...data, concept: v})} placeholder="e.g., A knight who protects the weak..." />
            </>);
            case 2: return (<CreationGrid label="Race / Species" options={RACES} selected={data.race} onSelect={v => setData({...data, race: v})} />);
            case 3: return (<CreationGrid label="Class" options={CLASSES} selected={data.class} onSelect={v => setData({...data, class: v})} />);
            case 4: return (<CreationGrid label="Background" options={BACKGROUNDS} selected={data.background} onSelect={v => setData({...data, background: v})} />);
            case 5: return (<>
                <label className="text-xs uppercase font-bold text-slate-500 block mb-2">Ability Scores</label>
                <p className="text-sm text-slate-400 mb-4">Scores are automatically assigned based on your Race and Class. You can edit them freely below.</p>
                <div className="grid grid-cols-2 gap-4">
                {STATS.map(stat => (
                    <div key={stat} className="bg-slate-800 p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                            <label className="font-bold uppercase text-indigo-400">{stat}</label>
                            <span className="text-lg font-mono text-white bg-slate-900 px-2 rounded">
                                {getMod(data.stats[stat] as number) >= 0 ? `+${getMod(data.stats[stat] as number)}` : getMod(data.stats[stat] as number)}
                            </span>
                        </div>
                        <input 
                            type="number"
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-center text-2xl font-bold mt-2 outline-none focus:border-indigo-500"
                            value={data.stats[stat] as number}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10) || 0;
                                setData(d => ({ ...d, stats: { ...d.stats, [stat]: value } }));
                            }}
                        />
                    </div>
                ))}
                </div>
            </>);
            case 6: return (<>
                <CreationInput label="Personality Traits" value={data.personality.traits} onChange={v => setData({...data, personality: {...data.personality, traits: v}})} placeholder="Describe your hero's personality..." />
                <CreationInput label="Ideals" value={data.personality.ideals} onChange={v => setData({...data, personality: {...data.personality, ideals: v}})} placeholder="What does your hero believe in?" />
                <CreationInput label="Bonds" value={data.personality.bonds} onChange={v => setData({...data, personality: {...data.personality, bonds: v}})} placeholder="What is important to your hero?" />
                <CreationInput label="Flaws" value={data.personality.flaws} onChange={v => setData({...data, personality: {...data.personality, flaws: v}})} placeholder="What are your hero's weaknesses?" />
            </>);
            case 7: {
                const eligibleFeats = getEligibleFeats(data.race, data.class, data.background, data.stats, []);
                const available = eligibleFeats.filter(f => f.eligible);
                const unavailable = eligibleFeats.filter(f => !f.eligible);
                return (<>
                    <label className="text-xs uppercase font-bold text-slate-500 block mb-2">Feat</label>
                    <p className="text-sm text-slate-400 mb-4">Choose one feat. Only feats matching your {data.race} {data.class} are shown.</p>
                    <div className="space-y-2">
                    {available.map(feat => {
                        const isSelected = data.feats.includes(feat.id);
                        return (
                            <button
                                key={feat.id}
                                onClick={() => setData({...data, feats: [feat.id]})}
                                className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                            >
                                <div className="font-bold">{feat.name}</div>
                                <div className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{feat.desc}</div>
                                {feat.req !== 'None' && <div className="text-[10px] mt-1 text-indigo-400/60 uppercase">Req: {feat.req}</div>}
                            </button>
                        );
                    })}
                    </div>
                    {unavailable.length > 0 && (
                        <details className="mt-4">
                            <summary className="text-[10px] text-slate-600 uppercase cursor-pointer hover:text-slate-400">{unavailable.length} feats unavailable for your build</summary>
                            <div className="space-y-1 mt-2">
                            {unavailable.map(feat => (
                                <div key={feat.id} className="p-3 rounded-xl border border-slate-800/50 bg-slate-900/30 opacity-40">
                                    <div className="font-bold text-slate-500 text-sm">{feat.name}</div>
                                    <div className="text-[10px] text-red-400/70">{feat.reason}</div>
                                </div>
                            ))}
                            </div>
                        </details>
                    )}
                </>);
            }
            default: return <div>Review</div>
        }
    }

    return (<div className="h-screen bg-slate-950 flex flex-col font-sans">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack}><ChevronRight className="rotate-180 text-slate-500"/></button>
          <h2 className="text-xl font-bold text-white">Create Hero (Step {step}/7)</h2>
        </div>
        <div className="text-xs text-slate-500">{['Concept', 'Race', 'Class', 'Background', 'Stats', 'Personality', 'Feat'][step-1]}</div>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {renderStep()}
      </div>
      <div className="p-6 border-t border-slate-800 flex gap-4">
        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-4 bg-slate-800 font-bold rounded-xl text-white">Back</button>}
        {step < 7 && <button onClick={() => setStep(s => s + 1)} disabled={!isStepComplete()} className="flex-1 py-4 bg-indigo-600 font-bold rounded-xl text-white disabled:bg-indigo-900 disabled:text-slate-500">Next</button>}
        {step === 7 && <button onClick={handleComplete} disabled={!isStepComplete()} className="w-full py-4 bg-indigo-600 font-bold rounded-xl text-white shadow-lg active:scale-95 disabled:bg-indigo-900 disabled:text-slate-500">Begin Adventure</button>}
      </div>
    </div>);
};