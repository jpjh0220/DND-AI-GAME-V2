import React from 'react';
import { X, Heart, Shield, Swords, Users, Star, UserMinus } from 'lucide-react';
import { Player, Companion } from '../types';

interface ScreenProps {
    player: Player;
    onClose: () => void;
    onDismiss?: (companionId: string) => void;
}

export const PartyScreen: React.FC<ScreenProps> = ({ player, onClose, onDismiss }) => {
    const companions = player.companions?.filter(c => c.isActive) || [];
    const inactiveCompanions = player.companions?.filter(c => !c.isActive) || [];

    const getLoyaltyColor = (loyalty: number) => {
        if (loyalty >= 80) return 'text-emerald-400';
        if (loyalty >= 50) return 'text-blue-400';
        if (loyalty >= 30) return 'text-amber-400';
        return 'text-red-400';
    };

    const getLoyaltyLabel = (loyalty: number) => {
        if (loyalty >= 80) return 'Devoted';
        if (loyalty >= 50) return 'Loyal';
        if (loyalty >= 30) return 'Neutral';
        return 'Wavering';
    };

    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-20 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-2">
                    <Users size={20} className="text-indigo-400" />
                    <h2 className="font-bold text-white">Party</h2>
                    <span className="text-xs text-slate-500">({companions.length}/4 active)</span>
                </div>
                <button onClick={onClose}><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {companions.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                        <Users size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No companions yet</p>
                        <p className="text-xs mt-1">Recruit NPCs by building trust and asking them to join you.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Party Members</h3>
                        {companions.map(companion => (
                            <CompanionCard
                                key={companion.id}
                                companion={companion}
                                onDismiss={onDismiss}
                            />
                        ))}
                    </>
                )}

                {inactiveCompanions.length > 0 && (
                    <>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-6">Available Companions</h3>
                        <p className="text-xs text-slate-600">These allies are not currently traveling with you.</p>
                        {inactiveCompanions.map(companion => (
                            <div key={companion.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 flex items-center gap-3 opacity-60">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                    {companion.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-400 text-sm">{companion.name}</div>
                                    <div className="text-xs text-slate-600">Lv.{companion.level} {companion.class || 'Ally'}</div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

interface CompanionCardProps {
    companion: Companion;
    onDismiss?: (id: string) => void;
}

const CompanionCard: React.FC<CompanionCardProps> = ({ companion, onDismiss }) => {
    const hpPercent = (companion.hp / companion.hpMax) * 100;

    const getLoyaltyColor = (loyalty: number) => {
        if (loyalty >= 80) return 'text-emerald-400';
        if (loyalty >= 50) return 'text-blue-400';
        if (loyalty >= 30) return 'text-amber-400';
        return 'text-red-400';
    };

    const getLoyaltyLabel = (loyalty: number) => {
        if (loyalty >= 80) return 'Devoted';
        if (loyalty >= 50) return 'Loyal';
        if (loyalty >= 30) return 'Neutral';
        return 'Wavering';
    };

    return (
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-start gap-3">
                {/* Portrait */}
                <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {companion.portrait ? (
                        <img src={companion.portrait} alt={companion.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-bold text-slate-500">{companion.name.charAt(0)}</span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white truncate">{companion.name}</h4>
                        <span className="text-xs text-slate-500">Lv.{companion.level}</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{companion.class || 'Ally'}</div>

                    {/* HP Bar */}
                    <div className="mb-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Heart size={10} className="text-red-400" />
                            <span className="text-[10px] text-slate-500">{companion.hp}/{companion.hpMax} HP</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${
                                    hpPercent < 25 ? 'bg-red-500 animate-pulse' :
                                    hpPercent < 50 ? 'bg-amber-500' : 'bg-red-600'
                                }`}
                                style={{ width: `${hpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-slate-400">
                            <Shield size={10} /> {companion.ac}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                            <Swords size={10} /> +{companion.attackBonus}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                            {companion.damageRoll}
                        </span>
                        <span className={`flex items-center gap-1 ${getLoyaltyColor(companion.loyalty)}`}>
                            <Star size={10} /> {getLoyaltyLabel(companion.loyalty)}
                        </span>
                    </div>
                </div>

                {/* Dismiss button */}
                {onDismiss && (
                    <button
                        onClick={() => onDismiss(companion.id)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Dismiss companion"
                    >
                        <UserMinus size={16} />
                    </button>
                )}
            </div>

            {/* Abilities */}
            {companion.abilities && companion.abilities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Abilities</div>
                    <div className="flex flex-wrap gap-1">
                        {companion.abilities.map((ability, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">
                                {ability}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
