import { getCampaign } from "@/lib/campaigns";
import { classifyFeedUpdateType } from "@/lib/feed/feed-update-type";
import { siteFeed } from "@/lib/feed/site-feed";
import { getSectorTag } from "@/lib/product/company-summary";

function parseFeedDate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

export type WeeklySignals = {
  updates: number;
  productionLine: number;
  exportDevelopments: number;
  newSectors: number;
};

export function getWeeklySignals(): WeeklySignals {
  const events = siteFeed();
  if (events.length === 0) {
    return { updates: 0, productionLine: 0, exportDevelopments: 0, newSectors: 0 };
  }

  const reference = parseFeedDate(events[0].date);
  const cutoff = new Date(reference);
  cutoff.setDate(cutoff.getDate() - 7);

  const thisWeek = events.filter((ev) => parseFeedDate(ev.date) >= cutoff);

  let productionLine = 0;
  let exportDevelopments = 0;
  const sectors = new Set<string>();

  for (const ev of thisWeek) {
    const type = classifyFeedUpdateType(ev);
    if (type === "export_market") exportDevelopments += 1;
    if (/üretim hatt|hat kapasite|kapasite art|ikinci vardiya|hat devre/i.test(ev.text)) {
      productionLine += 1;
    } else if (type === "capacity") {
      productionLine += 1;
    }

    const c = getCampaign(ev.campaignSlug);
    if (c) sectors.add(getSectorTag(c));
  }

  return {
    updates: thisWeek.length,
    productionLine,
    exportDevelopments,
    newSectors: sectors.size,
  };
}
