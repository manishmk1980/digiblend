'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { isClerkPubliclyConfigured } from '@/src/lib/clerk-config';

type ClerkSessionBridgeProps = {
  onSession: (session: { email: string; role: 'CUSTOMER' | 'ADMIN' }) => void;
};

export function ClerkSessionBridge({ onSession }: ClerkSessionBridgeProps) {
  if (!isClerkPubliclyConfigured()) {
    return null;
  }

  return <ClerkSessionBridgeInner onSession={onSession} />;
}

function ClerkSessionBridgeInner({ onSession }: ClerkSessionBridgeProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const role = user.publicMetadata?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    onSession({ email, role });
  }, [isLoaded, isSignedIn, user, onSession]);

  return null;
}
