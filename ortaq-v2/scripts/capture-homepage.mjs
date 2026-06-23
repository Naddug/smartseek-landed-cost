import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://localhost:3000";
const outDir = new URL("../screenshots/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

await page.screenshot({
  path: `${outDir}/homepage-desktop-full.png`,
  fullPage: true,
});

await page.screenshot({
  path: `${outDir}/homepage-desktop-hero.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});

const featured = page.locator("section").nth(1);
await featured.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await featured.screenshot({ path: `${outDir}/homepage-featured-dossier.png` });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({
  path: `${outDir}/homepage-mobile-full.png`,
  fullPage: true,
});

await browser.close();
console.log("Screenshots saved to", outDir);
