import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';

interface NeuroDeckControlsProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
}

export const NeuroDeckControls: React.FC<NeuroDeckControlsProps> = ({ neuroDeck }) => {
  const { state, start, pause, stop, applyPreset, updateMasterVolume, updateAmbientVolume } = neuroDeck;

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
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => applyPreset('CONCENTRAZIONE')}
            className={`px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.activeMode === 'CONCENTRAZIONE' 
                ? 'bg-screen-yellow text-graphite-0 border-2 border-screen-text shadow-inner' 
                : 'btn-embossed text-device-text'
            }`}
          >
            CONCENTRAZIONE
          </button>
          <button
            onClick={() => applyPreset('STRESS')}
            className={`px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.activeMode === 'STRESS' 
                ? 'bg-screen-yellow text-graphite-0 border-2 border-screen-text shadow-inner' 
                : 'btn-embossed text-device-text'
            }`}
          >
            RIDUCI STRESS
          </button>
          <button
            onClick={() => applyPreset('ADHD')}
            className={`px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.activeMode === 'ADHD' 
                ? 'bg-screen-yellow text-graphite-0 border-2 border-screen-text shadow-inner' 
                : 'btn-embossed text-device-text'
            }`}
          >
            BLOCCA DISTRAZIONI
          </button>
          <button
            onClick={() => applyPreset('INTRUSIVE_OFF')}
            className={`px-3 py-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.activeMode === 'INTRUSIVE_OFF' 
                ? 'bg-screen-yellow text-graphite-0 border-2 border-screen-text shadow-inner' 
                : 'btn-embossed text-device-text'
            }`}
          >
            PENSIERI OFF
          </button>
        </div>
      </div>

      {/* Volume Knob - Realistic Potentiometer */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide text-center">VOLUME</h3>
        <div className="flex flex-col items-center space-y-3">
          <div 
            className="relative w-24 h-24 rounded-full border-2 border-graphite-edge cursor-pointer"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, hsl(var(--graphite-3)), hsl(var(--graphite-1)) 60%, hsl(var(--graphite-0)))
              `,
              boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)'
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
            {/* Reference line inside the knob */}
            <div 
              className="absolute w-0.5 h-8 bg-device-text rounded-full top-2 left-1/2"
              style={{
                transform: `translateX(-50%) rotate(${(state.masterVolume - 0.5) * 270}deg)`,
                transformOrigin: '50% 400%'
              }}
            />
          </div>
          <div className="text-sm text-device-muted font-mono font-bold">
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
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
              state.isPlaying
                ? 'bg-device-ok text-graphite-0 border-2 border-device-ok cursor-default shadow-inner'
                : 'btn-embossed text-device-text'
            }`}
          >
            <span className={`device-led ${state.isPlaying ? 'active green' : ''}`} />
            START
          </button>
          <button
            onClick={pause}
            disabled={!state.isPlaying || state.isPaused}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
              state.isPaused
                ? 'bg-device-warn text-graphite-0 border-2 border-device-warn cursor-default shadow-inner'
                : state.isPlaying
                ? 'btn-embossed text-device-text'
                : 'btn-embossed text-device-muted opacity-50 cursor-not-allowed'
            }`}
          >
            <span className={`device-led ${state.isPaused ? 'active orange' : ''}`} />
            PAUSA
          </button>
          <button
            onClick={stop}
            disabled={!state.isPlaying && !state.isPaused}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
              !state.isPlaying && !state.isPaused
                ? 'btn-embossed text-device-muted opacity-50 cursor-not-allowed'
                : 'btn-embossed text-device-text'
            }`}
          >
            <span className={`device-led ${!state.isPlaying && !state.isPaused ? 'active orange' : ''}`} />
            STOP
          </button>
        </div>
      </div>

      {/* Ambient Sounds */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide text-center">AMBIENTI</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateAmbientVolume('ocean', state.oceanVolume > 0 ? 0 : 0.15)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.oceanVolume > 0
                ? 'bg-device-accent text-graphite-0 border-2 border-device-accent shadow-inner'
                : 'btn-embossed text-device-text'
            }`}
          >
            OCEANO
          </button>
          <button
            onClick={() => updateAmbientVolume('rain', state.rainVolume > 0 ? 0 : 0.12)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.rainVolume > 0
                ? 'bg-device-accent text-graphite-0 border-2 border-device-accent shadow-inner'
                : 'btn-embossed text-device-text'
            }`}
          >
            PIOGGIA
          </button>
          <button
            onClick={() => updateAmbientVolume('pink', state.pinkVolume > 0 ? 0 : 0.08)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.pinkVolume > 0
                ? 'bg-device-accent text-graphite-0 border-2 border-device-accent shadow-inner'
                : 'btn-embossed text-device-text'
            }`}
          >
            FORESTA
          </button>
          <button
            onClick={() => updateAmbientVolume('brown', state.brownVolume > 0 ? 0 : 0.06)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              state.brownVolume > 0
                ? 'bg-device-accent text-graphite-0 border-2 border-device-accent shadow-inner'
                : 'btn-embossed text-device-text'
            }`}
          >
            AEROPORTO
          </button>
        </div>
      </div>
    </div>
  );
};