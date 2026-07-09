import { TOOLS } from '@/src/types';

export type MarketingTool = {
  seoSlug: string;
  appSlug: string;
  name: string;
  badge: string;
  description: string;
  audience: string;
  exampleInput: string;
  exampleOutput: string;
  faqs: { question: string; answer: string }[];
  comingSoon?: boolean;
};

export const MARKETING_TOOLS: MarketingTool[] = [
  {
    seoSlug: 'seo-meta-tag-generator',
    appSlug: 'meta-tag-generator',
    name: 'SEO Meta Tag Generator',
    badge: 'SEO',
    description:
      'Create SEO titles, descriptions, keywords, Open Graph tags, and Twitter/X card metadata from a URL or business description.',
    audience: 'Freelancers, indie makers, and small teams shipping landing pages and blog content.',
    exampleInput: 'URL: digiblend.in — AI utilities for marketing execution. Keywords: ai tools, seo meta tags.',
    exampleOutput:
      'Title: DigiBlend | AI Marketing Utilities for Freelancers\nDescription: Generate SEO metadata, bios, emails, and ad copy with focused AI tools.',
    faqs: [
      {
        question: 'What meta tags does this generate?',
        answer: 'SEO title, meta description, keywords, Open Graph fields, Twitter card fields, and robots guidance.',
      },
      {
        question: 'Can I use this for client websites?',
        answer: 'Yes. Agencies and freelancers can generate client-ready metadata drafts and refine them before publishing.',
      },
    ],
  },
  {
    seoSlug: 'social-media-bio-writer',
    appSlug: 'social-bio-writer',
    name: 'Social Media Bio Writer',
    badge: 'Social',
    description:
      'Generate professional bios for LinkedIn, Instagram, Twitter/X, and personal brands with tone-aware copy.',
    audience: 'Founders, creators, consultants, and service businesses building a consistent social presence.',
    exampleInput: 'About: Indie SaaS founder building lean marketing tools. Platform: LinkedIn. Tone: Professional.',
    exampleOutput:
      'Building focused AI utilities for marketers | Founder @ DigiBlend | Helping freelancers ship content faster.',
    faqs: [
      {
        question: 'Which platforms are supported?',
        answer: 'LinkedIn, Instagram, Twitter/X, and TikTok with platform-appropriate length and style.',
      },
      {
        question: 'Can I include hashtags or keywords?',
        answer: 'Yes. Add optional keywords or hashtags and DigiBlend will weave them into the bio naturally.',
      },
    ],
  },
  {
    seoSlug: 'cold-email-writer',
    appSlug: 'cold-email-writer',
    name: 'B2B Cold Email Writer',
    badge: 'Outreach',
    description:
      'Create structured, personalized outreach emails for prospects, agencies, and service businesses.',
    audience: 'Agencies, consultants, founders, and sales teams doing B2B outreach.',
    exampleInput:
      'Recipient: VP Marketing at SaaS startups. Product: SEO audit tool. Pain: wasted ad spend on poor landing pages.',
    exampleOutput:
      'Subject: Quick idea for your landing page CTR\nBody: Personalized opener, value prop, proof angle, and low-friction CTA.',
    faqs: [
      {
        question: 'Does this write full sequences?',
        answer: 'It generates a primary email plus follow-up concepts you can adapt into a sequence.',
      },
      {
        question: 'Can I control tone?',
        answer: 'Yes. Choose friendly, direct, curious, or assertive tones to match your outreach style.',
      },
    ],
  },
  {
    seoSlug: 'ad-copy-generator',
    appSlug: 'ad-copy-generator',
    name: 'Digital Ad Copy Architect',
    badge: 'Ads',
    description:
      'Generate ad copy ideas for Google Ads, Facebook Ads, LinkedIn Ads, and landing campaigns.',
    audience: 'Performance marketers, freelancers, and startup teams testing paid campaigns.',
    exampleInput: 'Product: DigiBlend AI Suite. Platform: Facebook Ads. Audience: freelance marketers.',
    exampleOutput: 'Primary text, headline, description, CTA recommendation, and angle notes for testing.',
    faqs: [
      {
        question: 'Which ad platforms are supported?',
        answer: 'Facebook Ads, Google Search Ads, and Instagram sponsor placements.',
      },
      {
        question: 'Can I include an offer or hook?',
        answer: 'Yes. Add discounts, lead magnets, or trial offers to shape the ad angle.',
      },
    ],
  },
  {
    seoSlug: 'landing-page-copy-generator',
    appSlug: 'ad-copy-generator',
    name: 'Landing Page Copy Generator',
    badge: 'Landing Pages',
    description:
      'Create hero sections, benefit blocks, CTAs, and FAQ-ready content for product and service pages.',
    audience: 'Indie makers and startup teams launching pages without a full copy team.',
    exampleInput: 'Product: AI marketing toolkit. Audience: freelancers. Offer: Start free with daily usage.',
    exampleOutput: 'Hero headline, subhead, benefit bullets, social proof angle, CTA block, and FAQ starters.',
    faqs: [
      {
        question: 'Is this only for SaaS pages?',
        answer: 'No. It works for services, agencies, courses, and product launches too.',
      },
      {
        question: 'Can I reuse outputs in Webflow or WordPress?',
        answer: 'Yes. Outputs are structured sections you can paste into any page builder or CMS.',
      },
    ],
    comingSoon: true,
  },
  {
    seoSlug: 'content-brief-generator',
    appSlug: 'readability-scorer',
    name: 'Content Brief Generator',
    badge: 'Content',
    description:
      'Turn a topic or keyword into a structured SEO content brief with headings, angles, and search intent.',
    audience: 'SEO freelancers, content marketers, and agencies planning articles and landing pages.',
    exampleInput: 'Topic: AI utilities for freelancers. Intent: informational + commercial investigation.',
    exampleOutput: 'Search intent summary, target keyword cluster, H2 outline, CTA angle, and internal link ideas.',
    faqs: [
      {
        question: 'Does this replace keyword research tools?',
        answer: 'It accelerates brief creation. Pair it with your keyword research workflow for best results.',
      },
      {
        question: 'Who is this for?',
        answer: 'Writers, SEO freelancers, and agencies who need repeatable briefs for client content.',
      },
    ],
    comingSoon: true,
  },
  ...TOOLS.filter(
    (tool) =>
      !['meta-tag-generator', 'social-bio-writer', 'cold-email-writer', 'ad-copy-generator'].includes(tool.slug),
  ).map((tool) => ({
    seoSlug: tool.slug,
    appSlug: tool.slug,
    name: tool.name,
    badge: tool.badge,
    description: tool.description,
    audience: 'Freelancers, indie makers, and small marketing teams.',
    exampleInput: 'Structured inputs based on your business, audience, and goals.',
    exampleOutput: 'Structured marketing copy ready to edit and export.',
    faqs: [
      {
        question: `What does ${tool.name} do?`,
        answer: tool.description,
      },
      {
        question: 'Do I need an account?',
        answer: 'You can explore the tool page publicly. Sign in to run generations and save usage history.',
      },
    ],
  })),
];

