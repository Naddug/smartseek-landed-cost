"use client";

import { cn } from "@/lib/cn";

/** Hero visual — a realistic commercial operations dashboard.
 *  Shows actual work: active deals, pending approvals, inspection status,
 *  shipment tracking, document versions, team activity.
 *  No charts. No analytics. No KPIs. */
export function CommercialDashboard() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-ortaq-border bg-ortaq-surface shadow-[0_4px_32px_rgb(20_19_16/0.10),0_0_0_1px_rgb(20_19_16/0.06)]">

      {/* ── Window chrome ─────────────────────── */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#f9f8f6] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.625rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz/operations
        </div>
        <div className="flex items-center gap-3 text-[0.625rem] text-ortaq-ink-soft">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>
      </div>

      {/* ── Top status bar ────────────────────── */}
      <div className="flex items-center gap-0 border-b border-ortaq-border bg-white divide-x divide-ortaq-border">
        {[
          { label: "Active Deals", value: "6", accent: false },
          { label: "Pending Approval", value: "3", accent: true },
          { label: "Inspections", value: "1 due", accent: false },
          { label: "Shipments", value: "2 active", accent: false },
        ].map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-0 px-3 py-2">
            <span className="text-[0.5rem] font-medium uppercase tracking-[0.07em] text-ortaq-ink-soft">
              {item.label}
            </span>
            <span
              className={cn(
                "text-[0.875rem] font-bold tabular-nums leading-tight",
                item.accent ? "text-amber-600" : "text-ortaq-ink",
              )}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Body ──────────────────────────────── */}
      <div className="flex divide-x divide-ortaq-border bg-[#faf9f7]">

        {/* Left — deal list */}
        <div className="w-[55%] flex-col divide-y divide-ortaq-border">

          {/* Section header */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5">
            <span className="text-[0.6875rem] font-semibold text-ortaq-ink">Active Deals</span>
            <button className="rounded px-2 py-1 text-[0.5625rem] font-semibold text-ortaq-trust border border-ortaq-trust/30 hover:bg-ortaq-trust/5">
              + New Deal
            </button>
          </div>

          {/* Deal rows */}
          {[
            {
              id: "OP-0391",
              title: "Steel Supply — BestBuild GmbH",
              stage: "Negotiation",
              stageColor: "blue",
              note: "Contract v4 awaiting counterparty review",
              time: "Today",
              parties: ["YÇ", "BG"],
            },
            {
              id: "OP-0388",
              title: "Textile Export — Atlas Trading Co.",
              stage: "Inspection",
              stageColor: "amber",
              note: "SGS report expected June 12",
              time: "3 days",
              parties: ["AE", "AT"],
            },
            {
              id: "OP-0382",
              title: "Chemical Dist. — ChemGroup AG",
              stage: "Contract",
              stageColor: "green",
              note: "Payment terms pending finance approval",
              time: "Yesterday",
              parties: ["KC", "CG"],
            },
            {
              id: "OP-0376",
              title: "Machinery — EuroMach Systems",
              stage: "Shipment",
              stageColor: "teal",
              note: "B/L received · ETA June 18, Rotterdam",
              time: "4 days",
              parties: ["YÇ", "EM"],
            },
          ].map((deal) => (
            <DealRow key={deal.id} {...deal} />
          ))}
        </div>

        {/* Right — activity + approvals */}
        <div className="flex flex-1 flex-col divide-y divide-ortaq-border">

          {/* Pending approvals */}
          <div className="bg-white">
            <div className="border-b border-ortaq-border px-4 py-2.5">
              <span className="text-[0.6875rem] font-semibold text-ortaq-ink">
                Pending Approvals
                <span className="ml-1.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[0.5rem] font-bold text-amber-700">3</span>
              </span>
            </div>
            <div className="divide-y divide-ortaq-border">
              {[
                { deal: "OP-0391", action: "Contract revision — BestBuild GmbH", owner: "You", urgent: true },
                { deal: "OP-0382", action: "Payment release — ChemGroup AG", owner: "Finance", urgent: false },
                { deal: "OP-0388", action: "Inspection report — Atlas Trading", owner: "Ops team", urgent: false },
              ].map((item) => (
                <div key={item.deal} className="flex items-center gap-3 px-4 py-2.5">
                  <div className={cn("h-1.5 w-1.5 shrink-0 rounded-full", item.urgent ? "bg-amber-500" : "bg-ortaq-border-strong")} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.6875rem] text-ortaq-ink">{item.action}</p>
                    <p className="text-[0.5625rem] text-ortaq-ink-soft">{item.owner}</p>
                  </div>
                  {item.urgent && (
                    <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[0.5rem] font-bold text-amber-700">
                      Your turn
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="flex-1 bg-[#faf9f7]">
            <div className="border-b border-ortaq-border px-4 py-2.5">
              <span className="text-[0.6875rem] font-semibold text-ortaq-ink">Recent Activity</span>
            </div>
            <div className="divide-y divide-ortaq-border/60">
              {[
                { actor: "BG", actorName: "BestBuild GmbH", action: "requested revision on Clause 4.2", time: "1h", color: "blue" },
                { actor: "YÇ", actorName: "You", action: "uploaded Contract v4.pdf", time: "3h", color: "trust" },
                { actor: "SGS", actorName: "SGS Inspector", action: "scheduled site visit — June 12, 09:00", time: "5h", color: "amber" },
                { actor: "AT", actorName: "Atlas Trading", action: "confirmed shipment booking", time: "1d", color: "teal" },
              ].map((item) => (
                <div key={item.action} className="flex items-start gap-2.5 px-4 py-2.5">
                  <Avatar initials={item.actor} color={item.color} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.625rem] leading-snug text-ortaq-ink-muted">
                      <span className="font-semibold text-ortaq-ink">{item.actorName}</span>{" "}
                      {item.action}
                    </p>
                    <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">{item.time} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DealRow({
  title,
  stage,
  stageColor,
  note,
  time,
  parties,
}: {
  id: string;
  title: string;
  stage: string;
  stageColor: string;
  note: string;
  time: string;
  parties: string[];
}) {
  const stageStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    teal: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="flex cursor-pointer items-start gap-3 bg-white px-4 py-3 transition-colors hover:bg-ortaq-bg">
      {/* Parties */}
      <div className="mt-0.5 flex shrink-0">
        {parties.map((p, i) => (
          <Avatar
            key={p}
            initials={p}
            color={i === 0 ? "trust" : "blue"}
            size="sm"
            style={{ marginLeft: i > 0 ? -5 : 0, zIndex: 2 - i }}
          />
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[0.75rem] font-semibold text-ortaq-ink">{title}</p>
          <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[0.5rem] font-bold", stageStyles[stageColor] ?? stageStyles.blue)}>
            {stage}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[0.6125rem] text-ortaq-ink-soft">{note}</p>
      </div>

      <span className="shrink-0 text-[0.5625rem] text-ortaq-ink-soft">{time}</span>
    </div>
  );
}

function Avatar({
  initials,
  color,
  size = "default",
  style,
}: {
  initials: string;
  color: string;
  size?: "sm" | "default";
  style?: React.CSSProperties;
}) {
  const colorMap: Record<string, string> = {
    trust: "bg-ortaq-trust/15 text-ortaq-trust",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    teal: "bg-teal-100 text-teal-700",
    neutral: "bg-ortaq-bg-alt text-ortaq-ink-soft",
  };
  const sizeMap = {
    sm: "h-4 w-4 text-[0.4375rem]",
    default: "h-5 w-5 text-[0.5rem]",
  };

  return (
    <span
      style={style}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border border-white font-bold",
        sizeMap[size],
        colorMap[color] ?? colorMap.neutral,
      )}
    >
      {initials}
    </span>
  );
}
