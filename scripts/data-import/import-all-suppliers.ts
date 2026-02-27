/**
 * Import suppliers from BOTH companies.csv and pdl-companies.csv
 * Processes ALL 42M+ rows; imports ONLY records with full data (name, country, locality, website/domain).
 *
 * Default paths:
 *   - companies.csv: /Users/harunkaya/Downloads/companies.csv (~35M rows)
 *   - pdl-companies.csv: /Users/harunkaya/Downloads/scripts:data-import:pdl-companies.csv (~7M rows)
 *
 * Run: NODE_TLS_REJECT_UNAUTHORIZED=0 npm run import:all-suppliers-29m
 * Or: PDL_IMPORT_ALL=true npm run import:all-suppliers
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { getCountryCode, getDisplayForCode } from "../../server/lib/countryCodes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

const TARGET_COUNT = parseInt(process.env.PDL_TARGET_COUNT || "50000000", 10) || 50_000_000;
const QUALITY_ONLY = process.env.QUALITY_ONLY !== "false";
const BATCH_SIZE = 500;
const seen = new Set<string>(); // Dedupe by "name|country"

function dedupeKey(name: string, country: string): string {
  return `${(name || "").toLowerCase().trim()}|${(country || "").toLowerCase().trim()}`;
}

// Reuse industry mapping from import-pdl-dataset
const TARGET_INDUSTRIES: Record<string, string> = {
  "mining & metals": "Mining & Minerals", mining: "Mining & Minerals", metals: "Mining & Minerals",
  "oil & energy": "Energy & Renewables", "oil & gas": "Energy & Renewables", "renewables & environment": "Energy & Renewables", utilities: "Energy & Renewables",
  chemicals: "Chemicals & Petrochemicals", plastics: "Chemicals & Petrochemicals",
  "building materials": "Construction & Building Materials", construction: "Construction & Building Materials", "civil engineering": "Construction & Building Materials",
  automotive: "Automotive & Transport", transportation: "Automotive & Transport",
  "logistics and supply chain": "Logistics & Supply Chain", warehousing: "Logistics & Supply Chain", "package/freight delivery": "Logistics & Supply Chain", "import and export": "Logistics & Supply Chain",
  machinery: "Machinery & Industrial Equipment", "industrial automation": "Machinery & Industrial Equipment", "mechanical or industrial engineering": "Machinery & Industrial Equipment",
  "electrical/electronic manufacturing": "Electronics & Semiconductors", semiconductors: "Electronics & Semiconductors", "consumer electronics": "Electronics & Semiconductors",
  "food & beverages": "Food & Agriculture", farming: "Food & Agriculture", "food production": "Food & Agriculture", dairy: "Food & Agriculture", fishery: "Food & Agriculture",
  textiles: "Textiles & Apparel", "apparel & fashion": "Textiles & Apparel", "luxury goods & jewelry": "Textiles & Apparel",
  pharmaceuticals: "Healthcare & Medical Devices", "medical devices": "Healthcare & Medical Devices", "hospital & health care": "Healthcare & Medical Devices", biotechnology: "Healthcare & Medical Devices",
  "paper & forest products": "Paper & Packaging", "packaging and containers": "Paper & Packaging",
  furniture: "Manufacturing (General)", "glass, ceramics & concrete": "Manufacturing (General)", manufacturing: "Manufacturing (General)",
  wholesale: "Wholesale & Distribution", retail: "Consumer Goods & Retail", "consumer goods": "Consumer Goods & Retail",
  "defense & space": "Aerospace & Defense", "aviation & aerospace": "Aerospace & Defense", maritime: "Maritime & Shipping", shipbuilding: "Maritime & Shipping",
  "computer software": "Electronics & Semiconductors", "information technology": "Electronics & Semiconductors", "information technology and services": "Electronics & Semiconductors",
  "computer & network security": "Electronics & Semiconductors", "computer hardware": "Electronics & Semiconductors",
  industrial: "Machinery & Industrial Equipment", engineering: "Machinery & Industrial Equipment",
  "professional services": "Wholesale & Distribution", "business services": "Wholesale & Distribution", "financial services": "Wholesale & Distribution",
  insurance: "Wholesale & Distribution", "real estate": "Construction & Building Materials", "legal services": "Wholesale & Distribution", accounting: "Wholesale & Distribution",
  marketing: "Consumer Goods & Retail", advertising: "Consumer Goods & Retail", design: "Manufacturing (General)", research: "Healthcare & Medical Devices",
  environmental: "Energy & Renewables", waste: "Energy & Renewables", telecommunications: "Electronics & Semiconductors", printing: "Paper & Packaging",
  metal: "Mining & Minerals", steel: "Mining & Minerals", rubber: "Chemicals & Petrochemicals", leather: "Textiles & Apparel",
  leatherworks: "Textiles & Apparel", leatherwork: "Textiles & Apparel", tannery: "Textiles & Apparel",
  ore: "Mining & Minerals", ores: "Mining & Minerals", "tin ore": "Mining & Minerals", "antimony ore": "Mining & Minerals",
  "iron ore": "Mining & Minerals", "copper ore": "Mining & Minerals", "zinc ore": "Mining & Minerals", "lead ore": "Mining & Minerals",
  "bauxite": "Mining & Minerals", "rare earth": "Mining & Minerals", "rare earths": "Mining & Minerals",
  "lithium": "Mining & Minerals", "cobalt": "Mining & Minerals", "nickel": "Mining & Minerals", "manganese": "Mining & Minerals",
  "tungsten": "Mining & Minerals", "molybdenum": "Mining & Minerals", "chromium": "Mining & Minerals",
  "tin": "Mining & Minerals", "antimony": "Mining & Minerals", "bismuth": "Mining & Minerals",
  "mineral": "Mining & Minerals", "minerals": "Mining & Minerals", "quarry": "Mining & Minerals",
};

/** Normalize country to canonical display name using full ISO 3166-1 map — all countries. */
function normalizeCountryToCanonical(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const code = getCountryCode(trimmed);
  if (code === "SKIP" || code === "XX" || code === "UD") return trimmed;
  return getDisplayForCode(code);
}

