import type { Metadata } from 'next';
import { MarketingShell } from '@/src/components/layout/MarketingShell';
import { JsonLd } from '@/src/components/marketing/JsonLd';
import { MarketingHomepage } from '@/src/components/marketing/MarketingHomepage';
import { HOMEPAGE_FAQS } from '@/src/lib/marketing-content';

export const metadata: Metadata = {
  title: 'DigiBlend | AI utilities for faster marketing execution',
  description:
    'Create SEO metadata, social bios, cold emails, ad copy, and marketing content faster with focused AI tools built for freelancers, indie makers, and small teams.',
};

export default function HomePage() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://digiblend.in').replace(/\/$/, '');

  return (
    <MarketingShell>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'DigiBlend',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Focused AI utilities for SEO metadata, social bios, cold emails, ad copy, and marketing content.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            url: siteUrl,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: HOMEPAGE_FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]}
      />
      <MarketingHomepage />
    </MarketingShell>
  );
}
