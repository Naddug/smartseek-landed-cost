"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { toggleLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/nasil-calisir", key: "howItWorks" as const },
  { href: "/sirketler", key: "companies" as const },
  { href: "/guven", key: "trust" as const },
  { href: "/alan", key: "memberArea" as const },
];

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const light = overlay;

  return (
    <header
      className={cn(
        "z-50 w-full",
        overlay
          ? "absolute top-0 border-b border-white/10 bg-black/20 backdrop-blur-md"
          : "sticky top-0 border-b border-ortaq-border/80 bg-ortaq-bg/95 backdrop-blur-sm",
      )}
    >
      <Container>
        <div className="flex h-14 min-h-[3.5rem] items-center justify-between gap-4">
          <Logo className={light ? "text-ortaq-cream [&_span]:text-ortaq-cream" : undefined} />

          <nav className="hidden items-center gap-7 lg:flex" aria-label={t("nav.ariaMain")}>
            {navItems.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "inline-flex min-h-11 items-center text-[0.8125rem] font-medium tracking-[0.02em] transition-colors",
                  light
                    ? "text-ortaq-cream/75 hover:text-ortaq-cream"
                    : "text-ortaq-ink-muted hover:text-ortaq-ink",
                  pathname === href && (light ? "text-ortaq-cream" : "text-ortaq-ink"),
                )}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleLocale}
              className={cn(
                "hidden min-h-11 min-w-11 items-center justify-center text-xs lg:inline-flex",
                light ? "text-ortaq-cream/60 hover:text-ortaq-cream" : "text-ortaq-ink-muted hover:text-ortaq-ink",
              )}
              aria-label={t("nav.langToggle")}
            >
              {i18n.language === "tr" ? "EN" : "TR"}
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-ortaq-sm border lg:hidden",
                light ? "border-white/25 text-ortaq-cream" : "border-ortaq-border text-ortaq-ink",
              )}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t("nav.menu")}
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className={cn("border-t py-2 lg:hidden", light ? "border-white/10" : "border-ortaq-border")}
            aria-label={t("nav.ariaMobile")}
          >
            <ul>
              {navItems.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center text-base",
                      light ? "text-ortaq-cream" : "text-ortaq-ink",
                    )}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
