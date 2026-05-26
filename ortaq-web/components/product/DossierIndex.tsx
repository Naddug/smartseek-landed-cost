"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CompanyCard } from "@/components/product/CompanyCard";
import { ReviewStepper } from "@/components/product/ReviewStepper";
import { Container } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import type { SimulatedCampaign, CampaignStatus } from "@/lib/campaigns/types";
import {
  getFacilityArea,
  getLatestOperationalNote,
  getOperationalSignal,
  getSectorTag,
  getSectorTagEn,
} from "@/lib/product/company-summary";
import { formatPulseDate } from "@/lib/operations/pulse";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * The dossier index — the spine of the homepage.
 *
 * Filter chip rows (single-select per dimension) → card grid → comparison table.
 * Filters and sort are local state; URL persistence is intentionally deferred
 * until catalog count > 10 (no point until scanning surfaces emerge).
 */

type StageFilter = "all" | CampaignStatus;
type SectorFilter = "all" | "MFG" | "TEXTILE" | "FOOD" | "METAL" | "LOGISTICS" | "INDUSTRY";
type SortKey = "lastEvent" | "city" | "founded" | "employees";

const STAGE_FILTERS: StageFilter[] = [
  "all",
  "preliminary_review",
  "document_review",
  "field_verification",
  "committee",
];

function sortCampaigns(list: SimulatedCampaign[], key: SortKey, lang: string): SimulatedCampaign[] {
  const arr = [...list];
  switch (key) {
    case "city":
      return arr.sort((a, b) => a.city.localeCompare(b.city, lang));
    case "founded":
      return arr.sort((a, b) => b.founded - a.founded);
    case "employees":
      return arr.sort((a, b) => b.employees - a.employees);
    case "lastEvent":
    default:
      return arr.sort((a, b) => {
        const an = getLatestOperationalNote(a)?.date ?? "0";
        const bn = getLatestOperationalNote(b)?.date ?? "0";
        return an < bn ? 1 : an > bn ? -1 : 0;
      });
  }
}

