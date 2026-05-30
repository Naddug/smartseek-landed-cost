import { listCampaigns } from "@/lib/campaigns";
import { getSectorClusters } from "@/lib/intelligence/discovery";

/** SEO copy helpers, data only, no UI. */
export function getEcosystemSeoSummary(): {
  companyCount: number;
  cityCount: number;
  sectorCount: number;
  cities: string[];
  activityTraces: number;
} {
  const campaigns = listCampaigns();
  const cities = Array.from(new Set(campaigns.map((c) => c.city))).sort();
  const sectors = getSectorClusters();
  const activityTraces = campaigns.reduce(
    (sum, c) => sum + c.fieldJournal.length + c.operationalUpdates.length, 0, );

  return {
    companyCount: campaigns.length, cityCount: cities.length, sectorCount: sectors.length, cities, activityTraces, };
}

export function buildCompaniesPageDescription(): string {
  const { companyCount, cityCount, sectorCount, cities, activityTraces } = getEcosystemSeoSummary();
  const citySample = cities.slice(0, 6).join(", ");
  return (
    `${companyCount} üretim şirketi · ${sectorCount} sektör · ${cityCount} şehir (${citySample}…). ` +
    `Paya dayalı ortaklık dosyaları, saha incelemesi ve ${activityTraces}+ operasyonel iz. ` +
    `Yatırım fırsatları ve şirket incelemesi : yatırım teklifi değildir.`
  );
}

export const HOME_SEO_KEYWORDS = [
  "yatırım fırsatları", "üretim şirketleri", "gerçek şirket ortaklığı", "paya dayalı yatırım", "sanayi yatırımı", "ihracat odaklı şirketler", "operasyonel büyüme", "şirket inceleme", "Türk sanayi ortaklığı",
] as const;
