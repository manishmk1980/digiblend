import { NextResponse } from 'next/server';
import { checkDatabaseConnection, isDatabaseConfigured } from '@/src/server/db';

export const runtime = 'nodejs';

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        status: 'not_configured',
        message: 'Database environment variables are not fully configured.',
      },
      { status: 503 },
    );
  }

  try {
    const ok = await checkDatabaseConnection();
    return NextResponse.json({
      status: ok ? 'healthy' : 'unhealthy',
      database: process.env.DB_NAME || 'digiblend_db',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: process.env.DB_NAME || 'digiblend_db',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
