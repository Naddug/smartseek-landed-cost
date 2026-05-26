"use client";

import { useTranslation } from "react-i18next";
import { dossierSections } from "@/lib/dossier/nav";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

export function DossierStickyNav() {
  const { t } = useTranslation();

  return (
    <nav
      className="sticky top-[3.75rem] z-40 border-b border-ortaq-border bg-ortaq-surface/95 backdrop-blur-sm"
      aria-label={t("dossier.nav.aria")}
    >
      <div className="product-scroll-row flex gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        {dossierSections.map(({ id, key }) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              typography.caption,
              "shrink-0 snap-start rounded-ortaq-sm border border-ortaq-border bg-ortaq-bg-alt/60 px-2.5 py-1.5 font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink",
            )}
          >
            {t(`dossier.nav.${key}`)}
          </a>
        ))}
      </div>
    </nav>
  );
}
