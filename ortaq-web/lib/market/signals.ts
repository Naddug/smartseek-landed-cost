import { listCampaigns } from "@/lib/campaigns";
import { getOperationalRelevanceLine } from "@/lib/product/operational-relevance";
import { getSectorTag } from "@/lib/product/company-summary";

export type MarketIntelligenceSignal = {
  slug: string;
  entity: string;
  sector: string;
  signal: string;
};

/** Cross-market operational signals (entity is coverage anchor, not the headline). */
export function listMarketIntelligenceSignals(limit = 6): MarketIntelligenceSignal[] {
  return listCampaigns()
    .slice(0, limit)
    .map((c) => ({
      slug: c.slug,
      entity: c.tradeName,
      sector: getSectorTag(c),
      signal: getOperationalRelevanceLine(c),
    }));
}
