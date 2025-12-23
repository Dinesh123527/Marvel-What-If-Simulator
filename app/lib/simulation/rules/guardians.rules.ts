import { SimulationResult } from "../types";

// Scenario 9: Guardians of the Galaxy
export function guardiansRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "RONAN_WINS":
            return {
                universeCode: "Earth-TRN-Ronan",
                stabilityScore: 15,
                tone: "chaotic",
                summary: "Ronan the Accuser uses the Power Stone to destroy Xandar. Billions perish.",
                events: [
                    {
                        order: 1,
                        description: "The Guardians fail to distract Ronan with the dance-off.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Ronan touches the Power Stone to Xandar's surface.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "The entire planet is annihilated in seconds.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Ronan turns his attention to other planets opposing Kree supremacy.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Peter Quill",
                        canonFate: "alive",
                        canonDescription: "Leads the Guardians of the Galaxy",
                        divergentFate: "deceased",
                        divergentDescription: "Dies on Xandar trying to stop Ronan",
                    },
                    {
                        name: "Gamora",
                        canonFate: "alive",
                        canonDescription: "2014 Gamora survived, searching for identity",
                        divergentFate: "deceased",
                        divergentDescription: "Dies with her new friends on Xandar",
                    },
                    {
                        name: "Groot",
                        canonFate: "alive",
                        canonDescription: "Regrew as Baby Groot, now Teen Groot",
                        divergentFate: "deceased",
                        divergentDescription: "Unable to protect friends from planetary destruction",
                    },
                    {
                        name: "Thanos",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thor, erased by Tony",
                        divergentFate: "alive",
                        divergentDescription: "Loses the Power Stone to Ronan permanently",
                    },
                ],
            };

        case "GUARDIANS_NEVER_FORM":
            return {
                universeCode: "Earth-TRN-NoGuardians",
                stabilityScore: 40,
                tone: "dark",
                summary: "Peter Quill never meets Gamora. The Guardians never unite. The galaxy loses its heroes.",
                events: [
                    {
                        order: 1,
                        description: "Peter sells the Orb to a random buyer, never meeting Gamora.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Ronan obtains the Power Stone through other means.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Without Guardians, the Nova Corps falls to Ronan.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Cosmic heroes never rise to oppose Thanos's future plans.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Peter Quill",
                        canonFate: "alive",
                        canonDescription: "Leads the Guardians of the Galaxy",
                        divergentFate: "alive",
                        divergentDescription: "Remains a lone Ravager, never becoming a hero",
                    },
                    {
                        name: "Gamora",
                        canonFate: "alive",
                        canonDescription: "2014 Gamora survived",
                        divergentFate: "alive",
                        divergentDescription: "Continues serving Thanos reluctantly",
                    },
                    {
                        name: "Rocket Raccoon",
                        canonFate: "alive",
                        canonDescription: "Sole survivor of original Guardians",
                        divergentFate: "alive",
                        divergentDescription: "Remains a bounty hunter with Groot, never finding family",
                    },
                    {
                        name: "Drax",
                        canonFate: "alive",
                        canonDescription: "Member of Guardians, found new family",
                        divergentFate: "deceased",
                        divergentDescription: "Dies in prison, consumed by revenge he never fulfills",
                    },
                ],
            };

        case "THANOS_GETS_STONE":
            return {
                universeCode: "Earth-TRN-Early",
                stabilityScore: 25,
                tone: "dark",
                summary: "Thanos retrieves the Power Stone directly from Ronan. His collection begins early.",
                events: [
                    {
                        order: 1,
                        description: "Thanos personally arrives to take the Stone from Ronan.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Ronan is killed for his betrayal attempt.",
                        impact: "medium",
                    },
                    {
                        order: 3,
                        description: "Thanos begins his Infinity Stone hunt years ahead of schedule.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Earth's heroes have less time to prepare for the coming threat.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Thanos",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thor, erased by Tony",
                        divergentFate: "ascended",
                        divergentDescription: "Gets Power Stone early, accelerates his plans",
                    },
                    {
                        name: "Ronan",
                        canonFate: "deceased",
                        canonDescription: "Killed by the Guardians with Power Stone",
                        divergentFate: "deceased",
                        divergentDescription: "Killed by Thanos for attempting to keep the Stone",
                    },
                    {
                        name: "Gamora",
                        canonFate: "alive",
                        canonDescription: "2014 Gamora searching for identity",
                        divergentFate: "alive",
                        divergentDescription: "Witnesses father's brutality, plots escape sooner",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Guardians: ${divergenceKey}`);
    }
}