export const HOMEPAGE_FAQS = [
  {
    question: 'What is DigiBlend?',
    answer:
      'DigiBlend is a collection of focused AI utilities for common marketing tasks like SEO metadata, social bios, cold emails, ad copy, and landing page content.',
  },
  {
    question: 'Who is DigiBlend for?',
    answer:
      'Freelancers, indie makers, small agencies, and startup teams who need faster marketing execution without writing prompts from scratch every time.',
  },
  {
    question: 'Is DigiBlend only for SEO?',
    answer:
      'No. DigiBlend covers SEO, social media, outreach, ads, landing pages, and content planning workflows.',
  },
  {
    question: 'Can I use DigiBlend for LinkedIn and cold email?',
    answer:
      'Yes. DigiBlend includes dedicated utilities for social bios and B2B cold email outreach.',
  },
  {
    question: 'How is DigiBlend different from ChatGPT?',
    answer:
      'ChatGPT is flexible, but every task needs prompt writing. DigiBlend gives you ready-made utilities with structured inputs, marketing-focused outputs, and repeatable workflows.',
  },
  {
    question: 'Do I need marketing experience to use it?',
    answer:
      'No. Each utility guides you with simple inputs and returns structured outputs you can refine.',
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes. The free plan lets you try focused AI utilities with limited daily usage.',
  },
  {
    question: 'Can agencies use DigiBlend for client work?',
    answer:
      'Yes. Agencies can use DigiBlend to speed up drafts for SEO metadata, outreach, bios, and campaign copy.',
  },
];

export const USE_CASES = [
  {
    title: 'For Freelancers',
    description: 'Create client-ready SEO and content assets faster.',
  },
  {
    title: 'For Indie Makers',
    description: 'Launch landing pages, product bios, and social posts without hiring a full marketing team.',
  },
  {
    title: 'For Small Agencies',
    description: 'Speed up repetitive content tasks and maintain consistent output quality.',
  },
  {
    title: 'For Startup Teams',
    description: 'Generate campaign drafts, outreach copy, and page metadata quickly.',
  },
];

export const HOW_IT_WORKS = [
  'Choose a focused AI utility',
  'Add your business, audience, and keywords',
  'Generate structured marketing copy',
  'Edit, export, and use it in your workflow',
];

export const WHY_DIGIBLEND = [
  'Focused tools, not a blank chatbot',
  'Built for marketing execution',
  'Simple inputs, structured outputs',
  'Useful for SEO, social, outreach, and ads',
  'Designed for freelancers and small teams',
  'Fast enough for daily use',
];

export function getMarketingToolBySeoSlug(seoSlug: string) {
  return MARKETING_TOOLS.find((tool) => tool.seoSlug === seoSlug);
}

export function getMarketingToolByAppSlug(appSlug: string) {
  return MARKETING_TOOLS.find((tool) => tool.appSlug === appSlug);
}
