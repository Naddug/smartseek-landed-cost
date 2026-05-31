import type { RouteKey } from "./routes";

export type RelatedLink = {
  href: string;
  title: string;
  description: string;
};

/** Contextual internal links — launch product only (no legacy crowdfunding routes). */
const RELATED_MAP: Record<RouteKey, RelatedLink[]> = {
  home: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Belgelerden görüşme odasına süreç" },
    { href: "/demo/sermaye", title: "Keşif önizlemesi", description: "Sermaye partneri keşif akışı" },
    { href: "/guven", title: "Güven", description: "Rol ayrımı, doğrulama ve şeffaflık" },
    { href: "/sss", title: "Sık sorulan sorular", description: "Belgeler, tanıştırma, görüşme odası" },
  ],
  nasilCalisir: [
    { href: "/degerlendirme", title: "Belge incelemesi", description: "Kanıt nasıl değerlendirilir?" },
    { href: "/guven", title: "Güven", description: "ORTAQ para tutmaz, tavsiye vermez" },
    { href: "/riskler", title: "Riskler", description: "Sonuç garantisi yoktur" },
    { href: "/sss", title: "SSS", description: "Karşılıklı tanıştırma ve görüşme odası" },
    { href: "/demo/sermaye", title: "Keşif önizlemesi", description: "Sermaye partneri akışı" },
  ],
  degerlendirme: [
    { href: "/nasil-calisir", title: "Süreç", description: "Belgelerden tanıştırmaya" },
    { href: "/guven", title: "Güven", description: "Doğrulama ve rol ayrımı" },
    { href: "/riskler", title: "Riskler", description: "Sınırlar ve sorumluluklar" },
    { href: "/sss", title: "SSS", description: "Belge ve keşif soruları" },
  ],
  guven: [
    { href: "/degerlendirme", title: "Belge incelemesi", description: "Kanıt nasıl değerlendirilir?" },
    { href: "/sss", title: "SSS", description: "Platform rolü ve süreç" },
    { href: "/riskler", title: "Riskler", description: "Ne garanti edilmez?" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Tam süreç özeti" },
  ],
  riskler: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç özeti" },
    { href: "/guven", title: "Güven", description: "ORTAQ'ın rolü ve sınırları" },
    { href: "/sss", title: "SSS", description: "Sık sorulan sorular" },
    { href: "/degerlendirme", title: "Belge incelemesi", description: "Kanıt değerlendirmesi" },
  ],
  sss: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Belgelerden görüşme odasına" },
    { href: "/demo/sermaye", title: "Keşif önizlemesi", description: "Sermaye partneri akışı" },
    { href: "/riskler", title: "Riskler", description: "Sonuç ve fonlama garantisi yok" },
    { href: "/guven", title: "Güven", description: "Doğrulama ve şeffaflık" },
    { href: "/degerlendirme", title: "Belge incelemesi", description: "Kanıt değerlendirmesi" },
  ],
  sozluk: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç" },
    { href: "/sss", title: "SSS", description: "Platform soruları" },
    { href: "/riskler", title: "Riskler", description: "Sınırlar" },
  ],
  basla: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Detaylı süreç" },
    { href: "/riskler", title: "Riskler", description: "Tüm riskler" },
  ],
  sirketler: [
    { href: "/degerlendirme", title: "Belge incelemesi", description: "Kanıt değerlendirmesi" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç özeti" },
    { href: "/guven", title: "Güven", description: "Doğrulama katmanı" },
    { href: "/sss", title: "SSS", description: "Platform soruları" },
  ],
  sirketOrnek: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç" },
    { href: "/riskler", title: "Riskler", description: "Genel riskler" },
  ],
  gizlilik: [{ href: "/kullanim", title: "Kullanım koşulları", description: "Platform rolü" }],
  kullanim: [{ href: "/gizlilik", title: "Gizlilik", description: "KVKK" }],
};

export function getRelatedLinks(route: RouteKey): RelatedLink[] {
  return RELATED_MAP[route] ?? [];
}

/** Contextual links for company dossier pages (legacy; noindex). */
export const DOSSIER_RELATED_LINKS: RelatedLink[] = [
  { href: "/degerlendirme", title: "Belge incelemesi", description: "Kanıt nasıl değerlendirilir?" },
  { href: "/guven", title: "Güven", description: "Doğrulama ve rol ayrımı" },
  { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç özeti" },
  { href: "/riskler", title: "Riskler", description: "Sınırlar" },
  { href: "/sss", title: "SSS", description: "Platform soruları" },
];
