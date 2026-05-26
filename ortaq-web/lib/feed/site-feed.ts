import { listCampaigns } from "@/lib/campaigns";
import type { FieldJournalEntry, SimulatedCampaign } from "@/lib/campaigns/types";

/**
 * Cross-campaign event stream.
 *
 * Two source kinds are merged into a single typed feed:
 *   - fieldJournal entries (saha observation/inspection/capacity/logistics/founder)
 *   - operationalUpdates (file-level events: doc verified, photo archived, etc.)
 *
 * All events carry company metadata so any consumer (masthead, activity table,
 * future /akış page) can render the same shape.
 *
 * Sort is strictly desc by ISO date + 24h time. No randomization, no fake data.
 */

export type SiteFeedEvent =
  | {
      kind: "field";
      date: string;
      time: string;
      author: string;
      type: FieldJournalEntry["type"];
      text: string;
      campaignSlug: string;
      campaignTradeName: string;
      campaignCity: string;
    }
  | {
      kind: "update";
      date: string;
      time: string;
      text: string;
      campaignSlug: string;
      campaignTradeName: string;
      campaignCity: string;
    };

function campaignEvents(c: SimulatedCampaign): SiteFeedEvent[] {
  const fromJournal: SiteFeedEvent[] = c.fieldJournal.map((entry) => ({
    kind: "field" as const,
    date: entry.date,
    time: entry.time,
    author: entry.author,
    type: entry.type,
    text: entry.text,
    campaignSlug: c.slug,
    campaignTradeName: c.tradeName,
    campaignCity: c.city,
  }));

  const fromUpdates: SiteFeedEvent[] = c.operationalUpdates.map((u) => ({
    kind: "update" as const,
    date: u.date,
    time: u.time,
    text: u.text,
    campaignSlug: c.slug,
    campaignTradeName: c.tradeName,
    campaignCity: c.city,
  }));

  return [...fromJournal, ...fromUpdates];
}

function compare(a: SiteFeedEvent, b: SiteFeedEvent): number {
  // ISO date string lexicographic compare is correct for YYYY-MM-DD.
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  if (a.time !== b.time) return a.time < b.time ? 1 : -1;
  return 0;
}

/**
 * All events from all campaigns, newest first.
 * Safe to call at render time; lists are small (~5–20 entries per campaign).
 */
export function siteFeed(): SiteFeedEvent[] {
  return listCampaigns().flatMap(campaignEvents).sort(compare);
}

/** Top N events across all campaigns. */
export function siteFeedTop(n: number): SiteFeedEvent[] {
  return siteFeed().slice(0, n);
}

/** ISO date of the most recent event in the stream, or null if empty. */
export function siteFeedLastDate(): string | null {
  const top = siteFeedTop(1)[0];
  return top ? top.date : null;
}

export function siteFeedCount(): number {
  return siteFeed().length;
}
