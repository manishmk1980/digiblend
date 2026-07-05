import { NextResponse } from 'next/server';
import { isPrismaConfigured, prisma } from '@/src/server/prisma';

export const runtime = 'nodejs';

export async function GET() {
  if (!isPrismaConfigured()) {
    return NextResponse.json(
      {
        status: 'not_configured',
        message: 'DATABASE_URL is not configured.',
      },
      { status: 503 },
    );
  }

  try {
    const result = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;
    const ok = result[0]?.ok === 1;
    return NextResponse.json({
      status: ok ? 'healthy' : 'unhealthy',
      database: process.env.DB_NAME || 'digiblend_db',
      dataLayer: 'prisma',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: process.env.DB_NAME || 'digiblend_db',
        dataLayer: 'prisma',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
