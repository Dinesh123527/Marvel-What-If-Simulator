'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSoundEffect } from '../contexts/AudioProvider';
import { useJarvis } from '../contexts/JarvisProvider';

export default function JarvisAssistant() {
    const {
        isJarvisEnabled,
        isJarvisSpeaking,
        isRecognizing,
        toggleJarvis,
        currentSpeech,
        lastTranscript
    } = useJarvis();
    const { playClick, initializeAudio } = useSoundEffect();
    const [showTooltip, setShowTooltip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Show tooltip when speaking or recognizing
    useEffect(() => {
        if (isJarvisSpeaking && currentSpeech) {
            setShowTooltip(true);
        } else if (isRecognizing && lastTranscript) {
            setShowTooltip(true);
        } else {
            const timer = setTimeout(() => setShowTooltip(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isJarvisSpeaking, currentSpeech, isRecognizing, lastTranscript]);

    const handleToggle = () => {
        initializeAudio();
        playClick();
        toggleJarvis();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Speech Bubble / Listening Indicator */}
            <AnimatePresence>
                {showTooltip && (currentSpeech || (isRecognizing && lastTranscript)) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-20 right-0 w-72 max-w-[calc(100vw-3rem)]"
                    >
                        <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0f2847] rounded-xl border border-cyan-500/30 p-4 shadow-2xl">
                            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 rounded-tl" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50 rounded-tr" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50 rounded-bl" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 rounded-br" />

                            <div className="flex items-center gap-2 mb-2">
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${isRecognizing && !currentSpeech ? 'bg-red-500' : 'bg-cyan-400'}`}
                                    animate={{ opacity: [1, 0.4, 1], scale: isRecognizing ? [1, 1.2, 1] : 1 }}
                                    transition={{ duration: isRecognizing ? 0.8 : 1.5, repeat: Infinity }}
                                />
                                <span className="text-xs text-cyan-400 font-mono tracking-wider">
                                    {isRecognizing && !currentSpeech ? 'LISTENING...' : 'J.A.R.V.I.S.'}
                                </span>
                            </div>

                            <p className="text-sm text-white/90 leading-relaxed">
                                {currentSpeech || (isRecognizing ? `"${lastTranscript}"` : '')}
                            </p>

                            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#0a1628] border-r border-b border-cyan-500/30 transform rotate-45" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Listening Indicator (when no transcript yet) */}
            <AnimatePresence>
                {isRecognizing && !lastTranscript && !currentSpeech && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-20 right-0"
                    >
                        <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2847] rounded-xl border border-cyan-500/30 px-4 py-3 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-3 h-3 rounded-full bg-red-500"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <span className="text-sm text-cyan-400 font-mono">Listening...</span>
                                <div className="flex gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 bg-cyan-400 rounded-full"
                                            animate={{ height: ['6px', '14px', '6px'] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Arc Reactor Button */}
            <motion.button
                onClick={handleToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-16 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${isJarvisEnabled ? 'shadow-[0_0_30px_rgba(6,182,212,0.5)]' : ''
                    }`}
                aria-label={isJarvisEnabled ? 'Disable J.A.R.V.I.S.' : 'Enable J.A.R.V.I.S.'}
            >
                {/* Outer ring */}
                <div className={`absolute inset-0 rounded-full border-2 ${isJarvisEnabled ? 'border-cyan-400' : 'border-white/20'
                    } transition-colors duration-300`} />

                {/* Middle ring */}
                <motion.div
                    className={`absolute inset-2 rounded-full border ${isJarvisEnabled ? 'border-cyan-400/60' : 'border-white/10'
                        }`}
                    animate={isJarvisEnabled ? { rotate: 360 } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner glow */}
                <div className={`absolute inset-3 rounded-full ${isJarvisEnabled
                        ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
                        : 'bg-gradient-to-br from-white/10 to-white/5'
                    } transition-all duration-300`} />

                {/* Core */}
                <motion.div
                    className={`absolute inset-4 rounded-full ${isJarvisEnabled ? 'bg-cyan-300' : 'bg-white/20'
                        }`}
                    animate={isJarvisEnabled ? {
                        boxShadow: [
                            '0 0 10px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.6)',
                            '0 0 20px rgba(6,182,212,1), 0 0 40px rgba(6,182,212,0.8)',
                            '0 0 10px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.6)',
                        ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Speaking/Listening pulse rings */}
                {(isJarvisSpeaking || isRecognizing) && (
                    <>
                        <motion.div
                            className={`absolute inset-0 rounded-full border-2 ${isRecognizing && !isJarvisSpeaking ? 'border-red-400' : 'border-cyan-400'}`}
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.div
                            className={`absolute inset-0 rounded-full border-2 ${isRecognizing && !isJarvisSpeaking ? 'border-red-400' : 'border-cyan-400'}`}
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1, delay: 0.5, repeat: Infinity }}
                        />
                    </>
                )}

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg ${isJarvisEnabled ? 'text-cyan-900' : 'text-white/40'}`}>
                        {isJarvisEnabled ? '◉' : '○'}
                    </span>
                </div>
            </motion.button>

            {/* Hover label */}
            <AnimatePresence>
                {isHovered && !showTooltip && !isRecognizing && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-20 right-0 whitespace-nowrap"
                    >
                        <div className="bg-cosmic-deep/90 border border-white/10 rounded-lg px-3 py-2 text-xs">
                            <span className="text-white/80">
                                {isJarvisEnabled ? 'Disable J.A.R.V.I.S.' : 'Activate J.A.R.V.I.S.'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
