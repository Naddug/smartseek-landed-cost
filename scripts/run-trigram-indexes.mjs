#!/usr/bin/env node
import "dotenv/config";
/**
 * Run trigram indexes script (for when psql is not available).
 * Uses DATABASE_URL from env. Each statement runs in a fresh connection so long-running
 * index creation doesn't hit connection timeouts.
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

const runOne = async (stmt) => {
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 0, // no timeout for index creation
  });
  await client.connect();
  try {
    await client.query(stmt);
  } finally {
    await client.end();
  }
};

for (const stmt of statements) {
  if (!stmt) continue;
  console.log("Running:", stmt.slice(0, 70) + "...");
  try {
    await runOne(stmt);
    console.log("  OK");
  } catch (err) {
    if (err.code === "42P07") console.log("  (already exists)");
    else throw err;
  }
}

console.log("Done.");
