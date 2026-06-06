"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/** Visual #2 — The ORTAQ View.
 *  The same deal from ChaosVisual, now in a single unified screen.
 *  Three panels: deal context / unified feed / status column.
 *  Every item from the chaos is present — just calm and organized.
 */
export function OrtaqPanel() {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_8px_48px_rgb(20_19_16/0.13)]">

      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.6rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz / tx / {t("visuals.ortaqView.dealName")}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-ortaq-trust/10 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
          <span className="text-[0.5rem] font-semibold text-ortaq-trust">{t("visuals.ortaqView.stage")}</span>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr_1fr]">

        {/* Left: deal info */}
        <div className="hidden border-r border-ortaq-border sm:block">
          <div className="border-b border-ortaq-border bg-[#fafaf9] px-4 py-3">
            <p className="text-[0.5625rem] font-bold leading-tight text-ortaq-ink">
              {t("visuals.ortaqView.dealName")}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-[0.4375rem] font-medium text-amber-600">
                {t("visuals.ortaqView.stage")}
              </span>
            </div>
            <div className="mt-2 text-[0.75rem] font-bold tabular-nums text-ortaq-ink">
              {t("visuals.ortaqView.amount")}
            </div>
            <div className="mt-0.5 text-[0.4375rem] text-ortaq-ink-soft">
              Due: {t("visuals.ortaqView.due")}
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[0.4rem] font-semibold uppercase text-ortaq-ink-soft">Progress</span>
                <span className="text-[0.5rem] font-bold text-ortaq-trust">78%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust" />
              </div>
            </div>

            {/* Confirmed */}
            <div className="mt-3">
              <p className="mb-1.5 text-[0.4rem] font-bold uppercase tracking-wide text-ortaq-ink-soft">
                ✓ Onaylı
              </p>
              {[
                t("visuals.ortaqView.agreed1"),
                t("visuals.ortaqView.agreed2"),
                t("visuals.ortaqView.agreed3"),
              ].map((a) => (
                <div key={a} className="flex items-center gap-1.5 py-0.5">
                  <svg className="h-2.5 w-2.5 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2 2 4-4" />
                  </svg>
                  <span className="text-[0.4375rem] text-ortaq-ink-muted">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: unified feed */}
        <div>
          <div className="border-b border-ortaq-border px-4 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
              Birleşik Aktivite
            </p>
          </div>
          <div className="space-y-2 p-3">

            {/* WhatsApp message */}
            <FeedItem
              badge="WA"
              badgeColor="bg-[#25D366]/15 text-[#128C7E]"
              from={t("visuals.ortaqView.msg1From")}
              content={t("visuals.ortaqView.msg1")}
              time="09:14"
              leftBorder="border-l-[#25D366]"
            />

            {/* Document */}
            <FeedItem
              badge="PDF"
              badgeColor="bg-red-100 text-red-600"
              from="Selim K."
              content={t("visuals.ortaqView.doc1")}
              time="10:35"
              leftBorder="border-l-red-400"
              pill={{ label: t("visuals.ortaqView.doc1Status"), color: "bg-emerald-100 text-emerald-700" }}
            />

            {/* Approval */}
            <FeedItem
              badge="✓"
              badgeColor="bg-ortaq-trust/15 text-ortaq-trust"
              from={t("visuals.ortaqView.approval1By")}
              content={t("visuals.ortaqView.approval1")}
              time="11:22"
              leftBorder="border-l-ortaq-trust"
              pill={{ label: "Onaylandı", color: "bg-emerald-100 text-emerald-700" }}
            />

            {/* Task */}
            <FeedItem
              badge="→"
              badgeColor="bg-amber-100 text-amber-700"
              from="Yılmaz Ç."
              content={t("visuals.ortaqView.task1")}
              time="14:10"
              leftBorder="border-l-amber-400"
              pill={{ label: t("visuals.ortaqView.task1Due"), color: "bg-amber-100 text-amber-700" }}
            />

          </div>
        </div>

        {/* Right: next action */}
        <div className="hidden border-l border-ortaq-border sm:block">
          <div className="border-b border-ortaq-border bg-[#fafaf9] px-3 py-2.5">
            <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              Sıra Kimde
            </p>
          </div>
          <div className="p-3 space-y-2">
            {/* Your turn */}
            <div className="rounded-lg border border-ortaq-trust/25 bg-ortaq-trust/5 p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ortaq-trust opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-ortaq-trust" />
                </span>
                <span className="text-[0.4375rem] font-bold uppercase text-ortaq-trust">Sıra Sizde</span>
              </div>
              <p className="text-[0.5rem] font-semibold leading-snug text-ortaq-ink">
                {t("visuals.ortaqView.task1")}
              </p>
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.375rem] font-bold text-amber-700">
                {t("visuals.ortaqView.task1Due")}
              </span>
            </div>

            {/* Their turn */}
            <div className="rounded-lg border border-ortaq-border bg-[#fafaf9] p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-ortaq-border-strong" />
                <span className="text-[0.4375rem] font-bold uppercase text-ortaq-ink-soft">Karşı Taraf</span>
              </div>
              <p className="text-[0.5rem] text-ortaq-ink-muted">Yük planı — BestBuild</p>
            </div>

            {/* Shared truth */}
            <div className="rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/5 p-2.5">
              <p className="text-[0.4375rem] font-bold uppercase tracking-wide text-ortaq-trust mb-1">
                Her İki Taraf Görüyor
              </p>
              <div className="flex -space-x-1">
                {["YÇ", "SK", "MK"].map((i) => (
                  <span key={i} className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-ortaq-trust/15 text-[0.375rem] font-bold text-ortaq-trust">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedItem({
  badge, badgeColor, from, content, time, leftBorder, pill,
}: {
  badge: string;
  badgeColor: string;
  from: string;
  content: string;
  time: string;
  leftBorder: string;
  pill?: { label: string; color: string };
}) {
  return (
    <div className={cn("flex gap-2.5 rounded-lg border-l-2 border-ortaq-border bg-[#fafaf9] p-2.5", leftBorder)}>
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.4375rem] font-bold", badgeColor)}>
        {badge}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.4375rem] font-semibold text-ortaq-ink-soft">{from}</p>
          <span className="shrink-0 text-[0.375rem] text-ortaq-ink-soft">{time}</span>
        </div>
        <p className="mt-0.5 text-[0.5625rem] font-medium leading-snug text-ortaq-ink">{content}</p>
        {pill && (
          <span className={cn("mt-1 inline-block rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold", pill.color)}>
            {pill.label}
          </span>
        )}
      </div>
    </div>
  );
}
