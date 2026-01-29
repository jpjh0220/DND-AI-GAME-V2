




import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Shield, Swords, Send } from 'lucide-react';
import { Player, Enemy, LogEntry } from '../types';
import { Bar, AudioPlayer } from './ui';

interface FloatingText {
    id: number;
    value: string;
    type: 'damage' | 'hit' | 'crit';
    isEnemy: boolean;
}

interface CombatScreenProps { 
  player: Player; 
  enemy: Enemy; 
  onAction: (actionText: string) => void; 
  log: LogEntry[]; 
  scrollRef: React.RefObject<HTMLDivElement>; 
  processing: boolean; 
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ player, enemy, onAction, log, scrollRef, processing, input, setInput }) => {
    const [animationClass, setAnimationClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const prevPlayerHp = useRef(player.hpCurrent);
    const prevEnemyHp = useRef(enemy.hp);

    const weaponName = player.equipment.mainHand?.name || "unarmed strike";
    const topSpell = player.spells[0]?.name;

    useEffect(() => {
        let trigger = '';
        const id = Date.now();

        if (player.hpCurrent < prevPlayerHp.current) {
            trigger = 'animate-shake-heavy animate-flash-red';
            const diff = prevPlayerHp.current - player.hpCurrent;
            setFloatingTexts(prev => [...prev, { id, value: `-${diff}`, type: 'damage', isEnemy: false }]);
        } else if (enemy.hp < prevEnemyHp.current) {
            trigger = 'animate-shake-light animate-flash-white';
            const diff = prevEnemyHp.current - enemy.hp;
            // Simplified crit detection for visual juice: if damage is high relative to max hp
            const isCrit = diff > (enemy.hpMax * 0.25);
            setFloatingTexts(prev => [...prev, { 
                id, 
                value: isCrit ? 'CRITICAL!' : `-${diff}`, 
                type: isCrit ? 'crit' : 'hit', 
                isEnemy: true 
            }]);
        }

        if (trigger) {
            setAnimationClass(trigger);
            const shakeTimer = setTimeout(() => setAnimationClass(''), 500);
            const textTimer = setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 1000);
            
            prevPlayerHp.current = player.hpCurrent;
            prevEnemyHp.current = enemy.hp;
            
            return () => {
                clearTimeout(shakeTimer);
                clearTimeout(textTimer);
            };
        }
    }, [player.hpCurrent, enemy.hp]);

    return (
        <div className={`absolute inset-0 flex flex-col bg-slate-950 overflow-hidden transition-all duration-300 ${animationClass}`}>
            
            {/* Floating Damage Text Container */}
            <div className="absolute inset-0 pointer-events-none z-[100] flex items-center justify-center">
                {floatingTexts.map(text => (
                    <div 
                        key={text.id} 
                        className={`absolute font-black text-3xl italic animate-fct uppercase ${
                            text.type === 'crit' ? 'text-amber-400 scale-150 drop-shadow-glow' : 
                            text.isEnemy ? 'text-white' : 'text-red-500'
                        }`}
                        style={{ top: text.isEnemy ? '30%' : '60%' }}
                    >
                        {text.value}
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-10 shrink-0">
                <div className="text-center mb-2">
                    <h2 className="font-bold text-xl text-red-500 tracking-tight uppercase">{enemy.name}</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Def: {enemy.ac} | Vitality: {enemy.hp}/{enemy.hpMax}</p>
                </div>
                <Bar 
                    color={enemy.hp / enemy.hpMax < 0.25 ? "bg-red-500 animate-pulse" : "bg-red-600"} 
                    cur={enemy.hp} 
                    max={enemy.hpMax} 
                    label="Foeman Health" 
                    icon={<Heart size={8}/>} 
                />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
                {log.map((msg, i) => {
                    if (!['combat', 'narration', 'player'].includes(msg.type)) return null;
                    return (
                        <div key={`combat-log-${i}`} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'} animate-slide-in-from-bottom`}>
                            <div className={`max-w-[85%] ${msg.type !== 'player' ? 'w-full' : ''}`}>
                                {msg.type === 'narration' && msg.image && (
                                    <div className="mb-2 rounded-xl overflow-hidden border border-slate-700 shadow-md">
                                        <img src={msg.image} alt="Combat scene" className="w-full h-auto object-cover" />
                                    </div>
                                )}
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed flex gap-2 items-start ${msg.type === 'player' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' : 'bg-slate-800 border border-slate-700 rounded-tl-none text-slate-300 shadow-md'}`}>
                                    <span className="flex-1">{msg.text}</span>
                                    {msg.type === 'narration' && <AudioPlayer text={msg.text} />}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="bg-slate-900 border-t border-slate-800 p-3 pb-safe shrink-0">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button disabled={processing} onClick={() => onAction(`I strike ${enemy.name} with my ${weaponName}`)} className="p-4 bg-red-900/20 border border-red-500/30 hover:bg-red-800/40 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 active:scale-95">
                        <Swords size={20} className="mb-1 text-red-400"/>
                        <span className="text-[10px] text-white">Attack</span>
                        <span className="text-[8px] text-red-300/60 uppercase truncate w-full px-1 text-center">{weaponName}</span>
                    </button>
                    {topSpell ? (
                        <button disabled={processing} onClick={() => onAction(`I cast ${topSpell} upon ${enemy.name}`)} className="p-4 bg-blue-900/20 border border-blue-500/30 hover:bg-blue-800/40 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 active:scale-95">
                            <Zap size={20} className="mb-1 text-blue-400"/>
                            <span className="text-[10px] text-white">Cast</span>
                            <span className="text-[8px] text-blue-300/60 uppercase truncate w-full px-1 text-center">{topSpell}</span>
                        </button>
                    ) : (
                         <button disabled={processing} onClick={() => onAction("I assume a defensive stance")} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 text-slate-400 active:scale-95">
                            <Shield size={20} className="mb-1"/>
                            <span className="text-[10px]">Defend</span>
                        </button>
                    )}
                </div>
                 <div className="flex gap-2">
                    <input className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" placeholder="Custom action..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAction(input)} disabled={processing}/>
                    <button onClick={() => onAction(input)} disabled={processing||!input.trim()} className="p-3 bg-indigo-600 rounded-xl text-white disabled:opacity-50 hover:bg-indigo-500 transition-colors"><Send size={18}/></button>
                </div>
            </div>

            <style>{`
                .animate-shake-heavy { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                .animate-shake-light { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
                .animate-flash-red { animation: flashRed 0.3s ease-out forwards; }
                .animate-flash-white { animation: flashWhite 0.3s ease-out forwards; }
                
                @keyframes shake {
                    10%, 90% { transform: translate3d(-2px, 0, 0); }
                    20%, 80% { transform: translate3d(4px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
                    40%, 60% { transform: translate3d(6px, 0, 0); }
                }
                @keyframes flashRed {
                    0% { background-color: rgba(153, 27, 27, 0); }
                    50% { background-color: rgba(153, 27, 27, 0.4); }
                    100% { background-color: rgba(153, 27, 27, 0); }
                }
                @keyframes flashWhite {
                    0% { background-color: rgba(255, 255, 255, 0); }
                    50% { background-color: rgba(255, 255, 255, 0.2); }
                    100% { background-color: rgba(255, 255, 255, 0); }
                }
                
                .animate-fct {
                    animation: floatCombatText 1s ease-out forwards;
                }

                @keyframes floatCombatText {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    20% { transform: translateY(-20px) scale(1.2); opacity: 1; }
                    100% { transform: translateY(-80px) scale(1); opacity: 0; }
                }

                .drop-shadow-glow {
                    filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.8));
                }
            `}</style>
        </div>
    );
};