'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Play,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage, ActionQueueItem } from '@/lib/types';
import { toast } from 'sonner';

interface OperatorTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  onExecuteAction: (actionId: string) => Promise<void>;
}

export const OperatorTerminal: React.FC<OperatorTerminalProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSendMessage,
  onExecuteAction,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery;
    setInputQuery('');
    setIsTyping(true);

    try {
      await onSendMessage(query);
    } catch (err) {
      console.error(err);
      toast.error('Could not get response from AI Assistant');
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    'Why did sales drop yesterday?',
    'What actions should I take today?',
    'How are my Meta ads performing?',
    'How many customers abandoned carts?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                AI Store Assistant
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Ask anything about your store's sales, ads, or products
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
          aria-label="Close Assistant"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {/* Action Cards inside chat response */}
              {msg.actionCards && msg.actionCards.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Recommended Actions:
                  </span>
                  {msg.actionCards.map((act) => (
                    <div
                      key={act.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-xs space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          +₹{act.impactEstimateMax.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {act.description}
                      </p>
                      <button
                        onClick={async () => {
                          await onExecuteAction(act.id);
                          toast.success(`Action Applied: ${act.title}`);
                        }}
                        className="w-full mt-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-1 text-center font-bold text-white text-[11px] shadow-xs flex items-center justify-center gap-1"
                      >
                        <Play className="h-3 w-3" /> Approve & Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-1 text-[9px] text-slate-400 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 font-sans text-xs">
            <Bot className="h-4 w-4 text-emerald-500 animate-spin" />
            <span>AI Assistant is analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast Prompts Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-2.5 overflow-x-auto flex gap-1.5">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputQuery(p);
            }}
            className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition whitespace-nowrap shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question (e.g. 'Why did revenue drop yesterday?')..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition disabled:opacity-40"
          aria-label="Send Message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
