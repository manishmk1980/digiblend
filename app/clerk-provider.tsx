'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { getClerkPublishableKey } from '@/src/lib/clerk-config';

export default function OptionalClerkProvider({ children }: { children: ReactNode }) {
  const publishableKey = getClerkPublishableKey();

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
