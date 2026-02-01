

import React, { useState } from 'react';
import { X, Trophy, Hammer } from 'lucide-react';

interface MainMenuProps { 
  setView: (v:string)=>void; 
  onClose: () => void; 
  onSaveGame: () => void; 
  onNewGame: () => void; 
}

export const MainMenu: React.FC<MainMenuProps> = ({ setView, onClose, onSaveGame, onNewGame }) => {
  const [saveMessage, setSaveMessage] = useState('');
  const handleSaveClick = () => {
      onSaveGame();
      setSaveMessage('Game Saved!');
      setTimeout(() => setSaveMessage(''), 2000);
  };
  const menuItems = [
    { label: 'Inventory', view: 'inventory' },
    { label: 'Journal', view: 'journal' },
    { label: 'Map', view: 'map' },
    { label: 'Settings', view: 'settings' },
    { label: 'Spells', view: 'spells' },
    { label: 'Codex', view: 'codex' },
    { label: 'Quests', view: 'quests' },
    { label: 'Rest', view: 'rest' },
    { label: 'Party', view: 'party' },
    { label: 'Craft', view: 'crafting', icon: <Hammer size={16} className="text-amber-500 group-hover:scale-110 transition-transform" /> } // New Crafting option
  ];

  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col justify-center p-8 z-50 animate-in fade-in">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
      <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tighter">THE GREAT COMPENDIUM</h2>
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map(item => (
          <button 
            key={item.label} 
            onClick={() => setView(item.view)} 
            className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 hover:border-indigo-500/50 transition-all group"
          >
            {item.icon}
            <span className="font-bold text-xs text-slate-200 uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        {/* Achievements moved to bottom for consistency */}
        <button 
            onClick={() => setView('achievements')} 
            className="col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 hover:border-amber-500/50 transition-all group"
        >
            <Trophy size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-slate-200 uppercase tracking-widest">Achievements</span>
        </button>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-3">
        <button onClick={handleSaveClick} className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl text-sm transition-all hover:bg-indigo-500 disabled:bg-indigo-900/50" disabled={!!saveMessage}>
          {saveMessage || 'Seal Your Progress'}
        </button>
        <button onClick={onNewGame} className="w-full py-4 bg-transparent border border-red-900/50 text-red-500 font-bold rounded-xl text-sm transition-all hover:bg-red-950/20">
          Abandon Adventure
        </button>
      </div>
    </div>
  );
};
