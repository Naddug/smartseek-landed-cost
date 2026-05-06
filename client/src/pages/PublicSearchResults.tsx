import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Star, MapPin, ShieldCheck, Users, ArrowRight, Building2, FileText } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { usePublicSupplierSearch } from "@/lib/hooks";
import { useTranslation } from "react-i18next";

const CATEGORY_CHIPS: { label: string; q: string; icon: string }[] = [
  { label: "Antimony", q: "antimony", icon: "⛏️" },
  { label: "Copper", q: "copper", icon: "🟠" },
  { label: "Steel", q: "steel", icon: "🏗️" },
  { label: "Rare earths", q: "rare earth", icon: "🔬" },
  { label: "Aluminium", q: "aluminium", icon: "🥈" },
  { label: "Nickel", q: "nickel", icon: "⚙️" },
  { label: "Lithium", q: "lithium", icon: "🔋" },
  { label: "Tungsten", q: "tungsten", icon: "🔩" },
];

type Supplier = {
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
  employee_count_band: "10-50" | "50-200" | "200-500" | "500-1000" | "1000-5000" | "5000+";
  year_founded: number;
  is_curated: boolean;
};

function countryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    CN: "🇨🇳", IN: "🇮🇳", VN: "🇻🇳", TR: "🇹🇷", DE: "🇩🇪", TH: "🇹🇭",
    BR: "🇧🇷", US: "🇺🇸", MX: "🇲🇽", ID: "🇮🇩", PL: "🇵🇱", IT: "🇮🇹", KR: "🇰🇷",
  };
  return flags[countryCode] ?? "🌍";
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className={`h-1 ${supplier.verified ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-100"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-slate-900 text-sm truncate">{supplier.company_name}</span>
              {supplier.verified && (
                <span className="shrink-0 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> {t("supplier.verified")}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {countryFlag(supplier.country_code)} {supplier.city}, {supplier.country}
            </span>
          </div>
          <div className="shrink-0 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg px-2 py-1 capitalize">
            {supplier.type}
          </div>
        </div>

        <span className="inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mb-2">{supplier.industry}</span>
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{supplier.tagline}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.products.slice(0, 3).map((p, i) => (
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
          <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
            <Users className="w-3 h-3" />
            {supplier.employee_count_band}
          </span>
        </div>

        <Link href={`/supplier/${supplier.slug}`}>
          <button className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1">
            {t("supplier.viewDetails")} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PublicSearchResults() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const queryFromUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("q") ?? ""
      : "";
  const [input, setInput] = useState(queryFromUrl);
  const [submittedQuery, setSubmittedQuery] = useState(queryFromUrl);

  useEffect(() => {
    const latestQuery =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("q") ?? ""
        : "";
    setInput(latestQuery);
    setSubmittedQuery(latestQuery);
  }, [location]);

  const { data, status, isError } = usePublicSupplierSearch(submittedQuery);

  const suppliers = (data?.suppliers ?? []) as Supplier[];
  const total = data?.total ?? 0;
  const isPending = status === "pending";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    setSubmittedQuery(trimmed);
    setLocation(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  const runChip = (q: string) => {
    setInput(q);
    setSubmittedQuery(q);
    setLocation(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <PublicLayout>
      <section className="bg-slate-950 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold mb-3">
              <ShieldCheck className="w-3 h-3" /> Curated · registry-verified suppliers
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Supplier directory</h1>
            <p className="text-slate-400 text-sm">Search a sample of registry-verified suppliers across strategic metals and industrial inputs. Full directory is unlocked for founding users during beta.</p>
          </div>

          <form onSubmit={onSubmit} className="max-w-xl mx-auto mb-5 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 text-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by commodity, product, or HS keyword (e.g. antimony ingot)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition">
              <Search className="w-4 h-4" /> Search
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-3xl mx-auto">
            {CATEGORY_CHIPS.map((c) => (
              <button
                key={c.q}
                onClick={() => runChip(c.q)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  submittedQuery.toLowerCase() === c.q.toLowerCase()
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {!isPending && !isError && submittedQuery && (
            <div className="mb-4 text-center">
              <span className="inline-block text-xs text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                {total} curated supplier{total === 1 ? "" : "s"} matching "{submittedQuery}"
              </span>
            </div>
          )}

          {isPending && (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          )}

          {isError && (
            <div className="text-center py-12 text-slate-300">Could not load results. Please retry.</div>
          )}

          {!isPending && !isError && suppliers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((s) => (
                <SupplierCard key={s.id} supplier={s} />
              ))}
            </div>
          )}

          {!isPending && !isError && suppliers.length === 0 && (
            <div className="max-w-2xl mx-auto py-10">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
                <Building2 className="w-10 h-10 text-slate-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-white mb-2">No public matches{submittedQuery ? ` for "${submittedQuery}"` : ""}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Our public directory is intentionally curated. If you can&apos;t find a supplier here, submit an RFQ and a sourcing operator will tap our internal index and verified network for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/rfq${submittedQuery ? `?product=${encodeURIComponent(submittedQuery)}` : ""}`}>
                    <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                      <FileText className="w-4 h-4" /> Submit an RFQ
                    </button>
                  </Link>
                  <Link href="/pricing">
                    <button className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition">
                      Request beta access <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Persistent "didn't find it?" footer CTA — visible even on result hits */}
          {!isPending && !isError && suppliers.length > 0 && (
            <div className="mt-10 text-center">
              <p className="text-xs text-slate-400 mb-3">Need a supplier we haven&apos;t listed publicly?</p>
              <Link href={`/rfq${submittedQuery ? `?product=${encodeURIComponent(submittedQuery)}` : ""}`}>
                <button className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium px-4 py-2 rounded-lg text-xs transition">
                  <FileText className="w-3.5 h-3.5" /> Submit an RFQ — we&apos;ll source it for you
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
