# DigiBlend Multi-Agent Roadmap

## Business Alignment

DigiBlend is not only an AI copywriting toolkit. The commercial path is:

1. Free public AI audit snapshot.
2. Paid engineering audit purchase.
3. Secure client onboarding with notes and sample data.
4. Admin/engineering review and approval.
5. Client-facing audit delivery.
6. Implementation project sync and retainer conversion.

The multi-agent architecture should support that funnel first, then expand into content tools.

## Agent Roles

| Agent | Business responsibility | First workflows |
| --- | --- | --- |
| Orchestrator | Chooses the workflow and state transitions. | Audit snapshot, deep audit, support chat |
| Planner | Breaks audit/client goals into concrete checks and sections. | Deep audit, implementation plan |
| Researcher | Collects public page evidence, KB context, and later search/crawl evidence. | Audit snapshot, deep audit |
| Writer | Produces client-facing findings, copy assets, or report sections. | Audit report, copy tools |
| Reviewer | Scores accuracy, confidence, compliance, and conversion usefulness. | Snapshot findings, report QA |
| Support | Handles chat answers with inactivity follow-up and appointment offer. | Support chat |
| Admin | Summarizes pending approval items for internal review. | Admin center |

## Data Layer

Prisma is the application data layer. The raw `mysql2` pool remains only for simple connectivity checks or emergency SQL.

Core tables:

- `audits`
- `audit_logs`
- `audit_onboarding`
- `agent_runs`
- `agent_messages`
- `agent_memory`
- `implementation_sync_requests`

## Implementation Phases

### Phase 1: Data Foundation

- Add Prisma schema and migration for audit and agent tables.
- Use Prisma for audit creation and initial logs.
- Add `/api/health/db` using Prisma.
- Keep existing production route behavior stable.

### Phase 2: Agent Run Logging

- Add lightweight `src/agents` scaffold.
- Persist agent run state, messages, review score, and final response.
- Do not switch critical user flows to LangGraph until QA prompts are stable.

### Phase 3: Audit Snapshot Graph

- Orchestrator chooses `AuditSnapshot`.
- Researcher fetches public homepage evidence.
- Writer creates structured findings.
- Reviewer blocks unsupported claims such as “no chat” when chat evidence exists.
- Store every run in `agent_runs` and `agent_messages`.

### Phase 4: Paid Deep Audit Graph

- Planner creates a report outline from onboarding notes and sample data.
- Researcher summarizes uploaded data/profile evidence.
- Writer builds the detailed audit.
- Reviewer scores for specificity, confidence, and implementation usefulness.
- Admin approves/publishes.

### Phase 5: Revenue Workflows

- Generate implementation timeline from approved audit.
- Create `implementation_sync_requests`.
- Add admin dashboard filters for high-intent clients and pending syncs.

## Guardrails

- Every finding must carry evidence, why it matters, how to fix, and confidence.
- Agents must separate observed evidence from assumptions.
- Snapshot output is a teaser, not a verified technical audit.
- Deep audit output requires client-provided data or admin verification.
- Reviewer must fail claims that contradict evidence.
