import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppContainer } from "@/components/shared/AppContainer";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/firsatlar", label: "Fırsatlar" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/guven-kalite", label: "Güven & Kalite" },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-ortaq-line bg-ortaq-surface/95 backdrop-blur supports-[backdrop-filter]:bg-ortaq-surface/80",
        className
      )}
    >
      <AppContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-heading text-xl font-bold tracking-tight text-ortaq-navy"
            >
              ORTAQ
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-ortaq-text-muted transition-colors hover:text-ortaq-navy"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/giris">
              <Button variant="ghost" size="sm">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/kayit/yol-secimi">
              <Button size="sm">Fırsat Dosyası Oluştur</Button>
            </Link>
          </div>
        </div>
      </AppContainer>
    </header>
  );
}
