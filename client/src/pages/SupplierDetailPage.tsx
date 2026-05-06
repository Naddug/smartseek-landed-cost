import { useEffect, useMemo, useState } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft, ShieldCheck, Star, FileText, Globe, Phone, Mail, Building2,
  Bookmark, Scale, CheckCircle2, ListChecks, Compass, ClipboardCheck, Lock,
} from "lucide-react";

type SupplierDetail = {
  id: number;
  slug: string;
  company_name: string;
  country: string;
  country_code: string;
  city: string;
  industry: string;
  sub_industry: string;
  products: string[];
  tagline: string;
  type: "manufacturer" | "trader" | "distributor";
  verified: boolean;
  rating: number;
  employee_count_band: string;
  year_founded: number;
  is_curated: boolean;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function countryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    CN: "🇨🇳", IN: "🇮🇳", VN: "🇻🇳", TR: "🇹🇷", DE: "🇩🇪", TH: "🇹🇭",
    BR: "🇧🇷", US: "🇺🇸", MX: "🇲🇽", ID: "🇮🇩", PL: "🇵🇱", IT: "🇮🇹",
    KR: "🇰🇷", AT: "🇦🇹", AU: "🇦🇺", CA: "🇨🇦", GB: "🇬🇧", NL: "🇳🇱",
    JP: "🇯🇵", ES: "🇪🇸", FR: "🇫🇷",
  };
  return flags[countryCode] ?? "🌍";
}

// Category slug for internal linking (must align with /suppliers/* routes).
const STRATEGIC_TAG_TO_SLUG: Record<string, string> = {
  Antimony: "antimony",
  Tungsten: "tungsten",
  Tin: "tin",
  Copper: "copper-cathode",
  Alloys: "steel",
  Steel: "steel",
  "Rare Earths": "rare-earths",
  Lithium: "lithium-batteries",
  Aluminium: "aluminum",
};

function detectStrategicTags(supplier: SupplierDetail): string[] {
  const haystack = [
    supplier.industry,
    supplier.sub_industry,
    supplier.tagline,
    ...(supplier.products || []),
  ]
    .join(" ")
    .toLowerCase();

  const tags: string[] = [];
  if (haystack.includes("antimony")) tags.push("Antimony");
  if (haystack.includes("tungsten")) tags.push("Tungsten");
  if (haystack.match(/\btin\b/)) tags.push("Tin");
  if (haystack.includes("copper")) tags.push("Copper");
  if (haystack.includes("alloy")) tags.push("Alloys");
  if (haystack.includes("steel")) tags.push("Steel");
  if (haystack.includes("rare earth")) tags.push("Rare Earths");
  if (haystack.includes("lithium")) tags.push("Lithium");
  if (haystack.includes("aluminium") || haystack.includes("aluminum")) tags.push("Aluminium");
  return Array.from(new Set(tags)).slice(0, 6);
}

function buildBuyerFit(supplier: SupplierDetail): string[] {
  const items: string[] = [];
  if (supplier.type === "manufacturer") {
    items.push("OEM and direct-from-mill procurement");
    items.push("Programs requiring traceable production origin");
  }
  if (supplier.type === "trader") {
    items.push("Spot purchases and blended sourcing programs");
    items.push("Buyers needing flexible incoterms and origin mix");
  }
  if (supplier.type === "distributor") {
    items.push("Recurring replenishment with shorter lead times");
    items.push("Buyers without container-level minimums");
  }
  items.push("Strategic sourcing and category management teams");
  items.push("Industrial buyers running structured RFQs");
  return Array.from(new Set(items)).slice(0, 4);
}

