import { useState, useEffect } from 'react';
import { AudioManager, AudioState } from '@/lib/AudioManager';

export function useAudioManager() {
  const [state, setState] = useState<AudioState>(AudioManager.getState());

  useEffect(() => {
    // Sottoscrizione ai cambiamenti di stato
    const unsubscribe = AudioManager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // API wrapper per compatibilità con l'interfaccia precedente
  return {
    state,
    
    // Controlli principali
    start: () => AudioManager.start(),
    pause: () => AudioManager.pause(),
    stop: () => AudioManager.stop(),
    
    // Controlli volume
    updateAmbientVolume: (volume: number) => AudioManager.setAmbientVolume(volume),
    updateNeuralVolume: (volume: number) => AudioManager.setNeuralVolume(volume),
    updateBinauralVolume: (volume: number) => AudioManager.setBinauralVolume(volume),
    updateAmbientSound: (type: 'brown' | 'pink' | 'rain' | 'ocean', volume: number) => 
      AudioManager.setAmbientSoundActive(type, volume),
    
    // Preset e configurazione
    applyPreset: (mode: string) => AudioManager.applyPreset(mode),
    updateDuration: (hours: number) => AudioManager.setDuration(hours),
    
    // Metodi legacy per compatibilità
    muteAmbient: () => {
      AudioManager.setAmbientSoundActive('brown', 0);
      AudioManager.setAmbientSoundActive('pink', 0);
      AudioManager.setAmbientSoundActive('rain', 0);
      AudioManager.setAmbientSoundActive('ocean', 0);
    },
    
    resetAmbient: () => {
      AudioManager.setAmbientSoundActive('brown', 0);
      AudioManager.setAmbientSoundActive('pink', 0);
      AudioManager.setAmbientSoundActive('rain', 0);
      AudioManager.setAmbientSoundActive('ocean', 0);
    },

    // Nuovi metodi specifici per mobile
    unlockAudio: () => AudioManager.unlockAudio(),
    needsUserInteraction: () => AudioManager.needsUserInteraction(),
    canAutoResume: () => AudioManager.canAutoResume()
  };
}