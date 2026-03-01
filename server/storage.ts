import { db } from "./db";
import { sql } from "drizzle-orm";
import {
  userProfiles,
  creditTransactions,
  reports,
  supplierShortlists,
  sourcingRequests,
  appSettings,
  leads,
  leadSearchQueries,
  customsCalculations,
  shippingEstimates,
  type UserProfile,
  type InsertUserProfile,
  type CreditTransaction,
  type InsertCreditTransaction,
  type Report,
  type InsertReport,
  type InsertReportFull,
  type SupplierShortlist,
  type InsertSupplierShortlist,
  type SourcingRequest,
  type InsertSourcingRequest,
  type AppSetting,
  type InsertAppSetting,
  type Lead,
  type InsertLead,
  type LeadSearchQuery,
  type InsertLeadSearchQuery,
  type CustomsCalculation,
  type InsertCustomsCalculation,
  type ShippingEstimate,
  type InsertShippingEstimate,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;
  
  // Credits - New system with monthly + topup pools
  getTotalCredits(userId: string): Promise<number>;
  addTopupCredits(userId: string, amount: number, description: string): Promise<void>;
  refreshMonthlyCredits(userId: string, amount: number): Promise<void>;
  spendCredits(userId: string, amount: number, description: string): Promise<boolean>;
  getCreditTransactions(userId: string, limit?: number): Promise<CreditTransaction[]>;
  
  // Stripe helpers
  getProductsWithPrices(): Promise<any[]>;
  getSubscriptionForUser(subscriptionId: string): Promise<any>;
  
  // Reports
  createReport(report: InsertReportFull): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getUserReports(userId: string): Promise<Report[]>;
  getUserStats(userId: string): Promise<{ reportsCount: number; topRegions: { name: string; count: number }[]; commodities: string[] }>;
  updateReport(id: number, data: Partial<Report>): Promise<Report>;
  deleteReport(id: number): Promise<void>;
  
  // Supplier Shortlists
  getAllSupplierShortlists(): Promise<SupplierShortlist[]>;
  getSupplierShortlist(id: number): Promise<SupplierShortlist | undefined>;
  getSupplierShortlistsByCategory(category: string): Promise<SupplierShortlist[]>;
  createSupplierShortlist(shortlist: InsertSupplierShortlist): Promise<SupplierShortlist>;
  updateSupplierShortlist(id: number, data: Partial<SupplierShortlist>): Promise<SupplierShortlist>;
  deleteSupplierShortlist(id: number): Promise<void>;
  
  // Sourcing Requests
  createSourcingRequest(request: InsertSourcingRequest): Promise<SourcingRequest>;
  getSourcingRequest(id: number): Promise<SourcingRequest | undefined>;
  getUserSourcingRequests(userId: string): Promise<SourcingRequest[]>;
  getAllSourcingRequests(): Promise<SourcingRequest[]>;
  updateSourcingRequest(id: number, data: Partial<SourcingRequest>): Promise<SourcingRequest>;
  
  // App Settings
  getSetting(key: string): Promise<AppSetting | undefined>;
  setSetting(key: string, value: any): Promise<AppSetting>;
  
  // Leads
  createLeadSearchQuery(query: InsertLeadSearchQuery): Promise<LeadSearchQuery>;
  getUserLeadSearchQueries(userId: string, limit?: number): Promise<LeadSearchQuery[]>;
  getLeadSearchQuery(id: number): Promise<LeadSearchQuery | undefined>;
  updateLeadSearchQuery(id: number, data: Partial<LeadSearchQuery>): Promise<LeadSearchQuery>;
  createLeads(leadsData: InsertLead[]): Promise<Lead[]>;
  getUserLeads(userId: string): Promise<Lead[]>;
  getLeadsBySearchQueryId(searchQueryId: number): Promise<Lead[]>;
  
  // Customs Calculations
  createCustomsCalculation(calc: InsertCustomsCalculation): Promise<CustomsCalculation>;
  getUserCustomsCalculations(userId: string, limit?: number): Promise<CustomsCalculation[]>;
  getCustomsCalculation(id: number): Promise<CustomsCalculation | undefined>;
  
  // Shipping Estimates
  createShippingEstimate(estimate: InsertShippingEstimate): Promise<ShippingEstimate>;
  getUserShippingEstimates(userId: string, limit?: number): Promise<ShippingEstimate[]>;
  getShippingEstimate(id: number): Promise<ShippingEstimate | undefined>;
}

