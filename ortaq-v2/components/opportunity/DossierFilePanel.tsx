import { cn } from "@/lib/utils";
import type { OpportunityDraft } from "@/types";
import { MapPin } from "lucide-react";

export type DossierPanelTheme = "paper" | "light" | "dark" | "spotlight";
export type DossierPanelSize = "sm" | "md" | "lg";

interface DossierFilePanelProps {
  opportunity: OpportunityDraft;
  theme?: DossierPanelTheme;
  size?: DossierPanelSize;
  className?: string;
  showFooter?: boolean;
}

const categoryAccent: Record<string, string> = {
  ecommerce: "border-t-ortaq-action",
  hospitality: "border-t-ortaq-warning",
  manufacturing: "border-t-ortaq-success",
  healthcare: "border-t-[#5B7FD4]",
};

const themeStyles = {
  paper: {
    shell: "border border-ortaq-line bg-[#FAFBFD] shadow-[0_8px_40px_-12px_rgba(20,33,61,0.18)]",
    chrome: "border-b border-ortaq-line bg-ortaq-surface",
    chromeText: "text-ortaq-text-muted",
    title: "text-ortaq-navy",
    hook: "text-ortaq-text-muted",
    rowBorder: "border-ortaq-line/90",
    rowLabel: "text-ortaq-text-muted/70",
    rowValue: "text-ortaq-navy",
    rowAccent: "text-ortaq-action font-medium",
    footer: "text-ortaq-text-muted/80",
    status: "bg-ortaq-success/10 text-ortaq-success",
    recordBg: "bg-ortaq-surface-alt/40",
  },
  light: {
    shell: "border border-ortaq-line bg-ortaq-surface",
    chrome: "border-b border-ortaq-line bg-[#F6F8FB]",
    chromeText: "text-ortaq-text-muted/90",
    title: "text-ortaq-navy",
    hook: "text-ortaq-text-muted",
    rowBorder: "border-ortaq-line/90",
    rowLabel: "text-ortaq-text-muted/70",
    rowValue: "text-ortaq-navy",
    rowAccent: "text-ortaq-action font-medium",
    footer: "text-ortaq-text-muted/80",
    status: "bg-ortaq-surface-alt text-ortaq-text-muted",
    recordBg: "bg-[#F6F8FB]",
  },
  dark: {
    shell: "border border-white/10 bg-ortaq-navy/40",
    chrome: "border-b border-white/10 bg-white/[0.04]",
    chromeText: "text-white/45",
    title: "text-white",
    hook: "text-white/65",
    rowBorder: "border-white/10",
    rowLabel: "text-white/40",
    rowValue: "text-white/90",
    rowAccent: "text-ortaq-accent font-medium",
    footer: "text-white/45",
    status: "bg-white/10 text-white/70",
    recordBg: "bg-white/[0.03]",
  },
  spotlight: {
    shell: "border border-white/12 bg-[#0f1a30] shadow-2xl shadow-black/30",
    chrome: "border-b border-white/10 bg-white/[0.03]",
    chromeText: "text-white/40",
    title: "text-white",
    hook: "text-white/60",
    rowBorder: "border-white/[0.08]",
    rowLabel: "text-white/35",
    rowValue: "text-white/92",
    rowAccent: "text-[#8BA4FF] font-medium",
    footer: "text-white/40",
    status: "bg-ortaq-warning/15 text-ortaq-warning",
    recordBg: "bg-white/[0.02]",
  },
};

const sizeStyles = {
  sm: {
    chrome: "px-3 py-1.5",
    body: "p-3.5",
    meta: "text-[10px]",
    title: "text-[0.9375rem] leading-snug md:text-base",
    hook: "text-[11px] leading-relaxed",
    row: "text-xs py-1.5",
    labelW: "w-[5.25rem]",
    titleMt: "mt-2.5",
    hookMt: "mt-1",
    recordMt: "mt-3.5",
    recordPx: "px-2.5",
    footerMt: "mt-3",
  },
  md: {
    chrome: "px-4 py-2.5",
    body: "p-5",
    meta: "text-[10px]",
    title: "text-lg md:text-xl",
    hook: "text-sm",
    row: "text-sm py-2.5",
    labelW: "w-20",
    titleMt: "mt-4",
    hookMt: "mt-2",
    recordMt: "mt-5",
    recordPx: "px-3 md:px-4",
    footerMt: "mt-4",
  },
  lg: {
    chrome: "px-5 py-3",
    body: "p-6 md:p-8",
    meta: "text-[10px]",
    title: "text-xl md:text-2xl lg:text-[1.65rem]",
    hook: "text-sm md:text-base",
    row: "text-sm md:text-[0.9375rem] py-3",
    labelW: "w-24",
    titleMt: "mt-4",
    hookMt: "mt-2",
    recordMt: "mt-5",
    recordPx: "px-3 md:px-4",
    footerMt: "mt-4",
  },
};

