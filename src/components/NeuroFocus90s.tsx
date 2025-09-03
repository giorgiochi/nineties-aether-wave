import React from 'react';
import { useAudio } from '@/hooks/useAudio';
import { TFTDisplay } from './TFTDisplay';
import { DeviceControls } from './DeviceControls';

export const NeuroFocus90s: React.FC = () => {
  const audio = useAudio();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-6xl p-6 rounded-3xl border border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-device)',
          boxShadow: 'var(--shadow-device), var(--shadow-inset)'
        }}
        role="region" 
        aria-label="NeuroFocus 90s binaural audio device"
      >
        {/* Device Screws */}
        <div className="device-screw absolute top-3 left-3" />
        <div className="device-screw absolute top-3 right-3" />
        <div className="device-screw absolute bottom-3 left-3" />
        <div className="device-screw absolute bottom-3 right-3" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: TFT Display */}
          <section 
            className="p-4 rounded-2xl border border-graphite-edge"
            style={{ 
              background: 'var(--gradient-panel)',
              boxShadow: 'var(--shadow-inset)'
            }}
          >
            <TFTDisplay audio={audio} />
          </section>

          {/* Right Panel: Controls */}
          <section 
            className="p-4 rounded-2xl border border-graphite-edge"
            style={{ 
              background: 'var(--gradient-panel)',
              boxShadow: 'var(--shadow-inset)'
            }}
          >
            <DeviceControls audio={audio} />
            
            {/* Ventilation Grilles */}
            <div className="flex gap-1.5 mt-4 h-2.5" aria-hidden="true">
              {Array.from({ length: 18 }, (_, i) => (
                <div 
                  key={i} 
                  className="flex-1 h-full rounded bg-gradient-to-b from-graphite-edge to-graphite-0" 
                />
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-xs text-device-muted">
              SMR 13 Hz, Beta 16 e 19 Hz, Gamma 40 Hz. Usa cuffie per il binaurale.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};