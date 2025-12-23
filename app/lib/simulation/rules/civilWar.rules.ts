import { SimulationResult } from "../types";

export function civilWarRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "AVENGERS_UNITED":
            return {
                universeCode: "Earth-TRN-Unity",
                stabilityScore: 90,
                tone: "hopeful",
                summary: "Tony and Steve find common ground. The Avengers sign modified accords and remain united.",
                events: [
                    {
                        order: 1,
                        description: "Tony and Steve negotiate a compromise on the Sokovia Accords.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "The united Avengers easily capture Zemo before he can execute his plan.",
                        impact: "medium",
                    },
                    {
                        order: 3,
                        description: "Bucky receives proper rehabilitation under Wakandan supervision.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "When Thanos arrives, Earth's mightiest heroes stand together.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "alive",
                        divergentDescription: "Remains active Avenger, relationship with Steve fully repaired",
                    },
                    {
                        name: "Steve Rogers",
                        canonFate: "alive",
                        canonDescription: "Retired after returning the stones",
                        divergentFate: "alive",
                        divergentDescription: "Continues as active Captain America, never becomes fugitive",
                    },
                    {
                        name: "Bucky Barnes",
                        canonFate: "alive",
                        canonDescription: "Now the White Wolf, ally of Wakanda",
                        divergentFate: "alive",
                        divergentDescription: "Rehabilitated openly, becomes official Avenger",
                    },
                    {
                        name: "T'Challa",
                        canonFate: "deceased",
                        canonDescription: "Died off-screen (real-world circumstances)",
                        divergentFate: "alive",
                        divergentDescription: "Never pursues vengeance, focuses on opening Wakanda to the world",
                    },
                ],
            };

        case "ZEMO_CAPTURED":
            return {
                universeCode: "Earth-TRN-Zemo",
                stabilityScore: 75,
                tone: "stable",
                summary: "Zemo's plan is discovered early. The Avengers capture him and the truth about the Starks comes out peacefully.",
                events: [
                    {
                        order: 1,
                        description: "SHIELD intelligence intercepts Zemo's plans before the UN bombing.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "T'Chaka survives, Black Panther never seeks vengeance.",
                        impact: "medium",
                    },
                    {
                        order: 3,
                        description: "Tony learns about his parents' death through proper channels, processes it with help.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "The Accords are debated peacefully, with compromises made.",
                        impact: "medium",
                    },
                ],
                characterFates: [
                    {
                        name: "T'Chaka",
                        canonFate: "deceased",
                        canonDescription: "Killed in the UN bombing by Zemo",
                        divergentFate: "alive",
                        divergentDescription: "Survives, continues to guide Wakanda alongside T'Challa",
                    },
                    {
                        name: "Zemo",
                        canonFate: "imprisoned",
                        canonDescription: "Escaped the Raft, now working with Thunderbolts",
                        divergentFate: "imprisoned",
                        divergentDescription: "Captured before executing his plan, serves life sentence",
                    },
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "alive",
                        divergentDescription: "Processes parents' death with therapy, forgives Bucky",
                    },
                ],
            };

        case "TCHALLA_SWITCHES":
            return {
                universeCode: "Earth-TRN-Panther",
                stabilityScore: 50,
                tone: "dark",
                summary: "Black Panther sides with Captain America. Tony is outnumbered, the Accords fail spectacularly.",
                events: [
                    {
                        order: 1,
                        description: "T'Challa, after learning Bucky's innocence, switches sides to Team Cap.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "With Wakandan support, Team Cap easily defeats Tony's faction.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "The Sokovia Accords collapse. The UN loses faith in superhero regulation.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "Tony, humiliated and alone, spirals into isolation.",
                        impact: "medium",
                    },
                ],
                characterFates: [
                    {
                        name: "T'Challa",
                        canonFate: "deceased",
                        canonDescription: "Died off-screen (real-world circumstances)",
                        divergentFate: "alive",
                        divergentDescription: "Allies with Steve, opens Wakanda to house rogue Avengers",
                    },
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "alive",
                        divergentDescription: "Defeats leads to depression and isolation from the team",
                    },
                    {
                        name: "James Rhodes",
                        canonFate: "alive",
                        canonDescription: "Paralyzed but uses Stark tech to walk, now War Machine",
                        divergentFate: "alive",
                        divergentDescription: "Still paralyzed in battle, blames Steve for the injury",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Civil War: ${divergenceKey}`);
    }
}
