#!/usr/bin/env node
/**
 * Auto-translate missing or untranslated keys in TR locale (EN → TR) via OpenAI.
 * Run: node scripts/translate-tr.mjs
 */
import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "../client/public/locales");
const BATCH_SIZE = 20;

const SYSTEM_PROMPT =
  "You are a professional Turkish translator specializing in B2B sourcing and trade terminology. Translate naturally and professionally. Keep brand names, registry names (SAIC, Companies House etc), technical terms (MOQ, Incoterms, RFQ) and product names in English. Do not translate: SmartSeek, SAIC, SEC EDGAR, Companies House, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR, MOQ, Incoterms, RFQ. Preserve placeholders like {{count}}, {{query}}, {{suppliers}} exactly. Return ONLY valid JSON with the same keys as the input.";

function chunkEntries(entries, size) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  return chunks;
}

async function translateBatch(openai, batchObj) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(batchObj, null, 0) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");
  const out = {};
  for (const key of Object.keys(batchObj)) {
    if (typeof parsed[key] === "string" && parsed[key].trim()) {
      out[key] = parsed[key];
    }
  }
  return out;
}

function findKeysToTranslate(en, tr) {
  const keys = [];
  for (const key of Object.keys(en)) {
    if (!(key in tr) || tr[key] === en[key]) {
      keys.push(key);
    }
  }
  return keys;
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    console.error("Set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY in .env");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });
  const enPath = join(LOCALES_DIR, "en/translation.json");
  const trPath = join(LOCALES_DIR, "tr/translation.json");

  const en = JSON.parse(readFileSync(enPath, "utf8"));
  const tr = JSON.parse(readFileSync(trPath, "utf8"));

  const keysToTranslate = findKeysToTranslate(en, tr);
  if (keysToTranslate.length === 0) {
    console.log("No missing or untranslated TR keys.");
    return;
  }

  console.log(`Found ${keysToTranslate.length} keys to translate (missing or TR === EN)`);

  const beforeAfter = [];
  let translatedCount = 0;
  const batches = chunkEntries(keysToTranslate, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    const batchKeys = batches[i];
    const batchObj = Object.fromEntries(batchKeys.map((k) => [k, en[k]]));
    process.stdout.write(`Batch ${i + 1}/${batches.length} (${batchKeys.length} keys)... `);

    try {
      const translated = await translateBatch(openai, batchObj);
      for (const key of batchKeys) {
        if (translated[key]) {
          if (beforeAfter.length < 10) {
            beforeAfter.push({
              key,
              before: tr[key] ?? en[key],
              after: translated[key],
            });
          }
          tr[key] = translated[key];
          translatedCount++;
        } else {
          console.warn(`\n  Warning: no translation returned for ${key}`);
        }
      }
      console.log("done");
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.log("ERROR");
      console.error(`  Batch ${i + 1} failed:`, err.message);
    }
  }

  writeFileSync(trPath, JSON.stringify(tr, null, 2) + "\n", "utf8");

  console.log("\n=== Report ===");
  console.log(`Keys translated: ${translatedCount}`);
  console.log("\nSample before/after (up to 10):");
  for (const { key, before, after } of beforeAfter) {
    console.log(`\n[${key}]`);
    console.log(`  EN/before: ${before}`);
    console.log(`  TR/after:  ${after}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
