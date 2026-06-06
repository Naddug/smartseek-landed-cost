"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * UsageStory — three role-based moments in the same morning.
 *
 * 08:30 CEO        → sees all deal status at a glance
 * 09:15 Satınalma  → filters SGS-pending deals
 * 10:00 Finans     → sees payment-ready deals
 *
 * Purpose: show daily operational use, not features.
 * Real business language: fiyat, sözleşme, SGS, sevkiyat, ödeme, akreditif.
 * No startup language: no "collaboration", no "workflow", no "platform".
 */
export function UsageStory() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-3">

      {/* 08:30 — CEO */}
      <StoryCard
        time={t("usage.t1time")}
        role={t("usage.t1role")}
        insight={t("usage.t1insight")}
        sub={t("usage.t1sub")}
        roleColor="bg-ortaq-ink text-ortaq-cream"
        accentColor="text-ortaq-ink"
      >
        {/* Mini deal list — 5 rows */}
        <div className="divide-y divide-ortaq-border rounded-xl border border-ortaq-border bg-white overflow-hidden">
          {[
            { label: t("usage.t1b1"), status: t("usage.t1s1") as "moving" | "blocked" },
            { label: t("usage.t1b2"), status: t("usage.t1s2") as "moving" | "blocked" },
            { label: t("usage.t1b3"), status: t("usage.t1s3") as "moving" | "blocked" },
            { label: t("usage.t1b4"), status: t("usage.t1s4") as "moving" | "blocked" },
            { label: t("usage.t1b5"), status: t("usage.t1s5") as "moving" | "blocked" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  row.status === "blocked" ? "bg-red-500 animate-pulse" : "bg-ortaq-trust",
                )} />
                <p className="text-[0.5rem] font-medium text-ortaq-ink">{row.label}</p>
              </div>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold",
                row.status === "blocked" ? "bg-red-100 text-red-600" : "bg-ortaq-trust/10 text-ortaq-trust",
              )}>
                {row.status === "blocked"
                  ? (t("usage.t1time").startsWith("0") ? "Beklemede" : "Blocked")
                  : (t("usage.t1time").startsWith("0") ? "İlerliyor" : "Moving")}
              </span>
            </div>
          ))}
        </div>
      </StoryCard>

      {/* 09:15 — Satınalma */}
      <StoryCard
        time={t("usage.t2time")}
        role={t("usage.t2role")}
        insight={t("usage.t2insight")}
        sub={t("usage.t2sub")}
        roleColor="bg-amber-600 text-white"
        accentColor="text-amber-700"
      >
        {/* Filtered view: SGS pending */}
        <div className="space-y-2">
          {[
            t("usage.t2b1"),
            t("usage.t2b2"),
          ].map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50">
              <div className="flex items-center gap-1.5 border-b border-amber-100 bg-amber-100/50 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-[0.5rem] font-bold text-amber-800">{item}</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-amber-100 px-0">
                {[
                  ["SGS", "Bekleniyor"],
                  ["Karşı Taraf", "Aksiyon"],
                  ["Son Gün", i === 0 ? "28 Haz." : "15 Tem."],
                ].map(([label, val]) => (
                  <div key={label} className="flex flex-col items-center py-2">
                    <span className="text-[0.35rem] text-amber-600 font-semibold uppercase">{label}</span>
                    <span className="text-[0.5rem] font-bold text-amber-800 mt-0.5">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StoryCard>

      {/* 10:00 — Finans */}
      <StoryCard
        time={t("usage.t3time")}
        role={t("usage.t3role")}
        insight={t("usage.t3insight")}
        sub={t("usage.t3sub")}
        roleColor="bg-blue-700 text-white"
        accentColor="text-blue-700"
      >
        {/* Payment-ready deals */}
        <div className="space-y-2">
          {[
            { label: t("usage.t3b1"), pct: 92 },
            { label: t("usage.t3b2"), pct: 80 },
            { label: t("usage.t3b3"), pct: 68 },
          ].map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-blue-200 bg-white">
              <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-3 py-1.5">
                <p className="text-[0.5rem] font-bold text-blue-900">{item.label}</p>
                <span className="text-[0.375rem] font-bold text-blue-600">{item.pct}%</span>
              </div>
              <div className="px-3 py-1.5">
                <div className="h-1 overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className={cn(
                    "text-[0.375rem] font-semibold",
                    item.pct >= 90 ? "text-ortaq-trust" : "text-blue-500",
                  )}>
                    {item.pct >= 90 ? (t("usage.t1time").startsWith("0") ? "Ödemeye Hazır" : "Ready for Payment") :
                     item.pct >= 80 ? (t("usage.t1time").startsWith("0") ? "Akreditif Açıldı" : "LC Opened") :
                     (t("usage.t1time").startsWith("0") ? "LC Bekleniyor" : "LC Pending")}
                  </span>
                  <span className="text-[0.375rem] text-gray-400">
                    {i === 0 ? "BL hazır" : i === 1 ? "BL bekleniyor" : "Muayene bekleniyor"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </StoryCard>

    </div>
  );
}

function StoryCard({
  time,
  role,
  insight,
  sub,
  roleColor,
  accentColor,
  children,
}: {
  time: string;
  role: string;
  insight: string;
  sub: string;
  roleColor: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-ortaq-surface shadow-sm">

      {/* Card header */}
      <div className="border-b border-ortaq-border bg-[#fafaf9] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[0.875rem] font-bold tabular-nums text-ortaq-ink">{time}</span>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[0.5rem] font-bold", roleColor)}>
            {role}
          </span>
        </div>
        <p className={cn("mt-1.5 text-[0.75rem] font-bold leading-tight", accentColor)}>{insight}</p>
        <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">{sub}</p>
      </div>

      {/* Mini dashboard preview */}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}
