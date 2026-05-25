import type { TFunction } from "i18next";
import type {
  ConfidenceBand,
  EnrichmentChannel,
  SupplierProcurementDossier,
  SupplierType,
} from "@/types/supplierDossier";

export function supplierNa(t: TFunction) {
  return {
    rfq: t("supplierDetail.na.rfq"),
    registry: t("supplierDetail.na.registry"),
    disclosed: t("supplierDetail.na.disclosed"),
    viewRecord: t("supplierDetail.na.viewRecord"),
    trackedInternally: t("supplierDetail.na.trackedInternally"),
    routedViaTeam: t("supplierDetail.na.routedViaTeam"),
  };
}

export function buildBuyerFit(type: SupplierType, t: TFunction): string[] {
  const items: string[] = [];
  if (type === "manufacturer") {
    items.push(t("supplierDetail.buyerFit.mfg1"), t("supplierDetail.buyerFit.mfg2"));
  }
  if (type === "trader") {
    items.push(t("supplierDetail.buyerFit.trader1"), t("supplierDetail.buyerFit.trader2"));
  }
  if (type === "distributor") {
    items.push(t("supplierDetail.buyerFit.dist1"), t("supplierDetail.buyerFit.dist2"));
  }
  items.push(t("supplierDetail.buyerFit.common1"), t("supplierDetail.buyerFit.common2"));
  return Array.from(new Set(items)).slice(0, 4);
}

export function buildRfqRecommendations(_strategicTag: string | undefined, t: TFunction): string[] {
  return [
    t("supplierDetail.rfqRec.spec"),
    t("supplierDetail.rfqRec.qty"),
    t("supplierDetail.rfqRec.origin"),
    t("supplierDetail.rfqRec.incoterm"),
    t("supplierDetail.rfqRec.lead"),
    t("supplierDetail.rfqRec.price"),
    t("supplierDetail.rfqRec.docs"),
  ];
}

export function buildQualificationChecks(d: SupplierProcurementDossier, t: TFunction): string[] {
  const checks = [
    t("supplierDetail.qual.registry"),
    t("supplierDetail.qual.references"),
    t("supplierDetail.qual.mtc"),
    t("supplierDetail.qual.iso"),
    t("supplierDetail.qual.bank"),
  ];
  if (d.type === "trader" || d.type === "distributor") {
    checks.push(t("supplierDetail.qual.trace"));
  }
  if (!d.verification.registryVerified) {
    checks.unshift(t("supplierDetail.qual.inProgress"));
  }
  return checks.slice(0, 6);
}

export function profileStrengthBucket(pct: number, t: TFunction): { label: string; color: string; help: string } {
  if (pct >= 85) {
    return { label: t("supplierDetail.strength.strong.label"), color: "emerald", help: t("supplierDetail.strength.strong.help") };
  }
  if (pct >= 65) {
    return { label: t("supplierDetail.strength.workable.label"), color: "blue", help: t("supplierDetail.strength.workable.help") };
  }
  if (pct >= 40) {
    return { label: t("supplierDetail.strength.limited.label"), color: "amber", help: t("supplierDetail.strength.limited.help") };
  }
  return { label: t("supplierDetail.strength.sparse.label"), color: "slate", help: t("supplierDetail.strength.sparse.help") };
}

export function buildSuitabilityTags(d: SupplierProcurementDossier, t: TFunction): string[] {
  const tags: string[] = [];
  if (d.verification.registryVerified) tags.push(t("supplierDetail.tag.registryVerified"));
  if (d.verification.contactVerified) tags.push(t("supplierDetail.tag.contactVerified"));
  if (d.type === "manufacturer") tags.push(t("supplierDetail.tag.directManufacturer"));
  if (d.type === "trader") tags.push(t("supplierDetail.tag.trader"));
  if (d.exportMarkets.length > 0) tags.push(t("supplierDetail.tag.exportRecord"));
  if (d.country) tags.push(t("supplierDetail.tag.origin", { country: d.country }));
  return Array.from(new Set(tags)).slice(0, 6);
}

export function communicationReadinessBand(d: SupplierProcurementDossier, t: TFunction): {
  label: string;
  tone: "emerald" | "blue" | "amber" | "slate";
  help: string;
} {
  if (d.contactReleasable) {
    return {
      label: t("supplierDetail.comms.directAfterRfq"),
      tone: "emerald",
      help: t("supplierDetail.comms.directAfterRfqHelp"),
    };
  }
  if (d.verification.registryVerified) {
    return {
      label: t("supplierDetail.comms.teamRouted"),
      tone: "blue",
      help: t("supplierDetail.comms.teamRoutedHelp"),
    };
  }
  return {
    label: t("supplierDetail.comms.pending"),
    tone: "amber",
    help: t("supplierDetail.comms.pendingHelp"),
  };
}

export function formatMoq(d: SupplierProcurementDossier, t: TFunction): string {
  const c = d.commercial;
  if (c.minOrderValue === null) return t("supplierDetail.na.rfq");
  const ccy = c.currency || "USD";
  return `${ccy} ${c.minOrderValue.toLocaleString()}`;
}

export function formatLeadTime(days: number | null, t: TFunction): string {
  if (days === null) return t("supplierDetail.na.rfq");
  if (days <= 14) return t("supplierDetail.leadTime.weeks2", { days });
  if (days <= 30) return t("supplierDetail.leadTime.month1", { days });
  if (days <= 60) return t("supplierDetail.leadTime.months2", { days });
  return t("supplierDetail.leadTime.days", { days });
}

