import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Zap, 
  ArrowRight, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp, 
  MessageSquare, 
  Youtube, 
  ShoppingBag, 
  Linkedin,
  Star,
  Users,
  Award,
  HelpCircle,
  Key,
  Globe
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

export default function CustomerLandingPage({
  currentAccent,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authReferral,
  setAuthReferral,
  isSignUp,
  setIsSignUp,
  authError,
  authSuccess,
  onAuthSubmit,
  onExploreTools,
  triggerProCheckout
}: CustomerLandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: 'Active Copywriters', value: '1,420+' },
    { label: 'AI Copies Generated', value: '45,000+' },
    { label: 'Time Saved / Week', value: '12 Hours' },
    { label: 'Conversion Lift', value: '28.4%' }
  ];

  const features = [
    {
      title: 'Cold Email Personalizer',
      description: 'Convert cold leads into loyal customers with highly hyper-personalized intro lines grounded in company profile data.',
      icon: Mail,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: 'SEO Blog Title Generator',
      description: 'Generate high-CTR, scroll-stopping headlines optimized with custom target keywords and specific reader personas.',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Shopify Product Describer',
      description: 'Turn feature specs into bulletproof, benefit-first product copy that addresses direct customer objections.',
      icon: ShoppingBag,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10'
    },
    {
      title: 'YouTube Tag Optimizer',
      description: 'Supercharge video search visibility and algorithmic relevance by creating highly targeted, relevant tags.',
      icon: Youtube,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'LinkedIn Post Hook Architect',
      description: 'Banish the "See More" skip. Structure compelling scroll-stopping hooks tailored to your target professional industry.',
      icon: Linkedin,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  const faqs = [
    {
      question: 'What is DigiBlend.in and who is it for?',
      answer: 'DigiBlend is an AI-powered copywriting and SEO workflow accelerator designed specifically for solopreneurs, digital marketers, and freelance copywriters to create high-performing marketing copy in seconds.'
    },
    {
      question: 'Do I need a credit card to register for a free account?',
      answer: 'No! You can register with just an email address. Free accounts receive 3 daily credits to run any of our premium AI utilities.'
    },
    {
      question: 'How does the Gemini AI integration work?',
      answer: 'Our tools are fully backed by the state-of-the-art Google Gemini LLM API, ensuring high-speed generation, context-aware reasoning, and conversion-optimized structure for all copywriting models.'
    },
    {
      question: 'What is included in the Pro Plan?',
      answer: 'The Pro Plan provides unlimited daily generations, priority high-speed AI pipelines, advanced options, and exclusive access to new weekly copywriting scaffolds as they launch.'
    }
  ];

  return (
    <div className="space-y-16 py-8 animate-fade-in font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-8 md:p-14 shadow-xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-500/5 dark:bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Hero content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentAccent.badge}`}>
              <Sparkles className="w-3.5 h-3.5" /> No Credit Card Required
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Convert Audiences with <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentAccent.fromTo}`}>DigiBlend AI</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Ditch writer's block. Scale SEO traffic and personal branding using our 5 conversion-optimized copywriting tools tailored for modern solopreneurs.
            </p>

            {/* Quick value props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>5 Premium Copy Scaffolds</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>State-of-the-Art Gemini API</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Responsive Design Themes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>3 Free Invocations Everyday</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreTools}
                className={`px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${currentAccent.fromTo} hover:opacity-90 transition-all shadow-md shadow-indigo-500/10 flex items-center gap-2 cursor-pointer`}
              >
                ⚡ Explore AI Tools
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href="#register"
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              >
                Create Account <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Hero: Registration form card */}
          <div id="register" className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest block">Interactive Sandbox</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isSignUp ? 'Claim Your Free Access' : 'Sign In to Your Workspace'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSignUp ? 'Get 3 free credits daily to try all AI engines' : 'Enter your credential email to restore your session'}
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 dark:text-rose-400 font-medium leading-relaxed">
                ⚠️ {authError}
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed">
                🎉 {authSuccess}
              </div>
            )}

            <form onSubmit={onAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono shadow-sm"
                />
              </div>

              {isSignUp && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Referral Code (Optional)</label>
                  <input
                    type="text"
                    value={authReferral}
                    onChange={(e) => setAuthReferral(e.target.value)}
                    placeholder="e.g., twitter_promo, alex.hacker"
                    className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono shadow-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSignUp ? 'Register Free Account' : 'Access AI Toolkit'}
              </button>
            </form>

            <div className="text-center text-xs">
              {isSignUp ? (
                <p className="text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-indigo-500 hover:underline font-bold bg-transparent border-none cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              ) : (
                <p className="text-slate-500">
                  New to DigiBlend?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-indigo-500 hover:underline font-bold bg-transparent border-none cursor-pointer"
                  >
                    Register free account
                  </button>
                </p>
              )}
            </div>

            {/* Quick evaluations links */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-slate-400 block text-center">💡 SIMULATED TEST SEATS:</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('alex.hacker@buildinpublic.com');
                    setIsSignUp(false);
                  }}
                  className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-500 text-left transition-all truncate cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-300 block truncate">alex.hacker@...</span>
                  <span className="text-[8px] text-amber-500">Plan: PRO</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('brian.dev@solopreneur.dev');
                    setIsSignUp(false);
                  }}
                  className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-500 text-left transition-all truncate cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-300 block truncate">brian.dev@...</span>
                  <span className="text-[8px] text-slate-400">Plan: FREE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-850 rounded-2xl p-6 shadow-sm">
        {stats.map((st, i) => (
          <div key={i} className="text-center space-y-1">
            <span className="block text-2xl md:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {st.value}
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              {st.label}
            </span>
          </div>
        ))}
      </div>

      {/* 3. PRODUCT TOOLS SHOWCASE */}
      <div className="space-y-8 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest">Aesthetic Toolkit</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            5 Conversion-Optimized Copywriting Scaffolds
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Backed by professional marketing methodologies, engineered to deliver copy with high algorithmic click-rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const IconComp = feat.icon;
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 dark:bg-slate-800/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500" />
                
                <div className="space-y-4">
                  <div className={`p-3 rounded-xl ${feat.bgColor} ${feat.color} inline-block`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-slate-400">Google Gemini Core</span>
                  <button 
                    onClick={onExploreTools} 
                    className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-0.5"
                  >
                    Try Utility <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRICING PLAN */}
      <div className="space-y-8 text-center" id="pricing-section">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest">SaaS Plans</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Clear, Humble Pricing Structure
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Scale your limits seamlessly as you grow. No hidden transaction fees, upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Card 1: Free Tier */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-8 text-left shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-slate-400">Sandbox Entrance</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Sandbox</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Perfect for exploring templates and starting small.</p>
              </div>

              <div className="flex items-baseline gap-1 font-mono text-slate-900 dark:text-white">
                <span className="text-2xl font-bold">₹</span>
                <span className="text-4xl font-black tracking-tight">0</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">/ forever</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>3 daily AI generation credits</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access to 5 core copy tools</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive history logs</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <span className="w-4 text-center select-none font-bold">×</span>
                  <span className="line-through">Unlimited AI model tokens</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a 
                href="#register" 
                className="block w-full py-2.5 text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
              >
                Get Started Free
              </a>
            </div>
          </div>

          {/* Card 2: Pro Tier */}
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-3xl p-8 text-left shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute top-4 right-4 bg-indigo-600 text-white font-mono font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Popular Choice
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-indigo-500">Professional Grade</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Accelerator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">For solopreneurs scaling search authority and hook speeds.</p>
              </div>

              <div className="flex items-baseline gap-1 font-mono text-slate-900 dark:text-white">
                <span className="text-2xl font-bold">₹</span>
                <span className="text-4xl font-black tracking-tight">499</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">/ month</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-indigo-100 dark:border-slate-800 text-xs">
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited</strong> daily AI credits</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access to 5 core copy tools</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Priority high-speed Gemini pipeline</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Excludes all usage restrictions</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button 
                onClick={triggerProCheckout}
                className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Upgrade to PRO (Simulated)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FAQ ACCORDION SECTION */}
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800 max-w-3xl mx-auto space-y-6">
        <div className="space-y-1.5 text-center">
          <HelpCircle className="w-6 h-6 text-indigo-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Everything you need to know about the DigiBlend toolset</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 font-bold text-xs flex justify-between items-center text-slate-900 dark:text-slate-200 bg-transparent border-none cursor-pointer hover:text-indigo-500"
              >
                <span>{faq.question}</span>
                <span className="text-slate-400 font-mono text-base">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
