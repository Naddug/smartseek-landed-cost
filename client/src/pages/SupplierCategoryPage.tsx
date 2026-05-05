/**
 * SupplierCategoryPage — public, SEO-friendly landing page for
 * /suppliers/:category  (e.g. /suppliers/copper-cathode)
 *
 * All UI text is internationalised via i18next using the `category.*` key
 * namespace. The server injects page-specific title/meta/JSON-LD before
 * sending index.html so search engines see correct head tags even without JS.
 */
import { useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Search, CheckCircle2, ArrowRight, Building2, Star,
  MapPin, ShieldCheck, Lock, Globe, Users, ChevronRight,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Supplier {
  id: string;
  companyName: string;
  slug: string;
  country: string;
  city: string;
  industry: string;
  products: string[];
  verified: boolean;
  rating: number;
  employeeCount: number | null;
}

interface SuppliersResponse {
  suppliers: Supplier[];
  pagination: { total: number | null };
  totalResults: number | null;
  totalKnown: boolean;
  guestLimited: boolean;
  freeLimit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    China: "🇨🇳", Germany: "🇩🇪", Turkey: "🇹🇷", India: "🇮🇳",
    USA: "🇺🇸", "United States": "🇺🇸", Japan: "🇯🇵", "South Korea": "🇰🇷",
    Brazil: "🇧🇷", Italy: "🇮🇹", Vietnam: "🇻🇳", Thailand: "🇹🇭",
    Mexico: "🇲🇽", Canada: "🇨🇦", "United Kingdom": "🇬🇧", France: "🇫🇷",
    Spain: "🇪🇸", Netherlands: "🇳🇱", Poland: "🇵🇱", Malaysia: "🇲🇾",
  };
  return flags[country] ?? "🌍";
}

