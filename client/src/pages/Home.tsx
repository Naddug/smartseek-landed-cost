import { useTranslation } from "react-i18next";
import { HeroDashboardMock, DashboardPreviewMock, ReportPreviewMock } from "@/components/home/DashboardMocks";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { IntegrationLogos } from "@/components/integrations/IntegrationLogos";
import { PersonaHero, type Persona } from "@/components/trust/PersonaHero";
import { MethodologySection } from "@/components/trust/MethodologySection";
import { ArrowRight, Check, Search, Shield, Globe, DollarSign, BarChart3, TrendingUp, Layers, Zap, CheckCircle2, BadgeCheck, Award, UserSearch, FileCheck, Brain, Rocket, Sparkles, Gem, Factory, Cpu, ShoppingCart, Car, HeartPulse, HardHat, Database } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

export default function Home() {
  const { t } = useTranslation();
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard");
  const [activePersona, setActivePersona] = useState<Persona>("procurer");
  const [stats, setStats] = useState<{
    suppliers: number;
    leads: number;
    countries: number;
    industries: number;
    topCountries: { country: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const suppliersVal = stats?.suppliers ?? 2860000;
  const leadsVal = stats?.leads ?? 2380000;
  const countriesVal = stats?.countries ?? 217;
  const industriesVal = stats?.industries ?? 15;
  const topCountries = stats?.topCountries ?? [];
  const totalForPct = topCountries.reduce((s, c) => s + c.count, 0);

  const supplierRegions =
    topCountries.length > 0 && totalForPct > 0
      ? topCountries.slice(0, 8).map((c, i) => ({
          label: `${c.country} — ${c.count.toLocaleString()}+`,
          barValue: Math.round((c.count / totalForPct) * 100),
          color: ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-slate-400"][i] ?? "bg-slate-300",
        }))
      : [
          { label: t("home.regionUnitedKingdom"), barValue: 96, color: "bg-blue-500" },
          { label: t("home.regionUnitedStates"), barValue: 3, color: "bg-emerald-500" },
          { label: t("home.regionMoreComing"), barValue: 1, color: "bg-slate-300" },
        ];

  const platformFeatures = [
    { icon: <Shield className="w-6 h-6" />, titleKey: "home.feature1.title", descKey: "home.feature1.desc", href: "/risk-intelligence" },
    { icon: <DollarSign className="w-6 h-6" />, titleKey: "home.feature2.title", descKey: "home.feature2.desc", href: "/landed-cost" },
    { icon: <UserSearch className="w-6 h-6" />, titleKey: "home.feature3.title", descKey: "home.feature3.desc", href: "/find-leads" },
    { icon: <FileCheck className="w-6 h-6" />, titleKey: "home.feature4.title", descKey: "home.feature4.desc", href: "/compliance" },
    { icon: <Globe className="w-6 h-6" />, titleKey: "home.feature5.title", descKey: "home.feature5.desc", href: "/suppliers" },
    { icon: <Brain className="w-6 h-6" />, titleKey: "home.feature6.title", descKey: "home.feature6.desc", href: "/smart-finder" },
  ];

  const industries = [
    { icon: <Gem className="w-8 h-8" />, titleKey: "home.industry1.title", descKey: "home.industry1.desc" },
    { icon: <Factory className="w-8 h-8" />, titleKey: "home.industry2.title", descKey: "home.industry2.desc" },
    { icon: <Cpu className="w-8 h-8" />, titleKey: "home.industry3.title", descKey: "home.industry3.desc" },
    { icon: <ShoppingCart className="w-8 h-8" />, titleKey: "home.industry4.title", descKey: "home.industry4.desc" },
    { icon: <Car className="w-8 h-8" />, titleKey: "home.industry5.title", descKey: "home.industry5.desc" },
    { icon: <HeartPulse className="w-8 h-8" />, titleKey: "home.industry6.title", descKey: "home.industry6.desc" },
    { icon: <HardHat className="w-8 h-8" />, titleKey: "home.industry7.title", descKey: "home.industry7.desc" },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 pb-24 sm:pb-32 min-h-[85vh] sm:min-h-[90vh] flex items-center bg-gradient-to-b from-white via-slate-50/80 to-blue-50/60">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(59,130,246,0.08),transparent)" />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-blue-50/60 to-transparent" />
        </div>

        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 min-w-0 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/[0.06] text-slate-700 text-xs sm:text-sm font-medium border border-slate-200/80">
                <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                {t("hero.badge")}
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1] break-words">
                {t("hero.title1")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                  {t("hero.title2")}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <PersonaHero active={activePersona} onSelect={setActivePersona} />

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link href="/signup" data-testid="link-hero-signup" className="order-1">
                    <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold" data-testid="button-hero-signup">
                      {t("hero.cta")} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </Link>
                  <Link href="/landed-cost" className="order-2">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-medium text-slate-800">
                      {t("hero.calculator")}
                    </Button>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {t("hero.noCard")}</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {t("hero.freeReports")}</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {t("hero.fullAccess")}</span>
                </p>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-slate-200/60">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-[0.12em] mb-3">{t("trust.byProcurers")}</p>
                <TrustBadges variant="compact" />
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-2xl blur-3xl transform rotate-6 scale-95"></div>
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeroDashboardMock />
              </motion.div>
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">{t("home.costSavings")}</div>
                    <div className="text-2xl font-bold text-slate-900">23% Avg.</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Shield size={18} />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{t("home.riskScore")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 border-y border-slate-200/80 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">{t("trust.byDecisionMakers")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
            <StatItem value={formatStat(suppliersVal)} label={t("stat.verifiedSuppliers")} icon={<Shield className="w-6 h-6" />} testId="stat-suppliers" />
            <StatItem value={formatStat(leadsVal)} label={t("stat.buyerLeads")} icon={<DollarSign className="w-6 h-6" />} testId="stat-leads" />
            <StatItem value={formatStat(countriesVal)} label={t("stat.countries")} icon={<Globe className="w-6 h-6" />} testId="stat-countries" />
            <StatItem value={formatStat(industriesVal)} label={t("stat.industries")} icon={<Zap className="w-6 h-6" />} testId="stat-industries" />
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-12 sm:py-16 bg-slate-50/80 border-b border-slate-100 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
            <p className="text-center sm:text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">{t("integrations.sectionTitle")}</p>
            <a href="/integrations" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline shrink-0">
              {t("integrations.viewAll")} →
            </a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            <IntegrationLogos variant="compact" />
          </div>
        </div>
      </section>

      <MethodologySection />

      {/* Supplier Database */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">{t("home.supplierNetwork.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">{t("home.supplierNetwork.title")}</h2>
            <p className="text-lg text-slate-600">{t("home.supplierNetwork.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">{t("home.supplierRegions.title")}</h3>
              <div className="space-y-4">
                {supplierRegions.map((region, index) => (
                  <div key={`region-${index}`} className="flex items-center gap-4" data-testid={`supplier-region-${index}`}>
                    <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-800">{region.label}</span>
                        <span className="font-bold text-slate-900">{region.barValue === 1 && topCountries.length === 0 ? "—" : `${region.barValue}%`}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${region.color} rounded-full transition-all duration-500`} style={{ width: `${region.barValue}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <BadgeCheck className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">98%</div>
                  <div className="text-sm text-slate-600">{t("home.verificationRate")}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Award className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">4.7/5</div>
                  <div className="text-sm text-slate-600">{t("home.avgQuality")}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Database className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{formatStat(suppliersVal)}</div>
                  <div className="text-sm text-slate-600">{t("home.productListings")}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">{t("home.riskMonitoring")}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 sm:py-24 bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">{t("home.industries.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">{t("home.industries.title")}</h2>
            <p className="text-lg text-slate-600">{t("home.industries.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card key={`industry-${index}`} className="h-full bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 group" data-testid={`card-industry-${index}`}>
                <CardContent className="p-6">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors w-fit mb-4">
                    {industry.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{t(industry.titleKey)}</h3>
                  <p className="text-slate-700 leading-relaxed">{t(industry.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">{t("home.features.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">{t("home.features.title")}</h2>
            <p className="text-lg text-slate-600">{t("home.features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformFeatures.map((feature, index) => (
              <Link key={`platform-feature-${index}`} href={feature.href}>
                <Card className="h-full bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex gap-5">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors h-fit">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t(feature.titleKey)}</h3>
                        <p className="text-slate-600 leading-relaxed">{t(feature.descKey)}</p>
                        <span className="text-blue-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t("common.learnMore")} <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="py-20 sm:py-24 overflow-hidden bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">{t("home.showcase.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">{t("home.showcase.title")}</h2>
            <p className="text-lg text-slate-600">{t("home.showcase.subtitle")}</p>
          </div>
          <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
                <TabsTrigger value="dashboard" className="rounded-full px-6 py-2.5 text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300" data-testid="tab-preview-dashboard">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t("home.tabs.analytics")}
                </TabsTrigger>
                <TabsTrigger value="report" className="rounded-full px-6 py-2.5 text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300" data-testid="tab-preview-report">
                  <Layers className="w-4 h-4 mr-2" />
                  {t("home.tabs.reports")}
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-3xl blur-3xl transform scale-95 opacity-50"></div>
              <TabsContent value="dashboard" className="mt-0">
                <div className="relative">
                  <DashboardPreviewMock />
                </div>
              </TabsContent>
              <TabsContent value="report" className="mt-0">
                <div className="relative">
                  <ReportPreviewMock />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">{t("home.howItWorks.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">{t("home.howItWorks.title")}</h2>
            <p className="text-lg text-slate-600">{t("home.howItWorks.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent z-0"></div>
            <StepCard step="01" icon={<Search className="w-8 h-8 text-blue-600" />} title={t("home.step1.title")} desc={t("home.step1.desc")} />
            <StepCard step="02" icon={<Brain className="w-8 h-8 text-purple-600" />} title={t("home.step2.title")} desc={t("home.step2.desc")} />
            <StepCard step="03" icon={<Rocket className="w-8 h-8 text-emerald-600" />} title={t("home.step3.title")} desc={t("home.step3.desc")} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-24 bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardContent className="p-8 space-y-6">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">{t("home.benefits.realResults")}</Badge>
                <h3 className="text-2xl font-bold text-slate-900">{t("home.benefits.saveTitle")}</h3>
                <p className="text-slate-600 leading-relaxed">{t("home.benefits.saveDesc")}</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> {t("home.benefits.costReduction")}</li>
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> {t("home.benefits.qualification")}</li>
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> {t("home.benefits.resilience")}</li>
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-blue-600" /> {t("home.benefits.compliance")}</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardContent className="p-8 space-y-6">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">{t("home.benefits.dataProtected")}</Badge>
                <h3 className="text-2xl font-bold text-slate-900">{t("home.benefits.securityTitle")}</h3>
                <p className="text-slate-600 leading-relaxed">{t("home.benefits.securityDesc")}</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-600" /> {t("home.benefits.soc2")}</li>
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-600" /> {t("home.benefits.encryption")}</li>
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-600" /> {t("home.benefits.sso")}</li>
                  <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-600" /> {t("home.benefits.audit")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Trial CTA */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 border-0 overflow-hidden relative">
            <CardContent className="p-8 md:p-16 relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <Badge className="bg-white/20 text-white border-white/30">Try Free</Badge>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{t("home.ready.title")}</h2>
                  <p className="text-xl text-blue-100">{t("home.ready.subtitle")}</p>
                  <Link href="/signup" data-testid="link-free-trial-cta">
                    <Button size="lg" className="h-12 sm:h-14 px-10 text-lg rounded-xl bg-white text-blue-700 hover:bg-blue-50 shadow-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all" data-testid="button-free-trial-cta">
                      {t("home.trial.title")}
                    </Button>
                  </Link>
                  <p className="text-sm text-blue-100/90">{t("home.trial.footer")}</p>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white uppercase tracking-wider">{t("home.trial.includes")}</h3>
                  <div className="space-y-4">
                    <TrialFeature icon={<Sparkles className="w-5 h-5" />} text={t("home.trial.reports")} />
                    <TrialFeature icon={<BarChart3 className="w-5 h-5" />} text={t("home.trial.platform")} />
                    <TrialFeature icon={<Globe className="w-5 h-5" />} text={t("home.trial.database")} />
                    <TrialFeature icon={<Shield className="w-5 h-5" />} text={t("home.trial.risk")} />
                    <TrialFeature icon={<DollarSign className="w-5 h-5" />} text={t("home.trial.calculator")} />
                    <TrialFeature icon={<Sparkles className="w-5 h-5" />} text={t("home.trial.support")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-slate-50/90">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">{t("home.testimonials.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">{t("home.testimonials.title")}</h2>
            <p className="text-lg text-slate-600">{t("home.testimonials.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "SmartSeek cut our supplier qualification time by 60%. The AI-powered risk assessments give us confidence in every sourcing decision we make.", outcome: "60% faster qualification", name: "Sarah Chen", title: "VP of Procurement", company: "Global Manufacturing Corp" },
              { quote: "The landed cost calculator alone saved us from three costly surprises last quarter. It's become an essential tool for our international sourcing team.", outcome: "Avoided 3 cost overruns", name: "Marcus Weber", title: "Supply Chain Director", company: "EuroTech Industries" },
              { quote: "We discovered verified suppliers in regions we hadn't considered before. SmartSeek's AI reports provided the data we needed to diversify our supply chain.", outcome: "Diversified to 5 new regions", name: "Priya Sharma", title: "Head of Strategic Sourcing", company: "Atlas Retail Group" },
            ].map((testimonial, i) => (
              <Card key={i} className="h-full bg-white border-slate-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{testimonial.outcome}</div>
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
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center border border-slate-200/80 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6 border border-blue-200">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-slate-900">{t("home.cta.title")}</h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto">{t("home.cta.subtitle")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
                <Link href="/signup" data-testid="link-cta-signup">
                  <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all" data-testid="button-cta-signup">
                    {t("home.cta.button")}
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-500 mb-5">{t("home.cta.footer")}</p>
              <TrustBadges variant="compact" />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function StatItem({ value, label, icon, testId }: { value: string, label: string, icon: React.ReactNode, testId: string }) {
  return (
    <div className="p-4 sm:p-6 min-w-0" data-testid={testId}>
      <div className="flex justify-center mb-2 sm:mb-4 text-slate-400">{icon}</div>
      <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-1 sm:mb-2 tabular-nums tracking-tight break-words" data-testid={`${testId}-value`}>{value}</div>
      <div className="text-xs sm:text-sm text-slate-500 font-medium break-words" data-testid={`${testId}-label`}>{label}</div>
    </div>
  );
}

function StepCard({ step, icon, title, desc }: { step: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-lg z-10 group hover:border-blue-300 hover:shadow-xl transition-all duration-300">
      <div className="text-7xl font-bold text-slate-100 absolute top-4 right-6 pointer-events-none group-hover:text-blue-100 transition-colors duration-300">{step}</div>
      <div className="mb-6 p-3 bg-blue-50 w-fit rounded-xl group-hover:bg-blue-100 transition-colors duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}

function TrialFeature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/20 rounded-lg text-white">{icon}</div>
      <span className="text-white font-medium">{text}</span>
    </div>
  );
}
