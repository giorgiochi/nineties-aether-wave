interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  activeMode: string;
  ambientVolume: number; // Master volume for ambient sounds
  neuralVolume: number; // Master volume for neural sounds
  binauralVolume: number; // Deprecated - kept for compatibility
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
  neuralVolume: number;
  ambientVolume: number;
}

interface AmbientSource {
  element: HTMLAudioElement;
  source: MediaElementAudioSourceNode | null;
  gain: GainNode | null;
  isActive: boolean;
}

class AudioManagerSingleton {
  private static instance: AudioManagerSingleton;
  
  // Web Audio API Core
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private neuralChain: GainNode | null = null;
  private ambientChain: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  
  // Neural Audio (Binaural Beats)
  private binauralNodes: { 
    left: OscillatorNode | null; 
    right: OscillatorNode | null; 
    gain: GainNode | null 
  } = { left: null, right: null, gain: null };
  
  // Ambient Audio Sources
  private ambientSources: {
    brown: AmbientSource | null;
    pink: AmbientSource | null;  
    rain: AmbientSource | null;
    ocean: AmbientSource | null;
  } = { brown: null, pink: null, rain: null, ocean: null };
  
  // Timer and State
  private timer: NodeJS.Timeout | null = null;
  private endTime: number | null = null;
  private listeners: ((state: AudioState) => void)[] = [];
  
  private state: AudioState = {
    isPlaying: false,
    isPaused: false,
    activeMode: 'CONCENTRAZIONE',
    ambientVolume: 0.65, // Master ambient volume - increased for better audibility
    neuralVolume: 0.35,  // Master neural volume - increased significantly
    binauralVolume: 0.35, // Deprecated - kept for compatibility
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
    CONCENTRAZIONE: () => ({ beat: 16.0, carrier: 220, neuralVolume: 0.35, ambientVolume: 0.65 }),
    ADHD: () => ({ beat: 13.0, carrier: 210, neuralVolume: 0.38, ambientVolume: 0.63 }),
    STRESS: () => ({ beat: 10.0, carrier: 190, neuralVolume: 0.32, ambientVolume: 0.61 }),
    'NO THOUGHTS': () => ({ beat: 8.0, carrier: 190, neuralVolume: 0.30, ambientVolume: 0.59 })
  };

  constructor() {
    this.loadState();
    this.setupGlobalRefs();
    this.setupVisibilityHandlers();
    this.setupMediaSession();
    this.createAmbientElements();
  }

  static getInstance(): AudioManagerSingleton {
    if (!AudioManagerSingleton.instance) {
      AudioManagerSingleton.instance = new AudioManagerSingleton();
    }
    return AudioManagerSingleton.instance;
  }

