'use client';

import { motion } from 'framer-motion';

interface QuizScoreboardProps {
    score: number;
    streak: number;
    bestStreak: number;
    questionNumber: number;
    totalQuestions: number;
    mode: 'stats' | 'hints' | 'silhouette';
}

export default function QuizScoreboard({
    score,
    streak,
    bestStreak,
    questionNumber,
    totalQuestions,
    mode,
}: QuizScoreboardProps) {
    const modeEmoji = mode === 'stats' ? '📊' : mode === 'hints' ? '💡' : '🔮';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cosmic-surface/50 rounded-2xl border border-white/10 p-4 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between gap-4">
                {/* Mode & Progress */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{modeEmoji}</span>
                    <div>
                        <div className="text-sm text-text-muted">Progress</div>
                        <div className="text-white font-bold">
                            {questionNumber} / {totalQuestions}
                        </div>
                    </div>
                </div>

                {/* Score */}
                <div className="text-center">
                    <div className="text-sm text-text-muted">Score</div>
                    <motion.div
                        key={score}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-tva-gold"
                    >
                        {score}
                    </motion.div>
                </div>

                {/* Streak */}
                <div className="text-center">
                    <div className="text-sm text-text-muted">Streak</div>
                    <motion.div
                        key={streak}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center gap-1"
                    >
                        <span className="text-2xl font-bold text-white">{streak}</span>
                        {streak >= 3 && (
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                🔥
                            </motion.span>
                        )}
                    </motion.div>
                </div>

                {/* Best Streak */}
                <div className="text-center hidden sm:block">
                    <div className="text-sm text-text-muted">Best</div>
                    <div className="text-xl font-bold text-quantum-purple">
                        {bestStreak}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-quantum-purple to-nexus-blue rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </motion.div>
    );
}
