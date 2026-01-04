import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export all auth models
export * from "./models/auth";

// SmartSeek Application Models

// User profile extensions for SmartSeek
export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { enum: ["buyer", "seller", "admin"] }).default("buyer").notNull(),
  plan: varchar("plan", { enum: ["free", "pro"] }).default("free").notNull(),
  credits: integer("credits").default(10).notNull(),
  region: text("region").default("North America"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  nextRefillDate: timestamp("next_refill_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Credit transactions ledger
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: varchar("type", { enum: ["earn", "spend", "topup", "subscription", "adjustment"] }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Smart Finder Reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  status: varchar("status", { enum: ["completed", "generating", "failed"] }).default("completed").notNull(),
  formData: jsonb("form_data").notNull(),
  reportData: jsonb("report_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Supplier Shortlists (Admin Curated)
export const supplierShortlists = pgTable("supplier_shortlists", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  isPremium: boolean("is_premium").default(true).notNull(),
  suppliers: jsonb("suppliers").notNull(), // Array of supplier objects
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Premium Sourcing Requests (Ticketing)
export const sourcingRequests = pgTable("sourcing_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: varchar("status", { enum: ["pending", "in_progress", "completed", "cancelled"] }).default("pending").notNull(),
  adminNotes: text("admin_notes"),
  supplierList: jsonb("supplier_list"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// App Settings (for admin configuration)
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// HS Code Reference Database
export const hsCodes = pgTable("hs_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  description: text("description").notNull(),
  chapter: varchar("chapter", { length: 2 }),
  section: text("section"),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Search History
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  searchType: varchar("search_type", { enum: ["product", "hs_code", "supplier", "brand"] }).notNull(),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved Products / Watchlist
export const savedProducts = pgTable("saved_products", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  hsCode: varchar("hs_code", { length: 12 }),
  category: text("category"),
  originCountry: text("origin_country"),
  notes: text("notes"),
  priceData: jsonb("price_data"),
  alertsEnabled: boolean("alerts_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customs Calculations
export const customsCalculations = pgTable("customs_calculations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  hsCode: varchar("hs_code", { length: 12 }),
  originCountry: text("origin_country").notNull(),
  destinationCountry: text("destination_country").notNull(),
  productValue: integer("product_value").notNull(),
  quantity: integer("quantity").default(1),
  incoterm: varchar("incoterm", { length: 10 }),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shipping Estimates
export const shippingEstimates = pgTable("shipping_estimates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  originCountry: text("origin_country").notNull(),
  destinationCountry: text("destination_country").notNull(),
  weight: integer("weight"),
  volume: integer("volume"),
  shippingMethod: varchar("shipping_method", { enum: ["sea", "air", "express"] }).notNull(),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trade Data Cache
export const tradeDataCache = pgTable("trade_data_cache", {
  id: serial("id").primaryKey(),
  hsCode: varchar("hs_code", { length: 12 }).notNull(),
  year: integer("year").notNull(),
  dataType: varchar("data_type", { enum: ["import", "export"] }).notNull(),
  country: text("country"),
  data: jsonb("data").notNull(),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Import auth models for references
import { users } from "./models/auth";

// Insert Schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierShortlistSchema = createInsertSchema(supplierShortlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSourcingRequestSchema = createInsertSchema(sourcingRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppSettingSchema = createInsertSchema(appSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertHsCodeSchema = createInsertSchema(hsCodes).omit({
  id: true,
  createdAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true,
});

export const insertSavedProductSchema = createInsertSchema(savedProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomsCalculationSchema = createInsertSchema(customsCalculations).omit({
  id: true,
  createdAt: true,
});

export const insertShippingEstimateSchema = createInsertSchema(shippingEstimates).omit({
  id: true,
  createdAt: true,
});

export const insertTradeDataCacheSchema = createInsertSchema(tradeDataCache).omit({
  id: true,
  createdAt: true,
});

// Types
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type SupplierShortlist = typeof supplierShortlists.$inferSelect;
export type InsertSupplierShortlist = z.infer<typeof insertSupplierShortlistSchema>;

export type SourcingRequest = typeof sourcingRequests.$inferSelect;
export type InsertSourcingRequest = z.infer<typeof insertSourcingRequestSchema>;

export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;

export type HsCode = typeof hsCodes.$inferSelect;
export type InsertHsCode = z.infer<typeof insertHsCodeSchema>;

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;

export type SavedProduct = typeof savedProducts.$inferSelect;
export type InsertSavedProduct = z.infer<typeof insertSavedProductSchema>;

export type CustomsCalculation = typeof customsCalculations.$inferSelect;
export type InsertCustomsCalculation = z.infer<typeof insertCustomsCalculationSchema>;

export type ShippingEstimate = typeof shippingEstimates.$inferSelect;
export type InsertShippingEstimate = z.infer<typeof insertShippingEstimateSchema>;

export type TradeDataCache = typeof tradeDataCache.$inferSelect;
export type InsertTradeDataCache = z.infer<typeof insertTradeDataCacheSchema>;
