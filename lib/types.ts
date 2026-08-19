export type IntegrationProvider =
  | 'SHOPIFY'
  | 'META_ADS'
  | 'GOOGLE_ANALYTICS'
  | 'WHATSAPP_CLOUDFLARE'
  | 'KLAVIYO';

export interface Integration {
  id: string;
  organizationId: string;
  provider: IntegrationProvider;
  accessToken: string;
  accountId?: string;
  storeUrl?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export type Role = 'OWNER' | 'ADMIN' | 'OPERATOR';

export interface Organization {
  id: string;
  name: string;
  currency: string;
  timezone: string;
}

export interface DailyMetricSnapshot {
  id: string;
  organizationId: string;
  date: string;
  revenue: number;
  ordersCount: number;
  aov: number;
  conversionRate: number;
  trafficVisitors: number;
  metaSpend: number;
  googleSpend: number;
  blendedRoas: number;
  abandonedCartValue: number;
  abandonedCartCount: number;
}

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RootCauseItem {
  metric: string;
  impact: string;
  description: string;
  affectedItem?: string;
}

export type RootCause = RootCauseItem;

export interface AiDiagnosis {
  id: string;
  organizationId: string;
  date: string;
  urgency: UrgencyLevel;
  confidenceScore: number;
  headline: string;
  summary: string;
  rootCauses: RootCauseItem[];
  createdAt: string;
}

export type ActionCategory = 'META_ADS' | 'CART_RECOVERY' | 'WINBACK_EMAIL' | 'INVENTORY_ALERT' | 'DISCOUNT_BUNDLE';
export type ActionStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'REJECTED' | 'FAILED';

export interface ActionQueueItem {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: ActionCategory;
  impactEstimateMin: number;
  impactEstimateMax: number;
  status: ActionStatus;
  payload: Record<string, any>;
  createdAt: string;
  executedAt?: string;
  executionLog?: Record<string, any>;
}

export type MemoryCategory =
  | 'BUDGET_SCALING'
  | 'CREATIVE_FATIGUE'
  | 'CART_RECOVERY'
  | 'VIP_RETENTION'
  | 'INVENTORY_STOCKOUT'
  | 'PRICING_MARGINS';

export interface BusinessMemory {
  id: string;
  organizationId: string;
  concept: string;
  insightText: string;
  confidence: number;
  category?: MemoryCategory;
  impactMetric?: string;
  vectorEmbedding?: number[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actionId: string;
  actionName: string;
  actor: 'USER' | 'SYSTEM_AGENT';
  timestamp: string;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  actionCards?: ActionQueueItem[];
  chartData?: any;
  timestamp: string;
}

// -------------------------------------------------------------
// OPERATOR AI v4.0 TYPE DEFINITIONS
// -------------------------------------------------------------

// Autopilot Switchboard Types
export type AutopilotMode = 'OFF' | 'CO_PILOT' | 'FULL_AUTOPILOT';

export interface AutopilotRule {
  id: string;
  title: string;
  description: string;
  category: 'CART_RECOVERY' | 'AD_FATIGUE' | 'STOCKOUT_THROTTLE' | 'VIP_WINBACK';
  conditionSummary: string;
  mode: AutopilotMode;
  timesFired: number;
  lastFiredAt?: string;
  impactCreatedTotal: number;
  iconName: string;
}

// Verified ROI Impact Ledger Types
export interface ImpactLedgerItem {
  id: string;
  title: string;
  category: 'AD_SPEND_SAVED' | 'REVENUE_RECOVERED' | 'BACKORDER_PREVENTED' | 'PROFIT_EXPANDED';
  amount: number;
  actionTaken: string;
  executedAt: string;
  status: 'VERIFIED';
}

export interface ImpactLedgerSummary {
  totalNetValueCreated: number;
  wastedAdSpendPrevented: number;
  revenueRecovered: number;
  items: ImpactLedgerItem[];
}

// What-If Simulator Target
export interface SimulatorTarget {
  dailyAdSpend: number;
  targetRoas: number;
  aov: number;
  cogsPercent: number;
  projectedMonthlyRevenue: number;
  projectedMonthlyProfit: number;
  projectedNetMarginPercent: number;
  breakevenCac: number;
  stockoutWarningSkus: string[];
  savedAt?: string;
}

// AI Creative Studio Types
export interface VideoHookItem {
  id: string;
  angleType: 'PROBLEM_AGITATION' | 'SOCIAL_PROOF_REVIEW' | 'BEHIND_THE_SCENES';
  title: string;
  openingLine: string;
  explanation: string;
}

export interface ScriptBreakdown {
  visualCue0to3s: string;
  coreDemo3to15s: string;
  callToAction15to20s: string;
}

export interface CreativeStudioScript {
  id: string;
  creativeId: string;
  creativeName: string;
  hooks: VideoHookItem[];
  script: ScriptBreakdown;
  primaryAdCopy: string;
  metaHeadline: string;
  targetAudience: string;
}

// WhatsApp VIP Campaign Types
export interface VipSegmentItem {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  averageLtv: number;
  recommendedDiscount: number;
  expiryHours: number;
  potentialRevenue: number;
  defaultMessage: string;
}

// Profit & Unit Economics Types
export type MarginStatus = 'SCALE_AGGRESSIVELY' | 'MARGIN_SQUEEZE' | 'LOSS_LEADER_ALERT' | 'STEADY_PERFORMER';

export interface ProductMarginItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  sellingPrice: number;
  cogsPerUnit: number;
  cogsTotal: number;
  unitsSold: number;
  grossRevenue: number;
  allocatedAdSpend: number;
  shippingPerUnit: number;
  paymentGatewayFee: number;
  netContributionProfit: number;
  marginPercentage: number;
  roas: number;
  status: MarginStatus;
  aiRecommendation: string;
}

export interface ProfitBreakdown {
  grossRevenue: number;
  adSpendTotal: number;
  metaSpend: number;
  googleSpend: number;
  cogsTotal: number;
  shippingFulfillmentTotal: number;
  gatewayFeesTotal: number;
  returnsRefundsTotal: number;
  netOperatingProfit: number;
  netMarginPercentage: number;
  blendedRoas: number;
  totalOrders: number;
  aov: number;
  gatewayFeeRate: number;
}

// Inventory Types
export type StockoutRiskLevel = 'CRITICAL_STOCKOUT' | 'LOW_STOCK' | 'DEAD_STOCK' | 'HEALTHY';

export interface InventorySkuItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  currentStock: number;
  dailyVelocity7d: number;
  dailyVelocity30d: number;
  dosr: number;
  leadTimeDays: number;
  reorderPointUnits: number;
  unitCost: number;
  sellingPrice: number;
  supplierName: string;
  supplierEmail: string;
  riskLevel: StockoutRiskLevel;
  suggestedActionType?: 'THROTTLE_ADS' | 'AUTO_PO' | 'BUNDLE_CLEARANCE' | 'FLASH_SALE';
  suggestedActionDetails?: string;
}

