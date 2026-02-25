/**
 * OpenCorporates Enrichment
 * Adds companies from jurisdictions not covered by Companies House or SEC.
 * Source: https://api.opencorporates.com/v0.4/companies/search
 *
 * Requires OPENCORPORATES_API_TOKEN for API access (free tier available).
 * Run: npm run import:opencorporates
 * Rate limit: ~5 req/sec on free tier
 */

import { PrismaClient } from "@prisma/client";
import { mapSicToIndustry } from "./sic-mapping";

const prisma = new PrismaClient();
const RATE_LIMIT_MS = 200; // ~5 req/sec
const TARGET_PER_JURISDICTION = 8000;
const PAGES_PER_QUERY = 15; // 30 per page × 15 = 450 per query
const USER_AGENT = "SmartSeek/1.0 (admin@smartseek.com)";

const JURISDICTIONS = [
  { code: "gb", name: "United Kingdom", countryCode: "GB" },
  { code: "de", name: "Germany", countryCode: "DE" },
  { code: "fr", name: "France", countryCode: "FR" },
  { code: "in", name: "India", countryCode: "IN" },
  { code: "cn", name: "China", countryCode: "CN" },
  { code: "tr", name: "Turkey", countryCode: "TR" },
  { code: "nl", name: "Netherlands", countryCode: "NL" },
  { code: "es", name: "Spain", countryCode: "ES" },
  { code: "it", name: "Italy", countryCode: "IT" },
  { code: "pl", name: "Poland", countryCode: "PL" },
  { code: "mx", name: "Mexico", countryCode: "MX" },
  { code: "br", name: "Brazil", countryCode: "BR" },
  { code: "au", name: "Australia", countryCode: "AU" },
  { code: "ca", name: "Canada", countryCode: "CA" },
  { code: "jp", name: "Japan", countryCode: "JP" },
  { code: "kr", name: "South Korea", countryCode: "KR" },
  { code: "id", name: "Indonesia", countryCode: "ID" },
  { code: "my", name: "Malaysia", countryCode: "MY" },
  { code: "th", name: "Thailand", countryCode: "TH" },
  { code: "vn", name: "Vietnam", countryCode: "VN" },
];

const INDUSTRY_QUERIES = [
  "manufacturing",
  "mining",
  "electronics",
  "textiles",
  "chemicals",
  "machinery",
  "food",
  "trading",
  "logistics",
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("=== OpenCorporates Enrichment ===\n");

  const apiToken = process.env.OPENCORPORATES_API_TOKEN;
  if (!apiToken) {
    console.warn("OPENCORPORATES_API_TOKEN not set. OpenCorporates API requires authentication.");
    console.warn("Get a free token at https://opencorporates.com/api_accounts/new");
    console.warn("Skipping OpenCorporates import.");
    await prisma.$disconnect();
    process.exit(0);
  }

  let totalImported = 0;
  const usedSlugs = new Set<string>();

  for (const jur of JURISDICTIONS) {
    let imported = 0;
    for (const q of INDUSTRY_QUERIES) {
      if (imported >= TARGET_PER_JURISDICTION) break;

      for (let page = 1; page <= PAGES_PER_QUERY; page++) {
        if (imported >= TARGET_PER_JURISDICTION) break;
        await sleep(RATE_LIMIT_MS);

        const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(q)}&jurisdiction_code=${jur.code}&per_page=30&page=${page}&api_token=${apiToken}`;
        try {
          const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
          if (!res.ok) {
            console.warn(`  ${jur.name} (${q}) p${page}: ${res.status}`);
            break;
          }
          const data = (await res.json()) as {
            results?: { companies?: Array<{
              company?: {
                name?: string;
                company_number?: string;
                jurisdiction_code?: string;
                registered_address_in_full?: string;
                incorporation_date?: string;
                company_type?: string;
                current_status?: string;
                opencorporates_url?: string;
              };
            }>;
          };

          const companies = data.results?.companies || [];
          const batch: object[] = [];

          for (const item of companies) {
            const c = item.company;
            if (!c || c.current_status !== "Active") continue;

            const companyName = (c.name || "").trim();
            if (!companyName) continue;

            let slug = slugify(companyName);
            const regNum = c.company_number || "";
            if (usedSlugs.has(slug)) slug = `${slug}-${regNum}`;
            usedSlugs.add(slug);

            const incorpDate = c.incorporation_date || "";
            const yearEst = incorpDate ? parseInt(incorpDate.slice(0, 4), 10) : 2000;
            const yearEstablished = isNaN(yearEst) || yearEst < 1800 ? 2000 : Math.min(yearEst, 2025);

            const industry = mapSicToIndustry(q);
            const addr = c.registered_address_in_full || jur.name;
            const city = addr.split(",")[0]?.trim() || jur.name;

            batch.push({
              companyName,
              slug,
              country: jur.name,
              countryCode: jur.countryCode,
              city,
              region: addr || null,
              industry,
              subIndustry: c.company_type || null,
              products: JSON.stringify(industry.split(" & ")),
              certifications: JSON.stringify([]),
              contactEmail: `info@${slugify(companyName).slice(0, 14)}.com`,
              contactPhone: null,
              website: `www.${slugify(companyName).slice(0, 14)}.com`,
              description: `${companyName} is a ${industry} company registered in ${jur.name}.`,
              employeeCount: null,
              annualRevenue: null,
              yearEstablished,
              verified: true,
              rating: 4.0,
              reviewCount: 0,
              responseTime: null,
              minOrderValue: null,
              currency: "USD",
              paymentTerms: JSON.stringify(["T/T", "L/C"]),
              exportMarkets: JSON.stringify(["Europe", "North America"]),
              logoUrl: null,
              dataSource: "OpenCorporates",
              contactVerified: false,
              registryUrl: c.opencorporates_url || null,
              registryId: regNum || null,
              sicCode: null,
            });
          }

          if (batch.length > 0) {
            await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
            imported += batch.length;
            totalImported += batch.length;
          }
          if (companies.length < 30) break; // No more pages
        } catch (e) {
          console.warn(`  ${jur.name} (${q}) p${page}: ${(e as Error).message}`);
        }
      }
    }
    console.log(`  ${jur.name}: ${imported} companies`);
  }

  console.log(`\n✅ OpenCorporates import complete: ${totalImported} suppliers.`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
