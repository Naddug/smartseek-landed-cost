import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://localhost:3000";
const outDir = new URL("../screenshots/final-execution/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${outDir}/00-homepage-full.png`, fullPage: true });
console.log("saved 00-homepage-full");

await page.screenshot({
  path: `${outDir}/01-hero.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});
console.log("saved 01-hero");

async function scrollShot(name, selector) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const box = await el.boundingBox();
  if (box) {
    const y = Math.max(0, box.y - 64);
    const height = Math.min(920, box.height + 180);
    await page.screenshot({
      path: `${outDir}/${name}.png`,
      clip: { x: 0, y, width: 1440, height },
    });
  }
  console.log("saved", name);
}

await scrollShot("02-featured-spotlight", "text=Bu hafta öne çıkan fırsat");
await scrollShot("03-dossier-grid", "text=Yayındaki Fırsatlar");
await scrollShot("04-standards", "text=Her dosya yayınlanmaz");
await scrollShot("05-monetization", "text=Doğru fırsat, doğru kişiye");
await scrollShot("06-final-cta", "text=İki taraf hazırsa");

await browser.close();
console.log("Done:", outDir);
