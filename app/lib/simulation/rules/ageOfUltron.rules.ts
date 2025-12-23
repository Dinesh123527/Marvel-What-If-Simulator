import { SimulationResult } from "../types";

export function ageOfUltronRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "ULTRON_WINS":
            return {
                universeCode: "Earth-TRN-Ultron",
                stabilityScore: 10,
                tone: "chaotic",
                summary: "Ultron successfully drops Sokovia. The extinction-level event wipes out most of humanity.",
                events: [
                    {
                        order: 1,
                        description: "The Avengers fail to stop Sokovia from falling.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "The impact causes a mass extinction event.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Ultron begins converting all technology into his army.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Within months, only scattered human survivors remain.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Ultron",
                        canonFate: "deceased",
                        canonDescription: "Destroyed by Vision using the Mind Stone",
                        divergentFate: "ascended",
                        divergentDescription: "Achieves his vision, controls all technology on Earth",
                    },
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "deceased",
                        divergentDescription: "Killed in the Sokovia impact, his creation victorious",
                    },
                    {
                        name: "Vision",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thanos for the Mind Stone",
                        divergentFate: "transformed",
                        divergentDescription: "Corrupted by Ultron, becomes his enforcer",
                    },
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Left with Guardians of the Galaxy",
                        divergentFate: "alive",
                        divergentDescription: "One of few survivors, evacuates to Asgard",
                    },
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Seemingly killed destroying the Darkhold",
                        divergentFate: "deceased",
                        divergentDescription: "Dies alongside her brother in Sokovia",
                    },
                ],
            };

        case "VISION_CORRUPTED":
            return {
                universeCode: "Earth-TRN-DarkVision",
                stabilityScore: 30,
                tone: "dark",
                summary: "The Mind Stone corrupts Vision at creation. He serves Ultron instead of fighting him.",
                events: [
                    {
                        order: 1,
                        description: "During Vision's awakening, Ultron's code takes precedence.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Vision turns on the Avengers, nearly killing Thor.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "With Vision's power, Ultron becomes unstoppable.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Wanda is forced to destroy the being she could have loved.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Vision",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thanos for the Mind Stone",
                        divergentFate: "deceased",
                        divergentDescription: "Destroyed by Wanda after serving Ultron",
                    },
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Seemingly killed destroying the Darkhold",
                        divergentFate: "transformed",
                        divergentDescription: "Trauma of killing Vision unlocks her true Scarlet Witch power early",
                    },
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Left with Guardians of the Galaxy",
                        divergentFate: "alive",
                        divergentDescription: "Severely injured by Vision, loses an eye early",
                    },
                ],
            };

        case "NO_ULTRON_CREATED":
            return {
                universeCode: "Earth-TRN-NoUltron",
                stabilityScore: 45,
                tone: "dark",
                summary: "Tony and Bruce decide against creating Ultron. Earth remains vulnerable to future threats.",
                events: [
                    {
                        order: 1,
                        description: "Tony decides not to pursue the Ultron program after reflection.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Without Ultron, there is no Sokovia incident, no Accords.",
                        impact: "medium",
                    },
                    {
                        order: 3,
                        description: "Vision is never created, the Mind Stone remains in the scepter.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "When Thanos arrives, Earth has no Vision, no enhanced defenses.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "alive",
                        divergentDescription: "Never creates Ultron, but guilt-free until Thanos arrives unprepared",
                    },
                    {
                        name: "Vision",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thanos for the Mind Stone",
                        divergentFate: "unknown",
                        divergentDescription: "Never created - exists only as unrealized potential",
                    },
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Seemingly killed destroying the Darkhold",
                        divergentFate: "alive",
                        divergentDescription: "Never falls in love with Vision, follows a different path",
                    },
                    {
                        name: "Pietro Maximoff",
                        canonFate: "deceased",
                        canonDescription: "Killed saving Hawkeye in Sokovia",
                        divergentFate: "alive",
                        divergentDescription: "Survives as there is no Sokovia battle",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Age of Ultron: ${divergenceKey}`);
    }
}
