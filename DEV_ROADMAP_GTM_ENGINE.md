# DigiBlend AI GTM Automation Engine - Development Roadmap

Prepared: 03 July 2026

Source FRD: `G:\manish\digiblend.in\ai_gtm_automation_engine_frd_handover.md`

## 1. Current Application Baseline

The current application is a Vite + React + TypeScript frontend with a small Express backend in `server.ts`.

Current strengths:

- React/Vite/TypeScript stack already matches the FRD recommended frontend.
- Express backend already exists and can become the API layer.
- Gemini integration already exists through `@google/genai`.
- There is already a customer-facing landing page, AI tools workspace, pricing/account flow, and basic admin area.
- Admin action logs, users, subscriptions, usage logs, and auth-like state already exist as frontend/localStorage models.
- Existing tools already overlap with the FRD content/outreach surface: meta tags, social bios, cold email, ad copy, naming, readability.

Current limitations:

- Most data is stored in browser `localStorage`, so it is not suitable for real GTM workflows.
- There is no real database, migrations, or backend data model.
- There is no authenticated backend session or server-side RBAC.
- There is no product onboarding module, ICP module, lead batch module, workflow engine, approval center, CRM sync, or queue.
- There is only one generic AI endpoint: `POST /api/generate`.
- Prompts are hardcoded in `server.ts` instead of versioned.
- There is no audit table for AI inputs/outputs, approvals, retries, or workflow transitions.
- No external workflow automation platform should be used; orchestration must be built inside the app.

## 2. Stack Alignment Decision

Recommended path: keep the existing stack and evolve it.

Use:

- Frontend: React + Vite + TypeScript
- Backend API: Node.js + Express, starting from `server.ts`
- AI provider: Gemini first, with an adapter interface so OpenAI/Anthropic can be added later
- Database: PostgreSQL for production path
- MVP persistence shortcut: SQLite or PostgreSQL local dev, but schema should be Postgres-compatible
- Queue: database-backed queue for MVP, Redis/BullMQ later only when needed
- File storage: local uploads for MVP, S3-compatible storage later
- Vector/knowledge search: structured DB records first, pgvector later
- CRM: manual CSV export first, HubSpot adapter later
- Outreach: draft/export/manual approval first, provider integration later

Avoid:

- n8n, Make, Zapier, Pipedream, or similar workflow builders
- fully autonomous sending in MVP
- adding multi-tenant billing before internal GTM workflows are proven

## 3. Product Direction

The current DigiBlend app should first become an internal GTM cockpit for one controlled campaign.

Recommended first product:

- Primewayz UK

Recommended first campaign:

- AI content fatigue / outcome-driven content for UK SMEs

Initial user promise:

- Add a product.
- Generate and approve a product profile.
- Generate and approve ICP/personas.
- Import leads by CSV.
- Score and review leads.
- Generate outreach drafts.
- Approve messages.
- Export or sync approved records.
- See logs for every important step.

## 4. Phase 0 - Stabilize Existing App

Goal: make the current app easier to extend without breaking the live demo.

Tasks:

- Split the large `src/App.tsx` into feature components: navigation, tools workspace, pricing, account, admin dashboard.
- Move prompt definitions out of `server.ts` into a structured prompt registry.
- Add shared API response types.
- Add a backend route structure under `src/server` or `server/`.
- Add `.env.local` documentation for `GEMINI_API_KEY`.
- Add a simple error/log wrapper around AI calls.
- Keep current AI tools working during refactor.

Acceptance:

- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- Existing tool generation still works with a valid Gemini key.
- Admin/customer UI still opens locally.

Roadblocks:

- `App.tsx` is currently very large, so feature work may be slow until it is split.
- Some current auth/admin behavior is demo-only and should not be mistaken for real security.

## 5. Phase 1 - Internal MVP Data Foundation

Goal: replace local-only GTM state with persistent backend records.

Build backend models:

- Users
- Products
- Product knowledge items
- Product profile versions
- ICPs
- Personas
- Lead batches
- Companies
- Contacts
- Lead scores
- Messages/drafts
- Approvals
- Audit logs
- Prompt versions

Build API groups:

- `/api/products`
- `/api/products/:id/knowledge`
- `/api/icps`
- `/api/personas`
- `/api/leads/batches`
- `/api/leads`
- `/api/approvals`
- `/api/audit-logs`
- `/api/prompts`

