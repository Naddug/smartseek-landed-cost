import type { ProductFamily } from "./types";

export const textilesFamily: ProductFamily = {
  id: "textiles_garments",
  name: "Textiles & Garments",
  referenceIndex: "Regional",
  unit: "kg",
  basePricePerUnit: 5,
  hsCodePrefix: "61",
  keywords: [
    "yarn", "fabric", "cotton", "polyester", "wool", "textile", "garment", "apparel",
    "woven", "knit", "dyed fabric", "printed fabric", "gsm", "denier",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "yarn", label: "Yarn", priceMultiplier: 1.0 },
        { id: "fabric", label: "Fabric (rolls)", priceMultiplier: 1.2 },
        { id: "garment", label: "Finished Garment", priceMultiplier: 2.5 },
      ],
    },
    {
      id: "composition",
      label: "Fiber Composition",
      type: "select",
      options: [
        { id: "100_cotton", label: "100% Cotton", priceMultiplier: 1.15 },
        { id: "poly_cotton", label: "Polyester/Cotton blend", priceMultiplier: 1.0 },
        { id: "100_poly", label: "100% Polyester", priceMultiplier: 0.85 },
        { id: "wool", label: "Wool blend", priceMultiplier: 1.5 },
      ],
    },
    {
      id: "gsm",
      label: "GSM / Weight",
      type: "text",
      placeholder: "e.g. 180 GSM",
      hint: "Grams per sq meter for fabric",
    },
    {
      id: "finish",
      label: "Fabric Finish",
      type: "select",
      options: [
        { id: "grey", label: "Grey / Unfinished", priceMultiplier: 1.0 },
        { id: "dyed", label: "Dyed", priceMultiplier: 1.1 },
        { id: "printed", label: "Printed", priceMultiplier: 1.15 },
        { id: "coated", label: "Coated", priceMultiplier: 1.2 },
      ],
    },
    {
      id: "compliance",
      label: "Compliance",
      type: "select",
      options: [
        { id: "standard", label: "Standard", priceMultiplier: 1.0 },
        { id: "oeko_tex", label: "OEKO-TEX", priceMultiplier: 1.08 },
        { id: "organic", label: "Organic", priceMultiplier: 1.2 },
        { id: "recycled", label: "Recycled", priceMultiplier: 1.1 },
      ],
    },
  ],
};
