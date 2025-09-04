import React, { useState, useEffect } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import { NeuroDeckDisplay } from './NeuroDeckDisplay';
import { NeuroDeckControls } from './NeuroDeckControls';
import { AudioUnlockPrompt } from './AudioUnlockPrompt';

export const NeuroDeck90: React.FC = () => {
  const neuroDeck = useAudioManager();
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);

  // Check if unlock prompt needs to be shown
  useEffect(() => {
    const checkUnlockNeeded = () => {
      if (neuroDeck.needsUserInteraction()) {
        // Show prompt only if user tries to do something that requires audio
        // For now, we don't show it automatically
      }
    };

    checkUnlockNeeded();
  }, [neuroDeck.state.isPlaying]);

  const handleUnlock = async () => {
    console.log('[NeuroDeck90] Attempting to unlock audio');
    const success = await neuroDeck.unlockAudio();
    if (success) {
      setShowUnlockPrompt(false);
      // If it had tried to start, retry now
      if (neuroDeck.state.isPlaying) {
        neuroDeck.start();
      }
    }
    return success;
  };

  const handleStart = async (): Promise<boolean> => {
    if (neuroDeck.needsUserInteraction()) {
      console.log('[NeuroDeck90] Need user interaction, showing unlock prompt');
      setShowUnlockPrompt(true);
      return false;
    }
    
    const success = await neuroDeck.start();
    return success;
  };

  // Override neuroDeck to intercept start
  const neuroDeckWithUnlock = {
    ...neuroDeck,
    start: handleStart
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-background via-graphite-1 to-graphite-0">
      <div 
        className="relative w-full max-w-sm sm:max-w-lg mx-auto p-3 sm:p-4 rounded-2xl border-2 border-graphite-edge device-texture"
        style={{ 
          background: 'var(--gradient-device)',
          boxShadow: 'var(--shadow-device), var(--shadow-inset)'
        }}
        role="region" 
        aria-label="NeuroDeck 90 binaural audio device mobile"
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

        {/* Vertical Layout - Mobile Optimized and Responsive */}
        <div className="space-y-3 sm:space-y-4">
          {/* Display Section - No additional wrapper */}
          <NeuroDeckDisplay neuroDeck={neuroDeckWithUnlock} />

          {/* Controls Section - No additional wrapper */}
          <NeuroDeckControls neuroDeck={neuroDeckWithUnlock} />
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

      {/* Footer */}
      <div className="mt-6 text-center max-w-lg">
        <p 
          className="text-xs text-device-muted leading-relaxed"
          style={{ opacity: 0.8 }}
        >
          Developed by Giorgio Chiriatti – Audiopsyco is not a medical device.<br />
          If you experience attention or stress-related issues, we recommend consulting a qualified doctor.
        </p>
      </div>

      {/* Audio Unlock Prompt */}
      <AudioUnlockPrompt
        isVisible={showUnlockPrompt}
        onUnlock={handleUnlock}
        onClose={() => setShowUnlockPrompt(false)}
      />
    </div>
  );
};