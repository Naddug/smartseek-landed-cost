"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { useState } from "react";

/**
 * HeroDashboard — the hero visual.
 *
 * DESIGN RULE: This must immediately communicate
 * "transaction management platform" — NOT "messaging tool."
 *
 * Layout:
 *   Left  — active transaction list with status & portfolio summary
 *   Right — selected transaction detail: milestone track, agreed items,
 *           who is waiting, next action, responsible parties
 *
 * No message feed. No chat bubbles. No WhatsApp UI.
 * The central object is the TRANSACTION.
 */

type TxStatus = "moving" | "blocked" | "waiting";

interface Transaction {
  id: number;
  name: string;
  counterparty: string;
  flag: string;
  amount: string;
  pct: number;
  stage: string;
  stageIdx: number; // 0-5
  status: TxStatus;
  waitingOn: string;
  nextAction: string;
  deadline: string;
  agreed: string[];
  pending: string[];
  team: string[];
}

const STAGES_TR = ["Teklif", "Müzakere", "Sözleşme", "Muayene", "Sevkiyat", "Ödeme"];
const STAGES_EN = ["Offer", "Negotiation", "Contract", "Inspection", "Shipment", "Payment"];

const TX_TR: Transaction[] = [
  {
    id: 1,
    name: "Çelik Tedariki",
    counterparty: "BestBuild GmbH",
    flag: "🇩🇪",
    amount: "€840.000",
    pct: 78,
    stage: "Muayene",
    stageIdx: 3,
    status: "waiting",
    waitingOn: "BestBuild GmbH — SGS onayı",
    nextAction: "SGS raporu gelince BL kesimi başlat",
    deadline: "28 Haz.",
    agreed: ["€1.260/MT CIF Rotterdam", "500 MT miktar", "LC at sight ödeme"],
    pending: ["SGS muayene onayı", "BL kesmek için taşıyıcı rezervasyonu"],
    team: ["YÇ", "SK", "MK"],
  },
  {
    id: 2,
    name: "Kahve İhracatı",
    counterparty: "Dubai Trading LLC",
    flag: "🇦🇪",
    amount: "€290.000",
    pct: 45,
    stage: "Müzakere",
    stageIdx: 1,
    status: "blocked",
    waitingOn: "5 gün yanıt yok — Dubai Trading",
    nextAction: "Karşı teklife yanıt talep et",
    deadline: "Gecikmiş",
    agreed: ["Arabica Grade 1 kalite", "FOB İstanbul"],
    pending: ["Revize fiyat onayı", "Ödeme koşulları belirsiz"],
    team: ["AK", "MT"],
  },
  {
    id: 3,
    name: "Pamuklu Kumaş",
    counterparty: "Jakarta Mills",
    flag: "🇮🇩",
    amount: "€175.000",
    pct: 22,
    stage: "Teklif",
    stageIdx: 0,
    status: "moving",
    waitingOn: "Numune onayı — İç ekip",
    nextAction: "Numune değerlendirmesini tamamla",
    deadline: "20 Haz.",
    agreed: ["32s Ring Spun Cotton"],
    pending: ["Fiyat onayı", "Minimum sipariş miktarı"],
    team: ["BK", "EY"],
  },
  {
    id: 4,
    name: "Makine İthalatı",
    counterparty: "Osaka Machinery",
    flag: "🇯🇵",
    amount: "€1.200.000",
    pct: 61,
    stage: "Sözleşme",
    stageIdx: 2,
    status: "moving",
    waitingOn: "Sıra bizdeydi — tamamlandı",
    nextAction: "Muayene ekibini rezerve et",
    deadline: "15 Tem.",
    agreed: ["CNC Tezgâh Modeli X-900", "FCA Osaka Limanı", "T/T ödeme"],
    pending: ["Muayene programı", "Sigorta belgesi"],
    team: ["CK", "MK", "AT"],
  },
];

