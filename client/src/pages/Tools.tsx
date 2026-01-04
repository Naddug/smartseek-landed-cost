import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, Landmark, Ship, Plane, TrendingUp, Globe, 
  DollarSign, Package, FileText, Search, BarChart3, ArrowRight,
  Percent, Scale, Hash, Shield
} from "lucide-react";

const tools = [
  {
    title: "Customs Fee Calculator",
    description: "Calculate import duties, VAT, and total landed cost for any product",
    icon: Landmark,
    href: "/customs-calculator",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    features: ["HS Code lookup", "Duty rates", "VAT/GST", "Landed cost"],
    badge: "Popular",
  },
  {
    title: "Shipping Cost Estimator",
    description: "Compare sea freight, air freight, and express courier rates",
    icon: Ship,
    href: "/shipping-estimator",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: ["Sea freight", "Air freight", "Express courier", "Transit times"],
    badge: "New",
  },
  {
    title: "Smart Finder AI",
    description: "Get AI-powered sourcing reports with supplier recommendations",
    icon: Search,
    href: "/smart-finder",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: ["AI analysis", "Supplier matching", "Cost breakdown", "Risk assessment"],
    badge: "AI",
  },
];

export default function Tools() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Trade Tools & Calculators</h1>
        <p className="text-muted-foreground">
          Professional tools to help you make smarter sourcing and trading decisions
        </p>
      </div>

      {/* Featured Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.href + tool.title} href={tool.href}>
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/50" data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  {tool.badge && (
                    <Badge className={tool.badge === 'AI' ? 'bg-purple-500' : tool.badge === 'New' ? 'bg-green-500' : 'bg-amber-500'}>
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {tool.title}
                </CardTitle>
                <CardDescription>
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  Open Tool
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Calculators */}
      <Tabs defaultValue="landed-cost" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="landed-cost">Landed Cost</TabsTrigger>
          <TabsTrigger value="margin">Margin Calc</TabsTrigger>
        </TabsList>
        
        <TabsContent value="landed-cost" className="mt-6">
          <LandedCostCalculator />
        </TabsContent>
        
        <TabsContent value="margin" className="mt-6">
          <MarginCalculator />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Countries Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">HS Codes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Shipping Routes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Real-time</div>
              <div className="text-sm text-muted-foreground">Rate Updates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LandedCostCalculator() {
  const [values, setValues] = useState({ unitCost: 10, quantity: 100, shipping: 500, duty: 5 });
  
  const subtotal = values.unitCost * values.quantity;
  const dutyCost = subtotal * (values.duty / 100);
  const totalCost = subtotal + values.shipping + dutyCost;
  const costPerUnit = totalCost / values.quantity;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" /> 
          Quick Landed Cost Calculator
        </CardTitle>
        <CardDescription>Estimate the total cost of goods delivered to your door.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Unit Cost ($)</Label>
            <Input type="number" value={values.unitCost} onChange={(e) => setValues({...values, unitCost: Number(e.target.value)})} data-testid="input-unit-cost" />
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" value={values.quantity} onChange={(e) => setValues({...values, quantity: Number(e.target.value)})} data-testid="input-quantity" />
          </div>
          <div className="space-y-2">
            <Label>Shipping Total ($)</Label>
            <Input type="number" value={values.shipping} onChange={(e) => setValues({...values, shipping: Number(e.target.value)})} data-testid="input-shipping" />
          </div>
          <div className="space-y-2">
            <Label>Duty Rate (%)</Label>
            <Input type="number" value={values.duty} onChange={(e) => setValues({...values, duty: Number(e.target.value)})} data-testid="input-duty" />
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Landed Cost</div>
            <div className="text-3xl font-bold" data-testid="text-total-cost">${totalCost.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Cost Per Unit</div>
            <div className="text-3xl font-bold text-primary" data-testid="text-cost-per-unit">${costPerUnit.toFixed(2)}</div>
          </div>
        </div>

        <Link href="/customs-calculator">
          <Button variant="outline" className="w-full">
            Open Full Customs Calculator
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function MarginCalculator() {
  const [values, setValues] = useState({ cost: 15, price: 45 });
  
  const profit = values.price - values.cost;
  const margin = values.price > 0 ? (profit / values.price) * 100 : 0;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-green-500" /> 
          Profit Margin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Unit Cost ($)</Label>
            <Input type="number" value={values.cost} onChange={(e) => setValues({...values, cost: Number(e.target.value)})} data-testid="input-cost" />
          </div>
          <div className="space-y-2">
            <Label>Retail Price ($)</Label>
            <Input type="number" value={values.price} onChange={(e) => setValues({...values, price: Number(e.target.value)})} data-testid="input-price" />
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Profit Per Unit</div>
            <div className="text-3xl font-bold text-green-600" data-testid="text-profit">${profit.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Gross Margin</div>
            <div className="text-3xl font-bold" data-testid="text-margin">{margin.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
