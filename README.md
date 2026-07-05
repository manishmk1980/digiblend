# DigiBlend App

Next.js application for DigiBlend AI tools, the AI Engineering Audit funnel, and the planned GTM automation engine.

## Prerequisites

- Node.js
- OpenRouter API key for AI generation features
- MySQL database for persisted tenants, audits, usage, and admin actions

## Environment

Create `.env.local` from `.env.example` and set:

```bash
OPENROUTER_API_KEY="your_key_here"
OPENROUTER_MODEL="auto:free"
APP_URL="http://localhost:3000"
DATABASE_URL="mysql://digiblend_user:password@localhost:3306/digiblend_db"
```

`GEMINI_API_KEY` can also be set as a fallback provider.

When `OPENROUTER_MODEL` is set to `auto:free`, the API discovers current free text-generation models from OpenRouter and tries them automatically.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Validate

```bash
npx prisma generate
npm run lint
npm run build
```

## API Routes

- `GET /api/health`
- `GET /api/health/db`
- `POST /api/generate`
- `POST /api/audit/snapshot`
- `POST /api/customers/session`
- `POST /api/subscriptions/pro`
- `POST /api/usage/events`
- `POST /api/admin/actions`
- `GET /api/admin/overview`

## Architecture Docs

- `docs/MASTER_ARCHITECTURE.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/multiagent-roadmap.md`

## Production Deploy

On the VPS, fill `.env.local`, then use:

```bash
bash deploy.sh
```

Production migrations must use `npx prisma migrate deploy`.
