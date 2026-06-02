import type { SiteFeedEvent } from "@/lib/feed/site-feed";
import { getCampaign } from "@/lib/campaigns";
import { getSectorTag } from "@/lib/product/company-summary";

export type FeedActivityRow = {
  company: string;
  place: string;
  sector: string;
  sentence: string;
};

function cleanSentence(text: string): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  const withCap = trimmed.charAt(0).toLocaleUpperCase("tr-TR") + trimmed.slice(1);
  return /[.!?]$/.test(withCap) ? withCap : `${withCap}.`;
}

/** Industrial record line: company context + what changed (no abstract type labels). */
export function getFeedActivityRow(ev: SiteFeedEvent): FeedActivityRow {
  const c = getCampaign(ev.campaignSlug);
  const sector = c ? getSectorTag(c) : "—";

  return {
    company: ev.campaignTradeName,
    place: ev.campaignCity,
    sector,
    sentence: cleanSentence(ev.text),
  };
}
