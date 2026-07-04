import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const required = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing env: ${missing.join(', ')}`);
  process.exit(1);
}

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number.parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: Number.parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10),
};

try {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.query('SELECT 1 AS ok');
  const [tables] = await connection.query('SHOW TABLES');
  await connection.end();

  console.log('Database connection: healthy');
  console.log(`Host: ${config.host}:${config.port}`);
  console.log(`Database: ${config.database}`);
  console.log(`Tables: ${tables.map((row) => Object.values(row)[0]).join(', ') || '(none)'}`);
  console.log(`Probe: ${rows[0]?.ok === 1 ? 'ok' : 'failed'}`);
} catch (error) {
  console.error('Database connection: failed');
  console.error(error instanceof Error ? error.message : error);
  console.error('If using the remote VPS, start the tunnel first: npm run db:tunnel');
  process.exit(1);
}
