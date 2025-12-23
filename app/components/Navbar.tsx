'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSoundEffect } from '../contexts/AudioProvider';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/scenarios', label: 'Scenarios' },
    { href: '/characters', label: 'Characters' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/multiverse', label: 'Multiverse' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { playClick, playHover, initializeAudio } = useSoundEffect();

    const handleClick = () => {
        initializeAudio();
        playClick();
    };

    return (
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
                                <span className="text-[10px] text-text-muted tracking-[0.2em] uppercase -mt-1">
                                    MCU Simulator
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
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

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
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
                        <button className="md:hidden p-2 text-text-secondary hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
