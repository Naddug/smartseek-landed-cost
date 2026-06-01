import type { SiteFeedEvent } from "@/lib/feed/site-feed";

export type FeedUpdateType =
  | "export_market"
  | "facility"
  | "capacity"
  | "document"
  | "field_note"
  | "operational_note";

export function classifyFeedUpdateType(ev: SiteFeedEvent): FeedUpdateType {
  const text = ev.text.toLowerCase();

  if (ev.kind === "field") {
    if (ev.type === "logistics" || /ihracat|sevkiyat|pazar|konteyner|distribütör/.test(text)) {
      return "export_market";
    }
    if (ev.type === "capacity" || /kapasite|hat|doluluk|üretim/.test(text)) {
      return "capacity";
    }
    if (/tesis|fabrika|foto|depo|osb/.test(text)) {
      return "facility";
    }
    return "field_note";
  }

  if (/belge|dosya|inceleme|rapor|tutanak|sertifika|çed/.test(text)) {
    return "document";
  }
  if (/ihracat|fatura|pazar|sevkiyat/.test(text)) {
    return "export_market";
  }
  if (/kapasite|hat|revize|üretim/.test(text)) {
    return "capacity";
  }
  if (/tesis|foto|fabrika|depo/.test(text)) {
    return "facility";
  }
  return "operational_note";
}
