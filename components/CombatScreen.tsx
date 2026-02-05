import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Swords, Send, FlaskConical, Wind, Target, Skull } from 'lucide-react';
import { Player, Enemy, LogEntry } from '../types';
import { Bar, AudioPlayer } from './ui';

interface FloatingText {
    id: number;
    value: string;
    type: 'damage' | 'hit' | 'crit';
    isEnemy: boolean;
    enemyId?: string;
}

interface CombatScreenProps {
  player: Player;
  enemy: Enemy; // Current target (first alive enemy)
  enemies?: Enemy[]; // All enemies in encounter
  onAction: (actionText: string, choice?: any) => void;
  onSelectTarget?: (enemyId: string) => void;
  log: LogEntry[];
  scrollRef: React.RefObject<HTMLDivElement>;
  processing: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
    player,
    enemy,
    enemies = [],
    onAction,
    onSelectTarget,
    log,
    scrollRef,
    processing,
    input,
    setInput
}) => {
    const [animationClass, setAnimationClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const [showSpells, setShowSpells] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const prevPlayerHp = useRef(player.hpCurrent);
    const prevEnemyHps = useRef<Record<string, number>>({});

    // Use enemies array if provided, otherwise fall back to single enemy
    const allEnemies = enemies.length > 0 ? enemies : [enemy];
    const aliveEnemies = allEnemies.filter(e => e.hp > 0);
    const deadEnemies = allEnemies.filter(e => e.hp <= 0);

    const weaponName = player.equipment.mainHand?.name || "unarmed strike";
    const topSpell = player.spells[0]?.name;
    const healingItems = player.inventory.filter(i => i.type === 'potion' || i.effect?.hp || i.type === 'consumable');
    const activeEffects = player.statusEffects || [];

    // Initialize prev HP tracking
    useEffect(() => {
        const newPrevHps: Record<string, number> = {};
        allEnemies.forEach(e => {
            if (prevEnemyHps.current[e.id] === undefined) {
                newPrevHps[e.id] = e.hp;
            } else {
                newPrevHps[e.id] = prevEnemyHps.current[e.id];
            }
        });
        prevEnemyHps.current = newPrevHps;
    }, [allEnemies.length]);

    useEffect(() => {
        let trigger = '';
        const id = Date.now();

        // Check player damage
        if (player.hpCurrent < prevPlayerHp.current) {
            trigger = 'animate-shake-heavy animate-flash-red';
            const diff = prevPlayerHp.current - player.hpCurrent;
            setFloatingTexts(prev => [...prev, { id, value: `-${diff}`, type: 'damage', isEnemy: false }]);
        }

        // Check each enemy for damage
        allEnemies.forEach((e, idx) => {
            const prevHp = prevEnemyHps.current[e.id] || e.hpMax;
            if (e.hp < prevHp) {
                const diff = prevHp - e.hp;
                const isCrit = diff > (e.hpMax * 0.25);
                setFloatingTexts(prev => [...prev, {
                    id: id + idx + 1,
                    value: e.hp <= 0 ? 'SLAIN!' : (isCrit ? 'CRITICAL!' : `-${diff}`),
                    type: e.hp <= 0 ? 'crit' : (isCrit ? 'crit' : 'hit'),
                    isEnemy: true,
                    enemyId: e.id
                }]);
                if (!trigger) trigger = 'animate-shake-light animate-flash-white';
            }
            prevEnemyHps.current[e.id] = e.hp;
        });

        if (trigger) {
            setAnimationClass(trigger);
            const shakeTimer = setTimeout(() => setAnimationClass(''), 500);
            const textTimer = setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id < id || t.id > id + allEnemies.length));
            }, 1000);

            prevPlayerHp.current = player.hpCurrent;

            return () => {
                clearTimeout(shakeTimer);
                clearTimeout(textTimer);
            };
        }
    }, [player.hpCurrent, ...allEnemies.map(e => e.hp)]);

    const getEnemyPosition = (index: number, total: number) => {
        if (total === 1) return { left: '50%' };
        const spread = Math.min(80, 30 + (total * 15));
        const step = spread / (total - 1);
        const start = 50 - spread / 2;
        return { left: `${start + step * index}%` };
    };

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
                        style={{ top: text.isEnemy ? '20%' : '60%' }}
                    >
                        {text.value}
                    </div>
                ))}
            </div>

            {/* Enemy Panel - Now supports multiple enemies */}
            <div className="p-3 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-10 shrink-0">
                {/* Multi-enemy display */}
                {aliveEnemies.length > 1 ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Swords size={14} className="text-red-400" />
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                                {aliveEnemies.length} Foes Remaining
                            </span>
                        </div>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(3, aliveEnemies.length)}, 1fr)` }}>
                            {aliveEnemies.map((e, idx) => (
                                <button
                                    key={e.id}
                                    onClick={() => onSelectTarget?.(e.id)}
                                    disabled={processing}
                                    className={`p-2 rounded-lg border transition-all ${
                                        e.id === enemy.id
                                            ? 'bg-red-900/40 border-red-500/60 ring-2 ring-red-500/40'
                                            : 'bg-slate-800/50 border-slate-700/50 hover:border-red-500/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        {e.id === enemy.id && <Target size={10} className="text-red-400" />}
                                        <span className={`text-xs font-bold truncate ${e.id === enemy.id ? 'text-red-400' : 'text-slate-300'}`}>
                                            {e.name}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${
                                                e.hp / e.hpMax < 0.25 ? 'bg-red-500 animate-pulse' : 'bg-red-600'
                                            }`}
                                            style={{ width: `${Math.max(0, (e.hp / e.hpMax) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-[8px] text-slate-500 mt-0.5 font-mono">
                                        {e.hp}/{e.hpMax} HP
                                    </div>
                                </button>
                            ))}
                        </div>
                        {/* Show dead enemies as defeated */}
                        {deadEnemies.length > 0 && (
                            <div className="flex gap-1 justify-center mt-1">
                                {deadEnemies.map(e => (
                                    <span key={e.id} className="text-[8px] text-slate-600 flex items-center gap-0.5">
                                        <Skull size={8} /> {e.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Single enemy display (original layout) */
                    <>
                        <div className="text-center mb-2">
                            <h2 className="font-bold text-xl text-red-500 tracking-tight uppercase">{enemy.name}</h2>
                            <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">
                                Def: {enemy.ac} | Vitality: {enemy.hp}/{enemy.hpMax}
                            </p>
                        </div>
                        <Bar
                            color={enemy.hp / enemy.hpMax < 0.25 ? "bg-red-500 animate-pulse" : "bg-red-600"}
                            cur={enemy.hp}
                            max={enemy.hpMax}
                            label="Foeman Health"
                            icon={<Heart size={8}/>}
                            warningThreshold={0.35}
                            criticalThreshold={0.2}
                        />
                    </>
                )}
            </div>

            {/* Combat Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
                {log.map((msg, i) => {
                    if (!['combat', 'narration', 'player', 'milestone', 'worldevent'].includes(msg.type)) return null;
                    return (
                        <div key={`combat-log-${i}`} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'} animate-slide-in-from-bottom`}>
                            <div className={`max-w-[85%] ${msg.type !== 'player' ? 'w-full' : ''}`}>
                                {msg.type === 'narration' && msg.image && (
                                    <div className="mb-2 rounded-xl overflow-hidden border border-slate-700 shadow-md">
                                        <img src={msg.image} alt="Combat scene" className="w-full h-auto object-cover" />
                                    </div>
                                )}
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed flex gap-2 items-start ${
                                    msg.type === 'player' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' :
                                    msg.type === 'milestone' ? 'bg-amber-900/30 border border-amber-500/30 text-amber-300 text-xs font-bold' :
                                    msg.type === 'worldevent' ? 'bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-bold' :
                                    'bg-slate-800 border border-slate-700 rounded-tl-none text-slate-300 shadow-md'
                                }`}>
                                    <span className="flex-1">{msg.text}</span>
                                    {msg.type === 'narration' && <AudioPlayer text={msg.text} />}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Status Effects Display */}
            {activeEffects.length > 0 && (
                <div className="px-3 py-1.5 bg-slate-900/70 border-t border-slate-800 flex gap-1.5 overflow-x-auto shrink-0">
                    {activeEffects.map((eff, i) => (
                        <span key={`eff-${i}`} className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase whitespace-nowrap ${
                            (eff.effect.hpPerTurn && eff.effect.hpPerTurn > 0) || (eff.effect.acModifier && eff.effect.acModifier > 0) || (eff.effect.damageModifier && eff.effect.damageModifier > 0)
                                ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-900/40 text-red-400 border border-red-500/30'
                        }`}>
                            {eff.name} {eff.duration !== 'permanent' && `(${eff.duration}t)`}
                        </span>
                    ))}
                </div>
            )}

            <div className="bg-slate-900 border-t border-slate-800 p-3 pb-safe shrink-0">
                {/* Primary Actions Row */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                    <button disabled={processing} onClick={() => onAction(`I strike ${enemy.name} with my ${weaponName}`)} className="p-3 bg-red-900/20 border border-red-500/30 hover:bg-red-800/40 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 active:scale-95">
                        <Swords size={18} className="mb-0.5 text-red-400"/>
                        <span className="text-[9px] text-white">Attack</span>
                        <span className="text-[7px] text-red-300/60 uppercase truncate w-full px-0.5 text-center">{weaponName}</span>
                    </button>
                    <button disabled={processing} onClick={() => player.spells.length > 1 ? setShowSpells(!showSpells) : topSpell ? onAction(`I cast ${topSpell} upon ${enemy.name}`) : onAction("I assume a defensive stance")} className="p-3 bg-blue-900/20 border border-blue-500/30 hover:bg-blue-800/40 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 active:scale-95">
                        <Zap size={18} className="mb-0.5 text-blue-400"/>
                        <span className="text-[9px] text-white">{topSpell ? 'Spells' : 'Defend'}</span>
                        {topSpell && <span className="text-[7px] text-blue-300/60">{player.spells.length} known</span>}
                    </button>
                    <button disabled={processing} onClick={() => setShowItems(!showItems)} className="p-3 bg-amber-900/20 border border-amber-500/30 hover:bg-amber-800/40 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 active:scale-95">
                        <FlaskConical size={18} className="mb-0.5 text-amber-400"/>
                        <span className="text-[9px] text-white">Items</span>
                        <span className="text-[7px] text-amber-300/60">{healingItems.length} usable</span>
                    </button>
                    <button disabled={processing} onClick={() => onAction(`I attempt to flee from the ${aliveEnemies.length > 1 ? 'enemies' : enemy.name}`)} className="p-3 bg-slate-800 border border-slate-600/30 hover:bg-slate-700 rounded-xl font-bold flex flex-col items-center justify-center transition-all disabled:opacity-50 active:scale-95">
                        <Wind size={18} className="mb-0.5 text-slate-400"/>
                        <span className="text-[9px] text-slate-300">Flee</span>
                    </button>
                </div>

                {/* Spell Picker Dropdown */}
                {showSpells && player.spells.length > 0 && (
                    <div className="mb-2 max-h-32 overflow-y-auto rounded-lg border border-blue-500/20 bg-slate-950/80">
                        {player.spells.map((spell, i) => (
                            <button key={`spell-${i}`} disabled={processing || (spell.cost > player.manaCurrent)} onClick={() => { onAction(`I cast ${spell.name} upon ${spell.target === 'self' ? 'myself' : enemy.name}`); setShowSpells(false); }}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-blue-900/30 border-b border-slate-800 last:border-0 flex justify-between items-center disabled:opacity-40 transition-colors">
                                <span className="text-white font-medium">{spell.name} <span className="text-slate-500">({spell.school})</span></span>
                                <span className="text-blue-400 font-mono text-[10px]">{spell.cost} MP</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Item Picker Dropdown */}
                {showItems && (
                    <div className="mb-2 max-h-32 overflow-y-auto rounded-lg border border-amber-500/20 bg-slate-950/80">
                        {healingItems.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-slate-500 text-center">No usable items</div>
                        ) : healingItems.map((item, i) => (
                            <button key={`item-${i}`} disabled={processing} onClick={() => { onAction(`I use my ${item.name}`); setShowItems(false); }}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-amber-900/30 border-b border-slate-800 last:border-0 flex justify-between items-center disabled:opacity-40 transition-colors">
                                <span className="text-white font-medium">{item.name}</span>
                                {item.effect?.hp && <span className="text-emerald-400 text-[10px]">+{item.effect.hp} HP</span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Custom Action Input */}
                <div className="flex gap-2">
                    <input className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" placeholder="Custom action..." value={input} onChange={e => setInput(e.target.value.slice(0, 300))} onKeyDown={e => e.key === 'Enter' && onAction(input)} disabled={processing} maxLength={300}/>
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
