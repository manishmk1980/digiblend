import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

type OpenRouterModel = {
  id: string;
  context_length?: number;
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
  };
  pricing?: {
    prompt?: string;
    completion?: string;
  };
};

type OpenRouterModelsCache = {
  expiresAt: number;
  modelIds: string[];
};

let freeOpenRouterModelsCache: OpenRouterModelsCache | null = null;

function getSupportEscalationBlock() {
  const email = process.env.SUPPORT_EMAIL || 'support@digiblend.in';
  const phone = process.env.SUPPORT_PHONE?.trim();
  const callUrl = process.env.SUPPORT_CALL_URL || 'https://digiblend.in/contact';
  return [
    `Email: ${email}`,
    phone ? `Phone/WhatsApp: ${phone}` : null,
    `Book a call: ${callUrl}`,
  ].filter(Boolean).join('\n');
}

function getSupportSystemPrompt() {
  const supportEscalation = getSupportEscalationBlock();

  return `You are Blend, the friendly and knowledgeable customer support assistant for DigiBlend (digiblend.in), a toolkit of AI-powered tools for freelancers, indie marketers, and small business owners.

Personality:
- Warm, helpful, professional, concise, and honest.
- Never make up prices, features, deadlines, or policies.
- Only answer from the knowledge base below. If something is not covered, escalate to human support.
- Keep responses under 120 words unless a detailed explanation is genuinely needed.
- If a user is vague, ask one clarifying question before answering.
- If a user is frustrated, acknowledge once, then focus on solving or escalating.
- Do not discuss competitors by name.
- Do not offer discounts, extensions, or exceptions.
- Do not end every answer with "Is there anything else I can help you with today?"
- Do not use markdown formatting. Use short plain-text paragraphs or simple hyphen bullets.
- Let the app send inactivity follow-ups. You should only answer the user's direct question.

Escalation:
For unsupported questions or human help, say:
"For this one, it's best to connect with our team directly. You can reach us at:

${supportEscalation}

We typically respond within 24 hours on business days."

Knowledge base:
- DigiBlend is a multi-tool AI SaaS platform at digiblend.in.
- Current live tool: AI Meta Tag Generator. It generates SEO-optimised meta titles up to 60 characters and descriptions up to 155 characters from a page title, summary, and target keywords.
- More tools launching soon: Social Bio Writer, Blog Outline Builder, Cold Email Writer, Ad Copy Generator, Hashtag Research Tool, and more.
- Free plan: Rs 0, 3-10 free generations per day per tool, no credit card needed.
- Pro plan: Rs 499/month, unlimited generations on every tool, priority access to new tools, cancel anytime.
- Credit packs: Starter 20 credits Rs 149, Growth 60 credits Rs 399, Power 150 credits Rs 899.
- Credits are used when the Free daily limit is reached. 1 generation = 1 credit. Credits never expire.
- If a user upgrades to Pro mid-pack, unused credits remain on the account.
- Referral programme: each user gets a referral code after signing up. If someone makes their first purchase through it, referrer earns +10 credits and referred user gets +5 credits.
- Knowledge Base upload: users can upload brand guidelines, past content, or business documents. Free users get 1 document. Pro users get unlimited documents.
- Sign in via email powered by Clerk.
- Manage plan and billing from Account -> Billing.
- Cancel Pro anytime. Access continues until the end of the billing period.
- Razorpay is the payment processor. Accepted payments: major debit/credit cards, UPI, Google Pay, PhonePe.
- Credit packs are refundable within 7 days if no credits have been used.
- Pro subscription pro-rata refunds are not available; access remains until the period ends.
- For refund requests, contact support@digiblend.in with registered email and order/payment ID.
- DigiBlend does not sell user data.
- Uploaded documents are used only to personalise the user's own outputs. They are not shared with other users or used to train AI models.
- Privacy policy: digiblend.in/privacy`;
}

function isZeroPrice(value: string | undefined) {
  if (!value) return false;
  return Number(value) === 0;
}

function isFreeTextModel(model: OpenRouterModel) {
  const input = model.architecture?.input_modalities || [];
  const output = model.architecture?.output_modalities || [];
  return input.includes('text') && output.includes('text') && isZeroPrice(model.pricing?.prompt) && isZeroPrice(model.pricing?.completion);
}

async function getFreeOpenRouterModelIds(apiKey: string) {
  const now = Date.now();
  if (freeOpenRouterModelsCache && freeOpenRouterModelsCache.expiresAt > now) {
    return freeOpenRouterModelsCache.modelIds;
  }

  const response = await fetch('https://openrouter.ai/api/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'DigiBlend',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`OpenRouter model discovery failed (${response.status})`);
  }

  const data = await response.json();
  const modelIds = ((data?.data || []) as OpenRouterModel[])
    .filter(isFreeTextModel)
    .sort((a, b) => (b.context_length || 0) - (a.context_length || 0))
    .map((model) => model.id);

  if (!modelIds.length) {
    throw new Error('OpenRouter did not return any free text-generation models.');
  }

  freeOpenRouterModelsCache = {
    expiresAt: now + 60 * 60 * 1000,
    modelIds,
  };

  return modelIds;
}

async function getCandidateModels(apiKey: string) {
  const configuredModel = process.env.OPENROUTER_MODEL?.trim();
  const freeModels = await getFreeOpenRouterModelIds(apiKey);

  if (!configuredModel || configuredModel === 'auto:free') {
    return freeModels;
  }

  return [configuredModel, ...freeModels.filter((model) => model !== configuredModel)];
}

function shouldTryNext(status: number, errorText: string) {
  return status === 402 || status === 429 || /insufficient credits|requires credits|paid model|rate limit/i.test(errorText);
}

async function callOpenRouterModel(apiKey: string, model: string, messages: { role: string; content: string }[]) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'DigiBlend',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      reply: null,
      error: new Error(`OpenRouter chat error (${response.status}) for ${model}: ${errorText}`),
      tryNext: shouldTryNext(response.status, errorText),
    };
  }

  const data = await response.json();
  return {
    reply: data?.choices?.[0]?.message?.content || null,
    error: null,
    tryNext: false,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = (body.messages || []) as ChatMessage[];
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured.' }, { status: 500 });
    }

    const recentMessages = messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const openRouterMessages = [
      { role: 'system', content: getSupportSystemPrompt() },
      ...recentMessages,
    ];

    const models = await getCandidateModels(apiKey);
    let lastError: Error | null = null;

    for (const model of models) {
      const result = await callOpenRouterModel(apiKey, model, openRouterMessages);
      if (result.reply) {
        return NextResponse.json({ reply: result.reply });
      }

      if (result.error) {
        lastError = result.error;
        if (!result.tryNext) {
          throw result.error;
        }
      }
    }

    throw lastError || new Error('No OpenRouter free chat model returned a reply.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Support chat failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
