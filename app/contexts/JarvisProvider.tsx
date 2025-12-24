'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { executeNavigation, processJarvisCommand } from '../lib/ai/jarvis-commands';
import { getJarvisResponse, getTimeBasedGreeting, type JarvisContext as JarvisContextType } from '../lib/jarvis-ai';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface JarvisProviderContextType {
    isJarvisEnabled: boolean;
    isJarvisSpeaking: boolean;
    isRecognizing: boolean;
    toggleJarvis: () => void;
    jarvisSpeak: (text: string, priority?: 'low' | 'normal' | 'high') => void;
    jarvisRespond: (context: JarvisContextType) => void;
    stopJarvis: () => void;
    currentSpeech: string;
    lastTranscript: string;
}

const JarvisProviderContext = createContext<JarvisProviderContextType | undefined>(undefined);


export function JarvisProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [isJarvisEnabled, setIsJarvisEnabled] = useState(false);
    const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);
    const [currentSpeech, setCurrentSpeech] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [lastTranscript, setLastTranscript] = useState('');

    const speechQueueRef = useRef<string[]>([]);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasGreetedRef = useRef(false);
    const recognitionRef = useRef<any>(null);
    const shouldRestartRecognitionRef = useRef(false);
    const lastSpokenTextRef = useRef<string>('');
    const isJarvisEnabledRef = useRef(false); // Ref to avoid stale closures

    // Keep ref in sync with state
    useEffect(() => {
        isJarvisEnabledRef.current = isJarvisEnabled;
    }, [isJarvisEnabled]);

    // Hydrate
    useEffect(() => {
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
        const priorityPatterns = [
            /Daniel/i,
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

        return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
    }, []);

    // Check if input might be J.A.R.V.I.S. hearing itself
    const isSelfEcho = useCallback((input: string): boolean => {
        const normalized = input.toLowerCase().trim();

        // Ignore very short inputs (less than 3 words)
        if (normalized.split(' ').length < 2) return true;

        // Ignore if it's similar to what J.A.R.V.I.S. just said
        if (lastSpokenTextRef.current) {
            const lastSpoken = lastSpokenTextRef.current.toLowerCase();
            if (lastSpoken.includes(normalized) || normalized.includes(lastSpoken.substring(0, 20))) {
                return true;
            }
        }

        // Ignore common self-echo phrases
        const selfEchoPhrases = [
            "i'm listening",
            "listening sir",
            "yes sir",
            "good morning",
            "good afternoon",
            "good evening",
            "at your service"
        ];

        return selfEchoPhrases.some(phrase => normalized.includes(phrase));
    }, []);

    // Start continuous voice recognition
    const startRecognition = useCallback(() => {
        console.log('🚀 startRecognition called, enabled:', isJarvisEnabledRef.current);
        if (typeof window === 'undefined' || !isJarvisEnabledRef.current) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported');
            return;
        }

        // Stop any existing
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsRecognizing(true);
            console.log('🎤 Voice recognition started - listening...');
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            if (interimTranscript) {
                setLastTranscript(interimTranscript);
            }

            if (finalTranscript) {
                const command = finalTranscript.trim();
                console.log('📝 Voice input received:', command);

                // Filter out self-echo (J.A.R.V.I.S. hearing itself)
                if (isSelfEcho(command)) {
                    console.log('🔇 Ignoring self-echo or short input:', command);
                    return;
                }

                console.log('✅ Processing command:', command);
                setLastTranscript(command);

                // Process the command
                const result = processJarvisCommand(command);
                console.log('📤 Command result:', result);

                // Pause recognition while speaking
                shouldRestartRecognitionRef.current = true;
                try { recognition.stop(); } catch (e) { /* ignore */ }

                // Speak response
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();

                    // Save what we're about to say to filter self-echo
                    lastSpokenTextRef.current = result.speech;

                    const utterance = new SpeechSynthesisUtterance(result.speech);
                    const voice = getBritishVoice();
                    if (voice) utterance.voice = voice;
                    utterance.rate = 0.95;
                    utterance.pitch = 0.9;

                    utterance.onstart = () => {
                        setIsJarvisSpeaking(true);
                        setCurrentSpeech(result.speech);
                    };

                    utterance.onend = () => {
                        setIsJarvisSpeaking(false);
                        setCurrentSpeech('');

                        // Navigate if needed
                        if (result.type === 'navigate' && result.route) {
                            executeNavigation(router, result.route);
                        }

                        // Restart recognition after speaking
                        console.log('🔄 Speech ended, restarting recognition...');
                        if (shouldRestartRecognitionRef.current && isJarvisEnabledRef.current) {
                            setTimeout(() => startRecognition(), 1500);
                        }
                    };

                    utterance.onerror = () => {
                        setIsJarvisSpeaking(false);
                        setCurrentSpeech('');
                        // Ensure recognition restarts even on error
                        console.log('⚠️ Speech error, restarting recognition...');
                        if (shouldRestartRecognitionRef.current && isJarvisEnabledRef.current) {
                            setTimeout(() => startRecognition(), 1500);
                        }
                    };

                    window.speechSynthesis.speak(utterance);
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.log('Speech recognition error:', event.error);
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // Restart recognition
                if (isJarvisEnabledRef.current && shouldRestartRecognitionRef.current) {
                    console.log('🔄 Restarting after error:', event.error);
                    setTimeout(() => startRecognition(), 1000);
                }
            }
            setIsRecognizing(false);
        };

        recognition.onend = () => {
            console.log('🔚 Recognition ended, shouldRestart:', shouldRestartRecognitionRef.current, 'enabled:', isJarvisEnabledRef.current);
            setIsRecognizing(false);
            // Auto-restart if enabled
            if (isJarvisEnabledRef.current && shouldRestartRecognitionRef.current) {
                console.log('🔄 Auto-restarting recognition...');
                setTimeout(() => startRecognition(), 1500);
            }
        };

        recognitionRef.current = recognition;
        shouldRestartRecognitionRef.current = true;

        try {
            recognition.start();
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    }, [getBritishVoice, router, isSelfEcho]);

    // Stop recognition
    const stopRecognition = useCallback(() => {
        shouldRestartRecognitionRef.current = false;
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
            recognitionRef.current = null;
        }
        setIsRecognizing(false);
    }, []);

    // Speak text with J.A.R.V.I.S. voice
    const jarvisSpeak = useCallback((text: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
        if (!isJarvisEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

        if (priority === 'high') {
            window.speechSynthesis.cancel();
            speechQueueRef.current = [];
        }

        if (priority === 'low' && isJarvisSpeaking) return;

        // Pause recognition while speaking
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getBritishVoice();
        if (voice) utterance.voice = voice;

        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            setIsJarvisSpeaking(true);
            setCurrentSpeech(text);
        };

        utterance.onend = () => {
            setIsJarvisSpeaking(false);
            setCurrentSpeech('');
            currentUtteranceRef.current = null;

            if (speechQueueRef.current.length > 0) {
                const next = speechQueueRef.current.shift();
                if (next) jarvisSpeak(next);
            } else if (isJarvisEnabled) {
                // Restart recognition after speaking
                setTimeout(() => startRecognition(), 500);
            }
        };

        utterance.onerror = () => {
            setIsJarvisSpeaking(false);
            setCurrentSpeech('');
            // Ensure recognition restarts even on error
            if (isJarvisEnabled) {
                setTimeout(() => startRecognition(), 500);
            }
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isJarvisEnabled, isJarvisSpeaking, getBritishVoice, startRecognition]);

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
        stopRecognition();
        speechQueueRef.current = [];
        setIsJarvisSpeaking(false);
        setCurrentSpeech('');
        setLastTranscript('');
    }, [stopRecognition]);

    // Toggle J.A.R.V.I.S. on/off
    const toggleJarvis = useCallback(() => {
        setIsJarvisEnabled(prev => {
            const newValue = !prev;
            if (newValue) {
                // Enable - greet and start listening
                setTimeout(() => {
                    const greeting = hasGreetedRef.current
                        ? "I'm listening, sir."
                        : getTimeBasedGreeting() + " I'm listening.";

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
                        // Start continuous recognition after greeting
                        startRecognition();
                    };

                    utterance.onerror = () => {
                        setIsJarvisSpeaking(false);
                        setCurrentSpeech('');
                        hasGreetedRef.current = true;
                        // Start continuous recognition even if greeting fails
                        startRecognition();
                    };

                    synth.speak(utterance);
                }, 100);
            } else {
                // Disable
                stopJarvis();
            }
            return newValue;
        });
    }, [stopJarvis, startRecognition]);

    // Stop when disabled
    useEffect(() => {
        if (!isJarvisEnabled) {
            stopJarvis();
        }
    }, [isJarvisEnabled, stopJarvis]);

    // Idle timer
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
            }, 180000); // 3 minutes
        };

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

    // Load voices
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
            isRecognizing,
            toggleJarvis,
            jarvisSpeak,
            jarvisRespond,
            stopJarvis,
            currentSpeech,
            lastTranscript,
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
