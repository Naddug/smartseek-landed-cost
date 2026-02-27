import type { ProductFamily } from "./types";
import { steelFamily } from "./steel";
import { agriFamily } from "./agri";
import { chemicalsFamily } from "./chemicals";
import { textilesFamily } from "./textiles";
import { lumberFamily } from "./lumber";
import { plasticsFamily } from "./plastics";
import { electronicsFamily } from "./electronics";
import { machineryFamily } from "./machinery";
import { foodFamily } from "./food";
import { detectMineralProduct } from "../mineralConfig";

export * from "./types";
export { steelFamily, agriFamily, chemicalsFamily, textilesFamily, lumberFamily, plasticsFamily, electronicsFamily, machineryFamily, foodFamily };

export const PRODUCT_FAMILIES: ProductFamily[] = [
  steelFamily,
  agriFamily,
  chemicalsFamily,
  textilesFamily,
  lumberFamily,
  plasticsFamily,
  electronicsFamily,
  machineryFamily,
  foodFamily,
];

/** Detect product family from search text. Minerals (from mineralConfig) take precedence. */
export function detectProductFamily(searchText: string): ProductFamily | null {
  const lower = (searchText || "").toLowerCase().trim();
  if (!lower || lower.length < 2) return null;

  // Minerals are handled separately (mineralConfig) - skip if mineral
  if (detectMineralProduct(lower)) return null;

  for (const family of PRODUCT_FAMILIES) {
    if (family.keywords.some((k) => lower.includes(k))) {
      return family;
    }
  }
  return null;
}

/** Compute indicative price from product family + params. Returns USD per unit. */
export function getProductFamilyPrice(
  family: ProductFamily,
  params: Record<string, string>,
  _originCountry?: string,
  baseOverride?: number
): number {
  const base = baseOverride ?? family.basePricePerUnit ?? 100;
  let multiplier = 1;

  for (const param of family.parameters) {
    const value = params[param.id];
    if (!value || param.type !== "select" || !param.options) continue;
    const opt = param.options.find((o) => o.id === value);
    if (opt?.priceMultiplier != null) multiplier *= opt.priceMultiplier;
  }

  return base * multiplier;
}
