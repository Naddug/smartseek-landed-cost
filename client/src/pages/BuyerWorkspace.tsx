import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  FileQuestion,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBuyerWorkspace, useRemoveSavedSupplier } from "@/lib/hooks";
import { getRfqStageMeta } from "@shared/sourcingWorkflow";
import { formatDistanceToNow } from "date-fns";

function KpiCard({
  accent,
  value,
  label,
}: {
  accent: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-w-0">
      <div className="h-0.5" style={{ background: accent }} />
      <div className="p-5">
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function BuyerWorkspace() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useBuyerWorkspace();
  const removeSaved = useRemoveSavedSupplier();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-16 text-slate-500">
        {t("workspace.loadError", "Unable to load sourcing workspace.")}
      </div>
    );
  }

  const { counts, rfqs, savedSuppliers, trustHints } = data;

  return (
    <div className="space-y-6 min-w-0 max-w-7xl pb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          <p className="text-sm text-slate-400">{t("workspace.buyerEyebrow", "Buyer workspace")}</p>
          <h1 className="text-[1.65rem] font-bold tracking-tight text-slate-900 mt-0.5">
            {t("workspace.buyerTitle", "Sourcing workspace")}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t("workspace.buyerSubtitle", "Track RFQs, saved suppliers, and verification status in one place.")}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/app/suppliers">
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              <Search className="w-3.5 h-3.5" />
              {t("workspace.findSuppliers", "Find suppliers")}
            </Button>
          </Link>
          <Link href="/rfq">
            <Button size="sm" className="gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700">
              <FileQuestion className="w-3.5 h-3.5" />
              {t("workspace.submitRfq", "Submit RFQ")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard accent="#3b82f6" value={String(counts.activeRfqs)} label={t("workspace.activeRfqs", "Active RFQs")} />
        <KpiCard accent="#10b981" value={String(counts.savedSuppliers)} label={t("workspace.savedSuppliers", "Saved suppliers")} />
        <KpiCard accent="#8b5cf6" value={String(counts.verifiedSaved)} label={t("workspace.verifiedSaved", "Verified saved")} />
        <KpiCard accent="#f59e0b" value={String(counts.reports)} label={t("workspace.sourcingReports", "Sourcing reports")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQ pipeline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">{t("workspace.rfqPipeline", "RFQ pipeline")}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t("workspace.operatorReviewed", "Operator-reviewed routing")}</p>
            </div>
            <Link href="/rfq">
              <button className="text-xs text-slate-400 hover:text-emerald-600 font-medium flex items-center gap-0.5">
                {t("workspace.newRfq", "New RFQ")} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          {rfqs.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">{t("workspace.noRfqs", "No RFQs yet")}</p>
              <Link href="/rfq">
                <Button size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                  {t("workspace.submitFirstRfq", "Submit your first RFQ")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {rfqs.map((rfq: any) => {
                const stage = getRfqStageMeta(rfq.status);
                return (
                  <Link key={rfq.id} href={`/rfq-status?id=${rfq.id}`}>
                    <div className="px-6 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{rfq.productName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {rfq.quantity} {rfq.unit}
                            {rfq.destinationCountry ? ` · ${rfq.destinationCountry}` : ""}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          {stage.label}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(rfq.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved suppliers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">{t("workspace.savedSuppliersTitle", "Saved suppliers")}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t("workspace.shortlistForRfq", "Your shortlist for RFQ and comparison")}</p>
            </div>
            <Link href="/app/suppliers">
              <button className="text-xs text-slate-400 hover:text-blue-600 font-medium flex items-center gap-0.5">
                {t("workspace.browse", "Browse")} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          {savedSuppliers.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">{t("workspace.noSaved", "Save suppliers while searching to build your shortlist")}</p>
              <Link href="/app/suppliers">
                <Button size="sm" variant="outline" className="mt-4">
                  {t("workspace.searchSuppliers", "Search suppliers")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {savedSuppliers.map((s: any) => (
                <div key={s.id} className="px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-800 truncate">{s.companyName}</p>
                      {s.verified && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> {t("supplier.verified", "Verified")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {s.country || "—"} · {s.industry || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/rfq?supplier=${encodeURIComponent(s.supplierSlug)}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        RFQ
                      </Button>
                    </Link>
                    <button
                      onClick={() => removeSaved.mutate(s.id)}
                      className="text-xs text-slate-400 hover:text-red-500"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trust + intelligence strip */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <h2 className="font-semibold text-slate-800 text-[15px]">{t("workspace.trustWorkflow", "Trust-oriented sourcing")}</h2>
        </div>
        <ul className="space-y-2 mb-4">
          {trustHints.map((hint: string, i: number) => (
            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">·</span> {hint}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link href="/methodology">
            <span className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
              {t("workspace.readMethodology", "Read sourcing methodology")} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
          <Link href="/verification">
            <span className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
              {t("workspace.verificationStandards", "Verification standards")} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Quick paths */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/app/suppliers", icon: Users, label: t("workspace.discover", "Supplier discovery"), desc: t("workspace.discoverDesc", "Search verified global suppliers") },
          { href: "/app/smart-finder", icon: Search, label: t("workspace.intelligence", "Sourcing intelligence"), desc: t("workspace.intelligenceDesc", "AI-assisted supplier analysis") },
          { href: "/app/risk-intelligence", icon: ShieldCheck, label: t("workspace.verify", "Verification check"), desc: t("workspace.verifyDesc", "Assess supplier credibility") },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <div className="bg-white rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer h-full">
              <Icon className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
