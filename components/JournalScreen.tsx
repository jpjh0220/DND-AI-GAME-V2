import React from 'react';
import { X } from 'lucide-react';
import { LogEntry, World } from '../types';

export const JournalScreen: React.FC<{log: LogEntry[], world: World, onClose: () => void}> = ({ log, world, onClose }) => (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <h2 className="font-bold text-white">Journal</h2>
            <button onClick={() => { console.log('[DEBUG] Closing screen: Journal'); onClose(); }}><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                <h3 className="text-xs font-bold text-indigo-400 uppercase mb-2">Facts</h3>
                <ul className="list-disc list-inside text-xs text-slate-300">
                    {world.facts.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">History</h3>
                {log.slice().reverse().map((l, i) => (
                    <div key={i} className="text-sm text-slate-300 border-l-2 border-slate-700 pl-3 py-1 mb-2">{l.text}</div>
                ))}
            </div>
        </div>
    </div>
);
