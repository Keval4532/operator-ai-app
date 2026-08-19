'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-8 w-20 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/80 p-0.5 shadow-sm backdrop-blur-sm">
      <button
        onClick={() => setTheme('light')}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-amber-500 shadow-sm font-bold scale-105'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-slate-800 text-emerald-400 shadow-sm font-bold scale-105'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-800 text-indigo-500 dark:text-indigo-400 shadow-sm font-bold scale-105'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="System Auto Mode"
        aria-label="System Auto Mode"
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
