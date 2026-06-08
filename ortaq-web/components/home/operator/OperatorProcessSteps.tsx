"use client";

import { useTranslation } from "react-i18next";
import { Container, SectionHeader } from "@/components/ui/Section";

type OperatorProcessStepsProps = {
  sectionId?: string;
};

export function OperatorProcessSteps({ sectionId = "how-it-works" }: OperatorProcessStepsProps) {
  const { t } = useTranslation();
  const steps = t("home.operator.process.steps", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <section id={sectionId} className="border-b border-ortaq-border bg-ortaq-surface scroll-mt-20">
      <Container wide>
        <div className="py-12 sm:py-14">
          <SectionHeader
            title={t("home.operator.process.headline")}
            description={t("home.operator.process.subheadline")}
            align="center"
          />
          <ol className="mx-auto mt-8 grid max-w-3xl gap-4 sm:gap-5">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-ortaq-border bg-white px-5 py-4 sm:px-6 sm:py-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/10 text-[0.875rem] font-bold text-ortaq-trust">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[0.9375rem] font-bold text-ortaq-ink">{step.title}</p>
                  <p className="mt-1 text-[0.875rem] leading-relaxed text-ortaq-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
