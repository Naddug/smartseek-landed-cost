"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo/store";
import { cn } from "@/lib/cn";

const STEPS = [
  { label: "Belgeler", hint: "Doğrula" },
  { label: "Keşif", hint: "Profil açık" },
  { label: "Tanıştırma", hint: "Talep" },
  { label: "Görüşme", hint: "Oda" },
];

/** Üretici tarafında ilerleme — adım göstergesi yalnızca; bağlam FlowContext'te. */
export function JourneyStrip() {
  const { docs, intros, rooms } = useDemo();
  const allVerified = docs.every((d) => d.status === "verified");
  const anyRoom = rooms.length > 0;
  const stage = anyRoom ? 3 : intros.some((i) => i.status !== "declined") ? 2 : allVerified ? 1 : 0;

  return (
    <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt px-4 py-3">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ortaq-ink-soft">İlerleme</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => {
          const done = i < stage;
          const now = i === stage;
          return (
            <div key={s.label} className={cn("rounded-ortaq-sm border px-2 py-1.5 text-center", now ? "border-ortaq-trust bg-ortaq-trust-soft" : done ? "border-ortaq-trust/30 bg-ortaq-surface" : "border-ortaq-border bg-ortaq-bg")}>
              <span className={cn("text-[0.6875rem] font-medium", now ? "text-ortaq-ink" : "text-ortaq-ink-soft")}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Tek hareket — fırsat veya karar odaklı. */
export function NextStep({ label, cta, href, prefix = "Sonraki adım" }: { label: string; cta: string; href: string; prefix?: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-4 rounded-ortaq-md border border-ortaq-ink bg-ortaq-ink px-4 py-3 text-ortaq-cream transition hover:opacity-90">
      <span className="text-[0.8125rem]"><span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ortaq-cream/60">{prefix} · </span>{label}</span>
      <span className="shrink-0 text-[0.8125rem] font-medium group-hover:underline">{cta} →</span>
    </Link>
  );
}
