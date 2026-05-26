import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { listCampaigns } from "@/lib/campaigns";

export type RegistrySignal = {
  slug: string;
  tradeName: string;
  city: string;
  sector: string;
  tension: string;
  reviewStatus: SimulatedCampaign["reviewStatus"];
};

/** Operational tension line — not marketing copy */
export function getCampaignTensionLine(c: SimulatedCampaign): string {
  if (c.gateway?.tension) return c.gateway.tension;
  const bottleneck = c.bottlenecks[0];
  if (bottleneck) return `${bottleneck.label}: ${bottleneck.note}`;
  return c.funding.purpose;
}

export function listRegistrySignals(): RegistrySignal[] {
  return listCampaigns().map((c) => ({
    slug: c.slug,
    tradeName: c.tradeName,
    city: c.city,
    sector: c.sector,
    tension: getCampaignTensionLine(c),
    reviewStatus: c.reviewStatus,
  }));
}
