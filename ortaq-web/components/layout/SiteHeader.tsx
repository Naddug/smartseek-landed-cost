"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/nasil-calisir", key: "howItWorks" as const },
  { href: "/corridors", key: "corridors" as const },
  { href: "/ekip", key: "team" as const },
];

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const light = overlay;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        light
          ? "absolute top-0 border-white/10 bg-black/20 backdrop-blur-md"
          : "border-ortaq-border-strong/80 bg-ortaq-surface/95 backdrop-blur-lg shadow-[0_1px_0_rgb(255_255_255/0.7)_inset,0_1px_8px_rgb(20_19_16/0.04)]",
      )}
    >
      <Container wide>
        <div className="flex h-[3.25rem] min-h-[3.25rem] items-center justify-between gap-2 sm:h-[3.75rem] sm:min-h-[3.75rem] sm:gap-4">
          <div className="min-w-0 flex-1 shrink">
            <Logo
              showTagline
              theme={light ? "dark" : "light"}
              tagline={t("brand.navTagline")}
              markSize={32}
              className="min-w-0"
            />
          </div>

          <nav className="hidden items-center gap-6 lg:flex" aria-label={t("nav.ariaMain")}>
            {navItems.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "inline-flex min-h-10 items-center text-[0.8125rem] font-medium transition-colors",
                  light
                    ? "text-ortaq-cream/75 hover:text-ortaq-cream"
                    : "text-ortaq-ink-muted hover:text-ortaq-ink",
                  pathname === href || (href === "/corridors" && pathname.startsWith("/corridors"))
                    ? light
                      ? "text-ortaq-cream"
                      : "text-ortaq-ink"
                    : "",
                )}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/demo" className="hidden sm:block">
              <Button variant={light ? "light" : "primary"} size="sm">
                {t("nav.startDemo")}
              </Button>
            </Link>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-ortaq-md border lg:hidden",
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
            <ul className="space-y-0">
              {navItems.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center text-[0.9375rem]",
                      light ? "text-ortaq-cream" : "text-ortaq-ink",
                    )}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/demo" onClick={() => setOpen(false)}>
                  <Button variant="primary" fullWidth size="sm">
                    {t("nav.startDemo")}
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