Frontend:

- Add GTM navigation beside or inside the existing Admin area.
- Add Product Setup screen.
- Add Product Profile Review screen.
- Add ICP & Persona screen.
- Add Lead Batch screen.
- Add Approval Center shell.
- Add Audit Logs screen.

MVP shortcut:

- Manual product notes and CSV lead import come before website crawling and third-party enrichment.

Acceptance:

- A user can create one product.
- A product profile can be generated and stored.
- Product profile can move from Draft to Review Pending to Approved.
- ICP/persona generation uses approved product data.
- All AI calls are logged with prompt version, input, output, user, and timestamp.

Roadblocks:

- Final database choice must be locked before serious backend work.
- Authentication design must be decided before roles can be trusted.

## 6. Phase 2 - Lead Import, Scoring, and Message Draft MVP

Goal: make the first controlled GTM workflow usable without heavy automation.

Build:

- CSV import parser.
- Duplicate detection by company domain, company name, email, LinkedIn URL.
- Lead batch status tracking.
- Manual/basic enrichment fields.
- Lead scoring prompt and score schema.
- Message generation prompt and structured output.
- Message approval states.
- Campaign-ready export.

Workflow:

```text
Product Approved
-> ICP Approved
-> CSV Lead Import
-> Duplicate Check
-> Manual/Basic Enrichment
-> AI Lead Scoring
-> Human Review
-> AI Message Draft
-> Message Approval
-> Export Approved Leads/Messages
```

Acceptance:

- Import a CSV lead batch.
- See valid, duplicate, and failed record counts.
- Score at least 100 leads for one product/ICP.
- Show score explanations.
- Generate 50-100 outreach drafts.
- Approve/reject/request revision on messages.
- Export approved leads/messages as CSV.

Roadblocks:

- CSV formats will vary; define a first supported template.
- Scoring quality depends on product profile and ICP quality.
- Without real enrichment providers, MVP scoring must clearly mark missing data.

## 7. Phase 3 - Custom Workflow Orchestration MVP

Goal: introduce controlled internal automation without external workflow tools.

Build:

- Workflow definitions.
- Workflow runs.
- Workflow steps.
- Agent tasks.
- Database-backed queue.
- Retry policy.
- State transition guard.
- Worker process.
- Workflow monitor UI.

Initial workflows:

- Product profile generation workflow.
- ICP generation workflow.
- Lead scoring workflow.
- Message drafting workflow.

Required states:

- Queued
- Running
- Waiting For Approval
- Completed
- Failed
- Cancelled
- Retrying

Acceptance:

- Long AI tasks run asynchronously.
- Failed steps can be retried.
- Invalid state transitions are blocked.
- Every workflow step writes an audit log.
- Approval gates pause workflows until a user approves/rejects.

Roadblocks:

- This should not be hand-rolled casually inside React state.
- Database schema must support resumable workflows before background automation is added.
- Workers need a clear deployment/runtime strategy.

## 8. Phase 4 - Product Intelligence and Website Crawl

Goal: reduce manual product setup by analyzing real websites and documents.

Build:

- Website crawler adapter.
- Content extraction for title, meta, headings, body text, CTAs, pricing, FAQ, internal links.
- Product knowledge versioning.
- Product profile generator.
- Competitor URL notes.
- Knowledge approval and locking.

Acceptance:

- User enters a product URL.
- Backend extracts useful content.
- Product Intelligence Agent generates structured profile.
- User approves/rejects profile.
- Approved profile is locked for active workflows.

Roadblocks:

- Crawling can fail due to bot protection, JS-heavy sites, rate limits, and legal/robots constraints.
- Website extraction quality varies widely.
- File upload parsing may require additional libraries.

## 9. Phase 5 - Integrations and Compliance

Goal: connect approved GTM data to external systems while keeping human control.

Build adapters:

- HubSpot CRM adapter.
- Manual CSV export adapter.
- Email outreach provider placeholder.
- Suppression list.
- Unsubscribe/blocked status.
- Integration logs.
- Compliance pre-send checks.

Acceptance:

- Approved leads can be exported or synced.
- Suppressed contacts are blocked.
- CRM sync errors are visible and retryable.
- Integration credentials are never exposed after saving.

Roadblocks:

