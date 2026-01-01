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
