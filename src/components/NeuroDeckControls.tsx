import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';

interface NeuroDeckControlsProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
}

export const NeuroDeckControls: React.FC<NeuroDeckControlsProps> = ({ neuroDeck }) => {
  const { state, start, pause, stop, applyPreset, updateMasterVolume, updateAmbientVolume } = neuroDeck;

  return (
    <div className="space-y-5">
      {/* Mode Selection Buttons */}
      <div 
        className="p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-4">MODALITÀ FOCUS</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'CONCENTRAZIONE', label: 'CONCENTRAZIONE' },
            { key: 'STRESS', label: 'RIDUCI STRESS' },
            { key: 'ADHD', label: 'BLOCCA DISTRAZIONI' },
            { key: 'INTRUSIVE_OFF', label: 'PENSIERI OFF' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => applyPreset(key as any)}
              className={`px-4 py-4 rounded-xl font-bold text-xs transition-all duration-150 relative overflow-hidden ${
                state.activeMode === key
                  ? 'bg-screen-yellow text-screen-text shadow-inner border-2 border-screen-text transform translate-y-0.5'
                  : 'btn-embossed text-device-text'
              }`}
            >
              {/* Button label with serigraph effect */}
              <span className="relative z-10 tracking-wider">{label}</span>
              {state.activeMode === key && (
                <div 
                  className="absolute inset-0 bg-screen-yellow opacity-20"
                  style={{
                    background: 'radial-gradient(circle at center, hsl(var(--screen-glow)) 0%, transparent 70%)'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ultra-Realistic Volume Knob */}
      <div 
        className="p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-4">VOLUME MASTER</h3>
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="relative w-28 h-28 rounded-full cursor-pointer realistic-knob"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={state.masterVolume}
              onChange={(e) => updateMasterVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              aria-label="Volume Master"
            />
            
            {/* Knob markings */}
            <div className="absolute inset-0 rounded-full">
              {Array.from({ length: 11 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-device-muted"
                  style={{
                    top: '6px',
                    left: '50%',
                    transformOrigin: '50% 50px',
                    transform: `translateX(-50%) rotate(${(i - 5) * 27}deg)`,
                    opacity: i === 5 ? 1 : 0.6
                  }}
                />
              ))}
            </div>
            
            {/* Reference line inside knob */}
            <div 
              className="absolute w-1 h-10 rounded-full top-3 left-1/2 z-10"
              style={{
                background: `
                  linear-gradient(180deg, 
                    hsl(var(--screen-text)) 0%, 
                    hsl(var(--screen-dim)) 100%
                  )
                `,
                transform: `translateX(-50%) rotate(${(state.masterVolume - 0.5) * 270}deg)`,
                transformOrigin: '50% 400%',
                boxShadow: '0 0 2px rgba(0,0,0,0.8)'
              }}
            />
          </div>
          
          {/* Digital Volume Display */}
          <div 
            className="px-4 py-2 rounded-lg font-mono text-sm font-bold"
            style={{
              background: 'hsl(var(--graphite-0))',
              border: '1px inset hsl(var(--graphite-edge))',
              color: 'hsl(var(--screen-text))',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)'
            }}
          >
            {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
          </div>
        </div>
      </div>

      {/* Transport Controls with Realistic Buttons */}
      <div 
        className="p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-4">CONTROLLI TRASPORTO</h3>
        <div className="flex justify-center space-x-4">
          {[
            { action: start, disabled: state.isPlaying, active: state.isPlaying, label: 'START', led: 'green' },
            { action: pause, disabled: !state.isPlaying || state.isPaused, active: state.isPaused, label: 'PAUSA', led: 'orange' },
            { action: stop, disabled: !state.isPlaying && !state.isPaused, active: !state.isPlaying && !state.isPaused, label: 'STOP', led: 'orange' }
          ].map(({ action, disabled, active, label, led }, index) => (
            <button
              key={index}
              onClick={action}
              disabled={disabled}
              className={`flex flex-col items-center gap-2 px-5 py-4 rounded-xl font-bold transition-all duration-100 relative ${
                active && !disabled
                  ? 'bg-device-ok text-graphite-0 border-2 border-device-ok transform translate-y-0.5'
                  : disabled
                  ? 'btn-embossed text-device-muted opacity-40 cursor-not-allowed'
                  : 'btn-embossed text-device-text'
              }`}
            >
              <span className={`device-led ${active && !disabled ? `active ${led}` : ''}`} />
              <span className="text-xs tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Realistic Ambient Sound Toggle Buttons */}
      <div 
        className="p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-4">AMBIENTI AUDIO</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'ocean', label: 'OCEANO', volume: state.oceanVolume, defaultVol: 0.15 },
            { key: 'rain', label: 'PIOGGIA', volume: state.rainVolume, defaultVol: 0.12 },
            { key: 'pink', label: 'FORESTA', volume: state.pinkVolume, defaultVol: 0.08 },
            { key: 'brown', label: 'AEROPORTO', volume: state.brownVolume, defaultVol: 0.06 }
          ].map(({ key, label, volume, defaultVol }) => (
            <button
              key={key}
              onClick={() => updateAmbientVolume(key as any, volume > 0 ? 0 : defaultVol)}
              className={`px-4 py-3 rounded-xl font-bold text-xs transition-all duration-150 relative overflow-hidden ${
                volume > 0
                  ? 'bg-device-accent text-graphite-0 border-2 border-device-accent transform translate-y-0.5'
                  : 'btn-embossed text-device-text'
              }`}
            >
              <span className="relative z-10 tracking-wider">{label}</span>
              {volume > 0 && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'radial-gradient(circle at center, hsl(var(--device-accent)) 0%, transparent 70%)'
                  }}
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Ambient levels indicator */}
        <div className="mt-3 text-center">
          <div className="text-xs text-device-muted font-mono">
            {Object.entries({
              OCN: state.oceanVolume,
              PGG: state.rainVolume,
              FOR: state.pinkVolume,
              AER: state.brownVolume
            }).map(([name, vol]) => `${name}:${Math.round(vol * 100).toString().padStart(2, '0')}`).join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
};