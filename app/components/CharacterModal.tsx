'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { getCharacterDescription } from '../lib/character-descriptions';
import CharacterIcon from './CharacterIcon';

interface Character {
    superheroApiId: number;
    name: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    fullName?: string;
    alterEgos?: string;
    aliases?: string[];
    placeOfBirth?: string;
    firstAppearance?: string;
    publisher?: string;
    gender?: string;
    race?: string;
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    occupation?: string;
    base?: string;
    groupAffiliation?: string;
    relatives?: string;
}

interface CharacterModalProps {
    character: Character | null;
    isOpen: boolean;
    onClose: () => void;
}

const alignmentColors = {
    hero: 'from-blue-500 to-cyan-500',
    villain: 'from-red-500 to-orange-500',
    'anti-hero': 'from-purple-500 to-pink-500',
};

const alignmentBadge = {
    hero: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    villain: 'bg-red-500/20 text-red-400 border-red-500/30',
    'anti-hero': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted w-20 uppercase">{label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </div>
            <span className="text-sm text-white font-medium w-8 text-right">{value}</span>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
    if (!value || value === '-' || value === 'null') return null;
    return (
        <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
            <span className="text-xs text-text-muted uppercase w-28 flex-shrink-0">{label}</span>
            <span className="text-sm text-white">{value}</span>
        </div>
    );
}

export default function CharacterModal({ character, isOpen, onClose }: CharacterModalProps) {
    if (!character) return null;

    const totalPower = Math.round(
        (character.intelligence + character.strength + character.speed +
            character.durability + character.power + character.combat) / 6
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-cosmic-elevated rounded-2xl border border-white/10 z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className={`relative p-6 bg-gradient-to-r ${alignmentColors[character.alignment]} bg-opacity-20`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all z-10 flex items-center justify-center backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative flex items-center gap-6 pr-14">
                                {/* Icon */}
                                <div className="w-20 h-20 rounded-2xl bg-black/30 flex items-center justify-center p-3">
                                    <CharacterIcon name={character.name} />
                                </div>

                                {/* Name & Badge */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">{character.name}</h2>
                                    {character.fullName && character.fullName !== '-' && (
                                        <p className="text-sm text-white/70 mb-2">{character.fullName}</p>
                                    )}
                                    <span className={`inline-block px-3 py-1 text-xs rounded-full border ${alignmentBadge[character.alignment]} capitalize`}>
                                        {character.alignment}
                                    </span>
                                </div>

                                {/* Power Score */}
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-tva-gold">{totalPower}</div>
                                    <div className="text-xs text-white/50 uppercase">Power</div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Description */}
                            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">About</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {getCharacterDescription(character.name)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Stats */}
                                <div className="col-span-full">
                                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Power Stats</h3>
                                    <div className="space-y-3">
                                        <StatBar label="Intelligence" value={character.intelligence} color="bg-gradient-to-r from-yellow-400 to-yellow-500" />
                                        <StatBar label="Strength" value={character.strength} color="bg-gradient-to-r from-red-400 to-red-500" />
                                        <StatBar label="Speed" value={character.speed} color="bg-gradient-to-r from-blue-400 to-blue-500" />
                                        <StatBar label="Durability" value={character.durability} color="bg-gradient-to-r from-green-400 to-green-500" />
                                        <StatBar label="Power" value={character.power} color="bg-gradient-to-r from-purple-400 to-purple-500" />
                                        <StatBar label="Combat" value={character.combat} color="bg-gradient-to-r from-orange-400 to-orange-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
