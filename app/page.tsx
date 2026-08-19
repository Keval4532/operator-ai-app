'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Package,
  MessageSquare,
  Target,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sliders,
  Store,
  Check,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { PublicHeader } from '@/components/landing/public-header';
import { OnboardingModal } from '@/components/landing/onboarding-modal';
import { toast } from 'sonner';

export default function LandingPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<'STARTER' | 'GROWTH' | 'SCALE'>('GROWTH');

  // Billing Toggle (Monthly vs Annual 20% discount)
  const [isAnnual, setIsAnnual] = useState(false);

  // Hero Interactive Diagnostic Demo State
  const [heroActionExecuted, setHeroActionExecuted] = useState(false);
  const [isHeroExecuting, setIsHeroExecuting] = useState(false);

  // ROI Calculator State
  const [monthlyRevenue, setMonthlyRevenue] = useState(2500000); // 25 Lakhs
  const [monthlyAdSpend, setMonthlyAdSpend] = useState(600000); // 6 Lakhs
  const [abandonedCarts, setAbandonedCarts] = useState(240); // 240 carts

  // FAQ Expanded State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // ROI Calculations
  const wastedSpendPrevented = Math.round(monthlyAdSpend * 0.14);
  const recoverableCartRevenue = Math.round(abandonedCarts * 1800 * 0.35);
  const monthlyTotalUnlocked = wastedSpendPrevented + recoverableCartRevenue;
  const annualProfitUnlocked = monthlyTotalUnlocked * 12;

  const handleHeroApproveAction = () => {
    setIsHeroExecuting(true);
    setTimeout(() => {
      setIsHeroExecuting(false);
      setHeroActionExecuted(true);
      toast.success('Action Executed in Meta Ads Manager!', {
        description: 'Paused fatigued Adset "Summer_Set_B" (ROAS 0.9x). Saved ₹18,400/week in wasted spend.',
      });
    }, 600);
  };

  const handleOpenPlanModal = (plan?: 'STARTER' | 'GROWTH' | 'SCALE') => {
    setSelectedPlanForModal(plan || 'GROWTH');
    setIsOnboardingOpen(true);
  };

  const faqs = [
    {
      q: 'How does Operator AI connect to my Shopify store and Meta Ads?',
      a: 'Operator AI connects via official secure OAuth APIs in under 60 seconds. We require read access for metrics and restricted campaign edit permissions for actions you explicitly approve or configure on autopilot.',
    },
    {
      q: 'Will Operator AI make changes without my permission?',
      a: 'No, unless you explicitly enable "Full Autopilot" on a specific workflow. By default, Operator AI runs in Co-Pilot mode ("Ask Me First"), queuing recommendations for your 1-click manual approval.',
    },
    {
      q: 'Do I need my own WhatsApp Business API account?',
      a: 'Operator AI comes with a built-in pre-configured WhatsApp Cloud integration for instant 1-click cart recovery blasts and VIP replenishment campaigns. You can also connect your own verified WhatsApp Business number.',
    },
    {
      q: 'How does the 14-day free trial work?',
      a: 'You get full, unrestricted access to all features for 14 days. No credit card is required to sign up. If you decide not to continue, your workspace will automatically pause with zero charge.',
    },
    {
      q: 'Can I connect multiple Shopify stores or brands?',
      a: 'Yes! Our Scale & Enterprise tier supports multi-store switching for holding companies, D2C incubators, and growth agencies.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 selection:bg-emerald-500 selection:text-white">
      {/* Public Navigation Header */}
      <PublicHeader onOpenOnboarding={handleOpenPlanModal} />

      <main className="flex-1 space-y-24 sm:space-y-32 pb-24">
        {/* ============================================================= */}
        {/* SECTION 1: HERO SECTION */}
        {/* ============================================================= */}
        <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>THE AUTONOMOUS AI OPERATING SYSTEM FOR D2C & SHOPIFY</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
              Stop Staring at Dashboards.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Let AI Run Your E-Commerce Operations.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
              Operator AI connects your Shopify, Meta Ads, and WhatsApp into a single autonomous brain. It diagnoses profit leaks in seconds, pauses burning adsets, recovers lost carts, and restocks inventory with 1-click approvals.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => handleOpenPlanModal('GROWTH')}
              className="w-full sm:w-auto rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/overview"
              className="w-full sm:w-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-7 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Zap className="h-4 w-4 text-emerald-500" />
              <span>⚡ Try Live Interactive Demo</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> 60-Second Shopify Setup
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5 hidden sm:inline-flex">
              <Check className="h-4 w-4 text-emerald-500" /> 1-Click Cancel Anytime
            </span>
          </div>

          {/* Interactive Hero Visual: Live Diagnostic & 1-Click Action Simulator */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-5 sm:p-7 shadow-2xl space-y-5 text-left transition-all">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs font-mono font-bold text-slate-400">
                    AURA SKINCARE CO. • DAILY DIAGNOSTIC
                  </span>
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-mono">
                  LIVE SIMULATION
                </span>
              </div>

              {/* 3 Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Yesterday's Revenue</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">₹3,42,800</div>
                  <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-0.5">
                    <TrendingDown className="h-3 w-3" /> -14.2% drop detected
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Real Net Profit</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">₹1,05,925</div>
                  <span className="text-[11px] text-slate-400">31.0% Take-Home Margin</span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Blended Ad ROAS</span>
                  <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">2.10x</div>
                  <span className="text-[11px] text-amber-600 font-semibold">Target: 3.50x</span>
                </div>
              </div>

              {/* Plain English AI Diagnosis Card */}
              <div className="rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300 px-2 py-0.5 text-[10px] font-bold uppercase">
                    Root Cause Isolated
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Confidence: 94%</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Ad Creative Fatigue on "Summer_Set_B" & Checkout Abandonment Spike Reduced Yesterday's Revenue by ₹56,700.
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  Meta Adset "Summer_Set_B" fatigued with frequency hitting 6.2x, causing ROAS to plummet to 0.90x on ₹24,000 spend. Concurrently, 42 high-intent checkouts dropped off at payment.
                </p>
              </div>

              {/* Action Stream Trigger with Live Interactive Execution */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    <Target className="h-3.5 w-3.5" />
                    <span>Recommended Staged Action</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                      Potential Gain: +₹35,000 - ₹52,000
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Pause Fatigued Adset "Summer_Set_B" & Shift ₹5,000/day into Winning Campaign
                  </div>
                </div>

                <div>
                  {!heroActionExecuted ? (
                    <button
                      onClick={handleHeroApproveAction}
                      disabled={isHeroExecuting}
                      className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:scale-105"
                    >
                      <Play className={`h-3.5 w-3.5 ${isHeroExecuting ? 'animate-spin' : ''}`} />
                      <span>{isHeroExecuting ? 'Applying live...' : 'Approve & Pause (1-Click)'}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 animate-in zoom-in-95">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ✓ Executed: Saved ₹18,400 in Wasted Spend
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 2: THE 3 MAJOR HEADACHES WE SOLVE */}
        {/* ============================================================= */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Why Brands Switch to Operator AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              The 3 Major Headaches We Solve
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Traditional analytics show you charts after you have already lost money. Operator AI takes action before profit burns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-7 space-y-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">
                <Target className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. The Ad Spend Black Hole</h3>
                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300">
                    <strong>❌ Old Way:</strong> Spending ₹20k–₹50k on fatigued Meta ads for days before noticing ROAS cratered below 1.0x.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300">
                    <strong>✅ Operator AI:</strong> Auto-flags ad fatigue at 6.0x frequency and pauses burning adsets with 1-click or on full autopilot.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-7 space-y-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. The 70% Cart Drop-Off</h3>
                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300">
                    <strong>❌ Old Way:</strong> Generic automated recovery emails that land in spam folders with under 8% open rates.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300">
                    <strong>✅ Operator AI:</strong> Personalized 1-to-1 WhatsApp recovery with dynamic discount links and Two-Way Objection AI within 45 mins.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-7 space-y-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                <Package className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. The Silent Stockout Disaster</h3>
                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300">
                    <strong>❌ Old Way:</strong> Running out of top-selling hero SKUs unexpectedly, breaking Meta algorithms, and waiting 3 weeks for restock.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300">
                    <strong>✅ Operator AI:</strong> Auto-calculates stock burn rates and generates pre-filled supplier Purchase Orders 14 days before stockout.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 3: INTERACTIVE ROI CALCULATOR */}
        {/* ============================================================= */}
        <section id="calculator" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl border border-indigo-200 dark:border-indigo-950 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 p-8 sm:p-12 shadow-xl space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interactive Profit Simulator
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Calculate Your Hidden Profit Leak
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Slide to your store's numbers and see the exact revenue Operator AI recovers every month.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left 3 Sliders */}
              <div className="lg:col-span-7 space-y-6">
                {/* Slider 1: Monthly Revenue */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Monthly Store Revenue:</span>
                    <span className="font-mono text-sm text-slate-900 dark:text-white font-extrabold">
                      ₹{(monthlyRevenue / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={100000}
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹5 Lakhs/mo</span>
                    <span>₹50 Lakhs/mo</span>
                    <span>₹1 Crore/mo</span>
                  </div>
                </div>

                {/* Slider 2: Monthly Meta Spend */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Monthly Meta Ad Spend:</span>
                    <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-extrabold">
                      ₹{(monthlyAdSpend / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={3000000}
                    step={50000}
                    value={monthlyAdSpend}
                    onChange={(e) => setMonthlyAdSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹1 Lakh</span>
                    <span>₹15 Lakhs</span>
                    <span>₹30 Lakhs</span>
                  </div>
                </div>

                {/* Slider 3: Abandoned Carts */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Unrecovered Abandoned Checkouts / Month:</span>
                    <span className="font-mono text-sm text-rose-600 dark:text-rose-400 font-extrabold">
                      {abandonedCarts} Carts
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={10}
                    value={abandonedCarts}
                    onChange={(e) => setAbandonedCarts(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>50 carts</span>
                    <span>500 carts</span>
                    <span>1,000 carts</span>
                  </div>
                </div>
              </div>

              {/* Right Output Box */}
              <div className="lg:col-span-5 rounded-3xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 p-6 sm:p-8 space-y-6 shadow-md text-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    Estimated Annual Profit Unlocked
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-950 dark:text-emerald-100">
                    +₹{(annualProfitUnlocked / 100000).toFixed(2)} Lakhs / year
                  </div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    (₹{(monthlyTotalUnlocked / 1000).toFixed(0)}k extra profit each month)
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-left border-y border-emerald-200 dark:border-emerald-800/60 py-4 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-sans">Wasted Ad Spend Saved:</span>
                    <strong className="text-slate-900 dark:text-white">₹{wastedSpendPrevented.toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-sans">Recovered WhatsApp Revenue:</span>
                    <strong className="text-slate-900 dark:text-white">₹{recoverableCartRevenue.toLocaleString('en-IN')}/mo</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPlanModal('GROWTH')}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] flex items-center justify-center gap-1.5"
                >
                  <span>Unlock This Revenue for Your Store</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 4: TRANSPARENT PRICING TIERS */}
        {/* ============================================================= */}
        <section id="pricing" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Straightforward Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Priced to Pay for Itself on Day 1
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              One avoided bad adset or single recovered VIP customer covers your entire monthly subscription.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className={`text-xs font-bold ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isAnnual ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    isAnnual ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                <span>Annual Billing</span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 font-extrabold">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TIER 1: STARTER OPERATOR */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 space-y-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Starter Operator</h3>
                  <p className="text-xs text-slate-500">For growing stores doing up to ₹10 Lakhs/month.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {isAnnual ? '₹2,799' : '₹3,499'}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Shopify & Meta Ads Live Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Daily 8:00 AM Diagnostic Briefing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Manual 1-Click Action Approvals (Co-Pilot)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Up to 150 WhatsApp Cart Recoveries/mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Standard Email & Chat Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenPlanModal('STARTER')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* TIER 2: GROWTH OPERATOR (FEATURED) */}
            <div className="rounded-3xl border-2 border-emerald-500 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xl relative flex flex-col justify-between scale-[1.02]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 text-white px-3.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                Most Popular ⭐
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Growth Operator</h3>
                  <p className="text-xs text-slate-500">For scaling brands doing ₹10L to ₹50 Lakhs/month.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    {isAnnual ? '₹7,199' : '₹8,999'}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <strong>Everything in Starter, plus:</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Full Autopilot Switchboard (Auto-pause bad ads)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>SKU True Contribution Margin & Loss Leader Matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>AI UGC Script & Hook Studio for Creative Refresh</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Automated Supplier Purchase Order (PO) Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Unlimited WhatsApp Cart & VIP Recovery Blasts</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenPlanModal('GROWTH')}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-xs font-bold text-white shadow-md hover:shadow-emerald-500/20 transition hover:scale-[1.01]"
              >
                Start 14-Day Free Trial (Full Access)
              </button>
            </div>

            {/* TIER 3: SCALE & ENTERPRISE */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 space-y-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scale & Enterprise</h3>
                  <p className="text-xs text-slate-500">For high-volume D2C brands (₹50L+/mo) & Agencies.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {isAnnual ? '₹19,999' : '₹24,999'}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <strong>Everything in Growth, plus:</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Multi-Store Switcher (Up to 5 Brands)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Custom Founder Safety Guardrails & Business Memory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Custom Webhook Integrations & Headless API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Dedicated 24/7 Slack / WhatsApp Operator Channel</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenPlanModal('SCALE')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS */}
        {/* ============================================================= */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans border-t border-slate-100 dark:border-slate-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 6: FINAL CTA BANNER */}
        {/* ============================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Put Your Store Operations on Autopilot Today.
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 font-sans leading-relaxed">
                Join hundreds of fast-growing D2C founders who save 15+ hours every week and boost net profit margins by 6–12%.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => handleOpenPlanModal('GROWTH')}
                className="w-full sm:w-auto rounded-2xl bg-white text-slate-950 px-8 py-3.5 text-sm font-extrabold shadow-lg hover:bg-slate-100 transition hover:scale-105"
              >
                Start 14-Day Free Trial
              </button>

              <Link
                href="/overview"
                className="w-full sm:w-auto rounded-2xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                ⚡ Explore Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================= */}
      {/* PUBLIC FOOTER */}
      {/* ============================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs">
              <Sparkles className="h-3 w-3" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Operator AI</span>
            <span>© 2026 Operator AI Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-white">
              Sign In
            </Link>
            <Link href="/overview" className="hover:text-slate-900 dark:hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

      {/* Instant Onboarding & Account Generation Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan={selectedPlanForModal}
      />
    </div>
  );
}
