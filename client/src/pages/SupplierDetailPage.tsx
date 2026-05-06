import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";

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

function countryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    CN: "🇨🇳", IN: "🇮🇳", VN: "🇻🇳", TR: "🇹🇷", DE: "🇩🇪", TH: "🇹🇭",
    BR: "🇧🇷", US: "🇺🇸", MX: "🇲🇽", ID: "🇮🇩", PL: "🇵🇱", IT: "🇮🇹", KR: "🇰🇷",
  };
  return flags[countryCode] ?? "🌍";
}

export default function SupplierDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/supplier/:slug");
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (!match) return null;

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
            <h1 className="text-xl font-bold text-slate-900 mb-2">Not in featured directory</h1>
            <p className="text-slate-600 mb-5">{error}</p>
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition">
                Sign up to access 25.2M+ suppliers
              </button>
            </Link>
          </div>
        )}

        {!loading && supplier && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{supplier.company_name}</h1>
              {supplier.verified && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-slate-500 mt-2">
              {countryFlag(supplier.country_code)} {supplier.city}, {supplier.country}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{supplier.industry}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{supplier.sub_industry}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700 capitalize">{supplier.type}</span>
            </div>

            <p className="text-slate-700 mt-6 leading-relaxed">{supplier.tagline}</p>

            <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-500 uppercase">Rating</p>
                <p className="font-semibold flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {supplier.rating.toFixed(1)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-500 uppercase">Employees</p>
                <p className="font-semibold">{supplier.employee_count_band}</p>
              </div>
              <div className="rounded-xl border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-500 uppercase">Founded</p>
                <p className="font-semibold">{supplier.year_founded}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-900 mb-2">Products</p>
              <div className="flex flex-wrap gap-2">
                {supplier.products.map((p) => (
                  <span key={p} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{p}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
