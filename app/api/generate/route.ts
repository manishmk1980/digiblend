import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type GenerateRequest = {
  tool?: string;
  inputs?: Record<string, string>;
};

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

type OpenRouterModel = {
  id: string;
  name?: string;
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

function buildPrompt(tool: string, inputs: Record<string, string>) {
  if (tool === 'meta-tag-generator') {
    return `You are an expert SEO specialist. Generate complete, high-quality SEO Meta Tags.
Description/URL: ${inputs.description || ''}
Primary Keywords: ${inputs.keywords || ''}
Target Audience: ${inputs.audience || 'General'}

Return valid JSON with: title, description, keywords, ogTitle, ogDescription, twitterTitle, twitterDescription, robots, recommendations.`;
  }

  if (tool === 'social-bio-writer') {
    return `You are an expert copywriter and branding specialist. Write compelling social media bios.
About Me/Business: ${inputs.about || ''}
Platform: ${inputs.platform || 'Twitter'}
Tone: ${inputs.tone || 'Professional'}
Keywords to include: ${inputs.keywords || ''}

Return valid JSON with: bios array containing text and strategy, and tips array.`;
  }

  if (tool === 'cold-email-writer') {
    return `You are a world-class B2B sales copywriter. Write a high-converting cold outreach email.
Recipient Role/Company: ${inputs.recipient || ''}
Value Proposition/Product: ${inputs.product || ''}
Key Pain Point Addressed: ${inputs.painPoint || ''}
Call to Action: ${inputs.cta || '15-minute quick call'}
Tone: ${inputs.tone || 'Friendly & Direct'}

Return valid JSON with: subjectLines, emailBody, followUpConcept, copywritingTip.`;
  }

  if (tool === 'ad-copy-generator') {
    return `You are an elite conversion copywriter for digital ads. Generate high-performance ad copy variations.
Product/Service: ${inputs.product || ''}
Key Benefits: ${inputs.benefits || ''}
Platform: ${inputs.platform || 'Facebook Ads'}
Target Audience: ${inputs.audience || 'Marketers'}
Promotion/Offer: ${inputs.offer || 'Free trial'}

Return valid JSON with: copies array containing primaryText, headline, description, ctaRecommended, and performanceAngles.`;
  }

  if (tool === 'business-name-checker') {
    return `You are a branding consultant and creative naming specialist. Generate unique, brandable UK company names and domain structures.
Industry/Niche: ${inputs.niche || ''}
Style: ${inputs.style || 'Modern'}
Key Ideas/Keywords: ${inputs.keywords || ''}

Return valid JSON with: businessNames array containing name, tagline, domainSuggestion, brandConcept, and brandingTips.`;
  }

  if (tool === 'readability-scorer') {
    return `You are an expert copywriter, linguist, and communication specialist. Analyze this text:
"""
${inputs.copy || ''}
"""

Target Audience/Persona: ${inputs.targetAudience || 'General Public'}
Analysis Focus Angle: ${inputs.focus || 'General Clarity & Readability'}

Return valid JSON with: score, gradeLevel, readingEase, wordCount, sentenceCount, passiveVoicePercent, overallSummary, metrics, suggestions, improvedText.`;
  }

  return null;
}

function parseJsonResponse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        return { rawText: text };
      }
    }
    return { rawText: text };
  }
}

function isZeroPrice(value: string | undefined) {
  if (!value) return false;
  return Number(value) === 0;
}

function isTextGenerationModel(model: OpenRouterModel) {
  const input = model.architecture?.input_modalities || [];
  const output = model.architecture?.output_modalities || [];
  return input.includes('text') && output.includes('text');
}

function isFreeTextModel(model: OpenRouterModel) {
  return isTextGenerationModel(model) && isZeroPrice(model.pricing?.prompt) && isZeroPrice(model.pricing?.completion);
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
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter model discovery failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const modelIds = ((data?.data || []) as OpenRouterModel[])
    .filter(isFreeTextModel)
    .sort((a, b) => {
      const contextA = a.context_length || 0;
      const contextB = b.context_length || 0;
      return contextB - contextA;
    })
    .map((model) => model.id);

  if (modelIds.length === 0) {
    throw new Error('OpenRouter did not return any free text-generation models.');
  }

  freeOpenRouterModelsCache = {
    expiresAt: now + 60 * 60 * 1000,
    modelIds,
  };

  return modelIds;
}

async function getOpenRouterCandidateModels(apiKey: string) {
  const configuredModel = process.env.OPENROUTER_MODEL?.trim();
  const freeModelIds = await getFreeOpenRouterModelIds(apiKey);

  if (!configuredModel || configuredModel === 'auto:free') {
    return freeModelIds;
  }

  return [configuredModel, ...freeModelIds.filter((modelId) => modelId !== configuredModel)];
}

function shouldTryNextOpenRouterModel(status: number, errorText: string) {
  return (
    status === 402 ||
    status === 429 ||
    /insufficient credits|requires credits|paid model|not enough credits|rate limit/i.test(errorText)
  );
}

async function sendOpenRouterRequest(apiKey: string, model: string, messages: ChatMessage[], useJsonMode: boolean) {
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
      ...(useJsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  return response;
}

async function callOpenRouterModel(apiKey: string, model: string, messages: ChatMessage[]) {
  let response = await sendOpenRouterRequest(apiKey, model, messages, true);

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 400 && /response_format|json_object|structured/i.test(errorText)) {
      response = await sendOpenRouterRequest(apiKey, model, messages, false);
    } else {
      const error = new Error(`OpenRouter API error (${response.status}) for ${model}: ${errorText}`);
      return {
        error,
        shouldTryNext: shouldTryNextOpenRouterModel(response.status, errorText),
        resultText: null,
      };
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`OpenRouter API error (${response.status}) for ${model}: ${errorText}`);
    return {
      error,
      shouldTryNext: shouldTryNextOpenRouterModel(response.status, errorText),
      resultText: null,
    };
  }

  const data = await response.json();
  return {
    error: null,
    shouldTryNext: false,
    resultText: data?.choices?.[0]?.message?.content || null,
  };
}

async function generateWithOpenRouter(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are DigiBlend AI. Return only valid JSON matching the requested schema. Do not wrap JSON in markdown.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const candidateModels = await getOpenRouterCandidateModels(apiKey);
  let lastError: Error | null = null;

  for (const model of candidateModels) {
    const response = await callOpenRouterModel(apiKey, model, messages);

    if (response.resultText) {
      return response.resultText;
    }

    if (response.error) {
      lastError = response.error;
      if (!response.shouldTryNext) {
        throw response.error;
      }
    }
  }

  throw lastError || new Error('Empty response received from all OpenRouter free model candidates');
}

async function generateWithGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No AI provider configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY in .env.local.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'digiblend-next',
      },
    },
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error('Empty response received from Gemini API');
  }

  return resultText;
}

export async function POST(request: Request) {
  try {
    const { tool, inputs }: GenerateRequest = await request.json();

    if (!tool || !inputs) {
      return NextResponse.json({ error: 'Missing tool or inputs parameter' }, { status: 400 });
    }

    const prompt = buildPrompt(tool, inputs);
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid tool requested' }, { status: 400 });
    }

    const resultText = (await generateWithOpenRouter(prompt)) || (await generateWithGemini(prompt));

    return NextResponse.json({ result: parseJsonResponse(resultText) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate AI content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
