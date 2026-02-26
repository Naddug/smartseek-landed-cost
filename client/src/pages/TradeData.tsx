import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, TrendingDown, Globe, Package, Ship, DollarSign,
  ArrowUpRight, ArrowDownRight, Calendar, Download, Search, Sparkles, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

// Region-specific data - each region has distinct datasets
const REGION_DATA: Record<string, {
  metrics: { imports: string; exports: string; balance: string; suppliers: string; change: number; trend: "up" | "down" };
  importExport: { month: string; imports: number; exports: number }[];
  topCountries: { name: string; value: number; color: string }[];
  productCategories: { category: string; imports: number; exports: number }[];
  priceIndex: { month: string; steel: number; copper: number; aluminum: number; plastic: number }[];
  shippingRates: { route: string; current: number; previous: number; change: number }[];
  topSuppliers: { rank: number; name: string; country: string; category: string; rating: number; orders: number }[];
  insights: { title: string; content: string; type: "warning" | "info" | "success" }[];
}> = {
  global: {
    metrics: { imports: "$4.26B", exports: "$3.17B", balance: "-$1.09B", suppliers: "2,847", change: 12.4, trend: "up" },
    importExport: [
      { month: "Jan", imports: 245, exports: 189 }, { month: "Feb", imports: 267, exports: 201 },
      { month: "Mar", imports: 298, exports: 234 }, { month: "Apr", imports: 312, exports: 256 },
      { month: "May", imports: 287, exports: 243 }, { month: "Jun", imports: 334, exports: 278 },
      { month: "Jul", imports: 356, exports: 289 }, { month: "Aug", imports: 378, exports: 312 },
      { month: "Sep", imports: 345, exports: 298 }, { month: "Oct", imports: 389, exports: 334 },
      { month: "Nov", imports: 412, exports: 356 }, { month: "Dec", imports: 434, exports: 378 },
    ],
    topCountries: [
      { name: "China", value: 35, color: "#3b82f6" }, { name: "Germany", value: 18, color: "#10b981" },
      { name: "USA", value: 15, color: "#f59e0b" }, { name: "Japan", value: 12, color: "#ef4444" },
      { name: "South Korea", value: 8, color: "#8b5cf6" }, { name: "Others", value: 12, color: "#6b7280" },
    ],
    productCategories: [
      { category: "Electronics", imports: 89, exports: 45 }, { category: "Machinery", imports: 67, exports: 78 },
      { category: "Textiles", imports: 56, exports: 34 }, { category: "Chemicals", imports: 45, exports: 56 },
      { category: "Auto Parts", imports: 78, exports: 67 }, { category: "Food & Bev", imports: 34, exports: 23 },
      { category: "Minerals & Ores", imports: 52, exports: 41 }, { category: "Steel & Metals", imports: 61, exports: 58 },
      { category: "Plastics", imports: 38, exports: 29 },
    ],
    priceIndex: [
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
    ],
    shippingRates: [
      { route: "Shanghai-LA", current: 2850, previous: 2650, change: 7.5 },
      { route: "Shanghai-Rotterdam", current: 1980, previous: 1850, change: 7.0 },
      { route: "Shenzhen-NY", current: 3200, previous: 3050, change: 4.9 },
      { route: "Ho Chi Minh-LA", current: 2450, previous: 2300, change: 6.5 },
      { route: "Mumbai-Rotterdam", current: 1650, previous: 1580, change: 4.4 },
    ],
    topSuppliers: [
      { rank: 1, name: "Shenzhen Electronics Co.", country: "China", category: "Electronics", rating: 4.8, orders: 1245 },
      { rank: 2, name: "Dongguan Manufacturing", country: "China", category: "Machinery", rating: 4.7, orders: 987 },
      { rank: 3, name: "Vietnam Textile Group", country: "Vietnam", category: "Textiles", rating: 4.6, orders: 756 },
      { rank: 4, name: "India Chemicals Ltd", country: "India", category: "Chemicals", rating: 4.5, orders: 654 },
      { rank: 5, name: "Thailand Auto Parts", country: "Thailand", category: "Auto Parts", rating: 4.5, orders: 543 },
    ],
    insights: [
      { title: "Shipping Alert", content: "Container rates on Asia-US routes increased 7.5% this month due to port congestion in Los Angeles.", type: "warning" },
      { title: "Price Trend", content: "Copper prices continue to climb, up 32% YTD. Consider hedging strategies for electronics sourcing.", type: "info" },
      { title: "Supplier Update", content: "New verified suppliers added in Vietnam and Thailand offering competitive rates for textiles.", type: "success" },
    ],
  },
  asia: {
    metrics: { imports: "$2.18B", exports: "$1.94B", balance: "-$240M", suppliers: "1,642", change: 18.2, trend: "up" },
    importExport: [
      { month: "Jan", imports: 165, exports: 142 }, { month: "Feb", imports: 178, exports: 156 },
      { month: "Mar", imports: 192, exports: 168 }, { month: "Apr", imports: 205, exports: 182 },
      { month: "May", imports: 198, exports: 175 }, { month: "Jun", imports: 218, exports: 192 },
      { month: "Jul", imports: 225, exports: 198 }, { month: "Aug", imports: 238, exports: 212 },
      { month: "Sep", imports: 222, exports: 198 }, { month: "Oct", imports: 245, exports: 218 },
      { month: "Nov", imports: 258, exports: 232 }, { month: "Dec", imports: 272, exports: 245 },
    ],
    topCountries: [
      { name: "China", value: 42, color: "#3b82f6" }, { name: "Vietnam", value: 22, color: "#10b981" },
      { name: "Japan", value: 14, color: "#f59e0b" }, { name: "South Korea", value: 10, color: "#ef4444" },
      { name: "India", value: 8, color: "#8b5cf6" }, { name: "Others", value: 4, color: "#6b7280" },
    ],
    productCategories: [
      { category: "Electronics", imports: 112, exports: 78 }, { category: "Textiles", imports: 78, exports: 56 },
      { category: "Machinery", imports: 56, exports: 89 }, { category: "Auto Parts", imports: 67, exports: 72 },
      { category: "Chemicals", imports: 45, exports: 52 }, { category: "Food & Bev", imports: 34, exports: 28 },
      { category: "Tin & Antimony Ore", imports: 42, exports: 38 }, { category: "Rare Earth & Lithium", imports: 28, exports: 22 },
      { category: "Steel & Aluminum", imports: 58, exports: 51 },
    ],
    priceIndex: [
      { month: "Jan", steel: 98, copper: 102, aluminum: 95, plastic: 98 },
      { month: "Feb", steel: 100, copper: 105, aluminum: 97, plastic: 99 },
      { month: "Mar", steel: 104, copper: 108, aluminum: 99, plastic: 101 },
      { month: "Apr", steel: 108, copper: 112, aluminum: 102, plastic: 104 },
      { month: "May", steel: 106, copper: 118, aluminum: 105, plastic: 102 },
      { month: "Jun", steel: 112, copper: 122, aluminum: 108, plastic: 106 },
      { month: "Jul", steel: 118, copper: 125, aluminum: 112, plastic: 109 },
      { month: "Aug", steel: 115, copper: 130, aluminum: 115, plastic: 107 },
      { month: "Sep", steel: 122, copper: 132, aluminum: 118, plastic: 111 },
      { month: "Oct", steel: 125, copper: 135, aluminum: 120, plastic: 114 },
      { month: "Nov", steel: 128, copper: 138, aluminum: 123, plastic: 117 },
      { month: "Dec", steel: 132, copper: 140, aluminum: 126, plastic: 120 },
    ],
    shippingRates: [
      { route: "Shanghai-LA", current: 2850, previous: 2650, change: 7.5 },
      { route: "Shenzhen-NY", current: 3200, previous: 3050, change: 4.9 },
      { route: "Ho Chi Minh-LA", current: 2450, previous: 2300, change: 6.5 },
      { route: "Bangkok-LA", current: 2680, previous: 2520, change: 6.3 },
      { route: "Shanghai-Rotterdam", current: 1980, previous: 1850, change: 7.0 },
    ],
    topSuppliers: [
      { rank: 1, name: "Shenzhen Electronics Co.", country: "China", category: "Electronics", rating: 4.8, orders: 1245 },
      { rank: 2, name: "Vietnam Textile Group", country: "Vietnam", category: "Textiles", rating: 4.6, orders: 756 },
      { rank: 3, name: "India Chemicals Ltd", country: "India", category: "Chemicals", rating: 4.5, orders: 654 },
      { rank: 4, name: "Thailand Auto Parts", country: "Thailand", category: "Auto Parts", rating: 4.5, orders: 543 },
      { rank: 5, name: "Jakarta Electronics", country: "Indonesia", category: "Electronics", rating: 4.4, orders: 432 },
    ],
    insights: [
      { title: "Asia-Pacific Focus", content: "Vietnam continues to gain market share in textiles and electronics. Tariff shifts favor Vietnam over China for US-bound goods.", type: "info" },
      { title: "Shipping Alert", content: "Port congestion in Shanghai and Singapore affecting transit times. Consider booking 2 weeks early.", type: "warning" },
      { title: "Price Trend", content: "Copper and aluminum prices up 12% in Asia. Electronics component costs rising.", type: "warning" },
    ],
  },
  europe: {
    metrics: { imports: "$1.42B", exports: "$1.68B", balance: "+$260M", suppliers: "1,203", change: 8.9, trend: "up" },
    importExport: [
      { month: "Jan", imports: 112, exports: 128 }, { month: "Feb", imports: 118, exports: 135 },
      { month: "Mar", imports: 125, exports: 142 }, { month: "Apr", imports: 132, exports: 148 },
      { month: "May", imports: 128, exports: 145 }, { month: "Jun", imports: 138, exports: 155 },
      { month: "Jul", imports: 142, exports: 162 }, { month: "Aug", imports: 148, exports: 168 },
      { month: "Sep", imports: 138, exports: 158 }, { month: "Oct", imports: 152, exports: 172 },
      { month: "Nov", imports: 158, exports: 178 }, { month: "Dec", imports: 165, exports: 185 },
    ],
    topCountries: [
      { name: "Germany", value: 28, color: "#3b82f6" }, { name: "France", value: 18, color: "#10b981" },
      { name: "Italy", value: 14, color: "#f59e0b" }, { name: "Netherlands", value: 12, color: "#ef4444" },
      { name: "Poland", value: 10, color: "#8b5cf6" }, { name: "Others", value: 18, color: "#6b7280" },
    ],
    productCategories: [
      { category: "Machinery", imports: 89, exports: 112 }, { category: "Auto Parts", imports: 78, exports: 95 },
      { category: "Chemicals", imports: 67, exports: 82 }, { category: "Electronics", imports: 56, exports: 45 },
      { category: "Textiles", imports: 34, exports: 28 }, { category: "Food & Bev", imports: 45, exports: 52 },
      { category: "Steel & Metals", imports: 72, exports: 68 }, { category: "Minerals & Ores", imports: 38, exports: 42 },
    ],
    priceIndex: [
      { month: "Jan", steel: 102, copper: 98, aluminum: 101, plastic: 102 },
      { month: "Feb", steel: 105, copper: 100, aluminum: 103, plastic: 104 },
      { month: "Mar", steel: 108, copper: 104, aluminum: 106, plastic: 106 },
      { month: "Apr", steel: 112, copper: 108, aluminum: 109, plastic: 108 },
      { month: "May", steel: 110, copper: 112, aluminum: 111, plastic: 107 },
      { month: "Jun", steel: 115, copper: 116, aluminum: 114, plastic: 110 },
      { month: "Jul", steel: 118, copper: 120, aluminum: 117, plastic: 112 },
      { month: "Aug", steel: 116, copper: 124, aluminum: 119, plastic: 111 },
      { month: "Sep", steel: 120, copper: 126, aluminum: 118, plastic: 113 },
      { month: "Oct", steel: 122, copper: 128, aluminum: 121, plastic: 115 },
      { month: "Nov", steel: 125, copper: 130, aluminum: 123, plastic: 117 },
      { month: "Dec", steel: 128, copper: 132, aluminum: 125, plastic: 119 },
    ],
    shippingRates: [
      { route: "Shanghai-Rotterdam", current: 1980, previous: 1850, change: 7.0 },
      { route: "Mumbai-Rotterdam", current: 1650, previous: 1580, change: 4.4 },
      { route: "Rotterdam-LA", current: 2450, previous: 2320, change: 5.6 },
      { route: "Antwerp-NY", current: 2680, previous: 2550, change: 5.1 },
      { route: "Hamburg-LA", current: 2520, previous: 2400, change: 5.0 },
    ],
    topSuppliers: [
      { rank: 1, name: "Munich Machinery GmbH", country: "Germany", category: "Machinery", rating: 4.9, orders: 892 },
      { rank: 2, name: "Paris Auto Parts", country: "France", category: "Auto Parts", rating: 4.8, orders: 756 },
      { rank: 3, name: "Milan Textiles", country: "Italy", category: "Textiles", rating: 4.6, orders: 634 },
      { rank: 4, name: "Rotterdam Chemicals", country: "Netherlands", category: "Chemicals", rating: 4.5, orders: 521 },
      { rank: 5, name: "Warsaw Electronics", country: "Poland", category: "Electronics", rating: 4.4, orders: 445 },
    ],
    insights: [
      { title: "EU Trade Update", content: "EU CBAM compliance requirements now in effect. Check carbon footprint for imported steel and aluminum.", type: "warning" },
      { title: "Price Trend", content: "European steel prices stable. EU-US trade agreements may reduce duties on select categories.", type: "info" },
      { title: "Supplier Update", content: "New verified suppliers in Poland and Slovakia offering competitive rates for electronics assembly.", type: "success" },
    ],
  },
  americas: {
    metrics: { imports: "$1.85B", exports: "$1.42B", balance: "-$430M", suppliers: "987", change: 6.5, trend: "up" },
    importExport: [
      { month: "Jan", imports: 142, exports: 108 }, { month: "Feb", imports: 148, exports: 115 },
      { month: "Mar", imports: 158, exports: 122 }, { month: "Apr", imports: 165, exports: 128 },
      { month: "May", imports: 158, exports: 122 }, { month: "Jun", imports: 172, exports: 135 },
      { month: "Jul", imports: 178, exports: 142 }, { month: "Aug", imports: 185, exports: 148 },
      { month: "Sep", imports: 175, exports: 138 }, { month: "Oct", imports: 192, exports: 155 },
      { month: "Nov", imports: 198, exports: 162 }, { month: "Dec", imports: 205, exports: 168 },
    ],
    topCountries: [
      { name: "USA", value: 38, color: "#3b82f6" }, { name: "Mexico", value: 28, color: "#10b981" },
      { name: "Canada", value: 18, color: "#f59e0b" }, { name: "Brazil", value: 8, color: "#ef4444" },
      { name: "Chile", value: 4, color: "#8b5cf6" }, { name: "Others", value: 4, color: "#6b7280" },
    ],
    productCategories: [
      { category: "Auto Parts", imports: 95, exports: 82 }, { category: "Electronics", imports: 78, exports: 45 },
      { category: "Machinery", imports: 56, exports: 72 }, { category: "Chemicals", imports: 52, exports: 58 },
      { category: "Textiles", imports: 45, exports: 32 }, { category: "Food & Bev", imports: 62, exports: 48 },
      { category: "Copper & Lithium", imports: 35, exports: 28 }, { category: "Agricultural", imports: 48, exports: 52 },
    ],
    priceIndex: [
      { month: "Jan", steel: 100, copper: 100, aluminum: 100, plastic: 100 },
      { month: "Feb", steel: 103, copper: 97, aluminum: 102, plastic: 98 },
      { month: "Mar", steel: 106, copper: 102, aluminum: 105, plastic: 101 },
      { month: "Apr", steel: 110, copper: 106, aluminum: 108, plastic: 104 },
      { month: "May", steel: 108, copper: 110, aluminum: 112, plastic: 102 },
      { month: "Jun", steel: 114, copper: 114, aluminum: 115, plastic: 106 },
      { month: "Jul", steel: 118, copper: 118, aluminum: 118, plastic: 109 },
      { month: "Aug", steel: 115, copper: 122, aluminum: 120, plastic: 108 },
      { month: "Sep", steel: 120, copper: 125, aluminum: 118, plastic: 111 },
      { month: "Oct", steel: 123, copper: 128, aluminum: 122, plastic: 114 },
      { month: "Nov", steel: 126, copper: 130, aluminum: 124, plastic: 117 },
      { month: "Dec", steel: 130, copper: 132, aluminum: 127, plastic: 120 },
    ],
    shippingRates: [
      { route: "Shanghai-LA", current: 2850, previous: 2650, change: 7.5 },
      { route: "Shenzhen-NY", current: 3200, previous: 3050, change: 4.9 },
      { route: "Ho Chi Minh-LA", current: 2450, previous: 2300, change: 6.5 },
      { route: "Veracruz-LA", current: 1250, previous: 1180, change: 5.9 },
      { route: "Santos-NY", current: 1850, previous: 1720, change: 7.6 },
    ],
    topSuppliers: [
      { rank: 1, name: "Mexico Auto Parts Inc", country: "Mexico", category: "Auto Parts", rating: 4.7, orders: 678 },
      { rank: 2, name: "Canadian Machinery", country: "Canada", category: "Machinery", rating: 4.6, orders: 534 },
      { rank: 3, name: "Brazil Chemicals", country: "Brazil", category: "Chemicals", rating: 4.5, orders: 421 },
      { rank: 4, name: "Texas Electronics", country: "USA", category: "Electronics", rating: 4.5, orders: 398 },
      { rank: 5, name: "Chile Food Group", country: "Chile", category: "Food & Bev", rating: 4.4, orders: 356 },
    ],
    insights: [
      { title: "USMCA Update", content: "USMCA rules of origin verified for 95% of auto parts. Mexico and Canada remain top sourcing partners.", type: "info" },
      { title: "Shipping Alert", content: "Port of LA/Long Beach congestion easing. Transit times from Asia improving by 3-5 days.", type: "success" },
      { title: "Price Trend", content: "Nearshoring to Mexico driving demand. Mexican supplier rates up 4% in Q4.", type: "warning" },
    ],
  },
};

