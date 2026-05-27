#!/usr/bin/env node
/**
 * Heavy-industrial editorial media — no laptops, offices, or startup stock.
 * Sources: Pexels + Unsplash (verified CDN URLs only).
 *
 * Run: node scripts/replace-industrial-media.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA = join(ROOT, "public", "media");
const W = 1400;

/** @typedef {{ out: string, source: 'pexels' | 'unsplash', id: string | number }} Asset */

/** @type {Asset[]} */
const assets = [
  // ── Shared keys — machinery, sparks, export systems ──
  { out: "factory-floor.jpg", source: "pexels", id: 1267338 }, // production floor, workers at lines
  { out: "cnc-workshop.jpg", source: "unsplash", id: "photo-1764114235916-74de69e6851f" }, // laser cutting metal
  { out: "logistics-dock.jpg", source: "pexels", id: 4246148 }, // forklift, material handling
  { out: "export-warehouse.jpg", source: "pexels", id: 28828481 }, // port containers, export
  { out: "machine-operator.jpg", source: "pexels", id: 1145434 }, // angle grinder, sparks
  { out: "packaging-floor.jpg", source: "pexels", id: 2760243 }, // stainless process tanks / line
  { out: "factory-detail.jpg", source: "pexels", id: 7598662 }, // operator at industrial machine
  { out: "textile-floor.jpg", source: "pexels", id: 5726891 }, // textile factory looms
  { out: "industrial-line.jpg", source: "pexels", id: 1265684 }, // factory interior, production
  { out: "warehouse.jpg", source: "pexels", id: 4484749 }, // racked warehouse, logistics
  { out: "workshop.jpg", source: "unsplash", id: "photo-1532186773960-85649e5cb70b" }, // heavy industrial machine
  { out: "agrifood-coldchain.jpg", source: "pexels", id: 2116090 }, // food/industrial facility
  { out: "grain-mill.jpg", source: "pexels", id: 247040 }, // grain / mill raw material
  { out: "greenhouse.jpg", source: "pexels", id: 2565413 }, // commercial greenhouse rows
  { out: "chemical-plant.jpg", source: "pexels", id: 3735455 }, // refinery pipes, process plant
  { out: "ceramic-kiln.jpg", source: "pexels", id: 5846091 }, // forge furnace, intense heat
  { out: "food-processing.jpg", source: "pexels", id: 2866847 }, // industrial food production
  { out: "shipyard-dock.jpg", source: "pexels", id: 1004545 }, // port, ships, marine industry
  { out: "glass-furnace.jpg", source: "unsplash", id: "photo-1759411364558-38a9e2b04f76" }, // foundry heat, sparks
  { out: "spinning-mill.jpg", source: "pexels", id: 2219024 }, // cotton / yarn production
  { out: "plastic-extrusion.jpg", source: "pexels", id: 3860308 }, // manufacturing production floor

  // ── Per-company — unique, operationally dense ──
  { out: "companies/adana-tarim-isleme.jpg", source: "pexels", id: 2866847 },
  { out: "companies/atlas-lojistik-istanbul.jpg", source: "pexels", id: 4246148 },
  { out: "companies/karat-parca-konya.jpg", source: "unsplash", id: "photo-1764114235916-74de69e6851f" },
  { out: "companies/anatolia-gida-gaziantep.jpg", source: "pexels", id: 2116090 },
  { out: "companies/yildiz-dokum-manisa.jpg", source: "unsplash", id: "photo-1759411364558-38a9e2b04f76" },
  { out: "companies/vizyon-otomotiv-bursa.jpg", source: "pexels", id: 1145434 },
  { out: "companies/demir-tekstil-bursa.jpg", source: "pexels", id: 5726891 },
  { out: "companies/trabzon-findik-isleme.jpg", source: "pexels", id: 4483622 },
  { out: "companies/antalya-sera-teknoloji.jpg", source: "pexels", id: 2565413 },
  { out: "companies/tekno-elektronik-ankara.jpg", source: "pexels", id: 7598662 },
  { out: "companies/tekirdag-ambalaj-plastik.jpg", source: "pexels", id: 3860308 },
  { out: "companies/marmara-kimya-kocaeli.jpg", source: "pexels", id: 3735455 },
  { out: "companies/eskisehir-seramik.jpg", source: "pexels", id: 3860388 },
  { out: "companies/ege-mobilya-izmir.jpg", source: "pexels", id: 3862132 },
  { out: "companies/denizli-iplik-dokuma.jpg", source: "pexels", id: 3376793 },
  { out: "companies/deniz-gemi-parca-tuzla.jpg", source: "pexels", id: 1004545 },
  { out: "companies/trakya-un-edirne.jpg", source: "pexels", id: 2219024 },
  { out: "companies/anadolu-cam-kayseri.jpg", source: "unsplash", id: "photo-1504917595217-d4dc5ebe6122" }, // welding/industrial heat
];

function imageUrl({ source, id }) {
  if (source === "unsplash") {
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${W}&q=82`;
  }
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${W}&fit=crop`;
}

async function download(path, imageUrl) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "ORTAQ-media-sync/2.0" },
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
  let ok = 0;
  let fail = 0;

  for (const asset of assets) {
    const path = join(MEDIA, asset.out);
    process.stdout.write(`→ ${asset.out} [${asset.source}] ... `);
    try {
      await download(path, imageUrl(asset));
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
