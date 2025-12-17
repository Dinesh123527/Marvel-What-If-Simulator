import { NextResponse } from 'next/server';
import { initDB } from '../../lib/db';
import { seedDatabase } from '../../lib/seed';

/**
 * GET /api/init
 * Initializes the database and seeds it with initial data
 */
export async function GET() {
    try {
        // Initialize database (creates tables if not exist)
        await initDB();

        // Seed database with initial data
        await seedDatabase();

        return NextResponse.json({
            success: true,
            message: 'Database initialized and seeded successfully',
        });
    } catch (error) {
        console.error('Database initialization error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to initialize database',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