function getMonthsForRange(timeRange: string): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (timeRange === "3m") return months.slice(-3);
  if (timeRange === "6m") return months.slice(-6);
  if (timeRange === "ytd") return months.slice(0, new Date().getMonth() + 1);
  return months; // 12m
}

export default function TradeData() {
  const [timeRange, setTimeRange] = useState("12m");
  const [region, setRegion] = useState("global");
  const [categorySearch, setCategorySearch] = useState("");

  const regionData = REGION_DATA[region] || REGION_DATA.global;
  const monthFilter = getMonthsForRange(timeRange);

  const filteredCategories = useMemo(() => {
    const cats = regionData.productCategories;
    if (!categorySearch.trim()) return cats;
    const q = categorySearch.toLowerCase();
    return cats.filter((c) => c.category.toLowerCase().includes(q));
  }, [regionData.productCategories, categorySearch]);

  const filteredData = useMemo(() => {
    const base = regionData.importExport;
    return base.filter((d) => monthFilter.includes(d.month));
  }, [regionData.importExport, monthFilter]);

  const filteredPriceIndex = useMemo(() => {
    return regionData.priceIndex.filter((d) => monthFilter.includes(d.month));
  }, [regionData.priceIndex, monthFilter]);

  const handleExport = () => {
    const csv = [
      ["Region", region, "Time Range", timeRange].join(","),
      "",
      "Month,Imports,Balance",
      ...filteredData.map((d) => `${d.month},${d.imports},${d.exports}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trade-data-${region}-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 truncate">Trade Data Dashboard</h1>
          <p className="text-slate-600 mt-1">
            {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "European" : "Americas"} trade insights, market trends, and pricing intelligence
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[120px] min-w-0" data-testid="select-time-range">
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
            <SelectTrigger className="w-full sm:w-[140px] min-w-0" data-testid="select-region">
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
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Actions - prominent CTA */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-transparent border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Turn insights into action
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Get AI sourcing reports, find verified suppliers, or analyze landed costs for any product.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/smart-finder">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Sparkles className="w-4 h-4" />
                  Get AI Sourcing Report
                </Button>
              </Link>
              <Link href="/suppliers">
                <Button variant="outline" className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Search className="w-4 h-4" />
                  Search Suppliers
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
              <a href="https://comtradeplus.un.org/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-slate-400 text-slate-800 hover:bg-slate-100 hover:text-slate-900">
                  UN Comtrade
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Imports"
          value={regionData.metrics.imports}
          change={regionData.metrics.change}
          trend={regionData.metrics.trend}
          icon={<Package className="w-5 h-5" />}
        />
        <MetricCard
          title="Total Exports"
          value={regionData.metrics.exports}
          change={regionData.metrics.change - 2}
          trend={regionData.metrics.trend}
          icon={<Ship className="w-5 h-5" />}
        />
        <MetricCard
          title="Trade Balance"
          value={regionData.metrics.balance}
          change={region === "europe" ? 2.1 : -3.2}
          trend={region === "europe" ? "up" : "down"}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="Active Suppliers"
          value={regionData.metrics.suppliers}
          change={15.3}
          trend="up"
          icon={<Globe className="w-5 h-5" />}
        />
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="volume" className="w-full min-w-0">
        <TabsList className="flex w-full overflow-x-auto flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-1 p-1 h-auto">
          <TabsTrigger value="volume" className="shrink-0">Trade Volume</TabsTrigger>
          <TabsTrigger value="countries" className="shrink-0">By Country</TabsTrigger>
          <TabsTrigger value="categories" className="shrink-0">By Category</TabsTrigger>
          <TabsTrigger value="pricing" className="shrink-0">Price Index</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="mt-4 sm:mt-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Import/Export Trends</CardTitle>
              <CardDescription>Monthly trade volume in billions USD — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="w-full min-w-0">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748b" }} />
                  <YAxis className="text-xs" tick={{ fill: "#64748b" }} />
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Import Origins</CardTitle>
                <CardDescription>Share of total imports by country — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData.topCountries}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {regionData.topCountries.map((entry, index) => (
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
                  {regionData.topCountries.slice(0, 5).map((country, i) => (
                    <div key={country.name} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: country.color + '20', color: country.color }}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-slate-800">{country.name}</span>
                          <span className="text-slate-600">{country.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Trade by Product Category</CardTitle>
                  <CardDescription>Import/Export comparison by category (billions USD) — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"}</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search categories (e.g. ore, steel, textile)"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-9 bg-white text-slate-900 placeholder:text-slate-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="py-12 text-center text-slate-600">
                  <Search className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                  <p>No categories match &quot;{categorySearch}&quot;</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setCategorySearch("")}>Clear search</Button>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis type="number" className="text-xs" tick={{ fill: "#64748b" }} />
                  <YAxis dataKey="category" type="category" width={100} className="text-xs" tick={{ fill: "#64748b" }} />
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Commodity Price Index</CardTitle>
              <CardDescription>Price trends relative to baseline (Jan = 100) — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={filteredPriceIndex.length > 0 ? filteredPriceIndex : regionData.priceIndex}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748b" }} />
                  <YAxis className="text-xs" domain={[95, 145]} tick={{ fill: "#64748b" }} />
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
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Ship className="w-5 h-5 text-blue-500" />
              Container Shipping Rates
            </CardTitle>
            <CardDescription>40ft container rates (USD) — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"} routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionData.shippingRates.map((route) => (
                <div key={route.route} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-800">{route.route}</div>
                    <div className="text-sm text-slate-600">40ft container</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">${route.current.toLocaleString()}</div>
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
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Globe className="w-5 h-5 text-green-500" />
              Top Verified Suppliers
            </CardTitle>
            <CardDescription>Highest rated suppliers — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionData.topSuppliers.map((supplier) => (
                <Link key={supplier.rank} href={`/suppliers?q=${encodeURIComponent(supplier.category)}&industry=${encodeURIComponent(supplier.category)}`}>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      #{supplier.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate group-hover:text-primary">{supplier.name}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-2">
                        <span>{supplier.country}</span>
                        <span>•</span>
                        <span>{supplier.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{supplier.rating} ★</Badge>
                      <div className="text-xs text-slate-600 mt-1">{supplier.orders} orders</div>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-primary mt-1 ml-auto" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights - high contrast for readability */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 text-xl">Market Insights</CardTitle>
          <CardDescription className="text-slate-600">
            Trade intelligence updates — {region === "global" ? "Global" : region === "asia" ? "Asia Pacific" : region === "europe" ? "Europe" : "Americas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {regionData.insights.map((insight, i) => (
              <InsightCard key={i} title={insight.title} content={insight.content} type={insight.type} />
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-2">External data sources</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://www.trade.gov/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Trade.gov
              </a>
              <a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                World Bank Data
              </a>
              <a href="https://comtradeplus.un.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                UN Comtrade
              </a>
              <Link href="/smart-finder">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Sourcing Report
                </span>
              </Link>
            </div>
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
          <span className="text-slate-600 text-sm">{title}</span>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1 text-slate-900">{value}</div>
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
    warning: "border-amber-400 bg-amber-50",
    info: "border-blue-400 bg-blue-50",
    success: "border-emerald-400 bg-emerald-50",
  };
  const titleColors = {
    warning: "text-amber-900",
    info: "text-blue-900",
    success: "text-emerald-900",
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colors[type]}`}>
      <div className={`font-semibold mb-2 text-base ${titleColors[type]}`}>{title}</div>
      <p className="text-sm text-slate-800 leading-relaxed">{content}</p>
    </div>
  );
}
