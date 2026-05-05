import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Loader2, Check } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

function NewsletterForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: t("newsletter.invalidEmail"), description: t("newsletter.invalidEmailDesc"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setSubscribed(true);
      setEmail("");
      toast({ title: t("newsletter.subscribed"), description: t("newsletter.subscribedDesc") });
    } catch (err: any) {
      toast({ title: t("newsletter.subscriptionFailed"), description: err.message || "Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0 w-full">
      <input
        type="email"
        placeholder={t("footer.newsletterPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={subscribed}
        className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
      />
      <Button type="submit" size="sm" className="shrink-0 w-full sm:w-auto" disabled={loading || subscribed}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : subscribed ? <Check className="w-4 h-4 text-green-600" /> : t("footer.subscribe")}
      </Button>
    </form>
  );
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { data: user, isLoading: authLoading } = useUser();
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
      <Link href="/search" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.suppliers")}</Link>
      <Link href="/landed-cost" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">Calculator</Link>
      <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("nav.pricing")}</Link>
    </>
  );

  const isIntegrationsPage = location === "/integrations";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      {/* Top bar - Trust strip (hidden on Integrations to avoid double header) */}
      {!isIntegrationsPage && (
      <div className="bg-slate-900/95 border-b border-slate-700/50 py-2">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
          <span className="hidden sm:inline">{t("trust.strip1")}</span>
          <span className="hidden md:inline">•</span>
          {stats && stats.suppliers > 0 && <span>{`${formatStat(stats.suppliers)} ${t("trust.suppliersWord")}`}</span>}

          {stats && stats.countries > 0 && <><span className="hidden lg:inline">•</span><span>{`${stats.countries}+ ${t("trust.countriesWord")}`}</span></>}
        </div>
      </div>
      )}

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
          <Link href="/" className="group shrink-0 min-w-0">
            <Wordmark iconClassName="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-105 transition-transform" className="text-lg sm:text-xl" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5">
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
            {!authLoading && user ? (
              <Button onClick={() => setLocation('/dashboard')} size="sm" className="font-medium text-sm sm:text-base">{t("nav.dashboard")}</Button>
            ) : !authLoading ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-sm sm:text-base px-2 sm:px-3">{t("nav.login")}</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="font-medium text-sm sm:text-base shadow-lg shadow-primary/25 px-3 sm:px-4">{t("nav.tryFree")}</Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </main>

      <footer className="border-t border-border bg-slate-50/80 dark:bg-slate-900/30">
        {/* Platform overview - IndexBox-style stats strip (no duplicate CTA) */}
        <div className="border-b border-border bg-slate-100/80 dark:bg-slate-800/50 py-8 sm:py-10">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-6">
              {t("footer.platformOverview")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center max-w-4xl mx-auto">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">25.2M+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{t("footer.statSuppliers")}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">220+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{t("footer.statCountries")}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Multi-source</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{t("home.trust.registryVerified")}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Direct</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{t("home.trust.directSource")}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="mb-5">
                <Wordmark iconClassName="w-8 h-8 sm:w-10 sm:h-10" className="text-xl" />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
                {t("footer.tagline")}
              </p>
              <p className="text-xs text-muted-foreground/80 mb-6">{t("footer.designedFor")}</p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-xs">
                <NewsletterForm />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{t("footer.platform")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">{t("footer.pricing")}</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">{t("footer.faq")}</Link></li>
                <li><Link href="/search" className="hover:text-foreground transition-colors">{t("footer.supplierDirectory")}</Link></li>
                <li><Link href="/app/smart-finder" className="hover:text-foreground transition-colors">{t("footer.smartSeekAI")}</Link></li>
                <li><Link href="/app/landed-cost" className="hover:text-foreground transition-colors">{t("footer.landedCost")}</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground transition-colors">{t("footer.integrations")}</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{t("footer.company")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">{t("footer.about")}</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{t("footer.legal")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} SmartSeek. {t("footer.copyright")}.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}