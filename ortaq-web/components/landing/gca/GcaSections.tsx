"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------- helpers */

function SectionShell({
  id,
  surface = "bg",
  label,
  title,
  children,
  ariaLabel,
}: {
  id?: string;
  surface?: "bg" | "surface" | "alt" | "dark";
  label?: string;
  title?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const surfaceClass = {
    bg: "bg-ortaq-bg border-ortaq-border",
    surface: "bg-ortaq-surface border-ortaq-border",
    alt: "bg-ortaq-bg-alt border-ortaq-border",
    dark: "bg-ortaq-dark text-ortaq-cream border-transparent",
  }[surface];

  return (
    <section
      id={id}
      className={cn("border-b scroll-mt-20", surfaceClass)}
      aria-label={ariaLabel ?? title}
    >
      <Container wide className="py-10 sm:py-12">
        {label ? (
          <p className={cn(typography.label, surface === "dark" && "text-ortaq-cream/60")}>
            {label}
          </p>
        ) : null}
        {title ? (
          <h2
            className={cn(
              typography.h1,
              "mt-2 text-[1.375rem] sm:text-[1.5rem]",
              surface === "dark" && "text-ortaq-cream",
            )}
          >
            {title}
          </h2>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------- hero */

export function GcaHero() {
  const { t } = useTranslation();
  return (
    <section className="bg-ortaq-dark text-ortaq-cream" aria-label={t("gca.hero.headline")}>
      <Container wide className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <p className={cn(typography.label, "text-ortaq-cream/55")}>{t("gca.hero.kicker")}</p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ortaq-cream sm:text-[2.75rem] lg:text-[3.25rem]">
            {t("gca.hero.headline")}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.6] text-ortaq-cream/80 sm:text-base">
            {t("gca.hero.sub")}
          </p>
          <p className="mt-3 max-w-2xl text-[0.875rem] leading-[1.55] text-ortaq-cream/60">
            {t("gca.hero.support")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#for-capital"
              className="rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90"
            >
              {t("gca.hero.ctaCapital")}
            </Link>
            <Link
              href="#for-companies"
              className="rounded-ortaq-md border border-ortaq-cream/30 px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/60"
            >
              {t("gca.hero.ctaCompany")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- problem */

export function GcaProblem() {
  const { t } = useTranslation();
  return (
    <SectionShell surface="surface" label={t("gca.problem.label")} title={t("gca.problem.title")}>
      <p className={cn(typography.body, "mt-4 max-w-3xl text-ortaq-ink-muted")}>
        {t("gca.problem.body")}
      </p>
    </SectionShell>
  );
}

/* ----------------------------------------------------------------- broken */

export function GcaBroken() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3"] as const;
  return (
    <SectionShell surface="bg" label={t("gca.broken.label")} title={t("gca.broken.title")}>
      <div className="mt-8 grid gap-6 sm:grid-cols-3 lg:gap-8">
        {keys.map((k) => (
          <div key={k} className="border-t border-ortaq-border pt-4">
            <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
              {t(`gca.broken.points.${k}.k`)}
            </p>
            <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
              {t(`gca.broken.points.${k}.v`)}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* -------------------------------------------------------------- invisible */

export function GcaInvisible() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4"] as const;
  return (
    <SectionShell surface="surface" label={t("gca.invisible.label")} title={t("gca.invisible.title")}>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {keys.map((k) => (
          <div key={k} className="border-t border-ortaq-border pt-4">
            <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
              {t(`gca.invisible.points.${k}.k`)}
            </p>
            <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
              {t(`gca.invisible.points.${k}.v`)}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ----------------------------------------------------------------- engine */

export function GcaEngine() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4", "5"] as const;
  return (
    <SectionShell surface="alt" label={t("gca.engine.label")} title={t("gca.engine.title")}>
      <p className={cn(typography.body, "mt-3 max-w-2xl text-ortaq-ink-muted")}>
        {t("gca.engine.intro")}
      </p>
      <ol className="mt-8 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {keys.map((k, i) => (
          <li
            key={k}
            className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface p-4"
          >
            <span className={cn(typography.caption, "text-ortaq-trust-muted")}>0{i + 1}</span>
            <p className={cn(typography.bodySm, "mt-1 font-semibold text-ortaq-ink")}>
              {t(`gca.engine.layers.${k}.k`)}
            </p>
            <p className={cn(typography.caption, "mt-1.5 text-ortaq-ink-muted")}>
              {t(`gca.engine.layers.${k}.v`)}
            </p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

/* -------------------------------------------------------------- readiness */

function ScoreRing({ value = 78, label }: { value?: number; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--ortaq-border, #e5e2dc)" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--ortaq-trust, #2f6f5e)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[1.75rem] font-semibold tabular-nums text-ortaq-ink">{value}</span>
        <span className={cn(typography.caption, "text-ortaq-ink-soft")}>{label}</span>
      </div>
    </div>
  );
}

export function GcaReadiness() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4", "5"] as const;
  return (
    <SectionShell
      id="readiness"
      surface="surface"
      label={t("gca.readiness.label")}
      title={t("gca.readiness.title")}
    >
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className={cn(typography.body, "text-ortaq-ink-muted")}>{t("gca.readiness.body")}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {keys.map((k) => (
              <li key={k} className={cn(typography.bodySm, "flex items-center gap-2 text-ortaq-ink")}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                {t(`gca.readiness.metrics.${k}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-5 rounded-ortaq-lg border border-ortaq-border bg-ortaq-bg p-6">
          <ScoreRing value={78} label={t("gca.readiness.scoreLabel")} />
          <div className="space-y-2">
            {keys.map((k, i) => {
              const w = [88, 72, 64, 80, 70][i];
              return (
                <div key={k}>
                  <p className={cn(typography.caption, "text-ortaq-ink-soft")}>
                    {t(`gca.readiness.metrics.${k}`)}
                  </p>
                  <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-ortaq-border">
                    <div className="h-full rounded-full bg-ortaq-trust" style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            })}
            <p className={cn(typography.caption, "pt-1 text-ortaq-ink-soft")}>
              {t("gca.readiness.scoreNote")}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* --------------------------------------------------------------- matching */

function NetworkGlyph() {
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-sm" aria-hidden="true">
      <g stroke="var(--ortaq-border, #e5e2dc)" strokeWidth="1.5">
        <line x1="40" y1="60" x2="120" y2="30" />
        <line x1="40" y1="60" x2="120" y2="60" />
        <line x1="40" y1="60" x2="120" y2="90" />
        <line x1="200" y1="30" x2="120" y2="30" />
        <line x1="200" y1="60" x2="120" y2="60" />
        <line x1="200" y1="90" x2="120" y2="90" />
      </g>
      <circle cx="40" cy="60" r="9" fill="var(--ortaq-trust, #2f6f5e)" />
      {[30, 60, 90].map((y) => (
        <circle key={`l${y}`} cx="120" cy={y} r="6" fill="var(--ortaq-ink-soft, #8a8579)" />
      ))}
      {[30, 60, 90].map((y) => (
        <circle key={`r${y}`} cx="200" cy={y} r="6" fill="var(--ortaq-ink, #222)" />
      ))}
    </svg>
  );
}

export function GcaMatching() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4", "5", "6"] as const;
  return (
    <SectionShell surface="bg" label={t("gca.matching.label")} title={t("gca.matching.title")}>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div>
          <p className={cn(typography.body, "text-ortaq-ink-muted")}>{t("gca.matching.body")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {keys.map((k) => (
              <span
                key={k}
                className={cn(
                  typography.caption,
                  "rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-3 py-1.5 text-ortaq-ink",
                )}
              >
                {t(`gca.matching.dims.${k}`)}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <NetworkGlyph />
        </div>
      </div>
    </SectionShell>
  );
}

/* --------------------------------------------------- companies + capital */

export function GcaAudience() {
  const { t } = useTranslation();
  const c = ["1", "2", "3"] as const;
  return (
    <section
      className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20"
      aria-label={t("gca.forCompanies.title")}
    >
      <Container wide className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <article id="for-companies" className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-6 sm:p-7 scroll-mt-20">
            <p className={typography.label}>{t("gca.forCompanies.label")}</p>
            <h2 className={cn(typography.h2, "mt-2")}>{t("gca.forCompanies.title")}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.map((k) => (
                <li key={k} className={cn(typography.bodySm, "flex gap-2 text-ortaq-ink")}>
                  <span aria-hidden className="text-ortaq-trust">·</span>
                  {t(`gca.forCompanies.points.${k}`)}
                </li>
              ))}
            </ul>
          </article>
          <article id="for-capital" className="rounded-ortaq-lg border border-ortaq-border-strong bg-ortaq-surface p-6 sm:p-7 scroll-mt-20">
            <p className={typography.label}>{t("gca.forCapital.label")}</p>
            <h2 className={cn(typography.h2, "mt-2")}>{t("gca.forCapital.title")}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.map((k) => (
                <li key={k} className={cn(typography.bodySm, "flex gap-2 text-ortaq-ink")}>
                  <span aria-hidden className="text-ortaq-trust">·</span>
                  {t(`gca.forCapital.points.${k}`)}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ intelligence */

export function GcaIntelligence() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4"] as const;
  return (
    <SectionShell surface="dark" label={t("gca.intelligence.label")} title={t("gca.intelligence.title")}>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-[1.6] text-ortaq-cream/75">
        {t("gca.intelligence.body")}
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {keys.map((k) => (
          <li key={k} className="flex gap-2 text-[0.875rem] text-ortaq-cream/85">
            <span aria-hidden className="text-ortaq-cream/40">·</span>
            {t(`gca.intelligence.points.${k}`)}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ trust */

export function GcaTrust() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3"] as const;
  return (
    <SectionShell surface="bg" label={t("gca.trust.label")} title={t("gca.trust.title")}>
      <ul className="mt-5 max-w-2xl space-y-2">
        {keys.map((k) => (
          <li key={k} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
            {t(`gca.trust.points.${k}`)}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

/* -------------------------------------------------------------------- faq */

export function GcaFaq() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4"] as const;
  return (
    <SectionShell surface="surface" label={t("gca.faq.label")} title={t("gca.faq.title")}>
      <dl className="mt-6 max-w-3xl divide-y divide-ortaq-border">
        {keys.map((k) => (
          <div key={k} className="py-4">
            <dt className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>
              {t(`gca.faq.items.${k}.q`)}
            </dt>
            <dd className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>
              {t(`gca.faq.items.${k}.a`)}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}

/* -------------------------------------------------------------------- cta */

export function GcaCta() {
  const { t } = useTranslation();
  return (
    <section id="cta" className="bg-ortaq-dark text-ortaq-cream scroll-mt-20" aria-label={t("gca.cta.title")}>
      <Container wide className="py-14 sm:py-16">
        <p className={cn(typography.label, "text-ortaq-cream/55")}>{t("gca.cta.label")}</p>
        <h2 className="mt-2 max-w-2xl text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ortaq-cream sm:text-[1.875rem]">
          {t("gca.cta.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-[1.6] text-ortaq-cream/75">
          {t("gca.cta.body")}
        </p>
        <Link
          href="/#basvuru"
          className="mt-6 inline-block rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90"
        >
          {t("gca.cta.primary")}
        </Link>
      </Container>
    </section>
  );
}
