import { useEffect, useMemo, useState } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft, ShieldCheck, FileText, Globe, Phone, Mail, Building2,
  Bookmark, Scale, CheckCircle2, ListChecks, Compass, ClipboardCheck, Lock,
  ExternalLink, Truck, Tags, BadgeCheck, Layers, Activity, Linkedin,
  Network, Gauge, MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import type {
  ConfidenceBand,
  EnrichmentChannel,
  EnrichmentSnapshot,
  SupplierProcurementDossier,
} from "@/types/supplierDossier";
import {
  buildBuyerFit,
  buildExportLogistics,
  buildOperationalMaturity,
  buildQualificationChecks,
  buildRfqRecommendations,
  buildSourcingScenarios,
  buildSuitabilityTags,
  channelDisplay,
  channelLabel,
  communicationReadinessBand,
  confidenceLabel,
  formatDate,
  formatLeadTime,
  formatMoq,
  profileCompletenessPct,
  profileStrengthBucket,
  supplierNa,
  supplierTypeLabel,
} from "@/lib/supplierDetailCopy";

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

const CHANNEL_ICONS: Record<EnrichmentChannel["kind"], React.ReactNode> = {
  website: <Globe className="w-4 h-4 text-slate-500" />,
  linkedin: <Linkedin className="w-4 h-4 text-blue-600" />,
  email: <Mail className="w-4 h-4 text-slate-500" />,
  phone: <Phone className="w-4 h-4 text-slate-500" />,
  address: <MapPin className="w-4 h-4 text-slate-500" />,
};

// ── Component ────────────────────────────────────────────────────────────────

