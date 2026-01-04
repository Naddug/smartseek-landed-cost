import { db } from "./db";
import {
  userProfiles,
  creditTransactions,
  reports,
  supplierShortlists,
  sourcingRequests,
  appSettings,
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
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;
  
  // Credits
  addCredits(userId: string, amount: number, type: CreditTransaction["type"], description: string): Promise<void>;
  spendCredits(userId: string, amount: number, description: string): Promise<boolean>;
  getCreditTransactions(userId: string, limit?: number): Promise<CreditTransaction[]>;
  
  // Reports
  createReport(report: InsertReportFull): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getUserReports(userId: string): Promise<Report[]>;
  updateReport(id: number, data: Partial<Report>): Promise<Report>;
  
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

  // Credits
  async addCredits(userId: string, amount: number, type: CreditTransaction["type"], description: string) {
    await db.transaction(async (tx) => {
      await tx.insert(creditTransactions).values({
        userId,
        amount,
        type,
        description,
      });
      
      const [profile] = await tx.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (profile) {
        await tx
          .update(userProfiles)
          .set({ credits: profile.credits + amount })
          .where(eq(userProfiles.userId, userId));
      }
    });
  },

  async spendCredits(userId: string, amount: number, description: string) {
    let success = false;
    
    await db.transaction(async (tx) => {
      const [profile] = await tx.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      
      if (!profile || profile.credits < amount) {
        success = false;
        return;
      }
      
      await tx
        .update(userProfiles)
        .set({ credits: profile.credits - amount })
        .where(eq(userProfiles.userId, userId));
      
      await tx.insert(creditTransactions).values({
        userId,
        amount: -amount,
        type: "spend",
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

  async updateReport(id: number, data: Partial<Report>) {
    const [updated] = await db
      .update(reports)
      .set(data)
      .where(eq(reports.id, id))
      .returning();
    return updated;
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
};
