import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/src/components/layout/MarketingShell';
import { JsonLd } from '@/src/components/marketing/JsonLd';
import { ToolSeoPage } from '@/src/components/marketing/ToolSeoPage';
import { getMarketingToolBySeoSlug, MARKETING_TOOLS } from '@/src/lib/marketing-content';

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return MARKETING_TOOLS.map((tool) => ({ slug: tool.seoSlug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getMarketingToolBySeoSlug(slug);

  if (!tool) {
    return {
      title: 'AI Tool | DigiBlend',
    };
  }

  return {
    title: `${tool.name} | DigiBlend`,
    description: tool.description,
  };
}

export default async function PublicToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getMarketingToolBySeoSlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <MarketingShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.name,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: tool.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />
      <ToolSeoPage tool={tool} />
    </MarketingShell>
  );
}
