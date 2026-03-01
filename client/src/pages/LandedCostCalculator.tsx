import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Package,
  Ship,
  Plane,
  Truck,
  DollarSign,
  Percent,
  ArrowRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  FileText,
  Globe,
  Hash,
  Shield,
  Loader2,
  Sparkles,
} from "lucide-react";
import { calculateLandedCost } from "@/lib/landedCost/calculator";
import type { LandedCostInput, LandedCostResult } from "@/lib/landedCost/types";
import { useUser } from "@/lib/hooks";

const COUNTRIES = [
  { code: "CN", name: "China" },
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "VN", name: "Vietnam" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "MX", name: "Mexico" },
  { code: "TR", name: "Turkey" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "KR", name: "South Korea" },
  { code: "BR", name: "Brazil" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TW", name: "Taiwan" },
  { code: "HK", name: "Hong Kong" },
  { code: "AE", name: "UAE" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "ZA", name: "South Africa" },
  { code: "PL", name: "Poland" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
];

const SHIPPING_METHODS = [
  { value: "sea_fcl", label: "Sea FCL (Full Container)" },
  { value: "sea_lcl", label: "Sea LCL (Less than Container)" },
  { value: "air", label: "Air Freight" },
  { value: "express", label: "Express Courier" },
];

const INCOTERMS = [
  { value: "FOB", label: "FOB - Free on Board" },
  { value: "EXW", label: "EXW - Ex Works" },
  { value: "CIF", label: "CIF - Cost, Insurance & Freight" },
  { value: "DDP", label: "DDP - Delivered Duty Paid" },
];

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export default function LandedCostCalculator() {
  const { data: user, isLoading: userLoading } = useUser();
  const [formData, setFormData] = useState({
    productName: "Sample Product",
    hsCode: "847130",
    category: "",
    baseCost: "1000",
    incoterm: "FOB" as const,
    quantity: "100",
    currency: "USD",
    originCountry: "CN",
    destinationCountry: "US",
    originPort: "",
    destinationPort: "",
    shippingMethod: "sea_fcl" as const,
    containerType: "40ft" as const,
    weight: "10",
    volume: "1",
    length: "",
    width: "",
    height: "",
    insuranceRate: "",
    inlandTransportOrigin: "",
    inlandTransportDestination: "",
  });
  const [result, setResult] = useState<LandedCostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [freightRates, setFreightRates] = useState<{ sea20ft: number; sea40ft: number; airPerKg: number; lclPerCBM: number } | null>(null);
  const [hsLookupLoading, setHsLookupLoading] = useState(false);
  const [hsLookupResult, setHsLookupResult] = useState<{ hsCode: string; description: string; chapter: string; chapterName: string } | null>(null);

  useEffect(() => {
    const productName = formData.productName.trim();
    if (productName.length < 3 || productName === "Sample Product") {
      setHsLookupResult(null);
      return;
    }
    const timer = setTimeout(async () => {
      setHsLookupLoading(true);
      try {
        const res = await fetch(`/api/hs-codes/lookup?product=${encodeURIComponent(productName)}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.hsCode) {
            setHsLookupResult(data);
          }
        }
      } catch {}
      setHsLookupLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.productName]);

  // Fetch real benchmark rates when origin/destination change
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`/api/freight/benchmark-rates?origin=${formData.originCountry}&destination=${formData.destinationCountry}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setFreightRates(data.rates);
        } else {
          setFreightRates(null);
        }
      } catch {
        setFreightRates(null);
      }
    };
    fetchRates();
  }, [formData.originCountry, formData.destinationCountry]);

  const handleCalculate = () => {
    setError(null);
    try {
      const vol = formData.volume ? parseFloat(formData.volume) : undefined;
      const dims = formData.length && formData.width && formData.height
        ? {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
          }
        : undefined;
      const computedVol = dims ? (dims.length * dims.width * dims.height) / 1_000_000 : vol;

      const input: LandedCostInput = {
        productName: formData.productName || "Product",
        hsCode: formData.hsCode || "000000",
        category: formData.category || undefined,
        baseCost: parseFloat(formData.baseCost) || 0,
        incoterm: formData.incoterm,
        quantity: parseInt(formData.quantity) || 1,
        currency: formData.currency || "USD",
        originCountry: formData.originCountry,
        destinationCountry: formData.destinationCountry,
        originPort: formData.originPort || undefined,
        destinationPort: formData.destinationPort || undefined,
        shippingMethod: formData.shippingMethod,
        containerType: formData.shippingMethod === "sea_fcl" ? formData.containerType : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        volume: computedVol || (["sea_lcl", "air"].includes(formData.shippingMethod) ? 1 : undefined),
        dimensions: dims,
        insuranceRate: formData.insuranceRate ? parseFloat(formData.insuranceRate) / 100 : undefined,
        inlandTransportOrigin: formData.inlandTransportOrigin ? parseFloat(formData.inlandTransportOrigin) : undefined,
        inlandTransportDestination: formData.inlandTransportDestination ? parseFloat(formData.inlandTransportDestination) : undefined,
        freightOverrides: freightRates ? { sea20ft: freightRates.sea20ft, sea40ft: freightRates.sea40ft, airPerKg: freightRates.airPerKg, lclPerCBM: freightRates.lclPerCBM } : undefined,
      };

      const res = calculateLandedCost(input);
      setResult(res);
    } catch (e: any) {
      setError(e?.message || "Calculation failed");
      setResult(null);
    }
  };

  const update = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">← Back to Home</Button>
        </Link>
        {!userLoading && (
          user ? (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )
        )}
      </div>
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
          <Calculator className="w-8 h-8 text-primary" />
          Landed Cost Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate total landed cost including freight, insurance, customs, and inland transport. Uses real market benchmark rates (Freightos/Xeneta 2024) for your route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Input Parameters
            </CardTitle>
            <CardDescription>Enter product and shipment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                placeholder="Product name"
                value={formData.productName}
                onChange={(e) => update("productName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HS Code</Label>
                {hsLookupLoading && (
                  <span className="text-xs text-blue-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Looking up HS code...</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. 847130"
                  value={formData.hsCode}
                  onChange={(e) => update("hsCode", e.target.value)}
                  className="flex-1"
                />
                {hsLookupResult && hsLookupResult.hsCode && formData.hsCode !== hsLookupResult.hsCode.replace(/\./g, "") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      update("hsCode", hsLookupResult.hsCode.replace(/\./g, ""));
                      if (hsLookupResult.chapterName) update("category", hsLookupResult.chapterName);
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Use {hsLookupResult.hsCode}
                  </Button>
                )}
              </div>
              {hsLookupResult && hsLookupResult.description && (
                <p className="text-xs text-slate-600">{hsLookupResult.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                placeholder="Optional"
                value={formData.category}
                onChange={(e) => update("category", e.target.value)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Base Cost (FOB/EXW)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.baseCost}
                onChange={(e) => update("baseCost", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Incoterm</Label>
                <Select value={formData.incoterm} onValueChange={(v: any) => update("incoterm", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOTERMS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input value={formData.currency} onChange={(e) => update("currency", e.target.value)} />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Origin
              </Label>
              <Select value={formData.originCountry} onValueChange={(v) => update("originCountry", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={formData.destinationCountry} onValueChange={(v) => update("destinationCountry", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Shipping Method</Label>
              <Select value={formData.shippingMethod} onValueChange={(v: any) => update("shippingMethod", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIPPING_METHODS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.shippingMethod === "sea_fcl" && (
              <div className="space-y-2">
                <Label>Container Type</Label>
                <Select value={formData.containerType} onValueChange={(v: any) => update("containerType", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {["sea_lcl", "air", "express"].includes(formData.shippingMethod) && (
              <>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => update("weight", e.target.value)}
                  />
                </div>
                {["sea_lcl", "air"].includes(formData.shippingMethod) && (
                  <div className="space-y-2">
                    <Label>Volume (CBM)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.volume}
                      onChange={(e) => update("volume", e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
            <Separator />
            <div className="space-y-2">
              <Label>Insurance Rate (%) — optional</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Default 0.5%"
                value={formData.insuranceRate}
                onChange={(e) => update("insuranceRate", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Origin Transport ($)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Est. if EXW"
                  value={formData.inlandTransportOrigin}
                  onChange={(e) => update("inlandTransportOrigin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Dest. Transport ($)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Est. default"
                  value={formData.inlandTransportDestination}
                  onChange={(e) => update("inlandTransportDestination", e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleCalculate}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Landed Cost
            </Button>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Total Landed Cost
                  </CardTitle>
                  <CardDescription>
                    {result.totals.currency} {result.totals.totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total
                    {" · "}
                    {result.totals.currency} {result.totals.costPerUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per unit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.totals.currency} {result.totals.totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Per unit: {result.totals.currency} {result.totals.costPerUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × {formData.quantity} units
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Cost Breakdown
                  </CardTitle>
                  <CardDescription>Waterfall breakdown of all cost components</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">%</TableHead>
                        <TableHead className="text-right">Cumulative</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.breakdown.map((item, i) => (
                        <TableRow key={item.component}>
                          <TableCell className="font-medium">{item.component}</TableCell>
                          <TableCell className="text-right">
                            {result.totals.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right">{item.percentage.toFixed(2)}%</TableCell>
                          <TableCell className="text-right">
                            {result.totals.currency} {item.cumulativeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Cost Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase">Base Cost</p>
                      <p className="font-semibold">
                        {result.baseCost.currency} {result.baseCost.normalizedCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase">Freight</p>
                      <p className="font-semibold">
                        {result.baseCost.currency} {result.freight.selectedCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{result.freight.selectedMethod}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase">Insurance</p>
                      <p className="font-semibold">
                        {result.baseCost.currency} {result.insurance.amount.toLocaleString()} ({(result.insurance.rate * 100).toFixed(2)}%)
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase">Customs</p>
                      <p className="font-semibold">
                        {result.baseCost.currency} {result.customs.totalCustomsFees.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duty: {(result.customs.importDuty.rate * 100).toFixed(2)}% · VAT: {(result.customs.vat.rate * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground uppercase">Inland Transport</p>
                      <p className="font-semibold">
                        {result.baseCost.currency} {result.inlandTransport.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Origin: {result.inlandTransport.origin.cost} · Dest: {result.inlandTransport.destination.cost}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Calculation Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <ul className="space-y-2">
                      {result.notes.map((n, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Badge className={n.category === "warning" ? "bg-amber-500" : "bg-muted"} variant="secondary">
                            {n.category}
                          </Badge>
                          <span className="text-muted-foreground">{n.message}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calculator className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Fill in the form and click Calculate to see results</p>
                <p className="text-sm text-muted-foreground mt-1">All calculations run client-side — no API calls</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
