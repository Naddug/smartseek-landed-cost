import type { RouteKey } from "./routes";

export type RelatedLink = {
  href: string;
  title: string;
  description: string;
};

/** Contextual internal links — authority flow between clusters */
const RELATED_MAP: Record<RouteKey, RelatedLink[]> = {
  home: [
    { href: "/sirketler", title: "Yatırım fırsatları", description: "Üretim şirketleri ve inceleme dosyaları" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Keşiften MKK pay kaydına — yatırım yolculuğu" },
    { href: "/guven", title: "Güven", description: "SPK çerçevesi, emanet, yatırımcı koruması" },
    { href: "/sss", title: "Sık sorulan sorular", description: "Ortaklık, getiri, risk, çıkış" },
  ],
  nasilCalisir: [
    { href: "/degerlendirme", title: "Şirket seçimi", description: "Altı aşamalı due diligence — keşiften sonra, katılımdan önce" },
    { href: "/guven", title: "Güven", description: "SPK çerçevesi, emanet, MKK — yatırımcı koruması" },
    { href: "/riskler", title: "Riskler", description: "Kayıp, likidite ve yıllık limitler" },
    { href: "/sss", title: "SSS", description: "Ortaklık, getiri, çıkış, yasal yapı" },
    { href: "/sirketler", title: "Şirketler", description: "Aktif inceleme dosyaları" },
  ],
  degerlendirme: [
    { href: "/nasil-calisir", title: "Katılım süreci", description: "Keşiften MKK pay kaydına — yatırım yolculuğu" },
    { href: "/guven", title: "Güven", description: "Emanet, MKK, SPK düzenlemesi" },
    { href: "/riskler", title: "Riskler", description: "Ne kaybedebilirsiniz?" },
    { href: "/sss", title: "SSS", description: "Due diligence ve yatırımcı koruması" },
    { href: "/sirketler", title: "Şirketler", description: "İncelemeden geçmiş dosyalar" },
  ],
  guven: [
    { href: "/degerlendirme", title: "Değerlendirme", description: "Şirketler nasıl seçilir?" },
    { href: "/sss", title: "SSS", description: "SPK, emanet, yatırımcı koruması" },
    { href: "/riskler", title: "Riskler", description: "Ne kaybedebilirsiniz?" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Katılım ve pay kaydı" },
  ],
  riskler: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Yatırım yolculuğu özeti" },
    { href: "/guven", title: "Güven", description: "Emanet ve MKK koruması" },
    { href: "/sss", title: "SSS", description: "Getiri ve çıkış soruları" },
    { href: "/degerlendirme", title: "Değerlendirme", description: "Disiplinli şirket seçimi" },
  ],
  sss: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Keşiften MKK pay kaydına — yatırım yolculuğu" },
    { href: "/sirketler", title: "Şirketler", description: "Yatırım fırsatları ve dosyalar" },
    { href: "/riskler", title: "Riskler", description: "Kayıp, likidite ve yıllık limitler" },
    { href: "/sozluk", title: "Sözlük", description: "Paya dayalı ortaklık terimleri" },
    { href: "/guven", title: "Güven", description: "Yasal çerçeve ve şeffaflık" },
    { href: "/degerlendirme", title: "Değerlendirme", description: "Şirket seçim süreci" },
  ],
  sozluk: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Katılım süreci" },
    { href: "/sss", title: "SSS", description: "Ortaklık ve getiri soruları" },
    { href: "/riskler", title: "Riskler", description: "Limitler ve kayıp senaryoları" },
  ],
  basla: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Detaylı yatırım yolculuğu" },
    { href: "/sirketler", title: "Şirketler", description: "Dosyaları keşfedin" },
    { href: "/riskler", title: "Riskler", description: "Tüm riskler" },
  ],
  sirketler: [
    { href: "/degerlendirme", title: "Değerlendirme", description: "Altı aşamalı şirket seçimi" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Keşiften pay kaydına" },
    { href: "/guven", title: "Güven", description: "SPK çerçevesi ve emanet" },
    { href: "/sss", title: "SSS", description: "Ortaklık, getiri, risk, çıkış" },
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

/** Contextual links for company dossier pages */
export const DOSSIER_RELATED_LINKS: RelatedLink[] = [
  { href: "/degerlendirme", title: "Değerlendirme", description: "Bu dosya nasıl oluşturuldu?" },
  { href: "/guven", title: "Güven", description: "Emanet, MKK ve yatırımcı koruması" },
  { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Katılım ve pay kaydı süreci" },
  { href: "/riskler", title: "Riskler", description: "Kayıp ve likidite senaryoları" },
  { href: "/sss", title: "SSS", description: "Ortaklık, getiri ve çıkış" },
];
