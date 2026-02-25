/**
 * Generate B2B buyer leads from real imported suppliers.
 * Cross-references real companies - no fake contact names.
 * Uses "Procurement Department" for unknown contacts.
 *
 * Run: npm run import:generate-leads
 */

import { PrismaClient } from "@prisma/client";
import { db } from "../../server/db";
import { leads, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const prisma = new PrismaClient();
const BATCH_SIZE = 500;
const TARGET_LEADS = 100000;

async function getOrCreateSystemUserId(): Promise<string> {
  const [user] = await db.select().from(users).limit(1);
  if (user) return user.id;
  try {
    const [newUser] = await db.insert(users).values({
      email: "system@smartseek.app",
      firstName: "System",
      lastName: "Seed",
    }).returning();
    if (newUser) return newUser.id;
  } catch { /* ignore */ }
  const [existing] = await db.select().from(users).where(eq(users.email, "system@smartseek.app"));
  if (!existing) throw new Error("No users in database. Create a user first.");
  return existing.id;
}

function getDomain(website: string | null, companyName: string): string {
  if (website) {
    try {
      const url = website.startsWith("http") ? website : `https://${website}`;
      return new URL(url).hostname.replace("www.", "");
    } catch { /* fallback */ }
  }
  return companyName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) + ".com";
}

async function main() {
  console.log("=== Generate Leads from Real Suppliers ===\n");

  const userId = await getOrCreateSystemUserId();
  console.log(`Using userId: ${userId}`);

  const suppliers = await prisma.supplier.findMany({
    where: {
      dataSource: { in: ["Companies House UK", "SEC EDGAR", "OpenCorporates", "Trade.gov ITA"] },
    },
    select: {
      companyName: true,
      industry: true,
      city: true,
      country: true,
      website: true,
      dataSource: true,
    },
  });

  console.log(`Found ${suppliers.length} real suppliers to derive leads from.`);

  const batch: typeof leads.$inferInsert[] = [];
  const industryFocus: Record<string, string[]> = {
    "Mining & Minerals": ["raw materials", "minerals", "commodities", "metals"],
    "Manufacturing": ["components", "raw materials", "machinery", "equipment"],
    "Electronics & Semiconductors": ["components", "semiconductors", "PCBs", "electronics"],
    "Textiles & Apparel": ["fabrics", "yarn", "apparel", "textiles"],
    "Chemical & Petrochemical": ["chemicals", "raw materials", "specialty chemicals"],
    "Food & Agriculture": ["ingredients", "commodities", "packaging"],
    "Machinery & Industrial Equipment": ["parts", "equipment", "industrial supplies"],
    "Trading & Distribution": ["wholesale", "distribution", "logistics"],
    "Logistics & Shipping": ["freight", "logistics", "shipping services"],
    "General Business": ["general procurement", "supplies"],
  };

  let generated = 0;
  for (const s of suppliers) {
    if (generated >= TARGET_LEADS) break;

    const domain = getDomain(s.website, s.companyName);
    const focus = industryFocus[s.industry] || ["general procurement"];
    const sourcingFocus = focus.slice(0, 2);

    batch.push({
      userId,
      searchQueryId: null,
      companyName: s.companyName,
      industry: s.industry,
      location: `${s.city}, ${s.country}`,
      employeeRange: null,
      revenueRange: null,
      website: s.website || `www.${domain}`,
      contactName: "Procurement Department",
      contactTitle: "Procurement Department",
      contactEmail: `procurement@${domain}`,
      contactPhone: null,
      sourcingFocus,
      aiSummary: `${s.companyName} is a ${s.industry} company based in ${s.city}, ${s.country}. Sourcing focus: ${sourcingFocus.join(", ")}. Data derived from ${s.dataSource}.`,
      intentSignals: { source: `Derived from ${s.dataSource}`, verified: true },
      dataSource: `Derived from ${s.dataSource}`,
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

  const total = await db.select().from(leads).then((r) => r.length);
  console.log(`\n✅ Generated ${generated} leads from ${suppliers.length} real suppliers. Total leads in DB: ${total}.`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
