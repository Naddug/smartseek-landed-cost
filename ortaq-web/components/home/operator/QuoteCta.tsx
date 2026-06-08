"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { VisualImage } from "@/components/home/visual/VisualImage";
import { homeVisuals } from "@/lib/home/visuals";

export function QuoteCta() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[min(75svh,600px)] overflow-hidden bg-ortaq-ink">
      <VisualImage
        src={homeVisuals.close}
        alt={t("home.operator.closingCta.imageAlt")}
        className="absolute inset-0 size-full"
        imageClassName="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ortaq-ink/75" />

      <div className="relative flex min-h-[min(75svh,600px)] flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <h2 className="max-w-2xl font-heading text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-[3.5rem]">
          {t("home.operator.closingCta.headline")}
        </h2>

        <p className="mt-5 max-w-md text-[0.875rem] font-bold uppercase tracking-[0.12em] text-ortaq-gold">
          {t("home.operator.closingCta.reassurance")}
        </p>

        <Link
          href="/teklif"
          className="mt-10 flex min-h-[60px] w-full max-w-md items-center justify-center rounded-xl bg-ortaq-gold text-[1.0625rem] font-black uppercase tracking-[0.08em] text-ortaq-ink transition-all hover:bg-white active:scale-[0.98] sm:min-h-[64px] sm:text-[1.125rem]"
        >
          {t("home.operator.closingCta.cta")}
        </Link>
      </div>
    </section>
  );
}
