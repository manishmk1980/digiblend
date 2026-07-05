import type { AgentName, AgentState } from '../state';
import { isPrismaConfigured, prisma } from '@/src/server/prisma';

function optionalBigInt(value?: string) {
  if (!value) return undefined;
  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
}

export async function createAgentRun(state: AgentState) {
  if (!isPrismaConfigured()) {
    return null;
  }

  const run = await prisma.agentRun.create({
    data: {
      auditId: optionalBigInt(state.auditId),
      userEmail: state.userEmail,
      toolSlug: state.toolSlug,
      workflowType: state.workflowType,
      status: 'Queued',
      userGoal: state.userGoal,
      statePayload: state as any,
    },
    select: {
      id: true,
    },
  });

  return run.id.toString();
}

export async function logAgentMessage(
  runId: string | null,
  agentName: AgentName,
  role: 'system' | 'user' | 'assistant' | 'tool',
  content: string,
  metadata?: Record<string, unknown>,
) {
  const id = optionalBigInt(runId || undefined);
  if (!isPrismaConfigured() || !id) {
    return;
  }

  await prisma.agentMessage.create({
    data: {
      runId: id,
      agentName,
      role,
      content,
      metadata: metadata as any,
    },
  });
}

export async function completeAgentRun(runId: string | null, state: AgentState) {
  const id = optionalBigInt(runId || undefined);
  if (!isPrismaConfigured() || !id) {
    return;
  }

  await prisma.agentRun.update({
    where: { id },
    data: {
      status: 'Completed',
      finalResponse: { finalResponse: state.finalResponse },
      reviewScore: state.reviewScore,
      statePayload: state as any,
      completedAt: new Date(),
    },
  });
}

export async function failAgentRun(runId: string | null, errorMessage: string) {
  const id = optionalBigInt(runId || undefined);
  if (!isPrismaConfigured() || !id) {
    return;
  }

  await prisma.agentRun.update({
    where: { id },
    data: {
      status: 'Failed',
      errorMessage,
      completedAt: new Date(),
    },
  });
}
