import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = "https://smartseek-landed-cost-production.up.railway.app";
const outDir = path.resolve("attached_assets/site-screenshots");
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function gotoAndShot(url, name, waitMs = 1500) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(waitMs);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

const shots = {};

shots.homepage = await gotoAndShot(baseUrl, "01-homepage-hero");

// Try likely supplier search routes.
const supplierSearchCandidates = ["/suppliers", "/supplier-discovery", "/search", "/public-search"];
let supplierSearchUrl = null;
for (const p of supplierSearchCandidates) {
  const url = `${baseUrl}${p}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    if (!page.url().includes("404")) {
      supplierSearchUrl = page.url();
      break;
    }
  } catch {
    // Ignore and continue trying candidates.
  }
}
if (!supplierSearchUrl) {
  supplierSearchUrl = `${baseUrl}/suppliers`;
}
shots.search = await gotoAndShot(supplierSearchUrl, "02-supplier-search");

// Open a supplier detail by clicking first likely supplier link.
let detailCaptured = false;
for (const selector of ["a[href*='/supplier/']", "a[href*='/suppliers/']", "a[href*='/company/']"]) {
  const link = page.locator(selector).first();
  if (await link.count()) {
    const href = await link.getAttribute("href");
    if (href) {
      const detailUrl = href.startsWith("http") ? href : `${baseUrl}${href}`;
      shots.detail = await gotoAndShot(detailUrl, "03-supplier-detail");
      detailCaptured = true;
      break;
    }
  }
}
if (!detailCaptured) {
  shots.detail = await gotoAndShot(`${baseUrl}/supplier`, "03-supplier-detail-fallback");
}

// Try likely landed-cost routes.
const landedCostCandidates = ["/landed-cost-calculator", "/landed-cost", "/calculator"];
let landedCostUrl = null;
for (const p of landedCostCandidates) {
  try {
    await page.goto(`${baseUrl}${p}`, { waitUntil: "domcontentloaded", timeout: 20000 });
    if (!page.url().includes("404")) {
      landedCostUrl = page.url();
      break;
    }
  } catch {
    // Ignore and continue trying candidates.
  }
}
shots.landedCost = await gotoAndShot(landedCostUrl ?? `${baseUrl}/landed-cost-calculator`, "04-landed-cost-calculator");

// Pricing page (if exists).
let pricingUrl = null;
try {
  await page.goto(`${baseUrl}/pricing`, { waitUntil: "domcontentloaded", timeout: 20000 });
  if (!page.url().includes("404")) {
    pricingUrl = page.url();
  }
} catch {
  // No-op.
}
if (pricingUrl) {
  shots.pricing = await gotoAndShot(pricingUrl, "05-pricing");
}

// Navigation menu screenshot: go to homepage and open common mobile menu controls.
await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
for (const selector of ["button[aria-label*='menu' i]", "button[aria-controls*='menu' i]", "button:has-text('Menu')"]) {
  const btn = page.locator(selector).first();
  if (await btn.count()) {
    await btn.click();
    break;
  }
}
await page.waitForTimeout(800);
shots.navigation = await gotoAndShot(page.url(), "06-navigation-menu", 300);

await browser.close();

console.log(JSON.stringify(shots, null, 2));
