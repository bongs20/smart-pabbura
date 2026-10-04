// Smart-Pabbura System - Global Click Sound System
// Reusable, zero-latency Web Audio API synthesizer + WAV/MP3 fallback support

export const CLICK_SOUND_VOLUME = 0.22;
const STORAGE_KEY = 'sp_sound_enabled';

let audioCtx: AudioContext | null = null;
let lastPlayTime = 0;

// Get AudioContext lazily on user interaction to comply with browser autoplay policies
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Check if sound is enabled (Default: true)
export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== null ? stored === 'true' : true;
};

// Set sound preference
export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
};

// Play an ultra-clean, crisp, modern healthcare UI micro-tap sound
export const playClickSound = (): void => {
  if (typeof window === 'undefined') return;
  if (!isSoundEnabled()) return;

  // Prevent double sound execution within 35ms
  const now = Date.now();
  if (now - lastPlayTime < 35) return;
  lastPlayTime = now;

  try {
    const ctx = getAudioContext();
    if (ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Ultra-clean, crisp 22ms micro-click (1350Hz -> 380Hz exponential drop)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.022);

      // Instant attack (1ms), ultra-fast exponential decay (22ms)
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(CLICK_SOUND_VOLUME, ctx.currentTime + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.022);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.022);
      return;
    }
  } catch {
    // Fallback if Web Audio API fails
  }

  // HTML5 Audio fallback
  try {
    const audio = new Audio('/sounds/click.wav');
    audio.volume = CLICK_SOUND_VOLUME;
    audio.play().catch(() => {});
  } catch {
    // Silent fail
  }
};
