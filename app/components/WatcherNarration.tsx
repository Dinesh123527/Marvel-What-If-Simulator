'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAudio, useSoundEffect } from '../contexts/AudioProvider';
import { getRandomQuote, QuoteCategory } from '../lib/watcher-quotes';

interface WatcherNarrationProps {
    category: QuoteCategory;
    customQuote?: string;
    onComplete?: () => void;
    typingSpeed?: number;
    showAvatar?: boolean;
    className?: string;
}

export default function WatcherNarration({
    category,
    customQuote,
    onComplete,
    typingSpeed = 40,
    showAvatar = true,
    className = '',
}: WatcherNarrationProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [quote, setQuote] = useState('');
    const { playWatcherSpeak } = useSoundEffect();
    const { isScreenReaderEnabled, speakText } = useAudio();

    // Use refs for values that shouldn't trigger re-renders
    const indexRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onCompleteRef = useRef(onComplete);
    const playWatcherSpeakRef = useRef(playWatcherSpeak);
    const hasSpokenRef = useRef(false);

    // Keep refs updated
    onCompleteRef.current = onComplete;
    playWatcherSpeakRef.current = playWatcherSpeak;

    // Get the quote on mount
    useEffect(() => {
        const selectedQuote = customQuote || getRandomQuote(category);
        setQuote(selectedQuote);
        setDisplayedText('');
        setIsComplete(false);
        indexRef.current = 0;
        hasSpokenRef.current = false;
    }, [category, customQuote]);

    // Speak the full quote immediately when screen reader is enabled
    useEffect(() => {
        if (quote && isScreenReaderEnabled && !hasSpokenRef.current) {
            speakText(`The Watcher says: ${quote}`);
            hasSpokenRef.current = true;
        }
    }, [quote, isScreenReaderEnabled, speakText]);

    // Typewriter effect - separate from quote selection
    useEffect(() => {
        if (!quote) return;

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        indexRef.current = 0;
        setDisplayedText('');
        setIsComplete(false);

        intervalRef.current = setInterval(() => {
            if (indexRef.current < quote.length) {
                const newText = quote.slice(0, indexRef.current + 1);
                setDisplayedText(newText);

                // Play subtle sound on certain characters (less frequently)
                if (indexRef.current % 10 === 0) {
                    playWatcherSpeakRef.current();
                }

                indexRef.current++;
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setIsComplete(true);
                onCompleteRef.current?.();
            }
        }, typingSpeed);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [quote, typingSpeed]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative ${className}`}
        >
            {/* Cosmic background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-quantum-purple/10 via-transparent to-nexus-blue/10 rounded-2xl blur-xl" />

            <div className="relative glass rounded-2xl p-6 border border-quantum-purple/20 overflow-hidden">
                {/* CRT scanline effect overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.1) 2px, rgba(139, 92, 246, 0.1) 4px)',
                    }}
                />

                {/* Animated border glow */}
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
                        backgroundSize: '200% 100%',
                    }}
                    animate={{
                        backgroundPosition: ['100% 0', '-100% 0'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                <div className="relative flex gap-4">
                    {/* Watcher Avatar */}
                    {showAvatar && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="flex-shrink-0"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-void via-quantum-purple to-nexus-blue p-0.5">
                                <div className="w-full h-full rounded-full bg-cosmic-deep flex items-center justify-center relative overflow-hidden">
                                    {/* Watcher's Eye */}
                                    <motion.div
                                        className="relative"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <div className="text-3xl">👁️</div>
                                        {/* Eye glow */}
                                        <motion.div
                                            className="absolute inset-0 bg-quantum-purple/50 blur-lg"
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>

                                    {/* Cosmic particles */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-quantum-purple rounded-full"
                                            animate={{
                                                x: [0, Math.random() * 20 - 10],
                                                y: [0, Math.random() * 20 - 10],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.5,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Label */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-[10px] text-quantum-purple font-semibold tracking-wider uppercase mt-2"
                            >
                                The Watcher
                            </motion.p>
                        </motion.div>
                    )}

                    {/* Quote Content */}
                    <div className="flex-1 min-w-0">
                        {/* Quote marks */}
                        <span className="text-4xl text-quantum-purple/30 font-serif leading-none">"</span>

                        {/* Narration text */}
                        <p className="text-lg text-white font-medium leading-relaxed -mt-4 ml-4">
                            {displayedText}
                            {/* Typing cursor */}
                            {!isComplete && (
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="inline-block w-0.5 h-5 bg-quantum-purple ml-1 align-middle"
                                />
                            )}
                        </p>

                        {/* Status indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isComplete ? 1 : 0 }}
                            className="flex items-center gap-2 mt-4"
                        >
                            <motion.div
                                className="w-2 h-2 rounded-full bg-timeline-green"
                                animate={isComplete ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="text-xs text-text-muted">Observation complete</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Compact variant for inline use
export function WatcherQuoteInline({
    text,
    isTyping = false
}: {
    text: string;
    isTyping?: boolean;
}) {
    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text-secondary italic flex items-center gap-2"
        >
            <span className="text-quantum-purple">👁️</span>
            <span>"{text}"</span>
            {isTyping && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-quantum-purple"
                />
            )}
        </motion.p>
    );
}
