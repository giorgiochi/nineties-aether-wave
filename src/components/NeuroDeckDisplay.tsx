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
      {/* Authentic LCD Bezel - Exact match to reference */}
      <div 
        className="relative p-1 rounded-lg"
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
        {/* LCD Screen - Perfect reference match with radial gradient */}
        <div 
          className="relative p-6 rounded-md overflow-hidden lcd-realistic"
          style={{ 
            height: '240px',
            background: `
              radial-gradient(ellipse 85% 75% at 50% 45%, 
                hsl(120 50% 4%) 0%, 
                hsl(120 45% 3%) 25%, 
                hsl(120 40% 2%) 50%, 
                hsl(120 35% 1%) 75%, 
                hsl(120 30% 0.3%) 100%
              )
            `,
            boxShadow: `
              inset 0 0 0 1px hsl(120 30% 8%),
              inset 0 3px 12px rgba(0,0,0,0.8),
              inset 0 0 40px rgba(0,0,0,0.4)
            `
          }}
          aria-live="polite"
        >
          {/* Screen Content - Perfectly centered and preserved */}
          <div className="text-tft h-full flex flex-col justify-center items-center relative z-10">
            {/* Perfectly Centered Content - All elements preserved */}
            <div className="w-full space-y-4">
              {/* Header Row */}
              <div className="flex justify-between items-center text-xs uppercase tracking-wider opacity-90">
                <span>NEURODECK-90</span>
                <span>● REC</span>
              </div>
              
              {/* Timer Display - Large Center */}
              <div className="text-center py-6">
                <div 
                  className="text-5xl font-medium tracking-wide mb-2 text-tft-glow"
                  style={{
                    fontFamily: '"Perfect DOS VGA 437", "SF Mono", "Monaco", monospace',
                    fontWeight: 500,
                    imageRendering: 'pixelated',
                    WebkitFontSmoothing: 'none'
                  }}
                >
                  {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
                </div>
                <div className="text-xs text-tft-dim uppercase tracking-wider opacity-70">
                  ── TEMPO SESSIONE ──
                </div>
              </div>

              {/* Mode and Volume Grid */}
              <div className="grid grid-cols-2 gap-8 text-center py-3">
                <div className="space-y-1">
                  <div className="text-sm uppercase tracking-wide font-medium">
                    {getModeName(state.activeMode)}
                  </div>
                  <div className="text-xs text-tft-dim uppercase tracking-wide opacity-60">
                    MODALITÀ
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm uppercase tracking-wide font-medium font-mono">
                    {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
                  </div>
                  <div className="text-xs text-tft-dim uppercase tracking-wide opacity-60">
                    VOLUME
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex justify-center space-x-6 text-xs py-2">
                <span className={`${state.isPlaying ? 'text-tft-glow' : 'text-tft-dim opacity-50'}`}>
                  ● PLAY
                </span>
                <span className={`${state.isPaused ? 'text-tft-glow' : 'text-tft-dim opacity-50'}`}>
                  ● PAUSA  
                </span>
                <span className={`${state.masterVolume > 0.7 ? 'text-tft-glow animate-pulse' : 'text-tft-dim opacity-50'}`}>
                  ● WARN
                </span>
              </div>

              {/* VU Meter */}
              <div className="px-6 py-2">
                <div className="text-xs text-tft-dim uppercase tracking-wide text-center mb-2 opacity-60">
                  VU METER
                </div>
                <div 
                  className="h-3 rounded-sm overflow-hidden relative"
                  style={{ 
                    background: `
                      linear-gradient(180deg, 
                        rgba(0,0,0,0.9) 0%, 
                        rgba(0,0,0,0.7) 50%, 
                        rgba(0,0,0,0.9) 100%
                      )
                    `,
                    border: '1px solid rgba(0,0,0,0.9)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.9)'
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full"
                      style={{
                        left: `${i * 5}%`,
                        width: '4%',
                        background: i * 5 <= vuLevel ? 'hsl(var(--screen-text))' : 'rgba(0,0,0,0.3)',
                        boxShadow: i * 5 <= vuLevel ? '0 0 1px hsl(var(--screen-glow) / 0.5)' : 'none',
                        transition: 'all 0.1s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-tft-dim uppercase tracking-wide opacity-40 pt-2">
                ── BINAURALE FOCUS SYSTEM ──
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};