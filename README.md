# DigiBlend App

Next.js application for DigiBlend AI tools and the planned GTM automation engine.

## Prerequisites

- Node.js
- OpenRouter API key for AI generation features

## Environment

Create `.env.local` from `.env.example` and set:

```bash
OPENROUTER_API_KEY="your_key_here"
OPENROUTER_MODEL="auto:free"
APP_URL="http://localhost:3000"
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
npm run lint
npm run build
```

## API Routes

- `GET /api/health`
- `POST /api/generate`
