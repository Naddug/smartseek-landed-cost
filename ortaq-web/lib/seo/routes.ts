/**
 * ORTAQ route registry, SEO, sitemap, internal linking SSOT.
 * Legacy crowdfunding routes marked `live: false` — noindex, excluded from sitemap.
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
    title: "ORTAQ | Üretici şirketler",
    description:
      "Türkiye'deki üretici şirketler: güncel kapasite, ihracat ve saha notları. Okuma ve tanışma altyapısı.",
    cluster: "core",
    intent: "informational",
    priority: 1,
    changeFrequency: "weekly",
    live: true,
    keywords: [
      "sermaye erişimi",
      "ihracatçı üretici",
      "belge inceleme",
      "karşılıklı tanıştırma",
      "görüşme odası",
      "doğrulanmış profil",
    ],
  },
  {
    key: "kesfet",
    path: "/kesfet",
    title: "Şirketler | ORTAQ",
    description:
      "Üretici şirket listesi: sektöre göre süzün, kapasite ve ihracat bilgisine bakın.",
    cluster: "campaign",
    intent: "navigational",
    priority: 0.95,
    changeFrequency: "weekly",
    live: true,
    keywords: ["şirket keşfi", "üretici profili", "ihracatçı üretici", "özel piyasa araştırma"],
  },
  {
    key: "nasil-calisir",
    path: "/nasil-calisir",
    title: "Nasıl çalışır? | ORTAQ",
    description:
      "Belgeler, kanıt incelemesi, keşfedilebilir profil, keşif, karşılıklı tanıştırma ve görüşme odası. ORTAQ kanıt ve tanıştırma katmanıdır; para tutmaz.",
    cluster: "education",
    intent: "informational",
    priority: 0.9,
    changeFrequency: "monthly",
    live: true,
    keywords: ["sermaye erişimi süreci", "belge inceleme", "karşılıklı tanıştırma"],
  },
  {
    key: "ekip",
    path: "/ekip",
    title: "Ekip | ORTAQ",
    description:
      "ORTAQ kurucu ekibi: ihracat, uluslararası satış ve sınır ötesi ticaret operasyonlarından gelen operatörler.",
    cluster: "trust",
    intent: "informational",
    priority: 0.72,
    changeFrequency: "monthly",
    live: true,
    keywords: ["kurucu ekip", "ihracat deneyimi", "ORTAQ ekibi"],
  },
  {
    key: "guven",
    path: "/guven",
    title: "Güven ve uyum | ORTAQ",
    description:
      "ORTAQ para tutmaz, yatırım satmaz, tavsiye vermez. Kanıt düzenleme, keşif ve nitelikli tanıştırma katmanı. Kanıtlayamadığımızı yazmıyoruz.",
    cluster: "trust",
    intent: "informational",
    priority: 0.85,
    changeFrequency: "monthly",
    live: true,
    keywords: ["bağımsız doğrulama", "uyum", "şeffaflık"],
  },
  {
    key: "riskler",
    path: "/riskler",
    title: "Riskler ve sınırlar | ORTAQ",
    description:
      "Erişim ve tanıştırma sonucu garanti etmez; incelenmiş belgeler tüm soruları kapatmaz; ORTAQ para tutmaz, tavsiye vermez. Karar öncesi okuyun.",
    cluster: "risk",
    intent: "informational",
    priority: 0.85,
    changeFrequency: "monthly",
    live: true,
    keywords: ["erişim riskleri", "sonuç garantisi yok", "sınırlar"],
  },
  {
    key: "sss",
    path: "/sss",
    title: "Sık sorulan sorular | ORTAQ",
    description:
      "ORTAQ nedir, hangi belgeler gerekir, karşılıklı tanıştırma ve görüşme odası nasıl çalışır. Kanıt düzenleme ve nitelikli tanıştırma; yatırım tavsiyesi değildir.",
    cluster: "education",
    intent: "informational",
    priority: 0.8,
    changeFrequency: "monthly",
    live: true,
    keywords: [
      "sermaye erişimi",
      "ihracatçı üretici",
      "belge inceleme",
      "karşılıklı tanıştırma",
      "görüşme odası",
    ],
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
    key: "degerlendirme",
    path: "/degerlendirme",
    title: "Belge incelemesi | ORTAQ",
    description:
      "Üreticilerden toplanan belgeler nasıl dosyalanır ve incelenir: ön eleme, operasyon, hukuk, finans ve kurucu görüşmesi. Skor verilmez; kanıt düzenlenir.",
    cluster: "trust",
    intent: "informational",
    priority: 0.75,
    changeFrequency: "monthly",
    live: true,
    keywords: ["belge inceleme", "kanıt değerlendirme", "doğrulama süreci"],
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
    description: "ORTAQ kullanım koşulları ve platform rolü.",
    cluster: "legal",
    intent: "navigational",
    priority: 0.3,
    changeFrequency: "yearly",
    live: true,
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
  | "kesfet"
  | "nasilCalisir"
  | "ekip"
  | "guven"
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
  kesfet: "kesfet",
  nasilCalisir: "nasil-calisir",
  ekip: "ekip",
  guven: "guven",
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
