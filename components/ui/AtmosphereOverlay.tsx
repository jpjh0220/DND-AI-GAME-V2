
import React, { useMemo } from 'react';
import { World } from '../../types';

export const AtmosphereOverlay: React.FC<{ world: World }> = ({ world }) => {
  const { hour, weather, facts = [] } = world;

  // Determine Lighting based on hour
  const getLightingClass = () => {
    if (hour >= 21 || hour < 5) return 'bg-indigo-950/40'; // Night
    if (hour >= 5 && hour < 8) return 'bg-amber-600/10'; // Dawn
    if (hour >= 18 && hour < 21) return 'bg-purple-900/20'; // Dusk
    return 'bg-transparent'; // Day
  };

  const isRainy = weather.toLowerCase().includes('rain') || weather.toLowerCase().includes('storm');
  const isSnowy = weather.toLowerCase().includes('snow');
  const isFoggy = weather.toLowerCase().includes('fog') || weather.toLowerCase().includes('mist');

  // Biome Detection based on World Facts
  const biome = useMemo(() => {
    const factString = facts.join(' ').toLowerCase();
    if (factString.includes('forest') || factString.includes('woods') || factString.includes('grove')) return 'forest';
    if (factString.includes('dungeon') || factString.includes('cave') || factString.includes('crypt') || factString.includes('keep') || factString.includes('fortress')) return 'dungeon';
    if (factString.includes('arcane') || factString.includes('tower') || factString.includes('magic') || factString.includes('academy')) return 'arcane';
    if (factString.includes('desert') || factString.includes('wasteland') || factString.includes('sand')) return 'desert';
    return 'neutral';
  }, [facts]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Lighting Tint */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${getLightingClass()}`} />

      {/* Fog Effect */}
      {isFoggy && (
        <div className="absolute inset-0 bg-slate-200/20 backdrop-blur-[2px] animate-pulse transition-opacity duration-1000" />
      )}

      {/* Rain Effect */}
      {isRainy && (
        <div className="absolute inset-0 opacity-40">
           <div className="rain-container">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="rain-drop" 
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s` 
                  }} 
                />
              ))}
           </div>
        </div>
      )}

      {/* Snow Effect */}
      {isSnowy && (
        <div className="absolute inset-0 opacity-60">
           <div className="snow-container">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className="snow-flake" 
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s` 
                  }} 
                />
              ))}
           </div>
        </div>
      )}

      {/* Biome Specific Particles */}
      <div className="absolute inset-0">
          {biome === 'forest' && [...Array(12)].map((_, i) => (
              <div 
                  key={`leaf-${i}`} 
                  className={`absolute w-2 h-2 rounded-full blur-[1px] animate-leaf-fall ${Math.random() > 0.5 ? 'bg-emerald-700/40' : 'bg-amber-700/40'}`}
                  style={{ 
                      left: `${Math.random() * 100}%`, 
                      top: '-5%',
                      animationDelay: `${Math.random() * 10}s`,
                      animationDuration: `${8 + Math.random() * 7}s` 
                  }}
              />
          ))}

          {biome === 'dungeon' && [...Array(15)].map((_, i) => (
              <div 
                  key={`dust-${i}`} 
                  className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px] animate-dust-drift"
                  style={{ 
                      left: `${Math.random() * 100}%`, 
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${10 + Math.random() * 10}s` 
                  }}
              />
          ))}

          {biome === 'arcane' && [...Array(8)].map((_, i) => (
              <div 
                  key={`spark-${i}`} 
                  className="absolute w-1 h-3 bg-indigo-400/30 rounded-full blur-sm animate-wisp-rise"
                  style={{ 
                      left: `${Math.random() * 100}%`, 
                      bottom: '-5%',
                      animationDelay: `${Math.random() * 8}s`,
                      animationDuration: `${5 + Math.random() * 5}s` 
                  }}
              />
          ))}
      </div>

      <style>{`
        .rain-container, .snow-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .rain-drop {
          position: absolute;
          top: -10px;
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.5);
          animation: fall linear infinite;
        }
        .snow-flake {
          position: absolute;
          top: -10px;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: fall linear infinite;
        }
        @keyframes fall {
          to { transform: translateY(100vh); }
        }

        @keyframes leaf-fall {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0; }
        }

        @keyframes dust-drift {
            0% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 0.4; }
            80% { opacity: 0.4; }
            100% { transform: translate(100px, -100px); opacity: 0; }
        }

        @keyframes wisp-rise {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            20% { opacity: 0.5; }
            80% { opacity: 0.5; }
            100% { transform: translateY(-100vh) scale(2); opacity: 0; }
        }

        .animate-leaf-fall { animation: leaf-fall linear infinite; }
        .animate-dust-drift { animation: dust-drift ease-in-out infinite; }
        .animate-wisp-rise { animation: wisp-rise ease-in infinite; }
      `}</style>
    </div>
  );
};
