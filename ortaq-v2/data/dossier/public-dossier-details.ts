import type {
  DossierDetailStatus,
  InboundInterest,
  PublicDossierDetail,
} from "@/types/dossier-detail";
import type { MarketingDossier } from "@/types/marketing-dossier";
import { marketingDossiers } from "@/data/marketing/home-dossiers";

const DETAIL_EXTENSIONS: Record<
  string,
  Omit<
    PublicDossierDetail,
    keyof MarketingDossier | "status" | "categoryKey"
  > & { status?: DossierDetailStatus }
> = {
  "e-ticaret-operasyonu": {
    ownerId: "demo@ortaq.biz",
    longDescription:
      "Marka ve tedarik altyapısı kurulu; ilk satışlar yapıldı ancak operasyon ve teknik ekip eksikliği nedeniyle büyüme durdu. Platform canlı, stok ve tedarikçi ilişkileri mevcut.",
    whyNow:
      "Mevcut altyapı 6 ay daha atıl kalırsa tedarik anlaşmaları ve marka momentumu zayıflayacak; operasyon ortağı ile hızlı devreye alma kritik.",
    idealContribution:
      "Günlük operasyon, teknik entegrasyon tamamlama, pazaryeri büyüme kanalları ve performans pazarlaması.",
    verification: {
      companyVerified: true,
      identityVerified: true,
      locationVerified: true,
      dossierReviewed: true,
    },
  },
  "kafe-lokasyonu": {
    ownerId: "owner-002",
    longDescription:
      "Ana cadde üzerinde 120 m² kiralık alan; ruhsat ve altyapı hazır. Marka, menü ve işletme modeli tanımlanmadı.",
    whyNow:
      "Lokasyon avantajı mevsimsel; yaz sezonu öncesi konsept ve işletme ortağı ile açılış planlanmalı.",
    idealContribution:
      "Konsept geliştirme, menü, günlük işletme, personel yönetimi ve açılış pazarlaması.",
    verification: {
      companyVerified: false,
      identityVerified: true,
      locationVerified: true,
      dossierReviewed: true,
    },
  },
  "tekstil-atolyesi": {
    ownerId: "demo@ortaq.biz",
    longDescription:
      "25 kişilik ekip ve makine parkı ile düzenli üretim yapılıyor; mevcut müşteri tabanı var ancak yeni sipariş akışı oluşmadı.",
    whyNow:
      "Kapasite dolu; satış kanalı olmadan makine yatırımının geri dönüşü yavaşlıyor.",
    idealContribution:
      "B2B satış, ihracat kanalı, dijital pazaryeri entegrasyonu ve büyüme operasyonu.",
    verification: {
      companyVerified: true,
      identityVerified: true,
      locationVerified: true,
      dossierReviewed: true,
    },
    moderationNote: "Üretim kapasitesi belgeleri incelendi.",
  },
  "saglik-yazilimi": {
    ownerId: "owner-004",
    longDescription:
      "Sağlık sektöründe çalışan prototip; pilot kullanıcılar mevcut. Ticari model, dağıtım ve sektör ortağı eksik.",
    whyNow:
      "Regülasyon penceresi ve sektör bağlantıları ile birlikte ürünleştirme hızlandırılmalı.",
    idealContribution:
      "Sektör satış ağı, regülasyon uyumu, dağıtım ortaklığı ve ürünleştirme.",
    verification: {
      companyVerified: true,
      identityVerified: true,
      locationVerified: false,
      dossierReviewed: true,
    },
  },
  "lojistik-depo": {
    ownerId: "owner-005",
    longDescription:
      "İstanbul yakınında kontratlı depo alanı; ekipman ve temel ekip var. Operasyon ve müşteri portföyü yok.",
    idealContribution:
      "Lojistik operasyon, müşteri edinimi, SLA yönetimi.",
    verification: { locationVerified: true, dossierReviewed: true },
  },
  "gida-uretim": {
    ownerId: "owner-006",
    longDescription:
      "Ruhsatlı gıda üretim hattı çalışır durumda; marka ve perakende/distribution anlaşması yok.",
    idealContribution: "Marka, kanal satış, perakende listeleme.",
    verification: { companyVerified: true, dossierReviewed: true },
  },
  "mobil-uygulama": {
    ownerId: "owner-007",
    status: "under_review",
    longDescription:
      "10K+ aktif kullanıcı; gelir modeli test edilmedi. Teknik borç ve büyüme yapısı eksik.",
    moderationNote: "Monetizasyon planı netleştirilmeli.",
    verification: { dossierReviewed: false },
  },
  "butik-otel": {
    ownerId: "owner-008",
    longDescription:
      "Tadilatı tamamlanmış 18 odalı tesis; konsept ve işletme bekliyor.",
    idealContribution: "Marka, rezervasyon kanalları, günlük operasyon.",
    verification: { locationVerified: true, dossierReviewed: true },
  },
};

const INBOUND_BY_DOSSIER: Record<string, InboundInterest[]> = {
  "md-001": [
    {
      id: "int-1",
      counterpartName: "Mehmet K.",
      counterpartType: "Teknik Ortak",
      createdAt: "2026-05-14T10:00:00Z",
      status: "pending",
    },
    {
      id: "int-2",
      counterpartName: "Selin A.",
      counterpartType: "Büyüme Ortağı",
      createdAt: "2026-05-12T14:30:00Z",
      status: "in_review",
    },
  ],
  "md-003": [
    {
      id: "int-3",
      counterpartName: "Can D.",
      counterpartType: "Büyüme Ortağı",
      createdAt: "2026-05-10T09:00:00Z",
      status: "pending",
    },
  ],
};

function mapMarketingStatus(
  status: MarketingDossier["status"],
  override?: DossierDetailStatus
): DossierDetailStatus {
  if (override) return override;
  switch (status) {
    case "published":
      return "published";
    case "under_review":
      return "under_review";
    case "draft":
      return "draft";
    default:
      return "draft";
  }
}

export function toPublicDossierDetail(d: MarketingDossier): PublicDossierDetail {
  const ext = DETAIL_EXTENSIONS[d.slug] ?? {};
  return {
    ...d,
    ...ext,
    status: mapMarketingStatus(d.status, ext.status),
  };
}

export function getPublicDossierBySlug(
  slug: string
): PublicDossierDetail | null {
  const base = marketingDossiers.find((d) => d.slug === slug);
  if (!base) return null;
  return toPublicDossierDetail(base);
}

export function getPublicDossierById(id: string): PublicDossierDetail | null {
  const base = marketingDossiers.find((d) => d.id === id);
  if (!base) return null;
  return toPublicDossierDetail(base);
}

export function getRelatedDossiers(
  dossier: PublicDossierDetail,
  limit = 3
): PublicDossierDetail[] {
  return marketingDossiers
    .filter(
      (d) =>
        d.id !== dossier.id &&
        d.status === "published" &&
        (d.categoryKey === dossier.categoryKey ||
          d.partnerTypeNeeded === dossier.partnerTypeNeeded)
    )
    .slice(0, limit)
    .map(toPublicDossierDetail);
}

export function getInboundInterest(dossierId: string): InboundInterest[] {
  return INBOUND_BY_DOSSIER[dossierId] ?? [];
}

/** Mock: partner users who already applied */
export const APPLIED_INTEREST_MOCK: Record<string, string[]> = {
  "ortak@ortaq.biz": ["md-001"],
};

export function getAllPublicSlugs(): string[] {
  return marketingDossiers
    .filter((d) => d.status === "published" || d.status === "under_review")
    .map((d) => d.slug);
}
