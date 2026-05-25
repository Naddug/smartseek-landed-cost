#!/usr/bin/env node
/**
 * Patch es/ru/zh/ja — public-facing keys still identical to EN where TR differs.
 * Run: node scripts/phase-locale-public-parity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PATCHES } from "./locale-public-parity-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../client/public/locales");

const PUBLIC_PREFIXES = [
  "publicSearch",
  "supplier",
  "category",
  "suppliersIndex",
  "home.trust",
  "home.trustStrip",
  "publicFooter",
  "supplierDetail",
  "shortlists",
  "faq",
  "about",
  "rfq",
  "becomeSupplier",
  "verificationPage",
  "methodologyPage",
  "trustPage",
  "contact",
  "toolsPage",
  "nav",
  "notFound",
  "privacy",
  "terms",
  "rfqStatus",
  "supplierDiscovery",
];

function loadJson(loc) {
  return JSON.parse(fs.readFileSync(path.join(root, loc, "translation.json"), "utf8"));
}

function audit() {
  const en = loadJson("en");
  const tr = loadJson("tr");
  const es = loadJson("es");
  const allMissing = Object.keys(en).filter((k) => es[k] === en[k] && tr[k] !== en[k]);
  const publicMissing = allMissing.filter((k) => PUBLIC_PREFIXES.some((p) => k.startsWith(p)));
  console.log("\n--- Audit ---");
  console.log("Key counts:", ["en", "tr", "es", "ru", "zh", "ja"].map((l) => `${l}=${Object.keys(loadJson(l)).length}`).join(", "));
  console.log("Public EN-leak (es===en && tr!==en):", publicMissing.length);
  console.log("Total EN-leak (es===en && tr!==en):", allMissing.length);
  if (publicMissing.length > 0 && publicMissing.length <= 20) {
    console.log("Remaining public keys:", publicMissing.join(", "));
  } else if (publicMissing.length > 20) {
    console.log("Remaining public keys (first 20):", publicMissing.slice(0, 20).join(", "), "...");
  }
}

for (const [loc, keys] of Object.entries(PATCHES)) {
  const fp = path.join(root, loc, "translation.json");
  const data = loadJson(loc);
  let applied = 0;
  for (const [key, value] of Object.entries(keys)) {
    if (data[key] !== value) {
      data[key] = value;
      applied++;
    }
  }
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log(`${loc}: patched ${applied} keys (${Object.keys(keys).length} in map)`);
}

audit();
