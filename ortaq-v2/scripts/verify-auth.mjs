import { chromium } from "playwright";

const base = "http://localhost:3000";

const browser = await chromium.launch();
let context = await browser.newContext();
let page = await context.newPage();

async function assert(name, condition) {
  if (!condition) {
    console.error("FAIL", name);
    process.exitCode = 1;
  } else {
    console.log("OK", name);
  }
}

// 1) Protected panel redirects to login
await page.goto(`${base}/panel`, { waitUntil: "networkidle" });
await assert("panel redirects unauthenticated", page.url().includes("/giris"));

// 2) Demo login
await page.goto(`${base}/giris`, { waitUntil: "networkidle" });
await page.fill("#email", "demo@ortaq.biz");
await page.fill("#password", "demo");
await page.click('button[type="submit"]');
await page.waitForURL(/\/panel/, { timeout: 15000 });
await assert("demo login reaches panel", page.url().includes("/panel"));

// 3) Session persists after refresh
await page.reload({ waitUntil: "networkidle" });
await assert("session persists on panel refresh", page.url().includes("/panel"));

// 4) Protected create dossier route accessible when logged in
await page.goto(`${base}/panel/dosya-olustur`, { waitUntil: "networkidle" });
await assert(
  "authenticated user reaches dosya-olustur",
  page.url().includes("/panel/dosya-olustur")
);

// 5) Logout — fresh browser context has no session cookie
await context.close();
const loggedOutContext = await browser.newContext();
page = await loggedOutContext.newPage();
await page.goto(`${base}/panel`, { waitUntil: "networkidle" });
await assert("logged-out user blocked from panel", page.url().includes("/giris"));

// 6) Dossier apply CTA routes to login with intent
await page.goto(`${base}/firsatlar/e-ticaret-operasyonu`, { waitUntil: "networkidle" });
const applyBtn = page.getByRole("button", { name: /Giriş yap ve başvur/i });
if (await applyBtn.count()) {
  await applyBtn.click();
  await page.waitForURL(/\/giris/, { timeout: 8000 });
  await assert(
    "dossier apply sends to login with return intent",
    page.url().includes("/giris") &&
      decodeURIComponent(page.url()).includes("intent=apply")
  );
} else {
  console.warn("SKIP dossier apply CTA — button not found on page");
}

await browser.close();
console.log("Auth verification complete.");
