"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";

/**
 * PortfolioPreview — Homepage Sprint 1
 *
 * Position: immediately after CounterpartyPreview, before "Son durum ne?" section.
 * Replaces: DealJourney section (moved to /nasil-calisir).
 *
 * Data source: exact deal names, counterparty names, statuses, and dates
 * from the existing RiskBoard component. No new data introduced.
 *
 * Shows 5 of 6 deals. "+1 işlem daha" below.
 * 3-column table: İşlem (2fr) · Sıra Kimde ↓ (1fr) · Kritik Tarih (1fr)
 */

interface Deal {
  name: string;
  counterparty: string;
  statusNote: string;
  amount: string;
  siraType: "alici-blocked" | "banka" | "alici-waiting" | "satici" | "ilerliyor";
  tarih: string;
}

const DEALS_TR: Deal[] = [
  {
    name: "Elektrik Kablosu",
    counterparty: "Siam Electric · Bangkok",
    statusNote: "5 gündür cevap yok",
    amount: "€290K",
    siraType: "alici-blocked",
    tarih: "5G gecikmeli",
  },
  {
    name: "Ayçiçek Yağı",
    counterparty: "Al Noor Trading · Dubai",
    statusNote: "LC eksik, banka işlemde",
    amount: "€620K",
    siraType: "banka",
    tarih: "3G",
  },
  {
    name: "Metal Konsantre",
    counterparty: "Siam Metals · Bangkok",
    statusNote: "Laboratuvar sonucu bekleniyor",
    amount: "€510K",
    siraType: "alici-waiting",
    tarih: "2G",
  },
  {
    name: "Çelik Boru",
    counterparty: "Nordic Steel · Helsinki",
    statusNote: "Ödeme onayı bekleniyor",
    amount: "€480K",
    siraType: "banka",
    tarih: "3G",
  },
  {
    name: "Ham Kahve",
    counterparty: "Green Origin · Jakarta",
    statusNote: "Numune hazırlanıyor",
    amount: "€185K",
    siraType: "satici",
    tarih: "4G",
  },
];

const DEALS_EN: Deal[] = [
  {
    name: "Electric Cable",
    counterparty: "Siam Electric · Bangkok",
    statusNote: "No response for 5 days",
    amount: "€290K",
    siraType: "alici-blocked",
    tarih: "5D overdue",
  },
  {
    name: "Sunflower Oil",
    counterparty: "Al Noor Trading · Dubai",
    statusNote: "LC missing, bank in process",
    amount: "€620K",
    siraType: "banka",
    tarih: "3D",
  },
  {
    name: "Metal Concentrate",
    counterparty: "Siam Metals · Bangkok",
    statusNote: "Lab result pending",
    amount: "€510K",
    siraType: "alici-waiting",
    tarih: "2D",
  },
  {
    name: "Steel Pipe",
    counterparty: "Nordic Steel · Helsinki",
    statusNote: "Payment approval pending",
    amount: "€480K",
    siraType: "banka",
    tarih: "3D",
  },
  {
    name: "Raw Coffee",
    counterparty: "Green Origin · Jakarta",
    statusNote: "Sample being prepared",
    amount: "€185K",
    siraType: "satici",
    tarih: "4D",
  },
];

const siraBadge = (type: Deal["siraType"], isTR: boolean) => {
  switch (type) {
    case "alici-blocked":
      return {
        label: isTR ? "Alıcı ●" : "Buyer ●",
        className: "bg-red-100 text-red-700",
        dotAnimate: true,
      };
    case "banka":
      return {
        label: isTR ? "Banka" : "Bank",
        className: "bg-amber-100 text-amber-700",
        dotAnimate: false,
      };
    case "alici-waiting":
      return {
        label: isTR ? "Alıcı" : "Buyer",
        className: "bg-amber-100 text-amber-700",
        dotAnimate: false,
      };
    case "satici":
      return {
        label: isTR ? "Satıcı" : "Seller",
        className: "bg-emerald-100 text-emerald-700",
        dotAnimate: false,
      };
    case "ilerliyor":
      return {
        label: isTR ? "İlerliyor" : "Moving",
        className: "",
        dotAnimate: false,
      };
  }
};

export function PortfolioPreview() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const deals = isTR ? DEALS_TR : DEALS_EN;

  return (
    <section className="border-b border-ortaq-border bg-white">
      <Container wide>
        <div className="py-14 sm:py-18">

          {/* Heading + stats side by side */}
          <div className="mb-6">
            <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[1.75rem]">
              {isTR ? "Tüm işlemler" : "All operations"}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-ortaq-border bg-white shadow-sm">

            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr] border-b-2 border-ortaq-trust/20 bg-ortaq-surface px-4 py-2.5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
                {isTR ? "İşlem" : "Deal"}
              </p>
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
                {isTR ? "Sıra Kimde ↓" : "Whose Turn ↓"}
              </p>
              <p className="text-right text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-amber-700">
                {isTR ? "Kritik Tarih" : "Critical Date"}
              </p>
            </div>

            {/* Deal rows */}
            <div className="divide-y divide-ortaq-border/50">
              {deals.map((deal) => {
                const badge = siraBadge(deal.siraType, isTR);
                const isBlocked = deal.siraType === "alici-blocked";
                return (
                  <div
                    key={deal.name}
                    className={cn(
                      "grid grid-cols-[2fr_1fr_1fr] items-center gap-3 px-4 py-3",
                      isBlocked ? "border-l-4 border-l-red-500 bg-red-50/60" : "bg-white",
                    )}
                  >
                    {/* Deal info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[0.75rem] font-bold text-ortaq-ink leading-snug truncate">
                          {deal.name}
                        </p>
                        <span className="shrink-0 text-[0.5rem] font-medium text-ortaq-ink-soft/60">
                          {deal.amount}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[0.5rem] text-ortaq-ink-soft/50 truncate">
                        {deal.counterparty}
                      </p>
                      <p className={cn(
                        "mt-1 text-[0.5625rem] font-semibold truncate",
                        isBlocked ? "text-red-600" : "text-ortaq-ink/70",
                      )}>
                        {deal.statusNote}
                      </p>
                    </div>

                    {/* Sıra kimde badge */}
                    <div>
                      {badge.className ? (
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.5625rem] font-bold",
                          badge.className,
                        )}>
                          {badge.dotAnimate && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                          {badge.label}
                        </span>
                      ) : (
                        <span className="text-[0.5625rem] text-ortaq-ink-soft">{badge.label}</span>
                      )}
                    </div>

                    {/* Kritik tarih */}
                    <div className="text-right">
                      <span className={cn(
                        "text-[0.8125rem] font-bold tabular-nums",
                        isBlocked           ? "text-red-600" :
                        deal.siraType === "banka" ? "text-amber-600" :
                        deal.tarih.includes("G gecikmeli") || deal.tarih.includes("overdue") ? "text-red-500" :
                        "text-ortaq-ink/70",
                      )}>
                        {deal.tarih}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <p className="mt-3 text-[0.6875rem] text-ortaq-ink-soft">
            {isTR ? "+ 1 işlem daha" : "+ 1 more deal"}
          </p>

        </div>
      </Container>
    </section>
  );
}
