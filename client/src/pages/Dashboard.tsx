import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Search, 
  FileText, 
  ShoppingBag, 
  TrendingUp,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { user, reports, shortlists } = useStore();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here is what's happening with your sourcing.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/smart-finder">
            <Button className="shadow-lg shadow-primary/20">
              <Search className="mr-2 h-4 w-4" />
              New Smart Finder
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Available Credits" 
          value={user?.credits || 0} 
          icon={<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">$</div>}
          desc="Credits for reports & exports"
        />
        <StatsCard 
          title="Reports Generated" 
          value={reports.length} 
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          desc="Total sourcing reports"
        />
        <StatsCard 
          title="Curated Lists" 
          value={shortlists.length} 
          icon={<ShoppingBag className="w-5 h-5 text-purple-500" />}
          desc="Accessible premium lists"
        />
      </div>

      {/* Recent Activity / Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Link href="/reports">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reports yet. Start a search to generate one.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded text-primary">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-xs text-muted-foreground">{report.date}</div>
                      </div>
                    </div>
                    <Button size="sm" className="h-7 text-xs" variant="outline">View</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Market Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AlertItem 
                icon={<TrendingUp className="text-green-500" />}
                title="Shipping rates dropping"
                desc="Container rates from CN to US West Coast down 5%."
                date="2h ago"
              />
              <AlertItem 
                icon={<AlertTriangle className="text-amber-500" />}
                title="Electronics Shortage"
                desc="Microchip supply chain seeing delays in SE Asia."
                date="1d ago"
              />
              <AlertItem 
                icon={<Clock className="text-blue-500" />}
                title="Holiday Planning"
                desc="Start sourcing for Q4 now to avoid delays."
                date="2d ago"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, desc }: { title: string, value: string | number, icon: React.ReactNode, desc: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function AlertItem({ icon, title, desc, date }: { icon: React.ReactNode, title: string, desc: string, date: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-[10px] text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}