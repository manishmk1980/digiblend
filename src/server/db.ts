import 'server-only';

import mysql, { type Pool, type PoolOptions, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

function buildPoolConfig(): PoolOptions {
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'digiblend_db',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    queueLimit: 0,
    connectTimeout: Number.parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10),
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };
}

let pool: Pool | null = null;

function getPool() {
  if (!isDatabaseConfigured()) {
    throw new Error('Database environment variables are not fully configured.');
  }

  if (!pool) {
    pool = mysql.createPool(buildPoolConfig());
  }

  return pool;
}

export type QueryResult<T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]> = T;

export function isDatabaseConfigured() {
  return Boolean(process.env.DB_USER && process.env.DB_PASSWORD && (process.env.DB_NAME || 'digiblend_db'));
}

export async function query<T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]>(
  sql: string,
  params: Array<string | number | boolean | null> = [],
): Promise<QueryResult<T>> {
  try {
    const [results] = await getPool().execute<T>(sql, params);
    return results;
  } catch (error) {
    console.error('[Database Error] Query execution failed.', {
      sql,
      error,
    });
    throw error;
  }
}

export async function checkDatabaseConnection() {
  const rows = await query<RowDataPacket[]>('SELECT 1 AS ok');
  return rows[0]?.ok === 1;
}

export default getPool;
