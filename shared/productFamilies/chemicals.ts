import type { ProductFamily } from "./types";

export const chemicalsFamily: ProductFamily = {
  id: "petrochemicals_chemicals",
  name: "Petrochemicals & Industrial Chemicals",
  referenceIndex: "Regional",
  unit: "tonne",
  basePricePerUnit: 400,
  hsCodePrefix: "28",
  keywords: [
    "methanol", "caustic soda", "sulfuric acid", "hydrochloric acid", "solvents",
    "pe", "pp", "pvc", "polyethylene", "polypropylene", "polymer", "resin",
    "industrial chemical", "petrochemical",
  ],
  parameters: [
    {
      id: "product",
      label: "Product",
      type: "select",
      required: true,
      options: [
        { id: "methanol", label: "Methanol", priceMultiplier: 1.0 },
        { id: "caustic_soda", label: "Caustic Soda (NaOH)", priceMultiplier: 0.8 },
        { id: "sulfuric_acid", label: "Sulfuric Acid", priceMultiplier: 0.15 },
        { id: "hcl", label: "Hydrochloric Acid", priceMultiplier: 0.2 },
        { id: "pe", label: "Polyethylene (PE)", priceMultiplier: 1.2 },
        { id: "pp", label: "Polypropylene (PP)", priceMultiplier: 1.15 },
        { id: "pvc", label: "PVC", priceMultiplier: 1.1 },
      ],
    },
    {
      id: "purity",
      label: "Purity / Concentration",
      type: "select",
      options: [
        { id: "tech", label: "Technical grade", priceMultiplier: 1.0 },
        { id: "food", label: "Food grade", priceMultiplier: 1.15 },
        { id: "pharma", label: "Pharma grade", priceMultiplier: 1.4 },
        { id: "99.5", label: "99.5%+", priceMultiplier: 1.05 },
        { id: "98", label: "98%", priceMultiplier: 0.98 },
      ],
    },
    {
      id: "form",
      label: "Form",
      type: "select",
      options: [
        { id: "liquid", label: "Liquid", priceMultiplier: 1.0 },
        { id: "flakes", label: "Flakes", priceMultiplier: 1.05 },
        { id: "prills", label: "Prills", priceMultiplier: 1.03 },
        { id: "pellets", label: "Pellets", priceMultiplier: 1.02 },
      ],
    },
    {
      id: "packing",
      label: "Packing",
      type: "select",
      options: [
        { id: "bulk", label: "Bulk tank", priceMultiplier: 1.0 },
        { id: "ibc", label: "IBC", priceMultiplier: 1.08 },
        { id: "drums", label: "Drums", priceMultiplier: 1.12 },
      ],
    },
  ],
};
