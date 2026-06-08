import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageView } from "@/components/views/CategoryPageView";
import {
  getCategoryBySlug,
  getLiveCategories,
  isCategoryPagePublic,
} from "@/lib/categories/registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLiveCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCategoryBySlug(slug);

  if (!entry?.seo || !isCategoryPagePublic(slug)) {
    return { title: "Kategori | ORTAQ" };
  }

  return {
    title: entry.seo.title.replace(/\s*\|\s*ORTAQ\s*$/i, "").trim(),
    description: entry.seo.description,
    alternates: { canonical: `/c/${slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isCategoryPagePublic(slug)) {
    notFound();
  }

  return <CategoryPageView slug={slug} />;
}
