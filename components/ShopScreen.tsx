

import React, { useState } from 'react';
import { X, Coins, AlertTriangle } from 'lucide-react';
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
  const [confirmSell, setConfirmSell] = useState<{item: Item; index: number} | null>(null);

  const handleSellClick = (item: Item, index: number) => {
    // Confirm for items worth 500+ copper or rare/legendary
    if ((item.value && item.value >= 500) || item.rarity === 'rare' || item.rarity === 'very rare' || item.rarity === 'legendary') {
      setConfirmSell({ item, index });
    } else {
      onSell(item, index);
    }
  };

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
                        <button onClick={() => handleSellClick(item, i)} className="px-3 py-1 bg-slate-700 text-white font-bold text-xs rounded-lg hover:bg-slate-600 transition-colors">Sell</button>
                    }
                </div>
            ))}
            {player.inventory.length === 0 && <div className="text-center text-sm text-slate-600 p-4 rounded-xl border border-dashed border-slate-800 mt-2">Your bag is empty.</div>}
        </div>
      </div>

      {confirmSell && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setConfirmSell(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <AlertTriangle size={20} />
              <h3 className="font-bold text-sm uppercase">Confirm Sale</h3>
            </div>
            <p className="text-slate-300 text-sm mb-1">
              Sell <span className="font-bold text-white">{confirmSell.item.name}</span>?
            </p>
            <p className="text-amber-500 font-mono text-xs mb-4">
              You'll receive {formatCurrency(Math.floor((confirmSell.item.value || 0) / 2))}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmSell(null)} className="flex-1 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={() => { onSell(confirmSell.item, confirmSell.index); setConfirmSell(null); }} className="flex-1 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-500 transition-colors">Sell</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};