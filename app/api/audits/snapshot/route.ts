import { NextResponse } from 'next/server';
import { createAuditRecord } from '@/src/server/audits';

export const runtime = 'nodejs';

type AuditSnapshotQueueRequest = {
  company_url?: string;
  websiteUrl?: string;
  operational_focus?: string;
  operationalFocus?: string;
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidCompanyUrl(value: string) {
  try {
    const url = new URL(normalizeUrl(value));
    return Boolean(url.hostname.includes('.') && url.hostname.length > 3);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as AuditSnapshotQueueRequest;
  const companyUrl = body.company_url || body.websiteUrl || '';
  const operationalFocus = body.operational_focus || body.operationalFocus || '';

  if (!companyUrl || !operationalFocus) {
    return NextResponse.json({ error: 'Missing company URL or operational focus area.' }, { status: 400 });
  }

  if (!isValidCompanyUrl(companyUrl)) {
    return NextResponse.json({ error: 'A valid company website URL is required.' }, { status: 400 });
  }

  try {
    const insertedAuditId = await createAuditRecord({
      companyUrl,
      operationalFocus,
      status: 'Processing',
    });

    if (!insertedAuditId) {
      return NextResponse.json({ error: 'Database environment is not configured.' }, { status: 503 });
    }

    return NextResponse.json(
      {
        success: true,
        auditId: insertedAuditId,
        status: 'Processing',
        message: 'Audit job safely queued into pipeline.',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Audit Queue Error]', error);
    return NextResponse.json({ error: 'Failed to initialize system audit pipeline.' }, { status: 500 });
  }
}
