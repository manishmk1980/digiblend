'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';
import { isClerkPubliclyConfigured } from '@/src/lib/clerk-config';

export type ClerkAuthPromptApi = {
  ensureAuthenticated: () => boolean;
};

type ClerkAuthPromptBridgeProps = {
  onReady: (api: ClerkAuthPromptApi) => void;
};

function ClerkAuthPromptBridgeInner({ onReady }: ClerkAuthPromptBridgeProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignUp } = useClerk();

  useEffect(() => {
    onReady({
      ensureAuthenticated: () => {
        if (isSignedIn) {
          return true;
        }

        if (!isLoaded) {
          return false;
        }

        openSignUp({});
        return false;
      },
    });
  }, [isLoaded, isSignedIn, onReady, openSignUp]);

  return null;
}

export function ClerkAuthPromptBridge({ onReady }: ClerkAuthPromptBridgeProps) {
  if (!isClerkPubliclyConfigured()) {
    return null;
  }

  return <ClerkAuthPromptBridgeInner onReady={onReady} />;
}
