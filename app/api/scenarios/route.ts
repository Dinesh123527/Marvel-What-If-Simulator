import { NextResponse } from 'next/server';
import { getDivergencesByScenarioId, getScenarios } from '../../lib/data';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const phaseParam = searchParams.get('phase');
        const phase = phaseParam ? parseInt(phaseParam) : undefined;

        const scenarios = await getScenarios(phase);

        // Add divergence count to each scenario
        const scenariosWithMeta = await Promise.all(
            scenarios.map(async (scenario) => ({
                ...scenario,
                divergenceCount: (await getDivergencesByScenarioId(scenario.id)).length,
            }))
        );

        return NextResponse.json({
            success: true,
            data: scenariosWithMeta,
            count: scenarios.length,
        });
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch scenarios' },
            { status: 500 }
        );
    }
}
