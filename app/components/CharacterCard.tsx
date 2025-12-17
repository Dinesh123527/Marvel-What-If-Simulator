'use client';

import { motion } from 'framer-motion';
import CharacterIcon from './CharacterIcon';

export interface CharacterCardProps {
    name: string;
    heroName?: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    imageUrl?: string; // Kept for compatibility but unused
    compact?: boolean;
}

const alignmentColors = {
    hero: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
    villain: 'from-red-500/20 to-orange-500/20 border-red-500/40',
    'anti-hero': 'from-purple-500/20 to-pink-500/20 border-purple-500/40',
};

const alignmentBadge = {
    hero: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    villain: 'bg-red-500/20 text-red-400 border-red-500/30',
    'anti-hero': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

interface StatBarProps {
    label: string;
    value: number;
    color: string;
}

function StatBar({ label, value, color }: StatBarProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted w-8 uppercase">{label}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </div>
            <span className="text-[10px] text-text-secondary w-6 text-right">{value}</span>
        </div>
    );
}

export default function CharacterCard({
    name,
    heroName,
    alignment,
    intelligence,
    strength,
    speed,
    durability,
    power,
    combat,
    compact = false,
}: CharacterCardProps) {
    const displayName = heroName || name;

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${alignmentColors[alignment]} border backdrop-blur-sm`}
            >
                <div className="flex items-center gap-3 p-3">
                    {/* Icon */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0 bg-black/20 flex items-center justify-center p-2">
                        <CharacterIcon name={displayName} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{displayName}</h4>
                        <span className={`inline-block px-2 py-0.5 text-[10px] rounded-full border ${alignmentBadge[alignment]} capitalize`}>
                            {alignment}
                        </span>
                    </div>

                    {/* Power Score */}
                    <div className="text-right">
                        <div className="text-lg font-bold text-white">{power}</div>
                        <div className="text-[10px] text-text-muted uppercase">Power</div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${alignmentColors[alignment]} border backdrop-blur-sm`}
        >
            {/* Header with Icon */}
            <div className="relative h-32 overflow-hidden flex items-center justify-center bg-black/10">
                <div className="w-24 h-24 opacity-80 -translate-y-4">
                    <CharacterIcon name={displayName} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />

                {/* Alignment Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs rounded-full border ${alignmentBadge[alignment]} capitalize backdrop-blur-sm`}>
                        {alignment}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pt-0 -mt-8 relative">
                {/* Name */}
                <h3 className="text-lg font-bold text-white mb-3">{displayName}</h3>

                {/* Stats */}
                <div className="space-y-2">
                    <StatBar label="INT" value={intelligence} color="bg-gradient-to-r from-yellow-400 to-yellow-500" />
                    <StatBar label="STR" value={strength} color="bg-gradient-to-r from-red-400 to-red-500" />
                    <StatBar label="SPD" value={speed} color="bg-gradient-to-r from-blue-400 to-blue-500" />
                    <StatBar label="DUR" value={durability} color="bg-gradient-to-r from-green-400 to-green-500" />
                    <StatBar label="PWR" value={power} color="bg-gradient-to-r from-purple-400 to-purple-500" />
                    <StatBar label="CMB" value={combat} color="bg-gradient-to-r from-orange-400 to-orange-500" />
                </div>

                {/* Total Power Score */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase">Total Power</span>
                    <span className="text-xl font-bold text-tva-gold">
                        {Math.round((intelligence + strength + speed + durability + power + combat) / 6)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
