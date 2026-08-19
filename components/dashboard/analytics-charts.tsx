'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { DailyMetricSnapshot } from '@/lib/types';
import { BarChart3, TrendingUp, DollarSign, Filter, Layers } from 'lucide-react';

interface AnalyticsChartsProps {
  metricsHistory: DailyMetricSnapshot[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ metricsHistory }) => {
  const [activeTab, setActiveTab] = useState<'REVENUE' | 'ROAS' | 'FUNNEL'>('REVENUE');

  const chartData = metricsHistory.map((m) => ({
    date: m.date.substring(5), // MM-DD
    revenue: m.revenue,
    metaSpend: m.metaSpend,
    blendedRoas: m.blendedRoas,
    orders: m.ordersCount,
    abandonedValue: m.abandonedCartValue,
    cr: m.conversionRate,
  }));

  const campaignRoasData = [
    { campaign: 'Top Broad Winning Ads', roas: 4.1, spend: 48000, status: 'Active' },
    { campaign: 'Vitamin C Serum Launch', roas: 2.6, spend: 25000, status: 'Active' },
    { campaign: 'Summer Retargeting Ads', roas: 1.4, spend: 42000, status: 'Fatigued' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5 shadow-xs">
      {/* Top Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Sales & Marketing Trends
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            7-day history comparing daily sales, ad efficiency, and cart drop-offs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('REVENUE')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeTab === 'REVENUE'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Sales vs Ad Spend
          </button>
          <button
            onClick={() => setActiveTab('ROAS')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeTab === 'ROAS'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Ad Return (ROAS)
          </button>
          <button
            onClick={() => setActiveTab('FUNNEL')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeTab === 'FUNNEL'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Lost Carts vs Conversion
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full pt-2">
        {activeTab === 'REVENUE' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Total Sales"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
              <Area
                type="monotone"
                dataKey="metaSpend"
                name="Meta Ad Spend"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'ROAS' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignRoasData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="campaign" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}x`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="roas" name="Ad Return Multiple (ROAS)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'FUNNEL' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="abandonedValue" name="Lost Checkout Value (₹)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="cr" name="Store Conversion Rate (%)" stroke="#38bdf8" strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
