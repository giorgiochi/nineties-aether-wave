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
        {/* LCD Screen - Esatta come nella reference */}
        <div 
          className="relative p-6 rounded-md overflow-visible lcd-realistic"
          style={{ 
            height: '300px',
            background: `radial-gradient(120% 100% at 50% 45%, hsl(var(--lcd-bg-center)), hsl(var(--lcd-bg)))`,
            border: '2px solid hsl(var(--graphite-2))',
            boxShadow: 'inset 0 0 0 1px hsl(var(--graphite-3))'
          }}
          aria-live="polite"
        >
          {/* Layout esatto della reference */}
          <div className="text-tft text-tft-dim h-full flex flex-col justify-center items-center space-y-5 py-2">
            
            {/* Timer principale - Grande e centrato */}
            <div className="text-center">
              <div 
                className="text-6xl font-mono font-bold mb-2 leading-none"
                style={{
                  color: 'hsl(var(--lcd-green-soft))',
                  textShadow: '0 0 6px hsl(var(--lcd-green-soft) / 0.5)',
                  fontFamily: 'monospace'
                }}
              >
                {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
              </div>
              <div 
                className="text-sm uppercase tracking-wider"
                style={{
                  color: 'hsl(var(--lcd-green-dim))',
                  textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                }}
              >
                ── TEMPO SESSIONE ──
              </div>
            </div>

            {/* Griglia modalità e volume - Come nella reference */}
            <div className="grid grid-cols-2 gap-12 text-center px-8">
              <div>
                <div 
                  className="text-2xl font-mono font-bold mb-1"
                  style={{
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                  }}
                >
                  {getModeName(state.activeMode)}
                </div>
                <div 
                  className="text-sm uppercase tracking-wider opacity-80"
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
                  className="text-2xl font-mono font-bold mb-1"
                  style={{
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                  }}
                >
                  {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
                </div>
                <div 
                  className="text-sm uppercase tracking-wider opacity-80"
                  style={{
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                  }}
                >
                  VOLUME
                </div>
              </div>
            </div>

            {/* Indicatori di stato - Come nella reference */}
            <div className="flex justify-center space-x-8 text-sm">
              <span 
                className={`flex items-center space-x-2`}
                style={{
                  color: state.isPlaying ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                  textShadow: state.isPlaying ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none'
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: state.isPlaying ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                  boxShadow: state.isPlaying ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none'
                }}></span>
                <span>PLAY</span>
              </span>
              <span 
                className={`flex items-center space-x-2`}
                style={{
                  color: state.isPaused ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                  textShadow: state.isPaused ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none'
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: state.isPaused ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                  boxShadow: state.isPaused ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none'
                }}></span>
                <span>PAUSA</span>
              </span>
              <span 
                className={`flex items-center space-x-2 ${state.masterVolume > 0.7 ? 'animate-pulse' : ''}`}
                style={{
                  color: state.masterVolume > 0.7 ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                  textShadow: state.masterVolume > 0.7 ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none'
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: state.masterVolume > 0.7 ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                  boxShadow: state.masterVolume > 0.7 ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none'
                }}></span>
                <span>WARN</span>
              </span>
            </div>

            {/* VU Meter - Come nella reference */}
            <div className="px-8">
              <div 
                className="text-sm uppercase tracking-wider text-center mb-3 opacity-80"
                style={{
                  color: '#00aa2b',
                  textShadow: '0 0 5px #00aa2b'
                }}
              >
                VU METER
              </div>
              <div 
                className="h-4 rounded-sm overflow-hidden relative border"
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
                      left: `${i * 5}%`,
                      width: '4.5%',
                      backgroundColor: i * 5 <= vuLevel ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-off))',
                      borderRightColor: 'hsl(var(--lcd-green-off))',
                      boxShadow: i * 5 <= vuLevel ? '0 0 4px hsl(var(--lcd-green-soft) / 0.5)' : 'none',
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
  );
};