import React from 'react';

export const SheetSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xs font-bold text-indigo-400 uppercase mb-3 tracking-wider">{title}</h3>
        {children}
    </div>
);
