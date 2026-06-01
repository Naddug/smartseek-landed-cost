// Mock veri katmanı (prototip). Backend/DB yok; yalnızca tıklanabilir ürün için.

export type MatchFit = "strong" | "partial" | "weak";

export type Manufacturer = {
  id: string;
  name: string;
  city: string;
  sector: string;
  markets: string[];
  revenue: string;
  growth: string;
  need: string;
  use: string;
  signals: { label: string; verified: boolean }[];
  gaps: string[];
  summary: string;
  attentionNow: string;
  stage: "new" | "verifying" | "ready" | "engaged";
};

export type CapitalPartner = {
  id: string;
  name: string;
  type: string;
  thesis: {
    sectors: string[];
    markets: string[];
    ticket: string;
    note: string;
  };
};

export const MANUFACTURERS: Manufacturer[] = [
  {
    id: "karat-parca-konya", name: "Karat Parça Makina", city: "Konya", sector: "Makine imalatı",
    markets: ["AB", "Körfez"], revenue: "≈ 90M TL", growth: "%34 / yıl", need: "1.2M USD", use: "Kapasite artırımı, yeni CNC hattı",
    signals: [
      { label: "İhracat kaydı", verified: true }, { label: "Üretim kapasitesi", verified: true },
      { label: "Tekrar eden alıcı talebi", verified: true }, { label: "Finansal tablolar", verified: false },
    ],
    gaps: ["Son 2 yıl bağımsız denetim raporu", "Tedarik sözleşmeleri dijital arşivi"],
    summary: "AB ve Körfez'den tekrar eden ihracat siparişleri alıyor; ≈90M TL ciro, %34 büyüme. Mevcut CNC hattı dolu; yeni kontratlar reddediliyor. 1.2M USD yeni hat yatırımı bekleyen siparişleri teslim etmeyi ve büyümeyi sürdürmeyi açar.",
    attentionNow: "Sipariş defteri kapasite tavanında; her ay reddedilen kontratlar birikiyor. Alıcılar alternatif tedarikçiye kayıyor.",
    stage: "ready",
  },
  {
    id: "demir-tekstil-bursa", name: "Demir Tekstil", city: "Bursa", sector: "Tekstil",
    markets: ["AB"], revenue: "≈ 140M TL", growth: "%21 / yıl", need: "800K USD", use: "Yeni pazar girişi, numune kapasitesi",
    signals: [
      { label: "İhracat kaydı", verified: true }, { label: "Üretim kapasitesi", verified: true },
      { label: "Belge seti", verified: true }, { label: "Tekrar eden alıcı talebi", verified: false },
    ],
    gaps: ["Yeni pazar talep doğrulaması", "Marj iyileştirme planı"],
    summary: "AB'ye istikrarlı dokuma ihracatı yapıyor; ≈140M TL ciro, %21 büyüme. Numune hattı yok; Doğu Avrupa RFQ'larına teklif veremiyor. 800K USD numune ve sertifikasyon hattı yeni pazarlara girişi ve gelen talepleri karşılamayı açar.",
    attentionNow: "Doğu Avrupa alıcılarından RFQ'lar geliyor; numune üretemediği için teklif veremiyor. Rakipler numune gönderiyor.",
    stage: "ready",
  },
  {
    id: "anadolu-cam-kayseri", name: "Anadolu Cam", city: "Kayseri", sector: "Cam ve refrakter",
    markets: ["AB", "Kuzey Afrika"], revenue: "≈ 210M TL", growth: "%28 / yıl", need: "1.5M USD", use: "Fırın yenileme, enerji verimliliği",
    signals: [
      { label: "İhracat kaydı", verified: true }, { label: "Üretim kapasitesi", verified: true },
      { label: "Finansal tablolar", verified: true }, { label: "Belge seti", verified: true },
    ],
    gaps: ["Karbon ayak izi raporu"],
    summary: "AB ve Kuzey Afrika'ya düzenli ihracat; ≈210M TL ciro, %28 büyüme. Eski fırın enerji maliyetini yükseltiyor, marj eriyor. 1.5M USD fırın yenileme birim maliyeti düşürmeyi ve bir sonraki AB alıcı turunda rekabet etmeyi açar.",
    attentionNow: "Enerji faturası marjı eritiyor; fırın yenileme ertelenirse fiyat turunda dışarıda kalabilir.",
    stage: "ready",
  },
  {
    id: "ege-mobilya-izmir", name: "Ege Mobilya", city: "İzmir", sector: "Mobilya",
    markets: ["AB", "Körfez"], revenue: "≈ 60M TL", growth: "%41 / yıl", need: "500K USD", use: "İhracat deposu, e-ihracat altyapısı",
    signals: [
      { label: "İhracat kaydı", verified: true }, { label: "Tekrar eden alıcı talebi", verified: true },
      { label: "Üretim kapasitesi", verified: false }, { label: "Finansal tablolar", verified: false },
    ],
    gaps: ["Kapasite doğrulaması", "Resmi finansal tablolar", "Belge seti"],
    summary: "Online kanallardan gelen ihracat siparişleri hızla büyüyor; ≈60M TL ciro, %41 büyüme. Depo ve e-ihracat altyapısı talebi karşılayamıyor, siparişler reddediliyor. 500K USD altyapı yatırımı reddedilen siparişleri kabul etmeyi ve büyümeyi sürdürmeyi açar.",
    attentionNow: "Her ay yeni siparişler reddediliyor; altyapı yatırımı olmadan büyüme duracak.",
    stage: "verifying",
  },
  {
    id: "marmara-kimya-kocaeli", name: "Marmara Kimya", city: "Kocaeli", sector: "Kimya",
    markets: ["AB", "Körfez", "Asya"], revenue: "≈ 320M TL", growth: "%19 / yıl", need: "2M USD", use: "Yeni üretim hattı, kapasite",
    signals: [
      { label: "İhracat kaydı", verified: true }, { label: "Üretim kapasitesi", verified: true },
      { label: "Finansal tablolar", verified: true }, { label: "Belge seti", verified: true },
    ],
    gaps: ["Çevre uyum güncellemesi"],
    summary: "AB, Körfez ve Asya'ya istikrarlı ihracat; ≈320M TL ciro, %19 büyüme. Mevcut üretim hattı dolu, siparişler sıraya alınıyor. 2M USD yeni hat yatırımı bekleyen çok pazarlı kontratları karşılamayı ve teslimat süresini kısaltmayı açar.",
    attentionNow: "Bekleyen siparişler birikiyor; hat yatırımı olmadan teslimat süreleri uzayacak ve alıcılar alternatif arayacak.",
    stage: "ready",
  },
  {
    id: "trabzon-findik-isleme", name: "Trabzon Fındık İşleme", city: "Trabzon", sector: "Gıda işleme",
    markets: ["AB"], revenue: "≈ 110M TL", growth: "%26 / yıl", need: "700K USD", use: "Soğuk zincir, paketleme",
    signals: [
      { label: "İhracat kaydı", verified: true }, { label: "Belge seti", verified: true },
      { label: "Üretim kapasitesi", verified: true }, { label: "Finansal tablolar", verified: false },
    ],
    gaps: ["Bağımsız denetim", "Soğuk zincir sertifikası"],
    summary: "AB'ye fındık ihracatı yapıyor; ≈110M TL ciro, %26 büyüme. Hammadde satışı marjı sınırlıyor; AB alıcıları paketli ve sertifikalı ürün istiyor. 700K USD soğuk zincir ve paketleme hattı katma değerli satışı ve yeni AB kontratlarını açar.",
    attentionNow: "AB alıcıları paketli ve sertifikalı ürün şartı koyuyor; soğuk zincir olmadan yeni kontrat imzalanamaz.",
    stage: "ready",
  },
];

