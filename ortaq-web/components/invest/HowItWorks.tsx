"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ClipboardList, FileSearch, LineChart, Shield, TrendingUp, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const steps = [
  { key: "1", icon: FileSearch },
  { key: "2", icon: ClipboardList },
  { key: "3", icon: Shield },
  { key: "4", icon: Wallet },
  { key: "5", icon: LineChart },
  { key: "6", icon: TrendingUp },
] as const;

const wealthKeys = ["1", "2", "3", "4"] as const;
const ownershipKeys = ["1", "2", "3", "4"] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="product-section bg-ortaq-bg-alt">
      <Container wide>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={typography.label}>{t("homeProduct.invest.process.label")}</p>
            <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.invest.process.title")}</h2>
            <p className={cn(typography.bodySm, "mt-2 max-w-2xl text-ortaq-ink-muted")}>
              {t("homeProduct.invest.process.subtitle")}
            </p>
          </div>
          <Link href="/nasil-calisir" className={cn(typography.bodySm, "font-semibold text-ortaq-trust hover:underline")}>
            {t("homeProduct.process.link")} →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ key, icon: Icon }, index) => (
            <div
              key={key}
              className="relative rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-5 shadow-[var(--shadow-product)] transition-[box-shadow,border-color] duration-200 hover:border-ortaq-trust/20 hover:shadow-[var(--shadow-product-hover)]"
            >
              <span className={cn(typography.meta, "font-semibold text-ortaq-ink-soft")}>{String(index + 1).padStart(2, "0")}</span>
              <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-ortaq-md bg-ortaq-trust-soft text-ortaq-trust">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className={cn(typography.h2, "mt-3")}>{t(`homeProduct.invest.process.steps.${key}.title`)}</h3>
              <p className={cn(typography.bodySm, "mt-1.5")}>{t(`homeProduct.invest.process.steps.${key}.text`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-ortaq-lg border border-ortaq-trust/15 bg-ortaq-surface p-5 shadow-[var(--shadow-product)] transition-[box-shadow,border-color] duration-200 hover:border-ortaq-trust/20 hover:shadow-[var(--shadow-product-hover)] sm:p-6">
          <p className={typography.label}>{t("homeProduct.invest.ownership.label")}</p>
          <h3 className={cn(typography.h1, "mt-1 text-[1.25rem] sm:text-[1.375rem]")}>{t("homeProduct.invest.ownership.title")}</h3>
          <p className={cn(typography.bodySm, "mt-2 max-w-3xl")}>{t("homeProduct.invest.ownership.lead")}</p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {ownershipKeys.map((key) => (
              <div key={key} className="rounded-ortaq-md border border-ortaq-border/80 bg-ortaq-bg-alt/50 p-4">
                <dt className={cn(typography.h3, "text-[0.9375rem]")}>{t(`homeProduct.invest.ownership.items.${key}.title`)}</dt>
                <dd className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>{t(`homeProduct.invest.ownership.items.${key}.text`)}</dd>
              </div>
            ))}
          </dl>
          <p className={cn(typography.caption, "mt-4 font-medium text-ortaq-trust-muted")}>
            {t("homeProduct.invest.ownership.examplesLabel")}: {t("homeProduct.invest.ownership.examples")}
          </p>
        </div>

        <div className="mt-6 rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-5 shadow-[var(--shadow-product)] sm:p-6">
          <h3 className={cn(typography.h2, "text-[1.125rem] sm:text-[1.25rem]")}>{t("homeProduct.invest.wealth.title")}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-ortaq-md bg-ortaq-bg-alt/60 p-4">
              <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("homeProduct.invest.wealth.mostLabel")}</p>
              <ul className="mt-2 space-y-1.5">
                {wealthKeys.map((key) => (
                  <li key={key} className={cn(typography.caption, "font-medium text-ortaq-ink-muted")}>
                    · {t(`homeProduct.invest.wealth.most.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-ortaq-md border border-ortaq-trust/15 bg-ortaq-trust-soft/30 p-4">
              <p className={cn(typography.label, "text-ortaq-trust-muted")}>{t("homeProduct.invest.wealth.fewLabel")}</p>
              <ul className="mt-2 space-y-1.5">
                {wealthKeys.map((key) => (
                  <li key={key} className={cn(typography.caption, "font-medium text-ortaq-ink")}>
                    · {t(`homeProduct.invest.wealth.few.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={cn(typography.bodySm, "mt-4 text-ortaq-ink-muted")}>{t("homeProduct.invest.wealth.barrier")}</p>
          <p className={cn(typography.bodySm, "mt-2 font-semibold text-ortaq-trust")}>{t("homeProduct.invest.wealth.positioning")}</p>
        </div>
      </Container>
    </section>
  );
}
