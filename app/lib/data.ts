import { RowDataPacket } from 'mysql2/promise';
import { execute, initDB, isDatabaseSeeded, query } from './db';
import { seedDatabase } from './seed';
import { BranchPoint, Divergence, Scenario, SimulationResult, Timeline, TimelineEvent } from './types';

let dbInitialized = false;

async function ensureDB() {
    if (!dbInitialized) {
        await initDB();
        const isSeeded = await isDatabaseSeeded();
        if (!isSeeded) {
            await seedDatabase();
        }
        dbInitialized = true;
    }
}

// ═══════════════════════════════════════════════════════════════
// SCENARIOS
// ═══════════════════════════════════════════════════════════════

export async function getScenarios(phase?: number): Promise<Scenario[]> {
    await ensureDB();

    let queryStr = `
    SELECT id, title, canon_event as canonEvent, description, phase, year, image_url as imageUrl
    FROM scenarios
  `;
    const params: (string | number)[] = [];

    if (phase) {
        queryStr += ' WHERE phase = ?';
        params.push(`Phase ${phase}`);
    }

    queryStr += ' ORDER BY year ASC';

    const rows = await query<RowDataPacket[]>(queryStr, params);
    return rows as unknown as Scenario[];
}

export async function getScenarioById(id: number): Promise<Scenario | null> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
    SELECT id, title, canon_event as canonEvent, description, phase, year, image_url as imageUrl
    FROM scenarios
    WHERE id = ?
  `, [id]);
    return rows.length > 0 ? (rows[0] as unknown as Scenario) : null;
}

// ═══════════════════════════════════════════════════════════════
// DIVERGENCES
// ═══════════════════════════════════════════════════════════════

export async function getDivergencesByScenarioId(scenarioId: number): Promise<Divergence[]> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
    SELECT id, scenario_id as scenarioId, short_label as shortLabel, change_description as changeDescription
    FROM divergences
    WHERE scenario_id = ?
    ORDER BY id ASC
  `, [scenarioId]);
    return rows as unknown as Divergence[];
}

export async function getDivergenceById(id: number): Promise<Divergence | null> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
    SELECT id, scenario_id as scenarioId, short_label as shortLabel, change_description as changeDescription
    FROM divergences
    WHERE id = ?
  `, [id]);
    return rows.length > 0 ? (rows[0] as unknown as Divergence) : null;
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION RULES
// ═══════════════════════════════════════════════════════════════

interface SimulationRuleRow extends RowDataPacket {
    id: number;
    divergence_id: number;
    universe_name: string;
    stability_score: number;
    outcome_status: 'hopeful' | 'dark' | 'collapsing' | 'stable';
    dominant_characters: string;
}

interface TimelineEventRow extends RowDataPacket {
    id: number;
    rule_id: number;
    timeline_id: number;
    event_order: number;
    description: string;
    event_type: 'immediate' | 'ripple' | 'longterm';
}

// Helper function to safely parse dominant_characters field
// Handles both JSON arrays (new format) and comma-separated strings (legacy format)
function parseDominantCharacters(value: unknown): string[] {
    // Handle null/undefined
    if (!value) return [];

    // Already an array - just return it
    if (Array.isArray(value)) {
        return value.map(v => String(v));
    }

    // If it's not a string, can't parse it
    if (typeof value !== 'string') {
        return [];
    }

    // Try to parse as JSON first
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.map(v => String(v));
        }
        // If it's not an array, treat it as a comma-separated string
        return value.split(',').map(s => s.trim()).filter(Boolean);
    } catch {
        // If JSON parsing fails, treat as comma-separated string
        return value.split(',').map(s => s.trim()).filter(Boolean);
    }
}

export async function getSimulationRule(divergenceId: number) {
    await ensureDB();
    const rows = await query<SimulationRuleRow[]>(`
    SELECT id, divergence_id, universe_name, stability_score, outcome_status, dominant_characters
    FROM simulation_rules
    WHERE divergence_id = ?
  `, [divergenceId]);

    if (rows.length === 0) return null;

    const rule = rows[0];
    const events = await query<TimelineEventRow[]>(`
    SELECT event_order, description, event_type
    FROM timeline_events
    WHERE rule_id = ?
    ORDER BY event_order ASC
  `, [rule.id]);

    return {
        divergenceId: rule.divergence_id,
        universeName: rule.universe_name,
        stabilityScore: rule.stability_score,
        outcomeStatus: rule.outcome_status,
        dominantCharacters: parseDominantCharacters(rule.dominant_characters),
        events: events.map(e => ({
            eventOrder: e.event_order,
            description: e.description,
            type: e.event_type,
        })),
    };
}

// ═══════════════════════════════════════════════════════════════
// TIMELINES (Saved user simulations)
// ═══════════════════════════════════════════════════════════════

export async function saveTimeline(
    divergenceId: number,
    universeName: string,
    stabilityScore: number,
    outcomeStatus: string,
    summary: string,
    dominantCharacters: string[],
    events: { eventOrder: number; description: string; type: string }[]
): Promise<{ timeline: Timeline; events: TimelineEvent[] }> {
    await ensureDB();

    // Insert timeline
    const result = await execute(`
    INSERT INTO timelines (divergence_id, universe_name, stability_score, outcome_status, summary, dominant_characters)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [divergenceId, universeName, stabilityScore, outcomeStatus, summary, JSON.stringify(dominantCharacters)]);

    const timelineId = result.insertId;

    // Insert events
    const savedEvents: TimelineEvent[] = [];
    for (const event of events) {
        const eventResult = await execute(`
      INSERT INTO timeline_events (timeline_id, event_order, description, event_type)
      VALUES (?, ?, ?, ?)
    `, [timelineId, event.eventOrder, event.description, event.type]);

        savedEvents.push({
            id: eventResult.insertId,
            timelineId: timelineId,
            eventOrder: event.eventOrder,
            description: event.description,
            type: event.type as 'immediate' | 'ripple' | 'longterm',
        });
    }

    const timeline: Timeline = {
        id: timelineId,
        divergenceId,
        universeName,
        stabilityScore,
        summary,
        dominantCharacters,
        outcomeStatus: outcomeStatus as 'hopeful' | 'dark' | 'collapsing' | 'stable',
        createdAt: new Date(),
    };

    return { timeline, events: savedEvents };
}

