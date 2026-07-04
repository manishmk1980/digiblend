import type { ResultSetHeader } from 'mysql2/promise';
import { isDatabaseConfigured, query } from './db';

export type AuditStatus = 'Processing' | 'Waiting For Approval' | 'Approved' | 'Published' | 'Failed';

export type CreateAuditInput = {
  companyUrl: string;
  operationalFocus: string;
  status?: AuditStatus;
  snapshotPayload?: unknown;
  readinessScore?: number | null;
};

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
  if (!isDatabaseConfigured()) {
    return null;
  }

  const normalizedCompanyUrl = normalizeUrl(input.companyUrl);
  const inferredCompanyName = inferCompanyName(normalizedCompanyUrl);
  const snapshotPayload = input.snapshotPayload ? JSON.stringify(input.snapshotPayload) : null;
  const readinessScore = typeof input.readinessScore === 'number' ? input.readinessScore : null;

  const auditInsertResult = await query<ResultSetHeader>(
    `INSERT INTO audits (company_name, company_url, operational_focus, status, readiness_score, snapshot_payload)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      inferredCompanyName,
      normalizedCompanyUrl,
      input.operationalFocus,
      input.status || 'Processing',
      readinessScore,
      snapshotPayload,
    ],
  );

  const insertedAuditId = auditInsertResult.insertId;

  await query<ResultSetHeader>(
    `INSERT INTO audit_logs (audit_id, action_performed, raw_input_payload)
     VALUES (?, 'INITIALIZE_SNAPSHOT_SCAN', ?)`,
    [
      insertedAuditId,
      JSON.stringify({
        company_url: normalizedCompanyUrl,
        operational_focus: input.operationalFocus,
        readiness_score: readinessScore,
      }),
    ],
  );

  return insertedAuditId;
}
