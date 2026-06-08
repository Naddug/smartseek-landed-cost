"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";

export function WlModel() {
  const { t } = useTranslation();
  const steps = t("home.whitelabel.model.steps", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg py-14 sm:py-20">
      <Container wide className="max-w-[72rem]">
        <div className="max-w-2xl">
          <h2 className="font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
            {t("home.whitelabel.model.title")}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ortaq-ink-muted">
            {t("home.whitelabel.model.lead")}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-ortaq-border pt-6">
              <span className="text-[0.75rem] font-semibold tabular-nums text-ortaq-trust">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[1rem] font-semibold text-ortaq-ink">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
