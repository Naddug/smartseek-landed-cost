import { HeroDashboardMock, DashboardPreviewMock, ReportPreviewMock } from "@/components/home/DashboardMocks";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { IntegrationLogos } from "@/components/integrations/IntegrationLogos";
import { PersonaHero, type Persona } from "@/components/trust/PersonaHero";
import { MethodologySection } from "@/components/trust/MethodologySection";
import { ArrowRight, Check, Search, Shield, Globe, DollarSign, BarChart3, TrendingUp, Layers, Zap, CheckCircle2, Building2, FileCheck, MapPin, Lock, Users, Target, Briefcase, Factory, Cpu, ShoppingCart, Car, HeartPulse, HardHat, BadgeCheck, Database, Award, UserSearch, Sparkles, Brain, Rocket, Gem } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
// import dashboardScreenshot from "@assets/generated_images/sourcing_dashboard_analytics_interface.png";
// import reportScreenshot from "@assets/generated_images/sourcing_report_document_preview.png";
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

export default function Home() {
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard");
  const [activePersona, setActivePersona] = useState<Persona>("procurer");

  const platformFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Intelligence",
      description: "Identify geopolitical, financial, and operational risks before they impact your business with AI-powered monitoring and alerts.",
      href: "/risk-intelligence"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Landed Cost Calculator",
      description: "Get the true cost including duties, freight, insurance, and currency fluctuations. No more surprise fees or hidden charges.",
      href: "/landed-cost"
    },
    {
      icon: <UserSearch className="w-6 h-6" />,
      title: "Find Buyer Leads",
      description: "AI-powered B2B lead generation to discover qualified contacts with company insights, intent signals, and verified details.",
      href: "/find-leads"
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Compliance Made Simple",
      description: "Automated compliance checks, certification verification, and qualification workflows so you can focus on what matters.",
      href: "/compliance"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Supplier Data",
      description: "Access 100,000+ verified suppliers across 24+ countries. Filter by industry, region, certifications, and more.",
      href: "/suppliers"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Reports",
      description: "Generate comprehensive sourcing reports with market analysis, supplier comparisons, and actionable recommendations.",
      href: "/smart-finder"
    },
  ];

  const industries = [
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Mining & Minerals",
      description: "Antimony, tin, lithium, cobalt, copper, and rare earths. Verified mineral suppliers for critical supply chains."
    },
    {
      icon: <Factory className="w-8 h-8" />,
      title: "Manufacturing & Industrial",
      description: "Source raw materials, components, and equipment from verified manufacturers worldwide."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Electronics & Technology",
      description: "Find semiconductor suppliers, PCB manufacturers, and tech component distributors."
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Consumer Goods & Retail",
      description: "Connect with suppliers for packaging, finished goods, and private label products."
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Automotive & Transportation",
      description: "Source automotive parts, OEM components, and transportation equipment globally."
    },
    {
      icon: <HeartPulse className="w-8 h-8" />,
      title: "Healthcare & Medical Devices",
      description: "Find FDA-compliant suppliers for medical equipment and healthcare products."
    },
    {
      icon: <HardHat className="w-8 h-8" />,
      title: "Construction & Materials",
      description: "Source building materials, heavy equipment, and construction supplies."
    }
  ];

  const supplierRegions = [
    { region: "Asia Pacific", count: "45,000+", color: "bg-blue-500" },
    { region: "North America", count: "22,000+", color: "bg-emerald-500" },
    { region: "Europe", count: "18,000+", color: "bg-purple-500" },
    { region: "Latin America", count: "8,000+", color: "bg-orange-500" },
    { region: "Middle East & Africa", count: "7,000+", color: "bg-rose-500" }
  ];

  return (
    <PublicLayout>
      {/* Hero Section - Neuromarketing: above-fold value prop, clear CTA hierarchy */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 pb-24 sm:pb-32 min-h-[85vh] sm:min-h-[90vh] flex items-center bg-gradient-to-b from-white via-slate-50/80 to-blue-50/60">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(59,130,246,0.08),transparent)" />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-blue-50/60 to-transparent" />
        </div>

        <motion.div 
          className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -left-32 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div 
              className="space-y-5 sm:space-y-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/[0.06] text-slate-700 text-xs sm:text-sm font-medium border border-slate-200/80">
                  <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  The world&apos;s most powerful sourcing intelligence platform
                </div>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight text-slate-900 leading-[1.08]"
              >
                Find Suppliers.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                  Know Costs. Move Fast.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Make smarter sourcing decisions in minutes. AI reports, verified suppliers, accurate landed costs.
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <PersonaHero active={activePersona} onSelect={setActivePersona} />
              </motion.div>

              {/* Primary CTA block - neuromarketing: reciprocity + loss aversion */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link href="/signup" data-testid="link-hero-signup" className="order-1">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold" 
                      data-testid="button-hero-signup"
                    >
                      Start Free Trial <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </Link>
                  <Link href="/landed-cost" className="order-2">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-medium">
                      Try Free Calculator
                    </Button>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> No credit card</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 2 free reports</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Full access</span>
                </p>
              </motion.div>

              {/* Trust strip - placed near CTA for conversion lift */}
              <motion.div variants={fadeInUp} className="pt-6 sm:pt-8 border-t border-slate-200/60">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-[0.12em] mb-3">Trusted by 50,000+ procurers</p>
                <TrustBadges variant="compact" />
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-2xl blur-3xl transform rotate-6 scale-95"></div>
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeroDashboardMock />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Cost Savings</div>
                    <div className="text-2xl font-bold text-slate-900">23% Avg.</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl border border-slate-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Shield size={18} />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">Risk Score: Low</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Neuromarketing: social proof, authority, concrete numbers */}
      <motion.section 
        className="py-16 sm:py-20 border-y border-slate-200/80 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">Trusted by decision makers worldwide</p>
          </div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <StatItem value="50K+" label="Active Users" icon={<Users className="w-6 h-6" />} testId="stat-users" />
            <StatItem value="$50B+" label="Sourcing Volume Analyzed" icon={<DollarSign className="w-6 h-6" />} testId="stat-sourcing-volume" />
            <StatItem value="24+" label="Countries Covered" icon={<Globe className="w-6 h-6" />} testId="stat-countries" />
            <StatItem value="99.9%" label="Platform Uptime" icon={<Zap className="w-6 h-6" />} testId="stat-uptime" />
          </motion.div>
        </div>
      </motion.section>

      {/* Integrations - Authority: familiar logos reduce cognitive load */}
      <section className="py-12 sm:py-16 bg-slate-50/80 border-b border-slate-100 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
            <p className="text-center sm:text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">Integrates with your existing tools</p>
            <a href="/integrations" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline shrink-0">
              View all integrations →
            </a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            <IntegrationLogos variant="compact" />
          </div>
        </div>
      </section>

      {/* Methodology - transparency builds trust (IndexBox-style) */}
      <MethodologySection />

      {/* Supplier Database - Concrete numbers build trust */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">Global Supplier Network</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">100,000+ Verified Suppliers — Mining, Minerals & More</h2>
            <p className="text-lg text-slate-600">Connect with pre-qualified suppliers across every major region. Verified, rated, and ready to work with you.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h3 className="text-2xl font-bold text-slate-900">Suppliers by Region</h3>
              <div className="space-y-4">
                {supplierRegions.map((region, index) => (
                  <div key={`region-${index}`} className="flex items-center gap-4" data-testid={`supplier-region-${index}`}>
                    <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-800">{region.region}</span>
                        <span className="font-bold text-slate-900">{region.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${region.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${parseInt(region.count) / 450}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-2 gap-6" variants={fadeInUp}>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <BadgeCheck className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">98%</div>
                  <div className="text-sm text-slate-600">Verification Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Award className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">4.7/5</div>
                  <div className="text-sm text-slate-600">Avg Quality Score</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Database className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">2M+</div>
                  <div className="text-sm text-slate-600">Product Listings</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">Risk Monitoring</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Industries - Relevance: speak to each segment */}
      <section className="py-20 sm:py-24 bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Industries We Serve</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Your Industry. Your Suppliers. Solved.</h2>
            <p className="text-lg text-slate-600">From manufacturing to healthcare, find verified suppliers tailored to your industry's unique needs.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {industries.map((industry, index) => (
              <motion.div key={`industry-${index}`} variants={fadeInUp}>
                <Card className="h-full bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 group" data-testid={`card-industry-${index}`}>
                  <CardContent className="p-6">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors w-fit mb-4">
                      {industry.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{industry.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{industry.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Features - Benefit-focused cards */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Platform Capabilities</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Everything You Need to Source Smarter</h2>
            <p className="text-lg text-slate-600">Powerful tools designed to save you time and money on every sourcing decision.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {platformFeatures.map((feature, index) => (
              <motion.div key={`platform-feature-${index}`} variants={fadeInUp}>
                <Link href={feature.href}>
                  <Card className="h-full bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-8">
                      <div className="flex gap-5">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors h-fit">
                          {feature.icon}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                          <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                          <span className="text-blue-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Learn more <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Showcase - Tangible proof */}
      <section className="py-20 sm:py-24 overflow-hidden bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">See It In Action</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Insights That Drive Results</h2>
            <p className="text-lg text-slate-600">Get full visibility into suppliers, costs, and risks with beautiful dashboards and detailed reports.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
                  <TabsTrigger 
                    value="dashboard" 
                    className="rounded-full px-6 py-2.5 text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
                    data-testid="tab-preview-dashboard"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Supplier Analytics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="report" 
                    className="rounded-full px-6 py-2.5 text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
                    data-testid="tab-preview-report"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Intelligence Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-3xl blur-3xl transform scale-95 opacity-50"></div>
                
                <TabsContent value="dashboard" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <DashboardPreviewMock />
                  </motion.div>
                </TabsContent>

                <TabsContent value="report" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <ReportPreviewMock />
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Cognitive ease: 3 steps */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">From Search to Decision in Minutes</h2>
            <p className="text-lg text-slate-600">Three simple steps to smarter sourcing. No complexity. Just results.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent z-0"></div>

            <StepCard 
              step="01"
              icon={<Search className="w-8 h-8 text-blue-600" />}
              title="Tell Us What You Need"
              desc="Enter your product, specifications, volume, and target regions. Our AI understands exactly what you're looking for."
            />
            <StepCard 
              step="02"
              icon={<Brain className="w-8 h-8 text-purple-600" />}
              title="AI Does the Heavy Lifting"
              desc="We analyze global supplier databases, calculate true costs, and evaluate risks — all in real-time."
            />
            <StepCard 
              step="03"
              icon={<Rocket className="w-8 h-8 text-emerald-600" />}
              title="Make Confident Decisions"
              desc="Get a complete report with qualified suppliers, cost breakdowns, and actionable recommendations."
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits - Loss aversion: what you gain */}
      <section className="py-20 sm:py-24 bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-white border-slate-200 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Real Results</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">Save Time & Money on Every Decision</h3>
                  <p className="text-slate-600 leading-relaxed">
                    SmartSeek users report significant improvements in cost savings, 
                    risk reduction, and sourcing speed. See the difference in your first report.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> 23% average cost reduction</li>
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> 75% faster supplier qualification</li>
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> 40% better supply chain resilience</li>
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> Real-time compliance monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="bg-white border-slate-200 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Your Data, Protected</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">Security You Can Trust</h3>
                  <p className="text-slate-600 leading-relaxed">
                    SmartSeek meets the highest security and compliance standards, 
                    with SOC 2 compliance, data encryption, and role-based access controls.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-slate-700"><Lock className="w-5 h-5 text-purple-600" /> SOC 2 Type II certified</li>
                    <li className="flex items-center gap-3 text-slate-700"><Lock className="w-5 h-5 text-purple-600" /> End-to-end data encryption</li>
                    <li className="flex items-center gap-3 text-slate-700"><Lock className="w-5 h-5 text-purple-600" /> SSO & SAML integration</li>
                    <li className="flex items-center gap-3 text-slate-700"><Lock className="w-5 h-5 text-purple-600" /> Audit logging & compliance reporting</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Free Trial CTA - Reciprocity + urgency */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 border-0 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
                animate={{ 
                  x: [0, -50, 0],
                  y: [0, 30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              
              <CardContent className="p-8 md:p-16 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <Badge className="bg-white/20 text-white border-white/30">Try Free</Badge>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
                      Ready to Source Smarter?
                    </h2>
                    <p className="text-xl text-blue-100">
                      Start making better sourcing decisions today. No credit card required.
                    </p>
                    <Link href="/signup" data-testid="link-free-trial-cta">
                      <Button size="lg" className="h-12 sm:h-14 px-10 text-lg rounded-xl bg-white text-blue-700 hover:bg-blue-50 shadow-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all" data-testid="button-free-trial-cta">
                        Start Your Free Trial
                      </Button>
                    </Link>
                    <p className="text-sm text-blue-100/90">No credit card • 2 free reports • Full platform access</p>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Your Free Trial Includes</h3>
                    <div className="space-y-4">
                      <TrialFeature icon={<Sparkles className="w-5 h-5" />} text="2 Full AI-Generated Reports" />
                      <TrialFeature icon={<BarChart3 className="w-5 h-5" />} text="Complete Platform Access" />
                      <TrialFeature icon={<Globe className="w-5 h-5" />} text="24+ Country Supplier Database" />
                      <TrialFeature icon={<Shield className="w-5 h-5" />} text="Risk Assessment & Scoring" />
                      <TrialFeature icon={<DollarSign className="w-5 h-5" />} text="Landed Cost Calculator" />
                      <TrialFeature icon={<Users className="w-5 h-5" />} text="Priority Support Access" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Social proof: concrete outcomes (34% conversion lift) */}
      <section className="py-20 sm:py-24 bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Customer Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Trusted by Procurers, Entrepreneurs & Producers</h2>
            <p className="text-lg text-slate-600">Real outcomes from teams who made the switch to smarter sourcing.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              {
                quote: "SmartSeek cut our supplier qualification time by 60%. The AI-powered risk assessments give us confidence in every sourcing decision we make.",
                outcome: "60% faster qualification",
                name: "Sarah Chen",
                title: "VP of Procurement",
                company: "Global Manufacturing Corp",
              },
              {
                quote: "The landed cost calculator alone saved us from three costly surprises last quarter. It's become an essential tool for our international sourcing team.",
                outcome: "Avoided 3 cost overruns",
                name: "Marcus Weber",
                title: "Supply Chain Director",
                company: "EuroTech Industries",
              },
              {
                quote: "We discovered verified suppliers in regions we hadn't considered before. SmartSeek's AI reports provided the data we needed to diversify our supply chain.",
                outcome: "Diversified to 5 new regions",
                name: "Priya Sharma",
                title: "Head of Strategic Sourcing",
                company: "Atlas Retail Group",
              },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full bg-white border-slate-200 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <svg key={j} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        {"outcome" in testimonial ? testimonial.outcome : ""}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{testimonial.name}</p>
                        <p className="text-slate-500 text-xs">{testimonial.title}, {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Loss aversion: last chance to act */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div 
            className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center border border-slate-200/80 shadow-lg relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <motion.div 
              className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl"
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6 border border-blue-200">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-slate-900">Smart Decisions Start Here</h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto">
                Join 50,000+ procurers who trust SmartSeek. Don&apos;t let your competitors source faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
                <Link href="/signup" data-testid="link-cta-signup">
                  <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all" data-testid="button-cta-signup">
                    Get Started with 2 Free Credits
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-500 mb-5">
                No credit card required • Full platform access • Cancel anytime
              </p>
              <TrustBadges variant="compact" />
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}

function StatItem({ value, label, icon, testId }: { value: string, label: string, icon: React.ReactNode, testId: string }) {
  return (
    <motion.div className="p-6" variants={fadeInUp} data-testid={testId}>
      <div className="flex justify-center mb-4 text-slate-400">{icon}</div>
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-2 tabular-nums tracking-tight" data-testid={`${testId}-value`}>{value}</div>
      <div className="text-sm text-slate-500 font-medium" data-testid={`${testId}-label`}>{label}</div>
    </motion.div>
  );
}

function StepCard({ step, icon, title, desc }: { step: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-lg z-10 group hover:border-blue-300 hover:shadow-xl transition-all duration-300"
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-7xl font-bold text-slate-100 absolute top-4 right-6 pointer-events-none group-hover:text-blue-100 transition-colors duration-300">{step}</div>
      <div className="mb-6 p-3 bg-blue-50 w-fit rounded-xl group-hover:bg-blue-100 transition-colors duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </motion.div>
  );
}

function TrialFeature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/20 rounded-lg text-white">
        {icon}
      </div>
      <span className="text-white font-medium">{text}</span>
    </div>
  );
}
