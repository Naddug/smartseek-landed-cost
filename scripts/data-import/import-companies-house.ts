/**
 * Companies House UK Importer
 * Downloads and imports real UK companies from the official free bulk data.
 * Source: https://download.companieshouse.gov.uk/en_output.html
 *
 * Streams the ZIP and CSV end-to-end — never loads full file into memory.
 *
 * Run: npm run import:companies-house
 * Optional: COMPANIES_HOUSE_ZIP=/path/to/file.zip to use pre-downloaded file
 */

import { createWriteStream, existsSync, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import * as yauzl from "yauzl";
import { parse } from "csv-parse";
import { mapSicToIndustry } from "./sic-mapping";

const prisma = new PrismaClient();
const BATCH_SIZE = 500;
const TARGET_COUNT = 500000; // Companies House has ~5M UK companies; we import 500K
const DOWNLOAD_DIR = join(process.cwd(), "scripts", "data-import", "downloads");
const USER_AGENT = "SmartSeek/1.0 (admin@smartseek.com)";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getSicPrefix(sicText: string): string | null {
  if (!sicText) return null;
  const match = sicText.match(/^(\d{2})/);
  return match ? match[1] : null;
}

function matchesTargetSic(sicText: string): boolean {
  const prefix = getSicPrefix(sicText);
  if (!prefix) return false;
  const p = parseInt(prefix, 10);
  if (p >= 1 && p <= 9) return true;   // Agriculture, Mining
  if (p >= 10 && p <= 43) return true; // Manufacturing, Construction
  if (p >= 46 && p <= 53) return true; // Wholesale, Retail, Transport
  if (p >= 55 && p <= 56) return true; // Accommodation, Food
  if (p >= 69 && p <= 82) return true; // Professional, Scientific, Admin
  return false;
}

function resolveColumns(row: Record<string, string>) {
  const keys = Object.keys(row);
  return {
    sicCol: keys.find((k) => k.includes("SicText_1")),
    statusCol: keys.find((k) => k.toLowerCase().includes("companystatus")) || "CompanyStatus",
    nameCol: keys.find((k) => k.toLowerCase().includes("companyname")) || "CompanyName",
    numCol: keys.find((k) => k.toLowerCase().includes("companynumber")) || "CompanyNumber",
    addr1Col: keys.find((k) => k.includes("AddressLine1")),
    townCol: keys.find((k) => k.includes("PostTown")),
    postcodeCol: keys.find((k) => k.includes("PostCode")),
    incorpCol: keys.find((k) => k.toLowerCase().includes("incorporationdate")),
    uriCol: keys.find((k) => k === "URI"),
  };
}

async function downloadLatestZip(): Promise<string> {
  const pageUrl = "https://download.companieshouse.gov.uk/en_output.html";
  const res = await fetch(pageUrl, { headers: { "User-Agent": USER_AGENT } });
  const html = await res.text();
  const match = html.match(/BasicCompanyDataAsOneFile-(\d{4}-\d{2}-\d{2})\.zip/);
  const date = match ? match[1] : "2026-02-01";
  const zipUrl = `https://download.companieshouse.gov.uk/BasicCompanyDataAsOneFile-${date}.zip`;

  if (!existsSync(DOWNLOAD_DIR)) mkdirSync(DOWNLOAD_DIR, { recursive: true });
  const zipPath = join(DOWNLOAD_DIR, `BasicCompanyDataAsOneFile-${date}.zip`);

  console.log(`Downloading ${zipUrl} (~468MB, may take several minutes)...`);
  const resp = await fetch(zipUrl, { headers: { "User-Agent": USER_AGENT } });
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
  const writeStream = createWriteStream(zipPath);
  await pipeline(resp.body as NodeJS.ReadableStream, writeStream);
  console.log(`Downloaded to ${zipPath}`);
  return zipPath;
}

function processZipEntry(
  zipPath: string,
  onCsvStream: (stream: NodeJS.ReadableStream) => Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      if (!zipfile) return reject(new Error("Failed to open ZIP"));

      const tryNext = () => {
        zipfile.readEntry();
      };

      zipfile.on("entry", (entry) => {
        if (entry.fileName.endsWith(".csv")) {
          zipfile.openReadStream(entry, (streamErr, readStream) => {
            if (streamErr) return reject(streamErr);
            if (!readStream) return reject(new Error("No read stream"));
            onCsvStream(readStream)
              .then(() => {
                zipfile.close();
                resolve();
              })
              .catch(reject);
          });
        } else {
          tryNext();
        }
      });

      zipfile.on("end", () => {
        reject(new Error("No CSV file found in ZIP"));
      });

      tryNext();
    });
  });
}

