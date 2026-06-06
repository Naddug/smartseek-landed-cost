"use client";

import { cn } from "@/lib/cn";

/**
 * Multi-party workspace visualization.
 *
 * Shows ORTAQ as the coordination layer for an entire company's
 * commercial operations — not just one transaction.
 *
 * Visual logic:
 *   - LEFT: Active deal list (company-level scope)
 *   - RIGHT TOP: 7 stakeholders across 2 companies, with their previous tools
 *   - RIGHT BOTTOM: Shared activity feed — all parties, one timeline
 *
 * The fragmentation is shown through the "was using" tool badges.
 * ORTAQ is shown as the single place all of them now work.
 *
 * Design reference: Notion team workspace, Linear team board, Figma presence.
 * NOT: ERP flowchart, workflow diagram, document management system.
 */

const DEALS = [
  { name: "Steel Supply — BestBuild GmbH", stage: "Negotiation", pct: 58, active: true },
  { name: "Coffee Export — Dubai Trading", stage: "In Review", pct: 45, active: false },
  { name: "Cotton Fabric — Jakarta Mills", stage: "Contract", pct: 80, active: false },
  { name: "Machinery Import — Kota Factory", stage: "Initial", pct: 20, active: false },
] as const;

const PARTIES = [
  { initials: "YÇ", name: "Yılmaz Çelik", role: "Supplier", color: "green", was: "WhatsApp" },
  { initials: "BG", name: "BestBuild GmbH", role: "Buyer", color: "blue", was: "Email" },
  { initials: "SA", name: "Sarah A.", role: "Sales", color: "purple", was: "Excel" },
  { initials: "MK", name: "Mehmet K.", role: "Procurement", color: "orange", was: "PDF" },
  { initials: "HA", name: "Hana A.", role: "Operations", color: "teal", was: "ERP" },
  { initials: "TR", name: "Tom R.", role: "Logistics", color: "indigo", was: "Sheets" },
  { initials: "AI", name: "Ali İ.", role: "Finance", color: "rose", was: "Phone" },
] as const;

const ACTIVITY = [
  {
    initials: "SA",
    role: "Sales",
    action: "Sent contract revision — Clause 4.2 updated",
    time: "12 min ago",
    color: "purple",
    type: "action",
  },
  {
    initials: "MK",
    role: "Procurement",
    action: "Approved payment terms",
    time: "1 hr ago",
    color: "orange",
    type: "approved",
  },
  {
    initials: "YÇ",
    role: "Supplier",
    action: "Updated price: €1,260 / MT CIF Rotterdam",
    time: "2 hr ago",
    color: "green",
    type: "update",
  },
  {
    initials: "AI",
    role: "Finance",
    action: "Flagged FX risk on payment terms",
    time: "Yesterday",
    color: "rose",
    type: "flag",
  },
  {
    initials: "TR",
    role: "Logistics",
    action: "Confirmed shipment window: June 28–July 2",
    time: "Yesterday",
    color: "indigo",
    type: "confirmed",
  },
] as const;

type PartyColor = "green" | "blue" | "purple" | "orange" | "teal" | "indigo" | "rose";

