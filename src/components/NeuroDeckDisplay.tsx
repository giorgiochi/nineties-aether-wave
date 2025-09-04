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
      'CONCENTRAZIONE': 'CONCENTRAZIONE',
      'ADHD': 'BLOCCA DISTRAZIONI',
      'STRESS': 'RIDUCI STRESS',
      'INTRUSIVE_OFF': 'PENSIERI OFF'
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
        background: 'var(--gradient-screen)',
        boxShadow: 'var(--shadow-screen)'
      }}
    >
      <div 
        className="relative p-6 rounded-xl overflow-hidden lcd-realistic"
        style={{ 
          height: '200px',
          background: 'hsl(var(--screen-bg))',
          border: '3px inset hsl(var(--graphite-edge))',
          boxShadow: `
            var(--gradient-lcd-bezel),
            inset 0 0 20px rgba(0,0,0,0.2)
          `
        }}
        aria-live="polite"
      >
        {/* LCD Protective Glass Effect */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255,255,255,0.1) 0%, 
                transparent 30%, 
                transparent 70%, 
                rgba(255,255,255,0.05) 100%
              )
            `
          }}
        />
        
        <div className="text-tft h-full flex flex-col justify-center space-y-6 relative z-10">
          {/* Timer Display - Large and Prominent */}
          <div className="text-center">
            <div className="text-5xl font-bold tracking-wider mb-1" style={{
              textShadow: `
                0 0 3px hsl(var(--screen-glow) / 0.4),
                0 0 6px hsl(var(--screen-glow) / 0.3),
                2px 2px 0 rgba(0,0,0,0.5)
              `
            }}>
              {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
            </div>
            <div className="text-xs text-tft-dim uppercase tracking-widest">
              TEMPO SESSIONE
            </div>
          </div>

          {/* Mode and Volume Display */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-lg font-bold mb-1">
                {getModeName(state.activeMode)}
              </div>
              <div className="text-xs text-tft-dim uppercase tracking-widest">
                MODALITÀ
              </div>
            </div>
            <div>
              <div className="text-lg font-bold mb-1">
                {Math.round(state.masterVolume * 100)}%
              </div>
              <div className="text-xs text-tft-dim uppercase tracking-widest">
                VOLUME
              </div>
            </div>
          </div>

          {/* VU Meter */}
          <div className="px-8">
            <div 
              className="h-4 rounded-lg overflow-hidden relative"
              style={{ 
                background: `
                  linear-gradient(180deg, 
                    rgba(0,0,0,0.6) 0%, 
                    rgba(0,0,0,0.4) 50%, 
                    rgba(0,0,0,0.6) 100%
                  )
                `,
                border: '1px solid rgba(0,0,0,0.6)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)'
              }}
            >
              <div 
                className="h-full transition-all duration-300 ease-out relative"
                style={{ 
                  width: `${vuLevel}%`,
                  background: `
                    linear-gradient(90deg, 
                      hsl(var(--screen-text)) 0%, 
                      hsl(var(--screen-text)) 60%,
                      hsl(var(--screen-dim)) 100%
                    )
                  `,
                  boxShadow: '0 0 4px hsl(var(--screen-glow) / 0.3)'
                }}
              >
                {/* VU meter segments */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      repeating-linear-gradient(90deg,
                        transparent 0px,
                        transparent 8px,
                        rgba(0,0,0,0.3) 8px,
                        rgba(0,0,0,0.3) 9px
                      )
                    `
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};