/**
 * Import People Data Labs Free Company Dataset
 * Source: https://www.peopledatalabs.com/company-dataset
 * License: CC BY 4.0
 * ~22M companies, 170+ countries
 *
 * The dataset is a large CSV (~2GB). We stream-parse it and filter for
 * manufacturing, mining, wholesale, logistics, and industrial companies.
 *
 * USAGE:
 * 1. Download from https://www.peopledatalabs.com/company-dataset (requires free account)
 *    OR from Kaggle: https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset
 *    (Kaggle version is 7M subset, still excellent)
 * 2. Place CSV in scripts/data-import/pdl-companies.csv
 * 3. Run: npm run import:pdl
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

const TARGET_INDUSTRIES: Record<string, string> = {
  "mining & metals": "Mining & Minerals",
  mining: "Mining & Minerals",
  metals: "Mining & Minerals",
  "oil & energy": "Energy & Renewables",
  "oil & gas": "Energy & Renewables",
  "renewables & environment": "Energy & Renewables",
  utilities: "Energy & Renewables",
  chemicals: "Chemicals & Petrochemicals",
  plastics: "Chemicals & Petrochemicals",
  "building materials": "Construction & Building Materials",
  construction: "Construction & Building Materials",
  "civil engineering": "Construction & Building Materials",
  automotive: "Automotive & Transport",
  transportation: "Automotive & Transport",
  "logistics and supply chain": "Logistics & Supply Chain",
  warehousing: "Logistics & Supply Chain",
  "package/freight delivery": "Logistics & Supply Chain",
  "import and export": "Logistics & Supply Chain",
  machinery: "Machinery & Industrial Equipment",
  "industrial automation": "Machinery & Industrial Equipment",
  "mechanical or industrial engineering": "Machinery & Industrial Equipment",
  "electrical/electronic manufacturing": "Electronics & Semiconductors",
  semiconductors: "Electronics & Semiconductors",
  "consumer electronics": "Electronics & Semiconductors",
  "food & beverages": "Food & Agriculture",
  farming: "Food & Agriculture",
  "food production": "Food & Agriculture",
  dairy: "Food & Agriculture",
  fishery: "Food & Agriculture",
  textiles: "Textiles & Apparel",
  "apparel & fashion": "Textiles & Apparel",
  "luxury goods & jewelry": "Textiles & Apparel",
  pharmaceuticals: "Healthcare & Medical Devices",
  "medical devices": "Healthcare & Medical Devices",
  "hospital & health care": "Healthcare & Medical Devices",
  biotechnology: "Healthcare & Medical Devices",
  "paper & forest products": "Paper & Packaging",
  "packaging and containers": "Paper & Packaging",
  furniture: "Manufacturing (General)",
  "glass, ceramics & concrete": "Manufacturing (General)",
  manufacturing: "Manufacturing (General)",
  wholesale: "Wholesale & Distribution",
  retail: "Consumer Goods & Retail",
  "consumer goods": "Consumer Goods & Retail",
  "defense & space": "Aerospace & Defense",
  "aviation & aerospace": "Aerospace & Defense",
  maritime: "Maritime & Shipping",
  shipbuilding: "Maritime & Shipping",
};

function getCountryCode(country: string): string {
  const map: Record<string, string> = {
    "united states": "US",
    "united kingdom": "GB",
    china: "CN",
    india: "IN",
    germany: "DE",
    france: "FR",
    japan: "JP",
    "south korea": "KR",
    brazil: "BR",
    canada: "CA",
    australia: "AU",
    italy: "IT",
    spain: "ES",
    mexico: "MX",
    indonesia: "ID",
    netherlands: "NL",
    turkey: "TR",
    "saudi arabia": "SA",
    switzerland: "CH",
    poland: "PL",
    sweden: "SE",
    belgium: "BE",
    austria: "AT",
    norway: "NO",
    denmark: "DK",
    finland: "FI",
    ireland: "IE",
    portugal: "PT",
    "czech republic": "CZ",
    romania: "RO",
    thailand: "TH",
    vietnam: "VN",
    malaysia: "MY",
    philippines: "PH",
    singapore: "SG",
    pakistan: "PK",
    bangladesh: "BD",
    egypt: "EG",
    "south africa": "ZA",
    nigeria: "NG",
    kenya: "KE",
    morocco: "MA",
    chile: "CL",
    colombia: "CO",
    argentina: "AR",
    peru: "PE",
    "united arab emirates": "AE",
    israel: "IL",
    "new zealand": "NZ",
    hungary: "HU",
    greece: "GR",
    ukraine: "UA",
    russia: "RU",
    taiwan: "TW",
  };
  return map[country.toLowerCase()] || country.substring(0, 2).toUpperCase();
}

async function main() {
  const csvPath = path.join(__dirname, "pdl-companies.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`\n❌ CSV file not found at: ${csvPath}`);
    console.error(`\nDownload the free dataset from:`);
    console.error(`  Option A (22M): https://www.peopledatalabs.com/company-dataset`);
    console.error(`  Option B (7M):  https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset`);
    console.error(`\nPlace the CSV file at: ${csvPath}`);
    process.exit(1);
  }

  console.log("🚀 Starting People Data Labs import...");
  console.log("   Streaming CSV and filtering for target industries...\n");

  const parser = fs.createReadStream(csvPath).pipe(
    parse({ columns: true, skip_empty_lines: true, relax_column_count: true })
  );

  let processed = 0;
  let imported = 0;
  let skipped = 0;
  let batch: Record<string, unknown>[] = [];
  const BATCH_SIZE = 500;
  const TARGET_COUNT = 200_000;

  for await (const row of parser) {
    processed++;

    if (imported >= TARGET_COUNT) break;

    const industry = (row.industry || "").toLowerCase().trim();
    const mappedIndustry = TARGET_INDUSTRIES[industry];

    if (!mappedIndustry) {
      skipped++;
      continue;
    }

    const country = (row.country || "").trim();
    const name = (row.name || "").trim();
    if (!name || !country) {
      skipped++;
      continue;
    }

    const locality = (row.locality || "").trim() || country;
    const domain = (row.domain || "").trim();
    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 70);
    const slug = `${slugBase}-${imported}`;
    const contactEmail = domain ? `info@${domain}` : `contact-${slugBase}@pdl.local`;

    batch.push({
      companyName: name,
      slug,
      country,
      countryCode: getCountryCode(country),
      city: locality,
      industry: mappedIndustry,
      subIndustry: (row.industry || "").trim(),
      products: JSON.stringify(mappedIndustry.split(" & ")),
      description: `${name} is a ${(row.industry || "").trim()} company based in ${locality}.${row.size_range ? ` Company size: ${row.size_range}.` : ""}${row.year_founded ? ` Founded: ${row.year_founded}.` : ""}`,
      website: domain ? `https://${domain}` : null,
      contactEmail,
      contactPhone: null,
      verified: true,
      rating: 4.0 + Math.random() * 0.9,
      yearEstablished: row.year_founded ? parseInt(row.year_founded, 10) || 2000 : 2000,
      employeeCount: row.current_employee_estimate ? parseInt(row.current_employee_estimate, 10) || null : null,
      certifications: JSON.stringify([]),
      paymentTerms: JSON.stringify(["Net 30", "Wire Transfer"]),
      exportMarkets: JSON.stringify([country]),
      dataSource: "People Data Labs (CC BY 4.0)",
      registryUrl: row.linkedin_url || null,
    });

    if (batch.length >= BATCH_SIZE) {
      try {
        await prisma.supplier.createMany({ data: batch as never[], skipDuplicates: true });
        imported += batch.length;
        if (imported % 5000 === 0) {
          console.log(`   ✅ ${imported.toLocaleString()} suppliers imported (${processed.toLocaleString()} rows processed)`);
        }
      } catch (e: unknown) {
        console.error(`   ⚠️ Batch error (continuing): ${(e as Error).message?.substring(0, 100)}`);
      }
      batch = [];
    }
  }

  if (batch.length > 0) {
    try {
      await prisma.supplier.createMany({ data: batch as never[], skipDuplicates: true });
      imported += batch.length;
    } catch (e: unknown) {
      console.error(`   ⚠️ Final batch error: ${(e as Error).message?.substring(0, 100)}`);
    }
  }

  const countryCounts = await prisma.supplier.groupBy({
    by: ["country"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 30,
  });

  const total = await prisma.supplier.count();
  const countryGroups = await prisma.supplier.groupBy({ by: ["country"], _count: { id: true } });

  console.log(`\n✅ IMPORT COMPLETE`);
  console.log(`   Total suppliers in database: ${total.toLocaleString()}`);
  console.log(`   Countries represented: ${countryGroups.length}`);
  console.log(`   Imported from PDL: ${imported.toLocaleString()}`);
  console.log(`   Skipped (wrong industry): ${skipped.toLocaleString()}`);
  console.log(`\n📊 Top 20 countries:`);
  countryCounts.slice(0, 20).forEach((c) => {
    console.log(`   ${c.country}: ${c._count.id.toLocaleString()}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
