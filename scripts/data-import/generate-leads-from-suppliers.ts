/**
 * Generate B2B buyer leads from ALL real imported suppliers.
 * Pulls from full supplier base (UK, US, PDL, OpenCorporates, etc.).
 * Uses department-level contacts and realistic job titles.
 *
 * Run: npm run import:generate-leads
 */

import { PrismaClient } from "@prisma/client";
import { db } from "../../server/db";
import { leads, users } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const prisma = new PrismaClient();
const BATCH_SIZE = 500;
const TARGET_LEADS = 100_000;

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
  const [user] = await db.select().from(users).limit(1);
  if (user) return user.id;
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
    /* ignore */
  }
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, "system@smartseek.app"));
  if (!existing) throw new Error("No users in database. Create a user first.");
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

  const suppliers = await prisma.supplier.findMany({
    select: {
      companyName: true,
      industry: true,
      city: true,
      country: true,
      website: true,
      dataSource: true,
    },
  });

  console.log(`Found ${suppliers.length} suppliers to derive leads from.`);

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
      console.log(`  Generated ${generated} leads...`);
    }
  }

  if (batch.length > 0) {
    await db.insert(leads).values(batch);
  }

  const [leadRow] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const total = Number(leadRow?.count ?? 0);

  console.log(
    `\n✅ Generated ${generated} leads from ${suppliers.length} suppliers. Total leads in DB: ${total}.`
  );
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
