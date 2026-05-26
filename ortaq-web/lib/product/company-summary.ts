import type { SimulatedCampaign } from "@/lib/campaigns/types";
import type { MediaKey } from "@/lib/media";

/** One unique, sector-matched image per campaign — no duplicates in grid viewport. */
const campaignMedia: Record<string, MediaKey> = {
  "adana-tarim-isleme": "agrifoodColdchain",
  "atlas-lojistik-istanbul": "logisticsDock",
  "karat-parca-konya": "cncWorkshop",
  "anatolia-gida-gaziantep": "packagingFloor",
  "yildiz-dokum-manisa": "industrialLine",
  "vizyon-otomotiv-bursa": "factoryDetail",
  "demir-tekstil-bursa": "textileFloor",
  "marmara-kimya-kocaeli": "chemicalPlant",
  "tekno-elektronik-ankara": "machineOperator",
  "ege-mobilya-izmir": "workshop",
  "deniz-gemi-parca-tuzla": "shipyardDock",
  "anadolu-cam-kayseri": "glassFurnace",
  "trakya-un-edirne": "grainMill",
  "eskisehir-seramik": "ceramicKiln",
  "antalya-sera-teknoloji": "greenhouse",
  "trabzon-findik-isleme": "foodProcessing",
  "denizli-iplik-dokuma": "spinningMill",
  "tekirdag-ambalaj-plastik": "plasticExtrusion",
};

const sectorFallback: { test: RegExp; key: MediaKey }[] = [
  { test: /lojistik|depolama|sevkiyat/i, key: "logisticsDock" },
  { test: /iplik|dokuma|tekstil|konfeksiyon/i, key: "spinningMill" },
  { test: /fındık|un |tahıl|gıda işleme/i, key: "foodProcessing" },
  { test: /gıda|tarım|narenciye|sera|seracılık/i, key: "agrifoodColdchain" },
  { test: /seramik|refrakter|döküm|dokum|cam/i, key: "ceramicKiln" },
  { test: /ambalaj|plastik|folyo/i, key: "plasticExtrusion" },
  { test: /kimya|proses|reçine/i, key: "chemicalPlant" },
  { test: /gemi|denizcilik/i, key: "shipyardDock" },
  { test: /elektronik|montaj|kablolama/i, key: "machineOperator" },
  { test: /mobilya|ahşap/i, key: "workshop" },
  { test: /otomotiv|makine|parça|cnc/i, key: "cncWorkshop" },
  { test: /metal|üretim/i, key: "industrialLine" },
];

export function getCampaignMediaKey(slug: string, sector?: string): MediaKey {
  if (campaignMedia[slug]) return campaignMedia[slug];
  if (sector) {
    const match = sectorFallback.find(({ test }) => test.test(sector));
    if (match) return match.key;
  }
  return "factoryFloor";
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

/** Verify no duplicate media keys across visible catalog (dev aid). */
export function assertUniqueCampaignMedia(slugs: string[]): boolean {
  const keys = slugs.map((s) => campaignMedia[s]).filter(Boolean);
  return keys.length === new Set(keys).size;
}
