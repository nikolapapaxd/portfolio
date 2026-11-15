/**
 * Web Audio API Synthesizer & External Audio Stream Engine
 * Supports full-length audio streaming (including 52 Bars by Karan Aujla & Ikky)
 * with real-time Web Audio API FFT spectrum analysis and synth fallback beats.
 */

export class ProfileAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private isPlaying = false;
  private currentUrl = '';
  private volume = 0.75;
  private isMuted = false;
  private synthTimer: number | null = null;
  private stepIndex = 0;
  private activeNodes: AudioNode[] = [];
  private elapsedSeconds = 0;
  private elapsedTimer: number | null = null;
  private playToken = 0;
  private onStateChange?: () => void;

  constructor(onStateChange?: () => void) {
    this.onStateChange = onStateChange;
  }

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public async loadAndPlay(songUrl: string): Promise<void> {
    this.ensureContext();
    this.stopInternal();
    const token = ++this.playToken;
    this.currentUrl = songUrl.trim();
    this.elapsedSeconds = 0;

    if (this.currentUrl.startsWith('synth:')) {
      this.isPlaying = true;
      this.startSynthSequence(this.currentUrl);
      this.startElapsedCounter();
      this.onStateChange?.();
      return;
    }

    // Play full-length audio track (e.g., /assets/aistudio/52_bars.mp3)
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.loop = true;
        this.audioElement.preload = 'auto';
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.addEventListener('timeupdate', () => {
          this.onStateChange?.();
        });
        this.audioElement.addEventListener('loadedmetadata', () => {
          this.onStateChange?.();
        });

        // Connect same-origin audio element to Web Audio AnalyserNode for real FFT spectrum
        if (this.ctx && this.masterGain && !this.mediaSource) {
          try {
            this.mediaSource = this.ctx.createMediaElementSource(this.audioElement);
            this.mediaSource.connect(this.masterGain);
          } catch {
            // Fallback to direct element output if MediaElementSource fails
          }
        }
      }

      if (this.audioElement.src !== new URL(this.currentUrl, window.location.origin).href) {
        this.audioElement.src = this.currentUrl;
      }
      this.audioElement.currentTime = 0;
      this.applyGain();
      this.isPlaying = true;
      this.onStateChange?.();

      await this.audioElement.play();
      if (token !== this.playToken || !this.isPlaying) return;
      this.startElapsedCounter();
      this.onStateChange?.();
    } catch {
      if (token !== this.playToken || !this.isPlaying) return;
      this.isPlaying = true;
      this.startSynthSequence('synth:52-bars');
      this.startElapsedCounter();
      this.onStateChange?.();
    }
  }

  public togglePlay(songUrl: string): void {
    if (!this.currentUrl || this.currentUrl !== songUrl) {
      void this.loadAndPlay(songUrl);
      return;
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume(songUrl);
    }
  }

  public pause(): void {
    this.playToken++;
    this.isPlaying = false;
    if (this.synthTimer !== null) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.elapsedTimer !== null) {
      window.clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
    this.onStateChange?.();
  }

  public resume(songUrl: string): void {
    this.ensureContext();
    const token = ++this.playToken;
    if (this.currentUrl.startsWith('synth:')) {
      this.isPlaying = true;
      this.startSynthSequence(this.currentUrl);
      this.startElapsedCounter();
    } else if (this.audioElement) {
      this.isPlaying = true;
      this.startElapsedCounter();
      void this.audioElement.play().catch(() => {
        if (token === this.playToken && this.isPlaying) {
          this.startSynthSequence('synth:52-bars');
        }
      });
    } else {
      void this.loadAndPlay(songUrl);
    }
    this.onStateChange?.();
  }

  public seek(targetSeconds: number): void {
    if (
      this.audioElement &&
      !this.currentUrl.startsWith('synth:') &&
      Number.isFinite(this.audioElement.duration) &&
      this.audioElement.duration > 0
    ) {
      this.audioElement.currentTime = Math.max(
        0,
        Math.min(this.audioElement.duration, targetSeconds)
      );
      this.onStateChange?.();
    }
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
    }
    this.applyGain();
    this.onStateChange?.();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.applyGain();
    this.onStateChange?.();
  }

  private applyGain(): void {
    const effective = this.isMuted ? 0 : this.volume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.04);
    }
    if (this.audioElement) {
      // If routed through MediaElementAudioSourceNode, masterGain controls volume; keep element volume at 1
      this.audioElement.volume = this.mediaSource ? 1 : effective;
      this.audioElement.muted = this.isMuted;
    }
  }

  public getFrequencyBars(barCount = 14): number[] {
    if (!this.isPlaying) {
      return new Array(barCount).fill(10);
    }

    if (this.analyser) {
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(data);
      const hasSignal = data.some((v) => v > 4);
      if (hasSignal) {
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(data.length / barCount));
        for (let i = 0; i < barCount; i++) {
          const raw = data[Math.min(data.length - 1, i * step)] || 0;
          const normalized = Math.max(14, Math.min(100, Math.round((raw / 255) * 100)));
          bars.push(normalized);
        }
        return bars;
      }
    }

    // Fallback beat-synced dynamic spectrum if analyser is silent
    const t = performance.now() / 1000;
    const beatPulse = Math.abs(Math.sin(t * Math.PI * (96 / 30)));
    return Array.from({ length: barCount }, (_, i) => {
      const wave = Math.sin(t * 7 + i * 0.7) * 0.5 + 0.5;
      const subWeight = i < 4 ? beatPulse * 48 : 0;
      return Math.max(16, Math.min(98, Math.round(22 + wave * 42 + subWeight)));
    });
  }

  public getStatus() {
    let duration = 214; // 3:34 full 52 Bars duration
    let current = this.elapsedSeconds % duration;
    if (
      this.audioElement &&
      !this.currentUrl.startsWith('synth:') &&
      Number.isFinite(this.audioElement.duration) &&
      this.audioElement.duration > 0
    ) {
      duration = Math.floor(this.audioElement.duration);
      current = Math.floor(this.audioElement.currentTime);
    }
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      isMuted: this.isMuted,
      currentTime: current,
      duration,
    };
  }

  private startElapsedCounter() {
    if (this.elapsedTimer !== null) {
      window.clearInterval(this.elapsedTimer);
    }
    this.elapsedTimer = window.setInterval(() => {
      if (this.isPlaying) {
        this.elapsedSeconds += 1;
        this.onStateChange?.();
      }
    }, 1000);
  }

  private startSynthSequence(presetId: string) {
    if (this.synthTimer !== null) {
      window.clearInterval(this.synthTimer);
    }

    const presets: Record<
      string,
      { bpm: number; bassNotes: number[]; padChords: number[][]; arpNotes: number[] }
    > = {
      'synth:52-bars': {
        bpm: 96,
        bassNotes: [49.0, 49.0, 58.27, 55.0, 43.65, 43.65, 49.0, 49.0],
        padChords: [
          [196.0, 233.08, 293.66, 392.0],
          [174.61, 220.0, 261.63, 349.23],
        ],
        arpNotes: [392.0, 466.16, 587.33, 659.25, 587.33, 466.16, 392.0, 349.23],
      },
      'synth:midnight-drift': {
        bpm: 92,
        bassNotes: [55.0, 55.0, 65.41, 49.0, 43.65, 43.65, 49.0, 55.0],
        padChords: [
          [220.0, 261.63, 329.63, 392.0],
          [196.0, 246.94, 293.66, 369.99],
          [174.61, 220.0, 261.63, 329.63],
          [196.0, 246.94, 329.63, 392.0],
        ],
        arpNotes: [440, 523.25, 659.25, 783.99, 659.25, 523.25, 493.88, 392.0],
      },
      'synth:obsidian-pulse': {
        bpm: 118,
        bassNotes: [41.2, 41.2, 46.25, 41.2, 36.71, 36.71, 49.0, 46.25],
        padChords: [
          [164.81, 196.0, 246.94, 329.63],
          [146.83, 185.0, 220.0, 293.66],
        ],
        arpNotes: [329.63, 392.0, 493.88, 659.25, 587.33, 493.88, 392.0, 329.63],
      },
    };

    const config = presets[presetId] || presets['synth:52-bars'];
    const stepDurationMs = Math.round((60 / config.bpm / 2) * 1000);

    const triggerStep = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const step = this.stepIndex++;

      if (step % 2 === 0) {
        const bassFreq = config.bassNotes[(step / 2) % config.bassNotes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(bassFreq, now + 0.06);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, now);
        filter.frequency.exponentialRampToValueAtTime(75, now + stepDurationMs / 500);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.32, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (stepDurationMs * 1.85) / 1000);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + (stepDurationMs * 1.9) / 1000);
      }

      if (step % 8 === 0) {
        const chord = config.padChords[(step / 8) % config.padChords.length];
        chord.forEach((freq) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(850, now);

          const padDur = (stepDurationMs * 7.8) / 1000;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.055, now + padDur * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + padDur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          osc.stop(now + padDur + 0.05);
        });
      }

      const arpFreq = config.arpNotes[step % config.arpNotes.length];
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(arpFreq, now);

      const pluckDur = (stepDurationMs * 0.8) / 1000;
      arpGain.gain.setValueAtTime(0.001, now);
      arpGain.gain.linearRampToValueAtTime(0.09, now + 0.012);
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + pluckDur);

      arpOsc.connect(arpGain);
      arpGain.connect(this.masterGain);
      arpOsc.start(now);
      arpOsc.stop(now + pluckDur + 0.02);
    };

    triggerStep();
    this.synthTimer = window.setInterval(triggerStep, stepDurationMs);
  }

  private stopInternal(): void {
    this.isPlaying = false;
    if (this.synthTimer !== null) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.elapsedTimer !== null) {
      window.clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.activeNodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        // Ignore already disconnected
      }
    });
    this.activeNodes = [];
  }

  public destroy(): void {
    this.playToken++;
    this.stopInternal();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
