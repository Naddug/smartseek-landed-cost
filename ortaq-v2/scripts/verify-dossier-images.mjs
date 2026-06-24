/** Keep in sync with lib/dossier/dossier-visuals.ts SLUG_THEMES */
const DOSSIER_IMAGE_AUDIT = {
  "e-ticaret-operasyonu": "photo-1607082348824-0a96f2a4b9da",
  "kafe-lokasyonu": "photo-1560799262-3727e67f0c62",
  "tekstil-atolyesi": "photo-1742281693044-972b1a1760a4",
  "saglik-yazilimi": "photo-1579684385127-1ef15d508118",
  "lojistik-depo": "photo-1759888107096-916fbd3eaf25",
  "gida-uretim": "photo-1555396273-367ea4eb4db5",
  "mobil-uygulama": "photo-1522202176988-66273c2fd55f",
  "butik-otel": "photo-1654162280520-8867181837e8",
};

const FALLBACKS = [
  "photo-1524231757912-21f4fe3a7200",
  "photo-1607082348824-0a96f2a4b9da",
  "photo-1560799262-3727e67f0c62",
  "photo-1742281693044-972b1a1760a4",
  "photo-1579684385127-1ef15d508118",
  "photo-1759888107096-916fbd3eaf25",
];

let failed = 0;

async function check(label, id) {
  const url = `https://images.unsplash.com/${id}?w=1400&q=88&auto=format&fit=crop`;
  const response = await fetch(url, { method: "HEAD" });
  if (response.ok) {
    console.log("OK", label, id);
  } else {
    console.error("FAIL", label, response.status, id);
    failed += 1;
  }
}

for (const [slug, id] of Object.entries(DOSSIER_IMAGE_AUDIT)) {
  await check(slug, id);
}

for (const id of FALLBACKS) {
  await check(`fallback:${id}`, id);
}

if (failed > 0) {
  process.exitCode = 1;
  console.error(`\n${failed} image URL(s) failed.`);
} else {
  console.log(`\nAll dossier and fallback images verified.`);
}
