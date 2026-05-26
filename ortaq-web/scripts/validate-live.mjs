#!/usr/bin/env node
/**
 * Live URL smoke tests — run after DNS + Vercel deploy.
 *
 *   node scripts/validate-live.mjs staging
 *   node scripts/validate-live.mjs production
 *   node scripts/validate-live.mjs https://staging.ortaq.biz
 */
const PRESETS = {
  staging: "https://staging.ortaq.biz",
  production: "https://ortaq.biz",
};

const base = PRESETS[process.argv[2]] ?? process.argv[2];
if (!base?.startsWith("http")) {
  console.error("Usage: node scripts/validate-live.mjs <staging|production|URL>");
  process.exit(1);
}

const isStaging = base.includes("staging.");
const routes = [
  "/",
  "/sirketler",
  "/degerlendirme",
  "/guven",
  "/riskler",
  "/sss",
  "/nasil-calisir",
  "/sirket/karat-parca-konya",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.svg",
  "/opengraph-image",
];

let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  failed += 1;
}

async function check(path) {
  const url = `${base.replace(/\/$/, "")}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      fail(`${path} → HTTP ${res.status}`);
      return null;
    }
    ok(`${path} → ${res.status}`);
    return { path, res, text: await res.text() };
  } catch (err) {
    fail(`${path} → ${err.message}`);
    return null;
  }
}

console.log(`\nLive validation: ${base}\n`);

for (const path of routes) {
  const result = await check(path);
  if (!result) continue;

  if (path === "/" && result.text.includes('class="__variable_')) {
    ok("homepage CSS variables present");
  } else if (path === "/" && !result.text.includes("ortaq-bg")) {
    fail("homepage may be unstyled — CSS bundle missing");
  }

  if (path === "/robots.txt") {
    if (isStaging && result.text.includes("Disallow: /")) ok("robots blocks staging");
    else if (isStaging) fail("staging robots should Disallow: /");
    else if (result.text.includes("Sitemap: https://ortaq.biz/sitemap.xml")) ok("prod robots sitemap");
    else if (!isStaging) fail("prod robots missing sitemap");
  }

  if (path === "/sitemap.xml") {
    const count = (result.text.match(/<loc>/g) ?? []).length;
    if (isStaging && count === 0) ok("staging sitemap empty");
    else if (!isStaging && count >= 10) ok(`prod sitemap ${count} URLs`);
    else if (isStaging && count > 0) fail("staging sitemap should be empty");
    else if (!isStaging) fail(`prod sitemap only ${count} URLs`);
  }

  if (path === "/opengraph-image") {
    const ct = result.res.headers.get("content-type") ?? "";
    if (ct.includes("image")) ok("OG image returns image/*");
    else fail(`OG image content-type: ${ct}`);
  }
}

console.log(failed ? `\n${failed} live check(s) failed` : "\nLive validation passed");
process.exit(failed ? 1 : 0);
