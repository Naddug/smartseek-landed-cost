import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, TrendingDown, Globe, Package, Ship, DollarSign,
  ArrowUpRight, ArrowDownRight, Calendar, Filter, Download
} from "lucide-react";

const importExportData = [
  { month: "Jan", imports: 245, exports: 189 },
  { month: "Feb", imports: 267, exports: 201 },
  { month: "Mar", imports: 298, exports: 234 },
  { month: "Apr", imports: 312, exports: 256 },
  { month: "May", imports: 287, exports: 243 },
  { month: "Jun", imports: 334, exports: 278 },
  { month: "Jul", imports: 356, exports: 289 },
  { month: "Aug", imports: 378, exports: 312 },
  { month: "Sep", imports: 345, exports: 298 },
  { month: "Oct", imports: 389, exports: 334 },
  { month: "Nov", imports: 412, exports: 356 },
  { month: "Dec", imports: 434, exports: 378 },
];

const topCountries = [
  { name: "China", value: 35, color: "#3b82f6" },
  { name: "Germany", value: 18, color: "#10b981" },
  { name: "USA", value: 15, color: "#f59e0b" },
  { name: "Japan", value: 12, color: "#ef4444" },
  { name: "South Korea", value: 8, color: "#8b5cf6" },
  { name: "Others", value: 12, color: "#6b7280" },
];

const productCategories = [
  { category: "Electronics", imports: 89, exports: 45 },
  { category: "Machinery", imports: 67, exports: 78 },
  { category: "Textiles", imports: 56, exports: 34 },
  { category: "Chemicals", imports: 45, exports: 56 },
  { category: "Auto Parts", imports: 78, exports: 67 },
  { category: "Food & Bev", imports: 34, exports: 23 },
];

const priceIndex = [
  { month: "Jan", steel: 100, copper: 100, aluminum: 100, plastic: 100 },
  { month: "Feb", steel: 102, copper: 98, aluminum: 101, plastic: 99 },
  { month: "Mar", steel: 105, copper: 103, aluminum: 104, plastic: 102 },
  { month: "Apr", steel: 108, copper: 107, aluminum: 106, plastic: 105 },
  { month: "May", steel: 106, copper: 112, aluminum: 108, plastic: 103 },
  { month: "Jun", steel: 110, copper: 115, aluminum: 112, plastic: 107 },
  { month: "Jul", steel: 115, copper: 118, aluminum: 115, plastic: 110 },
  { month: "Aug", steel: 112, copper: 122, aluminum: 118, plastic: 108 },
  { month: "Sep", steel: 118, copper: 125, aluminum: 120, plastic: 112 },
  { month: "Oct", steel: 122, copper: 128, aluminum: 123, plastic: 115 },
  { month: "Nov", steel: 125, copper: 130, aluminum: 126, plastic: 118 },
  { month: "Dec", steel: 128, copper: 132, aluminum: 128, plastic: 120 },
];

const shippingRates = [
  { route: "Shanghai-LA", current: 2850, previous: 2650, change: 7.5 },
  { route: "Shanghai-Rotterdam", current: 1980, previous: 1850, change: 7.0 },
  { route: "Shenzhen-NY", current: 3200, previous: 3050, change: 4.9 },
  { route: "Ho Chi Minh-LA", current: 2450, previous: 2300, change: 6.5 },
  { route: "Mumbai-Rotterdam", current: 1650, previous: 1580, change: 4.4 },
];

const topSuppliers = [
  { rank: 1, name: "Shenzhen Electronics Co.", country: "China", category: "Electronics", rating: 4.8, orders: 1245 },
  { rank: 2, name: "Dongguan Manufacturing", country: "China", category: "Machinery", rating: 4.7, orders: 987 },
  { rank: 3, name: "Vietnam Textile Group", country: "Vietnam", category: "Textiles", rating: 4.6, orders: 756 },
  { rank: 4, name: "India Chemicals Ltd", country: "India", category: "Chemicals", rating: 4.5, orders: 654 },
  { rank: 5, name: "Thailand Auto Parts", country: "Thailand", category: "Auto Parts", rating: 4.5, orders: 543 },
];

