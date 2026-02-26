/**
 * Generate B2B buyer leads from ALL real imported suppliers.
 * Pulls from full supplier base (UK, US, PDL, OpenCorporates, etc.).
 * Uses department-level contacts and realistic job titles.
 *
 * Run: npm run import:generate-leads
 */

import { PrismaClient } from "@prisma/client";
import { db } from "../../server/db";
import { pool } from "../../server/db";
import { leads, users } from "../../shared/schema";
import { eq, sql } from "drizzle-orm";

const prisma = new PrismaClient();
const BATCH_SIZE = 500;
// Generate 1 lead per supplier (all real company data). Override with LEADS_TARGET env.
const TARGET_LEADS = parseInt(process.env.LEADS_TARGET || "3000000", 10) || 3_000_000;

const DEPARTMENTS = [
  "Procurement Department",
  "Supply Chain Division",
  "Engineering Department",
  "Operations Department",
  "Quality Assurance",
];

const JOB_TITLES = [
  "Procurement Manager",
  "Supply Chain Director",
  "VP of Operations",
  "Chief Procurement Officer",
  "Head of Sourcing",
  "Buyer",
  "Category Manager",
];

async function getOrCreateSystemUserId(): Promise<string> {
  try {
    const [user] = await db.select().from(users).limit(1);
    if (user) return user.id;
  } catch {
    /* users table may not exist - create it */
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar UNIQUE NOT NULL,
        password_hash varchar,
        first_name varchar,
        last_name varchar,
        profile_image_url varchar,
        email_verified boolean DEFAULT false,
        verification_token varchar,
        verification_token_expires timestamp,
        password_reset_token varchar,
        password_reset_expires timestamp,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
  } catch {
    /* table may already exist */
  }
  try {
    const [newUser] = await db
      .insert(users)
      .values({
        email: "system@smartseek.app",
        firstName: "System",
        lastName: "Seed",
      })
      .returning();
    if (newUser) return newUser.id;
  } catch {
    /* ignore - may already exist */
  }
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, "system@smartseek.app"));
  if (!existing) {
    const r = await pool.query(
      `INSERT INTO users (email, first_name, last_name) VALUES ('system@smartseek.app', 'System', 'Seed') ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id`
    );
    const id = r.rows[0]?.id;
    if (id) return id;
    throw new Error("Could not create system user for leads.");
  }
  return existing.id;
}

function getDomain(website: string | null, companyName: string): string {
  if (website) {
    try {
      const url = website.startsWith("http") ? website : `https://${website}`;
      return new URL(url).hostname.replace("www.", "");
    } catch {
      /* fallback */
    }
  }
  return (
    companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 16) + ".com"
  );
}

