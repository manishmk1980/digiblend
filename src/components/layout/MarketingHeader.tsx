'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { LayoutDashboard, LogIn, Sparkles, Terminal, UserPlus, Zap } from 'lucide-react';
import { ThemeToggle } from '@/src/components/layout/ThemeToggle';
import { isClerkPubliclyConfigured } from '@/src/lib/clerk-config';

const publicLinks = [
  { href: '/tools', label: 'AI Utilities' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#use-cases', label: 'Use Cases' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

const appLinks = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app', label: 'AI Utilities' },
  { href: '/account', label: 'Usage & Account' },
  { href: '/settings', label: 'Profile' },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
        isActive
          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
    >
      {label}
    </Link>
  );
}

function PublicNav() {
  return (
    <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
      {publicLinks.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}

function AppNav() {
  return (
    <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
      {appLinks.map((link) => (
        <NavLink key={`${link.href}-${link.label}`} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}

function AuthActions({ clerkEnabled }: { clerkEnabled: boolean }) {
  if (clerkEnabled) {
    return (
      <>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="hidden sm:flex px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              Start Free
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link
            href="/pricing"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Go Pro
          </Link>
          <div className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
            <UserButton />
          </div>
        </Show>
      </>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="hidden sm:flex px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md items-center gap-1.5"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Start Free
      </Link>
      <Link
        href="/app"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        Dashboard
      </Link>
    </>
  );
}

export function MarketingHeader() {
  const clerkEnabled = isClerkPubliclyConfigured();

  return (
    <header className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/10">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-slate-900 dark:text-slate-50 leading-none tracking-tight text-lg block">
              DigiBlend
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono">AI marketing utilities</span>
          </div>
        </Link>

        {clerkEnabled ? (
          <>
            <Show when="signed-out">
              <PublicNav />
            </Show>
            <Show when="signed-in">
              <AppNav />
            </Show>
          </>
        ) : (
          <PublicNav />
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthActions clerkEnabled={clerkEnabled} />
        </div>
      </div>
    </header>
  );
}
