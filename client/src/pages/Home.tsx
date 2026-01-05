import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowRight, Check, Search, Shield, Globe, DollarSign, BarChart3, TrendingUp, Layers, Zap, CheckCircle2, Building2, FileCheck, MapPin, Lock, Users, Target, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import heroBg from "@assets/generated_images/3d_supply_chain_network_visualization.png";
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

  return (
    <PublicLayout>
      {/* Enterprise Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 min-h-[90vh] flex items-center bg-gradient-to-b from-slate-950 via-slate-900 to-background">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Supply Chain Network" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-600/10 to-transparent" />
        </div>

        <motion.div 
          className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -left-32 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                  </span>
                  Enterprise Procurement Platform
                </div>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white leading-[1.1]"
              >
                Enterprise Sourcing
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                  Intelligence
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-300 leading-relaxed max-w-xl"
              >
                Data-driven procurement decisions for enterprise buyers. Reduce supply chain risk, 
                optimize costs, and build resilient supplier networks with AI-powered intelligence.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-start gap-4 pt-2"
              >
                <Link href="/signup" data-testid="link-hero-signup">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300 border-0" data-testid="button-hero-signup">
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="pt-4 flex flex-wrap items-center gap-6 text-sm text-slate-400"
              >
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> No Credit Card Required</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> 2 Free Credits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Full Platform Access</div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-purple-600/40 rounded-2xl blur-3xl transform rotate-6 scale-95"></div>
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={dashboardScreenshot} 
                  alt="SmartSeek Enterprise Dashboard" 
                  className="relative rounded-2xl shadow-2xl border border-slate-700/50 w-full"
                  data-testid="img-hero-dashboard"
                />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-8 -left-8 bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Cost Savings</div>
                    <div className="text-2xl font-bold text-white">23% Avg.</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-4 bg-slate-900/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-slate-700"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Shield size={18} />
                  </div>
                  <div className="text-sm font-semibold text-white">Risk Score: Low</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise Stats Section */}
      <motion.section 
        className="py-16 border-y border-slate-800 bg-gradient-to-b from-background to-slate-950/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Trusted by Enterprise Procurement Teams Worldwide</p>
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

      {/* Enterprise Value Propositions */}
      <section className="py-24 bg-gradient-to-b from-slate-950/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Enterprise Capabilities</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Built for Enterprise Procurement</h2>
            <p className="text-lg text-muted-foreground">Comprehensive sourcing intelligence designed for complex supply chain requirements.</p>
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
                <Card className="h-full bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-800 hover:border-blue-500/30 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex gap-5">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500/20 transition-colors h-fit">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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
      <section className="py-24 overflow-hidden bg-gradient-to-b from-background to-slate-950/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">Enterprise Platform</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Powerful Analytics for Procurement Leaders</h2>
            <p className="text-lg text-muted-foreground">Gain visibility into your entire supplier ecosystem with comprehensive dashboards and detailed reports.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-slate-900/50 p-1.5 rounded-full border border-slate-800">
                  <TabsTrigger 
                    value="dashboard" 
                    className="rounded-full px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                    data-testid="tab-preview-dashboard"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Supplier Analytics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="report" 
                    className="rounded-full px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                    data-testid="tab-preview-report"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Intelligence Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl transform scale-95 opacity-50"></div>
                
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
                      className="relative rounded-2xl shadow-2xl border border-slate-700/50 w-full mx-auto max-w-5xl"
                      data-testid="img-preview-dashboard"
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-700">
                      <p className="text-sm font-medium text-slate-200">Real-time supplier performance monitoring and spend analytics</p>
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
                      className="relative rounded-2xl shadow-2xl border border-slate-700/50 w-full mx-auto max-w-5xl"
                      data-testid="img-preview-report"
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-700">
                      <p className="text-sm font-medium text-slate-200">Comprehensive sourcing reports with risk assessment & cost breakdown</p>
                    </div>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-950/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Streamlined Process</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Enterprise-Grade Intelligence in Minutes</h2>
            <p className="text-lg text-muted-foreground">Transform your procurement process with data-driven supplier intelligence.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0"></div>

            <StepCard 
              step="01"
              icon={<Search className="w-8 h-8 text-blue-400" />}
              title="Define Requirements"
              desc="Input your sourcing criteria including product specifications, compliance needs, volume requirements, and target regions."
            />
            <StepCard 
              step="02"
              icon={<Zap className="w-8 h-8 text-purple-400" />}
              title="AI Analysis"
              desc="Our intelligence engine analyzes global supplier databases, calculates total costs, and evaluates risk factors across 50+ countries."
            />
            <StepCard 
              step="03"
              icon={<CheckCircle2 className="w-8 h-8 text-green-400" />}
              title="Strategic Insights"
              desc="Receive comprehensive reports with qualified supplier shortlists, risk assessments, and cost optimization recommendations."
            />
          </motion.div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeInUp}>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ROI-Driven Platform</Badge>
              <h3 className="text-3xl font-bold text-white">Measurable Procurement Impact</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Enterprise procurement teams using SmartSeek report significant improvements in cost savings, 
                risk reduction, and sourcing efficiency. Our platform delivers quantifiable ROI within the first quarter.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> 23% average reduction in supplier costs</li>
                <li className="flex items-center gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> 75% faster supplier qualification process</li>
                <li className="flex items-center gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> 40% improvement in supply chain resilience</li>
                <li className="flex items-center gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> Real-time compliance monitoring</li>
              </ul>
            </motion.div>
            
            <motion.div className="space-y-6" variants={fadeInUp}>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Enterprise Security</Badge>
              <h3 className="text-3xl font-bold text-white">Built for Enterprise Requirements</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                SmartSeek meets the stringent security and compliance requirements of enterprise organizations, 
                with SOC 2 compliance, data encryption, and role-based access controls.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-200"><Lock className="w-5 h-5 text-purple-400" /> SOC 2 Type II certified</li>
                <li className="flex items-center gap-3 text-slate-200"><Lock className="w-5 h-5 text-purple-400" /> End-to-end data encryption</li>
                <li className="flex items-center gap-3 text-slate-200"><Lock className="w-5 h-5 text-purple-400" /> SSO & SAML integration</li>
                <li className="flex items-center gap-3 text-slate-200"><Lock className="w-5 h-5 text-purple-400" /> Audit logging & compliance reporting</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Free Trial CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Card className="bg-gradient-to-br from-blue-950/50 via-slate-900 to-purple-950/50 border-blue-500/20 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
                animate={{ 
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
                animate={{ 
                  x: [0, -50, 0],
                  y: [0, 30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              
              <CardContent className="p-8 md:p-16 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Try Free</Badge>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
                      Start Your Free Trial Today
                    </h2>
                    <p className="text-xl text-slate-300">
                      Experience the full power of enterprise sourcing intelligence with no commitment required.
                    </p>
                    <Link href="/signup" data-testid="link-free-trial-cta">
                      <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300" data-testid="button-free-trial-cta">
                        Start Free Trial - No Credit Card Required
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-200 uppercase tracking-wider">What's Included in Your Free Trial</h3>
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-br from-slate-900 via-blue-950/30 to-purple-950/30 rounded-3xl p-8 md:p-16 text-center border border-slate-800 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <motion.div 
              className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 mb-6 border border-blue-500/20">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">Transform Your Procurement Strategy</h2>
              <p className="text-xl text-slate-300">
                Join leading enterprises who trust SmartSeek for strategic sourcing decisions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup" data-testid="link-cta-signup">
                  <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300" data-testid="button-cta-signup">
                    Get Started with 2 Free Credits
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-400">
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
      <div className="flex justify-center mb-3 text-blue-400">{icon}</div>
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2" data-testid={`${testId}-value`}>{value}</div>
      <div className="text-sm md:text-base text-slate-400 font-medium" data-testid={`${testId}-label`}>{label}</div>
    </motion.div>
  );
}

function StepCard({ step, icon, title, desc }: { step: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8 rounded-2xl border border-slate-800 shadow-xl z-10 group hover:border-blue-500/30 transition-all duration-300"
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-7xl font-bold text-slate-800/50 absolute top-4 right-6 pointer-events-none group-hover:text-blue-500/20 transition-colors duration-300">{step}</div>
      <div className="mb-6 p-3 bg-blue-500/10 w-fit rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function TrialFeature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
        {icon}
      </div>
      <span className="text-slate-200 font-medium">{text}</span>
    </div>
  );
}
