/**
 * Product family configuration for SmartSeek.
 * Each family defines parameters that affect pricing; AI or reference indices provide base prices.
 */
export type ReferenceIndex = "LME" | "Argus" | "SMM" | "Platts" | "CBOT" | "ICE" | "Regional" | "OEM" | "Spot";

export type ParamType = "select" | "text" | "number";

export interface ProductParamOption {
  id: string;
  label: string;
  /** Price multiplier vs base (1.0 = standard) */
  priceMultiplier?: number;
  description?: string;
}

export interface ProductParameter {
  id: string;
  label: string;
  type: ParamType;
  required?: boolean;
  placeholder?: string;
  /** For select: predefined options */
  options?: ProductParamOption[];
  /** Hint for AI pricing when no index */
  hint?: string;
}

export interface ProductFamily {
  id: string;
  name: string;
  /** Keywords to match user query */
  keywords: string[];
  referenceIndex: ReferenceIndex;
  /** Base price USD/tonne or USD/unit (indicative) */
  basePricePerUnit?: number;
  unit?: "tonne" | "mt" | "kg" | "piece" | "cbm" | "liter" | "bbl";
  /** Parameters user must/can specify */
  parameters: ProductParameter[];
  /** HS code prefix for this family */
  hsCodePrefix?: string;
}
