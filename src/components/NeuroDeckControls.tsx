import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';

interface NeuroDeckControlsProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
}

export const NeuroDeckControls: React.FC<NeuroDeckControlsProps> = ({ neuroDeck }) => {
  const { state, start, pause, stop, applyPreset, updateMasterVolume } = neuroDeck;

  return (
    <div className="space-y-4">
      {/* Mode Selection Buttons */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide text-center">MODALITÀ</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset('CONCENTRAZIONE')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
              state.activeMode === 'CONCENTRAZIONE' 
                ? 'bg-screen-yellow text-graphite-0 border-screen-yellow' 
                : 'device-button text-device-text border-graphite-edge'
            }`}
          >
            CONCENTRAZIONE
          </button>
          <button
            onClick={() => applyPreset('ADHD')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
              state.activeMode === 'ADHD' 
                ? 'bg-screen-yellow text-graphite-0 border-screen-yellow' 
                : 'device-button text-device-text border-graphite-edge'
            }`}
          >
            BLOCCA DISTRAZIONI
          </button>
          <button
            onClick={() => applyPreset('STRESS')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
              state.activeMode === 'STRESS' 
                ? 'bg-screen-yellow text-graphite-0 border-screen-yellow' 
                : 'device-button text-device-text border-graphite-edge'
            }`}
          >
            RIDUCI STRESS
          </button>
          <button
            onClick={() => applyPreset('INTRUSIVE_OFF')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
              state.activeMode === 'INTRUSIVE_OFF' 
                ? 'bg-screen-yellow text-graphite-0 border-screen-yellow' 
                : 'device-button text-device-text border-graphite-edge'
            }`}
          >
            PENSIERI OFF
          </button>
        </div>
      </div>

      {/* Volume Knob */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide text-center">VOLUME</h3>
        <div className="flex flex-col items-center space-y-2">
          <div 
            className="relative w-20 h-20 rounded-full border-2 border-graphite-edge cursor-pointer"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, hsl(var(--graphite-3)), hsl(var(--graphite-1)) 60%, hsl(var(--graphite-0))),
                conic-gradient(from ${state.masterVolume * 270 + 135}deg, 
                  hsl(var(--screen-yellow)) 0deg 3deg, 
                  transparent 3deg)
              `,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.masterVolume}
              onChange={(e) => updateMasterVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Volume Master"
            />
            <div 
              className="absolute w-1 h-6 bg-device-text rounded-full top-2 left-1/2"
              style={{
                transform: `translateX(-50%) rotate(${(state.masterVolume - 0.5) * 270}deg)`,
                transformOrigin: '50% 280%'
              }}
            />
          </div>
          <div className="text-xs text-device-muted font-mono">
            {Math.round(state.masterVolume * 100)}%
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide text-center">CONTROLLI</h3>
        <div className="flex justify-center space-x-3">
          <button
            onClick={start}
            disabled={state.isPlaying}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 border ${
              state.isPlaying
                ? 'bg-device-ok text-graphite-0 border-device-ok cursor-default'
                : 'device-button text-device-text border-graphite-edge active:scale-95'
            }`}
          >
            <span className={`device-led ${state.isPlaying ? 'active green' : ''}`} />
            START
          </button>
          <button
            onClick={pause}
            disabled={!state.isPlaying || state.isPaused}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 border ${
              state.isPaused
                ? 'bg-device-warn text-graphite-0 border-device-warn cursor-default'
                : state.isPlaying
                ? 'device-button text-device-text border-graphite-edge active:scale-95'
                : 'device-button text-device-muted border-graphite-edge cursor-not-allowed opacity-50'
            }`}
          >
            <span className={`device-led ${state.isPaused ? 'active orange' : ''}`} />
            PAUSA
          </button>
          <button
            onClick={stop}
            disabled={!state.isPlaying && !state.isPaused}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 border ${
              !state.isPlaying && !state.isPaused
                ? 'device-button text-device-muted border-graphite-edge cursor-not-allowed opacity-50'
                : 'device-button text-device-text border-graphite-edge active:scale-95'
            }`}
          >
            <span className={`device-led ${!state.isPlaying && !state.isPaused ? 'active orange' : ''}`} />
            STOP
          </button>
        </div>
      </div>
    </div>
  );
};