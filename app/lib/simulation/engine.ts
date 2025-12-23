import { ageOfUltronRules } from "./rules/ageOfUltron.rules";
import { battleOfNYRules } from "./rules/battleOfNY.rules";
import { civilWarRules } from "./rules/civilWar.rules";
import { guardiansRules } from "./rules/guardians.rules";
import { infinityWarRules } from "./rules/infinityWar.rules";
import { multiverseOfMadnessRules } from "./rules/multiverseOfMadness.rules";
import { snapRules } from "./rules/snap.rules";
import { winterSoldierRules } from "./rules/winterSoldier.rules";
import { SimulationResult } from "./types";

export function runSimulation(
    canonEvent: string,
    divergenceKey: string
): SimulationResult {
    switch (canonEvent) {
        // Scenario 1: Endgame Final Battle
        case "INFINITY_WAR":
            return infinityWarRules(divergenceKey);

        // Scenario 2: The Snap (Infinity War Wakanda)
        case "THE_SNAP":
            return snapRules(divergenceKey);

        // Scenario 3: Battle of New York
        case "BATTLE_OF_NY":
            return battleOfNYRules(divergenceKey);

        // Scenario 4: Civil War
        case "CIVIL_WAR":
            return civilWarRules(divergenceKey);

        // Scenario 5: Multiverse of Madness
        case "MULTIVERSE_OF_MADNESS":
            return multiverseOfMadnessRules(divergenceKey);

        // Scenario 8: Winter Soldier
        case "WINTER_SOLDIER":
            return winterSoldierRules(divergenceKey);

        // Scenario 9: Guardians of the Galaxy
        case "GUARDIANS":
            return guardiansRules(divergenceKey);

        // Scenario 10: Age of Ultron
        case "AGE_OF_ULTRON":
            return ageOfUltronRules(divergenceKey);

        default:
            throw new Error(`No rules defined for this event: ${canonEvent}`);
    }
}