export default function TradeData() {
  const [timeRange, setTimeRange] = useState("12m");
  const [region, setRegion] = useState("global");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Trade Data Dashboard</h1>
          <p className="text-muted-foreground">
            Global trade insights, market trends, and pricing intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]" data-testid="select-time-range">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[140px]" data-testid="select-region">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="asia">Asia Pacific</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Imports"
          value="$4.26B"
          change={12.4}
          trend="up"
          icon={<Package className="w-5 h-5" />}
        />
        <MetricCard
          title="Total Exports"
          value="$3.17B"
          change={8.7}
          trend="up"
          icon={<Ship className="w-5 h-5" />}
        />
        <MetricCard
          title="Trade Balance"
          value="-$1.09B"
          change={-3.2}
          trend="down"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="Active Suppliers"
          value="2,847"
          change={15.3}
          trend="up"
          icon={<Globe className="w-5 h-5" />}
        />
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="volume" className="w-full">
        <TabsList>
          <TabsTrigger value="volume">Trade Volume</TabsTrigger>
          <TabsTrigger value="countries">By Country</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="pricing">Price Index</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Trends</CardTitle>
              <CardDescription>Monthly trade volume in billions USD</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={importExportData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="imports" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Imports ($B)" />
                  <Area type="monotone" dataKey="exports" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Exports ($B)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Import Origins</CardTitle>
                <CardDescription>Share of total imports by country</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topCountries}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {topCountries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Country Rankings</CardTitle>
                <CardDescription>Trade volume by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCountries.slice(0, 5).map((country, i) => (
                    <div key={country.name} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: country.color + '20', color: country.color }}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{country.name}</span>
                          <span className="text-muted-foreground">{country.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${country.value * 2.5}%`, backgroundColor: country.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade by Product Category</CardTitle>
              <CardDescription>Import/Export comparison by category (billions USD)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={productCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="category" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="imports" fill="#3b82f6" name="Imports" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="exports" fill="#10b981" name="Exports" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Commodity Price Index</CardTitle>
              <CardDescription>Price trends relative to baseline (Jan = 100)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={priceIndex}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" domain={[95, 135]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="steel" stroke="#3b82f6" strokeWidth={2} dot={false} name="Steel" />
                  <Line type="monotone" dataKey="copper" stroke="#f59e0b" strokeWidth={2} dot={false} name="Copper" />
                  <Line type="monotone" dataKey="aluminum" stroke="#10b981" strokeWidth={2} dot={false} name="Aluminum" />
                  <Line type="monotone" dataKey="plastic" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Plastic" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shipping & Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-blue-500" />
              Container Shipping Rates
            </CardTitle>
            <CardDescription>40ft container rates (USD) - Updated daily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shippingRates.map((route) => (
                <div key={route.route} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{route.route}</div>
                    <div className="text-sm text-muted-foreground">40ft container</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${route.current.toLocaleString()}</div>
                    <div className={`text-sm flex items-center gap-1 ${route.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {route.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(route.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              Top Verified Suppliers
            </CardTitle>
            <CardDescription>Highest rated suppliers by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSuppliers.map((supplier) => (
                <div key={supplier.rank} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    #{supplier.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{supplier.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{supplier.country}</span>
                      <span>•</span>
                      <span>{supplier.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{supplier.rating} ★</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{supplier.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>AI-generated trade intelligence updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              title="Shipping Alert"
              content="Container rates on Asia-US routes increased 7.5% this month due to port congestion in Los Angeles."
              type="warning"
            />
            <InsightCard
              title="Price Trend"
              content="Copper prices continue to climb, up 32% YTD. Consider hedging strategies for electronics sourcing."
              type="info"
            />
            <InsightCard
              title="Supplier Update"
              content="New verified suppliers added in Vietnam and Thailand offering competitive rates for textiles."
              type="success"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon }: { 
  title: string; 
  value: string; 
  change: number; 
  trend: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <Card data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm">{title}</span>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className={`text-sm flex items-center gap-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}% vs last period
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ title, content, type }: { title: string; content: string; type: "warning" | "info" | "success" }) {
  const colors = {
    warning: "border-amber-500/50 bg-amber-500/5",
    info: "border-blue-500/50 bg-blue-500/5",
    success: "border-green-500/50 bg-green-500/5",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <div className="font-medium mb-1">{title}</div>
      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  );
}
