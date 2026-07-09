export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';

export const ACCENT_STORAGE_KEY = 'digiblend_accent_color';

export const accents: Record<
  AccentColor,
  {
    bg: string;
    hoverBg: string;
    text: string;
    border: string;
    glow: string;
    badge: string;
    shadow: string;
    fromTo: string;
    dot: string;
  }
> = {
  indigo: {
    bg: 'bg-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-500/30',
    glow: 'shadow-indigo-500/10 dark:shadow-indigo-500/20',
    badge: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
    shadow: 'shadow-indigo-500/5 dark:shadow-indigo-500/10',
    fromTo: 'from-indigo-600 to-indigo-400',
    dot: 'bg-indigo-500',
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
    dot: 'bg-emerald-500',
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
    dot: 'bg-rose-500',
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
    dot: 'bg-amber-500',
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
    dot: 'bg-cyan-500',
  },
};

export function isAccentColor(value: string): value is AccentColor {
  return value in accents;
}

export function getStoredAccentColor(): AccentColor {
  if (typeof window === 'undefined') {
    return 'indigo';
  }

  const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
  return stored && isAccentColor(stored) ? stored : 'indigo';
}

export function setStoredAccentColor(color: AccentColor) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ACCENT_STORAGE_KEY, color);
    window.dispatchEvent(new CustomEvent('digiblend-accent-change', { detail: color }));
  }
}
