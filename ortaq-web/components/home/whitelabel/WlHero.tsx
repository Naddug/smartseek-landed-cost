"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { homeVisuals } from "@/lib/home/visuals";

export function WlHero() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface">
      <Container wide className="max-w-[72rem] py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[0.8125rem] font-medium text-ortaq-trust">
              {t("home.whitelabel.hero.eyebrow")}
            </p>
            <h1 className="mt-4 font-heading text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ortaq-ink sm:text-[2.75rem] lg:text-[3rem]">
              {t("home.whitelabel.hero.headline")}
            </h1>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ortaq-ink-muted">
              {t("home.whitelabel.hero.subheadline")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/teklif"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-ortaq-trust-deep px-7 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ortaq-trust"
              >
                {t("home.whitelabel.hero.cta")}
              </Link>
              <Link
                href="#live-program"
                className="text-[0.9375rem] font-medium text-ortaq-trust transition-colors hover:text-ortaq-trust-deep"
              >
                {t("home.whitelabel.hero.ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-ortaq-border bg-ortaq-bg-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={homeVisuals.hero.shelf}
              alt={t("home.whitelabel.hero.imageAlt")}
              className="aspect-[4/3] w-full object-cover"
              fetchPriority="high"
            />
            <p className="border-t border-ortaq-border px-4 py-3 text-[0.75rem] text-ortaq-ink-soft">
              {t("home.whitelabel.hero.imageCaption")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
