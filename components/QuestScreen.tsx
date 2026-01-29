import React from 'react';
import { X } from 'lucide-react';
import { Player, Quest } from '../types';

interface ScreenProps { player: Player; onClose: () => void; }

export const QuestScreen: React.FC<ScreenProps> = ({ player, onClose }) => (
  <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h2 className="font-bold text-white">Quests</h2>
        <button onClick={onClose}><X size={20}/></button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {player.quests.map((quest: Quest, i: number) => (
            <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-white">{quest.title}</div>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${quest.status === 'completed' ? 'bg-green-900 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                        {quest.status}
                    </span>
                </div>
                <div className="text-xs text-slate-400">{quest.description}</div>
            </div>
        ))}
        {player.quests.length === 0 && <div className="text-center text-slate-600 mt-10">No active or completed quests.</div>}
    </div>
  </div>
);
