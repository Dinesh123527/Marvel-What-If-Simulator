// Sound configuration for the MCU What If Simulator
// Using Web Audio API for SFX and HTML5 Audio for background music

export type SoundType =
    | 'AMBIENT_COSMIC'
    | 'PORTAL_OPEN'
    | 'SIMULATION_START'
    | 'SIMULATION_COMPLETE'
    | 'BUTTON_CLICK'
    | 'BUTTON_HOVER'
    | 'TIMELINE_BRANCH'
    | 'TVA_ALERT'
    | 'WATCHER_SPEAK';

// Background music configuration
// Using user's custom Marvel music file
const BACKGROUND_MUSIC_PATH = '/sounds/Marvel_Studios.mp3';

// Set to false to use the MP3 file, true for generated ambient
const USE_GENERATED_AMBIENT = false;

export const SOUND_CONFIG: Record<SoundType, {
    type: 'generated' | 'url';
    frequency?: number;
    duration?: number;
    waveform?: OscillatorType;
    url?: string;
    volume: number;
    loop?: boolean;
}> = {
    AMBIENT_COSMIC: {
        type: USE_GENERATED_AMBIENT ? 'generated' : 'url',
        url: BACKGROUND_MUSIC_PATH,
        volume: 0.2,
        loop: true,
    },
    PORTAL_OPEN: {
        type: 'generated',
        frequency: 200,
        duration: 0.8,
        waveform: 'sine',
        volume: 0.3,
    },
    SIMULATION_START: {
        type: 'generated',
        frequency: 440,
        duration: 0.5,
        waveform: 'sine',
        volume: 0.25,
    },
    SIMULATION_COMPLETE: {
        type: 'generated',
        frequency: 660,
        duration: 0.6,
        waveform: 'sine',
        volume: 0.3,
    },
    BUTTON_CLICK: {
        type: 'generated',
        frequency: 800,
        duration: 0.05,
        waveform: 'square',
        volume: 0.1,
    },
    BUTTON_HOVER: {
        type: 'generated',
        frequency: 1200,
        duration: 0.03,
        waveform: 'sine',
        volume: 0.05,
    },
    TIMELINE_BRANCH: {
        type: 'generated',
        frequency: 300,
        duration: 0.4,
        waveform: 'sawtooth',
        volume: 0.2,
    },
    TVA_ALERT: {
        type: 'generated',
        frequency: 520,
        duration: 0.3,
        waveform: 'square',
        volume: 0.25,
    },
    WATCHER_SPEAK: {
        type: 'generated',
        frequency: 150,
        duration: 0.1,
        waveform: 'sine',
        volume: 0.08,
    },
};

