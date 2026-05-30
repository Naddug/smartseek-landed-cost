import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@ortaq/components/brand/Logo";
import { Container } from "@ortaq/components/ui/Section";
import { toggleLocale } from "@ortaq/lib/i18n";
import { cn } from "@ortaq/lib/cn";

const navItems = [
  { href: "/#nasil-calisir", key: "howItWorks", match: "hash" as const },
  { href: "/sirket/ornek", key: "companies", match: "path" as const },
  { href: "/guven", key: "trust", match: "path" as const },
  { href: "/riskler", key: "risk", match: "path" as const },
] as const;

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ortaq-border bg-ortaq-bg">
      <Container>
        <div className="flex h-14 min-h-[3.5rem] items-center justify-between gap-4 sm:h-16">
          <Logo />

          <nav className="hidden items-center gap-6 lg:flex" aria-label={t("nav.ariaMain")}>
            {navItems.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "min-h-11 inline-flex items-center text-sm text-ortaq-ink-muted hover:text-ortaq-ink",
                  location === href && "text-ortaq-ink",
                )}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
            <Link
              href="/#nasil-calisir"
              className="min-h-11 inline-flex items-center text-sm text-ortaq-ink underline-offset-2 hover:underline"
            >
              {t("nav.cta")}
            </Link>
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-xs text-ortaq-ink-muted hover:text-ortaq-ink"
              aria-label={t("nav.langToggle")}
            >
              {i18n.language === "tr" ? "EN" : "TR"}
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-ortaq-border text-ortaq-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("nav.menu")}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-ortaq-border py-3 lg:hidden" aria-label={t("nav.ariaMobile")}>
            <ul className="space-y-0">
              {navItems.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center px-1 text-base text-ortaq-ink"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#nasil-calisir"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center px-1 text-base text-ortaq-ink underline-offset-2"
                >
                  {t("nav.cta")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => toggleLocale()}
                  className="flex min-h-11 w-full items-center px-1 text-left text-base text-ortaq-ink-muted"
                >
                  {i18n.language === "tr" ? "English" : "Türkçe"}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
