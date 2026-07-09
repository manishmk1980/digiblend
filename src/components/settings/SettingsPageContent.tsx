'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AccentColor,
  accents,
  getStoredAccentColor,
  setStoredAccentColor,
} from '@/src/lib/accent-colors';
import { ThemeToggle } from '@/src/components/layout/ThemeToggle';

export function SettingsPageContent() {
  const [accentColor, setAccentColor] = useState<AccentColor>('indigo');

  useEffect(() => {
    setAccentColor(getStoredAccentColor());
  }, []);

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(color);
    setStoredAccentColor(color);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Profile & Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage appearance preferences for your DigiBlend workspace.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance Settings</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Choose your accent color for buttons, highlights, and workspace UI.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(accents) as AccentColor[]).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleAccentChange(color)}
              className={`w-8 h-8 rounded-full ${accents[color].dot} transition-transform ${
                accentColor === color ? 'ring-2 ring-slate-400 dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              title={`${color.charAt(0).toUpperCase()}${color.slice(1)} accent`}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Theme</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark mode.</p>
        </div>
        <ThemeToggle />
      </section>

      <div className="flex gap-3">
        <Link href="/app" className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white">
          Back to Dashboard
        </Link>
        <Link href="/account" className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800">
          Usage & Account
        </Link>
      </div>
    </div>
  );
}
