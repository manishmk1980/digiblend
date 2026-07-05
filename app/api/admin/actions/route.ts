import { NextResponse } from 'next/server';
import { recordAdminAction } from '@/src/server/tenants';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const adminEmail = String(body.adminEmail || '').trim().toLowerCase();
  const action = String(body.action || '').trim();

  if (!adminEmail || !adminEmail.includes('@') || !action) {
    return NextResponse.json({ error: 'Admin email and action are required.' }, { status: 400 });
  }

  try {
    const actionId = await recordAdminAction({
      adminEmail,
      targetEmail: body.targetEmail,
      action,
      notes: body.notes,
      metadata: body.metadata,
    });

    return NextResponse.json({
      success: true,
      actionId,
      persisted: Boolean(actionId),
    });
  } catch (error) {
    console.error('[Admin Action Sync Error]', error);
    return NextResponse.json({ error: 'Failed to synchronize admin action.' }, { status: 500 });
  }
}
