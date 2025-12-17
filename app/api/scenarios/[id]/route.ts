import { NextResponse } from 'next/server';
import { getDivergencesByScenarioId, getScenarioById } from '../../../lib/data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const scenarioId = parseInt(id, 10);

        if (isNaN(scenarioId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid scenario ID' },
                { status: 400 }
            );
        }

        const scenario = await getScenarioById(scenarioId);

        if (!scenario) {
            return NextResponse.json(
                { success: false, error: 'Scenario not found' },
                { status: 404 }
            );
        }

        const divergences = await getDivergencesByScenarioId(scenarioId);

        return NextResponse.json({
            success: true,
            data: {
                ...scenario,
                divergences,
            },
        });
    } catch (error) {
        console.error('Error fetching scenario:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch scenario' },
            { status: 500 }
        );
    }
}
