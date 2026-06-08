#!/usr/bin/env node
/**
 * Generates PNG + ICO from public/favicon-production.svg
 * Run: node scripts/generate-favicon-assets.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const iconsDir = join(publicDir, "icons");

mkdirSync(iconsDir, { recursive: true });

const sourceSvg = join(publicDir, "favicon-production.svg");
if (!existsSync(sourceSvg)) {
  console.error("Missing public/favicon-production.svg");
  process.exit(1);
}

const svg = readFileSync(sourceSvg);

async function main() {
  let sharp;
  let pngToIco;
  try {
    sharp = (await import("sharp")).default;
    pngToIco = (await import("png-to-ico")).default;
  } catch {
    console.error("Run: npm install --save-dev sharp png-to-ico");
    process.exit(1);
  }

  const sizes = [
    { name: "icon-16.png", size: 16 },
    { name: "icon-32.png", size: 32 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  const icoInputs = [];

  for (const { name, size } of sizes) {
    const buf = await sharp(svg).resize(size, size).png().toBuffer();
    writeFileSync(join(iconsDir, name), buf);
    if (name === "apple-touch-icon.png") {
      writeFileSync(join(publicDir, "apple-touch-icon.png"), buf);
    }
    if (size === 16 || size === 32) icoInputs.push(buf);
  }

  const ico = await pngToIco(icoInputs);
  writeFileSync(join(publicDir, "favicon.ico"), ico);
  console.log("OK: favicon.ico, apple-touch-icon.png, public/icons/*");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
