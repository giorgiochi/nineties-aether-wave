import React from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';

interface NeuroDeckDisplayProps {
  neuroDeck: ReturnType<typeof useAudioManager>;
}

export const NeuroDeckDisplay: React.FC<NeuroDeckDisplayProps> = ({ neuroDeck }) => {
  const { state } = neuroDeck;

  const formatTime = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getModeName = (mode: string): string => {
    const modeMap: Record<string, string> = {
      'CONCENTRAZIONE': 'FOCUS',
      'ADHD': 'ADHD',
      'STRESS': 'RELAX',
      'NO THOUGHTS': 'NO THOUGHTS'
    };
    return modeMap[mode] || mode;
  };

  const getBeatFrequency = (mode: string): number => {
    const beatMap: Record<string, number> = {
      'CONCENTRAZIONE': 16.0,
      'ADHD': 13.0,
      'STRESS': 10.0,
      'NO THOUGHTS': 8.0
    };
    return beatMap[mode] || 16.0;
  };

  const getState = (): string => {
    if (state.isPlaying) return 'IN RIPRODUZIONE';
    if (state.isPaused) return 'IN PAUSA';
    return 'PRONTO';
  };

  const getSafetyStatus = (): string => {
    return state.ambientVolume > 0.7 ? 'ATTENZIONE' : 'OK';
  };

  const getAmbientStatus = (): string => {
    return `BRW ${state.brownVolume.toFixed(2)} PNK ${state.pinkVolume.toFixed(2)} RNG ${state.rainVolume.toFixed(2)} OCN ${state.oceanVolume.toFixed(2)}`;
  };

  const getActiveAmbient = (): string => {
    const activeAmbients = [];
    if (state.oceanVolume > 0) activeAmbients.push('Ocean');
    if (state.rainVolume > 0) activeAmbients.push('Rain');
    if (state.pinkVolume > 0) activeAmbients.push('Forest');
    if (state.brownVolume > 0) activeAmbients.push('Airport');
    
    if (activeAmbients.length === 0) return 'OFF';
    if (activeAmbients.length === 1) return activeAmbients[0];
    if (activeAmbients.length === 2) return activeAmbients.join('+');
    return `${activeAmbients.length} Mix`;
  };

  const isAmbientEnabled = (): boolean => {
    return state.oceanVolume > 0 || state.rainVolume > 0 || state.pinkVolume > 0 || state.brownVolume > 0;
  };

  const getAmbientVolume = (): number => {
    return state.ambientVolume;
  };

  const vuLevel = Math.min(100, Math.round(state.ambientVolume * 100));

  return (
    <div 
      className="w-full max-w-sm mx-auto p-2 sm:p-3 rounded-2xl border-2 border-graphite-edge device-texture"
      style={{ 
        background: `
          radial-gradient(ellipse at center, hsl(var(--graphite-2)), hsl(var(--graphite-0))),
          var(--gradient-panel)
        `,
        boxShadow: 'var(--shadow-inset)'
      }}
    >
      {/* Cornice LCD esterna minimale */}
      <div 
        className="relative h-full w-full p-1 rounded-lg"
        style={{ 
          background: `
            linear-gradient(145deg, 
              hsl(120 15% 12%) 0%, 
              hsl(120 20% 8%) 50%, 
              hsl(120 25% 5%) 100%
            )
          `,
          boxShadow: `
            inset 0 1px 2px rgba(0,0,0,0.8),
            inset 0 -1px 0 rgba(255,255,255,0.05)
          `
        }}
      >
        {/* Incasso minimale per il vetro LCD */}
        <div 
          className="relative h-full w-full p-1 rounded-md"
          style={{ 
            background: `
              linear-gradient(145deg, 
                hsl(120 10% 6%) 0%, 
                hsl(120 15% 4%) 50%, 
                hsl(120 20% 2%) 100%
              )
            `,
            boxShadow: `
              inset 0 2px 4px rgba(0,0,0,0.9),
              inset 0 4px 8px rgba(0,0,0,0.7),
              inset 0 -1px 0 rgba(255,255,255,0.02)
            `
          }}
        >
          {/* Vetro LCD - Riempie tutto il contenitore */}
          <div 
            className="relative w-full h-full rounded-sm overflow-visible"
            style={{ 
              minHeight: 'clamp(80px, 15vw, 100px)', // Molto più compatto
              padding: 'clamp(8px, 2vw, 12px)', // Padding ridotto
              background: `
                repeating-linear-gradient(
                  0deg,
                  hsl(var(--lcd-bg)) 0px,
                  hsl(var(--lcd-bg)) 1px,
                  hsl(var(--lcd-bg-center)) 1px,
                  hsl(var(--lcd-bg-center)) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  hsl(var(--lcd-bg)) 0px,
                  hsl(var(--lcd-bg)) 1px,
                  hsl(var(--lcd-bg-center)) 1px,
                  hsl(var(--lcd-bg-center)) 2px
                ),
                radial-gradient(120% 100% at 50% 45%, hsl(var(--lcd-bg-center)), hsl(var(--lcd-bg)))
              `,
              border: '1px solid hsl(var(--graphite-3))',
              boxShadow: `
                inset 0 1px 2px rgba(0,0,0,0.6),
                inset 0 0 0 1px rgba(0,0,0,0.3)
              `
            }}
            aria-live="polite"
          >
            {/* Layout centrato e bilanciato */}
            <div 
              className="h-full w-full text-tft text-tft-dim relative flex flex-col justify-center items-center"
              style={{
                padding: 'clamp(8px, 2.5vw, 12px)',
                fontFamily: '"Press Start 2P", "Courier New", monospace',
                letterSpacing: '0.2px',
                lineHeight: '1.2',
                gap: 'clamp(10px, 3vw, 14px)'
              }}
            >
              
              {/* Header - Audio Psyco ver.1 in alto a sinistra */}
              <div 
                className="absolute top-2 left-2"
                style={{
                  fontSize: 'clamp(0.25rem, 0.6vw, 0.32rem)',
                  color: 'hsl(var(--lcd-green-dim))',
                  textShadow: '0 0 1px hsl(var(--lcd-green-dim) / 0.3)'
                }}
              >
                Audio Psyco ver.1
              </div>

              {/* Modalità neurale */}
              <div className="text-center">
                <div 
                  className="leading-none"
                  style={{
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 2px hsl(var(--lcd-green-soft) / 0.5)'
                  }}
                >
                  {getModeName(state.activeMode)}
                </div>
              </div>

              {/* Timer */}
              <div className="text-center">
                <div 
                  className="leading-none"
                  style={{
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 2px hsl(var(--lcd-green-soft) / 0.5)'
                  }}
                 >
                   {formatTime(state.elapsedTime)}
                 </div>
              </div>

              {/* Volumi orizzontali */}
              <div 
                className="flex justify-between w-full"
                style={{
                  maxWidth: '220px',
                  gap: 'clamp(16px, 4vw, 24px)'
                }}
              >
                {/* Volume Neurale */}
                <div className="text-center">
                  <div 
                    className="leading-none"
                    style={{
                      fontSize: 'clamp(0.4rem, 1.0vw, 0.5rem)',
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 1px hsl(var(--lcd-green-soft) / 0.4)',
                      marginBottom: '4px'
                    }}
                  >
                    NEURAL: {Math.round(state.neuralVolume * 100)}%
                  </div>
                  {/* Progress bar neurale */}
                  <div 
                    className="h-1 rounded-full border border-opacity-30 mx-auto"
                    style={{
                      width: '60px',
                      backgroundColor: 'hsl(var(--lcd-bg-center))',
                      borderColor: 'hsl(var(--lcd-green-dim))'
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.round(state.neuralVolume * 100)}%`,
                        backgroundColor: 'hsl(var(--lcd-green-soft))',
                        boxShadow: '0 0 1px hsl(var(--lcd-green-soft) / 0.6)'
                      }}
                    />
                  </div>
                </div>

                {/* Volume Ambienti */}
                <div className="text-center">
                  <div 
                    className="leading-none"
                    style={{
                      fontSize: 'clamp(0.4rem, 1.0vw, 0.5rem)',
                      color: isAmbientEnabled() ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-dim))',
                      textShadow: isAmbientEnabled() ? '0 0 1px hsl(var(--lcd-green-soft) / 0.4)' : '0 0 1px hsl(var(--lcd-green-dim) / 0.3)',
                      marginBottom: '4px'
                    }}
                  >
                    {isAmbientEnabled() ? 
                      `AMBIENT: ${Math.round(getAmbientVolume() * 100)}%` : 
                      'AMBIENT: OFF'
                    }
                  </div>
                  {/* Progress bar ambienti */}
                  <div 
                    className="h-1 rounded-full border border-opacity-30 mx-auto"
                    style={{
                      width: '60px',
                      backgroundColor: 'hsl(var(--lcd-bg-center))',
                      borderColor: 'hsl(var(--lcd-green-dim))',
                      opacity: isAmbientEnabled() ? 1 : 0.3
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: isAmbientEnabled() ? `${Math.round(getAmbientVolume() * 100)}%` : '0%',
                        backgroundColor: 'hsl(var(--lcd-green-soft))',
                        boxShadow: isAmbientEnabled() ? '0 0 1px hsl(var(--lcd-green-soft) / 0.6)' : 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status e Info ambientali - riga orizzontale */}
              <div 
                className="flex justify-between items-center w-full"
                style={{
                  maxWidth: '220px',
                  gap: 'clamp(12px, 3vw, 20px)'
                }}
              >
                {/* Status sessione con icone */}
                <div className="flex items-center space-x-2">
                  <div 
                    className="uppercase tracking-wider"
                    style={{
                      fontSize: 'clamp(0.5rem, 1.3vw, 0.7rem)',
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 2px hsl(var(--lcd-green-soft) / 0.5)'
                    }}
                  >
                    {state.isPlaying && !state.isPaused ? 'RUNNING' : 
                     state.isPaused ? 'PAUSED' : 'READY'}
                  </div>
                  
                  {/* Icona LCD animata */}
                  <div 
                    className="leading-none select-none"
                    style={{
                      fontSize: 'clamp(0.5rem, 1.3vw, 0.7rem)',
                      color: 'hsl(var(--lcd-green-soft))',
                      textShadow: '0 0 2px hsl(var(--lcd-green-soft) / 0.5)',
                      animation: state.isPlaying && !state.isPaused ? 'pulse 1.5s ease-in-out infinite' : 'none'
                    }}
                  >
                    {state.isPlaying && !state.isPaused ? '►' : '■'}
                  </div>
                </div>

                {/* Info ambientali */}
                <div 
                  className="uppercase tracking-wider text-right"
                  style={{
                    fontSize: 'clamp(0.35rem, 0.9vw, 0.45rem)',
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 1px hsl(var(--lcd-green-dim) / 0.3)'
                  }}
                >
                  AMB: {getActiveAmbient()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};