import { listCampaigns } from "@/lib/campaigns";
import { siteFeedCount, siteFeedLastDate } from "@/lib/feed/site-feed";
import { getReviewQueueBreakdown, getSectorClusters } from "@/lib/intelligence/discovery";

export type MarketPulse = {
  coverage: number;
  sectorCount: number;
  cityCount: number;
  feedEvents: number;
  activeDossiers: number;
  lastFeedDate: string | null;
};

export function getMarketPulse(): MarketPulse {
  const campaigns = listCampaigns();
  const queue = getReviewQueueBreakdown();
  const activeDossiers =
    queue.document_review + queue.field_verification + queue.committee;

  return {
    coverage: campaigns.length,
    sectorCount: getSectorClusters().length,
    cityCount: new Set(campaigns.map((c) => c.city)).size,
    feedEvents: siteFeedCount(),
    activeDossiers,
    lastFeedDate: siteFeedLastDate(),
  };
}
