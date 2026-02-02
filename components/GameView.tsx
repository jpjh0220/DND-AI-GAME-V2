








import React from 'react';
import { Send, Dices, MapPin, Swords, MessageSquare, ShoppingBag, Moon, Settings, Zap, Wind, User, Trophy, ScrollText, Globe, Hammer, Compass } from 'lucide-react';
import { LogEntry, Choice, NPC } from '../types';
import { AudioPlayer } from './ui';

interface GameViewProps { 
  log: LogEntry[]; 
  choices: Choice[]; 
  processing: boolean; 
  input: string; 
  setInput: React.Dispatch<React.SetStateAction<string>>; 
  onAction: (actionText: string, choice?: Choice) => Promise<void>; 
  scrollRef: React.RefObject<HTMLDivElement>; 
  activeNPC?: NPC | null;
  playerResources: { mp: number; st: number };
  actionHints: { icon: React.ReactNode; text: string }[];
  getChoiceCost: (choice: Choice) => { mana: number; stamina: number };
}

export const GameView: React.FC<GameViewProps> = ({ log, choices, processing, input, setInput, onAction, scrollRef, activeNPC, playerResources, actionHints, getChoiceCost }) => {
  
  const getIntentConfig = (intent: string) => {
    switch (intent) {
      case 'travel': return { style: 'border-emerald-500/50 bg-emerald-900/20 text-emerald-300', icon: <MapPin size={14}/> };
      case 'combat': return { style: 'border-rose-500/50 bg-rose-900/20 text-rose-300', icon: <Swords size={14}/> };
      case 'social': return { style: 'border-sky-500/50 bg-sky-900/20 text-sky-300', icon: <MessageSquare size={14}/> };
      case 'buy': return { style: 'border-amber-500/50 bg-amber-900/20 text-amber-300', icon: <ShoppingBag size={14}/> };
      case 'rest': return { style: 'border-indigo-500/50 bg-indigo-900/20 text-indigo-300', icon: <Moon size={14}/> };
      case 'craft': return { style: 'border-fuchsia-500/50 bg-fuchsia-900/20 text-fuchsia-300', icon: <Hammer size={14}/> };
      case 'discovery': return { style: 'border-teal-500/50 bg-teal-900/20 text-teal-300', icon: <Compass size={14}/> };
      case 'system': return { style: 'border-slate-600 bg-slate-800 text-slate-300', icon: <Settings size={14}/> };
      default: return { style: 'border-slate-700 bg-slate-800 text-slate-300', icon: null };
    }
  };

  const affordabilitySummary = choices.reduce((summary, choice) => {
    const { mana: manaCost, stamina: staminaCost } = getChoiceCost(choice);
    const missingMana = Math.max(0, manaCost - playerResources.mp);
    const missingStamina = Math.max(0, staminaCost - playerResources.st);
    return {
      missingMana: Math.max(summary.missingMana, missingMana),
      missingStamina: Math.max(summary.missingStamina, missingStamina),
    };
  }, { missingMana: 0, missingStamina: 0 });

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
        {activeNPC && (
            <div className="flex items-center gap-4 p-3 bg-slate-900/80 border border-slate-700/50 rounded-2xl animate-in slide-in-from-left duration-500">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 shrink-0 bg-slate-800">
                    {activeNPC.portrait ? (
                        <img src={activeNPC.portrait} alt={activeNPC.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={24}/></div>
                    )}
                </div>
                <div>
                    <h3 className="text-white font-bold leading-none">{activeNPC.name}</h3>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-1 font-mono">{activeNPC.role}</p>
                </div>
            </div>
        )}
        {log.map((msg, i) => {
          if (msg.type === 'worldevent') {
            return (
              <div key={`log-entry-${i}`} className="flex justify-center animate-in zoom-in duration-500">
                <div className="w-full max-w-[90%] p-4 bg-amber-950/20 border-2 border-amber-500/30 rounded-3xl flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <Globe size={24} className="text-amber-400 animate-pulse" />
                  <div className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em]">World Encounter</div>
                  <div className="text-sm font-bold text-slate-200 text-center">{msg.text}</div>
                </div>
              </div>
            )
          }
          if (msg.type === 'skillcheck' && msg.details) {
            const { skill, total, dc, success } = msg.details;
            return (
                <div key={`log-entry-${i}`} className="flex justify-center animate-slide-in-from-bottom">
                    <div className="w-full max-w-[85%] p-3 rounded-2xl text-sm border bg-slate-900 border-amber-500/30 text-amber-300 shadow-md flex items-center gap-3">
                        <Dices size={20} className="text-amber-400 shrink-0"/>
                        <div className="flex-1">
                            <span className="font-bold">{skill}: </span>
                            <span className="font-mono text-white">{total}</span>
                            <span className="text-amber-400/70"> (DC {dc}) - </span>
                            <span className={`font-bold ${success ? 'text-emerald-400' : 'text-red-400'}`}>
                                {success ? 'Success!' : 'Failure!'}
                            </span>
                        </div>
                    </div>
                </div>
            )
          }
          if (msg.type === 'levelup') {
              return (
                <div key={`log-entry-${i}`} className="flex justify-center animate-slide-in-from-bottom">
                    <div className="w-full max-w-[90%] p-4 rounded-2xl border-2 border-amber-500 bg-amber-950/20 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex flex-col items-center gap-2">
                        <Trophy size={32} className="text-amber-500 animate-bounce" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">Level Gained!</h4>
                        <p className="text-xs text-center font-bold">{msg.text}</p>
                    </div>
                </div>
              )
          }
          if (msg.type === 'milestone') {
              return (
                <div key={`log-entry-${i}`} className="flex justify-center animate-slide-in-from-bottom">
                    <div className="w-full max-w-[85%] p-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 text-indigo-300 shadow-sm flex items-center gap-3 italic">
                        <ScrollText size={20} className="text-indigo-400 shrink-0" />
                        <span className="text-xs font-bold">{msg.text}</span>
                    </div>
                </div>
              )
          }
          return (
            <div key={`log-entry-${i}`} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'} animate-slide-in-from-bottom`}>
              <div className={`max-w-[85%] ${msg.type !== 'player' ? 'w-full' : ''}`}>
                {msg.type === 'narration' && msg.image && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-slate-700 shadow-md">
                    <img src={msg.image} alt="Scene illustration" className="w-full h-auto object-cover" />
                  </div>
                )}
                <div className={`group relative p-3 rounded-2xl text-sm leading-relaxed shadow-md flex gap-2 items-start ${msg.type === 'player' ? 'bg-indigo-600 text-white rounded-tr-none' : msg.type === 'error' ? 'bg-red-900 border border-red-700 rounded-tl-none text-red-200' : 'bg-slate-800 border border-slate-700 rounded-tl-none text-slate-300'}`}>
                  <span className="flex-1">{msg.text}</span>
                  {msg.type === 'narration' && <AudioPlayer text={msg.text} />}
                </div>
              </div>
            </div>
          )
        })}
        {processing && (
          <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 mx-2 animate-in fade-in">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <span className="text-xs text-slate-400 italic">The Game Master is weaving your fate...</span>
          </div>
        )}
      </div>
      <div className="bg-slate-900 border-t border-slate-800 p-3 pb-safe shrink-0">
        {actionHints.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
            {actionHints.map((hint, index) => (
              <div key={`action-hint-${index}`} className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/40 px-2 py-1">
                {hint.icon}
                <span>{hint.text}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {choices.map(c => {
            const config = getIntentConfig(c.intent);
            const { mana: manaCost, stamina: staminaCost } = getChoiceCost(c);
            const missingMana = Math.max(0, manaCost - playerResources.mp);
            const missingStamina = Math.max(0, staminaCost - playerResources.st);
            const canAfford = missingMana === 0 && missingStamina === 0;
            const affordanceNote = !canAfford
              ? `Need ${missingMana ? `${missingMana} MP` : ''}${missingMana && missingStamina ? ' and ' : ''}${missingStamina ? `${missingStamina} ST` : ''}`
              : undefined;
            return (
              <button 
                key={c.id} 
                disabled={processing || !canAfford} 
                onClick={() => onAction(c.label, c)} 
                title={affordanceNote}
                className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 border rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${config.style}`}
              >
                <div className="flex items-center gap-2">
                  {config.icon}
                  {c.label}
                </div>
                {(manaCost > 0 || staminaCost > 0) && (
                    <div className="absolute -top-2 -right-1 flex gap-1">
                        {manaCost > 0 && (
                          <div className={`text-[8px] text-white px-1 rounded flex items-center gap-0.5 border shadow-lg ${missingMana ? 'bg-red-600 border-red-400' : 'bg-blue-600 border-blue-400'}`}>
                            <Zap size={6}/>{manaCost}
                          </div>
                        )}
                        {staminaCost > 0 && (
                          <div className={`text-[8px] text-white px-1 rounded flex items-center gap-0.5 border shadow-lg ${missingStamina ? 'bg-red-600 border-red-400' : 'bg-emerald-600 border-emerald-400'}`}>
                            <Wind size={6}/>{staminaCost}
                          </div>
                        )}
                    </div>
                )}
              </button>
            );
          })}
        </div>
        {(affordabilitySummary.missingMana > 0 || affordabilitySummary.missingStamina > 0) && (
          <div className="mb-2 text-[10px] text-slate-400">
            Unavailable actions: need up to
            {affordabilitySummary.missingMana > 0 && (
              <span className="ml-1 text-blue-300 font-semibold">{affordabilitySummary.missingMana} MP</span>
            )}
            {affordabilitySummary.missingMana > 0 && affordabilitySummary.missingStamina > 0 && <span className="mx-1">/</span>}
            {affordabilitySummary.missingStamina > 0 && (
              <span className="text-emerald-300 font-semibold">{affordabilitySummary.missingStamina} ST</span>
            )}
            .
          </div>
        )}
        <div className="flex gap-2">
          <input className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" placeholder="Action..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAction(input)} disabled={processing}/>
          <button onClick={() => onAction(input)} disabled={processing||!input.trim()} className="p-3 bg-indigo-600 rounded-xl text-white disabled:opacity-50 hover:bg-indigo-500"><Send size={18}/></button>
        </div>
      </div>
    </div>
  );
};
