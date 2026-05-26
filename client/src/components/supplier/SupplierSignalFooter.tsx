import { ShieldCheck, FileText, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  verified?: boolean;
  employeeCount?: number | null;
  employeeBand?: string | null;
  compact?: boolean;
};

/** Verification-oriented footer — no star ratings or fake quality scores. */
export function SupplierSignalFooter({ verified, employeeCount, employeeBand, compact }: Props) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-t border-slate-100 text-xs ${compact ? "pt-2" : "pt-2.5"}`}>
      <span className={`inline-flex items-center gap-1 font-medium ${verified ? "text-emerald-700" : "text-slate-700"}`}>
        <ShieldCheck className={`w-3 h-3 ${verified ? "text-emerald-600" : "text-slate-400"}`} />
        {verified ? t("supplier.signals.registryVerified") : t("supplier.signals.verificationPending")}
      </span>
      {(employeeCount != null || employeeBand) && (
        <span className="text-slate-700 text-xs flex items-center gap-0.5">
          <Users className="w-3 h-3" />
          {employeeBand ?? (employeeCount != null ? employeeCount.toLocaleString() : "")}
          {!employeeBand && employeeCount != null ? ` ${t("category.employees")}` : ""}
        </span>
      )}
      {!employeeCount && !employeeBand && verified && (
        <span className="text-slate-700 text-xs inline-flex items-center gap-0.5">
          <FileText className="w-3 h-3" />
          {t("supplier.signals.rfqReady")}
        </span>
      )}
    </div>
  );
}