export const CURRENT_PARTNER: CapitalPartner = {
  id: "cp-1", name: "Anatolia Growth Partners", type: "Büyüme fonu · nitelikli sermaye",
  thesis: {
    sectors: ["Makine imalatı", "Kimya", "Cam ve refrakter"],
    markets: ["AB", "Körfez"],
    ticket: "0,5M ile 2M USD",
    note: "İhracatı kanıtlanmış, kapasite darboğazı olan üreticiler.",
  },
};

const FIT_ORDER: Record<MatchFit, number> = { strong: 0, partial: 1, weak: 2 };

export function matchFit(m: Manufacturer, p: CapitalPartner): { fit: MatchFit; reasons: string[]; whyNow: string } {
  const reasons: string[] = [];
  let weight = 0;
  if (p.thesis.sectors.includes(m.sector)) { weight += 2; reasons.push(`${m.sector}: tez sektörünüzle örtüşüyor`); }
  if (m.markets.some((x) => p.thesis.markets.includes(x))) {
    weight += 1;
    reasons.push(`Hedef pazarlarınız: ${m.markets.filter((x) => p.thesis.markets.includes(x)).join(", ")}`);
  }
  if (m.stage === "ready") { weight += 1; reasons.push("Kapasite darboğazı; ihracat kanıtı mevcut"); }
  if (reasons.length === 0) reasons.push("Sektör veya pazar tezinizle sınırlı örtüşme");
  const fit: MatchFit = weight >= 3 ? "strong" : weight >= 1 ? "partial" : "weak";
  return { fit, reasons, whyNow: m.attentionNow };
}

export function fitSortKey(fit: MatchFit) {
  return FIT_ORDER[fit];
}

export function companyPitch(m: Manufacturer) {
  return `${m.city} · ${m.sector} · ${m.revenue} · ${m.growth} büyüme`;
}

export function capitalAsk(m: Manufacturer) {
  return `${m.need} · ${m.use}`;
}

export function introGateLine(m: Manufacturer) {
  if (m.stage === "verifying") return "Belge incelemesi sürüyor; karşılıklı tanıştırma henüz açık değil.";
  if (m.stage === "ready") return "Zorunlu belgeler dosyalandı; karşılıklı tanıştırma mümkün.";
  return "Profil tamamlanıyor.";
}

export function openQuestion(m: Manufacturer) {
  if (m.gaps.length === 0) return "Marj yapısı ve müşteri konsantrasyonu görüşmede netleşecek.";
  return `Görüşmede netleştirilecek: ${m.gaps.join("; ")}.`;
}

export function getManufacturer(id: string) {
  return MANUFACTURERS.find((m) => m.id === id);
}
