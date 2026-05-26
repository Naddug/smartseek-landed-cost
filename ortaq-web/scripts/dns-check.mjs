#!/usr/bin/env node
/**
 * Verify GoDaddy → Vercel DNS before go-live.
 * Run: node scripts/dns-check.mjs
 */
import { lookup } from "node:dns/promises";

const checks = [
  { host: "ortaq.biz", expect: "76.76.21.21", phase: "production (after staging QA)" },
  { host: "staging.ortaq.biz", expect: "76.76.21.21", phase: "staging (do this first)" },
  { host: "www.ortaq.biz", expect: "cname.vercel-dns.com", phase: "production www redirect", cname: true },
];

let failed = 0;

for (const { host, expect, phase, cname } of checks) {
  try {
    if (cname) {
      const cnames = await lookup(host, { all: true });
      const hit = cnames.some((r) => r.address.includes("vercel") || r.address.includes(expect));
      if (hit) console.log(`✓ ${host} → ${cnames.map((r) => r.address).join(", ")} (${phase})`);
      else {
        console.log(`✗ ${host} → ${cnames.map((r) => r.address).join(", ")} (expected ${expect})`);
        failed++;
      }
    } else {
      const a = await lookup(host, { family: 4 });
      if (a.address === expect) console.log(`✓ ${host} → ${a.address} (${phase})`);
      else {
        console.log(`✗ ${host} → ${a.address} (expected ${expect}) — ${phase}`);
        failed++;
      }
    }
  } catch (err) {
    console.log(`✗ ${host} → not resolved (${err.code}) — ${phase}`);
    failed++;
  }
}

console.log(failed ? `\n${failed} DNS check(s) pending — configure GoDaddy (see docs/DNS_SETUP_NOW.md)` : "\nDNS looks ready for Vercel");
process.exit(failed ? 1 : 0);
