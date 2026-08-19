'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { OperatorTerminal } from '@/components/dashboard/operator-terminal';
import { IntegrationsHub } from '@/components/settings/integrations-hub';
import { store } from '@/lib/store';
import {
  AutopilotRule,
  AutopilotMode,
  FounderGuardrailRule,
  InventorySkuItem,
  PurchaseOrderDraft,
  Integration,
  IntegrationProvider,
  MemoryCategory,
} from '@/lib/types';
import {
  Brain,
  Zap,
  ShieldCheck,
  Package,
  Sliders,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building,
  X,
  FileText,
  Clock,
  Settings,
  MessageSquare,
  Target,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RulesWorkspacePage() {
  const [autopilotRules, setAutopilotRules] = useState<AutopilotRule[]>(store.getAutopilotRules());
  const [guardrails, setGuardrails] = useState<FounderGuardrailRule[]>(store.getGuardrailRules());
  const [inventorySkus, setInventorySkus] = useState<InventorySkuItem[]>(store.getInventorySkus());
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderDraft[]>(store.getPurchaseOrders());
  const [integrations, setIntegrations] = useState<Integration[]>(store.getIntegrations());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(store.getIsDemoMode());
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState(store.getChatHistory());

  // Sub-Tab inside Rules Workspace
  const [activeTab, setActiveTab] = useState<'AUTOPILOT' | 'GUARDRAILS' | 'INVENTORY' | 'INTEGRATIONS'>('AUTOPILOT');

  // Add Rule Modal State
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleCondition, setRuleCondition] = useState('');
  const [ruleCategory, setRuleCategory] = useState<MemoryCategory>('BUDGET_SCALING');
  const [rulePolicy, setRulePolicy] = useState<'BLOCK_ACTION' | 'REQUIRE_MANUAL_PIN' | 'WARN_ONLY'>('REQUIRE_MANUAL_PIN');

  // Restock PO Modal State
  const [activePoSku, setActivePoSku] = useState<InventorySkuItem | null>(null);
  const [poUnits, setPoUnits] = useState<number>(500);

  // Sandbox State
  const [sandboxPrompt, setSandboxPrompt] = useState('Scale ad budget by 40% on Sunday afternoon');
  const [sandboxResult, setSandboxResult] = useState<{ evaluated: boolean; passed: boolean; message: string } | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAutopilotRules([...store.getAutopilotRules()]);
    setGuardrails([...store.getGuardrailRules()]);
    setInventorySkus([...store.getInventorySkus()]);
    setPurchaseOrders([...store.getPurchaseOrders()]);
    setIntegrations([...store.getIntegrations()]);
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

  // Feature 1: 3-Way Autopilot Switch Mode Change
  const handleSetAutopilotMode = (id: string, mode: AutopilotMode) => {
    const updated = store.updateAutopilotRuleMode(id, mode);
    setAutopilotRules([...updated]);
    const rule = updated.find((r) => r.id === id);

    if (mode === 'FULL_AUTOPILOT') {
      toast.success(`⚡ Full Autopilot Enabled for "${rule?.title}"`, {
        description: `Operator AI will now execute this action autonomously when conditions trigger.`,
      });
    } else if (mode === 'CO_PILOT') {
      toast.info(`Co-Pilot Mode Active (Ask Me First)`, {
        description: `Operator AI will queue recommendations for your 1-click approval.`,
      });
    } else {
      toast.warning(`Automation Turned OFF for "${rule?.title}"`);
    }
  };

  // Guardrails
  const handleToggleGuardrail = (id: string) => {
    const r = store.toggleGuardrailRule(id);
    if (r) {
      refreshData();
      toast.info(r.isActive ? `Rule Active: ${r.title}` : `Rule Paused: ${r.title}`);
    }
  };

  const handleDeleteGuardrail = (id: string) => {
    const d = store.deleteGuardrailRule(id);
    if (d) {
      refreshData();
      toast.success(`Rule Removed: ${d.title}`);
    }
  };

  const handleCreateGuardrail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle.trim() || !ruleCondition.trim()) return;

    store.addGuardrailRule({
      title: ruleTitle,
      condition: ruleCondition,
      category: ruleCategory,
      actionPolicy: rulePolicy,
      isActive: true,
    });
    refreshData();
    setIsAddRuleOpen(false);
    setRuleTitle('');
    setRuleCondition('');
    toast.success('Safety Guardrail Added!');
  };

  const handleRunSandbox = () => {
    const lower = sandboxPrompt.toLowerCase();
    if (lower.includes('sunday') || lower.includes('weekend') || lower.includes('40%')) {
      const weekendRule = guardrails.find((r) => r.id === 'rule_01' && r.isActive);
      if (weekendRule) {
        setSandboxResult({
          evaluated: true,
          passed: false,
          message: `BLOCKED BY RULE: "${weekendRule.title}" (${weekendRule.condition})`,
        });
        toast.error('Blocked by Weekend Cap Rule');
        return;
      }
    }
    setSandboxResult({
      evaluated: true,
      passed: true,
      message: 'Action complies with all active founder rules.',
    });
    toast.success('Passed All Safety Rules');
  };

  // Inventory PO
  const handleOpenPoModal = (sku: InventorySkuItem) => {
    setActivePoSku(sku);
    const suggestedUnits = Math.ceil(sku.dailyVelocity30d * (sku.leadTimeDays + 20));
    setPoUnits(suggestedUnits > 0 ? suggestedUnits : 500);
  };

  const handleConfirmPo = () => {
    if (!activePoSku) return;
    const po = store.createPurchaseOrder(activePoSku.id, poUnits);
    refreshData();
    setActivePoSku(null);
    toast.success(`Restock Order ${po.poNumber} Sent to Supplier!`, {
      description: `Dispatched order for ${po.unitsOrdered} units to ${po.supplierName}. Arrival: ${po.expectedDeliveryDate}`,
    });
  };

  const handleSyncIntegrations = async (provider?: IntegrationProvider) => {
    store.syncAllIntegrations();
    refreshData();
    toast.success(provider ? `${provider} Refreshed!` : 'All 5 Channels Refreshed Successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <Header
        storeName={store.getOrganization().name}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Autonomous Intelligence & Safety
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Brain, Autopilot & Rules
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Control autonomy switchboards, founder safety guardrails, inventory restock rules, and app connections.
            </p>
          </div>

          {/* Sub-Workspace Tab Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 shadow-2xs">
            <button
              onClick={() => setActiveTab('AUTOPILOT')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'AUTOPILOT'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span>Autopilot Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('GUARDRAILS')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'GUARDRAILS'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              <span>Safety Guardrails</span>
            </button>

            <button
              onClick={() => setActiveTab('INVENTORY')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'INVENTORY'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Package className="h-3.5 w-3.5 text-amber-500" />
              <span>Inventory & Restock</span>
            </button>

            <button
              onClick={() => setActiveTab('INTEGRATIONS')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'INTEGRATIONS'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Connected Apps</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AUTOPILOT VS. CO-PILOT SWITCHBOARD (FEATURE 1) */}
        {activeTab === 'AUTOPILOT' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Autopilot vs. Co-Pilot Control Switchboard
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Choose which store operations run 100% autonomously vs requiring your 1-click manual approval.
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {autopilotRules.filter((r) => r.mode === 'FULL_AUTOPILOT').length} Full Autopilot • {autopilotRules.filter((r) => r.mode === 'CO_PILOT').length} Co-Pilot
                </span>
              </div>

              {/* 4 Autopilot Rule Cards */}
              <div className="space-y-4">
                {autopilotRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{rule.title}</span>
                          <span className="rounded-md bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                            {rule.conditionSummary}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rule.description}</p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                          <span>Fired: <strong className="text-slate-700 dark:text-slate-300">{rule.timesFired} times</strong></span>
                          <span>•</span>
                          <span>Value Created: <strong className="text-emerald-600 dark:text-emerald-400">+₹{rule.impactCreatedTotal.toLocaleString('en-IN')}</strong></span>
                          {rule.lastFiredAt && (
                            <>
                              <span>•</span>
                              <span>Last fired: {new Date(rule.lastFiredAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 3-Way Mode Switcher */}
                      <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shrink-0 shadow-2xs">
                        <button
                          onClick={() => handleSetAutopilotMode(rule.id, 'OFF')}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            rule.mode === 'OFF'
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          OFF
                        </button>

                        <button
                          onClick={() => handleSetAutopilotMode(rule.id, 'CO_PILOT')}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            rule.mode === 'CO_PILOT'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          ASK ME FIRST (Co-Pilot)
                        </button>

                        <button
                          onClick={() => handleSetAutopilotMode(rule.id, 'FULL_AUTOPILOT')}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                            rule.mode === 'FULL_AUTOPILOT'
                              ? 'bg-emerald-600 text-white shadow-xs glow-emerald'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          <Zap className="h-3 w-3" /> FULL AUTOPILOT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY GUARDRAILS */}
        {activeTab === 'GUARDRAILS' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Founder Safety Guardrails</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Hard boundaries that prevent your AI from overspending or violating margins.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddRuleOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-bold shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Safety Rule
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guardrails.map((rule) => (
                  <div
                    key={rule.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          {rule.category.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleGuardrail(rule.id)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                              rule.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                rule.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{rule.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        "{rule.condition}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                      <span>Created: {new Date(rule.createdAt).toLocaleDateString()}</span>
                      <button onClick={() => handleDeleteGuardrail(rule.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sandbox */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 p-4 space-y-3">
                <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider block">
                  Test an Action Idea Against Rules:
                </span>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleRunSandbox}
                    className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-1.5 text-xs font-bold"
                  >
                    Check Compliance
                  </button>
                </div>
                {sandboxResult && (
                  <div
                    className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      sandboxResult.passed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {sandboxResult.passed ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    <span>{sandboxResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY & RESTOCK */}
        {activeTab === 'INVENTORY' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Days of Inventory Left & Restock Rules</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Track stock countdown and dispatch 1-click supplier purchase orders.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold text-slate-600 dark:text-slate-400">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-3 text-right">In-Stock</th>
                      <th className="py-3 px-3 text-right">Sales Speed</th>
                      <th className="py-3 px-3 text-right">Days Left</th>
                      <th className="py-3 px-3 text-right">Lead Time</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {inventorySkus.map((sku) => (
                      <tr key={sku.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{sku.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{sku.sku} • {sku.supplierName}</div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold">{sku.currentStock} units</td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">{sku.dailyVelocity7d} items/day</td>
                        <td className="py-3.5 px-3 text-right font-mono font-extrabold">
                          <span
                            className={
                              sku.dosr < 12
                                ? 'text-rose-600 dark:text-rose-400'
                                : sku.dosr < 25
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }
                          >
                            {sku.dosr.toFixed(0)} Days
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-500">{sku.leadTimeDays} days</td>
                        <td className="py-3.5 px-4 text-right">
                          {sku.riskLevel === 'CRITICAL_STOCKOUT' || sku.riskLevel === 'LOW_STOCK' || sku.dosr < 10 ? (
                            <button
                              onClick={() => handleOpenPoModal(sku)}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold shadow-xs flex items-center gap-1 ml-auto transition"
                            >
                              <Zap className="h-3 w-3" />
                              <span>Generate Supplier PO</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Stock Safe</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONNECTED APPS & INTEGRATIONS */}
        {activeTab === 'INTEGRATIONS' && (
          <div className="space-y-6">
            <IntegrationsHub
              integrations={integrations}
              onSync={handleSyncIntegrations}
              onUpdateStatus={(id, status) => {
                store.updateIntegrationStatus(id, status);
                refreshData();
              }}
            />
          </div>
        )}
      </main>

      {/* MODAL: ADD SAFETY RULE */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Store Safety Rule</h3>
              <button onClick={() => setIsAddRuleOpen(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreateGuardrail} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Rule Name:</label>
                <input
                  type="text"
                  required
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  placeholder="e.g. Cap weekend ad spend at 15%"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Rule Condition:</label>
                <textarea
                  required
                  rows={3}
                  value={ruleCondition}
                  onChange={(e) => setRuleCondition(e.target.value)}
                  placeholder="Never increase budget on Sunday..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2 text-slate-900 dark:text-white font-sans"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold">
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPPLIER PURCHASE ORDER (PO) GENERATOR */}
      {activePoSku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Supplier Purchase Order (PO)</h3>
                  <p className="text-[11px] text-slate-500">Auto-calculated based on {activePoSku.dailyVelocity7d} units/day burn rate</p>
                </div>
              </div>
              <button onClick={() => setActivePoSku(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-bold text-sm text-slate-900 dark:text-white">{activePoSku.title}</div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Supplier: <strong>{activePoSku.supplierName}</strong></span>
                  <span>GSTIN: <strong>27AABCA1234F1Z9</strong></span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Lead Time: {activePoSku.leadTimeDays} Business Days</span>
                  <span>Contact: {activePoSku.supplierEmail}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Recommended Reorder Quantity (Units):
                </label>
                <input
                  type="number"
                  value={poUnits}
                  onChange={(e) => setPoUnits(Math.max(10, Number(e.target.value)))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 font-mono text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border">
                  <span className="text-[10px] text-slate-400 block font-semibold">Unit Manufacturing Cost:</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">₹{activePoSku.unitCost} / unit</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-semibold">Total Purchase Cost:</span>
                  <div className="text-base font-bold font-mono text-emerald-900 dark:text-emerald-200">
                    ₹{(poUnits * activePoSku.unitCost).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setActivePoSku(null)} className="rounded-lg border px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmPo();
                  toast.success(`Dispatched PO to ${activePoSku.supplierName} via WhatsApp!`);
                }}
                className="rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Send via Supplier WhatsApp
              </button>
              <button
                onClick={handleConfirmPo}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" /> Send Supplier Email PO
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
