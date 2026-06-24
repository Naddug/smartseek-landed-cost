import { chromium } from "playwright";

const base = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

async function assert(name, condition) {
  if (!condition) {
    console.error("FAIL", name);
    process.exitCode = 1;
  } else {
    console.log("OK", name);
  }
}

await page.goto(`${base}/guven-kalite`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const ownerBtn = page.getByRole("button", {
  name: "Premium fırsat desteğini incele",
});
await ownerBtn.click();
await page.waitForTimeout(600);

await assert(
  "owner CTA opens premium detail panel",
  (await page.locator("#premium-detail").getByText("Neler dahil?").count()) > 0
);
await assert(
  "owner CTA updates URL with paket param",
  page.url().includes("paket=owner") && page.url().includes("#premium-detail")
);

await page.getByRole("button", { name: "Profilimi güçlendir" }).click();
await page.waitForTimeout(600);
await assert(
  "partner CTA switches detail content",
  (await page.locator("#premium-detail").getByText("Güçlendirilmiş ortak profili").count()) > 0
);

await page.getByRole("button", { name: "Hızlandırılmış seçenekleri gör" }).click();
await page.waitForTimeout(600);
await assert(
  "visibility CTA switches detail content",
  (await page.locator("#premium-detail").getByText("Hızlandırılmış değerlendirme").count()) > 0
);

await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Premium fırsat desteğini incele" }).first().click();
await page.waitForURL(/guven-kalite\?paket=owner/);
await page.waitForTimeout(800);
await assert(
  "homepage CTA deep-links to guven-kalite package detail",
  (await page.locator("#premium-detail").getByText("Neler dahil?").count()) > 0
);

await browser.close();
console.log("Premium CTA verification complete.");
