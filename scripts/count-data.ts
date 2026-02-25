import { PrismaClient } from "@prisma/client";
import { db } from "../server/db";
import { leads } from "@shared/schema";
import { sql } from "drizzle-orm";

async function main() {
  const prisma = new PrismaClient();
  const suppliers = await prisma.supplier.count();
  const [leadCount] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  console.log("Suppliers:", suppliers.toLocaleString());
  console.log("Leads:", Number(leadCount?.count ?? 0).toLocaleString());
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
