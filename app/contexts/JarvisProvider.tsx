'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getJarvisResponse, getTimeBasedGreeting, type JarvisContext as JarvisContextType } from '../lib/jarvis-ai';

interface JarvisProviderContextType {
    isJarvisEnabled: boolean;
    isJarvisSpeaking: boolean;
    toggleJarvis: () => void;
    jarvisSpeak: (text: string, priority?: 'low' | 'normal' | 'high') => void;
    jarvisRespond: (context: JarvisContextType) => void;
    stopJarvis: () => void;
    currentSpeech: string;
}

const JarvisProviderContext = createContext<JarvisProviderContextType | undefined>(undefined);

export function JarvisProvider({ children }: { children: React.ReactNode }) {
    const [isJarvisEnabled, setIsJarvisEnabled] = useState(false);
    const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);
    const [currentSpeech, setCurrentSpeech] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);

    const speechQueueRef = useRef<string[]>([]);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasGreetedRef = useRef(false);

    // Hydrate from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('jarvis-enabled');
        if (saved === 'true') {
            setIsJarvisEnabled(true);
        }
        setIsHydrated(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('jarvis-enabled', isJarvisEnabled.toString());
        }
    }, [isJarvisEnabled, isHydrated]);

    // Find the best British voice
    const getBritishVoice = useCallback((): SpeechSynthesisVoice | null => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return null;

        const voices = window.speechSynthesis.getVoices();

        // Priority: British English male voices
        const priorityPatterns = [
            /Daniel/i,           // macOS British Daniel
            /UK.*Male/i,
            /British.*Male/i,
            /en-GB.*Male/i,
            /en-GB/i,
            /UK/i,
            /British/i,
        ];

        for (const pattern of priorityPatterns) {
            const match = voices.find(v => pattern.test(v.name) || pattern.test(v.lang));
            if (match) return match;
        }

        // Fallback to any English voice
        return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
    }, []);

    // Speak text with J.A.R.V.I.S. voice
    const jarvisSpeak = useCallback((text: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
        if (!isJarvisEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

        // For high priority, interrupt current speech
        if (priority === 'high') {
            window.speechSynthesis.cancel();
            speechQueueRef.current = [];
        }

        // For low priority, skip if already speaking
        if (priority === 'low' && isJarvisSpeaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getBritishVoice();
        if (voice) {
            utterance.voice = voice;
        }

        utterance.rate = 0.95;  // Slightly slower for that refined J.A.R.V.I.S. feel
        utterance.pitch = 0.9;  // Slightly lower pitch
        utterance.volume = 1.0;

        utterance.onstart = () => {
            setIsJarvisSpeaking(true);
            setCurrentSpeech(text);
        };

        utterance.onend = () => {
            setIsJarvisSpeaking(false);
            setCurrentSpeech('');
            currentUtteranceRef.current = null;

            // Process queue
            if (speechQueueRef.current.length > 0) {
                const next = speechQueueRef.current.shift();
                if (next) jarvisSpeak(next);
            }
        };

        utterance.onerror = () => {
            setIsJarvisSpeaking(false);
            setCurrentSpeech('');
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isJarvisEnabled, isJarvisSpeaking, getBritishVoice]);

    // Respond with a contextual message
    const jarvisRespond = useCallback((context: JarvisContextType) => {
        if (!isJarvisEnabled) return;
        const response = getJarvisResponse(context);
        jarvisSpeak(response);
    }, [isJarvisEnabled, jarvisSpeak]);

    // Stop speaking
    const stopJarvis = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        speechQueueRef.current = [];
        setIsJarvisSpeaking(false);
        setCurrentSpeech('');
    }, []);

    // Toggle J.A.R.V.I.S. on/off
    const toggleJarvis = useCallback(() => {
        setIsJarvisEnabled(prev => {
            const newValue = !prev;
            if (newValue) {
                // Greet on activation
                setTimeout(() => {
                    if (!hasGreetedRef.current) {
                        const greeting = getTimeBasedGreeting();
                        const synth = window.speechSynthesis;
                        const utterance = new SpeechSynthesisUtterance(greeting);
                        const voices = synth.getVoices();
                        const britishVoice = voices.find(v => /Daniel/i.test(v.name) || /en-GB/i.test(v.lang));
                        if (britishVoice) utterance.voice = britishVoice;
                        utterance.rate = 0.95;
                        utterance.pitch = 0.9;
                        utterance.onstart = () => {
                            setIsJarvisSpeaking(true);
                            setCurrentSpeech(greeting);
                        };
                        utterance.onend = () => {
                            setIsJarvisSpeaking(false);
                            setCurrentSpeech('');
                            hasGreetedRef.current = true;
                        };
                        synth.speak(utterance);
                    }
                }, 100);
            } else {
                // Farewell on deactivation
                stopJarvis();
            }
            return newValue;
        });
    }, [stopJarvis]);

    // Stop speaking when disabled
    useEffect(() => {
        if (!isJarvisEnabled) {
            stopJarvis();
        }
    }, [isJarvisEnabled, stopJarvis]);

    // Idle timer for random comments
    useEffect(() => {
        if (!isJarvisEnabled) return;

        const resetIdleTimer = () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            idleTimerRef.current = setTimeout(() => {
                if (isJarvisEnabled && !isJarvisSpeaking) {
                    jarvisRespond('idle');
                }
            }, 120000); // 2 minutes idle
        };

        // Reset on user activity
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetIdleTimer));
        resetIdleTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, resetIdleTimer));
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, [isJarvisEnabled, isJarvisSpeaking, jarvisRespond]);

    // Load voices on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }, []);

    return (
        <JarvisProviderContext.Provider value={{
            isJarvisEnabled,
            isJarvisSpeaking,
            toggleJarvis,
            jarvisSpeak,
            jarvisRespond,
            stopJarvis,
            currentSpeech,
        }}>
            {children}
        </JarvisProviderContext.Provider>
    );
}

export function useJarvis(): JarvisProviderContextType {
    const context = useContext(JarvisProviderContext);
    if (context === undefined) {
        throw new Error('useJarvis must be used within a JarvisProvider');
    }
    return context as JarvisProviderContextType;
}