export function DossierIndex() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "tr" ? "tr-TR" : "en-GB";

  const all = listCampaigns();

  const sectorOptions = useMemo<SectorFilter[]>(() => {
    const tags = new Set<SectorFilter>();
    for (const c of all) {
      tags.add(getSectorTagEn(c) as SectorFilter);
    }
    return ["all", ...Array.from(tags)];
  }, [all]);

  const [stage, setStage] = useState<StageFilter>("all");
  const [sector, setSector] = useState<SectorFilter>("all");
  const [sort, setSort] = useState<SortKey>("lastEvent");

  const filtered = useMemo(() => {
    const list = all.filter((c) => {
      if (stage !== "all" && c.reviewStatus !== stage) return false;
      if (sector !== "all" && getSectorTagEn(c) !== sector) return false;
      return true;
    });
    return sortCampaigns(list, sort, lang);
  }, [all, stage, sector, sort, lang]);

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" id="dosyalar" aria-label={t("homeProduct.index.aria")}>
      <Container wide>
        <div className="py-5 sm:py-6">
          {/* heading */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={typography.label}>{t("homeProduct.index.label")}</p>
              <h2 className={cn(typography.h1, "mt-1")}>{t("homeProduct.index.title")}</h2>
            </div>
            <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
              {t("homeProduct.index.resultCount", { count: filtered.length, total: all.length })}
            </p>
          </div>

          {/* filter rows */}
          <div className="mt-3 space-y-2">
            <FilterRow
              label={t("homeProduct.index.filter.stageLabel")}
              chips={STAGE_FILTERS.map((s) => ({
                value: s,
                label: s === "all" ? t("homeProduct.index.filter.all") : t(`homeProduct.index.filter.stage.${s}`),
                count: s === "all" ? all.length : all.filter((c) => c.reviewStatus === s).length,
              }))}
              active={stage}
              onPick={(v) => setStage(v as StageFilter)}
            />
            <FilterRow
              label={t("homeProduct.index.filter.sectorLabel")}
              chips={sectorOptions.map((s) => ({
                value: s,
                label:
                  s === "all"
                    ? t("homeProduct.index.filter.all")
                    : lang === "en"
                      ? s
                      : sectorLabelTr(s),
                count:
                  s === "all"
                    ? all.length
                    : all.filter((c) => getSectorTagEn(c) === s).length,
              }))}
              active={sector}
              onPick={(v) => setSector(v as SectorFilter)}
            />
            <SortRow
              value={sort}
              onChange={(v) => setSort(v)}
              tLastEvent={t("homeProduct.index.sort.lastEvent")}
              tCity={t("homeProduct.index.sort.city")}
              tFounded={t("homeProduct.index.sort.founded")}
              tEmployees={t("homeProduct.index.sort.employees")}
              tLabel={t("homeProduct.index.sort.label")}
            />
          </div>
        </div>

        {/* card grid */}
        {filtered.length === 0 ? (
          <EmptyState
            text={t("homeProduct.index.empty.title")}
            sub={t("homeProduct.index.empty.sub")}
            onReset={() => {
              setStage("all");
              setSector("all");
            }}
            resetLabel={t("homeProduct.index.empty.reset")}
          />
        ) : (
          <div className="grid gap-3 pb-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {filtered.map((c) => (
              <CompanyCard key={c.slug} campaign={c} />
            ))}
          </div>
        )}

        {/* comparison table */}
        {filtered.length > 0 && (
          <div className="border-t border-ortaq-border py-5 sm:py-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className={typography.label}>{t("homeProduct.index.compare.label")}</p>
              <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
                {t("homeProduct.index.compare.hint")}
              </p>
            </div>
            <div className="mt-3 overflow-x-auto rounded-ortaq-md border border-ortaq-border">
              <table className="w-full min-w-[42rem] text-left">
                <thead>
                  <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
                    <Th>{t("homeProduct.index.compare.company")}</Th>
                    <Th>{t("homeProduct.index.compare.city")}</Th>
                    <Th>{t("homeProduct.index.compare.sector")}</Th>
                    <Th>{t("homeProduct.index.compare.stage")}</Th>
                    <Th alignRight>{t("homeProduct.index.compare.capacity")}</Th>
                    <Th alignRight>{t("homeProduct.index.compare.export")}</Th>
                    <Th alignRight>{t("homeProduct.index.compare.employees")}</Th>
                    <Th>{t("homeProduct.index.compare.lastEvent")}</Th>
                    <Th aria-hidden> </Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const cap = getOperationalSignal(c, "kapasite", "capacity");
                    const exp = getOperationalSignal(c, "ihracat", "export");
                    const facility = getFacilityArea(c);
                    const last = getLatestOperationalNote(c);
                    const sectorTag = lang === "en" ? getSectorTagEn(c) : getSectorTag(c);
                    const stageLabel = t(`homeProduct.index.filter.stage.${c.reviewStatus}`);
                    return (
                      <tr key={c.slug} className="border-b border-ortaq-border last:border-0">
                        <Td>
                          <Link
                            href={`/sirket/${c.slug}`}
                            className={cn(typography.bodySm, "font-medium text-ortaq-ink hover:underline")}
                          >
                            {c.tradeName}
                          </Link>
                          <p className={cn(typography.caption, "text-ortaq-ink-soft truncate")}>
                            {c.region}
                          </p>
                        </Td>
                        <Td>{c.city}</Td>
                        <Td>
                          <span className="rounded-ortaq-sm bg-ortaq-bg-alt px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-ortaq-ink-muted">
                            {sectorTag}
                          </span>
                        </Td>
                        <Td>
                          <span className="text-ortaq-ink">{stageLabel}</span>
                          <div className="mt-1 max-w-[8rem]">
                            <ReviewStepper campaign={c} compact />
                          </div>
                        </Td>
                        <Td alignRight>
                          <span className="tabular-nums">{cap?.value ?? "—"}</span>
                          {facility && (
                            <p className={cn(typography.caption, "text-ortaq-ink-soft tabular-nums")}>
                              {facility}
                            </p>
                          )}
                        </Td>
                        <Td alignRight>
                          <span className="tabular-nums">{exp?.value ?? "—"}</span>
                          <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
                            {c.exportMarkets.length} {t("homeProduct.index.compare.markets")}
                          </p>
                        </Td>
                        <Td alignRight tabular>
                          {c.employees}
                        </Td>
                        <Td>
                          {last ? (
                            <span className={typography.bodySm}>
                              <span className={cn(typography.caption, "tabular-nums text-ortaq-ink-soft")}>
                                {formatPulseDate(last.date, locale)}
                              </span>
                              <span className="block line-clamp-1 text-ortaq-ink-muted">{last.text}</span>
                            </span>
                          ) : (
                            <span className={typography.caption}>—</span>
                          )}
                        </Td>
                        <Td>
                          <Link
                            href={`/sirket/${c.slug}`}
                            className={cn(typography.caption, "text-ortaq-ink hover:underline")}
                          >
                            {t("homeProduct.index.compare.open")} →
                          </Link>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Link
              href="/sirketler"
              className={cn(typography.bodySm, typography.link, "mt-3 inline-block")}
            >
              {t("homeProduct.index.openCompaniesPage")} →
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

function sectorLabelTr(tag: SectorFilter): string {
  switch (tag) {
    case "MFG":
      return "Üretim · Makine";
    case "TEXTILE":
      return "Tekstil";
    case "FOOD":
      return "Gıda";
    case "METAL":
      return "Metal · Döküm";
    case "LOGISTICS":
      return "Lojistik";
    case "INDUSTRY":
      return "Sanayi";
    default:
      return tag;
  }
}

type FilterChip = { value: string; label: string; count: number };

function FilterRow({
  label,
  chips,
  active,
  onPick,
}: {
  label: string;
  chips: FilterChip[];
  active: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={cn(typography.label, "mr-1 shrink-0 text-ortaq-ink-soft")}>{label}</span>
      {chips.map((chip) => {
        const isActive = chip.value === active;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onPick(chip.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-ortaq-sm border px-2.5 py-1 text-[0.8125rem] transition-colors",
              isActive
                ? "border-ortaq-ink bg-ortaq-ink text-ortaq-bg"
                : "border-ortaq-border bg-ortaq-surface text-ortaq-ink-muted hover:border-ortaq-border-strong hover:text-ortaq-ink",
            )}
            aria-pressed={isActive}
          >
            <span>{chip.label}</span>
            <span
              className={cn(
                "tabular-nums text-[0.6875rem]",
                isActive ? "text-ortaq-bg/70" : "text-ortaq-ink-soft",
              )}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SortRow({
  value,
  onChange,
  tLastEvent,
  tCity,
  tFounded,
  tEmployees,
  tLabel,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
  tLastEvent: string;
  tCity: string;
  tFounded: string;
  tEmployees: string;
  tLabel: string;
}) {
  const options: { key: SortKey; label: string }[] = [
    { key: "lastEvent", label: tLastEvent },
    { key: "city", label: tCity },
    { key: "founded", label: tFounded },
    { key: "employees", label: tEmployees },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={cn(typography.label, "mr-1 shrink-0 text-ortaq-ink-soft")}>{tLabel}</span>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={cn(
              "rounded-ortaq-sm border px-2.5 py-1 text-[0.8125rem] transition-colors",
              active
                ? "border-ortaq-ink bg-ortaq-ink text-ortaq-bg"
                : "border-ortaq-border bg-ortaq-surface text-ortaq-ink-muted hover:border-ortaq-border-strong hover:text-ortaq-ink",
            )}
            aria-pressed={active}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Th({
  children,
  alignRight,
}: {
  children: React.ReactNode;
  alignRight?: boolean;
  "aria-hidden"?: boolean;
}) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ortaq-ink-soft",
        alignRight && "text-right",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  alignRight,
  tabular,
}: {
  children: React.ReactNode;
  alignRight?: boolean;
  tabular?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 text-[0.8125rem] align-top text-ortaq-ink-muted",
        alignRight && "text-right",
        tabular && "tabular-nums",
      )}
    >
      {children}
    </td>
  );
}

function EmptyState({
  text,
  sub,
  onReset,
  resetLabel,
}: {
  text: string;
  sub: string;
  onReset: () => void;
  resetLabel: string;
}) {
  return (
    <div className="my-6 rounded-ortaq-md border border-dashed border-ortaq-border bg-ortaq-bg-alt/40 px-4 py-6 text-center">
      <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{text}</p>
      <p className={cn(typography.caption, "mt-1")}>{sub}</p>
      <button
        type="button"
        onClick={onReset}
        className={cn(
          typography.bodySm,
          "mt-3 inline-block text-ortaq-ink underline-offset-2 hover:underline",
        )}
      >
        {resetLabel}
      </button>
    </div>
  );
}
