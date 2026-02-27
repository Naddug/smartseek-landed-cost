import type { ProductFamily } from "./types";

export const electronicsFamily: ProductFamily = {
  id: "electronics_components",
  name: "Electronics & Components",
  referenceIndex: "OEM",
  unit: "piece",
  basePricePerUnit: 50,
  hsCodePrefix: "85",
  keywords: [
    "laptop", "phone", "pcb", "ic", "chip", "power supply", "motor", "electronic",
    "component", "semiconductor", "capacitor", "resistor", "led",
  ],
  parameters: [
    {
      id: "product_type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { id: "laptop", label: "Laptop", priceMultiplier: 1.0 },
        { id: "phone", label: "Phone / Mobile", priceMultiplier: 0.8 },
        { id: "pcb", label: "PCB", priceMultiplier: 0.1 },
        { id: "power_supply", label: "Power Supply", priceMultiplier: 0.3 },
        { id: "motor", label: "Motor", priceMultiplier: 0.5 },
        { id: "component", label: "Component (IC, etc.)", priceMultiplier: 0.05 },
      ],
    },
    {
      id: "grade",
      label: "Grade",
      type: "select",
      options: [
        { id: "new", label: "New", priceMultiplier: 1.0 },
        { id: "refurbished", label: "Refurbished", priceMultiplier: 0.7 },
        { id: "grade_a", label: "Grade A", priceMultiplier: 0.9 },
        { id: "grade_b", label: "Grade B", priceMultiplier: 0.6 },
      ],
    },
    {
      id: "certification",
      label: "Certification",
      type: "select",
      options: [
        { id: "ce", label: "CE", priceMultiplier: 1.0 },
        { id: "ul", label: "UL", priceMultiplier: 1.02 },
        { id: "rohs", label: "RoHS", priceMultiplier: 1.0 },
        { id: "full", label: "CE + UL + FCC", priceMultiplier: 1.05 },
      ],
    },
    {
      id: "spec",
      label: "Spec (model, wattage, etc.)",
      type: "text",
      placeholder: "e.g. 500W, 12V",
      hint: "CPU/RAM, wattage, voltage",
    },
  ],
};