const TX_EN: Transaction[] = [
  {
    id: 1,
    name: "Steel Supply",
    counterparty: "BestBuild GmbH",
    flag: "🇩🇪",
    amount: "€840,000",
    pct: 78,
    stage: "Inspection",
    stageIdx: 3,
    status: "waiting",
    waitingOn: "BestBuild GmbH — SGS approval",
    nextAction: "Once SGS approved, initiate BL issuance",
    deadline: "Jun 28",
    agreed: ["€1,260/MT CIF Rotterdam", "500 MT quantity", "LC at sight payment"],
    pending: ["SGS inspection confirmation", "Carrier reservation for BL"],
    team: ["YÇ", "SK", "MK"],
  },
  {
    id: 2,
    name: "Coffee Export",
    counterparty: "Dubai Trading LLC",
    flag: "🇦🇪",
    amount: "€290,000",
    pct: 45,
    stage: "Negotiation",
    stageIdx: 1,
    status: "blocked",
    waitingOn: "No response 5 days — Dubai Trading",
    nextAction: "Request response on counter-offer",
    deadline: "Overdue",
    agreed: ["Arabica Grade 1 quality", "FOB Istanbul"],
    pending: ["Revised price approval", "Payment terms unclear"],
    team: ["AK", "MT"],
  },
  {
    id: 3,
    name: "Cotton Fabric",
    counterparty: "Jakarta Mills",
    flag: "🇮🇩",
    amount: "€175,000",
    pct: 22,
    stage: "Offer",
    stageIdx: 0,
    status: "moving",
    waitingOn: "Sample approval — Internal team",
    nextAction: "Complete sample evaluation",
    deadline: "Jun 20",
    agreed: ["32s Ring Spun Cotton"],
    pending: ["Price approval", "Minimum order quantity"],
    team: ["BK", "EY"],
  },
  {
    id: 4,
    name: "Machinery Import",
    counterparty: "Osaka Machinery",
    flag: "🇯🇵",
    amount: "€1,200,000",
    pct: 61,
    stage: "Contract",
    stageIdx: 2,
    status: "moving",
    waitingOn: "Our turn completed",
    nextAction: "Book inspection team",
    deadline: "Jul 15",
    agreed: ["CNC Machine Model X-900", "FCA Osaka Port", "T/T payment"],
    pending: ["Inspection schedule", "Insurance document"],
    team: ["CK", "MK", "AT"],
  },
];

