'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  Sparkles,
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Brain,
  Bell,
  Menu,
  X,
  Zap,
  Command,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

interface HeaderProps {
  storeName: string;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenTerminal: () => void;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  storeName,
  isDemoMode,
  onToggleDemoMode,
  onOpenTerminal,
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 4 Consolidated Workspaces for v5.0
  const navLinks = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/profit', label: 'Profit & Units', icon: PieChart },
    { href: '/growth', label: 'Growth & Ads', icon: TrendingUp },
    { href: '/rules', label: 'Brain & Rules', icon: Brain },
  ];

  const handleToggleDemoWithToast = () => {
    onToggleDemoMode();
    toast.info(
      isDemoMode ? 'Switched to Live Store View' : 'Demo Mode Active (Sample Store Data)',
      {
        description: 'Store data view updated.',
      }
    );
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/overview';
    if (href === '/profit') return pathname.startsWith('/profit') || pathname.startsWith('/analytics');
    if (href === '/growth') return pathname.startsWith('/growth') || pathname === '/meta-command' || pathname === '/recovery';
    if (href === '/rules') return pathname.startsWith('/rules') || pathname === '/memory' || pathname === '/inventory' || pathname.startsWith('/settings');
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Store Name */}
        <div className="flex items-center gap-4 sm:gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Operator<span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
            </div>
          </Link>

          {/* Store Switcher Pill */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-300">
            <Store className="h-3 w-3 text-emerald-500" />
            <span className="font-medium">{storeName}</span>
          </div>
        </div>

        {/* Center Nav Links - 4 Clean Consolidated Workspaces */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-950 dark:text-white shadow-2xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Unified Notification Alert Bell */}
          <button
            onClick={onOpenTerminal}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition"
            title="3 Actions Pending Approval"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white animate-pulse">
              3
            </span>
          </button>

          {/* Theme Selector Toggle */}
          <ThemeToggle />

          {/* Demo Mode Toggle Button */}
          <button
            onClick={handleToggleDemoWithToast}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isDemoMode
                ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${isDemoMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline text-[11px]">
              {isDemoMode ? 'Demo Active' : 'Live Store'}
            </span>
          </button>

          {/* Ask AI Button with Command Shortcut */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:shadow-sm transition glow-emerald"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded bg-emerald-700/80 px-1.5 py-0.5 text-[9px] font-mono text-emerald-100">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-900 dark:text-white">{storeName}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">3 Actions Pending</span>
          </div>
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  active
                    ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
