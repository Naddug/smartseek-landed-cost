"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const signalKeys = ["1", "2", "3"] as const;

/** Illustrative dossier card, links to a real published dossier, no fabricated metrics. */
export function HomepageSampleDossier() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg-alt"
      aria-label={t("homeLanding.sample.aria")}
    >
      <Container wide className="py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex min-w-0 flex-col justify-center">
            <p className={typography.label}>{t("homeLanding.sample.label")}</p>
            <h2 className={cn(typography.h1, "mt-2 text-[1.375rem] sm:text-[1.5rem]")}>
              {t("homeLanding.sample.title")}
            </h2>
            <p className={cn(typography.body, "mt-3 max-w-lg")}>{t("homeLanding.sample.lead")}</p>
            <Link href="/sirketler" className={cn(typography.bodySm, typography.link, "mt-4 inline-block font-medium")}>
              {t("homeLanding.sample.linkAll")} →
            </Link>
          </div>

          <Link
            href="/sirket/karat-parca-konya"
            className="group overflow-hidden rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-surface shadow-[var(--shadow-product)] transition-shadow hover:shadow-[var(--shadow-product-hover)]"
          >
            <div className="relative aspect-[16/10] bg-ortaq-bg-warm">
              <Image
                src="/media/companies/karat-parca-konya.jpg"
                alt={t("homeLanding.sample.card.imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 rounded-ortaq-sm bg-ortaq-surface/95 px-2 py-1 text-[0.625rem] font-medium uppercase tracking-wide text-ortaq-trust">
                {t("homeLanding.sample.card.badge")}
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <p className={cn(typography.caption, "text-ortaq-ink-soft")}>{t("homeLanding.sample.card.sector")}</p>
              <p className={cn(typography.bodySm, "mt-1 font-semibold text-ortaq-ink")}>
                {t("homeLanding.sample.card.name")}
              </p>
              <p className={cn(typography.caption, "mt-0.5")}>{t("homeLanding.sample.card.location")}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-ortaq-border pt-4">
                {signalKeys.map((key) => (
                  <div key={key}>
                    <dt className={typography.caption}>{t(`homeLanding.sample.card.signals.${key}.label`)}</dt>
                    <dd className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-ink")}>
                      {t(`homeLanding.sample.card.signals.${key}.value`)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={cn(typography.caption, "mt-3 text-ortaq-ink-soft")}>
                {t("homeLanding.sample.card.footnote")}
              </p>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
