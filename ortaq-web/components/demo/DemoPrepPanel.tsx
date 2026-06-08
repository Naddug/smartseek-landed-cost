"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

type DemoPrepTheme = "light" | "dark";

interface DemoPrepPanelProps {
  theme?: DemoPrepTheme;
  className?: string;
}

const THEME: Record<DemoPrepTheme, { box: string; label: string; text: string }> = {
  light: {
    box:  "border-ortaq-border bg-white text-left",
    label: "text-ortaq-ink-soft",
    text:  "text-ortaq-ink-muted",
  },
  dark: {
    box:  "border-ortaq-cream/10 bg-ortaq-cream/5 text-left",
    label: "text-ortaq-cream/40",
    text:  "text-ortaq-cream/70",
  },
};

export function DemoPrepPanel({ theme = "light", className }: DemoPrepPanelProps) {
  const { t } = useTranslation();
  const s = THEME[theme];

  const rows = [
    { label: t("home.demo.whatLabel"),   text: t("home.demo.what") },
    { label: t("home.demo.durationLabel"), text: t("home.demo.duration") },
    { label: t("home.demo.bringLabel"),  text: t("home.demo.bring") },
    { label: t("home.demo.learnLabel"),  text: t("home.demo.learn") },
  ];

  return (
    <div className={cn("overflow-hidden rounded-2xl border", s.box, className)}>
      <div className={cn("border-b px-5 py-3", theme === "dark" ? "border-ortaq-cream/10" : "border-ortaq-border")}>
        <p className={cn("text-[0.4375rem] font-bold uppercase tracking-[0.09em]", s.label)}>
          {t("home.demo.prepTitle")}
        </p>
      </div>
      <div className={cn("divide-y", theme === "dark" ? "divide-ortaq-cream/[0.07]" : "divide-ortaq-border/60")}>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-3 px-5 py-3">
            <p className={cn("text-[0.5625rem] font-bold uppercase tracking-[0.05em]", s.label)}>
              {row.label}
            </p>
            <p className={cn("text-[0.5625rem] leading-relaxed", s.text)}>{row.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
