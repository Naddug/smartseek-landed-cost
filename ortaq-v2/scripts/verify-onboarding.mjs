import { chromium } from "playwright";

const base = "http://localhost:3000";

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

async function assert(name, condition) {
  if (!condition) {
    console.error("FAIL", name);
    process.exitCode = 1;
  } else {
    console.log("OK", name);
  }
}

await page.goto(`${base}/giris`, { waitUntil: "networkidle" });
await page.fill("#email", "ortak@ortaq.biz");
await page.fill("#password", "demo");
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);

await page.goto(`${base}/onboarding/ortak`, { waitUntil: "networkidle" });

const capitalCard = page.getByRole("button").filter({ hasText: "Sermaye" }).first();
await capitalCard.click();
await assert("partner contribution card toggles selected", (await capitalCard.getAttribute("class"))?.includes("border-ortaq-action"));

await page.getByRole("button", { name: "Devam" }).click();
await page.waitForTimeout(800);

const ecommerceChip = page.getByRole("button", { name: "E-Ticaret" });
await ecommerceChip.click();
await assert("partner sector chip toggles selected", (await ecommerceChip.getAttribute("class"))?.includes("border-ortaq-action"));

await browser.close();
console.log("Onboarding verification complete.");
