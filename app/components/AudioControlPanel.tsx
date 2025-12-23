'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio } from '../contexts/AudioProvider';

export default function AudioControlPanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        isAmbientEnabled,
        isSfxEnabled,
        isScreenReaderEnabled,
        isSpeaking,
        masterVolume,
        toggleAmbient,
        toggleSfx,
        toggleScreenReader,
        setMasterVolume,
        initializeAudio,
    } = useAudio();

    const handleToggle = () => {
        initializeAudio();
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
            {/* Expanded Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-16 right-0 w-72 glass rounded-2xl p-5 border border-white/10 shadow-2xl"
                    >
                        {/* Panel Header */}
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-quantum-purple to-nexus-blue flex items-center justify-center">
                                <span className="text-lg">🔊</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Audio Settings</h3>
                                <p className="text-text-muted text-xs">Control the multiverse sounds</p>
                            </div>
                        </div>

                        {/* Ambient Music Toggle */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">🌌</span>
                                    <div>
                                        <p className="text-white text-sm font-medium">Space Ambience</p>
                                        <p className="text-text-muted text-xs">Gentle cosmic wind</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleAmbient}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${isAmbientEnabled
                                        ? 'bg-gradient-to-r from-quantum-purple to-nexus-blue'
                                        : 'bg-white/10'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                        animate={{ left: isAmbientEnabled ? '26px' : '4px' }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>

                            {/* SFX Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">✨</span>
                                    <div>
                                        <p className="text-white text-sm font-medium">Sound Effects</p>
                                        <p className="text-text-muted text-xs">UI interactions & alerts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleSfx}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${isSfxEnabled
                                        ? 'bg-gradient-to-r from-tva-gold to-tva-orange'
                                        : 'bg-white/10'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                        animate={{ left: isSfxEnabled ? '26px' : '4px' }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>

                            {/* Screen Reader Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{isSpeaking ? (
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            🗣️
                                        </motion.span>
                                    ) : '🗣️'}</span>
                                    <div>
                                        <p className="text-white text-sm font-medium">Screen Reader</p>
                                        <p className="text-text-muted text-xs">Text-to-speech narration</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleScreenReader}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${isScreenReaderEnabled
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                        : 'bg-white/10'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                        animate={{ left: isScreenReaderEnabled ? '26px' : '4px' }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div className="pt-3 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white text-sm font-medium">Master Volume</span>
                                    <span className="text-text-muted text-xs">{Math.round(masterVolume * 100)}%</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={masterVolume * 100}
                                        onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
                                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                                            [&::-webkit-slider-thumb]:appearance-none
                                            [&::-webkit-slider-thumb]:w-4
                                            [&::-webkit-slider-thumb]:h-4
                                            [&::-webkit-slider-thumb]:rounded-full
                                            [&::-webkit-slider-thumb]:bg-gradient-to-r
                                            [&::-webkit-slider-thumb]:from-quantum-purple
                                            [&::-webkit-slider-thumb]:to-nexus-blue
                                            [&::-webkit-slider-thumb]:shadow-lg
                                            [&::-webkit-slider-thumb]:cursor-pointer
                                            [&::-moz-range-thumb]:w-4
                                            [&::-moz-range-thumb]:h-4
                                            [&::-moz-range-thumb]:rounded-full
                                            [&::-moz-range-thumb]:bg-gradient-to-r
                                            [&::-moz-range-thumb]:from-quantum-purple
                                            [&::-moz-range-thumb]:to-nexus-blue
                                            [&::-moz-range-thumb]:border-0
                                            [&::-moz-range-thumb]:cursor-pointer"
                                    />
                                    <div
                                        className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-quantum-purple to-nexus-blue pointer-events-none"
                                        style={{ width: `${masterVolume * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ambient indicator */}
                        {isAmbientEnabled && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 pt-3 border-t border-white/10"
                            >
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-quantum-purple"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="text-text-muted text-xs">Cosmic ambience playing...</span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                onClick={handleToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-300 ${isAmbientEnabled || isSfxEnabled
                    ? 'bg-gradient-to-br from-quantum-purple to-nexus-blue'
                    : 'glass border border-white/10'
                    }`}
            >
                <span className="text-2xl relative">
                    {isAmbientEnabled || isSfxEnabled ? (
                        <motion.span
                            key="on"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            🔊
                        </motion.span>
                    ) : (
                        <motion.span
                            key="off"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            🔇
                        </motion.span>
                    )}
                </span>

                {/* Animated rings when ambient is on */}
                {isAmbientEnabled && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-quantum-purple/50"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-nexus-blue/50"
                            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}
