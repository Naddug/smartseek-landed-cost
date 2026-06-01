import { listCampaigns } from "@/lib/campaigns";
import { getCompanyFacet } from "@/lib/market/company-facet";

export type MarketIntelligenceSignal = {
  slug: string;
  entity: string;
  sector: string;
  signal: string;
  proof: string;
};

export function listMarketIntelligenceSignals(limit = 6): MarketIntelligenceSignal[] {
  return listCampaigns()
    .slice(0, limit)
    .map((c) => {
      const facet = getCompanyFacet(c);
      return {
        slug: c.slug,
        entity: facet.tradeName,
        sector: facet.sector,
        signal: facet.situation,
        proof: facet.proofLine,
      };
    });
}
