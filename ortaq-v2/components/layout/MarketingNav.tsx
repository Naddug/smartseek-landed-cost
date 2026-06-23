"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppContainer } from "@/components/shared/AppContainer";
import { UserMenu, signOutUser } from "@/components/shared/UserMenu";
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
        "sticky top-0 z-50 h-14 border-b border-stone-100 bg-white/90 backdrop-blur-sm",
        className
      )}
    >
      <AppContainer className="h-full">
        <div className="flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tight text-stone-950"
          >
            ORTAQ
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/firsatlar"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950 md:hidden"
          >
            Fırsatlar
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/panel">
                  <Button
                    size="sm"
                    className="hidden bg-blue-600 hover:bg-blue-700 sm:inline-flex"
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
                  <Button variant="ghost" size="sm" className="text-stone-700">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit/yol-secimi">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
