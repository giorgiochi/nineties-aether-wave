import React from 'react';
import { useNeuroDeck } from '@/hooks/useNeuroDeck';
import { NeuroDeckDisplay } from './NeuroDeckDisplay';
import { NeuroDeckControls } from './NeuroDeckControls';

export const NeuroDeck90: React.FC = () => {
  const neuroDeck = useNeuroDeck();

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-background via-graphite-1 to-graphite-0">
      <div 
        className="relative w-full max-w-sm sm:max-w-lg mx-auto p-3 sm:p-4 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-device)',
          boxShadow: 'var(--shadow-device), var(--shadow-inset)'
        }}
        role="region" 
        aria-label="NeuroDeck 90 dispositivo audio binaurale mobile"
      >
        {/* Device Screws - Responsive */}
        <div 
          className="device-screw absolute" 
          style={{ 
            top: 'clamp(6px, 1.5vw, 8px)', 
            left: 'clamp(6px, 1.5vw, 8px)',
            width: 'clamp(12px, 3vw, 16px)',
            height: 'clamp(12px, 3vw, 16px)'
          }} 
        />
        <div 
          className="device-screw absolute" 
          style={{ 
            top: 'clamp(6px, 1.5vw, 8px)', 
            right: 'clamp(6px, 1.5vw, 8px)',
            width: 'clamp(12px, 3vw, 16px)',
            height: 'clamp(12px, 3vw, 16px)'
          }} 
        />
        <div 
          className="device-screw absolute" 
          style={{ 
            bottom: 'clamp(6px, 1.5vw, 8px)', 
            left: 'clamp(6px, 1.5vw, 8px)',
            width: 'clamp(12px, 3vw, 16px)',
            height: 'clamp(12px, 3vw, 16px)'
          }} 
        />
        <div 
          className="device-screw absolute" 
          style={{ 
            bottom: 'clamp(6px, 1.5vw, 8px)', 
            right: 'clamp(6px, 1.5vw, 8px)',
            width: 'clamp(12px, 3vw, 16px)',
            height: 'clamp(12px, 3vw, 16px)'
          }} 
        />

        {/* Vertical Layout - Mobile Optimized e Responsive */}
        <div className="space-y-3 sm:space-y-4">
          {/* Display Section - Senza wrapper aggiuntivo */}
          <NeuroDeckDisplay neuroDeck={neuroDeck} />

          {/* Controls Section - Senza wrapper aggiuntivo */}
          <NeuroDeckControls neuroDeck={neuroDeck} />
        </div>

        {/* Ventilation Grilles - Responsive */}
        <div 
          className="flex gap-0.5 sm:gap-1 mt-3 sm:mt-4" 
          style={{ height: 'clamp(6px, 1.5vw, 8px)' }}
          aria-hidden="true"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div 
              key={i} 
              className="flex-1 h-full rounded-sm bg-gradient-to-b from-graphite-edge to-graphite-0" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};