import type { ProductFamily } from "./types";

export const plasticsFamily: ProductFamily = {
  id: "plastics_packaging",
  name: "Plastics & Packaging Materials",
  referenceIndex: "Regional",
  unit: "tonne",
  basePricePerUnit: 1200,
  hsCodePrefix: "39",
  keywords: [
    "pe", "pp", "pet", "hdpe", "ldpe", "plastic resin", "plastic film", "bottles",
    "packaging", "blow molding", "injection molding", "extrusion",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "hdpe_blow", label: "HDPE Blow", priceMultiplier: 1.0 },
        { id: "ldpe_film", label: "LDPE Film", priceMultiplier: 1.05 },
        { id: "pet_bottle", label: "PET Bottle Grade", priceMultiplier: 1.1 },
        { id: "pp_injection", label: "PP Injection", priceMultiplier: 1.0 },
        { id: "film", label: "Film / Sheet", priceMultiplier: 1.15 },
      ],
    },
    {
      id: "content",
      label: "Virgin vs Recycled",
      type: "select",
      options: [
        { id: "virgin", label: "Virgin", priceMultiplier: 1.0 },
        { id: "recycled_50", label: "50% Recycled", priceMultiplier: 0.92 },
        { id: "recycled_100", label: "100% Recycled", priceMultiplier: 0.85 },
      ],
    },
    {
      id: "thickness",
      label: "Thickness (micron)",
      type: "text",
      placeholder: "e.g. 25",
      hint: "For films",
    },
  ],
};
