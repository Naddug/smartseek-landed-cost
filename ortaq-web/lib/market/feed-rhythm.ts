import { siteFeed } from "@/lib/feed/site-feed";
import { getCampaign } from "@/lib/campaigns";
import { getSectorTag } from "@/lib/product/company-summary";
import { industrialSectors, sectorMatchers } from "@/lib/product/home-data";

function parseFeedDate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

export function countFeedEventsSince(days: number, referenceIso?: string): number {
  const events = siteFeed();
  if (events.length === 0) return 0;
  const ref = referenceIso ? parseFeedDate(referenceIso) : parseFeedDate(events[0].date);
  const cutoff = new Date(ref);
  cutoff.setDate(cutoff.getDate() - days);
  return events.filter((e) => parseFeedDate(e.date) >= cutoff).length;
}

export function getHottestSectorInFeed(windowDays = 14): { sector: string; count: number } | null {
  const events = siteFeed();
  if (events.length === 0) return null;

  const ref = parseFeedDate(events[0].date);
  const cutoff = new Date(ref);
  cutoff.setDate(cutoff.getDate() - windowDays);

  const counts = new Map<string, number>();
  for (const ev of events) {
    if (parseFeedDate(ev.date) < cutoff) continue;
    const c = getCampaign(ev.campaignSlug);
    if (!c) continue;
    const sector = getSectorTag(c);
    counts.set(sector, (counts.get(sector) ?? 0) + 1);
  }

  let best: { sector: string; count: number } | null = null;
  for (const [sector, count] of counts) {
    if (!best || count > best.count) best = { sector, count };
  }
  return best;
}

type SectorId = (typeof industrialSectors)[number]["id"];

function matchSectorClusterId(sectorLabel: string): SectorId | null {
  for (const [id, matcher] of Object.entries(sectorMatchers) as [SectorId, RegExp][]) {
    if (matcher.test(sectorLabel)) return id;
  }
  return null;
}

/** Feed events per sector cluster in the rolling window (for homepage chips). */
export function countFeedBySectorCluster(windowDays = 14): Partial<Record<SectorId, number>> {
  const events = siteFeed();
  if (events.length === 0) return {};

  const ref = parseFeedDate(events[0].date);
  const cutoff = new Date(ref);
  cutoff.setDate(cutoff.getDate() - windowDays);

  const counts: Partial<Record<SectorId, number>> = {};
  for (const ev of events) {
    if (parseFeedDate(ev.date) < cutoff) continue;
    const c = getCampaign(ev.campaignSlug);
    if (!c) continue;
    const id = matchSectorClusterId(c.sector);
    if (!id) continue;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}
