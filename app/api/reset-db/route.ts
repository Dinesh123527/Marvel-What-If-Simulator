import { initDB, resetDBState } from '@/app/lib/db';
import { seedDatabase } from '@/app/lib/seed';
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mcu_what_if',
};

export async function POST() {
    try {
        // 1. Reset the DB state (close existing connections)
        resetDBState();

        // 2. Drop the existing database
        const connection = await mysql.createConnection({
            host: DB_CONFIG.host,
            port: DB_CONFIG.port,
            user: DB_CONFIG.user,
            password: DB_CONFIG.password,
        });

        await connection.query(`DROP DATABASE IF EXISTS \`${DB_CONFIG.database}\``);
        await connection.end();

        console.log('🗑️ Database dropped successfully');

        // 3. Reinitialize the database (creates tables)
        await initDB();

        // 4. Seed the database with fresh data
        await seedDatabase();

        return NextResponse.json({
            success: true,
            message: 'Database reset and reseeded successfully with 11 scenarios including Phase 2!',
        });
    } catch (error) {
        console.error('Database reset error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to reset database' },
            { status: 500 }
        );
    }
}
