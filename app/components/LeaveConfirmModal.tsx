'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useSoundEffect } from '../contexts/AudioProvider';

interface LeaveConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}

export default function LeaveConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    title = "Leaving So Soon?",
    message = "Your progress will be lost. Are you sure you want to abandon your mission?",
}: LeaveConfirmModalProps) {
    const { playClick, playHover } = useSoundEffect();

    const handleConfirm = () => {
        playClick();
        onConfirm();
    };

    const handleCancel = () => {
        playClick();
        onCancel();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                        onClick={handleCancel}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                                duration: 0.5
                            }}
                            className="relative w-full max-w-md"
                        >
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-quantum-purple via-tva-gold to-nexus-blue rounded-3xl blur-lg opacity-75 animate-pulse" />

                            {/* Main card */}
                            <div className="relative bg-gradient-to-br from-[#0a0f1a] via-[#0d1525] to-[#0a0f1a] rounded-2xl border border-white/10 overflow-hidden">
                                {/* Animated top border glow */}
                                <motion.div
                                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-tva-gold to-transparent"
                                    animate={{
                                        backgroundPosition: ['200% 0%', '-200% 0%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }}
                                    style={{ backgroundSize: '200% 100%' }}
                                />

                                {/* HUD corner decorations */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-quantum-purple/50 rounded-tl-xl" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-quantum-purple/50 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-quantum-purple/50 rounded-bl-xl" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-quantum-purple/50 rounded-br-xl" />

                                {/* Content */}
                                <div className="relative p-8">
                                    {/* Warning Icon */}
                                    <motion.div
                                        initial={{ rotate: -10 }}
                                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-6 relative"
                                    >
                                        {/* Outer ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-4 border-tva-gold/30"
                                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        {/* Inner glow */}
                                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-tva-gold/20 to-orange-500/20 backdrop-blur-sm" />
                                        {/* Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                            ⚠️
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-2xl md:text-3xl font-bold text-center mb-3"
                                    >
                                        <span className="bg-gradient-to-r from-white via-tva-gold to-white bg-clip-text text-transparent">
                                            {title}
                                        </span>
                                    </motion.h2>

                                    {/* Message */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-center text-text-secondary text-lg mb-8 leading-relaxed"
                                    >
                                        {message}
                                    </motion.p>

                                    {/* Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex flex-col sm:flex-row gap-4"
                                    >
                                        {/* Stay Button - Primary */}
                                        <motion.button
                                            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleCancel}
                                            onMouseEnter={playHover}
                                            className="flex-1 relative group overflow-hidden rounded-xl py-4 px-6 font-bold text-white"
                                        >
                                            {/* Animated gradient background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-quantum-purple via-nexus-blue to-quantum-purple"
                                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                                style={{ backgroundSize: '200% 200%' }}
                                            />
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <span>🛡️</span>
                                                <span>Stay & Continue</span>
                                            </span>
                                        </motion.button>

                                        {/* Leave Button - Secondary */}
                                        <motion.button
                                            whileHover={{ scale: 1.03, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleConfirm}
                                            onMouseEnter={playHover}
                                            className="flex-1 rounded-xl py-4 px-6 font-bold text-red-400 border-2 border-red-500/30 bg-red-500/10 hover:border-red-500/50 transition-all"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <span>🚪</span>
                                                <span>Leave Anyway</span>
                                            </span>
                                        </motion.button>
                                    </motion.div>

                                    {/* Footer hint */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-center text-text-muted text-xs mt-6"
                                    >
                                        Press <kbd className="px-2 py-1 bg-white/5 rounded text-text-secondary">ESC</kbd> to stay
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
