"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * DayInLife — Section 2: "Bir gününüz böyle geçiyor mu?"
 *
 * Three situations every exporter recognises immediately.
 * Left side: the question, the search, no answer.
 * Right side: ORTAQ — the answer already on screen.
 *
 * Design rule: the LEFT must feel uncomfortable.
 *              the RIGHT must feel like relief.
 * No explanations. Only scenes.
 */

interface Situation {
  question: string;
  chaosLines: { who: string; text: string; app?: string }[];
  chaosCaption: string;
  ortaqAnswer: string;
  ortaqDetail: string;
  ortaqTag: string;
  tagColor: "amber" | "emerald" | "red";
}

export function DayInLife() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const situations: Situation[] = isTR ? [
    {
      question: '"Son sözleşme hangisi?"',
      chaosLines: [
        { who: "Satış", text: "SPA_v12_final_FINAL.pdf dedim ama v11 de var...", app: "Outlook" },
        { who: "Ops", text: "Hangi versiyonu imzaladık? PDF'im farklı", app: "WhatsApp" },
        { who: "Hukuk", text: "Bende v12 var ama BestBuild v10 diyor?!", app: "Email" },
        { who: "Ali B.", text: "Bekleyin araştırıyorum", app: "WhatsApp" },
      ],
      chaosCaption: "22 dakika · Cevap yok",
      ortaqAnswer: "SPA v12 imzalı sözleşme",
      ortaqDetail: "Her iki taraf onaylı · 15 Haz. 10:35 · BestBuild GmbH",
      ortaqTag: "Aktif Sürüm",
      tagColor: "emerald",
    },
    {
      question: '"SGS geldi mi?"',
      chaosLines: [
        { who: "CEO", text: "SGS geldi mi? Gemiye yetişmemiz lazım", app: "WhatsApp" },
        { who: "Ops", text: "Bilmiyorum, Ben Kaya'ya soruyorum", app: "WhatsApp" },
        { who: "Ben K.", text: "SGS ofisi bugün kapalı. Cevap yok", app: "Email" },
        { who: "CEO", text: "Peki BestBuild ne diyor?", app: "WhatsApp" },
      ],
      chaosCaption: "Kimse bilmiyor · BL kesilemiyor",
      ortaqAnswer: "SGS bekleniyor · BestBuild'de",
      ortaqDetail: "Son güncelleme: dün · Pazartesiye söz verdiler · Yılmaz Ç. takipte",
      ortaqTag: "Karşı Taraf",
      tagColor: "amber",
    },
    {
      question: '"Ödeme çıktı mı?"',
      chaosLines: [
        { who: "Finans", text: "LC numarası nerede? Banka soruyor", app: "Email" },
        { who: "Ops", text: "Haber vermişler miydi? Bilmiyorum", app: "WhatsApp" },
        { who: "Satış", text: "Müşteri onayladı demişti ama yazışma kayıp", app: "WhatsApp" },
        { who: "Mgr", text: "Banka kapanmadan çözün lütfen", app: "WhatsApp" },
      ],
      chaosCaption: "3 kişi farklı yerde arıyor",
      ortaqAnswer: "LC hazırlanıyor · HSBC Dubai",
      ortaqDetail: "BL ve SGS onayı bekleniyor · Tahmini: 26 Haz. · Finans ekibi görüyor",
      ortaqTag: "İşlemde",
      tagColor: "amber",
    },
  ] : [
    {
      question: '"Which contract is the latest?"',
      chaosLines: [
        { who: "Sales", text: "I said SPA_v12_final_FINAL.pdf but v11 also exists...", app: "Outlook" },
        { who: "Ops", text: "Which version did we sign? My PDF looks different", app: "WhatsApp" },
        { who: "Legal", text: "I have v12 but BestBuild is referencing v10?!", app: "Email" },
        { who: "Ali B.", text: "Hold on, I am searching", app: "WhatsApp" },
      ],
      chaosCaption: "22 minutes · No answer",
      ortaqAnswer: "SPA v12 — signed contract",
      ortaqDetail: "Approved by both parties · Jun 15, 10:35 · BestBuild GmbH",
      ortaqTag: "Active Version",
      tagColor: "emerald",
    },
    {
      question: '"Has SGS arrived?"',
      chaosLines: [
        { who: "CEO", text: "Has SGS arrived? We need to make the vessel", app: "WhatsApp" },
        { who: "Ops", text: "I don't know, asking Ben Kaya now", app: "WhatsApp" },
        { who: "Ben K.", text: "SGS office is closed today. No response", app: "Email" },
        { who: "CEO", text: "What does BestBuild say?", app: "WhatsApp" },
      ],
      chaosCaption: "Nobody knows · BL cannot be issued",
      ortaqAnswer: "SGS pending · With BestBuild",
      ortaqDetail: "Last update: yesterday · Promised by Monday · Yılmaz Ç. following up",
      ortaqTag: "Counterparty",
      tagColor: "amber",
    },
    {
      question: '"Has payment been released?"',
      chaosLines: [
        { who: "Finance", text: "Where is the LC number? Bank is asking", app: "Email" },
        { who: "Ops", text: "Did they notify us? I don't know", app: "WhatsApp" },
        { who: "Sales", text: "Client said they approved but conversation is lost", app: "WhatsApp" },
        { who: "Mgr", text: "Sort it before the bank closes please", app: "WhatsApp" },
      ],
      chaosCaption: "3 people searching in different places",
      ortaqAnswer: "LC being prepared · HSBC Dubai",
      ortaqDetail: "Awaiting BL and SGS approval · Estimated Jun 26 · Finance team can see",
      ortaqTag: "In Progress",
      tagColor: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {situations.map((s, i) => (
        <SituationCard key={i} s={s} isTR={isTR} index={i} />
      ))}
    </div>
  );
}

