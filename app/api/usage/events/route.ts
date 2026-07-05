import { NextResponse } from 'next/server';
import { recordUsageEvent } from '@/src/server/tenants';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const toolSlug = String(body.toolSlug || '').trim();

  if (!email || !email.includes('@') || !toolSlug) {
    return NextResponse.json({ error: 'Customer email and tool slug are required.' }, { status: 400 });
  }

  try {
    const usageId = await recordUsageEvent({
      email,
      toolSlug,
      toolName: body.toolName,
      metadata: body.metadata,
    });

    return NextResponse.json({
      success: true,
      usageId,
      persisted: Boolean(usageId),
    });
  } catch (error) {
    console.error('[Usage Sync Error]', error);
    return NextResponse.json({ error: 'Failed to synchronize usage event.' }, { status: 500 });
  }
}
