import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function MobileStickyCta() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ortaq-border bg-ortaq-bg safe-bottom md:hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/#nasil-calisir"
          className="text-sm text-ortaq-ink underline-offset-2 hover:underline"
        >
          {t("mobileCta.label")}
        </Link>
        <span className="shrink-0 text-xs text-ortaq-ink-soft">{t("mobileCta.sublabel")}</span>
      </div>
    </div>
  );
}
