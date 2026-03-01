import { Link, useLocation } from "wouter";
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
import { Logo } from "@/components/Logo";

const CREDITS_BANNER_DISMISSED = "smartseek_credits_banner_dismissed";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user } = useUser();
  const { data: profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCreditsBanner, setShowCreditsBanner] = useState(false);

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
      dashboard: 'Dashboard',
      'smart-finder': 'SmartSeek AI',
      'ai-agent': 'AI Agent',
      'find-leads': 'Find Leads',
      suppliers: 'Suppliers',
      reports: 'Reports',
      billing: 'Billing',
      'trade-data': 'Trade Data',
      'landed-cost': 'Landed Cost',
      'customs-calculator': 'Customs',
      'shipping-estimator': 'Shipping',
      'risk-intelligence': 'Risk',
      compliance: 'Compliance',
      tools: 'Tools',
      admin: 'Admin',
    };
    return titles[slug] || slug.replace(/-/g, ' ');
  };

  return (
    <div className="min-h-screen bg-background flex min-w-0">
      {/* Mobile menu button - safe area aware */}
      <button 
        className="md:hidden fixed z-50 p-2.5 bg-background border rounded-lg shadow-sm top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.5rem,env(safe-area-inset-left))]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-full z-40 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6">
          <Link href="/">
            <span className="flex items-center gap-2 text-sidebar-foreground cursor-pointer">
              <Logo size="sm" className="rounded-lg w-8 h-8" />
              <span className="font-heading font-bold text-xl">SmartSeek</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/dashboard')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/smart-finder" icon={<Sparkles size={20} />} label="SmartSeek AI" active={isActive('/smart-finder')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/ai-agent" icon={<Bot size={20} />} label="AI Agent" active={isActive('/ai-agent')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/find-leads" icon={<Target size={20} />} label="Find Leads" active={isActive('/find-leads')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/suppliers" icon={<Users size={20} />} label="Suppliers" active={isActive('/suppliers')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/reports" icon={<FileText size={20} />} label="My Reports" active={isActive('/reports')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/billing" icon={<CreditCard size={20} />} label="Billing" active={isActive('/billing')} onClick={() => setMobileOpen(false)} />
          
          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">Trade Tools</div>
          <NavItem href="/trade-data" icon={<BarChart3 size={20} />} label="Trade Data" active={isActive('/trade-data')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/landed-cost" icon={<Calculator size={20} />} label="Landed Cost" active={isActive('/landed-cost')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/customs-calculator" icon={<Landmark size={20} />} label="Customs Calculator" active={isActive('/customs-calculator')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/shipping-estimator" icon={<Ship size={20} />} label="Shipping Estimator" active={isActive('/shipping-estimator')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/risk-intelligence" icon={<Shield size={20} />} label="Risk Intelligence" active={isActive('/risk-intelligence')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/compliance" icon={<ClipboardCheck size={20} />} label="Compliance" active={isActive('/compliance')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/tools" icon={<Calculator size={20} />} label="All Tools" active={isActive('/tools')} onClick={() => setMobileOpen(false)} />
          
          {profile?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">Admin</div>
              <NavItem href="/admin" icon={<ShieldCheck size={20} />} label="Admin Panel" active={isActive('/admin')} onClick={() => setMobileOpen(false)} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className={`rounded-lg p-4 mb-4 ${totalCredits === 0 ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-sidebar-accent/50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-sidebar-foreground/70">Available Credits</div>
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
                {profile?.plan === 'monthly' && <span className="block text-[10px] text-sidebar-foreground/60">Refreshes monthly</span>}
              </div>
              <Button size="sm" variant="secondary" className="h-6 px-2 text-xs" onClick={() => setLocation('/billing')}>
                {profile?.plan === 'monthly' ? 'Manage' : '+ Buy more'}
              </Button>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Log Out
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
        <header className="h-14 sm:h-16 border-b border-slate-600/60 bg-slate-700/90 backdrop-blur sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between pt-[env(safe-area-inset-top)]">
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
              <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded uppercase font-medium">Free Plan</span>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-w-0">
          {showCreditsBanner && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-800 dark:text-amber-200">
              <span>
                ⚠ You have {totalCredits} credit{totalCredits === 1 ? "" : "s"} left. Buy more to keep sourcing.
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/billing">
                  <Button size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-500/20">
                    Buy Credits →
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
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer ${
          active 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md' 
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
        onClick={onClick}
        data-testid={`nav-${href.replace('/', '')}`}
      >
        {icon}
        <span>{label}</span>
      </span>
    </Link>
  );
}
