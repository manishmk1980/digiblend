import type { Metadata } from 'next';
import { MarketingShell } from '@/src/components/layout/MarketingShell';
import { FaqPageContent } from '@/src/components/marketing/FaqPageContent';
import { JsonLd } from '@/src/components/marketing/JsonLd';
import { HOMEPAGE_FAQS } from '@/src/lib/marketing-content';

export const metadata: Metadata = {
  title: 'FAQ | DigiBlend',
  description: 'Frequently asked questions about DigiBlend AI marketing utilities, pricing, and use cases.',
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <JsonLd
        data={{
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
        }}
      />
      <FaqPageContent />
    </MarketingShell>
  );
}
