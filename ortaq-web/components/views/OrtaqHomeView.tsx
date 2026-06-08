"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { DemoPrepPanel } from "@/components/demo/DemoPrepPanel";

import { TransformationHero }     from "@/components/visuals/TransformationHero";
import { IntelligenceComparison } from "@/components/visuals/IntelligenceComparison";
import { OperationalMemory }      from "@/components/visuals/OperationalMemory";
import { OperationalReasoning }   from "@/components/visuals/OperationalReasoning";
import { WhyOrtaqDiffers }        from "@/components/visuals/WhyOrtaqDiffers";
import { PilotBriefing }          from "@/components/visuals/PilotBriefing";
import { PortfolioPreview }       from "@/components/visuals/PortfolioPreview";

export function OrtaqHomeView() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <PublicShell stickyCta>

      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-16">

            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {t("home.hero.eyebrow")}
              </p>
              <h1 className="mx-auto max-w-2xl font-body font-bold tracking-[-0.04em] text-ortaq-ink leading-[1.08] text-[2.25rem] sm:text-[3rem]">
                {t("home.hero.h1a")}<br />
                <span className="text-ortaq-trust">{t("home.hero.h1b")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[32rem] text-[0.9375rem] leading-[1.75] text-ortaq-ink-muted">
                {t("home.hero.sub")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {t("home.hero.cta")}
                </Link>
                <a
                  href="#ortaq-pilot"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-border px-5 text-[0.9375rem] font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink"
                >
                  {t("home.hero.ctaSecondary")}
                </a>
              </div>
              <p className="mx-auto mt-3 max-w-md text-[0.75rem] text-ortaq-ink-soft">
                {t("home.demo.heroNote")}
              </p>
              <p className="mx-auto mt-1 max-w-md text-[0.6875rem] text-ortaq-ink-soft/70">
                {t("home.hero.ctaNote")}
              </p>
            </div>

            <TransformationHero />

          </div>
        </Container>
      </section>

      <WhyOrtaqDiffers />

      <PilotBriefing />

      <section id="ortaq-anlama" className="border-b border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-14 sm:py-18">
            <div className="mb-8">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
                {isTR ? "Platform — işlem detayı" : "Platform — deal detail"}
              </p>
              <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.15] sm:text-[1.875rem]">
                {isTR
                  ? "Bağlı adımlar ve gecikme riski, kaynak yazışmadan çıkarılır."
                  : "Linked steps and delay risk, derived from source correspondence."}
              </h2>
              <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-cream/60">
                {isTR
                  ? "Aynı email: özet metin veya işlem dosyasındaki bağımlılık zinciri, risk ve atanmış iş."
                  : "Same email: summary text, or the dependency chain, risks, and assigned actions from the deal file."}
              </p>
            </div>
            <IntelligenceComparison />
          </div>
        </Container>
      </section>

      <OperationalReasoning />

      <PortfolioPreview />

      <OperationalMemory />

      <section className="border-t border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-16 sm:py-20 text-center">

            <h2 className="mx-auto max-w-2xl text-[1.875rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1] sm:text-[2.25rem]">
              {t("home.cta.h2a")}<br />
              <span className="text-ortaq-trust">{t("home.cta.h2b")}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ortaq-cream/70">
              {t("home.cta.sub")}
            </p>

            <DemoPrepPanel theme="dark" className="mx-auto mt-8 max-w-lg" />

            <p className="mx-auto mt-4 max-w-md text-[0.75rem] text-ortaq-cream/45">
              {t("home.cta.formNote")}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ortaq-trust px-8 text-[1rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
              >
                {t("home.cta.primary")}
              </Link>
              <a
                href="#ortaq-pilot"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ortaq-cream/20 px-6 text-[1rem] font-medium text-ortaq-cream/70 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
              >
                {t("home.cta.secondaryPreview")}
              </a>
            </div>

          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
