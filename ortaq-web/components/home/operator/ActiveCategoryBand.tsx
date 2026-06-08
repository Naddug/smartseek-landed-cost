"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import {
  getCategoryLocaleBase,
  getCategoryPath,
  getPrimaryLiveCategory,
} from "@/lib/categories/registry";

export function ActiveCategoryBand() {
  const { t } = useTranslation();
  const primary = getPrimaryLiveCategory();

  if (!primary) return null;

  const base = getCategoryLocaleBase(primary.slug);
  const name = t(`${base}.name`);
  const summary = t(`${base}.summary`);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
      <Container wide>
        <div className="py-10 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ortaq-ink sm:text-[1.5rem]">
              {t("categories.activeBand.headline")}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {t("categories.activeBand.body", { name, summary })}
            </p>
            <Link
              href={getCategoryPath(primary.slug)}
              className="mt-5 inline-flex text-[0.9375rem] font-semibold text-ortaq-trust transition-colors hover:text-ortaq-trust-deep hover:underline"
            >
              {t("categories.activeBand.link", { name })} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