export const storage: IStorage = {
  // User Profiles
  async getUserProfile(userId: string) {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  },

  async createUserProfile(profile: InsertUserProfile) {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>) {
    const [updated] = await db
      .update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  },

  // Credits - New system: monthly credits first, then topup credits
  async getTotalCredits(userId: string) {
    const profile = await this.getUserProfile(userId);
    if (!profile) return 0;
    return profile.monthlyCredits + profile.topupCredits;
  },

  async addTopupCredits(userId: string, amount: number, description: string) {
    await db.transaction(async (tx) => {
      const [profile] = await tx.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (profile) {
        await tx
          .update(userProfiles)
          .set({ topupCredits: profile.topupCredits + amount, updatedAt: new Date() })
          .where(eq(userProfiles.userId, userId));
      }
      
      await tx.insert(creditTransactions).values({
        userId,
        amount,
        type: "topup",
        creditSource: "topup",
        description,
      });
    });
  },

  async refreshMonthlyCredits(userId: string, amount: number) {
    await db.transaction(async (tx) => {
      await tx
        .update(userProfiles)
        .set({ monthlyCredits: amount, updatedAt: new Date() })
        .where(eq(userProfiles.userId, userId));
      
      await tx.insert(creditTransactions).values({
        userId,
        amount,
        type: "subscription_refresh",
        creditSource: "monthly",
        description: "Monthly credits refreshed",
      });
    });
  },

  async spendCredits(userId: string, amount: number, description: string) {
    let success = false;
    
    await db.transaction(async (tx) => {
      const [profile] = await tx.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      
      if (!profile) {
        success = false;
        return;
      }
      
      const totalCredits = profile.monthlyCredits + profile.topupCredits;
      if (totalCredits < amount) {
        success = false;
        return;
      }
      
      // Deduct from monthly credits first, then topup
      let remaining = amount;
      let newMonthlyCredits = profile.monthlyCredits;
      let newTopupCredits = profile.topupCredits;
      let creditSource: "monthly" | "topup" = "monthly";
      
      if (profile.monthlyCredits >= remaining) {
        newMonthlyCredits = profile.monthlyCredits - remaining;
        creditSource = "monthly";
      } else {
        remaining -= profile.monthlyCredits;
        newMonthlyCredits = 0;
        newTopupCredits = profile.topupCredits - remaining;
        creditSource = profile.monthlyCredits > 0 ? "monthly" : "topup";
      }
      
      await tx
        .update(userProfiles)
        .set({ monthlyCredits: newMonthlyCredits, topupCredits: newTopupCredits, updatedAt: new Date() })
        .where(eq(userProfiles.userId, userId));
      
      await tx.insert(creditTransactions).values({
        userId,
        amount: -amount,
        type: "spend",
        creditSource,
        description,
      });
      
      success = true;
    });
    
    return success;
  },

  async getCreditTransactions(userId: string, limit = 50) {
    return db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
  },

  // Reports
  async createReport(report: InsertReportFull) {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  },

  async getReport(id: number) {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  },

  async getUserReports(userId: string) {
    return db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.createdAt));
  },

  async getUserStats(userId: string) {
    const userReports = await this.getUserReports(userId);
    const completed = userReports.filter((r) => r.status === "completed");
    const regionCounts: Record<string, number> = {};
    const commoditySet = new Set<string>();
    for (const r of completed) {
      const fd = (r.formData as Record<string, unknown>) || {};
      const origin = (fd.origin as string) || (fd.originCountry as string) || "";
      const dest = (fd.destination as string) || (fd.destinationCountry as string) || "";
      const region = origin || dest || "Unknown";
      regionCounts[region] = (regionCounts[region] || 0) + 1;
      const cat = r.category || (fd.commodity as string) || (fd.product as string) || "";
      if (cat) commoditySet.add(cat);
    }
    const topRegions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    return {
      reportsCount: completed.length,
      topRegions,
      commodities: Array.from(commoditySet),
    };
  },

  async updateReport(id: number, data: Partial<Report>) {
    const [updated] = await db
      .update(reports)
      .set(data)
      .where(eq(reports.id, id))
      .returning();
    return updated;
  },

  async deleteReport(id: number) {
    await db.delete(reports).where(eq(reports.id, id));
  },

  // Supplier Shortlists
  async getAllSupplierShortlists() {
    return db.select().from(supplierShortlists).orderBy(desc(supplierShortlists.createdAt));
  },

  async getSupplierShortlist(id: number) {
    const [shortlist] = await db.select().from(supplierShortlists).where(eq(supplierShortlists.id, id));
    return shortlist;
  },

  async getSupplierShortlistsByCategory(category: string) {
    return db
      .select()
      .from(supplierShortlists)
      .where(eq(supplierShortlists.category, category))
      .orderBy(desc(supplierShortlists.createdAt));
  },

  async createSupplierShortlist(shortlist: InsertSupplierShortlist) {
    const [newShortlist] = await db.insert(supplierShortlists).values(shortlist).returning();
    return newShortlist;
  },

  async updateSupplierShortlist(id: number, data: Partial<SupplierShortlist>) {
    const [updated] = await db
      .update(supplierShortlists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(supplierShortlists.id, id))
      .returning();
    return updated;
  },

  async deleteSupplierShortlist(id: number) {
    await db.delete(supplierShortlists).where(eq(supplierShortlists.id, id));
  },

  // Sourcing Requests
  async createSourcingRequest(request: InsertSourcingRequest) {
    const [newRequest] = await db.insert(sourcingRequests).values(request).returning();
    return newRequest;
  },

  async getSourcingRequest(id: number) {
    const [request] = await db.select().from(sourcingRequests).where(eq(sourcingRequests.id, id));
    return request;
  },

  async getUserSourcingRequests(userId: string) {
    return db
      .select()
      .from(sourcingRequests)
      .where(eq(sourcingRequests.userId, userId))
      .orderBy(desc(sourcingRequests.createdAt));
  },

  async getAllSourcingRequests() {
    return db.select().from(sourcingRequests).orderBy(desc(sourcingRequests.createdAt));
  },

  async updateSourcingRequest(id: number, data: Partial<SourcingRequest>) {
    const [updated] = await db
      .update(sourcingRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sourcingRequests.id, id))
      .returning();
    return updated;
  },

  // App Settings
  async getSetting(key: string) {
    const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, key));
    return setting;
  },

  async setSetting(key: string, value: any) {
    const existing = await this.getSetting(key);
    
    if (existing) {
      const [updated] = await db
        .update(appSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(appSettings.key, key))
        .returning();
      return updated;
    } else {
      const [newSetting] = await db.insert(appSettings).values({ key, value }).returning();
      return newSetting;
    }
  },

  // Stripe helpers - query from synced stripe schema
  async getProductsWithPrices() {
    try {
      const result = await db.execute(
        sql`
          SELECT 
            p.id as product_id,
            p.name as product_name,
            p.description as product_description,
            p.active as product_active,
            p.metadata as product_metadata,
            pr.id as price_id,
            pr.unit_amount,
            pr.currency,
            pr.recurring,
            pr.active as price_active,
            pr.metadata as price_metadata
          FROM stripe.products p
          LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
          WHERE p.active = true
          ORDER BY p.id, pr.unit_amount
        `
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching Stripe products:", error);
      return [];
    }
  },

  async getSubscriptionForUser(subscriptionId: string) {
    try {
      const result = await db.execute(
        sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  },

  // Leads
  async createLeadSearchQuery(query: InsertLeadSearchQuery) {
    const [newQuery] = await db.insert(leadSearchQueries).values(query).returning();
    return newQuery;
  },

  async getUserLeadSearchQueries(userId: string, limit = 50) {
    return db
      .select()
      .from(leadSearchQueries)
      .where(eq(leadSearchQueries.userId, userId))
      .orderBy(desc(leadSearchQueries.createdAt))
      .limit(limit);
  },

  async createLeads(leadsData: InsertLead[]) {
    if (leadsData.length === 0) return [];
    const newLeads = await db.insert(leads).values(leadsData).returning();
    return newLeads;
  },

  async getUserLeads(userId: string) {
    return db
      .select()
      .from(leads)
      .where(eq(leads.userId, userId))
      .orderBy(desc(leads.createdAt));
  },

  async getLeadSearchQuery(id: number) {
    const [query] = await db.select().from(leadSearchQueries).where(eq(leadSearchQueries.id, id));
    return query;
  },

  async updateLeadSearchQuery(id: number, data: Partial<LeadSearchQuery>) {
    const [updated] = await db.update(leadSearchQueries).set(data).where(eq(leadSearchQueries.id, id)).returning();
    return updated;
  },

  async getLeadsBySearchQueryId(searchQueryId: number) {
    return db
      .select()
      .from(leads)
      .where(eq(leads.searchQueryId, searchQueryId))
      .orderBy(desc(leads.createdAt));
  },

  // Customs Calculations
  async createCustomsCalculation(calc: InsertCustomsCalculation) {
    const [newCalc] = await db.insert(customsCalculations).values(calc).returning();
    return newCalc;
  },

  async getUserCustomsCalculations(userId: string, limit = 50) {
    return db
      .select()
      .from(customsCalculations)
      .where(eq(customsCalculations.userId, userId))
      .orderBy(desc(customsCalculations.createdAt))
      .limit(limit);
  },

  async getCustomsCalculation(id: number) {
    const [calc] = await db.select().from(customsCalculations).where(eq(customsCalculations.id, id));
    return calc;
  },

  // Shipping Estimates
  async createShippingEstimate(estimate: InsertShippingEstimate) {
    const [newEstimate] = await db.insert(shippingEstimates).values(estimate).returning();
    return newEstimate;
  },

  async getUserShippingEstimates(userId: string, limit = 50) {
    return db
      .select()
      .from(shippingEstimates)
      .where(eq(shippingEstimates.userId, userId))
      .orderBy(desc(shippingEstimates.createdAt))
      .limit(limit);
  },

  async getShippingEstimate(id: number) {
    const [estimate] = await db.select().from(shippingEstimates).where(eq(shippingEstimates.id, id));
    return estimate;
  },
};