export async function getAllTimelines(): Promise<Timeline[]> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
    SELECT 
      id, 
      divergence_id as divergenceId, 
      universe_name as universeName, 
      stability_score as stabilityScore, 
      outcome_status as outcomeStatus,
      summary,
      dominant_characters as dominantCharacters,
      created_at as createdAt
    FROM timelines
    ORDER BY created_at DESC
  `);

    return rows.map(row => ({
        ...row,
        dominantCharacters: parseDominantCharacters(row.dominantCharacters),
    })) as unknown as Timeline[];
}

export async function getTimelineEvents(timelineId: number): Promise<TimelineEvent[]> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
    SELECT 
      id, 
      timeline_id as timelineId, 
      event_order as eventOrder, 
      description, 
      event_type as type
    FROM timeline_events
    WHERE timeline_id = ?
    ORDER BY event_order ASC
  `, [timelineId]);
    return rows as unknown as TimelineEvent[];
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION ENGINE
// ═══════════════════════════════════════════════════════════════

export async function simulate(divergenceId: number, saveResult: boolean = true): Promise<SimulationResult | null> {
    const rule = await getSimulationRule(divergenceId);
    if (!rule) return null;

    const divergence = await getDivergenceById(divergenceId);
    if (!divergence) return null;

    let timeline: Timeline;
    let events: TimelineEvent[];

    if (saveResult) {
        const saved = await saveTimeline(
            divergenceId,
            rule.universeName,
            rule.stabilityScore,
            rule.outcomeStatus,
            `Timeline generated from divergence: ${divergence.shortLabel}`,
            rule.dominantCharacters,
            rule.events
        );
        timeline = saved.timeline;
        events = saved.events;
    } else {
        timeline = {
            id: 0,
            divergenceId,
            universeName: rule.universeName,
            stabilityScore: rule.stabilityScore,
            summary: `Timeline generated from divergence: ${divergence.shortLabel}`,
            dominantCharacters: rule.dominantCharacters,
            outcomeStatus: rule.outcomeStatus,
            createdAt: new Date(),
        };
        events = rule.events.map((e, idx) => ({
            id: idx,
            timelineId: 0,
            eventOrder: e.eventOrder,
            description: e.description,
            type: e.type as 'immediate' | 'ripple' | 'longterm',
        }));
    }

    // Generate branch points
    const branchPoints = generateBranchPoints(divergence.shortLabel);

    return { timeline, events, branchPoints };
}

