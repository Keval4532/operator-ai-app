'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, Zap, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('founder@auraskincare.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Welcome back, Founder!', {
        description: 'Connected to Aura Skincare Co. workspace.',
      });
      router.push('/overview');
    }, 600);
  };

  const handleQuickDemoAccess = () => {
    toast.info('Accessing Demo Workspace...', {
      description: 'Logged in as Store Owner with full permissions.',
    });
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-150 p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
            Operator<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Sign In to Operator AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your autonomous store intelligence workspace
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-xl space-y-5">
          {/* Quick Demo Access Trigger */}
          <button
            onClick={handleQuickDemoAccess}
            className="w-full rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/40 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/70 transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>⚡ Instant One-Click Demo Access</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-mono text-slate-400 uppercase">
              or credentials
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Work Email:
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@store.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Password:
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Password reset link sent to your work email.'); }} className="text-[11px] font-semibold text-emerald-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-slate-600 dark:text-slate-400 text-xs">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Operator AI'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have a workspace yet?{' '}
          <Link href="/#pricing" className="font-bold text-emerald-600 hover:underline">
            Start 14-Day Free Trial
          </Link>
        </p>
      </div>

      {/* Bottom Legal / Security Info */}
      <div className="text-center text-xs text-slate-400 py-2 flex items-center justify-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Enterprise 256-Bit SSL Encrypted Session</span>
      </div>
    </div>
  );
}
