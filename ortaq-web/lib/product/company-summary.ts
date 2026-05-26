import type { SimulatedCampaign } from "@/lib/campaigns/types";
import type { MediaKey } from "@/lib/media";

/**
 * Campaign → photograph mapping.
 *
 * IMPORTANT — JPG content audit (May 2026):
 * Several files in /public/media/ have content that does NOT match their
 * filename. The mapping below ignores the filename and uses each campaign
 * with the JPG whose ACTUAL visual content fits the sector.
 *
 * Verified file contents:
 *   agrifoodColdchain  → baskets of vegetables           (AGRI)
 *   ceramicKiln        → ceramic vases                   (CERAMIC)
 *   cncWorkshop        → row of sedan cars               (AUTOMOTIVE)  ← filename misleading
 *   factoryDetail      → engineer at laptop, electronics (ELECTRONICS)
 *   factoryFloor       → engineering desk, calipers      (PRECISION / CNC R&D)
 *   foodProcessing     → stainless-steel process pipes   (FOOD / CHEMICAL / MILL)
 *   greenhouse         → soil scoop on workbench         (GARDENING / AGTECH)
 *   logisticsDock      → warehouse interior, racked boxes(LOGISTICS / STORAGE)
 *   machineOperator    → welder with sparks              (METAL / WELDING)
 *   spinningMill       → t-shirts on hangers             (TEXTILE / GARMENT)
 *   warehouse          → welder with sparks              (METAL / WELDING, duplicates machineOperator)
 *
 * Garbage content (DO NOT USE):
 *   chemicalPlant      → hotel-room bed                  (replace file)
 *   grainMill          → suburban porch                  (replace file)
 *
 * Truck-depot duplicates (DO NOT USE — same aerial shot in 4 files):
 *   industrialLine, packagingFloor, textileFloor, shipyardDock
 *
 * Unread / unverified (may also be wrong):
 *   exportWarehouse, glassFurnace, plasticExtrusion
 *
 * The mapping below assigns every campaign to a VERIFIED-CORRECT photo.
 * Some sectors share an image because we currently have ~10 usable photos
 * for 18 campaigns. Sharing is preferable to wrong-content.
 *
 * When user uploads new on-site company photos:
 *   1. Drop the .jpg into /public/media/ with a slug-prefixed name
 *      (e.g. /public/media/companies/karat-parca-konya.jpg)
 *   2. Register the new key in lib/media.ts
 *   3. Point this map at the new key
 */
const campaignMedia: Record<string, MediaKey> = {
  // Agriculture & food
  "adana-tarim-isleme": "agrifoodColdchain",
  "trabzon-findik-isleme": "agrifoodColdchain",
  "antalya-sera-teknoloji": "greenhouse",
  "anatolia-gida-gaziantep": "foodProcessing",
  "trakya-un-edirne": "foodProcessing",

  // Industrial process / chemical
  "marmara-kimya-kocaeli": "foodProcessing",
  "tekirdag-ambalaj-plastik": "foodProcessing",

  // Logistics
  "atlas-lojistik-istanbul": "logisticsDock",

  // Textile / garment
  "demir-tekstil-bursa": "spinningMill",
  "denizli-iplik-dokuma": "spinningMill",

  // Ceramic / glass
  "eskisehir-seramik": "ceramicKiln",
  "anadolu-cam-kayseri": "ceramicKiln",

  // Precision / CNC / wood R&D
  "karat-parca-konya": "factoryFloor",
  "ege-mobilya-izmir": "factoryFloor",

  // Electronics
  "tekno-elektronik-ankara": "factoryDetail",

  // Automotive
  "vizyon-otomotiv-bursa": "cncWorkshop",

  // Metal / welding / shipyard
  "yildiz-dokum-manisa": "machineOperator",
  "deniz-gemi-parca-tuzla": "warehouse",
};

/**
 * Sector-keyword fallback. Only verified-content media keys are referenced.
 * Order matters — more specific matches first.
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
  { test: /mobilya|ahşap|furniture|wood/i, key: "factoryFloor" },
  { test: /otomotiv|automotive/i, key: "cncWorkshop" },
  { test: /makine|parça|cnc|machin/i, key: "factoryFloor" },
  { test: /döküm|dokum|metal|kaynak|gemi|denizcilik|marine|foundry|welding/i, key: "machineOperator" },
];

export function getCampaignMediaKey(slug: string, sector?: string): MediaKey {
  if (campaignMedia[slug]) return campaignMedia[slug];
  if (sector) {
    const match = sectorFallback.find(({ test }) => test.test(sector));
    if (match) return match.key;
  }
  // Last-resort fallback: a verified-content industrial image.
  // factoryFloor (engineering desk) is safer than industrialLine (truck depot).
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
