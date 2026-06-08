"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { QuoteForm } from "@/components/forms/QuoteForm";

export function QuotePageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <div className="min-h-[calc(100dvh-3.75rem)] bg-ortaq-surface">
        <Container wide>
          <div className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_480px] lg:items-start lg:gap-16">
            <div className="max-w-lg">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {t("quote.label")}
              </p>
              <h1 className="mt-3 text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-ortaq-ink sm:text-[2.5rem]">
                {t("quote.headline")}
              </h1>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {t("quote.subheadline")}
              </p>
              <div className="mt-8 space-y-3">
                {(t("quote.expectations", { returnObjects: true }) as string[]).map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="mt-px shrink-0 text-[0.5625rem] font-bold text-ortaq-trust">✓</span>
                    <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-[0.8125rem] text-ortaq-ink-muted">
                <a href="mailto:destek@ortaq.biz" className="font-semibold text-ortaq-trust hover:underline">
                  destek@ortaq.biz
                </a>
                {" · "}
                {t("quote.emailAlt")}
              </p>
            </div>
            <div className="rounded-2xl border border-ortaq-border bg-white p-6 shadow-sm sm:p-8">
              <QuoteForm />
              <p className="mt-4 text-center text-[0.6875rem] text-ortaq-ink-soft">
                {t("quote.privacy")}{" "}
                <Link href="/gizlilik" className="underline hover:text-ortaq-ink-muted">
                  {t("quote.privacyLink")}
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </PublicShell>
  );
}
