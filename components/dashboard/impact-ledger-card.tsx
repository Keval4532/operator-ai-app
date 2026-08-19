'use client';

import React, { useState } from 'react';
import { ImpactLedgerSummary, ImpactLedgerItem } from '@/lib/types';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Filter,
  Layers,
  PauseCircle,
  MessageSquare,
  Package,
} from 'lucide-react';

interface ImpactLedgerCardProps {
  impactLedger: ImpactLedgerSummary;
}

export const ImpactLedgerCard: React.FC<ImpactLedgerCardProps> = ({ impactLedger }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredItems = impactLedger.items.filter((item) => {
    if (filterCategory === 'ALL') return true;
    return item.category === filterCategory;
  });

  const getCategoryBadge = (category: ImpactLedgerItem['category']) => {
    switch (category) {
      case 'AD_SPEND_SAVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <PauseCircle className="h-3 w-3" /> Wasted Ad Spend Saved
          </span>
        );
      case 'REVENUE_RECOVERED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <MessageSquare className="h-3 w-3" /> Revenue Recovered
          </span>
        );
      case 'BACKORDER_PREVENTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
            <Package className="h-3 w-3" /> Stockout Safeguard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
            <TrendingUp className="h-3 w-3" /> Profit Expanded
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Verified ROI Impact Ledger
              </h3>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                100% Trackable
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Exact financial value created and wasted budget prevented by Operator AI this month.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { label: 'All Value', val: 'ALL' },
            { label: 'Ad Savings', val: 'AD_SPEND_SAVED' },
            { label: 'Recovered Sales', val: 'REVENUE_RECOVERED' },
            { label: 'Profit Gains', val: 'PROFIT_EXPANDED' },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setFilterCategory(f.val)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition whitespace-nowrap ${
                filterCategory === f.val
                  ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Summary Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 space-y-1 shadow-sm glow-emerald">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Total Net Value Created
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-900 dark:text-emerald-200">
            +₹{impactLedger.totalNetValueCreated.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 font-medium">
            18.4x ROI on Operator AI platform fee
          </p>
        </div>

        <div className="rounded-xl border border-amber-300/80 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/30 p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            Wasted Ad Spend Prevented
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-900 dark:text-amber-200">
            ₹{impactLedger.wastedAdSpendPrevented.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400/90">
            Saved by pausing high-frequency & fatigued ads
          </p>
        </div>

        <div className="rounded-xl border border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400">
            Revenue Recovered via WhatsApp
          </span>
          <div className="text-2xl font-extrabold font-mono text-indigo-900 dark:text-indigo-200">
            ₹{impactLedger.revenueRecovered.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400/90">
            Directly deposited from cart drop-off recoveries
          </p>
        </div>
      </div>

      {/* Itemized Audit Feed */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Itemized Verified Ledger ({filteredItems.length} Actions)
        </span>

        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getCategoryBadge(item.category)}
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
                  {item.actionTaken}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  +₹{item.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(item.executedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
