#!/usr/bin/env node
/**
 * Lighthouse audit for staging or production.
 * Requires Chrome/Chromium. Uses npx lighthouse (no install if npx caches).
 *
 *   npm run audit:staging
 *   npm run audit:production
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PRESETS = {
  staging: "https://staging.ortaq.biz",
  production: "https://ortaq.biz",
};

const target = PRESETS[process.argv[2]] ?? process.argv[2];
if (!target?.startsWith("http")) {
  console.error("Usage: node scripts/lighthouse-audit.mjs <staging|production|URL>");
  process.exit(1);
}

const outDir = join(import.meta.dirname, "..", ".lighthouse");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const slug = target.replace(/^https?:\/\//, "").replace(/\./g, "-");
const outFile = join(outDir, `${slug}-${Date.now()}.json`);

const pages = ["/", "/sirketler", "/guven"];
let failed = 0;

for (const path of pages) {
  const url = `${target.replace(/\/$/, "")}${path}`;
  const reportPath = outFile.replace(".json", `${path.replace(/\//g, "-") || "-home"}.json`);

  console.log(`\nLighthouse: ${url}`);
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse@12",
      url,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--output=json",
      `--output-path=${reportPath}`,
    ],
    { stdio: "inherit", shell: true },
  );

  if (result.status !== 0) {
    console.error(`✗ Lighthouse failed for ${url}`);
    failed += 1;
    continue;
  }

  try {
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    const scores = report.categories;
    const fmt = (c) => Math.round((scores[c]?.score ?? 0) * 100);
    console.log(
      `  performance=${fmt("performance")} accessibility=${fmt("accessibility")} best-practices=${fmt("best-practices")} seo=${fmt("seo")}`,
    );
    if (fmt("performance") < 80) console.warn(`  ⚠ performance below 80 on ${path}`);
    if (fmt("seo") < 90) console.warn(`  ⚠ seo below 90 on ${path}`);
  } catch {
    console.warn(`  Could not parse report at ${reportPath}`);
  }
}

console.log(failed ? `\n${failed} audit(s) failed` : "\nLighthouse audits complete");
process.exit(failed ? 1 : 0);
