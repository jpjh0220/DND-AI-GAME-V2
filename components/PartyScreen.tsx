import React from 'react';
import { X, Heart, Shield, Swords, Star, UserMinus, UserPlus, User } from 'lucide-react';
import { Player, Companion } from '../types';
import { Bar } from './ui';

interface ScreenProps {
  player: Player;
  onClose: () => void;
  onDismiss?: (companionId: string) => void;
  onRecall?: (companionId: string) => void;
}

const getLoyaltyColor = (loyalty: number) => {
  if (loyalty >= 80) return 'text-emerald-400';
  if (loyalty >= 50) return 'text-amber-400';
  if (loyalty >= 25) return 'text-orange-400';
  return 'text-red-400';
};

const getLoyaltyLabel = (loyalty: number) => {
  if (loyalty >= 90) return 'Devoted';
  if (loyalty >= 70) return 'Loyal';
  if (loyalty >= 50) return 'Friendly';
  if (loyalty >= 30) return 'Neutral';
  if (loyalty >= 10) return 'Wary';
  return 'Hostile';
};

export const PartyScreen: React.FC<ScreenProps> = ({ player, onClose, onDismiss, onRecall }) => {
  const companions = player.companions || [];
  const activeCompanions = companions.filter(c => c.status === 'active');
  const otherCompanions = companions.filter(c => c.status !== 'active');

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div>
          <h2 className="font-bold text-white flex items-center gap-2"><User size={18} className="text-indigo-400" /> Party</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">{activeCompanions.length}/4 active companions</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Player Card */}
        <div className="p-3 rounded-xl border-2 border-indigo-500/40 bg-indigo-950/20 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/50 bg-slate-800 shrink-0">
              {player.portrait ? <img src={player.portrait} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-black">{player.level}</div>}
            </div>
            <div>
              <div className="text-white font-bold text-sm">{player.name} <span className="text-indigo-400 text-[9px] uppercase">(Leader)</span></div>
              <div className="text-[10px] text-slate-400">{player.race} {player.class} — Level {player.level}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Bar color="bg-red-500" cur={player.hpCurrent} max={player.hpMax} label="HP" icon={<Heart size={8}/>} warningThreshold={0.35} criticalThreshold={0.18} />
          </div>
          <div className="flex gap-3 mt-2 text-[9px] text-slate-500">
            <span className="flex items-center gap-1"><Shield size={10}/> AC {player.ac}</span>
            <span className="flex items-center gap-1"><Swords size={10}/> {player.equipment.mainHand?.name || 'Unarmed'}</span>
          </div>
        </div>

        {/* Active Companions */}
        {activeCompanions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Active Companions</h3>
            <div className="space-y-3">
              {activeCompanions.map(comp => (
                <CompanionCard key={comp.id} companion={comp} onDismiss={onDismiss} />
              ))}
            </div>
          </div>
        )}

        {/* Dismissed/Unconscious */}
        {otherCompanions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Other Companions</h3>
            <div className="space-y-3">
              {otherCompanions.map(comp => (
                <CompanionCard key={comp.id} companion={comp} onRecall={onRecall} />
              ))}
            </div>
          </div>
        )}

        {companions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <User size={48} className="text-slate-700 mb-4" />
            <p className="text-slate-500 text-sm font-medium">No companions yet</p>
            <p className="text-slate-600 text-xs mt-1 max-w-[250px]">
              Talk to NPCs, complete quests, or rescue allies to recruit companions who will fight alongside you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CompanionCard: React.FC<{
  companion: Companion;
  onDismiss?: (id: string) => void;
  onRecall?: (id: string) => void;
}> = ({ companion, onDismiss, onRecall }) => (
  <div className={`p-3 rounded-xl border ${
    companion.status === 'active' ? 'border-slate-700/50 bg-slate-900/50' :
    companion.status === 'unconscious' ? 'border-red-500/30 bg-red-950/20' :
    'border-slate-800/30 bg-slate-900/20 opacity-60'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
          {companion.portrait ? <img src={companion.portrait} className="w-full h-full object-cover rounded-full" /> : <User size={18} className="text-slate-500" />}
        </div>
        <div>
          <div className="text-white text-xs font-bold">{companion.name}</div>
          <div className="text-[9px] text-slate-500">{companion.race} {companion.class} — Lv.{companion.level}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`text-[9px] font-bold ${getLoyaltyColor(companion.loyalty)}`}>
          <Star size={10} className="inline mr-0.5" />{getLoyaltyLabel(companion.loyalty)}
        </div>
        {companion.status === 'active' && onDismiss && (
          <button onClick={() => onDismiss(companion.id)} className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors" title="Dismiss">
            <UserMinus size={14} />
          </button>
        )}
        {companion.status === 'dismissed' && onRecall && (
          <button onClick={() => onRecall(companion.id)} className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-colors" title="Recall">
            <UserPlus size={14} />
          </button>
        )}
      </div>
    </div>
    <Bar color={companion.status === 'unconscious' ? 'bg-red-800' : 'bg-red-500'} cur={companion.hpCurrent} max={companion.hpMax} label="HP" icon={<Heart size={8}/>} warningThreshold={0.35} criticalThreshold={0.18} />
    <div className="flex gap-3 mt-2 text-[9px] text-slate-500">
      <span><Shield size={10} className="inline mr-0.5" /> AC {companion.ac}</span>
      <span><Swords size={10} className="inline mr-0.5" /> {companion.damageRoll}</span>
      {companion.status === 'unconscious' && <span className="text-red-400 font-bold uppercase">Unconscious</span>}
      {companion.status === 'dismissed' && <span className="text-slate-600 uppercase">Dismissed</span>}
    </div>
    {companion.abilities.length > 0 && (
      <div className="flex gap-1 mt-2 flex-wrap">
        {companion.abilities.map((ability, i) => (
          <span key={i} className="px-1.5 py-0.5 rounded text-[8px] bg-slate-800 text-slate-400 border border-slate-700">{ability}</span>
        ))}
      </div>
    )}
    <p className="text-[10px] text-slate-600 mt-1 italic">{companion.personality}</p>
  </div>
);
