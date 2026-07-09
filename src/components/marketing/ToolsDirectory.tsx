import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { MARKETING_TOOLS } from '@/src/lib/marketing-content';

export function ToolsDirectory() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="max-w-3xl mb-10 space-y-4">
        <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white">AI Utilities Directory</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Browse focused AI utilities for SEO, social media, outreach, ads, landing pages, and content planning. Each
          tool includes public documentation for search engines and AI agents, with the working generator available after
          sign-in.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MARKETING_TOOLS.map((tool) => (
          <article
            key={tool.seoSlug}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20 mb-4">
              <Zap className="w-3 h-3" />
              {tool.badge}
            </span>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">{tool.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{tool.description}</p>
            <p className="text-xs text-slate-500 mb-5">
              <strong className="text-slate-700 dark:text-slate-300">For:</strong> {tool.audience}
            </p>
            <Link
              href={`/tools/${tool.seoSlug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400"
            >
              View tool details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
