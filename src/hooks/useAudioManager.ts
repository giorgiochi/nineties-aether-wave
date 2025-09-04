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
    updateMasterVolume: (volume: number) => AudioManager.setMasterVolume(volume),
    updateAmbientMasterVolume: (volume: number) => AudioManager.setNeuralVolume(volume),
    updateBinauralVolume: (volume: number) => AudioManager.setBinauralVolume(volume),
    updateAmbientVolume: (type: 'brown' | 'pink' | 'rain' | 'ocean', volume: number) => 
      AudioManager.setAmbientVolume(type, volume),
    
    // Preset e configurazione
    applyPreset: (mode: string) => AudioManager.applyPreset(mode),
    updateDuration: (hours: number) => AudioManager.setDuration(hours),
    
    // Metodi legacy per compatibilità
    muteAmbient: () => {
      AudioManager.setAmbientVolume('brown', 0);
      AudioManager.setAmbientVolume('pink', 0);
      AudioManager.setAmbientVolume('rain', 0);
      AudioManager.setAmbientVolume('ocean', 0);
    },
    
    resetAmbient: () => {
      AudioManager.setAmbientVolume('brown', 0);
      AudioManager.setAmbientVolume('pink', 0);
      AudioManager.setAmbientVolume('rain', 0);
      AudioManager.setAmbientVolume('ocean', 0);
    },

    // Nuovi metodi specifici per mobile
    unlockAudio: () => AudioManager.unlockAudio(),
    needsUserInteraction: () => AudioManager.needsUserInteraction(),
    canAutoResume: () => AudioManager.canAutoResume()
  };
}