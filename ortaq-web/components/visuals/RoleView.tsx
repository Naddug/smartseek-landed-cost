"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * RoleView — Section 5: Who uses ORTAQ and what do they check?
 *
 * Four roles. Four morning check lists.
 * No abstract SaaS language. No "visibility" or "stakeholder".
 * Only real questions real people ask.
 *
 * CEO — which deals are moving, which are stuck
 * Satın Alma / Procurement — document status, approvals
 * Finans / Finance — LC, payment, invoice
 * Operasyon / Operations — SGS, BL, shipment date
 */

interface Role {
  icon: string;
  title: string;
  subtitle: string;
  checks: string[];
  color: string;
}

export function RoleView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const roles: Role[] = isTR ? [
    {
      icon: "👤",
      title: "Genel Müdür / CEO",
      subtitle: "Sabah ilk açtığı ekran",
      checks: [
        "Hangi işlem bekliyor?",
        "Hangi işlem ilerliyor?",
        "Geciken var mı?",
        "Bu hafta ne kapanıyor?",
      ],
      color: "border-ortaq-ink/20 bg-ortaq-ink/[0.03]",
    },
    {
      icon: "📋",
      title: "Satın Alma / Tedarik",
      subtitle: "Sözleşme ve belge takibi",
      checks: [
        "Hangi sözleşme onaylandı?",
        "Hangi belge eksik?",
        "Alıcı son revizyonu onayladı mı?",
        "Proforma fatura gönderildi mi?",
      ],
      color: "border-blue-200 bg-blue-50/50",
    },
    {
      icon: "💳",
      title: "Finans",
      subtitle: "LC, ödeme ve fatura",
      checks: [
        "LC açıldı mı?",
        "Ödeme ne zaman çıkacak?",
        "Commercial Invoice onaylandı mı?",
        "Hangi işlem gecikmiş?",
      ],
      color: "border-emerald-200 bg-emerald-50/50",
    },
    {
      icon: "🚢",
      title: "Operasyon / Lojistik",
      subtitle: "SGS, BL ve sevkiyat",
      checks: [
        "SGS raporu onaylandı mı?",
        "BL kesildi mi?",
        "Gemi kalkış tarihi değişti mi?",
        "Packing list tamam mı?",
      ],
      color: "border-amber-200 bg-amber-50/50",
    },
  ] : [
    {
      icon: "👤",
      title: "CEO / General Manager",
      subtitle: "First screen every morning",
      checks: [
        "Which deal is waiting?",
        "Which deal is moving?",
        "Any delays?",
        "What closes this week?",
      ],
      color: "border-ortaq-ink/20 bg-ortaq-ink/[0.03]",
    },
    {
      icon: "📋",
      title: "Procurement / Purchasing",
      subtitle: "Contract and document tracking",
      checks: [
        "Which contract has been approved?",
        "Which document is missing?",
        "Did the buyer approve the latest revision?",
        "Has the proforma invoice been sent?",
      ],
      color: "border-blue-200 bg-blue-50/50",
    },
    {
      icon: "💳",
      title: "Finance",
      subtitle: "LC, payment and invoice",
      checks: [
        "Has the LC been opened?",
        "When is payment going out?",
        "Has the commercial invoice been approved?",
        "Which deal has a delayed payment?",
      ],
      color: "border-emerald-200 bg-emerald-50/50",
    },
    {
      icon: "🚢",
      title: "Operations / Logistics",
      subtitle: "SGS, BL and shipment",
      checks: [
        "Has the SGS report been approved?",
        "Has the BL been issued?",
        "Has the vessel departure date changed?",
        "Is the packing list complete?",
      ],
      color: "border-amber-200 bg-amber-50/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {roles.map((role, i) => (
        <RoleCard key={i} role={role} isTR={isTR} />
      ))}
    </div>
  );
}

function RoleCard({ role, isTR }: { role: Role; isTR: boolean }) {
  return (
    <div className={cn("rounded-2xl border p-5", role.color)}>
      <div className="mb-4 flex items-start gap-3">
        <span className="text-2xl leading-none">{role.icon}</span>
        <div>
          <p className="text-[0.875rem] font-bold text-ortaq-ink">{role.title}</p>
          <p className="text-[0.5375rem] text-ortaq-ink-soft">{role.subtitle}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {role.checks.map((check, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust" />
            <span className="text-[0.5625rem] font-medium text-ortaq-ink">{check}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-ortaq-border/50 pt-3">
        <p className="text-[0.4375rem] font-semibold text-ortaq-trust">
          {isTR ? "ORTAQ'ta bu cevaplar hazır." : "In ORTAQ, these answers are ready."}
        </p>
      </div>
    </div>
  );
}
