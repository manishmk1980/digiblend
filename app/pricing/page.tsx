import type { Metadata } from 'next';
import { MarketingShell } from '@/src/components/layout/MarketingShell';
import { PricingPageContent } from '@/src/components/marketing/PricingPageContent';

export const metadata: Metadata = {
  title: 'Pricing | DigiBlend',
  description: 'Simple pricing for focused AI marketing utilities. Start free or upgrade to Pro.',
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <PricingPageContent />
    </MarketingShell>
  );
}
