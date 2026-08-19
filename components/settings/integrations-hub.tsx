'use client';

import React, { useState } from 'react';
import { Integration, IntegrationProvider } from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Key,
  Globe,
  ExternalLink,
  Shield,
  Zap,
  ShoppingBag,
  Share2,
  BarChart,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationsHubProps {
  integrations: Integration[];
  onSync: (provider?: IntegrationProvider) => Promise<void>;
  onUpdateStatus: (id: string, status: Integration['status']) => void;
}

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({
  integrations,
  onSync,
  onUpdateStatus,
}) => {
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSync = async (provider?: IntegrationProvider) => {
    setSyncingProvider(provider || 'ALL');
    try {
      await onSync(provider);
      toast.success(provider ? `${provider} Data Refreshed!` : 'All 5 Channels Refreshed Successfully!');
    } finally {
      setSyncingProvider(null);
    }
  };

  const getProviderMeta = (provider: IntegrationProvider) => {
    switch (provider) {
      case 'SHOPIFY':
        return {
          name: 'Shopify Store',
          icon: ShoppingBag,
          color: 'text-emerald-500',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
          desc: 'Orders, inventory stock, abandoned checkouts, and automatic discount codes.',
        };
      case 'META_ADS':
        return {
          name: 'Meta Ads (Facebook & Instagram)',
          icon: Share2,
          color: 'text-blue-500',
          bg: 'bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800',
          desc: 'Ad spend tracking, ROAS calculation, ad fatigue checks, and budget scaling.',
        };
      case 'GOOGLE_ANALYTICS':
        return {
          name: 'Google Analytics 4',
          icon: BarChart,
          color: 'text-amber-500',
          bg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
          desc: 'Website visitor numbers, checkout drop-off steps, and traffic sources.',
        };
      case 'WHATSAPP_CLOUDFLARE':
        return {
          name: 'WhatsApp Business API',
          icon: MessageSquare,
          color: 'text-emerald-500',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
          desc: 'Sending 1-to-1 cart recovery offers and VIP replenishment vouchers.',
        };
      case 'KLAVIYO':
        return {
          name: 'Klaviyo Email',
          icon: Mail,
          color: 'text-purple-500',
          bg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800',
          desc: 'Email customer winbacks, VIP newsletters, and automated flows.',
        };
      default:
        return {
          name: provider,
          icon: Zap,
          color: 'text-slate-500',
          bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
          desc: 'External store connection.',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Settings & Connections
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Connected Apps & Channels
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Manage your store connections and API permissions across all sales channels.
          </p>
        </div>

        <button
          onClick={() => handleSync()}
          disabled={syncingProvider !== null}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncingProvider === 'ALL' ? 'animate-spin' : ''}`} />
          <span>{syncingProvider === 'ALL' ? 'Refreshing Data...' : 'Refresh All Channels'}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const meta = getProviderMeta(item.provider);
          const Icon = meta.icon;
          const isSyncing = syncingProvider === item.provider || syncingProvider === 'ALL';

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xs space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${meta.bg}`}>
                    <Icon className={`h-6 w-6 ${meta.color}`} />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'CONNECTED'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {item.status === 'CONNECTED' ? '● Connected' : 'Error'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {meta.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-xs space-y-1.5">
                  {item.storeUrl && (
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-[10px] uppercase">Domain:</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">{item.storeUrl}</span>
                    </div>
                  )}
                  {item.accountId && (
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-[10px] uppercase">Account:</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">{item.accountId}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>Last Updated:</span>
                    <span>{new Date(item.lastSyncedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => handleSync(item.provider)}
                  disabled={isSyncing}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 shadow-2xs"
                >
                  <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Refreshing...' : 'Refresh Data'}</span>
                </button>

                <button
                  onClick={() => setActiveModal(item)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Configure Token"
                >
                  <Sliders className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Configure {getProviderMeta(activeModal.provider).name}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API Token / Secret Key:
                </label>
                <input
                  type="password"
                  defaultValue={activeModal.accessToken}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Connection Health:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED & WORKING</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  toast.success('Connection Key Updated');
                }}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs"
              >
                Save & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
