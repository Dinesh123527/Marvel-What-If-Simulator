'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSoundEffect } from '../../contexts/AudioProvider';
import { collectExample, saveModel, startListening, trainModel } from '../../lib/ai/speech-recognizer';

export default function JarvisVoiceTrainer() {
    const { playClick, playHover } = useSoundEffect();
    const [step, setStep] = useState<'init' | 'noise' | 'wake_word' | 'train' | 'test'>('init');
    const [counts, setCounts] = useState({ noise: 0, wake: 0 });
    const [isRecording, setIsRecording] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [testResult, setTestResult] = useState('');

    const REQUIRED_SAMPLES = 20;

    const handleRecord = async (label: '_background_noise_' | 'jarvis') => {
        setIsRecording(true);
        try {
            const count = await collectExample(label);
            setCounts(prev => ({
                ...prev,
                [label === '_background_noise_' ? 'noise' : 'wake']: count
            }));
            playClick();
        } catch (e) {
            console.error(e);
        }
        setIsRecording(false);
    };

    const handleTrain = async () => {
        setStep('train');
        try {
            await trainModel((epoch, logs) => {
                setTrainingProgress(Math.round((epoch / 25) * 100));
            });
            await saveModel();
            playClick();
            setStep('test');
            // Auto start listening for test
            startListening((label, prob) => {
                if (label === 'jarvis') {
                    setTestResult(`DETECTED! (${Math.round(prob * 100)}%)`);
                    playClick();
                    setTimeout(() => setTestResult(''), 2000);
                }
            });
        } catch (e) {
            console.error("Training failed", e);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                J.A.R.V.I.S. Voice Calibration
            </h2>

            {/* Step 1: Background Noise */}
            <div className={`mb-8 p-6 rounded-2xl transition-all ${step === 'noise' ? 'bg-white/10 border border-tva-gold' : 'bg-white/5 opacity-50'}`}>
                <h3 className="text-xl font-bold text-white mb-2">Step 1: Background Noise</h3>
                <p className="text-text-secondary mb-4">Record room silence so J.A.R.V.I.S. knows what to ignore.</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setStep('noise'); handleRecord('_background_noise_'); }}
                        disabled={step !== 'noise' && step !== 'init'}
                        className="btn-primary"
                    >
                        {isRecording ? 'Listening...' : 'Record Silence'}
                    </button>
                    <span className="text-tva-gold font-mono">{counts.noise} / {REQUIRED_SAMPLES} samples</span>
                </div>
                {counts.noise >= REQUIRED_SAMPLES && step === 'noise' && (
                    <button
                        onClick={() => setStep('wake_word')}
                        className="mt-4 text-green-400 font-bold hover:underline"
                    >
                        Next Step →
                    </button>
                )}
            </div>

            {/* Step 2: Wake Word */}
            <div className={`mb-8 p-6 rounded-2xl transition-all ${step === 'wake_word' ? 'bg-white/10 border border-tva-gold' : 'bg-white/5 opacity-50'}`}>
                <h3 className="text-xl font-bold text-white mb-2">Step 2: "J.A.R.V.I.S."</h3>
                <p className="text-text-secondary mb-4">Say "Jarvis" clearly each time you press the button.</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleRecord('jarvis')}
                        disabled={step !== 'wake_word'}
                        className="btn-primary"
                    >
                        {isRecording ? 'Listening...' : 'Record "Jarvis"'}
                    </button>
                    <span className="text-tva-gold font-mono">{counts.wake} / {REQUIRED_SAMPLES} samples</span>
                </div>
                {counts.wake >= REQUIRED_SAMPLES && step === 'wake_word' && (
                    <button
                        onClick={handleTrain}
                        className="mt-4 text-green-400 font-bold hover:underline"
                    >
                        Start Training →
                    </button>
                )}
            </div>

            {/* Step 3: Training */}
            {step === 'train' && (
                <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-cyan-500 animate-pulse">
                    <h3 className="text-xl font-bold text-white mb-2">Calibrating Neural Net...</h3>
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-cyan-500 h-full transition-all duration-300"
                            style={{ width: `${trainingProgress}%` }}
                        />
                    </div>
                    <p className="text-center mt-2 font-mono text-cyan-400">{trainingProgress}%</p>
                </div>
            )}

            {/* Step 4: Testing */}
            {step === 'test' && (
                <div className="p-6 bg-green-500/10 rounded-2xl border border-green-500">
                    <h3 className="text-xl font-bold text-white mb-2">Calibration Complete</h3>
                    <p className="text-green-300 mb-4">J.A.R.V.I.S. is listening. Say "Jarvis" to test.</p>
                    <div className="h-20 flex items-center justify-center bg-black/50 rounded-xl border border-white/10">
                        {testResult ? (
                            <motion.span
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1.2 }}
                                className="text-2xl font-bold text-cyan-400"
                            >
                                {testResult}
                            </motion.span>
                        ) : (
                            <span className="text-white/30 animate-pulse">Listening...</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
