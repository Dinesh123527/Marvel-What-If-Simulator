'use client';

import { motion } from 'framer-motion';
import {
    CharacterFate,
    compareFates,
    FATE_STATUS_CONFIG,
    FateChange,
    FateStatus,
} from '../lib/character-fates';

interface CharacterFateCardProps {
    fate: CharacterFate;
    index?: number;
    compact?: boolean;
}

const changeConfig: Record<FateChange, {
    icon: string;
    label: string;
    color: string;
    bgColor: string;
}> = {
    improved: {
        icon: '↑',
        label: 'Improved',
        color: 'text-timeline-green',
        bgColor: 'bg-timeline-green/10',
    },
    worsened: {
        icon: '↓',
        label: 'Worsened',
        color: 'text-reality-red',
        bgColor: 'bg-reality-red/10',
    },
    neutral: {
        icon: '→',
        label: 'Unchanged',
        color: 'text-text-muted',
        bgColor: 'bg-white/5',
    },
    complex: {
        icon: '⟷',
        label: 'Complex',
        color: 'text-quantum-purple',
        bgColor: 'bg-quantum-purple/10',
    },
};

export default function CharacterFateCard({ fate, index = 0, compact = false }: CharacterFateCardProps) {
    const canonConfig = FATE_STATUS_CONFIG[fate.canonFate];
    const divergentConfig = FATE_STATUS_CONFIG[fate.divergentFate];
    const change = compareFates(fate.canonFate, fate.divergentFate);
    const changeInfo = changeConfig[change];

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5"
            >
                {/* Character Initial */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quantum-purple to-nexus-blue flex items-center justify-center text-white font-bold text-sm">
                    {fate.name.charAt(0)}
                </div>

                {/* Name & Change */}
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{fate.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <span className={canonConfig.color}>{canonConfig.icon}</span>
                        <span className="text-text-muted">→</span>
                        <span className={divergentConfig.color}>{divergentConfig.icon}</span>
                        <span className={`ml-1 ${changeInfo.color}`}>{changeInfo.label}</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative glass rounded-2xl overflow-hidden border border-white/10"
        >
            {/* Change indicator strip */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 ${change === 'improved' ? 'bg-gradient-to-r from-timeline-green to-emerald-400' :
                        change === 'worsened' ? 'bg-gradient-to-r from-reality-red to-orange-500' :
                            change === 'complex' ? 'bg-gradient-to-r from-quantum-purple to-pink-500' :
                                'bg-white/20'
                    }`}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Character Avatar */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-quantum-purple to-nexus-blue flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        >
                            {fate.name.charAt(0)}
                        </motion.div>

                        <div>
                            <h4 className="text-white font-semibold">{fate.name}</h4>
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${changeInfo.bgColor} ${changeInfo.color}`}>
                                <span>{changeInfo.icon}</span>
                                <span>{changeInfo.label}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fate Comparison */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Canon Fate */}
                    <FateColumn
                        label="Canon Timeline"
                        status={fate.canonFate}
                        description={fate.canonDescription}
                        config={canonConfig}
                    />

                    {/* Divergent Fate */}
                    <FateColumn
                        label="Divergent Timeline"
                        status={fate.divergentFate}
                        description={fate.divergentDescription}
                        config={divergentConfig}
                        isHighlighted={true}
                    />
                </div>

                {/* Transition Arrow */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                >
                    <div className={`w-8 h-8 rounded-full ${changeInfo.bgColor} flex items-center justify-center border border-white/10`}>
                        <motion.span
                            className={`text-lg ${changeInfo.color}`}
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            →
                        </motion.span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Sub-component for fate column
function FateColumn({
    label,
    status,
    description,
    config,
    isHighlighted = false,
}: {
    label: string;
    status: FateStatus;
    description: string;
    config: typeof FATE_STATUS_CONFIG[FateStatus];
    isHighlighted?: boolean;
}) {
    return (
        <div className={`p-3 rounded-xl ${isHighlighted ? 'bg-white/5' : 'bg-black/20'}`}>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">{label}</p>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${config.bgColor} ${config.color} border ${config.borderColor} mb-2`}>
                <span className="text-base">{config.icon}</span>
                <span className="text-xs font-semibold">{config.label}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                {description}
            </p>
        </div>
    );
}

// Grid component for multiple fate cards
export function CharacterFateGrid({ fates }: { fates: CharacterFate[] }) {
    if (!fates || fates.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">👤</span>
                <h3 className="text-white font-semibold">Character Fates</h3>
                <span className="text-xs text-text-muted">({fates.length} tracked)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fates.map((fate, index) => (
                    <CharacterFateCard key={fate.name} fate={fate} index={index} />
                ))}
            </div>
        </div>
    );
}

// Compact list variant
export function CharacterFateList({ fates }: { fates: CharacterFate[] }) {
    if (!fates || fates.length === 0) return null;

    return (
        <div className="space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Character Fates</p>
            {fates.map((fate, index) => (
                <CharacterFateCard key={fate.name} fate={fate} index={index} compact />
            ))}
        </div>
    );
}
