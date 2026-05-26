#!/usr/bin/env node
/**
 * Post-build checks for production deploy readiness.
 * Run: npm run validate:prod
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const nextDir = join(root, ".next");
let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  failed += 1;
}

if (!existsSync(nextDir)) {
  fail(".next missing — run npm run build:prod first");
  process.exit(1);
}

const prerender = join(nextDir, "prerender-manifest.json");
if (existsSync(prerender)) {
  const routes = Object.keys(JSON.parse(readFileSync(prerender, "utf8")).routes ?? {});
  const expected = ["/", "/nasil-calisir", "/guven", "/riskler", "/sss", "/sozluk"];
  for (const path of expected) {
    if (routes.includes(path)) ok(`prerender ${path}`);
    else fail(`missing prerender ${path}`);
  }
}

const robotsPath = join(nextDir, "server/app/robots.txt.body");
if (existsSync(robotsPath)) {
  const body = readFileSync(robotsPath, "utf8");
  if (body.includes("Sitemap: https://ortaq.biz/sitemap.xml")) ok("robots.txt sitemap");
  else fail(`robots.txt missing prod sitemap: ${body.slice(0, 120)}`);
  if (body.includes("Disallow: /")) fail("robots.txt disallows all — check NEXT_PUBLIC_APP_ENV");
  else ok("robots.txt allows crawl");
} else {
  fail("robots.txt body not found");
}

const sitemapPath = join(nextDir, "server/app/sitemap.xml.body");
if (existsSync(sitemapPath)) {
  const body = readFileSync(sitemapPath, "utf8");
  const count = (body.match(/<loc>/g) ?? []).length;
  if (count >= 10) ok(`sitemap.xml ${count} URLs`);
  else fail(`sitemap.xml only ${count} URLs`);
  if (body.includes("https://ortaq.biz")) ok("sitemap canonical domain");
  else fail("sitemap missing ortaq.biz");
} else {
  fail("sitemap.xml body not found");
}

if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
  console.warn("⚠ NEXT_PUBLIC_APP_ENV not set in shell (build used inline env — OK if build:prod)");
} else {
  ok("NEXT_PUBLIC_APP_ENV=production");
}

console.log(failed ? `\n${failed} check(s) failed` : "\nProduction validation passed");
process.exit(failed ? 1 : 0);
