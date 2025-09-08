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
  elapsedTime: number; // Changed from timeLeft to elapsedTime
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

interface NeuralSource {
  element: HTMLAudioElement;
  source: MediaElementAudioSourceNode | null;
  gain: GainNode | null;
  mode: string;
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

  // Neural Audio Sources (HTMLAudio for background playback)
  private neuralSources: {
    'NO THOUGHTS': NeuralSource | null;
    'CONCENTRAZIONE': NeuralSource | null;
    'ADHD': NeuralSource | null;  
    'STRESS': NeuralSource | null;
  } = { 'NO THOUGHTS': null, 'CONCENTRAZIONE': null, 'ADHD': null, 'STRESS': null };

  // Dual-layer state
  private isInForeground: boolean = true;
  
  // Timer and State
  private timer: NodeJS.Timeout | null = null;
  private sessionStartTime: number | null = null;
  private listeners: ((state: AudioState) => void)[] = [];
  
  private state: AudioState = {
    isPlaying: false,
    isPaused: false,
    activeMode: 'CONCENTRAZIONE',
    ambientVolume: 0.90, // Master ambient volume - higher default for audibility
    neuralVolume: 0.35,  // Master neural volume
    binauralVolume: 0.35, // Deprecated - kept for compatibility
    brownVolume: 0.00,
    pinkVolume: 0.00,
    rainVolume: 0.00,
    oceanVolume: 0.00,
    duration: 3,
    elapsedTime: 0, // Changed from timeLeft to elapsedTime
    userUnlockedAudio: false,
    lastActiveTime: 0
  };

  private presets: Record<string, () => AudioPreset> = {
    CONCENTRAZIONE: () => ({ beat: 16.0, carrier: 220, neuralVolume: 0.35, ambientVolume: 0.90 }),
    ADHD: () => ({ beat: 13.0, carrier: 210, neuralVolume: 0.38, ambientVolume: 0.88 }),
    STRESS: () => ({ beat: 10.0, carrier: 190, neuralVolume: 0.32, ambientVolume: 0.86 }),
    'NO THOUGHTS': () => ({ beat: 8.0, carrier: 190, neuralVolume: 0.30, ambientVolume: 0.84 })
  };

  constructor() {
    this.loadState();
    this.setupGlobalRefs();
    this.setupVisibilityHandlers();
    this.setupMediaSession();
    console.log('[AudioManager] Creating ambient audio elements...');
    this.createAmbientElements();
    console.log('[AudioManager] Creating neural audio elements...');
    this.createNeuralElements();
    console.log('[AudioManager] AudioManager initialized');
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
    this.isInForeground = true;
    
    if (this.state.isPlaying && this.state.userUnlockedAudio) {
      setTimeout(() => this.resumeAll(), 100);
    }
  }

  private handleBackground() {
    console.log('[AudioManager] App in background - switching to HTML audio');
    this.isInForeground = false;
    this.softPauseTimersOnly();
    
    // Switch neural to HTML audio for background continuity
    if (this.state.isPlaying && this.state.activeMode) {
      this.startNeuralHTMLAudio();
    }
  }

