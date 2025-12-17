'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scenario } from '../lib/types';

interface ScenarioCardProps {
    scenario: Scenario;
    index: number;
}

const phaseColors: Record<string, string> = {
    'Phase 1': 'from-blue-500 to-cyan-500',
    'Phase 2': 'from-purple-500 to-pink-500',
    'Phase 3': 'from-red-500 to-orange-500',
    'Phase 4': 'from-green-500 to-emerald-500',
};

const phaseIcons: Record<string, string> = {
    'Phase 1': '🛡️',
    'Phase 2': '⚡',
    'Phase 3': '💎',
    'Phase 4': '🌌',
};

export default function ScenarioCard({ scenario, index }: ScenarioCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Link href={`/scenarios/${scenario.id}`}>
                <div className="card card-highlight h-full flex flex-col relative overflow-hidden">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${phaseColors[scenario.phase]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Top Section with Phase Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{phaseIcons[scenario.phase]}</span>
                            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                                {scenario.phase}
                            </span>
                        </div>
                        <div className="text-xs text-text-muted font-mono">
                            {scenario.year}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-quantum-purple transition-colors">
                        {scenario.title}
                    </h3>

                    {/* Canon Event Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cosmic-elevated border border-white/5 mb-4 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-tva-gold" />
                        <span className="text-xs text-text-secondary">{scenario.canonEvent}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed flex-grow mb-6">
                        {scenario.description}
                    </p>

                    {/* Explore Button */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-quantum-purple group-hover:text-quantum-violet transition-colors">
                            Explore Divergences
                        </span>
                        <motion.div
                            className="w-8 h-8 rounded-full bg-quantum-purple/10 flex items-center justify-center group-hover:bg-quantum-purple/20 transition-colors"
                            whileHover={{ x: 5 }}
                        >
                            <svg
                                className="w-4 h-4 text-quantum-purple"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${phaseColors[scenario.phase]} opacity-20 transform rotate-45 translate-x-10 -translate-y-10`} />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
