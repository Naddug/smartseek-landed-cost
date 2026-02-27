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
// Railway and many cloud Postgres use self-signed certs; rejectUnauthorized: false allows connection
const isLocalhost = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");
const useInsecureSsl =
  !isLocalhost &&
  (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ||
    connectionString?.includes("railway") ||
    connectionString?.includes("rlwy.net") ||
    true); // default: allow self-signed for remote DBs
export const pool = new Pool({
  connectionString,
  max: 5,
  ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
});
export const db = drizzle(pool, { schema });
