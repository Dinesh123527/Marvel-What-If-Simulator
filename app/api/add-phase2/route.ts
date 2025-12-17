import { RowDataPacket } from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { execute, initDB, query } from '../../lib/db';

/**
 * GET /api/add-phase2
 * Adds Age of Ultron (Phase 2) scenario with divergences and rules
 */
export async function GET() {
    try {
        await initDB();

        // Check if Phase 2 scenario already exists
        const existing = await query<RowDataPacket[]>(
            "SELECT id FROM scenarios WHERE phase = 'Phase 2'"
        );

        if (existing.length > 0) {
            return NextResponse.json({
                success: true,
                message: 'Phase 2 scenario already exists',
            });
        }

        // Add Age of Ultron scenario
        const scenarioResult = await execute(
            'INSERT INTO scenarios (title, canon_event, description, phase, year) VALUES (?, ?, ?, ?, ?)',
            [
                'Age of Ultron',
                'Ultron\'s Creation',
                'Tony Stark and Bruce Banner secretly use the Mind Stone to create Ultron, an AI meant to protect Earth. Instead, Ultron becomes sentient and decides humanity must be destroyed.',
                'Phase 2',
                2015,
            ]
        );
        const scenarioId = scenarioResult.insertId;

        // Add divergences for Age of Ultron
        const divergences = [
            { shortLabel: 'Ultron Succeeds', changeDescription: 'Ultron successfully drops Sokovia, causing an extinction-level event' },
            { shortLabel: 'Vision Joins Ultron', changeDescription: 'Vision awakens corrupted and sides with Ultron against the Avengers' },
            { shortLabel: 'No Ultron Created', changeDescription: 'Tony listens to Bruce\'s concerns and abandons the Ultron project entirely' },
        ];

        const divergenceIds: number[] = [];
        for (const div of divergences) {
            const result = await execute(
                'INSERT INTO divergences (scenario_id, short_label, change_description) VALUES (?, ?, ?)',
                [scenarioId, div.shortLabel, div.changeDescription]
            );
            divergenceIds.push(result.insertId);
        }

        // Add simulation rules
        const rules = [
            {
                divergenceId: divergenceIds[0],
                universeName: 'Earth-TRN-ULTRON',
                stabilityScore: 5,
                outcomeStatus: 'collapsing' as const,
                dominantCharacters: ['Ultron', 'Vision', 'Remaining Avengers', 'Nick Fury'],
                events: [
                    { eventOrder: 1, description: 'Sokovia impacts Earth, triggering global extinction event', eventType: 'immediate' },
                    { eventOrder: 2, description: '70% of life on Earth is wiped out in the initial impact', eventType: 'immediate' },
                    { eventOrder: 3, description: 'Ultron uploads himself to satellites, becoming unstoppable', eventType: 'ripple' },
                    { eventOrder: 4, description: 'Surviving Avengers go underground in hidden bunkers', eventType: 'ripple' },
                    { eventOrder: 5, description: 'Thanos arrives to find Earth already in ruins', eventType: 'longterm' },
                    { eventOrder: 6, description: 'Ultron becomes the new threat to the entire galaxy', eventType: 'longterm' },
                ],
            },
            {
                divergenceId: divergenceIds[1],
                universeName: 'Earth-TRN-VISION',
                stabilityScore: 22,
                outcomeStatus: 'dark' as const,
                dominantCharacters: ['Ultron', 'Vision', 'Wanda Maximoff', 'Thor'],
                events: [
                    { eventOrder: 1, description: 'Vision awakens with Ultron\'s core programming intact', eventType: 'immediate' },
                    { eventOrder: 2, description: 'The Mind Stone amplifies Ultron\'s reach through Vision', eventType: 'immediate' },
                    { eventOrder: 3, description: 'Wanda senses Vision\'s corruption but cannot stop him', eventType: 'ripple' },
                    { eventOrder: 4, description: 'Thor calls for Asgardian reinforcements', eventType: 'ripple' },
                    { eventOrder: 5, description: 'A war between Ultron/Vision and the Nine Realms begins', eventType: 'longterm' },
                ],
            },
            {
                divergenceId: divergenceIds[2],
                universeName: 'Earth-TRN-PEACE',
                stabilityScore: 89,
                outcomeStatus: 'hopeful' as const,
                dominantCharacters: ['Tony Stark', 'Bruce Banner', 'Wanda Maximoff', 'Pietro Maximoff'],
                events: [
                    { eventOrder: 1, description: 'Tony and Bruce decide the Mind Stone is too dangerous to use', eventType: 'immediate' },
                    { eventOrder: 2, description: 'The scepter is secured and studied safely at Avengers Tower', eventType: 'immediate' },
                    { eventOrder: 3, description: 'Wanda and Pietro join the Avengers voluntarily after Hydra falls', eventType: 'ripple' },
                    { eventOrder: 4, description: 'Sokovia is never destroyed - Pietro survives', eventType: 'ripple' },
                    { eventOrder: 5, description: 'The Avengers remain united through Phase 3 events', eventType: 'longterm' },
                    { eventOrder: 6, description: 'Vision is never created, changing Wanda\'s entire future', eventType: 'longterm' },
                ],
            },
        ];

        for (const rule of rules) {
            const ruleResult = await execute(
                'INSERT INTO simulation_rules (divergence_id, universe_name, stability_score, outcome_status, dominant_characters) VALUES (?, ?, ?, ?, ?)',
                [rule.divergenceId, rule.universeName, rule.stabilityScore, rule.outcomeStatus, JSON.stringify(rule.dominantCharacters)]
            );

            const ruleId = ruleResult.insertId;
            for (const event of rule.events) {
                await execute(
                    'INSERT INTO timeline_events (rule_id, event_order, description, event_type) VALUES (?, ?, ?, ?)',
                    [ruleId, event.eventOrder, event.description, event.eventType]
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Phase 2 scenario (Age of Ultron) added successfully!',
            data: {
                scenarioId,
                divergenceIds,
            },
        });
    } catch (error) {
        console.error('Error adding Phase 2:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add Phase 2 scenario' },
            { status: 500 }
        );
    }
}
