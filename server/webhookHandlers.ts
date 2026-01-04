import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';
import { db } from './db';
import { sql } from 'drizzle-orm';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    // Let stripe-replit-sync process and store the webhook data
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    // Also handle business logic for credit fulfillment
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured - credit fulfillment disabled');
      return;
    }

    try {
      const stripe = await getUncachableStripeClient();
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      await WebhookHandlers.handleEvent(event);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Webhook signature verification failed');
    }
  }

  static async handleEvent(event: any): Promise<void> {
    console.log(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await WebhookHandlers.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await WebhookHandlers.handleSubscriptionUpdate(event.data.object);
        break;
      case 'invoice.paid':
        await WebhookHandlers.handleInvoicePaid(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  static async handleCheckoutCompleted(session: any): Promise<void> {
    const customerId = session.customer;
    if (!customerId) return;

    // Find user by Stripe customer ID
    const users = await db.execute(
      sql`SELECT user_id FROM user_profiles WHERE stripe_customer_id = ${customerId}`
    );
    const userId = (users.rows[0] as any)?.user_id;
    if (!userId) {
      console.log(`No user found for customer ${customerId}`);
      return;
    }

    // Handle credit purchase (one-time payment)
    if (session.mode === 'payment' && session.metadata?.type === 'credit_purchase') {
      const credits = parseInt(session.metadata.credits) || 1;
      console.log(`Adding ${credits} credits to user ${userId}`);
      await storage.addTopupCredits(userId, credits, `Purchased ${credits} credit(s)`);
    }

    // Handle subscription checkout
    if (session.mode === 'subscription' && session.subscription) {
      console.log(`Processing subscription for user ${userId}`);
      await storage.updateUserProfile(userId, {
        stripeSubscriptionId: session.subscription,
        plan: 'monthly',
        subscriptionStatus: 'active',
      });
      // Give 10 monthly credits immediately
      await storage.refreshMonthlyCredits(userId, 10);
    }
  }

  static async handleSubscriptionUpdate(subscription: any): Promise<void> {
    const customerId = subscription.customer;
    if (!customerId) return;

    // Find user by Stripe customer ID
    const users = await db.execute(
      sql`SELECT user_id FROM user_profiles WHERE stripe_customer_id = ${customerId}`
    );
    const userId = (users.rows[0] as any)?.user_id;
    if (!userId) {
      console.log(`No user found for customer ${customerId}`);
      return;
    }

    const status = subscription.status;
    const currentPeriodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000) 
      : null;

    await storage.updateUserProfile(userId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: status as any,
      currentPeriodEnd,
      plan: status === 'active' ? 'monthly' : 'free',
    });

    console.log(`Updated subscription status for user ${userId}: ${status}`);
  }

  static async handleInvoicePaid(invoice: any): Promise<void> {
    // This handles subscription renewals
    if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
      const customerId = invoice.customer;
      if (!customerId) return;

      // Find user by Stripe customer ID
      const users = await db.execute(
        sql`SELECT user_id FROM user_profiles WHERE stripe_customer_id = ${customerId}`
      );
      const userId = (users.rows[0] as any)?.user_id;
      if (!userId) {
        console.log(`No user found for customer ${customerId}`);
        return;
      }

      // Refresh monthly credits (reset to 10, don't accumulate)
      console.log(`Refreshing monthly credits for user ${userId}`);
      await storage.refreshMonthlyCredits(userId, 10);
    }
  }
}
