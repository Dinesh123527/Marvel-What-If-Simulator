'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSoundEffect } from '../../contexts/AudioProvider';

interface QuizAnswer {
    correct: boolean;
    character: string;
    userAnswer: string;
}

interface QuizResultsProps {
    score: number;
    totalQuestions: number;
    bestStreak: number;
    answers: QuizAnswer[];
    mode: 'stats' | 'hints' | 'silhouette';
    onPlayAgain: () => void;
    onChangeMode: () => void;
    highScore: number;
    isNewHighScore: boolean;
}

function Confetti() {
    const [particles, setParticles] = useState<Array<{ x: number; delay: number; color: string }>>([]);

    useEffect(() => {
        const colors = ['#f5a623', '#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#ec4899'];
        const newParticles = Array.from({ length: 50 }, () => ({
            x: Math.random() * 100,
            delay: Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        left: `${particle.x}%`,
                        backgroundColor: particle.color,
                    }}
                    initial={{ y: -20, opacity: 1, rotate: 0 }}
                    animate={{
                        y: '100vh',
                        opacity: [1, 1, 0],
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        delay: particle.delay,
                        ease: 'easeIn',
                    }}
                />
            ))}
        </div>
    );
}

function getGrade(score: number, maxScore: number): { grade: string; color: string; message: string } {
    const percentage = (score / maxScore) * 100;

    if (percentage >= 90) return { grade: 'S', color: 'text-tva-gold', message: 'Legendary! You are The Watcher!' };
    if (percentage >= 75) return { grade: 'A', color: 'text-green-400', message: 'Outstanding! A true believer!' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', message: 'Great job! Keep exploring the multiverse!' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-400', message: 'Not bad! There\'s room to grow.' };
    return { grade: 'D', color: 'text-red-400', message: 'Keep practicing! The multiverse awaits.' };
}

export default function QuizResults({
    score,
    totalQuestions,
    bestStreak,
    answers,
    mode,
    onPlayAgain,
    onChangeMode,
    highScore,
    isNewHighScore,
}: QuizResultsProps) {
    const { playClick, playHover } = useSoundEffect();
    const maxScore = totalQuestions * 100;
    const { grade, color, message } = getGrade(score, maxScore);
    const correctCount = answers.filter(a => a.correct).length;

    const modeLabels = {
        stats: 'Stats Challenge',
        hints: 'Description Hints',
        silhouette: 'Silhouette Mystery',
    };

    const showConfetti = score >= maxScore * 0.75;

    return (
        <>
            {showConfetti && <Confetti />}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <span className={`text-8xl font-black ${color}`}>{grade}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-bold text-white mb-2"
                    >
                        Quiz Complete!
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-text-secondary"
                    >
                        {message}
                    </motion.p>

                    {isNewHighScore && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring' }}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tva-gold/20 border border-tva-gold/50 text-tva-gold"
                        >
                            <span>🏆</span>
                            <span className="font-bold">New High Score!</span>
                        </motion.div>
                    )}
                </div>

                {/* Stats Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-cosmic-surface/50 rounded-2xl border border-white/10 p-6 mb-6"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-black text-tva-gold">{score}</div>
                            <div className="text-xs text-text-muted uppercase">Score</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">{correctCount}/{totalQuestions}</div>
                            <div className="text-xs text-text-muted uppercase">Correct</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-quantum-purple flex items-center justify-center gap-1">
                                {bestStreak}
                                {bestStreak >= 3 && <span className="text-xl">🔥</span>}
                            </div>
                            <div className="text-xs text-text-muted uppercase">Best Streak</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-nexus-blue">{highScore}</div>
                            <div className="text-xs text-text-muted uppercase">High Score</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-text-secondary">
                        <span className="text-lg">
                            {mode === 'stats' ? '📊' : mode === 'hints' ? '💡' : '🔮'}
                        </span>
                        <span>{modeLabels[mode]}</span>
                    </div>
                </motion.div>

                {/* Answer Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-cosmic-surface/30 rounded-2xl border border-white/5 p-4 mb-6"
                >
                    <h3 className="text-sm font-bold text-white mb-3">Answer Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {answers.map((answer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.05 }}
                                className={`p-2 rounded-lg text-center ${answer.correct
                                    ? 'bg-green-500/20 border border-green-500/30'
                                    : 'bg-red-500/20 border border-red-500/30'
                                    }`}
                                title={`${answer.character} - Your answer: ${answer.userAnswer}`}
                            >
                                <span className="text-lg">{answer.correct ? '✅' : '❌'}</span>
                                <div className="text-[10px] text-text-muted truncate mt-1">
                                    {answer.character}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            playClick();
                            onPlayAgain();
                        }}
                        onMouseEnter={playHover}
                        className="flex-1 btn-primary py-4"
                    >
                        <span>🔄</span>
                        <span>Play Again</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            playClick();
                            onChangeMode();
                        }}
                        onMouseEnter={playHover}
                        className="flex-1 btn-secondary py-4"
                    >
                        <span>🎮</span>
                        <span>Try Different Mode</span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </>
    );
}
