import type {
  SimulatedCampaign,
  CampaignStatus,
  CampaignRisk,
  FundingLine,
  MachineAsset,
  CampaignTimelineEvent,
  FacilityZone,
  ExportEvolution,
  InspectionLayer,
  OperationalUpdate,
} from "./types";

type JournalSeed = {
  date: string;
  time: string;
  text: string;
  type?: SimulatedCampaign["fieldJournal"][0]["type"];
  author?: string;
};

export type CampaignSeed = {
  slug: string;
  legalName: string;
  tradeName: string;
  sector: string;
  city: string;
  region: string;
  founded: number;
  employees: number;
  exportMarkets: string[];
  facilityArea: string;
  monthlyCapacity: string;
  targetTry: number;
  exportShare: string;
  domesticShare: string;
  reviewStatus: CampaignStatus;
  processDone: number;
  fundingPurpose: string;
  fundingLines: FundingLine[];
  founderName: string;
  founderNote: string;
  storyOrigin: string;
  storyToday: string;
  productionDetail: string;
  processes: string[];
  materials: string[];
  machines: MachineAsset[];
  risks: CampaignRisk[];
  gateway: { hook: string; scale: string; tension: string };
  bottleneck: { label: string; note: string };
  journal: JournalSeed[];
  updates: OperationalUpdate[];
  timeline: CampaignTimelineEvent[];
  facilityNotes: FacilityZone[];
  exportEvolution: ExportEvolution[];
  inspectionLayers: InspectionLayer[];
  operationalSignals: SimulatedCampaign["operations"]["signals"];
  annualRevenueNote?: string;
};

const PROCESS_LABELS = [
  "Ön başvuru ve sektör uygunluğu",
  "Belge paketi (ticaret sicili, vergi, finansal tablo)",
  "Saha ziyareti — üretim hattı",
  "Finansal ve hukuk incelemesi",
  "Yatırım komitesi",
  "Lisanslı platform onayı",
  "Bilgi formu yayını ve ortaklık",
] as const;

function buildProcess(done: number, activeDate: string): SimulatedCampaign["process"] {
  return PROCESS_LABELS.map((label, i) => {
    if (i < done) return { label, status: "done" as const, date: activeDate };
    if (i === done) return { label, status: "active" as const, date: activeDate };
    return { label, status: "pending" as const };
  });
}

function mapAccessStatus(status: CampaignStatus): SimulatedCampaign["access"]["status"] {
  const map: Record<CampaignStatus, SimulatedCampaign["access"]["status"]> = {
    preliminary_review: "preliminary",
    document_review: "document_review",
    field_verification: "field_verification",
    committee: "committee",
  };
  return map[status];
}

export function buildCatalogCampaign(seed: CampaignSeed): SimulatedCampaign {
  const activeDate = seed.journal[0]?.date ?? "2026-05-01";

  return {
    slug: seed.slug,
    simulated: true,
    legalName: seed.legalName,
    tradeName: seed.tradeName,
    sector: seed.sector,
    city: seed.city,
    region: seed.region,
    founded: seed.founded,
    employees: seed.employees,
    exportMarkets: seed.exportMarkets,
    annualRevenueNote: seed.annualRevenueNote ?? "2024 yönetim raporu mevcut · bağımsız denetim yapılmamış",
    productionNote: seed.monthlyCapacity,
    verificationLabel: "under_review",
    reviewStatus: seed.reviewStatus,
    seoTitle: `${seed.tradeName} | Değerlendirme dosyası`,
    seoDescription: `${seed.city}, ${seed.region} — ${seed.sector.toLowerCase()}. Değerlendirme dosyası — yatırım teklifi değildir.`,
    story: {
      origin: seed.storyOrigin,
      today: seed.storyToday,
      production: seed.productionDetail,
    },
    founder: {
      name: seed.founderName,
      role: "Kurucu ortak · Genel müdür",
      note: seed.founderNote,
    },
    funding: {
      purpose: seed.fundingPurpose,
      targetTry: seed.targetTry,
      lines: seed.fundingLines,
    },
    risks: seed.risks,
    process: buildProcess(seed.processDone, activeDate),
    documents: [
      { id: "memorandum", title: "Bilgi formu (izahname)", status: "pending", note: "Komite onayı sonrası" },
      { id: "registry", title: "Ticaret sicil gazetesi", status: "review" },
      { id: "financials", title: "2023–2024 yönetim raporları", status: "review" },
      { id: "export", title: "İhracat faturaları özeti", status: "available" },
      { id: "photos", title: "Fabrika fotoğrafları", status: "available" },
      { id: "field", title: "Saha ziyareti tutanağı", status: seed.processDone >= 3 ? "review" : "pending" },
    ],
    economics: [
      { label: "Kuruluş", value: String(seed.founded) },
      { label: "Çalışan", value: `${seed.employees} kişi` },
      { label: "Kapalı alan", value: seed.facilityArea },
      { label: "İhracat pazarları", value: `${seed.exportMarkets.length} ülke` },
      { label: "Ana müşteri tipi", value: seed.exportMarkets.length >= 3 ? "İhracat distribütörleri · OEM" : "Yurtiçi sanayi · ihracat" },
    ],
    operations: {
      signals: seed.operationalSignals,
      processes: seed.processes,
      materials: seed.materials,
      shifts: seed.operationalSignals.find((s) => s.label.toLowerCase().includes("vardiya"))?.value ?? "2 vardiya · 06:00–22:00",
    },
    timeline: seed.timeline,
    access: {
      status: mapAccessStatus(seed.reviewStatus),
      nextGate: PROCESS_LABELS[Math.min(seed.processDone + 1, PROCESS_LABELS.length - 1)],
    },
    machines: seed.machines,
    bottlenecks: [seed.bottleneck],
    facilityNotes: seed.facilityNotes,
    fieldJournal: seed.journal.map((j) => ({
      date: j.date,
      time: j.time,
      author: j.author ?? "ORTAQ saha ekibi",
      type: j.type ?? "observation",
      text: j.text,
    })),
    inspectionLayers: seed.inspectionLayers,
    exportEvolution: seed.exportEvolution,
    operationalUpdates: seed.updates,
    marketMix: {
      domesticShare: seed.domesticShare,
      exportShare: seed.exportShare,
      segments: [
        { label: "Yurtiçi", share: seed.domesticShare, note: `${seed.city} ve çevre sanayi` },
        { label: "İhracat", share: seed.exportShare, note: seed.exportMarkets.join(", ") },
      ],
    },
    operationalFriction: [
      {
        label: seed.bottleneck.label,
        category: "capacity",
        note: seed.bottleneck.note,
      },
    ],
    gateway: seed.gateway,
  };
}
