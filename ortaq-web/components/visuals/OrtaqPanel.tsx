"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * Visual #2 — THE ORTAQ VIEW.
 *
 * The EXACT same deal from ChaosVisual — now in one clean screen.
 * Same items. Same content. Radically different experience.
 *
 * Three phases on a vertical timeline: Negotiation → Documents → Execution.
 * Every item from the chaos is present and linked.
 *
 * Emotional target: "Everything is finally in one place."
 */
export function OrtaqPanel() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_12px_48px_rgb(20_19_16/0.12)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.5625rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz / deals / steel-supply-bestbuild
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[0.5rem] font-bold text-emerald-700">{t("visuals.ortaqView.stage")}</span>
        </div>
      </div>

      {/* Layout: sidebar + timeline + status */}
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr_180px]">

        {/* Left sidebar — deal identity */}
        <div className="hidden border-r border-ortaq-border sm:block">
          <div className="border-b border-ortaq-border bg-[#fafaf9] p-4">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft mb-2">
              İşlem Detayı
            </p>
            <p className="text-[0.625rem] font-bold leading-tight text-ortaq-ink">
              {t("visuals.ortaqView.dealName")}
            </p>
            <div className="mt-1 text-[1rem] font-bold tabular-nums text-ortaq-trust">
              {t("visuals.ortaqView.amount")}
            </div>
            <div className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">Due: {t("visuals.ortaqView.due")}</div>

            {/* Progress */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[0.4375rem] font-semibold text-ortaq-ink-soft">Tamamlanma</span>
                <span className="text-[0.5rem] font-bold text-ortaq-trust">78%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-[78%] rounded-full bg-ortaq-trust" />
              </div>
            </div>
          </div>

          {/* Confirmed items — pulled from chaos, now clean */}
          <div className="p-3">
            <p className="mb-2 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              ✓ Onaylı Maddeler
            </p>
            {[
              t("visuals.ortaqView.agreed1"),
              t("visuals.ortaqView.agreed2"),
              t("visuals.ortaqView.agreed3"),
            ].map((item) => (
              <div key={item} className="flex items-start gap-1.5 py-1">
                <svg
                  className="mt-px h-3 w-3 shrink-0 text-ortaq-trust"
                  fill="none"
                  viewBox="0 0 12 12"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
                <span className="text-[0.5rem] leading-tight text-ortaq-ink-muted">{item}</span>
              </div>
            ))}

            {/* Phase dots */}
            <div className="mt-3 space-y-1">
              {[
                { label: t("visuals.ortaqView.phase1"), done: true },
                { label: t("visuals.ortaqView.phase2"), done: true },
                { label: t("visuals.ortaqView.phase3"), done: false, active: true },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-1.5">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    p.done ? "bg-ortaq-trust" : p.active ? "bg-amber-400 animate-pulse" : "bg-ortaq-border"
                  )} />
                  <span className={cn(
                    "text-[0.4375rem] font-medium",
                    p.done ? "text-ortaq-trust" : p.active ? "text-amber-600" : "text-ortaq-ink-soft"
                  )}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center — unified timeline */}
        <div>
          <div className="border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              Birleşik Zaman Çizelgesi · {t("visuals.ortaqView.everyone")}
            </p>
          </div>
          <div className="relative p-4">
            {/* Vertical connector line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-ortaq-border" />

            <div className="space-y-3">

              {/* Item 1: WhatsApp — same message from chaos, now in context */}
              <TimelineItem
                icon="WA"
                iconBg="bg-[#25D366]/15 text-[#128C7E]"
                time="09:14"
                from={t("visuals.ortaqView.msg1From")}
                source="WhatsApp"
                content={t("visuals.ortaqView.msg1")}
                pill={{ label: t("visuals.ortaqView.confirmed"), color: "bg-emerald-100 text-emerald-700" }}
                border="border-l-[#25D366]"
              />

              {/* Item 2: Email → linked to approval */}
              <TimelineItem
                icon="✉"
                iconBg="bg-blue-100 text-blue-600"
                time="10:02"
                from="Selim K."
                source="Email"
                content={t("visuals.chaos.emailSubject")}
                pill={{ label: t("visuals.ortaqView.linked"), color: "bg-blue-100 text-blue-700" }}
                border="border-l-blue-400"
              />

              {/* Item 3: PDF v12 — the CURRENT one, marked clearly */}
              <TimelineItem
                icon="PDF"
                iconBg="bg-red-100 text-red-600"
                time="10:35"
                from="Selim K."
                source="Belge"
                content={t("visuals.chaos.pdfV12")}
                pill={{ label: t("visuals.ortaqView.current"), color: "bg-emerald-100 text-emerald-700" }}
                border="border-l-red-400"
                subContent={
                  <span className="text-[0.4375rem] line-through text-ortaq-ink-soft">
                    {t("visuals.chaos.pdfV11")} &nbsp;{t("visuals.chaos.pdfV10")}
                  </span>
                }
              />

              {/* Item 4: Finance approval — the answer to the chaos question */}
              <TimelineItem
                icon="✓"
                iconBg="bg-ortaq-trust/15 text-ortaq-trust"
                time="11:22"
                from={t("visuals.ortaqView.approval1By")}
                source="Onay"
                content={t("visuals.ortaqView.approval1")}
                pill={{ label: t("visuals.ortaqView.confirmed"), color: "bg-emerald-100 text-emerald-700" }}
                border="border-l-ortaq-trust"
              />

              {/* Item 5: Voice note — transcribed automatically */}
              <TimelineItem
                icon="🎙"
                iconBg="bg-purple-100 text-purple-600"
                time="13:10"
                from="Mehmet K."
                source="Sesli Mesaj"
                content={`"${t("visuals.chaos.voiceNote")}" — Muayene onaylandı ✓`}
                pill={{ label: "Aktarıldı", color: "bg-purple-100 text-purple-700" }}
                border="border-l-purple-400"
              />

              {/* Item 6: SGS — status is clear */}
              <TimelineItem
                icon="SGS"
                iconBg="bg-amber-100 text-amber-700"
                time="14:01"
                from="SGS"
                source="Muayene"
                content={`${t("visuals.chaos.sgsTitle")} — Onay bekleniyor`}
                pill={{ label: "Sıra Sizde →", color: "bg-amber-100 text-amber-700" }}
                border="border-l-amber-400"
              />

            </div>
          </div>
        </div>

        {/* Right sidebar — current state */}
        <div className="hidden border-l border-ortaq-border sm:block">
          <div className="border-b border-ortaq-border bg-[#fafaf9] px-3 py-2.5">
            <p className="text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">Şu An</p>
          </div>
          <div className="p-3 space-y-2">

            {/* Your turn — pulsing */}
            <div className="rounded-lg border border-ortaq-trust/30 bg-ortaq-trust/6 p-2.5">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ortaq-trust opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ortaq-trust" />
                </span>
                <span className="text-[0.4375rem] font-bold uppercase tracking-wide text-ortaq-trust">
                  {t("visuals.ortaqView.yourturn")}
                </span>
              </div>
              <p className="text-[0.5625rem] font-semibold leading-snug text-ortaq-ink">
                {t("visuals.ortaqView.task1")}
              </p>
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.375rem] font-bold text-amber-700">
                {t("visuals.ortaqView.task1Due")}
              </span>
            </div>

            {/* Their turn — waiting */}
            <div className="rounded-lg border border-ortaq-border bg-[#fafaf9] p-2.5">
              <p className="text-[0.4375rem] font-bold uppercase text-ortaq-ink-soft mb-1">Karşı Taraf</p>
              <p className="text-[0.5rem] text-ortaq-ink-muted leading-tight">
                Yük planı — BestBuild
              </p>
            </div>

            {/* Shared visibility */}
            <div className="rounded-lg border border-ortaq-trust/20 bg-ortaq-trust/5 p-2.5">
              <p className="text-[0.4375rem] font-bold uppercase text-ortaq-trust mb-1.5">
                {t("visuals.ortaqView.everyone")}
              </p>
              <div className="flex -space-x-1.5">
                {[
                  { init: "YÇ", bg: "bg-ortaq-trust/20" },
                  { init: "SK", bg: "bg-blue-200" },
                  { init: "MK", bg: "bg-amber-200" },
                  { init: "BB", bg: "bg-purple-200" },
                ].map((a) => (
                  <span
                    key={a.init}
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[0.375rem] font-bold text-ortaq-ink",
                      a.bg,
                    )}
                  >
                    {a.init}
                  </span>
                ))}
              </div>
              <p className="mt-1 text-[0.375rem] text-ortaq-ink-soft">
                Gerçek zamanlı, her iki taraf
              </p>
            </div>

            {/* Status: Known */}
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-center">
              <span className="text-[0.4375rem] font-bold text-emerald-700">Durum: Net ✓</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TimelineItem({
  icon,
  iconBg,
  time,
  from,
  source,
  content,
  pill,
  border,
  subContent,
}: {
  icon: string;
  iconBg: string;
  time: string;
  from: string;
  source: string;
  content: string;
  pill: { label: string; color: string };
  border: string;
  subContent?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Icon bubble on the timeline line */}
      <span
        className={cn(
          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.4rem] font-bold ring-2 ring-white",
          iconBg,
        )}
      >
        {icon}
      </span>
      <div className={cn("min-w-0 flex-1 rounded-lg border-l-2 border border-ortaq-border bg-[#fafaf9] px-3 py-2", border)}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <p className="text-[0.4375rem] font-semibold text-ortaq-ink">{from}</p>
            <span className="rounded bg-ortaq-bg px-1 py-px text-[0.375rem] text-ortaq-ink-soft">{source}</span>
          </div>
          <span className="shrink-0 text-[0.375rem] text-ortaq-ink-soft">{time}</span>
        </div>
        <p className="mt-0.5 text-[0.5625rem] font-medium leading-snug text-ortaq-ink">{content}</p>
        {subContent && <div className="mt-0.5">{subContent}</div>}
        <span className={cn("mt-1 inline-block rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold", pill.color)}>
          {pill.label}
        </span>
      </div>
    </div>
  );
}
