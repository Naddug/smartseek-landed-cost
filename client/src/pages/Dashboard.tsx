import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProfile, useReports, useCreditTransactions, useUser } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SupplierDiscovery from "@/pages/SupplierDiscovery";
import {
  ArrowRight,
  FileQuestion,
  FileText,
  Users,
  Loader2,
  Search,
  Sparkles,
  CreditCard,
  Globe2,
  Activity,
  Crown,
  BarChart3,
  Shield,
  Target,
  Bot,
  Calculator,
  Landmark,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── helpers ────────────────────────────────────────────────────────────────

function relativeDate(date: string | Date) {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "d MMM");
}

// ─── main component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation();
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [embeddedIndustry, setEmbeddedIndustry] = useState("");
  const [embeddedQuery, setEmbeddedQuery] = useState("");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: user } = useUser();
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const { data: reports = [], isLoading: reportsLoading } = useReports();
  const { data: transactions = [] } = useCreditTransactions();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("dashboard.greetingMorning") : hour < 17 ? t("dashboard.greetingAfternoon") : t("dashboard.greetingEvening");
  const firstName = user?.firstName || user?.email?.split("@")[0] || "there";
  const isPro = profile?.plan === "monthly";
  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  const isLoading = profileLoading || reportsLoading;

  // ── embedded supplier view ────────────────────────────────────────────────
  if (showSuppliers) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => { setShowSuppliers(false); setEmbeddedIndustry(""); setEmbeddedQuery(""); }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors -ml-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          {t("dashboard.backToDashboard")}
        </button>
        <SupplierDiscovery embedded initialIndustry={embeddedIndustry} initialQuery={embeddedQuery} />
      </div>
    );
  }

  // ── loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-slate-400">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  // ── error ─────────────────────────────────────────────────────────────────
  const hasError = !profile && !profileLoading;
  if (hasError) {
    const isAuthError = profileError?.message?.includes("401") || profileError?.message?.toLowerCase().includes("not authenticated");
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{t("dashboard.unableToLoad")}</p>
            <p className="text-sm text-slate-400 mt-1">{isAuthError ? t("dashboard.sessionExpired") : t("dashboard.tryRefreshing")}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetchProfile()} variant="outline" size="sm">{t("dashboard.retry")}</Button>
            {isAuthError
              ? <Link href="/login"><Button size="sm">{t("dashboard.logInAgain")}</Button></Link>
              : <Button onClick={() => window.location.reload()} size="sm">{t("dashboard.refreshPage")}</Button>
            }
          </div>
        </div>
      </div>
    );
  }

  // ── derived data ──────────────────────────────────────────────────────────
  const completedReports = reports.filter((r: any) => r.status === "completed").length;
  const uniqueRegions = new Set(reports.map((r: any) => r.formData?.originCountry).filter(Boolean)).size;

  const activityData = (() => {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400000;
      const dayReports = reports.filter((r: any) => {
        const ts = new Date(r.createdAt).getTime();
        return ts >= dayStart && ts < dayEnd;
      });
      return {
        name: dayLabels[d.getDay()],
        searches: dayReports.length,
        reports: dayReports.filter((r: any) => r.status === "completed").length,
      };
    });
  })();

  const activityTotal = activityData.reduce((s, d) => s + d.searches + d.reports, 0);

  const regionData = (() => {
    if (!reports.length) return null;
    const counts: Record<string, number> = {};
    reports.forEach((r: any) => {
      const c = r.formData?.originCountry || r.formData?.targetRegion;
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const palette = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, cnt], i) => ({
        name,
        value: total > 0 ? Math.round((cnt / total) * 100) : 0,
        color: palette[i] || "#94a3b8",
      }));
  })();

  const isNewUser = reports.length === 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 min-w-0 max-w-7xl pb-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          <p className="text-sm text-slate-400">{greeting},</p>
          <h1 className="text-[1.65rem] font-bold tracking-tight text-slate-900 mt-0.5 flex items-center gap-2.5 flex-wrap">
            {firstName}
            {isPro && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                <Crown className="w-3 h-3" /> Pro
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/app/reports">
            <Button variant="outline" size="sm" className="gap-1.5 h-9 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <FileText className="w-3.5 h-3.5" />
              {t("dashboard.myReports")}
            </Button>
          </Link>
          <Link href="/app/smart-finder">
            <Button size="sm" className="gap-1.5 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200" data-testid="button-new-search">
              <Sparkles className="w-3.5 h-3.5" />
              {t("dashboard.newAISearch")}
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Smart Search Bar ────────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = dashboardSearch.trim();
          if (!q) return;
          setEmbeddedQuery(q);
          setEmbeddedIndustry("");
          setShowSuppliers(true);
        }}
        className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2 focus-within:border-blue-300 focus-within:shadow-md transition-all"
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          ref={searchRef}
          type="text"
          value={dashboardSearch}
          onChange={(e) => setDashboardSearch(e.target.value)}
          placeholder={t('dashboard.searchPlaceholder')}
          className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none py-1.5"
        />
        {dashboardSearch && (
          <button type="button" onClick={() => setDashboardSearch("")} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
            <Zap className="w-3.5 h-3.5 rotate-45" />
          </button>
        )}
        <Button type="submit" size="sm" className="shrink-0 h-8 px-4 bg-blue-600 hover:bg-blue-700">
          {t('dashboard.search')}
        </Button>
      </form>

      {/* ── KPI Strip ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          accent="#3b82f6"
          icon={<CreditCard className="w-4 h-4 text-blue-500" />}
          value={String(totalCredits)}
          label={t("dashboard.availableCredits")}
          warning={totalCredits === 0}
          footer={
            totalCredits === 0
              ? <Link href="/app/billing"><span className="text-amber-600 font-semibold hover:underline">{t('dashboard.buyCredits')}</span></Link>
              : isPro
              ? <span className="text-slate-400">{t("dashboard.refreshesMonthly")}</span>
              : <Link href="/app/billing"><span className="text-blue-500 hover:underline text-[11px]">+ {t("dashboard.buyMore")}</span></Link>
          }
        />
        <KpiCard
          accent="#10b981"
          icon={<FileText className="w-4 h-4 text-emerald-500" />}
          value={String(reports.length)}
          label={t("dashboard.reportsGenerated")}
          footer={
            completedReports > 0
              ? <span className="text-slate-400">{t('dashboard.completedReports', { count: completedReports })}</span>
              : <span className="text-slate-300">{t('dashboard.noReportsGenerated')}</span>
          }
        />
        <KpiCard
          accent="#8b5cf6"
          icon={<Globe2 className="w-4 h-4 text-violet-500" />}
          value={uniqueRegions > 0 ? String(uniqueRegions) : "—"}
          label={t("dashboard.regionsCovered")}
          footer={<span className="text-slate-400">{t("dashboard.fromYourReports")}</span>}
        />
        <KpiCard
          accent="#f59e0b"
          icon={<Activity className="w-4 h-4 text-amber-500" />}
          value={String(activityTotal)}
          label={t('dashboard.thisWeek')}
          footer={<span className="text-slate-400">{t('dashboard.searchesAndReports')}</span>}
        />
      </div>

      {/* ── New user: Getting Started ───────────────────────────────────────── */}
      {isNewUser && (
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border border-blue-100 p-7">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{t('dashboard.getStarted')}</p>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">{t('dashboard.welcomeToSmartSeek')}</h2>
          <p className="text-sm text-slate-500 mb-6">{t('dashboard.threeStepsToFind')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", icon: <Sparkles className="w-5 h-5 text-blue-500" />, title: t('dashboard.runAISearch'), desc: t('dashboard.runAISearchDesc'), href: "/smart-finder", cta: t('dashboard.startSearching') },
              { step: "2", icon: <FileText className="w-5 h-5 text-violet-500" />, title: t('dashboard.generateReportTitle'), desc: t('dashboard.generateReportDesc'), href: "/smart-finder", cta: t('dashboard.generateReportCta') },
              { step: "3", icon: <FileQuestion className="w-5 h-5 text-emerald-500" />, title: t('dashboard.submitRFQTitle'), desc: t('dashboard.submitRFQDesc2'), href: "/rfq", cta: t('dashboard.submitRFQCta') },
            ].map(({ step, icon, title, desc, href, cta }) => (
              <Link key={step} href={href}>
                <div className="bg-white/70 hover:bg-white rounded-xl border border-white/80 hover:border-blue-100 hover:shadow-sm p-5 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 tabular-nums">0{step}</span>
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform">{icon}</div>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
                  <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-600 flex items-center gap-1">
                    {cta} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Activity Chart + Quick Actions ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-0 flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">{t("dashboard.weeklyActivity")}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.last7Days")}</p>
            </div>
            <div className="flex items-center gap-4 pt-0.5">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                {t("dashboard.searches")}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {t("dashboard.reports")}
              </span>
            </div>
          </div>

          {activityTotal === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-3 px-6 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">{t("dashboard.noActivityYet")}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.activityAfterSearch')}</p>
              </div>
              <Link href="/app/smart-finder">
                <Button size="sm" variant="outline" className="mt-1">{t("dashboard.startFirstSearch")}</Button>
              </Link>
            </div>
          ) : (
            <div className="h-56 px-2 pt-4 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 4, right: 16, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={6} />
                  <YAxis tick={{ fontSize: 11, fill: "#cbd5e1" }} axisLine={false} tickLine={false} allowDecimals={false} width={32} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 24px 0 rgba(0,0,0,0.07)" }}
                    formatter={(v: number, name: string) => [v, name === "searches" ? t("dashboard.searches") : t("dashboard.reports")]}
                    labelStyle={{ color: "#64748b", fontWeight: 600, marginBottom: 4 }}
                  />
                  <Area type="monotone" dataKey="searches" stroke="#3b82f6" strokeWidth={2} fill="url(#gS)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
                  <Area type="monotone" dataKey="reports"  stroke="#10b981" strokeWidth={2} fill="url(#gR)" dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 text-[15px] mb-1">{t('dashboard.quickActions')}</h2>
          <p className="text-xs text-slate-400 mb-4">{t('dashboard.jumpToTool')}</p>
          <div className="space-y-0.5">
            {[
              { href: "/app/smart-finder",        icon: <Sparkles className="w-4 h-4" />, label: t('dashboard.aiSourcing'),    desc: t('dashboard.findSuppliersWithAI'),  color: "blue"   },
              { href: "/app/find-leads",           icon: <Target    className="w-4 h-4" />, label: t('dashboard.findLeads'),    desc: t('dashboard.qualifiedContacts'), color: "teal"   },
              { href: "/app/ai-agent",             icon: <Bot       className="w-4 h-4" />, label: t('dashboard.aiAgent'),      desc: t('dashboard.chatWithAI'),    color: "indigo" },
              { href: "/app/landed-cost",          icon: <Calculator className="w-4 h-4" />, label: t('dashboard.landedCost'),   desc: t('dashboard.trueImportCost'),   color: "amber"  },
              { href: "/app/risk-intelligence",    icon: <Shield    className="w-4 h-4" />, label: t('dashboard.riskCheck'),    desc: t('dashboard.supplierRiskAnalysis'),   color: "violet" },
              { href: "/app/customs-calculator",   icon: <Landmark  className="w-4 h-4" />, label: t('dashboard.customs'),       desc: t('dashboard.dutyTaxEstimator'),     color: "orange" },
            ].map((a) => <ActionRow key={a.href} {...a} />)}
          </div>
        </div>
      </div>

      {/* ── Recent Reports + Sourcing Regions ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">{t('dashboard.recentReports')}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{reports.length > 0 ? t('dashboard.totalReports', { count: reports.length }) : t('dashboard.noReportsGenerated')}</p>
            </div>
            <Link href="/app/reports">
              <button className="text-xs text-slate-400 hover:text-blue-500 transition-colors font-medium flex items-center gap-0.5">
                {t('dashboard.viewAll')} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{t('dashboard.noReportsGenerated')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.generateReportDesc')}</p>
              </div>
              <Link href="/app/smart-finder">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 mt-1">{t('dashboard.generateReport')}</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {reports.slice(0, 5).map((report: any) => {
                const fd = report.formData || {};
                const rd = report.reportData || {};
                const commodity = (fd.productName || fd.category || report.category || "Report").toString();
                const landedCost = rd?.landedCostBreakdown?.costPerUnit;
                const margin = rd?.sellerComparison?.[0]?.profitMargin || rd?.profitAnalysis?.estimatedMargin;
                const country = fd.originCountry || fd.targetRegion;
                return (
                  <Link key={report.id} href={`/app/reports?open=${report.id}`}>
                    <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group" data-testid={`card-report-${report.id}`}>
                      <ReportStatusIcon status={report.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate capitalize">{commodity}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {country && <span className="text-[11px] text-slate-400">{country}</span>}
                          {margin && <><span className="text-slate-200">·</span><span className="text-[11px] text-emerald-600 font-medium">{margin} {t('dashboard.marginLabel')}</span></>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {landedCost && (
                          <p className="text-xs font-semibold text-slate-600">{String(landedCost).startsWith("$") ? landedCost : `$${landedCost}`}/unit</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-0.5">{relativeDate(report.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Sourcing Regions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">{t("dashboard.topSourcingRegions")}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.fromYourReports")}</p>
            </div>
            <Globe2 className="w-4 h-4 text-slate-200" />
          </div>

          {!regionData ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{t("dashboard.noReportsYet")}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.sourcingRegions')}</p>
              </div>
            </div>
          ) : (
            <div className="px-6 py-5 space-y-4">
              {regionData.map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                      <span className="text-sm text-slate-600 font-medium truncate">{r.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 shrink-0 ml-2">{r.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${r.value}%`, backgroundColor: r.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Supplier Discovery + RFQ ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{t('dashboard.supplierDiscovery')}</h3>
                  <p className="text-xs text-slate-400">{t('dashboard.verifiedGlobalSuppliers')}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              {t('dashboard.searchConnectSuppliers')}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["Electronics", "Textiles", "Machinery", "Chemicals", "Plastics", "Automotive"].map((industry) => (
                <button
                  key={industry}
                  onClick={() => { setEmbeddedIndustry(industry); setEmbeddedQuery(""); setShowSuppliers(true); }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all"
                >
                  {industry}
                </button>
              ))}
            </div>
            <Button
              onClick={() => { setEmbeddedIndustry(""); setEmbeddedQuery(""); setShowSuppliers(true); }}
              size="sm"
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              {t('dashboard.browseAllSuppliers')} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <FileQuestion className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{t('dashboard.requestForQuotation')}</h3>
                  <p className="text-xs text-slate-400">{t('dashboard.getCompetitiveQuotes')}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              {t('dashboard.submitRFQDesc')}
            </p>
            <div className="flex gap-6 mb-5 text-center">
              {[
                { value: "48h", label: t('dashboard.avgResponse') },
                { value: "5+", label: t('dashboard.quotesPerRFQ') },
                { value: "100%", label: t('dashboard.verified') },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-lg font-bold text-slate-800">{value}</p>
                  <p className="text-[11px] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
            <Link href="/rfq">
              <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                {t('dashboard.submitNewRFQ')} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Credit Activity ─────────────────────────────────────────────────── */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">{t('dashboard.creditActivity')}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.recentCredits')}</p>
            </div>
            <Link href="/app/billing">
              <button className="text-xs text-slate-400 hover:text-blue-500 transition-colors font-medium flex items-center gap-0.5">
                {t('dashboard.manageBilling')} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {transactions.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${tx.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-400"}`}>
                  {tx.amount > 0 ? "+" : "−"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{tx.description}</p>
                  <p className="text-[11px] text-slate-400">{format(new Date(tx.createdAt), "MMM d, h:mm a")}</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${tx.amount > 0 ? "text-emerald-600" : "text-red-400"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

function KpiCard({
  accent,
  icon,
  value,
  label,
  footer,
  warning = false,
}: {
  accent: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  footer?: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden min-w-0 transition-shadow hover:shadow-md ${warning ? "border-amber-200" : "border-slate-100"}`}>
      <div className="h-0.5" style={{ background: warning ? "#f59e0b" : accent }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
            {icon}
          </div>
          {warning && (
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Low</span>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight truncate">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{label}</p>
        {footer && <div className="text-[11px] mt-2">{footer}</div>}
      </div>
    </div>
  );
}

const actionColors: Record<string, { bg: string; text: string }> = {
  blue:   { bg: "bg-blue-50 group-hover:bg-blue-100",   text: "text-blue-500"   },
  teal:   { bg: "bg-teal-50 group-hover:bg-teal-100",   text: "text-teal-500"   },
  indigo: { bg: "bg-indigo-50 group-hover:bg-indigo-100", text: "text-indigo-500" },
  amber:  { bg: "bg-amber-50 group-hover:bg-amber-100", text: "text-amber-500"  },
  violet: { bg: "bg-violet-50 group-hover:bg-violet-100", text: "text-violet-500" },
  orange: { bg: "bg-orange-50 group-hover:bg-orange-100", text: "text-orange-500" },
};

function ActionRow({ href, icon, label, desc, color }: {
  href: string; icon: React.ReactNode; label: string; desc: string; color: string;
}) {
  const c = actionColors[color] || actionColors.blue;
  return (
    <a href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer -mx-1">
      <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center shrink-0 transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">{label}</p>
        <p className="text-xs text-slate-400 truncate">{desc}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
    </a>
  );
}

function ReportStatusIcon({ status }: { status: string }) {
  if (status === "completed") return (
    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    </div>
  );
  if (status === "generating") return (
    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
      <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
      <XCircle className="w-4 h-4 text-red-400" />
    </div>
  );
}
