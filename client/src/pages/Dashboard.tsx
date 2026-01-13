import { useProfile, useReports, useCreditTransactions } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  ArrowRight, 
  FileText, 
  TrendingUp,
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
  Target
} from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: reports = [], isLoading: reportsLoading } = useReports();
  const { data: transactions = [] } = useCreditTransactions();

  const isLoading = profileLoading || reportsLoading;

  const hasError = !profile && !profileLoading;

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          </div>
          <p className="text-slate-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-200">Unable to load dashboard</h2>
          <p className="text-slate-400 mb-4">Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} className="bg-slate-800 hover:bg-slate-700 border border-slate-600">Refresh Page</Button>
        </div>
      </div>
    );
  }

  const activityData = [
    { name: 'Mon', reports: 2, credits: 5 },
    { name: 'Tue', reports: 1, credits: 3 },
    { name: 'Wed', reports: 3, credits: 8 },
    { name: 'Thu', reports: 0, credits: 0 },
    { name: 'Fri', reports: 2, credits: 4 },
    { name: 'Sat', reports: 1, credits: 2 },
    { name: 'Sun', reports: reports.length, credits: 6 },
  ];

  const regionData = [
    { name: 'China', value: 35, color: '#3b82f6' },
    { name: 'Vietnam', value: 25, color: '#10b981' },
    { name: 'India', value: 20, color: '#f59e0b' },
    { name: 'Mexico', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
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
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
              Command Center
            </h1>
            <p className="text-slate-400 text-lg">
              AI-powered sourcing intelligence at your fingertips.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/smart-finder">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 border-0 text-white font-semibold" data-testid="button-new-search">
                <Sparkles className="mr-2 h-5 w-5" />
                New AI Search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Available Credits"
          value={totalCredits}
          change={profile?.plan === 'monthly' ? '+30/mo' : undefined}
          iconBg="from-blue-500 to-blue-600"
          cardBg="from-slate-800/80 to-slate-900/80"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Reports Generated"
          value={reports.length}
          change={reports.length > 0 ? `${reports.filter(r => r.status === 'completed').length} complete` : undefined}
          iconBg="from-emerald-500 to-emerald-600"
          cardBg="from-slate-800/80 to-slate-900/80"
        />
        <MetricCard
          icon={<Globe2 className="w-5 h-5" />}
          label="Regions Covered"
          value="50+"
          change="Global network"
          iconBg="from-amber-500 to-orange-500"
          cardBg="from-slate-800/80 to-slate-900/80"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              Weekly Activity
            </CardTitle>
            <Badge variant="outline" className="border-slate-600 text-slate-400 bg-slate-800/50">Last 7 days</Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                  />
                  <Area type="monotone" dataKey="reports" stroke="#3b82f6" fill="url(#colorReports)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                <MapPin className="w-4 h-4 text-violet-400" />
              </div>
              Top Sourcing Regions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {regionData.map((region, i) => (
                <div key={i} className="flex items-center justify-between text-sm group">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: region.color }}></div>
                    <span className="text-slate-300 group-hover:text-white transition-colors">{region.name}</span>
                  </div>
                  <span className="font-semibold text-slate-200">{region.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 pb-4">
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
                <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                  <FileText className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 mb-4">No reports yet</p>
                <Link href="/smart-finder">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500">Generate First Report</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 4).map((report) => (
                  <Link key={report.id} href="/reports">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all cursor-pointer group" data-testid={`card-report-${report.id}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${report.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : report.status === 'generating' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">{report.title}</div>
                          <div className="text-xs text-slate-500">
                            {format(new Date(report.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${report.status === 'completed' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-slate-500/50 text-slate-400 bg-slate-600/30'}`}>
                        {report.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Link href="/smart-finder">
              <div className="p-4 rounded-xl border-2 border-dashed border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400/60 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">SmartSeek AI</div>
                    <div className="text-sm text-slate-400">Generate sourcing intelligence with AI</div>
                  </div>
                  <Badge className="bg-blue-600/30 text-blue-300 border-blue-500/50">1 Credit</Badge>
                </div>
              </div>
            </Link>

            <Link href="/find-leads">
              <div className="p-4 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400/60 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">Find Buyer Leads</div>
                    <div className="text-sm text-slate-400">Discover qualified buyer contacts</div>
                  </div>
                  <Badge className="bg-emerald-600/30 text-emerald-300 border-emerald-500/50">1 Credit</Badge>
                </div>
              </div>
            </Link>

            <Link href="/tools">
              <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-200 group-hover:text-white transition-colors">Cost Calculator</div>
                    <div className="text-sm text-slate-400">Estimate landed costs & margins</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            </Link>

            {profile?.plan !== 'monthly' && (
              <Link href="/billing">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-violet-600/20 border border-blue-500/30 hover:from-blue-600/30 hover:via-indigo-600/30 hover:to-violet-600/30 hover:border-blue-400/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">Upgrade to Pro</div>
                      <div className="text-sm text-slate-400">Unlock all features + 30 credits/mo</div>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">$10/mo</Badge>
                  </div>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {transactions.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 pb-4">
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
                <div key={tx.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-700/20 border border-slate-600/20 hover:bg-slate-700/30 transition-colors">
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
    <Card className={`bg-gradient-to-br ${cardBg} border-slate-700/50 shadow-xl backdrop-blur-sm hover:border-slate-600/50 transition-all group`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-lg text-white`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold mb-1 text-slate-100 group-hover:text-white transition-colors">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
        {change && (
          <div className="text-xs text-blue-400 mt-2 font-semibold">{change}</div>
        )}
      </CardContent>
    </Card>
  );
}
