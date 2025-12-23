'use client';

import { motion } from 'framer-motion';
import CharacterIcon from '../CharacterIcon';

interface QuizQuestionData {
    stats?: {
        intelligence: number;
        strength: number;
        speed: number;
        durability: number;
        power: number;
        combat: number;
    };
    hints?: string[];
    iconName?: string;
    alignment?: string;
}

interface QuizQuestionProps {
    mode: 'stats' | 'hints' | 'silhouette';
    data: QuizQuestionData;
    hintsRevealed: number;
    silhouetteLevel: number;
    onRevealHint: () => void;
    onRevealSilhouette: () => void;
    questionNumber: number;
    totalQuestions: number;
}

// Stat bar component
function StatBar({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted w-12 uppercase font-medium">{label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: delay * 0.1, ease: 'easeOut' }}
                />
            </div>
            <motion.span
                className="text-sm text-white w-8 text-right font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay * 0.1 + 0.5 }}
            >
                {value}
            </motion.span>
        </div>
    );
}

export default function QuizQuestion({
    mode,
    data,
    hintsRevealed,
    silhouetteLevel,
    onRevealHint,
    onRevealSilhouette,
    questionNumber,
    totalQuestions,
}: QuizQuestionProps) {

    const alignmentColors = {
        hero: 'text-blue-400',
        villain: 'text-red-400',
        'anti-hero': 'text-purple-400',
    };

    const statColors = [
        'bg-gradient-to-r from-yellow-400 to-yellow-500',
        'bg-gradient-to-r from-red-400 to-red-500',
        'bg-gradient-to-r from-blue-400 to-blue-500',
        'bg-gradient-to-r from-green-400 to-green-500',
        'bg-gradient-to-r from-purple-400 to-purple-500',
        'bg-gradient-to-r from-orange-400 to-orange-500',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cosmic-surface/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm"
        >
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">
                        {mode === 'stats' ? '📊' : mode === 'hints' ? '💡' : '🔮'}
                    </span>
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            {mode === 'stats' && 'Guess by Stats'}
                            {mode === 'hints' && 'Guess by Hints'}
                            {mode === 'silhouette' && 'Guess the Silhouette'}
                        </h3>
                        <p className="text-xs text-text-muted">
                            Question {questionNumber} of {totalQuestions}
                        </p>
                    </div>
                </div>

                {data.alignment && (
                    <span className={`text-sm ${alignmentColors[data.alignment as keyof typeof alignmentColors] || 'text-white'} capitalize`}>
                        {data.alignment}
                    </span>
                )}
            </div>

            {/* Stats Mode */}
            {mode === 'stats' && data.stats && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    <p className="text-text-secondary text-sm mb-4">
                        Who has these power stats?
                    </p>
                    <StatBar label="INT" value={data.stats.intelligence} color={statColors[0]} delay={0} />
                    <StatBar label="STR" value={data.stats.strength} color={statColors[1]} delay={1} />
                    <StatBar label="SPD" value={data.stats.speed} color={statColors[2]} delay={2} />
                    <StatBar label="DUR" value={data.stats.durability} color={statColors[3]} delay={3} />
                    <StatBar label="PWR" value={data.stats.power} color={statColors[4]} delay={4} />
                    <StatBar label="CMB" value={data.stats.combat} color={statColors[5]} delay={5} />
                </motion.div>
            )}

            {/* Hints Mode */}
            {mode === 'hints' && data.hints && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <p className="text-text-secondary text-sm mb-4">
                        Use hints to identify this character. Each hint costs -30 points!
                    </p>

                    {/* Revealed Hints */}
                    <div className="space-y-3">
                        {data.hints.slice(0, hintsRevealed).map((hint, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10"
                            >
                                <span className="text-tva-gold text-lg">💡</span>
                                <p className="text-white text-sm">{hint}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Reveal More Button */}
                    {hintsRevealed < data.hints.length && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onRevealHint}
                            className="w-full py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-all cursor-pointer"
                        >
                            Reveal Hint ({hintsRevealed}/{data.hints.length}) • -30 points
                        </motion.button>
                    )}
                </motion.div>
            )}

            {/* Silhouette Mode */}
            {mode === 'silhouette' && data.iconName && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <p className="text-text-secondary text-sm mb-6 text-center">
                        Who is hiding in the shadows?
                    </p>

                    {/* Silhouette Display */}
                    <motion.div
                        className="w-40 h-40 rounded-full bg-cosmic-elevated flex items-center justify-center mb-6 relative overflow-hidden"
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <div
                            className="w-32 h-32 text-white/90"
                            style={{
                                filter: `blur(${Math.max(0, 8 - silhouetteLevel * 4)}px) grayscale(${Math.max(0, 100 - silhouetteLevel * 50)}%)`,
                                opacity: 0.3 + silhouetteLevel * 0.35,
                            }}
                        >
                            <CharacterIcon name={data.iconName} className="w-full h-full" />
                        </div>

                        {/* Mystery Overlay */}
                        {silhouetteLevel < 2 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="text-4xl">❓</span>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Clarity Level */}
                    <div className="flex items-center gap-2 mb-4">
                        {[0, 1, 2].map((level) => (
                            <div
                                key={level}
                                className={`w-3 h-3 rounded-full ${level <= silhouetteLevel
                                        ? 'bg-purple-500'
                                        : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Reveal Button */}
                    {silhouetteLevel < 2 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onRevealSilhouette}
                            className="py-3 px-6 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all cursor-pointer"
                        >
                            Clear the Shadows • -30 points
                        </motion.button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
