import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Database,
  FileText,
  Gauge,
  Globe,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
  Upload,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

interface CustomerLandingPageProps {
  currentAccent: {
    fromTo: string;
    text: string;
    bg: string;
    border: string;
    badge: string;
  };
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  authReferral: string;
  setAuthReferral: (val: string) => void;
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
  authError: string | null;
  authSuccess: string | null;
  onAuthSubmit: (e: React.FormEvent) => void;
  onExploreTools: () => void;
  triggerProCheckout: () => void;
}

type AuditSnapshot = {
  score: number;
  companySummary: string;
  visibleGaps: AuditFinding[];
  premiumPreviewLabels: string[];
  conversionHeadline: string;
};

type AuditFinding = {
  finding: string;
  evidence: string;
  whyImportant: string;
  howToFix: string;
  confidence: 'High' | 'Medium' | 'Low';
};

type ScanState = 'idle' | 'scanning' | 'preview' | 'onboarding' | 'processing' | 'ready';
type AuditFocus = 'Customer Support' | 'Sales Outbound' | 'Marketing/Content' | 'Internal Operations';

const fallbackSnapshot: AuditSnapshot = {
  score: 62,
  companySummary:
    'This AI snapshot found a service-led business with useful positioning, but several workflow signals indicate the buyer journey still depends on manual follow-up and disconnected intake steps.',
  visibleGaps: [
    {
      finding: 'The primary conversion path needs a scored intake workflow.',
      evidence: 'The public snapshot can see the page and CTA flow, but cannot verify CRM routing or qualification rules.',
      whyImportant: 'High-intent visitors should be prioritized automatically so sales or support can respond faster.',
      howToFix: 'Add a short diagnostic form or chat handoff that captures urgency, company type, issue category, and next action, then route it into CRM.',
      confidence: 'Medium',
    },
    {
      finding: 'Service messaging needs stronger measurable outcomes.',
      evidence: 'The public journey describes services, but operational metrics such as response targets or saved hours are not always visible above the fold.',
      whyImportant: 'Specific metrics help buyers understand the commercial upside of an audit before they speak to the team.',
      howToFix: 'Add proof points for audit turnaround, response targets, enquiry conversion improvements, and delivery cadence near the main CTA.',
      confidence: 'Medium',
    },
    {
      finding: 'Deep AI-readiness cannot be verified from the homepage alone.',
      evidence: 'Internal process data, sample CRM rows, ticket history, and SLA performance are private and unavailable to the public scan.',
      whyImportant: 'AI recommendations are only reliable when grounded in real workflows, data shape, and exception handling.',
      howToFix: 'Use the paid onboarding step to collect sanitized CSV samples and operational notes, then generate a verified system blueprint.',
      confidence: 'High',
    },
  ],
  premiumPreviewLabels: [
    'Tailored $15k/year cost-savings action plan',
    'Internal tool interoperability map',
    'Data compliance vulnerability review',
    '90-day implementation sprint blueprint',
  ],
  conversionHeadline:
    'Your automated snapshot reveals high-risk operational bottlenecks in the customer onboarding workflow.',
};

const scanLogs = [
  '[CONNECTING] Fetching public source signals...',
  '[EXTRACTING] Parsing metadata, headings, and value propositions...',
  '[ANALYZING] Evaluating workflow friction and GTM clarity...',
  '[MODELING] Generating AI efficiency readiness score...',
  '[LOCKING] Preparing restricted deep-dive roadmap preview...',
];

const focusOptions: AuditFocus[] = ['Customer Support', 'Sales Outbound', 'Marketing/Content', 'Internal Operations'];

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isLikelyUrl(value: string) {
  try {
    const url = new URL(normalizeUrl(value));
    return Boolean(url.hostname.includes('.') && url.hostname.length > 3);
  } catch {
    return false;
  }
}

