import type { OpportunityDraft } from "@/types";

/**
 * Temporary mock data for UI development.
 * TODO: Replace with API / Prisma queries.
 */
export const mockOpportunities: OpportunityDraft[] = [
  {
    id: "opp-001",
    fileRef: "FD-2026-014",
    title: "Altyapısı kurulu e-ticaret operasyonu",
    hook: "Platform ve tedarik hazır — büyüme ve operasyon tarafı boş.",
    summary:
      "Platform, tedarik ve marka altyapısı hazır; büyüme ve operasyon tarafında ortak aranıyor.",
    category: "ecommerce",
    categoryLabel: "E-Ticaret",
    stage: "partially_built",
    stageLabel: "Başlandı, takıldı",
    location: "İstanbul",
    readinessScore: 58,
    readinessStatus: "published",
    blockers: ["technical", "operations"],
    assets: ["digital_infrastructure", "brand", "inventory"],
    assetsLabel: "Altyapı · Marka · Stok",
    visibility: "public",
    updatedAt: "2026-05-12",
    primaryBlockerLabel: "Operasyon ve teknik tamamlama",
    neededPartnerLabel: "Teknik + Büyüme Ortağı",
  },
  {
    id: "opp-002",
    fileRef: "FD-2026-009",
    title: "Ana cadde lokasyonu — konsept ve işletme bekliyor",
    hook: "Lokasyon ve ruhsat var; marka, menü ve operasyon tanımsız.",
    summary:
      "Kiralık alan, ruhsat ve konum avantajı mevcut; işletme modeli ve marka tanımlanmadı.",
    category: "hospitality",
    categoryLabel: "Yeme-İçme",
    stage: "idea",
    stageLabel: "Varlık var, başlanmadı",
    location: "Ankara",
    readinessScore: 34,
    readinessStatus: "published",
    blockers: ["operations", "partnership"],
    assets: ["location", "licenses"],
    assetsLabel: "Lokasyon · Ruhsat",
    visibility: "matched_only",
    updatedAt: "2026-05-08",
    primaryBlockerLabel: "Konsept ve işletme modeli yok",
    neededPartnerLabel: "İşletme Ortağı",
  },
  {
    id: "opp-003",
    fileRef: "FD-2026-021",
    title: "Makine parkı hazır tekstil atölyesi",
    hook: "Üretim kapasitesi dolu potansiyelde — satış kanalı yok.",
    summary:
      "Üretim kapasitesi ve ekip var; düzenli sipariş akışı ve satış kanalı oluşmadı.",
    category: "manufacturing",
    categoryLabel: "Üretim",
    stage: "operating_stalled",
    stageLabel: "Çalışıyor, büyüyemiyor",
    location: "Bursa",
    readinessScore: 71,
    readinessStatus: "published",
    blockers: ["marketing", "partnership"],
    assets: ["equipment", "team", "customer_base"],
    assetsLabel: "Makine parkı · Ekip · Müşteri tabanı",
    visibility: "public",
    updatedAt: "2026-05-15",
    primaryBlockerLabel: "Satış kanalı yok",
    neededPartnerLabel: "Büyüme Ortağı",
  },
  {
    id: "opp-004",
    fileRef: "FD-2026-018",
    title: "Sağlık yazılımı prototipi — ticari yapı eksik",
    hook: "Çalışan ürün var; dağıtım, satış ve sektör ortağı aranıyor.",
    summary:
      "Prototip ve sektör bağlantıları var; ürünleştirme, dağıtım ve satış yapısı net değil.",
    category: "healthcare",
    categoryLabel: "Sağlık Teknolojisi",
    stage: "partially_built",
    stageLabel: "Başlandı, takıldı",
    location: "İzmir",
    readinessScore: 62,
    readinessStatus: "published",
    blockers: ["technical", "partnership", "marketing"],
    assets: ["digital_infrastructure", "team"],
    assetsLabel: "Prototip · Ekip",
    visibility: "public",
    updatedAt: "2026-05-10",
    primaryBlockerLabel: "Ticari model ve dağıtım",
    neededPartnerLabel: "Sektör + Teknik Ortak",
  },
];

/** Featured dossier for homepage spotlight */
export const featuredOpportunity = mockOpportunities[2];