const colorMap: Record<PartyColor, { bg: string; text: string; border: string }> = {
  green:  { bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200" },
  blue:   { bg: "bg-blue-50",     text: "text-blue-700",     border: "border-blue-200" },
  purple: { bg: "bg-violet-50",   text: "text-violet-700",   border: "border-violet-200" },
  orange: { bg: "bg-amber-50",    text: "text-amber-700",    border: "border-amber-200" },
  teal:   { bg: "bg-teal-50",     text: "text-teal-700",     border: "border-teal-200" },
  indigo: { bg: "bg-indigo-50",   text: "text-indigo-700",   border: "border-indigo-200" },
  rose:   { bg: "bg-rose-50",     text: "text-rose-700",     border: "border-rose-200" },
};

const typeIcon: Record<string, string> = {
  action:    "→",
  approved:  "✓",
  update:    "↗",
  flag:      "⚑",
  confirmed: "◉",
};

export function CommercialLayer() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_4px_32px_rgb(20_19_16/0.09),0_0_0_1px_rgb(20_19_16/0.04)]">

      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.6rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz / Yılmaz Çelik A.Ş.
        </div>
        <div className="flex items-center gap-1 text-[0.5rem] font-medium text-ortaq-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
          7 active
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">

        {/* ── Left: Deal list ──────────────────────────────────────── */}
        <div className="border-b border-ortaq-border bg-[#fafaf9] sm:border-b-0 sm:border-r">
          <div className="border-b border-ortaq-border px-3 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
              Commercial Operations
            </p>
            <p className="mt-0.5 text-[0.5625rem] text-ortaq-ink-muted">4 deals in progress</p>
          </div>
          <div className="py-1">
            {DEALS.map((deal) => (
              <div
                key={deal.name}
                className={cn(
                  "cursor-default px-3 py-2.5",
                  deal.active
                    ? "bg-ortaq-trust/6 border-l-2 border-ortaq-trust"
                    : "border-l-2 border-transparent hover:bg-ortaq-bg/60",
                )}
              >
                <p
                  className={cn(
                    "text-[0.5625rem] font-semibold leading-snug",
                    deal.active ? "text-ortaq-ink" : "text-ortaq-ink-muted",
                  )}
                >
                  {deal.name.split(" — ")[0]}
                </p>
                <p className="text-[0.4375rem] text-ortaq-ink-soft mt-0.5">
                  {deal.name.split(" — ")[1]}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-ortaq-border">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        deal.active ? "bg-ortaq-trust" : "bg-ortaq-border-strong",
                      )}
                      style={{ width: `${deal.pct}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[0.4375rem] font-bold tabular-nums",
                      deal.active ? "text-ortaq-trust" : "text-ortaq-ink-soft",
                    )}
                  >
                    {deal.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Active deal workspace ─────────────────────────── */}
        <div>

          {/* Stakeholders bar */}
          <div className="border-b border-ortaq-border px-4 py-3">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
                Stakeholders — Steel Supply · Q2
              </p>
              <p className="text-[0.5rem] text-ortaq-ink-soft">7 people · 2 companies</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PARTIES.map((p) => {
                const c = colorMap[p.color as PartyColor];
                return (
                  <div
                    key={p.initials}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2 py-1",
                      c.bg, c.border,
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[0.375rem] font-bold",
                        c.bg, c.text,
                      )}
                    >
                      {p.initials}
                    </span>
                    <div>
                      <p className={cn("text-[0.4375rem] font-semibold leading-none", c.text)}>
                        {p.role}
                      </p>
                      <p className="text-[0.375rem] text-ortaq-ink-soft leading-none mt-0.5">
                        was: {p.was}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div className="border-b border-ortaq-border px-4 py-2">
            <p className="mb-2 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
              Shared activity
            </p>
            <div className="space-y-1.5">
              {ACTIVITY.map((a, i) => {
                const c = colorMap[a.color as PartyColor];
                return (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.4375rem] font-bold",
                        c.bg, c.text,
                      )}
                    >
                      {a.initials}
                    </span>
                    <div className="flex flex-1 items-baseline gap-1.5 min-w-0">
                      <span className={cn("shrink-0 text-[0.5rem] font-bold", c.text)}>
                        {a.role}
                      </span>
                      <span className={cn("shrink-0 text-[0.5rem]", c.text)}>
                        {typeIcon[a.type]}
                      </span>
                      <span className="truncate text-[0.5625rem] text-ortaq-ink-muted">
                        {a.action}
                      </span>
                      <span className="ml-auto shrink-0 text-[0.4375rem] text-ortaq-ink-soft">
                        {a.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom truth bar */}
          <div className="flex items-center justify-between gap-4 bg-ortaq-trust/5 px-4 py-2.5">
            <p className="text-[0.5625rem] font-medium text-ortaq-trust">
              7 stakeholders. One shared view. Always current.
            </p>
            <div className="flex shrink-0 -space-x-1">
              {PARTIES.slice(0, 5).map((p) => {
                const c = colorMap[p.color as PartyColor];
                return (
                  <span
                    key={p.initials}
                    className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-full border border-white text-[0.375rem] font-bold",
                      c.bg, c.text,
                    )}
                  >
                    {p.initials}
                  </span>
                );
              })}
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-ortaq-border text-[0.375rem] font-bold text-ortaq-ink-soft">
                +2
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
