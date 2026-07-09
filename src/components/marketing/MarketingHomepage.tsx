import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import {
  HOMEPAGE_FAQS,
  HOW_IT_WORKS,
  MARKETING_TOOLS,
  USE_CASES,
  WHY_DIGIBLEND,
} from '@/src/lib/marketing-content';

function ToolCard({
  name,
  badge,
  description,
  audience,
  href,
  comingSoon,
}: {
  name: string;
  badge: string;
  description: string;
  audience: string;
  href: string;
  comingSoon?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20">
          <Zap className="w-3 h-3" />
          {badge}
        </span>
        {comingSoon ? (
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500">Coming soon</span>
        ) : null}
      </div>
      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{description}</p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-5">
        <strong className="text-slate-700 dark:text-slate-300">Who it helps:</strong> {audience}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80"
      >
        {comingSoon ? 'Learn more' : 'Try this tool'}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );
}

export function MarketingHomepage() {
  const featuredTools = MARKETING_TOOLS.slice(0, 6);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20">
              <Sparkles className="w-3 h-3" />
              Focused AI utilities for marketers
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              AI utilities for faster marketing execution
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Create SEO metadata, social bios, cold emails, ad copy, and marketing content faster with focused AI tools
              built for freelancers, indie makers, and small teams.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 shadow-md"
              >
                Start Free
              </Link>
              <Link
                href="/tools"
                className="px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Explore AI Utilities
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-slate-500">Product preview</p>
              <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Structured output
              </span>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/60">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">SEO Meta Tag Generator</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">DigiBlend | AI Marketing Utilities</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Generate SEO titles, descriptions, Open Graph tags, and Twitter cards from simple business inputs.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Example workflow</p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Choose a utility</li>
                  <li>Add audience and keywords</li>
                  <li>Generate structured copy</li>
                  <li>Edit and ship</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-14 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Marketing execution is slow when every task starts from a blank page
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            DigiBlend gives you focused AI utilities for common marketing tasks, so you can create, refine, and ship
            content faster.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Core AI utilities</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Explore focused tools as feature cards. Each utility is designed for a specific marketing workflow.
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <ToolCard
              key={tool.seoSlug}
              name={tool.name}
              badge={tool.badge}
              description={tool.description}
              audience={tool.audience}
              href={`/tools/${tool.seoSlug}`}
              comingSoon={tool.comingSoon}
            />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">How it works</h2>
          </div>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold mb-3">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="use-cases" className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Use cases</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {USE_CASES.map((useCase) => (
            <article
              key={useCase.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
            >
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{useCase.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Why DigiBlend is different</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              ChatGPT is flexible, but every task needs prompt writing. DigiBlend gives you ready-made AI utilities with
              structured inputs, marketing-focused outputs, and repeatable workflows.
            </p>
            <ul className="space-y-3">
              {WHY_DIGIBLEND.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Why not just use ChatGPT?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generic chat tools require you to invent prompts, remember output formats, and rebuild context for every
              task. DigiBlend packages marketing workflows into focused utilities with predictable structure, so you
              spend less time prompting and more time shipping.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-600/10 via-transparent to-cyan-500/10 p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Free</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Try focused AI utilities with limited daily usage.
              </p>
            </article>
            <article className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Pro</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Higher usage limits, saved history, premium tools, and advanced outputs.
              </p>
            </article>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/pricing" className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700">
              View Pricing
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
        </div>
        <div className="space-y-4">
          {HOMEPAGE_FAQS.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </article>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/faq" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80">
            View all FAQs
          </Link>
        </div>
      </section>
    </>
  );
}
