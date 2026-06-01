import { listCampaigns } from "@/lib/campaigns";
import { siteFeedCount, siteFeedLastDate } from "@/lib/feed/site-feed";
import { getReviewQueueBreakdown, getSectorClusters } from "@/lib/intelligence/discovery";
import { countFeedEventsSince, getHottestSectorInFeed } from "@/lib/market/feed-rhythm";

export type MarketPulse = {
  coverage: number;
  sectorCount: number;
  cityCount: number;
  feedEvents: number;
  activeDossiers: number;
  lastFeedDate: string | null;
  eventsLast14Days: number;
  hottestSector: string | null;
  hottestSectorCount: number;
  exportHeavyCount: number;
};

export function getMarketPulse(): MarketPulse {
  const campaigns = listCampaigns();
  const queue = getReviewQueueBreakdown();
  const activeDossiers =
    queue.document_review + queue.field_verification + queue.committee;
  const lastFeedDate = siteFeedLastDate();
  const hot = getHottestSectorInFeed(14);

  const exportHeavyCount = campaigns.filter((c) => {
    const share = c.marketMix?.exportShare ?? "";
    const pct = parseInt(share.replace(/\D/g, ""), 10);
    return !Number.isNaN(pct) && pct >= 50;
  }).length;

  return {
    coverage: campaigns.length,
    sectorCount: getSectorClusters().length,
    cityCount: new Set(campaigns.map((c) => c.city)).size,
    feedEvents: siteFeedCount(),
    activeDossiers,
    lastFeedDate,
    eventsLast14Days: countFeedEventsSince(14, lastFeedDate ?? undefined),
    hottestSector: hot?.sector ?? null,
    hottestSectorCount: hot?.count ?? 0,
    exportHeavyCount,
  };
}