/** Get ISO code for import (handles 2-char raw). */
function getCountryCodeForImport(raw: string): string {
  const code = getCountryCode(raw);
  if (code === "SKIP" || code === "XX" || code === "UD") {
    return (raw || "").trim().length === 2 ? (raw || "").toUpperCase().substring(0, 2) : "XX";
  }
  return code;
}

const ABBREVIATIONS = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "llp", "plc", "sa", "ag", "nv", "bv", "corp", "pl", "spa", "srl", "ltda", "sl", "ab", "oy", "as"]);

function toTitleCase(s: string): string {
  if (!s || typeof s !== "string") return s;
  return s.replace(/\w\S*/g, (w) => {
    const lower = w.toLowerCase();
    if (ABBREVIATIONS.has(lower)) return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  });
}

function getIndustry(row: Record<string, unknown>, format: "companies" | "pdl", companyName?: string): string {
  const raw = String((format === "companies" ? row["industry"] : row["industry"] ?? row["Industry"]) ?? "").toLowerCase().trim();
  let mapped = TARGET_INDUSTRIES[raw];
  if (!mapped) {
    for (const [key, val] of Object.entries(TARGET_INDUSTRIES)) {
      if (raw.includes(key) || key.includes(raw)) { mapped = val; break; }
    }
  }
  // Infer from company name when industry is empty or generic
  const name = (companyName || "").toLowerCase();
  if (!mapped && name) {
    if (name.includes("leather") || name.includes("textile") || name.includes("apparel") || name.includes("fashion") || name.includes("garment")) mapped = "Textiles & Apparel";
    else if (name.includes("mining") || name.includes("mineral") || name.includes("metal") || name.includes("steel") || name.includes("ore") || name.includes("tin") || name.includes("antimony") || name.includes("lithium") || name.includes("cobalt") || name.includes("bauxite") || name.includes("rare earth")) mapped = "Mining & Minerals";
    else if (name.includes("food") || name.includes("agriculture") || name.includes("farm") || name.includes("beverage")) mapped = "Food & Agriculture";
    else if (name.includes("electronic") || name.includes("semiconductor") || name.includes("software") || name.includes("it ")) mapped = "Electronics & Semiconductors";
    else if (name.includes("health") || name.includes("medical") || name.includes("pharma") || name.includes("hospital")) mapped = "Healthcare & Medical Devices";
    else if (name.includes("chemical") || name.includes("plastic")) mapped = "Chemicals & Petrochemicals";
    else if (name.includes("construction") || name.includes("building") || name.includes("civil")) mapped = "Construction & Building Materials";
    else if (name.includes("machinery") || name.includes("industrial") || name.includes("engineering")) mapped = "Machinery & Industrial Equipment";
  }
  if (!mapped && process.env.PDL_IMPORT_ALL === "true" && raw) {
    mapped = raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  if (!mapped) mapped = "";
  return mapped;
}

function getVal(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return "";
}

const MINERAL_KEYWORDS = ["tin", "antimony", "ore", "ores", "iron", "copper", "zinc", "lead", "bauxite", "lithium", "cobalt", "nickel", "manganese", "tungsten", "molybdenum", "chromium", "bismuth", "rare earth", "mineral", "minerals", "metal", "metals"];

function extractMineralProducts(industry: string, subIndustry: string, companyName: string): string[] {
  const base = (industry || "General").split(" & ").map((p) => toTitleCase(p.trim()));
  const combined = `${(subIndustry || "").toLowerCase()} ${(companyName || "").toLowerCase()}`;
  const extra: string[] = [];
  for (const kw of MINERAL_KEYWORDS) {
    if (combined.includes(kw)) extra.push(toTitleCase(kw));
  }
  if (extra.length > 0) return [...new Set([...base, ...extra])];
  return base;
}

async function processFile(
  csvPath: string,
  format: "companies" | "pdl",
  importedRef: { count: number }
): Promise<number> {
  if (!fs.existsSync(csvPath) || fs.statSync(csvPath).size < 100) return 0;
  const parser = fs.createReadStream(csvPath).pipe(
    parse({ columns: true, skip_empty_lines: true, relax_column_count: true, relax_quotes: true })
  );
  let batch: Record<string, unknown>[] = [];
  let added = 0;

  for await (const row of parser) {
    if (importedRef.count >= TARGET_COUNT) break;

    const name = format === "companies" ? getVal(row, "name") : getVal(row, "name", "company_name", "companyName");
    const countryRaw = format === "companies" ? getVal(row, "country") : getVal(row, "country");
    if (!name || !countryRaw) continue;

    const locality = format === "companies" ? getVal(row, "locality") : getVal(row, "locality", "city", "region");
    const domain = format === "companies"
      ? (getVal(row, "website") || "").replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || ""
      : getVal(row, "domain");
    const website = format === "companies" ? getVal(row, "website") : getVal(row, "website", "domain");

    if (QUALITY_ONLY && (!locality || (!domain && !website))) continue;

    const country = normalizeCountryToCanonical(countryRaw);
    const key = dedupeKey(name, country);
    if (seen.has(key)) continue;
    seen.add(key);

    const industry = getIndustry(row, format, name);
    if (!industry && process.env.PDL_IMPORT_ALL !== "true") continue;

    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 70);
    const slug = `${slugBase}-${importedRef.count}`;
    const yearVal = format === "companies" ? getVal(row, "founded") : getVal(row, "year founded", "founded", "year_founded");
    const linkedin = format === "companies" ? getVal(row, "linkedin_url") : getVal(row, "linkedin url", "linkedin_url");

    const rawSubIndustry = getVal(row, "industry");
    const productsArr = extractMineralProducts(industry || "", rawSubIndustry, name);
    const descSuffix = productsArr.length > 2 ? ` (${productsArr.slice(0, 4).join(", ")})` : "";
    batch.push({
      companyName: toTitleCase(name),
      slug,
      country,
      countryCode: getCountryCodeForImport(countryRaw),
      city: toTitleCase(locality || country),
      industry: industry || "General",
      subIndustry: rawSubIndustry ? toTitleCase(rawSubIndustry) : null,
      products: JSON.stringify(productsArr),
      description: `${toTitleCase(name)} is a ${industry || "company"} based in ${toTitleCase(locality || country)}${descSuffix}.`,
      website: website ? (website.startsWith("http") ? website : `https://${website}`) : (domain ? `https://${domain}` : null),
      contactEmail: domain ? `info@${domain}` : `contact-${slugBase}@import.local`,
      contactPhone: null,
      verified: true,
      rating: 0,
      yearEstablished: yearVal ? parseInt(yearVal, 10) || 2000 : 2000,
      employeeCount: null,
      certifications: JSON.stringify([]),
      paymentTerms: JSON.stringify(["Net 30", "Wire Transfer"]),
      exportMarkets: JSON.stringify([toTitleCase(country)]),
      dataSource: format === "companies" ? "Companies Dataset" : "People Data Labs (CC BY 4.0)",
      registryUrl: linkedin || null,
    });

    if (batch.length >= BATCH_SIZE) {
      try {
        await prisma.supplier.createMany({ data: batch as never[], skipDuplicates: true });
        importedRef.count += batch.length;
        added += batch.length;
        await new Promise((r) => setTimeout(r, 150));
        if (importedRef.count % 5000 === 0) {
          console.log(`   ✅ ${importedRef.count.toLocaleString()} suppliers (${path.basename(csvPath)})`);
        }
      } catch (e) {
        if (importedRef.count % 25000 === 0) console.error(`   ⚠️ Batch error: ${(e as Error).message?.substring(0, 100)}`);
      }
      batch = [];
    }
  }

  if (batch.length > 0) {
    try {
      await prisma.supplier.createMany({ data: batch as never[], skipDuplicates: true });
      importedRef.count += batch.length;
      added += batch.length;
    } catch {}
  }
  return added;
}

