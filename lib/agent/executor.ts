import { ActionQueueItem, Role } from '../types';
import { shopifyDriver } from '../integrations/shopify';
import { metaDriver } from '../integrations/meta';
import { messagingDriver } from '../integrations/messaging';
import { store } from '../store';

export class ActionExecutor {
  /**
   * Execute Action Queue Item via Human-in-the-Loop (HITL) approval
   */
  async executeAction(
    actionId: string,
    userRole: Role = 'OWNER',
    customPayload?: Record<string, any>
  ): Promise<{ success: boolean; action: ActionQueueItem; executionLog: Record<string, any> }> {
    // 1. Permission check
    if (userRole !== 'OWNER' && userRole !== 'ADMIN') {
      throw new Error('Unauthorized: Executive approval required to execute revenue actions.');
    }

    const action = store.getActionQueue().find((a) => a.id === actionId);
    if (!action) {
      throw new Error(`Action Queue item not found: ${actionId}`);
    }

    // Set state to EXECUTING
    store.updateActionStatus(actionId, 'EXECUTING');

    const payload = { ...action.payload, ...customPayload };
    let executionLog: Record<string, any> = {};

    try {
      // 2. Dispatch to target integration driver based on category
      switch (action.category) {
        case 'META_ADS': {
          const pauseRes = await metaDriver.pauseCampaign(
            action.organizationId,
            payload.campaignIdToPause || 'cmp_104'
          );
          const boostRes = await metaDriver.updateCampaignBudget(
            action.organizationId,
            payload.campaignIdToBoost || 'cmp_88',
            payload.newDailyBudget || 57500
          );
          executionLog = {
            target: 'META_GRAPH_API',
            pausedAdSet: payload.adSetIdToPause || 'adset_summer_B',
            pausedCampaignStatus: pauseRes.status,
            boostedCampaignId: boostRes.campaignId,
            newDailyBudget: boostRes.newBudget,
            apiResponseTimeMs: 410,
          };
          break;
        }

        case 'CART_RECOVERY': {
          const discRes = await shopifyDriver.createDiscountCode(
            action.organizationId,
            payload.discountCode || 'RECOVER10',
            payload.discountPercent || 10,
            payload.expiryHours || 24
          );
          const waRes = await messagingDriver.sendAbandonedCartRecovery(
            action.organizationId,
            'chk_9921',
            discRes.code,
            '+919876543210'
          );
          executionLog = {
            target: 'SHOPIFY_ADMIN_API & WHATSAPP_CLOUD_API',
            discountCodeCreated: discRes.code,
            expiresAt: discRes.expiresAt,
            whatsappDeliveryChannel: waRes.channel,
            targetedCount: payload.targetCount || 42,
            messageId: waRes.messageId,
            apiResponseTimeMs: 580,
          };
          break;
        }

        case 'WINBACK_EMAIL': {
          const discRes = await shopifyDriver.createDiscountCode(
            action.organizationId,
            payload.discountCode || 'WELCOMEBACK15',
            payload.discountPercent || 15,
            payload.expiryHours || 72
          );
          const blastRes = await messagingDriver.sendCustomerWinbackBlast(
            action.organizationId,
            Array(payload.targetCount || 318).fill('cust_id'),
            {
              subject: 'We miss you! Special 15% VIP Voucher Inside',
              discountCode: discRes.code,
              channel: 'WHATSAPP',
            }
          );
          executionLog = {
            target: 'KLAVIYO_API & WHATSAPP_CLOUD_API',
            vipSegment: payload.customerSegment || 'VIP_DORMANT_60D',
            discountCodeCreated: discRes.code,
            recipientsQueued: blastRes.recipientCount,
            deliveryStatus: blastRes.estimatedDelivery,
            apiResponseTimeMs: 630,
          };
          break;
        }

        default: {
          executionLog = {
            target: 'GENERIC_ACTION_RUNNER',
            executedAt: new Date().toISOString(),
          };
        }
      }

      // 3. Mark COMPLETED, log AuditLog & BusinessMemory in store
      store.updateActionStatus(actionId, 'COMPLETED', executionLog);

      return {
        success: true,
        action: store.getActionQueue().find((a) => a.id === actionId)!,
        executionLog,
      };
    } catch (err: any) {
      store.updateActionStatus(actionId, 'FAILED', { error: err.message });
      throw err;
    }
  }
}

export const actionExecutor = new ActionExecutor();
