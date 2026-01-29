import React from 'react';

export const NavBtn: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: ()=>void}> = ({ icon, label, active, onClick }) => (
    <button onClick={() => { console.log(`[DEBUG] NavBtn clicked: ${label}`); onClick(); }} className={`flex flex-col items-center justify-center gap-1.5 p-1 w-full text-center transition-colors rounded-lg ${active ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
    </button>
);
