'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, ArrowRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface PublicHeaderProps {
  onOpenOnboarding: (plan?: 'STARTER' | 'GROWTH' | 'SCALE') => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenOnboarding }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'ROI Calculator', href: '#calculator' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Operator<span className="text-emerald-600 dark:text-emerald-400">AI</span>
            </span>
          </div>
        </Link>

        {/* Center Anchor Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/overview"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            <span>Live Demo</span>
          </Link>

          <Link
            href="/login"
            className="hidden sm:inline-block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2 py-1.5 transition"
          >
            Sign In
          </Link>

          <button
            onClick={() => onOpenOnboarding('GROWTH')}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold shadow-xs hover:shadow-sm transition hover:scale-[1.02]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/overview"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span>Explore Live Demo</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="block text-center py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
