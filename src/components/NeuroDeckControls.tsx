import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';
import { DeviceButton } from '@/components/ui/device-button';
import { Brain, Shield, Zap, Moon, Play, Pause, Square, Waves, Cloud, TreePine, Plane } from 'lucide-react';

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
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'CONCENTRAZIONE', label: 'FOCUS', icon: <Brain size={18} />, variant: 'success' },
            { key: 'STRESS', label: 'RELAX', icon: <Shield size={18} />, variant: 'primary' },
            { key: 'ADHD', label: 'BLOCK', icon: <Zap size={18} />, variant: 'warning' },
            { key: 'INTRUSIVE_OFF', label: 'QUIET', icon: <Moon size={18} />, variant: 'danger' }
          ].map(({ key, label, icon, variant }) => (
            <DeviceButton
              key={key}
              variant={variant as any}
              state={state.activeMode === key ? 'active' : 'default'}
              onClick={() => applyPreset(key as any)}
              icon={icon}
              size="lg"
              className="h-16 min-w-0 whitespace-nowrap"
            >
              {label}
            </DeviceButton>
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
            { action: start, disabled: state.isPlaying, active: state.isPlaying, label: 'START', variant: 'success', icon: <Play size={16} /> },
            { action: pause, disabled: !state.isPlaying || state.isPaused, active: state.isPaused, label: 'PAUSA', variant: 'warning', icon: <Pause size={16} /> },
            { action: stop, disabled: !state.isPlaying && !state.isPaused, active: !state.isPlaying && !state.isPaused, label: 'STOP', variant: 'danger', icon: <Square size={16} /> }
          ].map(({ action, disabled, active, label, variant, icon }) => (
            <DeviceButton
              key={label}
              variant={variant as any}
              state={active && !disabled ? 'active' : disabled ? 'disabled' : 'default'}
              onClick={action}
              disabled={disabled}
              icon={icon}
            >
              {label}
            </DeviceButton>
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
            { key: 'ocean', label: 'OCEANO', volume: state.oceanVolume, defaultVol: 0.15, icon: <Waves size={16} /> },
            { key: 'rain', label: 'PIOGGIA', volume: state.rainVolume, defaultVol: 0.12, icon: <Cloud size={16} /> },
            { key: 'pink', label: 'FORESTA', volume: state.pinkVolume, defaultVol: 0.08, icon: <TreePine size={16} /> },
            { key: 'brown', label: 'AEROPORTO', volume: state.brownVolume, defaultVol: 0.06, icon: <Plane size={16} /> }
          ].map(({ key, label, volume, defaultVol, icon }) => (
            <DeviceButton
              key={key}
              variant={volume > 0 ? 'success' : 'secondary'}
              state={volume > 0 ? 'active' : 'default'}
              onClick={() => updateAmbientVolume(key as any, volume > 0 ? 0 : defaultVol)}
              icon={icon}
            >
              {label}
            </DeviceButton>
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