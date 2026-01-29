import React from 'react';

export const Bar: React.FC<{label: string, cur: number, max: number, color: string, icon: React.ReactNode}> = ({ label, cur, max, color, icon }) => (
    <div className="flex-1 bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/50">
        <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1 uppercase items-center">
            <span className="flex items-center gap-1">{icon} {label}</span>
            <span>{cur}/{max}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-500`} style={{width: `${max > 0 ? Math.min(100, (cur/max)*100) : 0}%`}}></div>
        </div>
    </div>
);
