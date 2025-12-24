import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mcu_what_if',
};

// SSL configuration for cloud databases (TiDB, PlanetScale, etc.)
const SSL_CONFIG = process.env.DB_SSL === 'true' ? {
  ssl: {
    rejectUnauthorized: true,
  }
} : {};

let pool: Pool | null = null;
let isInitialized = false;

/**
 * Reset database state - call this before reinitializing after a drop
 */
export function resetDBState(): void {
  if (pool) {
    pool.end();
  }
  pool = null;
  isInitialized = false;
}

/**
 * Initialize database - creates DB and tables if they don't exist
 */
export async function initDB(): Promise<Pool> {
  if (pool && isInitialized) return pool;

  // 1️⃣ Connect without DB first (to create DB if not exists)
  const connection = await mysql.createConnection({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    multipleStatements: true,
    ...SSL_CONFIG,
  });

  // 2️⃣ Create database if not exists
  await connection.query(`
    CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
  `);

  // 3️⃣ Use database
  await connection.query(`USE \`${DB_CONFIG.database}\`;`);


  // 4️⃣ Create all tables
  await connection.query(`
    -- Characters table (for SuperHero API data)
    CREATE TABLE IF NOT EXISTS characters (
      id INT AUTO_INCREMENT PRIMARY KEY,
      superhero_api_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      alignment ENUM('hero', 'villain', 'anti-hero') DEFAULT 'hero',
      intelligence INT,
      strength INT,
      speed INT,
      durability INT,
      power INT,
      combat INT,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Canon Events (Scenarios)
    CREATE TABLE IF NOT EXISTS scenarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      canon_event VARCHAR(150) NOT NULL,
      description TEXT,
      phase VARCHAR(50),
      year INT,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Divergences (What-If Changes)
    CREATE TABLE IF NOT EXISTS divergences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      scenario_id INT NOT NULL,
      short_label VARCHAR(100) NOT NULL,
      change_description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
    );

    -- Simulation Rules (Cause-Effect Chains)
    CREATE TABLE IF NOT EXISTS simulation_rules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      divergence_id INT NOT NULL UNIQUE,
      universe_name VARCHAR(50) NOT NULL,
      stability_score INT DEFAULT 50,
      outcome_status ENUM('hopeful', 'dark', 'collapsing', 'stable') DEFAULT 'stable',
      dominant_characters JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (divergence_id) REFERENCES divergences(id) ON DELETE CASCADE
    );

    -- Timelines (Generated Universes)
    CREATE TABLE IF NOT EXISTS timelines (
      id INT AUTO_INCREMENT PRIMARY KEY,
      divergence_id INT NOT NULL,
      universe_name VARCHAR(50) NOT NULL,
      stability_score INT DEFAULT 50,
      outcome_status ENUM('hopeful', 'dark', 'collapsing', 'stable') DEFAULT 'stable',
      summary TEXT,
      dominant_characters JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (divergence_id) REFERENCES divergences(id) ON DELETE CASCADE
    );

    -- Timeline Events (Sequence of events in a timeline)
    CREATE TABLE IF NOT EXISTS timeline_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timeline_id INT,
      rule_id INT,
      event_order INT NOT NULL,
      description TEXT NOT NULL,
      event_type ENUM('immediate', 'ripple', 'longterm') DEFAULT 'ripple',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (timeline_id) REFERENCES timelines(id) ON DELETE CASCADE,
      FOREIGN KEY (rule_id) REFERENCES simulation_rules(id) ON DELETE CASCADE
    );
  `);

  await connection.end();

  pool = mysql.createPool({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ...SSL_CONFIG,
  });

  isInitialized = true;
  console.log('✅ MySQL DB & tables ready');
  return pool;
}

/**
 * Get the database pool (initializes if needed)
 */
export async function getDB(): Promise<Pool> {
  if (!pool || !isInitialized) {
    await initDB();
  }
  return pool!;
}

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: (string | number | boolean | null | object)[]
): Promise<T> {
  const db = await getDB();
  const [rows] = await db.query<T>(sql, params);
  return rows;
}

export async function execute(
  sql: string,
  params?: (string | number | boolean | null | object)[]
): Promise<ResultSetHeader> {
  const db = await getDB();
  const [result] = await db.execute<ResultSetHeader>(sql, params);
  return result;
}

export async function isDatabaseSeeded(): Promise<boolean> {
  const rows = await query<RowDataPacket[]>('SELECT COUNT(*) as count FROM scenarios');
  return rows[0].count > 0;
}
