import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-30">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button onClick={() => { console.log('[DEBUG] Closing screen: Settings'); onClose(); }}><X size={20}/></button>
        </div>
        <div className="p-4 space-y-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16}/> AI Configuration
                </h3>
                <p className="text-xs text-slate-400">Credentials managed by environment.</p>
            </div>
        </div>
    </div>
);
