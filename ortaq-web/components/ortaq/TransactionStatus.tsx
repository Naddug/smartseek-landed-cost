"use client";

import { cn } from "@/lib/cn";

/**
 * The magic moment: status understood in < 5 seconds.
 *
 * Visual hierarchy:
 *   1. Progress track — HOW FAR (always visible, top)
 *   2. YOUR TURN — WHAT'S BLOCKING (dominant, pulsing, center)
 *   3. Agreed strip — WHAT'S DONE (compact, peripheral, bottom)
 *   4. AI insight — ONE sentence
 *
 * Design references: Linear issue board, Stripe dashboard, flight tracker.
 * No sentence-length descriptions. Shape, color, and position carry meaning.
 */

type Milestone = { label: string; done: boolean; active?: boolean };

const MILESTONES: Milestone[] = [
  { label: "LOI", done: true },
  { label: "Price", done: true },
  { label: "Contract", done: false, active: true },
  { label: "Inspect", done: false },
  { label: "Ship", done: false },
  { label: "Payment", done: false },
];

const AGREED = [
  "€1,260/MT CIF",
  "500 MT",
  "Incoterm: CIF Rotterdam",
  "LOI signed",
] as const;

export function TransactionStatus() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_8px_40px_rgb(20_19_16/0.12),0_0_0_1px_rgb(20_19_16/0.04)]">

      {/* ── Window bar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.6rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz / tx / OP-0391
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-[0.5625rem] font-semibold text-amber-700">Negotiation</span>
        </div>
      </div>

      {/* ── Deal header ────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.9375rem] font-bold leading-tight text-ortaq-ink">
              Steel Supply Agreement
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[0.625rem] text-ortaq-ink-soft">
              <Pill initials="YÇ" name="Yılmaz Çelik" color="green" />
              <span className="text-ortaq-border">↔</span>
              <Pill initials="BG" name="BestBuild GmbH" color="blue" />
              <span className="mx-0.5 text-ortaq-border">·</span>
              <span className="font-semibold tabular-nums text-ortaq-ink">€840,000</span>
              <span className="text-ortaq-border">·</span>
              <span>Due June 30</span>
            </div>
          </div>
          {/* Progress ring */}
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" fill="none" stroke="#ede9e0" strokeWidth="4" />
              <circle
                cx="20" cy="20" r="15"
                fill="none"
                stroke="var(--color-ortaq-trust)"
                strokeWidth="4"
                strokeDasharray="94.25"
                strokeDashoffset="39.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[0.625rem] font-bold tabular-nums text-ortaq-trust">58%</span>
          </div>
        </div>

        {/* ── Milestone track ─────────────────────────────────────── */}
        <div className="mt-4 flex items-center">
          {MILESTONES.map((m, i) => (
            <div key={m.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[0.4375rem] font-bold transition-all",
                    m.done
                      ? "bg-ortaq-trust text-white"
                      : m.active
                        ? "border-2 border-ortaq-trust bg-white ring-4 ring-ortaq-trust/15 text-ortaq-trust"
                        : "border border-[#dbd7cf] bg-[#f5f3ef] text-[#a09890]",
                  )}
                >
                  {m.done ? (
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2.5 2.5 3.5-4" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[0.4375rem] font-semibold leading-none",
                    m.done ? "text-ortaq-trust" : m.active ? "text-ortaq-ink" : "text-[#b0a898]",
                  )}
                >
                  {m.label}
                </span>
              </div>
              {i < MILESTONES.length - 1 && (
                <div
                  className={cn(
                    "mb-4 h-px flex-1",
                    m.done ? "bg-ortaq-trust/35" : "bg-[#e5e1d8]",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── YOUR TURN — the dominant element ───────────────────────── */}
      <div className="border-y border-ortaq-trust/15 bg-[#f7faf8] px-5 py-4">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ortaq-trust opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ortaq-trust" />
          </span>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
            Your Turn
          </span>
          <span className="ml-auto rounded-full bg-ortaq-trust px-2 py-0.5 text-[0.5rem] font-bold text-white">
            2 actions
          </span>
        </div>

        <div className="space-y-2">
          <ActionRow
            label="Respond to Clause 4.2 revision"
            tag="Contract"
            deadline="Tomorrow"
            urgent
          />
          <ActionRow
            label="Confirm SGS inspection date"
            tag="Logistics"
            deadline="June 15"
            urgent={false}
          />
        </div>
      </div>

      {/* ── WAITING ON THEM — secondary ────────────────────────────── */}
      <div className="border-b border-ortaq-border px-5 py-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c0b8ac]" />
          <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ortaq-ink-soft">
            Waiting on them
          </span>
          <span className="ml-auto rounded-full border border-ortaq-border bg-ortaq-bg px-2 py-0.5 text-[0.5rem] font-bold text-ortaq-ink-soft">
            1 action
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-ortaq-border bg-ortaq-bg px-3 py-2">
          <p className="text-[0.625rem] text-ortaq-ink-muted">Finance sign-off on payment terms</p>
          <span className="shrink-0 text-[0.5rem] font-medium text-ortaq-ink-soft">BestBuild · Internal</span>
        </div>
      </div>

      {/* ── AGREED — compact strip ──────────────────────────────────── */}
      <div className="border-b border-ortaq-border px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft mr-1">
            Agreed
          </span>
          {AGREED.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-ortaq-trust/20 bg-ortaq-trust/6 px-2 py-0.5"
            >
              <svg className="h-2 w-2 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4l2 2 3-3" />
              </svg>
              <span className="text-[0.5rem] font-medium text-ortaq-trust">{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── AI insight — one sentence ───────────────────────────────── */}
      <div className="flex items-start gap-2.5 bg-white px-5 py-3">
        <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ortaq-ink">
          <span className="text-[0.375rem] font-bold text-ortaq-cream">AI</span>
        </div>
        <p className="text-[0.5625rem] leading-relaxed text-ortaq-ink-muted">
          Main blocker is on your side. Respond to Clause 4.2 before{" "}
          <span className="font-semibold text-ortaq-ink">June 12</span> to close on time.
        </p>
      </div>
    </div>
  );
}

function ActionRow({
  label,
  tag,
  deadline,
  urgent,
}: {
  label: string;
  tag: string;
  deadline: string;
  urgent: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5",
        urgent
          ? "border-ortaq-trust/25 bg-white shadow-[0_1px_4px_rgb(var(--color-ortaq-trust-rgb,52_100_70)/0.08)]"
          : "border-ortaq-border bg-white",
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <svg
          className={cn("h-3 w-3 shrink-0", urgent ? "text-ortaq-trust" : "text-ortaq-ink-soft")}
          fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8M6 2l4 4-4 4" />
        </svg>
        <p className="truncate text-[0.625rem] font-semibold text-ortaq-ink">{label}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="rounded bg-ortaq-bg border border-ortaq-border px-1.5 py-0.5 text-[0.4375rem] font-semibold uppercase tracking-[0.05em] text-ortaq-ink-soft">
          {tag}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[0.5rem] font-bold",
            urgent
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-ortaq-bg text-ortaq-ink-soft border border-ortaq-border",
          )}
        >
          {deadline}
        </span>
      </div>
    </div>
  );
}

function Pill({
  initials,
  name,
  color,
}: {
  initials: string;
  name: string;
  color: "green" | "blue";
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={cn(
          "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[0.375rem] font-bold",
          color === "green" ? "bg-ortaq-trust/15 text-ortaq-trust" : "bg-blue-100 text-blue-700",
        )}
      >
        {initials}
      </span>
      <span>{name}</span>
    </span>
  );
}
