'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { OperatorTerminal } from '@/components/dashboard/operator-terminal';
import { store } from '@/lib/store';
import {
  MetaCreativeAuditorItem,
  CreativeFatigueSummary,
  CreativeFatigueStatus,
  AbandonedCheckoutItem,
  RecoveryTemplate,
  MessagingChannel,
  CreativeStudioScript,
  VipSegmentItem,
} from '@/lib/types';
import {
  Target,
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Search,
  Copy,
  PauseCircle,
  Wand2,
  DollarSign,
  ShoppingCart,
  Smartphone,
  Send,
  Sliders,
  CheckCheck,
  Tag,
  Users,
  MessageSquare,
  FileDown,
  BookmarkPlus,
  Zap,
  Clock,
  X,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GrowthWorkspacePage() {
  const [creatives, setCreatives] = useState<MetaCreativeAuditorItem[]>(store.getCreatives());
  const [summary, setSummary] = useState<CreativeFatigueSummary>(store.getCreativeSummary());
  const [checkouts, setCheckouts] = useState<AbandonedCheckoutItem[]>(store.getAbandonedCheckouts());
  const [templates, setTemplates] = useState<RecoveryTemplate[]>(store.getRecoveryTemplates());
  const [vipSegments, setVipSegments] = useState<VipSegmentItem[]>(store.getVipSegments());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(store.getIsDemoMode());
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState(store.getChatHistory());

  // Active Tab within Growth Workspace
  const [growthTab, setGrowthTab] = useState<'ADS' | 'CARTS' | 'VIP'>('ADS');

  // Ad Search & Filters
  const [adSearchQuery, setAdSearchQuery] = useState('');
  const [adStatusFilter, setAdStatusFilter] = useState<string>('ALL');

  // AI Creative Studio Modal (Feature 3)
  const [activeStudioCreative, setActiveStudioCreative] = useState<MetaCreativeAuditorItem | null>(null);
  const [studioScript, setStudioScript] = useState<CreativeStudioScript | null>(null);
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);

  // Cart Recovery State
  const [selectedCheckout, setSelectedCheckout] = useState<AbandonedCheckoutItem>(checkouts[0] || null);
  const [activeChannel, setActiveChannel] = useState<MessagingChannel>('WHATSAPP');
  const [customTestPhone, setCustomTestPhone] = useState('+91 98765 43210');
  const [blastDiscountPercent, setBlastDiscountPercent] = useState<number>(10);
  const [isSendingCartBlast, setIsSendingCartBlast] = useState<boolean>(false);

  // VIP Campaign State (Feature 5)
  const [selectedVipSegment, setSelectedVipSegment] = useState<VipSegmentItem>(vipSegments[0] || null);
  const [vipDiscountPercent, setVipDiscountPercent] = useState<number>(15);
  const [isLaunchingVip, setIsLaunchingVip] = useState<boolean>(false);
  const [vipLaunchProgress, setVipLaunchProgress] = useState<number>(0);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCreatives([...store.getCreatives()]);
    setSummary({ ...store.getCreativeSummary() });
    const chks = store.getAbandonedCheckouts();
    setCheckouts([...chks]);
    if (!selectedCheckout && chks.length > 0) setSelectedCheckout(chks[0]);
    setTemplates([...store.getRecoveryTemplates()]);
    setVipSegments([...store.getVipSegments()]);
    setIsDemoMode(store.getIsDemoMode());
    setChatHistory([...store.getChatHistory()]);
  };

  const handleToggleDemoMode = () => {
    const updated = store.toggleDemoMode();
    setIsDemoMode(updated);
  };

  const handleSendMessage = async (query: string) => {
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setChatHistory([...data.chatHistory]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteAction = async (actionId: string) => {
    try {
      await fetch('/api/agent/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId }),
      });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Feature 3: AI Creative Studio
  const handleOpenCreativeStudio = (cr: MetaCreativeAuditorItem) => {
    setActiveStudioCreative(cr);
    const script = store.getCreativeScript(cr.id);
    setStudioScript(script);
    setSelectedHookIndex(0);
  };

  // Retest / Pause Creatives
  const handleRetestCreative = (cr: MetaCreativeAuditorItem) => {
    const newCr = store.retestWinningCreative(cr.id);
    if (newCr) {
      refreshData();
      toast.success(`New Test Adset Launched!`, {
        description: `Duplicated winning ad "${cr.name}" to fresh broad audience. Budget: ₹5,000/day.`,
      });
    }
  };

  const handlePauseCreative = (cr: MetaCreativeAuditorItem) => {
    const success = store.pauseFatiguedCreative(cr.id);
    if (success) {
      refreshData();
      toast.success(`Fatigued Ad Paused`, {
        description: `Paused ${cr.name} (Seen 6+ times). Saved ₹24,000/week in wasted spend.`,
      });
    }
  };

  // Cart Recovery
  const handleSendTestMessage = () => {
    if (!selectedCheckout) return;
    const result = store.sendSingleRecoveryMessage(selectedCheckout.id, customTestPhone);
    if (result) {
      refreshData();
      toast.success(`Test WhatsApp Message Sent!`, {
        description: `Delivered preview to ${customTestPhone}. Status: Delivered.`,
      });
    }
  };

  const handleTriggerRecoveryBlast = () => {
    setIsSendingCartBlast(true);
    setTimeout(() => {
      const { sentCount, totalValueRecoverable } = store.triggerRecoveryBlast(blastDiscountPercent, 24);
      refreshData();
      setIsSendingCartBlast(false);
      toast.success(`Recovery Messages Sent!`, {
        description: `Dispatched automated vouchers to ${sentCount} shoppers (₹${totalValueRecoverable.toLocaleString('en-IN')} cart value).`,
      });
    }, 800);
  };

  // Feature 5: Launch WhatsApp VIP Campaign
  const handleLaunchVipBlast = () => {
    if (!selectedVipSegment) return;
    setIsLaunchingVip(true);
    setVipLaunchProgress(25);

    setTimeout(() => setVipLaunchProgress(60), 400);
    setTimeout(() => {
      setVipLaunchProgress(100);
      const result = store.launchVipBlast(selectedVipSegment.id, vipDiscountPercent);
      refreshData();
      setIsLaunchingVip(false);
      setVipLaunchProgress(0);
      toast.success(`VIP Campaign Dispatched! 🎉`, {
        description: `Delivered personalized WhatsApp vouchers to ${result.sentCount} customers. Estimated revenue gain: +₹${result.estimatedRevenue.toLocaleString('en-IN')}.`,
      });
    }, 900);
  };

  const filteredCreatives = creatives.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(adSearchQuery.toLowerCase()) ||
      c.campaignName.toLowerCase().includes(adSearchQuery.toLowerCase());
    const matchesStatus = adStatusFilter === 'ALL' || c.fatigueStatus === adStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <Header
        storeName={store.getOrganization().name}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Hero & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Marketing & Revenue Acceleration
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Growth & Customer Recovery
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Manage Meta creative fatigue, generate AI video hooks, recover abandoned carts, and broadcast VIP retention offers.
            </p>
          </div>

          {/* Sub-Workspace Tab Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 shadow-2xs">
            <button
              onClick={() => setGrowthTab('ADS')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                growthTab === 'ADS'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Target className="h-3.5 w-3.5 text-blue-500" />
              <span>Meta Ads & Creative Studio</span>
            </button>

            <button
              onClick={() => setGrowthTab('CARTS')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                growthTab === 'CARTS'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5 text-rose-500" />
              <span>Cart Recovery ({checkouts.filter((c) => c.status === 'PENDING').length})</span>
            </button>

            <button
              onClick={() => setGrowthTab('VIP')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                growthTab === 'VIP'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>WhatsApp VIP Retention</span>
            </button>
          </div>
        </div>

        {/* TAB 1: META ADS & CREATIVE STUDIO */}
        {growthTab === 'ADS' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">Active Creatives</span>
                <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {creatives.length} Ads Active
                </div>
                <p className="mt-1 text-[11px] text-slate-500">Across 3 main Meta campaigns</p>
              </div>

              <div className="rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 p-5 shadow-xs">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Fatigued (Need Fresh Hooks)
                </span>
                <div className="mt-2 text-2xl font-extrabold font-mono text-rose-900 dark:text-rose-200">
                  {summary.fatiguedCreativesCount} Ad Burning Budget
                </div>
                <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">
                  Audience seen ad 6.2x times
                </p>
              </div>

              <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 p-5 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Scaling Winners
                </span>
                <div className="mt-2 text-2xl font-extrabold font-mono text-emerald-900 dark:text-emerald-200">
                  {summary.scalingWinnersCount} Winner (4.1x ROAS)
                </div>
                <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                  High 3s attention (44.2%)
                </p>
              </div>

              <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 p-5 shadow-xs">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  Wasted Spend Preventable
                </span>
                <div className="mt-2 text-2xl font-extrabold font-mono text-amber-900 dark:text-amber-200">
                  ₹{summary.dailyRevenueLeaked.toLocaleString('en-IN')} / day
                </div>
                <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                  Click Creative Studio to revive
                </p>
              </div>
            </div>

            {/* Ad Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreatives.map((cr) => (
                <div
                  key={cr.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {cr.format.replace('_', ' ')}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          cr.fatigueStatus === 'SCALING_WINNER'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                            : cr.fatigueStatus === 'FATIGUED'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {cr.fatigueStatus === 'SCALING_WINNER' ? '🔥 Winner' : cr.fatigueStatus === 'FATIGUED' ? '🔴 Tired Ad' : '⚠️ Slowing Down'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{cr.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{cr.campaignName}</p>
                    </div>

                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <img src={cr.thumbnailUrl} alt={cr.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-3 text-white">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="bg-slate-900/80 px-2 py-0.5 rounded">
                            Return: <strong className="text-emerald-400">{cr.roas.toFixed(2)}x</strong>
                          </span>
                          <span className="bg-slate-900/80 px-2 py-0.5 rounded">
                            Spend: ₹{(cr.spend7d / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metric Pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-950/80 p-2.5 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block font-semibold">3s Attention Grab:</span>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{cr.hookRate.toFixed(0)}%</span>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-950/80 p-2.5 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block font-semibold">Seen Per Person:</span>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{cr.frequency.toFixed(1)}x</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                      {cr.aiDiagnosis}
                    </p>
                  </div>

                  {/* Actions & Studio Button */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                    {cr.fatigueStatus === 'FATIGUED' && (
                      <button
                        onClick={() => handleOpenCreativeStudio(cr)}
                        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition"
                      >
                        <Wand2 className="h-3.5 w-3.5" /> ⚡ Generate New Creative Angles
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      {cr.fatigueStatus === 'SCALING_WINNER' ? (
                        <>
                          <button
                            onClick={() => {
                              toast.success('Ad Budget Scaled +20%', { description: 'Increased daily budget to ₹57,500.' });
                            }}
                            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-bold text-white shadow-xs"
                          >
                            Scale Budget +20%
                          </button>
                          <button
                            onClick={() => handleRetestCreative(cr)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300"
                            title="Duplicate to new audience"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handlePauseCreative(cr)}
                          className="flex-1 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 flex items-center justify-center gap-1.5"
                        >
                          <PauseCircle className="h-3.5 w-3.5" /> Pause Fatigued Ad
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CART RECOVERY WITH TWO-WAY OBJECTION AI */}
        {growthTab === 'CARTS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Message Customizer & Uncompleted Checkouts Table */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        WhatsApp Recovery & Automated Two-Way Objection Handling
                      </h2>
                      <p className="text-xs text-slate-500">
                        Variables: <code>{'{{first_name}}'}</code>, <code>{'{{cart_items}}'}</code>, <code>{'{{discount_link}}'}</code>
                      </p>
                    </div>
                    <span className="rounded-full bg-rose-100 dark:bg-rose-950 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                      42 Carts (₹88,400)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Discount Voucher Percentage:
                    </label>
                    <div className="flex items-center gap-2">
                      {[10, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setBlastDiscountPercent(pct)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            blastDiscountPercent === pct
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {pct}% Off (Code: RECOVER{pct})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="h-4 w-4 text-emerald-500" /> Send Test WhatsApp:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTestPhone}
                        onChange={(e) => setCustomTestPhone(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono"
                      />
                      <button
                        onClick={handleSendTestMessage}
                        className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-1.5 text-xs font-bold shadow-xs whitespace-nowrap"
                      >
                        Send Test
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerRecoveryBlast}
                    disabled={isSendingCartBlast}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Zap className={`h-4 w-4 ${isSendingCartBlast ? 'animate-spin' : ''}`} />
                    <span>{isSendingCartBlast ? 'Dispatching Messages...' : 'Recover All 42 Abandoned Carts Now (₹88,400)'}</span>
                  </button>
                </div>

                {/* Table of Uncompleted Checkouts */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Abandoned Checkouts</h3>
                    <span className="text-[11px] text-slate-500">Auto-synced with Shopify</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold text-slate-500">
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-2">Cart Value</th>
                          <th className="py-2.5 px-2">Dropped Step</th>
                          <th className="py-2.5 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {checkouts.slice(0, 5).map((chk) => (
                          <tr
                            key={chk.id}
                            onClick={() => setSelectedCheckout(chk)}
                            className={`cursor-pointer transition ${
                              selectedCheckout?.id === chk.id
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/40'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900 dark:text-white">{chk.customerName}</div>
                              <div className="text-[10px] text-slate-500">{chk.customerPhone}</div>
                            </td>
                            <td className="py-2.5 px-2 font-mono font-bold">₹{chk.cartTotal.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-2">
                              <span className="rounded bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400">
                                {chk.dropoffStep}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  store.sendSingleRecoveryMessage(chk.id);
                                  refreshData();
                                  toast.success(`Recovery Voucher Sent to ${chk.customerName}!`);
                                }}
                                className="rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-bold shadow-2xs"
                              >
                                Send Offer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right: Phone Simulator & Two-Way Objection AI Interactive Demo */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-4">
                <div className="w-full max-w-sm rounded-[2.5rem] border-4 border-slate-300 dark:border-slate-700 bg-slate-900 p-3 shadow-2xl space-y-3">
                  <div className="mx-auto h-4 w-28 rounded-full bg-slate-800"></div>
                  <div className="h-[460px] rounded-[2rem] bg-[#0c1317] p-3 text-slate-100 flex flex-col justify-between overflow-y-auto space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0">
                      <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        A
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                          Aura Skincare Co. <span className="text-emerald-400">✓</span>
                        </div>
                        <div className="text-[9px] text-slate-400">AI Concierge Online</div>
                      </div>
                    </div>

                    {/* Chat Stream with Two-Way Objection Handling */}
                    <div className="space-y-2 text-xs flex-1">
                      {/* Brand Outreach Message */}
                      <div className="rounded-xl bg-[#005c4b] p-3 text-xs text-white shadow-md space-y-1">
                        <div className="font-bold text-[10px] text-emerald-200">✨ Aura Skincare Order Update</div>
                        <div className="text-[11px] leading-relaxed">
                          Hey {selectedCheckout?.customerName.split(' ')[0] || 'there'}! 🌿 We saved your bag with {selectedCheckout?.cartItems.map((i) => i.name).join(' & ') || 'Radiance Serum'}. Use code <strong>RECOVER{blastDiscountPercent}</strong> for {blastDiscountPercent}% off today!
                        </div>
                      </div>

                      {/* Customer Simulated Objection */}
                      <div className="flex justify-end">
                        <div className="rounded-xl bg-[#202c33] p-2.5 text-[11px] text-slate-200 max-w-[85%]">
                          "Is this Vitamin C serum suitable for acne-prone sensitive skin?"
                        </div>
                      </div>

                      {/* Autonomous AI Objection Answer */}
                      <div className="rounded-xl bg-[#005c4b] p-3 text-xs text-white shadow-md space-y-1">
                        <div className="text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Two-Way Objection AI
                        </div>
                        <div className="text-[11px] leading-relaxed">
                          Yes! Aura's Vitamin C is non-comedogenic and formulated with Niacinamide to soothe breakouts while fading dark spots. 🌿 We also have a 30-day money-back guarantee!
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="rounded-full bg-slate-800 px-3 py-1.5 text-[10px] text-slate-400 shrink-0 flex items-center justify-between">
                      <span>Type a reply...</span>
                      <Send className="h-3 w-3 text-emerald-500" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 text-center max-w-xs">
                  Automated Two-Way Objection AI answers customer product questions 24/7 on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WHATSAPP VIP RETENTION CAMPAIGNS (FEATURE 5) */}
        {growthTab === 'VIP' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      One-Click WhatsApp VIP Retention Campaigns
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Broadcast personalized replenishment vouchers directly to dormant high-value customers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Segment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vipSegments.map((seg) => (
                  <div
                    key={seg.id}
                    onClick={() => setSelectedVipSegment(seg)}
                    className={`cursor-pointer rounded-2xl border p-5 transition space-y-3 ${
                      selectedVipSegment?.id === seg.id
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{seg.name}</span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {seg.customerCount} Shoppers
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">{seg.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400">Avg Customer LTV:</span>
                        <div className="font-bold text-slate-900 dark:text-white">₹{seg.averageLtv.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Potential Revenue:</span>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">+₹{seg.potentialRevenue.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Preview & Dispatch Action */}
              {selectedVipSegment && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Deploy Campaign: {selectedVipSegment.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Targeting {selectedVipSegment.customerCount} customers with 1-to-1 WhatsApp messages
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Voucher:</span>
                      {[10, 15, 20].map((v) => (
                        <button
                          key={v}
                          onClick={() => setVipDiscountPercent(v)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            vipDiscountPercent === v
                              ? 'bg-amber-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {v}% Off
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-sans">
                    "{selectedVipSegment.defaultMessage.replace('{{first_name}}', 'Ananya').replace('{{discount_code}}', `VIP${vipDiscountPercent}`)}"
                  </div>

                  {isLaunchingVip && (
                    <div className="space-y-1.5 animate-in fade-in">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span>Dispatching WhatsApp Messages...</span>
                        <span>{vipLaunchProgress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${vipLaunchProgress}%` }}
                          className="h-full bg-emerald-500 transition-all duration-300"
                        ></div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLaunchVipBlast}
                    disabled={isLaunchingVip}
                    className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Sparkles className={`h-4 w-4 ${isLaunchingVip ? 'animate-spin' : ''}`} />
                    <span>
                      {isLaunchingVip
                        ? 'Broadcasting to VIP Customers...'
                        : `Launch VIP Blast to ${selectedVipSegment.customerCount} Shoppers (Est: +₹${selectedVipSegment.potentialRevenue.toLocaleString('en-IN')})`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: AI CREATIVE STUDIO & UGC HOOK GENERATOR (FEATURE 3) */}
      {activeStudioCreative && studioScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Creative Studio & UGC Script Generator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reviving: <strong>{activeStudioCreative.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudioCreative(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 3 Proven Video Hooks */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                1. Select Proven 3-Second Video Hook:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {studioScript.hooks.map((hook, idx) => (
                  <button
                    key={hook.id}
                    onClick={() => setSelectedHookIndex(idx)}
                    className={`text-left rounded-xl border p-3.5 space-y-2 transition flex flex-col justify-between ${
                      selectedHookIndex === idx
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">
                        {hook.angleType.replace(/_/g, ' ')}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">{hook.title}</h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-sans italic leading-relaxed">
                        {hook.openingLine}
                      </p>
                    </div>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold block pt-2 border-t border-slate-200 dark:border-slate-800">
                      {hook.explanation}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full 20-Second Script Breakdown */}
            <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                2. Complete 20-Second Video UGC Script:
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    0:00 – 0:03s (Visual Cue & Hook):
                  </span>
                  <div className="text-slate-800 dark:text-slate-200">
                    <strong>Opening:</strong> {studioScript.hooks[selectedHookIndex].openingLine}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <strong>Visual:</strong> {studioScript.script.visualCue0to3s}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    0:03 – 0:15s (Core Demonstration):
                  </span>
                  <div className="text-slate-800 dark:text-slate-200">
                    {studioScript.script.coreDemo3to15s}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                    0:15 – 0:20s (Call To Action):
                  </span>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">
                    {studioScript.script.callToAction15to20s}
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Ad Headline & Primary Copy */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                3. Meta Ad Copy & Headline:
              </span>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Headline:</span>
                  <div className="font-bold text-slate-900 dark:text-white font-sans">{studioScript.metaHeadline}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Primary Copy:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">{studioScript.primaryAdCopy}</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  toast.success('Script Copied to Clipboard!', { description: 'Ready to paste or send to creators.' });
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Script
              </button>

              <button
                onClick={() => {
                  toast.success('Creator Brief Exported (PDF)', { description: 'Downloaded PDF brief for creator.' });
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                <FileDown className="h-3.5 w-3.5" /> Export Creator PDF Brief
              </button>

              <button
                onClick={() => {
                  setActiveStudioCreative(null);
                  toast.success('Saved to Ad Launch Queue!', { description: 'Ready for Meta Ads Manager sync.' });
                }}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md flex items-center gap-1.5"
              >
                <BookmarkPlus className="h-3.5 w-3.5" /> Save & Queue Ad
              </button>
            </div>
          </div>
        </div>
      )}

      <OperatorTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        onExecuteAction={handleExecuteAction}
      />
    </div>
  );
}
