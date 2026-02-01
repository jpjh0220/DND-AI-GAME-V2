
import React, { useState, useEffect } from 'react';
import { Dices, Shield, Star, CheckCircle2, XCircle } from 'lucide-react';

interface DiceRollOverlayProps {
  skill: string;
  dc: number;
  roll: number;
  bonus: number;
  total: number;
  success: boolean;
  onComplete: () => void;
}

export const DiceRollOverlay: React.FC<DiceRollOverlayProps> = ({ 
  skill, dc, roll, bonus, total, success, onComplete 
}) => {
  const [phase, setPhase] = useState<'rolling' | 'settled' | 'result'>('rolling');
  const [displayRoll, setDisplayRoll] = useState(1);

  useEffect(() => {
    // Rolling animation
    let interval: number;
    if (phase === 'rolling') {
      interval = window.setInterval(() => {
        setDisplayRoll(Math.floor(Math.random() * 20) + 1);
      }, 80);

      // Settle after 1.5s
      const timer = setTimeout(() => {
        clearInterval(interval);
        setDisplayRoll(roll);
        setPhase('settled');
      }, 1500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [phase, roll]);

  useEffect(() => {
    if (phase === 'settled') {
      // Show final result after a short delay
      const timer = setTimeout(() => {
        setPhase('result');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'result') {
      // Auto-complete after 4s as fallback, but user can tap to dismiss immediately
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleTap = () => {
    if (phase === 'result') {
      onComplete();
    } else if (phase === 'settled') {
      setPhase('result');
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500 cursor-pointer" onClick={handleTap}>
      <div className="text-center mb-8">
        <div className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Skill Check</div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{skill}</h2>
        <div className="text-slate-500 text-sm mt-1 font-mono">Difficulty Class: {dc}</div>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glowing Aura */}
        <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${
          phase === 'result' ? (success ? 'bg-emerald-500' : 'bg-red-500') : 'bg-indigo-500'
        }`}></div>

        {/* The Die */}
        <div className={`relative z-10 w-32 h-32 flex items-center justify-center transition-all duration-500 transform ${
          phase === 'rolling' ? 'animate-bounce scale-110 rotate-12' : 'scale-100 rotate-0'
        }`}>
          <div className={`absolute inset-0 border-4 rounded-3xl rotate-45 transition-colors duration-500 ${
            phase === 'result' ? (success ? 'border-emerald-500' : 'border-red-500') : 'border-indigo-500'
          }`}></div>
          <div className="text-6xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {displayRoll}
          </div>
        </div>

        {/* Modifiers */}
        {phase !== 'rolling' && (
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900/80 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Star size={12} /> +{bonus} Bonus
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 h-16 flex flex-col items-center">
        {phase === 'result' && (
          <div className="animate-in zoom-in duration-300 text-center">
            <div className="text-5xl font-black text-white mb-1">{total}</div>
            <div className={`flex items-center gap-2 font-black uppercase tracking-widest ${success ? 'text-emerald-400' : 'text-red-400'}`}>
              {success ? <><CheckCircle2 size={18}/> Success</> : <><XCircle size={18}/> Failure</>}
            </div>
          </div>
        )}
        {phase === 'rolling' && (
          <div className="flex items-center gap-3 text-slate-400 animate-pulse">
            <Dices size={20} />
            <span className="font-bold uppercase text-xs tracking-widest">Rolling fate...</span>
          </div>
        )}
        {phase === 'result' && (
          <div className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
            Tap to continue
          </div>
        )}
      </div>
    </div>
  );
};
