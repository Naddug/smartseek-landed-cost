"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

export function TrustPageView() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const commitments = t("trustPage.commitments.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  const limits = t("trustPage.limits.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  const faq = t("trustPage.faq.items", { returnObjects: true }) as Array<{
    q: string;
    a: string;
  }>;

  return (
    <PublicShell stickyCta={false}>
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              {t("trustPage.label")}
            </p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.05] sm:text-[2.625rem]">
              {t("trustPage.headline")}
            </h1>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {t("trustPage.subheadline")}
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-ink">
              {t("trustPage.commitments.title")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {commitments.map((item) => (
                <div key={item.title} className="rounded-xl border border-emerald-100 bg-white p-5">
                  <p className="text-[0.875rem] font-bold text-ortaq-ink">{item.title}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-ink">
              {t("trustPage.limits.title")}
            </h2>
            <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
              {t("trustPage.limits.subheadline")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {limits.map((item) => (
                <div key={item.title} className="rounded-xl border border-ortaq-border bg-[#faf9f7] p-5">
                  <p className="text-[0.8125rem] font-bold text-ortaq-ink">{item.title}</p>
                  <p className="mt-2 text-[0.75rem] leading-relaxed text-ortaq-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="sik-sorulan-sorular" className="scroll-mt-20 border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-ink">
              {t("trustPage.faq.title")}
            </h2>
            <div className="mt-6 divide-y divide-ortaq-border overflow-hidden rounded-xl border border-ortaq-border bg-white">
              {faq.map((item, i) => (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#faf9f7]"
                  >
                    <span className="flex-1 text-[0.8125rem] font-semibold leading-snug text-ortaq-ink">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-[0.75rem] font-bold text-ortaq-ink-soft transition-transform",
                        openFaq === i && "rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-ortaq-border/50 bg-[#faf9f7] px-5 py-4">
                      <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.6875rem] text-ortaq-ink-soft">
              {t("trustPage.faq.more")}
              <Link href="/sss" className="ml-1 font-semibold text-ortaq-trust hover:underline">
                {t("trustPage.faq.moreLink")}
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-ortaq-ink">
        <Container wide>
          <div className="py-12 sm:py-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[1.25rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight">
                  {t("trustPage.cta.headline")}
                </h2>
                <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                  {t("trustPage.cta.subheadline")}
                </p>
              </div>
              <Link
                href="/teklif"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
              >
                {t("trustPage.cta.button")} →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
