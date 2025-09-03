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
          height: '240px',
          background: `
            radial-gradient(600px 140px at 50% -40%, hsla(48, 87%, 68%, 0.15), transparent 60%),
            var(--gradient-screen)
          `
        }}
        aria-live="polite"
      >
        <div className="text-tft space-y-2 text-sm">
          {/* Row 1: Mode and State */}
          <div className="flex justify-between items-center text-lg">
            <div>
              MODALITÀ <span className="ml-2">{getModeName(state.activeMode)}</span>
            </div>
            <div>
              STATO <span className="ml-2">{getState()}</span>
            </div>
          </div>

          {/* Row 2: Beat and Master */}
          <div className="flex justify-between items-center">
            <div>
              BEAT <span className="ml-2">{getBeatFrequency(state.activeMode).toFixed(1)} Hz</span>
            </div>
            <div>
              MASTER <span className="ml-2">{state.masterVolume.toFixed(2)}</span>
            </div>
          </div>

          {/* Row 3: Binaural and Timer */}
          <div className="flex justify-between items-center">
            <div>
              BINAURALE <span className="ml-2">{state.binauralVolume.toFixed(2)}</span>
            </div>
            <div>
              TIMER <span className="ml-2">
                {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
              </span>
            </div>
          </div>

          {/* Row 4: Ambient */}
          <div className="break-all text-xs">
            AMBIENT <span className="ml-2">{getAmbientStatus()}</span>
          </div>

          {/* Row 5: Safety and VU */}
          <div className="flex justify-between items-center">
            <div>
              SAFETY <span className={`ml-2 ${getSafetyStatus() === 'ATTENZIONE' ? 'text-device-warn' : ''}`}>
                {getSafetyStatus()}
              </span>
            </div>
            <div>VU</div>
          </div>

          {/* VU Meter */}
          <div className="mt-3">
            <div 
              className="h-2.5 border border-screen-dim rounded-lg overflow-hidden"
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
          <div className="text-xs text-tft-dim mt-4">
            Supporto sonoro. Non è un dispositivo medico. Usa cuffie per il binaurale.
          </div>
        </div>
      </div>
    </div>
  );
};