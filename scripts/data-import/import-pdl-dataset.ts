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
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { getCountryCode, getDisplayForCode } from "../../server/lib/countryCodes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

function normalizeCountryToCanonical(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const code = getCountryCode(trimmed);
  if (code === "SKIP" || code === "XX" || code === "UD") return trimmed;
  return getDisplayForCode(code);
}
function getCountryCodeForImport(raw: string): string {
  const code = getCountryCode(raw);
  if (code === "SKIP" || code === "XX" || code === "UD") {
    return (raw || "").trim().length === 2 ? (raw || "").toUpperCase().substring(0, 2) : "XX";
  }
  return code;
}

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
  "computer software": "Electronics & Semiconductors",
  "information technology": "Electronics & Semiconductors",
  "information technology and services": "Electronics & Semiconductors",
  "computer & network security": "Electronics & Semiconductors",
  "computer hardware": "Electronics & Semiconductors",
  // Extra industries to reach 3.5M (still B2B-relevant)
  "industrial": "Machinery & Industrial Equipment",
  "engineering": "Machinery & Industrial Equipment",
  "professional services": "Wholesale & Distribution",
  "business services": "Wholesale & Distribution",
  "financial services": "Wholesale & Distribution",
  "insurance": "Wholesale & Distribution",
  "real estate": "Construction & Building Materials",
  "legal services": "Wholesale & Distribution",
  "accounting": "Wholesale & Distribution",
  "marketing": "Consumer Goods & Retail",
  "advertising": "Consumer Goods & Retail",
  "design": "Manufacturing (General)",
  "research": "Healthcare & Medical Devices",
  "environmental": "Energy & Renewables",
  "waste": "Energy & Renewables",
  "telecommunications": "Electronics & Semiconductors",
  "printing": "Paper & Packaging",
  "metal": "Mining & Minerals",
  "steel": "Mining & Minerals",
  "rubber": "Chemicals & Petrochemicals",
  "leather": "Textiles & Apparel",
};

