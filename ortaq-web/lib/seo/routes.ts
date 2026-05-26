/**
 * ORTAQ route registry — SEO, sitemap, internal linking SSOT.
 * Phase 2 routes marked `live: false` until content ships.
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
  /** Sitemap priority 0–1 */
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Include in sitemap when live */
  live: boolean;
  /** Primary Turkish keywords (internal reference, not meta keywords spam) */
  keywords: string[];
};

export const SEO_ROUTES: RouteSeoConfig[] = [
  {
    key: "home",
    path: "/",
    title: "ORTAQ — Gerçek şirketlere ortak olun",
    description:
      "Türkiye'de paya dayalı ortaklık sürecini sade anlatır. Tavsiye vermez. Kazanç garantisi yoktur.",
    cluster: "core",
    intent: "informational",
    priority: 1,
    changeFrequency: "weekly",
    live: true,
    keywords: ["ortaklık", "paya dayalı ortaklık", "kitle fonlama türkiye"],
  },
  {
    key: "nasil-calisir",
    path: "/nasil-calisir",
    title: "Nasıl çalışır? | ORTAQ",
    description:
      "Paya dayalı ortaklık süreci: e-Devlet, bilgi formu, emanet hesabı, MKK pay kaydı. Beş adımda.",
    cluster: "education",
    intent: "informational",
    priority: 0.9,
    changeFrequency: "monthly",
    live: true,
    keywords: ["ortaklık nasıl olur", "kitle fonlama süreci", "paya dayalı ortaklık adımları"],
  },
  {
    key: "guven",
    path: "/guven",
    title: "Güven ve şeffaflık | ORTAQ",
    description:
      "Lisanslı platform, emanet hesabı, MKK kaydı ve şikâyet yolları. Kanıtlayamadığımızı yazmıyoruz.",
    cluster: "trust",
    intent: "informational",
    priority: 0.85,
    changeFrequency: "monthly",
    live: true,
    keywords: ["SPK güvenilir mi", "kitle fonlama güvenli mi", "emanet hesabı"],
  },
  {
    key: "riskler",
    path: "/riskler",
    title: "Riskler ve limitler | ORTAQ",
    description:
      "Para kaybı, geri alamama, yıllık limit ve cayma hakkı. Karar öncesi okuyun.",
    cluster: "risk",
    intent: "informational",
    priority: 0.85,
    changeFrequency: "monthly",
    live: true,
    keywords: ["yatırım riskleri", "kitle fonlama riskleri", "yıllık limit"],
  },
  {
    key: "sss",
    path: "/sss",
    title: "Sık sorulan sorular | ORTAQ",
    description:
      "Ortaklık, SPK düzenlemesi, emanet hesabı ve dolandırıcılık endişeleri hakkında yanıtlar.",
    cluster: "education",
    intent: "informational",
    priority: 0.8,
    changeFrequency: "monthly",
    live: true,
    keywords: ["ortaklık sss", "kitle fonlama sorular", "SPK güvenilir mi"],
  },
  {
    key: "sozluk",
    path: "/sozluk",
    title: "Sözlük | ORTAQ",
    description:
      "MKK, SPK, emanet hesabı, bilgi formu ve paya dayalı ortaklık terimleri — sade açıklamalar.",
    cluster: "glossary",
    intent: "informational",
    priority: 0.75,
    changeFrequency: "monthly",
    live: true,
    keywords: ["MKK nedir", "emanet hesabı nedir", "bilgi formu nedir"],
  },
  {
    key: "basla",
    path: "/basla",
    title: "Okumaya başla | ORTAQ",
    description: "Karar öncesi kısa bilgilendirme. Kimlik ve ödeme yok.",
    cluster: "education",
    intent: "informational",
    priority: 0.6,
    changeFrequency: "monthly",
    live: true,
    keywords: ["ortaklık öğren", "ilk kez ortaklık"],
  },
  {
    key: "sirketler",
    path: "/sirketler",
    title: "Şirketler | ORTAQ",
    description: "Değerlendirme sürecindeki üretim şirketleri.",
    cluster: "campaign",
    intent: "informational",
    priority: 0.8,
    changeFrequency: "weekly",
    live: true,
    keywords: ["ortaklık şirketleri", "üretim şirketi ortaklık"],
  },
  {
    key: "degerlendirme",
    path: "/degerlendirme",
    title: "Şirketler nasıl değerlendirilir? | ORTAQ",
    description: "Seçim süreci: operasyonel inceleme, saha, finans, komite.",
    cluster: "trust",
    intent: "informational",
    priority: 0.75,
    changeFrequency: "monthly",
    live: true,
    keywords: ["şirket değerlendirme", "ortaklık seçim"],
  },
  {
    key: "sirket-ornek",
    path: "/sirket/ornek",
    title: "Örnek kampanya | ORTAQ",
    description: "Yönlendirme — değerlendirme dosyası.",
    cluster: "campaign",
    intent: "navigational",
    priority: 0.3,
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
  | "nasilCalisir"
  | "guven"
  | "riskler"
  | "sss"
  | "sozluk"
  | "basla"
  | "sirketOrnek"
  | "gizlilik"
  | "kullanim";

/** Map metadata RouteKey → registry key */
export const ROUTE_KEY_MAP: Record<RouteKey, string> = {
  home: "home",
  nasilCalisir: "nasil-calisir",
  guven: "guven",
  riskler: "riskler",
  sss: "sss",
  sozluk: "sozluk",
  basla: "basla",
  sirketOrnek: "sirket-ornek",
  gizlilik: "gizlilik",
  kullanim: "kullanim",
};
