import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';
import { DeviceButton } from '@/components/ui/device-button';
import { Brain, Shield, Zap, Moon, Play, Pause, Square, Waves, Cloud, TreePine, Plane } from 'lucide-react';

interface NeuroDeckControlsProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
}

export const NeuroDeckControls: React.FC<NeuroDeckControlsProps> = ({ neuroDeck }) => {
  const { state, start, pause, stop, applyPreset, updateMasterVolume, updateAmbientMasterVolume, updateAmbientVolume } = neuroDeck;

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

      {/* Volume Slider - Vintage LCD Segments */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          
          {/* Vintage LCD Segment Slider */}
          <div className="w-full max-w-xs relative">
            
            {/* Label e Percentuale integrata */}
            <div className="flex justify-between items-center mb-2">
              <span className="label-serigraph text-xs">VOLUME MASTER</span>
              <span 
                className="font-mono font-bold"
                style={{
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: 'hsl(var(--lcd-green-dim))',
                  textShadow: '0 0 2px hsl(var(--lcd-green-dim) / 0.3)'
                }}
              >
                {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
              </span>
            </div>
            
            {/* Slider Track Container - Incassato */}
            <div 
              className="relative w-full h-8 rounded-sm"
              style={{
                background: `
                  linear-gradient(180deg,
                    hsl(var(--graphite-edge)) 0%,
                    hsl(var(--graphite-0)) 30%,
                    hsl(var(--graphite-1)) 70%,
                    hsl(var(--graphite-edge)) 100%
                  )
                `,
                border: '1px solid hsl(var(--graphite-edge))',
                boxShadow: `
                  inset 0 3px 6px rgba(0,0,0,0.8),
                  inset 0 6px 12px rgba(0,0,0,0.6),
                  inset 0 -1px 2px rgba(255,255,255,0.03)
                `
              }}
            >
              
              {/* Segmenti LED progressivi */}
              <div className="absolute inset-2 flex items-center">
                {Array.from({ length: 20 }, (_, i) => {
                  const segmentValue = (i + 1) / 20;
                  const isActive = state.masterVolume >= segmentValue;
                  return (
                    <div 
                      key={i}
                      className="flex-1 mx-[1px] h-full rounded-[1px]"
                      style={{
                        background: isActive 
                          ? `linear-gradient(180deg,
                              hsl(var(--lcd-green-dim)) 0%,
                              hsl(var(--lcd-green-soft)) 50%,
                              hsl(var(--lcd-green-dim)) 100%
                            )`
                          : `linear-gradient(180deg,
                              hsl(var(--graphite-2)) 0%,
                              hsl(var(--graphite-1)) 100%
                            )`,
                        boxShadow: isActive 
                          ? `
                              inset 0 1px 1px rgba(255,255,255,0.2),
                              0 0 2px hsl(var(--lcd-green-dim) / 0.3)
                            `
                          : `inset 0 1px 1px rgba(0,0,0,0.3)`,
                        opacity: isActive ? 1 : 0.3,
                        transition: 'all 0.15s ease-out'
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Slider Input invisibile */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.masterVolume}
                onChange={(e) => updateMasterVolume(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                aria-label="Volume Master"
              />
              
              {/* Cursore fisico in grafite */}
              <div 
                className="absolute top-0 h-8 w-4 transition-all duration-150 pointer-events-none"
                style={{
                  left: `calc(${state.masterVolume * 100}% - 8px)`,
                  background: `
                    linear-gradient(135deg,
                      hsl(var(--graphite-highlight)) 0%,
                      hsl(var(--graphite-3)) 30%,
                      hsl(var(--graphite-2)) 70%,
                      hsl(var(--graphite-edge)) 100%
                    )
                  `,
                  border: '1px solid hsl(var(--graphite-edge))',
                  borderRadius: '2px',
                  boxShadow: `
                    0 2px 4px rgba(0,0,0,0.4),
                    inset 0 1px 1px rgba(255,255,255,0.1),
                    inset 0 -1px 1px rgba(0,0,0,0.2)
                  `
                }}
              >
                {/* Texture del cursore */}
                <div 
                  className="w-full h-full rounded-[1px] opacity-30"
                  style={{
                    background: `
                      repeating-linear-gradient(
                        90deg,
                        rgba(255,255,255,0.1) 0px,
                        rgba(255,255,255,0.1) 1px,
                        transparent 1px,
                        transparent 2px
                      )
                    `
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Ambientale - Nuovo Slider */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          
          {/* Vintage LCD Segment Slider per Ambientale */}
          <div className="w-full max-w-xs relative">
            
            {/* Label e Percentuale integrata */}
            <div className="flex justify-between items-center mb-2">
              <span className="label-serigraph text-xs">VOLUME AMBIENTALE</span>
              <span 
                className="font-mono font-bold"
                style={{
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: 'hsl(var(--lcd-amber-dim))',
                  textShadow: '0 0 2px hsl(var(--lcd-amber-dim) / 0.3)'
                }}
              >
                {Math.round(state.ambientMasterVolume * 100).toString().padStart(3, '0')}%
              </span>
            </div>
            
            {/* Slider Track Container - Incassato */}
            <div 
              className="relative w-full h-8 rounded-sm"
              style={{
                background: `
                  linear-gradient(180deg,
                    hsl(var(--graphite-edge)) 0%,
                    hsl(var(--graphite-0)) 30%,
                    hsl(var(--graphite-1)) 70%,
                    hsl(var(--graphite-edge)) 100%
                  )
                `,
                border: '1px solid hsl(var(--graphite-edge))',
                boxShadow: `
                  inset 0 3px 6px rgba(0,0,0,0.8),
                  inset 0 6px 12px rgba(0,0,0,0.6),
                  inset 0 -1px 2px rgba(255,255,255,0.03)
                `
              }}
            >
              
              {/* Segmenti LED progressivi - colore ambra */}
              <div className="absolute inset-2 flex items-center">
                {Array.from({ length: 20 }, (_, i) => {
                  const segmentValue = (i + 1) / 20;
                  const isActive = state.ambientMasterVolume >= segmentValue;
                  return (
                    <div 
                      key={i}
                      className="flex-1 mx-[1px] h-full rounded-[1px]"
                      style={{
                        background: isActive 
                          ? `linear-gradient(180deg,
                              hsl(var(--lcd-amber-dim)) 0%,
                              hsl(var(--lcd-amber-soft)) 50%,
                              hsl(var(--lcd-amber-dim)) 100%
                            )`
                          : `linear-gradient(180deg,
                              hsl(var(--graphite-2)) 0%,
                              hsl(var(--graphite-1)) 100%
                            )`,
                        boxShadow: isActive 
                          ? `
                              inset 0 1px 1px rgba(255,255,255,0.2),
                              0 0 2px hsl(var(--lcd-amber-dim) / 0.3)
                            `
                          : `inset 0 1px 1px rgba(0,0,0,0.3)`,
                        opacity: isActive ? 1 : 0.3,
                        transition: 'all 0.15s ease-out'
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Slider Input invisibile */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.ambientMasterVolume}
                onChange={(e) => updateAmbientMasterVolume(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                aria-label="Volume Ambientale"
              />
              
              {/* Cursore fisico in grafite */}
              <div 
                className="absolute top-0 h-8 w-4 transition-all duration-150 pointer-events-none"
                style={{
                  left: `calc(${state.ambientMasterVolume * 100}% - 8px)`,
                  background: `
                    linear-gradient(135deg,
                      hsl(var(--graphite-highlight)) 0%,
                      hsl(var(--graphite-3)) 30%,
                      hsl(var(--graphite-2)) 70%,
                      hsl(var(--graphite-edge)) 100%
                    )
                  `,
                  border: '1px solid hsl(var(--graphite-edge))',
                  borderRadius: '2px',
                  boxShadow: `
                    0 2px 4px rgba(0,0,0,0.4),
                    inset 0 1px 1px rgba(255,255,255,0.1),
                    inset 0 -1px 1px rgba(0,0,0,0.2)
                  `
                }}
              >
                {/* Texture del cursore */}
                <div 
                  className="w-full h-full rounded-[1px] opacity-30"
                  style={{
                    background: `
                      repeating-linear-gradient(
                        90deg,
                        rgba(255,255,255,0.1) 0px,
                        rgba(255,255,255,0.1) 1px,
                        transparent 1px,
                        transparent 2px
                      )
                    `
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Start/Stop Control */}
      <div 
        className="p-3 sm:p-5 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        <h3 className="label-serigraph text-center mb-3 sm:mb-4">CONTROLLO SESSIONE</h3>
        <div className="flex justify-center">
          <DeviceButton
            variant={state.isPlaying || state.isPaused ? 'danger' : 'success'}
            state="default"
            onClick={state.isPlaying || state.isPaused ? stop : start}
            icon={state.isPlaying || state.isPaused ? <Square size={20} /> : <Play size={20} />}
            size="lg"
            className="min-w-[120px] sm:min-w-[140px] h-14 sm:h-16 text-sm sm:text-base"
          >
            {state.isPlaying || state.isPaused ? 'STOP' : 'START'}
          </DeviceButton>
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