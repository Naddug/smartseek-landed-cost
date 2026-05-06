import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FileText, ArrowRight, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

type RfqInfo = {
  id: string;
  status: string;
  productName: string;
  productCategory: string | null;
  quantity: number;
  unit: string;
  currency: string;
  targetPrice: number | null;
  incoterm: string | null;
  destinationPort: string | null;
  deliveryDate: string | null;
  buyerCompany: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABEL: Record<string, { label: string; color: string; icon: React.ReactNode; help: string }> = {
  pending:    { label: "Received",     color: "amber",   icon: <Clock className="w-4 h-4" />,        help: "A SmartSeek operator will review your RFQ within one business day." },
  routing:    { label: "Routing",      color: "blue",    icon: <Search className="w-4 h-4" />,       help: "We are matching your request to verified suppliers." },
  quoted:     { label: "Quotes ready", color: "emerald", icon: <CheckCircle2 className="w-4 h-4" />, help: "Quotes have been sent to your email." },
  closed:     { label: "Closed",       color: "slate",   icon: <CheckCircle2 className="w-4 h-4" />, help: "This RFQ has been closed." },
  needs_info: { label: "Needs info",   color: "amber",   icon: <AlertCircle className="w-4 h-4" />,  help: "We need clarification — check your email." },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? STATUS_LABEL.pending;
  const colorClass =
    s.color === "amber" ? "bg-amber-50 text-amber-700 border-amber-200" :
    s.color === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" :
    s.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
      {s.icon}{s.label}
    </span>
  );
}

export default function RfqStatus() {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState<RfqInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-lookup via ?id=&email=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qId = params.get("id");
    const qEmail = params.get("email");
    if (qId) setId(qId);
    if (qEmail) setEmail(qEmail);
    if (qId && qEmail) {
      void lookup(qId, qEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = async (rfqId: string, buyerEmail: string) => {
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/rfq/${encodeURIComponent(rfqId)}?email=${encodeURIComponent(buyerEmail)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || t("rfqStatus.notFound"));
      setData(json as RfqInfo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("rfqStatus.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !email.trim()) {
      setError(t("rfqStatus.enterBoth"));
      return;
    }
    void lookup(id.trim(), email.trim());
  };

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5" /> {t("rfqStatus.badge")}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t("rfqStatus.title")}</h1>
          <p className="text-slate-400 text-sm">{t("rfqStatus.subtitle")}</p>
        </div>
      </section>

      <section className="bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={t("rfqStatus.rfqId")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("rfqStatus.emailUsed")}
                type="email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm inline-flex items-center justify-center gap-2 transition">
              {loading ? t("common.loading") : (<>{t("rfqStatus.lookup")} <ArrowRight className="w-4 h-4" /></>)}
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </form>

          {data && (
            <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t("rfqStatus.rfq")} #{data.id}</p>
                  <h2 className="text-lg font-bold text-slate-900">{data.productName}</h2>
                  {data.productCategory && <p className="text-xs text-slate-500">{data.productCategory}</p>}
                </div>
                <StatusPill status={data.status} />
              </div>
              <p className="text-xs text-slate-600 mb-4">{(STATUS_LABEL[data.status] ?? STATUS_LABEL.pending).help}</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                <KV k={t("rfqStatus.quantity")} v={`${data.quantity} ${data.unit}`} />
                {data.targetPrice && <KV k={t("rfqStatus.targetPrice")} v={`${data.targetPrice} ${data.currency}`} />}
                {data.incoterm && <KV k={t("rfqStatus.incoterm")} v={data.incoterm} />}
                {data.destinationPort && <KV k={t("rfqStatus.destination")} v={data.destinationPort} />}
                {data.deliveryDate && <KV k={t("rfqStatus.delivery")} v={data.deliveryDate} />}
                {data.buyerCompany && <KV k={t("rfqStatus.buyer")} v={data.buyerCompany} />}
                <KV k={t("rfqStatus.submitted")} v={new Date(data.createdAt).toLocaleString()} />
                <KV k={t("rfqStatus.lastUpdate")} v={new Date(data.updatedAt).toLocaleString()} />
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3 text-xs">
                <Link href="/rfq" className="text-blue-700 underline underline-offset-2">{t("rfqStatus.submitAnother")}</Link>
                <Link href="/methodology" className="text-blue-700 underline underline-offset-2">{t("rfq.header.linkMethodology")}</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-slate-100 rounded-lg px-3 py-2 bg-slate-50">
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{k}</div>
      <div className="text-slate-900 font-medium truncate">{v}</div>
    </div>
  );
}
