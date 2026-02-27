/**
 * Mineral product configuration for LME/Argus/SMM-style pricing.
 * Purity grades affect price via premium/discount vs. base reference.
 * Base prices (USD/tonne) reference LME/Argus/SMM spot; integrate their APIs for real-time data.
 * Copper: LME Grade A cathode ~$13,000/tonne (99.65%+). SMM used for Asia origins.
 */
export interface MineralPurityGrade {
  id: string;
  label: string;
  description: string;
  /** Multiplier vs LME/Argus base (1.0 = spot, >1 = premium, <1 = discount) */
  priceMultiplier: number;
  /** Typical use case */
  typicalUse?: string;
}

export type PriceSource = "LME" | "Argus" | "SMM" | "Combined";

export interface MineralForm {
  id: string;
  label: string;
  description?: string;
  /** Multiplier vs refined metal price (ore < concentrate < ingot) */
  priceMultiplier: number;
}

/** Common mineral forms - ore, concentrate, ingot/refined */
export const MINERAL_FORMS: MineralForm[] = [
  { id: "ore", label: "Ore", description: "Raw ore (low metal content)", priceMultiplier: 0.18 },
  { id: "concentrate", label: "Concentrate", description: "Concentrated ore (20-40% metal)", priceMultiplier: 0.5 },
  { id: "ingot", label: "Ingot / Refined", description: "Refined metal (LME deliverable)", priceMultiplier: 1.0 },
];

export interface MineralProduct {
  id: string;
  name: string;
  hsCode: string;
  /** Base price USD/tonne (LME/Argus spot equivalent, for refined form) */
  basePricePerTonne: number;
  /** SMM base price for Asia-sourced products (Shanghai Metal Market) */
  basePriceSMM?: number;
  priceSource: PriceSource;
  purities: MineralPurityGrade[];
  /** Keywords to match user query */
  keywords: string[];
}

/** Asian origin countries where SMM pricing applies */
const ASIA_ORIGINS = new Set([
  "china", "japan", "south korea", "thailand", "vietnam", "indonesia", "malaysia", "singapore",
  "india", "taiwan", "philippines", "hong kong", "myanmar", "cambodia", "laos", "bangladesh",
  "pakistan", "sri lanka", "mongolia", "kazakhstan", "uzbekistan", "azerbaijan",
]);

