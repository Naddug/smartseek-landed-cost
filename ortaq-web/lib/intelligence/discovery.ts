import { listCampaigns } from "@/lib/campaigns";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { getSectorTagEn } from "@/lib/product/company-summary";
import { industrialSectors, sectorMatchers } from "@/lib/product/home-data";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";

export type IntelligenceProfile = {
  slug: string;
  tradeName: string;
  city: string;
  exportExposure: string;
  workforceDependency: string;
  machineryMaturity: string;
  operationalComplexity: string;
  productionScale: string;
};

export type OpportunityTag =
  | "export_heavy"
  | "capacity_constrained"
  | "second_generation"
  | "regional_champion"
  | "field_active"
  | "under_evaluation";

export type OpportunityCluster = {
  tag: OpportunityTag;
  campaigns: SimulatedCampaign[];
};

const OPPORTUNITY_MAP: Record<string, OpportunityTag[]> = {
  "karat-parca-konya": ["export_heavy", "capacity_constrained", "field_active"],
  "demir-tekstil-bursa": ["regional_champion", "under_evaluation"],
  "yildiz-dokum-manisa": ["export_heavy", "second_generation", "field_active"],
  "anatolia-gida-gaziantep": ["export_heavy", "capacity_constrained", "field_active"],
  "trakya-un-edirne": ["export_heavy", "capacity_constrained", "regional_champion"],
  "eskisehir-seramik": ["export_heavy", "capacity_constrained", "field_active"],
  "antalya-sera-teknoloji": ["export_heavy", "capacity_constrained", "under_evaluation"],
  "trabzon-findik-isleme": ["export_heavy", "regional_champion", "field_active"],
  "denizli-iplik-dokuma": ["export_heavy", "capacity_constrained", "under_evaluation"],
  "tekirdag-ambalaj-plastik": ["export_heavy", "field_active", "regional_champion"],
  "atlas-lojistik-istanbul": ["export_heavy", "field_active"],
  "adana-tarim-isleme": ["export_heavy", "capacity_constrained", "field_active"],
};

export function getIntelligenceProfile(c: SimulatedCampaign): IntelligenceProfile {
  const exportExposure =
    c.marketMix?.exportShare ??
    c.operations.signals.find((s) => /ihracat|export/i.test(s.label))?.value ??
    "—";

  const workforceEntry =
    c.operationalFriction.find((f) => f.category === "workforce") ??
    c.bottlenecks.find((b) => /operatör|usta|işgücü|workforce/i.test(b.label));

  const oldestYear = c.machines.length > 0 ? Math.min(...c.machines.map((m) => m.year)) : c.founded;
  const age = new Date().getFullYear() - oldestYear;
  const complexityScore = c.bottlenecks.length + c.risks.length;
  const complexity =
    complexityScore >= 6 ? "high" : complexityScore >= 4 ? "moderate" : "contained";

  const capacitySignal = c.operations.signals.find((s) => /kapasite|capacity|üretim|output/i.test(s.label));

  return {
    slug: c.slug,
    tradeName: c.tradeName,
    city: c.city,
    exportExposure,
    workforceDependency: workforceEntry?.label ?? "—",
    machineryMaturity: `${oldestYear} · ${age}y`,
    operationalComplexity: complexity,
    productionScale: capacitySignal?.value ?? `${c.employees} employees`,
  };
}

export function listIntelligenceProfiles(): IntelligenceProfile[] {
  return listCampaigns().map(getIntelligenceProfile);
}

export function getOpportunityTags(c: SimulatedCampaign): OpportunityTag[] {
  return OPPORTUNITY_MAP[c.slug] ?? [];
}

export function listOpportunityClusters(): OpportunityCluster[] {
  const tags: OpportunityTag[] = [
    "export_heavy",
    "capacity_constrained",
    "second_generation",
    "regional_champion",
    "field_active",
    "under_evaluation",
  ];

  return tags
    .map((tag) => ({
      tag,
      campaigns: listCampaigns().filter((c) => getOpportunityTags(c).includes(tag)),
    }))
    .filter((cluster) => cluster.campaigns.length > 0);
}

export function getReviewQueueBreakdown(): Record<SimulatedCampaign["reviewStatus"], number> {
  const counts: Record<SimulatedCampaign["reviewStatus"], number> = {
    preliminary_review: 0,
    document_review: 0,
    field_verification: 0,
    committee: 0,
  };
  for (const c of listCampaigns()) {
    counts[c.reviewStatus] += 1;
  }
  return counts;
}

export function getSectorClusters() {
  const campaigns = listCampaigns();

  return industrialSectors
    .map((sector) => {
      const matcher = sectorMatchers[sector.id];
      const matched = matcher ? campaigns.filter((c) => matcher.test(c.sector)) : [];
      const tension = matched[0] ? getCampaignTensionLine(matched[0]) : null;
      return {
        ...sector,
        count: matched.length,
        cities: Array.from(new Set(matched.map((c) => c.city))),
        campaigns: matched,
        sampleTension: tension,
      };
    })
    .filter((s) => s.count > 0);
}

export function getFeaturedSlug(): string {
  return "adana-tarim-isleme";
}

/** Cross-sector discovery — same opportunity profile or sector family. */
export function getRelatedCampaigns(slug: string, limit = 3): SimulatedCampaign[] {
  const source = listCampaigns().find((c) => c.slug === slug);
  if (!source) return [];

  const sourceTags = new Set(getOpportunityTags(source));
  const sourceSector = getSectorTagEn(source);

  return listCampaigns()
    .filter((c) => c.slug !== slug)
    .map((c) => {
      let score = 0;
      if (getSectorTagEn(c) === sourceSector) score += 2;
      for (const tag of getOpportunityTags(c)) {
        if (sourceTags.has(tag)) score += 1;
      }
      return { c, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ c }) => c);
}
