import type { VerificationPublicLabel } from "@/lib/trust/types";

export type CampaignStatus = "preliminary_review" | "document_review" | "field_verification" | "committee";

export type CampaignDocument = {
  id: string;
  title: string;
  status: "available" | "pending" | "review";
  note?: string;
};

export type FundingLine = {
  label: string;
  amountTry: number;
  percent: number;
};

export type CampaignRisk = {
  title: string;
  text: string;
};

export type CampaignProcessStep = {
  label: string;
  status: "done" | "active" | "pending";
  date?: string;
};

export type OperationalSignal = {
  label: string;
  value: string;
};

export type CampaignTimelineEvent = {
  year: number;
  event: string;
};

export type CampaignAccess = {
  status: "preliminary" | "document_review" | "field_verification" | "committee" | "partial_open";
  nextGate: string;
};

export type MachineAsset = {
  id: string;
  name: string;
  role: string;
  year: number;
  note: string;
};

export type ProductionBottleneck = {
  label: string;
  note: string;
};

export type FacilityZone = {
  zone: string;
  note: string;
};

export type FieldJournalEntry = {
  date: string;
  time: string;
  author: string;
  text: string;
  type: "observation" | "inspection" | "capacity" | "logistics" | "founder";
};

export type InspectionLayer = {
  layer: string;
  status: "pending" | "partial" | "done";
  note: string;
};

export type ExportEvolution = {
  year: number;
  market: string;
  note: string;
};

export type OperationalUpdate = {
  date: string;
  time: string;
  text: string;
};

export type SimulatedCampaign = {
  slug: string;
  /** Display, simulated dossier, not a live offer */
  simulated: true;
  legalName: string;
  tradeName: string;
  sector: string;
  city: string;
  region: string;
  founded: number;
  employees: number;
  exportMarkets: string[];
  annualRevenueNote: string;
  productionNote: string;
  verificationLabel: VerificationPublicLabel;
  reviewStatus: CampaignStatus;
  story: {
    origin: string;
    today: string;
    production: string;
  };
  founder: {
    name: string;
    role: string;
    note: string;
  };
  funding: {
    purpose: string;
    targetTry: number;
    lines: FundingLine[];
  };
  risks: CampaignRisk[];
  process: CampaignProcessStep[];
  documents: CampaignDocument[];
  economics: { label: string; value: string }[];
  operations: {
    signals: OperationalSignal[];
    processes: string[];
    materials: string[];
    shifts: string;
  };
  timeline: CampaignTimelineEvent[];
  access: CampaignAccess;
  machines: MachineAsset[];
  bottlenecks: ProductionBottleneck[];
  facilityNotes: FacilityZone[];
  fieldJournal: FieldJournalEntry[];
  inspectionLayers: InspectionLayer[];
  exportEvolution: ExportEvolution[];
  operationalUpdates: OperationalUpdate[];
  /** Domestic vs export mix and customer segments */
  marketMix: {
    domesticShare: string;
    exportShare: string;
    segments: { label: string; share: string; note: string }[];
  };
  /** Supply, workforce, and timing friction beyond bottlenecks */
  operationalFriction: {
    label: string;
    category: "supply" | "capacity" | "workforce" | "export" | "equipment";
    note: string;
  }[];
  /** Homepage gateway presentation, sector energy, not generic card template */
  gateway?: {
    hook: string;
    scale: string;
    tension: string;
  };
  seoTitle: string;
  seoDescription: string;
  /** Optional MoU / term-sheet status, rendered quietly in dossier header when set */
  mouStatus?: string;
};
