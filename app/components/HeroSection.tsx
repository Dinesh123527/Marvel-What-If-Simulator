'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSoundEffect } from '../contexts/AudioProvider';

export default function HeroSection() {
    const { playClick, playHover, initializeAudio } = useSoundEffect();

    const handleClick = () => {
        initializeAudio();
        playClick();
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[var(--nav-height)]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Cosmic Rings */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                >
                    <div className="absolute inset-0 rounded-full border border-quantum-purple/20" />
                    <div className="absolute inset-4 md:inset-8 rounded-full border border-nexus-blue/15" />
                    <div className="absolute inset-8 md:inset-16 rounded-full border border-multiverse-pink/10" />
                </motion.div>

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-quantum-purple/30 to-transparent blur-3xl"
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-nexus-blue/20 to-transparent blur-3xl"
                    animate={{
                        y: [0, 40, 0],
                        x: [0, -30, 0],
                        scale: [1, 0.8, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-tva-gold/20 to-transparent blur-2xl"
                    animate={{
                        y: [0, 20, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Hero Content */}
            <div className="container-cosmic relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Tagline Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-tva-gold/30 mb-8">
                            <span className="w-2 h-2 rounded-full bg-tva-gold animate-pulse" />
                            <span className="text-sm text-tva-gold font-medium">TVA Approved Simulation</span>
                        </div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <span className="block text-white">One Decision.</span>
                        <span className="block gradient-text bg-gradient-to-r from-quantum-purple via-nexus-blue to-multiverse-pink">
                            Infinite Universes.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Explore what could have been. Change a single moment in MCU history
                        and watch as the multiverse unfolds with entirely new possibilities.
                    </motion.p>

                    {/* CTA Buttons with Sound */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Link
                            href="/scenarios"
                            className="btn-gold text-lg px-8 py-4 group"
                            onClick={handleClick}
                            onMouseEnter={playHover}
                        >
                            <span>Begin Simulation</span>
                            <motion.svg
                                className="w-5 h-5 ml-2 inline-block"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </motion.svg>
                        </Link>
                        <Link
                            href="/multiverse"
                            className="btn-secondary text-lg px-8 py-4"
                            onClick={handleClick}
                            onMouseEnter={playHover}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            View Multiverse
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold gradient-text-gold mb-1">5</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">Canon Events</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">15</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">Divergences</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-timeline-green mb-1">∞</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">Possibilities</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-2"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1 h-2 bg-quantum-purple rounded-full"
                        animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
