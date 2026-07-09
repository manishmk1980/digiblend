import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { MarketingTool } from '@/src/lib/marketing-content';
import { MARKETING_TOOLS } from '@/src/lib/marketing-content';

export function ToolSeoPage({ tool }: { tool: MarketingTool }) {
  const relatedTools = MARKETING_TOOLS.filter((item) => item.seoSlug !== tool.seoSlug).slice(0, 3);
  const appHref = tool.comingSoon ? '/sign-up' : `/app/tools/${tool.appSlug}`;

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-16">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-500 mb-3">{tool.badge}</p>
        <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-4">{tool.name}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{tool.description}</p>
      </div>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Who it is for</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tool.audience}</p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">How to use it</h2>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li>Sign in to DigiBlend and open the utility workspace.</li>
          <li>Add your business context, audience, and keywords using structured inputs.</li>
          <li>Generate marketing copy and refine the output for your workflow.</li>
          <li>Export or paste the result into your CMS, ad platform, or outreach tool.</li>
        </ol>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Example input</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{tool.exampleInput}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Example output</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{tool.exampleOutput}</p>
        </section>
      </div>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">FAQs</h2>
        <div className="space-y-3">
          {tool.faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 mb-10">
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Ready to try {tool.name}?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {tool.comingSoon
            ? 'This utility is on the roadmap. Create a free account to get notified when it launches.'
            : 'Sign in to open the working generator and start creating structured marketing copy.'}
        </p>
        <Link
          href={appHref}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500"
        >
          {tool.comingSoon ? 'Start Free' : 'Try this tool'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">Related tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedTools.map((related) => (
            <Link
              key={related.seoSlug}
              href={`/tools/${related.seoSlug}`}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-indigo-500/30 transition-colors"
            >
              <p className="font-semibold text-sm text-slate-900 dark:text-white">{related.name}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{related.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
