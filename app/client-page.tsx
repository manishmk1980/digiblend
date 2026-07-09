'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../src/App'), {
  ssr: false,
});

export type ClientPageProps = {
  appMode?: boolean;
  initialSection?: 'tools' | 'pricing' | 'account' | 'admin';
  initialToolSlug?: string;
};

export default function ClientPage({ appMode = false, initialSection = 'tools', initialToolSlug }: ClientPageProps) {
  return <App appMode={appMode} initialSection={initialSection} initialToolSlug={initialToolSlug} />;
}
