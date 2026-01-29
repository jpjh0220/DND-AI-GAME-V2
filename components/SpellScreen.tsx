import React from 'react';
import { X } from 'lucide-react';
import { Player, Spell } from '../types';

interface ScreenProps { player: Player; onClose: () => void; }

interface SpellScreenProps extends ScreenProps {
    onCast: (spellName: string) => void;
}

export const SpellScreen: React.FC<SpellScreenProps> = ({ player, onClose, onCast }) => (
  <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="font-bold text-white">Spellbook</h2>
          <button onClick={onClose}><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {player.spells.map((spell: Spell, i: number) => (
              <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start">
                      <div>
                          <div className="font-bold text-indigo-300">{spell.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{spell.school} • {spell.target}</div>
                          <p className="text-xs text-slate-400 mt-2">
                              {spell.damage && `Deals ${spell.damage} damage. `}
                              {spell.heal && `Heals ${spell.heal} HP. `}
                              {spell.buff && `Grants ${spell.buff}. `}
                          </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-sm font-mono bg-slate-950 px-2 py-1 rounded text-blue-400">{spell.cost} MP</div>
                          <button 
                              onClick={() => onCast(spell.name)}
                              className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1 rounded-md font-bold hover:bg-indigo-500 transition-colors"
                          >
                              Cast
                          </button>
                      </div>
                  </div>
              </div>
          ))}
          {player.spells.length === 0 && <div className="text-center text-slate-600 mt-10">Your spellbook is empty.</div>}
      </div>
  </div>
);
