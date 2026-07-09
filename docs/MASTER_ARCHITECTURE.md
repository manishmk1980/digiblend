# DigiBlend Master Architecture

Last reviewed: 2026-07-05

This document captures the current project architecture and the production roadmap from the July 2026 master plan. It is intentionally aligned with the current MVP codebase rather than describing a separate greenfield app.

## Current Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS 4
- MySQL with Prisma
- OpenRouter-first AI routes with free-model discovery
- LangGraph package installed with a scaffolded agent state/memory layer
- Simulated Razorpay-style checkout for MVP validation
- Local/session customer state mirrored into backend sync APIs when `DATABASE_URL` is configured
- Clerk middleware scaffold is present and activates when Clerk env keys are configured

## Current Business Flow

1. Public visitor lands on the AI Engineering Audit funnel.
2. Visitor submits a website URL and operational focus.
3. `/api/audit/snapshot` generates an evidence-informed public snapshot and creates an audit record when Prisma is configured.
4. Preview dashboard shows visible gaps and locked paid audit sections.
5. Simulated Engineering Audit checkout moves the visitor into onboarding.
6. Customer auth, usage, subscription, and admin override events are mirrored through backend API routes:
   - `/api/customers/session`
   - `/api/subscriptions/pro`
   - `/api/usage/events`
   - `/api/admin/actions`
7. Super admin can review frontend and backend allocation status from `/admin`.

## Data Layer

Prisma is the canonical application data layer. The raw MySQL pool remains available for health checks and emergency isolated queries only.

Implemented tables:

- `audits`
- `audit_logs`
- `audit_onboarding`
- `agent_runs`
- `agent_messages`
- `agent_memory`
- `implementation_sync_requests`
- `tenants`
- `customer_users`
- `customer_subscriptions`
- `usage_events`
- `admin_actions`
- `users`
- `subscriptions`
- `usage_logs`
- `credit_packs`
- `credit_transactions`
- `knowledge_documents`

Production migrations must use:

```bash
npx prisma migrate deploy
```

Do not use `prisma migrate dev` on the VPS.

## AI Provider Policy

The active MVP provider is OpenRouter with `OPENROUTER_MODEL=auto:free`.

The master plan includes Claude/Anthropic as a future production provider for agent-heavy workflows. `ANTHROPIC_API_KEY` is present in `.env.example`, but current production behavior should not be switched until prompts, reviewer thresholds, and cost controls are tested.

## Planned Production Integrations

- Clerk sign-in/sign-up UI replacement for the current demo auth panels.
- Razorpay subscriptions, one-time credit packs, and signed webhooks.
- Firecrawl as primary crawler with Puppeteer stealth fallback.
- Full LangGraph orchestration for content-heavy and deep-audit workflows.
- Knowledge Base document upload and scoped retrieval.
- Credit packs and referral bonuses.
- Dedicated SEO pages for every tool.

## Deployment Notes

- Shared VPS means every Nginx server block must have an explicit `server_name`.
- Run `nginx -t` before every reload.
- Use a dedicated PM2 process name for this app.
- Keep `.env.local` out of git.
- Confirm `DATABASE_URL` points to `digiblend_db` before enabling backend persistence.
