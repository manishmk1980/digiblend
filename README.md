# DigiBlend App

Next.js application for DigiBlend AI tools and the planned GTM automation engine.

## Prerequisites

- Node.js
- Gemini API key for AI generation features

## Environment

Create `.env.local` from `.env.example` and set:

```bash
GEMINI_API_KEY="your_key_here"
APP_URL="http://localhost:3000"
```

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
npm run lint
npm run build
```

## API Routes

- `GET /api/health`
- `POST /api/generate`
