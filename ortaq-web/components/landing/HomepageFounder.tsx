"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const photoKeys = ["1", "2", "3"] as const;

/** Mütevazı kurucu notu, sayfanın en altında. Öne çıkmaz; isteyen görür. */
export function HomepageFounder() {
  const { t } = useTranslation();
  const linkedinUrl = t("homeLanding.founder.linkedinUrl");

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg-alt"
      aria-label={t("homeLanding.founder.aria")}
    >
      <Container wide className="py-8 sm:py-9">
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

          <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>
            {t("homeLanding.founder.bio")}
          </p>

          {/* İnce, küçük saha şeridi */}
          <div className="mt-4 flex gap-2">
            {photoKeys.map((key) => (
              <div
                key={key}
                className="relative h-16 w-20 overflow-hidden rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-warm sm:h-20 sm:w-28"
              >
                <Image
                  src={t(`homeLanding.founder.photos.${key}.src`)}
                  alt={t(`homeLanding.founder.photos.${key}.alt`)}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <p className={cn(typography.caption, "mt-2 text-ortaq-ink-soft")}>
            {t("homeLanding.founder.photosNote")}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
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
