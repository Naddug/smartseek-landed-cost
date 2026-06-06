"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * Visual #3 — THE MOMENT OF VALUE.
 *
 * Four commercial decisions that destroy deals.
 * Each card: LEFT = the question (pain, chaos, unknown) / RIGHT = the answer (clarity).
 *
 * These are not features. These are outcomes.
 * Every card answers: "What pain disappears when I use this?"
 */
export function DecisionCards() {
  const { t } = useTranslation();

  const cards = [
    {
      before: t("visuals.value.q1Before"),
      beforeSub: t("visuals.value.q1Before2"),
      after: t("visuals.value.q1After"),
      afterSub: t("visuals.value.q1AfterSub"),
      icon: "📄",
      afterIcon: "✓",
    },
    {
      before: t("visuals.value.q2Before"),
      beforeSub: t("visuals.value.q2Before2"),
      after: t("visuals.value.q2After"),
      afterSub: t("visuals.value.q2AfterSub"),
      icon: "💬",
      afterIcon: "✓",
    },
    {
      before: t("visuals.value.q3Before"),
      beforeSub: t("visuals.value.q3Before2"),
      after: t("visuals.value.q3After"),
      afterSub: t("visuals.value.q3AfterSub"),
      icon: "👤",
      afterIcon: "→",
    },
    {
      before: t("visuals.value.q4Before"),
      beforeSub: t("visuals.value.q4Before2"),
      after: t("visuals.value.q4After"),
      afterSub: t("visuals.value.q4AfterSub"),
      icon: "📦",
      afterIcon: "📅",
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_4px_20px_rgb(20_19_16/0.08)]"
        >
          {/* Before — chaos */}
          <div className="relative border-b border-ortaq-border bg-[#1C1210] p-5">
            {/* Stress texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                backgroundSize: "8px 8px",
              }}
            />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{card.icon}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-red-900/40 bg-red-900/30 px-2 py-0.5 text-[0.5rem] font-bold text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Bilinmiyor
                </span>
              </div>
              <p className="text-[0.9375rem] font-bold leading-snug text-white">
                {card.before}
              </p>
              <p className="mt-1.5 text-[0.625rem] font-medium text-white/40 italic">
                {card.beforeSub}
              </p>

              {/* Searching indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {["WA", "Email", "PDF", "XLS"].map((src) => (
                    <span
                      key={src}
                      className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.4375rem] font-semibold text-white/30"
                    >
                      {src}
                    </span>
                  ))}
                </div>
                <span className="text-[0.4375rem] text-white/20">arıyor...</span>
              </div>
            </div>
          </div>

          {/* Divider with arrow */}
          <div className="flex items-center justify-center border-b border-ortaq-border bg-[#fafaf9] py-2">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-ortaq-border" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ortaq-trust text-white text-[0.5625rem] font-bold">
                ↓
              </span>
              <div className="h-px w-8 bg-ortaq-border" />
            </div>
          </div>

          {/* After — clarity */}
          <div className="bg-white p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ortaq-trust/15 text-[0.5rem] font-bold text-ortaq-trust">
                {card.afterIcon}
              </span>
              <span className="text-[0.5rem] font-bold uppercase tracking-wide text-ortaq-trust">
                ORTAQ · Anında
              </span>
            </div>

            <p className="text-[1rem] font-bold leading-tight text-ortaq-ink">
              {card.after}
            </p>
            <p className="mt-1.5 text-[0.625rem] text-ortaq-ink-soft">
              {card.afterSub}
            </p>

            {/* Visual confidence bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-ortaq-border">
                <div className="h-full w-full rounded-full bg-ortaq-trust" />
              </div>
              <span className="text-[0.5rem] font-bold text-ortaq-trust">100%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
