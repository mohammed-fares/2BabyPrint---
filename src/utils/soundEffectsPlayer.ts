/**
 * Web Audio API Synthesizer for 2BabyPrint Marketing Campaigns
 * Synthesizes authentic audio effects (Baby Coo/Giggle, Celestial Chime, Typewriter Pop, DTF Steam Press, Music Box Lullaby)
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Celestial Brand Chime (Success / Magic / Sparkle)
  public playCelestialChime() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.0);
    });
  }

  // 2. Playful Baby Coo / Giggle Sound Effect
  public playBabyGiggle() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    [0, 0.12, 0.24, 0.38].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 580 + idx * 90;
      osc.frequency.setValueAtTime(baseFreq, now + offset);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + offset + 0.06);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + offset + 0.11);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.16, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.13);
    });
  }

  // 3. Name Typing Pop / Click (Screen interaction)
  public playTypewriterPop() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 4. DTF Digital Steam Heat Press (Warm smooth swoosh)
  public playDtfHeatPress() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Filtered noise buffer for steam swoosh
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.42);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.45);
  }

  // 5. Music Box Lullaby (Calm maternal chime)
  public playLullabyArpeggio() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.14);

      gain.gain.setValueAtTime(0, now + i * 0.14);
      gain.gain.linearRampToValueAtTime(0.14, now + i * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 1.3);
    });
  }

  // Generic dispatcher by audio key
  public playEffect(type: 'baby_giggle' | 'chime' | 'typewriter' | 'press' | 'lullaby') {
    switch (type) {
      case 'baby_giggle':
        this.playBabyGiggle();
        break;
      case 'chime':
        this.playCelestialChime();
        break;
      case 'typewriter':
        this.playTypewriterPop();
        break;
      case 'press':
        this.playDtfHeatPress();
        break;
      case 'lullaby':
        this.playLullabyArpeggio();
        break;
      default:
        this.playCelestialChime();
    }
  }

  // 6. Spoken Voiceover Simulation using SpeechSynthesis
  public speakVoiceover(text: string, langCode: string = 'ar-EG', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      if (onEnd) utterance.onend = onEnd;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public stopVoiceover() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEffectsEngine();
