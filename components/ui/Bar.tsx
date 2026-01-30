import React from 'react';

interface BarProps {
    label: string;
    cur: number;
    max: number;
    color: string;
    icon: React.ReactNode;
    warningThreshold?: number;
    criticalThreshold?: number;
}

export const Bar: React.FC<BarProps> = ({
    label,
    cur,
    max,
    color,
    icon,
    warningThreshold,
    criticalThreshold,
}) => {
    const ratio = max > 0 ? cur / max : 0;
    const isCritical = criticalThreshold !== undefined && ratio <= criticalThreshold;
    const isWarning = !isCritical && warningThreshold !== undefined && ratio <= warningThreshold;
    const statusText = isCritical ? 'CRIT' : isWarning ? 'LOW' : null;

    return (
        <div className="flex-1 bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/50">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-1 uppercase items-center">
                <span className={`flex items-center gap-1 ${isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : ''}`}>
                    {icon} {label}
                    {statusText && (
                        <span className={`ml-1 px-1 rounded text-[7px] tracking-widest ${isCritical ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {statusText}
                        </span>
                    )}
                </span>
                <span>{cur}/{max}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-500`} style={{width: `${max > 0 ? Math.min(100, (cur/max)*100) : 0}%`}}></div>
            </div>
        </div>
    );
};
