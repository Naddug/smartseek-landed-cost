import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  ShoppingBag, 
  Settings, 
  LogOut,
  CreditCard,
  ShieldCheck,
  Calculator
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col fixed h-full z-40">
        <div className="p-6">
          <Link href="/dashboard">
            <a className="flex items-center gap-2 text-sidebar-foreground">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">S</div>
              <span className="font-heading font-bold text-xl">SmartSeek</span>
            </a>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/dashboard')} />
          <NavItem href="/smart-finder" icon={<Search size={20} />} label="Smart Finder" active={isActive('/smart-finder')} />
          <NavItem href="/reports" icon={<FileText size={20} />} label="My Reports" active={isActive('/reports')} />
          <NavItem href="/shortlists" icon={<ShoppingBag size={20} />} label="Curated Shortlists" active={isActive('/shortlists')} />
          <NavItem href="/tools" icon={<Calculator size={20} />} label="Tools & Calc" active={isActive('/tools')} />
          
          {user?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-2 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">Admin</div>
              <NavItem href="/admin" icon={<ShieldCheck size={20} />} label="Admin Panel" active={isActive('/admin')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-4 mb-4">
            <div className="text-xs text-sidebar-foreground/70 mb-1">Available Credits</div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-sidebar-foreground">{user?.credits || 0}</span>
              <Button size="sm" variant="secondary" className="h-6 px-2 text-xs" onClick={() => setLocation('/billing')}>Top Up</Button>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background/50 backdrop-blur sticky top-0 z-30 px-8 flex items-center justify-between">
          <h1 className="font-heading font-semibold text-lg capitalize">{location.split('/')[1]?.replace('-', ' ') || 'Dashboard'}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user?.email} <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs uppercase font-bold ml-2">{user?.plan}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <a className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
        active 
          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md' 
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}>
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
}