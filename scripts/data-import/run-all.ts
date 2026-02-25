/**
 * Master data import script.
 * 1. Ensures Prisma schema is applied (Supplier table exists)
 * 2. Backs up current data count
 * 3. Deletes non-user-submitted suppliers
 * 4. Runs Companies House, SEC EDGAR, OpenCorporates
 * 5. Logs final breakdown
 *
 * Run: npm run import:all
 */

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
const prisma = new PrismaClient();

async function ensurePrismaSchema() {
  try {
    await prisma.supplier.count();
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "P2021" || (err as Error)?.message?.includes("does not exist")) {
      console.log("Supplier table missing. Running prisma db push...");
      execSync("npx prisma db push", { stdio: "inherit", cwd: process.cwd() });
    } else {
      throw e;
    }
  }
}

async function main() {
  console.log("=== SmartSeek Real Data Import ===\n");

  await ensurePrismaSchema();

  const before = await prisma.supplier.count();
  const bySource = await prisma.supplier.groupBy({
    by: ["dataSource"],
    _count: { id: true },
  });
  console.log(`Current suppliers: ${before}`);
  console.log("By source:", bySource.map((s) => `${s.dataSource || "null"}: ${s._count.id}`).join(", "));

  console.log("\nDeleting suppliers where dataSource != 'user-submitted'...");
  const deleted = await prisma.supplier.deleteMany({
    where: {
      OR: [
        { dataSource: null },
        { dataSource: { not: "user-submitted" } },
      ],
    },
  });
  console.log(`Deleted ${deleted.count} suppliers (including any fake seed data).`);

  // Clear existing leads so we regenerate from real suppliers only
  try {
    const { db } = await import("../../server/db");
    const { leads } = await import("@shared/schema");
    await db.delete(leads);
    console.log("Cleared existing leads for fresh generation from real suppliers.");
  } catch (e) {
    console.warn("Could not clear leads table (may not exist yet):", (e as Error).message);
  }

  const scripts = [
    { name: "Companies House UK", cmd: "npm run import:companies-house" },
    { name: "SEC EDGAR US", cmd: "npm run import:sec-edgar" },
    { name: "Trade.gov ITA", cmd: "npm run import:trade-gov" },
    { name: "OpenCorporates", cmd: "npm run import:opencorporates" },
    { name: "Generate Leads", cmd: "npm run import:generate-leads" },
  ];

  for (const s of scripts) {
    console.log(`\n--- Running ${s.name} ---`);
    try {
      execSync(s.cmd, { stdio: "inherit", cwd: process.cwd() });
    } catch (e) {
      console.error(`${s.name} failed:`, (e as Error).message);
    }
  }

  const after = await prisma.supplier.count();
  const afterBySource = await prisma.supplier.groupBy({
    by: ["dataSource"],
    _count: { id: true },
  });
  const afterByCountry = await prisma.supplier.groupBy({
    by: ["country"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  console.log("\n=== Import Complete ===");
  console.log(`Total suppliers: ${after}`);
  console.log("By source:", afterBySource.map((s) => `${s.dataSource || "null"}: ${s._count.id}`).join(", "));
  console.log("Top countries:", afterByCountry.slice(0, 10).map((c) => `${c.country}: ${c._count.id}`).join(", "));

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
