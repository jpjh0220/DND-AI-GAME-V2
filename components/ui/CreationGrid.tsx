import React from 'react';

export const CreationGrid = ({ label, options, selected, onSelect }: { label: string; options: any; selected: string; onSelect: (v: string) => void }) => (
    <section>
        <label className="text-xs uppercase font-bold text-slate-500 block mb-2">{label}</label>
        <div className="grid grid-cols-2 gap-2">
            {Object.keys(options).map(key => 
                <button 
                    key={key} 
                    onClick={() => onSelect(key)} 
                    className={`p-3 rounded-xl border text-xs font-bold text-left ${selected === key ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    {key}
                </button>
            )}
        </div>
    </section>
);
