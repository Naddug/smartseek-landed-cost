import type { ProductFamily } from "./types";

export const lumberFamily: ProductFamily = {
  id: "lumber_panels",
  name: "Lumber, Plywood & Panels",
  referenceIndex: "Regional",
  unit: "cbm",
  basePricePerUnit: 350,
  hsCodePrefix: "44",
  keywords: [
    "lumber", "plywood", "mdf", "osb", "particle board", "softwood", "hardwood",
    "pine", "spruce", "oak", "timber", "wood panel", "construction lumber",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "softwood_lumber", label: "Softwood Lumber", priceMultiplier: 1.0 },
        { id: "hardwood_lumber", label: "Hardwood Lumber", priceMultiplier: 1.4 },
        { id: "plywood", label: "Plywood", priceMultiplier: 1.2 },
        { id: "mdf", label: "MDF", priceMultiplier: 0.9 },
        { id: "osb", label: "OSB", priceMultiplier: 0.85 },
      ],
    },
    {
      id: "species",
      label: "Species",
      type: "select",
      options: [
        { id: "pine", label: "Pine", priceMultiplier: 1.0 },
        { id: "spruce", label: "Spruce", priceMultiplier: 1.05 },
        { id: "oak", label: "Oak", priceMultiplier: 1.3 },
        { id: "birch", label: "Birch", priceMultiplier: 1.15 },
      ],
    },
    {
      id: "grade",
      label: "Grade",
      type: "select",
      options: [
        { id: "construction", label: "Construction", priceMultiplier: 1.0 },
        { id: "appearance", label: "Appearance", priceMultiplier: 1.15 },
        { id: "furniture", label: "Furniture", priceMultiplier: 1.25 },
      ],
    },
    {
      id: "moisture",
      label: "Moisture",
      type: "select",
      options: [
        { id: "kiln_dried", label: "Kiln-dried", priceMultiplier: 1.08 },
        { id: "green", label: "Green", priceMultiplier: 0.9 },
      ],
    },
    {
      id: "certification",
      label: "Certification",
      type: "select",
      options: [
        { id: "none", label: "None", priceMultiplier: 1.0 },
        { id: "fsc", label: "FSC", priceMultiplier: 1.1 },
        { id: "pefc", label: "PEFC", priceMultiplier: 1.08 },
      ],
    },
  ],
};
