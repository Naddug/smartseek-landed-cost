"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * RiskBoard — Section 5: "Bugün müdahale etmeniz gereken işlemler"
 *
 * This is NOT an analytics dashboard.
 * This is NOT a portfolio by value.
 *
 * This is what a CEO, export director or operations manager sees
 * when they open ORTAQ in the morning — sorted by operational risk,
 * not by deal size.
 *
 * Every row tells them:
 *   - Which deal needs attention
 *   - What exactly is wrong or pending
 *   - Who is responsible
 *   - How urgent
 *
 * Design: rows sorted by urgency.
 *   Red = blocked / no response.
 *   Amber = waiting on a specific party.
 *   Green = moving.
 */

interface Deal {
  name: string;
  counterparty: string;
  stage: string;
  risk: string;
  riskType: "blocked" | "waiting" | "moving";
  responsible: string;
  days: string;
  amount: string;
}

export function RiskBoard() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const deals: Deal[] = isTR ? [
    {
      name: "Elektrik Kablosu",
      counterparty: "Siam Electric · Bangkok",
      stage: "Sözleşme",
      risk: "5 gündür cevap yok",
      riskType: "blocked",
      responsible: "Karşı taraf",
      days: "5G",
      amount: "€290K",
    },
    {
      name: "Ayçiçek Yağı",
      counterparty: "Al Noor Trading · Dubai",
      stage: "LC",
      risk: "LC eksik · Akreditif bekleniyor",
      riskType: "blocked",
      responsible: "Alıcı · HSBC",
      days: "3G",
      amount: "€620K",
    },
    {
      name: "Çelik Tedariki",
      counterparty: "BestBuild GmbH · Hamburg",
      stage: "SGS",
      risk: "SGS bekleniyor",
      riskType: "waiting",
      responsible: "BestBuild · Pazartesi",
      days: "1G",
      amount: "€840K",
    },
    {
      name: "Endüstri Makinesi",
      counterparty: "Yamato Corp · Osaka",
      stage: "Sözleşme",
      risk: "İmza bekleniyor",
      riskType: "waiting",
      responsible: "Hukuk · Yamato",
      days: "2G",
      amount: "€1.2M",
    },
    {
      name: "Ham Kahve",
      counterparty: "Green Origin · Jakarta",
      stage: "Muayene",
      risk: "Numune bekleniyor",
      riskType: "waiting",
      responsible: "Lojistik ekibi",
      days: "4G",
      amount: "€185K",
    },
    {
      name: "Pamuk İpliği",
      counterparty: "Tex Asia · Ho Chi Minh",
      stage: "Sevkiyat",
      risk: "BL yolda · Zamanında",
      riskType: "moving",
      responsible: "Armatör",
      days: "",
      amount: "€320K",
    },
  ] : [
    {
      name: "Electric Cable",
      counterparty: "Siam Electric · Bangkok",
      stage: "Contract",
      risk: "No response for 5 days",
      riskType: "blocked",
      responsible: "Counterparty",
      days: "5D",
      amount: "€290K",
    },
    {
      name: "Sunflower Oil",
      counterparty: "Al Noor Trading · Dubai",
      stage: "LC",
      risk: "LC missing · LC pending",
      riskType: "blocked",
      responsible: "Buyer · HSBC",
      days: "3D",
      amount: "€620K",
    },
    {
      name: "Steel Supply",
      counterparty: "BestBuild GmbH · Hamburg",
      stage: "SGS",
      risk: "SGS pending",
      riskType: "waiting",
      responsible: "BestBuild · Monday",
      days: "1D",
      amount: "€840K",
    },
    {
      name: "Industrial Machine",
      counterparty: "Yamato Corp · Osaka",
      stage: "Contract",
      risk: "Awaiting signature",
      riskType: "waiting",
      responsible: "Legal · Yamato",
      days: "2D",
      amount: "€1.2M",
    },
    {
      name: "Raw Coffee",
      counterparty: "Green Origin · Jakarta",
      stage: "Inspection",
      risk: "Sample pending",
      riskType: "waiting",
      responsible: "Logistics team",
      days: "4D",
      amount: "€185K",
    },
    {
      name: "Cotton Yarn",
      counterparty: "Tex Asia · Ho Chi Minh",
      stage: "Shipment",
      risk: "BL in transit · On time",
      riskType: "moving",
      responsible: "Carrier",
      days: "",
      amount: "€320K",
    },
  ];

  const riskStyle = {
    blocked: {
      row: "border-red-200 bg-red-50/60",
      badge: "bg-red-100 text-red-700",
      dot: "bg-red-500 animate-pulse",
      responsible: "text-red-600",
    },
    waiting: {
      row: "border-amber-200 bg-amber-50/40",
      badge: "bg-amber-100 text-amber-700",
      dot: "bg-amber-500",
      responsible: "text-amber-600",
    },
    moving: {
      row: "border-emerald-200 bg-emerald-50/30",
      badge: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
      responsible: "text-ortaq-ink-soft",
    },
  } as const;

  const legend = isTR
    ? [
        { type: "blocked", label: "Engel var · Acil" },
        { type: "waiting", label: "Bekleniyor" },
        { type: "moving",  label: "İlerliyor" },
      ]
    : [
        { type: "blocked", label: "Blocked · Urgent" },
        { type: "waiting", label: "Waiting" },
        { type: "moving",  label: "Moving" },
      ];

  return (
    <div>
      {/* Legend + header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.5625rem] font-semibold text-ortaq-ink-soft">
          {isTR ? `${deals.length} aktif işlem · Riske göre sıralandı` : `${deals.length} active deals · Sorted by risk`}
        </p>
        <div className="flex items-center gap-3">
          {legend.map((l) => (
            <div key={l.type} className="flex items-center gap-1">
              <span className={cn("h-2 w-2 rounded-full", riskStyle[l.type as keyof typeof riskStyle].dot)} />
              <span className="text-[0.4375rem] text-ortaq-ink-soft">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deal rows */}
      <div className="space-y-2">
        {deals.map((deal, i) => {
          const rs = riskStyle[deal.riskType];
          return (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden rounded-xl border px-4 py-3",
                rs.row,
              )}
            >
              {/* Left: status dot + deal info */}
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", rs.dot)} />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.625rem] font-bold text-ortaq-ink">{deal.name}</p>
                  <span className="text-[0.5rem] text-ortaq-ink-soft">{deal.counterparty}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-[0.375rem] font-semibold text-ortaq-ink">
                    {deal.stage}
                  </span>
                  <span className={cn("text-[0.5rem] font-bold", rs.badge.includes("red") ? "text-red-700" : rs.badge.includes("amber") ? "text-amber-700" : "text-emerald-700")}>
                    {deal.risk}
                  </span>
                  <span className={cn("text-[0.4375rem] font-medium", rs.responsible)}>
                    → {deal.responsible}
                  </span>
                </div>
              </div>

              {/* Right: amount + urgency */}
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-[0.5rem] font-bold text-ortaq-ink">{deal.amount}</span>
                {deal.days ? (
                  <span className={cn("rounded-full px-2 py-0.5 text-[0.375rem] font-bold", rs.badge)}>
                    {deal.days}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.375rem] font-bold text-emerald-700">
                    {isTR ? "İyi" : "OK"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Morning context note */}
      <div className="mt-4 rounded-xl border border-ortaq-border bg-ortaq-surface px-5 py-3.5">
        <p className="text-[0.5625rem] text-ortaq-ink-soft">
          {isTR
            ? "Bu tablo her sabah değişir. Bugün kırmızı olanlar dünden bekliyor. Müdahale edin."
            : "This board changes every morning. Red rows have been waiting since yesterday. Act now."}
        </p>
      </div>
    </div>
  );
}
