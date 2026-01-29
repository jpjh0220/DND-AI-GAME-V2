import React, { useState, useMemo } from 'react';
import { X, Sparkles, Sword, Shield, Package, Coffee, Anchor, Info, Scale, Coins, CheckCircle2 } from 'lucide-react';
import { Player, Item } from '../types';
import { calculateEncumbrance, calculateMaxCarry } from '../systems/calculations';

interface ScreenProps { 
  player: Player; 
  onClose: () => void; 
  onUseItem?: (index: number) => void;
  onEquip?: (item: Item) => void;
}

type InventoryTab = 'all' | 'weapons' | 'armor' | 'consumables';

export const InventoryScreen: React.FC<ScreenProps> = ({ player, onClose, onUseItem, onEquip }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('all');
  const [inspectedItem, setInspectedItem] = useState<{item: Item, index: number} | null>(null);

  const totalWeight = calculateEncumbrance(player.inventory);
  const maxWeight = calculateMaxCarry(player.stats.str);
  const weightPercentage = Math.min(100, (totalWeight / maxWeight) * 100);
  const isEncumbered = totalWeight > maxWeight;

  const isUsable = (item: Item) => {
    return !!item.effect && (item.type === 'consumable' || item.type === 'food' || item.type === 'water');
  };

  const isEquippable = (item: Item) => {
    return !!item.slot;
  };

  const filteredInventory = useMemo(() => {
    return player.inventory.map((item, originalIndex) => ({ item, originalIndex })).filter(({ item }) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'weapons') return item.type === 'weapon';
        if (activeTab === 'armor') return item.type === 'armor';
        if (activeTab === 'consumables') return item.type === 'consumable' || item.type === 'food' || item.type === 'water';
        return true;
    });
  }, [player.inventory, activeTab]);

  const TabButton = ({ tab, icon, label }: { tab: InventoryTab, icon: React.ReactNode, label: string }) => (
    <button 
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex flex-col items-center py-2 transition-all border-b-2 ${activeTab === tab ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
    >
        {icon}
        <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">{label}</span>
    </button>
  );

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
            <h2 className="font-bold text-white uppercase tracking-tighter">Vault of Possessions</h2>
            <button onClick={() => onClose()} className="p-1 hover:bg-slate-800 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 shrink-0">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Carrying Capacity</span>
              {isEncumbered && (
                <div className="flex items-center gap-1 text-[9px] font-bold text-orange-400 animate-pulse">
                  <Anchor size={10} /> ENCUMBERED
                </div>
              )}
            </div>
            <span className={`text-[10px] font-mono ${isEncumbered ? 'text-orange-400' : 'text-slate-400'}`}>
              {totalWeight.toFixed(1)} / {maxWeight.toFixed(1)} lbs
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                weightPercentage >= 100 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 
                weightPercentage >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
              }`} 
              style={{ width: `${weightPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex bg-slate-900 border-b border-slate-800 shrink-0">
            <TabButton tab="all" icon={<Package size={16}/>} label="All" />
            <TabButton tab="weapons" icon={<Sword size={16}/>} label="Arms" />
            <TabButton tab="armor" icon={<Shield size={16}/>} label="Plate" />
            <TabButton tab="consumables" icon={<Coffee size={16}/>} label="Use" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredInventory.map(({ item, originalIndex }) => (
                <div 
                  key={`${item.id}-${originalIndex}`} 
                  onClick={() => setInspectedItem({item, index: originalIndex})}
                  className={`flex justify-between items-center p-3 bg-slate-900 rounded-xl border transition-all hover:border-slate-600 cursor-pointer ${item.rarity === 'rare' ? 'border-amber-900/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : item.rarity === 'legendary' ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-800'}`}
                >
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className={`text-sm font-bold truncate ${item.rarity === 'legendary' ? 'text-amber-400 font-black' : item.rarity === 'rare' ? 'text-indigo-300' : 'text-slate-200'}`}>{item.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider">{item.type}</span>
                            {item.weight && <span className="text-[9px] text-slate-600 font-mono">| {item.weight} lbs</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {onEquip && isEquippable(item) ? (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEquip(item); }}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-md"
                            >
                                <Sword size={12} />
                                <span className="text-[10px] font-bold uppercase">Equip</span>
                            </button>
                        ) : onUseItem && isUsable(item) ? (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onUseItem(originalIndex); }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-indigo-900/20"
                            >
                                <Sparkles size={12} />
                                <span className="text-[10px] font-bold uppercase">Use</span>
                            </button>
                        ) : (
                          <div className="text-slate-600"><Info size={16}/></div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {inspectedItem && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200" onClick={() => setInspectedItem(null)}>
            <div className={`w-full max-w-sm bg-slate-900 border-2 rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300 ${inspectedItem.item.rarity === 'legendary' ? 'border-amber-500' : inspectedItem.item.rarity === 'rare' ? 'border-indigo-500/50' : 'border-slate-800'}`} onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-black uppercase tracking-tighter ${inspectedItem.item.rarity === 'legendary' ? 'text-amber-400' : inspectedItem.item.rarity === 'rare' ? 'text-indigo-300' : 'text-white'}`}>{inspectedItem.item.name}</h3>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{inspectedItem.item.rarity} {inspectedItem.item.type}</div>
                </div>
                <button onClick={() => setInspectedItem(null)} className="p-1 text-slate-500 hover:text-white"><X size={24}/></button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  {inspectedItem.item.slot && <div className="flex justify-between items-center text-sm"><span className="text-slate-500 uppercase text-[10px] font-black">Slot</span><span className="text-indigo-400 font-bold capitalize">{inspectedItem.item.slot.replace(/([A-Z1-9])/g, ' $1')}</span></div>}
                  {inspectedItem.item.damageRoll && <div className="flex justify-between items-center text-sm"><span className="text-slate-500 uppercase text-[10px] font-black">Damage</span><span className="text-red-400 font-black font-mono">{inspectedItem.item.damageRoll}</span></div>}
                  {inspectedItem.item.power && <div className="flex justify-between items-center text-sm"><span className="text-slate-500 uppercase text-[10px] font-black">Power</span><span className="text-red-400 font-black font-mono">+{inspectedItem.item.power}</span></div>}
                  {inspectedItem.item.ac && <div className="flex justify-between items-center text-sm"><span className="text-slate-500 uppercase text-[10px] font-black">Defense</span><span className="text-cyan-400 font-black font-mono">+{inspectedItem.item.ac} AC</span></div>}
                  {inspectedItem.item.weight && <div className="flex justify-between items-center text-sm"><span className="text-slate-500 flex items-center gap-1 uppercase text-[10px] font-black"><Scale size={14}/> Weight</span><span className="text-slate-300 font-mono">{inspectedItem.item.weight} lbs</span></div>}
                  {inspectedItem.item.value && <div className="flex justify-between items-center text-sm"><span className="text-slate-500 flex items-center gap-1 uppercase text-[10px] font-black"><Coins size={14}/> Value</span><span className="text-amber-500 font-mono font-bold">{inspectedItem.item.value}c</span></div>}
                </div>

                {inspectedItem.item.statsBonus && (
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(inspectedItem.item.statsBonus).map(([s, b]) => (
                            <span key={s} className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg uppercase">+{b} {s}</span>
                        ))}
                    </div>
                )}

                <div className="italic text-slate-400 text-sm leading-relaxed border-l-2 border-indigo-500 pl-4 py-2 bg-indigo-500/5 rounded-r-xl">
                  {inspectedItem.item.description || `A finely crafted ${inspectedItem.item.name} often used by adventurers in the Mythic Realms.`}
                </div>

                <div className="flex gap-2">
                    {onEquip && isEquippable(inspectedItem.item) && (
                    <button 
                        onClick={() => { onEquip(inspectedItem.item); setInspectedItem(null); }}
                        className="flex-1 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Sword size={18} /> Equip Gear
                    </button>
                    )}
                    {onUseItem && isUsable(inspectedItem.item) && (
                    <button 
                        onClick={() => { onUseItem(inspectedItem.index); setInspectedItem(null); }}
                        className="flex-1 py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-emerald-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles size={18} /> Consume Item
                    </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};