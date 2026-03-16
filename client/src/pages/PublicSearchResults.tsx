/**
 * PublicSearchResults — public search results page at /search?q=query
 *
 * No auth required. Uses /api/suppliers (same as SupplierDiscovery).
 * Guests see limited results; sign-up CTA for full access.
 * Uses PublicLayout — no dashboard UI.
 */
import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Search, CheckCircle2, ArrowRight, Building2, Star,
  MapPin, ShieldCheck, Lock, Users,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

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
  pagination: { total: number };
  guestLimited?: boolean;
  freeLimit?: number;
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

function LockedOverlay({ total, query }: { total: number; query: string }) {
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
            {t("category.moreSuppliers", { count: (total - 3).toLocaleString(), name: query })}
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

export default function PublicSearchResults() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
  }, [location]);

  const { data, status, isError } = useQuery<SuppliersResponse>({
    queryKey: ["publicSearch", query],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers?q=${encodeURIComponent(query)}&limit=6`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    enabled: !!query.trim(),
  });

  const suppliers = data?.suppliers ?? [];
  const total = data?.pagination?.total ?? 0;
  const guestLimited = data?.guestLimited ?? true;
  const hasMore = total > suppliers.length;
  const isLoading = status === "pending" && !!query.trim();

  useEffect(() => {
    if (query) {
      document.title = `${query} Suppliers – Search Results | SmartSeek`;
    } else {
      document.title = "Search Suppliers | SmartSeek";
    }
  }, [query]);

  if (!query.trim()) {
    return (
      <PublicLayout>
        <section className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <Search className="w-12 h-12 text-slate-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t("category.noPreview")}</h1>
          <p className="text-slate-400 text-sm mb-6 max-w-md">
            Enter a search term in the URL: /search?q=your+query
          </p>
          <Link href="/">
            <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition">
              {t("category.breadcrumb.home")} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-slate-950 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {t("category.topSuppliers", { name: query })}
            </h1>
            {!isLoading && total > 0 && (
              <span className="inline-block text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                {t("category.totalResults", { count: total.toLocaleString() })}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-5 bg-slate-100 rounded w-24 mt-3" />
                    <div className="flex gap-1 mt-2"><div className="h-5 w-20 bg-blue-50 rounded" /><div className="h-5 w-16 bg-blue-50 rounded" /></div>
                  </div>
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

          {!isLoading && !isError && suppliers.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {suppliers.map((s) => (
                  <SupplierCard key={s.id} supplier={s} />
                ))}
              </div>
              {guestLimited && hasMore && <LockedOverlay total={total} query={query} />}
            </>
          )}

          {!isLoading && !isError && suppliers.length === 0 && (
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

      <section className="bg-slate-900 border-t border-slate-800 py-12 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-slate-400 text-sm mb-6">
            {t("category.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 text-base">
                {t("category.cta.primary")} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/app/suppliers?q=${encodeURIComponent(query)}`}>
              <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-7 py-3.5 rounded-xl transition text-base">
                {t("category.browseAllResults")}
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 mt-6">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("category.noCreditCard")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("category.govVerifiedData")}</span>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
