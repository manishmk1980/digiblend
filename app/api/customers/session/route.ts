import { NextResponse } from 'next/server';
import { upsertCustomerWorkspace } from '@/src/server/tenants';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid customer email is required.' }, { status: 400 });
  }

  try {
    const workspace = await upsertCustomerWorkspace({
      email,
      referredBy: body.referredBy || null,
      source: body.source === 'signin' ? 'signin' : 'signup',
    });

    return NextResponse.json({
      success: true,
      workspace,
      persisted: Boolean(workspace),
    });
  } catch (error) {
    console.error('[Customer Session Sync Error]', error);
    return NextResponse.json({ error: 'Failed to synchronize customer workspace.' }, { status: 500 });
  }
}
