
import React from 'react';
import { X, Trophy, Medal, Star, Award } from 'lucide-react';
import { Player } from '../types';
import { ACHIEVEMENTS_DB } from '../registries/index';

interface AchievementScreenProps {
  player: Player;
  onClose: () => void;
}

export const AchievementScreen: React.FC<AchievementScreenProps> = ({ player, onClose }) => {
  const earnedIds = player.achievements || [];

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
        <h2 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2">
          <Award className="text-amber-500" size={20} /> Hall of Legends
        </h2>
        <button onClick={onClose}><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-center">
            <Trophy className="mx-auto text-amber-500 mb-2 animate-bounce" size={48} />
            <div className="text-2xl font-black text-white">{earnedIds.length} / {ACHIEVEMENTS_DB.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Achievements Unlocked</div>
        </div>

        <div className="grid gap-2">
          {ACHIEVEMENTS_DB.map(achievement => {
            const isEarned = earnedIds.includes(achievement.id);
            return (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  isEarned 
                  ? 'bg-slate-900 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'bg-slate-950/50 border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${isEarned ? 'text-white' : 'text-slate-500'}`}>{achievement.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{achievement.description}</p>
                </div>
                {isEarned && <Medal size={16} className="text-amber-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
