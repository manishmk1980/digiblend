import { createAgentRun, completeAgentRun, failAgentRun, logAgentMessage } from './memory/conversation_store';
import { initialAgentState, type AgentState } from './state';

export type RunAgentPipelineInput = Pick<AgentState, 'userGoal' | 'workflowType' | 'toolSlug'> &
  Partial<Pick<AgentState, 'userEmail' | 'auditId' | 'knowledgeBaseContext' | 'evidenceContext'>>;

export async function runAgentPipeline(input: RunAgentPipelineInput) {
  const state: AgentState = {
    ...initialAgentState,
    ...input,
  };

  const runId = await createAgentRun(state);

  try {
    await logAgentMessage(runId, 'Orchestrator', 'system', `Queued ${state.workflowType} workflow for ${state.toolSlug}.`);

    const result: AgentState = {
      ...state,
      finalResponse:
        'Agent pipeline scaffold is ready. LangGraph node execution will be enabled after prompts, tools, and reviewer thresholds are tuned.',
      reviewPassed: true,
      reviewScore: 8,
    };

    await completeAgentRun(runId, result);
    return {
      runId,
      state: result,
    };
  } catch (error) {
    await failAgentRun(runId, error instanceof Error ? error.message : 'Unknown agent pipeline error.');
    throw error;
  }
}
