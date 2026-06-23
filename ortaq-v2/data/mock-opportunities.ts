import type { OpportunityDraft } from "@/types";

/**
 * Temporary mock data for UI development.
 * TODO: Replace with API / Prisma queries.
 */
export const mockOpportunities: OpportunityDraft[] = [
  {
    id: "opp-001",
    title: "Yarım kalmış e-ticaret altyapısı",
    summary:
      "Kurulu altyapı ve tedarik bağlantıları mevcut; teknik ve operasyon tarafı tamamlanmadı.",
    category: "ecommerce",
    categoryLabel: "E-ticaret",
    stage: "partially_built",
    location: "İstanbul",
    readinessScore: 58,
    readinessStatus: "review_pending",
    blockers: ["technical", "operations"],
    assets: ["digital_infrastructure", "brand", "inventory"],
    visibility: "public",
    updatedAt: "2026-05-12",
    primaryBlockerLabel: "Teknik eksik",
    neededPartnerLabel: "Teknik Ortak",
  },
  {
    id: "opp-002",
    title: "Konseptsiz kafe lokasyonu",
    summary:
      "Merkezi konumda kiralık alan hazır; marka, menü ve işletme modeli henüz tanımlanmadı.",
    category: "hospitality",
    categoryLabel: "Yeme-İçme",
    stage: "idea",
    location: "Ankara",
    readinessScore: 34,
    readinessStatus: "incomplete",
    blockers: ["operations", "partnership"],
    assets: ["location", "licenses"],
    visibility: "matched_only",
    updatedAt: "2026-05-08",
    primaryBlockerLabel: "Konsept eksik",
    neededPartnerLabel: "İşletme Ortağı",
  },
  {
    id: "opp-003",
    title: "Kapasite fazlası olan tekstil atölyesi",
    summary:
      "Makine parkı ve üretim ekibi var; düzenli sipariş akışı ve satış kanalı oluşmadı.",
    category: "manufacturing",
    categoryLabel: "Üretim",
    stage: "operating_stalled",
    location: "Bursa",
    readinessScore: 71,
    readinessStatus: "published",
    blockers: ["marketing", "partnership"],
    assets: ["equipment", "team", "customer_base"],
    visibility: "public",
    updatedAt: "2026-05-15",
    primaryBlockerLabel: "Satış kanalı yok",
    neededPartnerLabel: "Büyüme Ortağı",
  },
  {
    id: "opp-004",
    title: "Ürünleşememiş sağlık yazılımı",
    summary:
      "Çalışan prototip ve sektör bağlantıları var; ticari model ve dağıtım yapısı net değil.",
    category: "healthcare",
    categoryLabel: "Sağlık Teknolojisi",
    stage: "partially_built",
    location: "İzmir",
    readinessScore: 62,
    readinessStatus: "published",
    blockers: ["technical", "partnership", "marketing"],
    assets: ["digital_infrastructure", "team"],
    visibility: "public",
    updatedAt: "2026-05-10",
    primaryBlockerLabel: "Ürünleşme eksik",
    neededPartnerLabel: "Sektör + Teknik Ortak",
  },
];
