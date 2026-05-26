import { listCampaigns } from "@/lib/campaigns";
import { getSectorClusters } from "@/lib/intelligence/discovery";
import { siteFeedCount } from "@/lib/feed/site-feed";

export type HomePlatformStats = {
  dossiers: number;
  sectors: number;
  fieldVisits: number;
  reviewLayers: number;
  activityTraces: number;
  cities: number;
};

export function getHomePlatformStats(): HomePlatformStats {
  const campaigns = listCampaigns();
  const sectors = getSectorClusters().length;
  const cities = new Set(campaigns.map((c) => c.city)).size;

  return {
    dossiers: campaigns.length,
    sectors,
    fieldVisits: campaigns.reduce((sum, c) => sum + c.fieldJournal.length, 0),
    reviewLayers: 5,
    activityTraces: siteFeedCount(),
    cities,
  };
}
