import React from 'react';
import { X } from 'lucide-react';
import { World } from '../types';

interface WorldScreenProps { world: World; onClose: () => void; }

export const MapScreen: React.FC<WorldScreenProps> = ({ world, onClose }) => (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <h2 className="font-bold text-white">World Map</h2>
            <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-600 bg-slate-900">
            <p>Map Region: Oakhaven</p>
        </div>
    </div>
);
