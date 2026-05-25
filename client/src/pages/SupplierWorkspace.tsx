import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileQuestion,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupplierWorkspace } from "@/lib/hooks";
import { getRfqStageMeta } from "@shared/sourcingWorkflow";
import { formatDistanceToNow } from "date-fns";

type SupplierProfileSummary = {
  companyName: string;
  industry: string;
  country: string;
  contactEmail: string;
};

export default function SupplierWorkspace() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useSupplierWorkspace();

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
        {t("workspace.loadError", "Unable to load supplier workspace.")}
      </div>
    );
  }

  const { supplierProfile, counts, inboundRfqs, trustHints, applicationStatus } = data;
  const hasProfile = !!supplierProfile;
  const profile = supplierProfile as SupplierProfileSummary | null;

  return (
    <div className="space-y-6 min-w-0 max-w-7xl pb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          <p className="text-sm text-slate-400">{t("workspace.supplierEyebrow", "Supplier workspace")}</p>
          <h1 className="text-[1.65rem] font-bold tracking-tight text-slate-900 mt-0.5">
            {hasProfile ? profile!.companyName : t("workspace.supplierTitle", "Supplier hub")}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t("workspace.supplierSubtitle", "Manage your profile, verification status, and inbound RFQs.")}
          </p>
        </div>
        {!hasProfile && (
          <Link href="/become-a-supplier">
            <Button size="sm" className="gap-1.5 h-9 bg-blue-600 hover:bg-blue-700">
              <Building2 className="w-3.5 h-3.5" />
              {t("workspace.applyAsSupplier", "Apply as supplier")}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-2xl font-bold text-slate-900">{counts.inboundRfqs}</p>
          <p className="text-xs text-slate-400 mt-0.5">{t("workspace.inboundRfqs", "Inbound RFQs")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-2xl font-bold text-slate-900">
            {counts.profileComplete ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 inline" />
            ) : (
              <Clock className="w-6 h-6 text-amber-400 inline" />
            )}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{t("workspace.profileStatus", "Profile status")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 col-span-2 lg:col-span-1">
          <p className="text-2xl font-bold text-slate-900">
            {counts.verified ? (
              <span className="text-emerald-600">{t("workspace.verified", "Verified")}</span>
            ) : (
              <span className="text-slate-400">{t("workspace.pendingVerification", "Pending")}</span>
            )}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{t("workspace.verification", "Verification")}</p>
        </div>
      </div>

      {!hasProfile && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-800 mb-2">{t("workspace.noProfileTitle", "Join the verified supplier network")}</h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {t("workspace.noProfileDesc", "List your company to receive operator-routed RFQs from global buyers. Verification is based on registry records and direct contact — not paid placement.")}
          </p>
          {applicationStatus && (
            <Badge variant="outline" className="mb-4 capitalize">
              {t("workspace.applicationStatus", "Application")}: {applicationStatus}
            </Badge>
          )}
          <Link href="/become-a-supplier">
            <Button className="bg-blue-600 hover:bg-blue-700">
              {t("workspace.startApplication", "Start application")} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {hasProfile && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 text-[15px] mb-4">{t("workspace.companyProfile", "Company profile")}</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-400 text-xs uppercase">{t("workspace.industry", "Industry")}</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{profile!.industry}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase">{t("workspace.country", "Country")}</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{profile!.country}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400 text-xs uppercase">{t("workspace.contact", "Contact")}</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{profile!.contactEmail}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-slate-50">
          <h2 className="font-semibold text-slate-800 text-[15px]">{t("workspace.inboundRfqTitle", "Inbound RFQs")}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{t("workspace.inboundRfqDesc")}</p>
        </div>
        {inboundRfqs.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{t("workspace.noInbound", "No inbound RFQs yet")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {inboundRfqs.map((rfq: any) => {
              const stage = getRfqStageMeta(rfq.status);
              return (
                <div key={rfq.id} className="px-6 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{rfq.productName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {rfq.buyerCompany || "Buyer"} · {rfq.quantity} {rfq.unit}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{stage.label}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(rfq.createdAt), { addSuffix: true })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <h2 className="font-semibold text-slate-800 text-[15px]">{t("workspace.trustForSuppliers", "Trust & credibility")}</h2>
        </div>
        <ul className="space-y-2">
          {trustHints.map((hint: string, i: number) => (
            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-blue-400">·</span> {hint}
            </li>
          ))}
        </ul>
        <Link href="/verification" className="inline-block mt-4">
          <span className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            {t("workspace.verificationStandards", "Verification standards")} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
