import { NextResponse } from 'next/server';
import { getAllTimelines, getTimelineEvents } from '../../lib/data';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let timelines = await getAllTimelines();

        // Filter by status if provided
        if (status && ['hopeful', 'dark', 'collapsing', 'stable'].includes(status)) {
            timelines = timelines.filter(t => t.outcomeStatus === status);
        }

        // Add events to each timeline
        const timelinesWithEvents = await Promise.all(
            timelines.map(async (timeline) => ({
                ...timeline,
                events: await getTimelineEvents(timeline.id),
            }))
        );

        const allTimelines = await getAllTimelines();

        return NextResponse.json({
            success: true,
            data: timelinesWithEvents,
            count: timelinesWithEvents.length,
            stats: {
                total: allTimelines.length,
                hopeful: allTimelines.filter(t => t.outcomeStatus === 'hopeful').length,
                dark: allTimelines.filter(t => t.outcomeStatus === 'dark').length,
                collapsing: allTimelines.filter(t => t.outcomeStatus === 'collapsing').length,
                stable: allTimelines.filter(t => t.outcomeStatus === 'stable').length,
            },
        });
    } catch (error) {
        console.error('Error fetching timelines:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch timelines' },
            { status: 500 }
        );
    }
}
