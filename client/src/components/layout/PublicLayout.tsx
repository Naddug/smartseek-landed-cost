import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">SmartSeek</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">How It Works</a>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
               <Button onClick={() => setLocation('/dashboard')}>Go to Dashboard</Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-heading font-bold text-lg mb-4">SmartSeek</div>
            <p className="text-sm text-muted-foreground">
              The AI-powered sourcing platform for modern buyers. Save time, reduce risk, and boost margins.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/smart-finder">SmartSeek AI</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}