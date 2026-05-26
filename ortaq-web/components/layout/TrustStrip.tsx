"use client";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { formatPulseDate, operationalPulse } from "@/lib/operations/pulse";

const items = ["escrow", "mkk", "disclosure"] as const;

export function TrustStrip() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-GB" : "tr-TR";

  return (
    <div className="border-y border-ortaq-border bg-ortaq-bg-alt">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
          <p className={typography.caption}>{t("trustStrip.status")}</p>
          <p className={typography.caption}>
            {t("pulse.lastUpdated", {
              date: formatPulseDate(operationalPulse.siteLastUpdated, locale),
            })}
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 border-t border-ortaq-border py-5 sm:grid-cols-3 sm:gap-6 sm:py-6">
          {items.map((key) => (
            <li key={key}>
              <p className={typography.bodySm}>{t(`trustStrip.${key}`)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
