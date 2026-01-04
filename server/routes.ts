import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { insertReportSchema, insertSourcingRequestSchema, insertSupplierShortlistSchema, creditTransactions } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { generateSmartFinderReport, type ReportFormData } from "./services/reportGenerator";
import { stripeService } from "./stripeService";
import { getStripePublishableKey, getUncachableStripeClient } from "./stripeClient";

// Helper to get user ID from session
function getUserId(req: Request): string | null {
  return (req.session as any)?.userId || null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // User info endpoint
  app.get("/api/user", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json({ id: userId, claims: (req.user as any)?.claims });
  });
  
  // ===== User Profile & Credits =====
  
  app.get("/api/profile", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      let profile = await storage.getUserProfile(userId);
      
      // Create profile if doesn't exist - new users get 2 free trial credits
      if (!profile) {
        profile = await storage.createUserProfile({
          userId,
          role: "buyer",
          plan: "free",
        });
        // Record the free trial credits in the ledger
        await db.insert(creditTransactions).values({
          userId,
          amount: 2,
          type: "free_trial",
          creditSource: "topup",
          description: "Free trial credits",
        });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });
  
  app.patch("/api/profile", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { region, currency } = req.body;
      const profile = await storage.updateUserProfile(userId, {
        region,
        currency,
      });
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  app.get("/api/credits/transactions", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const transactions = await storage.getCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  
  // ===== Reports (Smart Finder) =====
  
  app.post("/api/reports", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const validatedData = insertReportSchema.parse(req.body);
      
      // Check credits (monthly + topup)
      const profile = await storage.getUserProfile(userId);
      const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      if (!profile || totalCredits < 1) {
        return res.status(402).json({ error: "Insufficient credits" });
      }
      
      // Deduct credits
      const spent = await storage.spendCredits(userId, 1, "Smart Finder Report");
      if (!spent) {
        return res.status(402).json({ error: "Failed to deduct credits" });
      }
      
      // Create initial report
      const report = await storage.createReport({
        ...validatedData,
        userId,
        status: "generating",
      });
      
      // Generate AI report in background (don't await to return quickly)
      generateSmartFinderReport(validatedData.formData as ReportFormData)
        .then(async (reportData) => {
          await storage.updateReport(report.id, {
            reportData,
            status: "completed",
          });
        })
        .catch(async (error) => {
          console.error("Report generation failed:", error);
          await storage.updateReport(report.id, {
            status: "failed",
          });
        });
      
      res.status(201).json(report);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromError(error).toString() });
      }
      console.error("Error creating report:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });
  
  app.get("/api/reports", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const reports = await storage.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });
  
  app.get("/api/reports/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const report = await storage.getReport(parseInt(req.params.id));
      if (!report || report.userId !== userId) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });
  
  // ===== Supplier Shortlists =====
  
  app.get("/api/shortlists", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const shortlists = category
        ? await storage.getSupplierShortlistsByCategory(category)
        : await storage.getAllSupplierShortlists();
      res.json(shortlists);
    } catch (error) {
      console.error("Error fetching shortlists:", error);
      res.status(500).json({ error: "Failed to fetch shortlists" });
    }
  });
  
  app.get("/api/shortlists/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (profile?.plan !== "pro") {
        return res.status(403).json({ error: "Pro subscription required" });
      }
      
      const shortlist = await storage.getSupplierShortlist(parseInt(req.params.id));
      if (!shortlist) {
        return res.status(404).json({ error: "Shortlist not found" });
      }
      res.json(shortlist);
    } catch (error) {
      console.error("Error fetching shortlist:", error);
      res.status(500).json({ error: "Failed to fetch shortlist" });
    }
  });
  
  // Admin routes for shortlists
  app.post("/api/admin/shortlists", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (profile?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const validatedData = insertSupplierShortlistSchema.parse(req.body);
      const shortlist = await storage.createSupplierShortlist(validatedData);
      res.status(201).json(shortlist);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromError(error).toString() });
      }
      console.error("Error creating shortlist:", error);
      res.status(500).json({ error: "Failed to create shortlist" });
    }
  });
  
  app.patch("/api/admin/shortlists/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (profile?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const shortlist = await storage.updateSupplierShortlist(parseInt(req.params.id), req.body);
      res.json(shortlist);
    } catch (error) {
      console.error("Error updating shortlist:", error);
      res.status(500).json({ error: "Failed to update shortlist" });
    }
  });
  
  app.delete("/api/admin/shortlists/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (profile?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      await storage.deleteSupplierShortlist(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shortlist:", error);
      res.status(500).json({ error: "Failed to delete shortlist" });
    }
  });
  
  // ===== Sourcing Requests =====
  
  app.post("/api/sourcing-requests", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Check credits
      const profile = await storage.getUserProfile(userId);
      if (!profile || profile.credits < 10) {
        return res.status(402).json({ error: "Insufficient credits (10 required)" });
      }
      
      // Deduct credits
      const spent = await storage.spendCredits(userId, 10, "Premium Sourcing Request");
      if (!spent) {
        return res.status(402).json({ error: "Failed to deduct credits" });
      }
      
      const validatedData = insertSourcingRequestSchema.parse(req.body);
      const request = await storage.createSourcingRequest({
        ...validatedData,
        userId,
      });
      
      res.status(201).json(request);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromError(error).toString() });
      }
      console.error("Error creating sourcing request:", error);
      res.status(500).json({ error: "Failed to create sourcing request" });
    }
  });
  
  app.get("/api/sourcing-requests", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const requests = await storage.getUserSourcingRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching sourcing requests:", error);
      res.status(500).json({ error: "Failed to fetch sourcing requests" });
    }
  });
  
  // Admin routes for sourcing requests
  app.get("/api/admin/sourcing-requests", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (profile?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const requests = await storage.getAllSourcingRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching sourcing requests:", error);
      res.status(500).json({ error: "Failed to fetch sourcing requests" });
    }
  });
  
  app.patch("/api/admin/sourcing-requests/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (profile?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const request = await storage.updateSourcingRequest(parseInt(req.params.id), req.body);
      res.json(request);
    } catch (error) {
      console.error("Error updating sourcing request:", error);
      res.status(500).json({ error: "Failed to update sourcing request" });
    }
  });

  // ===== Stripe Billing Routes =====
  
  // Get Stripe publishable key for frontend
  app.get("/api/stripe/config", async (_req: Request, res: Response) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  // Get available products/prices
  app.get("/api/stripe/products", async (_req: Request, res: Response) => {
    try {
      const rows = await storage.getProductsWithPrices();
      
      // Group prices by product
      const productsMap = new Map();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata,
          });
        }
      }
      
      res.json({ products: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Create checkout session for subscription
  app.post("/api/stripe/create-subscription-checkout", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { priceId } = req.body;
      if (!priceId) {
        return res.status(400).json({ error: "Price ID required" });
      }
      
      let profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      // Get or create Stripe customer
      let customerId = profile.stripeCustomerId;
      if (!customerId) {
        const user = (req as any).user;
        const customer = await stripeService.createCustomer(
          user?.claims?.email || `user-${userId}@smartseek.app`,
          userId
        );
        await storage.updateUserProfile(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createSubscriptionCheckout(
        customerId,
        priceId,
        `${baseUrl}/billing?success=subscription`,
        `${baseUrl}/billing?canceled=true`
      );
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout:", error);
      res.status(500).json({ error: "Failed to create checkout" });
    }
  });

  // Create checkout session for credit purchase
  app.post("/api/stripe/create-credit-checkout", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { priceId, quantity = 1 } = req.body;
      if (!priceId) {
        return res.status(400).json({ error: "Price ID required" });
      }
      
      let profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      // Get or create Stripe customer
      let customerId = profile.stripeCustomerId;
      if (!customerId) {
        const user = (req as any).user;
        const customer = await stripeService.createCustomer(
          user?.claims?.email || `user-${userId}@smartseek.app`,
          userId
        );
        await storage.updateUserProfile(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCreditPurchaseCheckout(
        customerId,
        priceId,
        quantity,
        `${baseUrl}/billing?success=credits&quantity=${quantity}`,
        `${baseUrl}/billing?canceled=true`
      );
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating credit checkout:", error);
      res.status(500).json({ error: "Failed to create checkout" });
    }
  });

  // Create customer portal session
  app.post("/api/stripe/create-portal-session", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (!profile?.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found" });
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCustomerPortalSession(
        profile.stripeCustomerId,
        `${baseUrl}/billing`
      );
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  // Create payment intent for embedded credit purchase
  app.post("/api/stripe/create-payment-intent", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { quantity = 1 } = req.body;
      const amount = quantity * 1000; // $10 per credit in cents
      
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      // Get or create Stripe customer
      let customerId = profile.stripeCustomerId;
      if (!customerId) {
        const user = (req as any).user;
        const customer = await stripeService.createCustomer(
          user?.claims?.email || `user-${userId}@smartseek.app`,
          userId
        );
        await storage.updateUserProfile(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }
      
      const paymentIntent = await stripeService.createPaymentIntent(customerId, amount, {
        type: 'credit_purchase',
        credits: quantity.toString(),
        userId,
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Create subscription with embedded payment
  app.post("/api/stripe/create-embedded-subscription", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { priceId } = req.body;
      if (!priceId) {
        return res.status(400).json({ error: "Price ID required" });
      }
      
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      // Get or create Stripe customer
      let customerId = profile.stripeCustomerId;
      if (!customerId) {
        const user = (req as any).user;
        const customer = await stripeService.createCustomer(
          user?.claims?.email || `user-${userId}@smartseek.app`,
          userId
        );
        await storage.updateUserProfile(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }
      
      const result = await stripeService.createSubscriptionWithPayment(customerId, priceId);
      
      res.json({ 
        clientSecret: result.clientSecret,
        subscriptionId: result.subscriptionId 
      });
    } catch (error) {
      console.error("Error creating embedded subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Confirm payment success (for embedded checkout)
  app.post("/api/stripe/confirm-payment", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { paymentIntentId, quantity } = req.body;
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID required" });
      }
      
      const stripe = await getUncachableStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const credits = parseInt(paymentIntent.metadata?.credits || quantity?.toString() || '1');
        await storage.addTopupCredits(userId, credits, `Purchased ${credits} credit(s)`);
        res.json({ success: true, credits });
      } else {
        res.status(400).json({ error: "Payment not completed", status: paymentIntent.status });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Handle subscription status updates from webhooks
  app.post("/api/stripe/sync-subscription", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (!profile?.stripeSubscriptionId) {
        return res.json({ subscription: null });
      }
      
      const subscription = await storage.getSubscriptionForUser(profile.stripeSubscriptionId);
      
      if (subscription) {
        const status = subscription.status as string;
        const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null;
        
        await storage.updateUserProfile(userId, {
          subscriptionStatus: status as any,
          currentPeriodEnd,
          plan: status === 'active' ? 'monthly' : 'free',
        });
        
        // If subscription is active and it's a new billing period, refresh monthly credits
        if (status === 'active') {
          const now = new Date();
          if (profile.monthlyCredits === 0 || !profile.currentPeriodEnd || profile.currentPeriodEnd < now) {
            await storage.refreshMonthlyCredits(userId, 10);
          }
        }
      }
      
      res.json({ subscription });
    } catch (error) {
      console.error("Error syncing subscription:", error);
      res.status(500).json({ error: "Failed to sync subscription" });
    }
  });

  return httpServer;
}
