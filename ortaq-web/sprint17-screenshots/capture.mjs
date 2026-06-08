import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] || __dirname;
const base = "http://localhost:3001";

const shots = [
  { name: "00-full", url: base, fullPage: true },
  { name: "01-hero", url: base, selector: "section:first-of-type" },
  { name: "02-why", url: base, selector: "section:nth-of-type(2)" },
  { name: "03-pilot", url: `${base}#ortaq-pilot`, selector: "#ortaq-pilot" },
  { name: "04-intelligence", url: `${base}#ortaq-anlama`, selector: "#ortaq-anlama" },
  { name: "05-reasoning", url: base, selector: "section:nth-of-type(5)" },
  { name: "06-portfolio", url: base, selector: "section:nth-of-type(6)" },
  { name: "07-memory", url: base, selector: "section:nth-of-type(7)" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const s of shots) {
  await page.goto(s.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  if (s.fullPage) {
    await page.screenshot({ path: path.join(outDir, `${s.name}.png`), fullPage: true });
  } else {
    const el = page.locator(s.selector).first();
    if (await el.count()) {
      await el.screenshot({ path: path.join(outDir, `${s.name}.png`) });
    }
  }
}

await browser.close();
console.log(`Saved to ${outDir}`);
