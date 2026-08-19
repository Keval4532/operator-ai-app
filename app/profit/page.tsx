'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { OperatorTerminal } from '@/components/dashboard/operator-terminal';
import { store } from '@/lib/store';
import { ProfitBreakdown, ProductMarginItem, MarginStatus, SimulatorTarget } from '@/lib/types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Truck,
  Layers,
  Sparkles,
  Search,
  Download,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sliders,
  Zap,
  RotateCcw,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfitWorkspacePage() {
  const [profitBreakdown, setProfitBreakdown] = useState<ProfitBreakdown>(store.getProfitBreakdown());
  const [productMargins, setProductMargins] = useState<ProductMarginItem[]>(store.getProductMargins());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(store.getIsDemoMode());
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState(store.getChatHistory());

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // What-If Simulator Inputs
  const [simDailyAdSpend, setSimDailyAdSpend] = useState<number>(115000);
  const [simTargetRoas, setSimTargetRoas] = useState<number>(3.2);
  const [simAov, setSimAov] = useState<number>(1750);
  const [simCogsPercent, setSimCogsPercent] = useState<number>(23);
  const [isSavingTarget, setIsSavingTarget] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProfitBreakdown({ ...store.getProfitBreakdown() });
    setProductMargins([...store.getProductMargins()]);
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

  // What-If Dynamic Mathematical Calculations (30-day projection)
  const monthlyAdSpend = simDailyAdSpend * 30;
  const projectedMonthlyRevenue = monthlyAdSpend * simTargetRoas;
  const projectedMonthlyOrders = Math.round(projectedMonthlyRevenue / simAov);
  const projectedCogs = projectedMonthlyRevenue * (simCogsPercent / 100);
  const projectedShipping = projectedMonthlyOrders * 120; // Avg ₹120/courier
  const projectedGateway = projectedMonthlyRevenue * 0.02; // 2% gateway
  const projectedReturns = projectedMonthlyRevenue * 0.03; // 3% return rate
  const projectedMonthlyProfit =
    projectedMonthlyRevenue -
    monthlyAdSpend -
    projectedCogs -
    projectedShipping -
    projectedGateway -
    projectedReturns;
  const projectedMarginPercent = (projectedMonthlyProfit / projectedMonthlyRevenue) * 100;
  const breakevenCac = simAov * (1 - simCogsPercent / 100) - 120 - simAov * 0.05;

  // Stockout Velocity Threat Check
  const projectedDailyUnits = Math.round(projectedMonthlyOrders / 30);
  const isStockoutRisk = simDailyAdSpend >= 140000;

  const handleSaveTargetStrategy = () => {
    setIsSavingTarget(true);
    setTimeout(() => {
      store.saveSimulatorTarget({
        dailyAdSpend: simDailyAdSpend,
        targetRoas: simTargetRoas,
        aov: simAov,
        cogsPercent: simCogsPercent,
        projectedMonthlyRevenue,
        projectedMonthlyProfit,
        projectedNetMarginPercent: projectedMarginPercent,
        breakevenCac,
        stockoutWarningSkus: isStockoutRisk ? ['AUR-SER-001'] : [],
      });
      setIsSavingTarget(false);
      toast.success('AI Target Strategy Saved!', {
        description: `Saved strategy: ₹${(simDailyAdSpend / 1000).toFixed(0)}k/day @ ${simTargetRoas}x ROAS. Operator AI will align budget allocation toward this goal.`,
      });
    }, 600);
  };

  const handleResetSimulator = () => {
    setSimDailyAdSpend(115000);
    setSimTargetRoas(3.2);
    setSimAov(1750);
    setSimCogsPercent(23);
    toast.info('Simulator Reset to Current Store Baseline');
  };

  const filteredProducts = productMargins.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MarginStatus) => {
    switch (status) {
      case 'SCALE_AGGRESSIVELY':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <Flame className="h-3 w-3 text-emerald-500" /> High Profit Winner
          </span>
        );
      case 'MARGIN_SQUEEZE':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="h-3 w-3 text-amber-500" /> Margin Squeeze
          </span>
        );
      case 'LOSS_LEADER_ALERT':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
            <TrendingDown className="h-3 w-3 text-rose-500" /> Losing Money on Ads
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="h-3 w-3 text-slate-400" /> Steady Seller
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <Header
        storeName={store.getOrganization().name}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Profit & True Unit Economics
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Profit Breakdown & Scale Simulator
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Analyze true take-home profits per SKU and simulate monthly scale scenarios in real-time.
            </p>
          </div>

          <button
            onClick={() => {
              toast.success('Profit Report Exported', { description: 'SKU margin spreadsheet generated.' });
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Profit Report</span>
          </button>
        </div>

        {/* SECTION 1: INTERACTIVE "WHAT-IF?" SCALE SIMULATOR (FEATURE 2) */}
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Interactive "What-If?" Scale & Profit Simulator
                  </h2>
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                    Live Forecasting
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Adjust ad spend, target ROAS, and order values to project monthly revenue and net profit.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSimulator}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                onClick={handleSaveTargetStrategy}
                disabled={isSavingTarget}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-xs transition disabled:opacity-50"
              >
                <Zap className={`h-3.5 w-3.5 ${isSavingTarget ? 'animate-spin' : ''}`} />
                <span>{isSavingTarget ? 'Saving...' : 'Set as AI Target Strategy'}</span>
              </button>
            </div>
          </div>

          {/* Simulator Inputs & Outputs Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: 4 Sliders */}
            <div className="lg:col-span-6 space-y-5">
              {/* Slider 1: Meta Daily Ad Spend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Daily Ad Spend:</span>
                  <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">
                    ₹{simDailyAdSpend.toLocaleString('en-IN')} / day
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={500000}
                  step={5000}
                  value={simDailyAdSpend}
                  onChange={(e) => setSimDailyAdSpend(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹50k/day</span>
                  <span>₹2.5L/day</span>
                  <span>₹5.0L/day</span>
                </div>
              </div>

              {/* Slider 2: Target ROAS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Estimated Target ROAS:</span>
                  <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                    {simTargetRoas.toFixed(2)}x Return
                  </span>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={4.5}
                  step={0.1}
                  value={simTargetRoas}
                  onChange={(e) => setSimTargetRoas(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1.5x (Conservative)</span>
                  <span>3.0x (Target)</span>
                  <span>4.5x (Peak)</span>
                </div>
              </div>

              {/* Slider 3: Average Order Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Average Order Value (AOV):</span>
                  <span className="font-mono text-sm text-slate-900 dark:text-white">
                    ₹{simAov.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={3500}
                  step={50}
                  value={simAov}
                  onChange={(e) => setSimAov(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-800 dark:accent-white"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹800 (Single item)</span>
                  <span>₹1,750 (Baseline)</span>
                  <span>₹3,500 (3-Pack Bundle)</span>
                </div>
              </div>

              {/* Slider 4: COGS % */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Average Product Cost (COGS %):</span>
                  <span className="font-mono text-sm text-amber-600 dark:text-amber-400">
                    {simCogsPercent}% of Sales
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={40}
                  step={1}
                  value={simCogsPercent}
                  onChange={(e) => setSimCogsPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>15% (High Margin)</span>
                  <span>23% (Current)</span>
                  <span>40% (Heavy Packaging)</span>
                </div>
              </div>
            </div>

            {/* Right: Dynamic Calculated Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Projected 30d Sales
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                    ₹{(projectedMonthlyRevenue / 100000).toFixed(2)} Lakhs
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    ~{projectedMonthlyOrders.toLocaleString('en-IN')} Orders / mo
                  </span>
                </div>

                <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 p-4 space-y-1 glow-emerald">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    Net Take-Home Profit
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-900 dark:text-emerald-200">
                    ₹{(projectedMonthlyProfit / 100000).toFixed(2)} Lakhs
                  </div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block">
                    {projectedMarginPercent.toFixed(1)}% Real Net Margin
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Total 30d Ad Spend
                  </span>
                  <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    ₹{(monthlyAdSpend / 100000).toFixed(2)} Lakhs
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Meta + Google Ads
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Breakeven Max CAC
                  </span>
                  <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    ₹{breakevenCac.toFixed(0)}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Cost per purchase limit
                  </span>
                </div>
              </div>

              {/* Stockout Warning Banner */}
              {isStockoutRisk ? (
                <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Inventory Warning at this scale:</strong>
                    <div className="mt-0.5 text-rose-700 dark:text-rose-300 font-sans">
                      Scaling ad spend to ₹{(simDailyAdSpend / 1000).toFixed(0)}k/day will burn through <strong>Radiance Glow Serum</strong> stock in <strong>3.8 days</strong>. Place a supplier restock order before launching this budget.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Inventory Runway Safe:</strong>
                    <div className="mt-0.5 text-emerald-700 dark:text-emerald-300 font-sans">
                      On-hand inventory across all SKUs can support this order volume (~{projectedDailyUnits} items/day) for 20+ days.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: CURRENT P&L BREAKDOWN */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Where Every ₹100 of Revenue Goes (Current Baseline)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              ₹3,42,800 Total Daily Sales
            </span>
          </div>

          <div className="space-y-3">
            <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-white text-center leading-6">
              <div style={{ width: `${profitBreakdown.netMarginPercentage}%` }} className="bg-emerald-500">
                Profit {profitBreakdown.netMarginPercentage.toFixed(0)}%
              </div>
              <div style={{ width: `${(profitBreakdown.adSpendTotal / profitBreakdown.grossRevenue) * 100}%` }} className="bg-indigo-500">
                Ads {((profitBreakdown.adSpendTotal / profitBreakdown.grossRevenue) * 100).toFixed(0)}%
              </div>
              <div style={{ width: `${(profitBreakdown.cogsTotal / profitBreakdown.grossRevenue) * 100}%` }} className="bg-amber-500">
                Products {((profitBreakdown.cogsTotal / profitBreakdown.grossRevenue) * 100).toFixed(0)}%
              </div>
              <div style={{ width: `${(profitBreakdown.shippingFulfillmentTotal / profitBreakdown.grossRevenue) * 100}%` }} className="bg-blue-500">
                Shipping 7%
              </div>
              <div style={{ width: `${((profitBreakdown.gatewayFeesTotal + profitBreakdown.returnsRefundsTotal) / profitBreakdown.grossRevenue) * 100}%` }} className="bg-rose-500">
                Fees 5%
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Take-Home Profit</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">₹{profitBreakdown.netOperatingProfit.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Ad Spend</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">₹{profitBreakdown.adSpendTotal.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Product Cost (COGS)</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">₹{profitBreakdown.cogsTotal.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Courier & Packing</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">₹{profitBreakdown.shippingFulfillmentTotal.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Gateway & Returns</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">₹{(profitBreakdown.gatewayFeesTotal + profitBreakdown.returnsRefundsTotal).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PRODUCT MARGIN MATRIX */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Product Profit & Margin Ranking Matrix
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Exact net contribution profit per product after dedicated ads, packaging, and courier fees.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { label: 'All', val: 'ALL' },
                  { label: '🔥 Winners', val: 'SCALE_AGGRESSIVELY' },
                  { label: '⚠️ Squeeze', val: 'MARGIN_SQUEEZE' },
                  { label: '🔴 Losing Money', val: 'LOSS_LEADER_ALERT' },
                ].map((f) => (
                  <button
                    key={f.val}
                    onClick={() => setStatusFilter(f.val)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                      statusFilter === f.val
                        ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 font-semibold text-slate-600 dark:text-slate-400">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3 text-right">Units Sold</th>
                  <th className="py-3 px-3 text-right">Total Sales</th>
                  <th className="py-3 px-3 text-right">Ad Spend</th>
                  <th className="py-3 px-3 text-right">Net Profit</th>
                  <th className="py-3 px-3 text-right">Profit %</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProducts.map((p) => (
                  <tr key={p.sku} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {p.sku} • ₹{p.sellingPrice} Price
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{p.unitsSold}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹{p.grossRevenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                      ₹{p.allocatedAdSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      {p.netContributionProfit >= 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          +₹{p.netContributionProfit.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">
                          -₹{Math.abs(p.netContributionProfit).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      <span
                        className={`rounded-md px-1.5 py-0.5 ${
                          p.marginPercentage >= 40
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                            : p.marginPercentage >= 15
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400'
                            : p.marginPercentage >= 0
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {p.marginPercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">{getStatusBadge(p.status)}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-600 dark:text-slate-300 max-w-xs leading-snug">
                      {p.aiRecommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
