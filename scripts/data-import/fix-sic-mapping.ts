/**
 * Fix SIC mapping for existing suppliers.
 * Re-maps sicCode → industry using corrected sic-mapping.ts,
 * and updates products to match the corrected industry.
 *
 * Run: npm run import:fix-sic
 */

import { PrismaClient } from "@prisma/client";
import { mapSicToIndustry } from "./sic-mapping";

const prisma = new PrismaClient();
const BATCH_SIZE = 500;

function industryToProducts(industry: string): string {
  return JSON.stringify(industry.split(" & "));
}

async function main() {
  console.log("=== Fix SIC Mapping for Existing Suppliers ===\n");

  let updated = 0;
  let skipped = 0;
  let cursor: string | undefined;

  while (true) {
    const suppliers = await prisma.supplier.findMany({
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: { sicCode: { not: null } },
      select: { id: true, sicCode: true, industry: true, products: true },
      orderBy: { id: "asc" },
    });

    if (suppliers.length === 0) break;

    const updates: { id: string; industry: string; products: string }[] = [];

    for (const s of suppliers) {
      const sicCode = s.sicCode || "";
      const newIndustry = mapSicToIndustry(sicCode);
      const newProducts = industryToProducts(newIndustry);

      if (s.industry !== newIndustry || s.products !== newProducts) {
        updates.push({ id: s.id, industry: newIndustry, products: newProducts });
      } else {
        skipped++;
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(
        updates.map((u) =>
          prisma.supplier.update({
            where: { id: u.id },
            data: { industry: u.industry, products: u.products },
          })
        )
      );
      updated += updates.length;
      console.log(`  Updated ${updates.length} suppliers (total: ${updated})...`);
    }

    if (suppliers.length < BATCH_SIZE) break;
    cursor = suppliers[suppliers.length - 1].id;
  }

  console.log(`\n✅ Fix complete: ${updated} suppliers updated, ${skipped} unchanged.`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
