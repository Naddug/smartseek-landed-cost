"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function DiscoveryHomeHero() {
  const { t } = useTranslation();
  const m = media.factoryFloor;

  return (
    <section className="relative overflow-hidden border-b border-ortaq-border bg-ortaq-ink text-ortaq-cream">
      <Image
        src={m.src}
        alt={t("media.factoryFloor.alt")}
        fill
        priority
        className="object-cover opacity-35"
        style={{ objectPosition: m.focalPoint }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ortaq-ink via-ortaq-ink/92 to-ortaq-ink/75" aria-hidden />

      <Container wide className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={cn(typography.label, "text-ortaq-cream/50")}>{t("discovery.home.kicker")}</p>
            <h1 className="mt-3 max-w-[16ch] text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.35rem] lg:text-[2.75rem]">
              {t("discovery.home.headline")}
            </h1>
            <p className={cn(typography.body, "mt-4 max-w-xl text-ortaq-cream/80")}>{t("discovery.home.sub")}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href="/kesfet"
                className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md bg-ortaq-cream px-5 text-[0.875rem] font-semibold text-ortaq-ink transition-opacity hover:opacity-90"
              >
                {t("discovery.home.ctaPrimary")}
              </Link>
              <Link
                href="/alan"
                className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md border border-ortaq-cream/30 px-5 text-[0.875rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/55"
              >
                {t("discovery.home.ctaWorkspace")}
              </Link>
            </div>
            <p className={cn(typography.caption, "mt-5 max-w-lg text-ortaq-cream/45")}>{t("discovery.home.legal")}</p>
          </div>

          <div className="lg:col-span-5">
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-ortaq-md border border-ortaq-cream/15 bg-ortaq-cream/10">
              {(["1", "2", "3"] as const).map((k) => (
                <div key={k} className="bg-ortaq-ink/80 px-3 py-4 sm:px-4">
                  <dt className="text-[0.625rem] font-medium uppercase tracking-[0.08em] text-ortaq-cream/45">
                    {t(`discovery.home.stats.${k}.label`)}
                  </dt>
                  <dd className="mt-1 font-mono text-[1.125rem] font-semibold tabular-nums text-ortaq-cream sm:text-[1.25rem]">
                    {t(`discovery.home.stats.${k}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
