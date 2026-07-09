import { HOMEPAGE_FAQS } from '@/src/lib/marketing-content';

export function FaqPageContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white">Frequently asked questions</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Answers about DigiBlend, who it is for, how it compares to generic chat tools, and how pricing works.
        </p>
      </div>

      <div className="space-y-4">
        {HOMEPAGE_FAQS.map((faq) => (
          <article key={faq.question} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
