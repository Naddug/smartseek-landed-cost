"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const SECTIONS = [
  "problem",
  "solution",
  "whyNow",
  "founder",
  "verification",
  "businessModel",
  "regulatory",
  "validation",
  "vision",
] as const;

export function InvestorsPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact" className="border-b border-ortaq-border bg-ortaq-bg">
        <Container narrow>
          <p className={typography.label}>{t("investorsPage.eyebrow")}</p>
          <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
            {t("investorsPage.title")}
          </h1>
          <p className={cn(typography.body, "mt-4 max-w-2xl")}>{t("investorsPage.lead")}</p>
          <p className={cn(typography.caption, "mt-4 text-ortaq-ink-soft")}>{t("investorsPage.audience")}</p>
        </Container>
      </Section>

      <div className="bg-ortaq-surface">
        {SECTIONS.map((key, i) => (
          <section
            key={key}
            id={key}
            className={cn(
              "scroll-mt-24 border-b border-ortaq-border",
              i % 2 === 0 ? "bg-ortaq-surface" : "bg-ortaq-bg-alt",
            )}
          >
            <Container narrow className="py-10 sm:py-12">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[1.375rem]">
                {t(`investorsPage.sections.${key}.title`)}
              </h2>
              <div className={cn(typography.bodySm, "mt-4 max-w-prose space-y-3 leading-relaxed text-ortaq-ink-muted")}>
                <p>{t(`investorsPage.sections.${key}.body`)}</p>
                {t(`investorsPage.sections.${key}.body2`, { defaultValue: "" }) ? (
                  <p>{t(`investorsPage.sections.${key}.body2`)}</p>
                ) : null}
              </div>
              {key === "founder" ? (
                <ul className="mt-5 space-y-2 border-l-2 border-ortaq-border-strong pl-4">
                  {(["b1", "b2", "b3", "b4", "b5"] as const).map((id) => (
                    <li key={id} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                      {t(`investorsPage.sections.founder.${id}`)}
                    </li>
                  ))}
                </ul>
              ) : null}
              {key === "validation" ? (
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(["m1", "m2", "m3", "m4"] as const).map((id) => (
                    <div key={id} className="border border-ortaq-border bg-ortaq-bg px-3 py-3">
                      <dt className={typography.caption}>{t(`investorsPage.sections.validation.${id}Label`)}</dt>
                      <dd className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-ink")}>
                        {t(`investorsPage.sections.validation.${id}Value`)}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </Container>
          </section>
        ))}
      </div>

      <Section spacing="compact" className="border-t border-ortaq-border bg-ortaq-bg">
        <Container narrow>
          <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t("investorsPage.closing")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:destek@ortaq.biz"
              className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md bg-ortaq-ink px-5 text-[0.875rem] font-semibold text-ortaq-cream"
            >
              {t("investorsPage.ctaContact")}
            </a>
            <Link
              href="/ekip"
              className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md border border-ortaq-border-strong px-5 text-[0.875rem] font-semibold text-ortaq-ink"
            >
              {t("investorsPage.ctaTeam")} →
            </Link>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
