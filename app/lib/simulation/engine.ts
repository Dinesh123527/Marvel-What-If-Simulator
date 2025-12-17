import { infinityWarRules } from "./rules/infinityWar.rules";
import { SimulationResult } from "./types";

export function runSimulation(
    canonEvent: string,
    divergenceKey: string
): SimulationResult {
    switch (canonEvent) {
        case "INFINITY_WAR":
            return infinityWarRules(divergenceKey);

        default:
            throw new Error(`No rules defined for this event: ${canonEvent}`);
    }
}
