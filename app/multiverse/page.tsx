'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BranchCard from '../components/BranchCard';
import { Timeline, TimelineEvent } from '../lib/types';

interface TimelineWithEvents extends Timeline {
    events: TimelineEvent[];
}

interface TimelineStats {
    total: number;
    hopeful: number;
    dark: number;
    collapsing: number;
    stable: number;
}

export default function MultiversePage() {
    const [timelines, setTimelines] = useState<TimelineWithEvents[]>([]);
    const [stats, setStats] = useState<TimelineStats>({ total: 0, hopeful: 0, dark: 0, collapsing: 0, stable: 0 });
    const [filter, setFilter] = useState<'all' | 'hopeful' | 'dark' | 'collapsing' | 'stable'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTimelines();
    }, [filter]);

    const fetchTimelines = async () => {
        try {
            const url = filter === 'all' ? '/api/timelines' : `/api/timelines?status=${filter}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setTimelines(data.data);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
        setIsLoading(false);
    };

    const filterButtons = [
        { key: 'all', label: 'All Universes', color: 'quantum-purple' },
        { key: 'hopeful', label: 'Hopeful', color: 'timeline-green' },
        { key: 'stable', label: 'Stable', color: 'nexus-blue' },
        { key: 'dark', label: 'Dark', color: 'reality-red' },
        { key: 'collapsing', label: 'Collapsing', color: 'tva-gold' },
    ] as const;

    return (
        <main className="min-h-screen pt-[var(--nav-height)]">
            {/* Header */}
            <section className="py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-multiverse-pink/5 to-transparent pointer-events-none" />

                <div className="container-cosmic relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-multiverse-pink/20 mb-6">
                                <span className="w-2 h-2 rounded-full bg-multiverse-pink animate-pulse" />
                                <span className="text-sm text-multiverse-pink font-medium">Multiverse Archive</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                The <span className="gradient-text">Multiverse</span> Gallery
                            </h1>
                            <p className="text-lg text-text-secondary leading-relaxed">
                                Every simulation you run creates a new universe. Browse through all
                                the alternate realities you&apos;ve generated.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="py-4 border-y border-white/5 sticky top-[var(--nav-height)] z-40 glass">
                <div className="container-cosmic">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {filterButtons.map(btn => (
                            <button
                                key={btn.key}
                                onClick={() => setFilter(btn.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === btn.key
                                        ? `bg-${btn.color} text-white shadow-lg`
                                        : `bg-white/5 text-text-secondary hover:text-white`
                                    }`}
                                style={filter === btn.key ? {
                                    backgroundColor: btn.key === 'all' ? '#8b5cf6' :
                                        btn.key === 'hopeful' ? '#10b981' :
                                            btn.key === 'stable' ? '#3b82f6' :
                                                btn.key === 'dark' ? '#ef4444' : '#f5a623'
                                } : {}}
                            >
                                {btn.label}
                                {filter === btn.key && timelines.length > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                                        {timelines.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timelines Grid */}
            <section className="py-16">
                <div className="container-cosmic">
                    {isLoading ? (
                        <div className="text-center py-24">
                            <motion.div
                                className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-quantum-purple border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-text-secondary">Loading timelines...</p>
                        </div>
                    ) : timelines.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {timelines.map((timeline, index) => (
                                    <BranchCard
                                        key={timeline.id}
                                        timeline={timeline}
                                        events={timeline.events || []}
                                        index={index}
                                        showEvents={false}
                                    />
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="mt-16 pt-8 border-t border-white/5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                    <div>
                                        <div className="text-3xl font-bold gradient-text mb-1">{stats.total}</div>
                                        <div className="text-xs text-text-muted uppercase tracking-wider">Universes Created</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-timeline-green mb-1">{stats.hopeful}</div>
                                        <div className="text-xs text-text-muted uppercase tracking-wider">Hopeful</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-reality-red mb-1">{stats.dark}</div>
                                        <div className="text-xs text-text-muted uppercase tracking-wider">Dark</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-tva-gold mb-1">{stats.collapsing}</div>
                                        <div className="text-xs text-text-muted uppercase tracking-wider">Collapsing</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24"
                        >
                            <div className="text-8xl mb-6">🌌</div>
                            <h2 className="text-2xl font-bold text-white mb-4">No Universes Yet</h2>
                            <p className="text-text-secondary max-w-md mx-auto mb-8">
                                {filter === 'all'
                                    ? "You haven't created any alternate timelines yet. Start by running a simulation!"
                                    : `No ${filter} universes found. Try running more simulations or change the filter.`
                                }
                            </p>
                            <Link href="/scenarios" className="btn-gold">
                                Create Your First Universe
                                <svg className="w-4 h-4 ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}
