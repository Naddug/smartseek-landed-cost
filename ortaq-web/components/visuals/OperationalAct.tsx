"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * OperationalAct — Sprint 4: Product page opening sequence
 *
 * Three acts shown BEFORE the module tabs on /urun.
 * The goal: visitor understands Input → Understanding → Picture
 * before seeing any product features.
 *
 * ACT 1: Raw operation — one deal, fragmented across channels
 * ACT 2: ORTAQ reasoning — what it extracts and understands
 * ACT 3: Operational briefing — what your team sees instead
 *
 * Each act is a compact visual card. Together they tell the
 * complete product story in under 60 seconds.
 */

export function OperationalAct() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  /* ── ACT 1 data: raw fragmented signals ────────────────────────── */
  const act1Inputs = isTR
    ? [
        { icon: "📧", source: "E-posta", text: "\"Muayene raporu onayı bekleniyor\"", from: "Hamburg Steel · 08:14" },
        { icon: "💬", source: "WhatsApp", text: "\"SGS geldi mi? Acil!\"", from: "Ops Ekibi · 11:32" },
        { icon: "📄", source: "PDF", text: "SGS_TASLAK_v2.pdf — Onaysız", from: "Eklenti · okunmadı" },
        { icon: "📝", source: "Toplantı Notu", text: "\"22 Haz → 25 Haz teslimat\"", from: "15 Haz · kayıt dışı" },
      ]
    : [
        { icon: "📧", source: "Email", text: "\"Inspection report approval pending\"", from: "Hamburg Steel · 08:14" },
        { icon: "💬", source: "WhatsApp", text: "\"Has SGS arrived? Urgent!\"", from: "Ops Team · 11:32" },
        { icon: "📄", source: "PDF", text: "SGS_DRAFT_v2.pdf — Unapproved", from: "Attachment · unread" },
        { icon: "📝", source: "Meeting Note", text: "\"Jun 22 → Jun 25 delivery\"", from: "Jun 15 · unrecorded" },
      ];

  /* ── ACT 2 data: ORTAQ extraction ──────────────────────────────── */
  const act2Items = isTR
    ? [
        {
          type: "commitment" as const,
          label: "Taahhüt tespit edildi",
          text: "22 Haziran teslimat tarihi",
          source: "E-posta · 10 Haz",
          icon: "📌",
        },
        {
          type: "contradiction" as const,
          label: "Çelişki tespit edildi",
          text: "Toplantıda 25 Haz kararlaştırıldı — sözleşmede hâlâ 22 Haz yazıyor",
          source: "Belgeler vs Toplantı notu",
          icon: "⚡",
        },
        {
          type: "risk" as const,
          label: "Risk tespit edildi",
          text: "SGS onayı eksik → sevkiyat bloke → LC tetiklenemiyor",
          source: "Bağımlılık zinciri",
          icon: "⚠",
        },
        {
          type: "gap" as const,
          label: "Eksik tespit edildi",
          text: "Alıcı 2 gündür yanıt vermedi — son sorgudan bu yana takip yok",
          source: "İletişim geçmişi",
          icon: "◯",
        },
      ]
    : [
        {
          type: "commitment" as const,
          label: "Commitment detected",
          text: "June 22 delivery date",
          source: "Email · Jun 10",
          icon: "📌",
        },
        {
          type: "contradiction" as const,
          label: "Contradiction detected",
          text: "Meeting agreed Jun 25 — contract still says Jun 22",
          source: "Documents vs Meeting note",
          icon: "⚡",
        },
        {
          type: "risk" as const,
          label: "Risk detected",
          text: "SGS approval missing → shipment blocked → LC cannot trigger",
          source: "Dependency chain",
          icon: "⚠",
        },
        {
          type: "gap" as const,
          label: "Gap detected",
          text: "Buyer has not responded for 2 days — no follow-up since last query",
          source: "Communication history",
          icon: "◯",
        },
      ];

  /* ── ACT 3 data: operational briefing ──────────────────────────── */
  const act3Items = isTR
    ? [
        { section: "Şu an ne oluyor?", text: "Muayene tamamlandı, SGS raporu taslak aşamasında — alıcı onayı bekleniyor.", status: "amber" as const },
        { section: "Ne eksik?", text: "Revize teslimat tarihi sözleşmeye yansıtılmadı. Alıcı teyidi yok.", status: "red" as const },
        { section: "Risk nerede?", text: "SGS onayı olmadan 28 Haziran gemisi kaçar. LC son tarihi 30 Haziran.", status: "red" as const },
        { section: "Sonraki adım?", text: "Alıcıyla bugün iletişime geçin. Sözleşme revizyonunu başlatın.", status: "trust" as const },
      ]
    : [
        { section: "What is happening?", text: "Inspection complete, SGS report in draft — buyer approval pending.", status: "amber" as const },
        { section: "What is missing?", text: "Revised delivery date not reflected in contract. No buyer confirmation.", status: "red" as const },
        { section: "What is at risk?", text: "Without SGS approval, June 28 vessel departs. LC deadline June 30.", status: "red" as const },
        { section: "What should happen next?", text: "Contact buyer today. Initiate contract revision.", status: "trust" as const },
      ];

  const act2Styles = {
    commitment:    { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600" },
    contradiction: { bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700",     icon: "text-amber-600"   },
    risk:          { bar: "bg-red-500",      badge: "bg-red-100 text-red-700",         icon: "text-red-600"     },
    gap:           { bar: "bg-gray-400",     badge: "bg-gray-100 text-gray-600",       icon: "text-gray-500"    },
  } as const;

  const act3Styles = {
    amber: "border-l-amber-400 bg-amber-50/50",
    red:   "border-l-red-400 bg-red-50/50",
    trust: "border-l-ortaq-trust bg-ortaq-trust/5",
  } as const;

  return (
    <div className="border-b border-ortaq-border bg-ortaq-ink">
      <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust/70">
            {isTR ? "Nasıl çalışır?" : "How it works"}
          </p>
          <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.03em] text-ortaq-cream leading-[1.15] sm:text-[1.875rem]">
            {isTR
              ? "Ham bilgiden operasyonel netliğe"
              : "From raw information to operational clarity"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ortaq-cream/60">
            {isTR
              ? "ORTAQ önce okur, sonra anlar, sonra önerir. Modüller bu sürecin çıktısıdır."
              : "ORTAQ first reads, then understands, then recommends. The modules are the output of this process."}
          </p>
        </div>

        {/* Three acts — horizontal on large, vertical on small */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">

          {/* ── ACT 1: Raw operation ────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-ortaq-cream/10 bg-white/5">
            <div className="flex items-center gap-2 border-b border-ortaq-cream/10 px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-900/40 text-[0.5rem] font-black text-red-400">
                1
              </span>
              <div>
                <p className="text-[0.5625rem] font-bold text-ortaq-cream/80">
                  {isTR ? "Ham bilgi" : "Raw information"}
                </p>
                <p className="text-[0.4375rem] text-ortaq-cream/40">
                  {isTR ? "Dağınık kaynaklar" : "Scattered sources"}
                </p>
              </div>
              <span className="ml-auto text-[0.5rem] font-bold text-red-400/70">READ</span>
            </div>
            <div className="divide-y divide-ortaq-cream/[0.07] px-3 py-1">
              {act1Inputs.map((inp, i) => (
                <div key={i} className="flex items-start gap-2 py-2.5">
                  <span className="text-[0.875rem] leading-none mt-0.5">{inp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[0.4375rem] font-semibold text-ortaq-cream/50">{inp.source}</span>
                      <span className="text-[0.375rem] text-ortaq-cream/30 shrink-0">{inp.from}</span>
                    </div>
                    <p className="text-[0.46875rem] italic text-ortaq-cream/60 leading-snug">{inp.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-ortaq-cream/10 bg-red-900/20 px-4 py-2">
              <p className="text-[0.46875rem] font-semibold text-red-400">
                {isTR ? "4 kaynak · cevap yok" : "4 sources · no answer"}
              </p>
            </div>
          </div>

          {/* ── ACT 2: ORTAQ reasoning ──────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-ortaq-cream/10 bg-white/5">
            <div className="flex items-center gap-2 border-b border-ortaq-cream/10 px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-900/40 text-[0.5rem] font-black text-amber-400">
                2
              </span>
              <div>
                <p className="text-[0.5625rem] font-bold text-ortaq-cream/80">
                  {isTR ? "ORTAQ işliyor" : "ORTAQ processing"}
                </p>
                <p className="text-[0.4375rem] text-ortaq-cream/40">
                  {isTR ? "Çıkarım ve bağlam" : "Extraction and context"}
                </p>
              </div>
              <span className="ml-auto text-[0.5rem] font-bold text-amber-400/70">UNDERSTAND</span>
            </div>
            <div className="space-y-2 p-3">
              {act2Items.map((item, i) => {
                const s = act2Styles[item.type];
                return (
                  <div key={i} className="overflow-hidden rounded-lg border border-ortaq-cream/10 bg-white/5">
                    <div className={cn("h-0.5", s.bar)} />
                    <div className="px-3 py-2">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className={cn("rounded px-1.5 py-0.5 text-[0.375rem] font-bold", s.badge)}>
                          {item.label}
                        </span>
                        <span className="text-[0.375rem] text-ortaq-cream/30">{item.source}</span>
                      </div>
                      <p className="text-[0.46875rem] leading-snug text-ortaq-cream/70">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── ACT 3: Operational briefing ─────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-ortaq-trust/30 bg-ortaq-trust/5">
            <div className="flex items-center gap-2 border-b border-ortaq-trust/20 px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/20 text-[0.5rem] font-black text-ortaq-trust">
                3
              </span>
              <div>
                <p className="text-[0.5625rem] font-bold text-ortaq-cream/80">
                  {isTR ? "Operasyonel özet" : "Operational briefing"}
                </p>
                <p className="text-[0.4375rem] text-ortaq-cream/40">
                  {isTR ? "Ekibinizin gördüğü" : "What your team sees"}
                </p>
              </div>
              <span className="ml-auto text-[0.5rem] font-bold text-ortaq-trust/70">RECOMMEND</span>
            </div>
            <div className="space-y-2 p-3">
              {act3Items.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-r-lg border-l-2 px-3 py-2",
                    act3Styles[item.status],
                  )}
                >
                  <p className="mb-0.5 text-[0.4375rem] font-bold uppercase tracking-[0.07em] text-ortaq-cream/50">
                    {item.section}
                  </p>
                  <p className="text-[0.46875rem] leading-snug text-ortaq-cream/80">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ortaq-trust/20 bg-ortaq-trust/10 px-4 py-2">
              <p className="text-[0.46875rem] font-semibold text-ortaq-trust">
                {isTR ? "Sormadan önce biliyorsunuz." : "You know before you have to ask."}
              </p>
            </div>
          </div>

        </div>

        {/* Connector to modules below */}
        <div className="mt-8 text-center">
          <p className="text-[0.5625rem] text-ortaq-cream/40">
            {isTR
              ? "Modüller aşağıda — her biri bu sürecin bir çıktısıdır."
              : "Modules below — each one is an output of this process."}
          </p>
          <div className="mx-auto mt-2 h-6 w-px bg-gradient-to-b from-ortaq-cream/20 to-transparent" />
        </div>

      </div>
    </div>
  );
}
