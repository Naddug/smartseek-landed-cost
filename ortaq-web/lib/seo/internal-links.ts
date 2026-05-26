import type { RouteKey } from "./routes";

export type RelatedLink = {
  href: string;
  title: string;
  description: string;
};

/** Contextual internal links — authority flow between clusters */
const RELATED_MAP: Record<RouteKey, RelatedLink[]> = {
  home: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Beş adımda süreç" },
    { href: "/guven", title: "Güven", description: "Altyapı ve şeffaflık" },
    { href: "/sss", title: "Sık sorulan sorular", description: "SPK, emanet, dolandırıcılık" },
  ],
  nasilCalisir: [
    { href: "/riskler", title: "Riskler", description: "Kayıp ve limitler" },
    { href: "/sozluk", title: "Sözlük", description: "MKK, emanet, bilgi formu" },
    { href: "/basla", title: "Okumaya başla", description: "Kısa bilgilendirme" },
  ],
  guven: [
    { href: "/sss", title: "SSS", description: "SPK güvenilir mi?" },
    { href: "/riskler", title: "Riskler", description: "Ne kaybedebilirsiniz?" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Para yolu" },
  ],
  riskler: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç özeti" },
    { href: "/guven", title: "Güven", description: "Emanet ve MKK" },
    { href: "/sss", title: "SSS", description: "Sık sorular" },
  ],
  sss: [
    { href: "/sozluk", title: "Sözlük", description: "Terimler" },
    { href: "/guven", title: "Güven", description: "Durum ve şeffaflık" },
    { href: "/basla", title: "Okumaya başla", description: "Adım adım oku" },
  ],
  sozluk: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç" },
    { href: "/sss", title: "SSS", description: "Sorular" },
    { href: "/riskler", title: "Riskler", description: "Limitler" },
  ],
  basla: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Detaylı süreç" },
    { href: "/riskler", title: "Riskler", description: "Tüm riskler" },
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
