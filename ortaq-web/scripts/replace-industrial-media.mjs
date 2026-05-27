#!/usr/bin/env node
/**
 * Downloads curated industrial editorial photos (Pexels) and optimizes for web.
 * Run: node scripts/replace-industrial-media.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA = join(ROOT, "public", "media");
const COMPANIES = join(MEDIA, "companies");

const W = 1400;

/** @param {number} id Pexels photo id */
function pexels(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${W}&fit=crop`;
}

const assets = [
  // ── Shared keys (stable filenames) ──
  { out: "factory-floor.jpg", id: 1267328 },
  { out: "cnc-workshop.jpg", id: 3846390 },
  { out: "logistics-dock.jpg", id: 4484749 },
  { out: "export-warehouse.jpg", id: 4483610 },
  { out: "machine-operator.jpg", id: 1302577 },
  { out: "packaging-floor.jpg", id: 2760243 },
  { out: "factory-detail.jpg", id: 3807277 },
  { out: "textile-floor.jpg", id: 3376793 },
  { out: "industrial-line.jpg", id: 3860308 },
  { out: "warehouse.jpg", id: 265094 },
  { out: "workshop.jpg", id: 3861973 },
  { out: "agrifood-coldchain.jpg", id: 143133 },
  { out: "grain-mill.jpg", id: 247040 },
  { out: "greenhouse.jpg", id: 2565413 },
  { out: "chemical-plant.jpg", id: 3735455 },
  { out: "ceramic-kiln.jpg", id: 3860388 },
  { out: "food-processing.jpg", id: 325229 },
  { out: "shipyard-dock.jpg", id: 1004545 },
  { out: "glass-furnace.jpg", id: 209251 },
  { out: "spinning-mill.jpg", id: 2219024 },
  { out: "plastic-extrusion.jpg", id: 265089 },

  // ── Per-company unique imagery (18 campaigns) ──
  { out: "companies/adana-tarim-isleme.jpg", id: 1435904 },
  { out: "companies/atlas-lojistik-istanbul.jpg", id: 265216 },
  { out: "companies/karat-parca-konya.jpg", id: 265098 },
  { out: "companies/anatolia-gida-gaziantep.jpg", id: 265099 },
  { out: "companies/yildiz-dokum-manisa.jpg", id: 265100 },
  { out: "companies/vizyon-otomotiv-bursa.jpg", id: 265101 },
  { out: "companies/demir-tekstil-bursa.jpg", id: 265102 },
  { out: "companies/trabzon-findik-isleme.jpg", id: 265103 },
  { out: "companies/antalya-sera-teknoloji.jpg", id: 265104 },
  { out: "companies/tekno-elektronik-ankara.jpg", id: 265105 },
  { out: "companies/tekirdag-ambalaj-plastik.jpg", id: 265087 },
  { out: "companies/marmara-kimya-kocaeli.jpg", id: 265090 },
  { out: "companies/eskisehir-seramik.jpg", id: 265091 },
  { out: "companies/ege-mobilya-izmir.jpg", id: 3862132 },
  { out: "companies/denizli-iplik-dokuma.jpg", id: 265092 },
  { out: "companies/deniz-gemi-parca-tuzla.jpg", id: 265093 },
  { out: "companies/trakya-un-edirne.jpg", id: 265088 },
  { out: "companies/anadolu-cam-kayseri.jpg", id: 1108101 },
];

async function download(path, imageUrl) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "ORTAQ-media-sync/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buf);
}

function optimize(path) {
  try {
    execSync(`sips -Z ${W} "${path}" 2>/dev/null`, { stdio: "pipe" });
  } catch {
    /* optional */
  }
}

async function main() {
  await mkdir(COMPANIES, { recursive: true });
  let ok = 0;
  let fail = 0;

  for (const { out, id } of assets) {
    const path = join(MEDIA, out);
    process.stdout.write(`→ ${out} ... `);
    try {
      await download(path, pexels(id));
      optimize(path);
      const { stat } = await import("node:fs/promises");
      const kb = Math.round((await stat(path)).size / 1024);
      console.log(`ok (${kb} KB)`);
      ok++;
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main();
