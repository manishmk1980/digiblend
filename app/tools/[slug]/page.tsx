import ClientPage from '../../client-page';
import { TOOLS } from '@/src/types';

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = TOOLS.find((item) => item.slug === slug);

  return {
    title: tool ? `${tool.name} | DigiBlend` : 'AI Tool | DigiBlend',
    description: tool?.description || 'AI-powered marketing and GTM utility from DigiBlend.',
  };
}

export default function ToolPage() {
  return <ClientPage />;
}
