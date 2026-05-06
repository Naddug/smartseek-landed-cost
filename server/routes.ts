import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { insertReportSchema, insertSourcingRequestSchema, insertSupplierShortlistSchema, creditTransactions, processedStripeEvents, userProfiles, leads, reports } from "@shared/schema";
import { eq, sql, desc } from "drizzle-orm";
import { fromError } from "zod-validation-error";
import { generateSmartFinderReport, type ReportFormData } from "./services/reportGenerator";
import { withTimeout } from "./lib/asyncUtils";
import { stripeService } from "./stripeService";
import { getStripePublishableKey, getUncachableStripeClient } from "./stripeClient";
import { getOpenAIClient, isOpenAIConfigured, chatWithRetry, getUsageLog, LIGHT_MODEL } from "./services/openaiClient";
import { expandSearchQueryForMultilingual } from "./services/multilingualSearch";
import { calculateLandedCost } from "./services/landedCost";
import type { LandedCostInput, LandedCostResult } from "./services/landedCost";
import { generateRiskAnalysis, generateComplianceCheck } from "./services/riskIntelligence";
import {
  getAuthorizationUrl,
  exchangeCodeForTokens,
  getUserIntegrations,
  disconnectIntegration,
  SLUG_TO_PROVIDER,
  type IntegrationProvider,
} from "./services/integrations";
import { prisma } from "../lib/prisma";
import { sqltag as pSql, join as pJoin, raw as pRaw, empty as pEmpty, type Sql as PrismaSQL } from "@prisma/client/runtime/library.js";
import { SUPPLIER_CATEGORIES } from "./seo";
import { getMineralPurityOptions, MINERAL_FORMS } from "@shared/mineralConfig";
import { detectProductFamily } from "@shared/productFamilies";
import { getMarketMetalPrices } from "./services/marketPrices";
import { getTechStack, type TechStackResult } from "./services/apifyTechService";
import { searchCompanies, indexCompany, getIndexStats, setupSearchIndex } from "./services/searchService";
import { runIntelligenceEngine, quickRiskScore } from "./services/intelligenceEngine";
import { getGraphService } from "./services/graphService";
import type { GraphRelation } from "@shared/schema";
import { triggerPipelineRun, getPipelineRuns, isPipelineRunning } from "./jobs/dataCollector";
import { scrapeSource, scrapeAll, getCompanyStats, type ScraperSource } from "./scrapers/directoryScraper";
import { crawlAndSave, getCrawlResult, listEnrichments } from "./scrapers/websiteCrawler";
import { scoreCompany, scoreDomain, scoreBatch, getTopLeads } from "./services/leadScoringEngine";
import PLATFORM_STATS from "./data/stats.json";
import FEATURED_SUPPLIERS from "./data/featured-suppliers.json";
import { sendSubscribeConfirmationEmail, sendRfqConfirmationEmail, sendOpsAlertEmail } from "./sendgridClient";
import { upsertHubSpotContact } from "./hubspotClient";

