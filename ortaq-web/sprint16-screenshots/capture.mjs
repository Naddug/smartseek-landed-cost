import { chromium } from "playwright";

const sections = [
  { id: "hero", url: "http://localhost:3001", selector: "section:first-of-type" },
  { id: "why", url: "http://localhost:3001", selector: "section:nth-of-type(2)" },
  { id: "pilot", url: "http://localhost:3001#ortaq-pilot", selector: "#ortaq-pilot" },
  { id: "intelligence", url: "http://localhost:3001#ortaq-anlama", selector: "#ortaq-anlama" },
  { id: "portfolio", url: "http://localhost:3001", selector: "section:nth-of-type(6)" },
  { id: "memory", url: "http://localhost:3001", selector: "section:nth-of-type(7)" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const s of sections) {
  await page.goto(s.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const el = page.locator(s.selector).first();
  if (await el.count()) {
    await el.screenshot({ path: `sprint16-screenshots/02-${s.id}.png` });
  }
}

await browser.close();
