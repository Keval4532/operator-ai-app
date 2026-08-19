import {
  Organization,
  Integration,
  DailyMetricSnapshot,
  AiDiagnosis,
  ActionQueueItem,
  BusinessMemory,
  AuditLog,
  ChatMessage,
  ProfitBreakdown,
  ProductMarginItem,
  InventorySkuItem,
  PurchaseOrderDraft,
  MetaCreativeAuditorItem,
  CreativeFatigueSummary,
  FounderGuardrailRule,
  AbandonedCheckoutItem,
  RecoveryTemplate,
  MessageDeliveryLog,
  AutopilotRule,
  AutopilotMode,
  ImpactLedgerSummary,
  ImpactLedgerItem,
  SimulatorTarget,
  CreativeStudioScript,
  VipSegmentItem,
} from './types';

import {
  INITIAL_ORGANIZATION,
  INITIAL_INTEGRATIONS,
  INITIAL_METRICS_HISTORY,
  INITIAL_DIAGNOSIS,
  INITIAL_ACTION_QUEUE,
  INITIAL_BUSINESS_MEMORIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CHAT_HISTORY,
  INITIAL_PROFIT_BREAKDOWN,
  INITIAL_PRODUCT_MARGINS,
  INITIAL_INVENTORY_SKUS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_META_CREATIVES,
  INITIAL_CREATIVE_SUMMARY,
  INITIAL_GUARDRAIL_RULES,
  INITIAL_ABANDONED_CHECKOUTS,
  INITIAL_RECOVERY_TEMPLATES,
  INITIAL_AUTOPILOT_RULES,
  INITIAL_IMPACT_LEDGER,
  INITIAL_SIMULATOR_TARGET,
  INITIAL_CREATIVE_SCRIPTS,
  INITIAL_VIP_SEGMENTS,
} from './demo-data';

class Store {
  private organization: Organization = { ...INITIAL_ORGANIZATION };
  private integrations: Integration[] = [...INITIAL_INTEGRATIONS];
  private metricsHistory: DailyMetricSnapshot[] = [...INITIAL_METRICS_HISTORY];
  private diagnosis: AiDiagnosis = { ...INITIAL_DIAGNOSIS };
  private actionQueue: ActionQueueItem[] = [...INITIAL_ACTION_QUEUE];
  private businessMemories: BusinessMemory[] = [...INITIAL_BUSINESS_MEMORIES];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private chatHistory: ChatMessage[] = [...INITIAL_CHAT_HISTORY];
  private isDemoMode: boolean = true;

  // v4.0 State Layers
  private profitBreakdown: ProfitBreakdown = { ...INITIAL_PROFIT_BREAKDOWN };
  private productMargins: ProductMarginItem[] = [...INITIAL_PRODUCT_MARGINS];
  private inventorySkus: InventorySkuItem[] = [...INITIAL_INVENTORY_SKUS];
  private purchaseOrders: PurchaseOrderDraft[] = [...INITIAL_PURCHASE_ORDERS];
  private creatives: MetaCreativeAuditorItem[] = [...INITIAL_META_CREATIVES];
  private creativeSummary: CreativeFatigueSummary = { ...INITIAL_CREATIVE_SUMMARY };
  private guardrailRules: FounderGuardrailRule[] = [...INITIAL_GUARDRAIL_RULES];
  private abandonedCheckouts: AbandonedCheckoutItem[] = [...INITIAL_ABANDONED_CHECKOUTS];
  private recoveryTemplates: RecoveryTemplate[] = [...INITIAL_RECOVERY_TEMPLATES];
  private deliveryLogs: MessageDeliveryLog[] = [];
  private autopilotRules: AutopilotRule[] = [...INITIAL_AUTOPILOT_RULES];
  private impactLedger: ImpactLedgerSummary = { ...INITIAL_IMPACT_LEDGER };
  private simulatorTarget: SimulatorTarget = { ...INITIAL_SIMULATOR_TARGET };
  private creativeScripts: Record<string, CreativeStudioScript> = { ...INITIAL_CREATIVE_SCRIPTS };
  private vipSegments: VipSegmentItem[] = [...INITIAL_VIP_SEGMENTS];

  // Getters
  public getOrganization() { return this.organization; }
  public getIntegrations() { return this.integrations; }
  public getMetricsHistory() { return this.metricsHistory; }
  public getCurrentDiagnosis() { return this.diagnosis; }
  public getActionQueue() { return this.actionQueue; }
  public getBusinessMemories() { return this.businessMemories; }
  public getAuditLogs() { return this.auditLogs; }
  public getChatHistory() { return this.chatHistory; }
  public getIsDemoMode() { return this.isDemoMode; }

