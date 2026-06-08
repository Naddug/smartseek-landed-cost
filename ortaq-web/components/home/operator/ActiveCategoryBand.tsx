"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { VisualImage } from "@/components/home/visual/VisualImage";
import { homeVisuals } from "@/lib/home/visuals";
import { getCategoryLocaleBase, getPrimaryLiveCategory } from "@/lib/categories/registry";

export function ActiveCategoryBand() {
  const { t } = useTranslation();
  const primary = getPrimaryLiveCategory();

  if (!primary) return null;

  const base = getCategoryLocaleBase(primary.slug);
  const name = t(`${base}.name`);
  const stats = t("home.operator.liveNow.stats", { returnObjects: true }) as Array<{
    value: string;
    label: string;
  }>;

  return (
    <section id="live-now" className="bg-ortaq-bg-warm">
      <div className="bg-ortaq-trust-deep px-5 py-3 text-center sm:px-8">
        <p className="text-[0.6875rem] font-black uppercase tracking-[0.16em] text-white sm:text-[0.75rem]">
          {t("home.operator.liveNow.urgency")}
        </p>
      </div>

      <div className="grid gap-1 px-0 sm:gap-1.5 sm:px-0">
        <div className="relative min-h-[42vw] overflow-hidden sm:min-h-[320px]">
          <VisualImage
            src={homeVisuals.liveProgram.hero}
            alt={t("home.operator.liveNow.imageAlt", { name })}
            className="size-full"
            sizes="100vw"
          />
        </div>
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
          <div className="relative min-h-[28vw] overflow-hidden sm:min-h-[200px]">
            <VisualImage
              src={homeVisuals.liveProgram.granules}
              alt={t("home.operator.liveNow.altGranules")}
              className="size-full"
            />
          </div>
          <div className="relative min-h-[28vw] overflow-hidden sm:min-h-[200px]">
            <VisualImage
              src={homeVisuals.liveProgram.lineup}
              alt={t("home.operator.liveNow.altLineup")}
              className="size-full"
            />
          </div>
          <div className="relative min-h-[28vw] overflow-hidden sm:min-h-[200px]">
            <VisualImage
              src={homeVisuals.liveProgram.shelf}
              alt={t("home.operator.liveNow.altShelf")}
              className="size-full"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 py-10 sm:px-8 sm:py-14">
        <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-ortaq-trust px-3 py-1.5 text-[0.625rem] font-black uppercase tracking-[0.14em] text-white">
          <span className="h-2 w-2 rounded-full bg-ortaq-gold" />
          {t("home.operator.liveNow.badge")}
        </span>

        <h2 className="mt-5 font-heading text-[2.25rem] font-semibold leading-[0.95] tracking-[-0.04em] text-ortaq-ink sm:text-[3rem]">
          {t("home.operator.liveNow.opportunityHeadline", { name })}
        </h2>

        <div className="mt-8 grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-ortaq-ink/10 bg-white px-3 py-4 text-center sm:px-4 sm:py-5"
            >
              <p className="font-heading text-[1.25rem] font-semibold tracking-[-0.03em] text-ortaq-trust sm:text-[1.5rem]">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/teklif"
          className="mt-8 flex min-h-14 w-full max-w-lg items-center justify-center rounded-lg bg-ortaq-trust-deep text-[1rem] font-black uppercase tracking-[0.06em] text-white transition-all hover:bg-ortaq-trust active:scale-[0.98] sm:w-auto sm:px-12"
        >
          {t("home.operator.liveNow.ctaBrief")}
        </Link>
      </div>
    </section>
  );
}