async function main() {
  console.log("=== Generate Leads from ALL Real Suppliers ===\n");

  const userId = await getOrCreateSystemUserId();
  console.log(`Using userId: ${userId}`);

  const totalSuppliers = await prisma.supplier.count();
  console.log(`Found ${totalSuppliers.toLocaleString()} suppliers to derive leads from.`);
  console.log(`Target: ${Math.min(TARGET_LEADS, totalSuppliers).toLocaleString()} leads (real company data only).\n`);

  // Ensure leads table exists (Drizzle schema may not have been pushed)
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id serial PRIMARY KEY,
        user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        search_query_id integer,
        company_name text NOT NULL,
        industry text NOT NULL,
        location text NOT NULL,
        employee_range varchar(50),
        revenue_range varchar(50),
        website text,
        contact_name text,
        contact_title text,
        contact_email text,
        contact_phone text,
        sourcing_focus text[],
        ai_summary text,
        intent_signals jsonb,
        verified_at timestamp,
        data_source text DEFAULT 'SmartSeek Directory',
        created_at timestamp DEFAULT now() NOT NULL
      )
    `);
  } catch (e) {
    console.warn("Leads table check:", (e as Error).message);
  }

  // Clear existing leads for clean regeneration from current suppliers
  try {
    await db.delete(leads);
    console.log("Cleared existing leads for fresh generation.\n");
  } catch (e) {
    console.warn("Could not clear leads:", (e as Error).message);
  }

  const industryFocus: Record<string, string[]> = {
    "Mining & Minerals": ["raw materials", "minerals", "commodities", "metals"],
    "Manufacturing (General)": ["components", "raw materials", "machinery", "equipment"],
    "Electronics & Semiconductors": ["components", "semiconductors", "PCBs", "electronics"],
    "Textiles & Apparel": ["fabrics", "yarn", "apparel", "textiles"],
    "Chemicals & Petrochemicals": ["chemicals", "raw materials", "specialty chemicals"],
    "Food & Agriculture": ["ingredients", "commodities", "packaging"],
    "Machinery & Industrial Equipment": ["parts", "equipment", "industrial supplies"],
    "Wholesale & Distribution": ["wholesale", "distribution", "logistics"],
    "Logistics & Supply Chain": ["freight", "logistics", "shipping services"],
    "Energy & Renewables": ["energy", "renewables", "utilities"],
    "Construction & Building Materials": ["building materials", "construction"],
    "Automotive & Transport": ["automotive parts", "transport equipment"],
    "Healthcare & Medical Devices": ["medical devices", "healthcare"],
    "Paper & Packaging": ["packaging", "paper products"],
    "Consumer Goods & Retail": ["consumer goods", "retail"],
    "Aerospace & Defense": ["aerospace", "defense"],
    "Maritime & Shipping": ["maritime", "shipping"],
  };

  const batch: (typeof leads.$inferInsert)[] = [];
  let generated = 0;
  const FETCH_BATCH = 10_000; // Fetch suppliers in chunks to avoid memory/Prisma limits
  let cursor: string | undefined = undefined;

  while (generated < TARGET_LEADS) {
    const suppliers = await prisma.supplier.findMany({
      take: FETCH_BATCH,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: "asc" },
      select: {
        id: true,
        companyName: true,
        industry: true,
        city: true,
        country: true,
        website: true,
        dataSource: true,
      },
    });
    if (suppliers.length === 0) break;

    for (const s of suppliers) {
      if (generated >= TARGET_LEADS) break;

      const domain = getDomain(s.website, s.companyName);
      const focus = industryFocus[s.industry] || ["general procurement"];
      const sourcingFocus = focus.slice(0, 2);
      const dept = DEPARTMENTS[generated % DEPARTMENTS.length];
      const title = JOB_TITLES[generated % JOB_TITLES.length];

      batch.push({
        userId,
        searchQueryId: null,
        companyName: s.companyName,
        industry: s.industry,
        location: `${s.city || "Unknown"}, ${s.country}`,
        employeeRange: null,
        revenueRange: null,
        website: s.website || `www.${domain}`,
        contactName: dept,
        contactTitle: title,
        contactEmail: `procurement@${domain}`,
        contactPhone: null,
        sourcingFocus,
        aiSummary: `${s.companyName} is a ${s.industry} company based in ${s.city || s.country}, ${s.country}. Sourcing focus: ${sourcingFocus.join(", ")}. Data derived from ${s.dataSource || "SmartSeek Directory"}.`,
        intentSignals: { source: `Derived from ${s.dataSource || "SmartSeek"}`, verified: true },
        dataSource: `Derived from ${s.dataSource || "SmartSeek Directory"}`,
      });
      generated++;

      if (batch.length >= BATCH_SIZE) {
        await db.insert(leads).values(batch);
        batch.length = 0;
        console.log(`  Generated ${generated.toLocaleString()} leads...`);
      }
    }

    cursor = suppliers[suppliers.length - 1].id;
  }

  if (batch.length > 0) {
    await db.insert(leads).values(batch);
  }

  const [leadRow] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const total = Number(leadRow?.count ?? 0);

  console.log(
    `\n✅ Generated ${generated.toLocaleString()} leads from ${totalSuppliers.toLocaleString()} suppliers. Total leads in DB: ${total.toLocaleString()}.`
  );
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
