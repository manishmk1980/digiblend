import type { Metadata } from 'next';
import { MarketingShell } from '@/src/components/layout/MarketingShell';
import { ToolsDirectory } from '@/src/components/marketing/ToolsDirectory';

export const metadata: Metadata = {
  title: 'AI Utilities Directory | DigiBlend',
  description:
    'Browse focused AI utilities for SEO metadata, social bios, cold emails, ad copy, landing pages, and content planning.',
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <ToolsDirectory />
    </MarketingShell>
  );
}
