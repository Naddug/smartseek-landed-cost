import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://localhost:3000";
const outDir = new URL("../screenshots/image-fix/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

async function assertImagesLoaded(path, label) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const broken = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs
      .filter((img) => {
        const rect = img.getBoundingClientRect();
        return rect.width > 40 && rect.height > 40 && img.complete && img.naturalWidth === 0;
      })
      .map((img) => img.src.slice(0, 120));
  });

  if (broken.length) {
    console.warn(`WARN ${label}: ${broken.length} broken image(s)`);
    broken.forEach((src) => console.warn(" ", src));
  } else {
    console.log(`OK ${label}: no broken cover images detected`);
  }
}

await assertImagesLoaded("/", "homepage");
await page.screenshot({ path: `${outDir}/01-homepage-hero.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });

const heroImg = page.locator('[class*="aspect-"]').first();
await heroImg.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/02-homepage-featured-cover.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });

await assertImagesLoaded("/firsatlar", "firsatlar");
await page.goto(`${base}/firsatlar`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/03-firsatlar-grid.png`, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 900 } });

await browser.close();
console.log("Done:", outDir);
