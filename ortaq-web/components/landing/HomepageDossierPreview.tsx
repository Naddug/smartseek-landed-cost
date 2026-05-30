"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const rowKeys = ["1", "2", "3", "4"] as const;

export function HomepageDossierPreview() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.dossier.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <p className={typography.label}>{t("homeLanding.dossier.label")}</p>
        <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.dossier.title")}
        </h2>

        <div className="mt-6 max-w-xl rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-6">
          <span
            className={cn(
              typography.label,
              "inline-block rounded-ortaq-sm border border-ortaq-border-strong px-2 py-0.5 text-ortaq-ink-soft",
            )}
          >
            {t("homeLanding.dossier.badge")}
          </span>

          <dl className="mt-4 divide-y divide-ortaq-border">
            {rowKeys.map((key) => (
              <div key={key} className="flex justify-between gap-4 py-2.5">
                <dt className={cn(typography.caption, "text-ortaq-ink-soft")}>
                  {t(`homeLanding.dossier.rows.${key}.k`)}
                </dt>
                <dd className={cn(typography.bodySm, "text-right font-medium text-ortaq-ink")}>
                  {t(`homeLanding.dossier.rows.${key}.v`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className={cn(typography.caption, "mt-4")}>{t("homeLanding.dossier.note")}</p>
      </Container>
    </section>
  );
}
