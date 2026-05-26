"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FadeIn } from "@/components/ui/FadeIn";
import { LayerReveal } from "@/components/ui/LayerReveal";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const steps = ["1", "2", "3"] as const;

/** Layer 5 — how you enter, whispered trust */
export function HomeEntryPath() {
  const { t } = useTranslation();

  return (
    <section id="nasil-calisir" className="bg-ortaq-bg-warm px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <LayerReveal depth="05" label={t("homeEntry.layerLabel")}>
        <FadeIn>
          <h2 className={cn("desire-whisper max-w-[18ch] text-ortaq-ink")}>{t("homeEntry.title")}</h2>
        </FadeIn>

        <ol className="mt-12 space-y-0">
          {steps.map((key, i) => (
            <FadeIn key={key} delay={i * 60}>
              <li className="grid grid-cols-[2rem_1fr] gap-x-5 border-t border-ortaq-border py-7 sm:grid-cols-[3rem_1fr] sm:py-8">
                <span className={cn(typography.caption, "pt-0.5 tabular-nums text-ortaq-gold")}>
                  {key.padStart(2, "0")}
                </span>
                <div>
                  <p className={cn(typography.body, "text-ortaq-ink")}>
                    {t(`homeEntry.steps.${key}.text`)}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>

        <FadeIn delay={200} className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/guven" className={cn(typography.bodySm, typography.link)}>
            {t("homeTrust.ctaTrust")} →
          </Link>
          <Link href="/riskler" className={cn(typography.bodySm, typography.link)}>
            {t("homeTrust.ctaRisk")} →
          </Link>
        </FadeIn>
      </LayerReveal>
    </section>
  );
}
