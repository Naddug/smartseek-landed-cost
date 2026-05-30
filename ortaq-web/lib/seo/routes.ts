/**
 * ORTAQ route registry, SEO, sitemap, internal linking SSOT.
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
  /** Sitemap priority 0-1 */
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Include in sitemap when live */
  live: boolean;
  /** Primary Turkish keywords (internal reference, not meta keywords spam) */
  keywords: string[];
};

export const SEO_ROUTES: RouteSeoConfig[] = [
  {
    key: "home", path: "/", title: "ORTAQ : Gerçek şirket ortaklığı, yatırım fırsatları", description: "Türkiye'de üretim şirketlerine paya dayalı ortaklık. İhracat odaklı sanayi yatırımı, şirket incelemesi ve operasyonel büyüme dosyaları. Yatırım tavsiyesi değildir; kazanç garantisi yoktur.", cluster: "core", intent: "informational", priority: 1, changeFrequency: "weekly", live: true, keywords: [
      "yatırım fırsatları", "üretim şirketleri", "gerçek şirket ortaklığı", "paya dayalı yatırım", "üretim ekonomisi", "ihracat odaklı şirketler", "operasyonel büyüme", "sanayi yatırımı", "yatırım platformu", "şirket inceleme", "ortaklık", "kitle fonlama türkiye", ], }, {
    key: "nasil-calisir", path: "/nasil-calisir", title: "Nasıl çalışır? | ORTAQ", description: "Paya dayalı yatırım süreci: keşif, inceleme, doğrulama, katılım, izleme. e-Devlet, bilgi formu, emanet hesabı, MKK pay kaydı.", cluster: "education", intent: "informational", priority: 0.9, changeFrequency: "monthly", live: true, keywords: ["ortaklık nasıl olur", "kitle fonlama süreci", "paya dayalı ortaklık adımları"], }, {
    key: "guven", path: "/guven", title: "Güven ve şeffaflık | ORTAQ", description: "Lisanslı platform, emanet hesabı, MKK kaydı ve şikâyet yolları. Kanıtlayamadığımızı yazmıyoruz.", cluster: "trust", intent: "informational", priority: 0.85, changeFrequency: "monthly", live: true, keywords: ["SPK güvenilir mi", "kitle fonlama güvenli mi", "emanet hesabı"], }, {
    key: "riskler", path: "/riskler", title: "Riskler ve limitler | ORTAQ", description: "Para kaybı, geri alamama, yıllık limit ve cayma hakkı. Karar öncesi okuyun.", cluster: "risk", intent: "informational", priority: 0.85, changeFrequency: "monthly", live: true, keywords: ["yatırım riskleri", "kitle fonlama riskleri", "yıllık limit"], }, {
    key: "sss", path: "/sss", title: "Sık sorulan sorular | ORTAQ", description: "Nasıl yatırım yapılır, ortaklık nasıl çalışır, getiri ve çıkış nasıl düşünülür. SPK, emanet, MKK ve yatırımcı koruması , yatırım tavsiyesi değildir.", cluster: "education", intent: "informational", priority: 0.8, changeFrequency: "monthly", live: true, keywords: [
      "nasıl yatırım yapılır", "ortaklık nasıl çalışır", "paya dayalı yatırım sorular", "kitle fonlama SSS", "yatırımcı koruması", "SPK güvenilir mi", ], }, {
    key: "sozluk", path: "/sozluk", title: "Sözlük | ORTAQ", description: "MKK, SPK, emanet hesabı, bilgi formu ve paya dayalı ortaklık terimleri : sade açıklamalar.", cluster: "glossary", intent: "informational", priority: 0.75, changeFrequency: "monthly", live: true, keywords: ["MKK nedir", "emanet hesabı nedir", "bilgi formu nedir"], }, {
    key: "basla", path: "/basla", title: "Okumaya başla | ORTAQ", description: "Karar öncesi kısa bilgilendirme. Kimlik ve ödeme yok.", cluster: "education", intent: "informational", priority: 0.6, changeFrequency: "monthly", live: true, keywords: ["ortaklık öğren", "ilk kez ortaklık"], }, {
    key: "sirketler", path: "/sirketler", title: "Yatırım fırsatları · Üretim şirketleri", description: "Değerlendirme sürecindeki üretim şirketleri ve paya dayalı ortaklık dosyaları.", cluster: "campaign", intent: "informational", priority: 0.8, changeFrequency: "weekly", live: true, keywords: ["ortaklık şirketleri", "üretim şirketi ortaklık"], }, {
    key: "degerlendirme", path: "/degerlendirme", title: "Şirketler nasıl değerlendirilir? | ORTAQ", description: "Altı aşamalı şirket seçimi: ön eleme, saha incelemesi, hukuk, finans, kurucu görüşmesi, komite. Disiplinli sanayi yatırımı dosyaları.", cluster: "trust", intent: "informational", priority: 0.75, changeFrequency: "monthly", live: true, keywords: [
      "şirket değerlendirme", "sanayi yatırımı seçimi", "saha incelemesi", "ortaklık şirket seçimi", ], }, {
    key: "sirket-ornek", path: "/sirket/ornek", title: "Örnek kampanya | ORTAQ", description: "Yönlendirme : değerlendirme dosyası.", cluster: "campaign", intent: "navigational", priority: 0.3, changeFrequency: "yearly", live: false, keywords: [], }, {
    key: "gizlilik", path: "/gizlilik", title: "Gizlilik | ORTAQ", description: "KVKK kapsamında kişisel verilerin işlenmesi.", cluster: "legal", intent: "navigational", priority: 0.3, changeFrequency: "yearly", live: true, keywords: [], }, {
    key: "kullanim", path: "/kullanim", title: "Kullanım koşulları | ORTAQ", description: "ORTAQ kullanım koşulları ve platform rolü.", cluster: "legal", intent: "navigational", priority: 0.3, changeFrequency: "yearly", live: true, keywords: [], },
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
  | "degerlendirme"
  | "riskler"
  | "sss"
  | "sozluk"
  | "basla"
  | "sirketler"
  | "sirketOrnek"
  | "gizlilik"
  | "kullanim";

/** Map metadata RouteKey → registry key */
export const ROUTE_KEY_MAP: Record<RouteKey, string> = {
  home: "home", nasilCalisir: "nasil-calisir", guven: "guven", degerlendirme: "degerlendirme", riskler: "riskler", sss: "sss", sozluk: "sozluk", basla: "basla", sirketler: "sirketler", sirketOrnek: "sirket-ornek", gizlilik: "gizlilik", kullanim: "kullanim",
};
