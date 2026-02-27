import type { ProductFamily } from "./types";

export const agriFamily: ProductFamily = {
  id: "agri_bulk",
  name: "Agricultural Bulk Commodities",
  referenceIndex: "CBOT",
  unit: "mt",
  basePricePerUnit: 250,
  hsCodePrefix: "10",
  keywords: [
    "wheat", "corn", "barley", "rice", "soybeans", "palm oil", "sugar", "coffee", "cocoa",
    "grain", "cereal", "oilseed", "feed grain", "milling wheat", "raw sugar", "white sugar",
    "arabica", "robusta", "cocoa beans",
  ],
  parameters: [
    {
      id: "product",
      label: "Product",
      type: "select",
      required: true,
      options: [
        { id: "wheat", label: "Wheat", priceMultiplier: 1.0 },
        { id: "corn", label: "Corn / Maize", priceMultiplier: 0.9 },
        { id: "barley", label: "Barley", priceMultiplier: 0.85 },
        { id: "rice", label: "Rice", priceMultiplier: 1.2 },
        { id: "soybeans", label: "Soybeans", priceMultiplier: 1.1 },
        { id: "palm_oil", label: "Palm Oil", priceMultiplier: 1.3 },
        { id: "sugar", label: "Sugar", priceMultiplier: 0.5 },
        { id: "coffee", label: "Coffee", priceMultiplier: 3.5 },
        { id: "cocoa", label: "Cocoa", priceMultiplier: 4.0 },
      ],
    },
    {
      id: "grade_spec",
      label: "Grade / Spec",
      type: "select",
      options: [
        { id: "milling", label: "Milling grade", priceMultiplier: 1.05 },
        { id: "feed", label: "Feed grade", priceMultiplier: 0.95 },
        { id: "white_sugar", label: "White sugar", priceMultiplier: 1.1 },
        { id: "raw_sugar", label: "Raw sugar", priceMultiplier: 1.0 },
        { id: "arabica", label: "Arabica coffee", priceMultiplier: 1.2 },
        { id: "robusta", label: "Robusta coffee", priceMultiplier: 0.9 },
      ],
    },
    {
      id: "certification",
      label: "Certification",
      type: "select",
      options: [
        { id: "conventional", label: "Conventional", priceMultiplier: 1.0 },
        { id: "non_gmo", label: "Non-GMO", priceMultiplier: 1.08 },
        { id: "organic", label: "Organic", priceMultiplier: 1.25 },
      ],
    },
    {
      id: "packing",
      label: "Packing",
      type: "select",
      options: [
        { id: "bulk", label: "Bulk", priceMultiplier: 1.0 },
        { id: "bagged_50", label: "50 kg bags", priceMultiplier: 1.05 },
        { id: "bagged_25", label: "25 kg bags", priceMultiplier: 1.08 },
      ],
    },
    {
      id: "moisture",
      label: "Moisture (%)",
      type: "text",
      placeholder: "e.g. 12.5",
      hint: "Critical for grains",
    },
    {
      id: "delivery_basis",
      label: "Delivery Basis",
      type: "select",
      options: [
        { id: "fob_brazil", label: "FOB Brazil", priceMultiplier: 1.0 },
        { id: "cfr_china", label: "CFR China", priceMultiplier: 1.12 },
        { id: "cif_europe", label: "CIF Europe", priceMultiplier: 1.1 },
        { id: "fob_us", label: "FOB US Gulf", priceMultiplier: 1.02 },
      ],
    },
  ],
};
