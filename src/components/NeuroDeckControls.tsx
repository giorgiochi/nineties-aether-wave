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
          
          {/* Manopola realistica anni '90 */}
          <div className="relative w-32 h-32">
            
            {/* Base della manopola con scala numerica */}
            <div className="absolute inset-0 rounded-full">
              {/* Scala numerica esterna */}
              {Array.from({ length: 11 }, (_, i) => {
                const angle = (i * 27) - 135; // Da -135° a +135°
                const isMainMark = i % 2 === 0;
                const number = i;
                return (
                  <div key={i}>
                    {/* Tacche della scala */}
                    <div
                      className="absolute bg-device-text"
                      style={{
                        width: isMainMark ? '3px' : '2px',
                        height: isMainMark ? '8px' : '5px',
                        top: isMainMark ? '4px' : '6px',
                        left: '50%',
                        transformOrigin: '50% 60px',
                        transform: `translateX(-50%) rotate(${angle}deg)`,
                        opacity: isMainMark ? 0.9 : 0.6
                      }}
                    />
                    {/* Numeri della scala */}
                    {isMainMark && (
                      <div
                        className="absolute text-xs font-bold text-device-text"
                        style={{
                          top: '-2px',
                          left: '50%',
                          transformOrigin: '50% 68px',
                          transform: `translateX(-50%) rotate(${angle}deg)`,
                          opacity: 0.8
                        }}
                      >
                        {number}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Manopola principale */}
            <div 
              className="absolute inset-2 rounded-full cursor-pointer"
              style={{
                background: `
                  radial-gradient(ellipse 60% 60% at 35% 35%, 
                    hsl(var(--graphite-highlight)) 0%,
                    hsl(var(--graphite-3)) 25%,
                    hsl(var(--graphite-2)) 50%,
                    hsl(var(--graphite-1)) 75%,
                    hsl(var(--graphite-edge)) 100%
                  ),
                  conic-gradient(from 45deg,
                    rgba(255,255,255,0.1) 0deg,
                    rgba(255,255,255,0.05) 90deg,
                    rgba(0,0,0,0.1) 180deg,
                    rgba(0,0,0,0.05) 270deg,
                    rgba(255,255,255,0.1) 360deg
                  )
                `,
                border: '2px solid hsl(var(--graphite-edge))',
                boxShadow: `
                  inset 0 0 0 1px rgba(255,255,255,0.1),
                  inset 0 2px 4px rgba(0,0,0,0.3),
                  inset 0 -2px 4px rgba(255,255,255,0.05),
                  0 4px 8px rgba(0,0,0,0.3),
                  0 8px 16px rgba(0,0,0,0.2)
                `,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
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
              
              {/* Texture satinata */}
              <div 
                className="absolute inset-1 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: `
                    repeating-conic-gradient(
                      from 0deg,
                      rgba(255,255,255,0.02) 0deg,
                      rgba(255,255,255,0.02) 2deg,
                      transparent 2deg,
                      transparent 4deg
                    )
                  `
                }}
              />
              
              {/* Lancetta interna verde */}
              <div 
                className="absolute w-1 h-8 top-4 left-1/2 z-10 rounded-full"
                style={{
                  background: `
                    linear-gradient(180deg, 
                      hsl(140, 80%, 70%) 0%, 
                      hsl(140, 65%, 45%) 50%,
                      hsl(140, 50%, 35%) 100%
                    )
                  `,
                  transform: `translateX(-50%) rotate(${(state.masterVolume - 0.5) * 270}deg)`,
                  transformOrigin: '50% 360%',
                  boxShadow: `
                    0 0 6px hsl(140, 65%, 45%),
                    0 0 3px hsl(140, 65%, 45%),
                    inset 0 1px 1px rgba(255,255,255,0.3)
                  `,
                  border: '0.5px solid rgba(0,0,0,0.3)'
                }}
              />
              
              {/* Display digitale al centro */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div 
                  className="px-3 py-1 rounded-md font-mono text-sm font-bold"
                  style={{
                    background: `
                      linear-gradient(145deg, 
                        hsl(120 50% 8%) 0%, 
                        hsl(120 40% 6%) 50%, 
                        hsl(120 30% 4%) 100%
                      )
                    `,
                    color: 'hsl(140, 80%, 65%)',
                    textShadow: `
                      0 0 4px hsl(140, 80%, 65%),
                      0 0 2px hsl(140, 80%, 65%)
                    `,
                    border: '1px solid hsl(120, 30%, 15%)',
                    boxShadow: `
                      inset 0 1px 2px rgba(0,0,0,0.8),
                      inset 0 -1px 1px rgba(255,255,255,0.02),
                      0 0 8px hsl(140, 80%, 65%)22
                    `
                  }}
                >
                  {Math.round(state.masterVolume * 100).toString().padStart(2, '0')}%
                </div>
              </div>
              
              {/* Riflesso centrale realistico */}
              <div 
                className="absolute top-2 left-2 w-4 h-4 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%)'
                }}
              />
              
            </div>
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