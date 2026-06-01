"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const steps = ["1", "2", "3"] as const;

export function DiscoveryMomentum() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface">
      <Container wide className="py-10 sm:py-12">
        <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.momentum.label")}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((k, i) => (
            <div key={k} className="border-t-2 border-ortaq-trust pt-4">
              <span className="font-mono text-[0.75rem] tabular-nums text-ortaq-ink-soft">0{i + 1}</span>
              <p className="mt-2 font-semibold text-ortaq-ink">{t(`discovery.momentum.steps.${k}.title`)}</p>
              <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>{t(`discovery.momentum.steps.${k}.body`)}</p>
            </div>
          ))}
        </div>
        <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>
          {t("discovery.momentum.note")}{" "}
          <Link href="/nasil-calisir" className={cn(typography.link, "font-medium")}>
            {t("discovery.momentum.processLink")} →
          </Link>
        </p>
      </Container>
    </section>
  );
}
