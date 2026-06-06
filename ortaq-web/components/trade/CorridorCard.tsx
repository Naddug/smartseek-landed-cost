"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";

type CorridorKey = "asean" | "gulf" | "europe";

const CORRIDOR_FLAGS: Record<CorridorKey, string> = {
  asean: "🇹🇷 ↔ 🌏",
  gulf: "🇹🇷 ↔ 🌍",
  europe: "🇹🇷 ↔ 🇪🇺",
};

const CORRIDOR_SLUGS: Record<CorridorKey, string> = {
  asean: "/corridors/turkey-asean",
  gulf: "/corridors/turkey-gulf",
  europe: "/corridors/turkey-europe",
};

type Props = {
  corridor: CorridorKey;
  showCta?: boolean;
};

export function CorridorCard({ corridor, showCta = true }: Props) {
  const { t } = useTranslation();

  const goods = t(`trade.corridors.${corridor}.goods`);
  const markets = t(`trade.corridors.${corridor}.markets`);
  const timeline = t(`trade.corridors.${corridor}.timeline`);
  const docs = t(`trade.corridors.${corridor}.docs`);

  return (
    <div className="flex flex-col rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-5 shadow-[var(--shadow-product)] transition-shadow hover:shadow-[var(--shadow-product-hover)]">
      {/* Header */}
      <div className="mb-4">
        <p className="mb-1 text-lg">{CORRIDOR_FLAGS[corridor]}</p>
        <h3 className={cn(typography.h2)}>{t(`trade.corridors.${corridor}.name`)}</h3>
        <p className={cn(typography.caption, "mt-0.5")}>{markets}</p>
      </div>

      {/* Meta rows */}
      <dl className="mb-4 space-y-2.5 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-3.5">
        <MetaRow label="Ürünler" value={goods} />
        <MetaRow label="Süre" value={timeline} />
        <MetaRow label="Belgeler" value={docs} />
      </dl>

      {/* CTA */}
      {showCta && (
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={CORRIDOR_SLUGS[corridor]}
            className={cn(
              typography.bodySm,
              "inline-flex min-h-10 items-center justify-between rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-4 font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg-alt hover:border-ortaq-border-strong",
            )}
          >
            {t("trade.corridors.learnMore")}
          </Link>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft">{label}</dt>
      <dd className="text-[0.8125rem] text-ortaq-ink-muted">{value}</dd>
    </div>
  );
}