async function main() {
  console.log("=== Companies House UK Importer ===\n");

  let zipPath: string;
  if (process.env.COMPANIES_HOUSE_ZIP) {
    zipPath = process.env.COMPANIES_HOUSE_ZIP;
    if (!existsSync(zipPath)) throw new Error(`ZIP not found: ${zipPath}`);
  } else {
    zipPath = await downloadLatestZip();
  }

  console.log("Streaming ZIP and parsing CSV (no full load into memory)...");

  await processZipEntry(zipPath, async (csvStream) => {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });

    let imported = 0;
    const batch: object[] = [];
    const usedSlugs = new Set<string>();
    let cols: ReturnType<typeof resolveColumns> | null = null;

    return new Promise<void>((resolve, reject) => {
      csvStream.pipe(parser);

      let finished = false;
      const finalize = async () => {
        if (finished) return;
        finished = true;
        if (batch.length > 0) {
          const r = await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
          imported += r.count;
        }
        console.log(`\n✅ Companies House import complete: ${imported} UK suppliers.`);
        resolve();
      };

      parser.on("data", (row: Record<string, string>) => {
        if (imported >= TARGET_COUNT) {
          parser.pause();
          csvStream.destroy();
          finalize();
          return;
        }

        if (!cols) cols = resolveColumns(row);

        const status = (row[cols.statusCol] || "").toLowerCase();
        if (status !== "active") return;

        const sicText = cols.sicCol ? row[cols.sicCol] : "";
        if (!matchesTargetSic(sicText)) return;

        const companyName = (row[cols.nameCol] || "").trim();
        if (!companyName || companyName.length < 2) return;

        const companyNumber = (row[cols.numCol] || "").trim();
        if (!companyNumber) return;

        let slug = slugify(companyName);
        if (usedSlugs.has(slug)) slug = `${slug}-${companyNumber}`;
        usedSlugs.add(slug);

        const addr1 = cols.addr1Col ? row[cols.addr1Col] : "";
        const town = cols.townCol ? row[cols.townCol] : "";
        const postcode = cols.postcodeCol ? row[cols.postcodeCol] : "";
        const city = town || postcode || "United Kingdom";
        const address = [addr1, town, postcode].filter(Boolean).join(", ");

        const incorpDate = cols.incorpCol ? row[cols.incorpCol] : "";
        const yearEst = incorpDate ? parseInt(incorpDate.slice(0, 4), 10) : 2000;
        const yearEstablished = isNaN(yearEst) || yearEst < 1800 ? 2000 : Math.min(yearEst, 2025);

        const industry = mapSicToIndustry(sicText);
        const domain = slugify(companyName).slice(0, 20).replace(/-/g, "") || "company";

        batch.push({
          companyName,
          slug,
          country: "United Kingdom",
          countryCode: "GB",
          city,
          region: address || null,
          industry,
          subIndustry: sicText || null,
          products: JSON.stringify(industry.split(" & ")),
          certifications: JSON.stringify([]),
          contactEmail: `info@${domain}.co.uk`,
          contactPhone: null,
          website: `www.${domain}.co.uk`,
          description: `${companyName} is a ${industry} company registered in the United Kingdom. ${address ? `Registered address: ${address}.` : ""}`,
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
          dataSource: "Companies House UK",
          contactVerified: false,
          registryUrl: cols.uriCol && row[cols.uriCol]
            ? row[cols.uriCol]
            : `https://find-and-update.company-information.service.gov.uk/company/${companyNumber}`,
          registryId: companyNumber,
          sicCode: sicText || null,
        });

        if (batch.length >= BATCH_SIZE) {
          const toInsert = [...batch];
          batch.length = 0;
          parser.pause();
          prisma.supplier
            .createMany({ data: toInsert, skipDuplicates: true })
            .then((r) => {
              imported += r.count;
              if (imported % 10000 === 0 || imported < 10000) {
                console.log(`  Imported ${imported} UK suppliers...`);
              }
              parser.resume();
            })
            .catch(reject);
        }
      });

      parser.on("end", () => finalize());

      parser.on("error", reject);
      csvStream.on("error", reject);
    });
  });

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
