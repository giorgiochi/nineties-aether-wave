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
    <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-5 px-2 sm:px-0">
      {/* Mode Selection Buttons - Responsive 2x2 Grid */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-3 sm:mb-4">MODALITÀ FOCUS</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
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
              size="md"
              className="h-12 sm:h-16 min-w-0 whitespace-nowrap text-xs sm:text-sm"
            >
              {label}
            </DeviceButton>
          ))}
        </div>
      </div>

      {/* Volume Slider - Vintage LED Style */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-3 sm:mb-4">VOLUME MASTER</h3>
        <div className="flex flex-col items-center space-y-4">
          
          {/* Vintage LED Slider */}
          <div className="w-full max-w-xs relative">
            
            {/* Slider Track Container */}
            <div 
              className="relative w-full h-6 rounded-full"
              style={{
                background: `
                  linear-gradient(180deg,
                    hsl(var(--graphite-edge)) 0%,
                    hsl(var(--graphite-0)) 20%,
                    hsl(var(--graphite-1)) 80%,
                    hsl(var(--graphite-edge)) 100%
                  )
                `,
                border: '2px solid hsl(var(--graphite-edge))',
                boxShadow: `
                  inset 0 3px 6px rgba(0,0,0,0.8),
                  inset 0 6px 12px rgba(0,0,0,0.6),
                  inset 0 -1px 2px rgba(255,255,255,0.05)
                `
              }}
            >
              
              {/* LED Track Fill */}
              <div 
                className="absolute top-1 left-1 h-4 rounded-full transition-all duration-200"
                style={{
                  width: `calc(${state.masterVolume * 100}% - 8px)`,
                  background: `
                    linear-gradient(90deg,
                      hsl(140, 90%, 40%) 0%,
                      hsl(140, 90%, 60%) 50%,
                      hsl(140, 90%, 70%) 100%
                    )
                  `,
                  boxShadow: `
                    0 0 6px hsl(140, 90%, 70%),
                    0 0 3px hsl(140, 90%, 70%),
                    inset 0 1px 2px rgba(255,255,255,0.3),
                    inset 0 -1px 1px rgba(0,0,0,0.2)
                  `,
                  filter: 'brightness(1.1)'
                }}
              />
              
              {/* Slider Input */}
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
              
              {/* LED Thumb */}
              <div 
                className="absolute top-0 h-6 w-6 rounded-full transition-all duration-200 pointer-events-none"
                style={{
                  left: `calc(${state.masterVolume * 100}% - 12px)`,
                  background: `
                    radial-gradient(circle,
                      hsl(140, 90%, 80%) 0%,
                      hsl(140, 90%, 70%) 40%,
                      hsl(140, 90%, 50%) 80%,
                      hsl(140, 70%, 30%) 100%
                    )
                  `,
                  border: '2px solid hsl(140, 60%, 25%)',
                  boxShadow: `
                    0 0 12px hsl(140, 90%, 70%),
                    0 0 6px hsl(140, 90%, 70%),
                    0 2px 4px rgba(0,0,0,0.4),
                    inset 0 1px 2px rgba(255,255,255,0.4),
                    inset 0 -1px 2px rgba(0,0,0,0.3)
                  `
                }}
              >
                {/* LED Center Glow */}
                <div 
                  className="absolute inset-1 rounded-full"
                  style={{
                    background: `
                      radial-gradient(circle,
                        hsl(140, 90%, 90%) 0%,
                        hsl(140, 90%, 75%) 60%,
                        transparent 100%
                      )
                    `
                  }}
                />
              </div>
            </div>
            
            {/* Digital Percentage Display */}
            <div className="flex justify-center mt-3">
              <div 
                className="px-3 py-1 rounded font-mono font-bold"
                style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  background: `
                    radial-gradient(ellipse 80% 60% at 50% 50%, 
                      hsl(120 80% 8%) 0%, 
                      hsl(120 60% 6%) 40%, 
                      hsl(120 40% 4%) 80%,
                      hsl(120 20% 2%) 100%
                    )
                  `,
                  color: 'hsl(140, 90%, 70%)',
                  textShadow: `
                    0 0 6px hsl(140, 90%, 70%),
                    0 0 3px hsl(140, 90%, 70%),
                    0 0 1px hsl(140, 90%, 70%)
                  `,
                  border: '1px solid hsl(120, 40%, 10%)',
                  boxShadow: `
                    inset 0 2px 4px rgba(0,0,0,0.8),
                    inset 0 -1px 2px rgba(255,255,255,0.02),
                    0 0 12px hsl(140, 90%, 70%)22
                  `
                }}
              >
                {Math.round(state.masterVolume * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Controls with Realistic Buttons - Responsive */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-3 sm:mb-4">COMANDI RIPRODUZIONE</h3>
        <div className="flex justify-center space-x-2 sm:space-x-4">
          {[
            { action: start, disabled: state.isPlaying, active: state.isPlaying, label: 'START', variant: 'success', icon: <Play size={20} /> },
            { action: pause, disabled: !state.isPlaying || state.isPaused, active: state.isPaused, label: 'PAUSA', variant: 'warning', icon: <Pause size={20} /> },
            { action: stop, disabled: !state.isPlaying && !state.isPaused, active: !state.isPlaying && !state.isPaused, label: 'STOP', variant: 'danger', icon: <Square size={20} /> }
          ].map(({ action, disabled, active, label, variant, icon }) => (
            <DeviceButton
              key={label}
              variant={variant as any}
              state={active && !disabled ? 'active' : disabled ? 'disabled' : 'default'}
              onClick={action}
              disabled={disabled}
              icon={icon}
              size="md"
              className="min-w-[80px] sm:min-w-[100px] h-12 sm:h-14 text-xs sm:text-sm"
            >
              {label}
            </DeviceButton>
          ))}
        </div>
      </div>

      {/* Realistic Ambient Sound Toggle Buttons - Responsive */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-3 sm:mb-4">AMBIENTI AUDIO</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
              size="md"
              className="h-10 sm:h-12 min-w-0 whitespace-nowrap text-xs sm:text-sm"
            >
              {label}
            </DeviceButton>
          ))}
        </div>
        
        {/* Ambient levels indicator - Responsive */}
        <div className="mt-3 text-center">
          <div className="font-mono" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'hsl(var(--device-muted))' }}>
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