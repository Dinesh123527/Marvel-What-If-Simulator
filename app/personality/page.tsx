'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAudio, useSoundEffect } from '../contexts/AudioProvider';
import {
    calculateCharacterMatch,
    CharacterMatch,
    initTraitScores,
    personalityQuestions
} from '../lib/personality-quiz';

type GamePhase = 'intro' | 'playing' | 'result';

export default function PersonalityQuizPage() {
    const { playClick, playHover, initializeAudio } = useSoundEffect();
    const { isScreenReaderEnabled, speakText } = useAudio();

    const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [traitScores, setTraitScores] = useState(initTraitScores());
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [result, setResult] = useState<CharacterMatch | null>(null);
    const [characterImage, setCharacterImage] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const currentQuestion = personalityQuestions[currentQuestionIndex];

    // Fetch character image when result is available
    useEffect(() => {
        if (result) {
            fetch(`/api/characters/${result.imageId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data?.imageUrl) {
                        setCharacterImage(data.data.imageUrl);
                    }
                })
                .catch(console.error);
        }
    }, [result]);

    // Screen reader: announce question
    useEffect(() => {
        if (gamePhase === 'playing' && isScreenReaderEnabled && !isTransitioning) {
            const q = personalityQuestions[currentQuestionIndex];
            const answersText = q.answers.map((a, i) => `${i + 1}: ${a.text}`).join('. ');
            speakText(`Question ${currentQuestionIndex + 1} of ${personalityQuestions.length}. ${q.question}. Options: ${answersText}`);
        }
    }, [currentQuestionIndex, gamePhase, isScreenReaderEnabled, isTransitioning, speakText]);

    // Screen reader: announce result
    useEffect(() => {
        if (gamePhase === 'result' && result && isScreenReaderEnabled) {
            speakText(`Your result: You are ${result.heroName}! ${result.description}`);
        }
    }, [gamePhase, result, isScreenReaderEnabled, speakText]);

    const handleStart = () => {
        initializeAudio();
        playClick();
        setGamePhase('playing');
        setCurrentQuestionIndex(0);
        setTraitScores(initTraitScores());
        setSelectedAnswer(null);
        setResult(null);
        setCharacterImage(null);
    };

    const handleSelectAnswer = (answerIndex: number) => {
        if (selectedAnswer !== null || isTransitioning) return;
        playClick();

        setSelectedAnswer(answerIndex);
        setIsTransitioning(true);

        // Add traits from the selected answer
        const answer = currentQuestion.answers[answerIndex];
        setTraitScores(prev => {
            const updated = { ...prev };
            for (const trait of answer.traits) {
                updated[trait] = (updated[trait] || 0) + 1;
            }
            return updated;
        });

        // Move to next question or show result
        setTimeout(() => {
            if (currentQuestionIndex + 1 >= personalityQuestions.length) {
                // Calculate result
                const finalScores = { ...traitScores };
                for (const trait of answer.traits) {
                    finalScores[trait] = (finalScores[trait] || 0) + 1;
                }
                const match = calculateCharacterMatch(finalScores);
                setResult(match);
                setGamePhase('result');
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
            }
            setSelectedAnswer(null);
            setIsTransitioning(false);
        }, 600);
    };

    const handleRetake = () => {
        playClick();
        handleStart();
    };

    const handleShare = async () => {
        playClick();
        if (result) {
            const shareText = `I took the Marvel Identity Crisis Quiz and I'm ${result.heroName}! ⚡ "${result.quote}" - Find out which Marvel character YOU are!`;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Marvel Identity',
                        text: shareText,
                        url: window.location.href,
                    });
                } catch {
                    // User cancelled or share failed
                }
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(shareText + ' ' + window.location.href);
                alert('Copied to clipboard!');
            }
        }
    };

    return (
        <main className="min-h-screen pt-[var(--nav-height)]">
            {/* Header */}
            <section className="py-8 border-b border-white/5">
                <div className="container-cosmic">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Identity <span className="text-gradient">Crisis</span>
                            </h1>
                            <p className="text-text-secondary text-sm mt-1">
                                Which Marvel character lives within you?
                            </p>
                        </motion.div>

                        <Link
                            href="/"
                            className="text-sm text-text-muted hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span>← Back to Home</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container-cosmic">
                    <AnimatePresence mode="wait">
                        {/* Intro Screen */}
                        {gamePhase === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl mx-auto text-center"
                            >
                                <motion.div
                                    className="text-8xl mb-8"
                                    animate={{
                                        rotateY: [0, 360],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    🦸
                                </motion.div>

                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Discover Your <span className="gradient-text">Multiverse Identity</span>
                                </h2>

                                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                                    Answer 10 questions to reveal which Marvel hero shares your soul.
                                    Are you a genius billionaire? A super soldier? The God of Mischief?
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleStart}
                                    onMouseEnter={playHover}
                                    className="btn-gold text-lg px-12 py-4"
                                >
                                    <span>🔮</span>
                                    <span>Begin Your Journey</span>
                                </motion.button>

                                <p className="text-xs text-text-muted mt-6">
                                    10 questions • 2 minutes • Infinite possibilities
                                </p>
                            </motion.div>
                        )}

                        {/* Question Screen */}
                        {gamePhase === 'playing' && currentQuestion && (
                            <motion.div
                                key={`question-${currentQuestionIndex}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="max-w-3xl mx-auto"
                            >
                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-text-muted mb-2">
                                        <span>Question {currentQuestionIndex + 1} of {personalityQuestions.length}</span>
                                        <span>{Math.round(((currentQuestionIndex + 1) / personalityQuestions.length) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-quantum-purple to-tva-gold"
                                            initial={{ width: `${(currentQuestionIndex / personalityQuestions.length) * 100}%` }}
                                            animate={{ width: `${((currentQuestionIndex + 1) / personalityQuestions.length) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Question */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-cosmic-surface/50 rounded-2xl border border-white/10 p-8 mb-6 backdrop-blur-sm"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                                        {currentQuestion.question}
                                    </h2>
                                </motion.div>

                                {/* Answers */}
                                <div className="grid gap-4">
                                    {currentQuestion.answers.map((answer, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: selectedAnswer === null ? 1.02 : 1, x: selectedAnswer === null ? 10 : 0 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectAnswer(index)}
                                            onMouseEnter={playHover}
                                            disabled={selectedAnswer !== null}
                                            className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${selectedAnswer === index
                                                    ? 'bg-quantum-purple/30 border-quantum-purple text-white'
                                                    : selectedAnswer !== null
                                                        ? 'bg-white/5 border-white/5 text-text-muted'
                                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-quantum-purple/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === index
                                                        ? 'bg-quantum-purple text-white'
                                                        : 'bg-white/10 text-text-secondary'
                                                    }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="flex-1 text-lg">{answer.text}</span>
                                                {selectedAnswer === index && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-2xl"
                                                    >
                                                        ✨
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Result Screen */}
                        {gamePhase === 'result' && result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="max-w-2xl mx-auto text-center"
                            >
                                {/* Confetti Effect */}
                                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                                    {[...Array(30)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-3 h-3 rounded-sm"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                backgroundColor: ['#f5a623', '#8b5cf6', '#3b82f6', '#10b981', '#ef4444'][Math.floor(Math.random() * 5)],
                                            }}
                                            initial={{ y: -20, opacity: 1, rotate: 0 }}
                                            animate={{
                                                y: '100vh',
                                                opacity: [1, 1, 0],
                                                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                                            }}
                                            transition={{
                                                duration: 3 + Math.random() * 2,
                                                delay: Math.random() * 2,
                                                ease: 'easeIn',
                                            }}
                                        />
                                    ))}
                                </div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg text-text-secondary mb-4"
                                >
                                    The multiverse has spoken...
                                </motion.p>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-2xl text-white mb-2"
                                >
                                    You are
                                </motion.h2>

                                {/* Character Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
                                    className="relative w-48 h-48 mx-auto mb-6"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-quantum-purple to-tva-gold rounded-full blur-2xl opacity-50" />
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-quantum-purple shadow-2xl">
                                        {characterImage ? (
                                            <img
                                                src={characterImage}
                                                alt={result.heroName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-cosmic-elevated flex items-center justify-center text-6xl">
                                                🦸
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Character Name */}
                                <motion.h3
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8, type: 'spring', bounce: 0.5 }}
                                    className="text-5xl md:text-6xl font-black gradient-text mb-2"
                                >
                                    {result.heroName}
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-xl text-text-secondary mb-6"
                                >
                                    {result.name}
                                </motion.p>

                                {/* Quote */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className="bg-cosmic-surface/50 rounded-2xl border border-quantum-purple/30 p-6 mb-6 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-quantum-purple/10 to-transparent" />
                                    <p className="relative text-2xl text-white italic font-medium">
                                        "{result.quote}"
                                    </p>
                                </motion.div>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.4 }}
                                    className="text-lg text-text-secondary leading-relaxed mb-8"
                                >
                                    {result.description}
                                </motion.p>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        onMouseEnter={playHover}
                                        className="btn-gold px-8 py-3"
                                    >
                                        <span>📤</span>
                                        <span>Share Result</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleRetake}
                                        onMouseEnter={playHover}
                                        className="btn-secondary px-8 py-3"
                                    >
                                        <span>🔄</span>
                                        <span>Take Again</span>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
}
