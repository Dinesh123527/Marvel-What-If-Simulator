import { NextResponse } from "next/server";
import { getDivergenceById } from "../../lib/data";
import { runSimulation } from "../../lib/simulation/engine";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { canonEvent, divergenceKey, divergenceId } = body;

        console.log(`[API/Simulate] Received request:`, { canonEvent, divergenceKey, divergenceId });

        // Bridge Phase 2 (DB IDs) to Phase 3 (Engine Keys)
        let divergenceLabel = "Unknown Divergence";

        if (divergenceId && !canonEvent) {
            const divergence = await getDivergenceById(divergenceId);
            if (divergence) {
                divergenceLabel = divergence.shortLabel;

                // Map known seeds to rules
                if (divergence.shortLabel === 'Tony Survives') {
                    canonEvent = 'INFINITY_WAR';
                    divergenceKey = 'TONY_SURVIVES';
                }
                // Fallback: If we found the divergence in DB but have no specific rule yet,
                // we will construct a temporary "Generic" rule to prevent 400 errors.
                else {
                    console.log(`[API/Simulate] No specific rule for "${divergence.shortLabel}". Using generic fallback.`);
                    canonEvent = 'GENERIC_FALLBACK';
                    divergenceKey = 'GENERIC';
                }
            } else {
                console.error(`[API/Simulate] Divergence ID ${divergenceId} not found in DB.`);
            }
        }

        // If we simply cannot identify the event/key/id at all
        if ((!canonEvent || !divergenceKey) && canonEvent !== 'GENERIC_FALLBACK') {
            return NextResponse.json(
                { success: false, message: "Missing canonEvent/divergenceKey and ID lookup failed." },
                { status: 400 }
            );
        }

        let result;
        if (canonEvent === 'GENERIC_FALLBACK') {
            // Construct a safe generic result for demo purposes
            result = {
                universeCode: `Earth-TRN-${Math.floor(Math.random() * 9000) + 1000}`,
                stabilityScore: 50,
                tone: "stable",
                summary: `Simulation for "${divergenceLabel}" is pending detailed analysis. The timeline has branched successfully.`,
                events: [
                    {
                        order: 1,
                        description: "The nexus event occurs as predicted.",
                        impact: "high",
                    },
                    {
                        order: 2,
                        description: "Timeline variance stabilizes within acceptable parameters.",
                        impact: "medium",
                    }
                ]
            };
        } else {
            result = runSimulation(canonEvent, divergenceKey);
        }

        // Generate visualization points for the graph
        // Base canon points (static for now, could be dynamic based on event type)
        const basePoints = [
            { x: 0, y: 50, label: 'Start', isCanon: true, isBranch: false },
            { x: 20, y: 50, label: 'Event Begins', isCanon: true, isBranch: false },
            { x: 40, y: 50, label: 'Divergence', isCanon: true, isBranch: false },
            // Canon continues...
            { x: 60, y: 50, label: 'Canon Result', isCanon: true, isBranch: false },
            { x: 80, y: 50, label: 'MCU Future', isCanon: true, isBranch: false },
        ];

        // Branch points based on simulation events
        // Start branching from x=40
        // Branch points based on simulation events
        // Start branching from x=40
        const branchPoints = result.events.map((e, i) => {
            // Calculate position
            const x = 40 + ((i + 1) * 15); // Spread out by 15 units

            // Determine y deviation based on tone (randomized slightly for visual interest)
            // chaos/dark -> goes down/erratic, hopeful/stable -> goes up/smooth
            const direction = result.tone === 'dark' || result.tone === 'chaotic' ? 1 : -1;
            const deviation = 20 + (i * 5); // drift further away over time
            const y = 50 + (direction * deviation);

            // Simple heuristic to extract character mentions for the graph
            let character = undefined;
            const desc = e.description.toLowerCase();
            if (desc.includes('thanos')) character = 'Thanos';
            else if (desc.includes('tony') || desc.includes('stark') || desc.includes('iron man')) character = 'Iron Man';
            else if (desc.includes('strange')) character = 'Dr. Strange';
            else if (desc.includes('cap') || desc.includes('steve')) character = 'Capt. America';
            else if (desc.includes('thor')) character = 'Thor';
            else if (desc.includes('wanda') || desc.includes('witch')) character = 'Scarlet Witch';
            else if (desc.includes('vision')) character = 'Vision';
            else if (desc.includes('hulk') || desc.includes('banner')) character = 'Hulk';
            else if (desc.includes('nebula')) character = 'Nebula';
            else if (desc.includes('carol') || desc.includes('marvel')) character = 'Capt. Marvel';

            return {
                x,
                y,
                label: `Event ${e.order}`, // Simplified label for graph
                isCanon: false,
                isBranch: true,
                character
            };
        });

        // Combine for frontend
        const visualizationPoints = [...basePoints, ...branchPoints];

        // Adapter to match frontend expected shape:
        const adaptedResult = {
            timeline: {
                universeName: result.universeCode,
                stabilityScore: result.stabilityScore,
                outcomeStatus: result.tone === 'chaotic' ? 'collapsing' : result.tone,
                dominantCharacters: [],
            },
            events: result.events.map(e => ({
                eventOrder: e.order,
                description: e.description,
                type: e.impact === 'high' ? 'immediate' : 'ripple'
            })),
            branchPoints: visualizationPoints, // Add this!
            characters: {}
        };

        return NextResponse.json({ success: true, data: adaptedResult });
    } catch (error: any) {
        console.error("Simulation error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Simulation failed" },
            { status: 400 }
        );
    }
}
