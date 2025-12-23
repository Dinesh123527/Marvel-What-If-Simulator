'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BranchCard from '../../components/BranchCard';
import { CharacterFateGrid } from '../../components/CharacterFateCard';
import DivergenceSelector from '../../components/DivergenceSelector';
import TimelineGraph from '../../components/TimelineGraph';
import TVAAlert from '../../components/TVAAlert';
import WatcherNarration from '../../components/WatcherNarration';
import { useSoundEffect } from '../../contexts/AudioProvider';
import { useJarvis } from '../../contexts/JarvisProvider';
import { Divergence, Scenario, SimulationResult } from '../../lib/types';

export default function SimulatorPage() {
    const params = useParams();
    const scenarioId = Number(params.id);
    const { playSimulationStart, playSimulationComplete, playAlert, initializeAudio } = useSoundEffect();
    const { isJarvisEnabled, jarvisRespond } = useJarvis();

    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [divergences, setDivergences] = useState<Divergence[]>([]);
    const [selectedDivergenceId, setSelectedDivergenceId] = useState<number | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [showTVAAlert, setShowTVAAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showNarration, setShowNarration] = useState(false);

    useEffect(() => {
        if (scenarioId) {
            // Fetch scenario data from API
            fetch(`/api/scenarios/${scenarioId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setScenario(data.data);
                        setDivergences(data.data.divergences || []);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error loading scenario:', err);
                    setIsLoading(false);
                });
        }
    }, [scenarioId]);

    const handleSimulate = async () => {
        if (!selectedDivergenceId) return;

        // Initialize audio on first interaction
        initializeAudio();

        setIsSimulating(true);
        setSimulationResult(null);
        setShowTVAAlert(true);
        setShowNarration(false);

        // Play simulation start sound
        playSimulationStart();

        // J.A.R.V.I.S. commentary
        if (isJarvisEnabled) {
            jarvisRespond('simulation-start');
        }

        try {
            const response = await fetch('/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ divergenceId: selectedDivergenceId }),
            });

            const data = await response.json();

            if (data.success) {
                // Play alert sound
                playAlert();

                // Simulate loading time for dramatic effect
                await new Promise(resolve => setTimeout(resolve, 1500));
                setSimulationResult(data.data);

                // Show narration after a delay
                setTimeout(() => {
                    setShowNarration(true);
                    playSimulationComplete();

                    // J.A.R.V.I.S. commentary on completion
                    if (isJarvisEnabled) {
                        jarvisRespond('simulation-complete');
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Simulation error:', error);
        }

        setIsSimulating(false);
    };

    const handleReset = () => {
        setSelectedDivergenceId(null);
        setSimulationResult(null);
        setShowTVAAlert(false);
        setShowNarration(false);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen pt-[var(--nav-height)] flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-quantum-purple border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <h1 className="text-2xl font-bold text-white mb-2">Loading Timeline...</h1>
                    <p className="text-text-secondary">Accessing the Sacred Timeline</p>
                </div>
            </main>
        );
    }

    if (!scenario) {
        return (
            <main className="min-h-screen pt-[var(--nav-height)] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🌌</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Scenario Not Found</h1>
                    <p className="text-text-secondary mb-6">This timeline does not exist in our records.</p>
                    <Link href="/scenarios" className="btn-primary">
                        Return to Scenarios
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-[var(--nav-height)]">
            {/* Header */}
            <section className="py-8 border-b border-white/5">
                <div className="container-cosmic">
                    <div className="flex items-start justify-between gap-8 flex-wrap">
                        <div>
                            <Link
                                href="/scenarios"
                                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Scenarios
                            </Link>

                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-quantum-purple/20 text-quantum-purple border border-quantum-purple/30">
                                    {scenario.phase}
                                </span>
                                <span className="text-text-muted text-sm">{scenario.year}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {scenario.title}
                            </h1>
                            <p className="text-text-secondary max-w-2xl">
                                {scenario.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {simulationResult && (
                                <button
                                    onClick={handleReset}
                                    className="btn-secondary text-sm"
                                >
                                    Reset
                                </button>
                            )}
                            <button
                                onClick={handleSimulate}
                                disabled={!selectedDivergenceId || isSimulating}
                                className={`btn-gold text-sm ${(!selectedDivergenceId || isSimulating) && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {isSimulating ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="inline-block"
                                        >
                                            ⚡
                                        </motion.span>
                                        Simulating...
                                    </>
                                ) : (
                                    <>
                                        <span>Run Simulation</span>
                                        <svg className="w-4 h-4 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* TVA Alert */}
            <AnimatePresence>
                {showTVAAlert && isSimulating && (
                    <section className="py-4">
                        <div className="container-cosmic">
                            <TVAAlert
                                type="warning"
                                title="Timeline Divergence Detected"
                                message="The TVA is monitoring this branch. Simulation in progress..."
                                isVisible={true}
                            />
                        </div>
                    </section>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <section className="py-8">
                <div className="container-cosmic">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Divergence Selector */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-[calc(var(--nav-height)+2rem)]">
                                <DivergenceSelector
                                    divergences={divergences}
                                    selectedId={selectedDivergenceId}
                                    onSelect={setSelectedDivergenceId}
                                    isSimulating={isSimulating}
                                />
                            </div>
                        </div>

                        {/* Right Column - Timeline & Results */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Timeline Visualization */}
                            <TimelineGraph
                                branchPoints={simulationResult?.branchPoints || [
                                    { x: 0, y: 50, label: 'Start', isCanon: true, isBranch: false },
                                    { x: 20, y: 50, label: 'Event Begins', isCanon: true, isBranch: false },
                                    { x: 40, y: 50, label: 'Critical Moment', isCanon: true, isBranch: false },
                                    { x: 60, y: 50, label: 'Canon Decision', isCanon: true, isBranch: false },
                                    { x: 80, y: 50, label: 'Outcome', isCanon: true, isBranch: false },
                                    { x: 100, y: 50, label: 'Future', isCanon: true, isBranch: false },
                                ]}
                                isAnimating={!!simulationResult}
                            />

                            {/* Simulation Results */}
                            <AnimatePresence mode="wait">
                                {isSimulating && (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="card text-center py-16"
                                    >
                                        <motion.div
                                            className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-quantum-purple border-t-transparent"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <h3 className="text-xl font-bold text-white mb-2">Calculating Timeline Divergence</h3>
                                        <p className="text-text-secondary">Analyzing multiverse implications...</p>
                                    </motion.div>
                                )}

                                {simulationResult && !isSimulating && (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="mb-6">
                                            <TVAAlert
                                                type={simulationResult.timeline.outcomeStatus === 'hopeful' ? 'success' :
                                                    simulationResult.timeline.outcomeStatus === 'collapsing' ? 'danger' : 'info'}
                                                title="New Timeline Generated"
                                                message={`Universe ${simulationResult.timeline.universeName} has been created with ${simulationResult.timeline.stabilityScore}% stability.`}
                                                isVisible={true}
                                                onClose={() => { }}
                                            />
                                        </div>

                                        {/* Watcher Narration */}
                                        {showNarration && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mb-6"
                                            >
                                                <WatcherNarration
                                                    category={simulationResult.timeline.outcomeStatus as any}
                                                />
                                            </motion.div>
                                        )}

                                        <BranchCard
                                            timeline={simulationResult.timeline}
                                            events={simulationResult.events}
                                            characters={simulationResult.characters}
                                            showEvents={true}
                                        />

                                        {/* Character Fate Tracker */}
                                        {simulationResult.characterFates && simulationResult.characterFates.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="mt-8"
                                            >
                                                <CharacterFateGrid fates={simulationResult.characterFates} />
                                            </motion.div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-center gap-4 mt-8">
                                            <button onClick={handleReset} className="btn-secondary">
                                                Try Another Divergence
                                            </button>
                                            <Link href="/multiverse" className="btn-primary">
                                                View Multiverse Gallery
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}

                                {!simulationResult && !isSimulating && (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="card text-center py-16"
                                    >
                                        <div className="text-6xl mb-4">🔮</div>
                                        <h3 className="text-xl font-bold text-white mb-2">Select a Divergence</h3>
                                        <p className="text-text-secondary max-w-md mx-auto">
                                            Choose an alternate decision from the left panel, then click &quot;Run Simulation&quot;
                                            to see how reality would unfold differently.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
