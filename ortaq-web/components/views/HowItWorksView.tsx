"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/ui/Section";
import { OperatorProcessSteps } from "@/components/home/operator/OperatorProcessSteps";
import {
  getCategoryLocaleBase,
  getCategoryPath,
  getPrimaryLiveCategory,
} from "@/lib/categories/registry";

export function HowItWorksView() {
  const { t } = useTranslation();
  const primaryCategory = getPrimaryLiveCategory();
  const highlights = t("howItWorksPage.highlights", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <PublicShell stickyCta>
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-10 sm:py-14">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              {t("howItWorksPage.label")}
            </p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
              {t("howItWorksPage.headline")}
            </h1>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {t("howItWorksPage.subheadline")}
            </p>
          </div>
        </Container>
      </section>

      <OperatorProcessSteps />

      <section className="border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-10 sm:py-14">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.5rem]">
              {t("howItWorksPage.highlightsTitle")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-ortaq-border bg-white p-5">
                  <h3 className="text-[0.9375rem] font-bold text-ortaq-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-12 sm:py-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight">
                  {t("howItWorksPage.cta.headline")}
                </p>
                <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                  {t("howItWorksPage.cta.subheadline")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {primaryCategory && (
                  <Link
                    href={getCategoryPath(primaryCategory.slug)}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                  >
                    {t("howItWorksPage.cta.categoryLink", {
                      name: t(`${getCategoryLocaleBase(primaryCategory.slug)}.name`),
                    })}{" "}
                    →
                  </Link>
                )}
                <Link
                  href="/teklif"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {t("howItWorksPage.cta.quoteLink")} →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