export function HeroDashboard() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const STAGES = isTR ? STAGES_TR : STAGES_EN;
  const TX = isTR ? TX_TR : TX_EN;

  const [selected, setSelected] = useState(0);
  const tx = TX[selected];

  const portfolioTotal = isTR ? "€2.5M" : "€2.5M";
  const activeLabel = isTR ? "aktif işlem" : "active deals";
  const agreedLabel = isTR ? "Onaylananlar" : "Agreed";
  const pendingLabel = isTR ? "Bekleyenler" : "Pending";
  const waitingLabel = isTR ? "Sıra Kimde" : "Who's Waiting";
  const nextLabel = isTR ? "Sıradaki Adım" : "Next Action";
  const responsibleLabel = isTR ? "Sorumlular" : "Responsible";
  const portfolioLabel = isTR ? "Portföy" : "Portfolio";
  const statusLabels: Record<TxStatus, string> = isTR
    ? { moving: "İlerliyor", blocked: "Beklemede", waiting: "Karşı Taraf" }
    : { moving: "Moving", blocked: "Blocked", waiting: "Waiting On" };

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_16px_64px_rgb(20_19_16/0.12)]">

      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-3 flex-1 rounded border border-ortaq-border bg-white px-3 py-0.5 text-[0.5625rem] font-mono text-ortaq-ink-soft">
          app.ortaq.biz / operations
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-ortaq-trust/10 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ortaq-trust opacity-50" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
          </span>
          <span className="text-[0.5rem] font-bold text-ortaq-trust">{isTR ? "Canlı" : "Live"}</span>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">

        {/* LEFT — transaction list */}
        <div className="border-b border-ortaq-border sm:border-b-0 sm:border-r">

          {/* Portfolio summary */}
          <div className="border-b border-ortaq-border bg-[#fafaf9] px-4 py-3">
            <p className="text-[0.4375rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
              {portfolioLabel}
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-[1.375rem] font-bold tabular-nums text-ortaq-ink">{portfolioTotal}</span>
              <span className="text-[0.5rem] text-ortaq-ink-soft">{TX.length} {activeLabel}</span>
            </div>
            <div className="mt-2 flex gap-3">
              {([
                { s: "moving" as TxStatus, count: TX.filter(t => t.status === "moving").length, c: "text-ortaq-trust" },
                { s: "blocked" as TxStatus, count: TX.filter(t => t.status === "blocked").length, c: "text-red-500" },
                { s: "waiting" as TxStatus, count: TX.filter(t => t.status === "waiting").length, c: "text-amber-500" },
              ]).filter(s => s.count > 0).map(s => (
                <div key={s.s} className="flex items-baseline gap-0.5">
                  <span className={cn("text-[0.75rem] font-bold tabular-nums", s.c)}>{s.count}</span>
                  <span className="text-[0.4375rem] text-ortaq-ink-soft">{statusLabels[s.s]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction rows */}
          <div className="divide-y divide-ortaq-border">
            {TX.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelected(i)}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors",
                  selected === i
                    ? "bg-ortaq-trust/5 border-l-2 border-ortaq-trust"
                    : "hover:bg-ortaq-bg border-l-2 border-transparent",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <StatusDot status={t.status} />
                      <p className={cn(
                        "text-[0.5625rem] font-semibold leading-tight",
                        selected === i ? "text-ortaq-ink" : "text-ortaq-ink-muted",
                      )}>
                        {t.name}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[0.4375rem] text-ortaq-ink-soft">
                      {t.flag} {t.counterparty}
                    </p>
                  </div>
                  <span className={cn(
                    "shrink-0 text-[0.5rem] font-bold tabular-nums",
                    selected === i ? "text-ortaq-trust" : "text-ortaq-ink-soft",
                  )}>
                    {t.amount}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 overflow-hidden rounded-full bg-ortaq-border">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        t.status === "blocked" ? "bg-red-400" : "bg-ortaq-trust",
                      )}
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                  <span className="text-[0.4375rem] tabular-nums text-ortaq-ink-soft">{t.pct}%</span>
                  <span className={cn(
                    "rounded-full px-1.5 py-px text-[0.375rem] font-bold",
                    t.status === "blocked"
                      ? "bg-red-100 text-red-600"
                      : t.status === "waiting"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-ortaq-trust/10 text-ortaq-trust",
                  )}>
                    {t.stage}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — selected transaction detail */}
        <div className="flex flex-col">

          {/* Transaction header */}
          <div className="flex items-start justify-between gap-4 border-b border-ortaq-border bg-[#fafaf9] px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusDot status={tx.status} size="lg" />
                <h3 className="text-[0.875rem] font-bold text-ortaq-ink">{tx.name}</h3>
              </div>
              <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft">{tx.flag} {tx.counterparty}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[1.125rem] font-bold tabular-nums text-ortaq-ink">{tx.amount}</p>
              <span className={cn(
                "inline-block rounded-full px-2 py-0.5 text-[0.4375rem] font-bold mt-0.5",
                tx.status === "blocked" ? "bg-red-100 text-red-600" :
                tx.status === "waiting" ? "bg-amber-100 text-amber-600" :
                "bg-ortaq-trust/10 text-ortaq-trust",
              )}>
                {statusLabels[tx.status]}
              </span>
            </div>
          </div>

          {/* Milestone track */}
          <div className="border-b border-ortaq-border px-5 py-3">
            <div className="flex items-center gap-0">
              {STAGES.map((s, i) => {
                const done = i < tx.stageIdx;
                const active = i === tx.stageIdx;
                const last = i === STAGES.length - 1;
                return (
                  <div key={s} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.4rem] font-bold border-2",
                        done
                          ? "border-ortaq-trust bg-ortaq-trust text-white"
                          : active
                          ? "border-ortaq-trust bg-white text-ortaq-trust animate-pulse"
                          : "border-ortaq-border bg-white text-ortaq-ink-soft",
                      )}>
                        {done ? "✓" : i + 1}
                      </div>
                      <p className={cn(
                        "mt-0.5 text-center text-[0.375rem] leading-tight font-medium",
                        done ? "text-ortaq-trust" :
                        active ? "text-ortaq-ink font-bold" :
                        "text-ortaq-ink-soft",
                      )}>
                        {s}
                      </p>
                    </div>
                    {!last && (
                      <div className={cn(
                        "mx-0.5 h-px flex-1",
                        done ? "bg-ortaq-trust" : "bg-ortaq-border",
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Three columns: agreed / pending / next */}
          <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 divide-y sm:divide-y-0 sm:divide-x divide-ortaq-border">

            {/* Agreed */}
            <div className="p-4">
              <p className="mb-2 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                ✓ {agreedLabel}
              </p>
              <div className="space-y-1.5">
                {tx.agreed.map((item) => (
                  <div key={item} className="flex items-start gap-1.5">
                    <svg className="mt-px h-3 w-3 shrink-0 text-ortaq-trust" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                    <span className="text-[0.5rem] leading-snug text-ortaq-ink-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who's waiting + next action */}
            <div className="p-4 space-y-3">
              <div>
                <p className="mb-1.5 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                  {waitingLabel}
                </p>
                <div className={cn(
                  "flex items-start gap-1.5 rounded-lg border px-2.5 py-2",
                  tx.status === "blocked"
                    ? "border-red-200 bg-red-50"
                    : tx.status === "waiting"
                    ? "border-amber-200 bg-amber-50"
                    : "border-ortaq-trust/20 bg-ortaq-trust/5",
                )}>
                  <StatusDot status={tx.status} />
                  <p className="text-[0.5rem] font-medium leading-snug text-ortaq-ink">
                    {tx.waitingOn}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                  {pendingLabel}
                </p>
                <div className="space-y-1">
                  {tx.pending.map((p) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-ortaq-border-strong shrink-0" />
                      <span className="text-[0.5rem] text-ortaq-ink-muted">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next action */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <p className="mb-1.5 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                  {nextLabel}
                </p>
                <div className="rounded-lg border border-ortaq-trust/25 bg-ortaq-trust/5 p-2.5">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ortaq-trust opacity-40" />
                      <span className="relative h-2 w-2 rounded-full bg-ortaq-trust" />
                    </span>
                    <span className="text-[0.375rem] font-bold uppercase text-ortaq-trust">
                      {nextLabel}
                    </span>
                  </div>
                  <p className="text-[0.5625rem] font-semibold leading-snug text-ortaq-ink">
                    {tx.nextAction}
                  </p>
                  <span className={cn(
                    "mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold",
                    tx.deadline === "Gecikmiş" || tx.deadline === "Overdue"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600",
                  )}>
                    {tx.deadline}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[0.4375rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                  {responsibleLabel}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {tx.team.map((init) => (
                      <span key={init} className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-ortaq-trust/15 text-[0.375rem] font-bold text-ortaq-trust">
                        {init}
                      </span>
                    ))}
                  </div>
                  <span className="text-[0.4375rem] text-ortaq-ink-soft">
                    {isTR ? "sorumlu" : "assigned"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status, size = "sm" }: { status: TxStatus; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "h-2.5 w-2.5" : "h-1.5 w-1.5";
  return (
    <span className={cn(
      "shrink-0 rounded-full",
      sz,
      status === "blocked" ? "bg-red-500 animate-pulse" :
      status === "waiting" ? "bg-amber-400" :
      "bg-ortaq-trust",
    )} />
  );
}
