import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReportSchema, insertSourcingRequestSchema, insertSupplierShortlistSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { generateSmartFinderReport, type ReportFormData } from "./services/reportGenerator";

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
      
      // Create profile if doesn't exist
      if (!profile) {
        profile = await storage.createUserProfile({
          userId,
          role: "buyer",
          plan: "free",
          credits: 10,
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
      
      // Check credits
      const profile = await storage.getUserProfile(userId);
      if (!profile || profile.credits < 1) {
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

  return httpServer;
}
