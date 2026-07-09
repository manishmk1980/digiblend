# DigiBlend Implementation Status

Last reviewed: 2026-07-05

## Implemented

- Next.js migration from Vite.
- Public AI Engineering Audit funnel demo MVP.
- Evidence-aware `/api/audit/snapshot` route.
- OpenRouter free-model discovery for AI routes.
- Floating support chatbot with inactivity handling in UI and no repeated closing line in every bot response.
- Prisma schema and migrations for audit, agent, tenant, customer, subscription, usage, and admin action records.
- Master-plan SaaS schema prepared for Clerk users, subscriptions, usage logs, credit transactions, credit packs, and knowledge documents.
- Clerk middleware added with a no-keys local bypass and admin role guard for configured environments.
- Frontend-to-backend sync for signup/signin, Pro subscription simulation, usage events, and admin overrides.
- Super admin route and reduced admin header.
- Backend allocation status panel in admin dashboard.
- `robots.ts`, `sitemap.ts`, and catch-all tool route.

## Ready For Server Configuration

- MySQL `digiblend_db` and `digiblend_user`.
- `DATABASE_URL` in production `.env.local`.
- `npx prisma migrate deploy`.
- PM2 process and Nginx reverse proxy.

## Not Yet Implemented

- Clerk UI pages and full app-session replacement for the demo auth screens.
- Real Razorpay checkout/webhook verification.
- Credit pack purchase and referral bonus ledger.
- Knowledge Base upload/extraction.
- Firecrawl/Puppeteer crawler service.
- Full LangGraph graph nodes and reviewer retry loop.
- Dedicated SEO prose pages for each individual tool.
- Billing cancellation page.
- Admin paginated server-side customer detail pages.

## Go-Live Blockers

- Replace demo admin password flow with real auth before public production usage.
- Set `SUPPORT_PHONE` or intentionally leave phone escalation hidden.
- Configure Razorpay webhooks before real payment testing.
- Configure Clerk keys before real multi-tenant customer login.
- Confirm all Nginx enabled sites have explicit `server_name` blocks.
