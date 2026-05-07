import { useEffect, useMemo, useState } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft, ShieldCheck, Star, FileText, Globe, Phone, Mail, Building2,
  Bookmark, Scale, CheckCircle2, ListChecks, Compass, ClipboardCheck, Lock,
  ExternalLink, Truck, Tags, BadgeCheck, Layers, Activity, Linkedin,
  Network, Gauge, MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type {
  ConfidenceBand,
  EnrichmentChannel,
  EnrichmentSnapshot,
  SupplierProcurementDossier,
  SupplierType,
} from "@/types/supplierDossier";

// ── Helpers ──────────────────────────────────────────────────────────────────

function countryFlag(countryCode: string | null | undefined): string {
  if (!countryCode) return "🌍";
  const flags: Record<string, string> = {
    CN: "🇨🇳", IN: "🇮🇳", VN: "🇻🇳", TR: "🇹🇷", DE: "🇩🇪", TH: "🇹🇭",
    BR: "🇧🇷", US: "🇺🇸", MX: "🇲🇽", ID: "🇮🇩", PL: "🇵🇱", IT: "🇮🇹",
    KR: "🇰🇷", AT: "🇦🇹", AU: "🇦🇺", CA: "🇨🇦", GB: "🇬🇧", NL: "🇳🇱",
    JP: "🇯🇵", ES: "🇪🇸", FR: "🇫🇷",
  };
  return flags[countryCode.toUpperCase()] ?? "🌍";
}

// Strategic tag → internal category slug. Tags themselves are normalised on
// the server; this map only handles route resolution and may be empty when
// no canonical category page exists yet.
const STRATEGIC_TAG_TO_SLUG: Record<string, string> = {
  Antimony: "antimony",
  Tungsten: "tungsten",
  Tin: "tin",
  Copper: "copper-cathode",
  Aluminium: "aluminum",
  Steel: "steel",
  Alloys: "steel",
  "Rare Earths": "rare-earths",
  Lithium: "lithium-batteries",
  Nickel: "nickel",
  Cobalt: "cobalt",
};

const NA_RFQ = "Available upon RFQ qualification" as const;
const NA_REGISTRY = "Registry verification pending" as const;
const NA_DISCLOSED = "Not publicly disclosed" as const;

function buildBuyerFit(type: SupplierType): string[] {
  const items: string[] = [];
  if (type === "manufacturer") {
    items.push("OEM and direct-from-mill procurement");
    items.push("Programs requiring traceable production origin");
  }
  if (type === "trader") {
    items.push("Spot purchases and blended sourcing programs");
    items.push("Buyers needing flexible incoterms and origin mix");
  }
  if (type === "distributor") {
    items.push("Recurring replenishment with shorter lead times");
    items.push("Buyers without container-level minimums");
  }
  items.push("Strategic sourcing and category management teams");
  items.push("Industrial buyers running structured RFQs");
  return Array.from(new Set(items)).slice(0, 4);
}

function buildRfqRecommendations(strategicTag: string | undefined): string[] {
  const generic = [
    "Exact specification and tolerance (purity, grade, dimensions, alloy content)",
    "Quantity, packaging, and unit",
    "Origin / country-of-manufacture preference",
    "Incoterm and destination port",
    "Lead time and required delivery window",
    "Target price reference and currency",
    "Quality documents required (mill test cert, COA, ISO scope)",
  ];
  const tag = (strategicTag ?? "").toLowerCase();
  const commodityHints: string[] = [];
  if (tag === "antimony")    commodityHints.push("Form (ingot vs trioxide), purity (99.65% min), packaging (drum / IBC)");
  if (tag === "copper")      commodityHints.push("Cathode grade (LME Grade A), shape (cathode / rod), origin");
  if (tag === "steel")       commodityHints.push("Grade (e.g. S235JR), thickness, surface finish, certification scope");
  if (tag === "tungsten")    commodityHints.push("Form (APT / oxide / ferro), WO3 content, packaging");
  if (tag === "tin")         commodityHints.push("LME-grade purity, ingot vs solder alloy composition");
  if (tag === "lithium")     commodityHints.push("Battery vs technical grade, carbonate vs hydroxide, moisture spec");
  if (tag === "rare earths") commodityHints.push("Specific oxide (NdPr, Dy, Tb), purity, monazite/bastnaesite source");
  if (tag === "alloys")      commodityHints.push("Alloy designation, composition window, heat treatment");
  if (tag === "aluminium")   commodityHints.push("Alloy series (e.g. 6061-T6), form (billet / extrusion / sheet)");
  return [...commodityHints, ...generic].slice(0, 7);
}

