#!/usr/bin/env node
import "dotenv/config";
/**
 * Run trigram indexes script (for when psql is not available).
 * Uses DATABASE_URL from env. Each statement runs without transaction so CONCURRENTLY works.
 */
import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "add-supplier-trigram-indexes-production.sql");
const sql = readFileSync(sqlPath, "utf8");

const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--"));

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

for (const stmt of statements) {
  if (!stmt) continue;
  console.log("Running:", stmt.slice(0, 60) + "...");
  await client.query(stmt);
  console.log("  OK");
}

await client.end();
console.log("Done.");
