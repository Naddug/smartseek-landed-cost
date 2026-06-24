"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppContainer } from "@/components/shared/AppContainer";
import { UserMenu, signOutUser } from "@/components/shared/UserMenu";
import { OrtaqLogo } from "@/components/brand/OrtaqLogo";
import { cn } from "@/lib/utils";
import { getNavUserFromSession } from "@/lib/panel/nav-user";

const navLinks = [
  { href: "/firsatlar", label: "Fırsatlar" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/guven-kalite", label: "Güven & Kalite" },
];

interface MarketingNavProps {
  className?: string;
}

export function MarketingNav({ className }: MarketingNavProps) {
  const { data: session, status } = useSession();
  const navUser = getNavUserFromSession(session ?? null);
  const isAuthenticated = status === "authenticated" && navUser;

  const initials = navUser?.firstName?.slice(0, 2).toUpperCase() ?? "OR";
  const displayName = navUser?.firstName ?? navUser?.email ?? "Kullanıcı";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-ortaq-line bg-white/85 backdrop-blur-md",
        className
      )}
    >
      <AppContainer className="h-full">
        <div className="flex h-full items-center justify-between gap-4">
          <Link href="/" aria-label="ORTAQ ana sayfa" className="shrink-0">
            <OrtaqLogo />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ortaq-text-secondary transition-colors hover:text-ortaq-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/firsatlar"
            className="text-sm font-medium text-ortaq-text-secondary transition-colors hover:text-ortaq-navy md:hidden"
          >
            Fırsatlar
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/panel">
                  <Button
                    size="sm"
                    className="hidden bg-ortaq-action hover:bg-ortaq-action-strong sm:inline-flex"
                  >
                    Panele Git
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <UserMenu
                  displayName={displayName}
                  initials={initials}
                  items={[
                    { label: "Panelim", href: "/panel" },
                    { label: "Fırsatlarım", href: "/panel/firsatlarim" },
                    {
                      label: "Çıkış",
                      onClick: signOutUser,
                      variant: "danger",
                    },
                  ]}
                />
              </>
            ) : (
              <>
                <Link href="/giris">
                  <Button variant="ghost" size="sm" className="text-ortaq-text-secondary">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit/yol-secimi">
                  <Button size="sm" className="bg-ortaq-action hover:bg-ortaq-action-strong">
                    Fırsat Dosyası Oluştur
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </AppContainer>
    </header>
  );
}
