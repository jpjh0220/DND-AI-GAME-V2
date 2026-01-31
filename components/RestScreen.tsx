import React from 'react';
import { X, Moon, Sunrise, Coffee, Bed } from 'lucide-react';
import { Player } from '../types';

interface RestScreenProps {
  player: Player;
  onRest: (type: 'short' | 'long') => void;
  onClose: () => void;
}

export const RestScreen: React.FC<RestScreenProps> = ({ player, onRest, onClose }) => {
  const hasRation = player.inventory.some(i => i.id === 'ration');
  const hasWater = player.inventory.some(i => i.id === 'waterskin');
  const canLongRest = hasRation && hasWater;

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h2 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Moon size={18} className="text-indigo-400" /> Campfire & Rest
        </h2>
        <button onClick={onClose}><X size={20}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center">
            <p className="text-slate-400 text-sm italic">"The path ahead is treacherous. A moment of respite may be the difference between life and death."</p>
        </div>

        <div className="grid gap-4">
          {/* Short Rest Option */}
          <button 
            onClick={() => onRest('short')}
            className="group relative bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left hover:border-indigo-500 transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-900/20 rounded-xl flex items-center justify-center border border-amber-700/30 text-amber-500">
                    <Coffee size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">Short Rest</h3>
                    <p className="text-xs text-slate-500 mb-3">1 Hour • Tend to wounds and catch your breath.</p>
                    <div className="flex gap-3 text-[10px] font-bold uppercase tracking-tighter">
                        <span className="text-emerald-400">+1d10 HP</span>
                        <span className="text-cyan-400">+50% Stamina</span>
                    </div>
                </div>
                <Sunrise size={16} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
            </div>
          </button>

          {/* Long Rest Option */}
          <div className="relative">
            <button 
              disabled={!canLongRest}
              onClick={() => onRest('long')}
              className={`w-full group relative bg-slate-900 border p-5 rounded-2xl text-left transition-all ${canLongRest ? 'border-slate-800 hover:border-indigo-500 active:scale-[0.98]' : 'border-red-900/30 opacity-60 grayscale cursor-not-allowed'}`}
            >
              <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-900/20 rounded-xl flex items-center justify-center border border-indigo-700/30 text-indigo-400">
                      <Bed size={24} />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">Long Rest</h3>
                      <p className="text-xs text-slate-500 mb-3">8 Hours • Deep slumber to fully restore your essence.</p>
                      <div className="flex gap-3 text-[10px] font-bold uppercase tracking-tighter">
                          <span className="text-emerald-400">100% HP</span>
                          <span className="text-blue-400">100% Mana</span>
                          <span className="text-cyan-400">100% ST</span>
                          <span className="text-rose-400">-1 Exhaustion</span>
                      </div>
                  </div>
                  <Moon size={16} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
              </div>
            </button>
            {!canLongRest && (
                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase bg-red-950/30 p-2 rounded-lg border border-red-900/20">
                    <X size={12} /> Requires: {[!hasRation && "1x Ration", !hasWater && "1x Waterskin"].filter(Boolean).join(" & ")}
                </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Survival Status</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Rations</span>
                    <span className={hasRation ? "text-emerald-400" : "text-red-400"}>{player.inventory.filter(i => i.id === 'ration').length} Available</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Water</span>
                    <span className={hasWater ? "text-emerald-400" : "text-red-400"}>{player.inventory.filter(i => i.id === 'waterskin').length} Available</span>
                </div>
                <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Exhaustion</span>
                    <span className={player.exhaustion > 0 ? "text-red-400" : "text-slate-400"}>Level {player.exhaustion}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};