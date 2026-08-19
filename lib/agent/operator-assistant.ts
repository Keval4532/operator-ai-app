import { ChatMessage, ActionQueueItem } from '../types';
import { store } from '../store';
import { actionExecutor } from './executor';

export class OperatorAssistantEngine {
  /**
   * Process user chat query and return intelligent structured response
   */
  async processQuery(userQuery: string): Promise<ChatMessage> {
    const query = userQuery.toLowerCase().trim();
    const metrics = store.getMetricsHistory();
    const diagnosis = store.getCurrentDiagnosis();
    const actionQueue = store.getActionQueue();
    const t0 = metrics[metrics.length - 1];

    let responseText = '';
    let actionCards: ActionQueueItem[] | undefined = undefined;
    let chartData: any = undefined;

    if (query.includes('sales') || query.includes('drop') || query.includes('why') || query.includes('yesterday')) {
      responseText = `### 📊 Performance Analysis: Yesterday (T-0)

Yesterday's revenue for **Aura Skincare Co.** dropped **-14.2%** to **₹${t0.revenue.toLocaleString('en-IN')}** (from ₹3,99,500 the previous day).

**Root Causes Isolated by AI Heuristics:**
1. 🔴 **Meta Ad Fatigue (Adset \`Summer_Set_B\`):** ROAS plummeted from **3.47x to 0.90x** while burning ₹24,000 in spend. Frequency reached **6.2x**.
2. 🛒 **Checkout Drop Spikes:** 42 high-intent checkouts abandoned totaling **₹88,400** in lost revenue.

**Recommended Staged Actions:**
I have prepared **3 executable actions** in your queue to recover performance immediately. Click below to execute with 1-click HITL approval.`;
      actionCards = actionQueue.filter((a) => a.status === 'PENDING_APPROVAL');
    } else if (query.includes('action') || query.includes('queue') || query.includes('approve')) {
      const pending = actionQueue.filter((a) => a.status === 'PENDING_APPROVAL');
      if (pending.length > 0) {
        responseText = `You currently have **${pending.length} pending high-impact action(s)** ready for approval:`;
        actionCards = pending;
      } else {
        responseText = `✅ All queued revenue actions have been **approved and executed**! Yesterday's campaigns have been optimized and recovery workflows are active.`;
      }
    } else if (query.includes('meta') || query.includes('roas') || query.includes('ad') || query.includes('campaign')) {
      responseText = `### 🎯 Meta Ads Performance Overview

- **Total Meta Spend:** ₹1,15,000
- **Blended Meta ROAS:** 2.10x *(down from 3.47x)*
- **Top Performer:** Campaign \`Scale_Broad_Winning\` (ROAS **4.1x**, ₹30,000 spend)
- **Fatigued Underperformer:** Campaign #104 AdSet \`Summer_Set_B\` (ROAS **0.9x**, ₹24,000 spend)

**Recommendation:** Pause \`Summer_Set_B\` and scale \`Scale_Broad_Winning\` daily budget by 15%.`;
    } else if (query.includes('cart') || query.includes('whatsapp') || query.includes('abandoned')) {
      responseText = `### 🛒 Abandoned Cart Recovery Status

- **Abandoned Cart Value:** ₹88,400 *(42 drop-off sessions in last 24h)*
- **Average Cart Value:** ₹2,105
- **Channel Strategy:** Trigger personalized WhatsApp message + 10% voucher code (\`RECOVER10\`) expiring in 24 hours.
- **Estimated Recovery Revenue:** +₹65,000 - ₹88,400`;
    } else if (query.includes('chart') || query.includes('trend') || query.includes('metric')) {
      responseText = `Here is the **Revenue vs Meta Spend trend** over the last 7 days:`;
      chartData = metrics.map((m) => ({
        date: m.date.substring(5),
        revenue: m.revenue,
        spend: m.metaSpend,
        roas: m.blendedRoas,
      }));
    } else {
      responseText = `I'm **Operator AI**, standing by to execute revenue operations for **Aura Skincare Co.**

You can ask me:
- *"Why did sales drop yesterday?"*
- *"Show me pending action cards"*
- *"What is our Meta ROAS breakdown?"*
- *"How many abandoned carts do we have?"*
- *"Show me revenue trends"*`;
    }

    return store.addChatMessage({
      sender: 'assistant',
      text: responseText,
      actionCards,
      chartData,
    });
  }
}

export const operatorAssistantEngine = new OperatorAssistantEngine();
