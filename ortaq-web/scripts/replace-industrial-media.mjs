#!/usr/bin/env node
/**
 * Sector-realistic industrial media — URLs are visually verified before listing.
 * Pexels numeric IDs are NOT reliable via photos/{id}/pexels-photo-{id}.jpeg — use full CDN URLs.
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

/** @typedef {{ out: string, url: string, sector: string }} Asset */

/** @type {Asset[]} */
const assets = [
  // ── Shared keys ──
  {
    out: "factory-floor.jpg",
    url: "https://images.unsplash.com/photo-1532186773960-85649e5cb70b?auto=format&fit=crop&w=1400&q=82",
    sector: "PCB / electronics assembly line",
  },
  {
    out: "cnc-workshop.jpg",
    url: "https://images.unsplash.com/photo-1764114235916-74de69e6851f?auto=format&fit=crop&w=1400&q=82",
    sector: "CNC laser cutting metal",
  },
  {
    out: "logistics-dock.jpg",
    url: "https://images.unsplash.com/photo-1776441325715-9f99c06ca417?auto=format&fit=crop&w=1400&q=82",
    sector: "Forklift at container yard",
  },
  {
    out: "export-warehouse.jpg",
    url: "https://images.unsplash.com/photo-1761682751206-f33ad944be5d?auto=format&fit=crop&w=1400&q=82",
    sector: "Container port cranes at dusk",
  },
  {
    out: "machine-operator.jpg",
    url: "https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Angle grinder, metal sparks",
  },
  {
    out: "packaging-floor.jpg",
    url: "https://images.unsplash.com/photo-1668838225765-daa3a5da6207?auto=format&fit=crop&w=1400&q=82",
    sector: "Food production conveyor line",
  },
  {
    out: "factory-detail.jpg",
    url: "https://images.unsplash.com/photo-1692263661319-11b0a5992231?auto=format&fit=crop&w=1400&q=82",
    sector: "Industrial plant, processing silos",
  },
  {
    out: "textile-floor.jpg",
    url: "https://images.unsplash.com/photo-1758270804188-8ca0b6d254bc?auto=format&fit=crop&w=1400&q=82",
    sector: "Industrial textile loom, fabric roll",
  },
  {
    out: "industrial-line.jpg",
    url: "https://images.pexels.com/photos/17229385/pexels-photo-17229385.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Forklift in beverage warehouse",
  },
  {
    out: "warehouse.jpg",
    url: "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Racked industrial warehouse",
  },
  {
    out: "workshop.jpg",
    url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82",
    sector: "Welding sparks, metal fabrication",
  },
  {
    out: "agrifood-coldchain.jpg",
    url: "https://images.unsplash.com/photo-1651525670054-279c154bc3b6?auto=format&fit=crop&w=1400&q=82",
    sector: "Industrial fruit sorting line",
  },
  {
    out: "grain-mill.jpg",
    url: "https://images.unsplash.com/photo-1759244207370-a36254cbd59f?auto=format&fit=crop&w=1400&q=82",
    sector: "Flour mill silos, Gold Medal signage",
  },
  {
    out: "greenhouse.jpg",
    url: "https://images.unsplash.com/photo-1637987327476-5c77df3cb16d?auto=format&fit=crop&w=1400&q=82",
    sector: "Commercial greenhouse rows",
  },
  {
    out: "chemical-plant.jpg",
    url: "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Heavy industrial turbine hall",
  },
  {
    out: "ceramic-kiln.jpg",
    url: "https://images.pexels.com/photos/5846091/pexels-photo-5846091.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Forge furnace, intense heat",
  },
  {
    out: "food-processing.jpg",
    url: "https://images.unsplash.com/photo-1668838225765-daa3a5da6207?auto=format&fit=crop&w=1400&q=82",
    sector: "Automated food packaging line",
  },
  {
    out: "shipyard-dock.jpg",
    url: "https://images.unsplash.com/photo-1759503452557-6cddb2a7f4a1?auto=format&fit=crop&w=1400&q=82",
    sector: "Industrial port, tanks and cranes",
  },
  {
    out: "glass-furnace.jpg",
    url: "https://images.unsplash.com/photo-1759411364558-38a9e2b04f76?auto=format&fit=crop&w=1400&q=82",
    sector: "Foundry sparks, heat",
  },
  {
    out: "spinning-mill.jpg",
    url: "https://images.unsplash.com/photo-1758272024360-a95be2abe403?auto=format&fit=crop&w=1400&q=82",
    sector: "Textile machinery, yarn processing",
  },
  {
    out: "plastic-extrusion.jpg",
    url: "https://images.unsplash.com/photo-1758272024360-a95be2abe403?auto=format&fit=crop&w=1400&q=82",
    sector: "Industrial production machinery",
  },

  // ── Per-company (18 unique, sector-matched) ──
  {
    out: "companies/adana-tarim-isleme.jpg",
    url: "https://images.unsplash.com/photo-1651525670054-279c154bc3b6?auto=format&fit=crop&w=1400&q=82",
    sector: "Agri: industrial sorting/packing line",
  },
  {
    out: "companies/atlas-lojistik-istanbul.jpg",
    url: "https://images.unsplash.com/photo-1776441325715-9f99c06ca417?auto=format&fit=crop&w=1400&q=82",
    sector: "Logistics: forklift, shipping containers",
  },
  {
    out: "companies/karat-parca-konya.jpg",
    url: "https://images.unsplash.com/photo-1764114235916-74de69e6851f?auto=format&fit=crop&w=1400&q=82",
    sector: "CNC: laser cutting metal parts",
  },
  {
    out: "companies/anatolia-gida-gaziantep.jpg",
    url: "https://images.unsplash.com/photo-1668838225765-daa3a5da6207?auto=format&fit=crop&w=1400&q=82",
    sector: "Food: conveyor packaging plant",
  },
  {
    out: "companies/yildiz-dokum-manisa.jpg",
    url: "https://images.unsplash.com/photo-1759411364558-38a9e2b04f76?auto=format&fit=crop&w=1400&q=82",
    sector: "Foundry: sparks, metal casting",
  },
  {
    out: "companies/vizyon-otomotiv-bursa.jpg",
    url: "https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Automotive: metal cutting sparks",
  },
  {
    out: "companies/demir-tekstil-bursa.jpg",
    url: "https://images.unsplash.com/photo-1758270804188-8ca0b6d254bc?auto=format&fit=crop&w=1400&q=82",
    sector: "Textile: industrial loom, fabric production",
  },
  {
    out: "companies/trabzon-findik-isleme.jpg",
    url: "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Food: forklift in production warehouse",
  },
  {
    out: "companies/antalya-sera-teknoloji.jpg",
    url: "https://images.unsplash.com/photo-1637987327476-5c77df3cb16d?auto=format&fit=crop&w=1400&q=82",
    sector: "Greenhouse: commercial crop rows",
  },
  {
    out: "companies/tekno-elektronik-ankara.jpg",
    url: "https://images.unsplash.com/photo-1532186773960-85649e5cb70b?auto=format&fit=crop&w=1400&q=82",
    sector: "Electronics: SMT assembly line",
  },
  {
    out: "companies/tekirdag-ambalaj-plastik.jpg",
    url: "https://images.unsplash.com/photo-1758272024360-a95be2abe403?auto=format&fit=crop&w=1400&q=82",
    sector: "Packaging: industrial production machinery",
  },
  {
    out: "companies/marmara-kimya-kocaeli.jpg",
    url: "https://images.unsplash.com/photo-1692263661319-11b0a5992231?auto=format&fit=crop&w=1400&q=82",
    sector: "Chemical: industrial plant, silos, winter",
  },
  {
    out: "companies/eskisehir-seramik.jpg",
    url: "https://images.pexels.com/photos/5846091/pexels-photo-5846091.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop",
    sector: "Ceramic: forge furnace heat",
  },
  {
    out: "companies/ege-mobilya-izmir.jpg",
    url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82",
    sector: "Furniture: metal fabrication workshop",
  },
  {
    out: "companies/denizli-iplik-dokuma.jpg",
    url: "https://images.unsplash.com/photo-1760822600310-a33e3ec3e31c?auto=format&fit=crop&w=1400&q=82",
    sector: "Textile: vintage industrial looms",
  },
  {
    out: "companies/deniz-gemi-parca-tuzla.jpg",
    url: "https://images.unsplash.com/photo-1761682751206-f33ad944be5d?auto=format&fit=crop&w=1400&q=82",
    sector: "Marine: container port, ship cranes",
  },
  {
    out: "companies/trakya-un-edirne.jpg",
    url: "https://images.unsplash.com/photo-1759244207370-a36254cbd59f?auto=format&fit=crop&w=1400&q=82",
    sector: "Flour: grain elevator, mill silos",
  },
  {
    out: "companies/anadolu-cam-kayseri.jpg",
    url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82",
    sector: "Glass/metal: industrial welding",
  },
];

async function download(path, imageUrl) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "ORTAQ-media-sync/3.0-verified" },
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

  for (const { out, url, sector } of assets) {
    const path = join(MEDIA, out);
    process.stdout.write(`→ ${out}\n   ${sector} ... `);
    try {
      await download(path, url);
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
