import { useState } from "react";
import { useProfile, useReports, useCreditTransactions, useUser } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import SupplierDiscovery from "@/pages/SupplierDiscovery";
import { 
  ArrowRight, 
  FileQuestion,
  FileText, 
  TrendingUp,
  Users,
  Loader2,
  Sparkles,
  CreditCard,
  Globe2,
  DollarSign,
  MapPin,
  Activity,
  Zap,
  Crown,
  BarChart3,
  Shield,
  Target,
  Home
} from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [embeddedIndustry, setEmbeddedIndustry] = useState("");
  const { data: user } = useUser();
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const { data: reports = [], isLoading: reportsLoading } = useReports();
  const { data: transactions = [] } = useCreditTransactions();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.firstName || user?.email?.split("@")[0] || "there";

  const isLoading = profileLoading || reportsLoading;

  // Embedded supplier search — stays in dashboard context
  if (showSuppliers) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => { setShowSuppliers(false); setEmbeddedIndustry(""); }} className="text-slate-400 hover:text-slate-200">
          ← Back to Dashboard
        </Button>
        <SupplierDiscovery embedded initialIndustry={embeddedIndustry} />
      </div>
    );
  }

  const hasError = !profile && !profileLoading;

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          </div>
          <p className="text-slate-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    const isAuthError = profileError?.message?.includes("401") || profileError?.message?.toLowerCase().includes("not authenticated");
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-200">Unable to load dashboard</h2>
          <p className="text-slate-400 mb-4">
            {isAuthError ? "Your session may have expired." : "Please try refreshing the page."}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={() => refetchProfile()} variant="outline" className="bg-slate-800 hover:bg-slate-700 border border-slate-600">
              Retry
            </Button>
            {isAuthError && (
              <Link href="/login">
                <Button className="bg-slate-800 hover:bg-slate-700 border border-slate-600">Log in again</Button>
              </Link>
            )}
            {!isAuthError && (
              <Button onClick={() => window.location.reload()} className="bg-slate-800 hover:bg-slate-700 border border-slate-600">Refresh Page</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const activityData = (() => {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const result: { name: string; searches: number; reports: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400000;
      const dayReports = reports.filter((r: any) => {
        const t = new Date(r.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      });
      const completed = dayReports.filter((r: any) => r.status === "completed").length;
      result.unshift({
        name: dayLabels[d.getDay()],
        searches: dayReports.length,
        reports: completed,
      });
    }
    return result;
  })();

  const activityTotal = activityData.reduce((s, d) => s + d.searches + d.reports, 0);

  const regionData = reports.length > 0
    ? (() => {
        const counts: Record<string, number> = {};
        reports.forEach((r: any) => {
          const country = r.formData?.originCountry || r.formData?.targetRegion || "Other";
          if (country && country !== "Other") counts[country] = (counts[country] || 0) + 1;
        });
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
        const entries = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, cnt], i) => ({ name, value: total > 0 ? Math.round((cnt / total) * 100) : 0, count: cnt, color: colors[i] || '#94a3b8' }));
        const covered = entries.reduce((s, e) => s + e.value, 0);
        if (covered < 100 && entries.length > 0) {
          entries.push({ name: "Other regions", value: 100 - covered, count: 0, color: '#1e293b' });
        }
        return { entries, totalCovered: Math.min(100, covered) };
      })()
    : null;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-500/40 shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {profile?.plan === 'monthly' && (
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/25 px-3 py-1">
                  <Crown className="w-3.5 h-3.5 mr-1.5" />
                  Pro Member
                </Badge>
              )}
              <Badge variant="outline" className="border-slate-600 text-slate-300 bg-slate-800/50">
                <Shield className="w-3 h-3 mr-1" />
                {profile?.role || 'buyer'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-300 text-lg">
              AI-powered sourcing intelligence at your fingertips.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/reports">
              <Button size="lg" variant="outline" className="shrink-0 border-slate-500 text-slate-200 hover:bg-slate-600/50">
                <FileText className="mr-2 h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">My Reports</span>
              </Button>
            </Link>
            <Link href="/smart-finder">
              <Button size="lg" className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 border-0 text-white font-semibold" data-testid="button-new-search">
                <Sparkles className="mr-2 h-5 w-5 shrink-0" />
                <span className="whitespace-nowrap">New AI Search</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`bg-gradient-to-br from-slate-700/90 to-slate-600/90 border-slate-500/40 shadow-xl backdrop-blur-sm hover:border-slate-400/50 transition-all group min-w-0 relative ${totalCredits === 0 ? "border-amber-500/60" : ""}`}>
          <CardContent className="p-3 sm:p-5">
            {profile?.plan === "free" && (
              <Link href="/billing" className="absolute top-3 right-3">
                <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 h-7 px-2">
                  + Buy more
                </Button>
              </Link>
            )}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg text-white shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-bold mb-1 text-slate-100 group-hover:text-white transition-colors truncate">{totalCredits}</div>
            <div className="text-xs sm:text-sm text-slate-400 truncate">Available Credits</div>
            {totalCredits === 0 && (
              <div className="text-xs text-amber-400 mt-1.5 font-semibold">⚠ Out of credits</div>
            )}
            {profile?.plan === "monthly" && (
              <div className="text-xs text-slate-500 mt-1.5">Refreshes monthly</div>
            )}
          </CardContent>
        </Card>
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Reports Generated"
          value={reports.length}
          change={reports.length > 0 ? `${reports.filter(r => r.status === 'completed').length} complete` : undefined}
          iconBg="from-emerald-500 to-emerald-600"
          cardBg="from-slate-700/90 to-slate-600/90"
        />
        <MetricCard
          icon={<Globe2 className="w-5 h-5" />}
          label="Regions Covered"
          value={(() => { const regions = new Set(reports.map((r: any) => r.formData?.originCountry).filter(Boolean)); return regions.size > 0 ? `${regions.size}` : "—"; })()}
          change="From your reports"
          iconBg="from-amber-500 to-orange-500"
          cardBg="from-slate-700/90 to-slate-600/90"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-slate-700/90 to-slate-600/90 border-slate-500/40 shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-500/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              Weekly Activity
            </CardTitle>
            <Badge variant="outline" className="border-slate-500 text-slate-300 bg-slate-600/50">Last 7 days</Badge>
          </CardHeader>
          <CardContent className="pt-6">
            {activityTotal === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 mb-2">No activity yet this week</p>
                <Link href="/smart-finder">
                  <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                    Start your first search →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} stroke="#475569" />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} stroke="#475569" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                        color: '#e2e8f0'
                      }}
                      formatter={(value: number) => [value, '']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Area type="monotone" dataKey="searches" name="Searches" stroke="#3B82F6" fill="url(#colorSearches)" strokeWidth={2} />
                    <Area type="monotone" dataKey="reports" name="Reports" stroke="#10B981" fill="url(#colorReports)" strokeWidth={2} />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700/90 to-slate-600/90 border-slate-500/40 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-slate-500/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                <MapPin className="w-4 h-4 text-violet-400" />
              </div>
              Top Sourcing Regions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!regionData ? (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400">No reports generated yet</p>
              </div>
            ) : (
              <>
                <div className="h-48 mb-4 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData.entries}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {regionData.entries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                        formatter={(value: number) => [`${value}%`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-200">{regionData.totalCovered}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {regionData.entries.map((region, i) => (
                    <div key={i} className="flex items-center justify-between text-sm group">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: region.color }}></div>
                        <span className="text-slate-300 group-hover:text-white transition-colors">{region.name}</span>
                      </div>
                      <span className="font-semibold text-slate-200">{region.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0f1629] border-slate-500/40 shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-500/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              Recent Reports
            </CardTitle>
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700/50">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-2">No reports yet — Generate your first →</p>
                <Link href="/smart-finder">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500">Generate Report</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {reports.slice(0, 4).map((report: any) => {
                  const fd = report.formData || {};
                  const rd = report.reportData || {};
                  const commodity = (fd.productName || fd.category || report.category || "Report").toString();
                  const landedCost = rd?.landedCostBreakdown?.costPerUnit;
                  const margin = rd?.sellerComparison?.[0]?.profitMargin || rd?.profitAnalysis?.estimatedMargin;
                  return (
                    <Link key={report.id} href={`/reports?open=${report.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/60 transition-all cursor-pointer group" data-testid={`card-report-${report.id}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${report.status === 'completed' ? 'bg-emerald-500' : report.status === 'generating' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="font-medium text-sm text-slate-200 group-hover:text-white truncate capitalize">{commodity}</span>
                          <span className="text-xs text-slate-500 shrink-0">{format(new Date(report.createdAt), "d MMM yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {landedCost && <span className="text-xs text-slate-400">{String(landedCost).startsWith("$") ? landedCost : `$${landedCost}`}/unit</span>}
                          {margin && <span className="text-xs text-emerald-400">{margin} margin</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700/90 to-slate-600/90 border-slate-500/40 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-slate-500/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <a href="/smart-finder" className="p-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 transition-all group block">
                <div className="font-semibold text-slate-200 group-hover:text-white">🔍 AI Sourcing</div>
                <div className="text-xs text-slate-400 mt-0.5">Generate AI reports</div>
              </a>
              <a href="/find-leads" className="p-4 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 transition-all group block">
                <div className="font-semibold text-slate-200 group-hover:text-white">🎯 Find Leads</div>
                <div className="text-xs text-slate-400 mt-0.5">Buyer contacts</div>
              </a>
              <a href="/landed-cost" className="p-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition-all group block">
                <div className="font-semibold text-slate-200 group-hover:text-white">💰 Landed Cost</div>
                <div className="text-xs text-slate-400 mt-0.5">Cost calculator</div>
              </a>
              <a href="/risk-intelligence" className="p-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 transition-all group block">
                <div className="font-semibold text-slate-200 group-hover:text-white">🛡️ Risk Check</div>
                <div className="text-xs text-slate-400 mt-0.5">Risk analysis</div>
              </a>
              <a href="/customs-calculator" className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 transition-all group block">
                <div className="font-semibold text-slate-200 group-hover:text-white">🏛️ Customs</div>
                <div className="text-xs text-slate-400 mt-0.5">Duty calculator</div>
              </a>
              <a href="/ai-agent" className="p-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 transition-all group block">
                <div className="font-semibold text-slate-200 group-hover:text-white">🤖 AI Agent</div>
                <div className="text-xs text-slate-400 mt-0.5">AI assistant</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {transactions.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-700/90 to-slate-600/90 border-slate-500/40 shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-500/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              Recent Credit Activity
            </CardTitle>
            <Link href="/billing">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700/50">Manage Credits</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {tx.amount > 0 ? '+' : '-'}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-200">{tx.description}</div>
                      <div className="text-xs text-slate-500">{format(new Date(tx.createdAt), 'MMM d, h:mm a')}</div>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom section - IndexBox-inspired: clear hierarchy, prominent CTAs */}
      <section className="mt-8 pt-8 border-t border-slate-700/60">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-6">Quick access</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier Discovery */}
          <Card className="group overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-600/60 hover:border-blue-500/40 shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              <div className="flex-1 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Supplier Discovery</h3>
                    <p className="text-sm text-slate-400">Verified global suppliers</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">Search and connect with verified suppliers. Filter by industry, region, and certifications.</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Electronics & Semiconductors", "Textiles & Apparel", "Machinery & Industrial Equipment", "Chemicals & Petrochemicals", "Mining & Minerals"].map((industry) => (
                    <button
                      key={industry}
                      onClick={() => { setEmbeddedIndustry(industry); setShowSuppliers(true); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/60 hover:bg-blue-600/30 text-slate-300 hover:text-blue-200 border border-slate-600/60 hover:border-blue-500/40 transition-all"
                    >
                      {industry}
                    </button>
                  ))}
                </div>
                <Button onClick={() => { setEmbeddedIndustry(""); setShowSuppliers(true); }} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25">
                  Browse All Suppliers <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick RFQ */}
          <Card className="group overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-slate-600/60 hover:border-emerald-500/40 shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              <div className="flex-1 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileQuestion className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Request for Quotation</h3>
                    <p className="text-sm text-slate-400">Get competitive quotes</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Submit an RFQ and receive competitive quotes from verified suppliers worldwide. Fast turnaround, transparent pricing.</p>
                <Link href="/rfq">
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25">
                    Submit New RFQ <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, change, iconBg, cardBg }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  change?: string;
  iconBg: string;
  cardBg: string;
}) {
  return (
    <Card className={`bg-gradient-to-br ${cardBg} border-slate-500/40 shadow-xl backdrop-blur-sm hover:border-slate-400/50 transition-all group min-w-0`}>
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-lg text-white shrink-0`}>
            {icon}
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-bold mb-1 text-slate-100 group-hover:text-white transition-colors truncate">{value}</div>
        <div className="text-xs sm:text-sm text-slate-400 truncate">{label}</div>
        {change && (
          <div className="text-xs text-blue-400 mt-1.5 sm:mt-2 font-semibold truncate">{change}</div>
        )}
      </CardContent>
    </Card>
  );
}
