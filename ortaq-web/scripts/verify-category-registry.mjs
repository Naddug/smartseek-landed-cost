/**
 * Verifies category registry invariants.
 * Run: node scripts/verify-category-registry.mjs
 */

const REGISTRY = [
  { slug: "cat-litter", status: "live", order: 1 },
  { slug: "cosmetics", status: "roadmap", order: 2 },
  { slug: "supplements", status: "roadmap", order: 3 },
  { slug: "food-beverage", status: "roadmap", order: 4 },
  { slug: "personal-care", status: "hidden", order: 99 },
];

function getPublicCategories(entries) {
  return entries.filter((c) => c.status !== "hidden").sort((a, b) => a.order - b.order);
}

function getLiveCategories(entries) {
  return entries.filter((c) => c.status === "live").sort((a, b) => a.order - b.order);
}

function getPrimaryLiveCategory(entries) {
  return getLiveCategories(entries)[0];
}

function isCategoryPagePublic(entries, slug) {
  const entry = entries.find((c) => c.slug === slug);
  return entry?.status === "live";
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

const publicSlugs = getPublicCategories(REGISTRY).map((c) => c.slug);
assert(!publicSlugs.includes("personal-care"), "hidden category excluded from public list");
assert(publicSlugs.length === 4, "four public categories (live + roadmap)");

assert(isCategoryPagePublic(REGISTRY, "cat-litter"), "cat-litter is public page");
assert(!isCategoryPagePublic(REGISTRY, "cosmetics"), "roadmap is not public page");

const withoutCatLitterLive = REGISTRY.map((c) =>
  c.slug === "cat-litter" ? { ...c, status: "hidden" } : c,
);
assert(getPrimaryLiveCategory(withoutCatLitterLive) === undefined, "no primary when cat-litter not live");

const swapped = REGISTRY.map((c) => {
  if (c.slug === "cat-litter") return { ...c, status: "roadmap" };
  if (c.slug === "cosmetics") return { ...c, status: "live" };
  return c;
});
assert(getPrimaryLiveCategory(swapped)?.slug === "cosmetics", "cosmetics primary after swap");

assert(getPrimaryLiveCategory(REGISTRY)?.slug === "cat-litter", "cat-litter is current primary");

console.log("OK: category registry verification passed");
