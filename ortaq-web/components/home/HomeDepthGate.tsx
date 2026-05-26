"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/ui/FadeIn";
import { LayerReveal } from "@/components/ui/LayerReveal";
import { OperationalTicker } from "@/components/home/OperationalTicker";
import { TraceField } from "@/components/operations/TraceField";
import { operationalPulse } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomeDepthGate() {
  const { t } = useTranslation();
  const stats = operationalPulse.stats;
  const gates = ["1", "2", "3"] as const;

  return (
    <section className="bg-ortaq-dark">
      <LayerReveal depth="04" label={t("homeGate.layerLabel")} className="px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <FadeIn>
          <h2 className={cn("desire-whisper text-ortaq-cream")}>{t("homeGate.title")}</h2>
          <p className={cn(typography.body, "mt-4 max-w-md text-ortaq-cream/55")}>{t("homeGate.whisper")}</p>
        </FadeIn>

        <TraceField layer="gate" variant="overlay" className="mt-8" />

        <FadeIn delay={60} className="mt-10 grid gap-6 sm:grid-cols-3">
          {gates.map((key) => (
            <div key={key} className="border-t border-white/10 pt-4">
              <p className={cn(typography.caption, "text-ortaq-gold/70")}>
                {t(`homeGate.items.${key}.step`)}
              </p>
              <p className={cn(typography.bodySm, "mt-2 text-ortaq-cream/80")}>
                {t(`homeGate.items.${key}.text`)}
              </p>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={100} className="mt-10 flex gap-8 border-t border-white/10 pt-6 sm:gap-12">
          <div>
            <p className="font-heading text-xl tabular-nums text-ortaq-cream sm:text-2xl">{stats.preliminaryReview}</p>
            <p className={cn(typography.caption, "mt-1 text-ortaq-cream/40")}>{t("homeOps.stats.preliminary")}</p>
          </div>
          <div>
            <p className="font-heading text-xl tabular-nums text-ortaq-cream sm:text-2xl">{stats.fieldVisitsCompleted}</p>
            <p className={cn(typography.caption, "mt-1 text-ortaq-cream/40")}>{t("homeOps.stats.fieldVisits")}</p>
          </div>
          <div>
            <p className="font-heading text-xl tabular-nums text-ortaq-cream sm:text-2xl">{stats.documentReview}</p>
            <p className={cn(typography.caption, "mt-1 text-ortaq-cream/40")}>{t("homeOps.stats.document")}</p>
          </div>
        </FadeIn>

        <FadeIn delay={140}>
          <Link
            href="/degerlendirme"
            className={cn(typography.bodySm, typography.linkLight, "mt-8 inline-flex min-h-11 items-center")}
          >
            {t("homeGate.link")} →
          </Link>
        </FadeIn>
      </LayerReveal>

      <div className="mt-8">
        <OperationalTicker variant="light" />
      </div>
    </section>
  );
}
