import type { SimulatedCampaign } from "@/lib/campaigns/types";

/**
 * One line per company: what changed recently, in plain Turkish.
 */
export const OPERATIONAL_RELEVANCE: Record<string, string> = {
  "karat-parca-konya":
    "Avrupa siparişleri artınca mevcut hat yetmiyor; ikinci vardiya değerlendiriliyor.",
  "anatolia-gida-gaziantep":
    "Orta Doğu siparişleri paketleme hattını zorluyor.",
  "yildiz-dokum-manisa":
    "Almanya OEM programı pres hatlarında tam doluluk oluşturuyor.",
  "demir-tekstil-bursa":
    "Güney Avrupa için yeni numune talepleri geliyor.",
  "adana-tarim-isleme":
    "Hasat döneminde soğuk depo doluyor; sevkiyat sırası uzuyor.",
  "atlas-lojistik-istanbul":
    "Avrupa ihracatı depo doluluk oranını yükseltiyor.",
  "trakya-un-edirne":
    "Sınır ötesi talep siloları sürekli yüksek tutuyor.",
  "antalya-sera-teknoloji":
    "İhracat domatesi paketleme kuyruğunu uzatıyor.",
  "vizyon-otomotiv-bursa":
    "Almanya OEM siparişleri pres kuyruğunu doldurdu.",
  "marmara-kimya-kocaeli":
    "Irak siparişleri üretim planını sıkıştırıyor.",
  "tekno-elektronik-ankara":
    "Savunma montaj siparişleri teslim süresini uzatıyor.",
  "eskisehir-seramik":
    "Romanya siparişleri fırın kapasitesine bindiriyor.",
  "trabzon-findik-isleme":
    "Avrupa talebi kavurma hattını yoğun kullanıyor.",
  "denizli-iplik-dokuma":
    "İtalya siparişleri ring hat doluluğunu artırdı.",
  "tekirdag-ambalaj-plastik":
    "AB ambalaj kuralları üretim planını değiştiriyor.",
  "ege-mobilya-izmir":
    "Almanya numune talepleri CNC sırasını uzatıyor.",
  "deniz-gemi-parca-tuzla":
    "Norveç tersane işi kaynak takvimini belirliyor.",
  "anadolu-cam-kayseri":
    "Irak cephe işleri lamine teslim süresini uzatıyor.",
};

const BLOCKED = /yatırım|fonlama|getiri|sermaye|pay oran|raise|hisse|menkul/i;

function sanitize(line: string): string | null {
  const trimmed = line.replace(/\s+/g, " ").trim();
  if (!trimmed || BLOCKED.test(trimmed)) return null;
  if (trimmed.length > 110) return `${trimmed.slice(0, 107)}…`;
  return trimmed;
}

function deriveFromCampaign(c: SimulatedCampaign): string | null {
  const journal = c.fieldJournal[0]?.text;
  if (journal) {
    const line = sanitize(journal);
    if (line) return line;
  }

  const exportFriction = c.operationalFriction.find((f) => f.category === "export");
  if (exportFriction?.note) {
    const line = sanitize(exportFriction.note);
    if (line) return line;
  }

  const bottleneck = c.bottlenecks[0]?.note;
  if (bottleneck) {
    const line = sanitize(bottleneck);
    if (line) return line;
  }

  return null;
}

export function getOperationalRelevanceLine(c: SimulatedCampaign): string {
  const curated = OPERATIONAL_RELEVANCE[c.slug];
  if (curated) return curated;
  return deriveFromCampaign(c) ?? "Son günlerde operasyon kaydı güncellendi.";
}
