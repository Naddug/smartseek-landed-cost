import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight, Check, Search, Shield, Globe, Clock, DollarSign, BarChart3, TrendingUp, Layers, Zap, XCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/abstract_global_trade_network_visualization.png";
import reportPreview from "@assets/generated_images/close-up_of_a_professional_sourcing_report_on_a_tablet.png";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              The Intelligent Sourcing Engine for Modern Brands
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground leading-tight">
              Stop Guessing. <br/> Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sourcing With Data.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              SmartSeek replaces weeks of manual supplier research with AI-powered intelligence. 
              Get professional sourcing reports, verified supplier shortlists, and accurate landed cost calculations in minutes, not months.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Start Sourcing For Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sample-report">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-primary/20 hover:bg-muted/50">
                  View Sample Report
                </Button>
              </Link>
            </div>
            
            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No Credit Card Required</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 10 Free Credits</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Instant Reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props / Stats */}
      <section className="py-12 border-y bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value="90%" label="Time Saved vs Manual Research" />
            <StatItem value="30%" label="Avg. Cost Reduction Found" />
            <StatItem value="50+" label="Global Regions Analyzed" />
            <StatItem value="24/7" label="AI Consultant Availability" />
          </div>
        </div>
      </section>

      {/* Report Preview Section - "The Product" */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl font-heading font-bold">Professional Sourcing Intelligence, <br/><span className="text-primary">Instantly Generated.</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most sourcing tools just give you a list of links. SmartSeek acts as your <strong>Strategy Consultant</strong>. 
                Our Smart Finder reports provide deep, actionable insights that help you make profitable decisions before you spend a dollar.
              </p>
              
              <div className="space-y-6">
                <FeatureRow 
                  icon={<Shield className="w-6 h-6 text-green-500" />}
                  title="Risk Assessment Scoring"
                  desc="We analyze geopolitical stability, compliance history, and supply chain vulnerabilities to give every option a Risk Score (0-100)."
                />
                <FeatureRow 
                  icon={<DollarSign className="w-6 h-6 text-blue-500" />}
                  title="Landed Cost & Margin Analysis"
                  desc="Don't just see the factory price. See the real cost to your door, including duties, shipping, and taxes, with projected profit margins."
                />
                <FeatureRow 
                  icon={<Layers className="w-6 h-6 text-purple-500" />}
                  title="Curated Supplier Shortlists"
                  desc="We filter through the noise to present only verified, high-potential partners that match your specific MOQ and quality needs."
                />
              </div>
              
              <Link href="/sample-report">
                <Button size="lg" className="mt-4">
                  View Sample Report <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl transform rotate-3 scale-95 opacity-50"></div>
              <img 
                src={reportPreview} 
                alt="SmartSeek Report Preview" 
                className="relative rounded-2xl shadow-2xl border border-border/50 w-full hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Projected Margin</div>
                    <div className="text-xl font-bold text-foreground">55%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">How SmartSeek Works</h2>
            <p className="text-lg text-muted-foreground">From idea to verified supplier in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>

            <StepCard 
              step="01"
              icon={<Search className="w-8 h-8 text-primary" />}
              title="Input Your Requirements"
              desc="Tell our Smart Finder what you need (e.g., 'Eco-friendly bamboo packaging, <$2/unit, MOQ 500')."
            />
            <StepCard 
              step="02"
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="AI Market Analysis"
              desc="Our engine scans global databases, calculates costs, checks compliance, and filters millions of data points."
            />
            <StepCard 
              step="03"
              icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
              title="Actionable Strategy"
              desc="Receive a comprehensive report with a supplier shortlist, action plan, and negotiation scripts."
            />
          </div>
        </div>
      </section>

      {/* Comparison Section - Why Us? */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Why Smart Buyers Choose SmartSeek</h2>
            <p className="text-lg text-muted-foreground">Stop wasting time with outdated methods.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ComparisonCard 
              title="Manual Searching"
              pros={["Free (monetarily)", "Full control"]}
              cons={["Takes 40+ hours", "High risk of scams", "No cost verification", "Overwhelming data"]}
              isBad
            />
             <ComparisonCard 
              title="Sourcing Agencies"
              pros={["Hands-off", "Experienced agents"]}
              cons={["Expensive ($1000+)", "Slow turnaround", "Hidden commissions", "Communication gaps"]}
              isBad
            />
             <ComparisonCard 
              title="SmartSeek Platform"
              pros={["Instant Results", "Data-Driven (No Bias)", "Low Cost ($10/mo)", "Risk & Cost Analysis"]}
              cons={[]}
              isHero
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">For E-Commerce Sellers</Badge>
              <h3 className="text-3xl font-bold">Dominate Amazon FBA & Dropshipping</h3>
              <p className="text-lg text-sidebar-foreground/80 leading-relaxed">
                Margins are everything in e-commerce. SmartSeek helps you find <strong>high-margin, low-competition products</strong> fast.
                Identify "sleeping giant" suppliers that competitors haven't found yet and calculate your exact profitability including FBA fees and shipping.
              </p>
              <ul className="space-y-2">
                 <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Verify supplier MOQs instantly</li>
                 <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Ensure product safety compliance</li>
                 <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /> Find "Factory Direct" pricing</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/20">For Enterprise Buyers</Badge>
              <h3 className="text-3xl font-bold">Streamline Procurement & Risk</h3>
              <p className="text-lg text-sidebar-foreground/80 leading-relaxed">
                Diversify your supply chain away from high-risk regions. SmartSeek's <strong>Risk Analysis Engine</strong> helps professional buyers
                build resilient supply networks. Compare multiple regions (e.g., Vietnam vs. India vs. Mexico) in seconds to find the best balance of cost and stability.
              </p>
               <ul className="space-y-2">
                 <li className="flex items-center gap-2"><Check className="w-5 h-5 text-accent" /> Geo-political risk monitoring</li>
                 <li className="flex items-center gap-2"><Check className="w-5 h-5 text-accent" /> Multi-region cost comparison</li>
                 <li className="flex items-center gap-2"><Check className="w-5 h-5 text-accent" /> Export-ready PDF reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
           <div className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center border border-primary/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 p-32 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
             
             <div className="relative z-10 max-w-2xl mx-auto space-y-8">
               <h2 className="text-4xl font-heading font-bold">Ready to Revolutionize Your Sourcing?</h2>
               <p className="text-xl text-muted-foreground">
                 Join thousands of smart buyers who are saving time and boosting margins with SmartSeek.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/signup">
                   <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg">
                     Get Started with 10 Free Credits
                   </Button>
                 </Link>
                 <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
                   No credit card required for free tier.
                 </p>
               </div>
             </div>
           </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="p-6">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{value}</div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 p-2 bg-card rounded-lg border shadow-sm h-fit">{icon}</div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function StepCard({ step, icon, title, desc }: { step: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="relative bg-card p-8 rounded-2xl border shadow-sm z-10 hover:-translate-y-1 transition-transform duration-300">
      <div className="text-6xl font-bold text-muted/20 absolute top-4 right-6 pointer-events-none">{step}</div>
      <div className="mb-6 p-3 bg-primary/10 w-fit rounded-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

function ComparisonCard({ title, pros, cons, isBad, isHero }: { title: string, pros: string[], cons: string[], isBad?: boolean, isHero?: boolean }) {
  return (
    <div className={`p-8 rounded-2xl border ${isHero ? 'bg-card shadow-2xl ring-2 ring-primary scale-105 z-10' : 'bg-muted/30 opacity-90'}`}>
      <h3 className={`text-2xl font-bold mb-6 ${isHero ? 'text-primary' : ''}`}>{title}</h3>
      
      {isHero && <Badge className="mb-6 bg-primary text-primary-foreground">Recommended</Badge>}

      <div className="space-y-6">
        {pros.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-3">Pros</div>
            <ul className="space-y-2">
              {pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" /> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {cons.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-3">Cons</div>
            <ul className="space-y-2">
              {cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5" /> {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}