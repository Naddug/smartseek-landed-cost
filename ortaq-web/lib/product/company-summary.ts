import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { media, companyMedia, type MediaAsset, type MediaKey } from "@/lib/media";

/**
 * Campaign → sector fallback for unknown slugs.
 * Published campaigns use unique files in /media/companies/{slug}.jpg.
 */
// Sector fallback uses only verified-content media keys. Files known to carry
// wrong-content stock (chemicalPlant, plasticExtrusion, industrialLine,
// textileFloor) are not referenced here until those JPGs are replaced.
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

/** Resolved image asset for a campaign card or dossier header. */
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

export function getProductionType(c: SimulatedCampaign) {
  const firstProcess = c.operations.processes[0];
  if (firstProcess) return firstProcess;
  return c.productionNote.split("(")[0]?.trim() ?? c.sector;
}

export function getSectorTag(c: SimulatedCampaign): string {
  const s = c.sector.toLowerCase();
  if (s.includes("lojistik") || s.includes("depolama")) return "LOJİSTİK";
  if (s.includes("makine") || s.includes("parça") || s.includes("cnc") || s.includes("otomotiv")) return "ÜRETİM";
  if (s.includes("tekstil") || s.includes("iplik")) return "TEKSTİL";
  if (s.includes("gıda") || s.includes("tarım") || s.includes("fındık") || s.includes("un ")) return "GIDA";
  if (s.includes("metal") || s.includes("döküm") || s.includes("cam") || s.includes("seramik")) return "METAL";
  if (s.includes("kimya")) return "KİMYA";
  if (s.includes("elektronik")) return "ELEKTRONİK";
  if (s.includes("mobilya") || s.includes("ahşap")) return "MOBİLYA";
  if (s.includes("gemi") || s.includes("deniz")) return "DENİZCİLİK";
  if (s.includes("ambalaj") || s.includes("plastik")) return "AMBALAJ";
  if (s.includes("sera") || s.includes("seracılık")) return "TARIM";
  return "SANAYİ";
}

export function getSectorTagEn(c: SimulatedCampaign): string {
  const s = c.sector.toLowerCase();
  if (s.includes("logistic") || s.includes("lojistik") || s.includes("depolama")) return "LOGISTICS";
  if (s.includes("machin") || s.includes("parts") || s.includes("cnc") || s.includes("makine") || s.includes("parça") || s.includes("otomotiv")) return "MFG";
  if (s.includes("textile") || s.includes("tekstil") || s.includes("iplik") || s.includes("dokuma")) return "TEXTILE";
  if (s.includes("food") || s.includes("agri") || s.includes("gıda") || s.includes("tarım") || s.includes("hazelnut") || s.includes("fındık")) return "FOOD";
  if (s.includes("metal") || s.includes("döküm") || s.includes("dokum") || s.includes("cam") || s.includes("ceramic") || s.includes("seramik")) return "METAL";
  if (s.includes("kimya") || s.includes("chemical")) return "CHEMICAL";
  if (s.includes("elektronik") || s.includes("electronic")) return "ELECTRONICS";
  if (s.includes("mobilya") || s.includes("furniture") || s.includes("ahşap")) return "FURNITURE";
  if (s.includes("gemi") || s.includes("deniz") || s.includes("marine")) return "MARINE";
  if (s.includes("ambalaj") || s.includes("plastik") || s.includes("packaging")) return "PACKAGING";
  if (s.includes("sera") || s.includes("greenhouse")) return "AGTECH";
  return "INDUSTRY";
}
