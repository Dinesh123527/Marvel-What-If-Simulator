'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TVAAlertProps {
    type?: 'warning' | 'danger' | 'success' | 'info';
    title: string;
    message: string;
    isVisible?: boolean;
    onClose?: () => void;
    autoHide?: boolean;
    autoHideDuration?: number;
}

const alertConfig = {
    warning: {
        icon: '⚠️',
        border: 'border-tva-gold',
        text: 'text-tva-gold',
        bg: 'bg-tva-gold/10',
    },
    danger: {
        icon: '🚨',
        border: 'border-reality-red',
        text: 'text-reality-red',
        bg: 'bg-reality-red/10',
    },
    success: {
        icon: '✅',
        border: 'border-timeline-green',
        text: 'text-timeline-green',
        bg: 'bg-timeline-green/10',
    },
    info: {
        icon: 'ℹ️',
        border: 'border-quantum-purple',
        text: 'text-quantum-purple',
        bg: 'bg-quantum-purple/10',
    },
};

export default function TVAAlert({
    type = 'warning',
    title,
    message,
    isVisible = true,
    onClose,
    autoHide = false,
    autoHideDuration = 5000
}: TVAAlertProps) {
    const [show, setShow] = useState(isVisible);
    const config = alertConfig[type];

    useEffect(() => {
        setShow(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (autoHide && show) {
            const timer = setTimeout(() => {
                setShow(false);
                onClose?.();
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [autoHide, autoHideDuration, show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative max-w-2xl mx-auto"
                >
                    {/* TVA Datapad Device Container */}
                    <div className={`
                        relative overflow-hidden rounded-lg 
                        border-2 ${config.border} 
                        bg-black/80 backdrop-blur-xl 
                        p-1 shadow-[0_0_30px_rgba(0,0,0,0.5)]
                    `}>
                        {/* CRT Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30 animate-scanline" />

                        {/* Top Bar (Tech decoration) */}
                        <div className="flex justify-between items-center px-4 py-1.5 border-b border-white/10 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            </div>
                            <div className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                                TVA-NET // SECURE
                            </div>
                            <div className="text-[10px] font-mono text-tva-gold">
                                V.8.2.1
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex gap-5">
                            {/* Animated Icon Box */}
                            <div className={`
                                w-14 h-14 flex-shrink-0 flex items-center justify-center 
                                rounded border ${config.border} ${config.bg}
                                relative overflow-hidden group
                            `}>
                                <div className={`absolute inset-0 opacity-20 ${config.bg}`} />
                                <motion.span
                                    className="text-2xl relative z-10"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {config.icon}
                                </motion.span>

                                {/* Corner Accents */}
                                <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${config.border}`} />
                                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${config.border}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={`text-lg font-bold font-mono tracking-tight mb-1 ${config.text} uppercase flex items-center gap-2`}>
                                    {title}
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-current opacity-60">ALERT</span>
                                </h4>
                                <p className="text-sm text-text-secondary leading-relaxed font-sans">
                                    {message}
                                </p>
                            </div>

                            {onClose && (
                                <button
                                    onClick={() => {
                                        setShow(false);
                                        onClose();
                                    }}
                                    className="flex-shrink-0 self-start text-text-muted hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Bottom Tech Details */}
                        <div className="px-4 py-2 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] font-mono text-text-muted uppercase tracking-wider">
                            <span>ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                            <span className={config.text}>// VARIANCE DETECTED</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
