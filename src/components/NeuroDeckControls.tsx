import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';

interface NeuroDeckControlsProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
}

export const NeuroDeckControls: React.FC<NeuroDeckControlsProps> = ({ neuroDeck }) => {
  const { 
    state, 
    start, 
    pause, 
    stop, 
    applyPreset,
    updateMasterVolume,
    updateBinauralVolume,
    updateAmbientVolume,
    updateDuration,
    muteAmbient,
    resetAmbient 
  } = neuroDeck;

  return (
    <div className="space-y-4">
      {/* Quick Commands */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">COMANDI RAPIDI</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset('CONCENTRAZIONE')}
            className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            aria-label="Aumenta concentrazione"
          >
            Aumenta Concentrazione
          </button>
          <button
            onClick={() => applyPreset('ADHD')}
            className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            aria-label="Blocca distrazioni ADHD"
          >
            Blocca Distrazioni (ADHD)
          </button>
          <button
            onClick={() => applyPreset('STRESS')}
            className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            aria-label="Riduci stress"
          >
            Riduci Stress
          </button>
          <button
            onClick={() => applyPreset('INTRUSIVE_OFF')}
            className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            aria-label="Ferma pensieri intrusivi"
          >
            Pensieri Intrusivi OFF
          </button>
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
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">TRASPORTO</h3>
        
        <div className="flex gap-3">
          <button
            onClick={start}
            className="device-button flex items-center gap-2 px-4 py-2 rounded-lg text-device-text text-sm font-medium transition-colors"
            aria-label="Start"
          >
            <span className={`device-led ${state.isPlaying ? 'active green' : ''}`} />
            START
          </button>
          <button
            onClick={pause}
            className="device-button flex items-center gap-2 px-4 py-2 rounded-lg text-device-text text-sm font-medium"
            aria-label="Pausa"
          >
            <span className={`device-led ${state.isPaused ? 'active orange' : ''}`} />
            PAUSA
          </button>
          <button
            onClick={stop}
            className="device-button flex items-center gap-2 px-4 py-2 rounded-lg text-device-text text-sm font-medium"
            aria-label="Stop"
          >
            <span className={`device-led ${!state.isPlaying && !state.isPaused ? 'active orange' : ''}`} />
            STOP
          </button>
        </div>
      </div>

      {/* Volume Controls */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">LIVELLI & SESSIONE</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label htmlFor="master-volume" className="text-xs text-device-muted min-w-[100px]">
              Volume Master
            </label>
            <input
              id="master-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.masterVolume}
              onChange={(e) => updateMasterVolume(Number(e.target.value))}
              className="flex-1 device-slider"
              aria-label="Volume Master"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="binaural-volume" className="text-xs text-device-muted min-w-[100px]">
              Volume Binaurale
            </label>
            <input
              id="binaural-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.binauralVolume}
              onChange={(e) => updateBinauralVolume(Number(e.target.value))}
              className="flex-1 device-slider"
              aria-label="Volume binaurale"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="duration-input" className="text-xs text-device-muted min-w-[100px]">
              Durata (ore)
            </label>
            <input
              id="duration-input"
              type="number"
              min="0.25"
              step="0.25"
              value={state.duration}
              onChange={(e) => updateDuration(Number(e.target.value))}
              className="flex-1 bg-graphite-0 border border-graphite-edge rounded-lg px-3 py-2 text-device-text text-sm focus:outline-none focus:ring-2 focus:ring-screen-yellow"
              aria-label="Durata sessione in ore"
            />
          </div>
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
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">AMBIENTI (non invasivi)</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[60px]">Brown</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.brownVolume}
              onChange={(e) => updateAmbientVolume('brown', Number(e.target.value))}
              className="flex-1 device-slider"
              aria-label="Volume brown noise"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[60px]">Pink</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.pinkVolume}
              onChange={(e) => updateAmbientVolume('pink', Number(e.target.value))}
              className="flex-1 device-slider"
              aria-label="Volume pink noise"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[60px]">Pioggia</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.rainVolume}
              onChange={(e) => updateAmbientVolume('rain', Number(e.target.value))}
              className="flex-1 device-slider"
              aria-label="Volume pioggia"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[60px]">Oceano</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.oceanVolume}
              onChange={(e) => updateAmbientVolume('ocean', Number(e.target.value))}
              className="flex-1 device-slider"
              aria-label="Volume oceano"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={muteAmbient}
              className="device-button px-3 py-1.5 rounded-lg text-device-text text-xs font-medium"
              aria-label="Muta tutti gli ambient"
            >
              MUTE AMBIENT
            </button>
            <button
              onClick={resetAmbient}
              className="device-button px-3 py-1.5 rounded-lg text-device-text text-xs font-medium"
              aria-label="Reset ambient ai valori predefiniti"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-device-muted px-2">
        Preset e livelli si salvano automaticamente. Se il master supera 0.7 vedrai un avviso.
      </div>
    </div>
  );
};