import React from 'react';
import { Flame } from 'lucide-react';

export const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-24 h-24 bg-indigo-600/20 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
            <Flame size={48} className="text-indigo-500 animate-pulse" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-4 tracking-tighter">
            MYTHIC REALMS
        </h1>
        <button 
            onClick={onStart} 
            className="w-full max-w-xs py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-2">
            Enter World
        </button>
    </div>
);
