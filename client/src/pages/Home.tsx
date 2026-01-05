import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight, Check, Search, Shield, Globe, Clock, DollarSign, BarChart3, TrendingUp, Layers, Zap, XCircle, CheckCircle2, Star, Users, Building2, Award } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import heroBg from "@assets/generated_images/abstract_global_trade_network_visualization.png";
import reportPreview from "@assets/generated_images/close-up_of_a_professional_sourcing_report_on_a_tablet.png";
import dashboardScreenshot from "@assets/generated_images/sourcing_dashboard_analytics_interface.png";
import reportScreenshot from "@assets/generated_images/sourcing_report_document_preview.png";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

type ComparisonKey = "manual" | "agency" | "smartseek";

export default function Home() {
  const [activeComparison, setActiveComparison] = useState<ComparisonKey>("smartseek");
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard");
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const comparisonData = {
    manual: {
      title: "Manual Research",
      time: "40+ hours",
      cost: "Free (your time)",
      risk: "High",
      features: [
        { text: "Full control over process", positive: true },
        { text: "No monthly fees", positive: true },
        { text: "Time-consuming research", positive: false },
        { text: "High risk of scams", positive: false },
        { text: "No cost verification", positive: false },
        { text: "Overwhelming data to sift through", positive: false }
      ]
    },
    agency: {
      title: "Sourcing Agencies",
      time: "2-4 weeks",
      cost: "$1,000+",
      risk: "Medium",
      features: [
        { text: "Hands-off experience", positive: true },
        { text: "Experienced agents", positive: true },
        { text: "Expensive retainer fees", positive: false },
        { text: "Slow turnaround time", positive: false },
        { text: "Hidden commissions", positive: false },
        { text: "Communication gaps", positive: false }
      ]
    },
    smartseek: {
      title: "SmartSeek Platform",
      time: "< 5 minutes",
      cost: "From $10/mo",
      risk: "Low",
      features: [
        { text: "Instant AI-powered results", positive: true },
        { text: "Data-driven, no bias", positive: true },
        { text: "Comprehensive risk analysis", positive: true },
        { text: "Accurate landed cost calculation", positive: true },
        { text: "24/7 availability", positive: true },
        { text: "Export-ready PDF reports", positive: true }
      ]
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </div>

        <motion.div 
          className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -left-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  AI-Powered Sourcing Intelligence
                </div>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]"
              >
                Stop Guessing.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  Start Sourcing With Data.
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground leading-relaxed max-w-xl"
              >
                SmartSeek replaces weeks of manual supplier research with AI-powered intelligence. 
                Get professional sourcing reports, verified supplier shortlists, and accurate landed cost calculations in minutes.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-start gap-4 pt-2"
              >
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300" data-testid="button-hero-signup">
                    Start Sourcing For Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sample-report">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-border hover:bg-muted/50 hover:border-primary/30 transition-all duration-300" data-testid="button-view-sample">
                    View Sample Report
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="pt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No Credit Card Required</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 10 Free Credits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Instant Reports</div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-2xl blur-3xl transform rotate-6 scale-95"></div>
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={dashboardScreenshot} 
                  alt="SmartSeek Dashboard" 
                  className="relative rounded-2xl shadow-2xl border border-border/50 w-full"
                />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-8 -left-8 bg-card p-4 rounded-xl shadow-xl border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Avg. Margin Found</div>
                    <div className="text-2xl font-bold text-foreground">+35%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-4 bg-card p-3 rounded-xl shadow-xl border border-border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={18} />
                  </div>
                  <div className="text-sm font-semibold">Report in 3 min</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof Section */}
      <motion.section 
        className="py-16 border-y bg-muted/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trusted by forward-thinking businesses worldwide</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <TrustLogo icon={<Building2 className="w-8 h-8" />} name="TechCorp" />
            <TrustLogo icon={<Globe className="w-8 h-8" />} name="GlobalTrade" />
            <TrustLogo icon={<Layers className="w-8 h-8" />} name="StackCommerce" />
            <TrustLogo icon={<BarChart3 className="w-8 h-8" />} name="DataDriven" />
            <TrustLogo icon={<Award className="w-8 h-8" />} name="PrimeSource" />
          </div>

          <motion.div 
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <StatItem value="2,500+" label="Active Users" />
            <StatItem value="90%" label="Time Saved" />
            <StatItem value="30%" label="Avg. Cost Reduction" />
            <StatItem value="50+" label="Countries Covered" />
          </motion.div>
        </div>
      </motion.section>

      {/* Dashboard Screenshot Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Platform Preview</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">See SmartSeek In Action</h2>
            <p className="text-lg text-muted-foreground">Explore our powerful dashboard and comprehensive reporting tools designed for modern sourcing professionals.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-muted/50 p-1.5 rounded-full">
                  <TabsTrigger 
                    value="dashboard" 
                    className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                    data-testid="tab-dashboard"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="report" 
                    className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                    data-testid="tab-report"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Sourcing Report
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-95 opacity-50"></div>
                
                <AnimatePresence mode="wait">
                  <TabsContent value="dashboard" className="mt-0">
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="relative"
                    >
                      <img 
                        src={dashboardScreenshot} 
                        alt="SmartSeek Analytics Dashboard" 
                        className="relative rounded-2xl shadow-2xl border border-border/50 w-full mx-auto max-w-5xl"
                      />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border">
                        <p className="text-sm font-medium">Global supplier analytics with real-time data visualization</p>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="report" className="mt-0">
                    <motion.div
                      key="report"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="relative"
                    >
                      <img 
                        src={reportScreenshot} 
                        alt="SmartSeek Sourcing Report" 
                        className="relative rounded-2xl shadow-2xl border border-border/50 w-full mx-auto max-w-5xl"
                      />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border">
                        <p className="text-sm font-medium">Comprehensive sourcing reports with risk assessment & cost breakdown</p>
                      </div>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase with Screenshots */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="lg:w-1/2 space-y-8" variants={fadeInUp}>
              <Badge className="bg-accent/10 text-accent border-accent/20">Intelligence Engine</Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                Professional Sourcing Intelligence,
                <br />
                <span className="text-primary">Instantly Generated.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most sourcing tools just give you a list of links. SmartSeek acts as your <strong>Strategy Consultant</strong>. 
                Our Smart Finder reports provide deep, actionable insights that help you make profitable decisions.
              </p>
              
              <div className="space-y-6">
                <FeatureRow 
                  icon={<Shield className="w-6 h-6 text-green-500" />}
                  title="Risk Assessment Scoring"
                  desc="Geopolitical stability, compliance history, and supply chain vulnerability analysis with Risk Scores (0-100)."
                />
                <FeatureRow 
                  icon={<DollarSign className="w-6 h-6 text-blue-500" />}
                  title="Landed Cost & Margin Analysis"
                  desc="See the real cost to your door, including duties, shipping, and taxes, with projected profit margins."
                />
                <FeatureRow 
                  icon={<Layers className="w-6 h-6 text-purple-500" />}
                  title="Curated Supplier Shortlists"
                  desc="Only verified, high-potential partners that match your specific MOQ and quality requirements."
                />
              </div>
              
              <Link href="/sample-report">
                <Button size="lg" className="mt-4 group" data-testid="button-view-sample-2">
                  View Sample Report 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 relative"
              variants={scaleIn}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl transform rotate-3 scale-95 opacity-50"></div>
              <motion.img 
                src={reportPreview} 
                alt="SmartSeek Report Preview" 
                className="relative rounded-2xl shadow-2xl border border-border/50 w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Projected Margin</div>
                    <div className="text-xl font-bold text-foreground">55%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-xl border border-border"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Risk Score</div>
                    <div className="text-xl font-bold text-foreground">Low</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">How SmartSeek Works</h2>
            <p className="text-lg text-muted-foreground">From idea to verified supplier in three simple steps.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>

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
          </motion.div>
        </div>
      </section>

      {/* Interactive Comparison Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Compare Options</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Why Smart Buyers Choose SmartSeek</h2>
            <p className="text-lg text-muted-foreground">See how we compare to traditional sourcing methods.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-muted/50 p-1.5 rounded-full border border-border">
                {(["manual", "agency", "smartseek"] as ComparisonKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveComparison(key)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeComparison === key 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`button-compare-${key}`}
                  >
                    {key === "manual" && "Manual Research"}
                    {key === "agency" && "Sourcing Agencies"}
                    {key === "smartseek" && "SmartSeek"}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeComparison}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`overflow-hidden ${activeComparison === "smartseek" ? "ring-2 ring-primary shadow-xl" : ""}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3 space-y-4">
                        <h3 className="text-2xl font-bold">{comparisonData[activeComparison].title}</h3>
                        {activeComparison === "smartseek" && (
                          <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                        )}
                        <div className="space-y-3 pt-4">
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Time Required</span>
                            <span className="font-semibold">{comparisonData[activeComparison].time}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Cost</span>
                            <span className="font-semibold">{comparisonData[activeComparison].cost}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Risk Level</span>
                            <span className={`font-semibold ${
                              comparisonData[activeComparison].risk === "Low" ? "text-green-500" :
                              comparisonData[activeComparison].risk === "Medium" ? "text-yellow-500" : "text-red-500"
                            }`}>{comparisonData[activeComparison].risk}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-4">Features & Considerations</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {comparisonData[activeComparison].features.map((feature, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-2"
                            >
                              {feature.positive ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                              )}
                              <span className={feature.positive ? "text-foreground" : "text-muted-foreground"}>
                                {feature.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {activeComparison === "smartseek" && (
                      <motion.div 
                        className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-muted-foreground">Ready to experience the difference?</p>
                        <Link href="/signup">
                          <Button className="group" data-testid="button-compare-cta">
                            Get Started Free 
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeInUp}>
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">For E-Commerce Sellers</Badge>
              <h3 className="text-3xl font-bold">Dominate Amazon FBA & Dropshipping</h3>
              <p className="text-lg text-sidebar-foreground/80 leading-relaxed">
                Margins are everything in e-commerce. SmartSeek helps you find <strong>high-margin, low-competition products</strong> fast.
                Identify "sleeping giant" suppliers that competitors haven't found yet.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Verify supplier MOQs instantly</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Ensure product safety compliance</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Find "Factory Direct" pricing</li>
              </ul>
            </motion.div>
            
            <motion.div className="space-y-6" variants={fadeInUp}>
              <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/20">For Enterprise Buyers</Badge>
              <h3 className="text-3xl font-bold">Streamline Procurement & Risk</h3>
              <p className="text-lg text-sidebar-foreground/80 leading-relaxed">
                Diversify your supply chain away from high-risk regions. SmartSeek's <strong>Risk Analysis Engine</strong> helps professional buyers
                build resilient supply networks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> Geo-political risk monitoring</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> Multi-region cost comparison</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> Export-ready PDF reports</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials / Reviews */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Customer Success</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Loved by Sourcing Professionals</h2>
            <p className="text-lg text-muted-foreground">See what our customers are saying about SmartSeek.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <TestimonialCard 
              quote="SmartSeek cut our supplier research time from weeks to hours. The risk scoring feature alone saved us from a potentially disastrous partnership."
              author="Sarah Chen"
              role="Procurement Director"
              company="TechFlow Inc."
            />
            <TestimonialCard 
              quote="As an Amazon seller, margins are everything. SmartSeek helped me find suppliers with 40% better pricing than what I was paying before."
              author="Marcus Johnson"
              role="E-commerce Entrepreneur"
              company="Prime Ventures"
            />
            <TestimonialCard 
              quote="The landed cost calculator is incredibly accurate. No more surprises when shipments arrive. This tool pays for itself every month."
              author="Elena Rodriguez"
              role="Supply Chain Manager"
              company="Global Retail Co."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-8 md:p-16 text-center border border-primary/20 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <motion.div 
              className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
              animate={{ 
                x: [0, -50, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
             
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold">Ready to Revolutionize Your Sourcing?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of smart buyers who are saving time and boosting margins with SmartSeek.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300" data-testid="button-cta-signup">
                    Get Started with 10 Free Credits
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Setup in 2 minutes • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}

function TrustLogo({ icon, name }: { icon: React.ReactNode, name: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="font-semibold text-lg">{name}</span>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <motion.div className="p-6" variants={fadeInUp}>
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{value}</div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      className="flex gap-4 group"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mt-1 p-2.5 bg-card rounded-xl border shadow-sm h-fit group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">{icon}</div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground leading-snug">{desc}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ step, icon, title, desc }: { step: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      className="relative bg-card p-8 rounded-2xl border shadow-sm z-10 group"
      variants={fadeInUp}
      whileHover={{ y: -5, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-7xl font-bold text-muted/10 absolute top-4 right-6 pointer-events-none group-hover:text-primary/10 transition-colors duration-300">{step}</div>
      <div className="mb-6 p-3 bg-primary/10 w-fit rounded-xl group-hover:bg-primary/20 transition-colors duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, company }: { quote: string, author: string, role: string, company: string }) {
  return (
    <motion.div 
      className="bg-card p-8 rounded-2xl border shadow-sm"
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-foreground mb-6 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
          {author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{role}, {company}</div>
        </div>
      </div>
    </motion.div>
  );
}
