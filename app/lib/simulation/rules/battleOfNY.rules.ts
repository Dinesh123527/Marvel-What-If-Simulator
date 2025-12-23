import { SimulationResult } from "../types";

export function battleOfNYRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "AVENGERS_NEVER_FORM":
            return {
                universeCode: "Earth-TRN-000",
                stabilityScore: 15,
                tone: "chaotic",
                summary: "Without the Avengers, Earth falls to the Chitauri invasion. Loki rules, but Thanos looms.",
                events: [
                    {
                        order: 1,
                        description: "SHIELD's Avengers Initiative fails as heroes refuse to work together.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "The Chitauri overwhelm New York's defenses.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Tony Stark fights alone and is overwhelmed.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Earth falls under Chitauri occupation within weeks.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "deceased",
                        divergentDescription: "Died fighting alone against the Chitauri invasion",
                    },
                    {
                        name: "Steve Rogers",
                        canonFate: "alive",
                        canonDescription: "Retired after returning the stones",
                        divergentFate: "imprisoned",
                        divergentDescription: "Captured by Chitauri, frozen again as a trophy",
                    },
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Left with Guardians of the Galaxy",
                        divergentFate: "exiled",
                        divergentDescription: "Banished from Asgard for failing to stop Loki",
                    },
                    {
                        name: "Loki",
                        canonFate: "alive",
                        canonDescription: "Variant exists monitoring the multiverse",
                        divergentFate: "ascended",
                        divergentDescription: "Rules Earth as King, but serves Thanos as vassal",
                    },
                ],
            };

        case "LOKI_CONQUERS":
            return {
                universeCode: "Earth-TRN-Loki",
                stabilityScore: 40,
                tone: "dark",
                summary: "Loki defeats the Avengers and claims Earth's throne. His reign brings order through tyranny.",
                events: [
                    {
                        order: 1,
                        description: "Loki's scepter corrupts all the Avengers, turning them into his servants.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "With Earth's mightiest heroes as his guard, Loki declares himself God-King.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Loki fortifies Earth against Thanos, knowing he will come for the Tesseract.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "Years later, Thanos arrives, and Loki must choose: surrender or all-out war.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Loki",
                        canonFate: "alive",
                        canonDescription: "Variant exists monitoring the multiverse",
                        divergentFate: "ascended",
                        divergentDescription: "Rules Earth as God-King, commands the corrupted Avengers",
                    },
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "transformed",
                        divergentDescription: "Mind-controlled by Loki, serves as his chief enforcer",
                    },
                    {
                        name: "Natasha Romanoff",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed herself to obtain Soul Stone",
                        divergentFate: "transformed",
                        divergentDescription: "Loki's spymaster, hunting resistance cells",
                    },
                    {
                        name: "Clint Barton",
                        canonFate: "alive",
                        canonDescription: "Reunited with family, training Kate Bishop",
                        divergentFate: "transformed",
                        divergentDescription: "Permanently under Loki's control, never freed",
                    },
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Left with Guardians of the Galaxy",
                        divergentFate: "exiled",
                        divergentDescription: "Refuses to fight his brother, exiled to the far reaches of space",
                    },
                ],
            };

        case "HULK_CORRUPTED":
            return {
                universeCode: "Earth-TRN-Hulk",
                stabilityScore: 25,
                tone: "chaotic",
                summary: "The Hulk grabs Loki's scepter. The Mind Stone corrupts Banner's other half into something far worse.",
                events: [
                    {
                        order: 1,
                        description: "During the helicarrier battle, Hulk grabs the scepter and is corrupted.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "World Breaker Hulk emerges, destroying the helicarrier and killing the team.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Loki attempts to control Hulk but is smashed into oblivion.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "The Mind Stone-enhanced Hulk becomes Earth's greatest threat.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Bruce Banner",
                        canonFate: "alive",
                        canonDescription: "Merged with Hulk as Smart Hulk",
                        divergentFate: "transformed",
                        divergentDescription: "Banner's consciousness is suppressed; only World Breaker Hulk remains",
                    },
                    {
                        name: "Loki",
                        canonFate: "alive",
                        canonDescription: "Variant exists monitoring the multiverse",
                        divergentFate: "deceased",
                        divergentDescription: "Smashed into oblivion by the Mind Stone-corrupted Hulk",
                    },
                    {
                        name: "Natasha Romanoff",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed herself to obtain Soul Stone",
                        divergentFate: "deceased",
                        divergentDescription: "Killed trying to calm Hulk on the helicarrier",
                    },
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Left with Guardians of the Galaxy",
                        divergentFate: "alive",
                        divergentDescription: "One of few survivors, leads evacuation of Earth",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Battle of NY: ${divergenceKey}`);
    }
}
