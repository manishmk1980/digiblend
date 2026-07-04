'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Users,
  Mail,
  Zap,
  Compass,
  Check,
  CheckCircle,
  ArrowRight,
  Terminal,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Lock,
  Unlock,
  Info,
  Calendar,
  History,
  Copy,
  RotateCcw,
  CreditCard,
  AlertTriangle,
  FileText,
  Plus,
  X,
  Trash2,
  Share2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Timer,
  Maximize2,
  Minimize2,
  Search,
  BookOpen,
  Flame,
  Trophy,
  TrendingUp,
  BarChart,
  Shield,
  DollarSign,
  Star,
  Download,
  Gift,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  RefreshCw,
  UserPlus,
  LogIn,
  LogOut,
  Key,
  MessageCircle,
  Send,
  Bot,
  Home,
  Gem,
  User,
  Lightbulb
} from 'lucide-react';
import { TOOLS, ToolDefinition, SubscriptionPlan, UsageLog, Role, SubStatus, SaaSUser, SaaSAdminAction, SaaSSubscription } from './types';
import MetricsOverview from './components/MetricsOverview';
import CustomerLandingPage from './components/CustomerLandingPage';

type SupportChatMessage = {
  role: 'assistant' | 'user';
  content: string;
  kind?: 'normal' | 'follow-up';
};

const SUPPORT_CHAT_IDLE_MS = 90_000;
const SUPPORT_CHAT_HINTS = [
  'Checking the DigiBlend knowledge base...',
  'Looking at plans, credits, and billing rules...',
  'Matching your question to support policies...',
  'Preparing a concise answer...',
];

