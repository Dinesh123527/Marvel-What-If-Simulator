'use client';

import { motion } from 'framer-motion';
import { BranchPoint } from '../lib/types';

interface TimelineGraphProps {
    branchPoints: BranchPoint[];
    isAnimating?: boolean;
}

export default function TimelineGraph({ branchPoints, isAnimating = false }: TimelineGraphProps) {
    // Ensure branchPoints is a valid array and filter out points with invalid coordinates
    const validPoints = (branchPoints || []).filter(
        p => p && typeof p.x === 'number' && typeof p.y === 'number' && !isNaN(p.x) && !isNaN(p.y)
    );

    const canonPoints = validPoints.filter(p => p.isCanon);
    const branchPointsFiltered = validPoints.filter(p => p.isBranch);

    // SVG viewBox dimensions
    const width = 800;
    const height = 300;
    const padding = 60; // Increased padding for labels

    // Scale points to SVG coordinates
    const scaleX = (x: number) => padding + (x / 100) * (width - padding * 2);
    const scaleY = (y: number) => padding + (y / 100) * (height - padding * 2);

    // Generate smooth Bezier path for canon timeline
    // Using Catmull-Rom to Bezier conversion logic simplified for this linear-ish graph
    const generateSmoothPath = (points: BranchPoint[]) => {
        if (points.length < 2) return '';

        let d = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const x = scaleX(p1.x);
            const y = scaleY(p1.y);
            const nextX = scaleX(p2.x);
            const nextY = scaleY(p2.y);

            // Simple cubic bezier control points for smooth horizontal flow
            const cp1x = x + (nextX - x) / 2;
            const cp1y = y;
            const cp2x = x + (nextX - x) / 2;
            const cp2y = nextY;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`;
        }
        return d;
    };

    const canonPath = generateSmoothPath(canonPoints);

    // Generate branch path - starting from the divergence point (usually index 0 of branch is the start)
    // We need to connect the last shared canon point to the first branch point
    let branchPath = '';
    if (branchPointsFiltered.length > 0) {
        // Find the divergence point on canon (approximate based on x)
        const startX = scaleX(40); // Hardcoded divergence point from API
        const startY = scaleY(50);

        branchPath = `M ${startX} ${startY}`;

        // Curve to first branch point
        const p1 = branchPointsFiltered[0];
        const p1x = scaleX(p1.x);
        const p1y = scaleY(p1.y);

        branchPath += ` C ${startX + 50} ${startY}, ${p1x - 50} ${p1y}, ${p1x} ${p1y}`;

        // Continue with smooth path for the rest
        if (branchPointsFiltered.length > 1) {
            for (let i = 0; i < branchPointsFiltered.length - 1; i++) {
                const curr = branchPointsFiltered[i];
                const next = branchPointsFiltered[i + 1];

                const currX = scaleX(curr.x);
                const currY = scaleY(curr.y);
                const nextX = scaleX(next.x);
                const nextY = scaleY(next.y);

                const cp1x = currX + (nextX - currX) / 2;
                const cp1y = currY;
                const cp2x = currX + (nextX - currX) / 2;
                const cp2y = nextY;

                branchPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`;
            }
        }
    }

    return (
        <div className="w-full overflow-hidden rounded-2xl glass p-6 border border-white/10 relative">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-tva-gold animate-[spin_10s_linear_infinite]" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" className="text-quantum-purple animate-[spin_15s_linear_infinite_reverse]" />
                </svg>
            </div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-tva-gold">❖</span> Timeline Visualization
                </h3>
                <div className="flex items-center gap-4 ml-auto text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-nexus-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        <span className="text-text-secondary">Sacred Timeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                        <span className="text-text-secondary">Branch</span>
                    </div>
                </div>
            </div>

            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto"
                style={{ minHeight: '250px' }}
            >
                {/* Background grid */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139, 92, 246, 0.05)" strokeWidth="1" />
                    </pattern>

                    {/* Glow filter for lines */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Gradient for branch line */}
                    <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f5a623" />
                    </linearGradient>

                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Canon Timeline Path */}
                {canonPoints.length > 1 && (
                    <motion.path
                        d={canonPath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                )}

                {/* Branch Path */}
                {branchPointsFiltered.length > 0 && isAnimating && (
                    <motion.path
                        d={branchPath}
                        fill="none"
                        stroke="url(#branchGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="1,0" // Solid line for clearer curve
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                    />
                )}

                {/* Canon Timeline Nodes */}
                {canonPoints.map((point, index) => (
                    <motion.g
                        key={`canon-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                        {/* Connection Dot */}
                        <circle cx={scaleX(point.x)} cy={scaleY(point.y)} r="4" fill="#1e1e2e" stroke="#3b82f6" strokeWidth="2" />

                        {/* Label */}
                        <text
                            x={scaleX(point.x)}
                            y={scaleY(point.y) + 20}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="10"
                            fontWeight="500"
                            style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
                        >
                            {point.label}
                        </text>
                    </motion.g>
                ))}

                {/* Branch Nodes with Enhanced Visuals */}
                {branchPointsFiltered.map((point, index) => (
                    <motion.g
                        key={`branch-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isAnimating ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 1.5 + 0.2 * index }}
                    >
                        {/* Character Tag (New Feature) */}
                        {point.character && (
                            <foreignObject x={scaleX(point.x) - 40} y={scaleY(point.y) - 50} width="80" height="30">
                                <motion.div
                                    className="bg-black/80 backdrop-blur border border-white/20 rounded-md px-2 py-1 flex items-center justify-center gap-1 shadow-lg"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 2 + index * 0.2 }}
                                >
                                    <span className="text-[8px] text-white font-bold uppercase tracking-wider">{point.character}</span>
                                </motion.div>
                            </foreignObject>
                        )}

                        {/* Pulse effect for latest node */}
                        {index === branchPointsFiltered.length - 1 && (
                            <motion.circle
                                cx={scaleX(point.x)}
                                cy={scaleY(point.y)}
                                fill="none"
                                stroke="#f5a623"
                                strokeWidth="1"
                                initial={{ r: 10, opacity: 0.8 }}
                                animate={{
                                    r: [10, 30, 40],
                                    opacity: [0.8, 0, 0],
                                    strokeWidth: [2, 0.5, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}

                        {/* Node Body */}
                        <circle
                            cx={scaleX(point.x)}
                            cy={scaleY(point.y)}
                            r="6"
                            fill="#1e1e2e"
                            stroke="#ec4899"
                            strokeWidth="2"
                        />

                        {/* Inner Dot */}
                        <circle
                            cx={scaleX(point.x)}
                            cy={scaleY(point.y)}
                            r="2"
                            fill="#f5a623"
                        />

                        {/* Label */}
                        <text
                            x={scaleX(point.x)}
                            y={scaleY(point.y) + 20}
                            textAnchor="middle"
                            fill="#f5a623"
                            fontSize="11"
                            fontWeight="600"
                            style={{ textShadow: '0px 0px 8px rgba(245, 166, 35, 0.5)' }}
                        >
                            {point.label}
                        </text>
                    </motion.g>
                ))}

                {/* Divergence Marker */}
                {branchPointsFiltered.length > 0 && isAnimating && (
                    <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0, type: "spring" }}
                    >
                        <circle
                            cx={scaleX(40)}
                            cy={scaleY(50)}
                            r="12"
                            fill="none"
                            stroke="#f5a623"
                            strokeWidth="2"
                            strokeDasharray="2 2"
                        />
                        <text
                            x={scaleX(40)}
                            y={scaleY(50) - 20}
                            textAnchor="middle"
                            fill="#f5a623"
                            fontSize="9"
                            fontWeight="700"
                            className="uppercase tracking-widest"
                        >
                            Nexus
                        </text>
                    </motion.g>
                )}
            </svg>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-6 text-xs text-text-muted">
                <span>← Past Events</span>
                <span className="text-quantum-purple">● Divergence Point</span>
                <span>Future →</span>
            </div>
        </div>
    );
}
