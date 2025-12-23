import { CharacterFate } from "../../character-fates";
import { SimulationResult } from "../types";

export interface ExtendedSimulationResult extends SimulationResult {
    characterFates?: CharacterFate[];
}

export function infinityWarRules(
    divergenceKey: string
): ExtendedSimulationResult {
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
            characterFates: [
                {
                    name: "Tony Stark",
                    canonFate: "deceased",
                    canonDescription: "Sacrificed himself using the Infinity Stones to defeat Thanos",
                    divergentFate: "alive",
                    divergentDescription: "Survived but lives in a world ruled by Thanos, leads tech resistance",
                },
                {
                    name: "Thanos",
                    canonFate: "deceased",
                    canonDescription: "Killed by Thor, then erased by Tony's snap",
                    divergentFate: "alive",
                    divergentDescription: "Rules Earth as a cosmic emperor, achieved his 'balance'",
                },
                {
                    name: "Natasha Romanoff",
                    canonFate: "deceased",
                    canonDescription: "Sacrificed herself on Vormir to obtain the Soul Stone",
                    divergentFate: "alive",
                    divergentDescription: "Leads underground resistance operations against Thanos' forces",
                },
                {
                    name: "Doctor Strange",
                    canonFate: "alive",
                    canonDescription: "Dealing with multiverse consequences",
                    divergentFate: "ascended",
                    divergentDescription: "Became Sorcerer Supreme of the resistance, mastered forbidden arts",
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
            characterFates: [
                {
                    name: "Tony Stark",
                    canonFate: "deceased",
                    canonDescription: "Sacrificed himself using the Infinity Stones to defeat Thanos",
                    divergentFate: "deceased",
                    divergentDescription: "Killed in the final battle against Thanos' army",
                },
                {
                    name: "Steve Rogers",
                    canonFate: "alive",
                    canonDescription: "Retired after returning Infinity Stones",
                    divergentFate: "deceased",
                    divergentDescription: "Fell defending the last stronghold of humanity",
                },
                {
                    name: "Thor",
                    canonFate: "alive",
                    canonDescription: "Left with the Guardians of the Galaxy",
                    divergentFate: "exiled",
                    divergentDescription: "Banished to the realm between realms by Thanos",
                },
                {
                    name: "Thanos",
                    canonFate: "deceased",
                    canonDescription: "Killed by Thor, then erased by Tony's snap",
                    divergentFate: "ascended",
                    divergentDescription: "Achieved godhood by merging with the Infinity Stones",
                },
                {
                    name: "Wanda Maximoff",
                    canonFate: "unknown",
                    canonDescription: "Seemingly killed destroying the Darkhold",
                    divergentFate: "transformed",
                    divergentDescription: "Became an agent of entropy, corrupted by the chaos",
                },
            ],
        };
    }

    throw new Error(`Unknown divergence key: ${divergenceKey}`);
}
