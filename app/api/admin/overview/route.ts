import { NextResponse } from 'next/server';
import { isPrismaConfigured, prisma } from '@/src/server/prisma';

export const runtime = 'nodejs';

export async function GET() {
  if (!isPrismaConfigured()) {
    return NextResponse.json({ status: 'not_configured' }, { status: 503 });
  }

  try {
    const [tenants, users, subscriptions, usageEvents, adminActions, audits] = await Promise.all([
      prisma.tenant.count(),
      prisma.customerUser.count(),
      prisma.customerSubscription.count({ where: { status: 'Active' } }),
      prisma.usageEvent.count(),
      prisma.adminAction.count(),
      prisma.audit.count(),
    ]);

    return NextResponse.json({
      status: 'healthy',
      tenants,
      users,
      activeSubscriptions: subscriptions,
      usageEvents,
      adminActions,
      audits,
    });
  } catch (error) {
    console.error('[Admin Overview Error]', error);
    return NextResponse.json({ error: 'Failed to load admin overview.' }, { status: 500 });
  }
}
