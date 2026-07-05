'use client';

import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { LogIn, UserPlus } from 'lucide-react';
import { isClerkPubliclyConfigured } from '@/src/lib/clerk-config';

export function ClerkAuthControls() {
  if (!isClerkPubliclyConfigured()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
            <LogIn className="w-3.5 h-3.5" />
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="hidden sm:flex px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 transition-colors items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5" />
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
          <UserButton />
        </div>
      </Show>
    </div>
  );
}
