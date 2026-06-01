import type { SiteFeedEvent } from "@/lib/feed/site-feed";
import { getCampaign } from "@/lib/campaigns";
import { getSectorTag } from "@/lib/product/company-summary";
import type { FeedUpdateType } from "@/lib/feed/feed-update-type";

const TYPE_CONTEXT: Record<FeedUpdateType, string> = {
  export_market: "İhracat",
  facility: "Tesis",
  capacity: "Kapasite",
  document: "Belge",
  field_note: "Saha",
  operational_note: "Dosya",
};

export type FeedDisplayLine = {
  company: string;
  place: string;
  sector: string;
  typeLabel: string;
  summary: string;
};

/** Reader-facing feed line: who + where + what kind of update + detail. */
export function getFeedDisplayLine(ev: SiteFeedEvent, type: FeedUpdateType): FeedDisplayLine {
  const c = getCampaign(ev.campaignSlug);
  const sector = c ? getSectorTag(c) : "—";
  const typeLabel = TYPE_CONTEXT[type];

  let summary = ev.text.trim();
  if (ev.kind === "field" && ev.author) {
    summary = `${summary} (${ev.author})`;
  }

  return {
    company: ev.campaignTradeName,
    place: ev.campaignCity,
    sector,
    typeLabel,
    summary,
  };
}
