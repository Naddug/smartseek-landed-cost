"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/** Visual #3 — Multiple Deals.
 *  Four active transactions at different stages, different counterparties.
 *  Shows ORTAQ is a company-level platform, not a single-transaction tool.
 */
export function DealsBoard() {
  const { t } = useTranslation();

  const deals = [
    {
      name: t("visuals.deals.d1Name"),
      party: t("visuals.deals.d1Party"),
      country: t("visuals.deals.d1Country"),
      stage: t("visuals.deals.d1Stage"),
      pct: t("visuals.deals.d1Pct") as unknown as number,
      action: t("visuals.deals.d1Action"),
      stageColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
    },
    {
      name: t("visuals.deals.d2Name"),
      party: t("visuals.deals.d2Party"),
      country: t("visuals.deals.d2Country"),
      stage: t("visuals.deals.d2Stage"),
      pct: t("visuals.deals.d2Pct") as unknown as number,
      action: t("visuals.deals.d2Action"),
      stageColor: "bg-amber-100 text-amber-700 border-amber-200",
      dotColor: "bg-amber-400",
    },
    {
      name: t("visuals.deals.d3Name"),
      party: t("visuals.deals.d3Party"),
      country: t("visuals.deals.d3Country"),
      stage: t("visuals.deals.d3Stage"),
      pct: t("visuals.deals.d3Pct") as unknown as number,
      action: t("visuals.deals.d3Action"),
      stageColor: "bg-blue-100 text-blue-700 border-blue-200",
      dotColor: "bg-blue-400",
    },
    {
      name: t("visuals.deals.d4Name"),
      party: t("visuals.deals.d4Party"),
      country: t("visuals.deals.d4Country"),
      stage: t("visuals.deals.d4Stage"),
      pct: t("visuals.deals.d4Pct") as unknown as number,
      action: t("visuals.deals.d4Action"),
      stageColor: "bg-violet-100 text-violet-700 border-violet-200",
      dotColor: "bg-violet-400",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_8px_40px_rgb(20_19_16/0.10)]">
      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[0.625rem] font-semibold text-ortaq-ink">
          Yılmaz Çelik A.Ş. — Ticari Operasyonlar
        </span>
        <span className="ml-auto flex items-center gap-1 text-[0.5rem] text-ortaq-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
          4 aktif anlaşma
        </span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr_1.1fr_1fr] gap-3 border-b border-ortaq-border bg-[#f5f3ef] px-4 py-2">
        {["Anlaşma", "Karşı Taraf", "Aşama", "İlerleme", "Bekleyen"].map((h) => (
          <p key={h} className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">{h}</p>
        ))}
      </div>

      {/* Deal rows */}
      <div className="divide-y divide-ortaq-border">
        {deals.map((d, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-[1.4fr_1.2fr_0.8fr_1.1fr_1fr] items-center gap-3 px-4 py-3",
              i === 0 && "bg-ortaq-trust/3",
            )}
          >
            {/* Name */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", d.dotColor)} />
                <p className="text-[0.5625rem] font-semibold text-ortaq-ink">{d.name}</p>
              </div>
            </div>

            {/* Party + country */}
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{d.country}</span>
              <p className="truncate text-[0.5rem] text-ortaq-ink-muted">{d.party}</p>
            </div>

            {/* Stage */}
            <span className={cn("inline-block rounded-full border px-2 py-0.5 text-[0.4375rem] font-bold w-fit", d.stageColor)}>
              {d.stage}
            </span>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div
                  className={cn("h-full rounded-full", i === 0 ? "bg-ortaq-trust" : "bg-ortaq-border-strong")}
                  style={{ width: `${Number(d.pct)}%` }}
                />
              </div>
              <span className={cn("text-[0.4375rem] font-bold tabular-nums w-6 text-right", i === 0 ? "text-ortaq-trust" : "text-ortaq-ink-soft")}>
                {d.pct}%
              </span>
            </div>

            {/* Action */}
            <div className="flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", i === 0 ? "bg-ortaq-trust animate-pulse" : "bg-ortaq-border-strong")} />
              <p className="text-[0.5rem] text-ortaq-ink-muted leading-tight">{d.action}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between border-t border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <div className="flex gap-4">
          {[
            { label: "Toplam", val: "€2.4M", color: "text-ortaq-ink" },
            { label: "İlerliyor", val: "3", color: "text-ortaq-trust" },
            { label: "Dikkat", val: "1", color: "text-ortaq-accent" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <span className="text-[0.4375rem] text-ortaq-ink-soft">{s.label}</span>
              <span className={cn("text-[0.5625rem] font-bold", s.color)}>{s.val}</span>
            </div>
          ))}
        </div>
        <span className="text-[0.4375rem] text-ortaq-ink-soft">Her iki taraf gerçek zamanlı görüyor</span>
      </div>
    </div>
  );
}
