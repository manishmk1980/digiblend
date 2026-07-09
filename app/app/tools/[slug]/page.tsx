import { notFound } from 'next/navigation';
import ClientPage from '../../../client-page';
import { TOOLS } from '@/src/types';

type AppToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export default async function AppToolPage({ params }: AppToolPageProps) {
  const { slug } = await params;
  const tool = TOOLS.find((item) => item.slug === slug);

  if (!tool) {
    notFound();
  }

  return <ClientPage appMode initialSection="tools" initialToolSlug={slug} />;
}