export class SoundGenerator {
    private audioContext: AudioContext | null = null;
    private ambientOscillators: OscillatorNode[] = [];
    private ambientGain: GainNode | null = null;
    private isAmbientPlaying = false;
    private backgroundMusic: HTMLAudioElement | null = null;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    playTone(
        frequency: number,
        duration: number,
        waveform: OscillatorType = 'sine',
        volume: number = 0.2
    ): void {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = waveform;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio playback failed:', e);
        }
    }

    playWhoosh(volume: number = 0.3): void {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(100, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
            oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.8);

            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.8);
        } catch (e) {
            console.warn('Audio playback failed:', e);
        }
    }

    playSuccessFanfare(volume: number = 0.25): void {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'sine', volume);
            }, i * 100);
        });
    }

    // Start ambient sound - gentle space wind using filtered noise (much more pleasant than tones)
    startAmbient(volume: number = 0.2): void {
        if (this.isAmbientPlaying) return;

        const config = SOUND_CONFIG.AMBIENT_COSMIC;

        // Try to load MP3 file first (if user has added one)
        if (config.type === 'url' && config.url) {
            try {
                this.backgroundMusic = new Audio(config.url);
                this.backgroundMusic.loop = true;
                this.backgroundMusic.volume = 0;

                this.backgroundMusic.play().then(() => {
                    let currentVol = 0;
                    const targetVol = Math.min(volume, 0.4);
                    const fadeInterval = setInterval(() => {
                        if (this.backgroundMusic && currentVol < targetVol) {
                            currentVol += 0.02;
                            this.backgroundMusic.volume = Math.min(currentVol, targetVol);
                        } else {
                            clearInterval(fadeInterval);
                        }
                    }, 100);
                    this.isAmbientPlaying = true;
                }).catch(() => {
                    // MP3 failed, fall back to generated ambient
                    this.backgroundMusic = null;
                    this.startGeneratedAmbient(volume);
                });
                return;
            } catch {
                // Fall through to generated ambient
            }
        }

        // Use generated ambient
        this.startGeneratedAmbient(volume);
    }

    // Generate a gentle "space wind" ambient using filtered noise
    private startGeneratedAmbient(volume: number): void {
        if (this.isAmbientPlaying) return;

        try {
            const ctx = this.getContext();
            this.ambientGain = ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0, ctx.currentTime);
            this.ambientGain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 3);
            this.ambientGain.connect(ctx.destination);

            // Create filtered noise for a gentle "space wind" effect
            // Much more pleasant than pure tones
            const bufferSize = 2 * ctx.sampleRate;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            // Generate pink-ish noise (more natural than white noise)
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            noise.loop = true;

            // Low-pass filter to make it very soft and gentle
            const lowPass = ctx.createBiquadFilter();
            lowPass.type = 'lowpass';
            lowPass.frequency.setValueAtTime(400, ctx.currentTime);
            lowPass.Q.setValueAtTime(0.5, ctx.currentTime);

            // High-pass to remove rumble
            const highPass = ctx.createBiquadFilter();
            highPass.type = 'highpass';
            highPass.frequency.setValueAtTime(100, ctx.currentTime);

            // Gentle modulation for movement
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
            lfoGain.gain.setValueAtTime(50, ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(lowPass.frequency);
            lfo.start();

            noise.connect(highPass);
            highPass.connect(lowPass);
            lowPass.connect(this.ambientGain);
            noise.start();

            // Store for cleanup (using oscillators array for both)
            this.ambientOscillators.push(noise as any);

            this.isAmbientPlaying = true;
        } catch (e) {
            console.warn('Generated ambient audio failed:', e);
        }
    }

    // Stop background music with fade out
    stopAmbient(): void {
        if (!this.isAmbientPlaying) return;

        try {
            if (this.backgroundMusic) {
                // Fade out over 1 second
                const fadeInterval = setInterval(() => {
                    if (this.backgroundMusic && this.backgroundMusic.volume > 0.02) {
                        this.backgroundMusic.volume -= 0.02;
                    } else {
                        clearInterval(fadeInterval);
                        if (this.backgroundMusic) {
                            this.backgroundMusic.pause();
                            this.backgroundMusic.currentTime = 0;
                            this.backgroundMusic = null;
                        }
                        this.isAmbientPlaying = false;
                    }
                }, 50);
            } else {
                // Fallback for old oscillator-based ambient
                if (this.ambientGain) {
                    const ctx = this.getContext();
                    this.ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

                    setTimeout(() => {
                        this.ambientOscillators.forEach(osc => {
                            try {
                                osc.stop();
                            } catch (e) { }
                        });
                        this.ambientOscillators = [];
                        this.isAmbientPlaying = false;
                    }, 1100);
                }
            }
        } catch (e) {
            console.warn('Stopping ambient failed:', e);
        }
    }

    playSound(type: SoundType, volumeMultiplier: number = 1): void {
        const config = SOUND_CONFIG[type];
        if (!config) return;

        const volume = config.volume * volumeMultiplier;

        switch (type) {
            case 'AMBIENT_COSMIC':
                this.startAmbient(volume);
                break;
            case 'PORTAL_OPEN':
            case 'SIMULATION_START':
                this.playWhoosh(volume);
                break;
            case 'SIMULATION_COMPLETE':
                this.playSuccessFanfare(volume);
                break;
            default:
                if (config.frequency && config.duration && config.waveform) {
                    this.playTone(config.frequency, config.duration, config.waveform, volume);
                }
        }
    }

    // Update volume of currently playing music
    setVolume(volume: number): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = Math.min(Math.max(volume, 0), 1);
        }
    }

    dispose(): void {
        this.stopAmbient();
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

let soundGeneratorInstance: SoundGenerator | null = null;

export function getSoundGenerator(): SoundGenerator {
    if (typeof window === 'undefined') {
        return null as any; // SSR safety
    }
    if (!soundGeneratorInstance) {
        soundGeneratorInstance = new SoundGenerator();
    }
    return soundGeneratorInstance;
}
