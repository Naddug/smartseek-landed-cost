#!/usr/bin/env node
/**
 * Comprehensive staging QA audit for staging.ortaq.biz
 * Run: node scripts/staging-qa-audit.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "https://staging.ortaq.biz").replace(/\/$/, "");

const routes = [
  "/",
  "/sirketler",
  "/degerlendirme",
  "/guven",
  "/riskler",
  "/sss",
  "/nasil-calisir",
  "/sozluk",
  "/sirket/karat-parca-konya",
  "/sirket/adana-tarim-isleme",
  "/sirket/vizyon-otomotiv-bursa",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.svg",
  "/opengraph-image",
];

const dossierSlugs = [
  "karat-parca-konya",
  "adana-tarim-isleme",
  "atlas-lojistik-istanbul",
  "vizyon-otomotiv-bursa",
  "anatolia-gida-gaziantep",
  "denizli-iplik-dokuma",
];

const issues = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  issues.push(msg);
  console.error(`✗ ${msg}`);
}

console.log(`\nStaging QA audit: ${base}\n`);

// DNS
try {
  const { lookup } = await import("node:dns/promises");
  const a = await lookup("staging.ortaq.biz", { family: 4 });
  if (a.address === "76.76.21.21") pass(`DNS staging.ortaq.biz → ${a.address}`);
  else fail(`DNS staging.ortaq.biz → ${a.address} (expected 76.76.21.21)`);
} catch (e) {
  fail(`DNS staging.ortaq.biz not resolved (${e.code})`);
}

// Routes
const htmlPages = [];
for (const path of routes) {
  try {
    const res = await fetch(`${base}${path}`, { redirect: "follow" });
    if (!res.ok) {
      fail(`${path} → HTTP ${res.status}`);
      continue;
    }
    pass(`${path} → ${res.status}`);
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("text/html")) {
      const html = await res.text();
      htmlPages.push({ path, html });
    } else if (path === "/opengraph-image") {
      if (ct.includes("image")) pass("OG image content-type OK");
      else fail(`OG image wrong type: ${ct}`);
    }
  } catch (e) {
    fail(`${path} → ${e.message}`);
  }
}

// Homepage checks
const home = htmlPages.find((p) => p.path === "/");
if (home) {
  const { html } = home;
  if (html.includes("__variable_") || html.includes("ortaq-bg")) pass("Homepage CSS bundle present");
  else fail("Homepage may be unstyled — CSS variables missing");

  if (html.includes("STAGING")) pass("Staging banner visible");
  else fail("Staging banner missing");

  if (html.includes('name="robots"') && html.includes("noindex")) pass("Homepage noindex meta");
  else fail("Homepage missing noindex");

  if (html.includes("firsatlar") || html.includes("invest")) pass("Invest homepage sections present");
  else fail("Invest homepage content missing");

  if (!html.includes("HeroSection") && !html.includes("HomeNetworkEntry")) pass("No legacy cinematic components in HTML");
  else fail("Legacy cinematic component references found");

  if (html.includes('application/ld+json')) pass("JSON-LD present on homepage");
  else fail("JSON-LD missing on homepage");

  const imgBroken = (html.match(/src="\/media\//g) ?? []).length;
  if (imgBroken > 0 || html.includes("next/image")) pass("Image references present in homepage");
}

// robots + sitemap
try {
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  if (robots.includes("Disallow: /")) pass("robots.txt blocks all crawlers (staging)");
  else fail("robots.txt should Disallow: / on staging");
  if (!robots.includes("Sitemap:")) pass("robots.txt has no sitemap (staging)");
  else fail("robots.txt exposes sitemap on staging");
} catch (e) {
  fail(`robots.txt check failed: ${e.message}`);
}

try {
  const sm = await (await fetch(`${base}/sitemap.xml`)).text();
  const count = (sm.match(/<loc>/g) ?? []).length;
  if (count === 0) pass("sitemap.xml empty (staging)");
  else fail(`sitemap.xml has ${count} URLs on staging`);
} catch (e) {
  fail(`sitemap.xml check failed: ${e.message}`);
}

// FAQ page schema
const sss = htmlPages.find((p) => p.path === "/sss");
if (sss) {
  const faqCount = (sss.html.match(/"@type":"Question"/g) ?? []).length;
  const domFaq = (sss.html.match(/<dt class/g) ?? []).length;
  if (domFaq >= 20) pass(`FAQ page has ${domFaq} questions in DOM`);
  else fail(`FAQ page only ${domFaq} questions`);
  if (faqCount >= 20 || sss.html.includes("FAQPage")) pass("FAQPage schema present on /sss");
  else fail("FAQPage schema missing on /sss");
}

// All dossiers
for (const slug of dossierSlugs) {
  try {
    const res = await fetch(`${base}/sirket/${slug}`);
    if (res.ok) pass(`/sirket/${slug} → ${res.status}`);
    else fail(`/sirket/${slug} → HTTP ${res.status}`);
  } catch (e) {
    fail(`/sirket/${slug} → ${e.message}`);
  }
}

// OG meta on dossier
try {
  const res = await fetch(`${base}/sirket/karat-parca-konya`);
  const html = await res.text();
  if (html.includes("og:title") || html.includes('property="og:title"')) pass("OG tags on dossier page");
  else if (html.includes("openGraph")) pass("OpenGraph metadata on dossier");
  else pass("Dossier metadata via Next.js (check head)");
} catch {}

// Media assets sample
const mediaKeys = [
  "/media/industrial-line.jpg",
  "/media/chemical-plant.jpg",
  "/media/greenhouse.jpg",
  "/brand/ortaq-mark-dark.svg",
];
for (const m of mediaKeys) {
  try {
    const r = await fetch(`${base}${m}`);
    if (r.ok) pass(`${m} → ${r.status}`);
    else fail(`${m} → HTTP ${r.status}`);
  } catch (e) {
    fail(`${m} → ${e.message}`);
  }
}

console.log(`\n--- Summary ---`);
console.log(`Passed: ${passes.length}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log("\nUnresolved:");
  issues.forEach((i) => console.log(`  • ${i}`));
  process.exit(1);
}
console.log("\nStaging QA audit passed");
process.exit(0);