export function buildOperationalMaturity(d: SupplierProcurementDossier, t: TFunction): string[] {
  const items: string[] = [];
  if (d.yearEstablished) {
    const yrs = new Date().getFullYear() - d.yearEstablished;
    if (yrs >= 25) items.push(t("supplierDetail.maturity.yearsPlus", { years: yrs }));
    else if (yrs >= 10) items.push(t("supplierDetail.maturity.established", { years: yrs }));
    else if (yrs >= 0) items.push(t("supplierDetail.maturity.since", { year: d.yearEstablished }));
  }
  if (d.employeeBand) items.push(t("supplierDetail.maturity.workforceBand", { band: d.employeeBand }));
  else if (d.employeeCount) items.push(t("supplierDetail.maturity.workforceCount", { count: d.employeeCount }));
  if (d.verification.registryVerified) items.push(t("supplierDetail.maturity.registryLocated"));
  if (d.verification.contactVerified) items.push(t("supplierDetail.maturity.contactConfirmed"));
  if (d.certifications.length > 0) {
    items.push(t("supplierDetail.maturity.certs", { count: d.certifications.length }));
  }
  return items;
}

export function buildExportLogistics(d: SupplierProcurementDossier, t: TFunction): string[] {
  const items: string[] = [];
  if (d.exportMarkets.length > 0) {
    const markets = `${d.exportMarkets.slice(0, 4).join(", ")}${d.exportMarkets.length > 4 ? "…" : ""}`;
    items.push(t("supplierDetail.export.confirmed", { markets }));
  } else {
    items.push(t("supplierDetail.export.pending"));
  }
  if (d.commercial.incoterms.length > 0) {
    items.push(t("supplierDetail.export.incoterms", { terms: d.commercial.incoterms.join(", ") }));
  }
  if (d.commercial.leadTimeDays !== null) {
    items.push(t("supplierDetail.export.leadTime", { time: formatLeadTime(d.commercial.leadTimeDays, t).replace(/^~/, "") }));
  }
  if (d.country) {
    items.push(t("supplierDetail.export.operating", { location: `${d.country}${d.city ? ` (${d.city})` : ""}` }));
  }
  return items;
}

export function buildSourcingScenarios(d: SupplierProcurementDossier, t: TFunction): string[] {
  const out: string[] = [];
  if (d.type === "manufacturer") out.push(t("supplierDetail.buyerFit.mfg1"));
  if (d.type === "trader") out.push(t("supplierDetail.buyerFit.trader1"));
  if (d.type === "distributor") out.push(t("supplierDetail.buyerFit.dist1"));
  if (d.exportMarkets.length > 0) {
    out.push(t("supplierDetail.export.confirmed", {
      markets: d.exportMarkets.slice(0, 3).join(", "),
    }));
  }
  return Array.from(new Set(out)).slice(0, 4);
}

export function channelLabel(kind: EnrichmentChannel["kind"], t: TFunction): string {
  const map: Record<EnrichmentChannel["kind"], string> = {
    website: t("supplierDetail.channel.website"),
    linkedin: t("supplierDetail.channel.linkedin"),
    email: t("supplierDetail.channel.email"),
    phone: t("supplierDetail.channel.phone"),
    address: t("supplierDetail.channel.address"),
  };
  return map[kind];
}

export function channelDisplay(ch: EnrichmentChannel, t: TFunction): string {
  if (!ch.preview) return t("supplierDetail.channel.onFile", { count: ch.count });
  if (ch.kind === "email") return maskEmail(ch.preview);
  if (ch.kind === "phone") return maskPhone(ch.preview);
  return ch.preview;
}

export function confidenceLabel(band: ConfidenceBand, t: TFunction): string {
  const map: Record<ConfidenceBand, string> = {
    "Operator Reviewed": t("supplierDetail.confidence.operatorReviewed"),
    "Registry Verified": t("supplierDetail.confidence.registryVerified"),
    "Domain Verified": t("supplierDetail.confidence.domainVerified"),
    "Self Reported": t("supplierDetail.confidence.selfReported"),
    "Pending Verification": t("supplierDetail.confidence.pending"),
  };
  return map[band];
}

export function supplierTypeLabel(type: SupplierType | string | null | undefined, t: TFunction): string {
  if (type === "manufacturer") return t("supplierDetail.type.manufacturer");
  if (type === "trader") return t("supplierDetail.type.trader");
  if (type === "distributor") return t("supplierDetail.type.distributor");
  return type ? String(type) : t("supplierDetail.na.disclosed");
}

export function formatDate(iso: string, t: TFunction): string {
  try {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return t("supplierDetail.na.trackedInternally");
    return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return t("supplierDetail.na.trackedInternally");
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "•••";
  const head = local.slice(0, Math.min(2, local.length));
  return `${head}${"•".repeat(Math.max(local.length - head.length, 2))}@${domain}`;
}

function maskPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.length < 4) return "•••";
  const tail = cleaned.slice(-3);
  return `${cleaned.slice(0, Math.min(3, cleaned.length - 3))} ••• ${tail}`;
}

export function profileCompletenessPct(d: SupplierProcurementDossier): number {
  const checks: boolean[] = [
    !!d.companyName,
    !!d.country,
    !!d.city,
    !!d.industry,
    !!d.subIndustry,
    d.products.length > 0,
    d.certifications.length > 0,
    d.exportMarkets.length > 0,
    d.commercial.minOrderValue !== null,
    d.commercial.paymentTerms.length > 0,
    d.commercial.incoterms.length > 0,
    d.commercial.leadTimeDays !== null,
    d.commercial.responseTime !== null,
    d.yearEstablished !== null,
    d.employeeCount !== null || !!d.employeeBand,
    !!d.tagline || !!d.description,
    d.rating !== null,
    d.verification.registryVerified,
    !!d.provenance.registryUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