- HubSpot scopes and auth flow must be decided.
- Outreach provider selection is still open: Instantly, Smartlead, SMTP, or manual.
- Compliance rules differ by geography and must be confirmed before sending.

## 10. Phase 6 - SEO and Content Engine

Goal: expand from sales GTM into organic/content GTM using the same product knowledge.

Build:

- Keyword cluster generation.
- Article brief generation.
- LinkedIn post idea generation.
- Content approval flow.
- Content report.

Acceptance:

- Generate 10 keyword clusters.
- Generate 10 article briefs.
- Generate 10 LinkedIn drafts.
- Approve/reject content drafts.
- Trace every content output to product knowledge and prompt version.

Roadblocks:

- Search Console integration is not needed for first content MVP.
- Auto-publishing should stay out of scope until approval flow is mature.

## 11. Phase 7 - Multi-Product Console

Goal: support multiple Primewayz products with reusable GTM workflows.

Build:

- Product-wise dashboards.
- Product-wise knowledge base.
- Reusable ICP templates.
- Product-wise campaign performance.
- Prompt version management UI.
- Learning/recommendation module.

Acceptance:

- At least 3 products onboarded.
- Campaigns remain separated by product.
- Shared agents and workflows are reused without duplicate code.

Roadblocks:

- Data model must avoid future multi-tenant rewrites.
- Prompt versioning must be in place before multiple products scale.

## 12. What Is Needed Next

Decisions needed:

- Database: PostgreSQL now, or SQLite MVP with Postgres-compatible schema?
- Auth: existing simple app auth, custom email/password, or external provider?
- First CRM: HubSpot, CSV-only MVP, or both?
- First outreach path: manual send/export, Instantly, Smartlead, or SMTP?
- Deployment: current server, Docker, or cloud VM?
- First CSV lead template fields.
- Which user roles are real in MVP: Admin and GTM Manager only, or include Sales/Content from day one?

Technical additions needed:

- Database client/ORM.
- Migration system.
- Backend folder/module structure.
- Upload handling for CSV/files.
- Prompt registry with version IDs.
- AI adapter interface.
- Audit logging middleware/service.
- Approval state machine utility.
- Queue tables and worker runner.
- Basic test setup.

Operational additions needed:

- Real Gemini API key management.
- Seed data for Primewayz UK.
- Sample lead CSV.
- Admin test account.
- Clear local dev command and environment setup.
- Backup/export plan for database.

## 13. Immediate Next Sprint Recommendation

Sprint objective: build the first real GTM skeleton while preserving the current DigiBlend tools.

Recommended sprint tasks:

1. Refactor backend routes from `server.ts` into route/service modules.
2. Add database setup and migrations.
3. Add Product, ProductKnowledge, ProductProfileVersion, Approval, and AuditLog models.
4. Add product setup API and UI.
5. Add product profile generation using the existing Gemini backend.
6. Add product profile approval states.
7. Add prompt version records for product profile generation.
8. Add audit log screen in admin.

Sprint success:

- Create Primewayz UK product.
- Generate a product profile from notes/URL text.
- Review and approve the profile.
- View the AI input/output and approval event in audit logs.
- Existing DigiBlend AI tools continue to work.

## 14. Key Roadblocks to Watch

- Current frontend is concentrated in one very large `App.tsx`.
- No database exists yet, but almost every FRD requirement depends on persistence.
- Real auth/RBAC is currently absent.
- AI prompts are hardcoded and not versioned.
- The system needs explicit state machines before automation, otherwise workflows will become hidden script logic.
- Queue/worker design should come after database basics, not before.
- Compliance and suppression rules must be treated as core workflow checks, not UI-only labels.
- External integrations should be adapter-based from the beginning to avoid vendor lock-in.
- Website crawling and enrichment APIs can become time sinks; defer them until manual product setup and CSV lead flow work.

## 15. Build Principle

Build what we already have into a controlled internal GTM MVP first. Do not jump straight to autonomous agents, external enrichment, or multi-product automation.

The correct order is:

```text
Persistent records
-> Product setup
-> Product profile approval
-> ICP/persona approval
-> CSV leads
-> Scoring
-> Message drafts
-> Human approval
-> Export/sync
-> Workflow automation
-> Advanced integrations
```

Agents should assist bounded tasks. The application must own state, approval, compliance, logs, and retries.
