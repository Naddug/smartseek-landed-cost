"use client";

import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

export function OnePartner() {
  const { t } = useTranslation();
  const painItems = t("home.operator.partner.withoutItems", { returnObjects: true }) as string[];
  const withSteps = t("home.operator.partner.withSteps", { returnObjects: true }) as string[];

  return (
    <section className="bg-ortaq-bg py-16 sm:py-24">
      <Container wide className="max-w-[90rem]">
        <h2 className="max-w-xl font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-ortaq-ink sm:text-[2.25rem]">
          {t("home.operator.partner.headline")}
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative overflow-hidden rounded-2xl bg-[#e8e4de] px-8 py-10 sm:px-10 sm:py-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-12deg, transparent, transparent 18px, rgba(20,19,16,0.04) 18px, rgba(20,19,16,0.04) 19px)",
              }}
            />
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ortaq-ink-soft">
              {t("home.operator.partner.withoutLabel")}
            </p>
            <ul className="relative mt-6 space-y-4">
              {painItems.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[0.9375rem] text-ortaq-ink-muted"
                  style={{ transform: `translateX(${i % 2 === 0 ? 0 : 12}px)` }}
                >
                  <span className="h-px w-6 shrink-0 bg-ortaq-ink-soft/50" />
                  <span className="line-through decoration-ortaq-ink-soft/30">{item}</span>
                </li>
              ))}
            </ul>
            <div className="relative mt-8 flex flex-wrap gap-2 opacity-60">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className="h-8 rounded-md bg-ortaq-ink/[0.06] px-4"
                  style={{ width: `${56 + n * 18}px` }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-ortaq-cream px-8 py-10 sm:px-10 sm:py-12">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ortaq-trust">
              {t("home.operator.partner.withLabel")}
            </p>
            <div className="mt-8 flex items-center gap-2">
              {withSteps.map((step, i) => (
                <div key={step} className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold",
                        i === withSteps.length - 1
                          ? "bg-ortaq-trust text-white"
                          : "bg-ortaq-trust-soft text-ortaq-trust",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="text-center text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-ortaq-ink-muted">
                      {step}
                    </span>
                  </div>
                  {i < withSteps.length - 1 ? (
                    <div className="mb-6 h-px flex-1 bg-ortaq-trust/25" />
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-10 text-[1.125rem] font-semibold leading-snug text-ortaq-ink">
              {t("home.operator.partner.withPromise")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
