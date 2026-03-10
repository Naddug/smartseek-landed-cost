import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useProfile, useUser } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  LogOut,
  ShieldCheck,
  Shield,
  ClipboardCheck,
  Calculator,
  Crown,
  Menu,
  X,
  Landmark,
  Ship,
  BarChart3,
  Sparkles,
  CreditCard,
  Target,
  Bot,
  Users,
  Home
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Wordmark } from "@/components/Logo";

const CREDITS_BANNER_DISMISSED = "smartseek_credits_banner_dismissed";

export default function AppLayout({ children, unverifiedEmail }: { children: React.ReactNode; unverifiedEmail?: boolean }) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { data: user } = useUser();
  const { data: profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCreditsBanner, setShowCreditsBanner] = useState(false);
  const [emailBannerDismissed, setEmailBannerDismissed] = useState(false);

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  useEffect(() => {
    if (profile && totalCredits <= 1 && profile.plan === "free") {
      const dismissed = localStorage.getItem(CREDITS_BANNER_DISMISSED);
      if (!dismissed) setShowCreditsBanner(true);
    } else {
      setShowCreditsBanner(false);
    }
  }, [profile, totalCredits]);

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const isActive = (path: string) => {
    const base = location.split("?")[0];
    return base === path || (path !== "/" && base.startsWith(path + "/"));
  };

  const getPageTitle = (path: string) => {
    const slug = path.split('/')[1] || 'dashboard';
    const titles: Record<string, string> = {
      dashboard: t('nav.app.dashboard'),
      'smart-finder': t('nav.app.smartFinder'),
      'ai-agent': t('nav.app.aiAgent'),
      'find-leads': t('nav.app.findLeads'),
      suppliers: t('nav.app.suppliers'),
      reports: t('nav.app.reports'),
      billing: t('nav.app.billing'),
      'trade-data': t('nav.app.tradeData'),
      'landed-cost': t('nav.app.landedCost'),
      'customs-calculator': t('nav.app.customs'),
      'shipping-estimator': t('nav.app.shipping'),
      'risk-intelligence': t('nav.app.risk'),
      compliance: t('nav.app.compliance'),
      tools: t('nav.app.tools'),
      admin: t('nav.app.admin'),
    };
    return titles[slug] || slug.replace(/-/g, ' ');
  };

  return (
    <div className="min-h-screen bg-background flex min-w-0">
      {/* Mobile menu button - safe area aware */}
      <button 
        className="md:hidden fixed z-50 p-2.5 bg-background border rounded-lg shadow-sm top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.5rem,env(safe-area-inset-left))]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? t('nav.app.closeMenu') : t('nav.app.openMenu')}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-full z-40 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6">
          <Link href="/">
            <Wordmark iconClassName="w-8 h-8" className="text-xl" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label={t('nav.app.dashboard')} active={isActive('/dashboard')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/smart-finder" icon={<Sparkles size={20} />} label={t('nav.app.smartFinder')} active={isActive('/smart-finder')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/ai-agent" icon={<Bot size={20} />} label={t('nav.app.aiAgent')} active={isActive('/ai-agent')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/find-leads" icon={<Target size={20} />} label={t('nav.app.findLeads')} active={isActive('/find-leads')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/suppliers" icon={<Users size={20} />} label={t('nav.app.suppliers')} active={isActive('/suppliers')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/reports" icon={<FileText size={20} />} label={t('nav.app.reports')} active={isActive('/reports')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/billing" icon={<CreditCard size={20} />} label={t('nav.app.billing')} active={isActive('/billing')} onClick={() => setMobileOpen(false)} />

          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">{t('nav.app.tradeTools')}</div>
          <NavItem href="/trade-data" icon={<BarChart3 size={20} />} label={t('nav.app.tradeData')} active={isActive('/trade-data')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/landed-cost" icon={<Calculator size={20} />} label={t('nav.app.landedCost')} active={isActive('/landed-cost')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/customs-calculator" icon={<Landmark size={20} />} label={t('nav.app.customs')} active={isActive('/customs-calculator')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/shipping-estimator" icon={<Ship size={20} />} label={t('nav.app.shipping')} active={isActive('/shipping-estimator')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/risk-intelligence" icon={<Shield size={20} />} label={t('nav.app.risk')} active={isActive('/risk-intelligence')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/compliance" icon={<ClipboardCheck size={20} />} label={t('nav.app.compliance')} active={isActive('/compliance')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/tools" icon={<Calculator size={20} />} label={t('nav.app.tools')} active={isActive('/tools')} onClick={() => setMobileOpen(false)} />

          {profile?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">{t('nav.app.admin')}</div>
              <NavItem href="/admin" icon={<ShieldCheck size={20} />} label={t('nav.app.admin')} active={isActive('/admin')} onClick={() => setMobileOpen(false)} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className={`rounded-lg p-4 mb-4 ${totalCredits === 0 ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-sidebar-accent/50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-sidebar-foreground/70">{t('nav.app.availableCredits')}</div>
              {profile?.plan === 'monthly' && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs h-5">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-sidebar-foreground">{(profile?.monthlyCredits || 0) + (profile?.topupCredits || 0)}</span>
                {profile?.plan === 'monthly' && <span className="block text-[10px] text-sidebar-foreground/60">{t('nav.app.refreshesMonthly')}</span>}
              </div>
              <Button size="sm" variant="secondary" className="h-6 px-2 text-xs" onClick={() => setLocation('/billing')}>
                {profile?.plan === 'monthly' ? t('nav.app.manage') : t('nav.app.buyMore')}
              </Button>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            {t('nav.app.logOut')}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0 w-full">
        <header className="h-14 sm:h-16 border-b border-border/60 bg-background/95 backdrop-blur sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between pt-[env(safe-area-inset-top)]">
          <div className="md:hidden w-10 shrink-0"></div>
          <h1 className="font-heading font-semibold text-base sm:text-lg capitalize flex-1 min-w-0 mx-2 overflow-hidden text-ellipsis whitespace-nowrap">{getPageTitle(location)}</h1>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="text-sm text-muted-foreground hidden md:block truncate max-w-[120px]">
              {user?.firstName || user?.email?.split('@')[0] || 'User'}
            </div>
            {profile?.plan === 'monthly' ? (
              <Badge variant="outline" className="text-xs uppercase">
                Pro
              </Badge>
            ) : (
              <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded uppercase font-medium">{t('nav.app.freePlan')}</span>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-w-0">
          {unverifiedEmail && !emailBannerDismissed && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 px-4 py-3 text-blue-800 dark:text-blue-200">
              <span>{t('nav.app.verifyEmailBanner')}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={async () => {
                    await fetch("/api/auth/resend-verification", { method: "POST", credentials: "include" });
                  }}
                  className="text-sm underline hover:no-underline text-blue-700 dark:text-blue-300"
                >
                  {t('nav.app.resend')}
                </button>
                <button onClick={() => setEmailBannerDismissed(true)} className="text-blue-600 hover:text-blue-800 p-1" aria-label="Dismiss">×</button>
              </div>
            </div>
          )}
          {showCreditsBanner && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-800 dark:text-amber-200">
              <span>
                {t('nav.app.creditsWarning', { count: totalCredits })}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/billing">
                  <Button size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-500/20">
                    {t('nav.app.buyCredits')}
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    localStorage.setItem(CREDITS_BANNER_DISMISSED, "1");
                    setShowCreditsBanner(false);
                  }}
                  className="text-amber-600 hover:text-amber-800 p-1"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active, onClick }: { href: string, icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) {
  return (
    <Link href={href}>
      <span
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer text-sm ${
          active
            ? 'bg-sidebar-primary/90 text-sidebar-primary-foreground font-medium shadow-sm'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:pl-4'
        }`}
        onClick={onClick}
        data-testid={`nav-${href.replace('/', '')}`}
      >
        <span className="shrink-0 opacity-80">{icon}</span>
        <span className="truncate">{label}</span>
        {active && <span className="ml-auto w-1 h-4 rounded-full bg-sidebar-primary-foreground/40" />}
      </span>
    </Link>
  );
}
