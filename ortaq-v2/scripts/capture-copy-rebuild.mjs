import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://localhost:3000";
const outDir = new URL("../screenshots/copy-rebuild/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// Full homepage — scroll top first
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({
  path: `${outDir}/00-homepage-full.png`,
  fullPage: true,
});
console.log("saved 00-homepage-full");

// Hero section only (above-the-fold element)
const hero = page.locator("section").first();
await hero.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await hero.screenshot({ path: `${outDir}/01-homepage-hero.png` });
console.log("saved 01-homepage-hero");

// Viewport at top — nav + hero fold
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
await page.screenshot({
  path: `${outDir}/01-homepage-hero-fold.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});
console.log("saved 01-homepage-hero-fold");

async function scrollShot(name, selector) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const box = await el.boundingBox();
  if (box) {
    const y = Math.max(0, box.y - 80);
    const height = Math.min(900, box.height + 200);
    await page.screenshot({
      path: `${outDir}/${name}.png`,
      clip: { x: 0, y, width: 1440, height },
    });
  } else {
    await page.screenshot({ path: `${outDir}/${name}.png` });
  }
  console.log("saved", name);
}

await scrollShot("02-two-audience", "text=Elimde bir iş var");
await scrollShot("03-monetization", "text=Doğru fırsat, doğru kişiye");
await scrollShot("04-final-cta", "text=İki taraf hazırsa");

await page.goto(`${base}/guven-kalite`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({
  path: `${outDir}/05-guven-kalite.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});
console.log("saved 05-guven-kalite");

await browser.close();
console.log("Done:", outDir);
