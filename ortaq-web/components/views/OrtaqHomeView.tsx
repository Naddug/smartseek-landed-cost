"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { TransactionStatus } from "@/components/ortaq/TransactionStatus";

export function OrtaqHomeView() {
  return (
    <PublicShell stickyCta={false}>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="grid min-h-[calc(100dvh-3.75rem)] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-10 lg:py-16">

            {/* Copy */}
            <div className="flex flex-col">
              <p className={cn(typography.label, "mb-5 text-ortaq-ink-soft")}>
                B2B Transaction Coordination
              </p>

              <h1
                className={cn(
                  "font-body font-bold tracking-[-0.04em] text-ortaq-ink",
                  "text-[2.5rem] leading-[1.04] sm:text-[3rem] lg:text-[3.25rem] xl:text-[3.625rem]",
                )}
              >
                Commercial<br />Transactions.<br />
                <span className="text-ortaq-trust">Organized.</span>
              </h1>

              <p className="mt-5 max-w-md text-[1rem] leading-[1.65] text-ortaq-ink-muted sm:text-[1.0625rem]">
                Bring conversations, documents, approvals, inspections and
                execution into one coordinated workspace.
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

              <p className={cn(typography.caption, "mt-7 text-ortaq-ink-soft")}>
                Founded by operators from LEGO Group, Petlas and Yiğit Akü.
              </p>
            </div>

            {/* Visual — the core product insight */}
            <div>
              <TransactionStatus />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ THE ONE QUESTION ══════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className={cn(typography.label, "mb-4 text-ortaq-ink-soft")}>
                Why ORTAQ exists
              </p>
              <p
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.12]",
                  "text-[1.625rem] sm:text-[2rem]",
                )}
              >
                At any moment, ORTAQ answers<br className="hidden sm:block" /> one question:
              </p>
              <div className="mx-auto mt-6 max-w-xl rounded-xl border border-ortaq-trust/20 bg-ortaq-trust/5 px-6 py-5">
                <p
                  className={cn(
                    "font-body font-bold text-ortaq-trust tracking-[-0.02em] leading-[1.2]",
                    "text-[1.25rem] sm:text-[1.5rem]",
                  )}
                >
                  &ldquo;What is happening with this deal right now — and what should happen next?&rdquo;
                </p>
              </div>
              <p className={cn(typography.body, "mx-auto mt-5 max-w-lg")}>
                Not where the document is stored. Not what was said in the last meeting.
                What is the current state, and what is blocking progress.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ PROBLEM — lean ════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">

              {/* Left */}
              <div>
                <p className={cn(typography.label, "mb-3 text-ortaq-accent")}>
                  The problem
                </p>
                <h2
                  className={cn(
                    "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                    "text-[1.75rem] sm:text-[2.125rem]",
                  )}
                >
                  The problem is not storage.<br />
                  The problem is visibility.
                </h2>
                <p className={cn(typography.body, "mt-4 max-w-md")}>
                  Every deal has all the information it needs — buried across email
                  threads, WhatsApp chats, spreadsheets and document folders.
                  Nobody can see the full picture. Nobody knows what is blocking progress.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "What is the current agreed price?",
                    "Who needs to approve the contract revision?",
                    "When is the inspection confirmed?",
                    "What is blocking payment release?",
                  ].map((q) => (
                    <div key={q} className="flex items-start gap-3">
                      <svg className="mt-1 h-4 w-4 shrink-0 text-ortaq-accent" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75}>
                        <circle cx="8" cy="8" r="6" />
                        <path strokeLinecap="round" d="M8 5.5v.5m0 2.5v2" />
                      </svg>
                      <p className="text-[0.875rem] text-ortaq-ink-muted">{q}</p>
                    </div>
                  ))}
                </div>

                <p className={cn(typography.body, "mt-5 font-medium text-ortaq-ink")}>
                  These questions should not require searching through 6 tools.
                </p>
              </div>

              {/* Right — fragmentation visual */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { tool: "WhatsApp", status: "47 unread messages", note: "Latest price in chat #3" },
                    { tool: "Email", status: "6 active threads", note: "Contract attached in thread 2" },
                    { tool: "Excel", status: "4 versions open", note: "v_FINAL_2 or v3_REAL?" },
                    { tool: "PDFs", status: "12 documents", note: "Which is the signed copy?" },
                    { tool: "Phone calls", status: "No record", note: "What was agreed last week?" },
                    { tool: "Team chat", status: "Ongoing", note: "Context lost in thread" },
                  ].map((item) => (
                    <div
                      key={item.tool}
                      className="rounded-lg border border-ortaq-border bg-ortaq-bg p-3"
                    >
                      <p className="text-[0.75rem] font-semibold text-ortaq-ink">{item.tool}</p>
                      <p className="mt-0.5 text-[0.625rem] text-ortaq-accent">{item.status}</p>
                      <p className="mt-1 text-[0.5625rem] text-ortaq-ink-soft leading-snug">{item.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-[0.75rem] font-semibold text-red-700">
                    Nobody has the full picture.
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] text-red-600">
                    Not your team. Not your counterparty. Not you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ ORTAQ ANSWER ══════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10 text-center">
              <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
                How ORTAQ works
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                  "text-[1.75rem] sm:text-[2.125rem]",
                )}
              >
                One coordinated workspace.<br />Both parties. Every step.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  name: "Organize",
                  headline: "All context in one place.",
                  desc: "Every conversation, document, approval and decision attached to the transaction — not scattered across tools.",
                  detail: "Messages from WhatsApp and email are captured in context. Documents are versioned. Agreements are logged.",
                },
                {
                  step: "02",
                  name: "Coordinate",
                  headline: "Everyone knows what is pending.",
                  desc: "Tasks, approvals and responsibilities are explicit. No more status meetings. No more follow-up messages. The system surfaces what needs to happen next.",
                  detail: "Both parties see the same pending items. Blockers are visible. Ownership is clear.",
                },
                {
                  step: "03",
                  name: "Execute",
                  headline: "Deals move forward.",
                  desc: "From lead to payment — every milestone tracked, every action logged, every agreement confirmed. The deal closes.",
                  detail: "Inspection scheduling, shipment tracking, payment confirmation — all in one transaction record.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-ortaq-border bg-ortaq-surface p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[1.5rem] font-bold text-ortaq-border leading-none">{item.step}</span>
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ortaq-trust">{item.name}</p>
                      <p className="text-[0.9375rem] font-bold text-ortaq-ink leading-tight">{item.headline}</p>
                    </div>
                  </div>
                  <p className={cn(typography.body, "mb-3")}>{item.desc}</p>
                  <p className={cn(typography.caption, "leading-relaxed")}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ FEATURES — execution-focused ══════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="py-14 sm:py-16">
            <div className="mb-10">
              <p className={cn(typography.label, "mb-3 text-ortaq-ink-soft")}>
                Platform capabilities
              </p>
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.1]",
                  "text-[1.75rem] sm:text-[2.125rem]",
                )}
              >
                Built for execution,<br />not for storage.
              </h2>
              <p className={cn(typography.body, "mt-3 max-w-lg")}>
                Every feature exists to help a deal move forward. If it only stores
                information without driving execution, it is not in the platform.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Transaction Workspace",
                  desc: "One workspace per transaction. Both parties see the current state, pending items and next actions — always.",
                  tag: "Core",
                },
                {
                  name: "Task Coordination",
                  desc: "Explicit tasks with owners and deadlines. The system knows when something is overdue and surfaces it.",
                  tag: "Core",
                },
                {
                  name: "Approval Flows",
                  desc: "Route any decision for structured approval. No more approvals lost in email. Every decision is recorded.",
                  tag: "Core",
                },
                {
                  name: "Document Intelligence",
                  desc: "Documents are attached to the deal, versioned and classified. The system knows which document is current.",
                  tag: "Core",
                },
                {
                  name: "Communication Context",
                  desc: "Messages — from WhatsApp, email or in-platform — are captured in the context of the deal, not lost in chat history.",
                  tag: "Core",
                },
                {
                  name: "Inspection Tracking",
                  desc: "Schedule inspection, track confirmation, receive report. Every inspection milestone visible to both parties.",
                  tag: "Core",
                },
                {
                  name: "Execution Tracking",
                  desc: "Shipment milestones, payment confirmations, delivery records — logged against the deal timeline.",
                  tag: "Core",
                },
                {
                  name: "AI Summaries",
                  desc: "At any point: what has been agreed, what is pending, what is the current risk. In one paragraph.",
                  tag: "AI",
                },
                {
                  name: "Action Recommendations",
                  desc: "The system identifies what is blocking progress and surfaces the next action — to the right person.",
                  tag: "AI",
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="rounded-xl border border-ortaq-border bg-ortaq-bg p-5 transition-shadow hover:shadow-[var(--shadow-product-hover)]"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[0.875rem] font-semibold text-ortaq-ink">{f.name}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] font-bold",
                        f.tag === "AI"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-ortaq-trust/10 text-ortaq-trust",
                      )}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <p className={cn(typography.bodySm, "leading-relaxed")}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ TRUST ═════════════════════════════════════════════════════ */}
      <section className="border-b border-ortaq-border bg-ortaq-bg">
        <Container wide>
          <div className="py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-lg">
                <p className={cn(typography.label, "mb-2 text-ortaq-ink-soft")}>
                  Built by operators
                </p>
                <h2 className={cn(typography.h1, "mb-3")}>
                  We have run these deals. We know what breaks.
                </h2>
                <p className={cn(typography.body)}>
                  ORTAQ was built by a team with direct experience in international
                  sales, export operations, distribution and manufacturing. Not
                  consultants. Not academics. People who have sat on both sides of
                  complex commercial transactions.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:gap-2">
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

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                className={cn(
                  "font-body font-bold tracking-[-0.035em] text-ortaq-cream leading-[1.08]",
                  "text-[2rem] sm:text-[2.625rem]",
                )}
              >
                Stop searching for answers<br />
                that should be obvious.
              </h2>
              <p className={cn(typography.body, "mx-auto mt-4 max-w-md text-ortaq-cream/70")}>
                Request a demo. We will show you what your most complex transaction
                looks like inside ORTAQ — organized, coordinated, executing.
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
