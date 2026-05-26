import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getSectorTagEn } from "@/lib/product/company-summary";

const sectorStyles: Record<string, { badge: string; bar: string }> = {
  MFG: { badge: "bg-ortaq-trust-soft text-ortaq-trust", bar: "bg-ortaq-trust" },
  TEXTILE: { badge: "bg-ortaq-status-soft text-ortaq-status", bar: "bg-ortaq-status" },
  FOOD: { badge: "bg-ortaq-bg-warm text-ortaq-accent", bar: "bg-ortaq-accent" },
  METAL: { badge: "bg-ortaq-trust-soft/80 text-ortaq-trust-muted", bar: "bg-ortaq-trust-muted" },
  LOGISTICS: { badge: "bg-blue-50 text-blue-800", bar: "bg-blue-600" },
  CHEMICAL: { badge: "bg-violet-50 text-violet-800", bar: "bg-violet-600" },
  ELECTRONICS: { badge: "bg-slate-100 text-slate-700", bar: "bg-slate-600" },
  FURNITURE: { badge: "bg-amber-50 text-amber-900", bar: "bg-amber-700" },
  MARINE: { badge: "bg-cyan-50 text-cyan-900", bar: "bg-cyan-700" },
  INDUSTRY: { badge: "bg-ortaq-bg-alt text-ortaq-ink-muted", bar: "bg-ortaq-ink-soft" },
};

export function getSectorStyle(c: SimulatedCampaign) {
  const tag = getSectorTagEn(c);
  return sectorStyles[tag] ?? sectorStyles.INDUSTRY;
}
