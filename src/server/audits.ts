import type { Prisma } from '@prisma/client';
import { isPrismaConfigured, prisma } from './prisma';

export type AuditStatus = 'Processing' | 'Waiting For Approval' | 'Approved' | 'Published' | 'Failed';

export type CreateAuditInput = {
  companyUrl: string;
  operationalFocus: string;
  status?: AuditStatus;
  snapshotPayload?: unknown;
  readinessScore?: number | null;
};

const auditStatusMap = {
  Processing: 'Processing',
  'Waiting For Approval': 'Waiting_For_Approval',
  Approved: 'Approved',
  Published: 'Published',
  Failed: 'Failed',
} as const;

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function inferCompanyName(companyUrl: string) {
  try {
    const host = new URL(normalizeUrl(companyUrl)).hostname.replace(/^www\./, '');
    const firstSegment = host.split('.')[0] || host;
    return firstSegment
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  } catch {
    return companyUrl.replace(/^(https?:\/\/)?(www\.)?/i, '').split('.')[0] || 'Unknown Company';
  }
}

export async function createAuditRecord(input: CreateAuditInput) {
  if (!isPrismaConfigured()) {
    return null;
  }

  const normalizedCompanyUrl = normalizeUrl(input.companyUrl);
  const inferredCompanyName = inferCompanyName(normalizedCompanyUrl);
  const snapshotPayload = input.snapshotPayload ? (input.snapshotPayload as Prisma.InputJsonValue) : undefined;
  const readinessScore = typeof input.readinessScore === 'number' ? input.readinessScore : null;

  const audit = await prisma.audit.create({
    data: {
      companyName: inferredCompanyName,
      companyUrl: normalizedCompanyUrl,
      operationalFocus: input.operationalFocus,
      status: auditStatusMap[input.status || 'Processing'],
      readinessScore,
      snapshotPayload,
      logs: {
        create: {
          actionPerformed: 'INITIALIZE_SNAPSHOT_SCAN',
          rawInputPayload: {
            company_url: normalizedCompanyUrl,
            operational_focus: input.operationalFocus,
            readiness_score: readinessScore,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  return audit.id.toString();
}
