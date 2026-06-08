"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { VisualImage } from "@/components/home/visual/VisualImage";
import { homeVisuals } from "@/lib/home/visuals";

export function OperatorHero() {
  const { t } = useTranslation();
  const credentials = t("home.operator.proof.credentials", { returnObjects: true }) as string[];

  return (
    <section className="bg-ortaq-bg">
      <div className="grid lg:min-h-[min(100svh,900px)] lg:grid-cols-[1fr_360px]">
        <div className="grid min-h-[72svh] grid-cols-2 grid-rows-2 gap-1 sm:gap-1.5 lg:min-h-[min(100svh,900px)]">
          <div className="relative col-span-1 row-span-2 min-h-[48svh] overflow-hidden sm:min-h-[420px]">
            <VisualImage
              src={homeVisuals.hero.packaging}
              alt={t("home.operator.hero.altPackaging")}
              className="size-full"
              priority
            />
            <span className="absolute left-3 top-3 rounded-sm bg-ortaq-ink/80 px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white">
              {t("home.operator.hero.labels.packaging")}
            </span>
          </div>
          <div className="relative min-h-[24svh] overflow-hidden sm:min-h-[200px]">
            <VisualImage
              src={homeVisuals.hero.shelf}
              alt={t("home.operator.hero.altShelf")}
              className="size-full"
              priority
            />
            <span className="absolute left-3 top-3 rounded-sm bg-ortaq-ink/80 px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white">
              {t("home.operator.hero.labels.shelf")}
            </span>
          </div>
          <div className="relative min-h-[24svh] overflow-hidden sm:min-h-[200px]">
            <VisualImage
              src={homeVisuals.hero.export}
              alt={t("home.operator.hero.altExport")}
              className="size-full"
              priority
            />
            <span className="absolute left-3 top-3 rounded-sm bg-ortaq-ink/80 px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white">
              {t("home.operator.hero.labels.export")}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-ortaq-ink px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-ortaq-gold px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.14em] text-ortaq-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ortaq-ink" />
            {t("home.operator.hero.chipLive")}
          </span>

          <h1 className="mt-5 font-heading text-[2.25rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-[2.75rem] lg:text-[3rem]">
            {t("home.operator.hero.headline")}
          </h1>

          <div className="mt-6 flex flex-wrap gap-2 border-y border-white/15 py-4">
            {credentials.map((name) => (
              <span
                key={name}
                className="rounded-sm border border-ortaq-gold/50 bg-ortaq-gold/15 px-3 py-2 text-[0.8125rem] font-bold text-ortaq-gold sm:text-[0.9375rem]"
              >
                {name}
              </span>
            ))}
          </div>

          <Link
            href="/teklif"
            className="mt-8 flex min-h-14 w-full items-center justify-center rounded-lg bg-ortaq-gold text-[1rem] font-black uppercase tracking-[0.06em] text-ortaq-ink transition-all hover:bg-white active:scale-[0.98]"
          >
            {t("home.operator.hero.ctaPrimary")}
          </Link>

          <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/50">
            {t("home.operator.hero.chipNext")}
          </p>
        </div>
      </div>
    </section>
  );
}
