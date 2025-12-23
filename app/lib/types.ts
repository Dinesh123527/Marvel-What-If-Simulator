import { CharacterFate } from './character-fates';

export interface Scenario {
    id: number;
    title: string;
    canonEvent: string;
    description: string;
    imageUrl?: string;
    phase: string;
    year: number;
}

export interface Divergence {
    id: number;
    scenarioId: number;
    changeDescription: string;
    shortLabel: string;
}

export interface Timeline {
    id: number;
    divergenceId: number;
    universeName: string;
    stabilityScore: number;
    summary: string;
    dominantCharacters: string[];
    outcomeStatus: 'hopeful' | 'dark' | 'collapsing' | 'stable';
    createdAt: Date;
}

export interface TimelineEvent {
    id: number;
    timelineId: number;
    eventOrder: number;
    description: string;
    type: 'immediate' | 'ripple' | 'longterm';
}

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

export interface SimulationResult {
    timeline: Timeline;
    events: TimelineEvent[];
    branchPoints: BranchPoint[];
    characters?: Record<string, CharacterData>;
    characterFates?: CharacterFate[];
}

export interface BranchPoint {
    x: number;
    y: number;
    label: string;
    isCanon: boolean;
    isBranch: boolean;
    character?: string;
}
