import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const outDir = new URL("../screenshots/localized-photography/", import.meta.url).pathname;

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
    console.error(`FAIL ${label}: ${broken.length} broken image(s)`);
    broken.forEach((src) => console.error(" ", src));
    process.exitCode = 1;
  } else {
    console.log(`OK ${label}: all cover images loaded`);
  }
}

await assertImagesLoaded("/", "homepage");
await page.screenshot({
  path: `${outDir}/01-homepage-hero.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});

await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(600);
await page.screenshot({
  path: `${outDir}/02-homepage-dossier-grid.png`,
  clip: { x: 0, y: 400, width: 1440, height: 900 },
});

await assertImagesLoaded("/firsatlar", "firsatlar");
await page.goto(`${base}/firsatlar`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({
  path: `${outDir}/03-firsatlar-listing.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});

await browser.close();
console.log("Screenshots:", outDir);