// Helper to get user ID from session
function getUserId(req: Request): string | null {
  return (req.session as any)?.userId || null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Sitemap ───────────────────────────────────────────────────────────────
  app.get("/sitemap.xml", (_req: Request, res: Response) => {
    const SITE_URL = (process.env.SITE_URL || "https://smartseek.io").replace(/\/$/, "");
    const now = new Date().toISOString().split("T")[0];

    const staticRoutes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/search", priority: "0.95", changefreq: "daily" },
      { path: "/pricing", priority: "0.9", changefreq: "weekly" },
      { path: "/about", priority: "0.8", changefreq: "monthly" },
      { path: "/faq", priority: "0.8", changefreq: "monthly" },
      { path: "/contact", priority: "0.6", changefreq: "monthly" },
      { path: "/integrations", priority: "0.7", changefreq: "monthly" },
      { path: "/rfq", priority: "0.7", changefreq: "monthly" },
      { path: "/sample-report", priority: "0.7", changefreq: "monthly" },
      { path: "/signup", priority: "0.9", changefreq: "monthly" },
      { path: "/login", priority: "0.5", changefreq: "monthly" },
    ];

    const categoryRoutes = SUPPLIER_CATEGORIES.map((cat) => ({
      path: `/suppliers/${cat}`,
      priority: "0.9",
      changefreq: "daily",
    }));

    const allRoutes = [...staticRoutes, ...categoryRoutes];

    const urlEntries = allRoutes
      .map(
        (r) =>
          `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  });

  // Mineral purity options (for SmartFinder when user searches copper, tin, antimony, etc.)
  app.get("/api/minerals/options", (req: Request, res: Response) => {
    try {
      const product = (req.query.product as string) || "";
      const result = getMineralPurityOptions(product);
      if (!result) return res.json({ isMineral: false, options: null });
      res.json({
        isMineral: true,
        product: { id: result.product.id, name: result.product.name, priceSource: result.product.priceSource },
        purityOptions: result.options.map((o) => ({ id: o.id, label: o.label, description: o.description })),
        formOptions: MINERAL_FORMS.map((f) => ({ id: f.id, label: f.label, description: f.description })),
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to get mineral options" });
    }
  });

  // Product family detection (steel, agri, chemicals, textiles, etc.) Ã¢ÂÂ when not a mineral
  app.get("/api/product-families/detect", (req: Request, res: Response) => {
    try {
      const product = (req.query.product as string) || "";
      const family = detectProductFamily(product);
      if (!family) return res.json({ isProductFamily: false, family: null });
      res.json({
        isProductFamily: true,
        family: {
          id: family.id,
          name: family.name,
          referenceIndex: family.referenceIndex,
          unit: family.unit,
          parameters: family.parameters.map((p) => ({
            id: p.id,
            label: p.label,
            type: p.type,
            required: p.required,
            placeholder: p.placeholder,
            options: p.options?.map((o) => ({ id: o.id, label: o.label })),
          })),
        },
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to detect product family" });
    }
  });

  // UN Comtrade proxy Ã¢ÂÂ official trade data (requires UN_COMTRADE_API_KEY)
  app.get("/api/trade/comtrade", async (req: Request, res: Response) => {
    const key = process.env.UN_COMTRADE_API_KEY;
    if (!key) {
      return res.status(503).json({ error: "UN Comtrade API not configured", data: null });
    }
    try {
      const params = new URLSearchParams(req.query as Record<string, string>);
      params.set("subscription-key", key);
      const url = `https://comtradeplus.un.org/api/get?${params.toString()}`;
      const resp = await fetch(url);
      const data = await resp.json();
      res.json({ data, source: "UN Comtrade" });
    } catch (e) {
      console.error("Comtrade proxy error:", e);
      res.status(502).json({ error: "Failed to fetch trade data", data: null });
    }
  });

  // Market prices (USD/tonne) Ã¢ÂÂ metals, steel, agri, food
  app.get("/api/market-prices/metals", async (_req: Request, res: Response) => {
    try {
      const prices = await getMarketMetalPrices();
      res.json({
        prices,
        source: process.env.METALPRICE_API_KEY || process.env.COMMODITIES_API_KEY ? "API" : "fallback",
        unit: "USD/tonne",
      });
    } catch (e) {
      console.error("Market prices error:", e);
      res.status(500).json({ error: "Failed to fetch market prices" });
    }
  });

  // Health check (no DB) Ã¢ÂÂ for Railway/deploy verification
  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  // Newsletter subscribe — footer email signup
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
      }
      const trimmed = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      const { pool } = await import("./db");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      const result = await pool.query(
        `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id`,
        [trimmed]
      );
      // Send confirmation email + sync to HubSpot only for new subscribers
      if (result.rowCount && result.rowCount > 0) {
        sendSubscribeConfirmationEmail(trimmed).catch((err: Error) =>
          console.warn("[newsletter] Confirmation email failed:", err?.message)
        );
        upsertHubSpotContact(trimmed, { source: "newsletter" }).catch((err: Error) =>
          console.warn("[newsletter] HubSpot sync failed:", err?.message)
        );
      }
      res.json({ success: true, message: "Subscribed successfully" });
    } catch (e: any) {
      console.error("Newsletter subscribe error:", e);
      res.status(500).json({ error: "Failed to subscribe. Please try again." });
    }
  });

  // Waitlist signup — used while checkout is disabled on Pricing page
  app.post("/api/waitlist-signups", async (req: Request, res: Response) => {
    try {
      const { fullName, email, company, tier_interest, source_page } = req.body ?? {};
      if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
        return res.status(400).json({ error: "fullName is required" });
      }
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "email is required" });
      }
      const trimmedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const { pool } = await import("./db");

      await pool.query(
        `INSERT INTO waitlist_signups (full_name, email, company, tier_interest, source_page, source)
         VALUES ($1, $2, $3, $4, $5, 'pricing_page')
         ON CONFLICT (email) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           company = EXCLUDED.company,
           tier_interest = EXCLUDED.tier_interest,
           source_page = EXCLUDED.source_page`,
        [
          fullName.trim(),
          trimmedEmail,
          typeof company === "string" ? company.trim() || null : null,
          typeof tier_interest === "string" && tier_interest.trim() ? tier_interest.trim() : "professional",
          typeof source_page === "string" && source_page.trim() ? source_page.trim() : "pricing",
        ]
      );

      res.json({ success: true });
    } catch (e) {
      console.error("Waitlist signup error:", e);
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  // Freight benchmark rates Ã¢ÂÂ real market data (2024 indices: FBX, Xeneta, Drewry)
  // Routes keyed by origin-destination; rates in USD
  app.get("/api/freight/benchmark-rates", async (req: Request, res: Response) => {
    try {
      const origin = (req.query.origin as string) || "CN";
      const destination = (req.query.destination as string) || "US";
      const routeKey = `${origin}-${destination}`;
      // 2024 benchmark rates from Freightos Baltic Index, Xeneta, industry reports
      const ROUTE_RATES: Record<string, { sea20ft: number; sea40ft: number; airPerKg: number; lclPerCBM: number }> = {
        "CN-US": { sea20ft: 2100, sea40ft: 3100, airPerKg: 6.2, lclPerCBM: 95 },
        "CN-DE": { sea20ft: 1850, sea40ft: 2750, airPerKg: 5.8, lclPerCBM: 88 },
        "CN-GB": { sea20ft: 1920, sea40ft: 2850, airPerKg: 6.0, lclPerCBM: 90 },
        "VN-US": { sea20ft: 2350, sea40ft: 3450, airPerKg: 6.5, lclPerCBM: 105 },
        "IN-US": { sea20ft: 2200, sea40ft: 3250, airPerKg: 6.8, lclPerCBM: 98 },
        "IN-DE": { sea20ft: 1950, sea40ft: 2900, airPerKg: 6.0, lclPerCBM: 92 },
        "MX-US": { sea20ft: 1200, sea40ft: 1850, airPerKg: 4.5, lclPerCBM: 75 },
        "TH-US": { sea20ft: 2280, sea40ft: 3350, airPerKg: 6.4, lclPerCBM: 100 },
        "ID-US": { sea20ft: 2400, sea40ft: 3550, airPerKg: 6.6, lclPerCBM: 108 },
        "JP-US": { sea20ft: 1650, sea40ft: 2450, airPerKg: 5.2, lclPerCBM: 82 },
        "KR-US": { sea20ft: 1750, sea40ft: 2600, airPerKg: 5.5, lclPerCBM: 85 },
      };
      const rates = ROUTE_RATES[routeKey] || ROUTE_RATES["CN-US"];
      res.json({
        route: routeKey,
        origin,
        destination,
        rates,
        dataSource: "Freightos Baltic Index, Xeneta, Drewry (2024 benchmarks)",
        lastUpdated: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Freight rates error:", error);
      res.status(500).json({ error: "Failed to fetch freight rates" });
    }
  });

  // Diagnostic: verify OpenAI + report setup (for debugging report failures)
  app.get("/api/health/report-setup", async (_req: Request, res: Response) => {
    const checks: Record<string, { ok: boolean; message: string }> = {};
    try {
      const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
      const isDummy = !apiKey || apiKey === "sk-dummy" || apiKey.startsWith("sk-your") || apiKey.length < 20;
      checks.openaiKey = !isDummy
        ? { ok: true, message: "Configured" }
        : { ok: false, message: apiKey ? "Invalid key (use real key from platform.openai.com)" : "Missing OPENAI_API_KEY in .env" };

      if (apiKey) {
        try {
          const client = getOpenAIClient();
          const r = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say OK" }],
            max_tokens: 5,
          });
          checks.openaiCall = r.choices[0]?.message?.content
            ? { ok: true, message: "API responds" }
            : { ok: false, message: "Empty response" };
        } catch (e: any) {
          checks.openaiCall = { ok: false, message: e?.message || String(e) };
        }
      }

      try {
        await db.select().from(reports).limit(1);
        checks.reportsTable = { ok: true, message: "Exists" };
      } catch (e: any) {
        checks.reportsTable = { ok: false, message: e?.message || "Run npm run db:push" };
      }
    } catch (e: any) {
      checks.error = { ok: false, message: e?.message || String(e) };
    }
    res.json(checks);
  });

  // Diagnostic: quick test (~10 sec) - just Phase 1 LLM, avoids request timeout
  // GET version: open in browser tab to test (no auth required for quick check)
  app.get("/api/health/test-report", async (_req: Request, res: Response) => {
    try {
      const client = getOpenAIClient();
      const r = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: 'Return JSON: { "ok": true }' }],
        response_format: { type: "json_object" },
        max_tokens: 20,
      });
      const text = r.choices[0]?.message?.content || "";
      res.json({ success: true, message: "Report pipeline ready", raw: text });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || String(e) });
    }
  });
  app.post("/api/health/test-report", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const client = getOpenAIClient();
      const r = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: 'Product: wireless headphones. Return JSON: { "hsCode": "8518.12", "estimatedFobCostPerUnit": 5 }',
        }],
        response_format: { type: "json_object" },
        max_tokens: 100,
      });
      const text = r.choices[0]?.message?.content || "";
      const parsed = JSON.parse(text || "{}");
      if (parsed.hsCode) {
        res.json({ success: true, message: "Report pipeline ready", hsCode: parsed.hsCode });
      } else {
        res.status(500).json({ success: false, error: "Unexpected AI response", raw: text });
      }
    } catch (e: any) {
      console.error("Test report failed:", e);
      res.status(500).json({
        success: false,
        error: e?.message || String(e),
      });
    }
  });

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
      // Fallback when user_profiles table missing (migrations not run) Ã¢ÂÂ allow Dashboard to load
      res.json({
        userId,
        role: "buyer",
        plan: "free",
        monthlyCredits: 0,
        topupCredits: 2,
        hasUsedFreeTrial: false,
      });
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
  
  app.get("/api/user/credits", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const profile = await storage.getUserProfile(userId);
      const credits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      res.json({ credits });
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  app.get("/api/user/stats", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
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
      res.json([]);
    }
  });

  app.get("/api/billing/transactions", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const transactions = await storage.getCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching billing transactions:", error);
      res.json([]);
    }
  });
  
  // ===== Image Analysis =====
  
  app.post("/api/analyze-image", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "Image data is required" });
      }
      
      const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Identify this product for sourcing purposes. Analyze the image and return a JSON object with these fields: productName (a concise, searchable product name), description (brief product description), category (product category), estimatedHsCode (the likely HS code for international trade). Be specific about the product type." 
            },
            { 
              type: "image_url", 
              image_url: { url: imageData } 
            }
          ]
        }],
        response_format: { type: "json_object" },
        max_tokens: 500
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Failed to analyze image" });
      }
      
      const result = JSON.parse(content);
      res.json(result);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      const msg = error?.message?.includes("API key") || error?.message?.includes("OPENAI")
        ? "OpenAI API key not configured. Add OPENAI_API_KEY to your .env file."
        : "Failed to analyze image";
      res.status(500).json({ error: msg });
    }
  });
  
  // ===== AI Agent =====
  
  app.post("/api/ai-agent", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { task, query, context } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
      
      // Build task-specific system prompts
      const taskPrompts: Record<string, string> = {
        search_leads: `You are a professional B2B lead generation specialist AI agent.
Your task is to find business owners and decision makers based on the user's criteria.
IMPORTANT: Return your response as a JSON object with this exact structure:
{
  "leads": [
    { "name": "Full Name", "title": "Job Title", "company": "Company Name", "industry": "Industry", "email": "email@company.com", "phone": "+1-xxx-xxx-xxxx" }
  ],
  "summary": "Brief summary of the search results"
}
Generate 10-15 realistic leads matching the criteria. Include realistic contact details.`,
        
        prepare_call: `You are an expert B2B sales call preparation specialist with 15+ years of experience.
IMPORTANT: Use the exact tone specified in the user's message (e.g. professional, friendly, or direct).
Create a highly effective, conversational phone call script tailored to the specific lead and industry.
Structure your response clearly with these sections:
1. OPENING HOOK - A brief, relevant attention-grabber (reference their company, industry trend, or recent news if applicable)
2. INTRODUCTION - Your name, company, and 1-sentence value proposition
3. KEY TALKING POINTS - 4-5 specific, benefit-focused points (use their industry language)
4. QUESTIONS TO ASK - 3-4 discovery questions that show you've done research
5. OBJECTION HANDLING - Address 2-3 likely objections with concise, confident responses
6. CALL TO ACTION - Clear next step (meeting, demo, follow-up call)
7. CLOSING - Professional sign-off
Keep it natural and conversational. Adapt tone to the lead's seniority and industry.`,
        
        prepare_email: `You are an expert B2B email copywriter specializing in cold outreach that gets replies.
IMPORTANT: Use the exact email template style (formal/casual/sales) and signature provided in the user's message.
Draft a compelling, highly personalized outreach email. Use this structure:
1. SUBJECT LINE - Create 2 options: one curiosity-driven, one value-driven (max 50 chars each)
2. OPENING - Personalized hook (reference their role, company, or industryÃ¢ÂÂshow you've researched)
3. VALUE PROPOSITION - One clear benefit in 1-2 sentences (outcome-focused, not feature-focused)
4. SOCIAL PROOF - One credible stat or proof point
5. CALL TO ACTION - Single, specific ask (one meeting, one callÃ¢ÂÂnot multiple options)
6. SIGN-OFF - Use the exact signature the user provided (e.g. "Best regards, Your Name")
Keep total email under 150 words. Avoid buzzwords. Sound human, not salesy.`,
        
        research_company: `You are a business intelligence research analyst.
Your task is to provide comprehensive company research including:
- Company overview and history
- Key products/services
- Target market and customers
- Recent news and developments
- Key decision makers with titles
- Estimated company size and revenue
- Competitive positioning
- Potential pain points and opportunities
Provide actionable insights for sales and partnership opportunities.`,
        
        supplier: `You are an expert trade intelligence AI agent specializing in supplier discovery and evaluation. 
Your task is to provide detailed, actionable supplier recommendations.
Always structure your response with:
- A brief summary of findings
- Key statistics (estimated number of suppliers, typical pricing ranges, lead times)
- Top recommended suppliers with details
- Risk factors to consider
- Next steps for the buyer`,
        
        analysis: `You are an expert trade data analyst AI agent.
Your task is to analyze trade patterns, market trends, and provide data-driven insights.
Always structure your response with:
- Executive summary
- Key statistics and metrics
- Trend analysis
- Market opportunities
- Recommendations`,
        
        costs: `You are an expert in international trade costs, customs duties, and logistics.
Your task is to help calculate and estimate landed costs, duties, and shipping expenses.
Always structure your response with:
- Cost breakdown summary
- Duty/tariff estimates
- Shipping cost estimates
- Total landed cost estimate
- Cost optimization suggestions`,
        
        reports: `You are an expert report generator for trade intelligence.
Your task is to create professional, comprehensive sourcing reports.
Always structure your response with:
- Executive summary
- Market overview
- Supplier analysis
- Cost analysis
- Risk assessment
- Recommendations`,
        
        general: `You are SmartSeek AI Agent, a premium autonomous trade intelligence assistant powered by advanced AI. You provide strategic, data-driven insights that help business decision makers make better sourcing and procurement decisions.

Your capabilities include:
- **Market Intelligence**: Analyze market trends, price movements, supply-demand dynamics, and competitive landscapes
- **Supplier Discovery**: Find, evaluate, and compare suppliers across 220+ countries with quality scoring
- **Cost Optimization**: Calculate landed costs, identify savings opportunities, optimize trade routes and logistics
- **Risk Analysis**: Assess geopolitical, financial, supply chain, and regulatory risks with mitigation strategies
- **Trade Compliance**: Navigate HS codes, customs duties, trade agreements, and regulatory requirements
- **Strategic Advisory**: Provide actionable recommendations backed by market data and industry expertise

RESPONSE GUIDELINES:
- Be specific with numbers, percentages, and data points Ã¢ÂÂ never vague
- Structure responses with clear headers and bullet points for readability
- Always end with 2-3 actionable next steps the user can take immediately
- Reference current market conditions, trade policies, and industry trends
- If the user asks about a specific product/market, provide pricing ranges, key suppliers, and risk factors
- Think like a senior trade consultant charging $500/hour Ã¢ÂÂ every response should deliver that level of value`
      };
      
      const systemPrompt = taskPrompts[task] || taskPrompts.general;
      
      const tokenLimit = task === "search_leads" ? 3000 : 2500;
      const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: tokenLimit,
        temperature: 0.7,
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Failed to get AI response" });
      }
      
      // Return structured response
      res.json({
        success: true,
        task,
        query,
        response: {
          summary: content.split('\n')[0] || 'Analysis complete',
          content,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error("Error in AI agent:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Pipeline: Prospector Ã¢ÂÂ Enricher Ã¢ÂÂ Qualifier Ã¢ÂÂ Outreach
  app.post("/api/ai-agent/pipeline", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { searchCriteria, targetIndustries, topN, settings } = req.body;
      if (!searchCriteria || typeof searchCriteria !== "string" || !searchCriteria.trim()) {
        return res.status(400).json({ error: "searchCriteria is required" });
      }
      const { runAIAgentPipeline } = await import("./services/aiAgentPipeline");
      const result = await runAIAgentPipeline(
        {
          searchCriteria: searchCriteria.trim(),
          targetIndustries: Array.isArray(targetIndustries) ? targetIndustries : undefined,
          topN: typeof topN === "number" ? topN : 3,
        },
        settings
      );
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error("AI agent pipeline error:", error);
      res.status(500).json({ error: error?.message || "Pipeline failed" });
    }
  });
  
  app.post("/api/ai-agent/save", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { task, query, response } = req.body;
      
      if (!response) {
        return res.status(400).json({ error: "No response to save" });
      }
      
      const title = `AI Agent: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`;
      
      const report = await storage.createReport({
        userId,
        title,
        category: 'ai-agent',
        status: 'completed',
        formData: { task, query },
      });
      
      await storage.updateReport(report.id, {
        reportData: { response, savedAt: new Date().toISOString() },
      });
      
      res.json({ success: true, reportId: report.id });
    } catch (error: any) {
      console.error("Error saving AI agent result:", error);
      res.status(500).json({ error: "Failed to save result" });
    }
  });

  // ===== AI: Status & Usage =====
  app.get("/api/ai/status", (_req: Request, res: Response) => {
    res.json({ configured: isOpenAIConfigured() });
  });

  app.get("/api/ai/usage", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(getUsageLog());
  });

  // ===== AI: Supplier Summary =====
  app.post("/api/ai/supplier-summary", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!isOpenAIConfigured()) {
      return res.status(503).json({ error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env file." });
    }
    try {
      const { supplierName, country, industry, products, description } = req.body;
      if (!supplierName || typeof supplierName !== "string") {
        return res.status(400).json({ error: "supplierName is required" });
      }
      const context = [
        supplierName && `Supplier: ${supplierName}`,
        country && `Country: ${country}`,
        industry && `Industry: ${industry}`,
        products && `Products: ${Array.isArray(products) ? products.join(", ") : products}`,
        description && `Additional info: ${description}`,
      ].filter(Boolean).join("\n");

      const response = await chatWithRetry({
        model: LIGHT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a sourcing intelligence assistant. Generate a concise 2-3 sentence summary of this supplier for procurement teams. Highlight strengths, specialties, and key differentiators. Be factual and professional.",
          },
          {
            role: "user",
            content: `Summarize this supplier:\n\n${context || "No additional context provided."}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      const summary = response.choices[0]?.message?.content?.trim();
      res.json({ summary: summary || "Unable to generate summary." });
    } catch (error: any) {
      console.error("Supplier summary error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate supplier summary" });
    }
  });

  // ===== AI: RFQ Draft =====
  app.post("/api/ai/rfq-draft", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!isOpenAIConfigured()) {
      return res.status(503).json({ error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env file." });
    }
    try {
      const { description, quantity, unit, targetRegion, deadline } = req.body;
      if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "description is required" });
      }
      const context = [
        `Product/Service: ${description}`,
        quantity && `Quantity: ${quantity}`,
        unit && `Unit: ${unit}`,
        targetRegion && `Target region: ${targetRegion}`,
        deadline && `Deadline: ${deadline}`,
      ].filter(Boolean).join("\n");

      const response = await chatWithRetry({
        model: LIGHT_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an expert procurement specialist. Draft a professional Request for Quotation (RFQ) based on the user's description.
Include: 1) Clear product/service specification, 2) Quantity and unit, 3) Delivery requirements, 4) Quality/certification requirements if relevant, 5) Quote submission deadline, 6) Contact/response instructions.
Format as plain text, professional tone. Keep it concise but complete.`,
          },
          {
            role: "user",
            content: `Draft an RFQ for:\n\n${context}`,
          },
        ],
        max_tokens: 600,
        temperature: 0.6,
      });

      const draft = response.choices[0]?.message?.content?.trim();
      res.json({ draft: draft || "Unable to generate RFQ draft." });
    } catch (error: any) {
      console.error("RFQ draft error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate RFQ draft" });
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
      
      // Check credits Ã¢ÂÂ fallback when user_profiles/credit tables missing (migrations not run)
      let profile: Awaited<ReturnType<typeof storage.getUserProfile>>;
      try {
        profile = await storage.getUserProfile(userId);
      } catch {
        profile = { monthlyCredits: 2, topupCredits: 0, hasUsedFreeTrial: false, role: "buyer" } as any;
      }
      const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      const hasFreeTrial = profile && !profile.hasUsedFreeTrial;
      const isAdmin = profile?.role === 'admin';
      
      if (!isAdmin && totalCredits < 1 && !hasFreeTrial) {
        return res.status(402).json({ error: "Insufficient credits" });
      }
      
      // Deduct credits (skip for admins)
      if (!isAdmin) {
        try {
          if (hasFreeTrial && totalCredits < 1) {
            await storage.updateUserProfile(userId, { hasUsedFreeTrial: true });
          } else {
            const spent = await storage.spendCredits(userId, 1, "Smart Finder Report");
            if (!spent) return res.status(402).json({ error: "Failed to deduct credits" });
          }
        } catch {
          // Credits tables missing Ã¢ÂÂ allow report anyway (graceful degradation)
        }
      }
      
      // Create initial report
      const report = await storage.createReport({
        ...validatedData,
        userId,
        status: "generating",
      });
      
      // Generate AI report in background (don't await to return quickly)
      
      withTimeout(
        generateSmartFinderReport(validatedData.formData as ReportFormData),
        120000,
        "Report generation"
      )
        .then(async (reportData) => {
          try {
            await storage.updateReport(report.id, {
              reportData,
              status: "completed",
            });
            console.log("Report completed:", report.id);
          } catch (updateErr) {
            console.error("Report completed but failed to save:", report.id, updateErr);
          }
        })
        .catch(async (error) => {
          const errMsg = error?.message || String(error) || "Unknown error";
          const userMsg =
            errMsg.includes("timed out") ? "Report generation took too long. Please try again with a simpler query." :
            errMsg.includes("API key") || errMsg.includes("OPENAI") ? "AI service not configured. Please contact support." :
            errMsg.length < 150 ? errMsg : errMsg.substring(0, 147) + "...";
          console.error("Report generation failed:", report.id, errMsg, error?.stack);
          try {
            await storage.updateReport(report.id, {
              status: "failed",
              reportData: { error: userMsg, failedAt: new Date().toISOString(), rawError: errMsg },
            });
          } catch (updateErr) {
            console.error("Failed to update report status to failed:", report.id, updateErr);
          }
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
      // Fallback when reports table missing Ã¢ÂÂ allow Reports page to load
      res.json([]);
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
      // Disable caching to ensure polling gets fresh data
      res.set('Cache-Control', 'no-store, max-age=0');
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.post("/api/reports/:id/retry", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      if (!report || report.userId !== userId) {
        return res.status(404).json({ error: "Report not found" });
      }
      const formData = report.formData as ReportFormData;
      if (!formData) {
        return res.status(400).json({ error: "Report has no form data to retry" });
      }
      await storage.updateReport(id, {
        status: "generating",
        reportData: null,
      });
      
      withTimeout(generateSmartFinderReport(formData), 120000, "Report generation")
        .then(async (reportData) => {
          await storage.updateReport(id, { reportData, status: "completed" });
        })
        .catch(async (error) => {
          const errMsg = error?.message || String(error) || "Unknown error";
          const userMsg = errMsg.length < 150 ? errMsg : errMsg.substring(0, 147) + "...";
          await storage.updateReport(id, {
            status: "failed",
            reportData: { error: userMsg, failedAt: new Date().toISOString() },
          });
        });
      const updated = await storage.getReport(id);
      res.json({ success: true, report: updated });
    } catch (error: any) {
      console.error("Report retry error:", error);
      res.status(500).json({ error: "Failed to retry report" });
    }
  });

  app.delete("/api/reports/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      if (!report || report.userId !== userId) {
        return res.status(404).json({ error: "Report not found" });
      }
      await storage.deleteReport(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Failed to delete report" });
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
      if (profile?.plan !== "monthly") {
        return res.status(403).json({ error: "Monthly subscription required" });
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
      const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      if (!profile || totalCredits < 10) {
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

  // ===== Find Leads =====
  
  app.get("/api/leads/count", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { industry, location, companySize, keywords } = req.query;
      if (!industry || !location) {
        return res.json({ count: 0 });
      }

      const conditions: PrismaSQL[] = [
        pSql`industry ILIKE ${`%${String(industry).trim()}%`}`,
        pSql`(country ILIKE ${String(location).trim()} OR city ILIKE ${`%${String(location).trim()}%`})`,
      ];

      const size = typeof companySize === "string" ? companySize : "";
      if (size) {
        if (size === "1-50 employees") conditions.push(pSql`"employeeCount" BETWEEN 1 AND 50`);
        if (size === "51-200 employees") conditions.push(pSql`"employeeCount" BETWEEN 51 AND 200`);
        if (size === "201-500 employees") conditions.push(pSql`"employeeCount" BETWEEN 201 AND 500`);
        if (size === "501-1000 employees") conditions.push(pSql`"employeeCount" BETWEEN 501 AND 1000`);
        if (size === "1000+ employees") conditions.push(pSql`"employeeCount" >= 1001`);
      }

      if (typeof keywords === "string" && keywords.trim()) {
        const k = keywords.trim();
        conditions.push(pSql`search_vector @@ websearch_to_tsquery('simple', ${k})`);
      }

      const whereClause = conditions.length > 0 ? pSql`WHERE ${pJoin(conditions, ' AND ')}` : pEmpty;

      const count = await Promise.race([
        prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint AS cnt FROM "Supplier" ${whereClause}`
          .then((r: [{ cnt: bigint }]) => Number(r[0]?.cnt ?? 0)),
        new Promise<number>((resolve) => setTimeout(() => resolve(0), 5000)),
      ]).catch(() => 0);

      res.json({ count });
    } catch (error) {
      console.error("Error counting leads:", error);
      res.status(500).json({ error: "Failed to estimate leads" });
    }
  });

  app.post("/api/leads/search", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { industry, location, companySize, keywords, revenueRange, fundingStage, foundedAfter } = req.body ?? {};

      if (!industry || !location) {
        return res.status(400).json({ error: "Industry and location are required" });
      }

      const profile = await storage.getUserProfile(userId);
      const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      const isAdmin = profile?.role === "admin";

      if (!isAdmin && (!profile || totalCredits < 1)) {
        return res.status(402).json({ error: "Insufficient credits" });
      }

      const searchCriteria = { industry, location, companySize, keywords, revenueRange, fundingStage, foundedAfter };

      const conditions: PrismaSQL[] = [
        pSql`industry ILIKE ${`%${String(industry).trim()}%`}`,
        pSql`(country ILIKE ${String(location).trim()} OR city ILIKE ${`%${String(location).trim()}%`})`,
        pSql`slug IS NOT NULL`,
      ];

      const size = typeof companySize === "string" ? companySize : "";
      if (size) {
        if (size === "1-50 employees") conditions.push(pSql`"employeeCount" BETWEEN 1 AND 50`);
        if (size === "51-200 employees") conditions.push(pSql`"employeeCount" BETWEEN 51 AND 200`);
        if (size === "201-500 employees") conditions.push(pSql`"employeeCount" BETWEEN 201 AND 500`);
        if (size === "501-1000 employees") conditions.push(pSql`"employeeCount" BETWEEN 501 AND 1000`);
        if (size === "1000+ employees") conditions.push(pSql`"employeeCount" >= 1001`);
      }

      if (typeof foundedAfter === "string" && foundedAfter.trim()) {
        const year = parseInt(foundedAfter, 10);
        if (!Number.isNaN(year)) conditions.push(pSql`"yearEstablished" >= ${year}`);
      }

      if (typeof keywords === "string" && keywords.trim()) {
        const k = keywords.trim();
        conditions.push(pSql`search_vector @@ websearch_to_tsquery('simple', ${k})`);
      }

      const whereClause = conditions.length > 0 ? pSql`WHERE ${pJoin(conditions, ' AND ')}` : pEmpty;

      type LeadSupplierRow = {
        id: number;
        companyName: string | null;
        industry: string | null;
        country: string | null;
        city: string | null;
        employeeCount: number | null;
        annualRevenue: number | null;
        website: string | null;
        products: string | null;
        description: string | null;
        rating: number | null;
        verified: boolean | null;
        slug: string | null;
      };

      const keywordForRank = typeof keywords === "string" && keywords.trim() ? keywords.trim() : String(industry).trim();

      const rows = await Promise.race([
        prisma.$queryRaw<LeadSupplierRow[]>`
          SELECT id, "companyName", industry, country, city, "employeeCount", "annualRevenue", website,
                 products, description, rating, verified, slug,
                 (
                   ts_rank(search_vector, websearch_to_tsquery('simple', ${keywordForRank})) * 1.4
                   + GREATEST(
                       similarity(coalesce(products, ''), ${keywordForRank}),
                       similarity(coalesce("companyName", ''), ${keywordForRank}),
                       similarity(coalesce(industry, ''), ${String(industry).trim()})
                     ) * 1.1
                   + COALESCE(rating, 0) * 0.25
                   + CASE WHEN verified THEN 0.6 ELSE 0 END
                   + CASE WHEN coalesce(products, '') <> '' THEN 0.2 ELSE 0 END
                   + CASE WHEN coalesce(description, '') <> '' THEN 0.1 ELSE 0 END
                 ) AS relevance_score
          FROM "Supplier"
          ${whereClause}
          ORDER BY relevance_score DESC, verified DESC, rating DESC
          LIMIT 20
        `,
        new Promise<LeadSupplierRow[]>((resolve) => setTimeout(() => resolve([]), 12000)),
      ]);

      const dedup = new Map<string, LeadSupplierRow>();
      for (const row of rows) {
        const key = (row.slug || row.companyName || "").toLowerCase();
        if (!key) continue;
        if (!dedup.has(key)) dedup.set(key, row);
      }

      const parseProducts = (raw: string | null): string[] => {
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.map((v) => String(v)).filter(Boolean);
        } catch {}
        return [];
      };

      const employeeRange = (n: number | null) => {
        if (!n || n <= 0) return "Unknown";
        if (n <= 50) return "1-50";
        if (n <= 200) return "51-200";
        if (n <= 500) return "201-500";
        if (n <= 1000) return "501-1000";
        return "1000+";
      };

      const revenueBucket = (n: number | null) => {
        if (!n || n <= 0) return "Unknown";
        if (n < 1_000_000) return "< $1M";
        if (n < 10_000_000) return "$1M-$10M";
        if (n < 50_000_000) return "$10M-$50M";
        if (n < 250_000_000) return "$50M-$250M";
        return "$250M+";
      };

      const searchQuery = await storage.createLeadSearchQuery({
        userId,
        searchCriteria,
        resultsCount: 0,
        creditsUsed: isAdmin ? 0 : 1,
      });

      const leadsToStore = Array.from(dedup.values()).map((row) => {
        const products = parseProducts(row.products);
        const locationText = [row.city, row.country].filter(Boolean).join(", ") || (row.country ?? "Unknown");
        const website = row.website || (row.slug ? `https://www.${row.slug.replace(/[^a-z0-9-]/g, "")}.com` : null);
        return {
          userId,
          searchQueryId: searchQuery.id,
          companyName: row.companyName || "Unknown Supplier",
          industry: row.industry || String(industry),
          location: locationText,
          employeeRange: employeeRange(row.employeeCount),
          revenueRange: revenueBucket(row.annualRevenue),
          website,
          contactName: null,
          contactTitle: "Procurement Team",
          contactEmail: null,
          sourcingFocus: products.slice(0, 5),
          aiSummary: row.description || `Ranked supplier match for ${industry} in ${location}.`,
          intentSignals: {
            recentActivity: row.verified ? "Verified supplier profile with active listing" : "Supplier profile available",
            importTrends: `Strong relevance for ${industry}`,
            growthIndicators: row.rating ? `Supplier rating ${row.rating.toFixed(1)}` : "Rating not available",
          },
          dataSource: "SmartSeek Supplier DB",
        };
      });

      const savedLeads = leadsToStore.length > 0 ? await storage.createLeads(leadsToStore) : [];
      await storage.updateLeadSearchQuery(searchQuery.id, { resultsCount: savedLeads.length });

      if (!isAdmin) {
        const spent = await storage.spendCredits(userId, 1, "Find Leads Search");
        if (!spent) {
          console.error("Failed to deduct credits after lead generation");
        }
      }

      res.json({ leads: savedLeads, searchQueryId: searchQuery.id, source: "supplier_db" });
    } catch (error: any) {
      console.error("Error searching leads:", error);
      res.status(500).json({ error: "Failed to search leads" });
    }
  });

  app.get("/api/leads/history", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const searches = await storage.getUserLeadSearchQueries(userId);
      res.json(searches);
    } catch (error) {
      console.error("Error fetching lead search history:", error);
      res.status(500).json({ error: "Failed to fetch lead search history" });
    }
  });
  
  app.get("/api/leads", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const leads = await storage.getUserLeads(userId);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });
  
  app.get("/api/leads/report/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const searchQueryId = parseInt(req.params.id);
      if (isNaN(searchQueryId)) {
        return res.status(400).json({ error: "Invalid search query ID" });
      }
      
      const searchQuery = await storage.getLeadSearchQuery(searchQueryId);
      if (!searchQuery) {
        return res.status(404).json({ error: "Lead report not found" });
      }
      
      if (searchQuery.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const leads = await storage.getLeadsBySearchQueryId(searchQueryId);
      res.json({ searchQuery, leads });
    } catch (error) {
      console.error("Error fetching lead report:", error);
      res.status(500).json({ error: "Failed to fetch lead report" });
    }
  });

  // ===== Calculator History =====
  
  // Save customs calculation
  app.post("/api/calculations/customs", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { productName, hsCode, originCountry, destinationCountry, productValue, quantity, incoterm, result } = req.body;
      
      const calc = await storage.createCustomsCalculation({
        userId,
        productName: productName || "Untitled Product",
        hsCode: hsCode || null,
        originCountry,
        destinationCountry,
        productValue: Math.round(productValue),
        quantity: quantity || 1,
        incoterm: incoterm || null,
        result,
      });
      
      res.json(calc);
    } catch (error) {
      console.error("Error saving customs calculation:", error);
      res.status(500).json({ error: "Failed to save calculation" });
    }
  });
  
  // Get user's customs calculations
  app.get("/api/calculations/customs", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const calculations = await storage.getUserCustomsCalculations(userId);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching customs calculations:", error);
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });
  
  // Get single customs calculation
  app.get("/api/calculations/customs/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const calc = await storage.getCustomsCalculation(id);
      if (!calc) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      
      if (calc.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(calc);
    } catch (error) {
      console.error("Error fetching customs calculation:", error);
      res.status(500).json({ error: "Failed to fetch calculation" });
    }
  });
  
  // Save shipping estimate
  app.post("/api/calculations/shipping", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { originCountry, destinationCountry, weight, volume, shippingMethod, result } = req.body;
      
      const estimate = await storage.createShippingEstimate({
        userId,
        originCountry,
        destinationCountry,
        weight: weight ? Math.round(weight) : null,
        volume: volume ? Math.round(volume * 1000) : null, // Store as integer (x1000)
        shippingMethod: shippingMethod || "sea",
        result,
      });
      
      res.json(estimate);
    } catch (error) {
      console.error("Error saving shipping estimate:", error);
      res.status(500).json({ error: "Failed to save estimate" });
    }
  });
  
  // Get user's shipping estimates
  app.get("/api/calculations/shipping", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const estimates = await storage.getUserShippingEstimates(userId);
      res.json(estimates);
    } catch (error) {
      console.error("Error fetching shipping estimates:", error);
      res.status(500).json({ error: "Failed to fetch estimates" });
    }
  });
  
  // Get single shipping estimate
  app.get("/api/calculations/shipping/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const estimate = await storage.getShippingEstimate(id);
      if (!estimate) {
        return res.status(404).json({ error: "Estimate not found" });
      }
      
      if (estimate.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(estimate);
    } catch (error) {
      console.error("Error fetching shipping estimate:", error);
      res.status(500).json({ error: "Failed to fetch estimate" });
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

  // Subscription price IDs (monthly from products, annual from env)
  app.get("/api/stripe/subscription-prices", async (_req: Request, res: Response) => {
    try {
      const rows = await storage.getProductsWithPrices();
      let monthlyPriceId: string | null = null;
      for (const row of rows as any[]) {
        const meta = row.product_metadata as Record<string, string> | null;
        if (meta?.type === 'subscription' && row.price_id) {
          const recurring = row.recurring as { interval?: string } | null;
          if (recurring?.interval === 'year') {
            continue; // prefer monthly from products
          }
          monthlyPriceId = row.price_id;
          break;
        }
      }
      if (!monthlyPriceId && process.env.STRIPE_MONTHLY_PRICE_ID) {
        monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;
      }
      const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID || null;
      res.json({ monthly: monthlyPriceId, annual: annualPriceId });
    } catch (error) {
      console.error("Error fetching subscription prices:", error);
      res.json({ monthly: process.env.STRIPE_MONTHLY_PRICE_ID || null, annual: process.env.STRIPE_ANNUAL_PRICE_ID || null });
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
      const { paymentIntentId } = req.body;
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID required" });
      }
      
      // Idempotency: Check if already processed in our database
      const existing = await db.select().from(processedStripeEvents)
        .where(eq(processedStripeEvents.eventId, paymentIntentId))
        .limit(1);
      
      if (existing.length > 0) {
        // Already processed - return success without granting again
        return res.json({ success: true, credits: existing[0].creditsGranted, alreadyProcessed: true });
      }
      
      const profile = await storage.getUserProfile(userId);
      if (!profile?.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found" });
      }
      
      const stripe = await getUncachableStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Security: Verify payment belongs to this user
      if (paymentIntent.customer !== profile.stripeCustomerId) {
        return res.status(403).json({ error: "Payment does not belong to this user" });
      }
      
      // Security: Verify this is a credit purchase with valid metadata
      if (paymentIntent.metadata?.type !== 'credit_purchase' || !paymentIntent.metadata?.credits) {
        return res.status(400).json({ error: "Invalid payment type" });
      }
      
      // Security: Verify userId in metadata matches session user
      if (paymentIntent.metadata?.userId !== userId) {
        return res.status(403).json({ error: "Payment user mismatch" });
      }
      
      if (paymentIntent.status === 'succeeded') {
        // Use only the credits from secure server-side metadata, never trust client
        const credits = parseInt(paymentIntent.metadata.credits);
        if (isNaN(credits) || credits <= 0) {
          return res.status(400).json({ error: "Invalid credit amount" });
        }
        
        // Use transaction to ensure atomicity: idempotency marker + credits together
        await db.transaction(async (tx) => {
          // Record as processed (will fail on retry due to unique constraint)
          await tx.insert(processedStripeEvents).values({
            eventId: paymentIntentId,
            eventType: 'payment_intent',
            userId,
            creditsGranted: credits,
          });
          
          // Grant credits within same transaction
          await tx.insert(creditTransactions).values({
            userId,
            amount: credits,
            type: 'topup',
            creditSource: 'topup',
            description: `Purchased ${credits} credit(s)`,
          });
          
          // Update profile credits
          await tx.execute(
            sql`UPDATE user_profiles SET topup_credits = topup_credits + ${credits}, updated_at = NOW() WHERE user_id = ${userId}`
          );
        });
        
        res.json({ success: true, credits });
      } else {
        res.status(400).json({ error: "Payment not completed", status: paymentIntent.status });
      }
    } catch (error: any) {
      // Handle unique constraint violation (race condition - already processed)
      if (error?.code === '23505') {
        return res.json({ success: true, alreadyProcessed: true });
      }
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Confirm subscription after embedded checkout
  app.post("/api/stripe/confirm-subscription", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { subscriptionId } = req.body;
      if (!subscriptionId) {
        return res.status(400).json({ error: "Subscription ID required" });
      }
      
      // Idempotency: Check if already processed in our database
      const existing = await db.select().from(processedStripeEvents)
        .where(eq(processedStripeEvents.eventId, subscriptionId))
        .limit(1);
      
      if (existing.length > 0) {
        // Already processed - return success without granting again
        return res.json({ success: true, alreadyProcessed: true });
      }
      
      const profile = await storage.getUserProfile(userId);
      if (!profile?.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found" });
      }
      
      const stripe = await getUncachableStripeClient();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Security: Verify subscription belongs to this user
      if (subscription.customer !== profile.stripeCustomerId) {
        return res.status(403).json({ error: "Subscription does not belong to this user" });
      }
      
      if (subscription.status === 'active' || subscription.status === 'trialing') {
        const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);
        
        // Use transaction to ensure atomicity: idempotency marker + updates together
        await db.transaction(async (tx) => {
          // Record as processed (will fail on retry due to unique constraint)
          await tx.insert(processedStripeEvents).values({
            eventId: subscriptionId,
            eventType: 'subscription_confirmation',
            userId,
            creditsGranted: 10,
          });
          
          // Update profile and grant credits within same transaction
          await tx.update(userProfiles)
            .set({
              stripeSubscriptionId: subscription.id,
              plan: 'monthly',
              subscriptionStatus: 'active',
              currentPeriodEnd,
              monthlyCredits: 10,
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, userId));
          
          // Record credit transaction
          await tx.insert(creditTransactions).values({
            userId,
            amount: 10,
            type: 'subscription_refresh',
            creditSource: 'monthly',
            description: 'Monthly subscription activated - 10 credits',
          });
        });
        
        res.json({ success: true, status: subscription.status });
      } else if (subscription.status === 'incomplete') {
        // Payment still processing
        res.json({ success: false, status: subscription.status, message: 'Payment still processing' });
      } else {
        res.status(400).json({ error: "Subscription not active", status: subscription.status });
      }
    } catch (error: any) {
      // Handle unique constraint violation (race condition - already processed)
      if (error?.code === '23505') {
        return res.json({ success: true, alreadyProcessed: true });
      }
      console.error("Error confirming subscription:", error);
      res.status(500).json({ error: "Failed to confirm subscription" });
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

  // ===== Risk Intelligence =====
  app.post("/api/risk/analyze", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { supplierName, country, industry, products } = req.body;
      if (!country) return res.status(400).json({ error: "Country is required" });
      
      const result = await withTimeout(
        generateRiskAnalysis({ supplierName, country, industry, products }),
        30000,
        "Risk analysis"
      );
      res.json(result);
    } catch (error: any) {
      console.error("Risk analysis error:", error);
      res.status(500).json({ error: error?.message?.includes("timed out") ? "Analysis took too long. Please try again." : "Failed to generate risk analysis" });
    }
  });

  // ===== Compliance Check =====
  app.post("/api/compliance/check", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { supplierName, country, industry, targetMarkets, products } = req.body;
      if (!supplierName || !country || !industry) {
        return res.status(400).json({ error: "Supplier name, country, and industry are required" });
      }
      const result = await generateComplianceCheck({ supplierName, country, industry, targetMarkets, products });
      res.json(result);
    } catch (error: any) {
      console.error("Compliance check error:", error);
      res.status(500).json({ error: "Failed to generate compliance check" });
    }
  });

  // ===== HS Code Lookup =====
  app.get("/api/hs-codes/lookup", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { product } = req.query;
      if (!product || typeof product !== "string" || product.trim().length < 2) {
        return res.status(400).json({ error: "Product name is required (min 2 chars)" });
      }
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `You are an HS code classification expert. Given a product name, return the most accurate 6-digit HS code with its description. Return ONLY valid JSON: { "hsCode": "XXXX.XX", "description": "Official description", "chapter": "XX", "chapterName": "Chapter name" }. Be precise - use the correct Harmonized System classification.` },
          { role: "user", content: `Classify this product: ${product.trim()}` }
        ],
        max_tokens: 200,
        temperature: 0.1,
      });
      const content = response.choices[0]?.message?.content || "";
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      } catch {}
      res.json({ hsCode: "", description: "Could not classify", chapter: "", chapterName: "" });
    } catch (error: any) {
      console.error("HS code lookup error:", error);
      res.status(500).json({ error: "Failed to lookup HS code" });
    }
  });

  // ===== Landed Cost Engine Routes =====

  // Calculate landed cost
  app.post("/api/landed-cost/calculate", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Check credits
      const profile = await storage.getUserProfile(userId);
      const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      const isAdmin = profile?.role === 'admin';
      
      if (!isAdmin && (!profile || totalCredits < 1)) {
        return res.status(402).json({ error: "Insufficient credits" });
      }
      
      // Validate input
      const input: LandedCostInput = req.body;
      
      if (!input.productName || !input.originCountry || !input.destinationCountry) {
        return res.status(400).json({ error: "Missing required fields: productName, originCountry, destinationCountry" });
      }
      
      if (!input.baseCost || input.baseCost <= 0) {
        return res.status(400).json({ error: "baseCost must be greater than 0" });
      }
      
      if (!input.quantity || input.quantity <= 0) {
        return res.status(400).json({ error: "quantity must be greater than 0" });
      }
      
      // Calculate landed cost
      const result: LandedCostResult = await calculateLandedCost(input);
      
      // Deduct credits (skip for admins)
      if (!isAdmin) {
        const spent = await storage.spendCredits(userId, 1, "Landed Cost Calculation");
        if (!spent) {
          return res.status(402).json({ error: "Failed to deduct credits" });
        }
      }
      
      // Save calculation to database (using Prisma)
      try {
        await prisma.landedCostCalculation.create({
          data: {
            userId,
            title: input.productName || "Untitled Calculation",
            description: `Landed cost calculation for ${input.productName}`,
            productName: input.productName,
            hsCode: input.hsCode || null,
            category: input.category || null,
            originCountry: input.originCountry,
            destinationCountry: input.destinationCountry,
            originPort: input.originPort || null,
            destinationPort: input.destinationPort || null,
            productCost: input.baseCost,
            quantity: input.quantity,
            currency: input.currency || "USD",
            incoterm: input.incoterm || null,
            shippingMethod: input.shippingMethod,
            containerType: input.containerType || null,
            weight: input.weight ? parseFloat(input.weight.toString()) : null,
            volume: input.volume ? parseFloat(input.volume.toString()) : null,
            dimensions: input.dimensions || null,
            calculationInputs: input as any,
            calculationResult: result as any,
            calculationNotes: result.notes as any,
            benchmarkData: null, // Can be populated later
          },
        });
      } catch (dbError: any) {
        // If database error (e.g., migrations not run), log but don't fail the request
        console.warn("Failed to save calculation to database:", dbError.message);
        // Continue and return result anyway
      }
      
      res.json(result);
    } catch (error: any) {
      console.error("Error calculating landed cost:", error);
      if (error.message) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to calculate landed cost" });
    }
  });
  
  // Get user's landed cost calculation history
  app.get("/api/landed-cost/history", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      // Query using Prisma
      const [calculations, total] = await Promise.all([
        prisma.landedCostCalculation.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            productName: true,
            hsCode: true,
            originCountry: true,
            destinationCountry: true,
            productCost: true,
            quantity: true,
            currency: true,
            shippingMethod: true,
            createdAt: true,
            updatedAt: true,
            // Include summary from calculationResult if available
            calculationResult: true,
          },
        }),
        prisma.landedCostCalculation.count({
          where: { userId },
        }),
      ]);
      
      res.json({
        calculations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      // If table doesn't exist (migrations not run), return helpful error
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        return res.status(503).json({
          error: "Database migrations not run",
          message: "Please run 'npm run prisma:migrate:init' to set up the database tables.",
          calculations: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        });
      }
      console.error("Error fetching landed cost history:", error);
      res.status(500).json({ error: "Failed to fetch calculation history" });
    }
  });
  
  // Get user's credit balance
  app.get("/api/landed-cost/credits", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      const totalCredits = (profile.monthlyCredits || 0) + (profile.topupCredits || 0);
      const isAdmin = profile.role === 'admin';
      
      res.json({
        monthlyCredits: profile.monthlyCredits || 0,
        topupCredits: profile.topupCredits || 0,
        totalCredits,
        isAdmin,
        hasUnlimitedAccess: isAdmin,
      });
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({ error: "Failed to fetch credit balance" });
    }
  });
  
  // Export calculation as PDF
  app.post("/api/landed-cost/export-pdf", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { calculationId } = req.body;
      
      if (!calculationId) {
        return res.status(400).json({ error: "calculationId is required" });
      }
      
      // Query calculation from database
      const calculation = await prisma.landedCostCalculation.findFirst({
        where: {
          id: parseInt(calculationId),
          userId,
        },
      });
      
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      
      // Return calculation data for client-side PDF generation
      // Note: Server-side PDF generation can be implemented later using:
      // - pdfkit (lightweight, good for simple PDFs)
      // - puppeteer (full HTML/CSS rendering, more powerful)
      // - @react-pdf/renderer (if using React components)
      // For now, frontend can use jsPDF with this data
      
      res.json({
        success: true,
        calculation: {
          id: calculation.id,
          title: calculation.title,
          productName: calculation.productName,
          createdAt: calculation.createdAt,
          result: calculation.calculationResult,
          notes: calculation.calculationNotes,
        },
        message: "Use calculation data for client-side PDF generation with jsPDF",
      });
    } catch (error: any) {
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        return res.status(503).json({
          error: "Database migrations not run",
          message: "Please run 'npm run prisma:migrate:init' to set up the database tables.",
        });
      }
      console.error("Error exporting PDF:", error);
      res.status(500).json({ error: "Failed to export PDF" });
    }
  });

  // ============================================================================
  // Stats API (for homepage dynamic stats)
  // ============================================================================

  let statsCache: { data: any; ts: number } | null = null;
  const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  app.get("/api/stats", async (_req: Request, res: Response) => {
    if (statsCache && Date.now() - statsCache.ts < STATS_CACHE_TTL) {
      res.setHeader("Cache-Control", "public, max-age=300");
      return res.json(statsCache.data);
    }

    const FALLBACK_STATS = PLATFORM_STATS;

    try {
      const { getCountryCode, getDisplayForCode } = await import("./lib/countryCodes");

      // Use pg_class for fast estimated count (no full table scan)
      let supplierCount = 0;
      try {
        const estRows = await prisma.$queryRaw<[{ cnt: number }]>`
          SELECT reltuples::bigint as cnt FROM pg_class WHERE relname = 'Supplier'
        `;
        supplierCount = Number(estRows[0]?.cnt || 0);
      } catch {}

      // If estimated count is 0 or very low, try actual count with short timeout
      if (supplierCount < 1000) {
        try {
          const countResult = await Promise.race([
            prisma.supplier.count(),
            new Promise<number>((resolve) => setTimeout(() => resolve(0), 5000)),
          ]);
          if (countResult > supplierCount) supplierCount = countResult;
        } catch {}
      }

      // If we still have no data, return fallback immediately
      if (supplierCount === 0) {
        statsCache = { data: FALLBACK_STATS, ts: Date.now() };
        res.setHeader("Cache-Control", "public, max-age=60");
        return res.json(FALLBACK_STATS);
      }

      const timeoutMs = 15000;
      const withTimeout = <T>(p: Promise<T>, fallback: T): Promise<T> =>
        Promise.race([p, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs))]);

      const [countryResult, industryResult] = await Promise.all([
        withTimeout(
          prisma.$queryRaw<{ country: string; cnt: number }[]>`
            SELECT country, COUNT(*)::int as cnt FROM "Supplier" WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY cnt DESC LIMIT 50
          `,
          [] as { country: string; cnt: number }[]
        ),
        withTimeout(
          prisma.$queryRaw<{ industry: string; cnt: number }[]>`
            SELECT industry, COUNT(*)::int as cnt FROM "Supplier" WHERE industry IS NOT NULL AND industry != '' GROUP BY industry ORDER BY cnt DESC LIMIT 30
          `,
          [] as { industry: string; cnt: number }[]
        ),
      ]);

      let leadCount = 0;
      try {
        const [leadRow] = await db.select({ count: sql<number>`count(*)` }).from(leads);
        leadCount = Number(leadRow?.count ?? 0);
      } catch {}

      const mergedByCode = new Map<string, { display: string; count: number }>();
      for (const row of countryResult) {
        const code = getCountryCode(row.country);
        if (code === "SKIP" || code === "XX") continue;
        const display = getDisplayForCode(code);
        const existing = mergedByCode.get(code);
        if (existing) {
          existing.count += row.cnt;
        } else {
          mergedByCode.set(code, { display, count: row.cnt });
        }
      }
      const topCountries = Array.from(mergedByCode.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map((c) => ({ country: c.display, count: c.count }));

      const result = {
        suppliers: supplierCount > 0 ? supplierCount : PLATFORM_STATS.suppliers,
        countries: mergedByCode.size > 0 ? mergedByCode.size : PLATFORM_STATS.countries,
        industries: industryResult.length > 0 ? industryResult.length : PLATFORM_STATS.industries,
        leads: leadCount > 0 ? leadCount : PLATFORM_STATS.leads,
        topCountries: topCountries.length > 0 ? topCountries : PLATFORM_STATS.topCountries,
      };

      statsCache = { data: result, ts: Date.now() };
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(result);
    } catch (err) {
      console.error("Stats endpoint error:", err);
      res.json(FALLBACK_STATS);
    }
  });

  // ============================================================================
  // Admin: Run trigram indexes (Railway'de SQL arayüzü yok; uygulama içinden çalıştır)
  // ?status=1 → hangi indekslerin mevcut olduğunu göster
  // ?index=N → sadece N numaralı indeksi oluştur (0=extension, 1-7=indeksler)
  // Örnek: index=0, sonra index=1, index=2, ... (her biri ayrı istek; timeout riskini azaltır)
  // ============================================================================
  app.get("/api/admin/run-trigram-indexes", async (req: Request, res: Response) => {
    const secret = process.env.RUN_INDEXES_SECRET || "smartseek-index-2025";
    if (req.query.secret !== secret) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.setHeader("Cache-Control", "no-store");

    if (req.query.status === "1") {
      const ext = (await prisma.$queryRawUnsafe(
        `SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') as exists`
      )) as [{ exists: boolean }];
      const extOk = ext[0]?.exists ?? false;
      const names = [
        "Supplier_companyName_trgm_idx",
        "Supplier_products_trgm_idx",
        "Supplier_industry_trgm_idx",
        "Supplier_subIndustry_trgm_idx",
        "Supplier_description_trgm_idx",
        "Supplier_city_trgm_idx",
        "Supplier_country_trgm_idx",
      ];
      const rows = (await prisma.$queryRawUnsafe(
        `SELECT indexname FROM pg_indexes WHERE tablename = 'Supplier' AND indexname LIKE '%trgm%'`
      )) as { indexname: string }[];
      const existing = new Set(rows.map((r) => r.indexname));
      const indexStatus = names.map((n) => ({ name: n, exists: existing.has(n) }));
      const next = !extOk ? 0 : (indexStatus.findIndex((i) => !i.exists) >= 0 ? indexStatus.findIndex((i) => !i.exists) + 1 : 8);
      return res.json({
        extensionOk: extOk,
        indexes: indexStatus,
        next,
      });
    }

    const statements = [
      `CREATE EXTENSION IF NOT EXISTS pg_trgm`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_companyName_trgm_idx" ON "Supplier" USING gin ("companyName" gin_trgm_ops)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_products_trgm_idx" ON "Supplier" USING gin ("products" gin_trgm_ops)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_industry_trgm_idx" ON "Supplier" USING gin ("industry" gin_trgm_ops)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_subIndustry_trgm_idx" ON "Supplier" USING gin ("subIndustry" gin_trgm_ops)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_description_trgm_idx" ON "Supplier" USING gin ("description" gin_trgm_ops)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_city_trgm_idx" ON "Supplier" USING gin ("city" gin_trgm_ops)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "Supplier_country_trgm_idx" ON "Supplier" USING gin ("country" gin_trgm_ops)`,
    ];
    const idx = req.query.index !== undefined ? parseInt(String(req.query.index), 10) : -1;
    if (idx >= 0 && idx < statements.length) {
      try {
        await prisma.$executeRawUnsafe(statements[idx]);
        return res.json({ ok: true, index: idx, msg: "OK" });
      } catch (e: any) {
        if (e?.code === "42P07") return res.json({ ok: true, index: idx, msg: "Already exists" });
        return res.status(500).json({ ok: false, index: idx, error: e?.message || String(e) });
      }
    }

    const results: string[] = [];
    for (let i = 0; i < statements.length; i++) {
      try {
        await prisma.$executeRawUnsafe(statements[i]);
        results.push(`OK: ${statements[i].slice(0, 55)}...`);
      } catch (e: any) {
        if (e?.code === "42P07") results.push(`SKIP (exists): ${statements[i].slice(0, 45)}...`);
        else results.push(`ERR: ${e?.message || String(e)}`);
      }
    }
    res.json({ done: true, results });
  });

  // ============================================================================
  // Supplier Discovery API
  // ============================================================================

  type FeaturedSupplier = {
    id: number;
    slug: string;
    company_name: string;
    country: string;
    country_code: string;
    city: string;
    industry: string;
    sub_industry: string;
    products: string[];
    tagline: string;
    type: "manufacturer" | "trader" | "distributor";
    verified: boolean;
    rating: number;
    employee_count_band: "10-50" | "50-200" | "200-500" | "500-1000" | "1000-5000" | "5000+";
    year_founded: number;
    is_curated: boolean;
  };

  const featuredSuppliers = FEATURED_SUPPLIERS as FeaturedSupplier[];

  app.get("/api/public/suppliers", (req: Request, res: Response) => {
    const { q, country, industry, limit = "30" } = req.query;
    let results = [...featuredSuppliers];

    if (typeof q === "string" && q.trim()) {
      const query = q.toLowerCase().trim();
      const tokens = query.split(/\s+/).filter(Boolean);
      const searchable = (s: FeaturedSupplier) =>
        [
          s.company_name,
          s.industry,
          s.sub_industry,
          s.country,
          s.city,
          s.tagline,
          ...s.products,
        ]
          .join(" ")
          .toLowerCase();

      // Primary: all tokens must be present somewhere (handles multi-word queries reliably).
      let filtered = results
        .map((s) => {
          const haystack = searchable(s);
          const matchedTokenCount = tokens.filter((t) => haystack.includes(t)).length;
          return { s, matchedTokenCount };
        })
        .filter(({ matchedTokenCount }) => matchedTokenCount === tokens.length)
        .sort((a, b) => b.matchedTokenCount - a.matchedTokenCount)
        .map(({ s }) => s);

      // Fallback: if strict match returns nothing, allow partial token matches.
      if (filtered.length === 0 && tokens.length > 1) {
        filtered = results
          .map((s) => {
            const haystack = searchable(s);
            const matchedTokenCount = tokens.filter((t) => haystack.includes(t)).length;
            return { s, matchedTokenCount };
          })
          .filter(({ matchedTokenCount }) => matchedTokenCount > 0)
          .sort((a, b) => b.matchedTokenCount - a.matchedTokenCount)
          .map(({ s }) => s);
      }

      results = filtered;
    }

    if (typeof country === "string" && country.trim()) {
      const c = country.toLowerCase();
      results = results.filter((s) => s.country.toLowerCase() === c || s.country_code.toLowerCase() === c);
    }

    if (typeof industry === "string" && industry.trim()) {
      const i = industry.toLowerCase();
      results = results.filter((s) => s.industry.toLowerCase().includes(i));
    }

    results.sort((a, b) => b.rating - a.rating);
    const total = results.length;
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 30));
    const suppliers = results.slice(0, limitNum);

    res.json({
      suppliers,
      total,
      is_curated_sample: true,
      note: "Featured suppliers — full directory of 25.2M+ available in-app",
    });
  });

  app.get("/api/public/suppliers/:slug", (req: Request, res: Response) => {
    const { slug } = req.params;
    const supplier = featuredSuppliers.find((s) => s.slug === slug);

    if (!supplier) {
      return res.status(404).json({
        error: "Supplier not found",
        message: "This supplier is not in our featured directory. Sign up to access 25.2M+ suppliers.",
      });
    }

    res.json({ supplier, is_curated_sample: true });
  });

  // GET /api/suppliers Ã¢ÂÂ Search, filter, paginate
  app.get("/api/suppliers", async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    try {
      const {
        q,
        country,
        industry,
        verified,
        minRating,
        minScore,
        minOrderValue,
        sortBy = "rating",
        sortOrder = "desc",
        page = "1",
        limit = "20",
        lang,
      } = req.query;

      // Growth loop: guests see only the first FREE_LIMIT results
      const FREE_LIMIT = 3;
      const isGuest = !getUserId(req);

      const pageNum = isGuest ? 1 : Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = isGuest ? FREE_LIMIT : Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
      const skip = isGuest ? 0 : (pageNum - 1) * limitNum;

      const searchTerm = (q && typeof q === "string") ? q.trim() : "";
      const hasSearchQuery = searchTerm.length > 0;
      const hasNarrowingFilter = !!(country || industry || verified === "true" || minRating || minScore || minOrderValue);

      if (hasSearchQuery && !hasNarrowingFilter) {
        const tokenCount = searchTerm.split(/\s+/).filter(Boolean).length;
        const likelyBroadSingleTerm = tokenCount === 1 && searchTerm.length <= 10;
        if (likelyBroadSingleTerm) {
          return res.json({
            suppliers: [],
            pagination: { page: pageNum, limit: limitNum, total: null, totalPages: null },
            totalResults: null,
            totalKnown: false,
            guestLimited: isGuest,
            freeLimit: FREE_LIMIT,
            fallback: false,
            needFilter: true,
            message: "Please add a country or industry filter to speed up broad searches.",
          });
        }
      }

      // Build raw SQL conditions
      const conditions: PrismaSQL[] = [];

      if (hasSearchQuery) {
        conditions.push(pSql`search_vector @@ websearch_to_tsquery('simple', ${searchTerm})`);
      }

      if (country && typeof country === "string") {
        if (country === "Undefined") {
          conditions.push(pSql`(country = '' OR country IS NULL)`);
        } else {
          const { getCountryCode } = await import("./lib/countryCodes");
          const countryCode = getCountryCode(country);
          const countryParts: PrismaSQL[] = [pSql`country ILIKE ${country}`];
          if (countryCode && countryCode !== "XX" && countryCode !== "SKIP") {
            countryParts.push(pSql`"countryCode" ILIKE ${countryCode}`);
          }
          conditions.push(pSql`(${pJoin(countryParts, ' OR ')})`);
        }
      }

      if (industry && typeof industry === "string" && industry.trim()) {
        const ind = `%${industry.trim()}%`;
        conditions.push(pSql`industry ILIKE ${ind}`);
      }

      if (verified === "true") {
        conditions.push(pSql`verified = true`);
      }

      // Rating threshold: take most restrictive of minRating and minScore
      let ratingThreshold: number | null = null;
      if (minRating && typeof minRating === "string") {
        const r = parseFloat(minRating);
        if (!isNaN(r)) ratingThreshold = r;
      }
      if (minScore && typeof minScore === "string") {
        const s = parseFloat(minScore);
        if (!isNaN(s) && s > 0) {
          const r = s / 20;
          ratingThreshold = ratingThreshold !== null ? Math.max(ratingThreshold, r) : r;
        }
      }
      if (ratingThreshold !== null) {
        conditions.push(pSql`rating >= ${ratingThreshold}`);
      }

      if (minOrderValue && typeof minOrderValue === "string") {
        const mov = parseFloat(minOrderValue);
        if (!isNaN(mov) && mov > 0) {
          conditions.push(pSql`"minOrderValue" >= ${mov}`);
        }
      }

      const whereClause = conditions.length > 0
        ? pSql`WHERE ${pJoin(conditions, ' AND ')}`
        : pEmpty;

      // ORDER BY: FTS relevance when searching, fallback to sort params otherwise
      const validSortFields = ["rating", "reviewCount", "yearEstablished", "companyName", "createdAt"];
      const sortFieldSafe = validSortFields.includes(sortBy as string) ? (sortBy as string) : "rating";
      const sortDirSafe = sortOrder === "asc" ? "ASC" : "DESC";
      const orderClause = hasSearchQuery
        ? pSql`ORDER BY
            ts_rank(search_vector, websearch_to_tsquery('simple', ${searchTerm})) DESC,
            GREATEST(
              similarity(coalesce("companyName", ''), ${searchTerm}),
              similarity(coalesce(products, ''), ${searchTerm})
            ) DESC,
            verified DESC,
            rating DESC`
        : pSql`ORDER BY ${pRaw(`"${sortFieldSafe}"`)} ${pRaw(sortDirSafe)}`;

      type SupplierRow = {
        id: number; companyName: string | null; slug: string | null;
        country: string | null; countryCode: string | null; city: string | null;
        industry: string | null; subIndustry: string | null;
        products: string | null; certifications: string | null; description: string | null;
        verified: boolean | null; rating: number | null; reviewCount: number | null;
        responseTime: string | null; minOrderValue: number | null;
        yearEstablished: number | null; employeeCount: number | null;
        annualRevenue: number | null; dataSource: string | null;
        registryUrl: string | null; registryId: string | null;
        sicCode: string | null; contactVerified: boolean | null;
      };

      const hasFilters = hasSearchQuery || country || industry || verified === "true" || ratingThreshold !== null || minOrderValue;

      let suppliers: SupplierRow[] = [];
      let total: number | null = 0;
      const isFallback = false;

      try {
        const [rows, countResult] = await Promise.all([
          prisma.$queryRaw<SupplierRow[]>`
            SELECT id, "companyName", slug, country, "countryCode", city,
                   industry, "subIndustry", products, certifications,
                   description, verified, rating, "reviewCount", "responseTime",
                   "minOrderValue", "yearEstablished", "employeeCount",
                   "annualRevenue", data_source AS "dataSource", registry_url AS "registryUrl", registry_id AS "registryId",
                   sic_code AS "sicCode", contact_verified AS "contactVerified"
            FROM "Supplier"
            ${whereClause}
            ${orderClause}
            LIMIT ${limitNum} OFFSET ${skip}
          `,
          hasSearchQuery
            ? Promise.resolve(null)
            : hasFilters
              ? Promise.race([
                  prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint AS cnt FROM "Supplier" ${whereClause}`
                    .then((r: [{ cnt: bigint }]) => Number(r[0]?.cnt ?? 0)),
                  new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
                ]).catch(() => null)
              : prisma.$queryRaw<[{ cnt: bigint }]>`SELECT reltuples::bigint AS cnt FROM pg_class WHERE relname = 'Supplier'`
                  .then((r: [{ cnt: bigint }]) => Number(r[0]?.cnt ?? 0))
                  .catch(() => null),
        ]);
        suppliers = rows;
        total = typeof countResult === "number" ? countResult : null;
      } catch (sqlErr) {
        console.error("GET /api/suppliers SQL error:", sqlErr);
        return res.json({
          suppliers: [],
          pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 },
          totalResults: 0,
          guestLimited: isGuest,
          freeLimit: FREE_LIMIT,
          fallback: false,
        });
      }

      // Never show "0 suppliers found" when we have results
      if (suppliers.length > 0 && total === 0) total = suppliers.length;
      const totalKnown = total !== null;

      // Format company names and locations for display (title case)
      const toTitleCase = (str: string | null | undefined): string => {
        if (!str || typeof str !== "string") return str || "";
        const abbr = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "plc", "sa", "ag", "nv", "bv", "corp", "pvt", "uk", "us"]);
        return str.replace(/\w\S*/g, (w) => {
          const lower = w.toLowerCase();
          if (abbr.has(lower)) return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
      };
      const formatLocation = (str: string | null | undefined): string => {
        if (!str || typeof str !== "string") return str || "";
        return str.split(",").map((p) => toTitleCase(p.trim())).filter(Boolean).join(", ");
      };

      // Parse JSON string fields and apply formatting (bulletproof: handle strings, objects, null)
      const safeString = (v: unknown): string =>
        v == null ? "" : typeof v === "string" ? v : typeof (v as { name?: string }).name === "string" ? (v as { name: string }).name : String(v);
      const parsed = (suppliers as (SupplierRow & Record<string, unknown>)[]).map((s) => {
        let products: unknown[] = [];
        let certifications: unknown[] = [];
        try {
          const raw = s.products;
          if (raw != null && typeof raw === "string") {
            const p = JSON.parse(raw);
            products = Array.isArray(p) ? p : [];
          }
        } catch {
          products = [];
        }
        try {
          const raw = s.certifications;
          if (raw != null && typeof raw === "string") {
            const c = JSON.parse(raw);
            certifications = Array.isArray(c) ? c : [];
          }
        } catch {
          certifications = [];
        }
        return {
          ...s,
          products: products.map((p) => toTitleCase(safeString(p))).filter(Boolean),
          certifications: certifications.map((c) => toTitleCase(safeString(c))).filter(Boolean),
          companyName: toTitleCase(s.companyName ?? ""),
          city: formatLocation(s.city ?? ""),
          country: formatLocation(s.country ?? ""),
          industry: toTitleCase(s.industry ?? ""),
          subIndustry: s.subIndustry ? toTitleCase(s.subIndustry) : s.subIndustry,
        };
      });

      res.json({
        suppliers: parsed,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: total == null ? null : Math.ceil(total / limitNum),
        },
        totalResults: total,
        totalKnown,
        guestLimited: isGuest,
        freeLimit: FREE_LIMIT,
        fallback: isFallback,
      });
    } catch (error) {
      console.error("GET /api/suppliers error:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  // GET /api/suppliers/filters Ã¢ÂÂ Get available filter options (proper-cased, deduplicated)
  let filtersCache: { data: any; ts: number } | null = null;
  const FILTERS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  app.get("/api/suppliers/filters", async (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

    if (filtersCache && Date.now() - filtersCache.ts < FILTERS_CACHE_TTL) {
      return res.json(filtersCache.data);
    }

    try {
      const { getCountryCode, getDisplayForCode } = await import("./lib/countryCodes");

      const timeoutMs = 30000;
      const withTimeout = <T>(p: Promise<T>, fallback: T): Promise<T> =>
        Promise.race([p, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs))]);

      const [countries, industries] = await Promise.all([
        withTimeout(
          prisma.$queryRaw<{ country: string; cnt: number }[]>`
            SELECT country, COUNT(*)::int as cnt FROM "Supplier" WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY cnt DESC LIMIT 60
          `,
          [] as { country: string; cnt: number }[]
        ),
        withTimeout(
          prisma.$queryRaw<{ industry: string; cnt: number }[]>`
            SELECT industry, COUNT(*)::int as cnt FROM "Supplier" WHERE industry IS NOT NULL AND industry != '' GROUP BY industry ORDER BY cnt DESC LIMIT 40
          `,
          [] as { industry: string; cnt: number }[]
        ),
      ]);

      const mergedByCode = new Map<string, { display: string; count: number }>();
      for (const c of countries) {
        const code = getCountryCode(c.country);
        if (code === "SKIP" || code === "XX") continue;
        const display = getDisplayForCode(code);
        const existing = mergedByCode.get(code);
        if (existing) {
          existing.count += c.cnt;
        } else {
          mergedByCode.set(code, { display, count: c.cnt });
        }
      }
      const countryList = Array.from(mergedByCode.values())
        .sort((a, b) => b.count - a.count)
        .map((c) => ({ name: c.display, count: c.count }));

      const result = {
        countries: countryList,
        industries: industries.map((i) => ({ name: i.industry, count: i.cnt })),
      };

      filtersCache = { data: result, ts: Date.now() };
      res.json(result);
    } catch (error) {
      console.error("GET /api/suppliers/filters error:", error);
      res.status(200).json({ countries: [], industries: [] });
    }
  });

  // GET /api/suppliers/:slug Ã¢ÂÂ Supplier detail (contact fields only for paid users)
  // Must be before /:slug for correct routing
  app.get("/api/suppliers/by-id/:id", async (req: Request, res: Response) => {
    try {
      const supplier = await prisma.supplier.findUnique({ where: { id: req.params.id } });
      if (!supplier) return res.status(404).json({ error: "Supplier not found" });
      const userId = getUserId(req);
      let canViewContact = false;
      if (userId) {
        const profile = await storage.getUserProfile(userId);
        canViewContact = profile ? profile.plan !== "free" : false;
      }
      const safeParse = (val: string | null, fallback: unknown) => {
        if (!val || typeof val !== "string") return fallback;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      };
      const toTitleCase = (str: string | null | undefined): string => {
        if (!str || typeof str !== "string") return str || "";
        const abbr = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "plc", "sa", "ag", "nv", "bv", "corp", "pvt", "uk", "us"]);
        return str.replace(/\w\S*/g, (w) => {
          const lower = w.toLowerCase();
          if (abbr.has(lower)) return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
      };
      const formatLocation = (str: string | null | undefined): string => {
        if (!str || typeof str !== "string") return str || "";
        return str.split(",").map((p) => toTitleCase(p.trim())).filter(Boolean).join(", ");
      };
      const payload: Record<string, unknown> = {
        ...supplier,
        companyName: toTitleCase(supplier.companyName),
        city: formatLocation(supplier.city),
        country: formatLocation(supplier.country),
        industry: toTitleCase(supplier.industry),
        subIndustry: supplier.subIndustry ? toTitleCase(supplier.subIndustry) : supplier.subIndustry,
        products: safeParse(supplier.products, []),
        certifications: safeParse(supplier.certifications, []),
        paymentTerms: safeParse(supplier.paymentTerms, []),
        exportMarkets: safeParse(supplier.exportMarkets, []),
      };
      if (!canViewContact) {
        delete payload.contactEmail;
        delete payload.contactPhone;
        delete payload.website;
      }
      res.json(payload);
    } catch (error) {
      console.error("GET /api/suppliers/by-id/:id error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  app.get("/api/suppliers/:slug", async (req: Request, res: Response) => {
    try {
      let supplier = await prisma.supplier.findUnique({
        where: { slug: req.params.slug },
      });
      if (!supplier) {
        supplier = await prisma.supplier.findFirst({
          where: { slug: { equals: req.params.slug, mode: "insensitive" } },
        });
      }
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const userId = getUserId(req);
      let canViewContact = false;
      if (userId) {
        const profile = await storage.getUserProfile(userId);
        canViewContact = profile ? profile.plan !== "free" : false;
      }

      const safeParse = (val: string | null, fallback: unknown) => {
        if (!val || typeof val !== "string") return fallback;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      };

      const toTitleCase = (str: string | null | undefined): string => {
        if (!str || typeof str !== "string") return str || "";
        const abbr = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "plc", "sa", "ag", "nv", "bv", "corp", "pvt", "uk", "us"]);
        return str.replace(/\w\S*/g, (w) => {
          const lower = w.toLowerCase();
          if (abbr.has(lower)) return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
      };
      const formatLocation = (str: string | null | undefined): string => {
        if (!str || typeof str !== "string") return str || "";
        return str.split(",").map((p) => toTitleCase(p.trim())).filter(Boolean).join(", ");
      };

      const payload: Record<string, unknown> = {
        ...supplier,
        companyName: toTitleCase(supplier.companyName),
        city: formatLocation(supplier.city),
        country: formatLocation(supplier.country),
        industry: toTitleCase(supplier.industry),
        subIndustry: supplier.subIndustry ? toTitleCase(supplier.subIndustry) : supplier.subIndustry,
        products: safeParse(supplier.products, []),
        certifications: safeParse(supplier.certifications, []),
        paymentTerms: safeParse(supplier.paymentTerms, []),
        exportMarkets: safeParse(supplier.exportMarkets, []),
      };

      if (!canViewContact) {
        delete payload.contactEmail;
        delete payload.contactPhone;
        delete payload.website;
      }

      res.json(payload);
    } catch (error) {
      console.error("GET /api/suppliers/:slug error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  // ============================================================================
  // Lead Generation API
  // ============================================================================

  // POST /api/leads Ã¢ÂÂ Submit a lead/contact request
  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      const { supplierId, buyerName, buyerEmail, buyerPhone, buyerCompany, message, productInterest, source } = req.body;

      if (!supplierId || !buyerName || !buyerEmail || !message) {
        return res.status(400).json({ error: "Missing required fields: supplierId, buyerName, buyerEmail, message" });
      }

      // Verify supplier exists
      const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const lead = await prisma.lead.create({
        data: {
          supplierId,
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || null,
          buyerCompany: buyerCompany || null,
          message,
          productInterest: productInterest || null,
          source: source || "supplier_page",
        },
      });

      res.status(201).json(lead);
    } catch (error) {
      console.error("POST /api/leads error:", error);
      res.status(500).json({ error: "Failed to submit lead" });
    }
  });

  // ============================================================================
  // RFQ API
  // ============================================================================

  // POST /api/rfqs Ã¢ÂÂ Submit an RFQ
  app.post("/api/rfqs", async (req: Request, res: Response) => {
    try {
      const {
        supplierId, buyerName, buyerEmail, buyerPhone, buyerCompany, buyerCountry,
        productName, productCategory, hsCode, originPreference,
        quantity, unit, targetPrice, currency,
        specifications, incoterm, destinationPort, deliveryDate, notes,
      } = req.body;

      if (!buyerName || !buyerEmail || !productName || !quantity) {
        return res.status(400).json({ error: "Missing required fields: buyerName, buyerEmail, productName, quantity" });
      }

      const qty = typeof quantity === "number" ? quantity : parseInt(String(quantity), 10);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
      }

      const created = await prisma.$queryRawUnsafe(
        `INSERT INTO "RFQ" ("id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt")
         VALUES (gen_random_uuid()::text,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'pending',$17,NOW(),NOW())
         RETURNING "id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt"`,
        supplierId || null,
        buyerName,
        String(buyerEmail).trim().toLowerCase(),
        buyerPhone || null,
        buyerCompany || null,
        buyerCountry || null,
        productName,
        productCategory || null,
        qty,
        unit || "pcs",
        targetPrice ? parseFloat(targetPrice) : null,
        currency || "USD",
        specifications || null,
        incoterm || null,
        destinationPort || null,
        deliveryDate || null,
        notes || null
      );
      const rfq = created[0];

      sendRfqConfirmationEmail(String(buyerEmail).trim().toLowerCase(), rfq.id, String(productName))
        .catch((err) => console.warn("sendRfqConfirmationEmail failed:", err));
      sendOpsAlertEmail("New RFQ submitted (/api/rfqs)", {
        rfqId: rfq.id,
        buyerName,
        buyerEmail,
        buyerCompany: buyerCompany || "",
        productName,
        quantity: qty,
        source: "api/rfqs",
      }).catch((err) => console.warn("sendOpsAlertEmail failed:", err));

      res.status(201).json(rfq);
    } catch (error) {
      console.error("POST /api/rfqs error:", error);
      res.status(500).json({ error: "Failed to submit RFQ" });
    }
  });

  // GET /api/rfqs/:id - public RFQ status lookup (id + email match required)
  app.get("/api/rfqs/:id", async (req: Request, res: Response) => {
    try {
      const email = (req.query.email as string | undefined)?.trim().toLowerCase();
      if (!email) return res.status(400).json({ error: "email query param required" });
      const rows = await prisma.$queryRawUnsafe(
        `SELECT "id","status","productName","productCategory","quantity","unit","currency","targetPrice","incoterm","destinationPort","deliveryDate","buyerEmail","buyerCompany","createdAt","updatedAt"
         FROM "RFQ" WHERE "id" = $1 LIMIT 1`,
        req.params.id
      );
      const rfq = rows[0];
      if (!rfq || rfq.buyerEmail.toLowerCase() !== email) {
        return res.status(404).json({ error: "RFQ not found" });
      }
      const { buyerEmail: _omit, ...safe } = rfq;
      res.json(safe);
    } catch (error) {
      console.error("GET /api/rfqs/:id error:", error);
      res.status(500).json({ error: "Failed to fetch RFQ" });
    }
  });

  // GET /api/rfqs - Get RFQs by buyer email
  app.get("/api/rfqs", async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email query parameter required" });
      }

      const rfqs = await prisma.$queryRawUnsafe(
        `SELECT "id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt"
         FROM "RFQ" WHERE "buyerEmail" = $1 ORDER BY "createdAt" DESC`,
        email
      );

      res.json(rfqs);
    } catch (error) {
      console.error("GET /api/rfqs error:", error);
      res.status(500).json({ error: "Failed to fetch RFQs" });
    }
  });

  // ============================================================================
  // Supplier Applications — "Become a Supplier" public intake
  // ============================================================================

  app.post("/api/supplier-applications", async (req: Request, res: Response) => {
    try {
      const b = req.body ?? {};
      const required = ["companyName", "country", "industry", "products", "contactName", "contactEmail"];
      for (const k of required) {
        if (!b[k] || (typeof b[k] === "string" && !b[k].trim())) {
          return res.status(400).json({ error: `Missing required field: ${k}` });
        }
      }
      const email = String(b.contactEmail).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid contact email" });
      }

      // Lightweight rate-limit: 1 application per email per 60s window
      const recent = await prisma.supplierApplication.findFirst({
        where: { contactEmail: email, createdAt: { gt: new Date(Date.now() - 60_000) } },
        select: { id: true },
      });
      if (recent) {
        return res.status(429).json({ error: "Application already received. Please wait a moment before resubmitting." });
      }

      const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
      const ua = (req.headers["user-agent"] as string | undefined) || null;

      const app_ = await prisma.supplierApplication.create({
        data: {
          companyName: String(b.companyName).trim(),
          website: b.website ? String(b.website).trim() : null,
          country: String(b.country).trim(),
          countryCode: b.countryCode ? String(b.countryCode).trim().toUpperCase() : null,
          city: b.city ? String(b.city).trim() : null,
          registryNumber: b.registryNumber ? String(b.registryNumber).trim() : null,
          registryAuthority: b.registryAuthority ? String(b.registryAuthority).trim() : null,
          yearEstablished: b.yearEstablished ? parseInt(String(b.yearEstablished), 10) || null : null,
          employeeBand: b.employeeBand ? String(b.employeeBand).trim() : null,

          industry: String(b.industry).trim(),
          subIndustry: b.subIndustry ? String(b.subIndustry).trim() : null,
          products: String(b.products).trim(),
          certifications: b.certifications ? String(b.certifications).trim() : null,
          exportMarkets: b.exportMarkets ? String(b.exportMarkets).trim() : null,
          minOrderValue: b.minOrderValue ? parseFloat(String(b.minOrderValue)) || null : null,
          currency: b.currency ? String(b.currency).trim().toUpperCase() : "USD",
          leadTimeDays: b.leadTimeDays ? parseInt(String(b.leadTimeDays), 10) || null : null,
          paymentTerms: b.paymentTerms ? String(b.paymentTerms).trim() : null,
          incoterms: b.incoterms ? String(b.incoterms).trim() : null,

          contactName: String(b.contactName).trim(),
          contactRole: b.contactRole ? String(b.contactRole).trim() : null,
          contactEmail: email,
          contactPhone: b.contactPhone ? String(b.contactPhone).trim() : null,

          status: "pending",
          source: "web",
          ipAddress: ip,
          userAgent: ua,
        },
        select: { id: true, status: true, createdAt: true },
      });

      sendOpsAlertEmail("New supplier application", {
        applicationId: app_.id,
        companyName: b.companyName,
        country: b.country,
        industry: b.industry,
        contactName: b.contactName,
        contactEmail: email,
      }).catch((err) => console.warn("sendOpsAlertEmail failed:", err));

      res.status(201).json(app_);
    } catch (error) {
      console.error("POST /api/supplier-applications error:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Admin: list + moderate supplier applications
  app.get("/api/admin/supplier-applications", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    const profile = await storage.getUserProfile(userId).catch(() => null);
    if (!profile || profile.role !== "admin") return res.status(403).json({ error: "Admin only" });

    const status = (req.query.status as string | undefined) || undefined;
    const apps = await prisma.supplierApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    res.json(apps);
  });

  app.patch("/api/admin/supplier-applications/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    const profile = await storage.getUserProfile(userId).catch(() => null);
    if (!profile || profile.role !== "admin") return res.status(403).json({ error: "Admin only" });

    const { status, reviewNote } = req.body ?? {};
    const allowed = new Set(["pending", "approved", "rejected", "needs_info"]);
    if (status && !allowed.has(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const updated = await prisma.supplierApplication.update({
      where: { id: req.params.id },
      data: {
        ...(status ? { status } : {}),
        ...(reviewNote !== undefined ? { reviewNote } : {}),
        reviewer: userId,
      },
    });
    res.json(updated);
  });

  // ============================================================================
  // Integrations API (OAuth for SAP Ariba, Oracle, Salesforce, etc.)
  // ============================================================================

  app.get("/api/integrations", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const integrations = await getUserIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      console.error("GET /api/integrations error:", error);
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations/:slug/connect", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const provider = SLUG_TO_PROVIDER[req.params.slug];
    if (!provider) {
      return res.status(400).json({ error: "Unknown integration" });
    }
    try {
      // Use PUBLIC_APP_URL if set (fixes redirect_uri_mismatch when behind proxy or multiple domains)
      const baseUrl =
        process.env.PUBLIC_APP_URL?.replace(/\/$/, "") ||
        `${req.protocol}://${req.get("host") || ""}`;
      const result = await getAuthorizationUrl(provider, userId, baseUrl);
      if ("error" in result) {
        return res.status(400).json({ error: result.error });
      }
      res.json({ url: result.url, state: result.state });
    } catch (error) {
      console.error("POST /api/integrations/connect error:", error);
      res.status(500).json({ error: "Failed to start OAuth" });
    }
  });

  app.get("/api/integrations/oauth/callback", async (req: Request, res: Response) => {
    const { code, state } = req.query;
    if (!code || !state || typeof code !== "string" || typeof state !== "string") {
      return res.redirect("/integrations?error=missing_params");
    }
    try {
      const stateRecord = await prisma.integrationOAuthState.findUnique({ where: { state } });
      const provider = stateRecord?.provider as IntegrationProvider | undefined;
      if (!provider) {
        return res.redirect("/integrations?error=invalid_state");
      }
      const result = await exchangeCodeForTokens(provider, code, state);
      if (!result.success) {
        return res.redirect(`/integrations?error=${encodeURIComponent(result.error || "unknown")}`);
      }
      // Redirect to dashboard or integrations page with success
      res.redirect("/integrations?connected=1");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/integrations?error=callback_failed");
    }
  });

  app.delete("/api/integrations/:slug", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const provider = SLUG_TO_PROVIDER[req.params.slug];
    if (!provider) {
      return res.status(400).json({ error: "Unknown integration" });
    }
    try {
      await disconnectIntegration(userId, provider);
      res.json({ success: true });
    } catch (error) {
      console.error("DELETE /api/integrations error:", error);
      res.status(500).json({ error: "Failed to disconnect" });
    }
  });


  // ===== Subscribe / Newsletter =====
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email address is required" });
      }
      const trimmed = email.toLowerCase().trim();

      // Persist to newsletter_subscribers table (reuse same table as /api/newsletter/subscribe)
      try {
        const { pool } = await import("./db");
        await pool.query(`
          CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `);
        const result = await pool.query(
          `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id`,
          [trimmed]
        );
        // Send confirmation email + sync to HubSpot only for new subscribers
        if (result.rowCount && result.rowCount > 0) {
          sendSubscribeConfirmationEmail(trimmed).catch((err: Error) =>
            console.warn("[subscribe] Confirmation email failed:", err?.message)
          );
          upsertHubSpotContact(trimmed, { source: "subscribe" }).catch((err: Error) =>
            console.warn("[subscribe] HubSpot sync failed:", err?.message)
          );
        }
      } catch (dbErr: any) {
        // Non-fatal — still return success if DB is unavailable
        console.warn("[subscribe] DB persist failed:", dbErr?.message);
        sendSubscribeConfirmationEmail(trimmed).catch((err: Error) =>
          console.warn("[subscribe] Confirmation email failed:", err?.message)
        );
        upsertHubSpotContact(trimmed, { source: "subscribe" }).catch((err: Error) =>
          console.warn("[subscribe] HubSpot sync failed:", err?.message)
        );
      }

      res.json({ success: true, message: "Subscribed successfully" });
    } catch (error: any) {
      console.error("Subscribe error:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // ============================================================================
  // Tech Intelligence API
  // ============================================================================

  const techCache = new Map<string, { data: TechStackResult; ts: number }>();
  const TECH_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours — tech stacks rarely change

  app.get("/api/tech-intelligence", async (req: Request, res: Response) => {
    const domain = (req.query.domain as string | undefined)?.trim();

    if (!domain) {
      return res.status(400).json({ error: "domain parameter is required" });
    }

    const cacheKey = domain.toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    const cached = techCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < TECH_CACHE_TTL) {
      return res.json(cached.data);
    }

    try {
      const result = await getTechStack(domain);
      techCache.set(cacheKey, { data: result, ts: Date.now() });
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg === "actor-not-found") {
        return res.status(503).json({ error: "Tech stack detector unavailable" });
      }
      if (msg === "run-timeout-exceeded") {
        return res.status(504).json({ error: "Tech stack detection timed out" });
      }
      if (msg.includes("APIFY_TOKEN")) {
        return res.status(503).json({ error: "Tech intelligence service not configured" });
      }
      console.error("GET /api/tech-intelligence error:", err);
      res.status(500).json({ error: "Failed to detect tech stack" });
    }
  });

  // ============================================================================
  // Data Collection Pipeline  (/api/pipeline)
  // ============================================================================

  // ============================================================================
  // Directory Scraper API  (/api/scraper)
  // ============================================================================

  /**
   * POST /api/scraper/run
   * Body: { source?: "clutch"|"g2"|"goodfirms"|"all", maxPages?: number, categories?: string[] }
   * Runs the scraper in the background and returns immediately.
   */
  app.post("/api/scraper/run", async (req: Request, res: Response) => {
    const { source = "all", maxPages = 3, categories = [] } = req.body ?? {};
    const opts = { maxPages: Math.min(parseInt(maxPages, 10) || 3, 20), categories };

    // Fire-and-forget
    const run = source === "all"
      ? scrapeAll(opts)
      : scrapeSource(source as ScraperSource, opts);

    run
      .then(result => console.log("[scraper] Finished:", result))
      .catch(e => console.error("[scraper] Failed:", e.message));

    res.json({ message: `Scraping ${source} started`, source, maxPages: opts.maxPages });
  });

  /** GET /api/scraper/stats — record counts per source */
  app.get("/api/scraper/stats", async (_req: Request, res: Response) => {
    try {
      res.json(await getCompanyStats());
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/companies
   * ?source=clutch&country=US&industry=IT&page=1&limit=50
   */
  app.get("/api/companies", async (req: Request, res: Response) => {
    const { source, country, industry, page = "1", limit = "50" } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: Record<string, unknown> = {};
    if (source)   where.source   = source;
    if (country)  where.country  = { contains: country, mode: "insensitive" };
    if (industry) where.industry = { contains: industry, mode: "insensitive" };

    try {
      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip,
          take: Math.min(parseInt(limit), 200),
          orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        }),
        prisma.company.count({ where }),
      ]);
      res.json({ total, page: parseInt(page), companies });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** GET /api/companies/:id */
  app.get("/api/companies/:id", async (req: Request, res: Response) => {
    try {
      const company = await prisma.company.findUnique({ where: { id: req.params.id } });
      if (!company) return res.status(404).json({ error: "Not found" });
      res.json(company);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // ─── Website Crawler / Company Enrichment ────────────────────────────────────

  /**
   * POST /api/enrichment/crawl
   * Body: { domain: string, maxPages?: number, companyId?: string }
   * Crawls a company website and extracts emails, linkedins, phones, addresses, keywords.
   * Saves result to company_enrichments table.
   */
  app.post("/api/enrichment/crawl", async (req: Request, res: Response) => {
    try {
      const { domain, maxPages, companyId } = req.body ?? {};
      if (!domain || typeof domain !== "string") {
        return res.status(400).json({ error: "domain is required" });
      }
      const result = await crawlAndSave(domain, {
        maxPages: maxPages ? parseInt(String(maxPages), 10) : 20,
        companyId: companyId ?? undefined,
      });
      res.json({
        domain:       result.domain,
        emails:       result.emails,
        linkedins:    result.linkedins,
        phones:       result.phones,
        addresses:    result.addresses,
        keywords:     result.keywords,
        pagesVisited: result.pagesVisited,
        crawledAt:    result.crawledAt,
      });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/enrichment/:domain
   * Returns the saved enrichment record for a domain.
   */
  app.get("/api/enrichment/:domain", async (req: Request, res: Response) => {
    try {
      const record = await getCrawlResult(req.params.domain);
      if (!record) return res.status(404).json({ error: "No enrichment found for this domain" });
      res.json(record);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/enrichments?skip=0&take=50
   * Lists all enrichment records ordered by most recently crawled.
   */
  app.get("/api/enrichments", async (req: Request, res: Response) => {
    try {
      const skip = parseInt(String(req.query.skip ?? "0"), 10);
      const take = parseInt(String(req.query.take ?? "50"), 10);
      const records = await listEnrichments({ skip, take });
      res.json(records);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // ─── Lead Scoring ─────────────────────────────────────────────────────────────

  /**
   * POST /api/lead-score
   * Score a single company from supplied data (no DB lookup required).
   * Body: LeadScoringInput
   */
  app.post("/api/lead-score", async (req: Request, res: Response) => {
    try {
      const input = req.body ?? {};
      const result = await scoreCompany(input);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/lead-score/:domain
   * Auto-loads company + enrichment from DB, calls SimilarWeb if key is set,
   * persists score back to company_enrichments, returns full breakdown.
   */
  app.get("/api/lead-score/:domain", async (req: Request, res: Response) => {
    try {
      const result = await scoreDomain(req.params.domain);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * POST /api/lead-score/batch
   * Body: { domains: string[] }
   * Scores multiple domains sequentially, returns array of { domain, leadScore, tier }.
   */
  app.post("/api/lead-score/batch", async (req: Request, res: Response) => {
    try {
      const { domains } = req.body ?? {};
      if (!Array.isArray(domains) || domains.length === 0) {
        return res.status(400).json({ error: "domains array is required" });
      }
      if (domains.length > 100) {
        return res.status(400).json({ error: "Maximum 100 domains per batch" });
      }
      const results = await scoreBatch(domains);
      res.json(results);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/leads/top?take=50&tier=hot
   * Returns enriched companies ordered by lead_score desc.
   * tier filter: "hot" | "warm" | "cold"
   */
  app.get("/api/leads/top", async (req: Request, res: Response) => {
    try {
      const take = parseInt(String(req.query.take ?? "50"), 10);
      const tier = req.query.tier as string | undefined;
      const validTiers = ["hot", "warm", "cold"];
      const records = await getTopLeads({
        take,
        tier: validTiers.includes(tier ?? "") ? (tier as "hot" | "warm" | "cold") : undefined,
      });
      res.json(records);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** POST /api/pipeline/trigger — manually kick off a pipeline run */
  app.post("/api/pipeline/trigger", async (_req: Request, res: Response) => {
    try {
      const result = await triggerPipelineRun();
      if (!result.started) return res.status(409).json({ error: result.reason });
      res.json({ message: "Pipeline run started", running: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** GET /api/pipeline/status — current run state + last 10 runs */
  app.get("/api/pipeline/status", async (_req: Request, res: Response) => {
    try {
      const runs = await getPipelineRuns(10);
      res.json({ running: isPipelineRunning(), recentRuns: runs });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // ============================================================================
  // Supplier Graph Intelligence  (/api/graph)
  // ============================================================================

  // Initialise graph backend on startup (non-blocking)
  getGraphService().setup().catch(e =>
    console.warn("[graph] Setup deferred:", (e as Error).message)
  );

  /** PUT /api/graph/node — upsert a node (supplier / buyer / product) */
  app.put("/api/graph/node", async (req: Request, res: Response) => {
    const { id, type, name, country, industry, metadata } = req.body ?? {};
    if (!id || !type) return res.status(400).json({ error: "id and type are required" });
    if (!["supplier", "buyer", "product"].includes(type))
      return res.status(400).json({ error: "type must be supplier | buyer | product" });
    try {
      await getGraphService().upsertNode({ id, type, name, country, industry, metadata });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** PUT /api/graph/edge — upsert a relationship */
  app.put("/api/graph/edge", async (req: Request, res: Response) => {
    const { fromNode, toNode, relation, weight, metadata } = req.body ?? {};
    if (!fromNode || !toNode || !relation)
      return res.status(400).json({ error: "fromNode, toNode, relation are required" });
    try {
      await getGraphService().upsertEdge({ fromNode, toNode, relation, weight, metadata });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** DELETE /api/graph/node/:id */
  app.delete("/api/graph/node/:id", async (req: Request, res: Response) => {
    try {
      await getGraphService().deleteNode(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** GET /api/graph/node/:id */
  app.get("/api/graph/node/:id", async (req: Request, res: Response) => {
    try {
      const node = await getGraphService().getNode(req.params.id);
      if (!node) return res.status(404).json({ error: "Node not found" });
      res.json(node);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/graph/neighbors/:id
   *   ?relation=SUPPLIES&direction=out
   */
  app.get("/api/graph/neighbors/:id", async (req: Request, res: Response) => {
    const { relation, direction } = req.query as Record<string, string>;
    try {
      const neighbors = await getGraphService().getNeighbors(
        req.params.id,
        relation as GraphRelation | undefined,
        (direction as "in" | "out" | "both") || "both"
      );
      res.json(neighbors);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/graph/path?from=acme.com&to=steel-wire&maxDepth=6
   * Returns shortest path between two nodes.
   */
  app.get("/api/graph/path", async (req: Request, res: Response) => {
    const { from, to, maxDepth } = req.query as Record<string, string>;
    if (!from || !to) return res.status(400).json({ error: "from and to are required" });
    try {
      const path = await getGraphService().getShortestPath(from, to, maxDepth ? parseInt(maxDepth) : 6);
      if (!path) return res.status(404).json({ error: "No path found" });
      res.json(path);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/graph/alternatives/:supplierId?limit=10
   * Returns alternative/competing suppliers.
   */
  app.get("/api/graph/alternatives/:supplierId", async (req: Request, res: Response) => {
    const limit = parseInt((req.query.limit as string) ?? "10");
    try {
      const alts = await getGraphService().getAlternativeSuppliers(req.params.supplierId, limit);
      res.json(alts);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/graph/common-buyers?s1=acme.com&s2=globex.com
   * Returns buyers that purchase from both suppliers.
   */
  app.get("/api/graph/common-buyers", async (req: Request, res: Response) => {
    const { s1, s2 } = req.query as Record<string, string>;
    if (!s1 || !s2) return res.status(400).json({ error: "s1 and s2 supplier IDs are required" });
    try {
      const buyers = await getGraphService().getCommonBuyers(s1, s2);
      res.json(buyers);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/graph/supply-chain/:productId?depth=3
   * Returns all upstream suppliers for a product.
   */
  app.get("/api/graph/supply-chain/:productId", async (req: Request, res: Response) => {
    const depth = parseInt((req.query.depth as string) ?? "3");
    try {
      const chain = await getGraphService().getSupplyChain(req.params.productId, depth);
      res.json(chain);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /**
   * GET /api/graph/centrality?type=supplier&limit=20
   * Returns most-connected nodes (hub suppliers, key buyers, etc.).
   */
  app.get("/api/graph/centrality", async (req: Request, res: Response) => {
    const { type, limit } = req.query as Record<string, string>;
    try {
      const nodes = await getGraphService().getTopCentralNodes(
        type as "supplier" | "buyer" | "product" | undefined,
        limit ? parseInt(limit) : 20
      );
      res.json(nodes);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  /** GET /api/graph/stats — node/edge counts by type and relation */
  app.get("/api/graph/stats", async (_req: Request, res: Response) => {
    try {
      res.json(await getGraphService().getStats());
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // ============================================================================
  // Lead Capture System
  // ============================================================================

  /**
   * POST /api/rfq
   * Submit a Request for Quotation.
   * Works for both guests and authenticated buyers.
   */
  app.post("/api/rfq", async (req: Request, res: Response) => {
    const {
      buyerName, buyerEmail, buyerPhone, buyerCompany, buyerCountry, buyerWebsite,
      productName, productCategory, hsCode, quantity, unit, targetPrice, currency,
      specifications, sampleRequired,
      incoterm, originCountry, destinationCountry, destinationPort, deliveryDeadline,
      supplierId, priority, notes, source,
    } = req.body ?? {};

    if (!buyerName || !buyerEmail || !productName || !quantity) {
      return res.status(400).json({
        error: "Required: buyerName, buyerEmail, productName, quantity",
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const qty = typeof quantity === "number" ? quantity : parseInt(String(quantity), 10);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
      }

      let rfq: any;
      try {
        rfq = await prisma.rfqRequest.create({
          data: {
            buyerUserId:       getUserId(req) ?? null,
            buyerName,
            buyerEmail:        buyerEmail.trim().toLowerCase(),
            buyerPhone:        buyerPhone ?? null,
            buyerCompany:      buyerCompany ?? null,
            buyerCountry:      buyerCountry ?? null,
            buyerWebsite:      buyerWebsite ?? null,
            productName,
            productCategory:   productCategory ?? null,
            hsCode:            hsCode ?? null,
            quantity:          qty,
            unit:              unit ?? "pcs",
            targetPrice:       targetPrice != null ? parseFloat(targetPrice) : null,
            currency:          currency ?? "USD",
            specifications:    specifications ?? null,
            sampleRequired:    Boolean(sampleRequired),
            incoterm:          incoterm ?? null,
            originCountry:     originCountry ?? null,
            destinationCountry: destinationCountry ?? null,
            destinationPort:   destinationPort ?? null,
            deliveryDeadline:  deliveryDeadline ?? null,
            supplierId:        supplierId ?? null,
            priority:          priority ?? "normal",
            notes:             notes ?? null,
            source:            source ?? "web",
          },
        });
      } catch (e: any) {
        if (e?.code !== "P2021") throw e;
        // Fallback to legacy RFQ table if new rfq_requests table isn't deployed yet.
        const created = await prisma.$queryRawUnsafe(
          `INSERT INTO "RFQ" ("id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt")
           VALUES (gen_random_uuid()::text,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'pending',$17,NOW(),NOW())
           RETURNING "id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt"`,
          supplierId || null,
          buyerName,
          buyerEmail.trim().toLowerCase(),
          buyerPhone || null,
          buyerCompany || null,
          buyerCountry || null,
          productName,
          productCategory || null,
          qty,
          unit || "pcs",
          targetPrice != null ? parseFloat(targetPrice) : null,
          currency || "USD",
          specifications || null,
          incoterm || null,
          destinationPort || null,
          deliveryDeadline || null,
          notes || null
        );
        rfq = created[0];
      }

      sendRfqConfirmationEmail(String(buyerEmail).trim().toLowerCase(), rfq.id, String(productName))
        .catch((err) => console.warn("sendRfqConfirmationEmail failed:", err));
      sendOpsAlertEmail("New RFQ submitted (/api/rfq)", {
        rfqId: rfq.id,
        buyerName,
        buyerEmail,
        buyerCompany: buyerCompany || "",
        productName,
        quantity: qty,
        source: "api/rfq",
      }).catch((err) => console.warn("sendOpsAlertEmail failed:", err));
      res.status(201).json(rfq);
    } catch (e) {
      console.error("POST /api/rfq error:", e);
      res.status(500).json({ error: "Failed to submit RFQ" });
    }
  });

  /** GET /api/rfq — list RFQs for the authenticated buyer or by email (admin) */
  app.get("/api/rfq", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const emailQ = (req.query.email as string)?.trim().toLowerCase();

    if (!userId && !emailQ) {
      return res.status(401).json({ error: "Authentication or email param required" });
    }

    try {
      try {
        const rfqs = await prisma.rfqRequest.findMany({
          where: userId ? { buyerUserId: userId } : { buyerEmail: emailQ },
          orderBy: { createdAt: "desc" },
          include: { supplier: { select: { companyName: true, country: true, contactEmail: true } } },
        });
        return res.json(rfqs);
      } catch (e: any) {
        if (e?.code !== "P2021") throw e;
        const rfqs = await prisma.$queryRawUnsafe(
          `SELECT "id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt"
           FROM "RFQ" WHERE "buyerEmail" = $1 ORDER BY "createdAt" DESC`,
          emailQ
        );
        return res.json(rfqs);
      }
    } catch (e) {
      console.error("GET /api/rfq error:", e);
      res.status(500).json({ error: "Failed to fetch RFQs" });
    }
  });

  /** GET /api/rfq/:id — public RFQ lookup by id + email */
  app.get("/api/rfq/:id", async (req: Request, res: Response) => {
    try {
      const email = (req.query.email as string | undefined)?.trim().toLowerCase();
      if (!email) return res.status(400).json({ error: "email query param required" });
      try {
        const rfq = await prisma.rfqRequest.findUnique({ where: { id: req.params.id } });
        if (!rfq || rfq.buyerEmail.toLowerCase() !== email) {
          return res.status(404).json({ error: "RFQ not found" });
        }
        const { buyerEmail: _omit, ...safe } = rfq;
        return res.json(safe);
      } catch (e: any) {
        if (e?.code !== "P2021") throw e;
        const rows = await prisma.$queryRawUnsafe(
          `SELECT "id","supplierId","buyerName","buyerEmail","buyerPhone","buyerCompany","buyerCountry","productName","productCategory","quantity","unit","targetPrice","currency","specifications","incoterm","destinationPort","deliveryDate","status","notes","createdAt","updatedAt"
           FROM "RFQ" WHERE "id" = $1 LIMIT 1`,
          req.params.id
        );
        const rfq = rows[0];
        if (!rfq || rfq.buyerEmail.toLowerCase() !== email) {
          return res.status(404).json({ error: "RFQ not found" });
        }
        const { buyerEmail: _omit, ...safe } = rfq;
        return res.json(safe);
      }
    } catch (e) {
      console.error("GET /api/rfq/:id error:", e);
      res.status(500).json({ error: "Failed to fetch RFQ" });
    }
  });

  /** GET /api/admin/rfqs — admin inbox to see who requested what */
  app.get("/api/admin/rfqs", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    const profile = await storage.getUserProfile(userId).catch(() => null);
    if (!profile || profile.role !== "admin") return res.status(403).json({ error: "Admin only" });
    const status = (req.query.status as string | undefined) || undefined;
    try {
      const rfqs = await prisma.rfqRequest.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        take: 300,
        select: {
          id: true,
          status: true,
          buyerName: true,
          buyerEmail: true,
          buyerCompany: true,
          productName: true,
          productCategory: true,
          quantity: true,
          unit: true,
          createdAt: true,
        },
      });
      return res.json(rfqs);
    } catch (e: any) {
      try {
        if (e?.code !== "P2021") throw e;
        const rfqs = status
          ? await prisma.$queryRawUnsafe(
              `SELECT "id","status","buyerName","buyerEmail","buyerCompany","productName","productCategory","quantity","unit","createdAt"
               FROM "RFQ" WHERE "status" = $1 ORDER BY "createdAt" DESC LIMIT 300`,
              status
            )
          : await prisma.$queryRawUnsafe(
              `SELECT "id","status","buyerName","buyerEmail","buyerCompany","productName","productCategory","quantity","unit","createdAt"
               FROM "RFQ" ORDER BY "createdAt" DESC LIMIT 300`
            );
        return res.json(rfqs);
      } catch (inner) {
        console.error("GET /api/admin/rfqs error:", inner);
        return res.status(500).json({ error: "Failed to fetch RFQs" });
      }
    }
  });

  /**
   * POST /api/supplier-signup
   * Register a new supplier: creates a user account + supplier profile in one step.
   */
  app.post("/api/supplier-signup", async (req: Request, res: Response) => {
    const {
      // Auth fields
      email, password, firstName, lastName,
      // Profile fields
      companyName, domain, country, city, industry, subIndustry, description,
      employeeCount, yearEstablished, annualRevenue,
      products, certifications, exportMarkets, minOrderValue, currency,
      leadTimeDays, paymentTerms, contactPhone, website,
    } = req.body ?? {};

    if (!email || !password || !companyName || !country || !industry || !products) {
      return res.status(400).json({
        error: "Required: email, password, companyName, country, industry, products",
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
      const { users: usersTable } = await import("@shared/schema");
      const bcrypt = await import("bcryptjs");

      // Check duplicate email
      const existing = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email.trim().toLowerCase()))
        .limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [user] = await db
        .insert(usersTable)
        .values({
          email: email.trim().toLowerCase(),
          passwordHash,
          firstName:  firstName ?? null,
          lastName:   lastName ?? null,
          emailVerified: false,
        })
        .returning({ id: usersTable.id, email: usersTable.email });

      // Create user profile (role = seller)
      await storage.createUserProfile({ userId: user.id, role: "seller", plan: "free" });

      // Create supplier profile
      const profile = await prisma.supplierProfile.create({
        data: {
          userId:          user.id,
          companyName,
          domain:          domain ?? null,
          country,
          city:            city ?? null,
          industry,
          subIndustry:     subIndustry ?? null,
          description:     description ?? null,
          employeeCount:   employeeCount != null ? parseInt(employeeCount, 10) : null,
          yearEstablished: yearEstablished != null ? parseInt(yearEstablished, 10) : null,
          annualRevenue:   annualRevenue ?? null,
          products,
          certifications:  certifications ?? null,
          exportMarkets:   exportMarkets ?? null,
          minOrderValue:   minOrderValue != null ? parseFloat(minOrderValue) : null,
          currency:        currency ?? "USD",
          leadTimeDays:    leadTimeDays != null ? parseInt(leadTimeDays, 10) : null,
          paymentTerms:    paymentTerms ?? null,
          contactEmail:    email.trim().toLowerCase(),
          contactPhone:    contactPhone ?? null,
          website:         website ?? null,
          profileCompleted: Boolean(companyName && country && industry && products),
        },
      });

      res.status(201).json({
        message: "Supplier account created",
        userId: user.id,
        email: user.email,
        supplierProfileId: profile.id,
      });
    } catch (e) {
      console.error("POST /api/supplier-signup error:", e);
      res.status(500).json({ error: "Signup failed", detail: (e as Error).message });
    }
  });

  /**
   * POST /api/buyer-signup
   * Register a new buyer: creates a user account + buyer profile in one step.
   */
  app.post("/api/buyer-signup", async (req: Request, res: Response) => {
    const {
      email, password, firstName, lastName,
      company, country, industry, website, phone,
      annualPurchaseVolume, primaryCategories, preferredOrigins,
    } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Required: email, password" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
      const { users: usersTable } = await import("@shared/schema");
      const bcrypt = await import("bcryptjs");

      const existing = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email.trim().toLowerCase()))
        .limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [user] = await db
        .insert(usersTable)
        .values({
          email:      email.trim().toLowerCase(),
          passwordHash,
          firstName:  firstName ?? null,
          lastName:   lastName ?? null,
          emailVerified: false,
        })
        .returning({ id: usersTable.id, email: usersTable.email });

      // Create user profile (role = buyer) with 2 free trial credits
      await storage.createUserProfile({ userId: user.id, role: "buyer", plan: "free" });
      await db.insert(creditTransactions).values({
        userId: user.id,
        amount: 2,
        type: "free_trial",
        creditSource: "topup",
        description: "Free trial credits on signup",
      });

      // Store extra buyer lead data in appSettings keyed by userId (lightweight, no extra table)
      if (company || country || annualPurchaseVolume || primaryCategories) {
        const { appSettings } = await import("@shared/schema");
        await db.insert(appSettings).values({
          key: `buyer_profile:${user.id}`,
          value: {
            company:              company ?? null,
            country:              country ?? null,
            industry:             industry ?? null,
            website:              website ?? null,
            phone:                phone ?? null,
            annualPurchaseVolume: annualPurchaseVolume ?? null,
            primaryCategories:    primaryCategories ?? null,
            preferredOrigins:     preferredOrigins ?? null,
          },
        }).onConflictDoUpdate({
          target: appSettings.key,
          set: { value: sql`excluded.value`, updatedAt: sql`now()` },
        });
      }

      res.status(201).json({
        message: "Buyer account created. 2 free credits added.",
        userId: user.id,
        email: user.email,
        credits: 2,
      });
    } catch (e) {
      console.error("POST /api/buyer-signup error:", e);
      res.status(500).json({ error: "Signup failed", detail: (e as Error).message });
    }
  });

  // ============================================================================
  // AI Intelligence Engine  (/api/intelligence)
  // ============================================================================

  /**
   * POST /api/intelligence/analyze
   *
   * Body: IntelligenceInput
   * {
   *   company:   { name, country, industry, domain }
   *   suppliers: [{ name, country, industry, employees, unitPrice, ... }]
   *   tradeData: { industry, country, topProducts, signals }   // optional
   *   product:   { name, hsCode, quantity, unit, targetUnitPrice, destinationCountry }
   *   techStack: { technologies: [{ name, category }] }        // optional
   * }
   *
   * Returns: IntelligenceReport
   * {
   *   risk_score, riskLevel, riskBreakdown,
   *   margin_estimate,
   *   recommended_suppliers,
   *   cost_analysis,
   *   executiveSummary, actionItems, generatedAt
   * }
   */
  app.post("/api/intelligence/analyze", async (req: Request, res: Response) => {
    const { company, suppliers, tradeData, product, techStack } = req.body ?? {};

    if (!company) return res.status(400).json({ error: "company is required" });
    if (!Array.isArray(suppliers) || suppliers.length === 0)
      return res.status(400).json({ error: "suppliers array is required (min 1)" });
    if (!product?.name)
      return res.status(400).json({ error: "product.name is required" });

    try {
      const report = await runIntelligenceEngine({ company, suppliers, tradeData, product, techStack });
      res.json(report);
    } catch (e) {
      const msg = (e as Error).message;
      console.error("POST /api/intelligence/analyze error:", e);
      if (msg.includes("OpenAI API key")) return res.status(503).json({ error: msg });
      res.status(500).json({ error: "Intelligence analysis failed", detail: msg });
    }
  });

  /**
   * GET /api/intelligence/risk?country=China&industry=Electronics
   * Quick risk score for a supplier country — no GPT-4o, uses existing risk service.
   */
  app.get("/api/intelligence/risk", async (req: Request, res: Response) => {
    const country = (req.query.country as string)?.trim();
    if (!country) return res.status(400).json({ error: "country is required" });

    try {
      const result = await quickRiskScore(country, req.query.industry as string);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Risk score failed", detail: (e as Error).message });
    }
  });

  // ============================================================================
  // Search Index API  (/api/search)
  // ============================================================================

  // Initialise search index on startup (non-blocking)
  setupSearchIndex().catch(e =>
    console.warn("[search] Index setup deferred:", (e as Error).message)
  );

  /**
   * GET /api/search?q=<query>
   *   &country=China
   *   &industry=Electronics
   *   &minEmployees=100
   *   &maxEmployees=5000
   *   &limit=20
   *
   * Returns ranked results combining full-text + semantic (pgvector) search.
   */
  app.get("/api/search", async (req: Request, res: Response) => {
    const q = ((req.query.q as string) ?? "").trim();
    if (!q) return res.status(400).json({ error: "q parameter is required" });

    const limit = Math.min(parseInt((req.query.limit as string) ?? "20", 10) || 20, 100);
    const opts = {
      limit,
      country: (req.query.country as string) || undefined,
      industry: (req.query.industry as string) || undefined,
      minEmployees: req.query.minEmployees ? parseInt(req.query.minEmployees as string, 10) : undefined,
      maxEmployees: req.query.maxEmployees ? parseInt(req.query.maxEmployees as string, 10) : undefined,
    };

    try {
      const results = await searchCompanies(q, opts);
      res.json({ query: q, total: results.length, results });
    } catch (e) {
      console.error("GET /api/search error:", e);
      res.status(500).json({ error: "Search failed" });
    }
  });

  /**
   * POST /api/search/index
   * Body: { domain, company, country, industry, employees, techStack, keywords }
   * Indexes or re-indexes a single company. Admin use / webhook target.
   */
  app.post("/api/search/index", async (req: Request, res: Response) => {
    const { domain, company, country, industry, employees, techStack, keywords } = req.body ?? {};
    if (!domain) return res.status(400).json({ error: "domain is required" });

    try {
      await indexCompany({ domain, company, country, industry, employees, techStack, keywords });
      res.json({ success: true, domain });
    } catch (e) {
      console.error("POST /api/search/index error:", e);
      res.status(500).json({ error: "Indexing failed", detail: (e as Error).message });
    }
  });

  /**
   * GET /api/search/stats
   * Returns total indexed records and embedding coverage.
   */
  app.get("/api/search/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await getIndexStats();
      res.json(stats);
    } catch (e) {
      res.status(500).json({ error: "Could not retrieve stats" });
    }
  });

  return httpServer;
}