function generateBranchPoints(divergenceLabel: string): BranchPoint[] {
    return [
        // Canon timeline
        { x: 0, y: 50, label: 'Start', isCanon: true, isBranch: false },
        { x: 20, y: 50, label: 'Event Begins', isCanon: true, isBranch: false },
        { x: 40, y: 50, label: 'Critical Moment', isCanon: true, isBranch: false },
        { x: 60, y: 50, label: 'Canon Decision', isCanon: true, isBranch: false },
        { x: 80, y: 50, label: 'Outcome', isCanon: true, isBranch: false },
        { x: 100, y: 50, label: 'Future', isCanon: true, isBranch: false },
        // Branch
        { x: 40, y: 50, label: 'Divergence Point', isCanon: false, isBranch: true },
        { x: 55, y: 25, label: 'Alternate Path', isCanon: false, isBranch: true },
        { x: 70, y: 15, label: 'New Reality', isCanon: false, isBranch: true },
        { x: 85, y: 10, label: 'Timeline Stabilizes', isCanon: false, isBranch: true },
        { x: 100, y: 5, label: divergenceLabel, isCanon: false, isBranch: true },
    ];
}

// ═══════════════════════════════════════════════════════════════
// CHARACTER CACHING
// ═══════════════════════════════════════════════════════════════

interface CachedCharacter {
    id: number;
    superhero_api_id: number;
    name: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    image_url: string;
}

/**
 * Get a character from the database cache by name
 */
export async function getCachedCharacter(name: string): Promise<CachedCharacter | null> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
        SELECT id, superhero_api_id, name, alignment, intelligence, strength, 
               speed, durability, power, combat, image_url
        FROM characters
        WHERE name = ?
    `, [name]);

    return rows.length > 0 ? (rows[0] as unknown as CachedCharacter) : null;
}

/**
 * Get a character from cache by superhero API ID
 */
export async function getCachedCharacterById(superheroApiId: number): Promise<CachedCharacter | null> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
        SELECT id, superhero_api_id, name, alignment, intelligence, strength, 
               speed, durability, power, combat, image_url
        FROM characters
        WHERE superhero_api_id = ?
    `, [superheroApiId]);

    return rows.length > 0 ? (rows[0] as unknown as CachedCharacter) : null;
}

/**
 * Cache a character in the database
 */
export async function cacheCharacter(character: {
    superheroApiId: number;
    name: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    imageUrl: string;
}): Promise<void> {
    await ensureDB();

    // Check if already cached
    const existing = await getCachedCharacterById(character.superheroApiId);
    if (existing) {
        // Update existing record
        await execute(`
            UPDATE characters 
            SET name = ?, alignment = ?, intelligence = ?, strength = ?, 
                speed = ?, durability = ?, power = ?, combat = ?, image_url = ?
            WHERE superhero_api_id = ?
        `, [
            character.name,
            character.alignment,
            character.intelligence,
            character.strength,
            character.speed,
            character.durability,
            character.power,
            character.combat,
            character.imageUrl,
            character.superheroApiId
        ]);
    } else {
        // Insert new record
        await execute(`
            INSERT INTO characters (superhero_api_id, name, alignment, intelligence, 
                                   strength, speed, durability, power, combat, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            character.superheroApiId,
            character.name,
            character.alignment,
            character.intelligence,
            character.strength,
            character.speed,
            character.durability,
            character.power,
            character.combat,
            character.imageUrl
        ]);
    }
}

/**
 * Get all cached characters
 */
export async function getAllCachedCharacters(): Promise<CachedCharacter[]> {
    await ensureDB();
    const rows = await query<RowDataPacket[]>(`
        SELECT id, superhero_api_id, name, alignment, intelligence, strength, 
               speed, durability, power, combat, image_url
        FROM characters
        ORDER BY name ASC
    `);

    return rows as unknown as CachedCharacter[];
}

/**
 * Get characters filtered by alignment and/or letter with pagination
 */
export async function getFilteredCharacters(
    alignment: string,
    letter: string,
    limit: number,
    offset: number
): Promise<{ characters: CachedCharacter[]; total: number }> {
    await ensureDB();

    let baseQuery = ' FROM characters';
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (alignment && alignment !== 'all') {
        conditions.push('alignment = ?');
        params.push(alignment);
    }

    if (letter) {
        conditions.push('name LIKE ?');
        params.push(`${letter}%`);
    }

    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    const countQuery = 'SELECT COUNT(*) as total' + baseQuery;
    const dataQuery = `SELECT id, superhero_api_id, name, alignment, intelligence, strength, 
                       speed, durability, power, combat, image_url` +
        baseQuery +
        ' ORDER BY name ASC LIMIT ? OFFSET ?';

    const countRows = await query<RowDataPacket[]>(countQuery, params);
    const total = countRows[0].total;

    const rows = await query<RowDataPacket[]>(dataQuery, [...params, limit, offset]);

    return {
        characters: rows as unknown as CachedCharacter[],
        total
    };
}
