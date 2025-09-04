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
      'INTRUSIVE_OFF': 'QUIET'
    };
    return modeMap[mode] || mode;
  };

  const getBeatFrequency = (mode: string): number => {
    const beatMap: Record<string, number> = {
      'CONCENTRAZIONE': 16.0,
      'ADHD': 13.0,
      'STRESS': 10.0,
      'INTRUSIVE_OFF': 8.0
    };
    return beatMap[mode] || 16.0;
  };

  const getState = (): string => {
    if (state.isPlaying) return 'IN RIPRODUZIONE';
    if (state.isPaused) return 'IN PAUSA';
    return 'PRONTO';
  };

  const getSafetyStatus = (): string => {
    return state.masterVolume > 0.7 ? 'ATTENZIONE' : 'OK';
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
    const volumes = [state.oceanVolume, state.rainVolume, state.pinkVolume, state.brownVolume];
    const activeVolumes = volumes.filter(v => v > 0);
    if (activeVolumes.length === 0) return 0;
    return Math.max(...activeVolumes);
  };

  const vuLevel = Math.min(100, Math.round(state.masterVolume * 100));

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
            className="relative w-full h-full p-3 sm:p-4 rounded-sm overflow-visible"
            style={{ 
              minHeight: 'clamp(120px, 25vw, 160px)',
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
            {/* Layout modulare con griglia perfettamente centrata e responsive */}
            <div 
              className="h-full w-full text-tft text-tft-dim"
              style={{
                display: 'grid',
                gridTemplateRows: '1fr auto auto 1fr',
                gridTemplateColumns: '1fr',
                gap: 'clamp(4px, 2vw, 8px)',
                padding: 'clamp(4px, 2vw, 8px)'
              }}
            >
              
              {/* Riga 1: Timer principale centrato */}
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  className="font-mono font-bold leading-none mb-1"
                  style={{
                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 6px hsl(var(--lcd-green-soft) / 0.5)',
                    fontFamily: 'monospace'
                  }}
                >
                  {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
                </div>
                <div 
                  className="uppercase tracking-wider"
                  style={{
                    fontSize: 'clamp(0.5rem, 2vw, 0.75rem)',
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                  }}
                >
                  ── TEMPO SESSIONE ──
                </div>
              </div>

              {/* Riga 2: Modalità */}
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  className="font-mono font-bold leading-none mb-1"
                  style={{
                    fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
                    color: 'hsl(var(--lcd-green-soft))',
                    textShadow: '0 0 4px hsl(var(--lcd-green-soft) / 0.5)'
                  }}
                >
                  {getModeName(state.activeMode)}
                </div>
                <div 
                  className="uppercase tracking-wider"
                  style={{
                    fontSize: 'clamp(0.4rem, 1.5vw, 0.6rem)',
                    color: 'hsl(var(--lcd-green-dim))',
                    textShadow: '0 0 3px hsl(var(--lcd-green-dim) / 0.4)'
                  }}
                >
                  MODALITÀ
                </div>
              </div>

              {/* Riga 3: Indicatori Volume */}
              <div 
                className="grid grid-cols-1 gap-2 text-center"
                style={{
                  gap: 'clamp(4px, 2vw, 8px)'
                }}
              >
                {/* Volume Neurale */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2 mb-1">
                    <div 
                      className="font-mono font-bold leading-none"
                      style={{
                        fontSize: 'clamp(0.6rem, 2.5vw, 0.8rem)',
                        color: 'hsl(var(--lcd-green-soft))',
                        textShadow: '0 0 3px hsl(var(--lcd-green-soft) / 0.4)'
                      }}
                    >
                      VOLUME NEURALE: {Math.round(state.neuralVolume * 100)}%
                    </div>
                  </div>
                  {/* Mini progress bar neurale */}
                  <div 
                    className="w-full h-1 rounded-full border border-opacity-30"
                    style={{
                      maxWidth: '120px',
                      backgroundColor: 'hsl(var(--lcd-bg-center))',
                      borderColor: 'hsl(var(--lcd-green-dim))'
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.round(state.neuralVolume * 100)}%`,
                        backgroundColor: 'hsl(var(--lcd-green-soft))',
                        boxShadow: '0 0 2px hsl(var(--lcd-green-soft) / 0.6)'
                      }}
                    />
                  </div>
                </div>

                {/* Volume Ambienti */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2 mb-1">
                    <div 
                      className="font-mono font-bold leading-none"
                      style={{
                        fontSize: 'clamp(0.6rem, 2.5vw, 0.8rem)',
                        color: isAmbientEnabled() ? 'hsl(var(--lcd-green-soft))' : 'hsl(var(--lcd-green-dim))',
                        textShadow: isAmbientEnabled() ? '0 0 3px hsl(var(--lcd-green-soft) / 0.4)' : '0 0 2px hsl(var(--lcd-green-dim) / 0.3)'
                      }}
                    >
                      {isAmbientEnabled() ? 
                        `VOLUME AMBIENTI: ${Math.round(getAmbientVolume() * 100)}%` : 
                        'AMBIENTI: OFF'
                      }
                    </div>
                  </div>
                  {/* Mini progress bar ambienti */}
                  <div 
                    className="w-full h-1 rounded-full border border-opacity-30"
                    style={{
                      maxWidth: '120px',
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
                        boxShadow: isAmbientEnabled() ? '0 0 2px hsl(var(--lcd-green-soft) / 0.6)' : 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

               {/* Riga 3: Status indicator con omino animato e ambiente */}
               <div className="flex flex-col items-center justify-center space-y-1">
                 
                 {/* Prima riga: Stato sessione con omino */}
                 <div className="flex items-center justify-center space-x-2">
                   <div 
                     className="uppercase tracking-wider font-mono font-bold"
                     style={{
                       fontSize: 'clamp(0.6rem, 2.5vw, 0.8rem)',
                       color: 'hsl(var(--lcd-green-soft))',
                       textShadow: '0 0 3px hsl(var(--lcd-green-soft) / 0.4)'
                     }}
                   >
                     {state.isPlaying && !state.isPaused ? 'RUNNING' : 
                      state.isPaused ? 'PAUSED' : 'READY'}
                   </div>
                   
                   {/* Omino LCD animato - Stile minimale anni '90 */}
                   <div 
                     className="relative flex items-center justify-center"
                     style={{
                       width: 'clamp(16px, 4vw, 20px)',
                       height: 'clamp(12px, 3vw, 16px)'
                     }}
                   >
                     <div 
                       className="font-mono font-bold leading-none select-none"
                       style={{
                         fontSize: 'clamp(8px, 2vw, 10px)',
                         color: 'hsl(var(--lcd-green-dim))',
                         textShadow: '0 0 2px hsl(var(--lcd-green-dim) / 0.3)',
                         fontFamily: 'monospace',
                         animation: state.isPlaying && !state.isPaused ? 'pulse 1.5s ease-in-out infinite' : 'none'
                       }}
                     >
                       {state.isPlaying && !state.isPaused ? '►' : '■'}
                     </div>
                   </div>
                 </div>
                 
                 {/* Seconda riga: Ambiente attivo */}
                 <div 
                   className="uppercase tracking-wider font-mono"
                   style={{
                     fontSize: 'clamp(0.45rem, 1.8vw, 0.6rem)',
                     color: 'hsl(var(--lcd-green-dim))',
                     textShadow: '0 0 2px hsl(var(--lcd-green-dim) / 0.3)'
                   }}
                 >
                   Ambient: {getActiveAmbient()}
                 </div>
                 
               </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};