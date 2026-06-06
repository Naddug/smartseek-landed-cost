"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { TransactionStatus } from "@/components/ortaq/TransactionStatus";

/**
 * Homepage critical test: every section must be asked —
 * "If this disappeared, would the visitor still understand why ORTAQ matters?"
 * If yes → cut.
 *
 * Sections that pass:
 * 1. Hero — stops chasing updates (outcome-led)
 * 2. Recognition — 5 sentences every visitor has said
 * 3. The gap — category positioning (between companies, not inside)
 * 4. Product visual — progress, not storage
 * 5. 4 outcomes — not 9 features
 * 6. Team (credibility)
 * 7. CTA
 */
export function OrtaqHomeView() {
  return (
    <PublicShell stickyCta={false}>

      {/* ══ 1. HERO — outcome-driven ════════════════════════════════ */}
      <section className="relative border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1fr_1.35fr] lg:gap-10 lg:py-16">

            {/* Copy */}
            <div className="flex flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-ortaq-trust/30 bg-ortaq-trust/6 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                <span className="text-[0.6875rem] font-semibold text-ortaq-trust">
                  System of Record Between Companies
                </span>
              </div>

              <h1
                className={cn(
                  "font-body font-bold tracking-[-0.04em] text-ortaq-ink",
                  "text-[2.625rem] leading-[1.02] sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]",
                )}
              >
                Stop Chasing<br />
                <span className="text-ortaq-trust">Updates.</span>
              </h1>

              <p className="mt-5 max-w-[22rem] text-[1.0625rem] leading-[1.6] text-ortaq-ink-muted">
                ORTAQ keeps both companies on the same page — what&apos;s agreed,
                what&apos;s blocked, who acts next, and when the deal closes.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-ink px-7 text-[0.9375rem] font-semibold leading-none text-ortaq-cream shadow-[var(--shadow-product)] transition-all hover:bg-ortaq-ink-muted active:scale-[0.98]"
                >
                  Request Demo
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-ortaq-border-strong px-6 text-[0.9375rem] font-medium text-ortaq-ink transition-colors hover:bg-ortaq-bg"
                >
                  See How It Works
                </Link>
              </div>

              <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>
                Built by operators. LEGO Group · Petlas · Yiğit Akü.
              </p>
            </div>

            {/* Visual — live deal action board */}
            <div>
              <TransactionStatus />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 2. RECOGNITION — 5 sentences every visitor has said ═══ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-12 sm:py-14">
            <p className={cn(typography.label, "mb-6 text-center text-ortaq-ink-soft")}>
              If you have ever said any of these
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "&ldquo;Where are we on this deal? I haven&apos;t heard anything in three days.&rdquo;",
                  raw: "Where are we on this deal? I haven't heard anything in three days.",
                },
                {
                  quote: "&ldquo;Which version of the contract are we actually working from?&rdquo;",
                  raw: "Which version of the contract are we actually working from?",
                },
                {
                  quote: "&ldquo;Who approved the payment terms? I can&apos;t find the confirmation.&rdquo;",
                  raw: "Who approved the payment terms? I can't find the confirmation.",
                },
                {
                  quote: "&ldquo;The inspection is next week and nobody has confirmed the date yet.&rdquo;",
                  raw: "The inspection is next week and nobody has confirmed the date yet.",
                },
                {
                  quote: "&ldquo;I need to send another follow-up. They haven&apos;t responded in a week.&rdquo;",
                  raw: "I need to send another follow-up. They haven't responded in a week.",
                },
                {
                  quote: "&ldquo;Can someone tell me exactly what we&apos;ve agreed so far?&rdquo;",
                  raw: "Can someone tell me exactly what we've agreed so far?",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-ortaq-border bg-ortaq-surface px-5 py-4"
                >
                  <p className="text-[0.875rem] font-medium italic leading-[1.5] text-ortaq-ink-muted">
                    &ldquo;{item.raw}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <p
              className={cn(
                "mx-auto mt-7 max-w-lg text-center font-body font-semibold tracking-[-0.02em] text-ortaq-ink",
                "text-[1.125rem] sm:text-[1.25rem]",
              )}
            >
              ORTAQ exists so you never need to ask these questions again.
            </p>
          </div>
        </Container>
      </section>

      {/* ══ 2b. BRIDGE — symptom / category / outcome ═══════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-ink">
        <Container wide>
          <div className="py-8">
            <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                {
                  label: "The Symptom",
                  lines: ["Chasing updates.", "Missing context.", "Fragmented deals."],
                  dim: true,
                },
                {
                  label: "The Category",
                  lines: ["System of Record", "Between Companies."],
                  dim: false,
                  large: true,
                },
                {
                  label: "The Outcome",
                  lines: ["Both sides always know", "what is happening", "and what comes next."],
                  dim: true,
                },
              ].map((col) => (
                <div
                  key={col.label}
                  className={cn("px-6 py-5 sm:py-3", col.large && "sm:py-5")}
                >
                  <p className="mb-2 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-white/35">
                    {col.label}
                  </p>
                  {col.lines.map((line, i) => (
                    <p
                      key={i}
                      className={cn(
                        "leading-snug",
                        col.large
                          ? "font-body text-[1.125rem] font-bold tracking-[-0.02em] text-ortaq-cream sm:text-[1.25rem]"
                          : "text-[0.875rem] text-white/55",
                      )}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 3. THE GAP — category statement ════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mx-auto max-w-3xl">
              <p className={cn(typography.label, "mb-5 text-center text-ortaq-ink-soft")}>
                Every enterprise runs on systems of record
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    tool: "Salesforce",
                    role: "System of Record",
                    desc: "Customer relationships. One side of the deal.",
                    covered: true,
                  },
                  {
                    tool: "SAP / ERP",
                    role: "System of Record",
                    desc: "Internal operations. One side of the deal.",
                    covered: true,
                  },
                  {
                    tool: "Between companies",
                    role: "No system of record.",
                    desc: "The work that happens between two organizations has never had one.",
                    covered: false,
                  },
                ].map((item) => (
                  <div
                    key={item.tool}
                    className={cn(
                      "rounded-xl border p-5",
                      item.covered
                        ? "border-ortaq-border bg-ortaq-bg"
                        : "border-ortaq-trust/30 bg-ortaq-trust/5 ring-1 ring-ortaq-trust/20",
                    )}
                  >
                    <p className={cn(
                      "text-[0.6875rem] font-semibold uppercase tracking-[0.06em]",
                      item.covered ? "text-ortaq-ink-soft" : "text-ortaq-trust",
                    )}>
                      {item.tool}
                    </p>
                    <p className={cn(
                      "mt-1.5 text-[0.9375rem] font-bold leading-tight",
                      item.covered ? "text-ortaq-ink-muted" : "text-ortaq-ink",
                    )}>
                      {item.role}
                    </p>
                    <p className={cn(typography.caption, "mt-1.5 leading-relaxed", !item.covered && "text-ortaq-ink-soft")}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-ortaq-ink/10 bg-ortaq-ink px-8 py-8 text-center">
                <p className={cn(typography.label, "mb-3 text-white/40")}>
                  The category
                </p>
                <p
                  className={cn(
                    "font-body font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.1]",
                    "text-[1.625rem] sm:text-[2.125rem]",
                  )}
                >
                  ORTAQ is the System of Record<br className="hidden sm:block" /> Between Companies.
                </p>
                <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-[1.6] text-white/60">
                  Not another workflow tool. Not a document archive. Not a CRM.
                  The authoritative source of truth for the commercial work
                  that happens between your organization and theirs —
                  from first conversation to final payment.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 4. PROGRESS IS THE PRODUCT — visual reframe ══════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
                What ORTAQ shows
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink",
                  "text-[1.75rem] sm:text-[2.25rem]",
                )}
              >
                Not where things are stored.<br />
                Where things stand.
              </h2>
              <p className={cn(typography.body, "mx-auto mt-3 max-w-md")}>
                Every view in ORTAQ answers the same question: what needs to happen
                next, and who is responsible for it?
              </p>
            </div>

            {/* Four signals */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  signal: "Your Turn",
                  desc: "Actions that are waiting on you. Named. Deadlined. Unambiguous.",
                  color: "trust",
                },
                {
                  signal: "Their Turn",
                  desc: "What you are waiting on from the other side. No more guessing.",
                  color: "neutral",
                },
                {
                  signal: "Active Blockers",
                  desc: "What is currently preventing the deal from moving forward. Visible to everyone.",
                  color: "accent",
                },
                {
                  signal: "What Has Been Decided",
                  desc: "All agreements confirmed by both parties. No disputes about what was said.",
                  color: "trust",
                },
              ].map((item) => (
                <div
                  key={item.signal}
                  className="rounded-xl border border-ortaq-border bg-ortaq-surface p-5"
                >
                  <div
                    className={cn(
                      "mb-3 inline-flex h-2 w-2 rounded-full",
                      item.color === "trust"
                        ? "bg-ortaq-trust"
                        : item.color === "accent"
                          ? "bg-ortaq-accent"
                          : "bg-ortaq-border-strong",
                    )}
                  />
                  <p className="text-[0.875rem] font-bold text-ortaq-ink">{item.signal}</p>
                  <p className={cn(typography.bodySm, "mt-1.5 leading-relaxed")}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 5. FOUR OUTCOMES — not features ══════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10">
              <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
                What changes when you use ORTAQ
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink",
                  "text-[1.75rem] sm:text-[2.25rem]",
                )}
              >
                Less searching.<br />More execution.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  before: "\"Where are we on this?\" sent 4 times this week.",
                  after: "Current status visible to both sides. Always.",
                  headline: "No more status updates",
                },
                {
                  before: "Approval sent by email. Followed up twice. Still waiting.",
                  after: "Approvals are routed, tracked, and resolved. Decisions do not disappear.",
                  headline: "Decisions get made",
                },
                {
                  before: "Both parties think different people are responsible for the same task.",
                  after: "Every action has a named owner. Both companies see the same responsibilities.",
                  headline: "Accountability is explicit",
                },
                {
                  before: "The deal closes late because nobody was tracking what was blocking it.",
                  after: "Blockers are surfaced immediately. The deal moves forward faster.",
                  headline: "Deals close faster",
                },
              ].map((item) => (
                <div
                  key={item.headline}
                  className="rounded-xl border border-ortaq-border bg-ortaq-bg p-6"
                >
                  <p className="text-[0.9375rem] font-bold text-ortaq-ink mb-4">
                    {item.headline}
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                      <p className={cn(typography.caption, "mb-0.5 font-semibold uppercase tracking-[0.05em] text-red-400")}>
                        Before
                      </p>
                      <p className="text-[0.8125rem] italic leading-snug text-red-700">
                        {item.before}
                      </p>
                    </div>
                    <div className="rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/5 px-4 py-3">
                      <p className={cn(typography.caption, "mb-0.5 font-semibold uppercase tracking-[0.05em] text-ortaq-trust/70")}>
                        With ORTAQ
                      </p>
                      <p className="text-[0.8125rem] leading-snug text-ortaq-ink-muted">
                        {item.after}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 6. TEAM — operator credibility ════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <p className={cn(typography.label, "mb-2 text-ortaq-ink-soft")}>
                  Built by operators
                </p>
                <h2
                  className={cn(
                    "font-body font-bold tracking-[-0.025em] text-ortaq-ink leading-[1.12]",
                    "text-[1.375rem] sm:text-[1.625rem]",
                  )}
                >
                  We have run these deals.<br />We know what breaks.
                </h2>
                <p className={cn(typography.body, "mt-3")}>
                  ORTAQ is built by people who have managed complex international
                  transactions firsthand. The product is designed around real problems —
                  not hypothetical workflows.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                {["LEGO Group", "Petlas", "Yiğit Akü"].map((c) => (
                  <div
                    key={c}
                    className="rounded-lg border border-ortaq-border bg-ortaq-surface px-5 py-3 text-[0.8125rem] font-semibold text-ortaq-ink"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 7. CTA — direct ════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-xl text-center">
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.035em] text-ortaq-cream leading-[1.08]",
                  "text-[2rem] sm:text-[2.625rem]",
                )}
              >
                Your next deal should not run on WhatsApp.
              </h2>
              <p className={cn(typography.body, "mx-auto mt-4 max-w-md text-ortaq-cream/70")}>
                Request a demo. We will show you what your most complex
                active transaction looks like inside ORTAQ — organized,
                coordinated, moving.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ortaq-cream px-8 text-[0.9375rem] font-semibold text-ortaq-ink transition-colors hover:bg-white active:scale-[0.98]"
                >
                  Request Demo
                </Link>
                <Link
                  href="/ekip"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-white/40 hover:text-ortaq-cream"
                >
                  Talk to the team →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