export interface PurchaseOrderDraft {
  id: string;
  skuId: string;
  skuTitle: string;
  supplierName: string;
  unitsOrdered: number;
  unitCost: number;
  totalAmount: number;
  leadTimeDays: number;
  status: 'DRAFT' | 'SENT_TO_SUPPLIER' | 'CONFIRMED' | 'DELIVERED';
  poNumber: string;
  createdAt: string;
  expectedDeliveryDate: string;
}

// Meta Ads Types
export type CreativeFatigueStatus = 'SCALING_WINNER' | 'FATIGUED' | 'EARLY_FATIGUE' | 'HEALTHY';

export interface MetaCreativeAuditorItem {
  id: string;
  name: string;
  campaignName: string;
  adSetName: string;
  format: 'VIDEO_REEL' | 'CAROUSEL' | 'IMAGE_STATIC';
  thumbnailUrl: string;
  spend7d: number;
  roas: number;
  hookRate: number;
  holdRate: number;
  firstTimeImpressionRatio: number;
  frequency: number;
  cpc: number;
  ctr: number;
  fatigueStatus: CreativeFatigueStatus;
  aiDiagnosis: string;
  retestCampaignId?: string;
}

export interface CreativeFatigueSummary {
  totalActiveCreatives: number;
  fatiguedCreativesCount: number;
  scalingWinnersCount: number;
  dailyRevenueLeaked: number;
}

// Playbook & Guardrails Types
export interface FounderGuardrailRule {
  id: string;
  title: string;
  condition: string;
  category: MemoryCategory;
  actionPolicy: 'BLOCK_ACTION' | 'REQUIRE_MANUAL_PIN' | 'WARN_ONLY';
  isActive: boolean;
  createdAt: string;
}

// Abandoned Checkout Types
export type MessagingChannel = 'WHATSAPP' | 'SMS' | 'EMAIL';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface AbandonedCheckoutItem {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cartTotal: number;
  cartItems: CartItem[];
  abandonedMinutesAgo: number;
  dropoffStep: 'CART_VIEW' | 'SHIPPING_STEP' | 'PAYMENT_STEP';
  status: 'PENDING' | 'DELIVERED' | 'CLICKED' | 'RECOVERED' | 'EXPIRED';
  assignedDiscountCode?: string;
  recoveryLink?: string;
}

export interface RecoveryTemplate {
  channel: MessagingChannel;
  headerText: string;
  bodyText: string;
  buttonText: string;
}

export interface MessageDeliveryLog {
  id: string;
  checkoutId: string;
  recipientPhone: string;
  channel: MessagingChannel;
  sentAt: string;
  status: 'DELIVERED' | 'READ' | 'CLICKED' | 'CONVERTED';
  renderedMessage: string;
}
