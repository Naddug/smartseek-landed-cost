import { useProfile, useReports, useShortlists, useCreditTransactions } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Search, 
  FileText, 
  ShoppingBag, 
  TrendingUp,
  Calendar,
  Loader2,
  Sparkles,
  CreditCard,
  Globe2,
  Building2,
  Star,
  Users,
  DollarSign,
  Package,
  MapPin,
  Activity,
  Zap,
  Crown
} from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: reports = [], isLoading: reportsLoading } = useReports();
  const { data: shortlists = [], isLoading: shortlistsLoading } = useShortlists();
  const { data: transactions = [] } = useCreditTransactions();

  const isLoading = profileLoading || reportsLoading || shortlistsLoading;

  const hasError = !profile && !profileLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Unable to load dashboard</h2>
          <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  // Generate activity data for chart
  const activityData = [
    { name: 'Mon', reports: 2, credits: 5 },
    { name: 'Tue', reports: 1, credits: 3 },
    { name: 'Wed', reports: 3, credits: 8 },
    { name: 'Thu', reports: 0, credits: 0 },
    { name: 'Fri', reports: 2, credits: 4 },
    { name: 'Sat', reports: 1, credits: 2 },
    { name: 'Sun', reports: reports.length, credits: 6 },
  ];

  // Category distribution
  const categoryData = shortlists.reduce((acc: any[], list) => {
    const existing = acc.find(c => c.name === list.category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: list.category, value: 1 });
    }
    return acc;
  }, []).slice(0, 5);

  // Top regions
  const regionData = [
    { name: 'China', value: 35, color: '#3b82f6' },
    { name: 'Vietnam', value: 25, color: '#10b981' },
    { name: 'India', value: 20, color: '#f59e0b' },
    { name: 'Mexico', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {profile?.plan === 'pro' && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
              <Badge variant="outline">{profile?.role || 'buyer'}</Badge>
            </div>
            <h1 className="text-3xl font-heading font-bold">Welcome to SmartSeek</h1>
            <p className="text-muted-foreground mt-1">Your AI-powered sourcing command center.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/smart-finder">
              <Button className="shadow-lg shadow-primary/20" data-testid="button-new-search">
                <Sparkles className="mr-2 h-4 w-4" />
                New AI Search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          label="Available Credits"
          value={profile?.credits || 0}
          change={profile?.plan === 'pro' ? '+30/mo' : undefined}
          gradient="from-blue-500/10 to-indigo-500/10"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5 text-green-500" />}
          label="Reports Generated"
          value={reports.length}
          change={reports.length > 0 ? `${reports.filter(r => r.status === 'completed').length} complete` : undefined}
          gradient="from-green-500/10 to-emerald-500/10"
        />
        <MetricCard
          icon={<Building2 className="w-5 h-5 text-purple-500" />}
          label="Supplier Lists"
          value={shortlists.length}
          change={`${shortlists.filter(s => !s.isPremium || profile?.plan === 'pro').length} available`}
          gradient="from-purple-500/10 to-pink-500/10"
        />
        <MetricCard
          icon={<Globe2 className="w-5 h-5 text-orange-500" />}
          label="Regions Covered"
          value="50+"
          change="Global network"
          gradient="from-orange-500/10 to-amber-500/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Weekly Activity
            </CardTitle>
            <Badge variant="outline">Last 7 days</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#3b82f6" fill="url(#colorReports)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Region Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Top Sourcing Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {regionData.map((region, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }}></div>
                    <span>{region.name}</span>
                  </div>
                  <span className="font-medium">{region.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Reports
            </CardTitle>
            <Link href="/reports">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No reports yet</p>
                <Link href="/smart-finder">
                  <Button size="sm">Generate First Report</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 4).map((report) => (
                  <Link key={report.id} href="/reports">
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" data-testid={`card-report-${report.id}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${report.status === 'completed' ? 'bg-green-100 text-green-600' : report.status === 'generating' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{report.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(report.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <Badge variant={report.status === 'completed' ? 'outline' : 'secondary'} className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/smart-finder">
              <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">AI Smart Finder</div>
                    <div className="text-sm text-muted-foreground">Generate sourcing intelligence with AI</div>
                  </div>
                  <Badge>1 Credit</Badge>
                </div>
              </div>
            </Link>

            <Link href="/shortlists">
              <div className="p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Browse Supplier Lists</div>
                    <div className="text-sm text-muted-foreground">{shortlists.length} curated lists available</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>

            <Link href="/tools">
              <div className="p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Cost Calculator</div>
                    <div className="text-sm text-muted-foreground">Estimate landed costs & margins</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>

            {profile?.plan !== 'pro' && (
              <Link href="/billing">
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Upgrade to Pro</div>
                      <div className="text-sm text-muted-foreground">Unlock all features + 30 credits/mo</div>
                    </div>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">$10/mo</Badge>
                  </div>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Shortlists */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Featured Supplier Lists
          </CardTitle>
          <Link href="/shortlists">
            <Button variant="ghost" size="sm">View All ({shortlists.length})</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shortlists.slice(0, 3).map((list) => {
              const suppliers = list.suppliers as any[];
              const isLocked = list.isPremium && profile?.plan !== 'pro';
              
              return (
                <Link key={list.id} href="/shortlists">
                  <div className={`p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer ${isLocked ? 'opacity-70' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={list.isPremium ? 'default' : 'secondary'}>
                        {list.isPremium ? 'Premium' : 'Free'}
                      </Badge>
                      {isLocked && <span className="text-xs text-muted-foreground">Pro only</span>}
                    </div>
                    <h4 className="font-medium mb-1 line-clamp-1">{list.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{list.category}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{suppliers?.length || 0} suppliers</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Credit Usage */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Credit Activity
            </CardTitle>
            <Link href="/billing">
              <Button variant="ghost" size="sm">Manage Credits</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.amount > 0 ? '+' : '-'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), 'MMM d, h:mm a')}</div>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
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

function MetricCard({ icon, label, value, change, gradient }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  change?: string;
  gradient: string;
}) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} border-0`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-background/80 flex items-center justify-center shadow-sm">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {change && (
          <div className="text-xs text-primary mt-2 font-medium">{change}</div>
        )}
      </CardContent>
    </Card>
  );
}
