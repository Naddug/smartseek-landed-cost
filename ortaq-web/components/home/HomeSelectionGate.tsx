"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container, Section } from "@/components/ui/Section";
import { operationalPulse } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stages = ["1", "2", "3", "4"] as const;

/** Step 5 — selection seriousness */
export function HomeSelectionGate() {
  const { t } = useTranslation();
  const stats = operationalPulse.stats;

  return (
    <Section tone="dark" spacing="stage">
      <Container wide>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
          <FadeIn className="lg:col-span-5">
            <p className={typography.kickerLight}>{t("homeSelection.label")}</p>
            <h2 className={cn(typography.editorialLight, "mt-4")}>{t("homeSelection.title")}</h2>
            <p className={cn(typography.proseLight, "mt-6 max-w-prose editorial-rhythm")}>
              {t("homeSelection.lead")}
            </p>
            <Link
              href="/degerlendirme"
              className={cn(typography.bodySm, typography.linkLight, "mt-8 inline-flex min-h-11 items-center")}
            >
              {t("homeSelection.link")}
            </Link>
          </FadeIn>

          <FadeIn delay={100} className="mt-12 lg:col-span-7 lg:mt-0">
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {stages.map((key) => (
                <li key={key} className="py-6 sm:py-7">
                  <span className={cn(typography.caption, "text-ortaq-gold/80")}>
                    {t(`homeSelection.stages.${key}.step`)}
                  </span>
                  <h3 className={cn(typography.h3, "mt-2 text-ortaq-cream")}>
                    {t(`homeSelection.stages.${key}.title`)}
                  </h3>
                  <p className={cn(typography.bodySm, "mt-2 text-ortaq-cream/65")}>
                    {t(`homeSelection.stages.${key}.text`)}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              <div>
                <p className="font-heading text-2xl tabular-nums text-ortaq-cream sm:text-3xl">
                  {stats.preliminaryReview}
                </p>
                <p className={cn(typography.caption, "mt-1 text-ortaq-cream/50")}>
                  {t("homeOps.stats.preliminary")}
                </p>
              </div>
              <div>
                <p className="font-heading text-2xl tabular-nums text-ortaq-cream sm:text-3xl">
                  {stats.fieldVisitsCompleted}
                </p>
                <p className={cn(typography.caption, "mt-1 text-ortaq-cream/50")}>
                  {t("homeOps.stats.fieldVisits")}
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {operationalPulse.logs.slice(0, 2).map((log) => (
                <li key={log.id} className={cn(typography.caption, "text-ortaq-cream/45")}>
                  {log.date} — {t(`homeOps.logs.${log.key}`)}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