function buildQualificationChecks(d: SupplierProcurementDossier): string[] {
  const checks = [
    "Confirm legal entity status against the company registry",
    "Request three recent buyer references in your destination region",
    "Request a current mill test certificate or certificate of analysis",
    "Verify ISO / industry certifications are in scope and unexpired",
    "Confirm bank account is held in the same legal entity name",
  ];
  if (d.type === "trader" || d.type === "distributor") {
    checks.push("Ask for the underlying producer / mill source for traceability");
  }
  if (!d.verification.registryVerified) {
    checks.unshift("Treat as Verification In Progress — request registry extract before sample order");
  }
  return checks.slice(0, 6);
}

function profileStrengthBucket(pct: number): { label: string; color: string; help: string } {
  if (pct >= 85) return { label: "Strong",   color: "emerald", help: "Most procurement metadata is present. Ready for RFQ." };
  if (pct >= 65) return { label: "Workable", color: "blue",    help: "Enough metadata for RFQ; some fields will be confirmed during qualification." };
  if (pct >= 40) return { label: "Limited",  color: "amber",   help: "Several procurement fields missing. RFQ qualification will fill the gaps." };
  return { label: "Sparse", color: "slate", help: "Limited published metadata. Submit an RFQ — our operator will collect details directly." };
}

function buildSuitabilityTags(d: SupplierProcurementDossier): string[] {
  const tags: string[] = [];
  if (d.verification.registryVerified) tags.push("Registry-verified");
  if (d.verification.contactVerified) tags.push("Operator-verified contact");
  if (d.rating !== null && d.rating >= 4.5) tags.push("High buyer-rating signal");
  if (d.type === "manufacturer") tags.push("Direct manufacturer");
  if (d.type === "trader") tags.push("Trader / distribution");
  if (d.exportMarkets.length > 0) tags.push("Export track record");
  if (d.country) tags.push(`${d.country} origin`);
  return Array.from(new Set(tags)).slice(0, 6);
}

function communicationReadinessBand(d: SupplierProcurementDossier): {
  label: string;
  tone: "emerald" | "blue" | "amber" | "slate";
  help: string;
} {
  if (d.contactReleasable) {
    return {
      label: "Direct after RFQ qualification",
      tone: "emerald",
      help: "Contact channel will be released to your team once a SmartSeek operator screens your RFQ.",
    };
  }
  if (d.verification.registryVerified) {
    return {
      label: "Operator-mediated",
      tone: "blue",
      help: "Contact details are released after RFQ screening to protect both sides from spam and unsolicited outreach.",
    };
  }
  return {
    label: "Operator-mediated · verification pending",
    tone: "amber",
    help: "We will confirm the supplier's registry record before releasing direct contact details.",
  };
}

