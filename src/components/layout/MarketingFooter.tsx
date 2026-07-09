import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-3">
          <p className="font-display font-bold text-slate-900 dark:text-white text-lg">DigiBlend</p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Focused AI utilities for faster marketing execution across SEO, social, outreach, and ads.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-3">Product</p>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link href="/tools" className="hover:text-indigo-500">AI Utilities</Link></li>
            <li><Link href="/pricing" className="hover:text-indigo-500">Pricing</Link></li>
            <li><Link href="/app" className="hover:text-indigo-500">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-3">Resources</p>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link href="/faq" className="hover:text-indigo-500">FAQ</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-indigo-500">How It Works</Link></li>
            <li><Link href="/#use-cases" className="hover:text-indigo-500">Use Cases</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-3">Legal</p>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><a href="mailto:hello@digiblend.in" className="hover:text-indigo-500">Contact</a></li>
            <li><span>Privacy Policy</span></li>
            <li><span>Terms of Service</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-400 dark:text-slate-600">
        © {new Date().getFullYear()} DigiBlend. Built for freelancers, indie makers, and small teams.
      </div>
    </footer>
  );
}
