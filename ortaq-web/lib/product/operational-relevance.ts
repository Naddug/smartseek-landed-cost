import type { SimulatedCampaign } from "@/lib/campaigns/types";

/**
 * Situation line for cards and headers: reveals what is changing, not what the company "is".
 */
export const OPERATIONAL_RELEVANCE: Record<string, string> = {
  "karat-parca-konya":
    "Avrupa siparişleri nedeniyle ikinci vardiya değerlendiriliyor.",
  "anatolia-gida-gaziantep":
    "Orta Doğu çerçeve sözleşmeleri paketleme hattını zorluyor.",
  "yildiz-dokum-manisa":
    "Almanya OEM programı pres hatlarında tam doluluk yaratıyor.",
  "demir-tekstil-bursa":
    "Güney Avrupa numune talepleri dokuma planını yeniden sıralıyor.",
  "adana-tarim-isleme":
    "Hasat döneminde kapasite kullanımı kritik seviyelere ulaşıyor.",
  "atlas-lojistik-istanbul":
    "Yeni ihracat koridorları operasyon planını değiştiriyor.",
  "trakya-un-edirne":
    "Sınır ötesi talep silo doluluğunu sürekli yüksek tutuyor.",
  "antalya-sera-teknoloji":
    "Rusya sevkiyat penceresi paketleme kuyruğunu uzatıyor.",
  "vizyon-otomotiv-bursa":
    "Almanya OEM pres kuyruğu beş haftayı aştı.",
  "marmara-kimya-kocaeli":
    "Irak batch siparişleri reaktör planını sıkıştırıyor.",
  "tekno-elektronik-ankara":
    "Savunma montaj kuyruğu teslim takvimini geriye itiyor.",
  "eskisehir-seramik":
    "Romanya sipariş artışı fırın çıkışını zorluyor.",
  "trabzon-findik-isleme":
    "Avrupa kavurma talebi sezon öncesi hattı doldurdu.",
  "denizli-iplik-dokuma":
    "İtalya iplik siparişleri ring doluluğunu yükseltti.",
  "tekirdag-ambalaj-plastik":
    "AB ambalaj kuralları üretim karışımını yeniden tanımlıyor.",
  "ege-mobilya-izmir":
    "Almanya numune baskısı CNC önceliğini değiştiriyor.",
  "deniz-gemi-parca-tuzla":
    "Norveç tersane programı kaynak takvimini belirliyor.",
  "anadolu-cam-kayseri":
    "Irak cephe projeleri lamine teslim süresini uzatıyor.",
};

const BLOCKED = /yatırım|fonlama|getiri|sermaye|pay oran|raise|ortaklık teklif|komite onay|yatırımı|fon/i;

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

  const bottleneck = c.bottlenecks[0];
  if (bottleneck?.note) {
    const line = sanitize(bottleneck.note);
    if (line) return line;
  }

  return null;
}

export function getOperationalRelevanceLine(c: SimulatedCampaign): string {
  const curated = OPERATIONAL_RELEVANCE[c.slug];
  if (curated) return curated;
  return deriveFromCampaign(c) ?? "Operasyon kayıtlarında yeni hareket var.";
}