// ─── Supplier card ────────────────────────────────────────────────────────────

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const { t } = useTranslation();
  const score = Math.round(supplier.rating * 20);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className={`h-1 ${supplier.verified ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-100"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-slate-900 text-sm truncate">{supplier.companyName}</span>
              {supplier.verified && (
                <span className="shrink-0 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-100 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> {t("category.verified")}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {countryFlag(supplier.country)} {supplier.city}, {supplier.country}
            </span>
          </div>
          <div className={`shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center border text-xs font-bold ${score >= 80 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
            <span className="leading-none">{score}</span>
            <span className="text-[8px] opacity-60 leading-none mt-0.5">{t("category.qualityScore")}</span>
          </div>
        </div>

        <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mb-2">
          {supplier.industry}
        </span>

        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.products.slice(0, 2).map((p, i) => (
            <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
              {p}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-3 h-3 ${i <= Math.round(supplier.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
            ))}
            <span className="ml-1 text-slate-700 font-semibold">{supplier.rating.toFixed(1)}</span>
          </div>
          {supplier.employeeCount && (
            <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
              <Users className="w-3 h-3" />
              {supplier.employeeCount.toLocaleString()}+ {t("category.employees")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Locked "more results" overlay ────────────────────────────────────────────

function LockedOverlay({ total, category }: { total: number; category: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 blur-sm opacity-50">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-4/5" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-5 bg-slate-100 rounded w-24 mt-3" />
              <div className="flex gap-1 mt-2"><div className="h-5 w-20 bg-blue-50 rounded" /><div className="h-5 w-16 bg-blue-50 rounded" /></div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(to top, rgba(15,23,42,0.97) 40%, rgba(15,23,42,0.5) 100%)" }}
      >
        <div className="text-center px-6 py-6 max-w-sm">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <p className="text-white font-bold text-lg mb-1 leading-tight">
            {t("category.moreSuppliers", { count: (total - 3).toLocaleString(), name: slugToTitle(category).toLowerCase() })}
          </p>
          <p className="text-slate-300 text-sm mb-5 leading-relaxed">
            {t("category.freeUnlocks", { total: total.toLocaleString() })}
          </p>
          <div className="flex flex-col gap-2.5">
            <Link href="/signup">
              <button className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20">
                {t("category.searchFree")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full inline-flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition">
                {t("category.logIn")}
              </button>
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-3">{t("category.noCreditCard")}</p>
        </div>
      </div>
    </div>
  );
}

// ─── JSON-LD injector (client-side, for SPA navigation) ──────────────────────

function useJsonLd(data: object) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "page-jsonld";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.getElementById("page-jsonld")?.remove(); };
  }, []);
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function SupplierCategoryPage() {
  const { t } = useTranslation();
  const params = useParams<{ category: string }>();
  const [, navigate] = useLocation();
  const category = params.category ?? "";
  const displayName = slugToTitle(category);
  const searchQuery = category.replace(/-/g, " ");

  // Update document title on client-side navigation (server injects it on first load)
  useEffect(() => {
    document.title = `${displayName} Suppliers – Find Verified Manufacturers | SmartSeek`;
  }, [displayName, t]);

  // Client-side JSON-LD breadcrumb for SPA navigation
  const SITE_URL = "https://smartseek.io";
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("category.breadcrumb.home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("category.breadcrumb.suppliers"), item: `${SITE_URL}/search` },
      { "@type": "ListItem", position: 3, name: displayName, item: `${SITE_URL}/suppliers/${category}` },
    ],
  });

  const { data, status, isError, isFetching } = useQuery<SuppliersResponse>({
    queryKey: ["supplierCategory", category],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers?q=${encodeURIComponent(searchQuery)}&limit=3`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json || typeof json !== "object") throw new Error("Invalid response");
      return {
        suppliers: Array.isArray(json.suppliers) ? json.suppliers : [],
        pagination: json.pagination && typeof json.pagination === "object"
          ? { ...json.pagination, total: json.pagination.total == null ? null : Number(json.pagination.total) || 0 }
          : { total: null },
        totalResults: json.totalResults == null ? null : Number(json.totalResults) || 0,
        totalKnown: json.totalKnown !== false,
        guestLimited: json.guestLimited !== false,
        freeLimit: Number(json.freeLimit) || 3,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!category,
  });

  const showSkeleton = !!category && (status === "pending" || isFetching) && !data && !isError;

  const suppliers = data?.suppliers ?? [];
  const totalKnown = data?.totalKnown !== false;
  const total = data?.pagination?.total ?? data?.totalResults;
  const totalDisplay = totalKnown ? (total ?? 0).toLocaleString() : "1000+";
  const previewSuppliers = suppliers.slice(0, 3);
  const hasMore = totalKnown ? (total ?? 0) > 3 : previewSuppliers.length >= 3;

  const related = [
    "copper-cathode", "lithium-batteries", "antimony", "solar-panels",
    "steel", "aluminum", "textiles", "chemicals",
  ].filter((c) => c !== category).slice(0, 6);

  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-20 pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center gap-1.5 text-xs text-slate-500 mb-6" aria-label={t("category.breadcrumb.nav")}>
            <Link href="/" className="hover:text-slate-300 transition-colors">{t("category.breadcrumb.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/signup" className="hover:text-slate-300 transition-colors">{t("category.breadcrumb.suppliers")}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-400">{displayName}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-5">
            <Globe className="w-3.5 h-3.5" />
            {showSkeleton
              ? t("category.loading")
              : (totalKnown ? (total ?? 0) > 0 : previewSuppliers.length > 0)
                ? t("category.suppliersFound", { count: totalDisplay })
                : t("category.globalDirectory")}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {displayName} {t("category.breadcrumb.suppliers")}<br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {t("category.findVerifiedManufacturers")}
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            {t("category.description", { name: displayName.toLowerCase() })}
          </p>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }}
            className="flex items-center bg-white rounded-xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)] max-w-xl mx-auto mb-5"
          >
            <Search className="ml-4 w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              defaultValue={searchQuery}
              readOnly
              className="flex-1 pl-3 pr-4 py-4 text-sm text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
            />
            <button
              type="submit"
              className="shrink-0 m-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-lg transition"
            >
              {t("category.searchFree")}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("category.noCreditCard")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("category.govVerifiedData")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("category.countries220")}</span>
          </div>
        </div>
      </section>

      {/* ── Supplier results ───────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">
              {showSkeleton ? t("category.searching") : t("category.topSuppliers", { name: displayName })}
            </h2>
            {!showSkeleton && (totalKnown ? (total ?? 0) > 0 : previewSuppliers.length > 0) && (
              <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                {t("category.totalResults", { count: totalDisplay })}
              </span>
            )}
          </div>

          {showSkeleton && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="space-y-1.5 flex-1 mr-3">
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                  </div>
                  <div className="h-5 bg-slate-100 rounded w-24 mb-2" />
                  <div className="flex gap-1 mb-3"><div className="h-5 w-20 bg-blue-50 rounded" /><div className="h-5 w-16 bg-blue-50 rounded" /></div>
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-10">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{t("category.cannotLoad")}</p>
              <Link href="/signup">
                <button className="mt-4 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2 rounded-xl text-sm transition">
                  {t("category.signupToSearch")} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          )}

          {!showSkeleton && !isError && previewSuppliers.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {previewSuppliers.map((s) => (
                  <SupplierCard key={s.id} supplier={s} />
                ))}
              </div>
              {hasMore && <LockedOverlay total={totalKnown ? (total ?? previewSuppliers.length) : 1000} category={category} />}
            </>
          )}

          {!showSkeleton && !isError && previewSuppliers.length === 0 && (
            <div className="text-center py-14">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">{t("category.noPreview")}</p>
              <Link href="/signup">
                <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition">
                  {t("category.searchFullDatabase")} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why SmartSeek ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
            {t("category.whySource.heading", { name: displayName.toLowerCase() })}
          </h2>
          <p className="text-slate-500 text-sm text-center mb-10 max-w-xl mx-auto">
            {t("category.whySource.desc")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <ShieldCheck className="w-6 h-6 text-blue-600" />, titleKey: "category.feature1.title", descKey: "category.feature1.desc" },
              { icon: <Globe className="w-6 h-6 text-emerald-600" />, titleKey: "category.feature2.title", descKey: "category.feature2.desc" },
              { icon: <Search className="w-6 h-6 text-violet-600" />, titleKey: "category.feature3.title", descKey: "category.feature3.desc" },
            ].map((f) => (
              <div key={f.titleKey} className="text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{t(f.titleKey)}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related categories ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-5">{t("category.relatedCategories")}</h2>
            <div className="flex flex-wrap gap-3">
              {related.map((cat) => (
                <Link key={cat} href={`/suppliers/${cat}`}>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-4 py-2 rounded-lg transition-all cursor-pointer">
                    {slugToTitle(cat)} <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-16 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {t("category.cta.ready")}<br />
            {t("category.cta.supplier", { name: displayName.toLowerCase() })}
          </h2>
          <p className="text-slate-400 text-sm mb-7">
            {t("category.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 text-base">
                {t("category.cta.primary")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-7 py-3.5 rounded-xl transition text-base">
                {t("category.browseAllResults")}
              </button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">{t("category.cta.footer")}</p>
        </div>
      </section>
    </PublicLayout>
  );
}
