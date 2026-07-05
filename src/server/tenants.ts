import type { Prisma } from '@prisma/client';
import { isPrismaConfigured, prisma } from './prisma';

export type CustomerWorkspaceInput = {
  email: string;
  referredBy?: string | null;
  source?: 'signup' | 'signin';
};

function getTenantNameFromEmail(email: string) {
  const domain = email.split('@')[1]?.toLowerCase() || 'personal';
  const label = domain.split('.')[0] || 'customer';
  return label
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function ensureTenantForEmail(email: string) {
  const existingUser = await prisma.customerUser.findUnique({
    where: { email },
    select: { tenantId: true },
  });

  if (existingUser) {
    return existingUser.tenantId;
  }

  const domain = email.split('@')[1]?.toLowerCase() || null;
  const tenant = await prisma.tenant.create({
    data: {
      name: getTenantNameFromEmail(email),
      primaryDomain: domain,
    },
    select: { id: true },
  });

  return tenant.id;
}

export async function upsertCustomerWorkspace(input: CustomerWorkspaceInput) {
  if (!isPrismaConfigured()) return null;

  const email = input.email.trim().toLowerCase();
  const tenantId = await ensureTenantForEmail(email);

  const user = await prisma.customerUser.upsert({
    where: { email },
    update: {
      lastActive: new Date(),
      referredBy: input.referredBy || undefined,
    },
    create: {
      tenantId,
      email,
      referredBy: input.referredBy || null,
    },
    select: {
      id: true,
      tenantId: true,
      email: true,
    },
  });

  await prisma.adminAction.create({
    data: {
      tenantId: user.tenantId,
      targetUserId: user.id,
      adminEmail: 'system',
      action: input.source === 'signin' ? 'CUSTOMER_SIGNIN' : 'CUSTOMER_WORKSPACE_CREATED',
      notes: `Customer ${input.source || 'signup'} synchronized from frontend workspace flow.`,
      metadata: { source: input.source || 'signup' },
    },
  });

  return {
    userId: user.id.toString(),
    tenantId: user.tenantId.toString(),
    email: user.email,
  };
}

export async function recordCustomerSubscription(input: {
  email: string;
  plan: 'FREE' | 'PRO';
  providerRef?: string;
  amountCents?: number;
}) {
  if (!isPrismaConfigured()) return null;

  const workspace = await upsertCustomerWorkspace({ email: input.email, source: 'signin' });
  if (!workspace) return null;

  const subscription = await prisma.customerSubscription.create({
    data: {
      tenantId: BigInt(workspace.tenantId),
      plan: input.plan === 'PRO' ? 'Pro' : 'Free',
      status: 'Active',
      paymentProvider: 'razorpay_simulated',
      providerRef: input.providerRef,
      amountCents: input.amountCents,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    select: { id: true },
  });

  return subscription.id.toString();
}

export async function recordUsageEvent(input: {
  email: string;
  toolSlug: string;
  toolName?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!isPrismaConfigured()) return null;

  const workspace = await upsertCustomerWorkspace({ email: input.email, source: 'signin' });
  if (!workspace) return null;

  const usage = await prisma.usageEvent.create({
    data: {
      tenantId: BigInt(workspace.tenantId),
      userId: BigInt(workspace.userId),
      toolSlug: input.toolSlug,
      toolName: input.toolName,
      metadata: input.metadata,
    },
    select: { id: true },
  });

  return usage.id.toString();
}

export async function recordAdminAction(input: {
  adminEmail: string;
  targetEmail?: string;
  action: string;
  notes?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!isPrismaConfigured()) return null;

  const target = input.targetEmail
    ? await prisma.customerUser.findUnique({
        where: { email: input.targetEmail.toLowerCase() },
        select: { id: true, tenantId: true },
      })
    : null;

  const action = await prisma.adminAction.create({
    data: {
      tenantId: target?.tenantId,
      targetUserId: target?.id,
      adminEmail: input.adminEmail,
      action: input.action,
      notes: input.notes,
      metadata: input.metadata,
    },
    select: { id: true },
  });

  return action.id.toString();
}
