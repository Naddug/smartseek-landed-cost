"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/** Visual #4 — Management View.
 *  Executive command panel: blocked / moving / needs attention.
 *  Scannable in under 3 seconds. No reading required.
 *  Color and icon carry all meaning.
 */
export function ManagementView() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_8px_40px_rgb(20_19_16/0.10)]">
      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[0.625rem] font-semibold text-ortaq-ink">
          Yönetim Genel Bakışı
        </span>
        <span className="ml-auto text-[0.5rem] text-ortaq-ink-soft">
          Güncel · 5 anlaşma
        </span>
      </div>

      {/* Three column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ortaq-border">

        {/* BLOCKED */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </span>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-red-600">
              {t("visuals.mgmt.blocked")} · 2
            </p>
          </div>
          <div className="space-y-2">
            {[
              { deal: t("visuals.mgmt.b1"), days: t("visuals.mgmt.b1days") },
              { deal: t("visuals.mgmt.b2"), days: t("visuals.mgmt.b2days") },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-red-100 bg-red-50 p-2.5">
                <p className="text-[0.5625rem] font-semibold leading-snug text-red-800">{item.deal}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <svg className="h-2.5 w-2.5 text-red-400" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                    <circle cx="5" cy="5" r="4" />
                    <path strokeLinecap="round" d="M5 3v2.5" />
                    <circle cx="5" cy="7" r="0.5" fill="currentColor" />
                  </svg>
                  <span className="text-[0.4375rem] font-medium text-red-500">{item.days} bekleniyor</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOVING */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-emerald-600">
              {t("visuals.mgmt.moving")} · 3
            </p>
          </div>
          <div className="space-y-2">
            {[
              { deal: t("visuals.mgmt.m1"), date: t("visuals.mgmt.m1date") },
              { deal: t("visuals.mgmt.m2"), date: t("visuals.mgmt.m2date") },
              { deal: t("visuals.mgmt.m3"), date: t("visuals.mgmt.m3date") },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-emerald-100 bg-emerald-50 p-2.5">
                <p className="text-[0.5625rem] font-semibold leading-snug text-emerald-800">{item.deal}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <svg className="h-2.5 w-2.5 text-emerald-500" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 5h6M5 2l3 3-3 3" />
                  </svg>
                  <span className="text-[0.4375rem] font-medium text-emerald-600">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEEDS ATTENTION */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-amber-600">
              {t("visuals.mgmt.attention")} · 2
            </p>
          </div>
          <div className="space-y-2">
            {[
              { action: t("visuals.mgmt.a1"), deal: t("visuals.mgmt.a1deal") },
              { action: t("visuals.mgmt.a2"), deal: t("visuals.mgmt.a2deal") },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-amber-100 bg-amber-50 p-2.5">
                <p className="text-[0.5625rem] font-semibold leading-snug text-amber-800">{item.action}</p>
                <p className="mt-0.5 text-[0.4375rem] text-amber-600">{item.deal}</p>
              </div>
            ))}
          </div>

          {/* Quick stat */}
          <div className="mt-3 rounded-lg border border-ortaq-border bg-[#fafaf9] p-2.5">
            <p className="text-[0.4375rem] font-bold uppercase text-ortaq-ink-soft mb-1">Bu Hafta</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[1.125rem] font-bold text-ortaq-trust tabular-nums">3</span>
              <span className="text-[0.5rem] text-ortaq-ink-muted">onay tamamlandı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center gap-4 border-t border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <p className="text-[0.5rem] text-ortaq-ink-soft">
          Hiç bir şey kaçmıyor. Her durum her iki tarafça görülüyor.
        </p>
        <div className="ml-auto flex gap-3">
          {[
            { label: "Beklemede", count: "2", color: "text-red-600" },
            { label: "İlerliyor", count: "3", color: "text-emerald-600" },
            { label: "Dikkat", count: "2", color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-0.5">
              <span className={cn("text-[0.75rem] font-bold tabular-nums", s.color)}>{s.count}</span>
              <span className="text-[0.4375rem] text-ortaq-ink-soft">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
