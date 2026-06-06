"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * Visual #4 — COMMERCIAL COMMAND CENTER.
 *
 * Not a dashboard. Mission control.
 * CEO + Export Director + Procurement see this and instantly know
 * the state of the entire commercial operation.
 *
 * Dark background. Large typography. Unambiguous color.
 * No reading required. Color and number carry everything.
 */
export function CommandCenter() {
  const { t } = useTranslation();

  type Status = "moving" | "blocked";

  const deals: {
    name: string;
    counterparty: string;
    pct: number;
    status: Status;
    note: string;
  }[] = [
    {
      name: t("visuals.command.d1"),
      counterparty: t("visuals.command.d1c"),
      pct: Number(t("visuals.command.d1pct")),
      status: t("visuals.command.d1status") as Status,
      note: t("visuals.command.d1note"),
    },
    {
      name: t("visuals.command.d2"),
      counterparty: t("visuals.command.d2c"),
      pct: Number(t("visuals.command.d2pct")),
      status: t("visuals.command.d2status") as Status,
      note: t("visuals.command.d2note"),
    },
    {
      name: t("visuals.command.d3"),
      counterparty: t("visuals.command.d3c"),
      pct: Number(t("visuals.command.d3pct")),
      status: t("visuals.command.d3status") as Status,
      note: t("visuals.command.d3note"),
    },
    {
      name: t("visuals.command.d4"),
      counterparty: t("visuals.command.d4c"),
      pct: Number(t("visuals.command.d4pct")),
      status: t("visuals.command.d4status") as Status,
      note: t("visuals.command.d4note"),
    },
    {
      name: t("visuals.command.d5"),
      counterparty: t("visuals.command.d5c"),
      pct: Number(t("visuals.command.d5pct")),
      status: t("visuals.command.d5status") as Status,
      note: t("visuals.command.d5note"),
    },
  ];

  const moving = deals.filter((d) => d.status === "moving").length;
  const blocked = deals.filter((d) => d.status === "blocked").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D0C0A] shadow-[0_16px_64px_rgb(0_0_0/0.5)]">

      {/* Chrome — dark */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[0.625rem] font-semibold text-white/70">
            Yılmaz Çelik A.Ş. — Ticari Operasyonlar
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[0.5rem] font-bold text-emerald-400">{t("visuals.command.live")}</span>
        </div>
      </div>

      {/* BIG STAT ROW — scannable in 1 second */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.08]">

        {/* Total portfolio */}
        <div className="px-5 py-5">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-white/30">
            {t("visuals.command.totalLabel")}
          </p>
          <p className="mt-1 text-[2rem] font-bold leading-none tabular-nums text-white">
            {t("visuals.command.totalVal")}
          </p>
          <p className="mt-1 text-[0.5rem] text-white/40">5 aktif işlem</p>
        </div>

        {/* Moving */}
        <div className="px-5 py-5">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-emerald-400/70">
            {t("visuals.command.movingLabel")}
          </p>
          <p className="mt-1 text-[2rem] font-bold leading-none tabular-nums text-emerald-400">
            {moving}
          </p>
          <div className="mt-1 flex gap-px">
            {Array.from({ length: moving }).map((_, i) => (
              <span key={i} className="h-1 w-3 rounded-full bg-emerald-400/40" />
            ))}
          </div>
        </div>

        {/* Blocked */}
        <div className="px-5 py-5">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-red-400/70">
            {t("visuals.command.blockedLabel")}
          </p>
          <p className="mt-1 text-[2rem] font-bold leading-none tabular-nums text-red-400">
            {blocked}
          </p>
          <p className="mt-1 text-[0.5rem] text-red-400/50">
            {t("visuals.command.urgentLabel")}: 1
          </p>
        </div>

      </div>

      {/* Deal table */}
      <div className="divide-y divide-white/[0.05]">
        {deals.map((deal, i) => {
          const isBlocked = deal.status === "blocked";
          const isUrgent = isBlocked && deal.pct < 20;
          return (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[1fr_1.2fr_120px_100px] sm:grid-cols-[1.2fr_1.4fr_200px_120px] items-center gap-4 px-5 py-3.5",
                isUrgent
                  ? "bg-red-900/10"
                  : isBlocked
                  ? "bg-red-900/5"
                  : "bg-transparent",
              )}
            >
              {/* Deal name */}
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      isBlocked
                        ? "bg-red-500 animate-pulse"
                        : "bg-emerald-400",
                    )}
                  />
                  <p className="text-[0.5625rem] font-semibold text-white">
                    {deal.name}
                  </p>
                  {isUrgent && (
                    <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[0.375rem] font-bold text-red-400">
                      ACİL
                    </span>
                  )}
                </div>
              </div>

              {/* Counterparty */}
              <p className="text-[0.5rem] text-white/50 truncate">{deal.counterparty}</p>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      isBlocked ? "bg-red-500/60" : "bg-emerald-400/70",
                    )}
                    style={{ width: `${deal.pct}%` }}
                  />
                </div>
                <span className={cn(
                  "text-[0.5rem] font-bold tabular-nums w-7 text-right",
                  isBlocked ? "text-red-400" : "text-emerald-400",
                )}>
                  {deal.pct}%
                </span>
              </div>

              {/* Status note */}
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[0.4375rem] font-bold",
                    isBlocked
                      ? "bg-red-500/15 text-red-400"
                      : "bg-emerald-400/10 text-emerald-400",
                  )}
                >
                  {isBlocked ? "⏸" : "▶"}
                </span>
                <p className="text-[0.4375rem] text-white/40 leading-tight">{deal.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.02] px-5 py-3">
        <p className="text-[0.5rem] text-white/30">
          {t("visuals.command.sharedTruth")}
        </p>
        <div className="flex -space-x-1.5">
          {["YÇ", "MK", "SK", "HA", "TR"].map((init, i) => (
            <span
              key={init}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[0.375rem] font-bold text-white"
            >
              {init}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
