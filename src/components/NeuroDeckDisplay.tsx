import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';

interface NeuroDeckDisplayProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
}

export const NeuroDeckDisplay: React.FC<NeuroDeckDisplayProps> = ({ neuroDeck }) => {
  const { state } = neuroDeck;

  const formatTime = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getModeName = (mode: string): string => {
    const modeMap: Record<string, string> = {
      'CONCENTRAZIONE': 'FOCUS',
      'ADHD': 'ADHD',
      'STRESS': 'RELAX',
      'INTRUSIVE_OFF': 'QUIET'
    };
    return modeMap[mode] || mode;
  };

  const getBeatFrequency = (mode: string): number => {
    const beatMap: Record<string, number> = {
      'CONCENTRAZIONE': 16.0,
      'ADHD': 13.0,
      'STRESS': 10.0,
      'INTRUSIVE_OFF': 8.0
    };
    return beatMap[mode] || 16.0;
  };

  const getState = (): string => {
    if (state.isPlaying) return 'IN RIPRODUZIONE';
    if (state.isPaused) return 'IN PAUSA';
    return 'PRONTO';
  };

  const getSafetyStatus = (): string => {
    return state.masterVolume > 0.7 ? 'ATTENZIONE' : 'OK';
  };

  const getAmbientStatus = (): string => {
    return `BRW ${state.brownVolume.toFixed(2)} PNK ${state.pinkVolume.toFixed(2)} RNG ${state.rainVolume.toFixed(2)} OCN ${state.oceanVolume.toFixed(2)}`;
  };

  const vuLevel = Math.min(100, Math.round(state.masterVolume * 100));

  return (
    <div 
      className="p-4 rounded-2xl border-2 border-graphite-edge device-texture"
      style={{ 
        background: `
          radial-gradient(ellipse at center, hsl(var(--graphite-2)), hsl(var(--graphite-0))),
          var(--gradient-panel)
        `,
        boxShadow: 'var(--shadow-inset)'
      }}
    >
      {/* Cornice LCD esterna - Più grande del vetro */}
      <div 
        className="relative p-2 rounded-lg"
        style={{ 
          background: `
            linear-gradient(145deg, 
              hsl(120 15% 12%) 0%, 
              hsl(120 20% 8%) 50%, 
              hsl(120 25% 5%) 100%
            )
          `,
          boxShadow: `
            inset 0 1px 2px rgba(0,0,0,0.8),
            inset 0 -1px 0 rgba(255,255,255,0.05)
          `
        }}
      >
        {/* Incasso per il vetro LCD */}
        <div 
          className="relative p-2 rounded-md"
          style={{ 
            background: `
              linear-gradient(145deg, 
                hsl(120 10% 6%) 0%, 
                hsl(120 15% 4%) 50%, 
                hsl(120 20% 2%) 100%
              )
            `,
            boxShadow: `
              inset 0 2px 4px rgba(0,0,0,0.9),
              inset 0 4px 8px rgba(0,0,0,0.7),
              inset 0 -1px 0 rgba(255,255,255,0.02)
            `
          }}
        >
          {/* Vetro LCD - Più piccolo e incassato */}
          <div 
            className="relative p-4 rounded-sm overflow-visible"
            style={{ 
              height: '160px',
              width: '380px',
              background: `
                repeating-linear-gradient(
                  0deg,
                  hsl(var(--lcd-bg)) 0px,
                  hsl(var(--lcd-bg)) 1px,
                  hsl(var(--lcd-bg-center)) 1px,
                  hsl(var(--lcd-bg-center)) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  hsl(var(--lcd-bg)) 0px,
                  hsl(var(--lcd-bg)) 1px,
                  hsl(var(--lcd-bg-center)) 1px,
                  hsl(var(--lcd-bg-center)) 2px
                ),
                radial-gradient(120% 100% at 50% 45%, hsl(var(--lcd-bg-center)), hsl(var(--lcd-bg)))
              `,
              border: '1px solid hsl(var(--graphite-3))',
              boxShadow: `
                inset 0 1px 2px rgba(0,0,0,0.6),
                inset 0 0 0 1px rgba(0,0,0,0.3)
              `
            }}
            aria-live="polite"
          >
            {/* Layout esatto della reference */}
            <div className="text-tft text-tft-dim h-full flex flex-col justify-between py-3">
              
              {/* Timer principale - In alto */}
              <div className="text-center">
                <div 
                  className="text-3xl font-mono font-bold mb-1 leading-none"
                  style={{
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 6px hsl(var(--lcd-green-soft) / 0.5)',
                    fontFamily: 'monospace'
                  }}
                >
                  {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider"
                  style={{
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                  }}
                >
                  ── TEMPO SESSIONE ──
                </div>
              </div>

              {/* Modalità e Volume - Centro */}
              <div className="grid grid-cols-2 gap-8 text-center px-4">
                <div>
                  <div 
                    className="text-xl font-mono font-bold mb-1"
                    style={{
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                    }}
                  >
                    {getModeName(state.activeMode)}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wider opacity-80"
                    style={{
                      color: 'hsl(var(--lcd-green-dim))',
                      textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                    }}
                  >
                    MODALITÀ
                  </div>
                </div>
                <div>
                  <div 
                    className="text-xl font-mono font-bold mb-1"
                    style={{
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                    }}
                  >
                    {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wider opacity-80"
                    style={{
                      color: 'hsl(var(--lcd-green-dim))',
                      textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                    }}
                  >
                    VOLUME
                  </div>
                </div>
              </div>

              {/* VU Meter - In basso */}
              <div className="px-4">
                <div 
                  className="text-xs uppercase tracking-wider text-center mb-2 opacity-80"
                  style={{
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                  }}
                >
                  VU METER
                </div>
                <div 
                  className="h-2 rounded-sm overflow-hidden relative border"
                  style={{ 
                    backgroundColor: 'hsl(var(--lcd-bg))',
                    borderColor: 'hsl(var(--lcd-green-off))'
                  }}
                >
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-r"
                      style={{
                        left: `${i * (100/30)}%`,
                        width: `${100/30 - 0.5}%`,
                        backgroundColor: i * (100/30) <= vuLevel ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                        borderRightColor: 'hsl(var(--lcd-green-off))',
                        boxShadow: i * (100/30) <= vuLevel ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none',
                        transition: 'all 0.1s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};