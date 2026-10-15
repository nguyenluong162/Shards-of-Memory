// Synthesized audio effects using Web Audio API for immersive feedback without external assets

let audioCtx: AudioContext | null = null;
let ambientNodes: { oscillators: OscillatorNode[]; gain: GainNode } | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playAudio = {
  keypadBeep: (freq = 800) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  },

  errorBuzz: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay policy fallback
    }
  },

  accessGranted: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  },

  heavyDoorUnlock: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // Mechanical clunk sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio policy fallback
    }
  },

  terminalBoot: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [180, 260, 410].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + index * 0.1;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.035, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.1);
      });
    } catch {
      // Audio policy fallback
    }
  },

  startAmbient: () => {
    try {
      if (ambientNodes) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, ctx.currentTime);
      const oscillators = [43, 57].map((frequency, index) => {
        const osc = ctx.createOscillator();
        osc.type = index ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        return osc;
      });
      filter.connect(gain);
      gain.connect(ctx.destination);
      ambientNodes = { oscillators, gain };
    } catch {
      ambientNodes = null;
    }
  },

  stopAmbient: () => {
    if (!ambientNodes) return;
    try {
      const ctx = getAudioContext();
      const { oscillators, gain } = ambientNodes;
      if (ctx) gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      oscillators.forEach((oscillator) => oscillator.stop((ctx?.currentTime ?? 0) + 0.14));
    } catch {
      // Node may already be stopped
    }
    ambientNodes = null;
  },
};
