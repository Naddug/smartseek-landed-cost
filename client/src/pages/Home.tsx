import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight, Check, Search, Shield, Globe, DollarSign, BarChart3, TrendingUp, Layers, Zap, CheckCircle2, Building2, FileCheck, MapPin, Lock, Users, Target, Briefcase, Factory, Cpu, ShoppingCart, Car, HeartPulse, HardHat, BadgeCheck, Database, Award } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
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

export default function Home() {
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard");

  const enterpriseFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Supply Chain Risk Mitigation",
      description: "Proactive identification of geopolitical, financial, and operational risks across your supplier network with AI-powered monitoring."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Cost Optimization & Landed Cost Analysis",
      description: "Comprehensive total cost modeling including duties, freight, insurance, and currency fluctuations for accurate procurement decisions."
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Compliance & Due Diligence",
      description: "Automated compliance checks, certification verification, and supplier qualification workflows to meet regulatory requirements."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Multi-Region Supplier Intelligence",
      description: "Access to verified supplier data across 50+ countries with localized market insights and regional benchmarking."
    }
  ];

  const industries = [
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
      {/* Hero Section - Light Theme */}
      <section className="relative overflow-hidden pt-20 pb-32 min-h-[90vh] flex items-center bg-gradient-to-b from-white via-slate-50 to-blue-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-50/80 to-transparent" />
        </div>

        <motion.div 
          className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -left-32 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl"
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Enterprise Procurement Platform
                </div>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1]"
              >
                Enterprise Sourcing
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">
                  Intelligence
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-700 leading-relaxed max-w-xl"
              >
                Data-driven procurement decisions for enterprise buyers. Reduce supply chain risk, 
                optimize costs, and build resilient supplier networks with AI-powered intelligence.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-start gap-4 pt-2"
              >
                <Link href="/signup" data-testid="link-hero-signup">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300" data-testid="button-hero-signup">
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="pt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600"
              >
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> No Credit Card Required</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 2 Free Credits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Full Platform Access</div>
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
                <img 
                  src={dashboardScreenshot} 
                  alt="SmartSeek Enterprise Dashboard" 
                  className="relative rounded-2xl shadow-2xl border border-slate-200 w-full"
                  data-testid="img-hero-dashboard"
                />
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

      {/* Stats Section - Light Theme */}
      <motion.section 
        className="py-16 border-y border-slate-200 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">Trusted by Enterprise Procurement Teams Worldwide</p>
          </div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <StatItem value="150+" label="Fortune 500 Companies" icon={<Building2 className="w-6 h-6" />} testId="stat-fortune-500" />
            <StatItem value="$12B+" label="Sourcing Volume Analyzed" icon={<DollarSign className="w-6 h-6" />} testId="stat-sourcing-volume" />
            <StatItem value="50+" label="Countries Covered" icon={<Globe className="w-6 h-6" />} testId="stat-countries" />
            <StatItem value="99.9%" label="Platform Uptime" icon={<Zap className="w-6 h-6" />} testId="stat-uptime" />
          </motion.div>
        </div>
      </motion.section>

      {/* Supplier Database Showcase */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">Global Supplier Network</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Access 100,000+ Verified Suppliers</h2>
            <p className="text-lg text-slate-600">Connect with pre-qualified suppliers across every major manufacturing region with comprehensive verification and quality metrics.</p>
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

      {/* Industries Served Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Industries We Serve</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Sourcing Solutions for Every Industry</h2>
            <p className="text-lg text-slate-600">From manufacturing to healthcare, our platform connects you with verified suppliers tailored to your industry's unique requirements.</p>
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

      {/* Enterprise Value Propositions */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Enterprise Capabilities</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Built for Enterprise Procurement</h2>
            <p className="text-lg text-slate-600">Comprehensive sourcing intelligence designed for complex supply chain requirements.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {enterpriseFeatures.map((feature, index) => (
              <motion.div key={`enterprise-feature-${index}`} variants={fadeInUp}>
                <Card className="h-full bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex gap-5">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors h-fit">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="py-24 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">Enterprise Platform</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Powerful Analytics for Procurement Leaders</h2>
            <p className="text-lg text-slate-600">Gain visibility into your entire supplier ecosystem with comprehensive dashboards and detailed reports.</p>
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
                    <img 
                      src={dashboardScreenshot} 
                      alt="SmartSeek Enterprise Analytics Dashboard" 
                      className="relative rounded-2xl shadow-2xl border border-slate-200 w-full mx-auto max-w-5xl"
                      data-testid="img-preview-dashboard"
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-700">Real-time supplier performance monitoring and spend analytics</p>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="report" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <img 
                      src={reportScreenshot} 
                      alt="SmartSeek Enterprise Intelligence Report" 
                      className="relative rounded-2xl shadow-2xl border border-slate-200 w-full mx-auto max-w-5xl"
                      data-testid="img-preview-report"
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-700">Comprehensive sourcing reports with risk assessment & cost breakdown</p>
                    </div>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Streamlined Process</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Enterprise-Grade Intelligence in Minutes</h2>
            <p className="text-lg text-slate-600">Transform your procurement process with data-driven supplier intelligence.</p>
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
              title="Define Requirements"
              desc="Input your sourcing criteria including product specifications, compliance needs, volume requirements, and target regions."
            />
            <StepCard 
              step="02"
              icon={<Zap className="w-8 h-8 text-purple-600" />}
              title="AI Analysis"
              desc="Our intelligence engine analyzes global supplier databases, calculates total costs, and evaluates risk factors across 50+ countries."
            />
            <StepCard 
              step="03"
              icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
              title="Strategic Insights"
              desc="Receive comprehensive reports with qualified supplier shortlists, risk assessments, and cost optimization recommendations."
            />
          </motion.div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
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
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">ROI-Driven Platform</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">Measurable Procurement Impact</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Enterprise procurement teams using SmartSeek report significant improvements in cost savings, 
                    risk reduction, and sourcing efficiency. Our platform delivers quantifiable ROI within the first quarter.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> 23% average reduction in supplier costs</li>
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> 75% faster supplier qualification process</li>
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> 40% improvement in supply chain resilience</li>
                    <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> Real-time compliance monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="bg-white border-slate-200 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Enterprise Security</Badge>
                  <h3 className="text-2xl font-bold text-slate-900">Built for Enterprise Requirements</h3>
                  <p className="text-slate-600 leading-relaxed">
                    SmartSeek meets the stringent security and compliance requirements of enterprise organizations, 
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

      {/* Free Trial CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
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
                      Start Your Free Trial Today
                    </h2>
                    <p className="text-xl text-blue-100">
                      Experience the full power of enterprise sourcing intelligence with no commitment required.
                    </p>
                    <Link href="/signup" data-testid="link-free-trial-cta">
                      <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-blue-700 hover:bg-blue-50 shadow-xl hover:scale-105 transition-all duration-300" data-testid="button-free-trial-cta">
                        Start Free Trial - No Credit Card Required
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white uppercase tracking-wider">What's Included in Your Free Trial</h3>
                    <div className="space-y-4">
                      <TrialFeature icon={<Target className="w-5 h-5" />} text="2 Full Intelligence Reports" />
                      <TrialFeature icon={<BarChart3 className="w-5 h-5" />} text="Complete Platform Access" />
                      <TrialFeature icon={<Globe className="w-5 h-5" />} text="50+ Country Supplier Database" />
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

      {/* Final CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-white rounded-3xl p-8 md:p-16 text-center border border-slate-200 shadow-xl relative overflow-hidden"
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
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900">Transform Your Procurement Strategy</h2>
              <p className="text-xl text-slate-600">
                Join leading enterprises who trust SmartSeek for strategic sourcing decisions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup" data-testid="link-cta-signup">
                  <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300" data-testid="button-cta-signup">
                    Get Started with 2 Free Credits
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-500">
                No credit card required • Enterprise-ready • Full platform access
              </p>
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
      <div className="flex justify-center mb-3 text-blue-600">{icon}</div>
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2" data-testid={`${testId}-value`}>{value}</div>
      <div className="text-sm md:text-base text-slate-600 font-medium" data-testid={`${testId}-label`}>{label}</div>
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
