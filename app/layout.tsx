import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'DigiBlend',
  description: 'AI-powered GTM and marketing utilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
