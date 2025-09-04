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
      className="p-3 rounded-xl border border-graphite-edge"
      style={{ 
        background: 'var(--gradient-screen)',
        boxShadow: 'var(--shadow-screen)'
      }}
    >
      <div 
        className="relative p-4 rounded-lg overflow-hidden"
        style={{ 
          height: '180px',
          background: 'hsl(var(--screen-bg))',
          border: '2px inset hsl(var(--graphite-edge))',
          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
        }}
        aria-live="polite"
      >
        <div className="text-tft space-y-4 text-center h-full flex flex-col justify-center">
          {/* Timer - Large Display */}
          <div className="text-4xl font-bold tracking-wider" style={{
            textShadow: '1px 1px 0 rgba(0,0,0,0.3), inset 0 0 2px rgba(0,0,0,0.2)'
          }}>
            {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
          </div>

          {/* Active Mode */}
          <div className="text-lg font-bold">
            MODALITÀ: {getModeName(state.activeMode)}
          </div>

          {/* Volume Level */}
          <div className="text-lg font-bold">
            VOLUME: {Math.round(state.masterVolume * 100)}%
          </div>

          {/* VU Meter */}
          <div className="mt-4">
            <div 
              className="h-4 border-2 border-gray-600 rounded-lg overflow-hidden mx-8"
              style={{ 
                background: 'rgba(0,0,0,0.3)',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${vuLevel}%`,
                  background: `linear-gradient(90deg, 
                    hsl(var(--screen-text)) 0%, 
                    hsl(var(--screen-text)) 100%
                  )`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};