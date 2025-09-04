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
      {/* Authentic TFT/LCD Bezel */}
      <div 
        className="relative p-2 rounded-xl"
        style={{ 
          background: `
            linear-gradient(145deg, 
              hsl(var(--screen-bezel)) 0%, 
              hsl(220 30% 8%) 50%, 
              hsl(220 35% 6%) 100%
            )
          `,
          boxShadow: `
            inset 0 2px 4px rgba(0,0,0,0.6),
            inset 0 -1px 0 rgba(255,255,255,0.1)
          `
        }}
      >
        {/* LCD Screen */}
        <div 
          className="relative p-6 rounded-lg overflow-hidden lcd-realistic"
          style={{ 
            height: '220px',
            background: 'var(--gradient-screen)',
            boxShadow: `
              var(--gradient-lcd-bezel),
              inset 0 0 30px rgba(0,0,0,0.4)
            `
          }}
          aria-live="polite"
        >
          {/* LCD Matrix Effect */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-lg opacity-20"
            style={{
              background: `
                repeating-conic-gradient(from 0deg at 50% 50%, 
                  transparent 0deg, 
                  rgba(0,0,0,0.1) 0.5deg, 
                  transparent 1deg
                )
              `,
              backgroundSize: '4px 4px'
            }}
          />
          
          {/* Screen Content - Fixed Layout Grid */}
          <div className="text-tft h-full flex flex-col justify-between py-2 relative z-10">
            {/* Header Row - Fixed Position */}
            <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-80 h-4">
              <span>NEURODECK-90</span>
              <span>● REC</span>
            </div>
            
            {/* Timer Display - Fixed Large Center */}
            <div className="text-center flex-1 flex flex-col justify-center">
              <div 
                className="text-5xl font-bold tracking-widest mb-2 text-tft-glow font-mono h-16 flex items-center justify-center"
                style={{
                  fontFamily: '"Courier New", "Lucida Console", monospace'
                }}
              >
                {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
              </div>
              <div className="text-xs text-tft-dim uppercase tracking-[0.2em] opacity-70 h-4">
                ── TEMPO SESSIONE ──
              </div>
            </div>

            {/* Mode and Volume Grid - Fixed Layout */}
            <div className="grid grid-cols-2 gap-6 text-center py-4">
              <div className="space-y-1 h-12 flex flex-col justify-center">
                <div className="text-sm uppercase tracking-wider font-bold h-5 flex items-center justify-center">
                  <span className="truncate max-w-full">
                    {getModeName(state.activeMode)}
                  </span>
                </div>
                <div className="text-xs text-tft-dim uppercase tracking-[0.15em] opacity-60 h-4">
                  MODALITÀ
                </div>
              </div>
              <div className="space-y-1 h-12 flex flex-col justify-center">
                <div className="text-sm uppercase tracking-wider font-bold h-5 flex items-center justify-center">
                  <span className="font-mono">
                    {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
                  </span>
                </div>
                <div className="text-xs text-tft-dim uppercase tracking-[0.15em] opacity-60 h-4">
                  VOLUME
                </div>
              </div>
            </div>

            {/* Status Indicators - Fixed Position */}
            <div className="flex justify-center space-x-6 text-xs h-4 items-center">
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

            {/* VU Meter - Fixed Position and Size */}
            <div className="px-8 py-2">
              <div className="text-xs text-tft-dim uppercase tracking-widest text-center mb-1 opacity-60 h-3">
                VU METER
              </div>
              <div 
                className="h-4 rounded-sm overflow-hidden relative"
                style={{ 
                  background: `
                    linear-gradient(180deg, 
                      rgba(0,0,0,0.8) 0%, 
                      rgba(0,0,0,0.6) 50%, 
                      rgba(0,0,0,0.8) 100%
                    )
                  `,
                  border: '1px solid rgba(0,0,0,0.9)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9)'
                }}
              >
                {/* VU Segments - Fixed 20 segments */}
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full w-1"
                    style={{
                      left: `${i * 5}%`,
                      background: i * 5 <= vuLevel ? 'hsl(var(--screen-text))' : 'rgba(0,0,0,0.3)',
                      boxShadow: i * 5 <= vuLevel ? '0 0 2px hsl(var(--screen-glow) / 0.6)' : 'none',
                      transition: 'all 0.1s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Footer - Fixed Position */}
            <div className="text-center text-xs text-tft-dim uppercase tracking-[0.2em] opacity-40 h-4 flex items-center justify-center">
              ── BINAURALE FOCUS SYSTEM ──
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};