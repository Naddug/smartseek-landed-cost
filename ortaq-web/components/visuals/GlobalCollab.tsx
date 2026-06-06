"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/** Visual #5 — Global Collaboration.
 *  5 participants from different countries working on the same deal.
 *  Activity feed shows real-time contributions from each.
 *  Focus: visibility, not messaging. Same workspace, different countries.
 */

const COLORS = [
  { ring: "ring-ortaq-trust/30", bg: "bg-ortaq-trust/10 text-ortaq-trust", dot: "bg-ortaq-trust" },
  { ring: "ring-blue-300/50",    bg: "bg-blue-100 text-blue-700",          dot: "bg-blue-500" },
  { ring: "ring-amber-300/50",   bg: "bg-amber-100 text-amber-700",        dot: "bg-amber-500" },
  { ring: "ring-violet-300/50",  bg: "bg-violet-100 text-violet-700",      dot: "bg-violet-500" },
  { ring: "ring-teal-300/50",    bg: "bg-teal-100 text-teal-700",          dot: "bg-teal-500" },
];

export function GlobalCollab() {
  const { t } = useTranslation();

  const participants = [
    { key: "p1", initials: "YÇ" },
    { key: "p2", initials: "SL" },
    { key: "p3", initials: "MK" },
    { key: "p4", initials: "HA" },
    { key: "p5", initials: "TR" },
  ] as const;

  const activities = [
    { pIdx: 0, actKey: "act1", time: "09:14" },
    { pIdx: 1, actKey: "act2", time: "10:33" },
    { pIdx: 4, actKey: "act3", time: "11:05" },
    { pIdx: 3, actKey: "act4", time: "13:22" },
    { pIdx: 2, actKey: "act5", time: "14:01" },
  ] as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_8px_40px_rgb(20_19_16/0.10)]">
      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-ortaq-border bg-[#fafaf9] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[0.625rem] font-semibold text-ortaq-ink">
          Çelik Tedariki — Global Ekip
        </span>
        <span className="ml-auto flex items-center gap-1 text-[0.5rem] text-ortaq-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust animate-pulse" />
          5 kişi aktif
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">

        {/* Left: participant cards */}
        <div className="border-b border-ortaq-border sm:border-b-0 sm:border-r">
          <div className="border-b border-ortaq-border px-4 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">Çalışma Ekibi</p>
          </div>
          <div className="divide-y divide-ortaq-border">
            {participants.map((p, i) => {
              const c = COLORS[i];
              return (
                <div key={p.key} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 text-[0.5625rem] font-bold", c.bg, c.ring)}>
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[0.5625rem] font-semibold text-ortaq-ink">
                        {t(`visuals.global.${p.key}Name`)}
                      </p>
                      <span className="text-sm leading-none">
                        {t(`visuals.global.${p.key}Country`)}
                      </span>
                    </div>
                    <p className="text-[0.4375rem] text-ortaq-ink-soft">
                      {t(`visuals.global.${p.key}Role`)}
                    </p>
                  </div>
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", c.dot)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: shared activity */}
        <div>
          <div className="border-b border-ortaq-border px-4 py-2.5">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
              Paylaşılan Aktivite — Gerçek Zamanlı
            </p>
          </div>

          <div className="p-4 space-y-2.5">
            {activities.map(({ pIdx, actKey, time }, i) => {
              const p = participants[pIdx];
              const c = COLORS[pIdx];
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.4375rem] font-bold ring-2",
                    c.bg, c.ring,
                  )}>
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border border-ortaq-border bg-[#fafaf9] px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1">
                        <p className="text-[0.4375rem] font-semibold text-ortaq-ink-soft">
                          {t(`visuals.global.${p.key}Name`)}
                        </p>
                        <span className="text-xs leading-none">{t(`visuals.global.${p.key}Country`)}</span>
                      </span>
                      <span className="text-[0.375rem] text-ortaq-ink-soft">{time}</span>
                    </div>
                    <p className="mt-0.5 text-[0.5625rem] font-medium text-ortaq-ink">
                      {t(`visuals.global.${actKey}`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shared view indicator */}
          <div className="border-t border-ortaq-border bg-ortaq-trust/5 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[0.5625rem] font-semibold text-ortaq-trust">
                {t("visuals.global.sharedView")}
              </p>
              {/* All avatars overlap */}
              <div className="flex -space-x-2">
                {participants.map((p, i) => (
                  <div
                    key={p.key}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[0.375rem] font-bold",
                      COLORS[i].bg,
                    )}
                  >
                    {p.initials}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
