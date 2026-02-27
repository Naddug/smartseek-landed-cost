import type { ProductFamily } from "./types";

export const steelFamily: ProductFamily = {
  id: "finished_metal_steel",
  name: "Steel & Finished Metal Products",
  referenceIndex: "LME",
  unit: "tonne",
  basePricePerUnit: 650,
  hsCodePrefix: "72",
  keywords: [
    "hrc", "crc", "hot rolled coil", "cold rolled coil", "steel plate", "wire rod", "rebar",
    "reinforcement bar", "beams", "billets", "steel pipe", "stainless steel", "aluminum profiles",
    "galvanized steel", "coated steel", "structural steel", "carbon steel",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "hrc", label: "HRC (Hot Rolled Coil)", priceMultiplier: 1.0 },
        { id: "crc", label: "CRC (Cold Rolled Coil)", priceMultiplier: 1.15 },
        { id: "plate", label: "Plate", priceMultiplier: 1.08 },
        { id: "wire_rod", label: "Wire Rod", priceMultiplier: 0.95 },
        { id: "rebar", label: "Rebar", priceMultiplier: 0.9 },
        { id: "beams", label: "Beams / Sections", priceMultiplier: 1.1 },
        { id: "billets", label: "Billets", priceMultiplier: 0.85 },
        { id: "pipe", label: "Pipe / Tube", priceMultiplier: 1.2 },
        { id: "stainless", label: "Stainless (304/316)", priceMultiplier: 2.5 },
        { id: "aluminum_profile", label: "Aluminum Profiles", priceMultiplier: 2.2 },
      ],
    },
    {
      id: "grade",
      label: "Strength / Grade",
      type: "select",
      options: [
        { id: "s235", label: "S235", priceMultiplier: 0.95 },
        { id: "s355", label: "S355", priceMultiplier: 1.0 },
        { id: "astm_a36", label: "ASTM A36", priceMultiplier: 1.0 },
        { id: "304", label: "Stainless 304", priceMultiplier: 1.0 },
        { id: "316", label: "Stainless 316", priceMultiplier: 1.15 },
        { id: "other", label: "Other / Custom", priceMultiplier: 1.0 },
      ],
    },
    {
      id: "surface_coating",
      label: "Surface / Coating",
      type: "select",
      options: [
        { id: "black", label: "Black (uncoated)", priceMultiplier: 1.0 },
        { id: "galvanized", label: "Galvanized", priceMultiplier: 1.12 },
        { id: "pickled_oiled", label: "Pickled & Oiled", priceMultiplier: 1.05 },
        { id: "painted", label: "Painted / Coated", priceMultiplier: 1.15 },
      ],
    },
    {
      id: "quality",
      label: "Tolerance / Quality",
      type: "select",
      options: [
        { id: "commercial", label: "Commercial", priceMultiplier: 0.95 },
        { id: "structural", label: "Structural", priceMultiplier: 1.0 },
        { id: "prime", label: "Prime", priceMultiplier: 1.05 },
        { id: "secondary", label: "Secondary", priceMultiplier: 0.85 },
      ],
    },
    {
      id: "delivery_basis",
      label: "Delivery Basis",
      type: "select",
      options: [
        { id: "fob_asia", label: "FOB Asia", priceMultiplier: 1.0 },
        { id: "cif_europe", label: "CIF Europe", priceMultiplier: 1.08 },
        { id: "fob_europe", label: "FOB Europe", priceMultiplier: 1.05 },
        { id: "exw", label: "EXW Mill", priceMultiplier: 0.98 },
      ],
    },
    {
      id: "dimensions",
      label: "Dimensions (thickness x width, mm)",
      type: "text",
      placeholder: "e.g. 2.0 x 1000",
      hint: "Thickness, width, length or diameter",
    },
  ],
};
