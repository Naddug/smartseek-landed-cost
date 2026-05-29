"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PartnerMatchScreen } from "@/components/landing/screens/PartnerMatchScreen";
import { ExportTrackScreen } from "@/components/landing/screens/ExportTrackScreen";
import { InvestorReturnScreen } from "@/components/landing/screens/InvestorReturnScreen";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const pillarKeys = ["1", "2", "3"] as const;

export function HomepagePlatformShowcase() {
  const { t } = useTranslation();

  return (
    <section
      id="platform"
      className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20"
      aria-label={t("homeLanding.showcase.aria")}
    >
      <Container wide className="py-10 sm:py-12 lg:py-14">
        <header className="landing-fade-in max-w-2xl">
          <p className={typography.label}>{t("homeLanding.showcase.label")}</p>
          <h2 className={cn(typography.h1, "mt-2 text-[1.5rem] sm:text-[1.75rem]")}>
            {t("homeLanding.showcase.title")}
          </h2>
          <p className={cn(typography.body, "mt-3")}>{t("homeLanding.showcase.lead")}</p>
        </header>

        <ul className="landing-fade-in-delayed mt-6 grid gap-3 sm:grid-cols-3">
          {pillarKeys.map((key) => (
            <li key={key} className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-4 py-3">
              <p className={cn(typography.caption, "font-semibold text-ortaq-trust-muted")}>
                {t(`homeLanding.showcase.pillars.${key}.step`)}
              </p>
              <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink")}>
                {t(`homeLanding.showcase.pillars.${key}.title`)}
              </p>
            </li>
          ))}
        </ul>

        <div className="landing-fade-in-delayed mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
          <PartnerMatchScreen />
          <ExportTrackScreen />
          <InvestorReturnScreen />
        </div>
      </Container>
    </section>
  );
}