export const MINERAL_PRODUCTS: MineralProduct[] = [
  {
    id: "copper",
    name: "Copper",
    hsCode: "7403.11",
    basePricePerTonne: 13000,
    basePriceSMM: 12800,
    priceSource: "LME",
    keywords: ["copper", "refined copper", "copper cathode", "copper wire", "electrolytic copper"],
    purities: [
      { id: "99.99", label: "99.99% cathode", description: "Grade A electrolytic cathode (LME deliverable)", priceMultiplier: 1.05, typicalUse: "Electrical, high-purity applications" },
      { id: "99.9", label: "99.9%", description: "Standard refined copper", priceMultiplier: 1.0, typicalUse: "General industrial" },
      { id: "99.65", label: "99.65%", description: "LME Grade A cathode (common trading grade)", priceMultiplier: 1.0, typicalUse: "General industrial, LME deliverable" },
      { id: "99.5", label: "99.5%", description: "Fire-refined copper", priceMultiplier: 0.97, typicalUse: "Alloys, lower-spec applications" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
  {
    id: "antimony",
    name: "Antimony",
    hsCode: "8110.20",
    basePricePerTonne: 12500,
    basePriceSMM: 12200,
    priceSource: "Argus",
    keywords: ["antimony", "antimony trioxide", "antimony metal", "sb2o3"],
    purities: [
      { id: "99.85", label: "99.85% min", description: "High purity antimony metal", priceMultiplier: 1.08, typicalUse: "Flame retardants, alloys" },
      { id: "99.65", label: "99.65%", description: "Standard grade", priceMultiplier: 1.0, typicalUse: "Batteries, semiconductors" },
      { id: "99.5", label: "99.5%", description: "Commercial grade", priceMultiplier: 0.95, typicalUse: "Lead-acid batteries" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
  {
    id: "tin",
    name: "Tin",
    hsCode: "8001.20",
    basePricePerTonne: 28000,
    basePriceSMM: 27800,
    priceSource: "LME",
    keywords: ["tin", "refined tin", "tin metal", "tin ingot", "solder grade tin"],
    purities: [
      { id: "99.99", label: "99.99%", description: "High purity (LME Grade A)", priceMultiplier: 1.04, typicalUse: "Electronics, solders" },
      { id: "99.9", label: "99.9%", description: "Standard refined tin", priceMultiplier: 1.0, typicalUse: "Solder, plating" },
      { id: "99.85", label: "99.85%", description: "Commercial grade", priceMultiplier: 0.96, typicalUse: "Alloys, chemicals" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
  {
    id: "zinc",
    name: "Zinc",
    hsCode: "7901.11",
    basePricePerTonne: 2500,
    basePriceSMM: 2480,
    priceSource: "LME",
    keywords: ["zinc", "zinc metal", "zinc ingot", "special high grade zinc", "shg zinc"],
    purities: [
      { id: "99.995", label: "99.995% SHG", description: "Special High Grade (LME)", priceMultiplier: 1.03, typicalUse: "Galvanizing, die casting" },
      { id: "99.5", label: "99.5%", description: "High grade", priceMultiplier: 1.0, typicalUse: "Alloys, chemicals" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
  {
    id: "lead",
    name: "Lead",
    hsCode: "7801.10",
    basePricePerTonne: 2100,
    basePriceSMM: 2080,
    priceSource: "LME",
    keywords: ["lead", "refined lead", "lead ingot", "lead metal"],
    purities: [
      { id: "99.99", label: "99.99%", description: "Corroding grade (LME)", priceMultiplier: 1.02, typicalUse: "Batteries, radiation shielding" },
      { id: "99.97", label: "99.97%", description: "Chemical lead", priceMultiplier: 1.0, typicalUse: "Chemicals, alloys" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
  {
    id: "nickel",
    name: "Nickel",
    hsCode: "7502.10",
    basePricePerTonne: 18000,
    basePriceSMM: 17800,
    priceSource: "LME",
    keywords: ["nickel", "nickel metal", "nickel cathode", "class i nickel"],
    purities: [
      { id: "99.8", label: "99.8% cathode", description: "LME deliverable", priceMultiplier: 1.02, typicalUse: "Stainless steel, batteries" },
      { id: "99.5", label: "99.5%", description: "Melting grade", priceMultiplier: 1.0, typicalUse: "Alloys" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
  {
    id: "aluminum",
    name: "Aluminum",
    hsCode: "7601.10",
    basePricePerTonne: 2200,
    basePriceSMM: 2180,
    priceSource: "LME",
    keywords: ["aluminum", "aluminium", "aluminum ingot", "primary aluminum"],
    purities: [
      { id: "99.7", label: "99.7%", description: "Primary aluminum (LME)", priceMultiplier: 1.0, typicalUse: "Extrusion, rolling" },
      { id: "99.5", label: "99.5%", description: "Commercial purity", priceMultiplier: 0.98, typicalUse: "Casting alloys" },
      { id: "other", label: "Other / Custom", description: "Specify in requirements", priceMultiplier: 1.0, typicalUse: "Custom grades" },
    ],
  },
];

/** Detect mineral product from search text and return config if found */
export function detectMineralProduct(searchText: string): MineralProduct | null {
  const lower = searchText.toLowerCase().trim();
  for (const mineral of MINERAL_PRODUCTS) {
    if (mineral.keywords.some((k) => lower.includes(k))) {
      return mineral;
    }
  }
  return null;
}

/** Get purity options for a product (for API/UI) */
export function getMineralPurityOptions(productName: string): { product: MineralProduct; options: MineralPurityGrade[] } | null {
  const product = detectMineralProduct(productName);
  if (!product) return null;
  return { product, options: product.purities };
}

/** Check if origin country is in Asia (use SMM pricing) */
export function isAsiaOrigin(originCountry: string): boolean {
  const normalized = (originCountry || "").toLowerCase().replace(/\s+/g, " ").trim();
  return ASIA_ORIGINS.has(normalized) || ASIA_ORIGINS.has(normalized.replace(/^the\s+/, ""));
}

/** Calculate price per tonne for a mineral + purity + form. Uses SMM for Asia origins when available. */
export function getMineralPricePerTonne(
  productId: string,
  purityId: string,
  originCountry?: string,
  formId?: string,
  /** Override base price (e.g. from market API); skips config base */
  basePriceOverride?: number
): number | null {
  const product = MINERAL_PRODUCTS.find((m) => m.id === productId);
  if (!product) return null;
  const purity = product.purities.find((p) => p.id === purityId) ?? product.purities.find((p) => p.id === "99.9") ?? product.purities[0];
  const form = formId ? MINERAL_FORMS.find((f) => f.id === formId) : MINERAL_FORMS.find((f) => f.id === "ingot");
  const basePrice =
    basePriceOverride != null
      ? basePriceOverride
      : (originCountry && isAsiaOrigin(originCountry) && product.basePriceSMM != null
          ? product.basePriceSMM!
          : product.basePricePerTonne);
  return basePrice * purity.priceMultiplier * (form?.priceMultiplier ?? 1);
}

/** Get effective price source for a mineral given origin */
export function getMineralPriceSource(productId: string, originCountry?: string): PriceSource {
  const product = MINERAL_PRODUCTS.find((m) => m.id === productId);
  if (!product) return "LME";
  if (originCountry && isAsiaOrigin(originCountry) && product.basePriceSMM != null) return "SMM";
  return product.priceSource;
}
