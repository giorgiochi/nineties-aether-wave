import React from 'react';
import { useAudio } from '@/hooks/useAudio';

interface DeviceControlsProps {
  audio: ReturnType<typeof useAudio>;
}

export const DeviceControls: React.FC<DeviceControlsProps> = ({ audio }) => {
  const { state, start, pause, stop, updatePreset, updateCarrier, updateBinauralVolume, 
          updateMasterVolume, updateAmbientVolume, muteAmbient, resetAmbient, 
          savePreset, loadPreset, updateDuration } = audio;

  const handleFocus50_10 = () => {
    updateDuration(50/60); // 50 minutes in hours
    start();
    
    // Focus mode: 50 minutes work, 10 minute break
    setTimeout(() => {
      pause();
      alert('Pausa 10 minuti. Idratati e riposa gli occhi.');
      
      setTimeout(() => {
        updateDuration(50/60);
        start();
      }, 10 * 60 * 1000); // 10 minutes break
    }, 50 * 60 * 1000); // 50 minutes work
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Binaural Controls */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">BINAURALE</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label htmlFor="preset-select" className="text-xs text-device-muted min-w-[120px]">
              Preset
            </label>
            <select
              id="preset-select"
              value={state.preset}
              onChange={(e) => updatePreset(e.target.value)}
              className="flex-1 bg-graphite-0 border border-graphite-edge rounded-lg px-3 py-2 text-device-text text-sm focus:outline-none focus:ring-2 focus:ring-screen-yellow"
              aria-label="Preset binaurale"
            >
              <option value="13">SMR 13 Hz</option>
              <option value="16">Beta 16 Hz</option>
              <option value="19">Beta 19 Hz</option>
              <option value="40">Gamma 40 Hz</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="carrier-input" className="text-xs text-device-muted min-w-[120px]">
              Carrier L Hz
            </label>
            <input
              id="carrier-input"
              type="number"
              min="160"
              max="300"
              step="1"
              value={state.carrier}
              onChange={(e) => updateCarrier(Number(e.target.value))}
              className="flex-1 bg-graphite-0 border border-graphite-edge rounded-lg px-3 py-2 text-device-text text-sm focus:outline-none focus:ring-2 focus:ring-screen-yellow"
              aria-label="Frequenza portante sinistra"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="binaural-volume" className="text-xs text-device-muted min-w-[120px]">
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
              aria-label="Volume traccia binaurale"
            />
          </div>

          {/* Transport Controls */}
          <div className="flex gap-3 mt-4">
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
      </div>

      {/* Ambient Controls */}
      <div 
        className="p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">AMBIENT</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[80px]">Brown noise</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.brownVolume}
              onChange={(e) => updateAmbientVolume('brown', Number(e.target.value))}
              className="flex-1 device-slider"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[80px]">Pink noise</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.pinkVolume}
              onChange={(e) => updateAmbientVolume('pink', Number(e.target.value))}
              className="flex-1 device-slider"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[80px]">Pioggia</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.rainVolume}
              onChange={(e) => updateAmbientVolume('rain', Number(e.target.value))}
              className="flex-1 device-slider"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs text-device-muted min-w-[80px]">Oceano</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.oceanVolume}
              onChange={(e) => updateAmbientVolume('ocean', Number(e.target.value))}
              className="flex-1 device-slider"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={muteAmbient}
              className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            >
              MUTE AMBIENT
            </button>
            <button
              onClick={resetAmbient}
              className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Session Controls */}
      <div 
        className="lg:col-span-2 p-4 rounded-xl border border-graphite-edge"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="text-device-text font-semibold text-sm mb-3 tracking-wide">SESSIONE</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="duration-input" className="text-xs text-device-muted min-w-[80px]">
              Durata ore
            </label>
            <input
              id="duration-input"
              type="number"
              min="0.25"
              step="0.25"
              value={state.duration}
              onChange={(e) => updateDuration(Number(e.target.value))}
              className="flex-1 bg-graphite-0 border border-graphite-edge rounded-lg px-3 py-2 text-device-text text-sm focus:outline-none focus:ring-2 focus:ring-screen-yellow"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="master-volume" className="text-xs text-device-muted min-w-[60px]">
              Master
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
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFocus50_10}
              className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            >
              FOCUS 50-10
            </button>
            <button
              onClick={savePreset}
              className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            >
              SALVA
            </button>
            <button
              onClick={loadPreset}
              className="device-button px-3 py-2 rounded-lg text-device-text text-xs font-medium"
            >
              CARICA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};