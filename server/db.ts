import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// DATABASE_URL must be set (e.g. via Railway env vars or .env) — never hardcode credentials.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required. Set it in .env or your deployment environment.");
}

// Limit connections to avoid exhausting Railway Postgres (prevents ECONNRESET)
export const pool = new Pool({ connectionString, max: 5 });
export const db = drizzle(pool, { schema });