  private softPauseTimersOnly() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private setupMediaSession() {
    if ('mediaSession' in navigator) {
      // Set initial metadata
      this.updateMediaSessionMetadata();

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

  private updateMediaSessionMetadata() {
    if ('mediaSession' in navigator) {
      const mode = this.state.activeMode || 'Audio Psyco';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${mode} Session`,
        artist: 'Audio Psyco',
        album: 'Neuro Focus Session',
        artwork: [
          { src: '/favicon.ico', sizes: '96x96', type: 'image/x-icon' }
        ]
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

    console.log('[AudioManager] Testing audio file accessibility...');
    // Test se i file sono accessibili
    audioFiles.forEach(({ key, src }) => {
      fetch(src, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log(`[AudioManager] ✓ ${key} file accessible at ${src}`);
          } else {
            console.error(`[AudioManager] ✗ ${key} file not accessible: ${response.status} ${response.statusText}`);
          }
        })
        .catch(error => {
          console.error(`[AudioManager] ✗ Failed to check ${key} file:`, error);
        });
    });

    audioFiles.forEach(({ key, src }) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.setAttribute('playsinline', 'true');
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = 1; // Use Web Audio for gain control
      audio.muted = true; // Prevent direct element playback (avoid double audio)
      
      audio.addEventListener('error', (e) => {
        console.error(`[AudioManager] Error loading ${key} from ${src}:`, e);
        console.error(`[AudioManager] Audio error details:`, {
          error: e.error,
          code: audio.error?.code,
          message: audio.error?.message
        });
      });

      audio.addEventListener('canplaythrough', () => {
        console.log(`[AudioManager] ${key} loaded and ready from ${src}`);
      });

      audio.addEventListener('loadstart', () => {
        console.log(`[AudioManager] Started loading ${key} from ${src}`);
      });

      audio.addEventListener('progress', () => {
        console.log(`[AudioManager] Loading progress for ${key}`);
      });

      this.ambientSources[key as keyof typeof this.ambientSources] = {
        element: audio,
        source: null,
        gain: null,
        isActive: false
      };
    });
  }

  private createNeuralElements() {
    const neuralFiles = [
      { mode: 'NO THOUGHTS', src: '/audio/neural-no-thoughts.mp3' },
      { mode: 'CONCENTRAZIONE', src: '/audio/neural-gamma.mp3' },
      { mode: 'ADHD', src: '/audio/neural-gamma.mp3' },
      { mode: 'STRESS', src: '/audio/neural-theta.mp3' }
    ];

    neuralFiles.forEach(({ mode, src }) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.setAttribute('playsinline', 'true');
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = 1; // Use Web Audio for gain control
      audio.muted = true; // Prevent direct element playback (avoid double audio)
      
      audio.addEventListener('error', (e) => {
        console.error(`[AudioManager] Error loading neural ${mode}:`, e);
      });

      audio.addEventListener('canplaythrough', () => {
        console.log(`[AudioManager] Neural ${mode} loaded and ready`);
      });

      this.neuralSources[mode as keyof typeof this.neuralSources] = {
        element: audio,
        source: null,
        gain: null,
        mode,
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
        this.neuralChain.gain.value = this.mapNeuralVolume(this.state.neuralVolume);
        
        this.ambientChain = this.audioCtx.createGain(); 
        this.ambientChain.gain.value = this.mapAmbientVolume(this.state.ambientVolume);
        
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
    if (!this.audioCtx || !this.ambientChain || !this.neuralChain) return;

    // Setup ambient sources
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

    // Setup neural sources
    Object.entries(this.neuralSources).forEach(([mode, neuralSource]) => {
      if (neuralSource && !neuralSource.source) {
        try {
          neuralSource.source = this.audioCtx!.createMediaElementSource(neuralSource.element);
          neuralSource.gain = this.audioCtx!.createGain();
          neuralSource.gain.gain.value = 0; // Start muted
          
          neuralSource.source.connect(neuralSource.gain);
          neuralSource.gain.connect(this.neuralChain!);
          
          console.log(`[AudioManager] Neural ${mode} connected to Web Audio chain`);
        } catch (error) {
          console.error(`[AudioManager] Failed to setup neural ${mode}:`, error);
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

  // Non-linear volume mapping - separate curves per channel
  private mapNeuralVolume(v: number): number {
    // Slightly steeper curve to avoid harshness at low levels
    return Math.pow(v, 1.7);
  }
  private mapAmbientVolume(v: number): number {
    if (v <= 0) return 0;
    const gamma = 1.25; // more audible at low slider values
    const floor = 0.06; // minimum audible floor when > 0
    return floor + (1 - floor) * Math.pow(v, gamma);
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
    this.smoothGain(gain.gain, this.mapNeuralVolume(this.state.neuralVolume), 2.5);

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

  // DUAL-LAYER NEURAL MANAGEMENT

  private startNeuralHTMLAudio() {
    const neuralSource = this.neuralSources[this.state.activeMode as keyof typeof this.neuralSources];
    if (!neuralSource || !this.state.activeMode) return;

    console.log(`[AudioManager] Starting HTML neural audio for ${this.state.activeMode}`);
    
    // Stop all neural elements first
    Object.values(this.neuralSources).forEach(ns => {
      if (ns?.element && !ns.element.paused) {
        ns.element.pause();
        ns.isActive = false;
      }
    });
    
    // Start the current mode
    neuralSource.isActive = true;
    neuralSource.element.volume = this.mapNeuralVolume(this.state.neuralVolume);
    neuralSource.element.play().catch(e => 
      console.warn(`[AudioManager] Could not play neural ${this.state.activeMode}:`, e)
    );
  }

  private stopNeuralHTMLAudio() {
    Object.values(this.neuralSources).forEach(neuralSource => {
      if (neuralSource?.element && !neuralSource.element.paused) {
        neuralSource.element.pause();
        neuralSource.isActive = false;
      }
    });
  }

  private updateNeuralGains() {
    Object.values(this.neuralSources).forEach(neuralSource => {
      if (neuralSource?.gain) {
        const volume = neuralSource.isActive ? this.state.neuralVolume : 0;
        neuralSource.gain.gain.value = this.mapNeuralVolume(volume);
      }
    });
  }

  private updateAmbientGains() {
    // Only update gain values, never trigger playback
    Object.entries(this.ambientSources).forEach(([key, ambientSource]) => {
      if (ambientSource?.gain) {
        const volumeKey = `${key}Volume` as keyof AudioState;
        const individualVolume = this.state[volumeKey] as number;
        ambientSource.gain.gain.value = this.mapAmbientVolume(individualVolume);
      }
    });
  }

  private startTimer() {
    if (this.timer) clearInterval(this.timer);
    
    // Record session start time for elapsed time calculation
    this.sessionStartTime = Date.now();
    
    this.timer = setInterval(() => {
      if (this.sessionStartTime && this.state.isPlaying) {
        const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        this.setState({ elapsedTime: elapsed });
      }
    }, 200);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.sessionStartTime = null;
    this.setState({ elapsedTime: 0 }); // Reset elapsed time
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
    
    // Start neural audio based on foreground/background state
    if (!this.binauralNodes.left && this.state.activeMode) {
      const preset = this.presets[this.state.activeMode]();
      
      if (this.isInForeground) {
        // Foreground: use WebAudio binaural beats
        await this.startBinaural(preset.beat, preset.carrier);
      } else {
        // Background: use HTML audio
        this.startNeuralHTMLAudio();
      }
    }
    
    // Update gain values (but don't start ambient sounds automatically)
    this.updateAmbientGains();
    this.updateNeuralGains();
    
    // Update MediaSession metadata
    this.updateMediaSessionMetadata();
    
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
    this.stopTimer(); // Use the new stopTimer method
    
    // Pause ambient elements (preserve isActive and position)
    Object.values(this.ambientSources).forEach(ambientSource => {
      if (ambientSource?.element) {
        ambientSource.element.pause();
        // Do not reset isActive or currentTime to preserve user's ambient settings
      }
    });
    
    this.setState({ 
      isPlaying: false, 
      isPaused: false
    });
  }

  private resumeActiveAmbientSounds() {
    Object.entries(this.ambientSources).forEach(([key, ambientSource]) => {
      if (!ambientSource) return;
      const volumeKey = `${key}Volume` as keyof AudioState;
      const volume = this.state[volumeKey] as number;
      if (volume > 0 && this.state.isPlaying) {
        // Ensure flag reflects actual state derived from volume
        ambientSource.isActive = true;
        ambientSource.element.play().catch(e =>
          console.warn(`[AudioManager] Could not resume ${key}:`, e)
        );
      }
    });
  }

  resumeAll() {
    console.log('[AudioManager] Resuming all audio...');
    
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    // Resume neural audio based on current state
    if (this.state.isPlaying && this.state.activeMode) {
      if (this.isInForeground && !this.binauralNodes.left) {
        // Foreground: restart WebAudio binaural
        const preset = this.presets[this.state.activeMode]();
        this.startBinaural(preset.beat, preset.carrier);
      } else if (!this.isInForeground) {
        // Background: ensure HTML audio is playing
        this.startNeuralHTMLAudio();
      }
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
      const mappedVolume = this.mapAmbientVolume(volume);
      this.smoothGain(this.ambientChain.gain, mappedVolume, 0.1);
    }
  }

  setNeuralVolume(volume: number) {
    this.setState({ neuralVolume: volume });
    const mappedVolume = this.mapNeuralVolume(volume);
    
    // Update WebAudio chain
    if (this.neuralChain) {
      this.smoothGain(this.neuralChain.gain, mappedVolume, 0.1);
    }
    // Update binaural gain if active
    if (this.binauralNodes.gain) {
      this.smoothGain(this.binauralNodes.gain.gain, mappedVolume, 0.1);
    }
    
    // Update HTML Audio neural sources directly
    Object.values(this.neuralSources).forEach(neuralSource => {
      if (neuralSource?.element && neuralSource.isActive) {
        neuralSource.element.volume = mappedVolume;
      }
    });
    
    this.updateNeuralGains();
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

    // Update gain immediately
    if (volume > 0) {
      ambientSource.isActive = true;
      if (ambientSource.gain) {
        const mappedVolume = this.mapAmbientVolume(volume);
        this.smoothGain(ambientSource.gain.gain, mappedVolume, 0.1);
      }
    } else {
      ambientSource.isActive = false;
      if (ambientSource.gain) {
        this.smoothGain(ambientSource.gain.gain, 0, 0.1);
      }
      ambientSource.element.pause();
    }

    // Ensure AudioContext and graph are ready even outside a session, then handle playback
    this.ensureAudioContext().then(() => {
      if (volume > 0) {
        if (this.state.userUnlockedAudio) {
          ambientSource.element.play().catch(e => 
            console.warn(`[AudioManager] Could not play ${type}:`, e)
          );
        } else {
          console.warn('[AudioManager] Audio is locked; ambient will start after unlock');
        }
      }
    });
  }

  // NEURAL MODE TOGGLE - NEW METHOD
  
  deactivateNeuralMode() {
    console.log('[AudioManager] Deactivating neural mode...');
    this.stopBinaural();
    this.stopTimer(); // Reset timer when neural mode is deactivated
    this.setState({ 
      activeMode: '', // Clear active mode
      neuralVolume: 0 // Set neural volume to 0
    });
    
    // Update gain nodes
    if (this.neuralChain) {
      this.smoothGain(this.neuralChain.gain, 0, 0.2);
    }
  }

  toggleNeuralMode(mode: string) {
    if (this.state.activeMode === mode) {
      // Same mode pressed - deactivate
      this.deactivateNeuralMode();
    } else {
      // Different mode or no mode active - apply preset
      this.applyPreset(mode);
    }
  }

  applyPreset(mode: string) {
    console.log(`[AudioManager] Applying preset: ${mode}`);
    const config = this.presets[mode]?.();
    if (!config) return;

    // Stop current neural audio before switching
    this.stopBinaural();
    this.stopNeuralHTMLAudio();

    this.setState({
      activeMode: mode,
      neuralVolume: config.neuralVolume
      // Removed ambientVolume - focus modes don't affect ambient settings
    });

    // Update MediaSession metadata
    this.updateMediaSessionMetadata();

    // Update only neural gain nodes - ambient chain remains untouched
    if (this.neuralChain) {
      this.smoothGain(this.neuralChain.gain, this.mapNeuralVolume(config.neuralVolume), 0.2);
    }

    // Start appropriate neural audio if session is active
    if (this.state.isPlaying && this.audioCtx?.state === 'running') {
      if (this.isInForeground) {
        // Foreground: use WebAudio binaural beats
        this.startBinaural(config.beat, config.carrier);
      } else {
        // Background: use HTML audio
        this.startNeuralHTMLAudio();
      }
      this.startTimer(); // Start timer when neural mode activates during active session
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