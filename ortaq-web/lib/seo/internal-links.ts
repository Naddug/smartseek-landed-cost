import {
  getCategoryPath,
  getPrimaryLiveCategory,
} from "@/lib/categories/registry";
import type { RouteKey } from "./routes";

export type RelatedLink = {
  href: string;
  title: string;
  description: string;
};

const PRIMARY_CATEGORY_HREF =
  getPrimaryLiveCategory() !== undefined
    ? getCategoryPath(getPrimaryLiveCategory()!.slug)
    : "/ne-yapiyoruz";

/** Contextual internal links — operator-site public pages. */
const RELATED_MAP: Record<RouteKey, RelatedLink[]> = {
  home: [
    { href: "/how-sampling-works", title: "Numune süreci", description: "Onay öncesi numune akışı" },
    { href: "/payment-protection", title: "Ödeme koruması", description: "Kilometre taşı ödemeleri" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Fabrikadan teslimata süreç" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'inizi gönderin" },
  ],
  teklif: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç adımları" },
    { href: PRIMARY_CATEGORY_HREF, title: "Aktif kategori", description: "Canlı program" },
    { href: "/guven", title: "Güven", description: "Rol ve sınırlar" },
    { href: "/sss", title: "SSS", description: "Fiyat ve süreç soruları" },
  ],
  neYapiyoruz: [
    { href: "/launch-timeline", title: "Lansman zaman çizelgesi", description: "Brief'ten teslimata" },
    { href: "/quality-control", title: "Kalite kontrol", description: "Referans ve denetim" },
    { href: PRIMARY_CATEGORY_HREF, title: "Aktif kategori", description: "Canlı program" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  nasilCalisir: [
    { href: "/ne-yapiyoruz", title: "Ne yapıyoruz", description: "Hizmet kapsamı" },
    { href: PRIMARY_CATEGORY_HREF, title: "Aktif kategori", description: "Örnek program" },
    { href: "/guven", title: "Güven", description: "Rol ve sınırlar" },
    { href: "/teklif", title: "Teklif alın", description: "İlk adım" },
  ],
  nedenOrtaq: [
    { href: "/why-not-direct-factory", title: "Neden doğrudan fabrika değil?", description: "Koordinasyon riskleri" },
    { href: "/payment-protection", title: "Ödeme koruması", description: "Kilometre taşı ödemeleri" },
    { href: "/guven", title: "Güven", description: "Taahhütler ve sınırlar" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  sss: [
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç özeti" },
    { href: "/guven", title: "Güven", description: "Rol ve sınırlar" },
    { href: "/neden-ortaq", title: "Neden ORTAQ", description: "Neden tek ortak" },
    { href: "/teklif", title: "Teklif alın", description: "İlk adım" },
  ],
  guven: [
    { href: "/how-sampling-works", title: "Numune süreci", description: "Onay öncesi numune akışı" },
    { href: "/quality-control", title: "Kalite kontrol", description: "Referans ve sevkiyat öncesi kontrol" },
    { href: "/payment-protection", title: "Ödeme koruması", description: "Kilometre taşı ödemeleri" },
    { href: "/why-not-direct-factory", title: "Neden doğrudan fabrika değil?", description: "Koordinasyon riskleri" },
  ],
  howSamplingWorks: [
    { href: "/quality-control", title: "Kalite kontrol", description: "Onaylanan referans ve denetim" },
    { href: "/launch-timeline", title: "Lansman zaman çizelgesi", description: "Brief'ten teslimata" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Genel süreç" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  qualityControl: [
    { href: "/how-sampling-works", title: "Numune süreci", description: "Üretim öncesi onay" },
    { href: "/payment-protection", title: "Ödeme koruması", description: "Denetim kilometre taşları" },
    { href: "/guven", title: "Güven", description: "Rol ve sınırlar" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  paymentProtection: [
    { href: "/quality-control", title: "Kalite kontrol", description: "Ödeme öncesi denetim" },
    { href: "/why-not-direct-factory", title: "Neden doğrudan fabrika değil?", description: "Anlaşmazlık riskleri" },
    { href: "/guven", title: "Güven", description: "Taahhütler ve sınırlar" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  whyNotDirectFactory: [
    { href: "/payment-protection", title: "Ödeme koruması", description: "Koruma mekanizmaları" },
    { href: "/neden-ortaq", title: "Neden ORTAQ", description: "Tek sorumlu ortak" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Koordinasyon süreci" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  launchTimeline: [
    { href: "/how-sampling-works", title: "Numune süreci", description: "Numune ve onay aşaması" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç detayı" },
    { href: "/ne-yapiyoruz", title: "Ne yapıyoruz", description: "Hizmet kapsamı" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  ekip: [
    { href: "/neden-ortaq", title: "Neden ORTAQ", description: "Operatör yaklaşımı" },
    { href: "/guven", title: "Güven", description: "Rol ve sınırlar" },
    { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç" },
    { href: "/teklif", title: "Teklif alın", description: "Program brief'i" },
  ],
  gizlilik: [{ href: "/kullanim", title: "Kullanım koşulları", description: "Hizmet koşulları" }],
  kullanim: [{ href: "/gizlilik", title: "Gizlilik", description: "KVKK" }],
  kesfet: [],
  investors: [],
  degerlendirme: [],
  riskler: [],
  sozluk: [],
  basla: [],
  sirketler: [],
  sirketOrnek: [],
};

export function getRelatedLinks(route: RouteKey): RelatedLink[] {
  return RELATED_MAP[route] ?? [];
}

export const DOSSIER_RELATED_LINKS: RelatedLink[] = [
  { href: "/teklif", title: "Teklif alın", description: "Program brief'inizi gönderin" },
  { href: "/guven", title: "Güven", description: "Rol ve sınırlar" },
  { href: "/nasil-calisir", title: "Nasıl çalışır?", description: "Süreç özeti" },
  { href: "/sss", title: "SSS", description: "Sık sorulan sorular" },
];
