"use client";

import { cn } from "@/lib/cn";

/**
 * The "before" state — shows commercial information scattered across
 * 6 separate tools, each with its own fragment of the deal.
 *
 * No arrows. No ERP diagrams. Just 6 silos, each visually confused.
 * The chaos is communicated through the combination of isolation and
 * the specific failure each tool embodies.
 */

type Silo = {
  tool: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  bg: string;
  fragment: string;
  problem: string;
  badge: string;
};

const SILOS: Silo[] = [
  {
    tool: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#25D366]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
      </svg>
    ),
    color: "text-[#25D366]",
    border: "border-[#25D366]/30",
    bg: "bg-[#25D366]/5",
    fragment: "\"Fiyatı onayladım ama revizyon için bekliyorum\"",
    problem: "47 okunmamış · 6 grup",
    badge: "bg-[#25D366]/15 text-[#128C7E]",
  },
  {
    tool: "E-posta",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 text-blue-500">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path strokeLinecap="round" d="M2 7l10 7 10-7" />
      </svg>
    ),
    color: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50/60",
    fragment: "Re: Re: Re: Fwd: Contract_DRAFT_v2_FINAL.pdf",
    problem: "6 ayrı konu · 23 mesaj",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    tool: "Excel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-green-600">
        <path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.92Q7.58 20.75 7.33 20.5 7.08 20.26 7.08 19.92V17H2.83Q2.5 17 2.25 16.75 2 16.5 2 16.17V7.83Q2 7.5 2.25 7.25 2.5 7 2.83 7H7.08V4.08Q7.08 3.74 7.33 3.5 7.58 3.25 7.92 3.25M7.08 13.06L8.23 15.28H9.9L8.28 12.16 9.8 9.03H8.2L7.14 11.17 6.1 9.03H4.5L6 12.09 4.34 15.28H5.97M13.88 19.5V17H9.5V19.5M13.88 15.75V12.63H9.5V15.75M13.88 11.38V8.25H9.5V11.38M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38Z"/>
      </svg>
    ),
    color: "text-green-700",
    border: "border-green-200",
    bg: "bg-green-50/60",
    fragment: "Fiyat_Teklif_v_FINAL_2_son_GERCEK.xlsx",
    problem: "4 açık sürüm · kim güncelledi?",
    badge: "bg-green-100 text-green-700",
  },
  {
    tool: "PDF Belgeler",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h8l4 4v14H5V3z" />
        <path strokeLinecap="round" d="M15 3v4h4" />
        <path strokeLinecap="round" d="M8 13h4M8 10h8M8 16h2" />
      </svg>
    ),
    color: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50/60",
    fragment: "LOI_v1, LOI_v2, SPA_taslak, SPA_revize…",
    problem: "12 belge · hangisi imzalı?",
    badge: "bg-red-100 text-red-600",
  },
  {
    tool: "Telefon",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 text-violet-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    color: "text-violet-600",
    border: "border-violet-200",
    bg: "bg-violet-50/60",
    fragment: "Muayene tarihi için arandı — kayıt yok",
    problem: "Hiç kayıt yok",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    tool: "Dahili Takım",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 text-ortaq-ink-soft">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "text-ortaq-ink-soft",
    border: "border-ortaq-border",
    bg: "bg-ortaq-bg",
    fragment: "\"Finans onayladı mı? Slack'te sorduk\"",
    problem: "Bağlam yok · ayrı sistem",
    badge: "bg-ortaq-bg text-ortaq-ink-soft border border-ortaq-border",
  },
];

export function FragmentationGrid() {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {SILOS.map((s) => (
        <div
          key={s.tool}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4",
            s.bg, s.border,
          )}
        >
          {/* Tool header */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {s.icon}
              <p className={cn("text-[0.75rem] font-bold", s.color)}>{s.tool}</p>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-[0.5rem] font-semibold", s.badge)}>
              {s.problem}
            </span>
          </div>

          {/* Fragment */}
          <p className="text-[0.6875rem] italic leading-snug text-ortaq-ink-muted">
            &ldquo;{s.fragment}&rdquo;
          </p>

          {/* Unknown status indicator */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ortaq-accent/60" />
            <p className="text-[0.5rem] text-ortaq-accent">Genel durumu: bilinmiyor</p>
          </div>
        </div>
      ))}
    </div>
  );
}
