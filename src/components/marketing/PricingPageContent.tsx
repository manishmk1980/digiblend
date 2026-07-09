import Link from 'next/link';

export function PricingPageContent() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white">Simple pricing for focused AI utilities</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Start free with daily usage limits. Upgrade to Pro for higher limits, saved history, and premium outputs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Free</h2>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">$0</p>
          <p className="text-sm text-slate-500 mt-1">Try focused AI utilities with limited daily usage.</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Daily generation limits</li>
            <li>Core AI utilities</li>
            <li>Structured marketing outputs</li>
          </ul>
          <Link href="/sign-up" className="inline-flex mt-8 px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800">
            Start Free
          </Link>
        </article>

        <article className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Pro</h2>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">Upgrade</p>
          <p className="text-sm text-slate-500 mt-1">Higher usage limits, saved history, premium tools, and advanced outputs.</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Unlimited daily generations</li>
            <li>Usage history and account tools</li>
            <li>Premium utilities and outputs</li>
          </ul>
          <Link href="/app" className="inline-flex mt-8 px-5 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700">
            Go Pro in App
          </Link>
        </article>
      </div>
    </div>
  );
}
