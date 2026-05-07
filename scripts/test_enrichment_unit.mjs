// Unit-style test of normalizeDomain + lookupEnrichmentSnapshot guards.
// We deliberately do NOT seed production data; we only verify the function's
// determinism around domain handling and graceful-failure semantics.

import { normalizeDomain, lookupEnrichmentSnapshot } from '../server/lib/supplierEnrichment.ts';

const cases = [
  ['https://Acme-Corp.COM', 'acme-corp.com'],
  ['www.Acme-Corp.com', 'acme-corp.com'],
  ['acme.com/contact', 'acme.com'],
  ['', null],
  ['not a url', null],
  [null, null],
  ['localhost', null],          // no dot → reject
  ['http://example.co.uk/', 'example.co.uk'],
];

let pass = 0, fail = 0;
for (const [input, want] of cases) {
  const got = normalizeDomain(input);
  const ok = got === want;
  console.log(`${ok ? 'OK ' : 'FAIL'} normalizeDomain(${JSON.stringify(input)}) -> ${JSON.stringify(got)}  (want ${JSON.stringify(want)})`);
  if (ok) pass++; else fail++;
}

// Lookup with null/empty website should return null without throwing.
const nullResult = await lookupEnrichmentSnapshot({ website: null });
console.log(nullResult === null ? 'OK ' : 'FAIL', 'lookupEnrichmentSnapshot(null) ->', nullResult);
if (nullResult === null) pass++; else fail++;

// Lookup against a non-existent / mismatched domain — must not throw, must return null.
const noMatch = await lookupEnrichmentSnapshot({ website: 'https://this-domain-does-not-exist-smartseek-test.com' });
console.log(noMatch === null ? 'OK ' : 'FAIL', 'lookupEnrichmentSnapshot(unknown) ->', noMatch);
if (noMatch === null) pass++; else fail++;

console.log(`\nResult: ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
