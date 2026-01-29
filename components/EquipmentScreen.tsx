import React from 'react';
import { X } from 'lucide-react';
import { Player, Item } from '../types';

const EQUIPMENT_SLOTS = ['head', 'chest', 'legs', 'hands', 'feet', 'amulet', 'ring1', 'ring2', 'mainHand', 'offHand', 'belt', 'cloak'];

export const EquipmentScreen: React.FC<{ player: Player; onClose: () => void; onEquip: (item: Item) => void; onUnequip: (slot: string) => void;}> = ({ player, onClose, onEquip, onUnequip }) => {
    const equippableItems = player.inventory.filter(i => i.slot);
    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="font-bold text-white uppercase tracking-tighter">Hero's Armory</h2>
                <button onClick={onClose}><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                <div className="col-span-1 space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Equipped</h3>
                    {EQUIPMENT_SLOTS.map(slot => {
                        const item = player.equipment[slot];
                        const isBlocked = slot === 'offHand' && player.equipment.mainHand?.twoHanded;
                        return (
                            <div key={slot} onClick={() => item && onUnequip(slot)} className={`h-16 bg-slate-900 border rounded-xl flex items-center p-2 gap-2 transition-all ${item ? 'border-indigo-500 cursor-pointer hover:border-indigo-400' : 'border-slate-800'} ${isBlocked ? 'bg-slate-800/50 border-dashed' : ''}`}>
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-[8px] font-black uppercase shrink-0">{slot.substring(0,5)}</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-[10px] text-slate-500 capitalize truncate">{slot.replace(/([A-Z1-9])/g, ' $1')}</div>
                                    {isBlocked ? <div className="text-xs font-bold text-slate-600 italic">Blocked</div> : item ? <div className={`text-xs font-bold truncate ${item.rarity === 'legendary' ? 'text-amber-400' : item.rarity === 'rare' ? 'text-indigo-300' : 'text-slate-200'}`}>{item.name}</div> : <div className="text-xs font-bold text-slate-700">Empty</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="col-span-1 space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Available Bag</h3>
                    {equippableItems.map((item, i) => (
                        <div key={`${item.id}-${i}`} onClick={() => onEquip(item)} className={`p-3 bg-slate-900 rounded-xl border transition-all cursor-pointer hover:border-slate-500 ${item.rarity === 'legendary' ? 'border-amber-900/50' : item.rarity === 'rare' ? 'border-indigo-900/50' : 'border-slate-800'}`}>
                            <div className={`font-bold text-xs ${item.rarity === 'legendary' ? 'text-amber-400' : item.rarity === 'rare' ? 'text-indigo-300' : 'text-slate-200'}`}>{item.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-mono mt-1">{item.slot?.replace(/([A-Z1-9])/g, ' $1')}</div>
                            {item.statsBonus && (
                                <div className="flex gap-1 mt-1">
                                    {Object.entries(item.statsBonus).map(([s, b]) => (
                                        <span key={s} className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">+{b} {s.toUpperCase()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {equippableItems.length === 0 && <div className="text-center text-[10px] font-bold text-slate-600 p-8 rounded-2xl border-2 border-dashed border-slate-900 mt-2">Your pack holds no gear.</div>}
                </div>
            </div>
        </div>
    );
};