async function main() {
  const companiesPath =
    process.env.COMPANIES_CSV_PATH || "/Users/harunkaya/Downloads/companies.csv";
  const pdlPath =
    process.env.PDL_CSV_PATH ||
    "/Users/harunkaya/Downloads/scripts:data-import:pdl-companies.csv";

  console.log("\n=== Import All Suppliers (42M+ source) ===\n");
  console.log(`   Mode: ${QUALITY_ONLY ? "Tam dolu kayıtlar only (locality + website/domain zorunlu)" : "Tüm satırlar"}`);
  console.log(`   Max: ${TARGET_COUNT.toLocaleString()} suppliers`);
  console.log(`   Files: ${companiesPath}, ${pdlPath}\n`);

  const importedRef = { count: 0 };

  // Resume: pre-load existing (companyName, country) to skip duplicates
  if (process.env.RESUME_IMPORT === "true") {
    console.log("   📥 Loading existing suppliers for deduplication...");
    let offset = 0;
    const PAGE = 100_000;
    while (true) {
      const batch = await prisma.supplier.findMany({
        select: { companyName: true, country: true },
        skip: offset,
        take: PAGE,
      });
      for (const r of batch) seen.add(dedupeKey(r.companyName, r.country));
      if (batch.length < PAGE) break;
      offset += PAGE;
      process.stdout.write(`\r   Loaded ${offset.toLocaleString()} existing`);
    }
    console.log(`\n   ✓ ${seen.size.toLocaleString()} existing suppliers in dedupe set\n`);
  }

  // 1. companies.csv (larger file first)
  if (fs.existsSync(companiesPath)) {
    console.log(`   📂 Processing companies.csv...`);
    const n = await processFile(companiesPath, "companies", importedRef);
    console.log(`   Added ${n.toLocaleString()} from companies.csv. Total: ${importedRef.count.toLocaleString()}\n`);
  } else {
    console.log(`   ⚠️ companies.csv not found at ${companiesPath}\n`);
  }

  // 2. pdl-companies.csv
  if (importedRef.count < TARGET_COUNT && fs.existsSync(pdlPath)) {
    console.log(`   📂 Processing pdl-companies.csv...`);
    const n = await processFile(pdlPath, "pdl", importedRef);
    console.log(`   Added ${n.toLocaleString()} from pdl-companies.csv. Total: ${importedRef.count.toLocaleString()}\n`);
  }

  const total = await prisma.supplier.count();
  console.log(`\n   ✅ Done. Total suppliers in DB: ${total.toLocaleString()}\n`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