  public getProfitBreakdown() { return this.profitBreakdown; }
  public getProductMargins() { return this.productMargins; }
  public getInventorySkus() { return this.inventorySkus; }
  public getPurchaseOrders() { return this.purchaseOrders; }
  public getCreatives() { return this.creatives; }
  public getCreativeSummary() { return this.creativeSummary; }
  public getGuardrailRules() { return this.guardrailRules; }
  public getAbandonedCheckouts() { return this.abandonedCheckouts; }
  public getRecoveryTemplates() { return this.recoveryTemplates; }
  public getDeliveryLogs() { return this.deliveryLogs; }

  // v4.0 Getters
  public getAutopilotRules() { return this.autopilotRules; }
  public getImpactLedger() { return this.impactLedger; }
  public getSimulatorTarget() { return this.simulatorTarget; }
  public getCreativeScript(creativeId: string) {
    return this.creativeScripts[creativeId] || this.creativeScripts['cr_fatigued_01'];
  }
  public getVipSegments() { return this.vipSegments; }

  // Setters & Mutations
  public toggleDemoMode() {
    this.isDemoMode = !this.isDemoMode;
    return this.isDemoMode;
  }

  public updateIntegrationStatus(id: string, status: Integration['status']) {
    this.integrations = this.integrations.map((item) =>
      item.id === id ? { ...item, status, lastSyncedAt: new Date().toISOString() } : item
    );
    return this.integrations;
  }

  public syncAllIntegrations() {
    const now = new Date().toISOString();
    this.integrations = this.integrations.map((item) => ({
      ...item,
      status: 'CONNECTED',
      lastSyncedAt: now,
    }));
    return this.integrations;
  }

  public addAuditLog(actionName: string, actor: 'USER' | 'SYSTEM_AGENT', metadata: Record<string, any> = {}) {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      organizationId: this.organization.id,
      actionId: metadata.actionId || 'generic_action',
      actionName,
      actor,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    return newLog;
  }

  public updateActionStatus(actionId: string, status: ActionQueueItem['status'], executionLog?: Record<string, any>) {
    this.actionQueue = this.actionQueue.map((item) => {
      if (item.id === actionId) {
        return {
          ...item,
          status,
          executedAt: status === 'COMPLETED' ? new Date().toISOString() : item.executedAt,
          executionLog: executionLog || item.executionLog,
        };
      }
      return item;
    });

    const action = this.actionQueue.find((a) => a.id === actionId);
    if (action && status === 'COMPLETED') {
      this.addAuditLog(action.title, 'USER', {
        actionId,
        category: action.category,
        executionLog,
      });

      // Add to verified impact ledger
      this.addImpactLedgerItem({
        title: action.title,
        category: action.category === 'META_ADS' ? 'AD_SPEND_SAVED' : 'REVENUE_RECOVERED',
        amount: action.impactEstimateMax,
        actionTaken: action.description,
      });
    }

    return this.actionQueue;
  }

