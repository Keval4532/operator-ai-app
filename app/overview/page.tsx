'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { MorningBriefing } from '@/components/dashboard/morning-briefing';
import { ActionStream } from '@/components/dashboard/action-stream';
import { ImpactLedgerCard } from '@/components/dashboard/impact-ledger-card';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';
import { MemoryAuditLog } from '@/components/dashboard/memory-audit-log';
import { OperatorTerminal } from '@/components/dashboard/operator-terminal';
import { store } from '@/lib/store';
import {
  DailyMetricSnapshot,
  AiDiagnosis,
  ActionQueueItem,
  BusinessMemory,
  AuditLog,
  ChatMessage,
  ImpactLedgerSummary,
} from '@/lib/types';

export default function OverviewPage() {
  const [metricsHistory, setMetricsHistory] = useState<DailyMetricSnapshot[]>([]);
  const [diagnosis, setDiagnosis] = useState<AiDiagnosis | null>(null);
  const [actionQueue, setActionQueue] = useState<ActionQueueItem[]>([]);
  const [impactLedger, setImpactLedger] = useState<ImpactLedgerSummary>(store.getImpactLedger());
  const [memories, setMemories] = useState<BusinessMemory[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  const refreshState = () => {
    setMetricsHistory([...store.getMetricsHistory()]);
    setDiagnosis({ ...store.getCurrentDiagnosis() });
    setActionQueue([...store.getActionQueue()]);
    setImpactLedger({ ...store.getImpactLedger() });
    setMemories([...store.getBusinessMemories()]);
    setAuditLogs([...store.getAuditLogs()]);
    setChatHistory([...store.getChatHistory()]);
    setIsDemoMode(store.getIsDemoMode());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleToggleDemoMode = () => {
    store.toggleDemoMode();
    refreshState();
  };

  const handleReRunDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/agent/diagnose', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        refreshState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleExecuteAction = async (actionId: string, customPayload?: Record<string, any>) => {
    try {
      const res = await fetch('/api/agent/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, customPayload, role: 'OWNER' }),
      });
      const data = await res.json();
      if (data.success) {
        refreshState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissAction = (actionId: string) => {
    store.updateActionStatus(actionId, 'REJECTED');
    refreshState();
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
        refreshState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (metricsHistory.length === 0 || !diagnosis) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-white font-mono text-xs">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          Initializing Operator AI v5.0...
        </span>
      </div>
    );
  }

  const t0Metrics = metricsHistory[metricsHistory.length - 1];
  const t1Metrics = metricsHistory[metricsHistory.length - 2];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* 4-Workspace Navigation Header */}
      <Header
        storeName={store.getOrganization().name}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Main Overview Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Section 1: Executive Yesterday Briefing Hero */}
        <MorningBriefing
          currentMetrics={t0Metrics}
          previousMetrics={t1Metrics}
          diagnosis={diagnosis}
          onReRunDiagnosis={handleReRunDiagnosis}
          isDiagnosing={isDiagnosing}
        />

        {/* Section 2: Recommended Actions (1-Click Approval) */}
        <ActionStream
          actionQueue={actionQueue}
          onExecuteAction={handleExecuteAction}
          onDismissAction={handleDismissAction}
        />

        {/* Section 3: Verified ROI Impact Ledger (Feature 4) */}
        <ImpactLedgerCard impactLedger={impactLedger} />

        {/* Section 4: Revenue & Marketing Trends */}
        <AnalyticsCharts metricsHistory={metricsHistory} />

        {/* Section 5: Business Lessons & Action History */}
        <MemoryAuditLog memories={memories} auditLogs={auditLogs} />
      </main>

      {/* AI Assistant Chat Slide-Over */}
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
