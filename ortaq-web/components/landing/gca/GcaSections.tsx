"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/* ============================================================ primitives */

const mono = "font-mono text-[0.6875rem] uppercase tracking-[0.12em]";

function Kicker({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={cn(mono, dark ? "text-ortaq-cream/50" : "text-ortaq-ink-soft")}>{children}</p>;
}

/* ============================================= signature 1: Transformation Spine */
function TransformationSpine({ active = 3, dark = false, size = "md" }: { active?: number; dark?: boolean; size?: "sm" | "md" }) {
  const { t } = useTranslation();
  const states = ["1", "2", "3", "4", "5", "6"] as const;
  const lineBase = dark ? "bg-ortaq-cream/15" : "bg-ortaq-border";
  const dotIdle = dark ? "border-ortaq-cream/30 bg-ortaq-dark text-ortaq-cream/50" : "border-ortaq-border bg-ortaq-bg text-ortaq-ink-soft";
  const labelIdle = dark ? "text-ortaq-cream/45" : "text-ortaq-ink-soft";
  const labelOn = dark ? "text-ortaq-cream" : "text-ortaq-ink";
  const big = size === "md";
  const dotSize = big ? "h-6 w-6 text-[0.625rem]" : "h-5 w-5 text-[0.5625rem]";
  const labelSize = big ? "text-[0.625rem]" : "text-[0.5625rem]";

  return (
    <div className="w-full">
      {/* Mobile: yatay kaydırma, bağlantı çizgisi yok */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory sm:-mx-6 sm:px-6 lg:mx-0 lg:hidden lg:px-0">
        {states.map((k, i) => {
          const reached = i <= active;
          const isOutcome = i === active;
          return (
            <div key={k} className="flex min-w-[4.75rem] shrink-0 snap-start flex-col items-center">
              <span
                className={cn(
                  "flex items-center justify-center rounded-full border font-mono tabular-nums",
                  dotSize,
                  isOutcome
                    ? "border-ortaq-trust bg-ortaq-trust text-ortaq-cream"
                    : reached
                      ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted"
                      : dotIdle,
                )}
              >
                {i + 1}
              </span>
              <span className={cn("mt-2 px-0.5 text-center font-medium leading-tight", labelSize, isOutcome ? cn(labelOn, "font-semibold") : labelIdle)}>
                {t(`gca.transform.states.${k}`)}
              </span>
            </div>
          );
        })}
      </div>
      {/* Desktop: 6 sütun grid */}
      <div className="hidden grid-cols-6 gap-y-6 lg:grid">
        {states.map((k, i) => {
          const reached = i <= active;
          const isOutcome = i === active;
          return (
            <div key={k} className="relative flex flex-col items-center">
              {i < states.length - 1 && (
                <span aria-hidden className={cn("absolute top-3 left-1/2 h-px w-full", reached && i < active ? "bg-ortaq-trust" : lineBase)} />
              )}
              <span
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full border font-mono tabular-nums",
                  dotSize,
                  isOutcome
                    ? "border-ortaq-trust bg-ortaq-trust text-ortaq-cream"
                    : reached
                      ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted"
                      : dotIdle,
                )}
              >
                {i + 1}
              </span>
              <span className={cn("mt-3 px-1 text-center font-medium leading-tight", labelSize, isOutcome ? cn(labelOn, "font-semibold") : labelIdle)}>
                {t(`gca.transform.states.${k}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================= signature 2: Evidence Ledger */
function EvidenceLedger({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation();
  const rows = ["1", "2", "3", "4"] as const;
  const filed = ["1", "2", "3"] as const;
  const cardBg = dark ? "bg-ortaq-dark border-ortaq-cream/15" : "bg-ortaq-surface border-ortaq-border";
  const head = dark ? "border-ortaq-cream/15 text-ortaq-cream/50" : "border-ortaq-border text-ortaq-ink-soft";
  const rowText = dark ? "text-ortaq-cream/85" : "text-ortaq-ink";
  const rowBorder = dark ? "border-ortaq-cream/10" : "border-ortaq-border";
  return (
    <div className={cn("overflow-hidden rounded-ortaq-md border", cardBg)}>
      <div className={cn("flex items-center justify-between border-b px-4 py-2.5", head)}>
        <span className={mono}>{t("gca.transform.evidenceLabel")}</span>
        <span className={mono}>{t("gca.surface.sample")}</span>
      </div>
      <ul>
        {rows.map((k, i) => {
          const isFiled = filed.includes(k as (typeof filed)[number]);
          return (
            <li key={k} className={cn("flex items-start justify-between gap-2 border-b px-3 py-2.5 sm:px-4 sm:items-center", rowBorder, i === rows.length - 1 && "border-b-0")}>
              <span className={cn("min-w-0 flex-1 text-[0.8125rem] leading-snug sm:text-[0.75rem]", rowText, dark ? "font-normal" : "font-normal")}>{t(`gca.transform.evidence.${k}`)}</span>
              <span className={cn("shrink-0 text-[0.625rem] font-medium", isFiled ? "text-ortaq-trust-muted" : dark ? "text-ortaq-cream/45" : "text-ortaq-ink-soft")}>
                {isFiled ? t("gca.transform.filed") : t("gca.transform.pending")}
              </span>
            </li>
          );
        })}
      </ul>
      <div className={cn("border-t px-3 py-3 sm:px-4", dark ? "border-ortaq-cream/15 bg-ortaq-cream/5" : "border-ortaq-border bg-ortaq-trust-soft")}>
        <span className={cn("text-[0.75rem] font-semibold", dark ? "text-ortaq-cream" : "text-ortaq-trust-muted")}>{t("gca.transform.derived")}</span>
        <p className={cn("mt-1 text-[0.75rem] leading-relaxed", dark ? "text-ortaq-cream/60" : "text-ortaq-ink-soft")}>{t("gca.transform.openQuestions")}</p>
      </div>
    </div>
  );
}

/* ============================================= signature 3: Capital Network */
function CapitalNetwork({ dark }: { dark?: boolean }) {
  const line = dark ? "rgba(244,240,232,0.18)" : "rgba(34,34,30,0.16)";
  const faint = dark ? "rgba(244,240,232,0.5)" : "rgba(34,34,30,0.45)";
  const ink = dark ? "#F4F0E8" : "#222220";
  const ys = [40, 96, 152];
  return (
    <svg viewBox="0 0 520 196" className="h-auto w-full" aria-hidden="true">
      <g stroke={line} strokeWidth="1">
        {ys.map((y) => <line key={`l${y}`} x1="70" y1={y} x2="260" y2="96" />)}
        {ys.map((y) => <line key={`r${y}`} x1="260" y1="96" x2="450" y2={y} />)}
      </g>
      {ys.map((y) => <circle key={`lc${y}`} cx="70" cy={y} r="4.5" fill={faint} />)}
      {ys.map((y) => <circle key={`rc${y}`} cx="450" cy={y} r="4.5" fill={faint} />)}
      <circle cx="260" cy="96" r="11" fill="none" stroke="var(--ortaq-trust,#2f6f5e)" strokeWidth="2" />
      <circle cx="260" cy="96" r="4" fill="var(--ortaq-trust,#2f6f5e)" />
      <text x="70" y="184" fill={ink} className="font-mono" fontSize="9" letterSpacing="1.5">ŞİRKETLER</text>
      <text x="234" y="184" fill={ink} className="font-mono" fontSize="9" letterSpacing="1.5">ORTAQ</text>
      <text x="408" y="184" fill={ink} className="font-mono" fontSize="9" letterSpacing="1.5">SERMAYE</text>
    </svg>
  );
}

/* ================================================================== hero */
export function GcaHero() {
  const { t } = useTranslation();
  const proof = ["1", "2", "3"] as const;
  const bullets = ["1", "2", "3"] as const;
  return (
    <section className="bg-ortaq-dark text-ortaq-cream" aria-label={t("gca.hero.headline")}>
      <Container wide className="py-10 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pr-8">
            <Kicker dark>{t("gca.hero.kicker")}</Kicker>
            <h1 className="mt-3 text-[1.625rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ortaq-cream sm:mt-5 sm:text-[2.25rem] sm:leading-[1.08] lg:text-[3rem]">
              {t("gca.hero.headline")}
            </h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.6] text-ortaq-cream/80 sm:mt-5 sm:text-base">{t("gca.hero.sub")}</p>
            <ul className="mt-5 space-y-2.5 sm:mt-6">
              {bullets.map((k) => (
                <li key={k} className="flex gap-2.5 text-[0.875rem] leading-snug text-ortaq-cream/90 sm:text-[0.9375rem]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust-muted" aria-hidden />
                  {t(`gca.hero.bullets.${k}`)}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ortaq-cream/55 sm:mt-5">{t("gca.hero.note")}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link href="#for-companies" className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-center text-[0.875rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90 sm:min-h-0">{t("gca.hero.ctaCompany")}</Link>
              <Link href="/demo/sermaye" className="inline-flex min-h-11 items-center justify-center rounded-ortaq-md border border-ortaq-cream/25 px-5 py-2.5 text-center text-[0.875rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/60 sm:min-h-0">{t("gca.hero.ctaCapital")}</Link>
            </div>
            <div className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 border-t border-ortaq-cream/12 pt-4 sm:mt-8 sm:flex sm:pt-5">
              {proof.map((k) => <span key={k} className="text-[0.6875rem] font-medium text-ortaq-cream/55">{t(`gca.hero.proof.${k}`)}</span>)}
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <EvidenceLedger dark />
          </div>
        </div>
        <div className="mt-8 border-t border-ortaq-cream/12 pt-6 lg:mt-14 lg:pt-8">
          <TransformationSpine active={3} dark />
        </div>
      </Container>
    </section>
  );
}

/* ============================================================== what is */
export function GcaWhatIs() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-label={t("gca.whatIs.title")}>
      <Container wide className="py-10 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{t("gca.whatIs.label")}</Kicker>
            <h2 className="mt-3 text-[1.375rem] font-semibold leading-[1.12] tracking-[-0.02em] text-ortaq-ink sm:text-[1.75rem] lg:text-[2rem]">{t("gca.whatIs.title")}</h2>
          </div>
          <div className="lg:col-span-8">
            {keys.map((k, i) => (
              <div key={k} className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-t border-ortaq-border py-6 first:border-t-0 first:pt-0">
                <span className="font-mono text-[1.25rem] tabular-nums text-ortaq-ink-soft">0{i + 1}</span>
                <div>
                  <p className="font-semibold text-ortaq-ink">{t(`gca.whatIs.cards.${k}.k`)}</p>
                  <p className={cn(typography.body, "mt-1.5 max-w-2xl text-ortaq-ink-muted")}>{t(`gca.whatIs.cards.${k}.v`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================== why fails */
export function GcaWhyFails() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("gca.broken.title")}>
      <Container wide className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <Kicker>{t("gca.broken.label")}</Kicker>
          <h2 className="mt-3 text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[2rem]">{t("gca.broken.title")}</h2>
        </div>
        <div className="mt-12 border-t border-ortaq-border">
          {keys.map((k, i) => (
            <div key={k} className="grid gap-2 border-b border-ortaq-border py-5 sm:grid-cols-[3rem_9rem_minmax(0,1fr)] sm:items-baseline sm:gap-4 sm:py-6">
              <span className="font-mono text-[1.25rem] leading-none tabular-nums text-ortaq-border-strong sm:text-[1.75rem]">0{i + 1}</span>
              <p className="font-semibold text-ortaq-ink">{t(`gca.broken.points.${k}.k`)}</p>
              <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t(`gca.broken.points.${k}.v`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================================================== audience */
export function GcaAudience() {
  const { t } = useTranslation();
  const c = ["1", "2", "3"] as const;
  const cj = ["1", "2", "3", "4", "5", "6"] as const;
  return (
    <section className="scroll-mt-20" aria-label="Şirketler ve sermaye partnerleri">
      {/* Company world — a record being built */}
      <div id="for-companies" className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20">
        <Container wide className="py-10 sm:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Kicker>{t("gca.forCompanies.label")}</Kicker>
              <h2 className="mt-3 text-[1.375rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.75rem] lg:text-[2.25rem]">{t("gca.forCompanies.title")}</h2>
              <p className={cn(typography.body, "mt-4 max-w-xl font-medium text-ortaq-ink")}>{t("gca.forCompanies.problem")}</p>
              <ul className="mt-6 max-w-xl">
                {c.map((k) => (
                  <li key={k} className={cn(typography.bodySm, "border-t border-ortaq-border py-3 text-ortaq-ink-muted first:border-t-0")}>{t(`gca.forCompanies.points.${k}`)}</li>
                ))}
              </ul>
              <Link href="/#basvuru" className="mt-7 inline-block rounded-ortaq-md bg-ortaq-trust px-5 py-2.5 text-[0.8125rem] font-medium text-ortaq-cream transition-opacity hover:opacity-90">{t("gca.forCompanies.cta")}</Link>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-ortaq-border lg:pl-10">
              <ol className="relative">
                {cj.map((k, i) => (
                  <li key={k} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ortaq-border bg-ortaq-surface font-mono text-[0.6875rem] tabular-nums text-ortaq-ink">{i + 1}</span>
                      {i < cj.length - 1 && <span aria-hidden className="mt-1 h-full w-px flex-1 bg-ortaq-border" />}
                    </div>
                    <span className={cn(typography.bodySm, "pt-1 font-medium text-ortaq-ink")}>{t(`gca.surface.companyJourney.${k}`)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </div>

      {/* Capital world — terminal pipeline */}
      <div id="for-capital" className="border-b border-ortaq-border bg-ortaq-dark text-ortaq-cream scroll-mt-20">
        <Container wide className="py-10 sm:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="rounded-ortaq-md border border-ortaq-cream/15">
                <div className="border-b border-ortaq-cream/15 px-4 py-2.5">
                  <span className={cn(mono, "text-ortaq-cream/50")}>{t("gca.forCapital.label")} · KEŞİF</span>
                </div>
                <ul>
                  {(["1", "2", "3"] as const).map((k, i) => (
                    <li key={k} className={cn("flex items-center justify-between gap-2 px-3 py-3 sm:px-4", i < 2 && "border-b border-ortaq-cream/10", i === 2 && "opacity-40")}>
                      <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-ortaq-cream/80">{t(`gca.forCapital.feed.${k}.name`)}</span>
                      <span className="shrink-0 text-[0.625rem] font-medium text-ortaq-trust-muted">{t(`gca.forCapital.feed.${k}.status`)}</span>
                    </li>
                  ))}
                  <li className="px-4 py-2.5">
                    <Link href="/demo/sermaye" className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ortaq-cream/55 hover:text-ortaq-cream">{t("gca.forCapital.feedLink")} →</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-6">
              <Kicker dark>{t("gca.forCapital.label")}</Kicker>
              <h2 className="mt-3 text-[1.375rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-cream sm:text-[1.75rem] lg:text-[2.25rem]">{t("gca.forCapital.title")}</h2>
              <p className="mt-4 max-w-xl text-[0.9375rem] font-medium text-ortaq-cream">{t("gca.forCapital.problem")}</p>
              <ul className="mt-6 max-w-xl">
                {c.map((k) => (
                  <li key={k} className="border-t border-ortaq-cream/12 py-3 text-[0.8125rem] text-ortaq-cream/80 first:border-t-0">{t(`gca.forCapital.points.${k}`)}</li>
                ))}
              </ul>
              <Link href="/demo/sermaye" className="mt-7 inline-block rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.8125rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90">{t("gca.forCapital.cta")}</Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ====================================================== how it works (centerpiece)
   Transformation Spine + evidence review panel aligned to demo flow              */
export function GcaHowItWorks() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4", "5", "6"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-label={t("gca.how.title")}>
      <Container wide className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <Kicker>{t("gca.how.label")}</Kicker>
          <h2 className="mt-3 text-[1.375rem] font-semibold leading-[1.12] tracking-[-0.02em] text-ortaq-ink sm:text-[2rem] lg:text-[2.5rem]">{t("gca.how.title")}</h2>
        </div>

        <div className="mt-8 sm:mt-14">
          <TransformationSpine active={3} />
        </div>

        {/* intelligence behind it: mechanism rail + evidence ledger */}
        <div className="mt-14 grid gap-10 border-t border-ortaq-border pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ol className="border-t border-ortaq-border">
              {keys.map((k, i) => (
                <li key={k} className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-b border-ortaq-border py-5">
                  <span className="font-mono text-[0.875rem] tabular-nums text-ortaq-trust-muted">0{i + 1}</span>
                  <div>
                    <p className="font-semibold text-ortaq-ink">{t(`gca.how.steps.${k}.k`)}</p>
                    <p className={cn(typography.bodySm, "mt-1 text-ortaq-ink-muted")}>{t(`gca.how.steps.${k}.v`)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>{t("gca.how.note")}</p>
          </div>
          <div className="lg:col-span-5">
            <EvidenceReviewPanel />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ===================================== Evidence review panel (aligned to demo) */
function EvidenceReviewPanel() {
  const { t } = useTranslation();
  const rows = ["1", "2", "3", "4"] as const;
  const filed = ["1", "2", "3"] as const;
  return (
    <div className="overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-bg">
      <div className="flex items-center justify-between border-b border-ortaq-border px-4 py-2.5">
        <span className={cn(mono, "text-ortaq-ink-soft")}>{t("gca.how.panelLabel")}</span>
        <span className={cn(mono, "text-ortaq-ink-soft")}>{t("gca.surface.sample")}</span>
      </div>
      <ul>
        {rows.map((k, i) => {
          const isFiled = filed.includes(k as (typeof filed)[number]);
          return (
            <li key={k} className={cn("flex items-start justify-between gap-2 border-b border-ortaq-border px-3 py-2.5 sm:items-center sm:px-4", i === rows.length - 1 && "border-b-0")}>
              <span className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-ortaq-ink">{t(`gca.transform.evidence.${k}`)}</span>
              <span className={cn("shrink-0 text-[0.625rem] font-medium", isFiled ? "text-ortaq-trust-muted" : "text-ortaq-ink-soft")}>
                {isFiled ? t("gca.transform.reviewed") : t("gca.transform.pending")}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="space-y-2 border-t border-ortaq-border bg-ortaq-trust-soft px-4 py-3">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] font-semibold text-ortaq-trust-muted">{t("gca.transform.derived")}</p>
        <p className="font-mono text-[0.625rem] leading-relaxed text-ortaq-ink-soft">{t("gca.transform.openQuestions")}</p>
        <p className="font-mono text-[0.625rem] leading-relaxed text-ortaq-trust-muted">{t("gca.how.panelNote")}</p>
      </div>
    </div>
  );
}

/* ================================================================= trust */
export function GcaTrust() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("gca.trust.title")}>
      <Container wide className="py-10 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{t("gca.trust.label")}</Kicker>
            <h2 className="mt-3 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.875rem]">{t("gca.trust.title")}</h2>
          </div>
          <ul className="lg:col-span-8">
            {keys.map((k, i) => (
              <li key={k} className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-5 border-t border-ortaq-border py-4 first:border-t-0">
                <span className="font-mono text-[0.6875rem] tabular-nums text-ortaq-trust-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t(`gca.trust.points.${k}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================= model
   ORTAQ nasıl kazanır + karşılıklı fayda (sade, editorial)                  */
export function GcaModel() {
  const { t } = useTranslation();
  const rows = ["ortaq", "company", "investor"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-label={t("gca.model.title")}>
      <Container wide className="py-10 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{t("gca.model.label")}</Kicker>
            <h2 className="mt-3 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.875rem]">{t("gca.model.title")}</h2>
            <p className={cn(typography.bodySm, "mt-4 max-w-sm text-ortaq-ink-muted")}>{t("gca.model.align")}</p>
            <p className={cn(mono, "mt-4 text-ortaq-trust-muted")}>{t("gca.model.note")}</p>
          </div>
          <div className="lg:col-span-8">
            {rows.map((r) => (
              <div key={r} className="flex flex-col gap-1 border-t border-ortaq-border py-4 first:border-t-0 sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5 sm:py-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
                <span className="font-semibold text-ortaq-ink">{t(`gca.model.${r}.k`)}</span>
                <span className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{t(`gca.model.${r}.v`)}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =================================================================== cta */
export function GcaCta() {
  const { t } = useTranslation();
  return (
    <section id="cta" className="bg-ortaq-dark text-ortaq-cream scroll-mt-20" aria-label={t("gca.cta.title")}>
      <Container wide className="py-10 sm:py-16 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Kicker dark>{t("gca.cta.label")}</Kicker>
            <h2 className="mt-3 max-w-2xl text-[1.375rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-cream sm:mt-4 sm:text-[2rem] lg:text-[2.75rem]">{t("gca.cta.title")}</h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.6] text-ortaq-cream/70 sm:mt-5">{t("gca.cta.body")}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link href="/#basvuru" className="rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90">{t("gca.cta.primaryCompany")}</Link>
              <Link href="/demo/sermaye" className="rounded-ortaq-md border border-ortaq-cream/25 px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/60">{t("gca.cta.secondaryCapital")}</Link>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <CapitalNetwork dark />
          </div>
        </div>
      </Container>
    </section>
  );
}