  public addChatMessage(
    messageOrSender: Partial<ChatMessage> | ('user' | 'assistant' | 'system'),
    text?: string,
    actionCards?: ActionQueueItem[]
  ): ChatMessage {
    let newMessage: ChatMessage;
    if (typeof messageOrSender === 'object') {
      newMessage = {
        id: messageOrSender.id || `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        sender: messageOrSender.sender || 'assistant',
        text: messageOrSender.text || '',
        actionCards: messageOrSender.actionCards,
        timestamp: messageOrSender.timestamp || new Date().toISOString(),
      };
    } else {
      newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        sender: messageOrSender,
        text: text || '',
        actionCards,
        timestamp: new Date().toISOString(),
      };
    }
    this.chatHistory = [...this.chatHistory, newMessage];
    return newMessage;
  }

  // -------------------------------------------------------------
  // v4.0 NEXT-LEVEL ENGINE MUTATIONS
  // -------------------------------------------------------------

  // Feature 1: Autopilot Switchboard
  public updateAutopilotRuleMode(id: string, mode: AutopilotMode) {
    this.autopilotRules = this.autopilotRules.map((r) =>
      r.id === id ? { ...r, mode } : r
    );
    const rule = this.autopilotRules.find((r) => r.id === id);
    if (rule) {
      this.addAuditLog(`Updated Autopilot Mode for ${rule.title} to ${mode}`, 'USER', {
        ruleId: id,
        mode,
      });
    }
    return this.autopilotRules;
  }

  // Feature 2: What-If Simulator Target
  public saveSimulatorTarget(target: SimulatorTarget) {
    this.simulatorTarget = {
      ...target,
      savedAt: new Date().toISOString(),
    };
    this.addAuditLog(`Saved AI Target Strategy: ₹${(target.dailyAdSpend / 1000).toFixed(0)}k/day @ ${target.targetRoas}x ROAS`, 'USER', {
      target,
    });
    return this.simulatorTarget;
  }

  // Feature 4: Verified ROI Impact Ledger
  public addImpactLedgerItem(item: Omit<ImpactLedgerItem, 'id' | 'executedAt' | 'status'>) {
    const newItem: ImpactLedgerItem = {
      ...item,
      id: `imp_${Date.now()}`,
      executedAt: new Date().toISOString(),
      status: 'VERIFIED',
    };

    const newItems = [newItem, ...this.impactLedger.items];
    const totalNetValue = newItems.reduce((acc, curr) => acc + curr.amount, 0);
    const wastedAdSpend = newItems
      .filter((i) => i.category === 'AD_SPEND_SAVED')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const recovered = newItems
      .filter((i) => i.category === 'REVENUE_RECOVERED')
      .reduce((acc, curr) => acc + curr.amount, 0);

    this.impactLedger = {
      totalNetValueCreated: totalNetValue,
      wastedAdSpendPrevented: wastedAdSpend,
      revenueRecovered: recovered,
      items: newItems,
    };
    return this.impactLedger;
  }

  // Feature 5: One-Click WhatsApp VIP Campaign
  public launchVipBlast(segmentId: string, discountPercent: number) {
    const seg = this.vipSegments.find((s) => s.id === segmentId);
    const count = seg?.customerCount || 318;
    const estRevenue = (seg?.potentialRevenue || 78500) * (discountPercent / 15);

    this.addAuditLog(`Launched VIP Retention Blast to ${count} customers (${discountPercent}% off)`, 'USER', {
      segmentId,
      discountPercent,
      customerCount: count,
    });

    this.addImpactLedgerItem({
      title: `VIP Campaign: ${seg?.name || 'Lapsed VIPs'}`,
      category: 'REVENUE_RECOVERED',
      amount: Math.round(estRevenue),
      actionTaken: `Delivered 1-to-1 WhatsApp VIP replenishment discount (${discountPercent}%) to ${count} buyers.`,
    });

    return { sentCount: count, estimatedRevenue: Math.round(estRevenue) };
  }

  // Inventory Purchase Order Creation
  public createPurchaseOrder(skuId: string, units: number): PurchaseOrderDraft {
    const sku = this.inventorySkus.find((s) => s.id === skuId);
    const newPo: PurchaseOrderDraft = {
      id: `po_${Date.now()}`,
      skuId,
      skuTitle: sku ? sku.title : 'Inventory SKU',
      supplierName: sku ? sku.supplierName : 'Primary Supplier',
      unitsOrdered: units,
      unitCost: sku ? sku.unitCost : 280,
      totalAmount: units * (sku ? sku.unitCost : 280),
      leadTimeDays: sku ? sku.leadTimeDays : 14,
      status: 'SENT_TO_SUPPLIER',
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (sku ? sku.leadTimeDays : 14))
        .toISOString()
        .split('T')[0],
    };

    this.purchaseOrders = [newPo, ...this.purchaseOrders];
    this.addAuditLog(`Dispatched Supplier Restock Order (${newPo.poNumber}) for ${units} units of ${sku?.title}`, 'USER', {
      po: newPo,
    });
    return newPo;
  }

  // Throttle Ad Spend on Low Inventory SKU
  public throttleAdSpendForSku(skuId: string, throttlePercentage: number = 25) {
    const sku = this.inventorySkus.find((s) => s.id === skuId);
    if (!sku) return false;

    this.addAuditLog(
      `Throttled Meta Ad Spend by ${throttlePercentage}% for ${sku.title} to stretch stock until delivery`,
      'SYSTEM_AGENT',
      { skuId, throttlePercentage }
    );
    return true;
  }

  // Meta Retest Winning Creative
  public retestWinningCreative(creativeId: string) {
    const cr = this.creatives.find((c) => c.id === creativeId);
    if (!cr) return null;

    const newCr: MetaCreativeAuditorItem = {
      ...cr,
      id: `cr_retest_${Date.now()}`,
      name: `${cr.name} [Fresh Test Adset]`,
      campaignName: 'Scale_Broad_Winning_Q3',
      adSetName: `Broad_Lookalike_1pct_${Date.now().toString().slice(-4)}`,
      spend7d: 5000,
      roas: 4.2,
      hookRate: cr.hookRate,
      holdRate: cr.holdRate,
      firstTimeImpressionRatio: 92.5,
      frequency: 1.05,
      cpc: 12.8,
      fatigueStatus: 'SCALING_WINNER',
      aiDiagnosis: 'Newly launched test adset with fresh broad lookalike audience.',
    };

    this.creatives = [newCr, ...this.creatives];
    this.addAuditLog(`Duplicated winning creative "${cr.name}" to fresh broad test audience`, 'USER', {
      originalCreativeId: creativeId,
      newCreativeId: newCr.id,
    });
    return newCr;
  }

  // Pause Fatigued Creative
  public pauseFatiguedCreative(creativeId: string) {
    const cr = this.creatives.find((c) => c.id === creativeId);
    if (!cr) return false;

    this.creatives = this.creatives.map((c) =>
      c.id === creativeId ? { ...c, fatigueStatus: 'FATIGUED' as const } : c
    );

    this.addAuditLog(`Paused fatigued creative "${cr.name}" (Frequency: ${cr.frequency}x)`, 'USER', {
      creativeId,
    });
    return true;
  }

  // Guardrail Rules Management
  public addGuardrailRule(rule: Omit<FounderGuardrailRule, 'id' | 'createdAt'>) {
    const newRule: FounderGuardrailRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.guardrailRules = [newRule, ...this.guardrailRules];
    this.addAuditLog(`Created new store safety rule: "${newRule.title}"`, 'USER', { rule: newRule });
    return newRule;
  }

  public toggleGuardrailRule(id: string) {
    this.guardrailRules = this.guardrailRules.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    const rule = this.guardrailRules.find((r) => r.id === id);
    if (rule) {
      this.addAuditLog(`${rule.isActive ? 'Enabled' : 'Disabled'} safety rule "${rule.title}"`, 'USER', {
        ruleId: id,
        isActive: rule.isActive,
      });
    }
    return rule;
  }

  public deleteGuardrailRule(id: string) {
    const rule = this.guardrailRules.find((r) => r.id === id);
    this.guardrailRules = this.guardrailRules.filter((r) => r.id !== id);
    if (rule) {
      this.addAuditLog(`Deleted safety rule "${rule.title}"`, 'USER', { ruleId: id });
    }
    return rule;
  }

  // Abandoned Checkout Single Test Send
  public sendSingleRecoveryMessage(checkoutId: string, testPhone: string) {
    const chk = this.abandonedCheckouts.find((c) => c.id === checkoutId);
    if (!chk) return null;

    const log: MessageDeliveryLog = {
      id: `dlog_${Date.now()}`,
      checkoutId,
      recipientPhone: testPhone,
      channel: 'WHATSAPP',
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
      renderedMessage: `✨ Aura Skincare Co. Order Update: Hey ${chk.customerName.split(' ')[0]}! We saved your bag. Use code RECOVER10 for 10% off!`,
    };

    this.deliveryLogs = [log, ...this.deliveryLogs];
    this.abandonedCheckouts = this.abandonedCheckouts.map((c) =>
      c.id === checkoutId ? { ...c, status: 'DELIVERED' as const } : c
    );

    this.addAuditLog(`Sent test recovery WhatsApp message to ${testPhone}`, 'USER', {
      checkoutId,
      testPhone,
    });
    return log;
  }

  // Abandoned Checkout 1-Click Blast
  public triggerRecoveryBlast(discountPercent: number = 10, expiryHours: number = 24) {
    const pending = this.abandonedCheckouts.filter((c) => c.status === 'PENDING');
    const totalRecoverable = pending.reduce((acc, curr) => acc + curr.cartTotal, 0);

    this.abandonedCheckouts = this.abandonedCheckouts.map((c) =>
      c.status === 'PENDING'
        ? {
            ...c,
            status: 'DELIVERED' as const,
            assignedDiscountCode: `RECOVER${discountPercent}`,
          }
        : c
    );

    this.addAuditLog(
      `Dispatched 1-Click WhatsApp Recovery Blast to ${pending.length} abandoned buyers (Total Value: ₹${totalRecoverable.toLocaleString('en-IN')})`,
      'USER',
      { count: pending.length, totalRecoverable, discountPercent, expiryHours }
    );

    return { sentCount: pending.length, totalValueRecoverable: totalRecoverable };
  }
}

export const store = new Store();
