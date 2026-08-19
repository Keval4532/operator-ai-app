import { DailyMetricSnapshot } from '../types';

export interface ShopifyCheckout {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  cartTotal: number;
  itemsCount: number;
  abandonedHoursAgo: number;
  checkoutUrl: string;
}

export interface CustomerSegmentResult {
  segmentName: string;
  customerCount: number;
  avgOrderValue: number;
  lastPurchasedDaysAgo: number;
  sampleEmails: string[];
}

export class ShopifyDriver {
  /**
   * Fetch daily sales snapshot for given date range
   */
  async fetchDailySales(orgId: string, dateRange: { start: string; end: string }): Promise<Partial<DailyMetricSnapshot>[]> {
    // In production: Connect via Shopify Admin REST / GraphQL API with orgId accessToken
    // Mock fallback returns realistic snapshot
    return [
      {
        date: dateRange.end,
        revenue: 342800,
        ordersCount: 214,
        aov: 1601.87,
        trafficVisitors: 10037,
        conversionRate: 2.13,
        abandonedCartValue: 88400,
      },
    ];
  }

  /**
   * Fetch abandoned checkouts within given hours
   */
  async fetchAbandonedCheckouts(orgId: string, hoursAgo: number = 24): Promise<ShopifyCheckout[]> {
    return [
      {
        id: 'chk_9921',
        customerName: 'Priya Sharma',
        email: 'priya.s@gmail.com',
        phone: '+919876543210',
        cartTotal: 2499,
        itemsCount: 2,
        abandonedHoursAgo: 3,
        checkoutUrl: 'https://auraskincare.in/checkout/chk_9921',
      },
      {
        id: 'chk_9922',
        customerName: 'Ananya Verma',
        email: 'ananya.v@yahoo.com',
        phone: '+919812345678',
        cartTotal: 3899,
        itemsCount: 3,
        abandonedHoursAgo: 5,
        checkoutUrl: 'https://auraskincare.in/checkout/chk_9922',
      },
      {
        id: 'chk_9923',
        customerName: 'Rohan Mehta',
        email: 'rohan.m@hotmail.com',
        phone: '+919988776655',
        cartTotal: 1850,
        itemsCount: 1,
        abandonedHoursAgo: 7,
        checkoutUrl: 'https://auraskincare.in/checkout/chk_9923',
      },
    ];
  }

  /**
   * Fetch customer segments based on criteria (e.g. Lapsed 60+ days)
   */
  async fetchCustomerSegments(orgId: string, criteria: { dormantDays?: number; minLtv?: number }): Promise<CustomerSegmentResult> {
    const dormantDays = criteria.dormantDays || 60;
    return {
      segmentName: `VIP Customers Inactive > ${dormantDays} Days`,
      customerCount: 318,
      avgOrderValue: 2450,
      lastPurchasedDaysAgo: 65,
      sampleEmails: ['kavya.n@gmail.com', 'arjun.r@gmail.com', 'siddharth.k@outlook.com'],
    };
  }

  /**
   * Create personalized discount code in Shopify Admin
   */
  async createDiscountCode(
    orgId: string,
    code: string,
    discountPercent: number,
    expiryHours: number = 48
  ): Promise<{ success: boolean; code: string; discountId: string; expiresAt: string }> {
    const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();
    
    // Simulating Shopify Price Rule & Discount Code creation API
    return {
      success: true,
      code: code.toUpperCase(),
      discountId: `disc_${Math.floor(100000 + Math.random() * 900000)}`,
      expiresAt,
    };
  }
}

export const shopifyDriver = new ShopifyDriver();
