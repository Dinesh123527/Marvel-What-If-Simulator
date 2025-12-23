import { SimulationResult } from "../types";

export function snapRules(divergenceKey: string): SimulationResult {
    switch (divergenceKey) {
        case "THOR_HEAD":
            return {
                universeCode: "Earth-TRN-616B",
                stabilityScore: 85,
                tone: "hopeful",
                summary: "Thor aims for the head. Thanos dies instantly. The Snap never happens, and the universe is saved.",
                events: [
                    {
                        order: 1,
                        description: "Stormbreaker strikes Thanos directly in the head, killing him instantly.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "The Infinity Gauntlet is secured by the Avengers.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Vision survives with the Mind Stone intact.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "Thor falls into a deep depression, haunted by 'what could have been' if he had acted sooner.",
                        impact: "medium",
                    },
                ],
                characterFates: [
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Survived but fell into depression after failing to stop the Snap",
                        divergentFate: "alive",
                        divergentDescription: "Killed Thanos but carries guilt for not acting sooner in previous battles",
                    },
                    {
                        name: "Thanos",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thor after the Snap, then erased by Tony",
                        divergentFate: "deceased",
                        divergentDescription: "Killed instantly by Stormbreaker to the head before completing the Snap",
                    },
                    {
                        name: "Vision",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thanos who ripped the Mind Stone from his head",
                        divergentFate: "alive",
                        divergentDescription: "Survived with Mind Stone intact, continues relationship with Wanda",
                    },
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Snapped away, later became Scarlet Witch",
                        divergentFate: "alive",
                        divergentDescription: "Never experienced Vision's death, remains emotionally stable",
                    },
                    {
                        name: "Tony Stark",
                        canonFate: "deceased",
                        canonDescription: "Sacrificed himself using the Infinity Stones",
                        divergentFate: "alive",
                        divergentDescription: "Lives happily with Pepper, retires from active duty",
                    },
                ],
            };

        case "MIND_STONE_DESTROYED":
            return {
                universeCode: "Earth-TRN-199",
                stabilityScore: 55,
                tone: "dark",
                summary: "Wanda destroys the Mind Stone in time, but Thanos uses the Time Stone to reverse her actions... unless he never gets the Time Stone.",
                events: [
                    {
                        order: 1,
                        description: "Wanda destroys Vision and the Mind Stone before Thanos arrives.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Without the Time Stone available, Thanos cannot reverse the destruction.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "Thanos, enraged, vows to collect the stones by other means.",
                        impact: "medium",
                    },
                    {
                        order: 4,
                        description: "The Avengers face years of conflict as Thanos hunts alternate methods.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Vision",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thanos who ripped the Mind Stone from his head",
                        divergentFate: "deceased",
                        divergentDescription: "Willingly sacrificed by Wanda to destroy the Mind Stone permanently",
                    },
                    {
                        name: "Wanda Maximoff",
                        canonFate: "unknown",
                        canonDescription: "Snapped away, later became the Scarlet Witch",
                        divergentFate: "transformed",
                        divergentDescription: "Grief transforms her into a darker version, but with purpose",
                    },
                    {
                        name: "Thanos",
                        canonFate: "deceased",
                        canonDescription: "Completed his mission before death",
                        divergentFate: "alive",
                        divergentDescription: "Still hunting for ways to complete his vision",
                    },
                ],
            };

        case "GAUNTLET_SEIZED":
            return {
                universeCode: "Earth-TRN-732",
                stabilityScore: 70,
                tone: "hopeful",
                summary: "Stormbreaker severs Thanos's arm. Thor claims the Gauntlet. Power corrupts absolutely.",
                events: [
                    {
                        order: 1,
                        description: "Thor's Stormbreaker cuts off Thanos's arm along with the Gauntlet.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Thor wields the Infinity Gauntlet, drunk with power.",
                        impact: "high",
                    },
                    {
                        order: 3,
                        description: "The Avengers must decide: trust Thor with ultimate power or take it from him.",
                        impact: "high",
                    },
                ],
                characterFates: [
                    {
                        name: "Thor",
                        canonFate: "alive",
                        canonDescription: "Left with Guardians of the Galaxy",
                        divergentFate: "ascended",
                        divergentDescription: "Wields the Infinity Gauntlet, becoming the most powerful being",
                    },
                    {
                        name: "Thanos",
                        canonFate: "deceased",
                        canonDescription: "Killed by Thor, then erased by Tony",
                        divergentFate: "imprisoned",
                        divergentDescription: "Captured and imprisoned by Thor, stripped of all power",
                    },
                    {
                        name: "Steve Rogers",
                        canonFate: "alive",
                        canonDescription: "Retired after returning the stones",
                        divergentFate: "alive",
                        divergentDescription: "Leads opposition against Thor's increasingly authoritarian rule",
                    },
                ],
            };

        default:
            throw new Error(`Unknown divergence key for Snap: ${divergenceKey}`);
    }
}
