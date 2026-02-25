/**
 * SEC EDGAR US Importer
 * Imports US public companies from SEC EDGAR company tickers and submissions.
 * Source: https://www.sec.gov/files/company_tickers.json
 *
 * Run: npm run import:sec-edgar
 * Rate limit: 10 requests/second (SEC requirement)
 */

import { PrismaClient } from "@prisma/client";
import { mapSicToIndustry } from "./sic-mapping";

const prisma = new PrismaClient();
const BATCH_SIZE = 100;
const RATE_LIMIT_MS = 110; // ~9 req/sec to stay under 10
const USER_AGENT = "SmartSeek admin@smartseek.com";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.status === 429) {
      await sleep(5000);
      continue;
    }
    return res;
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

async function main() {
  console.log("=== SEC EDGAR US Importer ===\n");

  console.log("Fetching company tickers...");
  const tickersRes = await fetchWithRetry("https://www.sec.gov/files/company_tickers.json");
  const tickersData = (await tickersRes.json()) as Record<string, { cik_str: number; ticker: string; title: string }>;
  const companies = Object.values(tickersData);
  console.log(`Found ${companies.length} companies in tickers file.`);

  const batch: object[] = [];
  const usedSlugs = new Set<string>();
  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < companies.length; i++) {
    const c = companies[i];
    const cik = String(c.cik_str).padStart(10, "0");
    const companyName = (c.title || "").trim();
    if (!companyName) {
      skipped++;
      continue;
    }

    await sleep(RATE_LIMIT_MS);

    try {
      const subRes = await fetchWithRetry(`https://data.sec.gov/submissions/CIK${cik}.json`);
      const sub = (await subRes.json()) as {
        name?: string;
        sic?: string;
        tickers?: string[];
        phone?: string;
        website?: string;
        addresses?: {
          business?: { street1?: string; city?: string; stateOrCountry?: string; zipCode?: string };
          mail?: { street1?: string; city?: string; stateOrCountry?: string; zipCode?: string };
        };
      };

      const name = (sub.name || companyName).trim();
      const addr = sub.addresses?.business || sub.addresses?.mail;
      const city = addr?.city || "United States";
      const state = addr?.stateOrCountry || "";
      const zip = addr?.zipCode || "";
      const street = addr?.street1 || "";
      const location = [city, state, zip].filter(Boolean).join(", ");

      let slug = slugify(name);
      if (usedSlugs.has(slug)) slug = `${slug}-${cik}`;
      usedSlugs.add(slug);

      const industry = mapSicToIndustry(sub.sic || "");
      const sicCode = sub.sic || null;
      const website = sub.website && sub.website.startsWith("http") ? sub.website : null;
      const domain = website ? new URL(website).hostname.replace("www.", "") : `${slugify(name).slice(0, 15)}.com`;

      batch.push({
        companyName: name,
        slug,
        country: "United States",
        countryCode: "US",
        city: city || "United States",
        region: [street, state, zip].filter(Boolean).join(", ") || null,
        industry,
        subIndustry: sub.sic || null,
        products: JSON.stringify(industry.split(" & ")),
        certifications: JSON.stringify([]),
        contactEmail: `info@${domain}`,
        contactPhone: sub.phone || null,
        website: website || `www.${domain}`,
        description: `${name} is a ${industry} company based in the United States. ${sub.tickers?.length ? `Publicly traded (${sub.tickers.join(", ")}).` : ""}`,
        employeeCount: null,
        annualRevenue: null,
        yearEstablished: 2000,
        verified: true,
        rating: 4.0,
        reviewCount: 0,
        responseTime: null,
        minOrderValue: null,
        currency: "USD",
        paymentTerms: JSON.stringify(["T/T", "L/C"]),
        exportMarkets: JSON.stringify(["North America", "Europe"]),
        logoUrl: null,
        dataSource: "SEC EDGAR",
        contactVerified: !!(sub.website || sub.phone),
        registryUrl: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}`,
        registryId: cik,
        sicCode,
      });

      if (batch.length >= BATCH_SIZE) {
        await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
        imported += batch.length;
        batch.length = 0;
        console.log(`  Imported ${imported}/${companies.length} US suppliers...`);
      }
    } catch (e) {
      skipped++;
      if (i % 500 === 0 && i > 0) console.log(`  Progress: ${i}/${companies.length}, skipped: ${skipped}`);
    }
  }

  if (batch.length > 0) {
    await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
    imported += batch.length;
  }

  console.log(`\n✅ SEC EDGAR import complete: ${imported} US suppliers (${skipped} skipped).`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
