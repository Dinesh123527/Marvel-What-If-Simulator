'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScenarioCard from '../components/ScenarioCard';
import { Scenario } from '../lib/types';

interface ScenarioWithMeta extends Scenario {
    divergenceCount: number;
}

export default function ScenariosPage() {
    const [scenarios, setScenarios] = useState<ScenarioWithMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPhase, setSelectedPhase] = useState<string>('all');

    const fetchScenarios = async (phase: string) => {
        setIsLoading(true);
        try {
            const url = phase === 'all'
                ? '/api/scenarios'
                : `/api/scenarios?phase=${phase}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setScenarios(data.data);
            }
        } catch (err) {
            console.error('Error loading scenarios:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScenarios(selectedPhase);
    }, [selectedPhase]);

    const handlePhaseChange = (phase: string) => {
        setSelectedPhase(phase);
    };

    const phases = [
        { id: 'all', label: 'All Phases' },
        { id: '1', label: 'Phase 1' },
        { id: '2', label: 'Phase 2' },
        { id: '3', label: 'Phase 3' },
        { id: '4', label: 'Phase 4' },
    ];

    return (
        <main className="min-h-screen pt-[var(--nav-height)]">
            {/* Header Section */}
            <section className="py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-quantum-purple/5 to-transparent pointer-events-none" />

                <div className="container-cosmic relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-tva-gold/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-tva-gold animate-pulse" />
                            <span className="text-sm text-tva-gold font-medium">Canon Events Database</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Choose Your <span className="gradient-text">Timeline</span>
                        </h1>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            Each scenario represents a pivotal moment in MCU history. Select one to
                            explore its divergence points and create alternate realities.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="py-4 border-y border-white/5 sticky top-[var(--nav-height)] bg-bg-primary/80 backdrop-blur-lg z-10">
                <div className="container-cosmic">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {phases.map(phase => (
                            <button
                                key={phase.id}
                                onClick={() => handlePhaseChange(phase.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${selectedPhase === phase.id
                                    ? 'bg-quantum-purple text-white shadow-lg shadow-purple-500/20'
                                    : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {phase.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scenarios Grid */}
            <section className="py-16">
                <div className="container-cosmic">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-quantum-purple border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scenarios.map((scenario, index) => (
                                <motion.div
                                    key={scenario.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ScenarioCard scenario={scenario} index={index} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && scenarios.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-text-muted">No scenarios found for this phase.</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="mt-16 pt-8 border-t border-white/5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold gradient-text mb-1">{scenarios.length}</div>
                                <div className="text-xs text-text-muted uppercase tracking-wider">Scenarios</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold gradient-text-gold mb-1">
                                    {scenarios.reduce((acc, curr) => acc + curr.divergenceCount, 0)}
                                </div>
                                <div className="text-xs text-text-muted uppercase tracking-wider">Divergences</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-timeline-green mb-1">4</div>
                                <div className="text-xs text-text-muted uppercase tracking-wider">MCU Phases</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-multiverse-pink mb-1">∞</div>
                                <div className="text-xs text-text-muted uppercase tracking-wider">Possibilities</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
