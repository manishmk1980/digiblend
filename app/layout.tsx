import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import OptionalClerkProvider from './clerk-provider';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'DigiBlend | AI utilities for faster marketing execution',
  description:
    'Focused AI utilities for SEO metadata, social bios, cold emails, ad copy, and marketing content for freelancers and small teams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <OptionalClerkProvider>{children}</OptionalClerkProvider>
      </body>
    </html>
  );
}
