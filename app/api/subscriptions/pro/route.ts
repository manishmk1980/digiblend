import { NextResponse } from 'next/server';
import { recordCustomerSubscription } from '@/src/server/tenants';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid customer email is required.' }, { status: 400 });
  }

  try {
    const subscriptionId = await recordCustomerSubscription({
      email,
      plan: 'PRO',
      providerRef: body.providerRef,
      amountCents: Number(body.amountCents || 49900),
    });

    return NextResponse.json({
      success: true,
      subscriptionId,
      persisted: Boolean(subscriptionId),
    });
  } catch (error) {
    console.error('[Subscription Sync Error]', error);
    return NextResponse.json({ error: 'Failed to synchronize subscription.' }, { status: 500 });
  }
}
