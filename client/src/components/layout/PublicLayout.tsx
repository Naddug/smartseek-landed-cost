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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { data: user, isLoading: authLoading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Stats fetch removed: do not expose scale publicly during beta.

  const navLinks = (
    <>
      <Link href="/search" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("publicNav.suppliers")}</Link>
      <Link href="/rfq" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("publicNav.submitRfq")}</Link>
      <Link href="/become-a-supplier" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("publicNav.becomeSupplier")}</Link>
      <Link href="/trust" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("publicNav.trustVerification")}</Link>
      <Link href="/signup" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors block">{t("publicNav.betaAccess")}</Link>
    </>
  );

  const isIntegrationsPage = location === "/integrations";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      {/* Top bar - Beta status strip */}
      {!isIntegrationsPage && (
      <div className="bg-slate-900/95 border-b border-slate-700/50 py-2">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="font-semibold text-amber-300">{t("publicBanner.freeDuringBeta")}</span>
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline">{t("publicBanner.foundingSupport")}</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <Link href="/signup" className="hidden md:inline underline underline-offset-2 hover:text-white">{t("publicBanner.requestAccess")}</Link>
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
              <Button onClick={() => setLocation('/app/dashboard')} size="sm" className="font-medium text-sm sm:text-base">{t("nav.dashboard")}</Button>
            ) : !authLoading ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-sm sm:text-base px-2 sm:px-3">{t("nav.login")}</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="font-medium text-sm sm:text-base shadow-lg shadow-primary/25 px-3 sm:px-4">{t("publicNav.requestBetaAccess")}</Button>
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
        {/* Beta methodology strip — credibility without fake scale */}
        <div className="border-b border-border bg-slate-100/80 dark:bg-slate-800/50 py-8 sm:py-10">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-6">
              {t("publicFooter.howItWorks")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center max-w-4xl mx-auto">
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">{t("publicFooter.curatedNetworkTitle")}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{t("publicFooter.curatedNetworkDesc")}</div>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">{t("publicFooter.verificationFirstTitle")}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{t("publicFooter.verificationFirstDesc")}</div>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">{t("publicFooter.operatorRfqTitle")}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{t("publicFooter.operatorRfqDesc")}</div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
              <Link href="/methodology" className="underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-200">{t("publicFooter.readMethodology")}</Link>
            </p>
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
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{t("publicFooter.sourcing")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/search" className="hover:text-foreground transition-colors">{t("publicNav.suppliers")}</Link></li>
                <li><Link href="/rfq" className="hover:text-foreground transition-colors">{t("publicNav.submitRfq")}</Link></li>
                <li><Link href="/become-a-supplier" className="hover:text-foreground transition-colors">{t("publicNav.becomeSupplier")}</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">{t("publicNav.betaAccess")}</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{t("publicFooter.trust")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/trust" className="hover:text-foreground transition-colors">{t("publicNav.trustVerification")}</Link></li>
                <li><Link href="/methodology" className="hover:text-foreground transition-colors">{t("publicFooter.methodology")}</Link></li>
                <li><Link href="/verification" className="hover:text-foreground transition-colors">{t("publicFooter.verificationStandards")}</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">{t("publicFooter.company")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">{t("footer.about")}</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
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
