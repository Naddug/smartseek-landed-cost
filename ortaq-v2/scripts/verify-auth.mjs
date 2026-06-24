import { chromium } from "playwright";

const base = "http://localhost:3000";
const testEmail = `auth-verify-${Date.now()}@ortaq.biz`;
const testPassword = "verify-pass-123";

const browser = await chromium.launch();
let context = await browser.newContext();
let page = await context.newPage();

function isAuthenticatedAppPath(urlString) {
  const pathname = new URL(urlString).pathname;
  return (
    pathname.startsWith("/panel") ||
    pathname.startsWith("/onboarding")
  );
}

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

// 2) Email/password signup + auto login
await page.goto(`${base}/kayit?role=partner&next=/panel`, { waitUntil: "networkidle" });
await page.getByLabel("E-posta").waitFor({ state: "visible", timeout: 20000 });
await page.getByLabel("Ad Soyad").fill("Auth Verify");
await page.getByLabel("E-posta").fill(testEmail);
await page.getByLabel("Şifre").fill(testPassword);
await page.getByRole("button", { name: "Hesap Oluştur" }).click();
await page.waitForFunction(() => {
  const path = window.location.pathname;
  return path.startsWith("/panel") || path.startsWith("/onboarding");
}, { timeout: 20000 });
await assert(
  "signup lands in partner onboarding or panel",
  isAuthenticatedAppPath(page.url())
);

// 3) Session persists after refresh (partner may stay in onboarding until complete)
await page.reload({ waitUntil: "domcontentloaded" });
await assert(
  "session persists after refresh",
  isAuthenticatedAppPath(page.url())
);

// 4) Authenticated user can reach a protected route
await page.goto(`${base}/panel/kesfet`, { waitUntil: "networkidle" });
await assert(
  "authenticated user reaches protected panel route",
  new URL(page.url()).pathname.startsWith("/panel/kesfet") ||
    new URL(page.url()).pathname.startsWith("/onboarding")
);

// 5) Logout — fresh browser context has no session cookie
await context.close();
const loggedOutContext = await browser.newContext();
page = await loggedOutContext.newPage();
await page.goto(`${base}/panel`, { waitUntil: "networkidle" });
await assert("logged-out user blocked from panel", page.url().includes("/giris"));

// 6) Returning user can log in with credentials
await page.goto(`${base}/giris`, { waitUntil: "networkidle" });
await page.getByLabel("E-posta").waitFor({ state: "visible", timeout: 15000 });
await page.getByLabel("E-posta").fill(testEmail);
await page.getByLabel("Şifre").fill(testPassword);
await page.getByRole("main").getByRole("button", { name: "Giriş Yap" }).click();
await page.waitForFunction(() => {
  const path = window.location.pathname;
  return path.startsWith("/panel") || path.startsWith("/onboarding");
}, { timeout: 20000 });
await assert("returning login succeeds", isAuthenticatedAppPath(page.url()));

// 7) Dossier apply CTA routes to login with intent (logged out)
await context.close();
page = await (await browser.newContext()).newPage();
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
