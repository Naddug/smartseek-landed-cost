"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * RoleView — Section 5: Two vivid morning stories.
 *
 * Previous version: 4 identical grid cards, each closing with
 * "ORTAQ'ta bu cevaplar hazır." ×4 — formulaic repetition.
 *
 * New version: 2 narrative blocks.
 *   Story 1 — Satın alma / Procurement: operational morning check.
 *   Story 2 — Finans / Finance: payment pipeline, no phone calls.
 *
 * Structure per story:
 *   - Left:  the "before" scene — what they did without ORTAQ
 *   - Right: what ORTAQ shows them instead
 *
 * Language: plain questions, no abstract SaaS language.
 * Trade specificity (SGS, LC, BL) lives in the answer detail, not headlines.
 */

interface Story {
  icon: string;
  role: string;
  scene: string;
  before: { icon: string; text: string }[];
  answers: { label: string; value: string; status: "ok" | "warn" | "pending" }[];
  closer: string;
  color: string;
  accentLight: string;
}

export function RoleView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const stories: Story[] = isTR ? [
    {
      icon: "📋",
      role: "Satın alma müdürü",
      scene: "Sabah 8:45. 3 tedarikçi cevap bekleniyor. Masasına oturuyor.",
      before: [
        { icon: "📱", text: "Siam Electric'i arıyor. Ulaşamıyor. WhatsApp yazıyor." },
        { icon: "📧", text: "Muayene tarihini soran e-postanın cevabını arıyor." },
        { icon: "❓", text: "\"Sözleşmeyi kaçıncı versiyonla imzaladık?\"" },
      ],
      answers: [
        { label: "Siam Electric · Sözleşme", value: "4 gündür yanıt yok → size bildirim gitti", status: "warn" },
        { label: "Muayene tarihi",            value: "15 Tem. · Siam Metals onayladı",          status: "ok"   },
        { label: "Sözleşme versiyonu",         value: "SPA v12 · İmzalı · Her iki taraf görüyor", status: "ok"  },
      ],
      closer: "Kimseyi aramadan. 2 dakikada.",
      color: "border-blue-200",
      accentLight: "bg-blue-50/60",
    },
    {
      icon: "💳",
      role: "Finans müdürü",
      scene: "Toplantıdan 10 dakika önce. 2 ödeme bu hafta gelmesi gerekiyor.",
      before: [
        { icon: "📞", text: "Bankayı arıyor. Müşteri hizmetleri bekleme sırası." },
        { icon: "📧", text: "Muhasebe'ye yazıyor: \"LC açıldı mı bilmiyorum, kontrol edin.\"" },
        { icon: "❓", text: "\"Makine işleminin BL'si kesildi mi? Ödeme ne zaman çıkacak?\"" },
      ],
      answers: [
        { label: "Zeytinyağı · LC",          value: "Frankfurt Handelsbank · İşlemde · 2 iş günü", status: "pending" },
        { label: "Endüstri Makinesi · BL",   value: "Kesildi · Yamato onayladı · Ödeme bu hafta",  status: "ok"     },
        { label: "Geciken işlem",             value: "Yok — 2 işlem takvimde",                      status: "ok"     },
      ],
      closer: "Bankayı aramadan. Muhasebe'ye sormadan.",
      color: "border-emerald-200",
      accentLight: "bg-emerald-50/60",
    },
  ] : [
    {
      icon: "📋",
      role: "Procurement manager",
      scene: "8:45 am. 3 suppliers waiting for a response. Sitting down at the desk.",
      before: [
        { icon: "📱", text: "Calls Siam Electric. No answer. Sends a WhatsApp." },
        { icon: "📧", text: "Searching for the reply to an email asking about the inspection date." },
        { icon: "❓", text: "\"Which version of the contract did we sign?\"" },
      ],
      answers: [
        { label: "Siam Electric · Contract", value: "No response for 4 days → you received a notification", status: "warn" },
        { label: "Inspection date",           value: "Jul 15 · Siam Metals confirmed",                       status: "ok"   },
        { label: "Contract version",           value: "SPA v12 · Signed · Both parties see it",              status: "ok"   },
      ],
      closer: "Without calling anyone. In 2 minutes.",
      color: "border-blue-200",
      accentLight: "bg-blue-50/60",
    },
    {
      icon: "💳",
      role: "Finance manager",
      scene: "10 minutes before a meeting. 2 payments expected this week.",
      before: [
        { icon: "📞", text: "Calls the bank. On hold in the customer service queue." },
        { icon: "📧", text: "Emails accounting: \"I don't know if the LC has been opened, please check.\"" },
        { icon: "❓", text: "\"Has the BL for the machinery deal been issued? When does payment go out?\"" },
      ],
      answers: [
        { label: "Olive oil · LC",           value: "Frankfurt Handelsbank · In process · 2 business days", status: "pending" },
        { label: "Industrial machine · BL",  value: "Issued · Yamato approved · Payment this week",         status: "ok"     },
        { label: "Delayed deal",              value: "None — 2 deals on schedule",                           status: "ok"     },
      ],
      closer: "Without calling the bank. Without asking accounting.",
      color: "border-emerald-200",
      accentLight: "bg-emerald-50/60",
    },
  ];

  const statusStyle = {
    ok:      { dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
    warn:    { dot: "bg-red-400 animate-pulse", badge: "bg-red-100 text-red-700" },
    pending: { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
  } as const;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {stories.map((story, si) => (
        <div
          key={si}
          className={cn("overflow-hidden rounded-2xl border bg-white shadow-sm", story.color)}
        >
          {/* Role header */}
          <div className={cn("border-b px-5 py-4", story.accentLight, story.color)}>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">{story.icon}</span>
              <div>
                <p className="text-[0.875rem] font-bold text-ortaq-ink">{story.role}</p>
                <p className="text-[0.5625rem] italic text-ortaq-ink-muted leading-snug">{story.scene}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-ortaq-border/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">

            {/* Before — what they used to do */}
            <div className="bg-[#fdf8f7] px-5 py-4">
              <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.08em] text-red-600">
                {isTR ? "ORTAQ olmadan" : "Without ORTAQ"}
              </p>
              <ul className="space-y-2.5">
                {story.before.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 text-base leading-none">{item.icon}</span>
                    <p className="text-[0.6875rem] leading-snug text-ortaq-ink-muted">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* After — what ORTAQ shows */}
            <div className="bg-white px-5 py-4">
              <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
                {isTR ? "ORTAQ kaydında" : "In ORTAQ record"}
              </p>
              <ul className="space-y-2.5">
                {story.answers.map((a, i) => {
                  const s = statusStyle[a.status];
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
                      <div className="min-w-0">
                        <p className="text-[0.5rem] font-bold text-ortaq-ink-soft">{a.label}</p>
                        <p className="text-[0.6875rem] font-semibold text-ortaq-ink leading-snug">{a.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          {/* Closer — the payoff line, unique per story */}
          <div className="border-t border-ortaq-border/50 bg-ortaq-surface px-5 py-3">
            <p className="text-[0.6875rem] font-semibold text-ortaq-trust">{story.closer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
