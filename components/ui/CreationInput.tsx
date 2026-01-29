import React from 'react';

export const CreationInput = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => (
    <section>
        <label className="text-xs uppercase font-bold text-slate-500 block mb-2">{label}</label>
        <input 
            className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none focus:border-indigo-500" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder={placeholder} 
        />
    </section>
);
