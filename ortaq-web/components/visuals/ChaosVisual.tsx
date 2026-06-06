"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * Visual #1 — THE CHAOS.
 *
 * One transaction. Fifteen scattered fragments.
 * WhatsApp messages, conflicting PDFs, voicenotes, unanswered emails —
 * floating in separate app windows, visually piling on each other.
 *
 * Emotional target: "Yes. This is exactly my life."
 *
 * Implementation: percentage-positioned absolute cards inside a fixed-
 * aspect-ratio container. Each card is a mini app-window.
 * Item widths are also in % so the whole composition scales together.
 */
export function ChaosVisual() {
  const { t } = useTranslation();

  return (
    <div className="select-none">
      {/* Fixed aspect-ratio canvas — all items positioned at % */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "8/5", minHeight: 320 }}
      >
        {/* Warm stress background */}
        <div className="absolute inset-0 bg-[#FBF0ED]">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 via-transparent to-orange-100/20" />
          {/* Subtle grid stress pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #7F1D1D 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* ── WhatsApp window 1 (upper-left) ── */}
        <FloatingCard
          style={{ top: "3%", left: "1%", width: "24%", zIndex: 12 }}
          rotate="-2.5deg"
        >
          <AppBar app="WhatsApp" dotColor="#25D366" titleColor="#075E54" />
          <div className="space-y-1 p-1.5">
            <WaBubble text={t("visuals.chaos.wa1")} incoming />
            <WaBubble text={t("visuals.chaos.wa2")} />
            <WaBubble text={t("visuals.chaos.wa3")} incoming />
          </div>
          <div className="border-t border-[#25D366]/15 bg-[#25D366]/5 px-1.5 py-1 flex items-center justify-between">
            <span className="text-[0.4rem] text-[#128C7E] font-semibold">{t("visuals.chaos.badge1")}</span>
            <span className="h-3 w-3 rounded-full bg-[#25D366] text-[0.3rem] text-white font-bold flex items-center justify-center">47</span>
          </div>
        </FloatingCard>

        {/* ── WhatsApp window 2 (upper-center-left, overlapping) ── */}
        <FloatingCard
          style={{ top: "28%", left: "4%", width: "19%", zIndex: 9 }}
          rotate="1.5deg"
        >
          <AppBar app="WhatsApp" dotColor="#25D366" titleColor="#075E54" />
          <div className="p-1.5 space-y-1">
            <WaBubble text={t("visuals.chaos.wa4")} incoming />
            <WaBubble text={t("visuals.chaos.wa5")} incoming />
            <div className="flex items-center gap-0.5 text-[0.35rem] text-[#128C7E]">
              <span className="h-1 w-1 rounded-full bg-[#25D366]" />
              <span>{t("visuals.chaos.timeago3")}</span>
            </div>
          </div>
        </FloatingCard>

        {/* ── Email chain (upper-right) ── */}
        <FloatingCard
          style={{ top: "2%", left: "27%", width: "31%", zIndex: 10 }}
          rotate="1deg"
        >
          <AppBar app="Email" dotColor="#0078D4" titleColor="#0078D4" />
          <div className="p-1.5 space-y-1">
            <EmailRow
              subject={t("visuals.chaos.emailSubject")}
              preview={t("visuals.chaos.emailBody")}
              badge="📎"
              time="2d"
              unread
            />
            <EmailRow
              subject={t("visuals.chaos.emailSubject2")}
              preview={t("visuals.chaos.emailBody2")}
              time="5h"
              unread
            />
          </div>
          <div className="border-t border-blue-100 bg-blue-50 px-1.5 py-0.5">
            <span className="text-[0.35rem] font-semibold text-blue-500">{t("visuals.chaos.badge2")}</span>
          </div>
        </FloatingCard>

        {/* ── Voice note (upper-right corner) ── */}
        <FloatingCard
          style={{ top: "3%", right: "1%", width: "16%", zIndex: 8 }}
          rotate="3deg"
        >
          <AppBar app="WhatsApp" dotColor="#25D366" titleColor="#075E54" />
          <div className="p-1.5">
            <div className="flex items-center gap-1 rounded-lg bg-[#ECE5DD] px-1.5 py-1.5">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                <span className="text-[0.4rem]">▶</span>
              </div>
              <div className="flex-1">
                <div className="flex gap-px">
                  {[2,3,4,3,2,4,5,3,2,4,3,2].map((h,i) => (
                    <div key={i} className="w-px rounded-full bg-[#128C7E]" style={{height: h * 2}} />
                  ))}
                </div>
                <p className="mt-0.5 text-[0.35rem] text-[#128C7E]">{t("visuals.chaos.voiceNote")}</p>
              </div>
            </div>
            <p className="mt-0.5 text-[0.35rem] text-red-500 font-semibold">{t("visuals.chaos.voiceUnread")}</p>
          </div>
        </FloatingCard>

        {/* ── PDF v12 (center, slightly left) ── */}
        <FloatingCard
          style={{ top: "44%", left: "24%", width: "21%", zIndex: 13 }}
          rotate="-3deg"
        >
          <AppBar app="PDF" dotColor="#C0392B" titleColor="#C0392B" />
          <div className="p-1.5">
            <div className="flex items-start gap-1">
              <span className="text-[0.7rem]">📄</span>
              <div>
                <p className="text-[0.4rem] font-bold text-gray-800 leading-tight">{t("visuals.chaos.pdfV12")}</p>
                <p className="text-[0.35rem] text-gray-400">v12 · 2.4 MB · 15 Haz.</p>
              </div>
            </div>
            <div className="mt-1 rounded border border-green-200 bg-green-50 px-1 py-0.5">
              <p className="text-[0.35rem] font-bold text-green-700">Bu geçerli mi?</p>
            </div>
          </div>
        </FloatingCard>

        {/* ── PDF v11 (center, overlapping v12) ── */}
        <FloatingCard
          style={{ top: "50%", left: "31%", width: "20%", zIndex: 7 }}
          rotate="1.5deg"
        >
          <AppBar app="PDF" dotColor="#C0392B" titleColor="#C0392B" />
          <div className="p-1.5">
            <div className="flex items-start gap-1">
              <span className="text-[0.7rem]">📄</span>
              <div>
                <p className="text-[0.4rem] font-bold text-gray-800 leading-tight">{t("visuals.chaos.pdfV11")}</p>
                <p className="text-[0.35rem] text-gray-400">v11 · 2.1 MB · 12 Haz.</p>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* ── PDF v10 (behind others) ── */}
        <FloatingCard
          style={{ top: "56%", left: "20%", width: "18%", zIndex: 5 }}
          rotate="-1deg"
        >
          <AppBar app="PDF" dotColor="#C0392B" titleColor="#C0392B" dim />
          <div className="p-1.5 opacity-60">
            <div className="flex items-start gap-1">
              <span className="text-[0.7rem]">📄</span>
              <div>
                <p className="text-[0.35rem] font-bold text-gray-400 leading-tight line-through">
                  {t("visuals.chaos.pdfV10")}
                </p>
                <p className="text-[0.3rem] text-gray-300">v10 · eski</p>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* ── PDF conflict badge (floating) ── */}
        <div
          className="absolute z-20 rounded-full border border-red-300 bg-red-50 px-1.5 py-0.5"
          style={{ top: "42%", left: "38%", transform: "rotate(-2deg)" }}
        >
          <p className="text-[0.4rem] font-bold text-red-600">{t("visuals.chaos.pdfConflict")}</p>
        </div>

        {/* ── Excel conflict (right-center) ── */}
        <FloatingCard
          style={{ top: "36%", right: "2%", width: "22%", zIndex: 10 }}
          rotate="2.5deg"
        >
          <AppBar app="Excel" dotColor="#217346" titleColor="#217346" />
          <div className="p-1.5">
            <p className="text-[0.4rem] font-semibold text-green-800 leading-tight">{t("visuals.chaos.xlsxConflict")}</p>
            <div className="mt-1 rounded border border-amber-200 bg-amber-50 px-1 py-0.5">
              <p className="text-[0.35rem] font-bold text-amber-700">{t("visuals.chaos.xlsxNote2")}</p>
            </div>
            <div className="mt-1 flex gap-0.5">
              {["v1","v2","v3","v4"].map((v,i) => (
                <span key={v} className={cn(
                  "rounded px-0.5 py-px text-[0.3rem] font-bold",
                  i === 3 ? "bg-green-200 text-green-700" : "bg-gray-100 text-gray-300 line-through"
                )}>{v}</span>
              ))}
            </div>
            <span className="mt-0.5 block text-[0.3rem] text-gray-400">{t("visuals.chaos.badge3")}</span>
          </div>
        </FloatingCard>

        {/* ── SGS Report (bottom-center) ── */}
        <FloatingCard
          style={{ bottom: "4%", left: "26%", width: "20%", zIndex: 11 }}
          rotate="-1.5deg"
        >
          <AppBar app="SGS" dotColor="#E31837" titleColor="#E31837" />
          <div className="p-1.5">
            <div className="flex items-start gap-1">
              <span className="text-[0.7rem]">📋</span>
              <div>
                <p className="text-[0.4rem] font-bold text-gray-700">{t("visuals.chaos.sgsTitle")}</p>
                <div className="mt-0.5 rounded bg-amber-100 px-1 py-px">
                  <p className="text-[0.35rem] font-bold text-amber-700">{t("visuals.chaos.sgsStatus")}</p>
                </div>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* ── BL document (bottom-right) ── */}
        <FloatingCard
          style={{ bottom: "3%", right: "3%", width: "21%", zIndex: 9 }}
          rotate="2deg"
        >
          <AppBar app="Konşimento" dotColor="#1a56db" titleColor="#1a56db" />
          <div className="p-1.5">
            <p className="text-[0.4rem] font-bold text-blue-800">{t("visuals.chaos.blTitle")}</p>
            <div className="mt-0.5 flex items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <p className="text-[0.35rem] text-gray-500">{t("visuals.chaos.blStatus")}</p>
            </div>
            <p className="mt-0.5 text-[0.3rem] text-gray-400">{t("visuals.chaos.timeago1")}</p>
          </div>
        </FloatingCard>

        {/* ── Finance message (middle-right) ── */}
        <FloatingCard
          style={{ top: "55%", right: "2%", width: "20%", zIndex: 12 }}
          rotate="-2deg"
        >
          <AppBar app="Finance" dotColor="#C0392B" titleColor="#C0392B" />
          <div className="p-1.5">
            <p className="text-[0.4rem] font-semibold text-red-800">{t("visuals.chaos.financeMsg")}</p>
            <div className="mt-1 flex items-center gap-0.5">
              <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[0.3rem] text-red-500">{t("visuals.chaos.timeago2")}</p>
            </div>
          </div>
        </FloatingCard>

        {/* ── Ops message (bottom-left) ── */}
        <FloatingCard
          style={{ bottom: "3%", left: "1%", width: "22%", zIndex: 8 }}
          rotate="1deg"
        >
          <AppBar app="Operations" dotColor="#5B21B6" titleColor="#5B21B6" />
          <div className="p-1.5">
            <p className="text-[0.4rem] text-violet-800">{t("visuals.chaos.opsMsg")}</p>
            <p className="mt-0.5 text-[0.35rem] text-gray-400">{t("visuals.chaos.opsMsg2")}</p>
            <p className="mt-0.5 text-[0.3rem] text-gray-300">{t("visuals.chaos.timeago3")}</p>
          </div>
        </FloatingCard>

        {/* ── Center: STATUS UNKNOWN indicator ── */}
        <div
          className="absolute z-20 flex flex-col items-center gap-0.5"
          style={{ top: "38%", left: "50%", transform: "translate(-50%,-50%)" }}
        >
          <div className="flex items-center gap-1 rounded-full border border-red-300 bg-white/90 px-2 py-0.5 shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[0.5rem] font-bold text-red-600 whitespace-nowrap">
              {t("visuals.chaos.statusUnknown")}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom: the unanswered questions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {[
          t("visuals.chaos.wa1").split("?")[0] + "?",
          t("visuals.chaos.pdfConflict"),
          t("visuals.chaos.financeMsg"),
          t("visuals.chaos.opsMsg2"),
          t("visuals.chaos.voiceUnread"),
        ].map((q) => (
          <span
            key={q}
            className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[0.5625rem] font-medium text-red-600"
          >
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── helpers ── */

function FloatingCard({
  children,
  style,
  rotate = "0deg",
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  rotate?: string;
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-lg border border-black/[0.08] bg-white shadow-[0_4px_16px_rgb(0_0_0/0.16)]"
      style={{ ...style, transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

function AppBar({
  app,
  dotColor,
  titleColor,
  dim,
}: {
  app: string;
  dotColor: string;
  titleColor: string;
  dim?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 border-b border-black/[0.06] px-1.5 py-0.5",
        dim ? "bg-gray-50" : "bg-[#f7f7f7]",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
      <span className="ml-1 text-[0.35rem] font-semibold" style={{ color: titleColor }}>
        {app}
      </span>
    </div>
  );
}

function WaBubble({ text, incoming }: { text: string; incoming?: boolean }) {
  return (
    <div className={cn("flex", incoming ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[90%] rounded-xl px-1.5 py-1 text-[0.4rem] leading-snug",
          incoming
            ? "rounded-tl-none bg-white text-gray-800 shadow-sm"
            : "rounded-tr-none bg-[#DCF8C6] text-gray-800",
        )}
      >
        {text}
      </div>
    </div>
  );
}

function EmailRow({
  subject,
  preview,
  badge,
  time,
  unread,
}: {
  subject: string;
  preview: string;
  badge?: string;
  time: string;
  unread?: boolean;
}) {
  return (
    <div className={cn("rounded px-1 py-0.5", unread ? "bg-blue-50" : "bg-gray-50")}>
      <div className="flex items-start justify-between gap-1">
        <p className={cn("truncate text-[0.4rem] leading-tight", unread ? "font-bold text-blue-900" : "text-gray-500")}>
          {badge && <span className="mr-0.5">{badge}</span>}
          {subject}
        </p>
        <span className="shrink-0 text-[0.3rem] text-gray-400">{time}</span>
      </div>
      <p className="truncate text-[0.35rem] text-gray-400">{preview}</p>
    </div>
  );
}
