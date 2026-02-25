/**
 * Seed 100,000 B2B buyer leads for Find Leads feature.
 * Uses Drizzle ORM (shared/schema leads table).
 * Run: railway run npx tsx scripts/seed-leads.ts
 * Or: npx tsx scripts/seed-leads.ts
 */

import { db } from "../server/db";
import { leads, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const rng = (() => {
  let seed = 20250224;
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(rng() * (max - min + 1));
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function randInt(min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

const COUNTRIES = [
  { name: "United States", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"] },
  { name: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig"] },
  { name: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Sheffield"] },
  { name: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier"] },
  { name: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton", "Ottawa", "Winnipeg"] },
  { name: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle"] },
  { name: "Japan", cities: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe"] },
  { name: "Netherlands", cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen"] },
  { name: "Spain", cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Malaga"] },
  { name: "Italy", cities: ["Milan", "Rome", "Turin", "Naples", "Florence", "Bologna"] },
  { name: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"] },
  { name: "China", cities: ["Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Hangzhou", "Chengdu"] },
  { name: "Brazil", cities: ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"] },
  { name: "Mexico", cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"] },
  { name: "South Korea", cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"] },
];

const INDUSTRIES = [
  "Manufacturing", "Retail", "Healthcare", "Technology", "Construction",
  "Food & Beverage", "Automotive", "Electronics", "Chemicals", "Textiles",
  "Mining & Minerals", "Pharmaceuticals", "Logistics", "Energy", "Agriculture",
];

const JOB_TITLES = [
  "Procurement Manager", "Head of Sourcing", "Supply Chain Director",
  "Purchasing Manager", "Chief Procurement Officer", "Sourcing Specialist",
  "Category Manager", "Vendor Manager", "Strategic Sourcing Lead",
  "Supply Chain Manager", "Procurement Director", "Buyer",
];

const SOURCING_INTERESTS: Record<string, string[]> = {
  "Manufacturing": ["raw materials", "components", "machinery", "industrial equipment", "MRO supplies"],
  "Retail": ["private label", "packaging", "consumer goods", "apparel", "home goods"],
  "Healthcare": ["medical devices", "pharmaceuticals", "PPE", "hospital equipment", "consumables"],
  "Technology": ["semiconductors", "electronics", "cloud services", "IT hardware", "components"],
  "Construction": ["building materials", "heavy equipment", "cement", "steel", "lumber"],
  "Food & Beverage": ["ingredients", "packaging", "processing equipment", "beverages", "commodities"],
  "Automotive": ["OEM parts", "tier 1 components", "raw materials", "EV components"],
  "Electronics": ["PCBs", "components", "displays", "batteries", "connectors"],
  "Chemicals": ["bulk chemicals", "specialty chemicals", "raw materials", "intermediates"],
  "Textiles": ["fabrics", "yarn", "apparel", "technical textiles", "home textiles"],
  "Mining & Minerals": ["base metals", "rare earths", "minerals", "concentrates", "ores"],
  "Pharmaceuticals": ["APIs", "excipients", "packaging", "contract manufacturing"],
  "Logistics": ["freight", "warehousing", "packaging", "3PL services"],
  "Energy": ["renewables", "solar", "batteries", "grid equipment"],
  "Agriculture": ["seeds", "fertilizers", "equipment", "commodities"],
};

const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001+"];
const REVENUE_RANGES = ["< $1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M-$500M", "$500M-$1B", "$1B+"];

function generateCompanyName(country: { name: string }, industry: string): string {
  const prefixes = ["Global", "Pacific", "United", "Premier", "Apex", "Summit", "Vertex", "Nexus", "Prime", "Elite"];
  const suffixes: Record<string, string[]> = {
    "Manufacturing": ["Industries", "Manufacturing", "Solutions", "Group", "Corp"],
    "Retail": ["Retail", "Stores", "Group", "Holdings", "Inc"],
    "Healthcare": ["Health", "Medical", "Care", "Solutions", "Group"],
    "Technology": ["Tech", "Technologies", "Solutions", "Systems", "Labs"],
    "Construction": ["Construction", "Builders", "Contractors", "Group"],
    "Food & Beverage": ["Foods", "Beverages", "Trading", "Distribution"],
    "Automotive": ["Automotive", "Motors", "Parts", "Group"],
    "Electronics": ["Electronics", "Tech", "Components", "Systems"],
    "Chemicals": ["Chemicals", "Materials", "Industries", "Corp"],
    "Textiles": ["Textiles", "Fabrics", "Apparel", "Group"],
    "Mining & Minerals": ["Mining", "Minerals", "Resources", "Commodities"],
    "Pharmaceuticals": ["Pharma", "Life Sciences", "Healthcare", "Corp"],
    "Logistics": ["Logistics", "Supply Chain", "Freight", "Group"],
    "Energy": ["Energy", "Power", "Renewables", "Solutions"],
    "Agriculture": ["Agro", "Farms", "Agriculture", "Trading"],
  };
  const prefix = pick(prefixes);
  const suf = pick(suffixes[industry] || ["Group", "Corp", "Inc"]);
  const legal = country.name === "United States" ? "Inc." : country.name === "Germany" ? "GmbH" : "Ltd.";
  return `${prefix} ${suf} ${legal}`;
}

function generateEmail(companyName: string): string {
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14);
  const prefix = pick(["info", "procurement", "sourcing", "purchasing", "contact"]);
  return `${prefix}@${slug}.com`;
}

function generateWebsite(companyName: string): string {
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
  return `www.${slug}.com`;
}

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
  if (!existing) throw new Error("No users in database. Create a user first, then run: npx tsx scripts/seed-leads.ts");
  return existing.id;
}

async function main() {
  console.log("🌱 Seeding B2B buyer leads...");

  const userId = await getOrCreateSystemUserId();
  console.log(`Using userId: ${userId}`);

  const count = parseInt(process.env.LEAD_COUNT || "100000", 10);
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let batchStart = 0; batchStart < count; batchStart += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, count - batchStart);
    const batch: typeof leads.$inferInsert[] = [];

    for (let i = 0; i < batchSize; i++) {
      const country = pick(COUNTRIES);
      const city = pick(country.cities);
      const industry = pick(INDUSTRIES);
      const companyName = generateCompanyName(country, industry);
      const interests = SOURCING_INTERESTS[industry] || ["general procurement"];
      const sourcingFocus = pickN(interests, 1, 4);

      batch.push({
        userId,
        searchQueryId: null,
        companyName,
        industry,
        location: `${city}, ${country.name}`,
        employeeRange: pick(EMPLOYEE_RANGES),
        revenueRange: pick(REVENUE_RANGES),
        website: generateWebsite(companyName),
        contactName: null,
        contactTitle: pick(JOB_TITLES),
        contactEmail: generateEmail(companyName),
        contactPhone: null,
        sourcingFocus,
        aiSummary: `${companyName} is a ${industry} company based in ${city}, ${country.name}, actively sourcing ${sourcingFocus.join(", ")}.`,
        intentSignals: {
          recentActivity: pick(["high", "medium", "low"]),
          sourcingIntent: pick(["active", "exploring", "planning"]),
          budgetSignals: pick(["confirmed", "estimated", "exploratory"]),
        },
      });
    }

    await db.insert(leads).values(batch);
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${count} leads`);
  }

  console.log(`\n✅ Successfully seeded ${inserted} B2B buyer leads.`);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
