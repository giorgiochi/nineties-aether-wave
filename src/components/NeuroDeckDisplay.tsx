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
        className="relative p-4 rounded-lg"
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
          className="relative p-3 rounded-md"
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
            className="relative p-3 rounded-sm overflow-visible"
            style={{ 
              height: '120px',
              width: '300px',
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
            {/* Layout modulare con griglia perfettamente centrata */}
            <div 
              className="h-full w-full text-tft text-tft-dim"
              style={{
                display: 'grid',
                gridTemplateRows: '1fr auto 1fr auto',
                gridTemplateColumns: '1fr',
                gap: '8px',
                padding: '8px'
              }}
            >
              
              {/* Riga 1: Timer principale centrato */}
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  className="text-2xl font-mono font-bold leading-none mb-1"
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

              {/* Riga 2: Modalità e Volume bilanciati */}
              <div 
                className="grid grid-cols-2 items-center text-center"
                style={{
                  gap: '16px'
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <div 
                    className="text-lg font-mono font-bold leading-none mb-1"
                    style={{
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                    }}
                  >
                    {getModeName(state.activeMode)}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wider"
                    style={{
                      color: 'hsl(var(--lcd-green-dim))',
                      textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                    }}
                  >
                    MODALITÀ
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div 
                    className="text-lg font-mono font-bold leading-none mb-1"
                    style={{
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                    }}
                  >
                    {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wider"
                    style={{
                      color: 'hsl(var(--lcd-green-dim))',
                      textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                    }}
                  >
                    VOLUME
                  </div>
                </div>
              </div>

              {/* Riga 3: Spazio vuoto */}
              <div></div>

              {/* Riga 4: VU Meter centrato in basso */}
              <div className="flex flex-col items-center justify-end">
                <div 
                  className="text-xs uppercase tracking-wider text-center mb-2"
                  style={{
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                  }}
                >
                  VU METER
                </div>
                <div 
                  className="h-2 rounded-sm overflow-hidden relative border w-full max-w-[200px]"
                  style={{ 
                    backgroundColor: 'hsl(var(--lcd-bg))',
                    borderColor: 'hsl(var(--lcd-green-off))'
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-r"
                      style={{
                        left: `${i * (100/20)}%`,
                        width: `${100/20 - 0.5}%`,
                        backgroundColor: i * (100/20) <= vuLevel ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                        borderRightColor: 'hsl(var(--lcd-green-off))',
                        boxShadow: i * (100/20) <= vuLevel ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none',
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