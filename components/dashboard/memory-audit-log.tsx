'use client';

import React, { useState } from 'react';
import { BusinessMemory, AuditLog } from '@/lib/types';
import { Brain, History, Shield, CheckCircle2, Cpu, Sparkles } from 'lucide-react';

interface MemoryAuditLogProps {
  memories: BusinessMemory[];
  auditLogs: AuditLog[];
}

export const MemoryAuditLog: React.FC<MemoryAuditLogProps> = ({ memories, auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'MEMORIES' | 'AUDIT'>('MEMORIES');

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <Brain className="h-5 w-5 text-emerald-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Business Lessons & History
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Key store learnings and log of approved optimizations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('MEMORIES')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeTab === 'MEMORIES'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Saved Lessons ({memories.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeTab === 'AUDIT'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Action History ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'MEMORIES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  {mem.concept}
                </span>
                <span className="text-[10px] text-slate-500">
                  Confidence: {(mem.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{mem.insightText}</p>
              <span className="block text-[10px] text-slate-400 pt-1">
                Saved on {new Date(mem.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/80 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{log.actionName}</div>
                  <div className="text-[10px] text-slate-500">
                    Executed by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{log.actor === 'USER' ? 'Store Owner' : 'Operator AI'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
