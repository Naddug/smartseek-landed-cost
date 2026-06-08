"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { TrustLayerLinks } from "@/components/trust/TrustLayerLinks";

export function NedenOrtaqView() {
  const { t } = useTranslation();

  const problemPoints = t("whyOrtaqPage.problem.points", { returnObjects: true }) as string[];
  const approachItems = t("whyOrtaqPage.approach.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  const doesItems = t("whyOrtaqPage.does.items", { returnObjects: true }) as string[];
  const doesNotItems = t("whyOrtaqPage.doesNot.items", { returnObjects: true }) as Array<{
    heading: string;
    body: string;
  }>;
  const summaryCards = t("whyOrtaqPage.summary.cards", { returnObjects: true }) as Array<{
    q: string;
    a: string;
  }>;

  return (
    <PublicShell stickyCta={false}>
      <div className="bg-ortaq-surface">
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {t("whyOrtaqPage.label")}
              </p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
                {t("whyOrtaqPage.headline")}
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {t("whyOrtaqPage.subheadline")}
              </p>
            </div>
          </Container>
        </div>

        <div className="border-b border-ortaq-border">
          <Container wide>
            <div className="py-10 sm:py-14">
              <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem]">
                {t("whyOrtaqPage.problem.title")}
              </h2>
              <p className="mt-3 max-w-lg text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
                {t("whyOrtaqPage.problem.body")}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {problemPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 rounded-lg border border-ortaq-border bg-white px-4 py-3"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust" />
                    <span className="text-[0.8125rem] leading-relaxed text-ortaq-ink">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>

        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem]">
                {t("whyOrtaqPage.approach.title")}
              </h2>
              <p className="mt-3 max-w-lg text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
                {t("whyOrtaqPage.approach.body")}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {approachItems.map((item) => (
                  <div key={item.title} className="rounded-xl border border-ortaq-border p-5">
                    <h3 className="text-[0.9375rem] font-bold text-ortaq-ink">{item.title}</h3>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        <div className="border-b border-ortaq-border">
          <Container wide>
            <div className="py-10 sm:py-14">
              <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem]">
                {t("whyOrtaqPage.does.title")}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  {doesItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3"
                    >
                      <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                      <span className="text-[0.8125rem] leading-snug text-ortaq-ink">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {doesNotItems.map((item) => (
                    <div key={item.heading} className="rounded-lg border border-ortaq-border bg-white px-4 py-3">
                      <p className="text-[0.8125rem] font-bold text-ortaq-ink">{item.heading}</p>
                      <p className="mt-1 text-[0.75rem] leading-snug text-ortaq-ink-muted">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <h2 className="text-[1.125rem] font-bold tracking-[-0.025em] text-ortaq-ink sm:text-[1.375rem]">
                {t("whyOrtaqPage.summary.title")}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {summaryCards.map((card) => (
                  <div key={card.q} className="rounded-xl border border-ortaq-border p-5">
                    <p className="text-[0.8125rem] font-bold text-ortaq-trust">{card.q}</p>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-ortaq-ink">{card.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        <TrustLayerLinks />

        <div className="bg-ortaq-ink">
          <Container wide>
            <div className="py-12 sm:py-16">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight">
                    {t("whyOrtaqPage.cta.headline")}
                  </p>
                  <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                    {t("whyOrtaqPage.cta.subheadline")}
                  </p>
                </div>
                <Link
                  href="/teklif"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {t("whyOrtaqPage.cta.button")} →
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </PublicShell>
  );
}
