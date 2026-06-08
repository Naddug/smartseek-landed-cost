"use client";

import { useTranslation } from "react-i18next";
import { Container, SectionHeader } from "@/components/ui/Section";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { getPublicCategories } from "@/lib/categories/registry";

export function CategoryRoadmap() {
  const { t } = useTranslation();
  const categories = getPublicCategories();

  if (categories.length === 0) return null;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-warm">
      <Container wide>
        <div className="py-12 sm:py-14">
          <SectionHeader
            title={t("categories.roadmap.headline")}
            description={t("categories.roadmap.body")}
            align="center"
          />
          <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3">
            {categories.map((entry) => (
              <CategoryCard key={entry.slug} entry={entry} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
