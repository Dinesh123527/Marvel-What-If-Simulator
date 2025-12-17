import {
    getDivergenceById,
    getDivergencesByScenarioId,
    getSimulationRule,
    saveTimeline
} from './data';
import { BranchPoint, SimulationResult, TimelineEvent } from './types';

export interface SimulateOptions {
    divergenceId: number;
    saveResult?: boolean;
}

export async function simulate(options: SimulateOptions): Promise<SimulationResult | null> {
    const { divergenceId, saveResult = true } = options;

    const rule = await getSimulationRule(divergenceId);
    if (!rule) {
        return null;
    }

    const divergence = await getDivergenceById(divergenceId);
    if (!divergence) {
        return null;
    }

    let timeline, events;

    if (saveResult) {
        const saved = await saveTimeline(
            divergenceId,
            rule.universeName,
            rule.stabilityScore,
            rule.outcomeStatus,
            `Timeline generated from divergence: ${divergence.shortLabel}`,
            rule.dominantCharacters,
            rule.events
        );
        timeline = saved.timeline;
        events = saved.events;
    } else {
        // Construct temporary objects if not saving
        timeline = {
            id: 0,
            divergenceId,
            universeName: rule.universeName,
            stabilityScore: rule.stabilityScore,
            summary: `Timeline generated from divergence: ${divergence.shortLabel}`,
            dominantCharacters: rule.dominantCharacters,
            outcomeStatus: rule.outcomeStatus,
            createdAt: new Date(),
        };
        events = rule.events.map((e, idx) => ({
            id: idx,
            timelineId: 0,
            eventOrder: e.eventOrder,
            description: e.description,
            type: e.type,
        })) as TimelineEvent[];
    }

    const branchPoints = await generateBranchPoints(divergence.scenarioId, divergenceId);

    return {
        timeline,
        events,
        branchPoints,
    };
}

async function generateBranchPoints(scenarioId: number, selectedDivergenceId: number): Promise<BranchPoint[]> {
    const points: BranchPoint[] = [];

    const canonPoints = [
        { x: 0, y: 50, label: 'Start', isCanon: true, isBranch: false },
        { x: 20, y: 50, label: 'Event Begins', isCanon: true, isBranch: false },
        { x: 40, y: 50, label: 'Critical Moment', isCanon: true, isBranch: false },
        { x: 60, y: 50, label: 'Canon Decision', isCanon: true, isBranch: false },
        { x: 80, y: 50, label: 'Outcome', isCanon: true, isBranch: false },
        { x: 100, y: 50, label: 'Future', isCanon: true, isBranch: false },
    ];

    points.push(...canonPoints);

    // Get all divergences for this scenario
    const scenarioDivergences = await getDivergencesByScenarioId(scenarioId);

    // Add branch points for the selected divergence
    const selectedDivergence = scenarioDivergences.find(d => d.id === selectedDivergenceId);
    if (selectedDivergence) {
        // Branch starts at critical moment
        const branchPoints: BranchPoint[] = [
            { x: 40, y: 50, label: 'Divergence Point', isCanon: false, isBranch: true },
            { x: 55, y: 25, label: 'Alternate Path', isCanon: false, isBranch: true },
            { x: 70, y: 15, label: 'New Reality', isCanon: false, isBranch: true },
            { x: 85, y: 10, label: 'Timeline Stabilizes', isCanon: false, isBranch: true },
            { x: 100, y: 5, label: selectedDivergence.shortLabel, isCanon: false, isBranch: true },
        ];

        points.push(...branchPoints);
    }

    return points;
}

export function calculateStability(events: TimelineEvent[]): number {
    let stability = 100;

    events.forEach(event => {
        switch (event.type) {
            case 'immediate':
                stability -= 5;
                break;
            case 'ripple':
                stability -= 8;
                break;
            case 'longterm':
                stability -= 12;
                break;
        }
    });

    return Math.max(0, stability);
}

export function generateUniverseDesignation(): string {
    const prefix = Math.random() > 0.5 ? 'Earth' : 'TRN';
    const number = Math.floor(Math.random() * 999) + 1;
    const suffix = Math.random() > 0.7 ? `-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : '';

    return `${prefix}-${number.toString().padStart(3, '0')}${suffix}`;
}

export function determineOutcomeStatus(stability: number): 'hopeful' | 'dark' | 'collapsing' | 'stable' {
    if (stability >= 80) return 'hopeful';
    if (stability >= 50) return 'stable';
    if (stability >= 20) return 'dark';
    return 'collapsing';
}