export default function App() {
  // Active User session state
  const [currentUser, setCurrentUser] = useState<SaaSUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_current_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && parsed.email) {
            return parsed;
          }
        } catch {}
      }
    }
    return null;
  });

  // Simulated browser router path ('/' or '/admin')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      return (hash === '#/admin' || hash === '#admin') ? '/admin' : '/';
    }
    return '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    if (path === '/admin') {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '#/';
    }
  };

  // Role and Onboarding states
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_role');
      return (saved as Role) || 'CUSTOMER';
    }
    return 'CUSTOMER';
  });

  const [referredBy, setReferredBy] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('digiblend_ref') || null;
    }
    return null;
  });

  // Starred / Favorite Tools
  const [starredTools, setStarredTools] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_starred');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Mock Users & Subscriptions database for High-Fidelity simulation
  const [saasUsers, setSaasUsers] = useState<SaaSUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_saas_users');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      { id: 'usr_01', email: 'alex.hacker@buildinpublic.com', role: 'CUSTOMER', plan: 'PRO', referredBy: 'indie_feed', createdAt: '2026-06-15T12:00:00Z', usageCount: 42, lastActive: '2026-06-30T01:15:00Z' },
      { id: 'usr_02', email: 'sarah.seo@growthmarketing.agency', role: 'CUSTOMER', plan: 'PRO', referredBy: null, createdAt: '2026-06-18T09:30:00Z', usageCount: 89, lastActive: '2026-06-29T22:45:00Z' },
      { id: 'usr_03', email: 'brian.dev@solopreneur.dev', role: 'CUSTOMER', plan: 'FREE', referredBy: 'twitter_promo', createdAt: '2026-06-20T14:20:00Z', usageCount: 3, lastActive: '2026-06-30T02:00:00Z' },
      { id: 'usr_04', email: 'clara.design@minimalist.co', role: 'CUSTOMER', plan: 'FREE', referredBy: null, createdAt: '2026-06-22T17:40:00Z', usageCount: 2, lastActive: '2026-06-25T11:30:00Z' },
      { id: 'usr_05', email: 'dave.copy@wordsmith.io', role: 'CUSTOMER', plan: 'PRO', referredBy: 'saas_newsletter', createdAt: '2026-06-23T08:10:00Z', usageCount: 156, lastActive: '2026-06-30T02:22:00Z' },
      { id: 'usr_06', email: 'elena.founder@saasventure.com', role: 'CUSTOMER', plan: 'FREE', referredBy: 'alex.hacker', createdAt: '2026-06-24T11:55:00Z', usageCount: 0, lastActive: '2026-06-24T11:55:00Z' },
      { id: 'usr_07', email: 'fiona.brand@namescale.net', role: 'CUSTOMER', plan: 'PRO', referredBy: null, createdAt: '2026-06-26T16:05:00Z', usageCount: 78, lastActive: '2026-06-30T00:50:00Z' },
      { id: 'usr_08', email: 'ui.manishmishra@gmail.com', role: 'ADMIN', plan: 'PRO', referredBy: null, createdAt: '2026-06-01T08:00:00Z', usageCount: 24, lastActive: '2026-06-30T02:34:00Z' }
    ];
  });

  const [saasAdminActions, setSaasAdminActions] = useState<SaaSAdminAction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_admin_actions');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      { id: 'act_01', adminEmail: 'ui.manishmishra@gmail.com', action: 'manual_upgrade', targetEmail: 'brian.dev@solopreneur.dev', notes: 'Upgraded partner to PRO for testing', createdAt: '2026-06-28T14:30:00Z' },
      { id: 'act_02', adminEmail: 'ui.manishmishra@gmail.com', action: 'change_role', targetEmail: 'sarah.seo@growthmarketing.agency', notes: 'Temporarily promoted to support testing', createdAt: '2026-06-29T10:15:00Z' }
    ];
  });

  const [saasSubscriptions, setSaasSubscriptions] = useState<SaaSSubscription[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_saas_subs');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      { id: 'sub_01', userEmail: 'alex.hacker@buildinpublic.com', razorpaySubId: 'sub_pay_9481938a1', status: 'ACTIVE', startedAt: '2026-06-15T12:00:00Z', expiresAt: '2026-07-15T12:00:00Z' },
      { id: 'sub_02', userEmail: 'sarah.seo@growthmarketing.agency', razorpaySubId: 'sub_pay_421038a8f', status: 'ACTIVE', startedAt: '2026-06-18T09:30:00Z', expiresAt: '2026-07-18T09:30:00Z' },
      { id: 'sub_03', userEmail: 'dave.copy@wordsmith.io', razorpaySubId: 'sub_pay_581903bc3', status: 'ACTIVE', startedAt: '2026-06-23T08:10:00Z', expiresAt: '2026-07-23T08:10:00Z' },
      { id: 'sub_04', userEmail: 'fiona.brand@namescale.net', razorpaySubId: 'sub_pay_391829cd1', status: 'ACTIVE', startedAt: '2026-06-26T16:05:00Z', expiresAt: '2026-07-26T16:05:00Z' },
      { id: 'sub_05', userEmail: 'ui.manishmishra@gmail.com', razorpaySubId: 'sub_pay_admin01', status: 'ACTIVE', startedAt: '2026-06-01T08:00:00Z', expiresAt: '2026-07-01T08:00:00Z' }
    ];
  });

  // Admin section view states
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'users' | 'subscriptions' | 'usage' | 'actions'>('dashboard');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSortField, setUserSortField] = useState<'email' | 'plan' | 'lastActive'>('lastActive');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedSaasUsers = useMemo(() => {
    return [...saasUsers].sort((a, b) => {
      let comparison = 0;
      if (userSortField === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (userSortField === 'plan') {
        comparison = a.plan.localeCompare(b.plan);
      } else if (userSortField === 'lastActive') {
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      }
      return userSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [saasUsers, userSortField, userSortOrder]);

  const [selectedAdminUser, setSelectedAdminUser] = useState<SaaSUser | null>(null);
  const [overridePlanNotes, setOverridePlanNotes] = useState('');
  const [overridePlanValue, setOverridePlanValue] = useState<SubscriptionPlan>('FREE');
  const [overrideRoleValue, setOverrideRoleValue] = useState<Role>('CUSTOMER');

  // Subscription & Limit State (Persisted in localStorage for demo continuity)
  const [plan, setPlan] = useState<SubscriptionPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_plan');
      return (saved as SubscriptionPlan) || 'FREE';
    }
    return 'FREE';
  });

  const [usageLogs, setUsageLogs] = useState<UsageLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digiblend_logs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Generate 30 days of copywriting transaction history (seeding baseline data)
  const last30DaysUsage = useMemo(() => {
    const days = [];
    const now = new Date();
    // Pre-calculated seed counts to make the analytics look professional and active
    const seedValues = [
      4, 2, 0, 5, 8, 3, 1, 0, 6, 7, 
      2, 1, 9, 4, 3, 0, 2, 5, 6, 8, 
      1, 2, 0, 4, 5, 3, 7, 2, 1
    ];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      
      let count = 0;
      if (i === 0) {
        // Today's actual usage from usageLogs
        count = usageLogs.length;
      } else {
        // Retrieve seeded baseline mock data
        count = seedValues[(29 - i) % seedValues.length];
      }

      days.push({
        label: dateStr,
        count: count
      });
    }
    return days;
  }, [usageLogs]);

  const maxUsageVal = useMemo(() => {
    const maxVal = Math.max(...last30DaysUsage.map(d => d.count));
    return maxVal > 0 ? maxVal : 10;
  }, [last30DaysUsage]);

  // Navigation & Tool State
  const [activeSection, setActiveSection] = useState<'landing' | 'tools' | 'pricing' | 'account' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('digiblend_current_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && typeof parsed === 'object' && parsed.email) {
            return 'tools';
          }
        } catch {}
      }
    }
    return 'landing';
  });
  const [selectedTool, setSelectedTool] = useState<ToolDefinition>(TOOLS[0]);
  const [toolInputs, setToolInputs] = useState<Record<string, string>>({});
  
  // Generation & API Call States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [generationTimeMs, setGenerationTimeMs] = useState<number | null>(null);
  const [isMac, setIsMac] = useState(false);
  const [activeExpandedInputId, setActiveExpandedInputId] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication form state variables
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authReferral, setAuthReferral] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportChatInput, setSupportChatInput] = useState('');
  const [isSupportChatSending, setIsSupportChatSending] = useState(false);
  const [supportChatHintIndex, setSupportChatHintIndex] = useState(0);
  const [lastSupportFollowUpFor, setLastSupportFollowUpFor] = useState<number | null>(null);
  const [supportChatMessages, setSupportChatMessages] = useState<SupportChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi, I am Blend. Ask me about DigiBlend tools, plans, billing, credits, referrals, or account help.',
    },
  ]);

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!isSupportChatSending) return;
    const timer = setInterval(() => {
      setSupportChatHintIndex((current) => (current + 1) % SUPPORT_CHAT_HINTS.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [isSupportChatSending]);

  useEffect(() => {
    if (!showSupportChat || isSupportChatSending) return;
    const lastMessage = supportChatMessages[supportChatMessages.length - 1];
    const lastUserIndex = [...supportChatMessages].map((message) => message.role).lastIndexOf('user');

    if (!lastMessage || lastMessage.role !== 'assistant' || lastMessage.kind === 'follow-up' || lastUserIndex === -1) {
      return;
    }

    if (lastSupportFollowUpFor === lastUserIndex) {
      return;
    }

    const timer = setTimeout(() => {
      const lastUserMessage = supportChatMessages[lastUserIndex]?.content || 'your DigiBlend question';
      const topic = lastUserMessage.length > 82 ? `${lastUserMessage.slice(0, 79)}...` : lastUserMessage;

      setSupportChatMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          kind: 'follow-up',
          content: `Quick reminder: we were discussing "${topic}".\n\nIs there anything else I can help you with today? If you would rather speak with the team, you can book a call appointment.`,
        },
      ]);
      setLastSupportFollowUpFor(lastUserIndex);
    }, SUPPORT_CHAT_IDLE_MS);

    return () => clearTimeout(timer);
  }, [showSupportChat, isSupportChatSending, supportChatMessages, lastSupportFollowUpFor]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(() => {
      setCooldownSeconds(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  // Razorpay Simulation Overlay Modal
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState<'options' | 'card' | 'upi' | 'processing' | 'success'>('options');
  const [paymentOption, setPaymentOption] = useState<'card' | 'upi' | 'net'>('card');
  const [cardNo, setCardNo] = useState('');
  const [upiId, setUpiId] = useState('');
  
  // Custom View Customization State (Accent Colors)
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan'>('indigo');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark'; // Defaults to beautiful dark mode
    }
    return 'dark';
  });

  // Synchronize Theme with classList
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Synchronize logs & subscription state in localStorage
  useEffect(() => {
    localStorage.setItem('digiblend_plan', plan);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('digiblend_logs', JSON.stringify(usageLogs));
  }, [usageLogs]);

  // Synchronize new SaaS fields in localStorage
  useEffect(() => {
    localStorage.setItem('digiblend_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('digiblend_starred', JSON.stringify(starredTools));
  }, [starredTools]);

  useEffect(() => {
    localStorage.setItem('digiblend_saas_users', JSON.stringify(saasUsers));
  }, [saasUsers]);

  useEffect(() => {
    localStorage.setItem('digiblend_admin_actions', JSON.stringify(saasAdminActions));
  }, [saasAdminActions]);

  useEffect(() => {
    localStorage.setItem('digiblend_saas_subs', JSON.stringify(saasSubscriptions));
  }, [saasSubscriptions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('digiblend_current_user', JSON.stringify(currentUser));
      setPlan(currentUser.plan);
      setRole(currentUser.role);
    } else {
      localStorage.removeItem('digiblend_current_user');
    }
  }, [currentUser]);

  // Catch ref parameter from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setReferredBy(ref);
        localStorage.setItem('digiblend_ref', ref);
        console.log(`[Referral Captured]: Referred by ${ref}`);
      }
    }
  }, []);

  // Synchronize path and section gating rules
  useEffect(() => {
    if (currentPath === '/admin') {
      if (role !== 'ADMIN') {
        navigateToPath('/');
      } else {
        setActiveSection('admin');
      }
    } else {
      if (activeSection === 'admin') {
        setActiveSection(currentUser ? 'tools' : 'landing');
      }
    }
  }, [currentPath, role, currentUser]);

  // Handle auto transitions on login/logout
  useEffect(() => {
    if (currentPath === '/') {
      if (currentUser) {
        if (activeSection === 'landing') {
          setActiveSection('tools');
        }
      } else {
        // Logged out
        if (activeSection !== 'tools' && activeSection !== 'pricing') {
          setActiveSection('landing');
        }
      }
    }
  }, [currentUser, currentPath]);

  // Digital product state
  const [playbookPurchased, setPlaybookPurchased] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('digiblend_playbook_bought') === 'true';
    }
    return false;
  });

  const [buyingPlaybook, setBuyingPlaybook] = useState(false);

  const triggerPlaybookCheckout = () => {
    setBuyingPlaybook(true);
    setTimeout(() => {
      setPlaybookPurchased(true);
      localStorage.setItem('digiblend_playbook_bought', 'true');
      setBuyingPlaybook(false);
      alert("Direct transaction successful! You have purchased the Premium Growth Playbook. Download your PDF now from the console.");
    }, 1800);
  };

  // Set default inputs whenever the selected tool changes
  useEffect(() => {
    setToolInputs(selectedTool.defaultInputs);
    setGenerationResult(null);
    setApiError(null);
    setGenerationTimeMs(null);
  }, [selectedTool]);

  // Reset all tool inputs to empty
  const clearInputs = () => {
    const cleared: Record<string, string> = {};
    selectedTool.inputs.forEach((input) => {
      cleared[input.id] = '';
    });
    setToolInputs(cleared);
  };

  const toggleStarTool = (slug: string) => {
    setStarredTools(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Helper: map string to Lucide icon
  const getToolIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case 'Globe': return <Globe className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // Accent mapping class dictionary
  const accents: Record<string, { bg: string; hoverBg: string; text: string; border: string; glow: string; badge: string; shadow: string; fromTo: string }> = {
    indigo: {
      bg: 'bg-indigo-600',
      hoverBg: 'hover:bg-indigo-700',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-500/30',
      glow: 'shadow-indigo-500/10 dark:shadow-indigo-500/20',
      badge: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
      shadow: 'shadow-indigo-500/5 dark:shadow-indigo-500/10',
      fromTo: 'from-indigo-600 to-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-600',
      hoverBg: 'hover:bg-emerald-700',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/30',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/20',
      badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
      shadow: 'shadow-emerald-500/5 dark:shadow-emerald-500/10',
      fromTo: 'from-emerald-600 to-emerald-400',
    },
    rose: {
      bg: 'bg-rose-600',
      hoverBg: 'hover:bg-rose-700',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-500/30',
      glow: 'shadow-rose-500/10 dark:shadow-rose-500/20',
      badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
      shadow: 'shadow-rose-500/5 dark:shadow-rose-500/10',
      fromTo: 'from-rose-600 to-rose-400',
    },
    amber: {
      bg: 'bg-amber-600',
      hoverBg: 'hover:bg-amber-700',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/30',
      glow: 'shadow-amber-500/10 dark:shadow-amber-500/20',
      badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
      shadow: 'shadow-amber-500/5 dark:shadow-amber-500/10',
      fromTo: 'from-amber-600 to-amber-400',
    },
    cyan: {
      bg: 'bg-cyan-600',
      hoverBg: 'hover:bg-cyan-700',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-500/30',
      glow: 'shadow-cyan-500/10 dark:shadow-cyan-500/20',
      badge: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20',
      shadow: 'shadow-cyan-500/5 dark:shadow-cyan-500/10',
      fromTo: 'from-cyan-600 to-cyan-400',
    },
  };

  const currentAccent = accents[accentColor] || accents.indigo;

  // Limit Check: Max 3 total generations per day for FREE users
  const getTodayUsageCount = () => {
    const today = new Date().toDateString();
    return usageLogs.filter(log => new Date(log.usedAt).toDateString() === today).length;
  };

  const todayUsage = getTodayUsageCount();
  const limitReached = plan === 'FREE' && todayUsage >= 3;

  // Submission handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || cooldownSeconds > 0) return;
    setApiError(null);
    setGenerationResult(null);
    setGenerationTimeMs(null);

    // Guest check
    if (!currentUser) {
      setApiError('Account Required: Please register or sign in (or click on a guest test seat in the home screen) to run live Gemini AI copywriting generations.');
      return;
    }

    // Guard on limits
    if (limitReached) {
      setActiveSection('pricing');
      return;
    }

    setIsGenerating(true);
    setCooldownSeconds(2);
    const startTime = performance.now();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: selectedTool.slug,
          inputs: toolInputs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server responded with an error');
      }

      const data = await response.json();
      const endTime = performance.now();
      setGenerationTimeMs(endTime - startTime);
      setGenerationResult(data.result);

      // Log successful generation in history and local counter
      const newLog: UsageLog = {
        id: Math.random().toString(36).substr(2, 9),
        toolSlug: selectedTool.slug,
        toolName: selectedTool.name,
        usedAt: new Date().toISOString(),
      };
      setUsageLogs(prev => [newLog, ...prev]);

      // Synchronize write usage count in master directory database
      if (currentUser) {
        setSaasUsers(prevUsers => prevUsers.map(u => {
          if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
            const updated = {
              ...u,
              usageCount: u.usageCount + 1,
              lastActive: new Date().toISOString()
            };
            setCurrentUser(updated);
            localStorage.setItem('digiblend_current_user', JSON.stringify(updated));
            return updated;
          }
          return u;
        }));
      }

    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'An unexpected error occurred while calling the Gemini AI engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerRazorpayCheckout = () => {
    setRazorpayStep('options');
    setShowRazorpay(true);
  };

  const handlePaymentSubmit = () => {
    setRazorpayStep('processing');
    setTimeout(() => {
      setRazorpayStep('success');
      setPlan('PRO');

      const email = currentUser?.email || 'anonymous.user@domain.com';
      
      // Update saasUsers plan
      setSaasUsers(prevUsers => prevUsers.map(u => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return { ...u, plan: 'PRO' as const };
        }
        return u;
      }));

      // Add subscription record
      const subId = `sub_pay_${Math.random().toString(36).substring(2, 11)}`;
      const newSub: SaaSSubscription = {
        id: `sub_${Date.now()}`,
        userEmail: email,
        razorpaySubId: subId,
        status: 'ACTIVE' as const,
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      };
      setSaasSubscriptions(prev => [newSub, ...prev]);

      // If active user is current, update session too
      if (currentUser) {
        const updatedUser = { ...currentUser, plan: 'PRO' as const };
        setCurrentUser(updatedUser);
        localStorage.setItem('digiblend_current_user', JSON.stringify(updatedUser));
      }
    }, 2000);
  };

  const handleCustomerAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const email = authEmail.trim();
    if (!email) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (isSignUp) {
      // Check if email already registered
      const exists = saasUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setAuthError('This email is already registered! Please sign in instead.');
        return;
      }

      // Register new user
      const newUser: SaaSUser = {
        id: `usr_${Math.random().toString(36).substring(2, 11)}`,
        email: email,
        role: 'CUSTOMER',
        plan: 'FREE',
        referredBy: authReferral.trim() || null,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        lastActive: new Date().toISOString()
      };

      setSaasUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      setRole('CUSTOMER');
      setPlan('FREE');
      setAuthSuccess('Account successfully created! Welcome to DigiBlend.');
      setAuthEmail('');
      setAuthPassword('');
      setAuthReferral('');
    } else {
      // Sign In
      const found = saasUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        // Successful login
        setCurrentUser(found);
        setRole(found.role);
        setPlan(found.plan);
        setAuthSuccess(`Welcome back, ${found.email}!`);
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthError('Email not found in our directory database. Please Register an account first, or log in with alex.hacker@buildinpublic.com');
      }
    }
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const email = authEmail.trim();
    if (email === 'ui.manishmishra@gmail.com' && authPassword === 'admin123') {
      const adminUser = saasUsers.find(u => u.email === 'ui.manishmishra@gmail.com') || {
        id: 'usr_08',
        email: 'ui.manishmishra@gmail.com',
        role: 'ADMIN' as const,
        plan: 'PRO' as const,
        referredBy: null,
        createdAt: '2026-06-01T08:00:00Z',
        usageCount: 24,
        lastActive: new Date().toISOString()
      };

      setCurrentUser(adminUser);
      setRole('ADMIN');
      setPlan('PRO');
      setAuthSuccess('Root Administrator verified. Welcome to the Control Panel.');
      setAuthEmail('');
      setAuthPassword('');
      setActiveSection('admin');
    } else {
      setAuthError('Access Denied: Invalid root administrator credentials.');
    }
  };

  const handleSupportChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = supportChatInput.trim();
    if (!message || isSupportChatSending) return;

    const nextMessages: SupportChatMessage[] = [
      ...supportChatMessages,
      { role: 'user', content: message },
    ];

    setSupportChatMessages(nextMessages);
    setLastSupportFollowUpFor(null);
    setSupportChatInput('');
    setIsSupportChatSending(true);
    setSupportChatHintIndex(0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Support chat failed');
      }

      setSupportChatMessages([
        ...nextMessages,
        { role: 'assistant', content: data.reply || 'I could not generate a reply just now.' },
      ]);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Support chat failed';
      setSupportChatMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: `I could not connect to support chat right now. ${messageText}`,
        },
      ]);
    } finally {
      setIsSupportChatSending(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRole('CUSTOMER');
    setPlan('FREE');
    localStorage.removeItem('digiblend_current_user');
    setAuthSuccess('You have successfully logged out.');
    navigateToPath('/');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportHistory = () => {
    if (usageLogs.length === 0) {
      alert("No generation history to export yet.");
      return;
    }

    const headers = ["Log ID", "Tool Slug", "Tool Name", "Date", "Time", "Status"];
    const rows = usageLogs.map((log) => {
      const dateObj = new Date(log.usedAt);
      const dateStr = dateObj.toLocaleDateString();
      const timeStr = dateObj.toLocaleTimeString();
      return [
        log.id,
        `"${log.toolSlug.replace(/"/g, '""')}"`,
        `"${log.toolName.replace(/"/g, '""')}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        "SUCCESS"
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `digiblend_generation_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteLog = (id: string) => {
    setUsageLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const handleApplyOverride = () => {
    if (!selectedAdminUser) return;
    
    // 1. Update the user in saasUsers database
    const updatedUsers = saasUsers.map(u => {
      if (u.id === selectedAdminUser.id) {
        return {
          ...u,
          plan: overridePlanValue,
          role: overrideRoleValue
        };
      }
      return u;
    });
    setSaasUsers(updatedUsers);
    
    // 2. Also update their subscription record if upgraded to PRO
    if (overridePlanValue === 'PRO') {
      const exists = saasSubscriptions.some(s => s.userEmail === selectedAdminUser.email);
      if (!exists) {
        const newSub = {
          id: `sub_pay_manual_${Date.now()}`,
          userEmail: selectedAdminUser.email,
          razorpaySubId: `sub_pay_${Math.random().toString(36).substring(2, 10)}`,
          status: 'ACTIVE' as const,
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString()
        };
        setSaasSubscriptions([newSub, ...saasSubscriptions]);
      }
    } else if (overridePlanValue === 'FREE') {
      setSaasSubscriptions(saasSubscriptions.filter(s => s.userEmail !== selectedAdminUser.email));
    }
    
    // 3. Append to SaaS Admin Action audit logs
    const newAction = {
      id: `act_${Date.now()}`,
      adminEmail: 'ui.manishmishra@gmail.com', // Active admin
      action: 'manual_override',
      targetEmail: selectedAdminUser.email,
      notes: overridePlanNotes || `Overrode plan to ${overridePlanValue} and role to ${overrideRoleValue}.`,
      createdAt: new Date().toISOString()
    };
    setSaasAdminActions([newAction, ...saasAdminActions]);
    
    // If the admin user edited their OWN account, let's sync the active plan!
    if (selectedAdminUser.email === 'ui.manishmishra@gmail.com') {
      setPlan(overridePlanValue);
    }
    
    alert(`Administrative override successfully applied for ${selectedAdminUser.email}!`);
    setSelectedAdminUser(null);
    setOverridePlanNotes('');
  };

  const handleShareResult = () => {
    if (!generationResult) return;

    let summaryText = `DigiBlend.co.in AI Copywriting Tool: ${selectedTool.name}\n`;
    summaryText += `-----------------------------------------------\n\n`;

    if (selectedTool.slug === 'meta-tag-generator') {
      summaryText += `SEO TITLE:\n${generationResult.title || ''}\n\n`;
      summaryText += `METADESC:\n${generationResult.description || ''}\n\n`;
      summaryText += `KEYWORDS:\n${generationResult.keywords || ''}\n`;
    } else if (selectedTool.slug === 'social-bio-writer') {
      if (Array.isArray(generationResult.bios)) {
        generationResult.bios.forEach((bio: any, idx: number) => {
          summaryText += `BIO OPTION #${idx + 1}:\n${bio.text || ''}\n(Strategy: ${bio.strategy || ''})\n\n`;
        });
      }
    } else if (selectedTool.slug === 'cold-email-writer') {
      if (Array.isArray(generationResult.subjectLines)) {
        summaryText += `SUBJECT LINES:\n` + generationResult.subjectLines.map((s: string, idx: number) => `  ${idx + 1}. ${s}`).join('\n') + `\n\n`;
      }
      summaryText += `EMAIL BODY:\n${generationResult.emailBody || ''}\n`;
    } else if (selectedTool.slug === 'ad-copy-generator') {
      if (Array.isArray(generationResult.copies)) {
        generationResult.copies.forEach((copy: any, idx: number) => {
          summaryText += `AD COPY OPTION #${idx + 1}:\nHeadline: ${copy.headline || ''}\nPrimary Text: ${copy.primaryText || ''}\nCTA Recommended: ${copy.ctaRecommended || ''}\n\n`;
        });
      }
    } else if (selectedTool.slug === 'business-name-checker') {
      if (Array.isArray(generationResult.businessNames)) {
        generationResult.businessNames.forEach((item: any, idx: number) => {
          summaryText += `COMPANY SUGGESTION #${idx + 1}:\nName: ${item.name || ''}\nTagline: ${item.tagline || ''}\nDomain Suggestion: ${item.domainSuggestion || ''}\nConcept: ${item.brandConcept || ''}\n\n`;
        });
      }
    } else if (selectedTool.slug === 'readability-scorer') {
      summaryText += `READABILITY SCORE: ${generationResult.score || 0}/100 (${generationResult.readingEase || ''})\n`;
      summaryText += `COMPREHENSION LEVEL: ${generationResult.gradeLevel || ''}\n`;
      summaryText += `TEXT STATS: ${generationResult.wordCount || 0} words, ${generationResult.sentenceCount || 0} sentences, ${generationResult.passiveVoicePercent || 0}% Passive Voice\n\n`;
      summaryText += `SUMMARY ANALYSIS:\n${generationResult.overallSummary || ''}\n\n`;
      if (Array.isArray(generationResult.suggestions)) {
        summaryText += `KEY SUGGESTIONS:\n`;
        generationResult.suggestions.forEach((sug: any, idx: number) => {
          summaryText += `  ${idx + 1}. [${sug.type || 'improvement'}] ${sug.reason || ''}\n`;
        });
      }
    } else {
      summaryText += JSON.stringify(generationResult, null, 2);
    }

    summaryText += `\n-----------------------------------------------\n`;
    summaryText += `Drafted instantly with DigiBlend (https://digiblend.co.in)`;

    navigator.clipboard.writeText(summaryText);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (typeof e.currentTarget.requestSubmit === 'function') {
        e.currentTarget.requestSubmit();
      } else {
        const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  };

  const handleTestReset = () => {
    setUsageLogs([]);
    setPlan('FREE');
    alert('Test states successfully reset! Enjoy checking the usage limit flow.');
  };

  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'starred'>('all');

  const filteredTools = TOOLS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (sidebarFilter === 'starred') {
      return matchesSearch && starredTools.includes(t.slug);
    }
    return matchesSearch;
  });

  const toolRanks = useMemo(() => {
    // Count usage logs for each tool slug
    const counts = TOOLS.map(t => {
      const count = usageLogs.filter(log => log.toolSlug === t.slug).length;
      return { slug: t.slug, count };
    });

    // Sort by count descending. If equal, keep index order.
    const sorted = [...counts].sort((a, b) => b.count - a.count);

    const ranks: Record<string, { rank: number; count: number }> = {};
    sorted.forEach((item, index) => {
      ranks[item.slug] = {
        rank: index + 1,
        count: item.count
      };
    });
    return ranks;
  }, [usageLogs]);

  // Routing-based Gating UI blocks
  const renderAuthOrContent = () => {
    // 1. ADMIN PATH ROUTING
    if (currentPath === '/admin') {
      const isUserAdmin = currentUser?.role === 'ADMIN';
      
      // Strictly prevent non-ADMIN users from viewing the admin dashboard/portal
      if (currentUser && !isUserAdmin) {
        setTimeout(() => {
          navigateToPath('/');
        }, 0);
        return null;
      }

      const isAdminLoggedIn = currentUser && currentUser.role === 'ADMIN';

      if (!isAdminLoggedIn) {
        return (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans w-full">
            {/* Background decoration */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 z-10">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-2xl mb-2">
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Root Administrator Login</h1>
                <p className="text-xs text-slate-400 font-mono">digiblend.co.in/admin access portal</p>
              </div>

              {authError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Admin Email ID</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="ui.manishmishra@gmail.com"
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-100 placeholder-slate-600 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Secure Auth Token</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-100 placeholder-slate-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Verify Identity
                </button>
              </form>

              <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
                <p className="text-[10px] text-slate-500 inline-flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  PRE-GENERATED ROOT CREDENTIALS FOR TESTING:
                </p>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] font-mono text-left space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-200 select-all">ui.manishmishra@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Password:</span>
                    <span className="text-slate-200 select-all font-bold text-rose-400">admin123</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigateToPath('/')}
                  className="text-xs text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-mono bg-transparent border-none"
                >
                  <ArrowLeft className="w-3 h-3" /> Return to Customer Portal
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    // 2. CUSTOMER PATH ROUTING
    // Visiting customers do not need to be blocked by login on '/'
    return null;

    return null;
  };

  const authComponent = renderAuthOrContent();
  if (authComponent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
        {authComponent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">

      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection(currentUser ? 'tools' : 'landing')}>
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${currentAccent.fromTo} text-white shadow-md shadow-indigo-500/10`}>
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-slate-900 dark:text-slate-50 leading-none tracking-tight text-lg">
                  DigiBlend<span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentAccent.fromTo}`}>.in</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${plan === 'PRO' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {plan}
                </span>
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] block font-mono">AI-powered SaaS toolkit</span>
            </div>
          </div>

          {/* Central Header Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {!currentUser && (
              <button
                onClick={() => setActiveSection('landing')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-1.5 ${
                  activeSection === 'landing'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
            )}
            <button
              onClick={() => setActiveSection('tools')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-1.5 ${
                activeSection === 'tools'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              AI Utilities
            </button>
            <button
              onClick={() => setActiveSection('pricing')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-1.5 ${
                activeSection === 'pricing'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              Pricing Plan
            </button>
            <button
              onClick={() => setActiveSection('account')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-1.5 ${
                activeSection === 'account'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Usage & Account
            </button>
            {role === 'ADMIN' && (
              <button
                onClick={() => setActiveSection('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-1.5 ${
                  activeSection === 'admin'
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Configuration Controls */}
          <div className="flex items-center gap-3">
            
            {/* Color accent controller */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
              {Object.keys(accents).map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color as any)}
                  className={`w-4 h-4 rounded-full transition-transform duration-100 ${
                    color === 'indigo' ? 'bg-indigo-500' :
                    color === 'emerald' ? 'bg-emerald-500' :
                    color === 'rose' ? 'bg-rose-500' :
                    color === 'amber' ? 'bg-amber-500' : 'bg-cyan-500'
                  } ${accentColor === color ? 'ring-2 ring-slate-400 dark:ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                  title={`${color.charAt(0).toUpperCase() + color.slice(1)} accent`}
                />
              ))}
            </div>

            {/* Dark/Light mode toggle button */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Logged in session card and logout action */}
            {currentUser && (
              <div className={`flex items-center gap-2 p-1 rounded-xl border transition-all duration-300 ${
                currentUser.role === 'ADMIN'
                  ? 'bg-rose-500/5 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] dark:bg-rose-950/10'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}>
                {currentUser.role === 'ADMIN' ? (
                  <span className="text-[9.5px] font-mono font-black bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.25)] inline-flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </span>
                ) : (
                  <span className="text-[9.5px] font-mono font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1">
                    <User className="w-3 h-3" />
                    USER
                  </span>
                )}
                <span className="hidden lg:inline text-[10px] font-mono text-slate-500 px-1 truncate max-w-[120px]" title={currentUser.email}>
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px]"
                  title="Sign Out of Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">Sign Out</span>
                </button>
              </div>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  setActiveSection('landing');
                  setTimeout(() => {
                    const el = document.getElementById('register');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Join / Login</span>
              </button>
            )}

            {/* Premium action banner in header */}
            {plan === 'FREE' ? (
              <button
                onClick={triggerRazorpayCheckout}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all bg-gradient-to-r ${currentAccent.fromTo} hover:opacity-90 shadow-sm`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Go PRO
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                PRO Active
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Sticky Navigation Banner */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 text-xs py-2 sticky top-16 z-30 shadow-sm">
        {!currentUser && (
          <button
            onClick={() => setActiveSection('landing')}
            className={`flex flex-col items-center gap-1 font-semibold ${activeSection === 'landing' ? currentAccent.text : 'text-slate-500'}`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </button>
        )}
        <button
          onClick={() => setActiveSection('tools')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeSection === 'tools' ? currentAccent.text : 'text-slate-500'}`}
        >
          <Zap className="w-4 h-4" />
          <span>Tools</span>
        </button>
        <button
          onClick={() => setActiveSection('pricing')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeSection === 'pricing' ? currentAccent.text : 'text-slate-500'}`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Pricing</span>
        </button>
        <button
          onClick={() => setActiveSection('account')}
          className={`flex flex-col items-center gap-1 font-semibold ${activeSection === 'account' ? currentAccent.text : 'text-slate-500'}`}
        >
          <History className="w-4 h-4" />
          <span>Usage</span>
        </button>
        {role === 'ADMIN' && (
          <button
            onClick={() => setActiveSection('admin')}
            className={`flex flex-col items-center gap-1 font-semibold ${activeSection === 'admin' ? 'text-rose-500' : 'text-slate-500'}`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Main Container Workspace */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full z-10">

        {/* Dynamic Section: CUSTOMER LANDING PAGE */}
        {activeSection === 'landing' && (
          <CustomerLandingPage
            currentAccent={currentAccent}
            authEmail={authEmail}
            setAuthEmail={setAuthEmail}
            authPassword={authPassword}
            setAuthPassword={setAuthPassword}
            authReferral={authReferral}
            setAuthReferral={setAuthReferral}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            authError={authError}
            authSuccess={authSuccess}
            onAuthSubmit={handleCustomerAuthSubmit}
            onExploreTools={() => setActiveSection('tools')}
            triggerProCheckout={triggerRazorpayCheckout}
          />
        )}

        {/* Dynamic Section: AI TOOLS */}
        {activeSection === 'tools' && (
          <div className="space-y-8">
            
            {/* SEO Hero Headline Introduction */}
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentAccent.badge}`}>
                <Sparkles className="w-3 h-3" /> Week 1 scaffold live
              </span>
              <h1 className="text-3.5xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Empower Your Marketing with <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentAccent.fromTo}`}>DigiBlend AI</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Unlock five rapid, conversion-optimized utilities designed to banish writer's block and scale SEO traffic for freelancers.
              </p>

              {/* Free limits notice indicator */}
              {!currentUser ? (
                <div className="inline-flex items-center gap-2.5 bg-indigo-50 dark:bg-indigo-950/20 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/60 text-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-slate-600 dark:text-slate-400">
                    👋 <strong>Guest Preview Session:</strong> You are currently browsing our suite of 5 conversion-optimized copywriting tools. To run generations and save history logs, 
                    <button 
                      onClick={() => {
                        setActiveSection('landing');
                        setTimeout(() => {
                          const el = document.getElementById('register');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }} 
                      className="ml-1 text-indigo-500 font-bold underline hover:opacity-85"
                    >
                      Create a Free Account
                    </button> in under 10 seconds!
                  </span>
                </div>
              ) : plan === 'FREE' && (
                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Remaining quota: <strong className="text-slate-950 dark:text-slate-100">{3 - todayUsage} of 3 free uses</strong> today
                  </span>
                  <button onClick={triggerRazorpayCheckout} className={`ml-2 text-xs font-bold underline ${currentAccent.text} hover:opacity-80`}>
                    Remove limits
                  </button>
                </div>
              )}
            </div>

            {/* Grid Layout: Sidebar Selector & Selected Tool Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: List of accessible tools */}
              <div className="lg:col-span-4 space-y-4">
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 font-mono">
                    Available Utilities
                  </span>
                  
                  {/* Search bar */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tools by name or info..."
                      className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-[11px] font-medium font-mono">
                    <button
                      onClick={() => setSidebarFilter('all')}
                      className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        sidebarFilter === 'all'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      All ({TOOLS.length})
                    </button>
                    <button
                      onClick={() => setSidebarFilter('starred')}
                      className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        sidebarFilter === 'starred'
                          ? `bg-white dark:bg-slate-800 text-amber-500 shadow-sm font-bold`
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${starredTools.length > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
                      Starred ({starredTools.length})
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {filteredTools.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">No tools found</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">
                        No matches found for "{searchQuery}".
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : (
                    filteredTools.map((t) => {
                      const isSelected = selectedTool.slug === t.slug;
                      return (
                        <div
                          key={t.slug}
                          onClick={() => {
                            setSelectedTool(t);
                            setGenerationResult(null);
                            setApiError(null);
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-4 select-none ${
                            isSelected
                              ? `bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-800 ${currentAccent.shadow} shadow-md`
                              : 'bg-white/40 dark:bg-slate-900/20 border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${
                            isSelected ? `${currentAccent.bg} text-white` : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                          }`}>
                            {getToolIcon(t.iconName, "w-4 h-4")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs md:text-sm text-slate-900 dark:text-slate-200">
                                {t.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-500 uppercase tracking-wider shrink-0">
                                {t.badge}
                              </span>
                              {toolRanks[t.slug] && (
                                <span 
                                  className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-md font-bold tracking-wider uppercase transition-all shrink-0 ${
                                    toolRanks[t.slug].rank === 1
                                      ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                                      : toolRanks[t.slug].rank === 2
                                      ? 'bg-slate-200/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/40'
                                      : toolRanks[t.slug].rank === 3
                                      ? 'bg-orange-100/80 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40'
                                      : 'bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-500 border border-slate-200/40 dark:border-slate-800/40'
                                  }`} 
                                  title={`Used ${toolRanks[t.slug].count} times`}
                                >
                                  {toolRanks[t.slug].rank === 1 && <Trophy className="w-2.5 h-2.5 text-amber-500 shrink-0" />}
                                  {toolRanks[t.slug].rank > 1 && toolRanks[t.slug].count > 0 && <Flame className="w-2.5 h-2.5 text-orange-500 shrink-0" />}
                                  Rank #{toolRanks[t.slug].rank}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                              {t.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end justify-between self-stretch shrink-0 ml-auto pl-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStarTool(t.slug);
                              }}
                              className="text-slate-300 hover:text-amber-500 dark:text-slate-700 dark:hover:text-amber-500 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                              title={starredTools.includes(t.slug) ? "Remove from Favorites" : "Add to Favorites"}
                            >
                              <Star className={`w-3.5 h-3.5 ${starredTools.includes(t.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-slate-400 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Simulated developer test trigger reset tool */}
                <div className="p-4 bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-900/60 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Demo Mode Controls</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Test the ₹499/month Pro checkout loop! Run out of 3 uses, click upgrade to experience real-time sandbox payment.
                  </p>
                  <button
                    onClick={handleTestReset}
                    className="w-full mt-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-1.5 rounded-lg font-bold text-[11px] transition-colors"
                  >
                    🔄 Reset Usage Limit (Go FREE)
                  </button>
                </div>
              </div>

              {/* Right Column: Execution Form and Generated output presentation */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Active Tool Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-6">
                  
                  {/* Tool Header Details */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 ${currentAccent.text}`}>
                        {getToolIcon(selectedTool.iconName, "w-5 h-5")}
                      </div>
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-50">
                          {selectedTool.name}
                        </h2>
                        <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                          {selectedTool.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={clearInputs}
                      className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset fields
                    </button>
                  </div>

                  {/* HTML Execution Form */}
                  <form onSubmit={handleGenerate} onKeyDown={handleFormKeyDown} className="space-y-5">
                    
                    {selectedTool.inputs.map((input) => (
                      <div key={input.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor={input.id} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                            <span>{input.label} {input.required && <span className="text-rose-500">*</span>}</span>
                            {input.description && (
                              <div className="group relative inline-block cursor-help ml-0.5 normal-case tracking-normal">
                                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors" />
                                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 dark:bg-slate-950 text-[11px] leading-relaxed text-slate-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 text-left font-normal border border-slate-800 dark:border-slate-850">
                                  {input.description}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-950"></div>
                                </div>
                              </div>
                            )}
                          </label>
                          {input.type === 'textarea' && (
                            <button
                              type="button"
                              onClick={() => setActiveExpandedInputId(input.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                              title="Open in Full-Screen Workspace"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Full-Screen</span>
                            </button>
                          )}
                        </div>

                        {input.type === 'textarea' ? (
                          <textarea
                            id={input.id}
                            required={input.required}
                            rows={3}
                            value={toolInputs[input.id] || ''}
                            onChange={(e) => setToolInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                            placeholder={input.placeholder}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all duration-200"
                          />
                        ) : input.type === 'select' ? (
                          <select
                            id={input.id}
                            required={input.required}
                            value={toolInputs[input.id] || ''}
                            onChange={(e) => setToolInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all duration-200"
                          >
                            <option value="" disabled>{input.placeholder}</option>
                            {input.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={input.id}
                            type="text"
                            required={input.required}
                            value={toolInputs[input.id] || ''}
                            onChange={(e) => setToolInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                            placeholder={input.placeholder}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all duration-200"
                          />
                        )}

                        {input.description && (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic pl-1 leading-normal">
                            {input.description}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Limit reached alert block */}
                    {limitReached && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold">Daily generation limit reached!</p>
                          <p>You have hit your daily limit of 3 free completions today. Upgrade to DigiBlend Pro for ₹499/month to unlock infinite generations!</p>
                          <button
                            type="button"
                            onClick={triggerRazorpayCheckout}
                            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Unlock Pro (₹499)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isGenerating || cooldownSeconds > 0}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs md:text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md ${
                        (isGenerating || cooldownSeconds > 0)
                          ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-80'
                          : limitReached
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : `${currentAccent.bg} ${currentAccent.hoverBg}`
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Consulting Gemini AI ...
                        </>
                      ) : cooldownSeconds > 0 ? (
                        <>
                          <Timer className="w-4 h-4 animate-spin text-white/80" />
                          <span>Cooldown ({cooldownSeconds}s)</span>
                        </>
                      ) : limitReached ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Upgrade to unlock tool
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Copy Output</span>
                          <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/20 text-white rounded border border-white/10 select-none">
                            <span>{isMac ? '⌘' : 'Ctrl'}</span>
                            <span>+</span>
                            <span>Enter</span>
                          </kbd>
                        </>
                      )}
                    </button>

                  </form>
                </div>

                {/* Generation API Error Message Panel */}
                {apiError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-xl flex items-start gap-3.5 text-rose-600 dark:text-rose-400 animate-slide-up">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold">AI Provider Connection Problem</p>
                      <p className="leading-relaxed">{apiError}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Verify that OPENROUTER_API_KEY or GEMINI_API_KEY is configured in your local environment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Generated AI Content Output Board */}
                {generationResult && (
                  <div className="bg-slate-900/30 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-sm animate-fade-in">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-5 h-5 ${currentAccent.text}`} />
                        <span className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                          AI Generation Success
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          id="export-csv-btn"
                          onClick={handleExportHistory}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${currentAccent.badge} hover:opacity-90`}
                          title="Export all generation history to CSV"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Export History (.CSV)</span>
                        </button>
                        <button
                          id="share-result-btn"
                          onClick={handleShareResult}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                            shareSuccess 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                              : currentAccent.badge
                          } hover:opacity-90`}
                          title="Copy summary of generation results to clipboard"
                        >
                          {shareSuccess ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span>{shareSuccess ? 'Copied!' : 'Share'}</span>
                        </button>
                        {generationTimeMs !== null && (
                          <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 px-2.5 py-1 rounded-full" title="AI Generation Time">
                            <Timer className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                            <span>{(generationTimeMs / 1000).toFixed(2)}s</span>
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 px-2.5 py-1 rounded-full">
                          Powered by gemini-3.5-flash
                        </span>
                      </div>
                    </div>

                    {/* Result Output Presentation based on selected tool */}
                    
                    {/* 1. Meta Tag Generator Presentation */}
                    {selectedTool.slug === 'meta-tag-generator' && (
                      <div className="space-y-5">
                        
                        {/* Title and description display */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 relative">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Title Meta Tag</span>
                            <button
                              onClick={() => copyToClipboard(generationResult.title, 'title')}
                              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
                              title="Copy title"
                            >
                              {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-2 pr-6">
                              {generationResult.title || 'N/A'}
                            </p>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 relative">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Keywords Meta Tag</span>
                            <button
                              onClick={() => copyToClipboard(generationResult.keywords, 'keywords')}
                              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
                              title="Copy keywords"
                            >
                              {copiedKey === 'keywords' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-2 pr-6">
                              {generationResult.keywords || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Meta description display */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 relative">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Description Meta Tag</span>
                          <button
                            onClick={() => copyToClipboard(generationResult.description, 'description')}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
                            title="Copy description"
                          >
                            {copiedKey === 'description' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 pr-6 leading-relaxed">
                            {generationResult.description || 'N/A'}
                          </p>
                        </div>

                        {/* Interactive Google Search Mock Preview */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-900 space-y-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Google SERP Preview</span>
                          <div className="space-y-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">https://example.com</span>
                            <span className="text-sm md:text-base font-semibold text-blue-600 hover:underline cursor-pointer block leading-snug">
                              {generationResult.title || 'Untitled page title'}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400 block leading-relaxed line-clamp-2">
                              {generationResult.description || 'No meta description generated yet.'}
                            </span>
                          </div>
                        </div>

                        {/* Social graph meta specifications */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 space-y-3">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Social Meta Tags (OpenGraph & Twitter Card)</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg space-y-1">
                              <span className="text-[10px] text-slate-400 block font-mono">og:title</span>
                              <p className="font-semibold">{generationResult.ogTitle || generationResult.title}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg space-y-1">
                              <span className="text-[10px] text-slate-400 block font-mono">twitter:title</span>
                              <p className="font-semibold">{generationResult.twitterTitle || generationResult.title}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg space-y-1 col-span-1 md:col-span-2">
                              <span className="text-[10px] text-slate-400 block font-mono">og:description</span>
                              <p className="text-slate-500">{generationResult.ogDescription || generationResult.description}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg space-y-1">
                              <span className="text-[10px] text-slate-400 block font-mono">robots</span>
                              <p className="font-mono text-emerald-500">{generationResult.robots || 'index, follow'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Direct action list: recommendations */}
                        {generationResult.recommendations && (
                          <div className="space-y-2">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Action Recommendations</span>
                            <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                              {generationResult.recommendations.map((rec: string, i: number) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. Social Bio Writer Presentation */}
                    {selectedTool.slug === 'social-bio-writer' && (
                      <div className="space-y-6">
                        
                        <div className="space-y-3">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Bio Variations</span>
                          
                          {generationResult.bios && generationResult.bios.map((bio: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 relative space-y-2 group">
                              <button
                                onClick={() => copyToClipboard(bio.text, `bio-${idx}`)}
                                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-200 opacity-60 group-hover:opacity-100 transition-opacity"
                                title="Copy bio variation"
                              >
                                {copiedKey === `bio-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Variation #{idx + 1}</p>
                              <p className="text-xs md:text-sm text-slate-800 dark:text-slate-100 pr-6 leading-relaxed whitespace-pre-line">
                                {bio.text}
                              </p>
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-900 text-[10px] text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-600 dark:text-slate-300">Rationale: </span>
                                {bio.strategy}
                              </div>
                            </div>
                          ))}
                        </div>

                        {generationResult.tips && (
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 space-y-2">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Profile Setup Optimization Tips</span>
                            <ul className="text-xs space-y-1 text-slate-500 leading-normal pl-4 list-decimal">
                              {generationResult.tips.map((tip: string, i: number) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. Cold Email Writer Presentation */}
                    {selectedTool.slug === 'cold-email-writer' && (
                      <div className="space-y-6">
                        
                        {/* Subject Lines options */}
                        {generationResult.subjectLines && (
                          <div className="space-y-2">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">High-Performing Subject Lines</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {generationResult.subjectLines.map((subj: any, idx: number) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-900 relative">
                                  <button
                                    onClick={() => copyToClipboard(subj, `subj-${idx}`)}
                                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-200"
                                    title="Copy subject line"
                                  >
                                    {copiedKey === `subj-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Option {idx + 1}</p>
                                  <p className="text-xs text-slate-800 dark:text-slate-100 font-semibold mt-1 pr-4">{subj}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Email Body template display */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-900 relative space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-900">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Cold Email Template</span>
                            <button
                              onClick={() => copyToClipboard(generationResult.emailBody, 'emailBody')}
                              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
                            >
                              {copiedKey === 'emailBody' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy template</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                            {generationResult.emailBody || 'No email copy drafted.'}
                          </p>
                        </div>

                        {/* Sequenced plan */}
                        {generationResult.followUpConcept && (
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 space-y-1.5">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Recommended Follow-up sequence</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                              {generationResult.followUpConcept}
                            </p>
                          </div>
                        )}

                        {/* Psychological copywriting tip */}
                        {generationResult.copywritingTip && (
                          <div className="p-3.5 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 rounded-lg text-xs flex gap-2.5 text-indigo-700 dark:text-indigo-400">
                            <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-bold">Conversion Psychology Tip:</span>
                              <p className="text-slate-500 dark:text-indigo-300/80 leading-normal font-sans">
                                {generationResult.copywritingTip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. Ad Copy Generator Presentation */}
                    {selectedTool.slug === 'ad-copy-generator' && (
                      <div className="space-y-6">
                        
                        <div className="space-y-4">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Facebook/Google Ad Variations</span>
                          
                          {generationResult.copies && generationResult.copies.map((item: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-900 space-y-3 relative group">
                              
                              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-900">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Variation {idx + 1}</span>
                                
                                <button
                                  onClick={() => copyToClipboard(`Headline: ${item.headline}\nDescription: ${item.description}\nPrimary: ${item.primaryText}`, `copy-${idx}`)}
                                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
                                  title="Copy all details"
                                >
                                  {copiedKey === `copy-${idx}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      <span className="text-emerald-500">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy all</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Recommended Headline</span>
                                  <p className="font-bold text-slate-900 dark:text-white p-2.5 bg-white dark:bg-slate-900 rounded-lg">{item.headline}</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Recommended Call to Action Button</span>
                                  <p className="font-mono text-emerald-500 font-bold p-2.5 bg-white dark:bg-slate-900 rounded-lg">{item.ctaRecommended || 'Learn More'}</p>
                                </div>
                                <div className="space-y-1 col-span-1 md:col-span-2">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Primary Ad Text (Caption)</span>
                                  <p className="text-slate-700 dark:text-slate-200 p-3 bg-white dark:bg-slate-900 rounded-lg whitespace-pre-wrap leading-relaxed">{item.primaryText}</p>
                                </div>
                                <div className="space-y-1 col-span-1 md:col-span-2">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Supporting Description (Ad Margin)</span>
                                  <p className="text-slate-500 dark:text-slate-400 p-2.5 bg-white dark:bg-slate-900 rounded-lg">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {generationResult.performanceAngles && (
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 text-xs">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-1">Ad Copy strategy angles</span>
                            <p className="text-slate-500 leading-normal">{generationResult.performanceAngles}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 5. UK Business Name Checker Presentation */}
                    {selectedTool.slug === 'business-name-checker' && (
                      <div className="space-y-6">
                        
                        <div className="space-y-4">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Brand Name & Domain Suggestions</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {generationResult.businessNames && generationResult.businessNames.map((item: any, idx: number) => (
                              <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 space-y-2 relative group">
                                <button
                                  onClick={() => copyToClipboard(`${item.name} - ${item.tagline}`, `brand-${idx}`)}
                                  className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-200 opacity-60 group-hover:opacity-100 transition-opacity animate-fade-in"
                                  title="Copy name and tagline"
                                >
                                  {copiedKey === `brand-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                
                                <p className="font-display font-black text-slate-900 dark:text-white text-base leading-tight">{item.name}</p>
                                <p className={`text-xs font-semibold italic ${currentAccent.text}`}>{item.tagline}</p>
                                
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-900 text-[10px] space-y-1">
                                  <p className="text-slate-500 leading-snug">
                                    <strong className="text-slate-700 dark:text-slate-300">Identity: </strong>
                                    {item.brandConcept}
                                  </p>
                                  <p className="text-emerald-500 font-mono flex items-center gap-1 font-semibold">
                                    <Globe className="w-3 h-3" /> {item.domainSuggestion}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {generationResult.brandingTips && (
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 text-xs">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-1">UK Corporate Registration Rules</span>
                            <ul className="space-y-1 pl-4 list-disc text-slate-500 leading-normal">
                              {generationResult.brandingTips.map((tip: string, i: number) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 6. Readability Scorer & Analyzer Presentation */}
                    {selectedTool.slug === 'readability-scorer' && (
                      <div className="space-y-6 animate-fade-in">
                        
                        {/* Executive Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          
                          {/* Score Radial Meter */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider mb-3">Readability Score</span>
                            
                            <div className="relative flex items-center justify-center w-28 h-28">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle
                                  cx="56"
                                  cy="56"
                                  r="46"
                                  className="stroke-slate-200 dark:stroke-slate-800"
                                  strokeWidth="8"
                                  fill="transparent"
                                />
                                <circle
                                  cx="56"
                                  cy="56"
                                  r="46"
                                  className={`transition-all duration-1000 ease-out ${
                                    (generationResult.score || 0) >= 60
                                      ? 'stroke-emerald-500'
                                      : (generationResult.score || 0) >= 40
                                      ? 'stroke-amber-500'
                                      : 'stroke-rose-500'
                                  }`}
                                  strokeWidth="8"
                                  fill="transparent"
                                  strokeDasharray={2 * Math.PI * 46}
                                  strokeDashoffset={2 * Math.PI * 46 * (1 - (generationResult.score || 0) / 100)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="text-center">
                                <span className="text-3xl font-bold font-display text-slate-800 dark:text-slate-100 block">
                                  {generationResult.score || 0}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">
                                  / 100
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                (generationResult.score || 0) >= 60
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                                  : (generationResult.score || 0) >= 40
                                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
                                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
                              }`}>
                                {generationResult.readingEase || 'Standard'}
                              </span>
                            </div>
                          </div>

                          {/* Grade and Passive Voice Info */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block mb-2">Comprehension Level</span>
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                                  <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{generationResult.gradeLevel || 'N/A'}</p>
                                  <p className="text-xs text-slate-400 dark:text-slate-500">Target: {toolInputs.targetAudience?.split(' (')[0] || 'Selected reader'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Passive Voice Usage</span>
                                <span className={`text-xs font-bold font-mono ${
                                  (generationResult.passiveVoicePercent || 0) > 20 ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                  {generationResult.passiveVoicePercent || 0}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    (generationResult.passiveVoicePercent || 0) > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(100, generationResult.passiveVoicePercent || 0)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1.5">Active voice is stronger and more persuasive.</p>
                            </div>
                          </div>

                          {/* Core Text Stats */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block mb-2.5">Text Composition</span>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Words</span>
                                  <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{generationResult.wordCount || 0}</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Sentences</span>
                                  <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{generationResult.sentenceCount || 0}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-850 flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono shrink-0">Focus:</span>
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md truncate font-semibold">
                                {toolInputs.focus || 'General Readability'}
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* Executive Summary */}
                        {generationResult.overallSummary && (
                          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-900">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-2">Executive Summary & Assessment</span>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                              {generationResult.overallSummary}
                            </p>
                          </div>
                        )}

                        {/* Detailed Metrics Breakdown */}
                        {generationResult.metrics && (
                          <div className="space-y-2.5">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Linguistic Dimensions</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              {generationResult.metrics.map((metric: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl flex flex-col justify-between space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{metric.name}</span>
                                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                                      metric.status === 'good' ? 'bg-emerald-500' : metric.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                                    }`} />
                                  </div>
                                  <div className="flex items-baseline justify-between pt-1">
                                    <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">{metric.value}</span>
                                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wide">{metric.status}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Side-By-Side Rewrite Panel */}
                        {generationResult.improvedText && (
                          <div className="space-y-3">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Comparison & Optimization Lab</span>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                              
                              {/* Original Input Text */}
                              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-900 flex flex-col overflow-hidden">
                                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-500 uppercase font-mono">Original Version</span>
                                  <span className="text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">{generationResult.wordCount} words</span>
                                </div>
                                <div className="p-5 flex-1 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed min-h-[160px]">
                                  {toolInputs.copy}
                                </div>
                              </div>

                              {/* Improved Text */}
                              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-900 flex flex-col overflow-hidden relative">
                                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between">
                                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase font-mono flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                                    Optimized Version
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => copyToClipboard(generationResult.improvedText, 'improvedText')}
                                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                      title="Copy optimized text"
                                    >
                                      {copiedKey === 'improvedText' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                                <div className="p-5 flex-1 text-xs md:text-sm text-slate-800 dark:text-slate-100 font-mono whitespace-pre-wrap leading-relaxed min-h-[160px] bg-indigo-500/[0.01]">
                                  {generationResult.improvedText}
                                </div>
                              </div>

                            </div>
                          </div>
                        )}

                        {/* Actionable Line-by-Line Suggestions */}
                        {generationResult.suggestions && generationResult.suggestions.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Critical Correction Recommendations</span>
                            
                            <div className="space-y-3">
                              {generationResult.suggestions.map((sug: any, idx: number) => {
                                let typeColor = 'border-slate-300 bg-slate-500/5';
                                if (sug.type === 'sentence-structure') typeColor = 'border-blue-500 bg-blue-500/5';
                                else if (sug.type === 'vocabulary') typeColor = 'border-indigo-500 bg-indigo-500/5';
                                else if (sug.type === 'passive-voice') typeColor = 'border-amber-500 bg-amber-500/5';
                                else if (sug.type === 'tone') typeColor = 'border-purple-500 bg-purple-500/5';
                                
                                return (
                                  <div key={idx} className={`p-4 rounded-xl border-l-4 ${typeColor} border-t border-r border-b border-slate-200/60 dark:border-slate-900/60 transition-all`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-400">
                                        Recommendation #{idx + 1} — {sug.type?.replace('-', ' ') || 'General'}
                                      </span>
                                    </div>
                                    
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal mb-3">
                                      {sug.reason}
                                    </p>

                                    {sug.original && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs">
                                        <div className="p-3 bg-rose-500/[0.03] dark:bg-rose-500/[0.01] border border-rose-500/10 rounded-lg">
                                          <span className="text-[9px] uppercase font-bold text-rose-400 font-mono block mb-1">Before:</span>
                                          <span className="line-through text-slate-500 block">{sug.original}</span>
                                        </div>
                                        <div className="p-3 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/10 rounded-lg">
                                          <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono block mb-1">After (Better):</span>
                                          <span className="text-slate-800 dark:text-slate-200 font-medium block">{sug.suggested}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* General Text Fallback Output if JSON parse failed */}
                    {generationResult.rawText && (
                      <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-900 relative">
                        <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-2">Composed Output</span>
                        <button
                          onClick={() => copyToClipboard(generationResult.rawText, 'rawText')}
                          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-200"
                          title="Copy raw text"
                        >
                          {copiedKey === 'rawText' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-100 font-mono whitespace-pre-wrap leading-relaxed pr-6">
                          {generationResult.rawText}
                        </p>
                      </div>
                    )}

                    {/* Context-aware Affiliate Growth Loop */}
                    <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-dashed border-indigo-500/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 shrink-0">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            {selectedTool.slug === 'meta-tag-generator' && "SEO Bonus: Hostinger & Semrush Partner Offer"}
                            {selectedTool.slug === 'social-bio-writer' && "Branding Perk: Canva Pro 30-Day Trial"}
                            {selectedTool.slug === 'cold-email-writer' && "Outreach Perk: Hunter.io Lead Verifier"}
                            {selectedTool.slug === 'readability-scorer' && "Editing Bonus: Grammarly Premium Assistant"}
                            {!['meta-tag-generator', 'social-bio-writer', 'cold-email-writer', 'readability-scorer'].includes(selectedTool.slug) && "SaaS Recommended: Framer Website Engine"}
                            <span className="text-[9px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">AFFILIATE</span>
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {selectedTool.slug === 'meta-tag-generator' && "Secure your domain name via Hostinger (use code DIGIBLEND for extra 10% off) and map out competitors on Semrush."}
                            {selectedTool.slug === 'social-bio-writer' && "Unlock thousands of premium social avatar templates, covers, and typography elements free for 30 days."}
                            {selectedTool.slug === 'cold-email-writer' && "Instantly hunt emails behind any website URL and verify address deliverability to prevent bounce flags."}
                            {selectedTool.slug === 'readability-scorer' && "Eliminate passive voice blocks, refine sentence cadence, and correct style guidelines in one click."}
                            {!['meta-tag-generator', 'social-bio-writer', 'cold-email-writer', 'readability-scorer'].includes(selectedTool.slug) && "Turn your freshly generated conversion copy into a live web application in minutes with Framer."}
                          </p>
                        </div>
                      </div>
                      <a
                        href={
                          selectedTool.slug === 'meta-tag-generator' ? "https://www.hostinger.com" :
                          selectedTool.slug === 'social-bio-writer' ? "https://www.canva.com" :
                          selectedTool.slug === 'cold-email-writer' ? "https://www.hunter.io" :
                          selectedTool.slug === 'readability-scorer' ? "https://www.grammarly.com" :
                          "https://www.framer.com"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        className="shrink-0 text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        Claim Offer
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* Dynamic Section: PRICING PLANS */}
        {activeSection === 'pricing' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header copy */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentAccent.badge}`}>
                <Gem className="w-3.5 h-3.5" />
                Flexible upgrade options
              </span>
              <h1 className="text-3.5xl md:text-4.5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Self-Serve Pricing Built for Speed
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Start completely free. Unlock unlimited usage, advanced copywriting models, and agency bulk export capabilities. No sales calls, no hassle.
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* FREE plan card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-sm relative">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider">Free Starter Tier</span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">Daily Trial</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-black text-slate-900 dark:text-white">₹0</span>
                    <span className="text-xs text-slate-400">/ forever</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Great for solopreneurs getting started or wanting to test the conversion qualities of our copywriting suites.
                  </p>

                  <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-900">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>3 AI generations per day across tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Access to all 5 AI marketing utilities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Google Search metadata previews</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>No bulk exporting options</span>
                    </li>
                  </ul>
                </div>

                <button
                  disabled={plan === 'FREE'}
                  onClick={() => setPlan('FREE')}
                  className="w-full mt-8 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {plan === 'FREE' ? 'Current Plan Active' : 'Downgrade to FREE'}
                </button>
              </div>

              {/* PRO plan card (Active highlight) */}
              <div className={`bg-white dark:bg-slate-900 rounded-2xl border-2 ${currentAccent.border} p-6 md:p-8 space-y-6 flex flex-col justify-between ${currentAccent.shadow} shadow-lg relative`}>
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-white font-mono text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md shadow-amber-500/20">
                  Most Popular
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-amber-500 font-bold uppercase font-mono tracking-wider">Uncapped Growth Plan</span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">DigiBlend Pro Suite</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4.5xl font-display font-black text-slate-900 dark:text-white">₹499</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Uncap your productivity. Write cold emails, social bios, and rankable SEO meta assets instantly on loop.
                  </p>

                  <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-900">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold">Unlimited AI Generations (Uncapped)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>All 5 conversion-optimized utilities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Priority Gemini 3.5 AI latency speeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>One-click clipboard export & copy structures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Priority support directly from founder team</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={plan === 'PRO' ? undefined : triggerRazorpayCheckout}
                  className={`w-full mt-8 py-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer bg-gradient-to-r ${currentAccent.fromTo} hover:opacity-95 shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2`}
                >
                  {plan === 'PRO' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      PRO Membership Active
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Upgrade via Razorpay (₹499)
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Satisfaction Trust Banner */}
            <div className="max-w-xl mx-auto p-5 bg-slate-100 dark:bg-slate-900 rounded-xl text-center border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-start justify-center gap-2">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Fully secured. Complete your upgrade simulated via standard sandbox Razorpay SDK callbacks. Cancel anytime from your account console with a single click.</span>
            </div>

          </div>
        )}

        {/* Dynamic Section: USAGE HISTORY & ACCOUNT */}
        {activeSection === 'account' && (
          !currentUser ? (
            <div className="max-w-md mx-auto text-center py-16 space-y-6 animate-fade-in bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm mt-8">
              <div className="inline-flex p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">Account Console Gated</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Analytics dashboards, Pro membership controls, referral credit builders, and growth playbook downloads are locked for guests.
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveSection('landing');
                    setTimeout(() => {
                      const el = document.getElementById('register');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Join DigiBlend Free
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            
            {/* Header info */}
            <div className="space-y-2">
              <h1 className="text-2.5xl md:text-3.5xl font-display font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <span>Account Console & Analytics</span>
                {role === 'ADMIN' && (
                  <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    OWNER ADMIN
                  </span>
                )}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Manage your Pro subscription, monitor 30-day usage velocity, copy referral links, and download custom growth resources.
              </p>
            </div>

            {/* Grid display layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Account, Referral & Downloads Column */}
              <div className="space-y-6">
                
                {/* 1. Account details card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-5 shadow-sm">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Subscription Summary
                  </span>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Membership Tier</span>
                      <span className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${plan === 'PRO' ? 'text-amber-500' : 'text-slate-600 dark:text-slate-350'}`}>
                        {plan === 'PRO' ? <Sparkles className="w-4.5 h-4.5" /> : <Info className="w-4.5 h-4.5" />}
                        {plan === 'PRO' ? 'DigiBlend PRO' : 'DigiBlend FREE'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Daily Quota Invocations</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5 font-mono">
                        {plan === 'PRO' ? '∞ Uncapped Uses' : `${todayUsage} of 3 generations used`}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Billing Interval</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 block mt-0.5">
                        {plan === 'PRO' ? "₹499/mo (Renews July 30, 2026)" : "₹0/forever"}
                      </span>
                    </div>

                    {plan === 'PRO' ? (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel your DigiBlend PRO subscription? You will lose uncapped AI writes immediately.")) {
                            setPlan('FREE');
                          }
                        }}
                        className="w-full py-2 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
                      >
                        Cancel Membership (Demo)
                      </button>
                    ) : (
                      <button
                        onClick={triggerRazorpayCheckout}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer bg-gradient-to-r ${currentAccent.fromTo} hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Upgrade via Razorpay
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Referral Tracking Card (Week 7 Growth) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Partner Referral Loop
                    </span>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider">
                      15% PAYOUT
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    Earn recurring commission for lifetime purchases made by marketers you introduce to DigiBlend.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900 relative">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-1">Your Share Link</span>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 truncate font-mono">
                          https://digiblend.co.in/?ref=ui_manish
                        </span>
                        <button
                          onClick={() => copyToClipboard("https://digiblend.co.in/?ref=ui_manish", "referral_link")}
                          className="text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 p-1"
                          title="Copy Link"
                        >
                          {copiedKey === 'referral_link' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] border-t border-slate-100 dark:border-slate-800/60 pt-2 text-slate-400 font-mono">
                      <span>Referral status:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {referredBy ? `Referred by: ${referredBy}` : "None (Direct)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Gumroad/Razorpay One-time Digital Download (Week 7 Product) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider">
                      Premium Digital Product
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      The Ultimate 2026 SaaS Growth Playbook
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      64-page master blueprint to scale simple SaaS tools and copywriting setups to $10,000/MRR.
                    </p>
                  </div>

                  {playbookPurchased ? (
                    <a
                      href="https://ai.studio/build"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Growth Playbook (PDF)
                    </a>
                  ) : (
                    <button
                      onClick={triggerPlaybookCheckout}
                      disabled={buyingPlaybook}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {buyingPlaybook ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5" />
                      )}
                      <span>Buy Playbook • ₹99</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Right Column: Transaction usage history logs list + 30-Day SVG Chart */}
              <div className="md:col-span-2 space-y-6">
                
                {/* 30-Day Usage History Bar Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                        Usage Trends (Last 30 Days)
                      </span>
                      <p className="text-[11px] text-slate-400">Daily invocation metrics of AI content writers and checkers.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-800">
                      <BarChart className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Avg: {Math.round(last30DaysUsage.reduce((acc, curr) => acc + curr.count, 0) / 30 * 10) / 10} / day</span>
                    </div>
                  </div>

                  {/* Chart Grid */}
                  <div className="h-44 flex items-end gap-1.5 pt-6 border-b border-slate-100 dark:border-slate-900/60 pb-1.5 relative">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-100 dark:border-slate-900/40 text-[9px] text-slate-400 pt-1 pointer-events-none">
                      Max: {maxUsageVal} runs
                    </div>
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100 dark:border-slate-900/40 text-[9px] text-slate-400 pt-1 pointer-events-none">
                      {Math.round(maxUsageVal / 2)} runs
                    </div>
                    
                    {last30DaysUsage.map((day, idx) => {
                      const percentHeight = (day.count / maxUsageVal) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          {/* Bar columns */}
                          <div 
                            style={{ height: `${Math.max(4, percentHeight)}%` }} 
                            className={`w-full rounded-t-sm transition-all duration-300 relative ${
                              day.count > 0 
                                ? 'bg-gradient-to-t from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500' 
                                : 'bg-slate-100 dark:bg-slate-950/40 hover:bg-slate-200 dark:hover:bg-slate-850'
                            }`}
                          >
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-slate-950 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap font-mono">
                              {day.count} uses ({day.label})
                            </div>
                          </div>
                          
                          {/* Labels (staggered display for readability) */}
                          {idx % 4 === 0 && (
                            <span className="absolute top-full mt-1.5 text-[8px] text-slate-400 font-mono font-medium">
                              {day.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Today's Transaction Log card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 font-mono">
                      Today's Transaction Logs
                    </span>
                    
                    {usageLogs.length > 0 && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleExportHistory}
                          className={`text-xs ${currentAccent.text} hover:underline flex items-center gap-1 cursor-pointer`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Export (.CSV)
                        </button>
                        <button
                          onClick={() => setUsageLogs([])}
                          className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Clear history
                        </button>
                      </div>
                    )}
                  </div>

                  {usageLogs.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-900/60 flex flex-col items-center justify-center gap-2">
                      <History className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                      <p>No transactions logged today.</p>
                      <p className="text-[10px] text-slate-500">Go to the AI Utilities workspace to generate your first conversion copy asset.</p>
                      <button
                        onClick={() => setActiveSection('tools')}
                        className={`mt-2 text-xs font-bold px-4 py-1.5 rounded-lg border ${currentAccent.border} ${currentAccent.text}`}
                      >
                        Start building
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                      {usageLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900/60 flex items-center justify-between text-xs hover:border-slate-300 dark:hover:border-slate-800 transition-colors gap-2">
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-slate-200 truncate">{log.toolName}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">ID: {log.id} • {new Date(log.usedAt).toLocaleTimeString()}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                              SUCCESS
                            </span>
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete transaction log entry"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
          )
        )}

        {/* Dynamic Section: ADMIN CONSOLE */}
        {activeSection === 'admin' && role === 'ADMIN' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-900 pb-5">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-mono flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 animate-pulse" />
                  Gated Root Operator Environment
                </span>
                <h1 className="text-2.5xl md:text-3.5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  DigiBlend SaaS Command Panel
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  Monitor key SaaS health KPIs, override partner subscriptions, manage client roles, and audit developer system logs.
                </p>
              </div>

              {/* Tab Selector Pill */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                {(['dashboard', 'users', 'subscriptions', 'actions'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setAdminActiveTab(tab);
                      setSelectedAdminUser(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      adminActiveTab === tab
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab: 1. DASHBOARD OVERVIEW */}
            {adminActiveTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                {/* Real-time Metrics Overview Component */}
                <MetricsOverview 
                  saasUsers={saasUsers} 
                  saasSubscriptions={saasSubscriptions} 
                  usageLogs={usageLogs} 
                />

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: MRR */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Estimated MRR</span>
                      <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        ₹{saasSubscriptions.length * 499}
                      </h3>
                      <p className="text-[10px] text-slate-400">₹499/mo per active Pro seats</p>
                    </div>
                  </div>

                  {/* Card 2: Registered Users */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Registrants</span>
                      <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        {saasUsers.length}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">Includes {saasUsers.filter(u => u.role === 'ADMIN').length} admin seats</p>
                    </div>
                  </div>

                  {/* Card 3: Invocations */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Generations</span>
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        {saasUsers.reduce((sum, u) => sum + u.usageCount, 0)}
                      </h3>
                      <p className="text-[10px] text-slate-400">Avg: {Math.round(saasUsers.reduce((sum, u) => sum + u.usageCount, 0) / saasUsers.length)} writes per customer</p>
                    </div>
                  </div>

                  {/* Card 4: Referral Conversion */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-900 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Partner Referrals</span>
                      <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                        <Gift className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        {saasUsers.filter(u => u.referredBy).length}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {Math.round(saasUsers.filter(u => u.referredBy).length / saasUsers.length * 100)}% of user base from referrers
                      </p>
                    </div>
                  </div>

                </div>

                {/* SaaS Revenue Metrics & Distribution View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Plan Distribution Pie Representation */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-sm space-y-4">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Subscribers Allocation
                    </span>
                    
                    <div className="space-y-3">
                      {/* Pro bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-700 dark:text-slate-300">DigiBlend PRO (₹499)</span>
                          <span>{saasUsers.filter(u => u.plan === 'PRO').length} users ({Math.round(saasUsers.filter(u => u.plan === 'PRO').length / saasUsers.length * 100)}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${saasUsers.filter(u => u.plan === 'PRO').length / saasUsers.length * 100}%` }} 
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400" 
                          />
                        </div>
                      </div>

                      {/* Free bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Free Tier (₹0)</span>
                          <span>{saasUsers.filter(u => u.plan === 'FREE').length} users ({Math.round(saasUsers.filter(u => u.plan === 'FREE').length / saasUsers.length * 100)}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${saasUsers.filter(u => u.plan === 'FREE').length / saasUsers.length * 100}%` }} 
                            className="h-full bg-gradient-to-r from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span><strong>Growth Advice:</strong> Your referral-driven registrant loop accounts for {saasUsers.filter(u => u.referredBy).length} customer signups. Running a localized social offer to your existing partner referrers will increase the MRR quickly.</span>
                    </div>
                  </div>

                  {/* Right Column: Founder Quick Actions */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-sm space-y-4">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Founder Quick Command Shortcuts
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <button 
                        onClick={() => {
                          setAdminActiveTab('users');
                          setUserSearchQuery('');
                        }}
                        className="p-4 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-800 rounded-xl border border-slate-200 dark:border-slate-900 text-left space-y-1 transition-all cursor-pointer group"
                      >
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                          <span>User Access Overrides</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          Instantly promote customer roles, grant custom PRO coupons, and edit access credentials.
                        </p>
                      </button>

                      <button 
                        onClick={() => {
                          setAdminActiveTab('actions');
                        }}
                        className="p-4 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-800 rounded-xl border border-slate-200 dark:border-slate-900 text-left space-y-1 transition-all cursor-pointer group"
                      >
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                          <span>Developer Security Audit</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          Inspect the real-time timeline logs of all administrative manipulations performed in this active container.
                        </p>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Sub-tab: 2. USERS DIRECTORY */}
            {adminActiveTab === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Users list directory - Col Span 2 */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm">
                  
                  {/* Search box header */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Registrants Directory ({saasUsers.length})
                    </span>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by email..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg text-slate-800 dark:text-slate-150 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Sorting Header Row */}
                  <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mr-1">
                      Sort Directory:
                    </span>
                    {(['email', 'plan', 'lastActive'] as const).map((field) => {
                      const isActive = userSortField === field;
                      const label = field === 'lastActive' ? 'Date' : field === 'email' ? 'Email' : 'Plan';
                      return (
                        <button
                          key={field}
                          type="button"
                          onClick={() => {
                            if (userSortField === field) {
                              setUserSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                            } else {
                              setUserSortField(field);
                              setUserSortOrder(field === 'lastActive' ? 'desc' : 'asc');
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                            isActive
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <span>{label}</span>
                          {isActive && (
                            userSortOrder === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-rose-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-rose-500 animate-pulse" />
                            )
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Users list rendering */}
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {sortedSaasUsers
                      .filter(u => u.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
                      .map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setSelectedAdminUser(u);
                            setOverridePlanValue(u.plan);
                            setOverrideRoleValue(u.role);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            selectedAdminUser?.id === u.id
                              ? 'bg-rose-500/5 border-rose-500/30'
                              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block truncate max-w-[240px]">
                              {u.email}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-400 font-mono">
                              <span>ID: {u.id}</span>
                              <span>•</span>
                              <span>Active: {new Date(u.lastActive).toLocaleDateString()}</span>
                              {u.referredBy && (
                                <>
                                  <span>•</span>
                                  <span className="text-indigo-500">Ref: {u.referredBy}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              {u.role}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${u.plan === 'PRO' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                              {u.plan}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-semibold pl-1.5 border-l border-slate-200 dark:border-slate-800">
                              {u.usageCount} writes
                            </span>
                          </div>
                        </div>
                      ))}

                    {saasUsers.filter(u => u.email.toLowerCase().includes(userSearchQuery.toLowerCase())).length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-10 font-mono">No customer registrants match search term.</p>
                    )}
                  </div>

                </div>

                {/* Administrative Override Action Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm relative">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Administrative Override Console
                  </span>

                  {selectedAdminUser ? (
                    <div className="space-y-4 text-xs">
                      
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-900">
                        <span className="text-[9px] uppercase text-slate-400 font-mono block">Selected Client Account</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate mt-0.5">{selectedAdminUser.email}</span>
                      </div>

                      {/* Modify Plan Select */}
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block font-mono text-[10px] uppercase">Force Subscription Tier</label>
                        <select
                          value={overridePlanValue}
                          onChange={(e) => setOverridePlanValue(e.target.value as SubscriptionPlan)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-2 font-bold focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-200"
                        >
                          <option value="FREE">FREE tier</option>
                          <option value="PRO">PRO membership</option>
                        </select>
                      </div>

                      {/* Modify Role Select */}
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block font-mono text-[10px] uppercase">Access Authority Level</label>
                        <select
                          value={overrideRoleValue}
                          onChange={(e) => setOverrideRoleValue(e.target.value as Role)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-2 font-bold focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-200"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>

                      {/* Audit Note */}
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block font-mono text-[10px] uppercase">Audit Ledger Log Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Manually gifted pro slot..."
                          value={overridePlanNotes}
                          onChange={(e) => setOverridePlanNotes(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setSelectedAdminUser(null)}
                          className="flex-1 py-2 text-center rounded-lg border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleApplyOverride}
                          className="flex-1 py-2 text-center text-white bg-rose-500 hover:bg-rose-600 rounded-lg font-bold shadow-sm cursor-pointer"
                        >
                          Apply Change
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-150 dark:border-slate-900 rounded-xl flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                      <p className="text-[11px]">Select any client registrant in the left directory to open active overrides controls.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-tab: 3. ACTIVE SUBSCRIPTIONS */}
            {adminActiveTab === 'subscriptions' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Razorpay Subscriptions Registry Logs ({saasSubscriptions.length})
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 font-mono text-slate-400">
                        <th className="py-2.5 px-3">Subscription ID</th>
                        <th className="py-2.5 px-3">Client Email</th>
                        <th className="py-2.5 px-3">Transaction status</th>
                        <th className="py-2.5 px-3">Subscribed date</th>
                        <th className="py-2.5 px-3">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saasSubscriptions.map((sub) => (
                        <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[10px] text-indigo-500 font-bold">{sub.razorpaySubId}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{sub.userEmail}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{new Date(sub.startedAt).toLocaleDateString()}</td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{new Date(sub.expiresAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: 4. ADMIN AUDIT TRAIL LOGS */}
            {adminActiveTab === 'actions' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-900 p-5 space-y-4 shadow-sm">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Administrative System Logs Audit Timeline ({saasAdminActions.length})
                </span>

                <div className="space-y-3.5">
                  {saasAdminActions.map((act) => (
                    <div key={act.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-150 dark:border-slate-900/65 flex items-start gap-3.5 text-xs">
                      <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shrink-0 mt-0.5">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1 w-full font-sans">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Action: <span className="text-indigo-500 font-mono font-bold">{act.action}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(act.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Target Client: <span className="font-bold text-slate-700 dark:text-slate-300">{act.targetEmail}</span>
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 italic text-[11px] bg-slate-100/65 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800/80 mt-1 leading-normal font-medium">
                          "{act.notes}"
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono mt-1">
                          Operator Admin: {act.adminEmail} • Log ID: {act.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* FULL-SCREEN TEXTAREA WORKSPACE MODAL */}
      {activeExpandedInputId && (() => {
        const activeInput = selectedTool.inputs.find(inp => inp.id === activeExpandedInputId);
        if (!activeInput) return null;
        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 md:p-10 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col relative animate-scale-up">
              
              {/* Header */}
              <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                    {selectedTool.name} Workspace
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                    {activeInput.label} {activeInput.required && <span className="text-rose-500">*</span>}
                  </h3>
                </div>
                
                <button
                  type="button"
                  onClick={() => setActiveExpandedInputId(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer"
                  title="Minimize Workspace"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow p-6 flex flex-col space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                <textarea
                  autoFocus
                  required={activeInput.required}
                  value={toolInputs[activeInput.id] || ''}
                  onChange={(e) => setToolInputs(prev => ({ ...prev, [activeInput.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      if (!(activeInput.required && !(toolInputs[activeInput.id] || '').trim())) {
                        setActiveExpandedInputId(null);
                        handleGenerate(e as any);
                      }
                    }
                  }}
                  placeholder={activeInput.placeholder}
                  className="w-full flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 text-sm md:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all resize-none shadow-inner leading-relaxed font-sans"
                />
                
                {activeInput.description && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic pl-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeInput.description}</span>
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {((toolInputs[activeInput.id] || '').length)} characters written • 
                  <kbd className="inline-flex items-center gap-0.5 ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-250 dark:bg-slate-850 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700 select-none">
                    <span>{isMac ? '⌘' : 'Ctrl'}</span>
                    <span>+</span>
                    <span>Enter</span>
                  </kbd> to submit
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveExpandedInputId(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    Minimize & Keep Editing
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (cooldownSeconds > 0 || isGenerating) return;
                      setActiveExpandedInputId(null);
                      handleGenerate(e as any);
                    }}
                    disabled={isGenerating || cooldownSeconds > 0 || (activeInput.required && !(toolInputs[activeInput.id] || '').trim())}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                      (isGenerating || cooldownSeconds > 0 || (activeInput.required && !(toolInputs[activeInput.id] || '').trim()))
                        ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : cooldownSeconds > 0 ? (
                      <>
                        <Timer className="w-3.5 h-3.5 animate-spin" />
                        <span>Cooldown ({cooldownSeconds}s)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* RAZORPAY CHECKOUT INTERACTIVE OVERLAY MODAL */}
      {showRazorpay && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative animate-scale-up">
            
            {/* Header branding block */}
            <div className="bg-[#121c2c] text-white p-5 flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide leading-none uppercase">Razorpay Secure</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Payment Gateway Partner</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase font-mono">Amount to pay</span>
                <span className="text-lg font-black tracking-tight font-display">₹499.00</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowRazorpay(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Cancel Checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Context */}
            <div className="bg-[#1b2b3e] text-[11px] text-slate-300 px-5 py-2 flex items-center justify-between border-t border-slate-700/50">
              <span>Merchant: <strong>DigiBlend Toolkit (MDPL)</strong></span>
              <span>Test Mode</span>
            </div>

            {/* Body content based on Razorpay checkout steps */}
            <div className="p-6 flex-grow space-y-6 bg-slate-50 min-h-[280px] flex flex-col justify-between">
              
              {/* STEP 1: PAYMENT METHOD SELECTOR */}
              {razorpayStep === 'options' && (
                <div className="space-y-4 flex-grow">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Select Payment Method
                  </span>

                  <div className="space-y-2">
                    
                    {/* UPI Button */}
                    <button
                      onClick={() => {
                        setPaymentOption('upi');
                        setRazorpayStep('upi');
                      }}
                      className="w-full p-4 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center gap-3.5 transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-xs text-slate-800">UPI (Google Pay, PhonePe, Paytm)</p>
                        <p className="text-[10px] text-slate-400">Instant setup using VPA handle address</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Credit Card Button */}
                    <button
                      onClick={() => {
                        setPaymentOption('card');
                        setRazorpayStep('card');
                      }}
                      className="w-full p-4 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center gap-3.5 transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-xs text-slate-800">Credit / Debit Card</p>
                        <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                  </div>
                </div>
              )}

              {/* STEP 2: CREDIT CARD INPUTS */}
              {razorpayStep === 'card' && (
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setRazorpayStep('options')} className="text-xs text-indigo-600 font-bold hover:underline">
                      &larr; Back
                    </button>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Card Specifications
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="12 / 29"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">CVV Code</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition-colors"
                  >
                    Simulate Payment Successful (₹499)
                  </button>
                </div>
              )}

              {/* STEP 3: UPI VPA INPUTS */}
              {razorpayStep === 'upi' && (
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setRazorpayStep('options')} className="text-xs text-indigo-600 font-bold hover:underline">
                      &larr; Back
                    </button>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      UPI VPA Identity
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">UPI ID / VPA Handle</label>
                      <input
                        type="text"
                        placeholder="manishkumar@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal pl-0.5">
                      Enter any mock ID handles (e.g. name@upi) to check the transaction webhook simulation.
                    </p>
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition-colors"
                  >
                    Simulate Payment Successful (₹499)
                  </button>
                </div>
              )}

              {/* STEP 4: PROCESSING STATUS SPINNER */}
              {razorpayStep === 'processing' && (
                <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="font-bold text-sm text-slate-800">Processing Subscription Payment</p>
                    <p className="text-xs text-slate-400 mt-1">Interfacing with secure bank servers ...</p>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT COMPLETED SUCCESS */}
              {razorpayStep === 'success' && (
                <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-4 text-center animate-scale-up">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-800">Subscription Activated!</h4>
                    <p className="text-xs text-slate-500 mt-1 pr-2">
                      Razorpay Webhook verification has successfully mapped your account state to <strong>PRO Membership Plan</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowRazorpay(false);
                      setActiveSection('tools');
                    }}
                    className="w-full mt-4 bg-[#121c2c] hover:opacity-90 text-white font-bold py-2.5 rounded-lg text-xs transition-opacity"
                  >
                    Return to AI Toolkit Workspace
                  </button>
                </div>
              )}

              {/* Trust disclaimer footnote */}
              {razorpayStep !== 'processing' && razorpayStep !== 'success' && (
                <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure 256-bit SSL encrypted connection</span>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Floating customer support chat */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {showSupportChat && (
          <div className="w-[min(92vw,400px)] h-[560px] bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
            <div className={`px-4 py-3 bg-gradient-to-r ${currentAccent.fromTo} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">Blend Support</p>
                  <p className="text-[10px] text-white/75 font-mono">Online • plans, credits, billing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportChat(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close support chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Answers from the DigiBlend support knowledge base</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
              {supportChatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                      message.role === 'user'
                        ? `${currentAccent.bg} text-white`
                        : message.kind === 'follow-up'
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-slate-700 dark:text-slate-100 border border-indigo-200 dark:border-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {message.content}
                    {message.kind === 'follow-up' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href="https://digiblend.in/contact"
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-white ${currentAccent.bg}`}
                        >
                          Book a call
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href="mailto:support@digiblend.in"
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                        >
                          Email support
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isSupportChatSending && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-500 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse [animation-delay:120ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse [animation-delay:240ms]" />
                    </div>
                    <p>{SUPPORT_CHAT_HINTS[supportChatHintIndex]}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSupportChatSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {['Free vs Pro', 'Credits', 'Refunds'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setSupportChatInput(suggestion)}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={supportChatInput}
                  onChange={(e) => setSupportChatInput(e.target.value)}
                  placeholder="Ask about plans, credits, billing..."
                  className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!supportChatInput.trim() || isSupportChatSending}
                  className={`w-10 h-10 rounded-xl ${currentAccent.bg} hover:opacity-90 disabled:opacity-50 text-white flex items-center justify-center transition-opacity`}
                  aria-label="Send support chat message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowSupportChat((prev) => !prev)}
          className={`h-12 px-4 rounded-full bg-gradient-to-r ${currentAccent.fromTo} text-white shadow-xl shadow-indigo-500/20 flex items-center gap-2 text-sm font-bold hover:opacity-95 transition-all`}
          aria-label="Open support chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Chat</span>
        </button>
      </div>

      {/* Footer copyright notice block */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-950 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>DigiBlend Toolkit can make mistakes • check important info</p>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:underline" onClick={() => setActiveSection('tools')}>Utilities</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline" onClick={() => setActiveSection('pricing')}>Pricing</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline" onClick={handleTestReset}>Reset Test</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
