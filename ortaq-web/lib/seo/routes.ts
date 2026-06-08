/**
 * ORTAQ route registry, SEO, sitemap, internal linking SSOT.
 * Legacy trade-ops and crowdfunding routes marked `live: false`.
 */

export type SeoCluster =
  | "core"
  | "education"
  | "trust"
  | "risk"
  | "legal"
  | "campaign"
  | "glossary";

export type SearchIntent =
  | "informational"
  | "navigational"
  | "commercial"
  | "transactional";

export type RouteSeoConfig = {
  key: string;
  path: string;
  title: string;
  description: string;
  cluster: SeoCluster;
  intent: SearchIntent;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  live: boolean;
  keywords: string[];
};

export const SEO_ROUTES: RouteSeoConfig[] = [
  {
    key: "home",
    path: "/",
    title: "ORTAQ | Kendi ürün hattınızı başlatın",
    description:
      "ORTAQ kaynaklar, üretir ve teslim eder. Özel marka ürün programları için tek sorumlu ortak.",
    cluster: "core",
    intent: "informational",
    priority: 1,
    changeFrequency: "weekly",
    live: true,
    keywords: [
      "özel marka ürün",
      "kaynaklama",
      "üretim yönetimi",
      "ihracat teslimat",
      "private label",
      "Türkiye üretim",
    ],
  },
  {
    key: "teklif",
    path: "/teklif",
    title: "Teklif Alın | ORTAQ",
    description:
      "Ürün programınız için teklif talep edin. Ne başlatmak istediğinizi ve nerede sattığınızı paylaşın; uygunluk ve maliyet aralığı alın.",
    cluster: "core",
    intent: "transactional",
    priority: 0.95,
    changeFrequency: "weekly",
    live: true,
    keywords: ["teklif", "özel marka", "kaynaklama teklifi", "üretim programı"],
  },
  {
    key: "ne-yapiyoruz",
    path: "/ne-yapiyoruz",
    title: "Ne Yapıyoruz | ORTAQ",
    description:
      "ORTAQ kaynaklama, üretim yönetimi ve teslimat sürecini tek elden yürütür. Aktif kategori ve yol haritası.",
    cluster: "education",
    intent: "informational",
    priority: 0.9,
    changeFrequency: "monthly",
    live: true,
    keywords: ["kaynaklama operatörü", "üretim yönetimi", "teslimat"],
  },
  {
    key: "nasil-calisir",
    path: "/nasil-calisir",
    title: "Nasıl çalışır? | ORTAQ",
    description:
      "Fabrika kaynağından teslimata: ürün spesifikasyonu, numune onayı, üretim takibi, ihracat ve deponuza teslim — tek ortakta.",
    cluster: "education",
    intent: "informational",
    priority: 0.9,
    changeFrequency: "monthly",
    live: true,
    keywords: ["kaynaklama süreci", "numune onayı", "üretim takibi", "ihracat teslimat"],
  },
  {
    key: "neden-ortaq",
    path: "/neden-ortaq",
    title: "Neden ORTAQ | ORTAQ",
    description:
      "Kendi ürün hattını fabrika işletmeden başlatmak isteyenler için tek sorumlu ortak. Neden ORTAQ ve ne yapmaz.",
    cluster: "trust",
    intent: "informational",
    priority: 0.85,
    changeFrequency: "monthly",
    live: true,
    keywords: ["neden ORTAQ", "kaynaklama ortağı", "özel marka operatör"],
  },
  {
    key: "sss",
    path: "/sss",
    title: "Sık sorulan sorular | ORTAQ",
    description:
      "Kaynaklama, üretim ve teslimat hakkında sık sorulan sorular. Kimler için, süreç, fiyat ve güven.",
    cluster: "education",
    intent: "informational",
    priority: 0.8,
    changeFrequency: "monthly",
    live: true,
    keywords: ["ORTAQ SSS", "kaynaklama soruları", "özel marka üretim"],
  },
  {
    key: "guven",
    path: "/guven",
    title: "Güven ve uyum | ORTAQ",
    description:
      "ORTAQ para tutmaz, yatırım satmaz, tavsiye vermez. Kaynaklama ve üretim operatörü olarak çalışır.",
    cluster: "trust",
    intent: "informational",
    priority: 0.75,
    changeFrequency: "monthly",
    live: true,
    keywords: ["güven", "uyum", "şeffaflık"],
  },
  {
    key: "how-sampling-works",
    path: "/how-sampling-works",
    title: "Numune süreci nasıl işler? | ORTAQ",
    description:
      "Numune koordinasyonu, onay süreci ve üretime geçiş öncesi kontrol. Gerçek ürünü onaylamadan üretime başlanmaz.",
    cluster: "trust",
    intent: "informational",
    priority: 0.74,
    changeFrequency: "monthly",
    live: true,
    keywords: ["numune onayı", "ürün numunesi", "ambalaj onayı"],
  },
  {
    key: "quality-control",
    path: "/quality-control",
    title: "Kalite kontrolü | ORTAQ",
    description:
      "Kilit referans, parti kontrolü ve sevkiyat öncesi inceleme. Süreç şeffaflığı; garanti iddiası yok.",
    cluster: "trust",
    intent: "informational",
    priority: 0.74,
    changeFrequency: "monthly",
    live: true,
    keywords: ["kalite kontrolü", "parti kontrolü", "sevkiyat öncesi inceleme"],
  },
  {
    key: "payment-protection",
    path: "/payment-protection",
    title: "Ödeme koruması | ORTAQ",
    description:
      "Kilometre taşı ödemeleri, inceleme kontrol noktaları, belge akışı ve isteğe bağlı akreditif desteği.",
    cluster: "trust",
    intent: "informational",
    priority: 0.74,
    changeFrequency: "monthly",
    live: true,
    keywords: ["kilometre taşı ödeme", "ödeme koruması", "akreditif"],
  },
  {
    key: "why-not-direct-factory",
    path: "/why-not-direct-factory",
    title: "Neden doğrudan fabrika değil? | ORTAQ",
    description:
      "Fabrika arama, MOQ pazarlığı, iletişim boşlukları, spesifikasyon kayması, kalite anlaşmazlıkları ve lojistik koordinasyonu.",
    cluster: "trust",
    intent: "informational",
    priority: 0.73,
    changeFrequency: "monthly",
    live: true,
    keywords: ["doğrudan fabrika", "MOQ", "kaynaklama operatörü"],
  },
  {
    key: "launch-timeline",
    path: "/launch-timeline",
    title: "Lansman zaman çizelgesi | ORTAQ",
    description:
      "Brief'ten teslimata: kaynaklama, numune, üretim, sevkiyat ve deponuza teslim. Süre ürün ve pazara göre değişir.",
    cluster: "trust",
    intent: "informational",
    priority: 0.73,
    changeFrequency: "monthly",
    live: true,
    keywords: ["lansman süreci", "teslimat zamanlaması", "özel marka programı"],
  },
  {
    key: "ekip",
    path: "/ekip",
    title: "Ekip | ORTAQ",
    description:
      "ORTAQ ekibi: LEGO Group, Petlas ve Yiğit Akü geçmişine sahip kaynaklama ve üretim operatörleri.",
    cluster: "trust",
    intent: "informational",
    priority: 0.72,
    changeFrequency: "monthly",
    live: true,
    keywords: ["ORTAQ ekibi", "kaynaklama deneyimi"],
  },
  {
    key: "gizlilik",
    path: "/gizlilik",
    title: "Gizlilik | ORTAQ",
    description: "KVKK kapsamında kişisel verilerin işlenmesi.",
    cluster: "legal",
    intent: "navigational",
    priority: 0.3,
    changeFrequency: "yearly",
    live: true,
    keywords: [],
  },
  {
    key: "kullanim",
    path: "/kullanim",
    title: "Kullanım koşulları | ORTAQ",
    description: "ORTAQ kullanım koşulları.",
    cluster: "legal",
    intent: "navigational",
    priority: 0.3,
    changeFrequency: "yearly",
    live: true,
    keywords: [],
  },
  {
    key: "kesfet",
    path: "/kesfet",
    title: "Şirketler | ORTAQ",
    description: "Eski keşif sayfası. Yayından kaldırıldı.",
    cluster: "campaign",
    intent: "navigational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "investors",
    path: "/investors",
    title: "Yatırımcılar | ORTAQ",
    description: "Eski yatırımcı sayfası. Yayından kaldırıldı.",
    cluster: "trust",
    intent: "informational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "riskler",
    path: "/riskler",
    title: "Riskler ve sınırlar | ORTAQ",
    description: "Eski risk sayfası. Yayından kaldırıldı.",
    cluster: "risk",
    intent: "informational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "degerlendirme",
    path: "/degerlendirme",
    title: "Belge incelemesi | ORTAQ",
    description: "Eski belge inceleme sayfası. Yayından kaldırıldı.",
    cluster: "trust",
    intent: "informational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "sozluk",
    path: "/sozluk",
    title: "Sözlük | ORTAQ",
    description: "Eski ürün sözlüğü. Yayından kaldırıldı.",
    cluster: "glossary",
    intent: "informational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "basla",
    path: "/basla",
    title: "Başla | ORTAQ",
    description: "Eski onboarding sayfası. Yayından kaldırıldı.",
    cluster: "education",
    intent: "informational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "sirketler",
    path: "/sirketler",
    title: "Şirketler | ORTAQ",
    description: "Eski kampanya listesi. Yayından kaldırıldı.",
    cluster: "campaign",
    intent: "informational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
  {
    key: "sirket-ornek",
    path: "/sirket/ornek",
    title: "Örnek kampanya | ORTAQ",
    description: "Eski örnek dosya. Yayından kaldırıldı.",
    cluster: "campaign",
    intent: "navigational",
    priority: 0.1,
    changeFrequency: "yearly",
    live: false,
    keywords: [],
  },
];

export function getRouteByKey(key: string): RouteSeoConfig | undefined {
  return SEO_ROUTES.find((r) => r.key === key);
}

export function getRouteByPath(path: string): RouteSeoConfig | undefined {
  return SEO_ROUTES.find((r) => r.path === path);
}

export function getLiveSitemapRoutes(): RouteSeoConfig[] {
  return SEO_ROUTES.filter((r) => r.live);
}

export type RouteKey =
  | "home"
  | "teklif"
  | "neYapiyoruz"
  | "nasilCalisir"
  | "nedenOrtaq"
  | "kesfet"
  | "investors"
  | "ekip"
  | "guven"
  | "howSamplingWorks"
  | "qualityControl"
  | "paymentProtection"
  | "whyNotDirectFactory"
  | "launchTimeline"
  | "degerlendirme"
  | "riskler"
  | "sss"
  | "sozluk"
  | "basla"
  | "sirketler"
  | "sirketOrnek"
  | "gizlilik"
  | "kullanim";

export const ROUTE_KEY_MAP: Record<RouteKey, string> = {
  home: "home",
  teklif: "teklif",
  neYapiyoruz: "ne-yapiyoruz",
  nasilCalisir: "nasil-calisir",
  nedenOrtaq: "neden-ortaq",
  kesfet: "kesfet",
  investors: "investors",
  ekip: "ekip",
  guven: "guven",
  howSamplingWorks: "how-sampling-works",
  qualityControl: "quality-control",
  paymentProtection: "payment-protection",
  whyNotDirectFactory: "why-not-direct-factory",
  launchTimeline: "launch-timeline",
  degerlendirme: "degerlendirme",
  riskler: "riskler",
  sss: "sss",
  sozluk: "sozluk",
  basla: "basla",
  sirketler: "sirketler",
  sirketOrnek: "sirket-ornek",
  gizlilik: "gizlilik",
  kullanim: "kullanim",
};
