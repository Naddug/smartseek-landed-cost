import { Link, useLocation } from "wouter";
import { useProfile, useUser } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  ShoppingBag, 
  LogOut,
  ShieldCheck,
  Calculator,
  Crown,
  Menu,
  X,
  Landmark,
  Ship,
  BarChart3,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user } = useUser();
  const { data: profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-lg shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-full z-40 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6">
          <Link href="/dashboard">
            <span className="flex items-center gap-2 text-sidebar-foreground cursor-pointer">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">S</div>
              <span className="font-heading font-bold text-xl">SmartSeek</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/dashboard')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/search" icon={<Search size={20} />} label="Universal Search" active={isActive('/search')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/smart-finder" icon={<Sparkles size={20} />} label="Smart Finder AI" active={isActive('/smart-finder')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/reports" icon={<FileText size={20} />} label="My Reports" active={isActive('/reports')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/shortlists" icon={<ShoppingBag size={20} />} label="Curated Shortlists" active={isActive('/shortlists')} onClick={() => setMobileOpen(false)} />
          
          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">Trade Tools</div>
          <NavItem href="/trade-data" icon={<BarChart3 size={20} />} label="Trade Data" active={isActive('/trade-data')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/customs-calculator" icon={<Landmark size={20} />} label="Customs Calculator" active={isActive('/customs-calculator')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/shipping-estimator" icon={<Ship size={20} />} label="Shipping Estimator" active={isActive('/shipping-estimator')} onClick={() => setMobileOpen(false)} />
          <NavItem href="/tools" icon={<Calculator size={20} />} label="All Tools" active={isActive('/tools')} onClick={() => setMobileOpen(false)} />
          
          {profile?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">Admin</div>
              <NavItem href="/admin" icon={<ShieldCheck size={20} />} label="Admin Panel" active={isActive('/admin')} onClick={() => setMobileOpen(false)} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-sidebar-foreground/70">Available Credits</div>
              {profile?.plan === 'pro' && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs h-5">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-sidebar-foreground">{profile?.credits || 0}</span>
              <Button size="sm" variant="secondary" className="h-6 px-2 text-xs" onClick={() => setLocation('/billing')}>
                {profile?.plan === 'pro' ? 'Manage' : 'Upgrade'}
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
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background/50 backdrop-blur sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="md:hidden w-10"></div>
          <h1 className="font-heading font-semibold text-lg capitalize">{location.split('/')[1]?.replace('-', ' ') || 'Dashboard'}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden md:block">
              {(user?.claims as any)?.name || (user?.claims as any)?.preferred_username || 'User'}
            </div>
            <Badge variant="outline" className="text-xs uppercase">
              {profile?.plan || 'free'}
            </Badge>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
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
