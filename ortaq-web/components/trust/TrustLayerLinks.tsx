"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container, SectionHeader } from "@/components/ui/Section";
import { TRUST_PAGES } from "@/lib/trust/pages";

export function TrustLayerLinks() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-white">
      <Container wide>
        <div className="py-12 sm:py-14">
          <SectionHeader
            title={t("trustLayer.hubHeadline")}
            description={t("trustLayer.hubSubheadline")}
            align="center"
          />
          <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            {TRUST_PAGES.map((page) => (
              <li key={page.key}>
                <Link
                  href={page.path}
                  className="flex h-full flex-col rounded-xl border border-ortaq-border px-5 py-4 transition-colors hover:border-ortaq-trust/40 hover:bg-ortaq-surface"
                >
                  <span className="text-[0.9375rem] font-semibold text-ortaq-ink">
                    {t(`trustLayer.links.${page.key}.title`)}
                  </span>
                  <span className="mt-1.5 flex-1 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">
                    {t(`trustLayer.links.${page.key}.description`)}
                  </span>
                  <span className="mt-3 text-[0.75rem] font-semibold text-ortaq-trust">
                    {t("trustLayer.readMore")} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
