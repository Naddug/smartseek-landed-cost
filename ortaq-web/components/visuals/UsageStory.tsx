"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * UsageStory — three roles, same morning, explicit tool contrast.
 *
 * Each card shows:
 *   1. Time + role
 *   2. "Instead of [specific tool]" — the before state
 *   3. What they see in ORTAQ — the after state (mini dashboard)
 *   4. Key insight (specific business outcome)
 *
 * Tool names are explicit: WhatsApp, e-posta, PDF, Excel.
 * No abstract language. No startup phrases.
 */
export function UsageStory() {
  const { t } = useTranslation();
  const isTR = t("usage.t1before").includes("yerine") || t("usage.t1before").toLowerCase().includes("instead") === false;

  const movingLabel = isTR ? "İlerliyor" : "Moving";
  const blockedLabel = isTR ? "Beklemede" : "Blocked";

  return (
    <div className="grid gap-5 sm:grid-cols-3">

      {/* 08:30 — CEO */}
      <RoleCard
        time={t("usage.t1time")}
        role={t("usage.t1role")}
        before={t("usage.t1before")}
        insight={t("usage.t1insight")}
        sub={t("usage.t1sub")}
        roleColor="bg-ortaq-ink text-ortaq-cream"
        beforeTools={["WA", "Email"]}
      >
        <div className="overflow-hidden rounded-xl border border-ortaq-border bg-white">
          {/* Mini deal list */}
          {[
            { label: t("usage.t1b1"), status: t("usage.t1s1") as "moving" | "blocked" },
            { label: t("usage.t1b2"), status: t("usage.t1s2") as "moving" | "blocked" },
            { label: t("usage.t1b3"), status: t("usage.t1s3") as "moving" | "blocked" },
            { label: t("usage.t1b4"), status: t("usage.t1s4") as "moving" | "blocked" },
            { label: t("usage.t1b5"), status: t("usage.t1s5") as "moving" | "blocked" },
          ].map((row, i) => (
            <div key={i} className={cn(
              "flex items-center justify-between gap-2 px-2.5 py-1.5",
              i < 4 && "border-b border-ortaq-border/60",
            )}>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  row.status === "blocked" ? "bg-red-500 animate-pulse" : "bg-ortaq-trust",
                )} />
                <p className="text-[0.5rem] font-medium text-ortaq-ink truncate">{row.label}</p>
              </div>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold whitespace-nowrap",
                row.status === "blocked" ? "bg-red-100 text-red-600" : "bg-ortaq-trust/10 text-ortaq-trust",
              )}>
                {row.status === "blocked" ? blockedLabel : movingLabel}
              </span>
            </div>
          ))}
        </div>
      </RoleCard>

      {/* 09:15 — Satınalma */}
      <RoleCard
        time={t("usage.t2time")}
        role={t("usage.t2role")}
        before={t("usage.t2before")}
        insight={t("usage.t2insight")}
        sub={t("usage.t2sub")}
        roleColor="bg-amber-700 text-white"
        beforeTools={["PDF"]}
      >
        <div className="space-y-2">
          {[t("usage.t2b1"), t("usage.t2b2")].map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50">
              <div className="border-b border-amber-100 bg-amber-100/50 px-2.5 py-1.5">
                <p className="text-[0.5rem] font-bold text-amber-900">{item}</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-amber-100">
                {[
                  [isTR ? "SGS" : "SGS", isTR ? "Bekleniyor" : "Pending"],
                  [isTR ? "Taraf" : "Party", isTR ? "Karşı Taraf" : "Counterparty"],
                  [isTR ? "Son Gün" : "Deadline", i === 0 ? (isTR ? "28 Haz." : "Jun 28") : (isTR ? "15 Tem." : "Jul 15")],
                ].map(([label, val]) => (
                  <div key={label} className="flex flex-col items-center py-1.5">
                    <span className="text-[0.35rem] font-semibold uppercase text-amber-600">{label}</span>
                    <span className="mt-0.5 text-[0.5rem] font-bold text-amber-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </RoleCard>

      {/* 10:00 — Finans */}
      <RoleCard
        time={t("usage.t3time")}
        role={t("usage.t3role")}
        before={t("usage.t3before")}
        insight={t("usage.t3insight")}
        sub={t("usage.t3sub")}
        roleColor="bg-blue-700 text-white"
        beforeTools={["Email"]}
      >
        <div className="space-y-2">
          {[
            { label: t("usage.t3b1"), pct: 92, payStatus: isTR ? "BL Hazır" : "BL Ready", color: "ortaq-trust" },
            { label: t("usage.t3b2"), pct: 80, payStatus: isTR ? "Akreditif" : "Letter of Credit", color: "blue" },
            { label: t("usage.t3b3"), pct: 68, payStatus: isTR ? "LC Bekleniyor" : "LC Pending", color: "amber" },
          ].map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-blue-200 bg-white">
              <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-2.5 py-1.5">
                <p className="text-[0.5rem] font-bold text-blue-900 truncate">{item.label}</p>
              </div>
              <div className="px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-blue-100">
                    <div
                      className={cn("h-full rounded-full", item.pct >= 90 ? "bg-ortaq-trust" : item.pct >= 80 ? "bg-blue-500" : "bg-amber-500")}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-[0.4375rem] font-bold text-blue-700 shrink-0">{item.pct}%</span>
                </div>
                <span className={cn(
                  "mt-0.5 inline-block rounded-full px-1.5 py-px text-[0.375rem] font-bold",
                  item.pct >= 90 ? "bg-ortaq-trust/10 text-ortaq-trust" : item.pct >= 80 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                )}>
                  {item.payStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </RoleCard>

    </div>
  );
}

function RoleCard({
  time,
  role,
  before,
  insight,
  sub,
  roleColor,
  beforeTools,
  children,
}: {
  time: string;
  role: string;
  before: string;
  insight: string;
  sub: string;
  roleColor: string;
  beforeTools: string[];
  children: React.ReactNode;
}) {
  const toolColors: Record<string, string> = {
    WA:    "bg-[#25D366]/15 text-[#128C7E] border-[#25D366]/30",
    Email: "bg-blue-50 text-blue-600 border-blue-200",
    PDF:   "bg-red-50 text-red-500 border-red-200",
    Excel: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-ortaq-surface shadow-sm">
      {/* Card header */}
      <div className="border-b border-ortaq-border bg-[#fafaf9] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.9375rem] font-bold tabular-nums text-ortaq-ink">{time}</span>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[0.5rem] font-bold", roleColor)}>{role}</span>
        </div>

        {/* "Instead of [tool]" — explicit before-state */}
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {beforeTools.map((tool) => (
            <span key={tool} className={cn("rounded-full border px-2 py-0.5 text-[0.4375rem] font-bold", toolColors[tool] ?? "bg-gray-100 text-gray-500 border-gray-200")}>
              {tool}
            </span>
          ))}
          <span className="text-[0.4375rem] text-ortaq-ink-soft">{before}</span>
        </div>

        <p className="mt-2 text-[0.75rem] font-bold text-ortaq-ink leading-snug">{insight}</p>
        <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">{sub}</p>
      </div>

      {/* Mini dashboard */}
      <div className="p-3">{children}</div>
    </div>
  );
}
