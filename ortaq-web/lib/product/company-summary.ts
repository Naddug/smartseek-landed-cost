import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { media, companyMedia, type MediaAsset, type MediaKey } from "@/lib/media";

/**
 * Campaign → sector fallback for unknown slugs.
 * Published campaigns use unique files in /media/companies/{slug}.jpg.
 */
const sectorFallback: { test: RegExp; key: MediaKey }[] = [
  { test: /lojistik|depolama|sevkiyat|logistic/i, key: "logisticsDock" },
  { test: /iplik|dokuma|tekstil|konfeksiyon|textile|garment/i, key: "spinningMill" },
  { test: /seracılık|sera|greenhouse|agtech/i, key: "greenhouse" },
  { test: /fındık|tarım|narenciye|hazelnut|agri/i, key: "agrifoodColdchain" },
  { test: /un |tahıl|bulgur|gıda|salça|paketleme|food|mill/i, key: "foodProcessing" },
  { test: /kimya|reçine|proses|chemical|resin|polymer/i, key: "foodProcessing" },
  { test: /ambalaj|plastik|folyo|packaging|plastic/i, key: "foodProcessing" },
  { test: /seramik|refrakter|cam|ceramic|glass/i, key: "ceramicKiln" },
  { test: /elektronik|montaj|kablolama|electronic/i, key: "factoryDetail" },
  { test: /mobilya|ahşap|furniture|wood/i, key: "workshop" },
  { test: /otomotiv|automotive/i, key: "cncWorkshop" },
  { test: /makine|parça|cnc|machin/i, key: "factoryFloor" },
  { test: /döküm|dokum|metal|kaynak|gemi|denizcilik|marine|foundry|welding/i, key: "machineOperator" },
];

export function getCampaignMediaAsset(slug: string, sector?: string): MediaAsset {
  if (slug in companyMedia) {
    return companyMedia[slug as keyof typeof companyMedia];
  }
  const key = sector
    ? (sectorFallback.find(({ test }) => test.test(sector))?.key ?? "factoryFloor")
    : "factoryFloor";
  return media[key];
}

export function getCampaignMediaAlt(asset: MediaAsset, language: string): string {
  return language === "en" ? asset.altEn : asset.altTr;
}

export function getOperationalSignal(c: SimulatedCampaign, ...needles: string[]) {
  const lower = needles.map((n) => n.toLowerCase());
  return c.operations.signals.find((s) =>
    lower.some((n) => s.label.toLowerCase().includes(n)),
  );
}

export function getReviewProgress(c: SimulatedCampaign) {
  const total = c.process.length;
  const done = c.process.filter((s) => s.status === "done").length;
  const active = c.process.find((s) => s.status === "active");
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, percent, activeStep: active?.label ?? null, activeDate: active?.date };
}

export function getFacilityArea(c: SimulatedCampaign) {
  return c.economics.find(
    (e) =>
      e.label.toLowerCase().includes("kapalı") ||
      e.label.toLowerCase().includes("area") ||
      e.label.toLowerCase().includes("closed"),
  )?.value;
}

export function getLatestOperationalNote(c: SimulatedCampaign) {
  const update = c.operationalUpdates[0];
  if (update) return { date: update.date, text: update.text };
  const journal = c.fieldJournal[0];
  if (journal) return { date: journal.date, text: journal.text };
  return null;
}

/** Most recent ISO date string from updates, journal, or process steps. */
export function getLastUpdatedIso(c: SimulatedCampaign): string | null {
  const candidates: string[] = [];
  if (c.operationalUpdates[0]?.date) candidates.push(c.operationalUpdates[0].date);
  for (const j of c.fieldJournal.slice(0, 3)) {
    if (j.date) candidates.push(j.date);
  }
  for (const p of c.process) {
    if (p.date) candidates.push(p.date);
  }
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.localeCompare(a))[0] ?? null;
}

export function formatDaysAgo(iso: string, locale: string): string {
  const then = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const days = Math.max(0, Math.floor(diffMs / 86_400_000));
  if (locale.startsWith("tr")) {
    if (days === 0) return "bugün";
    if (days === 1) return "1 gün önce";
    return `${days} gün önce`;
  }
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function getExportMarketsLine(c: SimulatedCampaign, max = 3): string {
  if (!c.exportMarkets?.length) return "";
  const slice = c.exportMarkets.slice(0, max);
  const rest = c.exportMarkets.length - slice.length;
  if (rest > 0) return `${slice.join(", ")} +${rest}`;
  return slice.join(", ");
}

export function getProductionType(c: SimulatedCampaign) {
  const firstProcess = c.operations.processes[0];
  if (firstProcess) return firstProcess;
  return c.productionNote.split("(")[0]?.trim() ?? c.sector;
}

export function getSectorTag(c: SimulatedCampaign): string {
  const s = c.sector.toLowerCase();
  if (s.includes("makine") || s.includes("parça") || s.includes("cnc")) return "Makine";
  if (s.includes("tekstil") || s.includes("dokuma") || s.includes("konfeksiyon")) return "Tekstil";
  if (s.includes("gıda") || s.includes("tarım") || s.includes("narenciye")) return "Gıda";
  if (s.includes("lojistik") || s.includes("depolama")) return "Lojistik";
  if (s.includes("kimya") || s.includes("proses")) return "Kimya";
  if (s.includes("metal") || s.includes("döküm")) return "Metal";
  if (s.includes("mobilya") || s.includes("ahşap")) return "Mobilya";
  if (s.includes("otomotiv")) return "Otomotiv";
  if (s.includes("cam") || s.includes("seramik")) return "Cam";
  if (s.includes("ambalaj") || s.includes("plastik")) return "Ambalaj";
  if (s.includes("gemi") || s.includes("deniz")) return "Denizcilik";
  return c.sector.split(/[·,]/)[0]?.trim().slice(0, 12) ?? "Üretim";
}

export function getSectorTagEn(c: SimulatedCampaign): string {
  const tag = getSectorTag(c);
  const map: Record<string, string> = {
    Makine: "Machinery",
    Tekstil: "Textile",
    Gıda: "Food",
    Lojistik: "Logistics",
    Kimya: "Chemicals",
    Metal: "Metal",
    Mobilya: "Furniture",
    Otomotiv: "Automotive",
    Cam: "Glass",
    Ambalaj: "Packaging",
    Denizcilik: "Marine",
  };
  return map[tag] ?? tag;
}
