"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { homeVisuals } from "@/lib/home/visuals";
import {
  getCategoryLocaleBase,
  getCategoryPath,
  getPrimaryLiveCategory,
} from "@/lib/categories/registry";

export function WlLiveProgram() {
  const { t } = useTranslation();
  const primary = getPrimaryLiveCategory();
  if (!primary) return null;

  const base = getCategoryLocaleBase(primary.slug);
  const points = t(`${base}.points`, { returnObjects: true }) as string[];

  return (
    <section id="live-program" className="scroll-mt-20 border-b border-ortaq-border bg-ortaq-surface py-14 sm:py-20">
      <Container wide className="max-w-[72rem]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-lg border border-ortaq-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={homeVisuals.liveProgram.hero}
              alt={t("home.whitelabel.live.imageAlt")}
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-md bg-ortaq-trust-soft px-3 py-1 text-[0.75rem] font-semibold text-ortaq-trust">
              <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
              {t("home.whitelabel.live.badge")}
            </span>

            <h2 className="mt-5 font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-ortaq-ink sm:text-[2.25rem]">
              {t(`${base}.headline`)}
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ortaq-ink-muted">
              {t(`${base}.subheadline`)}
            </p>

            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[0.9375rem] leading-relaxed text-ortaq-ink-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ortaq-trust" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/teklif"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-ortaq-trust-deep px-7 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ortaq-trust"
              >
                {t("home.whitelabel.live.ctaBrief")}
              </Link>
              <Link
                href={getCategoryPath(primary.slug)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-ortaq-border px-7 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:border-ortaq-trust/40"
              >
                {t("home.whitelabel.live.ctaDetail")}
              </Link>
            </div>

            <p className="mt-6 text-[0.875rem] leading-relaxed text-ortaq-ink-soft">
              {t("home.whitelabel.live.note")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
