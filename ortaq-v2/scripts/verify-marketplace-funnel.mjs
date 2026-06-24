import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const base = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const profileStore = path.join(process.cwd(), "data/store/user-profiles.json");

function seedIncompletePartnerProfile() {
  const incomplete = [
    {
      userId: "ortak@ortaq.biz",
      role: "partner",
      completionLevel: "incomplete",
      onboardingStep: "1",
      onboardingCompleted: false,
      partner: {
        contributionTypes: ["capital"],
        preferredCategories: [],
        preferredCities: [],
        engagementMode: "",
        capitalRange: "",
        experienceAreas: [],
        bio: "",
      },
      ownerProgress: {
        lastStep: 1,
        category: "",
        stage: "",
        locationCity: "",
        selectedAssets: [],
        selectedBlockers: [],
        partnerPriorities: [],
      },
      updatedAt: new Date().toISOString(),
    },
  ];
  fs.mkdirSync(path.dirname(profileStore), { recursive: true });
  fs.writeFileSync(profileStore, JSON.stringify(incomplete, null, 2));
}

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

async function login(email, password) {
  await page.goto(`${base}/giris`, { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
}

async function completePartnerOnboarding(returnPath) {
  const query = returnPath
    ? `?next=${encodeURIComponent(returnPath)}`
    : "";
  await page.goto(`${base}/onboarding/ortak${query}`, { waitUntil: "networkidle" });

  const devam = () => page.getByRole("button", { name: "Devam" });

  if (!(await devam().isEnabled())) {
    await page.getByRole("button").filter({ hasText: "Operasyon" }).first().click();
  }
  if (await devam().isEnabled()) {
    await devam().click();
    await page.waitForTimeout(600);
  }

  if (!(await devam().isEnabled())) {
    await page.getByRole("button", { name: "E-Ticaret" }).click();
  }
  if (await devam().isEnabled()) {
    await devam().click();
    await page.waitForTimeout(600);
  }

  if (!(await devam().isEnabled())) {
    await page.getByRole("button", { name: "İstanbul" }).click();
    await page.getByRole("button", { name: "Aktif operatör" }).click();
  }
  if (await devam().isEnabled()) {
    await devam().click();
    await page.waitForTimeout(600);
  }

  await page.getByRole("button", { name: "Profili Tamamla" }).click();
  await page.waitForTimeout(1200);
}

// 1) Logged-out create dossier CTA
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const createHref = await page
  .getByRole("link", { name: /Fırsat Dosyası Oluştur/i })
  .first()
  .getAttribute("href");
await assert(
  "logged-out create dossier links to path choice with next",
  createHref?.includes("/kayit/yol-secimi") &&
    createHref.includes("next=%2Fpanel%2Fdosya-olustur")
);

// 2) Logged-out apply CTA
await page.goto(`${base}/firsatlar/e-ticaret-operasyonu`, {
  waitUntil: "networkidle",
});
await page.getByRole("button", { name: /Giriş yap ve başvur/i }).click();
await page.waitForTimeout(800);
await assert(
  "logged-out apply routes to login with dossier return",
  page.url().includes("/giris") &&
    decodeURIComponent(page.url()).includes("/firsatlar/e-ticaret-operasyonu?intent=apply")
);

// 3) Incomplete partner sees profile gate
seedIncompletePartnerProfile();
await login("ortak@ortaq.biz", "demo");
await page.goto(`${base}/firsatlar/lojistik-depo?intent=apply`, {
  waitUntil: "networkidle",
});
const gateVisible =
  (await page.getByText("Profilinizi tamamlayın").count()) > 0;
await assert("incomplete partner sees profile completion gate", gateVisible);
const onboardingLink = await page
  .getByRole("link", { name: "Profili tamamla" })
  .getAttribute("href");
await assert(
  "profile gate preserves dossier return path",
  onboardingLink?.includes("/onboarding/ortak") &&
    onboardingLink.includes("intent%3Dapply")
);

// 4) Complete partner profile and submit interest
await completePartnerOnboarding("/firsatlar/saglik-yazilimi?intent=apply");
await page.goto(`${base}/firsatlar/saglik-yazilimi`, { waitUntil: "networkidle" });
await Promise.all([
  page.waitForURL(/\/panel\/eslesmelerim\?applied=saglik-yazilimi/, {
    timeout: 10000,
  }),
  page.getByRole("button", { name: /Başvuru Yap/i }).click(),
]);
await assert(
  "complete partner apply lands on eslesmelerim",
  page.url().includes("/panel/eslesmelerim?applied=saglik-yazilimi")
);
await assert(
  "success banner visible",
  (await page.getByText("İlginiz kaydedildi").count()) > 0
);

// 5) Partner cannot create dossier — sees role gate
await page.goto(`${base}/panel/dosya-olustur`, { waitUntil: "networkidle" });
await assert(
  "partner sees owner-only create dossier message",
  (await page.getByText(/fırsat sahipleri/i).count()) > 0
);

// 6) Owner create dossier entry
await login("demo@ortaq.biz", "demo");
await page.goto(`${base}/panel/dosya-olustur`, { waitUntil: "networkidle" });
await assert(
  "owner with sufficient profile reaches create page",
  page.url().includes("/panel/dosya-olustur") &&
    (await page.getByRole("link", { name: "Sihirbazı Başlat" }).count()) > 0
);

await browser.close();
console.log("Marketplace funnel verification complete.");
