/**
 * Zero-dependency procedural Web Audio API synthesizer for UI sound effects.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private defconInterval: number | null = null;

  constructor() {
    // AudioContext is initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initCtx();
      this.playChime(660, 0.08);
    } else {
      this.stopDefconSiren();
    }
    return !this.isMuted;
  }

  public getSoundEnabled(): boolean {
    return !this.isMuted;
  }

  public playTick(freq = 900, duration = 0.03) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  public playChime(freq = 520, duration = 0.15) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  public playCubeTransform(state: number) {
    if (this.isMuted) return;
    const baseFreqs = [440, 587, 740, 880];
    const freq = baseFreqs[state % baseFreqs.length] || 520;
    this.playChime(freq, 0.25);
  }

  public startDefconSiren() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || this.defconInterval) return;

    let high = false;
    this.defconInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(high ? 650 : 380, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
        high = !high;
      } catch {
        // silent
      }
    }, 500);
  }

  public stopDefconSiren() {
    if (this.defconInterval) {
      clearInterval(this.defconInterval);
      this.defconInterval = null;
    }
  }
}

export const soundFx = new SoundController();
