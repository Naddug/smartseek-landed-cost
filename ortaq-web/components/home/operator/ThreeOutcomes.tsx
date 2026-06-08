"use client";

import { useTranslation } from "react-i18next";
import { VisualImage } from "@/components/home/visual/VisualImage";
import { homeVisuals } from "@/lib/home/visuals";

const OUTCOME_KEYS = ["packaging", "sample", "delivery"] as const;

export function ThreeOutcomes() {
  const { t } = useTranslation();
  const items = t("home.operator.outcomes.items", { returnObjects: true }) as Array<{
    caption: string;
    tag: string;
  }>;

  return (
    <section className="bg-ortaq-ink">
      <div className="grid sm:grid-cols-3">
        {OUTCOME_KEYS.map((key, i) => (
          <article key={key} className="relative min-h-[56vw] overflow-hidden sm:min-h-[440px]">
            <VisualImage
              src={homeVisuals.outcomes[key]}
              alt={items[i]?.caption ?? key}
              className="absolute inset-0 size-full"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ortaq-ink/90 via-ortaq-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <span className="font-heading text-[3rem] font-semibold leading-none tracking-[-0.04em] text-white/25 sm:text-[4rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ortaq-gold">
                {items[i]?.tag}
              </p>
              <p className="mt-2 font-heading text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[1.625rem]">
                {items[i]?.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
