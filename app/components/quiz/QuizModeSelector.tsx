'use client';

import { motion } from 'framer-motion';
import { useSoundEffect } from '../../contexts/AudioProvider';

interface QuizMode {
    id: 'stats' | 'hints' | 'silhouette';
    title: string;
    description: string;
    icon: string;
    gradient: string;
    difficulty: string;
}

const quizModes: QuizMode[] = [
    {
        id: 'stats',
        title: 'Stats Challenge',
        description: 'Analyze power stats to identify the hero. Test your knowledge of character abilities!',
        icon: '📊',
        gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
        difficulty: 'Medium',
    },
    {
        id: 'hints',
        title: 'Description Hints',
        description: 'Read progressive clues about a character. Fewer hints = more points!',
        icon: '💡',
        gradient: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/40',
        difficulty: 'Easy',
    },
    {
        id: 'silhouette',
        title: 'Silhouette Mystery',
        description: 'Recognize characters from their shadowy silhouette. True fans only!',
        icon: '🔮',
        gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/40',
        difficulty: 'Hard',
    },
];

interface QuizModeSelectorProps {
    onSelectMode: (mode: 'stats' | 'hints' | 'silhouette') => void;
    highScores: Record<string, number>;
}

export default function QuizModeSelector({ onSelectMode, highScores }: QuizModeSelectorProps) {
    const { playClick, playHover, initializeAudio } = useSoundEffect();

    const handleSelect = (mode: 'stats' | 'hints' | 'silhouette') => {
        initializeAudio();
        playClick();
        onSelectMode(mode);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Choose Your <span className="text-gradient">Challenge</span>
                </h2>
                <p className="text-text-secondary max-w-xl mx-auto">
                    Test your Marvel knowledge in three unique game modes. Each mode offers a different way to prove you&apos;re a true believer!
                </p>
            </motion.div>

            {/* Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quizModes.map((mode, index) => (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(mode.id)}
                        onMouseEnter={playHover}
                        className={`relative text-left rounded-2xl p-6 bg-gradient-to-br ${mode.gradient} border backdrop-blur-sm cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/10 group`}
                    >
                        {/* Icon */}
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                            {mode.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2">
                            {mode.title}
                        </h3>

                        {/* Description */}
                        <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                            {mode.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${mode.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    mode.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {mode.difficulty}
                            </span>

                            {highScores[mode.id] > 0 && (
                                <span className="text-xs text-tva-gold flex items-center gap-1">
                                    <span>🏆</span>
                                    {highScores[mode.id]}
                                </span>
                            )}
                        </div>

                        {/* Hover Arrow */}
                        <motion.div
                            className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </motion.div>
                    </motion.button>
                ))}
            </div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-8 text-center"
            >
                <div>
                    <div className="text-2xl font-bold text-white">10</div>
                    <div className="text-xs text-text-muted uppercase">Questions</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                    <div className="text-2xl font-bold text-tva-gold">100</div>
                    <div className="text-xs text-text-muted uppercase">Points Each</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                    <div className="text-2xl font-bold text-white">🔥</div>
                    <div className="text-xs text-text-muted uppercase">Streak Bonus</div>
                </div>
            </motion.div>
        </div>
    );
}
