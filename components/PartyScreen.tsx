import React from 'react';
import { X } from 'lucide-react';
import { Player } from '../types';

interface ScreenProps { player: Player; onClose: () => void; }

export const PartyScreen: React.FC<ScreenProps> = ({ player, onClose }) => (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <h2 className="font-bold text-white">Party</h2>
            <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-center text-slate-500">
            <p>No companions yet.</p>
        </div>
    </div>
);
