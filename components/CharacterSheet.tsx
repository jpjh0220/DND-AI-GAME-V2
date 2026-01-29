

import React, { useState } from 'react';
import { X, User, RefreshCw, Wand2, Syringe, Clock } from 'lucide-react';
import { Player } from '../types';
// FIX: Corrected import path to point to the index file within the directory.
import { RACES, CLASSES, BACKGROUNDS } from '../registries/index';
// FIX: Corrected import path to point to the index file within the directory.
import { getMod, getSpellcastingAbility, ALL_SKILLS, calculateXpToNextLevel } from '../systems/index';
import { SheetSection } from './ui';

interface CharacterSheetProps { 
    player: Player; 
    onClose: () => void; 
    onGeneratePortrait?: () => Promise<void>; 
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ player, onClose, onGeneratePortrait }) => {
    const [generating, setGenerating] = useState(false);
    const proficiencyBonus = 2; // Hardcoded for Lvl 1-4
    
    let initiative = getMod(player.stats.dex);
    if (player.feats?.includes('alert')) {
        initiative += 5;
    }

    const speed = RACES[player.race]?.speed || 30;
    const spellcastingAbility = getSpellcastingAbility(player.class);
    const spellPower = getMod(player.stats[spellcastingAbility]);
    const weaponPower = Math.max(getMod(player.stats.str), getMod(player.stats.dex));
    const xpToNext = calculateXpToNextLevel(player.level);

    const handleGenerate = async () => {
        if (!onGeneratePortrait) return;
        setGenerating(true);
        try {
            await onGeneratePortrait();
        } finally {
            setGenerating(false);
        }
    };

    const renderSavingThrows = () => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.keys(player.stats).map(statKey => {
                const isProficient = player.proficiencies.savingThrows.includes(statKey);
                // FIX: Cast statKey to a valid key of Player['stats'] to prevent type errors.
                const modifier = getMod(player.stats[statKey as keyof Player['stats']]);
                const totalBonus = modifier + (isProficient ? proficiencyBonus : 0);
                return (
                    <div key={statKey} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isProficient ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{isProficient ? '✔' : ''}</div>
                        <span className="uppercase font-bold text-slate-400 w-8">{statKey}</span>
                        <span className="font-mono">{totalBonus >= 0 ? `+${totalBonus}` : totalBonus}</span>
                    </div>
                );
            })}
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-2">
            {Object.entries(ALL_SKILLS).map(([skillName, statKey]) => {
                const isProficient = player.proficiencies.skills.includes(skillName);
                // FIX: Cast statKey to a valid key of Player['stats'] to prevent type errors.
                const modifier = getMod(player.stats[statKey as keyof Player['stats']]);
                const totalBonus = modifier + (isProficient ? proficiencyBonus : 0);
                return (
                    <div key={skillName} className="flex items-center text-sm border-b border-slate-800/50 pb-2">
                         <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 text-[10px] ${isProficient ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                        {/* FIX: Cast statKey to string to use string methods like toUpperCase. */}
                        <span className="flex-1">{skillName} <span className="text-slate-500 text-xs">({(statKey as string).toUpperCase()})</span></span>
                        <span className="font-mono">{totalBonus >= 0 ? `+${totalBonus}` : totalBonus}</span>
                    </div>
                )
            })}
        </div>
    );
    
    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
                <h2 className="font-bold text-white uppercase tracking-tighter">Hero's Chronicle</h2>
                <button onClick={onClose}><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex flex-col items-center justify-center pt-4 pb-6 relative">
                    <div className="w-32 h-32 relative group">
                        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="w-full h-full rounded-full border-2 border-indigo-500/30 overflow-hidden relative bg-slate-900 flex items-center justify-center shadow-2xl">
                            {player.portrait ? (
                                <img src={player.portrait} alt="Character Portrait" className="w-full h-full object-cover" />
                            ) : generating ? (
                                <RefreshCw className="text-indigo-500 animate-spin" size={40} />
                            ) : (
                                <User className="text-slate-700" size={60} />
                            )}
                        </div>
                        {onGeneratePortrait && !generating && (
                            <button 
                                onClick={handleGenerate}
                                className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 transition-all active:scale-90"
                                title="Generate AI Portrait"
                            >
                                <Wand2 size={16} />
                            </button>
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-white mt-4">{player.name}</h1>
                    <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-[0.2em]">{player.race} {player.class} • Level {player.level}</p>
                </div>

                <SheetSection title="Identity">
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Experience to Level {player.level + 1}</span>
                                <span className="font-mono">{player.xp} / {xpToNext}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 transition-all shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{width: `${(player.xp/xpToNext)*100}%`}}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase">Background</h4>
                                <p className="text-sm text-slate-300">{player.background}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase">Speed</h4>
                                <p className="text-sm text-slate-300">{speed} ft.</p>
                            </div>
                        </div>
                        <p className="italic text-slate-400 text-sm border-l-2 border-indigo-500 pl-4 py-1 bg-slate-900/40 rounded-r-lg">"{player.concept}"</p>
                    </div>
                </SheetSection>
                
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(player.stats).map(([k,v]) => (
                        <div key={k} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center group hover:border-indigo-500/50 transition-colors">
                            <div className="text-[10px] uppercase text-slate-500 font-black">{k}</div>
                            <div className="text-xl font-black text-white">{v}</div>
                            <div className="text-xs text-indigo-400 font-mono font-bold">
                                {getMod(v as number) >= 0 ? `+${getMod(v as number)}` : getMod(v as number)}
                            </div>
                        </div>
                    ))}
                </div>

                <SheetSection title="Vitals">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div><div className="text-2xl font-black text-cyan-400">{player.ac}</div><div className="text-[10px] text-slate-500 uppercase font-bold">Armor Class</div></div>
                        <div><div className="text-2xl font-black text-amber-400">{initiative >= 0 ? `+${initiative}`: initiative}</div><div className="text-[10px] text-slate-500 uppercase font-bold">Initiative</div></div>
                        <div><div className="text-2xl font-black text-slate-300">+{proficiencyBonus}</div><div className="text-[10px] text-slate-500 uppercase font-bold">Proficiency</div></div>
                        <div><div className="text-xl font-bold text-rose-400">{weaponPower >= 0 ? `+${weaponPower}`: weaponPower}</div><div className="text-[10px] text-slate-500 uppercase font-bold">Weapon Pwr</div></div>
                        <div><div className="text-xl font-bold text-violet-400">{spellPower >= 0 ? `+${spellPower}`: spellPower}</div><div className="text-[10px] text-slate-500 uppercase font-bold">Spell Pwr</div></div>
                        <div><div className="text-xl font-bold text-indigo-400">{player.staminaMax}</div><div className="text-[10px] text-slate-500 uppercase font-bold">Max Stamina</div></div>
                    </div>
                </SheetSection>

                <SheetSection title="Saving Throws">{renderSavingThrows()}</SheetSection>
                <SheetSection title="Skills">{renderSkills()}</SheetSection>
                
                <SheetSection title="Features & Traits">
                    <div className="space-y-4 text-sm">
                        <div>
                            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Racial Heritage
                            </h4>
                            <ul className="grid grid-cols-1 gap-1 pl-4">
                                {RACES[player.race]?.traits.map(t => <li key={t} className="text-slate-400 text-xs list-disc">{t}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Class Aptitude
                            </h4>
                            <ul className="grid grid-cols-1 gap-1 pl-4">
                                {CLASSES[player.class]?.features.map(f => <li key={f} className="text-slate-400 text-xs list-disc">{f}</li>)}
                            </ul>
                        </div>
                    </div>
                </SheetSection>

                <SheetSection title="Status Conditions">
                    <div className="space-y-2">
                        {player.statusEffects.length === 0 && <div className="text-center text-slate-600 p-2 border border-dashed border-slate-800 rounded-lg text-xs">No active conditions.</div>}
                        {player.statusEffects.map((effect, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-red-900/30">
                                <div className="flex items-center gap-2">
                                    <Syringe size={16} className="text-red-400" />
                                    <div>
                                        <div className="text-sm font-bold text-red-300">{effect.name}</div>
                                        <div className="text-[10px] text-slate-500">{effect.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock size={12} /> {typeof effect.duration === 'number' ? `${effect.duration} turns` : 'Permanent'}
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetSection>

                <SheetSection title="Survival & Conditions">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-400">Exhaustion</span>
                            <span className={`text-xs font-mono font-bold ${player.exhaustion > 0 ? "text-red-400" : "text-slate-500"}`}>Level {player.exhaustion} / 6</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-400">Days without Food</span>
                            <span className={`text-xs font-mono font-bold ${player.hungerDays > 0 ? "text-red-400" : "text-emerald-400"}`}>{player.hungerDays} Days</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-400">Days without Water</span>
                            <span className={`text-xs font-mono font-bold ${player.thirstDays > 0 ? "text-red-400" : "text-emerald-400"}`}>{player.thirstDays} Days</span>
                        </div>
                     </div>
                </SheetSection>
                <div className="h-10"></div>
            </div>
        </div>
    );
};