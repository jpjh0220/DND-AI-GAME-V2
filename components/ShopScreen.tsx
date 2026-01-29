

import React from 'react';
import { X, Coins } from 'lucide-react';
import { Player, Item } from '../types';
// FIX: Corrected import path to point to the index file within the directory.
import { formatCurrency } from '../systems/index';

interface ShopScreenProps {
  player: Player;
  shop: { name: string; inventory: Item[] };
  onClose: () => void;
  onBuy: (item: Item) => void;
  onSell: (item: Item, index: number) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ player, shop, onClose, onBuy, onSell }) => {
  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h2 className="font-bold text-white">{shop.name}</h2>
        <div className="flex items-center gap-2">
            <span className="text-amber-400 font-mono text-xs flex items-center gap-1"><Coins size={12}/> {formatCurrency(player.currency)}</span>
            <button onClick={onClose}><X size={20}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
        <div className="col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase">For Sale</h3>
            {shop.inventory.map((item, i) => (
                <div key={`${item.id || item.name}-${i}`} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-sm text-slate-200">{item.name}</div>
                        <div className="text-xs text-amber-500 font-mono">{formatCurrency(item.value || 0)}</div>
                    </div>
                    <button onClick={() => onBuy(item)} disabled={player.currency < (item.value || 0)} className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg disabled:bg-slate-700 disabled:text-slate-500">Buy</button>
                </div>
            ))}
             {shop.inventory.length === 0 && <div className="text-center text-sm text-slate-600 p-4 rounded-xl border border-dashed border-slate-800 mt-2">Sold out!</div>}
        </div>
        <div className="col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase">Your Items to Sell</h3>
            {player.inventory.map((item, i) => (
                 <div key={`${item.id || item.name}-${i}`} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-sm text-slate-200 truncate">{item.name}</div>
                        <div className="text-xs text-amber-500 font-mono">{formatCurrency(Math.floor((item.value || 0) / 2))}</div>
                    </div>
                    {(item.value || 0) > 0 && 
                        <button onClick={() => onSell(item, i)} className="px-3 py-1 bg-slate-700 text-white font-bold text-xs rounded-lg">Sell</button>
                    }
                </div>
            ))}
            {player.inventory.length === 0 && <div className="text-center text-sm text-slate-600 p-4 rounded-xl border border-dashed border-slate-800 mt-2">Your bag is empty.</div>}
        </div>
      </div>
    </div>
  );
};