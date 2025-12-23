import { CharacterFate } from "../character-fates";

export type DivergenceInput = {
    canonEvent: string;
    divergenceKey: string;
};

export type TimelineEvent = {
    order: number;
    description: string;
    impact: "low" | "medium" | "high";
};

export type SimulationResult = {
    universeCode: string;
    stabilityScore: number;
    tone: "hopeful" | "dark" | "chaotic" | "stable";
    summary: string;
    events: TimelineEvent[];
    characterFates?: CharacterFate[];
};

