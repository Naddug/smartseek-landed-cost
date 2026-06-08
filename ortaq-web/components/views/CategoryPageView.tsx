"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, SectionHeader } from "@/components/ui/Section";
import { getCategoryLocaleBase } from "@/lib/categories/registry";

type CategoryPageViewProps = {
  slug: string;
};

export function CategoryPageView({ slug }: CategoryPageViewProps) {
  const { t } = useTranslation();
  const base = getCategoryLocaleBase(slug);
  const points = t(`${base}.points`, { returnObjects: true }) as string[];

  return (
    <PublicShell stickyCta>
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-12 sm:py-14">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              {t("categories.pageLabel")}
            </p>
            <SectionHeader
              className="mt-2"
              title={t(`${base}.headline`)}
              description={t(`${base}.subheadline`)}
              titleAs="h1"
            />
            <div className="mt-8 max-w-2xl space-y-4">
              {points.map((point) => (
                <p key={point} className="text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                  · {point}
                </p>
              ))}
            </div>
            <Link
              href="/teklif"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white hover:bg-ortaq-trust-deep"
            >
              {t("categories.cta")}
            </Link>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
