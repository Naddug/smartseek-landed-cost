"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * DayInLife — Section 2: Two-company conflicts.
 *
 * POSITIONING REWRITE: These are NOT internal team problems.
 * These are company-to-company gaps — where your reality and
 * your counterparty's reality are different for the same deal.
 *
 * Situation 1: "Siz v12 diyorsunuz. BestBuild v10 diyor."
 *   The contract version conflict. Both sides working from different documents.
 *
 * Situation 2: "SGS BestBuild'de mi, yoksa sizde mi?"
 *   Nobody knows which side is responsible. The deal stalls.
 *
 * Situation 3: "BestBuild BL için onay gönderdi mi?"
 *   Cross-company approval lost in email. LC cannot open without it.
 *
 * LEFT: The two-company gap — messages crossing between companies, no answer.
 * RIGHT: The ORTAQ shared record — both sides see the same answer.
 *
 * Design rule: LEFT should feel like a tennis match between two companies.
 *              RIGHT should feel like a shared whiteboard both can read.
 */

interface Situation {
  question: string;
  chaosLines: { who: string; direction: string; text: string; app: string }[];
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
      question: '"Siz v12 diyorsunuz. BestBuild v10 diyor."',
      chaosLines: [
        { who: "Siz",       direction: "→ BestBuild", app: "Email",    text: "SPA_v12_final imzaladınız mı? Bize v10 gönderdiniz." },
        { who: "BestBuild", direction: "→ siz",        app: "Email",    text: "Hayır, bizde v12 var. Neden v10 gönderdiniz?" },
        { who: "Siz",       direction: "→ BestBuild",  app: "Email",    text: "Bekleyin, kontrol ediyorum..." },
        { who: "Hukuk",     direction: "→ iç",         app: "WhatsApp", text: "Hangisi doğru? İmzalı versiyonu bulun acilen." },
      ],
      chaosCaption: "İki şirket aynı işlemi tartışıyor. Hangisi doğru bilinmiyor.",
      ortaqAnswer: "SPA v12 · İki tarafça imzalı",
      ortaqDetail: "BestBuild ve siz aynı versiyonu görüyorsunuz. v10 ve v11 geçersiz olarak işaretlendi.",
      ortaqTag: "Her iki taraf görüyor",
      tagColor: "emerald",
    },
    {
      question: '"SGS BestBuild\'de mi, yoksa sizde mi?"',
      chaosLines: [
        { who: "CEO",       direction: "→ Ops",        app: "WhatsApp", text: "SGS raporu nerede? Gemi 5 gün sonra kalkıyor." },
        { who: "Ops",       direction: "→ BestBuild",  app: "Email",    text: "SGS raporunu onayladınız mı?" },
        { who: "BestBuild", direction: "→ Ops",         app: "Email",    text: "SGS'i biz değil, siz yapacaktınız?" },
        { who: "Ops",       direction: "→ CEO",         app: "WhatsApp", text: "Karşılıklı suçlama var. Kim yapacak belli değil." },
      ],
      chaosCaption: "İki şirket birbirini bekliyor. Sıranın kimde olduğunu bilen yok.",
      ortaqAnswer: "SGS · BestBuild sorumlu",
      ortaqDetail: "Muayene talebi BestBuild'e atandı. Pazartesi günü onay bekleniyor. Yılmaz Ç. takipte.",
      ortaqTag: "Sorumluluk net",
      tagColor: "amber",
    },
    {
      question: '"BestBuild BL onayını gönderdi mi?"',
      chaosLines: [
        { who: "Finans",    direction: "→ Ops",         app: "WhatsApp", text: "LC açmak istiyorum. BL onayı geldi mi?" },
        { who: "Ops",       direction: "→ BestBuild",   app: "Email",    text: "BL taslağını onayladınız mı?" },
        { who: "BestBuild", direction: "→ Ops",          app: "Email",    text: "4 gün önce onayladık. E-postamızı almadınız mı?" },
        { who: "Finans",    direction: "→ Ops",          app: "WhatsApp", text: "E-posta kayıp mı? LC bu hafta çıkamayacak." },
      ],
      chaosCaption: "BestBuild onayladı. Siz görmediniz. LC açılamıyor.",
      ortaqAnswer: "BL Taslak v3 · BestBuild onayladı",
      ortaqDetail: "4 gün önce, 16:22'de. ORTAQ kaydında görünüyor. LC süreci başlayabilir.",
      ortaqTag: "Onay kayıtta",
      tagColor: "emerald",
    },
  ] : [
    {
      question: '"You say v12. BestBuild says v10."',
      chaosLines: [
        { who: "You",       direction: "→ BestBuild", app: "Email",    text: "Did you sign SPA_v12_final? You sent us v10." },
        { who: "BestBuild", direction: "→ you",        app: "Email",    text: "No, we have v12. Why did you send v10?" },
        { who: "You",       direction: "→ BestBuild",  app: "Email",    text: "Wait, I am checking..." },
        { who: "Legal",     direction: "→ internal",   app: "WhatsApp", text: "Which one is correct? Find the signed version urgently." },
      ],
      chaosCaption: "Two companies arguing about the same deal. Nobody knows which is correct.",
      ortaqAnswer: "SPA v12 · Signed by both parties",
      ortaqDetail: "BestBuild and you see the same version. v10 and v11 marked as superseded.",
      ortaqTag: "Both parties see this",
      tagColor: "emerald",
    },
    {
      question: '"Is SGS with BestBuild or with us?"',
      chaosLines: [
        { who: "CEO",       direction: "→ Ops",        app: "WhatsApp", text: "Where is the SGS report? Vessel departs in 5 days." },
        { who: "Ops",       direction: "→ BestBuild",  app: "Email",    text: "Have you approved the SGS report?" },
        { who: "BestBuild", direction: "→ Ops",         app: "Email",    text: "SGS was your responsibility, not ours?" },
        { who: "Ops",       direction: "→ CEO",         app: "WhatsApp", text: "They are blaming us. Not clear whose turn it is." },
      ],
      chaosCaption: "Two companies waiting for each other. Nobody knows whose turn it is.",
      ortaqAnswer: "SGS · BestBuild responsible",
      ortaqDetail: "Inspection request assigned to BestBuild. Approval expected Monday. Yılmaz Ç. following up.",
      ortaqTag: "Responsibility clear",
      tagColor: "amber",
    },
    {
      question: '"Did BestBuild send the BL approval?"',
      chaosLines: [
        { who: "Finance",   direction: "→ Ops",         app: "WhatsApp", text: "I want to open the LC. Has BL approval arrived?" },
        { who: "Ops",       direction: "→ BestBuild",   app: "Email",    text: "Did you approve the BL draft?" },
        { who: "BestBuild", direction: "→ Ops",          app: "Email",    text: "We approved 4 days ago. Did you not receive our email?" },
        { who: "Finance",   direction: "→ Ops",          app: "WhatsApp", text: "Email is lost? LC cannot go out this week." },
      ],
      chaosCaption: "BestBuild approved. You did not see it. LC cannot open.",
      ortaqAnswer: "BL Draft v3 · Approved by BestBuild",
      ortaqDetail: "4 days ago, at 16:22. Visible in ORTAQ record. LC process can begin.",
      ortaqTag: "Approval on record",
      tagColor: "emerald",
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

/* ── App color map ────────────────────────────────────────────────────────── */

const appColors: Record<string, { bg: string; text: string }> = {
  WhatsApp: { bg: "bg-[#075E54]", text: "text-white" },
  WeChat:   { bg: "bg-[#07C160]", text: "text-white" },
  Outlook:  { bg: "bg-[#0078D4]", text: "text-white" },
  Email:    { bg: "bg-[#0078D4]", text: "text-white" },
};

const tagStyles = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber:   "bg-amber-100   text-amber-700",
  red:     "bg-red-100     text-red-700",
} as const;

function SituationCard({ s, isTR, index }: { s: Situation; isTR: boolean; index: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-sm">

      {/* Question bar — the two-company conflict headline */}
      <div className="border-b border-ortaq-border bg-ortaq-surface px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.625rem] font-bold tabular-nums text-ortaq-ink-soft">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-[1rem] font-bold italic text-ortaq-ink leading-snug">{s.question}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* LEFT — the cross-company message exchange (chaos) */}
        <div className="border-b border-ortaq-border bg-[#FDFAF9] sm:border-b-0 sm:border-r">
          <div className="space-y-2.5 p-4">
            {s.chaosLines.map((line, i) => (
              <CrossCompanyMessage key={i} line={line} />
            ))}
          </div>
          {/* Bottom status — the stuck state */}
          <div className="border-t border-red-100 bg-red-50 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <p className="text-[0.5rem] font-bold text-red-600">{s.chaosCaption}</p>
            </div>
          </div>
        </div>

        {/* RIGHT — the ORTAQ shared record (relief) */}
        <div className="flex flex-col justify-between bg-white">
          <div className="p-5">
            {/* ORTAQ record label */}
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
              <span className="text-[0.4375rem] font-bold uppercase tracking-[0.09em] text-ortaq-trust">
                {isTR ? "ORTAQ KAYDI" : "ORTAQ RECORD"}
              </span>
            </div>
            {/* The answer — large, immediate */}
            <p className="text-[1.0625rem] font-bold leading-snug text-ortaq-ink">{s.ortaqAnswer}</p>
            <p className="mt-1.5 text-[0.5625rem] leading-relaxed text-ortaq-ink-soft">{s.ortaqDetail}</p>
            <div className="mt-3">
              <span className={cn("rounded-full px-2.5 py-1 text-[0.46rem] font-bold", tagStyles[s.tagColor])}>
                {s.ortaqTag}
              </span>
            </div>
          </div>
          {/* Bottom status — the clarity state */}
          <div className="border-t border-ortaq-border/50 bg-ortaq-trust/[0.04] px-5 py-2.5">
            <p className="text-[0.46rem] font-semibold text-ortaq-trust">
              {isTR
                ? "Cevap ORTAQ kaydında. İki taraf da görüyor."
                : "Answer is in the ORTAQ record. Both parties see it."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrossCompanyMessage({ line }: {
  line: { who: string; direction: string; text: string; app: string }
}) {
  const ac = appColors[line.app] ?? { bg: "bg-gray-500", text: "text-white" };
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-ink text-[0.33rem] font-bold text-ortaq-cream">
        {line.who.slice(0, 2).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <span className="text-[0.4rem] font-bold text-ortaq-ink">{line.who}</span>
          <span className="text-[0.375rem] text-ortaq-ink-soft italic">{line.direction}</span>
          <span className={cn("rounded px-1 py-px text-[0.35rem] font-bold", ac.bg, ac.text)}>{line.app}</span>
        </div>
        <p className="text-[0.5375rem] leading-snug text-ortaq-ink-soft">{line.text}</p>
      </div>
    </div>
  );
}
