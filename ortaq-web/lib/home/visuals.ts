/** Homepage photography — granules, packaging, warehouse only. No stock filler. */

const product = "/media/product/cat-litter";

export const homeVisuals = {
  hero: {
    packaging: `${product}/hero-packaging.jpg`,
    shelf: `${product}/granules-macro.jpg`,
    export: `${product}/hero-pallet.jpg`,
  },
  outcomes: {
    packaging: `${product}/hero-packaging.jpg`,
    sample: `${product}/granules-macro.jpg`,
    delivery: `${product}/outcome-delivery.jpg`,
  },
  journey: {
    brief: `${product}/hero-packaging.jpg`,
    source: `${product}/granule-texture.jpg`,
    sample: `${product}/sample-spill.jpg`,
    production: "/media/packaging-floor.jpg",
    export: "/media/warehouse.jpg",
    delivery: `${product}/outcome-delivery.jpg`,
  },
  liveProgram: {
    hero: `${product}/granules-macro.jpg`,
    granules: `${product}/granule-texture.jpg`,
    lineup: "/media/packaging-floor.jpg",
    shelf: `${product}/hero-pallet.jpg`,
  },
  proof: {
    operations: "/media/factory-floor.jpg",
    quality: "/media/factory-detail.jpg",
    production: "/media/packaging-floor.jpg",
    export: "/media/warehouse.jpg",
    founder: "/media/field/harun-warehouse.jpg",
  },
  close: `${product}/granules-macro.jpg`,
} as const;
