"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const chainKeys = ["1", "2", "3", "4"] as const;
const flowKeys = ["1", "2", "3"] as const;

function Flow({ label, prefix }: { label: string; prefix: string }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className={cn(typography.label, "text-ortaq-trust-muted")}>{label}</p>
      <ol className="mt-3 flex list-none flex-col items-stretch sm:max-w-sm">
        {flowKeys.map((key, index) => (
          <li key={key} className="flex flex-col">
            <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-4 py-3">
              <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>
                {t(`${prefix}.${key}`)}
              </p>
            </div>
            {index < flowKeys.length - 1 && (
              <span
                aria-hidden="true"
                className="self-center py-1.5 text-base leading-none text-ortaq-ink-soft"
              >
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HomepageMoneyFlow() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg"
      aria-label={t("homeLanding.moneyFlow.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <p className={typography.label}>{t("homeLanding.moneyFlow.label")}</p>
        <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
          {t("homeLanding.moneyFlow.title")}
        </h2>

        {/* Konum zinciri: Üretici ↔ ORTAQ ↔ Lisanslı partner ↔ Yatırımcı */}
        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2">
          {chainKeys.map((key, index) => (
            <span key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  typography.bodySm,
                  "rounded-ortaq-sm border px-3 py-1.5 font-medium",
                  key === "2"
                    ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-ink"
                    : "border-ortaq-border bg-ortaq-surface text-ortaq-ink",
                )}
              >
                {t(`homeLanding.moneyFlow.chain.${key}`)}
              </span>
              {index < chainKeys.length - 1 && (
                <span aria-hidden="true" className="text-ortaq-ink-soft">
                  ↔
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <Flow label={t("homeLanding.moneyFlow.outLabel")} prefix="homeLanding.moneyFlow.out" />
          <Flow label={t("homeLanding.moneyFlow.backLabel")} prefix="homeLanding.moneyFlow.back" />
        </div>

        <p className={cn(typography.caption, "mt-6 max-w-2xl border-t border-ortaq-border pt-4")}>
          {t("homeLanding.moneyFlow.note")}
        </p>
      </Container>
    </section>
  );
}
