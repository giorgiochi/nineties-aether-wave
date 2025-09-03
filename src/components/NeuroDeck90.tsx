import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';
import { NeuroDeckDisplay } from './NeuroDeckDisplay';
import { NeuroDeckControls } from './NeuroDeckControls';

export const NeuroDeck90: React.FC = () => {
  const neuroDeck = useNeuroDeck();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-md mx-auto p-4 rounded-2xl border border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-device)',
          boxShadow: 'var(--shadow-device), var(--shadow-inset)'
        }}
        role="region" 
        aria-label="NeuroDeck 90 dispositivo audio binaurale mobile"
      >
        {/* Device Screws */}
        <div className="device-screw absolute top-2 left-2" />
        <div className="device-screw absolute top-2 right-2" />
        <div className="device-screw absolute bottom-2 left-2" />
        <div className="device-screw absolute bottom-2 right-2" />

        {/* Vertical Layout - Mobile Optimized */}
        <div className="space-y-4">
          {/* Display Section */}
          <section 
            className="p-3 rounded-xl border border-graphite-edge"
            style={{ 
              background: 'var(--gradient-panel)',
              boxShadow: 'var(--shadow-inset)'
            }}
          >
            <NeuroDeckDisplay neuroDeck={neuroDeck} />
          </section>

          {/* Controls Section */}
          <section 
            className="p-3 rounded-xl border border-graphite-edge"
            style={{ 
              background: 'var(--gradient-panel)',
              boxShadow: 'var(--shadow-inset)'
            }}
          >
            <NeuroDeckControls neuroDeck={neuroDeck} />
          </section>
        </div>

        {/* Ventilation Grilles */}
        <div className="flex gap-1 mt-4 h-2" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div 
              key={i} 
              className="flex-1 h-full rounded bg-gradient-to-b from-graphite-edge to-graphite-0" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};