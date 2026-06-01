"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { dmono } from "./DemoKit";

const LINKS = [
  { href: "/demo/sermaye", label: "Keşif" },
  { href: "/demo/uretici", label: "Üretici profili" },
];

export function DemoNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-ortaq-border bg-ortaq-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/demo" className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ortaq-ink">ORTAQ</Link>
          <span className={cn(dmono, "rounded-ortaq-sm border border-ortaq-border px-1.5 py-0.5 text-ortaq-ink-soft")}>Önizleme</span>
        </div>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={cn("rounded-ortaq-sm px-3 py-1.5 text-[0.8125rem] font-medium transition",
                  active ? "bg-ortaq-ink text-ortaq-cream" : "text-ortaq-ink-soft hover:text-ortaq-ink",
                  l.href === "/demo/sermaye" && !active ? "font-semibold text-ortaq-ink" : "")}>
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={() => { try { localStorage.removeItem("ortaq-demo-v2"); } catch {} location.reload(); }}
            className="ml-2 text-[0.75rem] text-ortaq-ink-soft hover:text-ortaq-ink"
            title="Demoyu başlangıç durumuna döndür"
          >
            Sıfırla
          </button>
          <Link href="/" className="ml-2 text-[0.75rem] text-ortaq-ink-soft hover:text-ortaq-ink">Siteye dön</Link>
        </nav>
      </div>
    </header>
  );
}
