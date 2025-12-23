'use client';

import { motion } from 'framer-motion';
import { useSoundEffect } from '../../contexts/AudioProvider';

interface QuizOptionsProps {
    options: string[];
    selectedAnswer: string | null;
    correctAnswer: string;
    isAnswered: boolean;
    onSelectAnswer: (answer: string) => void;
}

export default function QuizOptions({
    options,
    selectedAnswer,
    correctAnswer,
    isAnswered,
    onSelectAnswer,
}: QuizOptionsProps) {
    const { playClick, playHover } = useSoundEffect();

    const getOptionStyle = (option: string) => {
        if (!isAnswered) {
            return 'bg-cosmic-elevated border-white/10 hover:border-quantum-purple/50 hover:bg-white/5';
        }

        if (option === correctAnswer) {
            return 'bg-green-500/20 border-green-500/50 text-green-400';
        }

        if (option === selectedAnswer && option !== correctAnswer) {
            return 'bg-red-500/20 border-red-500/50 text-red-400';
        }

        return 'bg-cosmic-elevated/50 border-white/5 opacity-50';
    };

    const handleSelect = (option: string) => {
        if (isAnswered) return;
        playClick();
        onSelectAnswer(option);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, index) => (
                <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => !isAnswered && playHover()}
                    disabled={isAnswered}
                    className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${getOptionStyle(option)}`}
                >
                    {/* Option Letter */}
                    <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {String.fromCharCode(65 + index)}
                    </span>

                    {/* Option Text */}
                    <span className="block pl-10 text-sm font-medium text-white">
                        {option}
                    </span>

                    {/* Correct/Wrong Indicator */}
                    {isAnswered && option === correctAnswer && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 text-lg"
                        >
                            ✅
                        </motion.span>
                    )}
                    {isAnswered && option === selectedAnswer && option !== correctAnswer && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-4 right-4 text-lg"
                        >
                            ❌
                        </motion.span>
                    )}
                </motion.button>
            ))}
        </div>
    );
}
