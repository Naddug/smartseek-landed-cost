import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { user } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<{ suppliers: number; countries: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats({ suppliers: d.suppliers, countries: d.countries }))
      .catch(() => setStats(null));
  }, []);

  const navLinks = (
    <>
      <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.howItWorks")}</a>
      <Link href="/suppliers" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.suppliers")}</Link>
      <Link href="/rfq" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.rfq")}</Link>
      <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.pricing")}</Link>
      <Link href="/faq" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.faq")}</Link>
      <Link href="/integrations" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.integrations")}</Link>
    </>
  );

  const isIntegrationsPage = location === "/integrations";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      {/* Top bar - Trust strip (hidden on Integrations to avoid double header) */}
      {!isIntegrationsPage && (
      <div className="bg-slate-900/95 border-b border-slate-700/50 py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-8 text-xs text-slate-400">
          <span className="hidden sm:inline">{t("trust.strip1")}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">
            {stats ? `${formatStat(stats.suppliers)} verified suppliers` : t("trust.strip2")}
          </span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">{t("trust.strip3")}</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">
            {stats ? `${formatStat(stats.countries)} countries` : t("trust.strip4")}
          </span>
        </div>
      </div>
      )}

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg group-hover:scale-105 transition-transform shadow-lg shadow-primary/20 shrink-0">
              S
            </div>
            <span className="text-lg sm:text-xl font-heading font-bold tracking-tight truncate">SmartSeek</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks}
          </nav>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden shrink-0">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(85vw,320px)] flex flex-col gap-4 pt-8 pb-[env(safe-area-inset-bottom)]">
              <div className="flex flex-col gap-1">{navLinks}</div>
              <div className="pt-4 border-t border-border">
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            {user ? (
              <Button onClick={() => setLocation('/dashboard')} size="sm" className="font-medium text-sm sm:text-base">{t("nav.dashboard")}</Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-sm sm:text-base px-2 sm:px-3">{t("nav.login")}</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="font-medium text-sm sm:text-base shadow-lg shadow-primary/25 px-3 sm:px-4">{t("nav.tryFree")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </main>

      <footer className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">S</div>
                <span className="text-xl font-heading font-bold">SmartSeek</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                {t("footer.tagline")}
              </p>
              <p className="text-xs text-muted-foreground/80 mb-6">{t("footer.designedFor")}</p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-xs">
                <input
                  type="email"
                  placeholder={t("footer.newsletterPlaceholder")}
                  className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button size="sm" className="shrink-0 w-full sm:w-auto">{t("footer.subscribe")}</Button>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">{t("footer.platform")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">{t("footer.pricing")}</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">{t("footer.faq")}</Link></li>
                <li><Link href="/suppliers" className="hover:text-foreground transition-colors">{t("footer.supplierDirectory")}</Link></li>
                <li><Link href="/smart-finder" className="hover:text-foreground transition-colors">{t("footer.smartSeekAI")}</Link></li>
                <li><Link href="/landed-cost" className="hover:text-foreground transition-colors">{t("footer.landedCost")}</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground transition-colors">{t("footer.integrations")}</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">{t("footer.company")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">{t("footer.about")}</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SmartSeek. {t("footer.copyright")}.
          </div>
        </div>
      </footer>
    </div>
  );
}