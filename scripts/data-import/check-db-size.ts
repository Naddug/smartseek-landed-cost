/**
 * Check PostgreSQL database size (useful for Railway Hobby 5GB limit).
 * Run: npx tsx scripts/data-import/check-db-size.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw<{ size: string }[]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size`;
  const size = result[0]?.size ?? "unknown";
  const supplierCount = await prisma.supplier.count();
  let leadCount = 0;
  try {
    const { db } = await import("../../server/db");
    const { leads } = await import("@shared/schema");
    const { sql } = await import("drizzle-orm");
    const [r] = await db.select({ count: sql<number>`count(*)` }).from(leads);
    leadCount = Number(r?.count ?? 0);
  } catch {
    /* leads table may not exist */
  }
  console.log(`\n📊 Database: ${size}`);
  console.log(`   Suppliers: ${supplierCount.toLocaleString()}`);
  console.log(`   Leads: ${leadCount.toLocaleString()}`);
  console.log(`   Railway Hobby limit: 5GB\n`);
  await prisma.$disconnect();
}

main().catch(console.error);