  private setupGlobalRefs() {
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
      this.persistState();
    });
  }

  private handleForeground() {
    console.log('[AudioManager] App in foreground');
    
    if (this.state.isPlaying && this.state.userUnlockedAudio) {
      setTimeout(() => this.resumeAll(), 100);
    }
  }

  private handleBackground() {
    console.log('[AudioManager] App in background - soft pause timers only');
    this.softPauseTimersOnly();
  }

  private softPauseTimersOnly() {
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

  private createAmbientElements() {
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
      audio.volume = 0; // Will be controlled by Web Audio gain
      
      audio.addEventListener('error', (e) => {
        console.error(`[AudioManager] Error loading ${key}:`, e);
      });

      audio.addEventListener('canplaythrough', () => {
        console.log(`[AudioManager] ${key} loaded and ready`);
      });

      this.ambientSources[key as keyof typeof this.ambientSources] = {
        element: audio,
        source: null,
        gain: null,
        isActive: false
      };
    });
  }

  private async ensureAudioContext(): Promise<boolean> {
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create audio routing chain: sources -> chains -> master -> limiter -> output
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 1.0;
        
        this.neuralChain = this.audioCtx.createGain();
        this.neuralChain.gain.value = this.mapVolume(this.state.neuralVolume);
        
        this.ambientChain = this.audioCtx.createGain(); 
        this.ambientChain.gain.value = this.mapVolume(this.state.ambientVolume);
        
        // Limiter to prevent clipping
        this.limiter = this.audioCtx.createDynamicsCompressor();
        this.limiter.threshold.value = -6;
        this.limiter.knee.value = 0;
        this.limiter.ratio.value = 12;
        this.limiter.attack.value = 0.003;
        this.limiter.release.value = 0.25;
        
        // Connect the audio chain
        this.neuralChain.connect(this.masterGain);
        this.ambientChain.connect(this.masterGain);
        this.masterGain.connect(this.limiter);
        this.limiter.connect(this.audioCtx.destination);
        
        // Setup ambient sources with Web Audio integration
        await this.setupAmbientSources();
        
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

  private async setupAmbientSources() {
    if (!this.audioCtx || !this.ambientChain) return;

    Object.entries(this.ambientSources).forEach(([key, ambientSource]) => {
      if (ambientSource && !ambientSource.source) {
        try {
          // Create MediaElementAudioSourceNode for better Web Audio integration
          ambientSource.source = this.audioCtx!.createMediaElementSource(ambientSource.element);
          
          // Create individual gain node for this ambient source
          ambientSource.gain = this.audioCtx!.createGain();
          ambientSource.gain.gain.value = 0; // Start muted
          
          // Connect: source -> individual gain -> ambient chain
          ambientSource.source.connect(ambientSource.gain);
          ambientSource.gain.connect(this.ambientChain!);
          
          console.log(`[AudioManager] ${key} connected to Web Audio chain`);
        } catch (error) {
          console.error(`[AudioManager] Failed to setup ${key} source:`, error);
        }
      }
    });
  }

  private smoothGain(param: AudioParam, target: number, seconds: number = 0.3) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(target, now, Math.max(0.03, seconds / 5));
  }

  // Non-linear volume mapping for better responsiveness at low levels
  private mapVolume(sliderValue: number): number {
    // Quadratic curve: ensures 10% slider gives ~1% actual volume (audible)
    // and provides smooth scaling to 100%
    return Math.pow(sliderValue, 1.8);
  }

  private async startBinaural(beat: number, carrier: number) {
    if (!this.audioCtx || !this.neuralChain) return;

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
    gain.connect(this.neuralChain);

    leftOsc.start();
    rightOsc.start();

    // Use the current neural volume with proper mapping
    this.smoothGain(gain.gain, this.mapVolume(this.state.neuralVolume), 2.5);

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

  private updateAmbientGains() {
    // Only update gain values, never trigger playback
    Object.entries(this.ambientSources).forEach(([key, ambientSource]) => {
      if (ambientSource?.gain) {
        const volumeKey = `${key}Volume` as keyof AudioState;
        const individualVolume = this.state[volumeKey] as number;
        ambientSource.gain.gain.value = individualVolume;
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

  // PUBLIC API

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
    
    // Ensure audio is unlocked
    if (!this.state.userUnlockedAudio) {
      const unlocked = await this.unlockAudio();
      if (!unlocked) return false;
    }

    await this.ensureAudioContext();
    if (!this.audioCtx) return false;
    
    await this.audioCtx.resume();
    
    // Start neural audio (binaural beats)
    if (!this.binauralNodes.left) {
      const preset = this.presets[this.state.activeMode]();
      await this.startBinaural(preset.beat, preset.carrier);
    }
    
    // Update gain values (but don't start ambient sounds automatically)
    this.updateAmbientGains();
    
    // Start timer
    this.startTimer();
    
    this.setState({ 
      isPlaying: true, 
      isPaused: false, 
      lastActiveTime: Date.now() 
    });

    // Only resume ambient sounds that were previously active
    this.resumeActiveAmbientSounds();
    
    return true;
  }

  pause() {
    console.log('[AudioManager] Pausing session...');
    
    if (this.audioCtx?.state === 'running') {
      this.audioCtx.suspend();
    }
    
    // Pause ambient elements
    Object.values(this.ambientSources).forEach(ambientSource => {
      if (ambientSource?.element && !ambientSource.element.paused) {
        ambientSource.element.pause();
      }
    });
    
    this.setState({ isPlaying: false, isPaused: true });
  }

  stop() {
    console.log('[AudioManager] Stopping session...');
    
    this.stopBinaural();
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // Stop and reset ambient elements
    Object.values(this.ambientSources).forEach(ambientSource => {
      if (ambientSource?.element) {
        ambientSource.element.pause();
        ambientSource.element.currentTime = 0;
        ambientSource.isActive = false;
      }
    });
    
    this.setState({ 
      isPlaying: false, 
      isPaused: false, 
      timeLeft: 0 
    });
  }

  private resumeActiveAmbientSounds() {
    Object.entries(this.ambientSources).forEach(([key, ambientSource]) => {
      if (ambientSource && ambientSource.isActive) {
        const volumeKey = `${key}Volume` as keyof AudioState;
        const volume = this.state[volumeKey] as number;
        if (volume > 0 && this.state.isPlaying) {
          ambientSource.element.play().catch(e => 
            console.warn(`[AudioManager] Could not resume ${key}:`, e)
          );
        }
      }
    });
  }

  resumeAll() {
    console.log('[AudioManager] Resuming all audio...');
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    this.resumeActiveAmbientSounds();
    
    if (this.state.isPlaying && !this.timer) {
      this.startTimer();
    }
  }

  // VOLUME CONTROLS - PURE GAIN ADJUSTMENT, NO PLAYBACK SIDE EFFECTS

  setAmbientVolume(volume: number) {
    this.setState({ ambientVolume: volume });
    if (this.ambientChain) {
      const mappedVolume = this.mapVolume(volume);
      this.smoothGain(this.ambientChain.gain, mappedVolume, 0.1);
    }
  }

  setNeuralVolume(volume: number) {
    this.setState({ neuralVolume: volume });
    const mappedVolume = this.mapVolume(volume);
    
    if (this.neuralChain) {
      this.smoothGain(this.neuralChain.gain, mappedVolume, 0.1);
    }
    // Update binaural gain if active
    if (this.binauralNodes.gain) {
      this.smoothGain(this.binauralNodes.gain.gain, mappedVolume, 0.1);
    }
  }

  setBinauralVolume(volume: number) {
    // Deprecated - redirect to neural volume for compatibility
    console.warn('[AudioManager] setBinauralVolume is deprecated, use setNeuralVolume');
    this.setNeuralVolume(volume);
  }

  // AMBIENT SOUND ACTIVATION - EXPLICIT USER CONTROL

  setAmbientSoundActive(type: 'brown' | 'pink' | 'rain' | 'ocean', volume: number) {
    const volumeKey = `${type}Volume` as keyof AudioState;
    this.setState({ [volumeKey]: volume } as Partial<AudioState>);
    
    const ambientSource = this.ambientSources[type];
    if (!ambientSource) return;

    if (volume > 0) {
      // Activate ambient sound
      ambientSource.isActive = true;
      if (ambientSource.gain) {
        ambientSource.gain.gain.value = volume;
      }
      
      // Start playing if session is active
      if (this.state.isPlaying && this.state.userUnlockedAudio) {
        ambientSource.element.play().catch(e => 
          console.warn(`[AudioManager] Could not play ${type}:`, e)
        );
      }
    } else {
      // Deactivate ambient sound
      ambientSource.isActive = false;
      if (ambientSource.gain) {
        ambientSource.gain.gain.value = 0;
      }
      ambientSource.element.pause();
    }
  }

  // PRESETS

  applyPreset(mode: string) {
    console.log(`[AudioManager] Applying preset: ${mode}`);
    const config = this.presets[mode]?.();
    if (!config) return;

    this.setState({
      activeMode: mode,
      neuralVolume: config.neuralVolume,
      ambientVolume: config.ambientVolume
    });

    // Update gain nodes with proper volume mapping
    if (this.neuralChain) {
      this.smoothGain(this.neuralChain.gain, this.mapVolume(config.neuralVolume), 0.2);
    }
    if (this.ambientChain) {
      this.smoothGain(this.ambientChain.gain, this.mapVolume(config.ambientVolume), 0.2);
    }

    // Update binaural beats if active
    if (this.state.isPlaying && this.audioCtx?.state === 'running') {
      this.startBinaural(config.beat, config.carrier);
    }
  }

  setDuration(hours: number) {
    this.setState({ duration: hours });
  }

  // STATE MANAGEMENT

  private setState(updates: Partial<AudioState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.persistState();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  private persistState() {
    const stateToSave = {
      activeMode: this.state.activeMode,
      ambientVolume: this.state.ambientVolume,
      neuralVolume: this.state.neuralVolume,
      brownVolume: this.state.brownVolume,
      pinkVolume: this.state.pinkVolume,
      rainVolume: this.state.rainVolume,
      oceanVolume: this.state.oceanVolume,
      duration: this.state.duration,
      userUnlockedAudio: this.state.userUnlockedAudio
    };
    localStorage.setItem('audioManagerState', JSON.stringify(stateToSave));
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('audioManagerState');
      const userUnlocked = localStorage.getItem('userUnlockedAudio') === 'true';
      
      if (saved) {
        const parsedState = JSON.parse(saved);
        this.state = {
          ...this.state,
          ...parsedState,
          userUnlockedAudio: userUnlocked,
          isPlaying: false,
          isPaused: false
        };
      } else {
        this.state.userUnlockedAudio = userUnlocked;
      }
    } catch (error) {
      console.error('[AudioManager] Failed to load state:', error);
    }
  }

  // PUBLIC GETTERS

  getState(): AudioState {
    return { ...this.state };
  }

  subscribe(listener: (state: AudioState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  needsUserInteraction(): boolean {
    return !this.state.userUnlockedAudio;
  }

  canAutoResume(): boolean {
    return this.state.userUnlockedAudio && this.audioCtx?.state !== 'suspended';
  }
}

export const AudioManager = AudioManagerSingleton.getInstance();
export type { AudioState, AudioPreset };