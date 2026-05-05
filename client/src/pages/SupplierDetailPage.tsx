import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft } from "lucide-react";

type SupplierDetail = {
  id: string;
  companyName: string;
  country: string | null;
  city: string | null;
  industry: string | null;
  subIndustry: string | null;
  products: string[] | string | null;
  description: string | null;
  verified: boolean | null;
  rating: number | null;
};

export default function SupplierDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/supplier/:slug");
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!match || !params?.slug) return;
    setLoading(true);
    setError("");
    fetch(`/api/suppliers/${encodeURIComponent(params.slug)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Supplier not found");
        return data;
      })
      .then((data) => setSupplier(data))
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
        {!loading && error && <div className="text-red-600 text-sm">{error}</div>}
        {!loading && supplier && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{supplier.companyName}</h1>
            <p className="text-slate-500 mt-2">
              {[supplier.city, supplier.country].filter(Boolean).join(", ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {supplier.industry && <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{supplier.industry}</span>}
              {supplier.subIndustry && <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{supplier.subIndustry}</span>}
              {supplier.verified ? <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">Verified</span> : null}
            </div>
            {supplier.description ? <p className="text-slate-700 mt-6 leading-relaxed">{supplier.description}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}
