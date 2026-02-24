import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { user } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      {/* Top bar - Trust strip (IndexBox-style) */}
      <div className="bg-slate-900/95 border-b border-slate-700/50 py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-8 text-xs text-slate-400">
          <span className="hidden sm:inline">Trusted by sourcing teams worldwide</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">100,000+ verified suppliers</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">Mining & minerals</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">24+ countries</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              S
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">SmartSeek</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks}
          </nav>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col gap-4 pt-8">
              <div className="flex flex-col gap-1">{navLinks}</div>
              <div className="pt-4 border-t border-border">
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
            <LanguageSwitcher />
            {user ? (
              <Button onClick={() => setLocation('/dashboard')} className="font-medium">{t("nav.dashboard")}</Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium">{t("nav.login")}</Button>
                </Link>
                <Link href="/signup">
                  <Button className="font-medium shadow-lg shadow-primary/25">{t("nav.tryFree")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
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
              <div className="flex gap-2 max-w-xs">
                <input
                  type="email"
                  placeholder="Get sourcing insights"
                  className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button size="sm" className="shrink-0">Subscribe</Button>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/suppliers" className="hover:text-foreground transition-colors">Supplier Directory</Link></li>
                <li><Link href="/smart-finder" className="hover:text-foreground transition-colors">SmartSeek AI</Link></li>
                <li><Link href="/landed-cost" className="hover:text-foreground transition-colors">Landed Cost</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SmartSeek. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}