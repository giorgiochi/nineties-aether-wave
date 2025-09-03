import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  preset: string;
  carrier: number;
  binauralVolume: number;
  brownVolume: number;
  pinkVolume: number;
  rainVolume: number;
  oceanVolume: number;
  masterVolume: number;
  duration: number;
  timeLeft: number;
}

interface BiauralNodes {
  leftOsc: OscillatorNode | null;
  rightOsc: OscillatorNode | null;
  gain: GainNode | null;
}

interface AmbientNodes {
  brown: { node: AudioBufferSourceNode | null; gain: GainNode | null };
  pink: { node: AudioBufferSourceNode | null; gain: GainNode | null };
  rain: { node: AudioBufferSourceNode | null; gain: GainNode | null };
  ocean: { node: AudioBufferSourceNode | null; gain: GainNode | null };
}

export const useAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const limiterRef = useRef<DynamicsCompressorNode | null>(null);
  const binauralRef = useRef<BiauralNodes>({ leftOsc: null, rightOsc: null, gain: null });
  const ambientRef = useRef<AmbientNodes>({
    brown: { node: null, gain: null },
    pink: { node: null, gain: null },
    rain: { node: null, gain: null },
    ocean: { node: null, gain: null }
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    preset: '16',
    carrier: 220,
    binauralVolume: 0.18,
    brownVolume: 0.15,
    pinkVolume: 0.10,
    rainVolume: 0.12,
    oceanVolume: 0.12,
    masterVolume: 0.7,
    duration: 3,
    timeLeft: 0
  });

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = ctxRef.current.createGain();
      limiterRef.current = ctxRef.current.createDynamicsCompressor();
      
      // Safety limiter settings
      limiterRef.current.threshold.value = -6;
      limiterRef.current.knee.value = 0;
      limiterRef.current.ratio.value = 12;
      limiterRef.current.attack.value = 0.003;
      limiterRef.current.release.value = 0.25;
      
      masterGainRef.current.gain.value = state.masterVolume;
      masterGainRef.current.connect(limiterRef.current).connect(ctxRef.current.destination);
      
      createAmbientSounds();
    }
  }, [state.masterVolume]);

  const smoothGain = useCallback((param: AudioParam, target: number, seconds: number) => {
    if (!ctxRef.current) return;
    const now = ctxRef.current.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(target, now, Math.max(0.03, seconds / 5));
  }, []);

  const createNoiseBuffer = useCallback((color: 'white' | 'pink' | 'brown'): AudioBuffer => {
    if (!ctxRef.current) throw new Error('Audio context not initialized');
    
    const len = 2 * ctxRef.current.sampleRate;
    const buffer = ctxRef.current.createBuffer(1, len, ctxRef.current.sampleRate);
    const data = buffer.getChannelData(0);

    if (color === 'white') {
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (color === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (color === 'brown') {
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        const brown = (last + 0.02 * white) / 1.02;
        last = brown;
        data[i] = brown * 3.5;
      }
    }

    return buffer;
  }, []);

  const createLoopingSource = useCallback((buffer: AudioBuffer): AudioBufferSourceNode => {
    if (!ctxRef.current) throw new Error('Audio context not initialized');
    
    const source = ctxRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    return source;
  }, []);

  const createAmbientSounds = useCallback(() => {
    if (!ctxRef.current || !masterGainRef.current) return;

    // Brown noise
    const brownBuffer = createNoiseBuffer('brown');
    const brownSource = createLoopingSource(brownBuffer);
    const brownGain = ctxRef.current.createGain();
    brownGain.gain.value = state.brownVolume;
    brownSource.connect(brownGain);
    brownGain.connect(masterGainRef.current);
    ambientRef.current.brown = { node: brownSource, gain: brownGain };

    // Pink noise
    const pinkBuffer = createNoiseBuffer('pink');
    const pinkSource = createLoopingSource(pinkBuffer);
    const pinkGain = ctxRef.current.createGain();
    pinkGain.gain.value = state.pinkVolume;
    pinkSource.connect(pinkGain);
    pinkGain.connect(masterGainRef.current);
    ambientRef.current.pink = { node: pinkSource, gain: pinkGain };

    // Rain (filtered pink noise)
    const rainBuffer = createNoiseBuffer('pink');
    const rainSource = createLoopingSource(rainBuffer);
    const rainFilter = ctxRef.current.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.value = 1500;
    const rainGain = ctxRef.current.createGain();
    rainGain.gain.value = state.rainVolume;
    const rainShaper = ctxRef.current.createGain();
    rainSource.connect(rainFilter).connect(rainShaper).connect(rainGain);
    rainGain.connect(masterGainRef.current);
    ambientRef.current.rain = { node: rainSource, gain: rainGain };

    // Rain droplets effect
    const createDroplets = () => {
      if (!ctxRef.current || !rainShaper) return;
      const now = ctxRef.current.currentTime;
      const amp = Math.random() * 0.08;
      rainShaper.gain.setTargetAtTime(amp, now, 0.01);
      rainShaper.gain.setTargetAtTime(0.0, now + 0.05, 0.03);
      setTimeout(createDroplets, Math.random() * 300 + 200);
    };
    createDroplets();

    // Ocean (low-pass filtered pink noise with LFO)
    const oceanBuffer = createNoiseBuffer('pink');
    const oceanSource = createLoopingSource(oceanBuffer);
    const oceanFilter = ctxRef.current.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.value = 400;
    const oceanGain = ctxRef.current.createGain();
    oceanGain.gain.value = state.oceanVolume;
    const oceanLFO = ctxRef.current.createOscillator();
    const oceanLFOGain = ctxRef.current.createGain();
    oceanLFO.type = 'sine';
    oceanLFO.frequency.value = 0.06;
    oceanLFOGain.gain.value = 180;
    oceanLFO.connect(oceanLFOGain).connect(oceanFilter.frequency);
    oceanLFO.start();
    oceanSource.connect(oceanFilter).connect(oceanGain);
    oceanGain.connect(masterGainRef.current);
    ambientRef.current.ocean = { node: oceanSource, gain: oceanGain };
  }, [createNoiseBuffer, createLoopingSource, state.brownVolume, state.pinkVolume, state.rainVolume, state.oceanVolume]);

  const startBinaural = useCallback(() => {
    if (!ctxRef.current || !masterGainRef.current) return;

    stopBinaural(true);

    const beat = parseFloat(state.preset);
    const base = state.carrier;

    const leftOsc = ctxRef.current.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(base, ctxRef.current.currentTime);

    const rightOsc = ctxRef.current.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(base + beat, ctxRef.current.currentTime);

    const gainNode = ctxRef.current.createGain();
    gainNode.gain.value = 0.0001;

    const leftPanner = ctxRef.current.createStereoPanner();
    leftPanner.pan.value = -1;
    const rightPanner = ctxRef.current.createStereoPanner();
    rightPanner.pan.value = 1;

    leftOsc.connect(leftPanner).connect(gainNode);
    rightOsc.connect(rightPanner).connect(gainNode);
    gainNode.connect(masterGainRef.current);

    leftOsc.start();
    rightOsc.start();

    smoothGain(gainNode.gain, state.binauralVolume, 2.5);

    binauralRef.current = { leftOsc, rightOsc, gain: gainNode };
  }, [state.preset, state.carrier, state.binauralVolume, smoothGain]);

  const stopBinaural = useCallback((fast: boolean = false) => {
    const { leftOsc, rightOsc, gain } = binauralRef.current;
    if (leftOsc && rightOsc && gain && ctxRef.current) {
      smoothGain(gain.gain, 0.0001, fast ? 0.2 : 2.5);
      const stopAt = ctxRef.current.currentTime + (fast ? 0.25 : 2.6);
      try {
        leftOsc.stop(stopAt);
        rightOsc.stop(stopAt);
      } catch (e) {
        // Ignore errors if already stopped
      }
    }
    binauralRef.current = { leftOsc: null, rightOsc: null, gain: null };
  }, [smoothGain]);

  const updateAmbientVolumes = useCallback(() => {
    if (ambientRef.current.brown.gain) {
      ambientRef.current.brown.gain.gain.value = state.brownVolume;
    }
    if (ambientRef.current.pink.gain) {
      ambientRef.current.pink.gain.gain.value = state.pinkVolume;
    }
    if (ambientRef.current.rain.gain) {
      ambientRef.current.rain.gain.gain.value = state.rainVolume;
    }
    if (ambientRef.current.ocean.gain) {
      ambientRef.current.ocean.gain.gain.value = state.oceanVolume;
    }
  }, [state.brownVolume, state.pinkVolume, state.rainVolume, state.oceanVolume]);

  const startTimer = useCallback(() => {
    const endTime = Date.now() + state.duration * 3600 * 1000;
    endTimeRef.current = endTime;

    const updateTimer = () => {
      if (endTimeRef.current) {
        const timeLeft = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
        setState(prev => ({ ...prev, timeLeft }));
        
        if (timeLeft === 0) {
          stop();
          return;
        }
      }
      timerRef.current = setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
  }, [state.duration]);

  const start = useCallback(() => {
    ensureContext();
    if (!ctxRef.current) return;

    ctxRef.current.resume();
    startBinaural();
    updateAmbientVolumes();
    startTimer();

    setState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      isPaused: false 
    }));
  }, [ensureContext, startBinaural, updateAmbientVolumes, startTimer]);

  const pause = useCallback(() => {
    if (!ctxRef.current) return;
    
    ctxRef.current.suspend();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: true 
    }));
  }, []);

  const stop = useCallback(() => {
    if (!ctxRef.current) return;

    stopBinaural();
    ctxRef.current.suspend();
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    endTimeRef.current = null;

    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      timeLeft: 0 
    }));
  }, [stopBinaural]);

  const updateMasterVolume = useCallback((volume: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
    setState(prev => ({ ...prev, masterVolume: volume }));
  }, []);

  const updateBinauralVolume = useCallback((volume: number) => {
    if (binauralRef.current.gain && ctxRef.current) {
      smoothGain(binauralRef.current.gain.gain, volume, 0.4);
    }
    setState(prev => ({ ...prev, binauralVolume: volume }));
  }, [smoothGain]);

  const updatePreset = useCallback((preset: string) => {
    setState(prev => ({ ...prev, preset }));
    if (state.isPlaying) {
      startBinaural();
    }
  }, [state.isPlaying, startBinaural]);

  const updateCarrier = useCallback((carrier: number) => {
    setState(prev => ({ ...prev, carrier }));
    if (state.isPlaying) {
      startBinaural();
    }
  }, [state.isPlaying, startBinaural]);

  const updateAmbientVolume = useCallback((type: 'brown' | 'pink' | 'rain' | 'ocean', volume: number) => {
    setState(prev => ({ ...prev, [`${type}Volume`]: volume }));
    
    const ambientNode = ambientRef.current[type];
    if (ambientNode.gain) {
      ambientNode.gain.gain.value = volume;
    }
  }, []);

  const muteAmbient = useCallback(() => {
    setState(prev => ({
      ...prev,
      brownVolume: 0,
      pinkVolume: 0,
      rainVolume: 0,
      oceanVolume: 0
    }));
    updateAmbientVolumes();
  }, [updateAmbientVolumes]);

  const resetAmbient = useCallback(() => {
    setState(prev => ({
      ...prev,
      brownVolume: 0.15,
      pinkVolume: 0.10,
      rainVolume: 0.12,
      oceanVolume: 0.12
    }));
    updateAmbientVolumes();
  }, [updateAmbientVolumes]);

  const savePreset = useCallback(() => {
    const data = {
      preset: state.preset,
      carrier: state.carrier,
      binauralVolume: state.binauralVolume,
      brownVolume: state.brownVolume,
      pinkVolume: state.pinkVolume,
      rainVolume: state.rainVolume,
      oceanVolume: state.oceanVolume,
      masterVolume: state.masterVolume,
      duration: state.duration
    };
    localStorage.setItem('nf90s', JSON.stringify(data));
  }, [state]);

  const loadPreset = useCallback(() => {
    try {
      const saved = localStorage.getItem('nf90s');
      if (saved) {
        const data = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          preset: data.preset ?? prev.preset,
          carrier: data.carrier ?? prev.carrier,
          binauralVolume: data.binauralVolume ?? prev.binauralVolume,
          brownVolume: data.brownVolume ?? prev.brownVolume,
          pinkVolume: data.pinkVolume ?? prev.pinkVolume,
          rainVolume: data.rainVolume ?? prev.rainVolume,
          oceanVolume: data.oceanVolume ?? prev.oceanVolume,
          masterVolume: data.masterVolume ?? prev.masterVolume,
          duration: data.duration ?? prev.duration
        }));
      }
    } catch (e) {
      console.error('Failed to load preset:', e);
    }
  }, []);

  // Load preset on mount
  useEffect(() => {
    loadPreset();
  }, [loadPreset]);

  // Auto-save on state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      savePreset();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, savePreset]);

  // Update ambient volumes when they change
  useEffect(() => {
    updateAmbientVolumes();
  }, [updateAmbientVolumes]);

  return {
    state,
    start,
    pause,
    stop,
    updateMasterVolume,
    updateBinauralVolume,
    updatePreset,
    updateCarrier,
    updateAmbientVolume,
    muteAmbient,
    resetAmbient,
    savePreset,
    loadPreset,
    updateDuration: (duration: number) => setState(prev => ({ ...prev, duration }))
  };
};