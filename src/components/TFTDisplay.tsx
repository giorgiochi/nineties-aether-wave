import React from 'react';
import { useAudio } from '@/hooks/useAudio';

interface TFTDisplayProps {
  audio: ReturnType<typeof useAudio>;
}

export const TFTDisplay: React.FC<TFTDisplayProps> = ({ audio }) => {
  const { state } = audio;

  const formatTime = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getPresetName = (preset: string): string => {
    const presetMap: Record<string, string> = {
      '13': 'SMR 13',
      '16': 'BETA 16',
      '19': 'BETA 19',
      '40': 'GAMMA 40'
    };
    return presetMap[preset] || `${preset} Hz`;
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
        className="relative p-5 rounded-lg overflow-hidden tft-scanlines"
        style={{ 
          height: '280px',
          background: `
            radial-gradient(600px 140px at 50% -40%, hsla(48, 87%, 68%, 0.15), transparent 60%),
            var(--gradient-screen)
          `
        }}
        aria-live="polite"
      >
        <div className="text-tft space-y-3">
          {/* Row 1: Preset and State */}
          <div className="flex justify-between items-center text-2xl">
            <div>
              PRESET <span className="ml-2">{getPresetName(state.preset)}</span>
            </div>
            <div>
              STATE <span className="ml-2">{getState()}</span>
            </div>
          </div>

          {/* Row 2: Beat and Carrier */}
          <div className="flex justify-between items-center text-lg">
            <div>
              BEAT <span className="ml-2">{parseFloat(state.preset).toFixed(1)} Hz</span>
            </div>
            <div>
              CARRIER <span className="ml-2">{state.carrier} Hz</span>
            </div>
          </div>

          {/* Row 3: Master and Binaural */}
          <div className="flex justify-between items-center text-lg">
            <div>
              MASTER <span className="ml-2">{state.masterVolume.toFixed(2)}</span>
            </div>
            <div>
              BINAURAL <span className="ml-2">{state.binauralVolume.toFixed(2)}</span>
            </div>
          </div>

          {/* Row 4: Ambient and Timer */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex-1 min-w-0">
              AMBIENT <span className="ml-2 break-all">{getAmbientStatus()}</span>
            </div>
            <div className="ml-4">
              TIMER <span className="ml-2">{state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}</span>
            </div>
          </div>

          {/* Row 5: Safety and VU */}
          <div className="flex justify-between items-center text-lg">
            <div>
              SAFETY <span className={`ml-2 ${getSafetyStatus() === 'ATTENZIONE' ? 'text-device-warn' : ''}`}>
                {getSafetyStatus()}
              </span>
            </div>
            <div>VU</div>
          </div>

          {/* VU Meter */}
          <div className="mt-4">
            <div 
              className="h-3 border border-screen-dim rounded-lg overflow-hidden"
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
          <div className="text-xs text-tft-dim mt-6">
            Use Headphones for binaural effect. Not a medical device.
          </div>
        </div>
      </div>
    </div>
  );
};