"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import {
  getCategoryLocaleBase,
  getCategoryPath,
  getPublicCategories,
  getPrimaryLiveCategory,
} from "@/lib/categories/registry";
import { cn } from "@/lib/cn";

export function WlCategoryLayers() {
  const { t } = useTranslation();
  const categories = getPublicCategories();
  const primary = getPrimaryLiveCategory();

  const live = categories.filter((c) => c.status === "live");
  const roadmap = categories.filter((c) => c.status === "roadmap");

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt py-14 sm:py-20">
      <Container wide className="max-w-[72rem]">
        <div className="max-w-2xl">
          <h2 className="font-heading text-[1.75rem] font-semibold tracking-[-0.03em] text-ortaq-ink sm:text-[2rem]">
            {t("home.whitelabel.layers.title")}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ortaq-ink-muted">
            {t("home.whitelabel.layers.lead")}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ortaq-trust">
              {t("home.whitelabel.layers.liveLabel")}
            </h3>
            <ul className="mt-4 space-y-3">
              {live.map((entry) => {
                const base = getCategoryLocaleBase(entry.slug);
                const isPrimary = entry.slug === primary?.slug;
                return (
                  <li key={entry.slug}>
                    <Link
                      href={getCategoryPath(entry.slug)}
                      className={cn(
                        "block rounded-lg border px-5 py-4 transition-colors",
                        isPrimary
                          ? "border-ortaq-trust/30 bg-ortaq-trust-soft"
                          : "border-ortaq-border bg-ortaq-surface hover:border-ortaq-trust/20",
                      )}
                    >
                      <p className="font-semibold text-ortaq-ink">{t(`${base}.name`)}</p>
                      <p className="mt-1 text-[0.875rem] text-ortaq-ink-muted">
                        {t(`${base}.summary`)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              {t("home.whitelabel.layers.roadmapLabel")}
            </h3>
            <ul className="mt-4 space-y-3">
              {roadmap.map((entry) => {
                const base = getCategoryLocaleBase(entry.slug);
                return (
                  <li
                    key={entry.slug}
                    className="rounded-lg border border-ortaq-border bg-ortaq-surface px-5 py-4"
                  >
                    <p className="font-semibold text-ortaq-ink">{t(`${base}.name`)}</p>
                    <p className="mt-1 text-[0.875rem] text-ortaq-ink-muted">
                      {t(`${base}.summary`)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-[0.875rem] leading-relaxed text-ortaq-ink-soft">
              {t("home.whitelabel.layers.roadmapNote")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