const appColors: Record<string, { bg: string; text: string }> = {
  WhatsApp: { bg: "bg-[#075E54]", text: "text-white" },
  WeChat:   { bg: "bg-[#07C160]", text: "text-white" },
  Outlook:  { bg: "bg-[#0078D4]", text: "text-white" },
  Email:    { bg: "bg-gray-600",  text: "text-white" },
};

const tagStyles = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber:   "bg-amber-100   text-amber-700",
  red:     "bg-red-100     text-red-700",
} as const;

function SituationCard({ s, isTR, index }: { s: Situation; isTR: boolean; index: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-sm">
      {/* Question bar — the daily pain starts here */}
      <div className="border-b border-ortaq-border bg-ortaq-surface px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] font-bold tabular-nums text-ortaq-ink-soft">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-[1.0625rem] font-bold italic text-ortaq-ink">
            {s.question}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* LEFT — chaos */}
        <div className="border-b border-ortaq-border bg-[#FDFAF9] sm:border-b-0 sm:border-r">
          <div className="space-y-2 p-4">
            {s.chaosLines.map((line, i) => (
              <ChatLine key={i} who={line.who} text={line.text} app={line.app} />
            ))}
          </div>
          <div className="border-t border-red-100 bg-red-50 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <p className="text-[0.5625rem] font-bold text-red-600">{s.chaosCaption}</p>
            </div>
          </div>
        </div>

        {/* RIGHT — ORTAQ answer */}
        <div className="flex flex-col justify-center bg-white">
          <div className="p-5">
            {/* ORTAQ label */}
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">ORTAQ</span>
            </div>
            {/* The answer */}
            <p className="text-[1rem] font-bold leading-snug text-ortaq-ink">{s.ortaqAnswer}</p>
            <p className="mt-1 text-[0.5625rem] leading-relaxed text-ortaq-ink-soft">{s.ortaqDetail}</p>
            <div className="mt-3">
              <span className={cn("rounded-full px-2.5 py-1 text-[0.5rem] font-bold", tagStyles[s.tagColor])}>
                {s.ortaqTag}
              </span>
            </div>
          </div>
          {/* Time saved */}
          <div className="border-t border-ortaq-border/50 bg-ortaq-trust/[0.03] px-5 py-2.5">
            <p className="text-[0.5rem] font-medium text-ortaq-trust">
              {isTR ? "Cevap ekranda. Aramak yok." : "Answer on screen. No searching."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatLine({ who, text, app }: { who: string; text: string; app?: string }) {
  const ac = app ? (appColors[app] ?? { bg: "bg-gray-500", text: "text-white" }) : { bg: "bg-gray-200", text: "text-gray-600" };
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-ink text-[0.35rem] font-bold text-ortaq-cream">
        {who.slice(0, 2).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[0.45rem] font-bold text-ortaq-ink">{who}</span>
          {app && (
            <span className={cn("rounded px-1 py-px text-[0.35rem] font-bold", ac.bg, ac.text)}>{app}</span>
          )}
        </div>
        <p className="text-[0.5625rem] leading-snug text-ortaq-ink-soft">{text}</p>
      </div>
    </div>
  );
}
