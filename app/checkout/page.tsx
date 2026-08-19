'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Copy,
  Store,
  Mail,
  User,
  Phone,
  Check,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = (searchParams.get('plan')?.toUpperCase() || 'GROWTH') as 'STARTER' | 'GROWTH' | 'SCALE';

  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'GROWTH' | 'SCALE'>(
    ['STARTER', 'GROWTH', 'SCALE'].includes(planParam) ? planParam : 'GROWTH'
  );
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('Aura Skincare');
  const [workEmail, setWorkEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Flow step: 1 = Form, 2 = Provisioning, 3 = Generated Credentials
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionMessage, setProvisionMessage] = useState('Configuring secure tenant workspace...');
  const [generatedPassword, setGeneratedPassword] = useState('OP-AI-8942#xK');
  const [copied, setCopied] = useState(false);

  const planDetails = {
    STARTER: { name: 'Starter Operator', price: '₹3,499/mo', tag: 'Up to ₹10L/mo' },
    GROWTH: { name: 'Growth Operator', price: '₹8,999/mo', tag: 'Most Popular ⭐' },
    SCALE: { name: 'Scale & Enterprise', price: '₹24,999/mo', tag: '₹50L+/mo or Agencies' },
  };

  const handleStartProvisioning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      toast.error('Please enter your Store Name');
      return;
    }

    setStep(2);
    setProvisionProgress(20);
    setProvisionMessage('Configuring secure isolated tenant workspace...');

    setTimeout(() => {
      setProvisionProgress(55);
      setProvisionMessage('Setting up autonomous AI heuristic diagnostic models...');
    }, 600);

    setTimeout(() => {
      setProvisionProgress(85);
      setProvisionMessage('Connecting Shopify & Meta Ads sandbox bridge...');
    }, 1200);

    setTimeout(() => {
      setProvisionProgress(100);
      setProvisionMessage('Workspace provisioned successfully!');
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      setGeneratedPassword(`OP-AI-${randomCode}#${Math.random().toString(36).substring(7).slice(0, 2).toUpperCase()}`);
      setStep(3);
      toast.success('Store Workspace Ready! 🎉', {
        description: 'Account credentials generated. Save your login details below.',
      });
    }, 1800);
  };

  const handleCopyCredentials = () => {
    const text = `Operator AI Login Credentials:\nWorkspace: ${storeName.toLowerCase().replace(/\s+/g, '-')}.operatorai.app\nEmail: ${workEmail || 'founder@' + storeName.toLowerCase().replace(/\s+/g, '') + '.com'}\nPassword: ${generatedPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Credentials Copied to Clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnterDashboard = () => {
    toast.success(`Welcome to Operator AI, ${fullName || 'Founder'}!`, {
      description: `Logged in to ${storeName} workspace. Initial diagnostic complete.`,
    });
    router.push('/overview');
  };

  const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'aura-skincare';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-150 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
            Operator<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {step === 3 ? 'Workspace Ready!' : 'Start Your 14-Day Free Trial'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === 3
              ? 'Your autonomous AI business operator is provisioned'
              : 'Zero credit card required • Instant automated account activation'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-xl space-y-6">
          {/* STEP 1: FORM */}
          {step === 1 && (
            <form onSubmit={handleStartProvisioning} className="space-y-4 text-xs">
              {/* Plan Picker */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Select Subscription Plan:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STARTER', 'GROWTH', 'SCALE'] as const).map((p) => {
                    const details = planDetails[p];
                    const active = selectedPlan === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setSelectedPlan(p)}
                        className={`text-left rounded-xl border p-2.5 transition flex flex-col justify-between ${
                          active
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-950/40'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase text-slate-500 block truncate">
                          {p}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1">
                          {details.price}
                        </span>
                        <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                          {details.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Store / Brand Name: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Aura Skincare Co."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Founder Full Name:
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Keval Patel"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Work Email:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="founder@store.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  WhatsApp Number (for AI daily briefs):
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 dark:bg-slate-800/60 p-3 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>14-Day Full Feature Free Access • Instant Cancellation in 1-Click.</span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.01]"
              >
                <span>Activate Subscription & Generate Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PROVISIONING */}
          {step === 2 && (
            <div className="py-8 space-y-6 text-center animate-in fade-in">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                <Zap className="h-8 w-8 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                  Provisioning Store Workspace
                </h4>
                <p className="text-xs text-slate-500 font-mono">{provisionMessage}</p>
              </div>

              <div className="space-y-1.5 max-w-xs mx-auto">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Deploying Agent</span>
                  <span>{provisionProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${provisionProgress}%` }}
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CREDENTIALS */}
          {step === 3 && (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 p-4 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <strong className="text-emerald-950 dark:text-emerald-200 font-bold block">
                    Workspace Provisioned Successfully!
                  </strong>
                  <span className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                    Here are your auto-generated credentials to access your autonomous operator.
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 font-sans">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" /> Secure Login Credentials
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Plan: {planDetails[selectedPlan].name}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans text-[11px]">Workspace URL:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{storeSlug}.operatorai.app</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans text-[11px]">Login Email / ID:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {workEmail || `founder@${storeSlug}.com`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans text-[11px]">Temporary Password:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {generatedPassword}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyCredentials}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Credentials Copied!' : 'Copy Login Credentials'}</span>
                </button>
              </div>

              <button
                onClick={handleEnterDashboard}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.01]"
              >
                <span>Launch Dashboard & Connect Shopify</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-2">
        <span>© 2026 Operator AI Inc. • 256-Bit SSL Encrypted Workspace</span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-white font-mono text-xs">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
