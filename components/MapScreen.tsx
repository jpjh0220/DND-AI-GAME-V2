import React, { useMemo } from 'react';
import { X, MapPin, Lock, Eye, Skull, Shield, TreePine, Castle, Landmark, Tent, Sparkles, AlertTriangle } from 'lucide-react';
import { World, Player } from '../types';
import { LOCATIONS_DB } from '../registries/index';

interface WorldScreenProps {
  world: World;
  player: Player;
  onClose: () => void;
  onTravel?: (locationName: string) => void;
}

const getLocationIcon = (type: string) => {
  switch (type) {
    case 'town': case 'settlement': return <Tent size={14} />;
    case 'castle': return <Castle size={14} />;
    case 'dungeon': return <Skull size={14} />;
    case 'wilderness': return <TreePine size={14} />;
    case 'temple': case 'guild': return <Sparkles size={14} />;
    case 'ruin': return <AlertTriangle size={14} />;
    case 'landmark': return <Landmark size={14} />;
    default: return <MapPin size={14} />;
  }
};

const getDangerColor = (level: number) => {
  if (level <= 1) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
  if (level <= 3) return 'text-amber-400 border-amber-500/30 bg-amber-950/30';
  if (level <= 5) return 'text-orange-400 border-orange-500/30 bg-orange-950/30';
  if (level <= 7) return 'text-red-400 border-red-500/30 bg-red-950/30';
  return 'text-rose-400 border-rose-500/30 bg-rose-950/30';
};

const getDangerLabel = (level: number) => {
  if (level === 0) return 'Safe';
  if (level <= 2) return 'Low';
  if (level <= 4) return 'Moderate';
  if (level <= 6) return 'Dangerous';
  if (level <= 8) return 'Deadly';
  return 'Lethal';
};

export const MapScreen: React.FC<WorldScreenProps> = ({ world, player, onClose, onTravel }) => {
  const currentLocName = useMemo(() => {
    for (let i = world.facts.length - 1; i >= 0; i--) {
      if (world.facts[i].startsWith('Arrived at ')) return world.facts[i].substring('Arrived at '.length);
    }
    return 'Unknown';
  }, [world.facts]);

  const currentLoc = useMemo(() => LOCATIONS_DB.find(l => l.name === currentLocName), [currentLocName]);
  const discovered = player.discoveredLocations || [];

  const connectedLocs = useMemo(() => {
    if (!currentLoc?.connections) return [];
    return currentLoc.connections
      .map(id => LOCATIONS_DB.find(l => l.id === id))
      .filter(Boolean) as typeof LOCATIONS_DB;
  }, [currentLoc]);

  const allVisibleLocs = useMemo(() => {
    const visible = new Set<string>();
    if (currentLoc) visible.add(currentLoc.id);
    connectedLocs.forEach(l => visible.add(l.id));
    discovered.forEach(id => visible.add(id));
    return LOCATIONS_DB.filter(l => visible.has(l.id));
  }, [currentLoc, connectedLocs, discovered]);

  const regionGroups = useMemo(() => {
    const groups: Record<string, typeof LOCATIONS_DB> = {};
    for (const loc of allVisibleLocs) {
      const region = loc.type === 'town' || loc.type === 'settlement' ? 'Settlements' :
        loc.type === 'dungeon' || loc.type === 'ruin' ? 'Dungeons & Ruins' :
        loc.type === 'wilderness' ? 'Wilderness' :
        loc.type === 'castle' ? 'Strongholds' :
        loc.type === 'temple' || loc.type === 'guild' ? 'Sacred & Guild' :
        'Other';
      if (!groups[region]) groups[region] = [];
      groups[region].push(loc);
    }
    return groups;
  }, [allVisibleLocs]);

  const isConnected = (locId: string) => currentLoc?.connections?.includes(locId) || false;
  const isCurrent = (locId: string) => currentLoc?.id === locId;

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div>
          <h2 className="font-bold text-white flex items-center gap-2"><MapPin size={18} className="text-indigo-400" /> World Map</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">{allVisibleLocs.length} locations discovered</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors"><X size={20}/></button>
      </div>

      {currentLoc && (
        <div className="mx-4 mt-3 p-3 rounded-xl border-2 border-indigo-500/40 bg-indigo-950/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              {getLocationIcon(currentLoc.type)}
            </div>
            <div>
              <div className="text-white font-bold text-sm flex items-center gap-1.5">
                <Eye size={12} className="text-indigo-400" /> {currentLoc.name}
              </div>
              <div className="text-[9px] text-indigo-400/70 uppercase tracking-widest font-mono">{currentLoc.type} — You are here</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentLoc.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap text-[9px]">
            <span className={`px-2 py-0.5 rounded-full border ${getDangerColor(currentLoc.dangerLevel)}`}>
              <Shield size={8} className="inline mr-1" />{getDangerLabel(currentLoc.dangerLevel)}
            </span>
            {currentLoc.npcs && currentLoc.npcs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full border border-sky-500/30 text-sky-400 bg-sky-950/30">
                {currentLoc.npcs.length} NPC{currentLoc.npcs.length > 1 ? 's' : ''}
              </span>
            )}
            {currentLoc.shopIds && currentLoc.shopIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400 bg-amber-950/30">
                {currentLoc.shopIds.length} Shop{currentLoc.shopIds.length > 1 ? 's' : ''}
              </span>
            )}
            {connectedLocs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full border border-slate-600 text-slate-400 bg-slate-900">
                {connectedLocs.length} exit{connectedLocs.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {connectedLocs.length > 0 && (
        <div className="mx-4 mt-3">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-1">
            <MapPin size={10} /> Nearby — Travel Available
          </h3>
          <div className="grid gap-2">
            {connectedLocs.map(loc => (
              <button
                key={loc.id}
                onClick={() => onTravel?.(loc.name)}
                className="p-3 rounded-xl border border-slate-700/50 bg-slate-900/50 hover:bg-slate-800/70 hover:border-emerald-500/30 transition-all text-left group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getDangerColor(loc.dangerLevel)}`}>
                      {getLocationIcon(loc.type)}
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold group-hover:text-emerald-300 transition-colors">{loc.name}</div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-wider">{loc.type}</div>
                    </div>
                  </div>
                  <div className={`text-[9px] px-2 py-0.5 rounded-full border ${getDangerColor(loc.dangerLevel)}`}>
                    {getDangerLabel(loc.dangerLevel)}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2">{loc.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 mt-3 pb-4">
        {Object.entries(regionGroups).map(([region, locs]) => (
          <div key={region} className="mb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2 sticky top-0 bg-slate-950 py-1">{region}</h3>
            <div className="space-y-1.5">
              {locs.map(loc => {
                const current = isCurrent(loc.id);
                const connected = isConnected(loc.id);
                return (
                  <div key={loc.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    current ? 'bg-indigo-900/20 border border-indigo-500/30' :
                    connected ? 'bg-slate-900/50 border border-slate-700/30 hover:border-emerald-500/20' :
                    'bg-slate-900/20 border border-slate-800/30 opacity-60'
                  }`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${getDangerColor(loc.dangerLevel)}`}>
                      {getLocationIcon(loc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-300 font-medium truncate">
                        {loc.name}
                        {current && <span className="ml-1.5 text-indigo-400 text-[9px]">(here)</span>}
                      </div>
                    </div>
                    {!connected && !current && <Lock size={10} className="text-slate-700 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
