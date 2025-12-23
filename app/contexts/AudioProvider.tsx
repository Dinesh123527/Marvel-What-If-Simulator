'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSoundGenerator, SoundType } from '../lib/sounds';

interface AudioContextType {
    isAmbientEnabled: boolean;
    isSfxEnabled: boolean;
    masterVolume: number;
    isAudioInitialized: boolean;
    isScreenReaderEnabled: boolean;
    isSpeaking: boolean;

    toggleAmbient: () => void;
    toggleSfx: () => void;
    toggleScreenReader: () => void;
    setMasterVolume: (volume: number) => void;
    playSound: (type: SoundType) => void;
    initializeAudio: () => void;
    speakText: (text: string) => void;
    stopSpeaking: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const STORAGE_KEY = 'mcu-whatif-audio-prefs';

interface AudioPrefs {
    isAmbientEnabled: boolean;
    isSfxEnabled: boolean;
    masterVolume: number;
    isScreenReaderEnabled: boolean;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isAmbientEnabled, setIsAmbientEnabled] = useState(false);
    const [isSfxEnabled, setIsSfxEnabled] = useState(true);
    const [masterVolume, setMasterVolumeState] = useState(0.7);
    const [isAudioInitialized, setIsAudioInitialized] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const prefs: AudioPrefs = JSON.parse(saved);
                setIsAmbientEnabled(prefs.isAmbientEnabled ?? false);
                setIsSfxEnabled(prefs.isSfxEnabled ?? true);
                setMasterVolumeState(prefs.masterVolume ?? 0.7);
                setIsScreenReaderEnabled(prefs.isScreenReaderEnabled ?? false);
            }
        } catch (e) {
            console.warn('Failed to load audio preferences:', e);
        }
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            const prefs: AudioPrefs = {
                isAmbientEnabled,
                isSfxEnabled,
                masterVolume,
                isScreenReaderEnabled,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch (e) {
            console.warn('Failed to save audio preferences:', e);
        }
    }, [isAmbientEnabled, isSfxEnabled, masterVolume, isScreenReaderEnabled, isHydrated]);

    // Stop speaking when screen reader is disabled
    useEffect(() => {
        if (!isScreenReaderEnabled) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [isScreenReaderEnabled]);

    useEffect(() => {
        if (!isHydrated || !isAudioInitialized) return;

        const soundGen = getSoundGenerator();
        if (!soundGen) return;

        if (isAmbientEnabled) {
            soundGen.startAmbient(0.15 * masterVolume);
        } else {
            soundGen.stopAmbient();
        }
    }, [isAmbientEnabled, isAudioInitialized, masterVolume, isHydrated]);

    const initializeAudio = useCallback(() => {
        if (isAudioInitialized) return;

        const soundGen = getSoundGenerator();
        if (soundGen) {
            soundGen.playTone(0, 0.001, 'sine', 0);
            setIsAudioInitialized(true);

            if (isAmbientEnabled) {
                soundGen.startAmbient(0.15 * masterVolume);
            }
        }
    }, [isAudioInitialized, isAmbientEnabled, masterVolume]);

    const toggleAmbient = useCallback(() => {
        if (!isAudioInitialized) {
            initializeAudio();
        }
        setIsAmbientEnabled(prev => !prev);
    }, [isAudioInitialized, initializeAudio]);

    const toggleSfx = useCallback(() => {
        setIsSfxEnabled(prev => !prev);
    }, []);

    const setMasterVolume = useCallback((volume: number) => {
        setMasterVolumeState(Math.max(0, Math.min(1, volume)));
    }, []);

    const toggleScreenReader = useCallback(() => {
        setIsScreenReaderEnabled(prev => !prev);
    }, []);

    const speakText = useCallback((text: string) => {
        if (!isScreenReaderEnabled) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        // Try to use a dramatic voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Alex')
        ) || voices[0];
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isScreenReaderEnabled]);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const playSound = useCallback((type: SoundType) => {
        if (!isSfxEnabled) return;
        if (!isAudioInitialized) {
            initializeAudio();
        }

        const soundGen = getSoundGenerator();
        if (soundGen && type !== 'AMBIENT_COSMIC') {
            soundGen.playSound(type, masterVolume);
        }
    }, [isSfxEnabled, isAudioInitialized, masterVolume, initializeAudio]);

    return (
        <AudioContext.Provider
            value={{
                isAmbientEnabled,
                isSfxEnabled,
                masterVolume,
                isAudioInitialized,
                isScreenReaderEnabled,
                isSpeaking,
                toggleAmbient,
                toggleSfx,
                toggleScreenReader,
                setMasterVolume,
                playSound,
                initializeAudio,
                speakText,
                stopSpeaking,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio(): AudioContextType {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}

// Hook for easy sound effect triggers
export function useSoundEffect() {
    const { playSound, initializeAudio } = useAudio();

    return {
        playClick: () => playSound('BUTTON_CLICK'),
        playHover: () => playSound('BUTTON_HOVER'),
        playSimulationStart: () => playSound('SIMULATION_START'),
        playSimulationComplete: () => playSound('SIMULATION_COMPLETE'),
        playPortal: () => playSound('PORTAL_OPEN'),
        playBranch: () => playSound('TIMELINE_BRANCH'),
        playAlert: () => playSound('TVA_ALERT'),
        playWatcherSpeak: () => playSound('WATCHER_SPEAK'),
        initializeAudio,
    };
}
