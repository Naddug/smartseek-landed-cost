import type { ProductFamily } from "./types";

export const foodFamily: ProductFamily = {
  id: "food_beverage",
  name: "Food & Beverages (Processed)",
  referenceIndex: "Regional",
  unit: "tonne",
  basePricePerUnit: 2000,
  hsCodePrefix: "16",
  keywords: [
    "canned food", "beverage", "snack", "edible oil", "olive oil", "evoo", "extra virgin olive oil",
    "dairy", "processed food", "packaged food", "bottled beverage", "tetra pack", "juice", "sauce",
    "vegetable oil", "sunflower oil", "palm oil", "coconut oil", "rapeseed oil", "canola oil",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "canned", label: "Canned Food", priceMultiplier: 1.0 },
        { id: "beverage", label: "Beverage", priceMultiplier: 1.1 },
        { id: "snack", label: "Snack", priceMultiplier: 1.2 },
        { id: "olive_oil", label: "Olive Oil", priceMultiplier: 1.5 },
        { id: "oil", label: "Edible Oil (other)", priceMultiplier: 1.3 },
        { id: "dairy", label: "Dairy", priceMultiplier: 1.15 },
      ],
    },
    {
      id: "oil_grade",
      label: "Grade (for oils)",
      type: "select",
      options: [
        { id: "n_a", label: "N/A (non-oil)", priceMultiplier: 1.0 },
        { id: "extra_virgin", label: "Extra Virgin", priceMultiplier: 1.3 },
        { id: "virgin", label: "Virgin", priceMultiplier: 1.1 },
        { id: "refined", label: "Refined / Pomace", priceMultiplier: 0.85 },
      ],
    },
    {
      id: "packaging",
      label: "Packaging",
      type: "select",
      options: [
        { id: "can", label: "Can", priceMultiplier: 1.0 },
        { id: "bottle", label: "Bottle", priceMultiplier: 1.05 },
        { id: "tetra", label: "Tetra Pack", priceMultiplier: 1.08 },
        { id: "pouch", label: "Pouch", priceMultiplier: 0.95 },
      ],
    },
    {
      id: "certification",
      label: "Certification",
      type: "select",
      options: [
        { id: "haccp", label: "HACCP", priceMultiplier: 1.0 },
        { id: "iso22000", label: "ISO 22000", priceMultiplier: 1.0 },
        { id: "halal", label: "Halal", priceMultiplier: 1.03 },
        { id: "kosher", label: "Kosher", priceMultiplier: 1.05 },
      ],
    },
  ],
};
