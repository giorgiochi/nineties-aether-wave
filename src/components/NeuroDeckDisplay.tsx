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
        className="relative p-4 rounded-lg overflow-hidden tft-scanlines"
        style={{ 
          height: '180px',
          background: `
            radial-gradient(600px 140px at 50% -40%, hsla(48, 87%, 68%, 0.15), transparent 60%),
            var(--gradient-screen)
          `
        }}
        aria-live="polite"
      >
        <div className="text-tft space-y-4 text-center">
          {/* Timer - Large Display */}
          <div className="text-3xl font-bold tracking-wider">
            {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
          </div>

          {/* Active Mode */}
          <div className="text-lg">
            MODALITÀ: <span className="font-bold">{getModeName(state.activeMode)}</span>
          </div>

          {/* Volume Level */}
          <div className="text-lg">
            VOLUME: <span className="font-bold">{Math.round(state.masterVolume * 100)}%</span>
          </div>

          {/* VU Meter */}
          <div className="mt-4">
            <div 
              className="h-3 border border-screen-dim rounded-lg overflow-hidden mx-4"
              style={{ 
                background: 'rgba(0,0,0,0.3)'
              }}
            >
              <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${vuLevel}%`,
                  background: 'linear-gradient(90deg, hsl(48, 60%, 35%), hsl(var(--screen-yellow)))',
                  boxShadow: '0 0 8px hsla(48, 87%, 68%, 0.35)'
                }}
              />
            </div>
          </div>

          {/* Warning text */}
          <div className="text-xs text-tft-dim mt-3">
            Usa cuffie per il binaurale
          </div>
        </div>
      </div>
    </div>
  );
};