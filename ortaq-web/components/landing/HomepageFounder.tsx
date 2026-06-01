"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Sade, kurumsal kurucu kredibilite notu, sayfanın en altında. */
export function HomepageFounder() {
  const { t } = useTranslation();
  const linkedinUrl = t("homeLanding.founder.linkedinUrl");

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg-alt"
      aria-label={t("homeLanding.founder.aria")}
    >
      <Container wide className="py-9 sm:py-10">
        <div className="max-w-2xl">
          <p className={cn(typography.label, "text-ortaq-ink-soft")}>
            {t("homeLanding.founder.label")}
          </p>

          <p className={cn(typography.bodySm, "mt-2 font-semibold text-ortaq-ink")}>
            {t("homeLanding.founder.name")}
            <span className={cn(typography.caption, "ml-2 font-normal text-ortaq-ink-soft")}>
              {t("homeLanding.founder.role")}
            </span>
          </p>

          <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-muted")}>
            {t("homeLanding.founder.bio")}
          </p>

          <ul className="mt-4 space-y-2 border-t border-ortaq-border pt-4">
            {(["1", "2", "3", "4", "5"] as const).map((k) => (
              <li key={k} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                {t(`homeLanding.founder.credentials.${k}`)}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ortaq-border pt-4">
            {linkedinUrl ? (
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(typography.caption, typography.link, "font-medium")}
              >
                {t("homeLanding.founder.linkedinLabel")} →
              </Link>
            ) : null}
            <span className={cn(typography.caption, "text-ortaq-ink-soft")}>
              {t("homeLanding.founder.status")}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
