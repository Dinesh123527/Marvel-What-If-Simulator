'use client';

import { motion } from 'framer-motion';
import { Divergence } from '../lib/types';

interface DivergenceSelectorProps {
    divergences: Divergence[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    isSimulating?: boolean;
}

export default function DivergenceSelector({
    divergences,
    selectedId,
    onSelect,
    isSimulating = false
}: DivergenceSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-quantum-purple to-multiverse-pink flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Choose Your Divergence</h3>
                    <p className="text-sm text-text-muted">Select an alternate decision to explore</p>
                </div>
            </div>

            <div className="space-y-3">
                {divergences.map((divergence, index) => {
                    const isSelected = selectedId === divergence.id;

                    return (
                        <motion.button
                            key={divergence.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => !isSimulating && onSelect(divergence.id)}
                            disabled={isSimulating}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${isSelected
                                    ? 'bg-quantum-purple/20 border-quantum-purple shadow-lg shadow-quantum-purple/20'
                                    : 'bg-cosmic-elevated/50 border-white/5 hover:border-quantum-purple/50 hover:bg-cosmic-elevated'
                                } ${isSimulating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {/* Selection indicator */}
                            <div className="flex items-start gap-4">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected
                                        ? 'border-quantum-purple bg-quantum-purple'
                                        : 'border-text-muted group-hover:border-quantum-purple/50'
                                    }`}>
                                    {isSelected && (
                                        <motion.svg
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-quantum-purple' : 'text-white group-hover:text-quantum-purple'
                                            }`}>
                                            {divergence.shortLabel}
                                        </span>
                                        {isSelected && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-quantum-purple text-white rounded"
                                            >
                                                Selected
                                            </motion.span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {divergence.changeDescription}
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <motion.div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                                            ? 'bg-quantum-purple/20'
                                            : 'bg-white/5 group-hover:bg-quantum-purple/10'
                                        }`}
                                    animate={isSelected ? { x: [0, 5, 0] } : {}}
                                    transition={{ duration: 1, repeat: isSelected ? Infinity : 0 }}
                                >
                                    <svg
                                        className={`w-4 h-4 transition-colors ${isSelected ? 'text-quantum-purple' : 'text-text-muted group-hover:text-quantum-purple'
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Hover gradient effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-quantum-purple/10 to-transparent opacity-0 transition-opacity ${!isSimulating && 'group-hover:opacity-100'
                                }`} />
                        </motion.button>
                    );
                })}
            </div>

            {/* Selected divergence action hint */}
            {selectedId && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-tva-gold"
                >
                    <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        ⚡
                    </motion.span>
                    <span>Ready to simulate - Timeline divergence selected</span>
                </motion.div>
            )}
        </div>
    );
}
