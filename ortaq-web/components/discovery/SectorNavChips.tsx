"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const CHIPS = [
  { id: "machinery", labelKey: "machinery" },
  { id: "food", labelKey: "food" },
  { id: "textile", labelKey: "textile" },
  { id: "chemicals", labelKey: "chemicals" },
  { id: "logistics", labelKey: "logistics" },
] as const;

export function SectorNavChips() {
  const { t } = useTranslation();

  return (
    <nav className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("discovery.sectors.aria")}>
      <Container wide className="py-3">
        <div className="flex flex-wrap items-center gap-2">
          {CHIPS.map((chip) => (
            <Link
              key={chip.id}
              href={`/kesfet?sector=${chip.id}`}
              className={cn(
                typography.caption,
                "rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2.5 py-1 font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink",
              )}
            >
              {t(`discovery.home.sectorChips.${chip.labelKey}`)}
            </Link>
          ))}
          <Link
            href="/kesfet"
            className={cn(typography.caption, "px-1 font-medium text-ortaq-ink-soft hover:text-ortaq-ink hover:underline")}
          >
            {t("discovery.home.sectorChips.all")} →
          </Link>
        </div>
      </Container>
    </nav>
  );
}
