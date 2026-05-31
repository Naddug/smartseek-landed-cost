import Link from "next/link";
import { cn } from "@/lib/cn";
import type { MatchFit } from "@/lib/demo/data";
import type { ProfileVisibility } from "@/lib/demo/store";

export const dmono = "font-mono text-[0.625rem] uppercase tracking-[0.12em]";

export function Mono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn(dmono, "text-ortaq-ink-soft", className)}>{children}</span>;
}

type FlowLens = "default" | "investor" | "producer";

const FLOW_LABELS: Record<FlowLens, [string, string, string, string]> = {
  default: ["Ne oldu", "Neden", "Kanıt", "Sırada"],
  investor: ["Neden bu şirket?", "Neden şimdi?", "İncelenen belgeler", "Ne yapmalısınız?"],
  producer: ["Durum", "Ne engelliyor?", "Ne sunuldu?", "Sonraki adım"],
};

/** Dört soru bandı — yatırımcı veya üretici dili. */
export function FlowContext({
  what,
  why,
  next,
  trust,
  lens = "default",
}: {
  what: string;
  why: string;
  next: string;
  trust?: string;
  lens?: FlowLens;
}) {
  const [l1, l2, l3, l4] = FLOW_LABELS[lens];
  const investor = lens === "investor";
  return (
    <div className={cn(
      "rounded-ortaq-md border px-4 py-4 sm:px-5 sm:py-5",
      investor ? "border-ortaq-trust/50 bg-ortaq-trust-soft/50" : "border-ortaq-border bg-ortaq-surface",
    )}>
      <dl className={cn("grid gap-4", trust ? "sm:grid-cols-2" : "")}>
        <div className={investor ? "sm:col-span-2" : ""}>
          <dt className={dmono}>{l1}</dt>
          <dd className={cn("mt-1 leading-[1.5] text-ortaq-ink", investor ? "text-[0.9375rem] font-medium sm:text-[1rem]" : "text-[0.8125rem]")}>{what}</dd>
        </div>
        <div>
          <dt className={dmono}>{l2}</dt>
          <dd className="mt-1 border-l-2 border-ortaq-trust pl-3 text-[0.8125rem] leading-[1.55] text-ortaq-trust-muted">{why}</dd>
        </div>
        {trust ? (
          <div>
            <dt className={dmono}>{l3}</dt>
            <dd className="mt-1 text-[0.8125rem] leading-[1.55] text-ortaq-ink-muted">{trust}</dd>
          </div>
        ) : null}
        <div className={trust ? "sm:col-span-2" : ""}>
          <dt className={dmono}>{l4}</dt>
          <dd className="mt-1 text-[0.8125rem] font-semibold leading-[1.5] text-ortaq-trust-muted">{next}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Profil üstü — şirket hikâyesi önde. */
export function OpportunityHook({
  name,
  capitalLine,
  summary,
  urgency,
  trust,
  next,
}: {
  name?: string;
  capitalLine?: string;
  summary: string;
  urgency: string;
  trust?: string;
  next?: string;
}) {
  return (
    <div className="space-y-5 rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface px-4 py-5 sm:px-6 sm:py-6">
      {name ? (
        <div>
          <h2 className="text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.02em] text-ortaq-ink sm:text-[1.5rem]">{name}</h2>
          {capitalLine ? (
            <p className="mt-2 text-[0.9375rem] font-semibold leading-[1.45] text-ortaq-trust-muted sm:text-[1rem]">{capitalLine}</p>
          ) : null}
        </div>
      ) : null}
      <div>
        <p className={dmono}>Neden bu şirket?</p>
        <p className={cn("max-w-2xl leading-[1.55] text-ortaq-ink", name ? "mt-2 text-[1rem] sm:text-[1.0625rem]" : "mt-1.5 text-[1.0625rem] sm:text-[1.125rem]")}>{summary}</p>
      </div>
      <div className="border-l-[3px] border-ortaq-trust bg-ortaq-trust-soft/60 py-3 pl-4 pr-3">
        <p className={dmono}>Neden şimdi?</p>
        <p className="mt-1.5 text-[0.9375rem] leading-[1.55] font-semibold text-ortaq-trust-muted">{urgency}</p>
      </div>
      {trust ? (
        <div>
          <p className={dmono}>İncelenen belgeler</p>
          <p className="mt-1 text-[0.8125rem] leading-[1.55] text-ortaq-ink-muted">{trust}</p>
        </div>
      ) : null}
      {next ? (
        <div className="rounded-ortaq-sm bg-ortaq-ink px-4 py-3.5">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ortaq-cream/60">Ne yapmalısınız?</p>
          <p className="mt-1 text-[0.8125rem] font-semibold leading-[1.5] text-ortaq-cream">{next}</p>
        </div>
      ) : null}
    </div>
  );
}

export function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "trust" | "muted" | "warn" }) {
  const t = {
    default: "border-ortaq-border bg-ortaq-surface text-ortaq-ink",
    trust: "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted",
    muted: "border-ortaq-border bg-ortaq-bg-alt text-ortaq-ink-soft",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-ortaq-sm border px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em]", t)}>{children}</span>;
}

