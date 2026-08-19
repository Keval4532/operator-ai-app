'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Settings2,
  Play,
  Check,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Terminal,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { ActionQueueItem, ActionCategory } from '@/lib/types';
import { toast } from 'sonner';

interface ActionStreamProps {
  actionQueue: ActionQueueItem[];
  onExecuteAction: (actionId: string, customPayload?: Record<string, any>) => Promise<void>;
  onDismissAction: (actionId: string) => void;
}

export const ActionStream: React.FC<ActionStreamProps> = ({
  actionQueue,
  onExecuteAction,
  onDismissAction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const filteredQueue = actionQueue.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleApprove = async (item: ActionQueueItem) => {
    setExecutingId(item.id);
    try {
      await onExecuteAction(item.id);
      toast.success(`Action Approved & Executed!`, {
        description: `"${item.title}" has been applied. Estimated revenue boost: +₹${item.impactEstimateMax.toLocaleString('en-IN')}.`,
      });
    } catch (e) {
      console.error(e);
      toast.error('Execution Failed', { description: 'Could not complete action execution.' });
    } finally {
      setExecutingId(null);
    }
  };

  const handleDismiss = (item: ActionQueueItem) => {
    onDismissAction(item.id);
    toast.info('Action Dismissed', { description: `"${item.title}" dismissed.` });
  };

  const toggleLogExpand = (id: string) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories: { label: string; value: string }[] = [
    { label: 'All Actions', value: 'ALL' },
    { label: 'Meta Ads', value: 'META_ADS' },
    { label: 'Cart Recovery', value: 'CART_RECOVERY' },
    { label: 'VIP Customers', value: 'WINBACK_EMAIL' },
  ];

  const getCategoryLabel = (category: ActionCategory) => {
    switch (category) {
      case 'META_ADS':
        return 'Meta Ads Optimization';
      case 'CART_RECOVERY':
        return 'WhatsApp Cart Recovery';
      case 'WINBACK_EMAIL':
        return 'VIP Customer Winback';
      case 'INVENTORY_ALERT':
        return 'Inventory Reorder';
      default:
        return 'Store Optimization';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Recommended Actions</h2>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              1-Click Approval
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Review and approve automated steps to boost revenue and fix ad fatigue.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-slate-800 dark:bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards Feed */}
      <div className="space-y-4">
        {filteredQueue.map((item) => {
          const isPending = item.status === 'PENDING_APPROVAL';
          const isExecuting = executingId === item.id || item.status === 'EXECUTING';
          const isCompleted = item.status === 'COMPLETED' || item.status === 'APPROVED';
          const isRejected = item.status === 'REJECTED';
          const isExpanded = !!expandedLogs[item.id];

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 shadow-xs ${
                isCompleted
                  ? 'border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : isRejected
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30 opacity-60'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700'
              } p-5`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left content block */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Expected Revenue Gain: +₹{item.impactEstimateMin.toLocaleString('en-IN')} - ₹{item.impactEstimateMax.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right Approval & Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 lg:self-center shrink-0">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50"
                      >
                        <Play className={`h-3.5 w-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
                        <span>{isExecuting ? 'Applying...' : 'Approve & Apply'}</span>
                      </button>

                      <button
                        onClick={() => handleDismiss(item)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs"
                      >
                        Dismiss
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Applied Live
                      </span>
                      {item.executionLog && (
                        <button
                          onClick={() => toggleLogExpand(item.id)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="View Details"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  )}

                  {isRejected && (
                    <span className="text-xs text-slate-400">Dismissed</span>
                  )}
                </div>
              </div>

              {/* Collapsible Details Panel */}
              {isCompleted && item.executionLog && isExpanded && (
                <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-800">
                    <span>Execution Details</span>
                    <span>Applied: {new Date(item.executedAt || '').toLocaleTimeString()}</span>
                  </div>
                  <pre className="overflow-x-auto pt-1 text-[11px] leading-relaxed font-mono">
                    {JSON.stringify(item.executionLog, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
