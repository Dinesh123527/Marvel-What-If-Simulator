import { SimulationResult } from "../types";

// Scenario 5: Multiverse of Madness
export function multiverseOfMadnessRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "WANDA_HEALS":
            return {
                universeCode: "Earth-TRN-Healed",
                stabilityScore: 95,
                tone: "hopeful",
                summary: "Wanda accepts Strange's help and learns to cope with her grief. The Darkhold never corrupts her.",
                events: [
                    {
                        order: 1,
                        description: "Doctor Strange reaches Wanda before the Darkhold's corruption takes hold.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Wanda undergoes therapy at Kamar-Taj, learning to control her chaos magic.",
                        impact: "medium",
                    },
                    {
                        order: 3,
                        description: "America Chavez is protected, her powers studied safely.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "Wanda becomes a hero again, using her power to help, not harm.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Seemingly killed destroying the Darkhold",
                        divergentFate: "alive",
                        divergentDescription: "Healed from grief, becomes a force for good again",
                    },
                    {
                        name: "Doctor Strange",
                        canonFate: "alive",
                        canonDescription: "Dealing with multiverse consequences, third eye manifested",
                        divergentFate: "alive",
                        divergentDescription: "Never uses Darkhold, remains uncorrupted",
                    },
                    {
                        name: "America Chavez",
                        canonFate: "alive",
                        canonDescription: "Training at Kamar-Taj to control her powers",
                        divergentFate: "alive",
                        divergentDescription: "Safe and protected, never hunted by Wanda",
                    },
                ],
            };

        case "MULTIVERSE_BREAKS":
            return {
                universeCode: "Earth-TRN-Shattered",
                stabilityScore: 5,
                tone: "chaotic",
                summary: "America Chavez loses control. The barriers between universes shatter. Reality collapses.",
                events: [
                    {
                        order: 1,
                        description: "America Chavez's fear triggers an uncontrolled multiverse portal cascade.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Infinite universes begin bleeding into each other.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Incursions occur across the multiverse simultaneously.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Reality itself begins to unravel as the multiverse collapses.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "America Chavez",
                        canonFate: "alive",
                        canonDescription: "Training at Kamar-Taj to control her powers",
                        divergentFate: "transformed",
                        divergentDescription: "Becomes a living nexus of multiverse instability",
                    },
                    {
                        name: "Doctor Strange",
                        canonFate: "alive",
                        canonDescription: "Dealing with multiverse consequences",
                        divergentFate: "unknown",
                        divergentDescription: "Lost between colliding realities",
                    },
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Seemingly killed destroying the Darkhold",
                        divergentFate: "deceased",
                        divergentDescription: "Consumed by the chaos of colliding realities",
                    },
                ],
            };

        case "ILLUMINATI_WINS":
            return {
                universeCode: "Earth-838",
                stabilityScore: 65,
                tone: "stable",
                summary: "The Illuminati successfully defeats Wanda in Universe 838. Their universe survives.",
                events: [
                    {
                        order: 1,
                        description: "Black Bolt successfully speaks before Wanda can react.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Wanda is destroyed by Black Bolt's sonic scream.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "The Illuminati contains the multiverse threat.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "Universe 838 continues, though haunted by the near-apocalypse.",
                        impact: "medium",
                    },
                ],
                characterFates: [
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Seemingly killed destroying the Darkhold",
                        divergentFate: "deceased",
                        divergentDescription: "Killed by Black Bolt before she could harm the Illuminati",
                    },
                    {
                        name: "Black Bolt",
                        canonFate: "deceased",
                        canonDescription: "Killed by Wanda after she removed his mouth",
                        divergentFate: "alive",
                        divergentDescription: "Survives to continue leading the Illuminati",
                    },
                    {
                        name: "Professor Xavier",
                        canonFate: "deceased",
                        canonDescription: "Killed by Wanda in the mind realm",
                        divergentFate: "alive",
                        divergentDescription: "Survives, continues guiding his X-Men",
                    },
                    {
                        name: "Captain Carter",
                        canonFate: "deceased",
                        canonDescription: "Cut in half by Wanda with her own shield",
                        divergentFate: "alive",
                        divergentDescription: "Remains as the leader of 838's Avengers",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Multiverse of Madness: ${divergenceKey}`);
    }
}
