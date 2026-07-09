import type { ReactNode } from 'react';
import { MarketingFooter } from '@/src/components/layout/MarketingFooter';
import { MarketingHeader } from '@/src/components/layout/MarketingHeader';

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <MarketingHeader />
      <main className="flex-grow relative z-10">{children}</main>
      <MarketingFooter />
    </div>
  );
}