function DossierRow({
  label,
  value,
  accent,
  styles,
  size,
  compact,
}: {
  label: string;
  value: string;
  accent?: boolean;
  styles: (typeof themeStyles)["paper"];
  size: (typeof sizeStyles)["sm"];
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-x-3 border-b last:border-b-0",
        size.row,
        styles.rowBorder
      )}
    >
      <span
        className={cn(
          "font-mono uppercase tracking-[0.16em]",
          compact ? "text-[9px]" : "text-[10px]",
          size.labelW,
          styles.rowLabel
        )}
      >
        {label}
      </span>
      <span className={cn("leading-snug", accent ? styles.rowAccent : styles.rowValue)}>
        {value}
      </span>
    </div>
  );
}

export function DossierFilePanel({
  opportunity,
  theme = "light",
  size = "sm",
  className,
  showFooter = true,
}: DossierFilePanelProps) {
  const t = themeStyles[theme];
  const s = sizeStyles[size];
  const isCompact = size === "sm";
  const accentClass = categoryAccent[opportunity.category] ?? "border-t-ortaq-line";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border-t-2",
        accentClass,
        t.shell,
        className
      )}
    >
      <div className={cn("flex items-center justify-between gap-3", t.chrome, s.chrome)}>
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-ortaq-danger/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-ortaq-warning/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-ortaq-success/70" />
          </span>
          <span className={cn("truncate font-mono tracking-wide", s.meta, t.chromeText)}>
            firsat-dosyasi.ortaq
          </span>
        </div>
        <span className={cn("shrink-0 rounded px-1.5 py-0.5 font-mono uppercase tracking-wider", s.meta, t.status)}>
          {opportunity.readinessStatus === "published" ? "Yayında" : "İncelendi"}
        </span>
      </div>

      <div className={s.body}>
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {opportunity.fileRef && (
              <span className={cn("font-mono tracking-wide", s.meta, t.chromeText)}>
                {opportunity.fileRef}
              </span>
            )}
            {opportunity.fileRef && (
              <span className={cn("font-mono", s.meta, t.chromeText)} aria-hidden>
                ·
              </span>
            )}
            <span
              className={cn(
                "font-mono uppercase tracking-[0.14em]",
                s.meta,
                theme === "spotlight" || theme === "dark"
                  ? "text-ortaq-accent"
                  : "text-ortaq-action"
              )}
            >
              {opportunity.categoryLabel}
            </span>
          </div>
          <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono", s.meta, t.footer)}>
            {opportunity.stageLabel && <span>{opportunity.stageLabel}</span>}
            {opportunity.stageLabel && (
              <span className="opacity-40" aria-hidden>
                ·
              </span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-2.5 w-2.5" />
              {opportunity.location}
            </span>
          </div>
        </div>

        <h3
          className={cn(
            "font-heading font-semibold leading-[1.2] tracking-[-0.02em]",
            s.titleMt,
            s.title,
            t.title
          )}
        >
          {opportunity.title}
        </h3>
        <p className={cn("leading-relaxed", s.hookMt, s.hook, t.hook)}>
          {opportunity.hook ?? opportunity.summary}
        </p>

        <div
          className={cn(
            "rounded border",
            s.recordMt,
            t.rowBorder,
            t.recordBg
          )}
        >
          <div className={s.recordPx}>
            {opportunity.assetsLabel && (
              <DossierRow
                label="Varlık"
                value={opportunity.assetsLabel}
                styles={t}
                size={s}
                compact={isCompact}
              />
            )}
            <DossierRow
              label="Eksik"
              value={opportunity.primaryBlockerLabel}
              styles={t}
              size={s}
              compact={isCompact}
            />
            <DossierRow
              label="Aranan ortak"
              value={opportunity.neededPartnerLabel}
              accent
              styles={t}
              size={s}
              compact={isCompact}
            />
          </div>
        </div>

        {showFooter && (
          <div
            className={cn(
              "flex flex-wrap gap-x-3 gap-y-0.5 font-mono uppercase tracking-wider",
              s.footerMt,
              s.meta,
              t.footer
            )}
          >
            <span>Fırsat Dosyası</span>
            <span className="opacity-40" aria-hidden>
              ·
            </span>
            <span>Güncelleme {opportunity.updatedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
