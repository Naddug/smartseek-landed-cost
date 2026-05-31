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
function TransformationSpine({ active = 2, dark = false, size = "md" }: { active?: number; dark?: boolean; size?: "sm" | "md" }) {
  const { t } = useTranslation();
  const states = ["1", "2", "3", "4"] as const;
  const lineBase = dark ? "bg-ortaq-cream/15" : "bg-ortaq-border";
  const dotIdle = dark ? "border-ortaq-cream/30 bg-ortaq-dark text-ortaq-cream/50" : "border-ortaq-border bg-ortaq-bg text-ortaq-ink-soft";
  const labelIdle = dark ? "text-ortaq-cream/45" : "text-ortaq-ink-soft";
  const labelOn = dark ? "text-ortaq-cream" : "text-ortaq-ink";
  const big = size === "md";
  return (
    <div className="w-full">
      <div className="grid grid-cols-4">
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
                  big ? "h-6 w-6 text-[0.625rem]" : "h-5 w-5 text-[0.5625rem]",
                  isOutcome
                    ? "border-ortaq-trust bg-ortaq-trust text-ortaq-cream"
                    : reached
                      ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted"
                      : dotIdle,
                )}
              >
                {i + 1}
              </span>
              <span className={cn("mt-3 px-1 text-center font-mono uppercase tracking-[0.08em]", big ? "text-[0.625rem]" : "text-[0.5625rem]", isOutcome ? cn(labelOn, "font-semibold") : labelIdle)}>
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
        {rows.map((k, i) => (
          <li key={k} className={cn("flex items-center justify-between border-b px-4 py-2.5", rowBorder, i === rows.length - 1 && "border-b-0")}>
            <span className={cn("font-mono text-[0.75rem]", rowText)}>{t(`gca.transform.evidence.${k}`)}</span>
            <span className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ortaq-trust-muted">
              <span aria-hidden>✓</span>{t("gca.transform.verified")}
            </span>
          </li>
        ))}
      </ul>
      <div className={cn("flex items-center justify-between border-t px-4 py-3", dark ? "border-ortaq-cream/15 bg-ortaq-cream/5" : "border-ortaq-border bg-ortaq-trust-soft")}>
        <span className={cn("font-mono text-[0.6875rem] uppercase tracking-[0.12em] font-semibold", dark ? "text-ortaq-cream" : "text-ortaq-trust-muted")}>{t("gca.transform.derived")}</span>
        <span className={cn("font-mono text-[0.625rem] uppercase tracking-[0.12em]", dark ? "text-ortaq-cream/60" : "text-ortaq-ink-soft")}>{t("gca.transform.scoreTag")}</span>
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
  return (
    <section className="bg-ortaq-dark text-ortaq-cream" aria-label={t("gca.hero.headline")}>
      <Container wide className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pr-8">
            <Kicker dark>{t("gca.hero.kicker")}</Kicker>
            <h1 className="mt-5 text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ortaq-cream sm:text-[3.25rem] lg:text-[3.75rem]">
              {t("gca.hero.headline")}
            </h1>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.65] text-ortaq-cream/75 sm:text-base">{t("gca.hero.sub")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#for-companies" className="rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90">{t("gca.hero.ctaCompany")}</Link>
              <Link href="#for-capital" className="rounded-ortaq-md border border-ortaq-cream/25 px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/60">{t("gca.hero.ctaCapital")}</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-2 border-t border-ortaq-cream/12 pt-5">
              {proof.map((k) => <span key={k} className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ortaq-cream/55">{t(`gca.hero.proof.${k}`)}</span>)}
            </div>
          </div>
          <div className="lg:col-span-5">
            <EvidenceLedger />
          </div>
        </div>
        <div className="mt-14 border-t border-ortaq-cream/12 pt-8">
          <TransformationSpine active={2} dark />
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
      <Container wide className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{t("gca.whatIs.label")}</Kicker>
            <h2 className="mt-3 text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[2rem]">{t("gca.whatIs.title")}</h2>
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
      <Container wide className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <Kicker>{t("gca.broken.label")}</Kicker>
          <h2 className="mt-3 text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[2rem]">{t("gca.broken.title")}</h2>
        </div>
        <div className="mt-12 border-t border-ortaq-border">
          {keys.map((k, i) => (
            <div key={k} className="grid items-baseline gap-4 border-b border-ortaq-border py-6 sm:grid-cols-[5rem_14rem_minmax(0,1fr)]">
              <span className="font-mono text-[1.75rem] leading-none tabular-nums text-ortaq-border-strong">0{i + 1}</span>
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
  const cj = ["1", "2", "3"] as const;
  return (
    <section className="scroll-mt-20" aria-label="Şirketler ve sermaye partnerleri">
      {/* Company world — a record being built */}
      <div id="for-companies" className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20">
        <Container wide className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Kicker>{t("gca.forCompanies.label")}</Kicker>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ortaq-ink sm:text-[2.25rem]">{t("gca.forCompanies.title")}</h2>
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
        <Container wide className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="rounded-ortaq-md border border-ortaq-cream/15">
                <div className="border-b border-ortaq-cream/15 px-4 py-2.5">
                  <span className={cn(mono, "text-ortaq-cream/50")}>{t("gca.forCapital.label")} · PIPELINE</span>
                </div>
                <ul>
                  {["AB · Makine", "Körfez · Gıda", "AB · Tekstil"].map((row, i) => (
                    <li key={row} className={cn("flex items-center justify-between px-4 py-3", i < 2 && "border-b border-ortaq-cream/10", i === 2 && "opacity-40")}>
                      <span className="font-mono text-[0.75rem] text-ortaq-cream/80">{row}</span>
                      <span className="font-mono text-[0.75rem] tabular-nums text-ortaq-trust-muted">{[82, 76, "—"][i]}</span>
                    </li>
                  ))}
                  <li className="px-4 py-2.5">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ortaq-cream/40">+ erişim için kayıt</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-6">
              <Kicker dark>{t("gca.forCapital.label")}</Kicker>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ortaq-cream sm:text-[2.25rem]">{t("gca.forCapital.title")}</h2>
              <p className="mt-4 max-w-xl text-[0.9375rem] font-medium text-ortaq-cream">{t("gca.forCapital.problem")}</p>
              <ul className="mt-6 max-w-xl">
                {c.map((k) => (
                  <li key={k} className="border-t border-ortaq-cream/12 py-3 text-[0.8125rem] text-ortaq-cream/80 first:border-t-0">{t(`gca.forCapital.points.${k}`)}</li>
                ))}
              </ul>
              <Link href="/#basvuru" className="mt-7 inline-block rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.8125rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90">{t("gca.forCapital.cta")}</Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ====================================================== how it works (centerpiece)
   Transformation Spine + the evidence/intelligence that drives each transition  */
export function GcaHowItWorks() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3", "4"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-surface" aria-label={t("gca.how.title")}>
      <Container wide className="py-20 sm:py-24">
        <div className="max-w-2xl">
          <Kicker>{t("gca.how.label")}</Kicker>
          <h2 className="mt-3 text-[1.875rem] font-semibold leading-[1.06] tracking-[-0.025em] text-ortaq-ink sm:text-[2.5rem]">{t("gca.how.title")}</h2>
        </div>

        {/* the transformation, full scale */}
        <div className="mt-14">
          <TransformationSpine active={2} />
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
            <ReadinessEngine />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ===================================== Readiness Engine (data → score, tech) */
function ReadinessEngine() {
  const { t } = useTranslation();
  const inputs = ["1", "2", "3", "4", "5"] as const;
  const metrics = ["1", "2", "3", "4", "5"] as const;
  const widths = [88, 72, 64, 80, 70];
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="overflow-hidden rounded-ortaq-md border border-ortaq-border bg-ortaq-bg">
      <div className="flex items-center justify-between border-b border-ortaq-border px-4 py-2.5">
        <span className={cn(mono, "text-ortaq-ink-soft")}>{t("gca.how.engineLabel")}</span>
        <span className={cn(mono, "text-ortaq-ink-soft")}>{t("gca.surface.sample")}</span>
      </div>
      <div className="px-4 py-4">
        <span className={cn(mono, "text-ortaq-ink-soft")}>{t("gca.how.inputsLabel")}</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {inputs.map((k) => (
            <span key={k} className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2 py-1 font-mono text-[0.625rem] text-ortaq-ink">{t(`gca.how.inputs.${k}`)}</span>
          ))}
        </div>
        <div className="my-3 flex justify-center text-ortaq-ink-soft" aria-hidden>↓</div>
        <div className="flex items-center gap-4 border-t border-ortaq-border pt-4">
          <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
              <circle cx="40" cy="40" r={r} fill="none" stroke="var(--ortaq-border,#e5e2dc)" strokeWidth="6" />
              <circle cx="40" cy="40" r={r} fill="none" stroke="var(--ortaq-trust,#2f6f5e)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - 0.78)} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[1.25rem] font-semibold tabular-nums text-ortaq-ink">78</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <span className={cn(mono, "text-ortaq-ink-soft")}>{t("gca.how.criteriaLabel")}</span>
            <div className="mt-2 space-y-1.5">
              {metrics.map((k, i) => (
                <div key={k}>
                  <span className="font-mono text-[0.625rem] text-ortaq-ink-muted">{t(`gca.readiness.metrics.${k}`)}</span>
                  <div className="mt-0.5 h-px w-full bg-ortaq-border"><div className="h-[2px] -translate-y-px bg-ortaq-trust" style={{ width: `${widths[i]}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-ortaq-border px-4 py-3 font-mono text-[0.625rem] leading-relaxed text-ortaq-ink-soft">{t("gca.how.engineNote")}</p>
    </div>
  );
}

/* ================================================================= trust */
export function GcaTrust() {
  const { t } = useTranslation();
  const keys = ["1", "2", "3"] as const;
  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg" aria-label={t("gca.trust.title")}>
      <Container wide className="py-16 sm:py-20">
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
      <Container wide className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{t("gca.model.label")}</Kicker>
            <h2 className="mt-3 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[1.875rem]">{t("gca.model.title")}</h2>
            <p className={cn(typography.bodySm, "mt-4 max-w-sm text-ortaq-ink-muted")}>{t("gca.model.align")}</p>
            <p className={cn(mono, "mt-4 text-ortaq-trust-muted")}>{t("gca.model.note")}</p>
          </div>
          <div className="lg:col-span-8">
            {rows.map((r) => (
              <div key={r} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-5 border-t border-ortaq-border py-5 first:border-t-0 sm:grid-cols-[12rem_minmax(0,1fr)]">
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
      <Container wide className="py-20 sm:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Kicker dark>{t("gca.cta.label")}</Kicker>
            <h2 className="mt-4 max-w-2xl text-[2rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ortaq-cream sm:text-[2.75rem]">{t("gca.cta.title")}</h2>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.6] text-ortaq-cream/70">{t("gca.cta.body")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#basvuru" className="rounded-ortaq-md bg-ortaq-cream px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-dark transition-opacity hover:opacity-90">{t("gca.cta.primaryCompany")}</Link>
              <Link href="/#basvuru" className="rounded-ortaq-md border border-ortaq-cream/25 px-5 py-2.5 text-[0.875rem] font-medium text-ortaq-cream transition-colors hover:border-ortaq-cream/60">{t("gca.cta.secondaryCapital")}</Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <CapitalNetwork dark />
          </div>
        </div>
      </Container>
    </section>
  );
}