function buildRfqRecommendations(supplier: SupplierDetail, strategicTags: string[]): string[] {
  const generic = [
    "Exact specification and tolerance (purity, grade, dimensions, alloy content)",
    "Quantity, packaging, and unit",
    "Origin / country-of-manufacture preference",
    "Incoterm and destination port",
    "Lead time and required delivery window",
    "Target price reference and currency",
    "Quality documents required (mill test cert, COA, ISO scope)",
  ];
  const tag = strategicTags[0]?.toLowerCase();
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

function buildQualificationChecks(supplier: SupplierDetail): string[] {
  const checks = [
    "Confirm legal entity status against the company registry",
    "Request three recent buyer references in your destination region",
    "Request a current mill test certificate or certificate of analysis",
    "Verify ISO / industry certifications are in scope and unexpired",
    "Confirm bank account is held in the same legal entity name",
  ];
  if (supplier.type === "trader" || supplier.type === "distributor") {
    checks.push("Ask for the underlying producer / mill source for traceability");
  }
  if (!supplier.verified) {
    checks.unshift("Treat as Verification In Progress — request registry extract before sample order");
  }
  return checks.slice(0, 6);
}

function profileStrengthBucket(pct: number): { label: string; color: string; help: string } {
  if (pct >= 85) return { label: "Strong", color: "emerald", help: "Most procurement metadata is present. Ready for RFQ." };
  if (pct >= 65) return { label: "Workable", color: "blue",    help: "Enough metadata for RFQ; some fields will be confirmed during qualification." };
  if (pct >= 40) return { label: "Limited",  color: "amber",   help: "Several procurement fields missing. RFQ qualification will fill the gaps." };
  return { label: "Sparse", color: "slate", help: "Limited published metadata. Submit an RFQ — our operator will collect details directly." };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SupplierDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/supplier/:slug");
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    if (!match || !params?.slug) return;
    setLoading(true);
    setError("");
    fetch(`/api/public/suppliers/${encodeURIComponent(params.slug)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.error || "Supplier not found");
        return data;
      })
      .then((data) => setSupplier(data.supplier))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [match, params?.slug]);

  const strategicTags = useMemo(() => (supplier ? detectStrategicTags(supplier) : []), [supplier]);
  const buyerFit = useMemo(() => (supplier ? buildBuyerFit(supplier) : []), [supplier]);
  const rfqRecs = useMemo(() => (supplier ? buildRfqRecommendations(supplier, strategicTags) : []), [supplier, strategicTags]);
  const qualChecks = useMemo(() => (supplier ? buildQualificationChecks(supplier) : []), [supplier]);

  const suitabilityTags = useMemo(() => {
    if (!supplier) return [];
    const tags: string[] = [];
    if (supplier.verified) tags.push("Registry-verified");
    if (supplier.rating >= 4.5) tags.push("High buyer-rating signal");
    if (supplier.type === "manufacturer") tags.push("Direct manufacturer");
    if (supplier.type === "trader") tags.push("Trader / distribution");
    if (supplier.country) tags.push(`${supplier.country} origin`);
    return tags.slice(0, 5);
  }, [supplier]);

  const profileCompleteness = useMemo(() => {
    if (!supplier) return 0;
    const checks = [
      !!supplier.company_name,
      !!supplier.country,
      !!supplier.city,
      !!supplier.industry,
      !!supplier.sub_industry,
      Array.isArray(supplier.products) && supplier.products.length > 0,
      supplier.year_founded > 0,
      !!supplier.employee_count_band,
      !!supplier.tagline,
      supplier.rating > 0,
      supplier.verified === true,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [supplier]);

  const strengthBucket = useMemo(() => profileStrengthBucket(profileCompleteness), [profileCompleteness]);

  // localStorage persistence: saved + compare lists
  useEffect(() => {
    if (!supplier || typeof window === "undefined") return;
    const savedList = JSON.parse(window.localStorage.getItem("saved_suppliers") || "[]") as string[];
    const compareList = JSON.parse(window.localStorage.getItem("compare_suppliers") || "[]") as string[];
    setSaved(savedList.includes(supplier.slug));
    setInCompare(compareList.includes(supplier.slug));
  }, [supplier]);

  // SEO: title, description, canonical, JSON-LD (Organization + BreadcrumbList)
  useEffect(() => {
    if (!supplier) return;
    const title = `${supplier.company_name} – supplier profile | SmartSeek`;
    const description = `${supplier.company_name} is a ${supplier.type} based in ${supplier.city}, ${supplier.country}. ${supplier.industry}${supplier.sub_industry ? ` · ${supplier.sub_industry}` : ""}. Review sourcing fit, verification status, and RFQ guidance on SmartSeek.`;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://smartseek.com/supplier/${supplier.slug}`;

    const breadcrumbCategorySlug = STRATEGIC_TAG_TO_SLUG[strategicTags[0] || ""];
    const ld = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": supplier.company_name,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": supplier.country,
          "addressLocality": supplier.city,
        },
        "url": `https://smartseek.com/supplier/${supplier.slug}`,
        "industry": supplier.industry,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartseek.com/" },
          { "@type": "ListItem", "position": 2, "name": "Suppliers", "item": "https://smartseek.com/suppliers" },
          ...(breadcrumbCategorySlug
            ? [{ "@type": "ListItem", "position": 3, "name": strategicTags[0], "item": `https://smartseek.com/suppliers/${breadcrumbCategorySlug}` }]
            : []),
          { "@type": "ListItem", "position": breadcrumbCategorySlug ? 4 : 3, "name": supplier.company_name, "item": `https://smartseek.com/supplier/${supplier.slug}` },
        ],
      },
    ];
    let el = document.getElementById("supplier-detail-ld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "supplier-detail-ld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(ld);
  }, [supplier, strategicTags]);

  const toggleSavedSupplier = () => {
    if (!supplier || typeof window === "undefined") return;
    const key = "saved_suppliers";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
    const next = saved ? current.filter((s) => s !== supplier.slug) : Array.from(new Set([...current, supplier.slug]));
    window.localStorage.setItem(key, JSON.stringify(next));
    setSaved(!saved);
  };

  const toggleCompareSupplier = () => {
    if (!supplier || typeof window === "undefined") return;
    const key = "compare_suppliers";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
    let next = current;
    if (inCompare) {
      next = current.filter((s) => s !== supplier.slug);
    } else if (current.length < 3) {
      next = [...current, supplier.slug];
    }
    window.localStorage.setItem(key, JSON.stringify(next));
    setInCompare(next.includes(supplier.slug));
  };

  if (!match) return null;

  const rfqHref = supplier
    ? `/rfq?supplier=${encodeURIComponent(supplier.company_name)}&product=${encodeURIComponent(supplier.products?.[0] || supplier.industry || "")}`
    : "/rfq";

  return (
    <section className="min-h-[70vh] bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/search">
          <button className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to suppliers
          </button>
        </Link>

        {loading && <div className="text-slate-500">Loading supplier...</div>}

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

        {!loading && supplier && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8">
            {/* HEADER */}
            <header>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{supplier.company_name}</h1>
                {supplier.verified ? (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Registry-verified
                  </span>
                ) : (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100 font-semibold inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Verification pending
                  </span>
                )}
              </div>
              <p className="text-slate-500">
                {countryFlag(supplier.country_code)} {supplier.city}, {supplier.country}
                <span className="text-slate-400"> · </span>
                <span className="capitalize">{supplier.type}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{supplier.industry}</span>
                {supplier.sub_industry && (
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{supplier.sub_industry}</span>
                )}
              </div>

              {/* Strategic-material chips → internal linking to /suppliers/<slug> */}
              {strategicTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {strategicTags.map((tag) => {
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

              {supplier.tagline && <p className="text-slate-700 mt-5 leading-relaxed">{supplier.tagline}</p>}
            </header>

            {/* PROFILE STRENGTH */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Profile strength</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  strengthBucket.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  strengthBucket.color === "blue"    ? "bg-blue-50 text-blue-700 border-blue-200" :
                  strengthBucket.color === "amber"   ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                       "bg-slate-100 text-slate-700 border-slate-200"
                }`}>
                  {strengthBucket.label} · {profileCompleteness}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${
                    strengthBucket.color === "emerald" ? "bg-emerald-500" :
                    strengthBucket.color === "blue"    ? "bg-blue-600" :
                    strengthBucket.color === "amber"   ? "bg-amber-500" : "bg-slate-400"
                  }`}
                  style={{ width: `${profileCompleteness}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{strengthBucket.help}</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Profile strength is a UI indicator based on published metadata completeness. It is not a quality rating.
              </p>
            </div>

            {/* QUICK FACTS */}
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <Fact label="Buyer rating" value={
                <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {supplier.rating > 0 ? supplier.rating.toFixed(1) : "—"}</span>
              } />
              <Fact label="Employees" value={supplier.employee_count_band || "—"} />
              <Fact label="Founded" value={supplier.year_founded > 0 ? String(supplier.year_founded) : "—"} />
            </div>

            {/* PRODUCTS */}
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Products listed</p>
              {supplier.products?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {supplier.products.map((p) => (
                    <span key={p} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{p}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Product list confirmed during RFQ qualification.</p>
              )}
            </div>

            {/* COMMERCIAL + COMPLIANCE */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card title="Commercial profile" subtitle="Confirmed during RFQ qualification">
                <KvList rows={[
                  ["MOQ",            "Confirmed during RFQ"],
                  ["Incoterms",      "Confirmed during RFQ"],
                  ["Lead time",      "Confirmed during RFQ"],
                  ["Payment terms",  "Confirmed during RFQ"],
                  ["Response speed", "Routed via SmartSeek operator"],
                ]} />
              </Card>
              <Card title="Compliance & verification" subtitle="See verification standards">
                <KvList rows={[
                  ["Verification level",       supplier.verified ? "Registry verified" : "Verification in progress"],
                  ["Certification documents",  "Requested during qualification"],
                  ["Export regions",           "Confirmed during RFQ"],
                  ["Last verification",        "Tracked internally"],
                  ["Last profile update",      "Tracked internally"],
                ]} />
                <Link href="/verification" className="mt-3 inline-flex text-xs text-blue-700 underline underline-offset-2">
                  Verification standards →
                </Link>
              </Card>
            </div>

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
              <Card title="Sourcing suitability indicators" subtitle="Signals from public profile data">
                {suitabilityTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {suitabilityTags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Suitability signals confirmed during RFQ review.</p>
                )}
              </Card>
            </div>

            {/* RFQ RECOMMENDATIONS */}
            <Card
              title="Recommended RFQ details"
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

            {/* CONTACT — buyer-safe communication path */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Buyer-safe communication path</p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <p className="inline-flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-500" /> Type: <span className="capitalize">{supplier.type}</span></p>
                <p className="inline-flex items-center gap-2"><Globe className="w-4 h-4 text-slate-500" /> Website: shared after RFQ qualification</p>
                <p className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> Email: shared after RFQ qualification</p>
                <p className="inline-flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> Phone: shared after RFQ qualification</p>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Direct contact details are released after a SmartSeek operator screens your RFQ. This protects suppliers from spam and gives you a clean audit trail.
              </p>
            </div>

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

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-3">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function Card({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
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

function KvList({ rows }: { rows: [string, string][] }) {
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
