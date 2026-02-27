import type { ProductFamily } from "./types";

export const machineryFamily: ProductFamily = {
  id: "machinery_equipment",
  name: "Machinery & Industrial Equipment",
  referenceIndex: "OEM",
  unit: "piece",
  basePricePerUnit: 5000,
  hsCodePrefix: "84",
  keywords: [
    "pump", "compressor", "valve", "cnc", "machine", "forklift", "industrial equipment",
    "machinery", "hydraulic", "pneumatic", "conveyor",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "pump", label: "Pump", priceMultiplier: 1.0 },
        { id: "compressor", label: "Compressor", priceMultiplier: 1.2 },
        { id: "valve", label: "Valve", priceMultiplier: 0.3 },
        { id: "cnc", label: "CNC Machine", priceMultiplier: 5.0 },
        { id: "forklift", label: "Forklift", priceMultiplier: 2.0 },
      ],
    },
    {
      id: "capacity",
      label: "Capacity (flow rate, kW, tonnage)",
      type: "text",
      placeholder: "e.g. 100 m³/h, 15 kW",
      hint: "Key spec for pricing",
    },
    {
      id: "material",
      label: "Material",
      type: "select",
      options: [
        { id: "carbon_steel", label: "Carbon Steel", priceMultiplier: 1.0 },
        { id: "stainless", label: "Stainless Steel", priceMultiplier: 1.4 },
        { id: "cast_iron", label: "Cast Iron", priceMultiplier: 0.9 },
      ],
    },
    {
      id: "automation",
      label: "Automation Level",
      type: "select",
      options: [
        { id: "manual", label: "Manual", priceMultiplier: 0.8 },
        { id: "semi_auto", label: "Semi-automatic", priceMultiplier: 1.0 },
        { id: "full_cnc", label: "Full CNC/PLC", priceMultiplier: 1.5 },
      ],
    },
  ],
};
