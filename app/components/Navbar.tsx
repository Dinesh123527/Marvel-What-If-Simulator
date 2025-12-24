'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSoundEffect } from '../contexts/AudioProvider';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/scenarios', label: 'Scenarios' },
    { href: '/characters', label: 'Characters' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/personality', label: 'Personality' },
    { href: '/chat', label: 'Chat' },
    { href: '/multiverse', label: 'Multiverse' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { playClick, playHover, initializeAudio } = useSoundEffect();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleClick = () => {
        initializeAudio();
        playClick();
    };

    const handleMobileMenuToggle = () => {
        initializeAudio();
        playClick();
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMobileLinkClick = () => {
        playClick();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                <div className="glass border-b border-white/5">
                    <div className="container-cosmic">
                        <div className="flex items-center justify-between h-[var(--nav-height)]">
                            {/* Logo */}
                            <Link href="/" className="group flex items-center gap-3" onClick={handleClick}>
                                <motion.div
                                    className="relative w-10 h-10 flex items-center justify-center"
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-quantum-purple to-nexus-blue rounded-lg opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-quantum-purple to-nexus-blue rounded-lg blur-lg opacity-50" />
                                    <span className="relative text-white font-bold text-lg">∞</span>
                                </motion.div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg tracking-tight">
                                        WHAT IF<span className="text-quantum-purple">?</span>
                                    </span>
                                    <span className="text-[10px] text-text-muted tracking-[0.2em] uppercase -mt-1 hidden sm:block">
                                        MCU Simulator
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex items-center gap-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="relative px-4 py-2 group"
                                            onClick={handleClick}
                                            onMouseEnter={playHover}
                                        >
                                            <span
                                                className={`relative z-10 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
                                                    }`}
                                            >
                                                {link.label}
                                            </span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 bg-white/5 rounded-lg border border-white/10"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* CTA Button - Hidden on mobile */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="hidden md:block"
                            >
                                <Link
                                    href="/scenarios"
                                    className="btn-primary text-sm px-5 py-2.5"
                                    onClick={handleClick}
                                    onMouseEnter={playHover}
                                >
                                    <span className="relative z-10">Start Simulation</span>
                                    <svg
                                        className="w-4 h-4 relative z-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </Link>
                            </motion.div>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden p-2 text-text-secondary hover:text-white transition-colors"
                                onClick={handleMobileMenuToggle}
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-72 bg-cosmic-deep border-l border-white/10 z-[60] lg:hidden"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <span className="text-white font-bold">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-text-secondary hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Drawer Links */}
                            <div className="p-4 space-y-1">
                                {navLinks.map((link, index) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={handleMobileLinkClick}
                                                className={`block px-4 py-3 rounded-lg transition-all ${isActive
                                                        ? 'bg-quantum-purple/20 text-white border border-quantum-purple/30'
                                                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Drawer CTA */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                                <Link
                                    href="/scenarios"
                                    onClick={handleMobileLinkClick}
                                    className="btn-gold w-full justify-center text-center py-3"
                                >
                                    Start Simulation
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
