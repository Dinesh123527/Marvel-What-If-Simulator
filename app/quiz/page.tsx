'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import QuizModeSelector from '../components/quiz/QuizModeSelector';
import QuizOptions from '../components/quiz/QuizOptions';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';
import QuizScoreboard from '../components/quiz/QuizScoreboard';
import { useAudio, useSoundEffect } from '../contexts/AudioProvider';

interface QuizQuestionData {
    id: number;
    mode: 'stats' | 'hints' | 'silhouette';
    data: {
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
    };
    options: string[];
    correctAnswer: string;
}

interface QuizAnswer {
    correct: boolean;
    character: string;
    userAnswer: string;
}

type GamePhase = 'menu' | 'loading' | 'playing' | 'result';
type QuizMode = 'stats' | 'hints' | 'silhouette';

const QUESTIONS_PER_GAME = 10;
const POINTS_PER_QUESTION = 100;
const HINT_PENALTY = 30;
const STREAK_BONUS = 25;

export default function QuizPage() {
    const { playClick, initializeAudio } = useSoundEffect();
    const { isScreenReaderEnabled, speakText } = useAudio();

    // Game state
    const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
    const [mode, setMode] = useState<QuizMode | null>(null);
    const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Score tracking
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);

    // Question state
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [hintsRevealed, setHintsRevealed] = useState(1); // Start with 1 hint
    const [silhouetteLevel, setSilhouetteLevel] = useState(0);
    const [hintPenalty, setHintPenalty] = useState(0);

    // High scores (persisted in localStorage)
    const [highScores, setHighScores] = useState<Record<string, number>>({
        stats: 0,
        hints: 0,
        silhouette: 0,
    });
    const [isNewHighScore, setIsNewHighScore] = useState(false);

    // Load high scores from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('quiz-high-scores');
        if (saved) {
            try {
                setHighScores(JSON.parse(saved));
            } catch {
                // Invalid JSON, ignore
            }
        }
    }, []);

    // Save high scores to localStorage
    const saveHighScore = useCallback((newScore: number, quizMode: QuizMode) => {
        const current = highScores[quizMode] || 0;
        if (newScore > current) {
            const updated = { ...highScores, [quizMode]: newScore };
            setHighScores(updated);
            localStorage.setItem('quiz-high-scores', JSON.stringify(updated));
            setIsNewHighScore(true);
            return true;
        }
        return false;
    }, [highScores]);

    // Announce question via screen reader when question changes
    useEffect(() => {
        if (!isScreenReaderEnabled || gamePhase !== 'playing' || questions.length === 0) return;

        const question = questions[currentQuestionIndex];
        if (!question) return;

        let text = `Question ${currentQuestionIndex + 1} of ${questions.length}. `;

        if (question.mode === 'stats' && question.data.stats) {
            const s = question.data.stats;
            text += `Guess the character by stats. Intelligence: ${s.intelligence}. Strength: ${s.strength}. Speed: ${s.speed}. Durability: ${s.durability}. Power: ${s.power}. Combat: ${s.combat}. `;
        } else if (question.mode === 'hints' && question.data.hints) {
            text += `Guess by hints. First hint: ${question.data.hints[0]}. `;
        } else if (question.mode === 'silhouette') {
            text += `Guess the silhouette. A mystery character is hidden in the shadows. `;
            if (question.data.alignment) {
                text += `This character is a ${question.data.alignment}. `;
            }
        }

        text += `Options: ${question.options.join(', ')}.`;
        speakText(text);
    }, [currentQuestionIndex, gamePhase, questions, isScreenReaderEnabled, speakText]);

    // Fetch questions from API
    const fetchQuestions = async (selectedMode: QuizMode) => {
        setGamePhase('loading');
        try {
            const res = await fetch(`/api/quiz?mode=${selectedMode}&count=${QUESTIONS_PER_GAME}`);
            const data = await res.json();

            if (data.success && data.questions.length > 0) {
                setQuestions(data.questions);
                setGamePhase('playing');
            } else {
                console.error('Failed to fetch questions');
                setGamePhase('menu');
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
            setGamePhase('menu');
        }
    };

    // Start game with selected mode
    const handleSelectMode = (selectedMode: QuizMode) => {
        initializeAudio();
        setMode(selectedMode);
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setHintsRevealed(1);
        setSilhouetteLevel(0);
        setHintPenalty(0);
        setIsNewHighScore(false);
        fetchQuestions(selectedMode);
    };

    // Handle answer selection
    const handleSelectAnswer = (answer: string) => {
        if (isAnswered) return;
        playClick();

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        // Update score and streak
        if (isCorrect) {
            const questionPoints = POINTS_PER_QUESTION - hintPenalty;
            const streakBonus = streak >= 3 ? STREAK_BONUS : 0;
            setScore(prev => prev + questionPoints + streakBonus);
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);
                }
                return newStreak;
            });
        } else {
            setStreak(0);
        }

        // Record answer
        setAnswers(prev => [...prev, {
            correct: isCorrect,
            character: currentQuestion.correctAnswer,
            userAnswer: answer,
        }]);

        // Screen reader feedback
        if (isScreenReaderEnabled) {
            if (isCorrect) {
                speakText(`Correct! The answer is ${currentQuestion.correctAnswer}.`);
            } else {
                speakText(`Wrong! You selected ${answer}. The correct answer is ${currentQuestion.correctAnswer}.`);
            }
        }
    };

    // Move to next question or end game
    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 >= questions.length) {
            // End game
            if (mode) {
                saveHighScore(score, mode);
            }
            setGamePhase('result');
        } else {
            // Next question
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setHintsRevealed(1);
            setSilhouetteLevel(0);
            setHintPenalty(0);
        }
    };

    // Reveal hint (costs points)
    const handleRevealHint = () => {
        setHintsRevealed(prev => prev + 1);
        setHintPenalty(prev => prev + HINT_PENALTY);
    };

    // Reveal silhouette (costs points)
    const handleRevealSilhouette = () => {
        setSilhouetteLevel(prev => prev + 1);
        setHintPenalty(prev => prev + HINT_PENALTY);
    };

    // Play again with same mode
    const handlePlayAgain = () => {
        if (mode) {
            handleSelectMode(mode);
        }
    };

    // Return to mode selection
    const handleChangeMode = () => {
        setGamePhase('menu');
        setMode(null);
    };

    const currentQuestion = questions[currentQuestionIndex];

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
                                Character <span className="text-gradient">Trivia Quiz</span>
                            </h1>
                            <p className="text-text-secondary text-sm mt-1">
                                Test your Marvel knowledge across the multiverse!
                            </p>
                        </motion.div>

                        <Link
                            href="/characters"
                            className="text-sm text-text-muted hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span>← Back to Characters</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="container-cosmic">
                    <AnimatePresence mode="wait">
                        {/* Mode Selection */}
                        {gamePhase === 'menu' && (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <QuizModeSelector
                                    onSelectMode={handleSelectMode}
                                    highScores={highScores}
                                />
                            </motion.div>
                        )}

                        {/* Loading */}
                        {gamePhase === 'loading' && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <motion.div
                                    className="w-16 h-16 border-4 border-quantum-purple border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                                <p className="mt-4 text-text-secondary">Generating quiz questions...</p>
                            </motion.div>
                        )}

                        {/* Playing */}
                        {gamePhase === 'playing' && currentQuestion && (
                            <motion.div
                                key={`question-${currentQuestionIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-3xl mx-auto space-y-6"
                            >
                                {/* Scoreboard */}
                                <QuizScoreboard
                                    score={score}
                                    streak={streak}
                                    bestStreak={bestStreak}
                                    questionNumber={currentQuestionIndex + 1}
                                    totalQuestions={questions.length}
                                    mode={mode!}
                                />

                                {/* Question */}
                                <QuizQuestion
                                    mode={currentQuestion.mode}
                                    data={currentQuestion.data}
                                    hintsRevealed={hintsRevealed}
                                    silhouetteLevel={silhouetteLevel}
                                    onRevealHint={handleRevealHint}
                                    onRevealSilhouette={handleRevealSilhouette}
                                    questionNumber={currentQuestionIndex + 1}
                                    totalQuestions={questions.length}
                                />

                                {/* Options */}
                                <QuizOptions
                                    options={currentQuestion.options}
                                    selectedAnswer={selectedAnswer}
                                    correctAnswer={currentQuestion.correctAnswer}
                                    isAnswered={isAnswered}
                                    onSelectAnswer={handleSelectAnswer}
                                />

                                {/* Next Button (after answering) */}
                                {isAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-center"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleNextQuestion}
                                            className="btn-primary px-8 py-3"
                                        >
                                            {currentQuestionIndex + 1 >= questions.length ? (
                                                <>
                                                    <span>🏆</span>
                                                    <span>View Results</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Next Question</span>
                                                    <span>→</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Results */}
                        {gamePhase === 'result' && mode && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <QuizResults
                                    score={score}
                                    totalQuestions={questions.length}
                                    bestStreak={bestStreak}
                                    answers={answers}
                                    mode={mode}
                                    onPlayAgain={handlePlayAgain}
                                    onChangeMode={handleChangeMode}
                                    highScore={highScores[mode]}
                                    isNewHighScore={isNewHighScore}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
}
