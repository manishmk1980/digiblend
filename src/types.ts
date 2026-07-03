export type SubscriptionPlan = 'FREE' | 'PRO';

export interface UsageLog {
  id: string;
  toolSlug: string;
  toolName: string;
  usedAt: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  badge: string;
  iconName: string; // Lucide icon name to map
  inputs: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder: string;
    options?: string[];
    required?: boolean;
    description?: string;
  }[];
  defaultInputs: Record<string, string>;
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: 'meta-tag-generator',
    name: 'SEO Meta Tag Generator',
    description: 'Create high-ranking SEO titles, descriptions, keywords, OpenGraph, and Twitter tags.',
    badge: 'SEO',
    iconName: 'Globe',
    inputs: [
      {
        id: 'description',
        label: 'URL or Business Description',
        type: 'textarea',
        placeholder: 'e.g., https://digiblend.in - A premium AI SaaS multi-tool platform for freelancers.',
        required: true,
        description: 'Provide your website URL or a 1-2 sentence description of what your page is about.'
      },
      {
        id: 'keywords',
        label: 'Target Focus Keywords',
        type: 'text',
        placeholder: 'e.g., ai tools, saas for freelancers, meta tags',
        required: false,
        description: 'Optional focus keywords you want the generator to prioritize.'
      },
      {
        id: 'audience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'e.g., indie hackers, marketing agencies, small businesses',
        required: false,
        description: 'Describe the primary demographic or user group you want this page to appeal to.'
      }
    ],
    defaultInputs: {
      description: 'DigiBlend Toolkit (digiblend.in) is a multi-tool SaaS platform offering small, highly focused AI utilities for freelancers and indie marketers.',
      keywords: 'micro saas, ai tools, marketing widgets, seo generator',
      audience: 'freelancers, indie makers, solopreneurs'
    }
  },
  {
    slug: 'social-bio-writer',
    name: 'Social Media Bio Writer',
    description: 'Generate high-impact, brand-aligned bios for Twitter, Instagram, or LinkedIn.',
    badge: 'Social Media',
    iconName: 'Users',
    inputs: [
      {
        id: 'about',
        label: 'About You / Your Business',
        type: 'textarea',
        placeholder: 'e.g., Indie hacker building micro-SaaS products to $10k/month. Passionate about minimalism and swift execution.',
        required: true,
        description: 'Provide details about your background, career, industry, or what your business specializes in.'
      },
      {
        id: 'platform',
        label: 'Target Platform',
        type: 'select',
        placeholder: 'Select a platform...',
        options: ['Twitter / X', 'LinkedIn', 'Instagram', 'TikTok'],
        required: true,
        description: 'The social network or digital platform you are writing the bio for.'
      },
      {
        id: 'tone',
        label: 'Brand Tone of Voice',
        type: 'select',
        placeholder: 'Select a tone...',
        options: ['Professional', 'Bold & Punchy', 'Witty & Playful', 'Creative', 'Minimalist'],
        required: true,
        description: 'The mood, attitude, and personality of your generated copy.'
      },
      {
        id: 'keywords',
        label: 'Keywords / Hashtags to Include',
        type: 'text',
        placeholder: 'e.g., #buildinpublic, solopreneur, TypeScript',
        required: false,
        description: 'Optional hashtags, tags, or core skills you want embedded in the bio text.'
      }
    ],
    defaultInputs: {
      about: 'Manish Kumar, founder of Primewayz UK. Building simple software solutions and launching micro-startups with lean architecture.',
      platform: 'Twitter / X',
      tone: 'Bold & Punchy',
      keywords: '#buildinpublic, saas founder'
    }
  },
  {
    slug: 'cold-email-writer',
    name: 'B2B Cold Email Writer',
    description: 'Generate hyper-personalized, high-converting cold email sequences with deep psychological hooks.',
    badge: 'Outreach',
    iconName: 'Mail',
    inputs: [
      {
        id: 'recipient',
        label: 'Recipient Company & Role',
        type: 'text',
        placeholder: 'e.g., VP of Marketing at tech startups',
        required: true,
        description: 'The specific company type, industry, or job title of the person you are contacting.'
      },
      {
        id: 'product',
        label: 'Your Product / Value Prop',
        type: 'textarea',
        placeholder: 'e.g., Our SEO audit tool that increases organic traffic by 40% in 30 days without high agency retainer costs.',
        required: true,
        description: 'The unique value proposition, software tool, or service you are introducing.'
      },
      {
        id: 'painPoint',
        label: 'Specific Pain Point Handled',
        type: 'text',
        placeholder: 'e.g., wasting thousands on poorly optimized paid ads',
        required: true,
        description: 'The main frustration, bottleneck, or problem your target recipient faces daily.'
      },
      {
        id: 'cta',
        label: 'Call to Action (CTA)',
        type: 'text',
        placeholder: 'e.g., 10-minute quick feedback call, or a free custom checklist',
        required: false,
        description: 'The simple, low-friction next step you are asking the recipient to take.'
      },
      {
        id: 'tone',
        label: 'Email Tone',
        type: 'select',
        placeholder: 'Select a tone...',
        options: ['Friendly & Casual', 'Direct & Professional', 'Curious & Hook-driven', 'Assertive & Value-first'],
        required: true,
        description: 'The general writing style and communication approach of the email.'
      }
    ],
    defaultInputs: {
      recipient: 'Founders of digital marketing agencies',
      product: 'DigiBlend Toolkit - our suite of rapid AI widgets that saves creators 15+ hours/week in copy drafting.',
      painPoint: 'spending too much time writing manual ad copy and meta tags for clients',
      cta: '10-minute chat or standard free trial access link',
      tone: 'Friendly & Casual'
    }
  },
  {
    slug: 'ad-copy-generator',
    name: 'Digital Ad Copy Architect',
    description: 'Draft high-CTR Facebook, Google Search, and Instagram ad copies in seconds.',
    badge: 'Marketing',
    iconName: 'Zap',
    inputs: [
      {
        id: 'product',
        label: 'Product / Service Name',
        type: 'text',
        placeholder: 'e.g., DigiBlend AI Suite',
        required: true,
        description: 'The brand, product, software, or service being advertised.'
      },
      {
        id: 'benefits',
        label: 'Core Benefits & Features',
        type: 'textarea',
        placeholder: 'e.g., Free daily SEO meta tag generator, 10x faster copy writing, no credit card required, instant downloads.',
        required: true,
        description: 'Key selling points, pain-relievers, features, or value-drivers of your offer.'
      },
      {
        id: 'platform',
        label: 'Ad Platform',
        type: 'select',
        placeholder: 'Select platform...',
        options: ['Facebook Ads', 'Google Search Ads', 'Instagram Sponsors'],
        required: true,
        description: 'The specific advertising network where you intend to run this copy.'
      },
      {
        id: 'audience',
        label: 'Target Audience Profile',
        type: 'text',
        placeholder: 'e.g., freelance marketers, small business owners',
        required: true,
        description: 'A snapshot of the perfect buyer or client persona who will see this ad.'
      },
      {
        id: 'offer',
        label: 'Hook Offer / Incentive',
        type: 'text',
        placeholder: 'e.g., Save 40% on Pro today or Get started for free',
        required: false,
        description: 'An optional deal, discount, lead magnet, or incentive to compel viewers to click.'
      }
    ],
    defaultInputs: {
      product: 'DigiBlend AI Suite',
      benefits: 'Get 5 premium AI copy tools for the price of one. Write bios, meta tags, and cold emails with zero writers block.',
      platform: 'Facebook Ads',
      audience: 'indie marketers and freelance designers',
      offer: 'Start generating for free'
    }
  },
  {
    slug: 'business-name-checker',
    name: 'UK Business Naming Engine',
    description: 'Generate beautiful brand names and check high-potential .co.uk and .com domain structures.',
    badge: 'Branding',
    iconName: 'Compass',
    inputs: [
      {
        id: 'niche',
        label: 'Industry / Business Niche',
        type: 'text',
        placeholder: 'e.g., ethical coffee roaster, legaltech platform',
        required: true,
        description: 'The sector, industry vertical, or main theme of the business.'
      },
      {
        id: 'style',
        label: 'Brand Name Style',
        type: 'select',
        placeholder: 'Select style...',
        options: ['Modern & Tech-forward', 'Classic & Elegant', 'Clever & Playful', 'Compound words (e.g. DigiBlend)', 'Minimalist & Punchy'],
        required: true,
        description: 'The linguistic character, vibe, or style of brand names you want to generate.'
      },
      {
        id: 'keywords',
        label: 'Keywords / Seed Concepts',
        type: 'text',
        placeholder: 'e.g., digital, blend, roast, green, scale',
        required: false,
        description: 'Seed words, word roots, or core terms to optionally fuse into the brand name ideas.'
      }
    ],
    defaultInputs: {
      niche: 'Micro SaaS tools and utility products',
      style: 'Compound words (e.g. DigiBlend)',
      keywords: 'digital, blend, tool, SaaS, speed'
    }
  },
  {
    slug: 'readability-scorer',
    name: 'Readability Scorer & Analyzer',
    description: 'Analyze your copywriting for reading grade level, vocabulary complexity, passive voice, and clear improvement suggestions.',
    badge: 'Analytics',
    iconName: 'BookOpen',
    inputs: [
      {
        id: 'copy',
        label: 'Copy / Text to Analyze',
        type: 'textarea',
        placeholder: 'Paste your copy, article, newsletter, cold email, or blog post here (up to 5,000 words)...',
        required: true,
        description: 'Provide the draft or copy you want to evaluate.'
      },
      {
        id: 'targetAudience',
        label: 'Target Reader Persona',
        type: 'select',
        placeholder: 'Select target audience...',
        options: [
          'General Public (8th Grade Level - Highly Readable)',
          'High Schoolers (10th-12th Grade Level)',
          'University / Corporate Professionals',
          'Academic / Executive / C-Suite Scholars'
        ],
        required: true,
        description: 'The target comprehension level or reading capability of your readership.'
      },
      {
        id: 'focus',
        label: 'Analysis Focus Angle',
        type: 'select',
        placeholder: 'Select focus...',
        options: [
          'General Clarity & Readability',
          'Punchy Engagement (Short Sentences, Bold Tone)',
          'Technical Precision & Accuracy',
          'Corporate Elegance & Tone Alignment'
        ],
        required: false,
        description: 'The primary metric or stylistic alignment our engine should inspect for improvement.'
      }
    ],
    defaultInputs: {
      copy: "Building a startup isn't about having a perfect master plan. It's about finding one tiny, burning problem that a group of people are facing, and writing the absolute simplest piece of software to make that problem go away. Don't build a massive platform. Build a utility. Do one small thing exceptionally well, show it to the world, listen to their feedback, and iterate at light speed. True craftsmanship comes from executing a tiny scope with pristine quality.",
      targetAudience: 'General Public (8th Grade Level - Highly Readable)',
      focus: 'Punchy Engagement (Short Sentences, Bold Tone)'
    }
  }
];

export type Role = 'CUSTOMER' | 'ADMIN';
export type SubStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface SaaSUser {
  id: string;
  email: string;
  role: Role;
  plan: SubscriptionPlan;
  referredBy: string | null;
  createdAt: string;
  usageCount: number;
  lastActive: string;
}

export interface SaaSAdminAction {
  id: string;
  adminEmail: string;
  action: string;
  targetEmail: string;
  notes: string;
  createdAt: string;
}

export interface SaaSSubscription {
  id: string;
  userEmail: string;
  razorpaySubId: string;
  status: SubStatus;
  startedAt: string;
  expiresAt: string;
}

