"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import {
  getOtherTrustPages,
  getTrustPageLocaleBase,
  type TrustPageKey,
} from "@/lib/trust/pages";

type TrustLayerPageViewProps = {
  pageKey: TrustPageKey;
};

type Section = {
  title: string;
  body: string;
  points?: string[];
};

export function TrustLayerPageView({ pageKey }: TrustLayerPageViewProps) {
  const { t } = useTranslation();
  const base = getTrustPageLocaleBase(pageKey);
  const sections = t(`${base}.sections`, { returnObjects: true }) as Section[];
  const steps = t(`${base}.steps`, { returnObjects: true, defaultValue: [] }) as Array<{
    title: string;
    body: string;
  }>;
  const otherPages = getOtherTrustPages(pageKey);

  return (
    <PublicShell stickyCta={false}>
      <div className="bg-ortaq-surface">
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {t("trustLayer.hubLabel")}
              </p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
                {t(`${base}.headline`)}
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {t(`${base}.subheadline`)}
              </p>
            </div>
          </Container>
        </div>

        {sections.map((section, i) => (
          <div
            key={section.title}
            className={cn(
              "border-b border-ortaq-border",
              i % 2 === 0 ? "bg-[#faf9f7]" : "bg-white",
            )}
          >
            <Container wide>
              <div className="py-10 sm:py-14">
                <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem]">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
                  {section.body}
                </p>
                {section.points && section.points.length > 0 && (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 rounded-lg border border-ortaq-border bg-white px-4 py-3"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust" />
                        <span className="text-[0.8125rem] leading-relaxed text-ortaq-ink">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Container>
          </div>
        ))}

        {steps.length > 0 && (
          <div className="border-b border-ortaq-border bg-white">
            <Container wide>
              <div className="py-10 sm:py-14">
                <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem]">
                  {t(`${base}.stepsTitle`)}
                </h2>
                <ol className="mx-auto mt-6 grid max-w-3xl gap-4">
                  {steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="flex gap-4 rounded-xl border border-ortaq-border bg-[#faf9f7] px-5 py-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/10 text-[0.875rem] font-bold text-ortaq-trust">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[0.9375rem] font-bold text-ortaq-ink">{step.title}</p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Container>
          </div>
        )}

        <div className="border-b border-ortaq-border bg-[#faf9f7]">
          <Container wide>
            <div className="py-10 sm:py-14">
              <h2 className="text-[1rem] font-bold text-ortaq-ink">{t("trustLayer.relatedTitle")}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {otherPages.map((page) => (
                  <li key={page.key}>
                    <Link
                      href={page.path}
                      className="block rounded-xl border border-ortaq-border bg-white px-4 py-3 transition-colors hover:border-ortaq-trust/40"
                    >
                      <p className="text-[0.875rem] font-semibold text-ortaq-ink">
                        {t(`trustLayer.links.${page.key}.title`)}
                      </p>
                      <p className="mt-1 text-[0.75rem] leading-relaxed text-ortaq-ink-muted">
                        {t(`trustLayer.links.${page.key}.description`)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>

        <div className="bg-ortaq-ink">
          <Container wide>
            <div className="py-12 sm:py-16">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight">
                    {t(`${base}.cta.headline`)}
                  </p>
                  <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                    {t(`${base}.cta.subheadline`)}
                  </p>
                </div>
                <Link
                  href="/teklif"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {t("categories.cta")} →
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </PublicShell>
  );
}
