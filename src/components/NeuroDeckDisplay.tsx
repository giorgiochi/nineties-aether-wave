import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';

interface NeuroDeckDisplayProps {
  neuroDeck: ReturnType<typeof useNeuroDeck>;
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

  const vuLevel = Math.min(100, Math.round(state.masterVolume * 100));

  return (
    <div 
      className="p-4 rounded-2xl border-2 border-graphite-edge device-texture"
      style={{ 
        background: `
          radial-gradient(ellipse at center, hsl(var(--graphite-2)), hsl(var(--graphite-0))),
          var(--gradient-panel)
        `,
        boxShadow: 'var(--shadow-inset)'
      }}
    >
      {/* Authentic LCD Bezel - Exact match to reference */}
      <div 
        className="relative p-1 rounded-lg"
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
        {/* LCD Screen - Esatta come nella reference */}
        <div 
          className="relative p-4 rounded-md overflow-hidden"
          style={{ 
            height: '280px',
            background: '#000000',
            border: '2px solid #1a1a1a',
            boxShadow: 'inset 0 0 0 1px #0a0a0a'
          }}
          aria-live="polite"
        >
          {/* Layout esatto della reference */}
          <div className="text-tft h-full flex flex-col justify-center space-y-6 py-4">
            
            {/* Timer principale - Grande e centrato */}
            <div className="text-center">
              <div 
                className="text-6xl font-mono font-bold mb-3"
                style={{
                  color: '#00ff41',
                  textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
                  fontFamily: 'monospace'
                }}
              >
                {state.timeLeft > 0 ? formatTime(state.timeLeft) : formatTime(state.duration * 3600)}
              </div>
              <div 
                className="text-sm uppercase tracking-wider"
                style={{
                  color: '#00aa2b',
                  textShadow: '0 0 5px #00aa2b'
                }}
              >
                ── TEMPO SESSIONE ──
              </div>
            </div>

            {/* Griglia modalità e volume - Come nella reference */}
            <div className="grid grid-cols-2 gap-12 text-center px-8">
              <div>
                <div 
                  className="text-2xl font-mono font-bold mb-1"
                  style={{
                    color: '#00ff41',
                    textShadow: '0 0 8px #00ff41'
                  }}
                >
                  {getModeName(state.activeMode)}
                </div>
                <div 
                  className="text-sm uppercase tracking-wider opacity-80"
                  style={{
                    color: '#00aa2b',
                    textShadow: '0 0 5px #00aa2b'
                  }}
                >
                  MODALITÀ
                </div>
              </div>
              <div>
                <div 
                  className="text-2xl font-mono font-bold mb-1"
                  style={{
                    color: '#00ff41',
                    textShadow: '0 0 8px #00ff41'
                  }}
                >
                  {Math.round(state.masterVolume * 100).toString().padStart(3, '0')}%
                </div>
                <div 
                  className="text-sm uppercase tracking-wider opacity-80"
                  style={{
                    color: '#00aa2b',
                    textShadow: '0 0 5px #00aa2b'
                  }}
                >
                  VOLUME
                </div>
              </div>
            </div>

            {/* Indicatori di stato - Come nella reference */}
            <div className="flex justify-center space-x-8 text-sm">
              <span 
                className={`flex items-center space-x-2`}
                style={{
                  color: state.isPlaying ? '#00ff41' : '#004412',
                  textShadow: state.isPlaying ? '0 0 8px #00ff41' : 'none'
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: state.isPlaying ? '#00ff41' : '#004412',
                  boxShadow: state.isPlaying ? '0 0 6px #00ff41' : 'none'
                }}></span>
                <span>PLAY</span>
              </span>
              <span 
                className={`flex items-center space-x-2`}
                style={{
                  color: state.isPaused ? '#00ff41' : '#004412',
                  textShadow: state.isPaused ? '0 0 8px #00ff41' : 'none'
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: state.isPaused ? '#00ff41' : '#004412',
                  boxShadow: state.isPaused ? '0 0 6px #00ff41' : 'none'
                }}></span>
                <span>PAUSA</span>
              </span>
              <span 
                className={`flex items-center space-x-2 ${state.masterVolume > 0.7 ? 'animate-pulse' : ''}`}
                style={{
                  color: state.masterVolume > 0.7 ? '#00ff41' : '#004412',
                  textShadow: state.masterVolume > 0.7 ? '0 0 8px #00ff41' : 'none'
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: state.masterVolume > 0.7 ? '#00ff41' : '#004412',
                  boxShadow: state.masterVolume > 0.7 ? '0 0 6px #00ff41' : 'none'
                }}></span>
                <span>WARN</span>
              </span>
            </div>

            {/* VU Meter - Come nella reference */}
            <div className="px-8">
              <div 
                className="text-sm uppercase tracking-wider text-center mb-3 opacity-80"
                style={{
                  color: '#00aa2b',
                  textShadow: '0 0 5px #00aa2b'
                }}
              >
                VU METER
              </div>
              <div 
                className="h-4 rounded-sm overflow-hidden relative border"
                style={{ 
                  backgroundColor: '#000',
                  borderColor: '#004412'
                }}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full border-r"
                    style={{
                      left: `${i * 5}%`,
                      width: '4.5%',
                      backgroundColor: i * 5 <= vuLevel ? '#00ff41' : '#002210',
                      borderRightColor: '#001a08',
                      boxShadow: i * 5 <= vuLevel ? '0 0 4px #00ff41' : 'none',
                      transition: 'all 0.1s ease'
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};