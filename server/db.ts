import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Allow server to start without PostgreSQL (e.g. when using Prisma/SQLite).
// Pool connects lazily; Drizzle routes will fail at query time if DB is unavailable.
const connectionString =
  process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const isDummy =
  connectionString.includes("localhost:5432/dummy") ||
  connectionString.startsWith("file:");

if (isDummy) {
  console.warn(
    "Drizzle using dummy/local DB — Drizzle routes may fail. Using Prisma/SQLite for Supplier/Lead/RFQ."
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
