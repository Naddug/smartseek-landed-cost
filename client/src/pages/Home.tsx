import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight, Check, Search, Shield, Globe } from "lucide-react";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/abstract_global_trade_network_visualization.png";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Sourcing Intelligence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground">
              Sourcing Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Intelligent</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find verified suppliers, analyze landed costs, and assess risks in seconds. 
              SmartSeek uses AI to act as your global sourcing consultant.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/25">
                  Start Sourcing Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-accent" />}
              title="Smart Finder"
              desc="Describe your product needs and let our AI generate a comprehensive sourcing report with supplier shortlists."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Risk Analysis"
              desc="Automatic compliance checks and risk scoring for every potential supplier and region."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-indigo-500" />}
              title="Global Reach"
              desc="Access curated supplier networks across 50+ countries with localized landed cost calculations."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">Start for free, upgrade for power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border bg-card relative overflow-hidden">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-6">$0</div>
              <p className="text-muted-foreground mb-8">Perfect for exploring the platform.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> 10 Free Credits</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Basic Reports</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Standard Support</li>
              </ul>
              <Link href="/auth">
                <Button className="w-full" variant="outline">Sign Up Free</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-primary bg-card relative overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$10<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <p className="text-muted-foreground mb-8">For serious buyers and sellers.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Monthly Credit Allowance</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Access Curated Shortlists</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Advanced Risk Tools</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Priority Sourcing Tickets</li>
              </ul>
              <Link href="/auth">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6 p-3 bg-muted w-fit rounded-lg">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}