function profileCompletenessPct(d: SupplierProcurementDossier): number {
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
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function formatMoq(d: SupplierProcurementDossier): string {
  const c = d.commercial;
  if (c.minOrderValue === null) return NA_RFQ;
  const ccy = c.currency || "USD";
  return `${ccy} ${c.minOrderValue.toLocaleString()}`;
}

function formatLeadTime(days: number | null): string {
  if (days === null) return NA_RFQ;
  if (days <= 14) return `~${days} days (within 2 weeks)`;
  if (days <= 30) return `~${days} days (within 1 month)`;
  if (days <= 60) return `~${days} days (1–2 months)`;
  return `~${days} days`;
}

function buildOperationalMaturity(d: SupplierProcurementDossier): string[] {
  const items: string[] = [];
  if (d.yearEstablished) {
    const yrs = new Date().getFullYear() - d.yearEstablished;
    if (yrs >= 25) items.push(`${yrs}+ years of trading history`);
    else if (yrs >= 10) items.push(`Established ${yrs} years ago`);
    else if (yrs >= 0) items.push(`Operating since ${d.yearEstablished}`);
  }
  if (d.employeeBand) items.push(`Workforce band ${d.employeeBand}`);
  else if (d.employeeCount) items.push(`Reported workforce ~${d.employeeCount.toLocaleString()}`);
  if (d.verification.registryVerified) items.push("Registry record located and verified");
  if (d.verification.contactVerified) items.push("Operator-confirmed direct contact");
  if (d.certifications.length > 0) {
    items.push(`${d.certifications.length} published certification${d.certifications.length === 1 ? "" : "s"} on file`);
  }
  return items;
}

function buildExportLogistics(d: SupplierProcurementDossier): string[] {
  const items: string[] = [];
  if (d.exportMarkets.length > 0) {
    items.push(`Confirmed export to ${d.exportMarkets.slice(0, 4).join(", ")}${d.exportMarkets.length > 4 ? "…" : ""}`);
  } else {
    items.push("Export track record will be confirmed during RFQ qualification");
  }
  if (d.commercial.incoterms.length > 0) {
    items.push(`Published incoterms: ${d.commercial.incoterms.join(", ")}`);
  }
  if (d.commercial.leadTimeDays !== null) {
    items.push(`Stated lead time ${formatLeadTime(d.commercial.leadTimeDays).replace(/^~/, "")}`);
  }
  if (d.country) {
    items.push(`Operating from ${d.country}${d.city ? ` (${d.city})` : ""}`);
  }
  return items;
}

function buildSourcingScenarios(d: SupplierProcurementDossier): string[] {
  const out: string[] = [];
  const tag = (d.strategicTags[0] || "").toLowerCase();
  if (d.type === "manufacturer") {
    out.push("Direct-from-mill / OEM procurement with traceable origin");
  }
  if (d.type === "trader") {
    out.push("Spot market purchases and origin-blended sourcing");
  }
  if (d.type === "distributor") {
    out.push("Recurring industrial replenishment without container minimums");
  }
  if (tag === "copper") out.push("Cathode and rod programs benchmarked to LME Grade A");
  else if (tag === "antimony") out.push("Antimony ingot or trioxide procurement at industrial purity");
  else if (tag === "tungsten") out.push("Refractory and superalloy feed (APT, oxide, ferro)");
  else if (tag === "tin") out.push("LME-grade tin ingot and solder alloy procurement");
  else if (tag === "steel" || tag === "alloys") out.push("Mill-cert backed flat / long products and engineering alloys");
  else if (tag === "lithium") out.push("Battery-grade carbonate / hydroxide procurement with moisture spec");
  else if (tag === "rare earths") out.push("Specific oxide programs (NdPr, Dy, Tb) with declared origin");
  else if (tag === "aluminium") out.push("Alloy-series aluminium (e.g. 6061, 5052) in billet / extrusion / sheet");
  if (d.exportMarkets.length > 0) {
    out.push(`Cross-border buyers in ${d.exportMarkets.slice(0, 3).join(", ")} with FCA/FOB/CIF terms`);
  }
  return Array.from(new Set(out)).slice(0, 4);
}

const CHANNEL_ICONS: Record<EnrichmentChannel["kind"], React.ReactNode> = {
  website: <Globe className="w-4 h-4 text-slate-500" />,
  linkedin: <Linkedin className="w-4 h-4 text-blue-600" />,
  email: <Mail className="w-4 h-4 text-slate-500" />,
  phone: <Phone className="w-4 h-4 text-slate-500" />,
  address: <MapPin className="w-4 h-4 text-slate-500" />,
};

const CHANNEL_LABELS: Record<EnrichmentChannel["kind"], string> = {
  website: "Website",
  linkedin: "LinkedIn company page",
  email: "Business email",
  phone: "Business phone",
  address: "Registry address",
};

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

function channelDisplay(ch: EnrichmentChannel): string {
  if (!ch.preview) return `${ch.count} on file · released after RFQ qualification`;
  if (ch.kind === "email") return maskEmail(ch.preview);
  if (ch.kind === "phone") return maskPhone(ch.preview);
  return ch.preview;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SupplierDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/supplier/:slug");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [dossier, setDossier] = useState<SupplierProcurementDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    if (!match || !params?.slug) return;
    if (authLoading) return; // wait for auth resolution to pick the right endpoint
    setLoading(true);
    setError("");
    const url = isAuthenticated
      ? `/api/suppliers/${encodeURIComponent(params.slug)}`
      : `/api/public/suppliers/${encodeURIComponent(params.slug)}`;
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.error || "Supplier not found");
        return data;
      })
      .then((data) => {
        const d = (data as { dossier?: SupplierProcurementDossier }).dossier ?? null;
        setDossier(d);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [match, params?.slug, isAuthenticated, authLoading]);

  const buyerFit = useMemo(
    () => (dossier ? buildBuyerFit(dossier.type) : []),
    [dossier]
  );
  const rfqRecs = useMemo(
    () => (dossier ? buildRfqRecommendations(dossier.strategicTags[0]) : []),
    [dossier]
  );
  const qualChecks = useMemo(
    () => (dossier ? buildQualificationChecks(dossier) : []),
    [dossier]
  );
  const suitabilityTags = useMemo(
    () => (dossier ? buildSuitabilityTags(dossier) : []),
    [dossier]
  );
  const completeness = useMemo(
    () => (dossier ? profileCompletenessPct(dossier) : 0),
    [dossier]
  );
  const strengthBucket = useMemo(
    () => profileStrengthBucket(completeness),
    [completeness]
  );
  const commsBand = useMemo(
    () => (dossier ? communicationReadinessBand(dossier) : null),
    [dossier]
  );
  const operationalMaturity = useMemo(
    () => (dossier ? buildOperationalMaturity(dossier) : []),
    [dossier]
  );
  const exportLogistics = useMemo(
    () => (dossier ? buildExportLogistics(dossier) : []),
    [dossier]
  );
  const sourcingScenarios = useMemo(
    () => (dossier ? buildSourcingScenarios(dossier) : []),
    [dossier]
  );
  const enrichment: EnrichmentSnapshot | null = dossier?.enrichment ?? null;

  // localStorage persistence: saved + compare lists (unchanged contract)
  useEffect(() => {
    if (!dossier || typeof window === "undefined") return;
    const savedList = JSON.parse(window.localStorage.getItem("saved_suppliers") || "[]") as string[];
    const compareList = JSON.parse(window.localStorage.getItem("compare_suppliers") || "[]") as string[];
    setSaved(savedList.includes(dossier.slug));
    setInCompare(compareList.includes(dossier.slug));
  }, [dossier]);

  // SEO: title, description, canonical, JSON-LD (Organization + BreadcrumbList)
  useEffect(() => {
    if (!dossier) return;
    const title = `${dossier.companyName} – supplier profile | SmartSeek`;
    const locationLabel = [dossier.city, dossier.country].filter(Boolean).join(", ");
    const typeLabel = dossier.type ? ` ${dossier.type}` : " supplier";
    const desc = [
      `${dossier.companyName} is a${typeLabel} based in ${locationLabel || "an undisclosed location"}.`,
      dossier.industry
        ? `${dossier.industry}${dossier.subIndustry ? ` · ${dossier.subIndustry}` : ""}.`
        : "",
      "Review sourcing fit, verification status, and RFQ guidance on SmartSeek.",
    ]
      .filter(Boolean)
      .join(" ");
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://smartseek.com/supplier/${dossier.slug}`;

    const breadcrumbCategorySlug = STRATEGIC_TAG_TO_SLUG[dossier.strategicTags[0] || ""];
    const orgLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": dossier.companyName,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": dossier.country,
        "addressLocality": dossier.city,
      },
      "url": `https://smartseek.com/supplier/${dossier.slug}`,
    };
    if (dossier.industry) orgLd.industry = dossier.industry;
    if (dossier.yearEstablished) orgLd.foundingDate = String(dossier.yearEstablished);
    if (dossier.provenance.registryUrl) orgLd.identifier = dossier.provenance.registryUrl;
    // sameAs: only verified, deterministic links — no inferred social profiles.
    const sameAs: string[] = [];
    if (dossier.enrichment) {
      sameAs.push(`https://${dossier.enrichment.domain}`);
      const linkedinChannel = dossier.enrichment.channels.find((c) => c.kind === "linkedin");
      if (linkedinChannel?.preview) sameAs.push(linkedinChannel.preview);
    }
    if (dossier.provenance.registryUrl) sameAs.push(dossier.provenance.registryUrl);
    if (sameAs.length > 0) orgLd.sameAs = Array.from(new Set(sameAs));
    if (dossier.products.length > 0) {
      orgLd.makesOffer = dossier.products.slice(0, 8).map((p) => ({
        "@type": "Offer",
        "itemOffered": { "@type": "Product", "name": p },
      }));
    }
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartseek.com/" },
        { "@type": "ListItem", "position": 2, "name": "Suppliers", "item": "https://smartseek.com/suppliers" },
        ...(breadcrumbCategorySlug
          ? [{ "@type": "ListItem", "position": 3, "name": dossier.strategicTags[0], "item": `https://smartseek.com/suppliers/${breadcrumbCategorySlug}` }]
          : []),
        { "@type": "ListItem", "position": breadcrumbCategorySlug ? 4 : 3, "name": dossier.companyName, "item": `https://smartseek.com/supplier/${dossier.slug}` },
      ],
    };
    let el = document.getElementById("supplier-detail-ld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "supplier-detail-ld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.text = JSON.stringify([orgLd, breadcrumbLd]);
  }, [dossier]);

  const toggleSavedSupplier = () => {
    if (!dossier || typeof window === "undefined") return;
    const key = "saved_suppliers";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
    const next = saved
      ? current.filter((s) => s !== dossier.slug)
      : Array.from(new Set([...current, dossier.slug]));
    window.localStorage.setItem(key, JSON.stringify(next));
    setSaved(!saved);
  };

  const toggleCompareSupplier = () => {
    if (!dossier || typeof window === "undefined") return;
    const key = "compare_suppliers";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
    let next = current;
    if (inCompare) {
      next = current.filter((s) => s !== dossier.slug);
    } else if (current.length < 3) {
      next = [...current, dossier.slug];
    }
    window.localStorage.setItem(key, JSON.stringify(next));
    setInCompare(next.includes(dossier.slug));
  };

  if (!match) return null;

  const rfqHref = dossier
    ? `/rfq?supplier=${encodeURIComponent(dossier.companyName)}&product=${encodeURIComponent(dossier.products[0] || dossier.industry || "")}`
    : "/rfq";

  return (
    <section className="min-h-[70vh] bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/search">
          <button className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to suppliers
          </button>
        </Link>

        {(loading || authLoading) && (
          <div
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 animate-pulse"
            aria-busy="true"
            aria-live="polite"
          >
            {/* Header skeleton */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-7 w-2/3 bg-slate-200 rounded" />
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
              </div>
              <div className="h-4 w-1/2 bg-slate-100 rounded mb-4" />
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="h-6 w-24 bg-slate-100 rounded-full" />
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-32 bg-amber-50 rounded-full" />
                <div className="h-5 w-28 bg-amber-50 rounded-full" />
              </div>
            </div>
            {/* Profile strength skeleton */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-3 w-32 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded-full" />
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full" />
            </div>
            {/* Quick facts skeleton */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                  <div className="h-5 w-24 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
            {/* Card skeletons */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="h-4 w-32 bg-slate-200 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-5/6 bg-slate-100 rounded" />
                    <div className="h-3 w-4/6 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <span className="sr-only">Loading supplier dossier…</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Not in the public directory</h1>
            <p className="text-slate-600 mb-5">
              Our public directory is intentionally curated. Submit an RFQ — a SmartSeek operator will tap our internal index and verified network for the right suppliers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/rfq">
                <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                  <FileText className="w-4 h-4" /> Submit an RFQ
                </button>
              </Link>
              <Link href="/become-a-supplier" className="text-sm font-semibold text-blue-700 underline underline-offset-2">
                Become a supplier
              </Link>
            </div>
          </div>
        )}

        {!loading && dossier && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8">
            {/* HEADER */}
            <header>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{dossier.companyName}</h1>
                <VerificationChip tier={dossier.verification.tier} />
              </div>
              <p className="text-slate-500">
                {countryFlag(dossier.countryCode)} {dossier.city ? `${dossier.city}, ` : ""}{dossier.country || NA_DISCLOSED}
                {dossier.type && (
                  <>
                    <span className="text-slate-400"> · </span>
                    <span className="capitalize">{dossier.type}</span>
                  </>
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {dossier.industry && (
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{dossier.industry}</span>
                )}
                {dossier.subIndustry && (
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{dossier.subIndustry}</span>
                )}
              </div>

              {dossier.strategicTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {dossier.strategicTags.map((tag) => {
                    const slug = STRATEGIC_TAG_TO_SLUG[tag];
                    const chip = (
                      <span className="px-2 py-1 text-[11px] rounded-full bg-amber-50 text-amber-800 border border-amber-100 inline-flex items-center gap-1">
                        Strategic material: <span className="font-semibold">{tag}</span>
                      </span>
                    );
                    return slug ? (
                      <Link key={tag} href={`/suppliers/${slug}`} className="hover:underline">
                        {chip}
                      </Link>
                    ) : (
                      <span key={tag}>{chip}</span>
                    );
                  })}
                </div>
              )}

              {(dossier.tagline || dossier.description) && (
                <p className="text-slate-700 mt-5 leading-relaxed">
                  {dossier.tagline || dossier.description}
                </p>
              )}
            </header>

            {/* PROFILE STRENGTH */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Profile strength</p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    strengthBucket.color === "emerald"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : strengthBucket.color === "blue"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : strengthBucket.color === "amber"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {strengthBucket.label} · {completeness}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${
                    strengthBucket.color === "emerald"
                      ? "bg-emerald-500"
                      : strengthBucket.color === "blue"
                      ? "bg-blue-600"
                      : strengthBucket.color === "amber"
                      ? "bg-amber-500"
                      : "bg-slate-400"
                  }`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{strengthBucket.help}</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Profile strength is a UI indicator based on published metadata completeness. It is not a quality rating.
              </p>
            </div>

            {/* QUICK FACTS */}
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <Fact
                label="Buyer rating"
                value={
                  dossier.rating !== null ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {dossier.rating.toFixed(1)}
                      {dossier.reviewCount ? ` (${dossier.reviewCount})` : ""}
                    </span>
                  ) : (
                    <span className="text-slate-500">{NA_DISCLOSED}</span>
                  )
                }
              />
              <Fact
                label="Workforce"
                value={
                  dossier.employeeBand
                    ? dossier.employeeBand
                    : dossier.employeeCount
                    ? `${dossier.employeeCount.toLocaleString()} employees`
                    : <span className="text-slate-500">{NA_DISCLOSED}</span>
                }
              />
              <Fact
                label="Founded"
                value={
                  dossier.yearEstablished
                    ? String(dossier.yearEstablished)
                    : <span className="text-slate-500">{NA_DISCLOSED}</span>
                }
              />
            </div>

            {/* VERIFICATION & PROVENANCE */}
            <Card
              title="Verification & provenance"
              subtitle={dossier.provenance.dataSource ?? "SmartSeek directory"}
              icon={<BadgeCheck className="w-4 h-4 text-blue-600" />}
            >
              <KvList
                rows={[
                  ["Verification tier", dossier.verification.tier],
                  ["Registry record", renderRegistry(dossier)],
                  ["Industry classification", dossier.provenance.sicCode || NA_DISCLOSED],
                  ["Last profile update", dossier.lastUpdatedAt ? formatDate(dossier.lastUpdatedAt) : "Tracked internally"],
                ]}
              />
              <p className="text-[11px] text-slate-500 mt-3">
                We never publish suppliers we have not located in a public registry.
                <Link href="/verification" className="ml-1 text-blue-700 underline underline-offset-2">
                  See verification standards →
                </Link>
              </p>
            </Card>

            {/* CAPABILITIES & PRODUCTS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                title="Capabilities"
                subtitle="Industries served"
                icon={<Layers className="w-4 h-4 text-violet-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">Industry</span>
                    <span className="text-right">{dossier.industry || NA_DISCLOSED}</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">Sub-industry</span>
                    <span className="text-right">{dossier.subIndustry || NA_DISCLOSED}</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">Type</span>
                    <span className="text-right capitalize">{dossier.type || NA_DISCLOSED}</span>
                  </li>
                </ul>
              </Card>

              <Card
                title="Products & sourcing categories"
                subtitle="Published catalogue"
                icon={<Tags className="w-4 h-4 text-blue-600" />}
              >
                {dossier.products.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dossier.products.slice(0, 14).map((p) => (
                      <span
                        key={p}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">{NA_RFQ}</p>
                )}
              </Card>
            </div>

            {/* CERTIFICATIONS + EXPORT MARKETS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                title="Certifications"
                subtitle="Quality, environmental, and sector standards"
                icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              >
                {dossier.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dossier.certifications.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-100"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">{NA_RFQ}</p>
                )}
              </Card>

              <Card
                title="Export markets"
                subtitle="Where this supplier ships today"
                icon={<Truck className="w-4 h-4 text-amber-600" />}
              >
                {dossier.exportMarkets.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dossier.exportMarkets.map((m) => (
                      <span
                        key={m}
                        className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-100"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">{NA_RFQ}</p>
                )}
              </Card>
            </div>

            {/* COMMERCIAL PROFILE */}
            <Card
              title="Commercial profile"
              subtitle="MOQ, payment, incoterms, lead time"
              icon={<Activity className="w-4 h-4 text-blue-600" />}
            >
              <KvList
                rows={[
                  ["Minimum order value", formatMoq(dossier)],
                  ["Lead time", formatLeadTime(dossier.commercial.leadTimeDays)],
                  ["Payment terms",
                    dossier.commercial.paymentTerms.length > 0
                      ? dossier.commercial.paymentTerms.join(", ")
                      : NA_RFQ,
                  ],
                  ["Incoterms",
                    dossier.commercial.incoterms.length > 0
                      ? dossier.commercial.incoterms.join(", ")
                      : NA_RFQ,
                  ],
                  ["Response speed",
                    dossier.commercial.responseTime || "Routed via SmartSeek operator",
                  ],
                ]}
              />
              <p className="text-[11px] text-slate-500 mt-3">
                We surface only fields the supplier has published. Anything missing is confirmed during operator-led RFQ qualification.
              </p>
            </Card>

            {/* COMMUNICATION READINESS */}
            {commsBand && (
              <div
                className={`rounded-xl border p-4 ${
                  commsBand.tone === "emerald"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : commsBand.tone === "blue"
                    ? "border-blue-200 bg-blue-50/50"
                    : commsBand.tone === "amber"
                    ? "border-amber-200 bg-amber-50/50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <p className="text-sm font-bold text-slate-900">Communication readiness</p>
                </div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">{commsBand.label}</p>
                <p className="text-sm text-slate-700">{commsBand.help}</p>
              </div>
            )}

            {/* DIGITAL PRESENCE — verified-only */}
            {enrichment && (
              <Card
                title="Digital presence"
                subtitle={`${enrichment.source} · domain match`}
                icon={<Network className="w-4 h-4 text-blue-600" />}
              >
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{enrichment.domain}</span>
                    <ConfidenceChip band={enrichment.confidence} />
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <span>
                      {enrichment.pagesVisited > 0
                        ? `${enrichment.pagesVisited} pages indexed`
                        : "Indexed homepage"}
                    </span>
                  </p>
                  <p className="inline-flex items-center gap-2 sm:col-span-2 text-xs text-slate-500">
                    Last enrichment update:{" "}
                    {enrichment.lastUpdatedAt
                      ? formatDate(enrichment.lastUpdatedAt)
                      : "Tracked internally"}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 mt-3">
                  Digital presence is matched on a verified website domain. We do not infer or fabricate company profiles.
                </p>
              </Card>
            )}

            {/* VERIFIED COMMUNICATION CHANNELS — gated previews + counts */}
            {enrichment && enrichment.channels.length > 1 && (
              <Card
                title="Verified communication channels"
                subtitle={
                  enrichment.contactReleasable
                    ? "Operator-screened release after RFQ qualification"
                    : "Counts only — released after RFQ qualification"
                }
                icon={<Lock className="w-4 h-4 text-emerald-600" />}
              >
                <ul className="space-y-2 text-sm text-slate-700">
                  {enrichment.channels
                    .filter((c) => c.kind !== "website")
                    .map((ch) => (
                      <li key={ch.kind} className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2">
                          {CHANNEL_ICONS[ch.kind]}
                          <span className="font-medium">{CHANNEL_LABELS[ch.kind]}</span>
                          <ConfidenceChip band={ch.confidence} />
                        </span>
                        <span className="text-right text-slate-700">
                          {ch.kind === "linkedin" && ch.preview ? (
                            <a
                              href={ch.preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 underline underline-offset-2"
                            >
                              View company page <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="font-mono text-xs">
                              {channelDisplay(ch)}
                              {ch.count > 1 ? (
                                <span className="ml-2 text-slate-400">+{ch.count - 1} more</span>
                              ) : null}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-3">
                  Email and phone previews are masked until a SmartSeek operator screens your RFQ. We never publish unverified contacts to protect suppliers from spam.
                </p>
              </Card>
            )}

            {/* OPERATIONAL MATURITY */}
            {operationalMaturity.length > 0 && (
              <Card
                title="Operational maturity indicators"
                subtitle="Signals from registry and published data"
                icon={<Gauge className="w-4 h-4 text-violet-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {operationalMaturity.map((m, i) => (
                    <li key={i} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* EXPORT & LOGISTICS */}
            {exportLogistics.length > 0 && (
              <Card
                title="Export & logistics considerations"
                subtitle="Deterministic, derived from published profile"
                icon={<Truck className="w-4 h-4 text-amber-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {exportLogistics.map((m, i) => (
                    <li key={i} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* SOURCING SCENARIOS */}
            {sourcingScenarios.length > 0 && (
              <Card
                title="Likely sourcing scenarios"
                subtitle="UI interpretation · no fabricated claims"
                icon={<Compass className="w-4 h-4 text-blue-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {sourcingScenarios.map((s, i) => (
                    <li key={i} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* INTERPRETATION LAYERS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card title="Best suited for" subtitle="Likely procurement fit · UI interpretation">
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {buyerFit.map((fit) => (
                    <li key={fit} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{fit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Sourcing suitability indicators" subtitle="Signals from published profile data">
                {suitabilityTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {suitabilityTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Suitability signals confirmed during RFQ review.</p>
                )}
              </Card>
            </div>

            {/* RFQ READINESS CHECKLIST */}
            <Card
              title="RFQ readiness checklist"
              subtitle="What to include for a useful quote"
              icon={<Compass className="w-4 h-4 text-blue-600" />}
            >
              <ul className="space-y-1.5 text-sm text-slate-700">
                {rfqRecs.map((r, i) => (
                  <li key={i} className="inline-flex items-start gap-2">
                    <ListChecks className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 mt-3">
                These are operator-suggested fields, not a requirement. The RFQ form lets you submit even if some are unknown.
              </p>
            </Card>

            {/* QUALIFICATION CHECKS */}
            <Card
              title="Suggested qualification checks"
              subtitle="Procurement due-diligence checklist"
              icon={<ClipboardCheck className="w-4 h-4 text-violet-600" />}
            >
              <ul className="space-y-1.5 text-sm text-slate-700">
                {qualChecks.map((c, i) => (
                  <li key={i} className="inline-flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 mt-3">
                We&apos;ll handle several of these during operator-led RFQ routing.
                <Link href="/methodology" className="ml-1 text-blue-700 underline underline-offset-2">How RFQs are routed →</Link>
              </p>
            </Card>

            {/* CONTACT — buyer-safe communication path (fallback when no enrichment) */}
            {!enrichment && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Buyer-safe communication path</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" /> Type:{" "}
                    <span className="capitalize">{dossier.type || NA_DISCLOSED}</span>
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" /> Website: {NA_RFQ}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" /> Email: {NA_RFQ}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" /> Phone: {NA_RFQ}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Direct contact details are released after a SmartSeek operator screens your RFQ. This protects suppliers from spam and gives you a clean audit trail.
                </p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={rfqHref}>
                <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition w-full sm:w-auto">
                  <FileText className="w-4 h-4" /> Submit RFQ to engage supplier
                </button>
              </Link>
              <button
                onClick={toggleSavedSupplier}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border w-full sm:w-auto ${
                  saved ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Bookmark className="w-4 h-4" /> {saved ? "Saved" : "Save supplier"}
              </button>
              <button
                onClick={toggleCompareSupplier}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border w-full sm:w-auto ${
                  inCompare ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Scale className="w-4 h-4" /> {inCompare ? "In compare" : "Add to compare (up to 3)"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function ConfidenceChip({ band }: { band: ConfidenceBand }) {
  const map: Record<ConfidenceBand, { tone: string; icon: React.ReactNode }> = {
    "Operator Reviewed":   { tone: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: <BadgeCheck className="w-3 h-3" /> },
    "Registry Verified":   { tone: "bg-blue-50 text-blue-700 border-blue-200",         icon: <ShieldCheck className="w-3 h-3" /> },
    "Domain Verified":     { tone: "bg-sky-50 text-sky-700 border-sky-200",            icon: <Globe className="w-3 h-3" /> },
    "Self Reported":       { tone: "bg-slate-100 text-slate-700 border-slate-200",     icon: <Building2 className="w-3 h-3" /> },
    "Pending Verification":{ tone: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Lock className="w-3 h-3" /> },
  };
  const cfg = map[band];
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${cfg.tone}`}>
      {cfg.icon}
      {band}
    </span>
  );
}

function VerificationChip({ tier }: { tier: SupplierProcurementDossier["verification"]["tier"] }) {
  if (tier === "Operator Verified") {
    return (
      <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full border border-emerald-200 font-semibold inline-flex items-center gap-1">
        <BadgeCheck className="w-3 h-3" /> Operator-verified
      </span>
    );
  }
  if (tier === "Registry Verified") {
    return (
      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 font-semibold inline-flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" /> Registry-verified
      </span>
    );
  }
  return (
    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100 font-semibold inline-flex items-center gap-1">
      <Lock className="w-3 h-3" /> {NA_REGISTRY}
    </span>
  );
}

function renderRegistry(d: SupplierProcurementDossier): React.ReactNode {
  if (d.provenance.registryUrl) {
    const label = d.provenance.registryId
      ? d.provenance.registryId
      : "View record";
    return (
      <a
        href={d.provenance.registryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 underline underline-offset-2"
      >
        {label} <ExternalLink className="w-3 h-3" />
      </a>
    );
  }
  if (d.provenance.registryId) return d.provenance.registryId;
  return NA_REGISTRY;
}

function formatDate(iso: string): string {
  try {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return "Tracked internally";
    return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "Tracked internally";
  }
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-3">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm font-bold text-slate-900">{title}</p>
      </div>
      {subtitle && <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

function KvList({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {rows.map(([k, v]) => (
        <li key={k} className="flex items-baseline justify-between gap-3">
          <span className="text-slate-500 text-xs uppercase tracking-wider">{k}</span>
          <span className="text-right">{v}</span>
        </li>
      ))}
    </ul>
  );
}
