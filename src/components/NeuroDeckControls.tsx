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

      {/* Ultra-Realistic Volume Knob - Responsive */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-3 sm:mb-4">VOLUME MASTER</h3>
        <div className="flex flex-col items-center space-y-4">
          
          {/* Manopola realistica anni '90 hi-fi - Responsive */}
          <div className="relative" style={{ width: 'clamp(120px, 30vw, 144px)', height: 'clamp(120px, 30vw, 144px)' }}>
            
            {/* Incasso nella scocca */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 80% 80% at 50% 50%, 
                    hsl(var(--graphite-edge)) 0%,
                    hsl(var(--graphite-0)) 40%,
                    hsl(var(--graphite-1)) 100%
                  )
                `,
                boxShadow: `
                  inset 0 4px 8px rgba(0,0,0,0.6),
                  inset 0 8px 16px rgba(0,0,0,0.4)
                `
              }}
            />
            
            {/* Scala numerica esterna (0-10) - Responsive */}
            <div className="absolute inset-0">
              {Array.from({ length: 11 }, (_, i) => {
                const angle = (i * 27) - 135;
                const number = i;
                const radius = 'clamp(60px, 15vw, 72px)';
                return (
                  <div key={i}>
                    {/* Tacche spesse */}
                    <div
                      className="absolute bg-device-text opacity-90"
                      style={{
                        width: 'clamp(2px, 0.8vw, 3px)',
                        height: 'clamp(8px, 2.5vw, 12px)',
                        top: 'clamp(6px, 1.5vw, 8px)',
                        left: '50%',
                        transformOrigin: `50% ${radius}`,
                        transform: `translateX(-50%) rotate(${angle}deg)`,
                        borderRadius: '1px'
                      }}
                    />
                    {/* Numeri ben spaziati */}
                    <div
                      className="absolute font-bold text-device-text"
                      style={{
                        fontSize: 'clamp(10px, 2.5vw, 14px)',
                        top: 'clamp(18px, 4vw, 22px)',
                        left: '50%',
                        transformOrigin: `50% calc(${radius} - 12px)`,
                        transform: `translateX(-50%) rotate(${angle}deg)`,
                        opacity: 0.9
                      }}
                    >
                      {number}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Manopola principale con bordo metallico */}
            <div 
              className="absolute cursor-pointer rounded-full"
              style={{
                inset: 'clamp(12px, 3vw, 16px)',
                background: `
                  conic-gradient(from 45deg,
                    hsl(var(--graphite-highlight)) 0deg,
                    hsl(var(--graphite-3)) 60deg,
                    hsl(var(--graphite-2)) 120deg,
                    hsl(var(--graphite-1)) 180deg,
                    hsl(var(--graphite-2)) 240deg,
                    hsl(var(--graphite-3)) 300deg,
                    hsl(var(--graphite-highlight)) 360deg
                  ),
                  radial-gradient(ellipse 70% 70% at 40% 40%, 
                    hsl(var(--graphite-shine)) 0%,
                    hsl(var(--graphite-highlight)) 20%,
                    hsl(var(--graphite-3)) 50%,
                    hsl(var(--graphite-2)) 80%,
                    hsl(var(--graphite-edge)) 100%
                  )
                `,
                border: '2px solid hsl(var(--graphite-edge))',
                boxShadow: `
                  inset 0 0 0 1px rgba(255,255,255,0.15),
                  inset 0 3px 6px rgba(255,255,255,0.1),
                  inset 0 -3px 6px rgba(0,0,0,0.4),
                  0 6px 12px rgba(0,0,0,0.4),
                  0 12px 24px rgba(0,0,0,0.3),
                  0 0 0 1px rgba(0,0,0,0.1)
                `,
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
              
              {/* Texture metallica satinata */}
              <div 
                className="absolute rounded-full opacity-20 pointer-events-none"
                style={{
                  inset: 'clamp(6px, 1.5vw, 8px)',
                  background: `
                    repeating-conic-gradient(
                      from 0deg,
                      rgba(255,255,255,0.1) 0deg,
                      rgba(255,255,255,0.1) 1deg,
                      transparent 1deg,
                      transparent 3deg
                    ),
                    radial-gradient(circle at 50% 50%,
                      rgba(255,255,255,0.05) 0%,
                      transparent 60%
                    )
                  `
                }}
              />
              
              {/* Display digitale integrato al centro */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div 
                  className="rounded font-mono font-bold"
                  style={{
                    padding: 'clamp(4px, 2vw, 16px) clamp(8px, 3vw, 16px)',
                    fontSize: 'clamp(14px, 4vw, 18px)',
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
                      0 0 12px hsl(140, 90%, 70%)22,
                      0 0 0 1px rgba(0,0,0,0.3)
                    `
                  }}
                >
                  {Math.round(state.masterVolume * 100)}%
                </div>
              </div>
              
              {/* Riflesso principale per effetto lucido */}
              <div 
                className="absolute rounded-full opacity-15 pointer-events-none"
                style={{
                  top: 'clamp(8px, 2vw, 12px)',
                  left: 'clamp(8px, 2vw, 12px)',
                  width: 'clamp(20px, 6vw, 32px)',
                  height: 'clamp(20px, 6vw, 32px)',
                  background: 'radial-gradient(ellipse 60% 60% at 30% 30%, rgba(255,255,255,0.9), transparent 70%)'
                }}
              />
              
              {/* Riflessi secondari per realismo */}
              <div 
                className="absolute rounded-full opacity-10 pointer-events-none"
                style={{
                  top: 'clamp(20px, 5vw, 24px)',
                  right: 'clamp(12px, 3vw, 16px)',
                  width: 'clamp(8px, 2vw, 12px)',
                  height: 'clamp(8px, 2vw, 12px)',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 60%)'
                }}
              />
              
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