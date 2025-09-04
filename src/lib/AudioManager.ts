interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  activeMode: string;
  masterVolume: number; // Per ambientali
  neuralVolume: number; // Per onde binaurali
  binauralVolume: number;
  brownVolume: number;
  pinkVolume: number;
  rainVolume: number;
  oceanVolume: number;
  duration: number;
  timeLeft: number;
  userUnlockedAudio: boolean;
  lastActiveTime: number;
}

interface AudioPreset {
  beat: number;
  carrier: number;
  bVol: number;
  master: number;
}

class AudioManagerSingleton {
  private static instance: AudioManagerSingleton;
  
  // Audio Context Globale
  private audioCtx: AudioContext | null = null;
  private neuralGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  
  // Binaural beats
  private binauralNodes: { left: OscillatorNode | null; right: OscillatorNode | null; gain: GainNode | null } = {
    left: null, right: null, gain: null
  };
  
  // Elementi Audio HTML per ambientali
  private audioElements: {
    brown: HTMLAudioElement | null;
    pink: HTMLAudioElement | null;  
    rain: HTMLAudioElement | null;
    ocean: HTMLAudioElement | null;
  } = { brown: null, pink: null, rain: null, ocean: null };
  
  // Timer e stato
  private timer: NodeJS.Timeout | null = null;
  private endTime: number | null = null;
  private listeners: ((state: AudioState) => void)[] = [];
  
  private state: AudioState = {
    isPlaying: false,
    isPaused: false,
    activeMode: 'CONCENTRAZIONE',
    masterVolume: 0.85,
    neuralVolume: 0.18,
    binauralVolume: 0.18,
    brownVolume: 0.00,
    pinkVolume: 0.00,
    rainVolume: 0.00,
    oceanVolume: 0.00,
    duration: 3,
    timeLeft: 0,
    userUnlockedAudio: false,
    lastActiveTime: 0
  };

  private presets: Record<string, () => AudioPreset> = {
    CONCENTRAZIONE: () => ({ beat: 16.0, carrier: 220, bVol: 0.18, master: 0.70 }),
    ADHD: () => ({ beat: 13.0, carrier: 210, bVol: 0.20, master: 0.68 }),
    STRESS: () => ({ beat: 10.0, carrier: 200, bVol: 0.16, master: 0.66 }),
    INTRUSIVE_OFF: () => ({ beat: 8.0, carrier: 190, bVol: 0.16, master: 0.64 })
  };

  constructor() {
    this.loadState();
    this.setupGlobalRefs();
    this.setupVisibilityHandlers();
    this.setupMediaSession();
    this.createAudioElements();
  }

  static getInstance(): AudioManagerSingleton {
    if (!AudioManagerSingleton.instance) {
      AudioManagerSingleton.instance = new AudioManagerSingleton();
    }
    return AudioManagerSingleton.instance;
  }

  private setupGlobalRefs() {
    // Riferimenti globali per debug e persistenza
    (window as any).__audioCtx = this.audioCtx;
    (window as any).__audioMgr = this;
  }

