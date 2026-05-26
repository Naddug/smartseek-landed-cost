"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { formatPulseDate, operationalPulse } from "@/lib/operations/pulse";

const pillars = ["production", "registry", "process"] as const;

export function HomeInstitutionStrip() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-GB" : "tr-TR";

  return (
    <div className="border-b border-ortaq-border bg-ortaq-ink text-ortaq-cream">
      <Container>
        <div className="grid gap-8 py-8 sm:grid-cols-3 sm:gap-6 sm:py-10">
          {pillars.map((key) => (
            <div key={key} className="border-l border-ortaq-gold/40 pl-4 sm:pl-5">
              <p className={typography.kickerLight}>{t(`homeInstitution.${key}.label`)}</p>
              <p className={cn(typography.bodySm, "mt-2 text-ortaq-cream/80")}>
                {t(`homeInstitution.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
        <p className={cn(typography.caption, "border-t border-white/10 pb-6 pt-4 text-ortaq-cream/45")}>
          {t("homeInstitution.status", {
            date: formatPulseDate(operationalPulse.siteLastUpdated, locale),
          })}
        </p>
      </Container>
    </div>
  );
}
