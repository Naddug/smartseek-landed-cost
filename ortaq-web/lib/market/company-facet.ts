import type { SimulatedCampaign } from "@/lib/campaigns/types";
import {
  formatDaysAgo,
  getExportMarketsLine,
  getLastUpdatedIso,
  getSectorTag,
} from "@/lib/product/company-summary";
import { getOperationalRelevanceLine } from "@/lib/product/operational-relevance";
import { reviewStatusLabels } from "@/lib/product/home-data";

export type CompanyFacet = {
  situation: string;
  tradeName: string;
  city: string;
  sector: string;
  employees: number;
  exportSummary: string;
  updatedAgo: string | null;
  reviewLabel: string;
  /** One verifiable fact from dossier (capacity/export). */
  proofLine: string;
};

function buildProofLine(c: SimulatedCampaign): string {
  const capacity = c.operations.signals.find((s) =>
    /kapasite|capacity|üretim|output/i.test(s.label),
  );
  const exportSig = c.operations.signals.find((s) => /ihracat|export/i.test(s.label));
  if (exportSig?.value && capacity?.value) {
    return `${capacity.value} · ihracat ${exportSig.value}`;
  }
  if (exportSig?.value) return `İhracat payı ${exportSig.value}`;
  if (capacity?.value) return capacity.value;
  const markets = getExportMarketsLine(c, 2);
  if (markets) return `İhracat: ${markets}`;
  return `${c.employees} çalışan`;
}

export function getCompanyFacet(c: SimulatedCampaign, locale = "tr-TR"): CompanyFacet {
  const lastIso = getLastUpdatedIso(c);
  return {
    situation: getOperationalRelevanceLine(c),
    tradeName: c.tradeName,
    city: c.city,
    sector: getSectorTag(c),
    employees: c.employees,
    exportSummary: getExportMarketsLine(c, 3) || "—",
    updatedAgo: lastIso ? formatDaysAgo(lastIso, locale) : null,
    reviewLabel: reviewStatusLabels[c.reviewStatus],
    proofLine: buildProofLine(c),
  };
}
