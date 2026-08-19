'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Brain,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Percent,
  Activity,
  Layers,
} from 'lucide-react';
import { DailyMetricSnapshot, AiDiagnosis } from '@/lib/types';
import { toast } from 'sonner';

interface MorningBriefingProps {
  currentMetrics: DailyMetricSnapshot;
  previousMetrics: DailyMetricSnapshot;
  diagnosis: AiDiagnosis;
  onReRunDiagnosis: () => void;
  isDiagnosing: boolean;
}

export const MorningBriefing: React.FC<MorningBriefingProps> = ({
  currentMetrics,
  previousMetrics,
  diagnosis,
  onReRunDiagnosis,
  isDiagnosing,
}) => {
  const revChange = ((currentMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue) * 100;
  const roasChange = ((currentMetrics.blendedRoas - previousMetrics.blendedRoas) / previousMetrics.blendedRoas) * 100;
  const ordersChange = ((currentMetrics.ordersCount - previousMetrics.ordersCount) / previousMetrics.ordersCount) * 100;
  const crChange = ((currentMetrics.conversionRate - previousMetrics.conversionRate) / previousMetrics.conversionRate) * 100;

  const isHealthy = diagnosis.urgency === 'LOW' && revChange >= 0;

  const handleReRun = () => {
    onReRunDiagnosis();
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Analyzing yesterday\'s store performance...',
        success: 'Store analysis updated with latest data!',
        error: 'Error updating analysis.',
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Daily Summary
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Yesterday's Performance
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Here is why your revenue changed and the exact steps to fix it.
          </p>
        </div>

        <button
          onClick={handleReRun}
          disabled={isDiagnosing}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50 shadow-xs"
        >
          <Sparkles className={`h-4 w-4 text-emerald-500 ${isDiagnosing ? 'animate-spin' : ''}`} />
          <span>{isDiagnosing ? 'Analyzing Store...' : 'Refresh Store Insights'}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Revenue */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Total Sales</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ₹{currentMetrics.revenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {revChange >= 0 ? (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{revChange.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="h-3.5 w-3.5" /> {revChange.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400 text-[11px]">vs previous day</span>
          </div>
        </div>

        {/* Metric 2: Net Profit */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Net Profit</span>
            <Activity className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ₹{(currentMetrics.revenue * 0.309).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            <span className="rounded bg-indigo-100 dark:bg-indigo-950/80 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
              31% Take-Home
            </span>
            <span className="text-slate-400 text-[11px]">after all expenses</span>
          </div>
        </div>

        {/* Metric 3: Ad Return (ROAS) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Ad Return (ROAS)</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {currentMetrics.blendedRoas.toFixed(2)}x
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {roasChange >= 0 ? (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{roasChange.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="h-3.5 w-3.5" /> {roasChange.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400 text-[11px]">target 3.50x</span>
          </div>
        </div>

        {/* Metric 4: Orders & Average Order Value */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Orders / Avg Order</span>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {currentMetrics.ordersCount}
            </span>
            <span className="text-xs text-slate-500">
              @ ₹{currentMetrics.aov.toFixed(0)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {ordersChange >= 0 ? (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{ordersChange.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="h-3.5 w-3.5" /> {ordersChange.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400 text-[11px]">vs yesterday</span>
          </div>
        </div>

        {/* Metric 5: Conversion Rate */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Store Conversion</span>
            <Percent className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {currentMetrics.conversionRate.toFixed(2)}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {crChange >= 0 ? (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{crChange.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="h-3.5 w-3.5" /> {crChange.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400 text-[11px]">{currentMetrics.trafficVisitors.toLocaleString()} store visits</span>
          </div>
        </div>
      </div>

      {/* AI Performance Story Banner */}
      <div
        className={`rounded-2xl border p-5 transition-all shadow-xs ${
          isHealthy
            ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100'
            : 'border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-100'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold shadow-sm ${
                isHealthy
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {isHealthy ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isHealthy
                      ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                  }`}
                >
                  {isHealthy ? 'Store on Track' : 'Needs Attention'}
                </span>
                <span className="text-xs text-slate-500">
                  Confidence: {(diagnosis.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {diagnosis.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {diagnosis.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Root Causes / Key Drivers */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-4">
          {diagnosis.rootCauses.map((rc, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-3.5 space-y-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-white">{rc.metric}</span>
                <span className="rounded bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 font-mono">
                  {rc.impact}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-sans">
                {rc.description}
              </p>
              {rc.affectedItem && (
                <div className="pt-1 text-[10px] text-slate-400 truncate">
                  Area: {rc.affectedItem}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
