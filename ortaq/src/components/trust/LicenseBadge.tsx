import { useTranslation } from "react-i18next";
import { cn } from "@ortaq/lib/cn";
import { StatusBadge } from "@ortaq/components/trust/StatusBadge";
import { typography } from "@ortaq/design/typography";

type LicenseBadgeProps = {
  className?: string;
  compact?: boolean;
};

export function LicenseBadge({ className, compact }: LicenseBadgeProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("border-l-2 border-ortaq-border-strong pl-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <p className={cn(compact ? typography.caption : typography.bodySm, "text-ortaq-ink-muted")}>
          {t("trust.license.status")}
        </p>
        <StatusBadge status="pending" />
      </div>
      {!compact && (
        <p className={cn(typography.caption, "mt-2 max-w-prose")}>{t("trust.license.detail")}</p>
      )}
    </div>
  );
}