function normalizeFinding(value: unknown): AuditFinding {
  if (typeof value === 'string') {
    return {
      finding: value,
      evidence: 'Generated from a public-input snapshot. Needs evidence validation.',
      whyImportant: 'A useful audit finding should connect the observed issue to buyer friction, response delay, or lost operational leverage.',
      howToFix: 'Validate the page evidence, then convert the issue into a specific workflow, content, CRM, or support-process change.',
      confidence: 'Low',
    };
  }

  const record = (value || {}) as Partial<AuditFinding>;
  return {
    finding: record.finding || 'Workflow improvement opportunity identified.',
    evidence: record.evidence || 'Not verified in the public snapshot.',
    whyImportant: record.whyImportant || 'This matters because unresolved workflow gaps reduce conversion confidence and slow follow-up.',
    howToFix: record.howToFix || 'Map the current step, assign an owner, add tracking, and automate the handoff where possible.',
    confidence: record.confidence === 'High' || record.confidence === 'Low' ? record.confidence : 'Medium',
  };
}

export default function CustomerLandingPage({
  currentAccent,
  authEmail,
  setAuthEmail,
  authReferral,
  setAuthReferral,
  isSignUp,
  setIsSignUp,
  authError,
  authSuccess,
  onAuthSubmit,
  onExploreTools,
}: CustomerLandingPageProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [operationalFocus, setOperationalFocus] = useState<AuditFocus>('Customer Support');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [snapshot, setSnapshot] = useState<AuditSnapshot | null>(null);
  const [showAuditGate, setShowAuditGate] = useState(false);
  const [auditCheckoutStep, setAuditCheckoutStep] = useState<'pitch' | 'checkout' | 'success'>('pitch');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [auditEmail, setAuditEmail] = useState('');
  const [auditPassword, setAuditPassword] = useState('');
  const [operationalNotes, setOperationalNotes] = useState('');
  const [sampleFileName, setSampleFileName] = useState('');

  const activeSnapshot = snapshot || fallbackSnapshot;
  const scanProgress = scanState === 'scanning' ? Math.min(100, ((activeLogIndex + 1) / scanLogs.length) * 100) : 100;

  const timeline = useMemo(
    () => [
      'Audit intake locked and queued for engineer review',
      'Workflow bottlenecks mapped against AI automation patterns',
      'Sample data reviewed for enrichment and routing readiness',
      'Implementation sync prepared for founder or operations lead',
    ],
    [],
  );

  useEffect(() => {
    if (scanState !== 'scanning') return;
    const timer = setInterval(() => {
      setActiveLogIndex((current) => Math.min(current + 1, scanLogs.length - 1));
    }, 720);
    return () => clearInterval(timer);
  }, [scanState]);

  const runSnapshotScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanError(null);

    if (!isLikelyUrl(websiteUrl)) {
      setScanError('Enter a valid company website, for example primewayz.co.uk.');
      return;
    }

    setScanState('scanning');
    setActiveLogIndex(0);
    setSnapshot(null);

    try {
      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 3800));
      const responsePromise = fetch('/api/audit/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: normalizeUrl(websiteUrl),
          operationalFocus,
        }),
      });

      const [response] = await Promise.all([responsePromise, minimumDelay]);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Snapshot scan failed.');
      }

      setSnapshot({
        score: Number(data.score) || fallbackSnapshot.score,
        companySummary: data.companySummary || fallbackSnapshot.companySummary,
        visibleGaps:
          Array.isArray(data.visibleGaps) && data.visibleGaps.length
            ? data.visibleGaps.slice(0, 3).map(normalizeFinding)
            : fallbackSnapshot.visibleGaps,
        premiumPreviewLabels:
          Array.isArray(data.premiumPreviewLabels) && data.premiumPreviewLabels.length
            ? data.premiumPreviewLabels.slice(0, 4)
            : fallbackSnapshot.premiumPreviewLabels,
        conversionHeadline: data.conversionHeadline || fallbackSnapshot.conversionHeadline,
      });
      setScanState('preview');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Snapshot scan failed.';
      setScanError(message);
      setSnapshot(fallbackSnapshot);
      setScanState('preview');
    }
  };

  const startAuditCheckout = () => {
    setAuditCheckoutStep('pitch');
    setShowAuditGate(true);
  };

  const completeAuditPayment = () => {
    setAuditCheckoutStep('checkout');
    setTimeout(() => {
      setAuditCheckoutStep('success');
    }, 900);
  };

  const enterClientWorkspace = () => {
    setShowAuditGate(false);
    setScanState('onboarding');
    setOnboardingStep(1);
  };

  const submitDeepDiveAudit = () => {
    setScanState('processing');
    setTimeout(() => {
      setScanState('ready');
    }, 1600);
  };

  return (
    <div className="space-y-14 py-8 animate-fade-in font-sans">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 md:p-10 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.16),transparent_36%),radial-gradient(circle_at_12%_85%,rgba(20,184,166,0.12),transparent_30%)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          <div className="xl:col-span-6 space-y-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentAccent.badge}`}>
              <Sparkles className="w-3.5 h-3.5" />
              Free AI efficiency snapshot
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.04]">
                Analyze Your Business Workflow in <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentAccent.fromTo}`}>60 Seconds</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                Get a free AI efficiency tear-down for your company website, preview hidden GTM bottlenecks, then unlock a paid engineering audit when the opportunity is real.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                ['Snapshot Score', 'AI readiness benchmark'],
                ['3 Real Gaps', 'Messaging and workflow flaws'],
                ['$1,500 Audit', 'Deep-data engineering roadmap'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-6">
            <form onSubmit={runSnapshotScan} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-5 md:p-6 shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-500">Audit Intake</p>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Run Snapshot Scan</h2>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="space-y-1.5 block">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Website URL</span>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="yourcompany.com"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Primary operations bottleneck</span>
                  <select
                    value={operationalFocus}
                    onChange={(e) => setOperationalFocus(e.target.value as AuditFocus)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {focusOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              {scanError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <p>{scanError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={scanState === 'scanning'}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${currentAccent.fromTo} hover:opacity-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2`}
              >
                <Zap className="w-4 h-4" />
                {scanState === 'scanning' ? 'Scanning Workflow...' : 'Run Snapshot Scan'}
              </button>

              <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-relaxed">
                Demo MVP note: this is an AI-generated public snapshot, not a verified deep technical audit.
              </p>
            </form>
          </div>
        </div>
      </section>

      {scanState === 'scanning' && (
        <section className="rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400">Live Pipeline</p>
              <h2 className="text-2xl font-black mt-2">Building your AI audit snapshot</h2>
            </div>
            <div className="relative w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-l-transparent animate-spin" />
              <span className="font-mono font-black text-sm">{Math.round(scanProgress)}%</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 font-mono text-xs">
            {scanLogs.slice(0, activeLogIndex + 1).map((log) => (
              <div key={log} className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{log.replace('source signals', normalizeUrl(websiteUrl))}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(scanState === 'preview' || scanState === 'onboarding' || scanState === 'processing' || scanState === 'ready') && (
        <section className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Readiness Score</p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white mt-3">{activeSnapshot.score}<span className="text-lg text-slate-400">/100</span></p>
                </div>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentAccent.fromTo} p-1`}>
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                    <Gauge className={`w-8 h-8 ${currentAccent.text}`} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-5">{activeSnapshot.companySummary}</p>
            </div>

            <div className="lg:col-span-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500">Visible AI Findings</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">Evidence-based conversion and workflow findings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                This preview separates observed public-page signals from deeper assumptions that require paid data access.
              </p>
              <div className="grid grid-cols-1 gap-3 mt-5">
                {activeSnapshot.visibleGaps.map((gap, index) => (
                  <div key={`${gap.finding}-${index}`} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <span className={`inline-flex w-7 h-7 rounded-lg ${currentAccent.bg} text-white items-center justify-center text-xs font-black shrink-0`}>{index + 1}</span>
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{gap.finding}</h3>
                          <span className="w-max rounded-full border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {gap.confidence} confidence
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Evidence</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{gap.evidence}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Why Important</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{gap.whyImportant}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">How To Fix</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{gap.howToFix}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {scanState === 'preview' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-6 md:p-8 shadow-2xl text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-amber-400">Restricted Deep Dive</p>
                  <h2 className="text-2xl font-black mt-2">{activeSnapshot.conversionHeadline}</h2>
                </div>
                <button
                  type="button"
                  onClick={startAuditCheckout}
                  className="px-5 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  Lock In Your System Audit - $1,500
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                {activeSnapshot.premiumPreviewLabels.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={startAuditCheckout}
                    className="relative min-h-36 text-left rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden group"
                  >
                    <div className="absolute inset-0 backdrop-blur-[7px] bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors" />
                    <div className="relative z-10 space-y-3">
                      {[Database, ShieldCheck, Layers, Workflow][index % 4] &&
                        React.createElement([Database, ShieldCheck, Layers, Workflow][index % 4], { className: 'w-5 h-5 text-indigo-300' })}
                      <p className="text-sm font-bold">{label}</p>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300">
                        <Lock className="w-3 h-3" />
                        Unlock with audit
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {scanState === 'onboarding' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500">Client Workspace</p>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">Secure Deep-Data Onboarding</h2>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((step) => (
                    <span key={step} className={`w-9 h-2 rounded-full ${step <= onboardingStep ? currentAccent.bg : 'bg-slate-200 dark:bg-slate-800'}`} />
                  ))}
                </div>
              </div>

              {onboardingStep === 1 && (
                <div className="space-y-4">
                  <textarea
                    value={operationalNotes}
                    onChange={(e) => setOperationalNotes(e.target.value)}
                    placeholder="List your top 3 tedious, repeating manual tasks..."
                    className="w-full min-h-40 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button onClick={() => setOnboardingStep(2)} className={`px-5 py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm`}>
                    Continue to data sample
                  </button>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center min-h-52 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 cursor-pointer text-center p-8">
                    <Upload className="w-8 h-8 text-indigo-500" />
                    <span className="font-bold text-slate-900 dark:text-white mt-3">{sampleFileName || 'Upload sample CSV'}</span>
                    <span className="text-xs text-slate-500 mt-1">20-50 CRM leads or customer rows. UI-only in Demo MVP.</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={(e) => setSampleFileName(e.target.files?.[0]?.name || '')}
                    />
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => setOnboardingStep(1)} className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm">
                      Back
                    </button>
                    <button onClick={() => setOnboardingStep(3)} className={`px-5 py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm`}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Initialize Comprehensive System Audit?</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    This locks your demo intake and simulates hand-off to the internal audit queue for engineer review.
                  </p>
                  <button onClick={submitDeepDiveAudit} className={`px-5 py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm`}>
                    Initialize Deep-Dive System Audit
                  </button>
                </div>
              )}
            </div>
          )}

          {scanState === 'processing' && (
            <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6 md:p-8 text-center space-y-3">
              <Clock className="w-8 h-8 text-indigo-500 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your deep audit is processing</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Our engineers are generating your deep audit; your report will go live within 24 hours.</p>
            </div>
          )}

          {scanState === 'ready' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
              <div className={`p-6 md:p-8 bg-gradient-to-r ${currentAccent.fromTo} text-white`}>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/70">Audit Complete</p>
                <h2 className="text-3xl font-black mt-2">AI Operational Efficiency Blueprint</h2>
                <p className="text-sm text-white/80 mt-2 max-w-2xl">Your restricted roadmap is now unblurred for the demo workflow.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 md:p-8">
                {timeline.map((item, index) => (
                  <div key={item} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <span className="text-[10px] font-mono font-bold text-indigo-500">STEP {index + 1}</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">{item}</p>
                  </div>
                ))}
              </div>
              <div className="sticky bottom-0 p-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">Next step: turn the blueprint into a scoped implementation sprint.</p>
                <button className={`px-5 py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm flex items-center justify-center gap-2`}>
                  Request System Implementation Sync
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['1,420+', 'Active workflow snapshots'],
          ['$15k+', 'Modeled savings target'],
          ['24 hrs', 'Audit review window'],
          ['83%', 'High-intent sync goal'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center">
            <span className="block text-2xl md:text-3xl font-black font-mono text-slate-900 dark:text-white">{value}</span>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mt-1">{label}</span>
          </div>
        ))}
      </section>

      <section className="space-y-8 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest">What the audit maps</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            From anonymous visitor to implementation-ready client
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {[
            ['Free Hook', 'Public website snapshot and AI readiness score.', Terminal],
            ['Gated Value', 'Visible gaps plus blurred cost-saving assets.', Lock],
            ['Order Gate', '$1,500 simulated engineering audit checkout.', CircleDollarSign],
            ['Client Dashboard', 'Secure onboarding and implementation sync.', BarChart],
          ].map(([title, body, Icon]) => (
            <div key={title as string} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              {React.createElement(Icon as typeof Terminal, { className: `w-5 h-5 ${currentAccent.text}` })}
              <h3 className="font-bold text-slate-900 dark:text-white mt-4">{title as string}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{body as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Existing app access</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Client workspace for your business</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Each subscribed customer gets a separate workspace for audit history, generated assets, uploaded samples, usage limits, and billing status. Super-admin access is managed separately.
            </p>
            <button onClick={onExploreTools} className={`px-5 py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm`}>
              Explore AI Utilities
            </button>
          </div>

          <form onSubmit={onAuthSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-4" id="register">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500">Customer Tenant Access</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{isSignUp ? 'Create a customer workspace' : 'Sign in to customer workspace'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Use this for client teams, subscription users, and tenant history. Super admins use the dedicated admin console.
              </p>
            </div>

            {(authError || authSuccess) && (
              <div className={`rounded-xl p-3 text-xs ${authError ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {authError || authSuccess}
              </div>
            )}

            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {isSignUp && (
              <input
                type="text"
                value={authReferral}
                onChange={(e) => setAuthReferral(e.target.value)}
                placeholder="Referral code optional"
                className="w-full px-3.5 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            )}
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors">
              {isSignUp ? 'Create Customer Workspace' : 'Sign In to Workspace'}
            </button>
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-xs font-bold text-indigo-500 hover:underline">
              {isSignUp ? 'Already subscribed? Sign in' : 'New customer? Create workspace'}
            </button>
          </form>
        </div>
      </section>

      {showAuditGate && (
        <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500">Engineering Audit Gate</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Automated scripts can only scrape the surface.</h3>
              </div>
              <button onClick={() => setShowAuditGate(false)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {auditCheckoutStep === 'pitch' && (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    To calculate your exact software integration stack, evaluate data isolation protocols, and run your actual data sample through our processing pipeline, unlock the full Deep-Dive Engineering Audit.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Engineer-reviewed roadmap', 'Sample CRM processing', 'Implementation sync path'].map((item) => (
                      <div key={item} className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <button onClick={completeAuditPayment} className={`w-full py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm`}>
                    Lock In Your System Audit - $1,500
                  </button>
                </>
              )}

              {auditCheckoutStep === 'checkout' && (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Processing secure audit checkout...</p>
                </div>
              )}

              {auditCheckoutStep === 'success' && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    Payment simulation complete. Create your client workspace access.
                  </div>
                  <input
                    type="email"
                    value={auditEmail}
                    onChange={(e) => setAuditEmail(e.target.value)}
                    placeholder="work@email.com"
                    className="w-full px-3.5 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="password"
                    value={auditPassword}
                    onChange={(e) => setAuditPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-3.5 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                  <button onClick={enterClientWorkspace} className={`w-full py-3 rounded-xl ${currentAccent.bg} text-white font-bold text-sm`}>
                    Claim Client Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