async function main() {
  // PDL_CSV_PATH env overrides default (e.g. if you kept Kaggle filename)
  const defaultCsv = path.join(__dirname, "pdl-companies.csv");
  const csvPath = process.env.PDL_CSV_PATH
    ? path.resolve(process.env.PDL_CSV_PATH)
    : defaultCsv;

  if (!fs.existsSync(csvPath)) {
    console.error(`\n❌ CSV file not found at: ${csvPath}`);
    console.error(`\nDownload the free dataset from:`);
    console.error(`  Option A (22M): https://www.peopledatalabs.com/company-dataset`);
    console.error(`  Option B (7M):  https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset`);
    console.error(`\nPlace the CSV at: ${csvPath}`);
    console.error(`   Or set PDL_CSV_PATH to your file path (e.g. ./scripts/data-import/companies.csv)`);
    process.exit(1);
  }

  const stat = fs.statSync(csvPath);
  if (stat.size < 100) {
    console.error(`\n❌ CSV file is empty or too small (${stat.size} bytes) at: ${csvPath}`);
    console.error(`\nPlease add your company data. Supported formats:`);
    console.error(`  - PDL/Kaggle: name, country, locality, industry, founded, size, website, linkedin_url`);
    console.error(`  - Alternative: name, country, city/locality, industry, year_founded, domain, size_range`);
    console.error(`\nDownload from: https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset`);
    process.exit(1);
  }

  // Flexible column mapping (PDL uses: name, country, locality, industry, founded, size, website, linkedin_url)
  function getRowVal(row: Record<string, unknown>, ...keys: string[]): string {
    for (const k of keys) {
      const v = row[k];
      if (v != null && String(v).trim()) return String(v).trim();
    }
    return "";
  }
  function getDomain(row: Record<string, unknown>): string {
    const w = getRowVal(row, "website", "domain");
    if (!w) return "";
    try {
      const url = w.startsWith("http") ? w : `https://${w}`;
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return w.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "";
    }
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
  // Target 4.3M registry-verified suppliers (quality layer from ~29M raw). Override with PDL_TARGET_COUNT env.
  const TARGET_COUNT = parseInt(process.env.PDL_TARGET_COUNT || "4300000", 10) || 4_300_000;
  const IMPORT_ALL = process.env.PDL_IMPORT_ALL === "true"; // Skip industry filter, import all companies
  console.log(`   Target: ${TARGET_COUNT.toLocaleString()} suppliers (set PDL_TARGET_COUNT to override)`);
  console.log(`   Mode: ${IMPORT_ALL ? "Import ALL industries" : "Filter by target industries only"}\n`);

  for await (const row of parser) {
    processed++;

    if (imported >= TARGET_COUNT) break;

    const industryRaw = (getRowVal(row, "industry") || "").toLowerCase().trim();
    let mappedIndustry = TARGET_INDUSTRIES[industryRaw];
    if (!mappedIndustry) {
      for (const [key, val] of Object.entries(TARGET_INDUSTRIES)) {
        if (industryRaw.includes(key) || key.includes(industryRaw)) {
          mappedIndustry = val;
          break;
        }
      }
    }
    if (!mappedIndustry) {
      if (IMPORT_ALL && industryRaw) {
        mappedIndustry = industryRaw.charAt(0).toUpperCase() + industryRaw.slice(1);
      } else if (IMPORT_ALL) {
        mappedIndustry = "General";
      } else {
        skipped++;
        continue;
      }
    }

    const countryRaw = getRowVal(row, "country");
    const name = getRowVal(row, "name", "company_name", "companyName");
    if (!name || !countryRaw) {
      skipped++;
      continue;
    }

    const country = normalizeCountryToCanonical(countryRaw);
    const locality = getRowVal(row, "locality", "city", "region") || country;
    const domain = getDomain(row) || getRowVal(row, "domain"); // CSV has "domain" column
    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 70);
    const slug = `${slugBase}-${imported}`;
    const contactEmail = domain ? `info@${domain}` : `contact-${slugBase}@pdl.local`;
    const yearVal = getRowVal(row, "founded", "year_founded", "yearFounded", "year founded");
    const sizeVal = getRowVal(row, "size", "size_range", "sizeRange", "size range");
    const empVal = getRowVal(row, "current employee estimate", "total employee estimate", "current_employee_estimate", "total_employee_estimate", "employee_count");

    batch.push({
      companyName: name,
      slug,
      country,
      countryCode: getCountryCodeForImport(countryRaw),
      city: locality,
      industry: mappedIndustry,
      subIndustry: getRowVal(row, "industry"),
      products: JSON.stringify(mappedIndustry.split(" & ")),
      description: `${name} is a ${getRowVal(row, "industry")} company based in ${locality}.${sizeVal ? ` Company size: ${sizeVal}.` : ""}${yearVal ? ` Founded: ${yearVal}.` : ""}`,
      website: (() => {
        const w = getRowVal(row, "website", "domain");
        if (!w) return domain ? `https://${domain}` : null;
        return w.startsWith("http") ? w : `https://${w}`;
      })(),
      contactEmail,
      contactPhone: null,
      verified: true,
      rating: 4.0 + Math.random() * 0.9,
      yearEstablished: yearVal ? parseInt(yearVal, 10) || 2000 : 2000,
      employeeCount: empVal ? parseInt(empVal, 10) || null : null,
      certifications: JSON.stringify([]),
      paymentTerms: JSON.stringify(["Net 30", "Wire Transfer"]),
      exportMarkets: JSON.stringify([country]),
      dataSource: "People Data Labs (CC BY 4.0)",
      registryUrl: getRowVal(row, "linkedin_url", "linkedin url", "linkedin") || null,
    });

    if (batch.length >= BATCH_SIZE) {
      try {
        await prisma.supplier.createMany({ data: batch as never[], skipDuplicates: true });
        imported += batch.length;
        // Small delay to avoid exhausting Railway DB connections (prevents ECONNRESET on live site)
        await new Promise((r) => setTimeout(r, 150));
        if (imported % 5000 === 0) {
          console.log(`   ✅ ${imported.toLocaleString()} suppliers imported (${processed.toLocaleString()} rows processed)`);
        }
      } catch (e: unknown) {
        const err = e as Error;
        if (imported === 0) console.error(`   ⚠️ First batch error: ${err.message}`);
        else if (imported % 25000 === 0) console.error(`   ⚠️ Batch error at ${imported}: ${err.message?.substring(0, 150)}`);
      }
      batch = [];
    }
  }

  if (batch.length > 0) {
    try {
      await prisma.supplier.createMany({ data: batch as never[], skipDuplicates: true });
      imported += batch.length;
    } catch (e: unknown) {
      console.error(`   ⚠️ Final batch error: ${(e as Error).message}`);
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
