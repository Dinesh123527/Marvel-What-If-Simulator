import { SimulationResult } from "../types";

// Scenario 8: Winter Soldier (SHIELD Falls)
export function winterSoldierRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "PROJECT_INSIGHT_SUCCEEDS":
            return {
                universeCode: "Earth-TRN-Hydra",
                stabilityScore: 20,
                tone: "dark",
                summary: "HYDRA launches Project Insight successfully. Millions of threats are eliminated. HYDRA rules.",
                events: [
                    {
                        order: 1,
                        description: "The helicarriers launch and begin targeting millions worldwide.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Steve Rogers and Natasha are among the first eliminated.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "HYDRA reveals itself and assumes control of world governments.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "A new world order begins under HYDRA's iron fist.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Steve Rogers",
                        canonFate: "alive",
                        canonDescription: "Retired after returning the stones",
                        divergentFate: "deceased",
                        divergentDescription: "Eliminated by Project Insight targeting algorithm",
                    },
                    {
                        name: "Natasha Romanoff",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed herself to obtain Soul Stone",
                        divergentFate: "deceased",
                        divergentDescription: "Killed alongside Steve before SHIELD could fall",
                    },
                    {
                        name: "Nick Fury",
                        canonFate: "alive",
                        canonDescription: "Operating in the shadows, now in space",
                        divergentFate: "deceased",
                        divergentDescription: "Assassinated by Winter Soldier, this time permanently",
                    },
                    {
                        name: "Bucky Barnes",
                        canonFate: "alive",
                        canonDescription: "Now the White Wolf, ally of Wakanda",
                        divergentFate: "transformed",
                        divergentDescription: "Remains as HYDRA's primary assassin indefinitely",
                    },
                ],
            };

        case "BUCKY_REMEMBERS":
            return {
                universeCode: "Earth-TRN-Bucky",
                stabilityScore: 75,
                tone: "hopeful",
                summary: "Bucky breaks free from brainwashing during the helicarrier battle. Brothers reunite.",
                events: [
                    {
                        order: 1,
                        description: "Steve's words finally reach Bucky mid-fight.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Bucky helps Steve destroy the helicarriers from within.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Together, they expose HYDRA and bring down the organization.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "Bucky's rehabilitation begins immediately with Steve's support.",
                        impact: "medium",
                    },
                ],
                characterFates: [
                    {
                        name: "Bucky Barnes",
                        canonFate: "alive",
                        canonDescription: "Now the White Wolf, ally of Wakanda",
                        divergentFate: "alive",
                        divergentDescription: "Freed early, rehabilitation starts sooner with Steve's help",
                    },
                    {
                        name: "Steve Rogers",
                        canonFate: "alive",
                        canonDescription: "Retired after returning the stones",
                        divergentFate: "alive",
                        divergentDescription: "Never becomes a fugitive, stays with his best friend",
                    },
                    {
                        name: "Nick Fury",
                        canonFate: "alive",
                        canonDescription: "Operating in the shadows",
                        divergentFate: "alive",
                        divergentDescription: "Works openly to rebuild SHIELD with Cap and Bucky",
                    },
                ],
            };

        case "NICK_FURY_DIES":
            return {
                universeCode: "Earth-TRN-NoFury",
                stabilityScore: 35,
                tone: "dark",
                summary: "Nick Fury is killed by the Winter Soldier. SHIELD falls without his guidance.",
                events: [
                    {
                        order: 1,
                        description: "The Winter Soldier's assassination attempt succeeds.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Without Fury's contingency plans, HYDRA moves faster.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Steve and Natasha are captured before they can act.",
                        impact: "high",
                    },
                    {
                        order: 4,
                        description: "Maria Hill leads a desperate underground resistance.",
                        impact: "medium",
                    },
                ],
                characterFates: [
                    {
                        name: "Nick Fury",
                        canonFate: "alive",
                        canonDescription: "Operating in the shadows, now in space",
                        divergentFate: "deceased",
                        divergentDescription: "Killed by the Winter Soldier, no faking death this time",
                    },
                    {
                        name: "Maria Hill",
                        canonFate: "alive",
                        canonDescription: "Works with Fury and the Avengers",
                        divergentFate: "alive",
                        divergentDescription: "Leads the resistance against HYDRA in Fury's memory",
                    },
                    {
                        name: "Steve Rogers",
                        canonFate: "alive",
                        canonDescription: "Retired after returning the stones",
                        divergentFate: "imprisoned",
                        divergentDescription: "Captured and put on ice again by HYDRA",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Winter Soldier: ${divergenceKey}`);
    }
}