export default function SupplierDetailPage() {
  const { t } = useTranslation();
  const na = useMemo(() => supplierNa(t), [t]);
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
    () => (dossier ? buildBuyerFit(dossier.type, t) : []),
    [dossier, t]
  );
  const rfqRecs = useMemo(
    () => (dossier ? buildRfqRecommendations(dossier.strategicTags[0], t) : []),
    [dossier, t]
  );
  const qualChecks = useMemo(
    () => (dossier ? buildQualificationChecks(dossier, t) : []),
    [dossier, t]
  );
  const suitabilityTags = useMemo(
    () => (dossier ? buildSuitabilityTags(dossier, t) : []),
    [dossier, t]
  );
  const completeness = useMemo(
    () => (dossier ? profileCompletenessPct(dossier) : 0),
    [dossier]
  );
  const strengthBucket = useMemo(
    () => profileStrengthBucket(completeness, t),
    [completeness, t]
  );
  const commsBand = useMemo(
    () => (dossier ? communicationReadinessBand(dossier, t) : null),
    [dossier, t]
  );
  const operationalMaturity = useMemo(
    () => (dossier ? buildOperationalMaturity(dossier, t) : []),
    [dossier, t]
  );
  const exportLogistics = useMemo(
    () => (dossier ? buildExportLogistics(dossier, t) : []),
    [dossier, t]
  );
  const sourcingScenarios = useMemo(
    () => (dossier ? buildSourcingScenarios(dossier, t) : []),
    [dossier, t]
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
    const title = t("supplierDetail.seo.title", { name: dossier.companyName });
    const locationLabel = [dossier.city, dossier.country].filter(Boolean).join(", ") || na.disclosed;
    const typeLabel = dossier.type === "manufacturer"
      ? t("supplierDetail.seo.typeManufacturer")
      : t("supplierDetail.seo.typeGeneric");
    const industryPart = dossier.industry
      ? `${dossier.industry}${dossier.subIndustry ? ` · ${dossier.subIndustry}` : ""}. `
      : "";
    const desc = t("supplierDetail.seo.desc", {
      name: dossier.companyName,
      type: typeLabel,
      location: locationLabel,
      industry: industryPart,
    });
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
        { "@type": "ListItem", "position": 1, "name": t("supplierDetail.seo.breadcrumbHome"), "item": "https://smartseek.com/" },
        { "@type": "ListItem", "position": 2, "name": t("supplierDetail.seo.breadcrumbSuppliers"), "item": "https://smartseek.com/suppliers" },
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
  }, [dossier, t, na.disclosed]);

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
    <section className="min-h-[70vh] bg-slate-50 py-8 sm:py-12 px-4 pb-20 sm:pb-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/search">
          <button className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 min-h-11 py-2">
            <ArrowLeft className="w-4 h-4" /> {t("supplierDetail.back")}
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
            <span className="sr-only">{t("supplierDetail.loading")}</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">{t("supplierDetail.notFound.title")}</h1>
            <p className="text-slate-600 mb-5">
              {t("supplierDetail.notFound.body")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/rfq">
                <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                  <FileText className="w-4 h-4" /> {t("supplierDetail.notFound.submitRfq")}
                </button>
              </Link>
              <Link href="/become-a-supplier" className="text-sm font-semibold text-blue-700 underline underline-offset-2">
                {t("supplierDetail.notFound.becomeSupplier")}
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
                <VerificationChip tier={dossier.verification.tier} t={t} naRegistry={na.registry} />
              </div>
              <p className="text-slate-600">
                {countryFlag(dossier.countryCode)} {dossier.city ? `${dossier.city}, ` : ""}{dossier.country || na.disclosed}
                {dossier.type && (
                  <>
                    <span className="text-slate-400"> · </span>
                    <span>{supplierTypeLabel(dossier.type, t)}</span>
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
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-100 inline-flex items-center gap-1">
                        {t("supplierDetail.strategicMaterial")} <span className="font-semibold">{tag}</span>
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
                <p className="text-xs text-slate-600 uppercase tracking-wider">{t("supplierDetail.profileStrength")}</p>
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
              <p className="text-xs text-slate-600">{strengthBucket.help}</p>
              <p className="text-[11px] text-slate-500 mt-2">
                {t("supplierDetail.profileDisclaimer")}
              </p>
            </div>

            {/* QUICK FACTS */}
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <Fact
                label={t("supplierDetail.facts.verificationTier")}
                value={
                  dossier.verification.registryVerified ||
                  dossier.verification.tier === "Registry Verified" ||
                  dossier.verification.tier === "Operator Verified" ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                      {t("supplier.signals.registryVerified")}
                    </span>
                  ) : (
                    <span className="text-slate-500">{t("supplier.signals.verificationPending")}</span>
                  )
                }
              />
              <Fact
                label={t("supplierDetail.facts.workforce")}
                value={
                  dossier.employeeBand
                    ? dossier.employeeBand
                    : dossier.employeeCount
                    ? t("supplierDetail.facts.employees", { count: dossier.employeeCount })
                    : <span className="text-slate-500">{na.disclosed}</span>
                }
              />
              <Fact
                label={t("supplierDetail.facts.founded")}
                value={
                  dossier.yearEstablished
                    ? String(dossier.yearEstablished)
                    : <span className="text-slate-500">{na.disclosed}</span>
                }
              />
            </div>

            {/* VERIFICATION & PROVENANCE */}
            <Card
              title={t("supplierDetail.card.verification.title")}
              subtitle={dossier.provenance.dataSource ?? t("supplierDetail.card.verification.subtitle")}
              icon={<BadgeCheck className="w-4 h-4 text-blue-600" />}
            >
              <KvList
                rows={[
                  [t("supplierDetail.kv.tier"), verificationTierLabel(dossier.verification.tier, t)],
                  [t("supplierDetail.kv.registry"), renderRegistry(dossier, t, na)],
                  [t("supplierDetail.kv.industry"), dossier.provenance.sicCode || na.disclosed],
                  [t("supplierDetail.kv.lastUpdate"), dossier.lastUpdatedAt ? formatDate(dossier.lastUpdatedAt, t) : na.trackedInternally],
                ]}
              />
              <p className="text-[11px] text-slate-600 mt-3">
                {t("supplierDetail.card.verification.footnote")}
                <Link href="/verification" className="ml-1 text-blue-700 underline underline-offset-2">
                  {t("supplierDetail.card.verification.link")}
                </Link>
              </p>
            </Card>

            {/* CAPABILITIES & PRODUCTS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                title={t("supplierDetail.card.capabilities.title")}
                subtitle={t("supplierDetail.card.capabilities.subtitle")}
                icon={<Layers className="w-4 h-4 text-violet-600" />}
              >
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">{t("supplierDetail.kv.industryField")}</span>
                    <span className="text-right">{dossier.industry || na.disclosed}</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">{t("supplierDetail.kv.subIndustry")}</span>
                    <span className="text-right">{dossier.subIndustry || na.disclosed}</span>
                  </li>
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">{t("supplierDetail.kv.type")}</span>
                    <span className="text-right">{supplierTypeLabel(dossier.type, t)}</span>
                  </li>
                </ul>
              </Card>

              <Card
                title={t("supplierDetail.card.products.title")}
                subtitle={t("supplierDetail.card.products.subtitle")}
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
                  <p className="text-xs text-slate-600">{na.rfq}</p>
                )}
              </Card>
            </div>

            {/* CERTIFICATIONS + EXPORT MARKETS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                title={t("supplierDetail.card.certifications.title")}
                subtitle={t("supplierDetail.card.certifications.subtitle")}
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
                  <p className="text-xs text-slate-600">{na.rfq}</p>
                )}
              </Card>

              <Card
                title={t("supplierDetail.card.export.title")}
                subtitle={t("supplierDetail.card.export.subtitle")}
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
                  <p className="text-xs text-slate-600">{na.rfq}</p>
                )}
              </Card>
            </div>

            {/* COMMERCIAL PROFILE */}
            <Card
              title={t("supplierDetail.card.commercial.title")}
              subtitle={t("supplierDetail.card.commercial.subtitle")}
              icon={<Activity className="w-4 h-4 text-blue-600" />}
            >
              <KvList
                rows={[
                  [t("supplierDetail.kv.moq"), formatMoq(dossier, t)],
                  [t("supplierDetail.kv.leadTime"), formatLeadTime(dossier.commercial.leadTimeDays, t)],
                  [t("supplierDetail.kv.payment"),
                    dossier.commercial.paymentTerms.length > 0
                      ? dossier.commercial.paymentTerms.join(", ")
                      : na.rfq,
                  ],
                  [t("supplierDetail.kv.incoterms"),
                    dossier.commercial.incoterms.length > 0
                      ? dossier.commercial.incoterms.join(", ")
                      : na.rfq,
                  ],
                  [t("supplierDetail.kv.response"),
                    dossier.commercial.responseTime || na.routedViaTeam,
                  ],
                ]}
              />
              <p className="text-[11px] text-slate-600 mt-3">
                {t("supplierDetail.card.commercial.footnote")}
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
                  <p className="text-sm font-bold text-slate-900">{t("supplierDetail.card.comms.title")}</p>
                </div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">{commsBand.label}</p>
                <p className="text-sm text-slate-700">{commsBand.help}</p>
              </div>
            )}

            {/* DIGITAL PRESENCE — verified-only */}
            {enrichment && (
              <Card
                title={t("supplierDetail.card.digital.title")}
                subtitle={t("supplierDetail.card.digital.subtitle", { source: enrichment.source })}
                icon={<Network className="w-4 h-4 text-blue-600" />}
              >
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{enrichment.domain}</span>
                    <ConfidenceChip band={enrichment.confidence} t={t} />
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <span>
                      {enrichment.pagesVisited > 0
                        ? t("supplierDetail.card.digital.pagesIndexed", { count: enrichment.pagesVisited })
                        : t("supplierDetail.card.digital.homepageIndexed")}
                    </span>
                  </p>
                  <p className="inline-flex items-center gap-2 sm:col-span-2 text-xs text-slate-600">
                    {t("supplierDetail.card.digital.lastUpdate")}{" "}
                    {enrichment.lastUpdatedAt
                      ? formatDate(enrichment.lastUpdatedAt, t)
                      : na.trackedInternally}
                  </p>
                </div>
                <p className="text-[11px] text-slate-600 mt-3">
                  {t("supplierDetail.card.digital.footnote")}
                </p>
              </Card>
            )}

            {/* VERIFIED COMMUNICATION CHANNELS — gated previews + counts */}
            {enrichment && enrichment.channels.length > 1 && (
              <Card
                title={t("supplierDetail.card.channels.title")}
                subtitle={
                  enrichment.contactReleasable
                    ? t("supplierDetail.card.channels.subtitleRelease")
                    : t("supplierDetail.card.channels.subtitleMasked")
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
                          <span className="font-medium">{channelLabel(ch.kind, t)}</span>
                          <ConfidenceChip band={ch.confidence} t={t} />
                        </span>
                        <span className="text-right text-slate-700">
                          {ch.kind === "linkedin" && ch.preview ? (
                            <a
                              href={ch.preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 underline underline-offset-2"
                            >
                              {t("supplierDetail.card.channels.viewPage")} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="font-mono text-xs">
                              {channelDisplay(ch, t)}
                              {ch.count > 1 ? (
                                <span className="ml-2 text-slate-500">{t("supplierDetail.card.channels.more", { count: ch.count - 1 })}</span>
                              ) : null}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
                <p className="text-[11px] text-slate-600 mt-3">
                  {t("supplierDetail.card.channels.footnote")}
                </p>
              </Card>
            )}

            {/* OPERATIONAL MATURITY */}
            {operationalMaturity.length > 0 && (
              <Card
                title={t("supplierDetail.card.maturity.title")}
                subtitle={t("supplierDetail.card.maturity.subtitle")}
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
                title={t("supplierDetail.card.logistics.title")}
                subtitle={t("supplierDetail.card.logistics.subtitle")}
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
                title={t("supplierDetail.card.scenarios.title")}
                subtitle={t("supplierDetail.card.scenarios.subtitle")}
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
              <Card title={t("supplierDetail.card.buyerFit.title")} subtitle={t("supplierDetail.card.buyerFit.subtitle")}>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {buyerFit.map((fit) => (
                    <li key={fit} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{fit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title={t("supplierDetail.card.suitability.title")} subtitle={t("supplierDetail.card.suitability.subtitle")}>
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
                  <p className="text-xs text-slate-600">{t("supplierDetail.card.suitability.empty")}</p>
                )}
              </Card>
            </div>

            {/* RFQ READINESS CHECKLIST */}
            <Card
              title={t("supplierDetail.card.rfqChecklist.title")}
              subtitle={t("supplierDetail.card.rfqChecklist.subtitle")}
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
              <p className="text-[11px] text-slate-600 mt-3">
                {t("supplierDetail.card.rfqChecklist.footnote")}
              </p>
            </Card>

            <Card
              title={t("supplierDetail.card.qualification.title")}
              subtitle={t("supplierDetail.card.qualification.subtitle")}
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
              <p className="text-[11px] text-slate-600 mt-3">
                {t("supplierDetail.card.qualification.footnote")}
                <Link href="/methodology" className="ml-1 text-blue-700 underline underline-offset-2">{t("supplierDetail.card.qualification.link")}</Link>
              </p>
            </Card>

            {!enrichment && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-600 uppercase tracking-wider mb-2">{t("supplierDetail.contactPath.title")}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" /> {t("supplierDetail.contactPath.type")}{" "}
                    <span>{supplierTypeLabel(dossier.type, t)}</span>
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" /> {t("supplierDetail.contactPath.website")} {na.rfq}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" /> {t("supplierDetail.contactPath.email")} {na.rfq}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" /> {t("supplierDetail.contactPath.phone")} {na.rfq}
                  </p>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  {t("supplierDetail.contactPath.footnote")}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={rfqHref}>
                <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 min-h-11 py-2.5 rounded-xl text-sm transition w-full sm:w-auto">
                  <FileText className="w-4 h-4" /> {t("supplierDetail.actions.submitRfq")}
                </button>
              </Link>
              <button
                onClick={toggleSavedSupplier}
                className={`inline-flex items-center justify-center gap-2 px-5 min-h-11 py-2.5 rounded-xl text-sm font-semibold transition border w-full sm:w-auto ${
                  saved ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Bookmark className="w-4 h-4" /> {saved ? t("supplierDetail.actions.saved") : t("supplierDetail.actions.save")}
              </button>
              <button
                onClick={toggleCompareSupplier}
                className={`inline-flex items-center justify-center gap-2 px-5 min-h-11 py-2.5 rounded-xl text-sm font-semibold transition border w-full sm:w-auto ${
                  inCompare ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Scale className="w-4 h-4" /> {inCompare ? t("supplierDetail.actions.inCompare") : t("supplierDetail.actions.compare")}
              </button>
            </div>
          </div>
        )}

        {!loading && dossier && (
          <>
            <div className="sm:hidden h-16" aria-hidden="true" />
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <Link href={rfqHref}>
                <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold min-h-11 py-3 rounded-xl text-sm transition">
                  <FileText className="w-4 h-4" /> {t("supplierDetail.actions.submitRfq")}
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function verificationTierLabel(tier: SupplierProcurementDossier["verification"]["tier"], t: ReturnType<typeof useTranslation>["t"]): string {
  if (tier === "Operator Verified") return t("supplierDetail.tier.operatorVerified");
  if (tier === "Registry Verified") return t("supplierDetail.tier.registryVerified");
  return t("supplierDetail.tier.verificationPending");
}

function ConfidenceChip({ band, t }: { band: ConfidenceBand; t: ReturnType<typeof useTranslation>["t"] }) {
  const map: Record<ConfidenceBand, { tone: string; icon: React.ReactNode }> = {
    "Operator Reviewed":   { tone: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: <BadgeCheck className="w-3 h-3" /> },
    "Registry Verified":   { tone: "bg-blue-50 text-blue-700 border-blue-200",         icon: <ShieldCheck className="w-3 h-3" /> },
    "Domain Verified":     { tone: "bg-sky-50 text-sky-700 border-sky-200",            icon: <Globe className="w-3 h-3" /> },
    "Self Reported":       { tone: "bg-slate-100 text-slate-700 border-slate-200",     icon: <Building2 className="w-3 h-3" /> },
    "Pending Verification":{ tone: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Lock className="w-3 h-3" /> },
  };
  const cfg = map[band];
  return (
    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${cfg.tone}`}>
      {cfg.icon}
      {confidenceLabel(band, t)}
    </span>
  );
}

function VerificationChip({ tier, t, naRegistry }: { tier: SupplierProcurementDossier["verification"]["tier"]; t: ReturnType<typeof useTranslation>["t"]; naRegistry: string }) {
  if (tier === "Operator Verified") {
    return (
      <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full border border-emerald-200 font-semibold inline-flex items-center gap-1">
        <BadgeCheck className="w-3 h-3" /> {t("supplierDetail.tier.operatorVerified")}
      </span>
    );
  }
  if (tier === "Registry Verified") {
    return (
      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 font-semibold inline-flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" /> {t("supplierDetail.tier.registryVerified")}
      </span>
    );
  }
  return (
    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100 font-semibold inline-flex items-center gap-1">
      <Lock className="w-3 h-3" /> {naRegistry}
    </span>
  );
}

function renderRegistry(d: SupplierProcurementDossier, t: ReturnType<typeof useTranslation>["t"], na: ReturnType<typeof supplierNa>): React.ReactNode {
  if (d.provenance.registryUrl) {
    const label = d.provenance.registryId ? d.provenance.registryId : t("supplierDetail.na.viewRecord");
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
  return na.registry;
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
      {subtitle && <p className="text-xs text-slate-600 uppercase tracking-wider mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

function KvList({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {rows.map(([k, v]) => (
        <li key={k} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
          <span className="text-slate-600 text-xs uppercase tracking-wider shrink-0">{k}</span>
          <span className="sm:text-right break-words">{v}</span>
        </li>
      ))}
    </ul>
  );
}
