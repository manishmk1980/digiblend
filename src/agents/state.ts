export type AgentWorkflowType =
  | 'AuditSnapshot'
  | 'DeepAudit'
  | 'CopyGeneration'
  | 'SupportChat'
  | 'ImplementationPlan';

export type AgentName = 'Orchestrator' | 'Planner' | 'Researcher' | 'Writer' | 'Reviewer' | 'Support' | 'Admin';

export type AgentState = {
  userGoal: string;
  workflowType: AgentWorkflowType;
  toolSlug: string;
  userEmail?: string;
  auditId?: string;
  knowledgeBaseContext: string;
  evidenceContext: string;
  planSteps: string[];
  researchNotes: string;
  draftContent: string;
  contentHistory: string[];
  reviewScore: number;
  reviewFeedback: string;
  reviewPassed: boolean;
  retryCount: number;
  maxRetries: number;
  agentSequence: AgentName[];
  finalResponse: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    agentName?: AgentName;
  }>;
  error?: string;
};

export const initialAgentState: Pick<
  AgentState,
  | 'knowledgeBaseContext'
  | 'evidenceContext'
  | 'planSteps'
  | 'researchNotes'
  | 'draftContent'
  | 'contentHistory'
  | 'reviewScore'
  | 'reviewFeedback'
  | 'reviewPassed'
  | 'retryCount'
  | 'maxRetries'
  | 'agentSequence'
  | 'finalResponse'
  | 'messages'
> = {
  knowledgeBaseContext: '',
  evidenceContext: '',
  planSteps: [],
  researchNotes: '',
  draftContent: '',
  contentHistory: [],
  reviewScore: 0,
  reviewFeedback: '',
  reviewPassed: false,
  retryCount: 0,
  maxRetries: 3,
  agentSequence: ['Orchestrator', 'Planner', 'Researcher', 'Writer', 'Reviewer'],
  finalResponse: '',
  messages: [],
};
