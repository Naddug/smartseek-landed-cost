"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { VisualImage } from "@/components/home/visual/VisualImage";
import { homeVisuals } from "@/lib/home/visuals";

const STEP_IMAGES = [
  homeVisuals.journey.brief,
  homeVisuals.journey.source,
  homeVisuals.journey.sample,
  homeVisuals.journey.production,
  homeVisuals.journey.export,
  homeVisuals.journey.delivery,
] as const;

type OperatorProcessStepsProps = {
  sectionId?: string;
};

export function OperatorProcessSteps({ sectionId = "journey" }: OperatorProcessStepsProps) {
  const { t } = useTranslation();
  const steps = t("home.operator.journey.steps", { returnObjects: true }) as Array<{ label: string }>;

  return (
    <section id={sectionId} className="scroll-mt-20 bg-ortaq-ink py-10 sm:py-14">
      <div className="mb-6 px-5 sm:mb-8 sm:px-8">
        <h2 className="font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-white sm:text-[2.25rem]">
          {t("home.operator.journey.headline")}
        </h2>
      </div>

      <ol className="flex gap-3 overflow-x-auto px-5 pb-4 snap-x snap-mandatory sm:gap-4 sm:px-8">
        {steps.map((step, i) => (
          <li
            key={step.label}
            className="relative w-[78vw] shrink-0 snap-center overflow-hidden sm:w-[300px] lg:w-[340px]"
          >
            <div className="relative min-h-[360px] sm:min-h-[400px]">
              <VisualImage
                src={STEP_IMAGES[i]}
                alt={step.label}
                className="absolute inset-0 size-full"
                sizes="340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ortaq-ink/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-heading text-[2.5rem] font-semibold leading-none text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-[0.75rem] font-black uppercase tracking-[0.12em] text-white">
                  {step.label}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 px-5 sm:px-8">
        <Link
          href="/teklif"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-8 text-[0.875rem] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-ortaq-gold hover:text-ortaq-gold"
        >
          {t("home.operator.journey.cta")} →
        </Link>
      </div>
    </section>
  );
}
