#!/usr/bin/env node
/**
 * Post-build checks for staging deploy readiness.
 * Run: npm run validate:staging
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
  fail(".next missing — run npm run build:staging first");
  process.exit(1);
}

const robotsPath = join(nextDir, "server/app/robots.txt.body");
if (existsSync(robotsPath)) {
  const body = readFileSync(robotsPath, "utf8");
  if (body.includes("Disallow: /")) ok("robots.txt blocks crawl (staging)");
  else fail("robots.txt allows crawl — staging must noindex");
  if (!body.includes("Sitemap:")) ok("robots.txt has no sitemap (staging)");
  else fail("robots.txt exposes sitemap on staging");
} else {
  fail("robots.txt body not found");
}

const sitemapPath = join(nextDir, "server/app/sitemap.xml.body");
if (existsSync(sitemapPath)) {
  const body = readFileSync(sitemapPath, "utf8");
  const count = (body.match(/<loc>/g) ?? []).length;
  if (count === 0) ok("sitemap.xml empty (staging)");
  else fail(`sitemap.xml has ${count} URLs on staging`);
} else {
  ok("sitemap.xml absent or empty");
}

const indexPath = join(nextDir, "server/app/index.html");
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, "utf8");
  if (html.includes('name="robots"') && html.includes("noindex")) ok("homepage noindex meta");
  else fail("homepage missing noindex robots meta");
  if (html.includes("STAGING")) ok("staging banner in HTML");
  else fail("staging banner missing — check NEXT_PUBLIC_APP_ENV=staging");
} else {
  fail("index.html not found");
}

console.log(failed ? `\n${failed} staging check(s) failed` : "\nStaging validation passed");
process.exit(failed ? 1 : 0);
