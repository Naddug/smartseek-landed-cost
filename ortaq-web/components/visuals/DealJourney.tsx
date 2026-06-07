"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * DealJourney — Section 3: "Bir işlemin tüm hikayesi"
 *
 * One deal — Çelik Tedariki · Alman alıcı · €840.000
 * shown from first offer to payment.
 *
 * At each stage: real document names, not generic milestones.
 * SPA, SGS, BL, Packing List, Commercial Invoice, LC, LC Amendment.
 *
 * Design: horizontal scrolling timeline on desktop.
 *         vertical stack on mobile.
 * Active stage (SGS/Inspection) is highlighted in amber.
 * Completed stages are green. Future stages are gray.
 */
export function DealJourney() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const stages = isTR ? [
    {
      key: "teklif",
      name: "Teklif",
      status: "done" as const,
      date: "1 Haz.",
      docs: [
        { icon: "📄", name: "LOI", status: "Gönderildi" },
        { icon: "📄", name: "SCO", status: "Yanıtlandı" },
        { icon: "📄", name: "FCO", status: "Onaylandı" },
      ],
    },
    {
      key: "muzakere",
      name: "Müzakere",
      status: "done" as const,
      date: "5 Haz.",
      docs: [
        { icon: "📝", name: "Fiyat Revizyonu v1", status: "Reddedildi" },
        { icon: "📝", name: "Fiyat Revizyonu v2", status: "Kabul edildi" },
      ],
    },
    {
      key: "sozlesme",
      name: "Sözleşme",
      status: "done" as const,
      date: "10 Haz.",
      docs: [
        { icon: "📄", name: "SPA v10", status: "Eski sürüm" },
        { icon: "📄", name: "SPA v11", status: "Eski sürüm" },
        { icon: "✅", name: "SPA v12", status: "İmzalı" },
      ],
    },
    {
      key: "muayene",
      name: "Muayene (SGS)",
      status: "active" as const,
      date: "Bekleniyor",
      docs: [
        { icon: "🔬", name: "SGS Taslak v1", status: "ONAYSIZ" },
        { icon: "⏳", name: "SGS Final", status: "Bekleniyor" },
      ],
    },
    {
      key: "sevkiyat",
      name: "Sevkiyat",
      status: "future" as const,
      date: "28 Haz.",
      docs: [
        { icon: "🚢", name: "BL Taslak v3", status: "Taslak" },
        { icon: "📦", name: "Packing List", status: "Hazır" },
        { icon: "🧾", name: "Commercial Invoice", status: "Hazır" },
      ],
    },
    {
      key: "odeme",
      name: "Ödeme",
      status: "future" as const,
      date: "Jul.",
      docs: [
        { icon: "💰", name: "LC Taslak", status: "Hazırlanıyor" },
        { icon: "📝", name: "LC Amendment", status: "Bekleniyor" },
      ],
    },
  ] : [
    {
      key: "offer",
      name: "Offer",
      status: "done" as const,
      date: "Jun 1",
      docs: [
        { icon: "📄", name: "LOI", status: "Sent" },
        { icon: "📄", name: "SCO", status: "Responded" },
        { icon: "📄", name: "FCO", status: "Approved" },
      ],
    },
    {
      key: "negotiation",
      name: "Negotiation",
      status: "done" as const,
      date: "Jun 5",
      docs: [
        { icon: "📝", name: "Price Revision v1", status: "Rejected" },
        { icon: "📝", name: "Price Revision v2", status: "Accepted" },
      ],
    },
    {
      key: "contract",
      name: "Contract",
      status: "done" as const,
      date: "Jun 10",
      docs: [
        { icon: "📄", name: "SPA v10", status: "Superseded" },
        { icon: "📄", name: "SPA v11", status: "Superseded" },
        { icon: "✅", name: "SPA v12", status: "Signed" },
      ],
    },
    {
      key: "inspection",
      name: "Inspection (SGS)",
      status: "active" as const,
      date: "Pending",
      docs: [
        { icon: "🔬", name: "SGS Draft v1", status: "UNAPPROVED" },
        { icon: "⏳", name: "SGS Final", status: "Pending" },
      ],
    },
    {
      key: "shipment",
      name: "Shipment",
      status: "future" as const,
      date: "Jun 28",
      docs: [
        { icon: "🚢", name: "BL Draft v3", status: "Draft" },
        { icon: "📦", name: "Packing List", status: "Ready" },
        { icon: "🧾", name: "Commercial Invoice", status: "Ready" },
      ],
    },
    {
      key: "payment",
      name: "Payment",
      status: "future" as const,
      date: "Jul",
      docs: [
        { icon: "💰", name: "LC Draft", status: "Being prepared" },
        { icon: "📝", name: "LC Amendment", status: "Pending" },
      ],
    },
  ];

  return (
    <div>
      {/* Deal identity banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-ortaq-border bg-ortaq-surface px-5 py-3.5">
        <div>
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
            {isTR ? "Tek İşlem" : "Single Deal"}
          </p>
          <p className="mt-0.5 text-[0.9375rem] font-bold text-ortaq-ink">
            {isTR ? "Endüstri Makinesi · Yamato Corp · Osaka" : "Industrial Machine · Yamato Corp · Osaka"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
            {isTR ? "İşlem Tutarı" : "Deal Value"}
          </p>
          <p className="mt-0.5 text-[0.9375rem] font-bold text-ortaq-trust">€1.200.000</p>
        </div>
      </div>

      {/* Horizontal timeline — scrollable on mobile */}
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[700px] items-start gap-0 lg:min-w-0">
          {stages.map((stage, i) => (
            <div key={stage.key} className="flex flex-1 items-start">
              <StageCard stage={stage} isTR={isTR} />
              {i < stages.length - 1 && (
                <div className="mt-5 flex shrink-0 items-center">
                  <div className={cn(
                    "h-px w-4",
                    stage.status === "done" ? "bg-ortaq-trust" : "bg-ortaq-border",
                  )} />
                  <span className={cn(
                    "text-[0.6rem]",
                    stage.status === "done" ? "text-ortaq-trust" : "text-ortaq-border",
                  )}>►</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current stage callout */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
        <span className="text-[1.25rem]">📍</span>
        <div>
          <p className="text-[0.5625rem] font-bold uppercase tracking-[0.06em] text-amber-700">
            {isTR ? "Şu An Bu Noktadasınız" : "Current Position"}
          </p>
          <p className="mt-0.5 text-[0.875rem] font-bold text-amber-900">
            {isTR ? "Muayene Aşaması · SGS raporu Yamato'dan onay bekliyor" : "Inspection Stage · SGS report awaiting Yamato approval"}
          </p>
          <p className="mt-0.5 text-[0.5rem] text-amber-600">
            {isTR ? "Onay alınınca BL ve sevkiyat başlıyor. Planlanan yükleme: 10 Ağustos · Osaka." : "Once approved, BL and shipment begin. Planned loading: August 10 · Osaka."}
          </p>
        </div>
      </div>
    </div>
  );
}

const stageStyles = {
  done:   {
    header: "bg-ortaq-trust/10 border-ortaq-trust/30",
    dot: "bg-ortaq-trust",
    badge: "bg-ortaq-trust/15 text-ortaq-trust",
    card: "border-ortaq-trust/20",
    docStatus: "text-ortaq-trust",
  },
  active: {
    header: "bg-amber-100/60 border-amber-300",
    dot: "bg-amber-500 animate-pulse",
    badge: "bg-amber-100 text-amber-700",
    card: "border-amber-300 ring-1 ring-amber-200",
    docStatus: "text-amber-600 font-bold",
  },
  future: {
    header: "bg-gray-50 border-gray-200",
    dot: "bg-gray-300",
    badge: "bg-gray-100 text-gray-400",
    card: "border-gray-200 opacity-60",
    docStatus: "text-gray-400",
  },
} as const;

function StageCard({
  stage,
  isTR,
}: {
  stage: { name: string; status: "done" | "active" | "future"; date: string; docs: { icon: string; name: string; status: string }[] };
  isTR: boolean;
}) {
  const s = stageStyles[stage.status];
  return (
    <div className={cn("flex-1 overflow-hidden rounded-xl border", s.card)}>
      <div className={cn("border-b px-3 py-2", s.header)}>
        <div className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", s.dot)} />
          <p className="truncate text-[0.5rem] font-bold text-ortaq-ink">{stage.name}</p>
        </div>
        <span className={cn("mt-1 inline-block rounded-full px-1.5 py-0.5 text-[0.375rem] font-bold", s.badge)}>
          {stage.date}
        </span>
      </div>
      <div className="space-y-1.5 bg-white p-2.5">
        {stage.docs.map((doc) => (
          <div key={doc.name} className="flex items-start gap-1">
            <span className="text-[0.625rem] shrink-0">{doc.icon}</span>
            <div className="min-w-0">
              <p className="truncate text-[0.44rem] font-semibold text-ortaq-ink leading-tight">{doc.name}</p>
              <p className={cn("text-[0.375rem] leading-tight", s.docStatus)}>{doc.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
