/**
 * CerebroCalm Web Audio Sound Generator
 * Generates continuous low-frequency Brown Noise and gentle harmonic chimes
 * completely on-device without downloading audio files or streaming media.
 */

let audioCtx: AudioContext | null = null;
let noiseNode: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;
let isPlayingNoise = false;

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Creates a 5-second looping buffer of synthesized Brown Noise.
 * Brown noise has an inverse power drop-off (1/f^2), resulting in a soft, deep rumble
 * scientifically shown to reduce sensory overload and tinnitus distress.
 */
function createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 5; // 5-second buffer
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Brownian integration filter
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 2.5; // Gain adjustment
  }

  return buffer;
}

/**
 * Start continuous soothing Brown Noise playback
 */
export function startBrownNoise(volume = 0.15): boolean {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (isPlayingNoise) {
      stopBrownNoise();
    }

    const buffer = createBrownNoiseBuffer(ctx);
    noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(Math.min(0.5, Math.max(0.01, volume)), ctx.currentTime);

    // Low-pass filter to keep noise deeply muffled and gentle for photophobia
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(0);
    isPlayingNoise = true;
    return true;
  } catch (err) {
    console.warn("Could not start audio playback:", err);
    return false;
  }
}

/**
 * Stop Brown Noise
 */
export function stopBrownNoise(): void {
  try {
    if (noiseNode) {
      noiseNode.stop();
      noiseNode.disconnect();
      noiseNode = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    isPlayingNoise = false;
  } catch (err) {
    // Ignore cleanup issues
  }
}

/**
 * Check if soundscape is currently active
 */
export function isAudioNoiseActive(): boolean {
  return isPlayingNoise;
}

/**
 * Adjust volume on the fly
 */
export function setNoiseVolume(volume: number): void {
  if (gainNode && audioCtx) {
    gainNode.gain.setValueAtTime(Math.min(0.5, Math.max(0.01, volume)), audioCtx.currentTime);
  }
}

/**
 * Plays a gentle, calming harmonic chime (432Hz fundamental + 864Hz overtone)
 * with a soft exponential decay. Used for pacing interval transitions.
 */
export function playCalmChime(): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Fundamental Tone (432Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(432, now);

    // Harmonic Overtone (864Hz)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(864, now);

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0.08, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc1.connect(chimeGain);
    osc2.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}
