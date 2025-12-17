import { SimulationResult } from "../types";

export function infinityWarRules(
    divergenceKey: string
): SimulationResult {
    if (divergenceKey === "TONY_SURVIVES") {
        return {
            universeCode: "Earth-TRN-838",
            stabilityScore: 45,
            tone: "dark",
            summary: "Tony Stark survives, but Thanos rules Earth.",
            events: [
                {
                    order: 1,
                    description: "Thanos survives the snap and retreats.",
                    impact: "high",
                },
                {
                    order: 2,
                    description: "Avengers disband due to loss of hope.",
                    impact: "medium",
                },
                {
                    order: 3,
                    description: "A resistance led by Strange emerges.",
                    impact: "high",
                },
            ],
        };
    }

    if (divergenceKey === "THANOS_WINS") {
        return {
            universeCode: "Earth-TRN-666",
            stabilityScore: 20,
            tone: "chaotic",
            summary: "Thanos completes his vision. Half-life remains permanent.",
            events: [
                {
                    order: 1,
                    description: "The Avengers are eradicated.",
                    impact: "high",
                },
                {
                    order: 2,
                    description: "Cosmic imbalance destabilizes reality.",
                    impact: "high",
                },
            ],
        };
    }

    throw new Error(`Unknown divergence key: ${divergenceKey}`);
}
