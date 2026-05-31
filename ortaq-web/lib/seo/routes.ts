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
    key: "home", path: "/", title: "ORTAQ : Büyüme sermayesi erişim ağı", description: "Güçlü ama görünmez üretim şirketlerini yatırıma hazır ve görünür kılarız; doğru sermaye partnerleriyle nitelikli biçimde buluştururuz. Yatırım satmayız, fon değiliz, para tutmayız.", cluster: "core", intent: "informational", priority: 1, changeFrequency: "weekly", live: true, keywords: [
      "büyüme sermayesi", "sermaye erişimi", "üretim şirketleri", "ihracatçı şirketler", "yatırıma hazırlık", "sermaye partneri", "üretim ekonomisi", "ihracat odaklı şirketler", "büyüme sermayesi erişimi", "growth capital", ], }, {
    key: "nasil-calisir", path: "/nasil-calisir", title: "Nasıl çalışır? | ORTAQ", description: "Görünürlük, doğrulama, hazırlık, eşleşme ve nitelikli tanıştırma. ORTAQ doğrulama ve erişim katmanıdır; para tutmaz.", cluster: "education", intent: "informational", priority: 0.9, changeFrequency: "monthly", live: true, keywords: ["sermaye erişimi süreci", "yatırıma hazırlık", "readiness skoru"], }, {
    key: "guven", path: "/guven", title: "Güven ve uyum | ORTAQ", description: "ORTAQ para tutmaz, yatırım satmaz, tavsiye vermez. Bağımsız doğrulama, hazırlık ve nitelikli tanıştırma katmanı. Kanıtlayamadığımızı yazmıyoruz.", cluster: "trust", intent: "informational", priority: 0.85, changeFrequency: "monthly", live: true, keywords: ["bağımsız doğrulama", "uyum", "lisanslı yapı"], }, {
    key: "riskler", path: "/riskler", title: "Riskler ve sınırlar | ORTAQ", description: "Erişim ve tanıştırma sonucu garanti etmez; readiness skoru garanti değildir; ORTAQ para tutmaz, tavsiye vermez. Karar öncesi okuyun.", cluster: "risk", intent: "informational", priority: 0.85, changeFrequency: "monthly", live: true, keywords: ["erişim riskleri", "sonuç garantisi yok", "sınırlar"], }, {
    key: "sss", path: "/sss", title: "Sık sorulan sorular | ORTAQ", description: "ORTAQ nedir, nasıl kazanır, sermaye erişimi nasıl çalışır, readiness nedir. Erişim, hazırlık ve nitelikli tanıştırma; yatırım tavsiyesi değildir.", cluster: "education", intent: "informational", priority: 0.8, changeFrequency: "monthly", live: true, keywords: [
      "nasıl yatırım yapılır", "ortaklık nasıl çalışır", "paya dayalı yatırım sorular", "kitle fonlama SSS", "yatırımcı koruması", "SPK güvenilir mi", ], }, {
    key: "sozluk", path: "/sozluk", title: "Sözlük | ORTAQ", description: "Sermaye erişimi, readiness, doğrulama, nitelikli tanıştırma ve lisanslı yapı terimleri: sade açıklamalar.", cluster: "glossary", intent: "informational", priority: 0.75, changeFrequency: "monthly", live: true, keywords: ["MKK nedir", "emanet hesabı nedir", "bilgi formu nedir"], }, {
    key: "basla", path: "/basla", title: "Başla | ORTAQ", description: "ORTAQ'ın nasıl çalıştığına dair kısa bilgilendirme. Kimlik ve ödeme yok.", cluster: "education", intent: "informational", priority: 0.6, changeFrequency: "monthly", live: true, keywords: ["sermaye erişimi öğren", "nasıl başlanır"], }, {
    key: "sirketler", path: "/sirketler", title: "Şirketler · Üretim şirketleri | ORTAQ", description: "Doğrulama ve hazırlık sürecindeki üretim şirketleri; sermaye partnerlerine yapılandırılmış erişim.", cluster: "campaign", intent: "informational", priority: 0.8, changeFrequency: "weekly", live: true, keywords: ["doğrulanmış üreticiler", "yatırıma hazır şirketler"], }, {
    key: "degerlendirme", path: "/degerlendirme", title: "Şirketleri nasıl seçiyoruz? | ORTAQ", description: "Çok aşamalı doğrulama ve hazırlık: ön eleme, saha incelemesi, hukuk, finans, sipariş ve ticaret doğrulaması. Yatırıma hazır şirketler.", cluster: "trust", intent: "informational", priority: 0.75, changeFrequency: "monthly", live: true, keywords: [
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
