import { NextResponse } from 'next/server';
import { createAuditRecord } from '@/src/server/audits';

export const runtime = 'nodejs';

type SnapshotRequest = {
  websiteUrl?: string;
  operationalFocus?: string;
};

type AuditFinding = {
  finding: string;
  evidence: string;
  whyImportant: string;
  howToFix: string;
  confidence: 'High' | 'Medium' | 'Low';
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
const MAX_AUDIT_MODEL_ATTEMPTS = 3;

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidCompanyUrl(value: string) {
  try {
    const url = new URL(normalizeUrl(value));
    return Boolean(url.hostname.includes('.') && url.hostname.length > 3);
  } catch {
    return false;
  }
}

function fallbackSnapshot(websiteUrl: string, operationalFocus: string) {
  const host = (() => {
    try {
      return new URL(normalizeUrl(websiteUrl)).hostname.replace(/^www\./, '');
    } catch {
      return websiteUrl;
    }
  })();

  return {
    score: 62,
    companySummary: `${host} appears ready for an AI workflow review, especially around ${operationalFocus.toLowerCase()}. This demo snapshot now uses public homepage signals when available, but should still be validated through the paid deep-dive audit.`,
    visibleGaps: [
      {
        finding: `The ${operationalFocus.toLowerCase()} journey needs a measurable intake and routing layer.`,
        evidence: 'The public URL was submitted without connected CRM, ticket, analytics, or form-conversion data, so this snapshot cannot verify back-office routing.',
        whyImportant: 'Without routing evidence, high-intent enquiries can look the same as low-fit enquiries, delaying the right follow-up.',
        howToFix: 'Add a scored intake form or chat handoff that captures intent, urgency, company type, and next action, then route it into CRM or a support queue.',
        confidence: 'Medium',
      },
      {
        finding: 'Operational outcomes need to be quantified more clearly.',
        evidence: 'Public messaging can describe services, but usually does not expose cycle time, response time, qualification rate, or saved-hours benchmarks.',
        whyImportant: 'Decision-makers buy operational improvement faster when they can see measurable before-and-after business impact.',
        howToFix: 'Add 2-3 outcome metrics near the primary CTA, such as average response target, audit turnaround, lead routing time, or monthly improvement cadence.',
        confidence: 'Medium',
      },
      {
        finding: 'The deep AI-readiness proof needs verified system data.',
        evidence: 'A public homepage snapshot cannot inspect internal tools, data quality, permissions, SLA history, or workflow exceptions.',
        whyImportant: 'AI workflow recommendations become much more accurate when they are grounded in real tickets, CRM rows, support rules, and operational notes.',
        howToFix: 'Collect a small sanitized CSV sample plus operational notes during onboarding and map it into a documented automation blueprint.',
        confidence: 'High',
      },
    ],
    premiumPreviewLabels: [
      'Tailored $15k/year cost-savings action plan',
      'Internal tool interoperability map',
      'Data compliance vulnerability review',
      '90-day implementation sprint blueprint',
    ],
    conversionHeadline: `Your automated snapshot reveals high-risk operational bottlenecks in ${operationalFocus.toLowerCase()}.`,
  };
}

function evidenceAwareFallbackSnapshot(
  websiteUrl: string,
  operationalFocus: string,
  evidence: Awaited<ReturnType<typeof getHomepageEvidence>> | null,
) {
  const base = fallbackSnapshot(websiteUrl, operationalFocus);
  if (!evidence?.fetched) return base;

  const contactEvidence = [
    evidence.signals.hasChatOrAssistant ? 'AI/chat assistant' : '',
    evidence.signals.hasPhone ? 'phone contact' : '',
    evidence.signals.hasBooking ? 'booking CTA' : '',
    evidence.signals.hasAuditCta ? 'audit CTA' : '',
    evidence.signals.hasFaq ? 'FAQ/common questions' : '',
  ].filter(Boolean);

  return {
    ...base,
    score: evidence.signals.hasChatOrAssistant && evidence.signals.hasFaq ? 68 : base.score,
    companySummary: `${evidence.title || new URL(normalizeUrl(websiteUrl)).hostname} shows several public conversion and support signals, including ${contactEvidence.join(', ') || 'visible contact content'}. This snapshot is evidence-informed, but internal CRM routing, SLA history, and support workflow performance still require the deep-dive audit.`,
    visibleGaps: [
      {
        finding: evidence.signals.hasChatOrAssistant
          ? 'Chat exists, but its follow-up quality and routing are not publicly verifiable.'
          : 'A chat or assisted support path was not detected in the public HTML snapshot.',
        evidence: evidence.signals.hasChatOrAssistant
          ? 'The homepage evidence includes chat/assistant language, so the issue is not chat absence; it is measurable routing, ownership, and follow-up proof.'
          : 'The public HTML/text snapshot did not expose chat or assistant markers. This may miss scripts loaded after interaction.',
        whyImportant: 'Visitors may ask support questions at different intent levels; the business needs a way to qualify, assign, and measure those conversations.',
        howToFix: 'Connect chat submissions to CRM or a ticket queue, capture reason/urgency/contact details, and report first-response and booked-call conversion rates.',
        confidence: evidence.signals.hasChatOrAssistant ? 'High' : 'Low',
      },
      {
        finding: evidence.signals.hasFaq
          ? 'FAQ content exists, but it should become more searchable and outcome-oriented.'
          : 'Self-service support content should be easier to find and search.',
        evidence: evidence.signals.hasFaq
          ? 'The homepage includes "Common questions," so the opportunity is searchability, coverage, and tracking rather than total absence.'
          : 'The public snapshot did not find FAQ/common-question markers on the homepage.',
        whyImportant: 'A searchable support hub reduces repetitive questions and helps high-intent visitors answer buying objections before contacting sales.',
        howToFix: 'Add a searchable knowledge base with categories, top questions, related CTAs, analytics on failed searches, and escalation prompts for unresolved queries.',
        confidence: evidence.signals.hasFaq ? 'High' : 'Medium',
      },
      {
        finding: evidence.signals.hasSla
          ? 'SLA or response expectations are mentioned, but should be tied to support tiers and escalation rules.'
          : 'Response-time and escalation expectations should be made clearer.',
        evidence: evidence.signals.hasSla
          ? 'The public snapshot found SLA/response-time wording, but internal performance history is not verifiable from the homepage.'
          : 'The public homepage text does not clearly expose SLA, escalation, response-time, or resolution-time commitments.',
        whyImportant: 'Clear expectations reduce uncertainty and help prospects understand what happens after they submit a message or book a call.',
        howToFix: 'Publish simple response windows by enquiry type, define escalation triggers, and add status notifications for chat, form, and booked-call workflows.',
        confidence: evidence.signals.hasSla ? 'Medium' : 'High',
      },
    ],
    conversionHeadline: `Your public journey has useful support signals; the $1,500 audit verifies routing, SLA performance, CRM handoff, and automation gaps behind the scenes.`,
  };
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTagContent(html: string, selector: RegExp) {
  const match = html.match(selector);
  return match?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

function hasAny(value: string, terms: string[]) {
  const lower = value.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

async function getHomepageEvidence(websiteUrl: string) {
  const normalized = normalizeUrl(websiteUrl);
  const response = await fetch(normalized, {
    headers: {
      'User-Agent': 'DigiBlendAuditBot/1.0 (+https://digiblend.in)',
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(7000),
  });

  if (!response.ok) {
    throw new Error(`Homepage fetch failed with status ${response.status}`);
  }

  const html = await response.text();
  const text = stripHtml(html).slice(0, 12000);
  const title = extractTagContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    extractTagContent(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    extractTagContent(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);

  const signals = {
    hasChatOrAssistant: hasAny(`${html} ${text}`, ['chat', 'assistant available', 'AI assistant', 'leave a message', 'message and we will follow up']),
    hasFaq: hasAny(`${html} ${text}`, ['common questions', 'faq', 'faqs', 'frequently asked', 'question']),
    hasPhone: /\+?\d[\d\s().-]{7,}/.test(text),
    hasBooking: hasAny(text, ['book a call', 'book a discovery call', 'schedule', 'appointment']),
    hasAuditCta: hasAny(text, ['free website audit', 'run quick audit', 'visibility audit']),
    hasSla: hasAny(text, ['sla', 'service level', 'response time', 'resolution time']),
    hasCrm: hasAny(text, ['crm', 'lead capture', 'follow-up', 'follow up', 'routing']),
  };

  return {
    fetched: true,
    finalUrl: normalized,
    title,
    description,
    visibleTextSample: text.slice(0, 5000),
    signals,
  };
}

function normalizeFinding(value: unknown): AuditFinding | null {
  if (!value) return null;
  if (typeof value === 'string') {
    return {
      finding: value,
      evidence: 'Generated from public-input assumptions. Needs homepage evidence validation.',
      whyImportant: 'A finding must connect to business impact before it can support an audit purchase decision.',
      howToFix: 'Verify the public page and convert the issue into a specific UX, CRM, support, or tracking improvement.',
      confidence: 'Low',
    };
  }

  if (typeof value !== 'object') return null;
  const record = value as Partial<AuditFinding>;
  return {
    finding: String(record.finding || '').trim(),
    evidence: String(record.evidence || '').trim(),
    whyImportant: String(record.whyImportant || '').trim(),
    howToFix: String(record.howToFix || '').trim(),
    confidence: record.confidence === 'High' || record.confidence === 'Low' ? record.confidence : 'Medium',
  };
}

function normalizeSnapshotPayload(payload: any, fallback: ReturnType<typeof fallbackSnapshot>) {
  const findings = Array.isArray(payload?.visibleGaps)
    ? payload.visibleGaps.map(normalizeFinding).filter(Boolean).slice(0, 3)
    : [];

  return {
    ...fallback,
    ...payload,
    visibleGaps: findings.length ? findings : fallback.visibleGaps,
    premiumPreviewLabels:
      Array.isArray(payload?.premiumPreviewLabels) && payload.premiumPreviewLabels.length
        ? payload.premiumPreviewLabels.slice(0, 4).map((label: unknown) => String(label))
        : fallback.premiumPreviewLabels,
  };
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
    return freeModels.slice(0, MAX_AUDIT_MODEL_ATTEMPTS);
  }

  return [configuredModel, ...freeModels.filter((model) => model !== configuredModel)].slice(0, MAX_AUDIT_MODEL_ATTEMPTS);
}

function parseJsonObject(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error('Audit snapshot response was not valid JSON.');
  }
}

function shouldTryNext(status: number, errorText: string) {
  return status === 402 || status === 429 || /insufficient credits|requires credits|paid model|rate limit/i.test(errorText);
}

async function callOpenRouterModel(apiKey: string, model: string, websiteUrl: string, operationalFocus: string, evidence: Awaited<ReturnType<typeof getHomepageEvidence>> | null) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(14000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'DigiBlend',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an enterprise AI workflow auditor. Return only valid JSON for a demo public website snapshot. Be evidence-grounded and conservative. Never say an element is missing when homepage evidence says it exists. Phrase uncertain items as improvement opportunities, not factual absence.',
        },
        {
          role: 'user',
          content: `Create a paid audit teaser snapshot for:
Website URL: ${normalizeUrl(websiteUrl)}
Operational focus: ${operationalFocus}

Homepage evidence:
${JSON.stringify(evidence || { fetched: false, note: 'Homepage fetch unavailable. Use low-confidence assumptions only.' }, null, 2)}

Return JSON with:
score: number from 45 to 78
companySummary: one concise paragraph
visibleGaps: exactly 3 objects with keys:
  finding: specific finding or improvement opportunity
  evidence: observed homepage evidence or clearly state "not verified in public snapshot"
  whyImportant: business reason this matters
  howToFix: concrete implementation recommendation
  confidence: "High", "Medium", or "Low"
premiumPreviewLabels: exactly 4 locked premium section labels
conversionHeadline: one sentence that motivates a $1,500 engineering audit.

Accuracy constraints:
- If hasChatOrAssistant is true, do not claim there is no chat or no real-time messaging.
- If hasFaq is true, do not claim there is no FAQ or knowledge base; recommend making it searchable/measurable instead.
- If hasPhone or hasBooking is true, do not claim there is no contact path.
- Prefer recommendations like SLA visibility, searchable support hub, CRM routing, tracking, and response benchmarks when supported by evidence.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      data: null,
      error: new Error(`OpenRouter audit error (${response.status}) for ${model}: ${errorText}`),
      tryNext: shouldTryNext(response.status, errorText),
    };
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    return {
      data: null,
      error: new Error(`OpenRouter audit model ${model} returned an empty response.`),
      tryNext: true,
    };
  }

  return {
    data: parseJsonObject(content),
    error: null,
    tryNext: false,
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as SnapshotRequest;
  const websiteUrl = body.websiteUrl || '';
  const operationalFocus = body.operationalFocus || 'Customer Support';

  if (!isValidCompanyUrl(websiteUrl)) {
    return NextResponse.json({ error: 'A valid company website URL is required.' }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  let fallback = fallbackSnapshot(websiteUrl, operationalFocus);
  let evidence: Awaited<ReturnType<typeof getHomepageEvidence>> | null = null;

  try {
    evidence = await getHomepageEvidence(websiteUrl);
    fallback = evidenceAwareFallbackSnapshot(websiteUrl, operationalFocus, evidence);
  } catch {
    evidence = null;
  }

  if (!apiKey) {
    const auditId = await createAuditRecord({
      companyUrl: websiteUrl,
      operationalFocus,
      status: 'Processing',
      snapshotPayload: fallback,
      readinessScore: Number(fallback.score) || null,
    }).catch((error) => {
      console.error('[Audit Persistence Warning]', error);
      return null;
    });

    return NextResponse.json({
      ...fallback,
      auditId,
    });
  }

  try {
    const models = await getCandidateModels(apiKey);
    let lastError: Error | null = null;

    for (const model of models) {
      const result = await callOpenRouterModel(apiKey, model, websiteUrl, operationalFocus, evidence);
      if (result.data) {
        const snapshotPayload = normalizeSnapshotPayload(result.data, fallback);
        const auditId = await createAuditRecord({
          companyUrl: websiteUrl,
          operationalFocus,
          status: 'Processing',
          snapshotPayload,
          readinessScore: Number(snapshotPayload.score) || null,
        }).catch((error) => {
          console.error('[Audit Persistence Warning]', error);
          return null;
        });

        return NextResponse.json({
          ...snapshotPayload,
          auditId,
        });
      }

      if (result.error) {
        lastError = result.error;
        if (!result.tryNext) {
          throw result.error;
        }
      }
    }

    throw lastError || new Error('No free OpenRouter model returned an audit snapshot.');
  } catch {
    const auditId = await createAuditRecord({
      companyUrl: websiteUrl,
      operationalFocus,
      status: 'Processing',
      snapshotPayload: fallback,
      readinessScore: Number(fallback.score) || null,
    }).catch((error) => {
      console.error('[Audit Persistence Warning]', error);
      return null;
    });

    return NextResponse.json({
      ...fallback,
      auditId,
    });
  }
}
