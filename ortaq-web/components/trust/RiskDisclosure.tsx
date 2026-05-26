"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const FULL_ITEMS = ["1", "2", "3", "4", "5"] as const;
const COMPACT_ITEMS = ["1", "2", "3"] as const;

type RiskDisclosureProps = {
  /** Homepage: 3 risks + link. Full page uses all 5 elsewhere. */
  compact?: boolean;
};

export function RiskDisclosure({ compact = false }: RiskDisclosureProps) {
  const { t } = useTranslation();
  const itemKeys = compact ? COMPACT_ITEMS : FULL_ITEMS;

  return (
    <Section tone="warm" id="riskler" spacing={compact ? "default" : "default"}>
      <Container narrow>
        <SectionHeader
          label={t("risk.label")}
          title={t("risk.title")}
          description={compact ? undefined : t("risk.intro")}
        />

        <ol className="border-y border-ortaq-border">
          {itemKeys.map((key) => (
            <li
              key={key}
              className="flex gap-4 border-b border-ortaq-border py-4 last:border-b-0 sm:py-5"
            >
              <span className="w-5 shrink-0 font-heading text-sm tabular-nums text-ortaq-ink-soft">
                {key}
              </span>
              <span className={typography.body}>{t(`risk.items.${key}`)}</span>
            </li>
          ))}
        </ol>

        <Link
          href="/riskler"
          className={cn(typography.bodySm, typography.link, "mt-5 inline-block min-h-11 leading-[2.75rem]")}
        >
          {t("risk.fullPageLink")}
        </Link>
      </Container>
    </Section>
  );
}
