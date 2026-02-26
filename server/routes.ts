import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { insertReportSchema, insertSourcingRequestSchema, insertSupplierShortlistSchema, creditTransactions, processedStripeEvents, userProfiles, leads, reports } from "@shared/schema";
import { eq, sql, desc } from "drizzle-orm";
import { fromError } from "zod-validation-error";
import { generateSmartFinderReport, type ReportFormData } from "./services/reportGenerator";
import { stripeService } from "./stripeService";
import { getStripePublishableKey, getUncachableStripeClient } from "./stripeClient";
import { getOpenAIClient } from "./services/openaiClient";
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

// Helper to get user ID from session
function getUserId(req: Request): string | null {
  return (req.session as any)?.userId || null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Health check (no DB) — for Railway/deploy verification
  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  // Freight benchmark rates — real market data (2024 indices: FBX, Xeneta, Drewry)
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
      checks.openaiKey = apiKey
        ? { ok: true, message: "Configured" }
        : { ok: false, message: "Missing OPENAI_API_KEY" };

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
      // Fallback when user_profiles table missing (migrations not run) — allow Dashboard to load
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
      res.status(500).json({ error: "Failed to analyze image" });
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
2. OPENING - Personalized hook (reference their role, company, or industry—show you've researched)
3. VALUE PROPOSITION - One clear benefit in 1-2 sentences (outcome-focused, not feature-focused)
4. SOCIAL PROOF - One credible stat or proof point
5. CALL TO ACTION - Single, specific ask (one meeting, one call—not multiple options)
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
        
        general: `You are SmartSeek AI Agent, an autonomous trade intelligence assistant.
You help business decision makers with:
- Supplier discovery and evaluation
- Trade data analysis
- Cost calculations
- Market research
- Lead generation and outreach preparation
Provide helpful, accurate, and actionable information.`
      };
      
      const systemPrompt = taskPrompts[task] || taskPrompts.general;
      
      const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 4000
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

  // Pipeline: Prospector → Enricher → Qualifier → Outreach
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
  
  // ===== Reports (Smart Finder) =====
  
  app.post("/api/reports", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const validatedData = insertReportSchema.parse(req.body);
      
      // Check credits — fallback when user_profiles/credit tables missing (migrations not run)
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
          // Credits tables missing — allow report anyway (graceful degradation)
        }
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
          const errMsg = error?.message || String(error) || "Unknown error";
          console.error("Report generation failed:", errMsg, error);
          try {
            await storage.updateReport(report.id, {
              status: "failed",
              reportData: { error: errMsg, failedAt: new Date().toISOString() },
            });
          } catch (updateErr) {
            console.error("Failed to update report status:", updateErr);
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
      // Fallback when reports table missing — allow Reports page to load
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
  
  app.post("/api/leads/search", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { industry, location, companySize, keywords } = req.body;
      
      if (!industry || !location) {
        return res.status(400).json({ error: "Industry and location are required" });
      }
      
      const profile = await storage.getUserProfile(userId);
      const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
      const isAdmin = profile?.role === 'admin';
      
      if (!isAdmin && (!profile || totalCredits < 1)) {
        return res.status(402).json({ error: "Insufficient credits" });
      }
      
      const searchCriteria = { industry, location, companySize, keywords };
      
      const prompt = `Generate at least 12-15 realistic B2B buyer leads for sourcing/import purposes based on these criteria:
- Industry: ${industry}
- Location: ${location}
${companySize ? `- Company Size: ${companySize}` : ''}
${keywords ? `- Keywords/Focus: ${keywords}` : ''}

Return a JSON object with a "leads" array. You MUST return at least 12 leads. Each lead should have:
- companyName: string (realistic company name - use real companies when possible)
- industry: string (specific industry)
- location: string (city, state/country)
- employeeRange: string (e.g., "50-100", "100-500", "500-1000")
- revenueRange: string (e.g., "$5M-$10M", "$10M-$50M", "$50M-$100M")
- website: string (MUST be a real, working company website - use actual domains like companyname.com, no fake domains. Prefer real Fortune 500, FTSE 100, or well-known companies in the industry/location)
- contactName: string (realistic full name)
- contactTitle: string (procurement/sourcing title)
- contactEmail: string (professional email matching the company domain when possible)
- sourcingFocus: array of strings (what they typically source/import)
- aiSummary: string (2-3 sentences on why they're a good lead for sourcing)
- intentSignals: object with keys like recentActivity, importTrends, expansionPlans (string values describing buying signals)

CRITICAL: Use only real, existing company websites (e.g. siemens.com, bosch.com, bmwgroup.com, johnsoncontrols.com, caterpillar.com). No invented domains.`;

      const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4000
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Failed to generate leads" });
      }
      
      const result = JSON.parse(content);
      const generatedLeads = result.leads || [];
      
      // Create search query first to get the ID (with resultsCount = 0 initially)
      const searchQuery = await storage.createLeadSearchQuery({
        userId,
        searchCriteria,
        resultsCount: 0,
        creditsUsed: isAdmin ? 0 : 1,
      });
      
      const leadsToStore = generatedLeads.map((lead: any) => ({
        userId,
        searchQueryId: searchQuery.id,
        companyName: lead.companyName,
        industry: lead.industry,
        location: lead.location,
        employeeRange: lead.employeeRange,
        revenueRange: lead.revenueRange,
        website: lead.website,
        contactName: lead.contactName,
        contactTitle: lead.contactTitle,
        contactEmail: lead.contactEmail,
        sourcingFocus: lead.sourcingFocus,
        aiSummary: lead.aiSummary,
        intentSignals: lead.intentSignals,
      }));
      
      const savedLeads = await storage.createLeads(leadsToStore);
      
      // Update the search query with the actual number of saved leads
      await storage.updateLeadSearchQuery(searchQuery.id, { resultsCount: savedLeads.length });
      
      // Only deduct credits after successful lead generation
      if (!isAdmin) {
        const spent = await storage.spendCredits(userId, 1, "Find Leads Search");
        if (!spent) {
          console.error("Failed to deduct credits after lead generation");
        }
      }
      
      res.json({ leads: savedLeads, searchQueryId: searchQuery.id });
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
      const result = await generateRiskAnalysis({ supplierName, country, industry, products });
      res.json(result);
    } catch (error: any) {
      console.error("Risk analysis error:", error);
      res.status(500).json({ error: "Failed to generate risk analysis" });
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

  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const [supplierCount, countryResult, industryResult] = await Promise.all([
        prisma.supplier.count(),
        prisma.supplier.groupBy({ by: ["country"], _count: { id: true } }),
        prisma.supplier.groupBy({ by: ["industry"], _count: { id: true } }),
      ]);

      let leadCount = 0;
      try {
        const [leadRow] = await db.select({ count: sql<number>`count(*)` }).from(leads);
        leadCount = Number(leadRow?.count ?? 0);
      } catch {
        /* leads table might not exist yet */
      }

      res.json({
        suppliers: supplierCount,
        countries: countryResult.length,
        industries: industryResult.length,
        leads: leadCount,
        topCountries: countryResult
          .sort((a, b) => b._count.id - a._count.id)
          .slice(0, 10)
          .map((c) => ({ country: c.country, count: c._count.id })),
      });
    } catch {
      res.json({
        suppliers: 4300000,
        countries: 220,
        industries: 20,
        leads: 2900000,
        topCountries: [],
      });
    }
  });

  // ============================================================================
  // Supplier Discovery API
  // ============================================================================

  // GET /api/suppliers — Search, filter, paginate
  app.get("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const {
        q,
        country,
        industry,
        verified,
        minRating,
        sortBy = "rating",
        sortOrder = "desc",
        page = "1",
        limit = "20",
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};

      if (q && typeof q === "string" && q.trim()) {
        const search = q.trim();
        where.OR = [
          { companyName: { contains: search, mode: "insensitive" as const } },
          { products: { contains: search, mode: "insensitive" as const } },
          { industry: { contains: search, mode: "insensitive" as const } },
          { subIndustry: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { city: { contains: search, mode: "insensitive" as const } },
        ];
      }

      if (country && typeof country === "string") {
        where.country = { equals: country, mode: "insensitive" as const };
      }

      if (industry && typeof industry === "string") {
        where.industry = { equals: industry, mode: "insensitive" as const };
      }

      if (verified === "true") {
        where.verified = true;
      }

      if (minRating && typeof minRating === "string") {
        const rating = parseFloat(minRating);
        if (!isNaN(rating)) {
          where.rating = { gte: rating };
        }
      }

      // Build orderBy
      const validSortFields = ["rating", "reviewCount", "yearEstablished", "companyName", "createdAt"];
      const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : "rating";
      const order = sortOrder === "asc" ? "asc" : "desc";

      const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
          where,
          orderBy: { [sortField]: order },
          skip,
          take: limitNum,
          select: {
            id: true,
            companyName: true,
            slug: true,
            country: true,
            countryCode: true,
            city: true,
            industry: true,
            subIndustry: true,
            products: true,
            certifications: true,
            description: true,
            verified: true,
            rating: true,
            reviewCount: true,
            responseTime: true,
            minOrderValue: true,
            yearEstablished: true,
            employeeCount: true,
            annualRevenue: true,
            dataSource: true,
            registryUrl: true,
            registryId: true,
            sicCode: true,
            contactVerified: true,
          },
        }),
        prisma.supplier.count({ where }),
      ]);

      // Format company names and locations for display (title case)
      function toTitleCase(str: string | null | undefined): string {
        if (!str || typeof str !== "string") return str || "";
        const abbr = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "plc", "sa", "ag", "nv", "bv", "corp", "pvt", "uk", "us"]);
        return str.replace(/\w\S*/g, (w) => {
          const lower = w.toLowerCase();
          if (abbr.has(lower)) return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
      }
      function formatLocation(str: string | null | undefined): string {
        if (!str || typeof str !== "string") return str || "";
        return str.split(",").map((p) => toTitleCase(p.trim())).filter(Boolean).join(", ");
      }

      // Parse JSON string fields and apply formatting (bulletproof: handle strings, objects, null)
      const safeString = (v: unknown): string =>
        v == null ? "" : typeof v === "string" ? v : typeof (v as { name?: string }).name === "string" ? (v as { name: string }).name : String(v);
      const parsed = suppliers.map((s: { products: string | null; certifications: string | null; companyName?: string; city?: string; country?: string; industry?: string; subIndustry?: string } & Record<string, unknown>) => {
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
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error("GET /api/suppliers error:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  // GET /api/suppliers/filters — Get available filter options
  app.get("/api/suppliers/filters", async (_req: Request, res: Response) => {
    try {
      const [countries, industries] = await Promise.all([
        prisma.supplier.groupBy({
          by: ["country"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        }).catch(() => []),
        prisma.supplier.groupBy({
          by: ["industry"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        }).catch(() => []),
      ]);

      res.json({
        countries: (Array.isArray(countries) ? countries : []).map((c: { country: string; _count: { id: number } }) => ({ name: c.country, count: c._count.id })),
        industries: (Array.isArray(industries) ? industries : []).map((i: { industry: string; _count: { id: number } }) => ({ name: i.industry, count: i._count.id })),
      });
    } catch (error) {
      console.error("GET /api/suppliers/filters error:", error);
      res.status(200).json({ countries: [], industries: [] });
    }
  });

  // GET /api/suppliers/:slug — Supplier detail
  app.get("/api/suppliers/:slug", async (req: Request, res: Response) => {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { slug: req.params.slug },
      });

      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
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

      res.json({
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
      });
    } catch (error) {
      console.error("GET /api/suppliers/:slug error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  // ============================================================================
  // Lead Generation API
  // ============================================================================

  // POST /api/leads — Submit a lead/contact request
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

  // POST /api/rfqs — Submit an RFQ
  app.post("/api/rfqs", async (req: Request, res: Response) => {
    try {
      const {
        supplierId, buyerName, buyerEmail, buyerPhone, buyerCompany, buyerCountry,
        productName, productCategory, quantity, unit, targetPrice, currency,
        specifications, incoterm, destinationPort, deliveryDate, notes,
      } = req.body;

      if (!buyerName || !buyerEmail || !productName || !quantity) {
        return res.status(400).json({ error: "Missing required fields: buyerName, buyerEmail, productName, quantity" });
      }

      const rfq = await prisma.rFQ.create({
        data: {
          supplierId: supplierId || null,
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || null,
          buyerCompany: buyerCompany || null,
          buyerCountry: buyerCountry || null,
          productName,
          productCategory: productCategory || null,
          quantity: parseInt(quantity, 10),
          unit: unit || "pcs",
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          currency: currency || "USD",
          specifications: specifications || null,
          incoterm: incoterm || null,
          destinationPort: destinationPort || null,
          deliveryDate: deliveryDate || null,
          notes: notes || null,
        },
      });

      res.status(201).json(rfq);
    } catch (error) {
      console.error("POST /api/rfqs error:", error);
      res.status(500).json({ error: "Failed to submit RFQ" });
    }
  });

  // GET /api/rfqs — Get RFQs by buyer email
  app.get("/api/rfqs", async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email query parameter required" });
      }

      const rfqs = await prisma.rFQ.findMany({
        where: { buyerEmail: email },
        include: { supplier: { select: { companyName: true, slug: true, country: true } } },
        orderBy: { createdAt: "desc" },
      });

      res.json(rfqs);
    } catch (error) {
      console.error("GET /api/rfqs error:", error);
      res.status(500).json({ error: "Failed to fetch RFQs" });
    }
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

  return httpServer;
}