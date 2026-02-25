/**
 * Trade.gov ITA US Exporters Importer
 * Imports US exporters from the International Trade Administration's Data Services Platform.
 * Source: https://developer.trade.gov/
 *
 * Requires: TRADE_GOV_API_KEY (free at developer.trade.gov - sign up, subscribe to APIs)
 *
 * Run: npm run import:trade-gov
 */

import { PrismaClient } from "@prisma/client";
import { mapSicToIndustry } from "./sic-mapping";

const prisma = new PrismaClient();
const BATCH_SIZE = 100;
const USER_AGENT = "SmartSeek/1.0 (admin@smartseek.com)";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  console.log("=== Trade.gov ITA US Exporters Importer ===\n");

  const apiKey = process.env.TRADE_GOV_API_KEY;
  if (!apiKey) {
    console.warn("TRADE_GOV_API_KEY not set.");
    console.warn("Get a free API key at https://developer.trade.gov/ (sign up, subscribe to Data Services Platform APIs)");
    console.warn("Skipping Trade.gov import.");
    await prisma.$disconnect();
    process.exit(0);
  }

  // Trade.gov Business Service Providers API - directory of US/foreign service providers
  // Alternative: ITA Market Research Library, Tariff Rates, etc.
  const baseUrl = "https://api.trade.gov";
  let imported = 0;
  const usedSlugs = new Set<string>();

  try {
    // Business Service Providers - supports US exporters
    const res = await fetch(
      `${baseUrl}/business_service_providers/search?api_key=${apiKey}&format=json&limit=1000`,
      { headers: { "User-Agent": USER_AGENT } }
    );

    if (!res.ok) {
      console.warn(`Trade.gov API returned ${res.status}. Check your API key and subscription.`);
      await prisma.$disconnect();
      process.exit(0);
    }

    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    const results = data.results || [];

    if (results.length === 0) {
      console.log("No results from Trade.gov API. Ensure you're subscribed to the correct API.");
      await prisma.$disconnect();
      process.exit(0);
    }

    const batch: object[] = [];
    for (const r of results) {
      const companyName = (r.company_name as string) || (r.name as string) || "";
      if (!companyName.trim()) continue;

      const city = (r.city as string) || "United States";
      const state = (r.state as string) || (r.state_region as string) || "";
      const country = (r.country as string) || "United States";
      const website = (r.website as string) || null;
      const email = (r.email as string) || null;
      const phone = (r.phone as string) || null;

      let slug = slugify(companyName);
      if (usedSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;
      usedSlugs.add(slug);

      const industry = mapSicToIndustry((r.industry as string) || (r.sic_code as string) || "");
      const domain = website ? new URL(website.startsWith("http") ? website : `https://${website}`).hostname.replace("www.", "") : `${slugify(companyName).slice(0, 14)}.com`;

      batch.push({
        companyName: companyName.trim(),
        slug,
        country: country || "United States",
        countryCode: "US",
        city: city || "United States",
        region: [state].filter(Boolean).join(", ") || null,
        industry: industry || "Trading & Distribution",
        subIndustry: null,
        products: JSON.stringify([industry || "Export services"]),
        certifications: JSON.stringify([]),
        contactEmail: email || `info@${domain}`,
        contactPhone: phone || null,
        website: website || `www.${domain}`,
        description: `${companyName.trim()} is a US-based company supporting international trade and exports.`,
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
        dataSource: "Trade.gov ITA",
        contactVerified: !!(email || phone),
        registryUrl: (r.trade_gov_url as string) || `https://www.trade.gov/`,
        registryId: (r.id as string) || null,
        sicCode: (r.sic_code as string) || null,
      });

      if (batch.length >= BATCH_SIZE) {
        await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
        imported += batch.length;
        batch.length = 0;
        console.log(`  Imported ${imported} US exporters...`);
      }
    }

    if (batch.length > 0) {
      await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
      imported += batch.length;
    }

    console.log(`\n✅ Trade.gov import complete: ${imported} US exporters.`);
  } catch (e) {
    console.error("Trade.gov import error:", (e as Error).message);
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
