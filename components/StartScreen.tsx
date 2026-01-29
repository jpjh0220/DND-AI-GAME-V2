
import React, { useState, useEffect } from 'react';
import { X, Play, Save, Rocket, User } from 'lucide-react';
import { getAllSaveSlotSummaries, deleteSaveLocal, SaveSlotSummary } from '../persistence/local';

interface StartScreenProps {
  onLoadGame: (slotId: string) => void;
  onNewGameStart: (summary: SaveSlotSummary) => void;
  onQuickStart: () => void; // New prop for quick start
}

export const StartScreen: React.FC<StartScreenProps> = ({ onLoadGame, onNewGameStart, onQuickStart }) => {
  const [slotSummaries, setSlotSummaries] = useState<SaveSlotSummary[]>([]);
  const NUM_SLOTS = 5;

  useEffect(() => {
    const fetchSummaries = async () => {
      const summaries = await getAllSaveSlotSummaries(NUM_SLOTS);
      setSlotSummaries(summaries);
    };
    fetchSummaries();
  }, []);

  const handleClearSlot = (slotId: string) => {
    if (window.confirm(`Are you sure you want to delete save slot ${slotId}? This cannot be undone.`)) {
      deleteSaveLocal(slotId);
      // Refresh summaries
      getAllSaveSlotSummaries(NUM_SLOTS).then(setSlotSummaries);
    }
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans overflow-y-auto">
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-8 tracking-tighter shrink-0">CHRONICLES GATEWAY</h1>
      
      <button 
        onClick={onQuickStart} 
        className="w-full max-w-xs py-4 mb-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2 shrink-0"
      >
        <Rocket size={24}/> Quick Start
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        {slotSummaries.map((summary, index) => (
          <div key={`slot-${index + 1}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between h-48 transition-all hover:border-slate-700">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-indigo-400">Slot {index + 1}</h3>
                {summary.exists && summary.portrait && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700">
                        <img src={summary.portrait} alt="Portrait" className="w-full h-full object-cover" />
                    </div>
                )}
                {summary.exists && !summary.portrait && (
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-500">
                        <User size={20} />
                    </div>
                )}
            </div>
            {summary.exists ? (
              <>
                <div className="text-left">
                    <p className="text-sm text-white font-bold truncate">{summary.playerName}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Lv.{summary.playerLevel} • Day {summary.worldDay}</p>
                </div>
                <div className="mt-auto flex justify-between gap-2">
                  <button onClick={() => onLoadGame(`slot${index + 1}`)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1">
                    <Play size={16}/> Load
                  </button>
                  <button onClick={() => handleClearSlot(`slot${index + 1}`)} className="py-2 px-3 bg-red-900/40 border border-red-700/50 hover:bg-red-800/60 text-red-400 font-bold rounded-xl text-sm transition-colors">
                    <X size={16}/>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 italic flex-1 flex items-center justify-center">Unclaimed Chronicle</p>
                <button onClick={() => onNewGameStart(summary)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1">
                  <Save size={16}/> New Adventure
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
