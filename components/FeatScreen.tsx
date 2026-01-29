

import React from 'react';
import { X } from 'lucide-react';
import { Player } from '../types';
// FIX: Corrected import path to point to the index file within the directory.
import { FEATS_DB } from '../registries/index';

interface ScreenProps { player: Player; onClose: () => void; }

export const FeatScreen: React.FC<ScreenProps> = ({ player, onClose }) => (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <h2 className="font-bold text-white">Feats</h2>
            <button onClick={() => { console.log('[DEBUG] Closing screen: Feats'); onClose(); }}><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {FEATS_DB.map((feat, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="font-bold text-amber-400">{feat.name}</div>
                    <div className="text-xs text-slate-400">{feat.desc}</div>
                </div>
            ))}
        </div>
    </div>
);