export function FitTag({ fit }: { fit: MatchFit }) {
  const tone = fit === "strong" ? "trust" : fit === "partial" ? "default" : "muted";
  const label = fit === "strong" ? "Tezinize uyuyor" : fit === "partial" ? "Kısmen uyuyor" : "Tez dışı";
  return <Tag tone={tone}>{label}</Tag>;
}

export function ProfileStatus({
  visibility,
  missingNames,
}: {
  visibility: ProfileVisibility;
  missingNames?: string[];
}) {
  const map = {
    draft: {
      tone: "muted" as const,
      title: "Keşifte görünmüyor",
      desc: "Eksik belgeler tamamlanana kadar sermaye partnerleri profilinizi keşfedemez.",
      unlock: "Zorunlu belgeler incelendiğinde profil keşfedilebilir olur.",
      next: missingNames?.length ? `Eksik: ${missingNames.join(", ")}` : "Eksik belgeleri yükleyin.",
    },
    reviewing: {
      tone: "warn" as const,
      title: "Belge incelemesi sürüyor",
      desc: "Belgeler inceleniyor; profil henüz keşifte tam görünmüyor.",
      unlock: "Onay sonrası kanıt profile işlenir.",
      next: "İnceleme bitince kalan eksikleri tamamlayın.",
    },
    live: {
      tone: "trust" as const,
      title: "Keşfedilebilir profil",
      desc: "Sermaye partnerleri profilinizi, dosyalanmış kanıtı ve açık soruları görebilir; tanıştırma talebi gönderebilir.",
      unlock: "Profil keşifte.",
      next: "Gelen tanıştırma taleplerini yanıtlayın.",
    },
  };
  const s = map[visibility];
  return (
    <div className={cn("rounded-ortaq-md border px-4 py-4", visibility === "live" ? "border-ortaq-trust bg-ortaq-trust-soft" : "border-ortaq-border bg-ortaq-bg-alt")}>
      <Tag tone={s.tone}>{s.title}</Tag>
      <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ortaq-ink">{s.desc}</p>
      <p className="mt-2 text-[0.75rem] leading-[1.5] text-ortaq-ink-muted">{s.unlock}</p>
      <p className="mt-1 text-[0.75rem] font-semibold leading-[1.5] text-ortaq-trust-muted">{s.next}</p>
    </div>
  );
}

export function FeedbackBanner({ title, children, tone = "trust" }: { title: string; children: React.ReactNode; tone?: "trust" | "neutral" }) {
  const bg = tone === "trust" ? "border-ortaq-trust bg-ortaq-trust-soft" : "border-ortaq-border bg-ortaq-bg-alt";
  return (
    <div className={cn("rounded-ortaq-md border px-4 py-3", bg)}>
      <p className="text-[0.875rem] font-semibold text-ortaq-ink">{title}</p>
      <div className="mt-1 text-[0.8125rem] text-ortaq-ink-muted">{children}</div>
    </div>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-ortaq-md border border-ortaq-border bg-ortaq-surface", className)}>{children}</div>;
}

export function PanelHead({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-ortaq-border px-5 py-3">
      <span className={cn(dmono, "text-ortaq-ink-soft")}>{children}</span>
      {right}
    </div>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, { t: string; tone: "trust" | "muted" | "default" | "warn" }> = {
    ready: { t: "Belgeler incelendi", tone: "trust" },
    verifying: { t: "Belge incelemesi sürüyor", tone: "warn" },
    engaged: { t: "Görüşme devam ediyor", tone: "trust" },
    new: { t: "Yeni profil", tone: "muted" },
  };
  const s = map[stage] ?? map.new;
  return <Tag tone={s.tone}>{s.t}</Tag>;
}

export function Cta({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  const v = variant === "primary"
    ? "bg-ortaq-trust text-ortaq-cream hover:opacity-90"
    : "border border-ortaq-border text-ortaq-ink hover:border-ortaq-border-strong";
  return <Link href={href} className={cn("inline-flex items-center rounded-ortaq-md px-4 py-2 text-[0.8125rem] font-medium transition", v)}>{children}</Link>;
}

/** İncelenen ve eksik belgeler — dönüşüm kanıtı, platform dili yok. */
export function trustFromSignals(signals: { label: string; verified: boolean }[]) {
  const v = signals.filter((s) => s.verified).map((s) => s.label);
  const u = signals.filter((s) => !s.verified).map((s) => s.label);
  if (v.length === 0) return "Henüz dosyalanmış belge yok; değerlendirme sınırlı.";
  let line = `Dosyalandı ve incelendi: ${v.join(", ")}.`;
  if (u.length > 0) line += ` Henüz sunulmadı: ${u.join(", ")}.`;
  return line;
}