  private setupVisibilityHandlers() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handleForeground();
      } else {
        this.handleBackground();
      }
    });

    window.addEventListener('pageshow', (e) => {
      console.log('[AudioManager] PageShow event', e.persisted);
      this.handleForeground();
    });

    window.addEventListener('pagehide', () => {
      console.log('[AudioManager] PageHide event');
      this.persistState();
    });

    window.addEventListener('beforeunload', () => {
      this.persistState();
    });
  }

  private handleForeground() {
    console.log('[AudioManager] App in foreground');
    this.audioCtx?.resume();
    
    // Auto-riprendi se era in riproduzione e audio è sbloccato
    if (this.state.isPlaying && this.state.userUnlockedAudio) {
      setTimeout(() => this.resumeAll(), 100);
    }
  }

  private handleBackground() {
    console.log('[AudioManager] App in background - soft pause timers only');
    // Non fermiamo l'audio, solo i timer UI
    this.softPauseTimersOnly();
  }

  private softPauseTimersOnly() {
    // Ferma solo il countdown timer, non l'audio
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'NeuroWave Session',
        artist: 'NeuroDeck 90s',
        album: 'Focus & Ambient Sounds'
      });

      navigator.mediaSession.setActionHandler('play', () => {
        console.log('[MediaSession] Play requested');
        this.start();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        console.log('[MediaSession] Pause requested');
        this.pause();
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        console.log('[MediaSession] Stop requested');
        this.stop();
      });
    }
  }

  private createAudioElements() {
    const audioFiles = [
      { key: 'brown', src: '/AREOPORTO.mp3' },
      { key: 'pink', src: '/FORESTA.mp3' },
      { key: 'rain', src: '/PIOGGIA.mp3' },
      { key: 'ocean', src: '/OCEANO.mp3' }
    ];

    audioFiles.forEach(({ key, src }) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.setAttribute('playsinline', 'true');
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = 0; // Inizia muto, sarà controllato dai gain
      
      // Gestione errori
      audio.addEventListener('error', (e) => {
        console.error(`[AudioManager] Error loading ${key}:`, e);
      });

      audio.addEventListener('canplaythrough', () => {
        console.log(`[AudioManager] ${key} loaded and ready`);
      });

      this.audioElements[key as keyof typeof this.audioElements] = audio;
    });
  }

  private async ensureAudioContext(): Promise<boolean> {
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Gain per onde neurali
        this.neuralGain = this.audioCtx.createGain();
        this.neuralGain.gain.value = this.state.neuralVolume;
        
        // Gain per ambientali
        this.ambientGain = this.audioCtx.createGain(); 
        this.ambientGain.gain.value = this.state.masterVolume;
        
        // Limiter comune
        this.limiter = this.audioCtx.createDynamicsCompressor();
        this.limiter.threshold.value = -6;
        this.limiter.knee.value = 0;
        this.limiter.ratio.value = 12;
        this.limiter.attack.value = 0.003;
        this.limiter.release.value = 0.25;
        
        // Collegamento: neural + ambient → limiter → output
        this.neuralGain.connect(this.limiter);
        this.ambientGain.connect(this.limiter);
        this.limiter.connect(this.audioCtx.destination);
        
        // Riferimento globale aggiornato
        (window as any).__audioCtx = this.audioCtx;
        
        console.log('[AudioManager] AudioContext initialized');
        return true;
      } catch (error) {
        console.error('[AudioManager] Failed to create AudioContext:', error);
        return false;
      }
    }
    return true;
  }

  private smoothGain(param: AudioParam, target: number, seconds: number = 0.3) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(target, now, Math.max(0.03, seconds / 5));
  }

  private async startBinaural(beat: number, carrier: number) {
    if (!this.audioCtx || !this.neuralGain) return;

    this.stopBinaural(true);

    const leftOsc = this.audioCtx.createOscillator();
    const rightOsc = this.audioCtx.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(carrier, this.audioCtx.currentTime);
    rightOsc.frequency.setValueAtTime(carrier + beat, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.0001;

    const leftPanner = this.audioCtx.createStereoPanner();
    leftPanner.pan.value = -1;
    const rightPanner = this.audioCtx.createStereoPanner();
    rightPanner.pan.value = 1;

    leftOsc.connect(leftPanner).connect(gain);
    rightOsc.connect(rightPanner).connect(gain);
    gain.connect(this.neuralGain);

    leftOsc.start();
    rightOsc.start();

    this.smoothGain(gain.gain, this.state.binauralVolume, 2.5);

    this.binauralNodes = { left: leftOsc, right: rightOsc, gain };
  }

  private stopBinaural(fast = false) {
    if (this.binauralNodes.left && this.audioCtx) {
      const gain = this.binauralNodes.gain?.gain;
      if (gain) {
        this.smoothGain(gain, 0.0001, fast ? 0.2 : 2.5);
      }
      const stopTime = this.audioCtx.currentTime + (fast ? 0.25 : 2.6);
      try {
        this.binauralNodes.left.stop(stopTime);
        this.binauralNodes.right?.stop(stopTime);
      } catch (e) {
        // Oscillator already stopped
      }
    }
    this.binauralNodes = { left: null, right: null, gain: null };
  }

  private updateAmbientVolumes() {
    // Aggiorna volumi degli elementi <audio>
    Object.entries(this.audioElements).forEach(([key, audio]) => {
      if (audio) {
        const volumeKey = `${key}Volume` as keyof AudioState;
        const individualVolume = this.state[volumeKey] as number;
        const masterVolume = this.state.masterVolume;
        audio.volume = individualVolume * masterVolume;
      }
    });
  }

  private startTimer() {
    if (this.timer) clearInterval(this.timer);
    
    this.endTime = Date.now() + this.state.duration * 3600 * 1000;
    
    this.timer = setInterval(() => {
      if (this.endTime) {
        const left = Math.max(0, Math.floor((this.endTime - Date.now()) / 1000));
        this.setState({ timeLeft: left });
        
        if (left === 0) {
          this.stop();
        }
      }
    }, 200);
  }

  // API Pubblica

  async unlockAudio(): Promise<boolean> {
    console.log('[AudioManager] Unlocking audio...');
    
    const success = await this.ensureAudioContext();
    if (!success) return false;

    try {
      if (this.audioCtx!.state === 'suspended') {
        await this.audioCtx!.resume();
      }
      
      this.setState({ userUnlockedAudio: true });
      localStorage.setItem('userUnlockedAudio', 'true');
      
      console.log('[AudioManager] Audio unlocked successfully');
      return true;
    } catch (error) {
      console.error('[AudioManager] Failed to unlock audio:', error);
      return false;
    }
  }

  async start(): Promise<boolean> {
    console.log('[AudioManager] Starting session...');
    
    // Sblocca audio al primo Start se necessario
    if (!this.state.userUnlockedAudio) {
      const unlocked = await this.unlockAudio();
      if (!unlocked) return false;
    }

    await this.ensureAudioContext();
    if (!this.audioCtx) return false;
    
    await this.audioCtx.resume();
    
    // Avvia onde binaurali
    if (!this.binauralNodes.left) {
      const preset = this.presets[this.state.activeMode]();
      await this.startBinaural(preset.beat, preset.carrier);
    }
    
    // Aggiorna volumi ambientali
    this.updateAmbientVolumes();
    
    // Avvia timer
    this.startTimer();
    
    this.setState({ 
      isPlaying: true, 
      isPaused: false, 
      lastActiveTime: Date.now() 
    });

    // Ensure ambient elements with volume > 0 actually play
    this.resumeAll();
    
    return true;
  }

  pause() {
    console.log('[AudioManager] Pausing session...');
    
    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
    
    // Pausa elementi audio
    Object.values(this.audioElements).forEach(audio => {
      if (audio && !audio.paused) {
        audio.pause();
      }
    });
    
    this.setState({ isPlaying: false, isPaused: true });
  }

  stop() {
    console.log('[AudioManager] Stopping session...');
    
    this.stopBinaural();
    
    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
    
    // Ferma elementi audio
    Object.values(this.audioElements).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.endTime = null;
    
    this.setState({ 
      isPlaying: false, 
      isPaused: false, 
      timeLeft: 0 
    });
  }

  resumeAll() {
    console.log('[AudioManager] Resuming all audio...');
    
    if (!this.state.userUnlockedAudio) return;
    
    this.audioCtx?.resume();
    
    // Riprendi elementi audio che erano in play
    Object.entries(this.audioElements).forEach(([key, audio]) => {
      if (audio) {
        const volumeKey = `${key}Volume` as keyof AudioState;
        const volume = this.state[volumeKey] as number;
        if (volume > 0 && this.state.isPlaying) {
          audio.play().catch(e => console.warn(`[AudioManager] Could not resume ${key}:`, e));
        }
      }
    });
    
    // Riavvia timer se necessario
    if (this.state.isPlaying && !this.timer) {
      this.startTimer();
    }
  }

  // Controlli Volume

  setMasterVolume(volume: number) {
    this.setState({ masterVolume: volume });
    if (this.ambientGain) {
      this.ambientGain.gain.value = volume;
    }
    this.updateAmbientVolumes();
  }

  setNeuralVolume(volume: number) {
    this.setState({ neuralVolume: volume });
    if (this.neuralGain) {
      this.neuralGain.gain.value = volume;
    }
  }

  setBinauralVolume(volume: number) {
    this.setState({ binauralVolume: volume });
    if (this.binauralNodes.gain) {
      this.smoothGain(this.binauralNodes.gain.gain, volume, 0.4);
    }
  }

  setAmbientVolume(type: 'brown' | 'pink' | 'rain' | 'ocean', volume: number) {
    const volumeKey = `${type}Volume` as keyof AudioState;
    this.setState({ [volumeKey]: volume } as Partial<AudioState>);
    
    const audio = this.audioElements[type];
    if (audio) {
      const masterVolume = this.state.masterVolume;
      audio.volume = volume * masterVolume;
      
      // Auto-play/pause basato su volume
      if (volume > 0 && this.state.isPlaying && this.state.userUnlockedAudio) {
        audio.play().catch(e => console.warn(`[AudioManager] Could not play ${type}:`, e));
      } else if (volume === 0) {
        audio.pause();
      }
    }
  }

  applyPreset(mode: string) {
    console.log('[AudioManager] Applying preset:', mode);
    
    const preset = this.presets[mode];
    if (!preset) return;
    
    const config = preset();
    
    this.setState({
      activeMode: mode,
      neuralVolume: config.master,
      binauralVolume: config.bVol
    });

    // Aggiorna onde binaurali se in riproduzione
    if (this.state.isPlaying && this.audioCtx?.state === 'running') {
      this.startBinaural(config.beat, config.carrier);
    }
  }

  setDuration(hours: number) {
    this.setState({ duration: hours });
  }

  // Gestione Stato

  private setState(updates: Partial<AudioState>) {
    this.state = { ...this.state, ...updates };
    this.persistState();
    this.notifyListeners();
  }

  private persistState() {
    const stateToSave = {
      ...this.state,
      userUnlockedAudio: localStorage.getItem('userUnlockedAudio') === 'true'
    };
    localStorage.setItem('audioManagerState', JSON.stringify(stateToSave));
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('audioManagerState');
      const userUnlocked = localStorage.getItem('userUnlockedAudio') === 'true';
      
      if (saved) {
        const savedState = JSON.parse(saved);
        this.state = { 
          ...this.state, 
          ...savedState, 
          userUnlockedAudio: userUnlocked,
          isPlaying: false, // Non auto-riprendi al caricamento
          isPaused: false
        };
      } else {
        this.state.userUnlockedAudio = userUnlocked;
      }
      
      console.log('[AudioManager] State loaded:', this.state);
    } catch (e) {
      console.warn('[AudioManager] Could not load saved state:', e);
    }
  }

  getState(): AudioState {
    return { ...this.state };
  }

  subscribe(listener: (state: AudioState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (e) {
        console.error('[AudioManager] Listener error:', e);
      }
    });
  }

  // Utility
  needsUserInteraction(): boolean {
    return !this.state.userUnlockedAudio;
  }

  canAutoResume(): boolean {
    return this.state.userUnlockedAudio && this.state.isPlaying;
  }
}

export const AudioManager = AudioManagerSingleton.getInstance();
export type { AudioState, AudioPreset };