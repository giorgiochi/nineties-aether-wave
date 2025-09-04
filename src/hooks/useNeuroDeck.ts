import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  activeMode: string;
  masterVolume: number;
  binauralVolume: number;
  brownVolume: number;
  pinkVolume: number;
  rainVolume: number;
  oceanVolume: number;
  duration: number;
  timeLeft: number;
}

interface AudioPreset {
  beat: number;
  carrier: number;
  bVol: number;
  master: number;
}

export function useNeuroDeck() {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    activeMode: 'CONCENTRAZIONE',
    masterVolume: 0.70,
    binauralVolume: 0.18,
    brownVolume: 0.12,
    pinkVolume: 0.10,
    rainVolume: 0.00,
    oceanVolume: 0.06,
    duration: 3,
    timeLeft: 0,
  });

  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const limiterRef = useRef<DynamicsCompressorNode | null>(null);
  const binauralRef = useRef<{ left: OscillatorNode | null; right: OscillatorNode | null; gain: GainNode | null }>({
    left: null, right: null, gain: null
  });
  const ambientRef = useRef<{
    brown: { node: AudioBufferSourceNode | null; gain: GainNode | null } | null;
    pink: { node: AudioBufferSourceNode | null; gain: GainNode | null } | null;
    rain: { node: AudioBufferSourceNode | null; gain: GainNode | null } | null;
    ocean: { node: AudioBufferSourceNode | null; gain: GainNode | null } | null;
  }>({
    brown: null, pink: null, rain: null, ocean: null
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const presets: Record<string, () => AudioPreset> = {
    CONCENTRAZIONE: () => ({
      beat: 16.0, carrier: 220, bVol: 0.18, master: 0.70
    }),
    ADHD: () => ({
      beat: 13.0, carrier: 210, bVol: 0.20, master: 0.68
    }),
    STRESS: () => ({
      beat: 10.0, carrier: 200, bVol: 0.16, master: 0.66
    }),
    INTRUSIVE_OFF: () => ({
      beat: 8.0, carrier: 190, bVol: 0.16, master: 0.64
    })
  };

  const ensureContext = useCallback(() => {
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = contextRef.current.createGain();
      limiterRef.current = contextRef.current.createDynamicsCompressor();
      
      limiterRef.current.threshold.value = -6;
      limiterRef.current.knee.value = 0;
      limiterRef.current.ratio.value = 12;
      limiterRef.current.attack.value = 0.003;
      limiterRef.current.release.value = 0.25;
      
      masterGainRef.current.gain.value = state.masterVolume;
      masterGainRef.current.connect(limiterRef.current).connect(contextRef.current.destination);
      
      createAmbient();
    }
  }, [state.masterVolume]);

  const smoothGain = useCallback((param: AudioParam, target: number, seconds: number) => {
    if (!contextRef.current) return;
    const now = contextRef.current.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(target, now, Math.max(0.03, seconds / 5));
  }, []);

  const createNoiseBuffer = useCallback((color: 'brown' | 'pink' | 'white'): AudioBuffer => {
    if (!contextRef.current) throw new Error('Audio context not initialized');
    
    const len = 2 * contextRef.current.sampleRate;
    const buf = contextRef.current.createBuffer(1, len, contextRef.current.sampleRate);
    const data = buf.getChannelData(0);

    if (color === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else if (color === 'brown') {
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        const brown = (last + 0.02 * w) / 1.02;
        last = brown;
        data[i] = brown * 3.5;
      }
    } else {
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    return buf;
  }, []);

  const createAmbient = useCallback(() => {
    if (!contextRef.current || !masterGainRef.current) return;

    // Brown noise
    const brownBuffer = createNoiseBuffer('brown');
    const brownSource = contextRef.current.createBufferSource();
    brownSource.buffer = brownBuffer;
    brownSource.loop = true;
    const brownGain = contextRef.current.createGain();
    brownGain.gain.value = state.brownVolume;
    brownSource.connect(brownGain).connect(masterGainRef.current);
    brownSource.start();
    ambientRef.current.brown = { node: brownSource, gain: brownGain };

    // Pink noise
    const pinkBuffer = createNoiseBuffer('pink');
    const pinkSource = contextRef.current.createBufferSource();
    pinkSource.buffer = pinkBuffer;
    pinkSource.loop = true;
    const pinkGain = contextRef.current.createGain();
    pinkGain.gain.value = state.pinkVolume;
    pinkSource.connect(pinkGain).connect(masterGainRef.current);
    pinkSource.start();
    ambientRef.current.pink = { node: pinkSource, gain: pinkGain };

    // Rain (filtered pink noise)
    const rainBuffer = createNoiseBuffer('pink');
    const rainSource = contextRef.current.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;
    const rainFilter = contextRef.current.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.value = 1500;
    const rainGain = contextRef.current.createGain();
    rainGain.gain.value = state.rainVolume;
    rainSource.connect(rainFilter).connect(rainGain).connect(masterGainRef.current);
    rainSource.start();
    ambientRef.current.rain = { node: rainSource, gain: rainGain };

    // Ocean (low-pass filtered pink with LFO)
    const oceanBuffer = createNoiseBuffer('pink');
    const oceanSource = contextRef.current.createBufferSource();
    oceanSource.buffer = oceanBuffer;
    oceanSource.loop = true;
    const oceanFilter = contextRef.current.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.value = 400;
    const oceanLFO = contextRef.current.createOscillator();
    const oceanLFOGain = contextRef.current.createGain();
    oceanLFO.type = 'sine';
    oceanLFO.frequency.value = 0.06;
    oceanLFOGain.gain.value = 180;
    oceanLFO.connect(oceanLFOGain).connect(oceanFilter.frequency);
    oceanLFO.start();
    const oceanGain = contextRef.current.createGain();
    oceanGain.gain.value = state.oceanVolume;
    oceanSource.connect(oceanFilter).connect(oceanGain).connect(masterGainRef.current);
    oceanSource.start();
    ambientRef.current.ocean = { node: oceanSource, gain: oceanGain };
  }, [state.brownVolume, state.pinkVolume, state.rainVolume, state.oceanVolume, createNoiseBuffer]);

  const startBinaural = useCallback((beat: number, carrier: number) => {
    if (!contextRef.current || !masterGainRef.current) return;

    stopBinaural(true);

    const leftOsc = contextRef.current.createOscillator();
    const rightOsc = contextRef.current.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(carrier, contextRef.current.currentTime);
    rightOsc.frequency.setValueAtTime(carrier + beat, contextRef.current.currentTime);

    const gain = contextRef.current.createGain();
    gain.gain.value = 0.0001;

    const leftPanner = contextRef.current.createStereoPanner();
    leftPanner.pan.value = -1;
    const rightPanner = contextRef.current.createStereoPanner();
    rightPanner.pan.value = 1;

    leftOsc.connect(leftPanner).connect(gain);
    rightOsc.connect(rightPanner).connect(gain);
    gain.connect(masterGainRef.current);

    leftOsc.start();
    rightOsc.start();

    smoothGain(gain.gain, state.binauralVolume, 2.5);

    binauralRef.current = { left: leftOsc, right: rightOsc, gain };
  }, [state.binauralVolume, smoothGain]);

  const stopBinaural = useCallback((fast = false) => {
    if (binauralRef.current.left && contextRef.current) {
      const gain = binauralRef.current.gain?.gain;
      if (gain) {
        smoothGain(gain, 0.0001, fast ? 0.2 : 2.5);
      }
      const stopTime = contextRef.current.currentTime + (fast ? 0.25 : 2.6);
      try {
        binauralRef.current.left.stop(stopTime);
        binauralRef.current.right?.stop(stopTime);
      } catch (e) {
        // Oscillator already stopped
      }
    }
    binauralRef.current = { left: null, right: null, gain: null };
  }, [smoothGain]);

  const applyPreset = useCallback((mode: string) => {
    ensureContext();
    const preset = presets[mode]();
    
    setState(prev => ({
      ...prev,
      activeMode: mode,
      masterVolume: preset.master,
      binauralVolume: preset.bVol,
      // NON imposta più i volumi ambientali - restano invariati
    }));

    if (contextRef.current?.state === 'running') {
      startBinaural(preset.beat, preset.carrier);
      // NON chiama più updateAmbientVolumes automaticamente
    }
  }, [ensureContext, startBinaural]);

  const updateAmbientVolumes = useCallback(() => {
    if (ambientRef.current.brown?.gain) {
      ambientRef.current.brown.gain.gain.value = state.brownVolume;
    }
    if (ambientRef.current.pink?.gain) {
      ambientRef.current.pink.gain.gain.value = state.pinkVolume;
    }
    if (ambientRef.current.rain?.gain) {
      ambientRef.current.rain.gain.gain.value = state.rainVolume;
    }
    if (ambientRef.current.ocean?.gain) {
      ambientRef.current.ocean.gain.gain.value = state.oceanVolume;
    }
  }, [state.brownVolume, state.pinkVolume, state.rainVolume, state.oceanVolume]);

  const start = useCallback(() => {
    ensureContext();
    if (!contextRef.current) return;
    
    contextRef.current.resume();
    
    if (!binauralRef.current.left) {
      const preset = presets[state.activeMode]();
      startBinaural(preset.beat, preset.carrier);
    }
    
    updateAmbientVolumes();
    
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    
    endTimeRef.current = Date.now() + state.duration * 3600 * 1000;
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (endTimeRef.current) {
        const left = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
        setState(prev => ({ ...prev, timeLeft: left }));
        if (left === 0) {
          stop();
        }
      }
    }, 200);
  }, [ensureContext, startBinaural, updateAmbientVolumes, state.activeMode, state.duration]);

  const pause = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.suspend();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const stop = useCallback(() => {
    stopBinaural();
    if (contextRef.current) {
      contextRef.current.suspend();
    }
    
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      timeLeft: 0 
    }));
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    endTimeRef.current = null;
  }, [stopBinaural]);

  const updateMasterVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, masterVolume: volume }));
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, []);

  const updateBinauralVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, binauralVolume: volume }));
    if (binauralRef.current.gain) {
      smoothGain(binauralRef.current.gain.gain, volume, 0.4);
    }
  }, [smoothGain]);

  const updateAmbientVolume = useCallback((type: 'brown' | 'pink' | 'rain' | 'ocean', volume: number) => {
    setState(prev => ({ ...prev, [`${type}Volume`]: volume }));
    
    const ambient = ambientRef.current[type];
    if (ambient?.gain) {
      ambient.gain.gain.value = volume;
    }
  }, []);

  const muteAmbient = useCallback(() => {
    setState(prev => ({
      ...prev,
      brownVolume: 0,
      pinkVolume: 0,
      rainVolume: 0,
      oceanVolume: 0,
    }));
    updateAmbientVolumes();
  }, [updateAmbientVolumes]);

  const resetAmbient = useCallback(() => {
    // Reset ambienti a zero invece di usare i preset
    setState(prev => ({
      ...prev,
      brownVolume: 0,
      pinkVolume: 0,
      rainVolume: 0,
      oceanVolume: 0,
    }));
    updateAmbientVolumes();
  }, [updateAmbientVolumes]);

  const updateDuration = useCallback((hours: number) => {
    setState(prev => ({ ...prev, duration: hours }));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const data = {
      mode: state.activeMode,
      master: state.masterVolume,
      bVol: state.binauralVolume,
      dur: state.duration,
      amb: {
        brown: state.brownVolume,
        pink: state.pinkVolume,
        rain: state.rainVolume,
        ocean: state.oceanVolume,
      }
    };
    localStorage.setItem('neurodeck90', JSON.stringify(data));
  }, [state]);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('neurodeck90');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          activeMode: data.mode || prev.activeMode,
          masterVolume: data.master ?? prev.masterVolume,
          binauralVolume: data.bVol ?? prev.binauralVolume,
          duration: data.dur ?? prev.duration,
          brownVolume: data.amb?.brown ?? prev.brownVolume,
          pinkVolume: data.amb?.pink ?? prev.pinkVolume,
          rainVolume: data.amb?.rain ?? prev.rainVolume,
          oceanVolume: data.amb?.ocean ?? prev.oceanVolume,
        }));
      } catch (e) {
        // Invalid saved data
      }
    }
  }, []);

  return {
    state,
    start,
    pause,
    stop,
    applyPreset,
    updateMasterVolume,
    updateBinauralVolume,
    updateAmbientVolume,
    updateDuration,
    muteAmbient,
    resetAmbient,
  };
}