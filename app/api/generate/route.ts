import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type GenerateRequest = {
  tool?: string;
  inputs?: Record<string, string>;
};

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables.');
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

    return NextResponse.json({ result: parseJsonResponse(resultText) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate AI content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
