'use client';

import { motion } from 'framer-motion';
import { Timeline, TimelineEvent } from '../lib/types';
import CharacterCard from './CharacterCard';

// Character data interface (matches API response)
export interface CharacterData {
    superheroApiId: number;
    name: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    imageUrl: string;
}

interface BranchCardProps {
    timeline: Timeline;
    events: TimelineEvent[];
    characters?: Record<string, CharacterData>;
    index?: number;
    showEvents?: boolean;
    showCharacters?: boolean;
}

const statusConfig = {
    hopeful: {
        label: 'Hopeful',
        color: 'text-timeline-green',
        bg: 'bg-timeline-green/10',
        border: 'border-timeline-green/30',
        icon: '✨',
    },
    dark: {
        label: 'Dark',
        color: 'text-reality-red',
        bg: 'bg-reality-red/10',
        border: 'border-reality-red/30',
        icon: '🌑',
    },
    collapsing: {
        label: 'Collapsing',
        color: 'text-tva-gold',
        bg: 'bg-tva-gold/10',
        border: 'border-tva-gold/30',
        icon: '⚠️',
    },
    stable: {
        label: 'Stable',
        color: 'text-nexus-blue',
        bg: 'bg-nexus-blue/10',
        border: 'border-nexus-blue/30',
        icon: '🔮',
    },
};

export default function BranchCard({
    timeline,
    events,
    characters = {},
    index = 0,
    showEvents = true,
    showCharacters = true
}: BranchCardProps) {
    const status = statusConfig[timeline.outcomeStatus];
    const hasCharacterData = Object.keys(characters).length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
            }}
            className="card relative overflow-hidden"
        >
            {/* Background Gradient based on status */}
            <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${timeline.outcomeStatus === 'hopeful' ? 'from-timeline-green to-transparent' :
                timeline.outcomeStatus === 'dark' ? 'from-reality-red to-transparent' :
                    timeline.outcomeStatus === 'collapsing' ? 'from-tva-gold to-transparent' :
                        'from-nexus-blue to-transparent'
                }`} />

            {/* Header */}
            <div className="relative flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{timeline.universeName}</h3>
                        <span className="text-lg">{status.icon}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                        {status.label}
                    </div>
                </div>

                {/* Stability Score */}
                <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1">
                        {timeline.stabilityScore}%
                    </div>
                    <div className="text-xs text-text-muted">Stability</div>
                </div>
            </div>

            {/* Stability Meter */}
            <div className="mb-6">
                <div className="stability-meter">
                    <motion.div
                        className="stability-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${timeline.stabilityScore}%` }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        style={{
                            background: timeline.stabilityScore > 70
                                ? 'linear-gradient(90deg, #10b981, #3b82f6)'
                                : timeline.stabilityScore > 40
                                    ? 'linear-gradient(90deg, #f5a623, #10b981)'
                                    : 'linear-gradient(90deg, #ef4444, #f5a623)',
                        }}
                    />
                </div>
            </div>

            {/* Dominant Characters - With or without images */}
            <div className="mb-6">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-3">
                    Dominant Characters
                </div>

                {showCharacters && hasCharacterData ? (
                    /* Character Cards Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {timeline.dominantCharacters.map((charName, i) => {
                            const charData = characters[charName];
                            if (charData) {
                                return (
                                    <motion.div
                                        key={charName}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                    >
                                        <CharacterCard
                                            name={charName}
                                            heroName={charData.name}
                                            alignment={charData.alignment}
                                            intelligence={charData.intelligence}
                                            strength={charData.strength}
                                            speed={charData.speed}
                                            durability={charData.durability}
                                            power={charData.power}
                                            combat={charData.combat}
                                            imageUrl={charData.imageUrl}
                                            compact={true}
                                        />
                                    </motion.div>
                                );
                            }
                            // Fallback for characters not in API
                            return (
                                <motion.div
                                    key={charName}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="px-4 py-3 text-sm font-medium bg-cosmic-elevated rounded-xl text-text-secondary border border-white/5 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quantum-purple to-quantum-blue flex items-center justify-center text-white font-bold">
                                        {charName.charAt(0)}
                                    </div>
                                    <span>{charName}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    /* Simple Tags (fallback) */
                    <div className="flex flex-wrap gap-2">
                        {timeline.dominantCharacters.map((char, i) => (
                            <motion.span
                                key={char}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="px-3 py-1 text-xs font-medium bg-cosmic-elevated rounded-full text-text-secondary border border-white/5"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </div>
                )}
            </div>

            {/* Timeline Events */}
            {showEvents && events.length > 0 && (
                <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Timeline Events</div>
                    <div className="space-y-3">
                        {events.map((event, i) => (
                            <motion.div
                                key={event.id || `event-${i}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                className="flex gap-3"
                            >
                                {/* Timeline connector */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${event.type === 'immediate' ? 'bg-reality-red' :
                                        event.type === 'ripple' ? 'bg-tva-gold' :
                                            'bg-quantum-purple'
                                        }`} />
                                    {i < events.length - 1 && (
                                        <div className="w-0.5 flex-1 bg-white/10 mt-1" />
                                    )}
                                </div>

                                {/* Event content */}
                                <div className="flex-1 pb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] uppercase tracking-wider font-medium ${event.type === 'immediate' ? 'text-reality-red' :
                                            event.type === 'ripple' ? 'text-tva-gold' :
                                                'text-quantum-purple'
                                            }`}>
                                            {event.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full ${status.bg} blur-2xl`} />
            </div>
        </motion.div>
    );
}
