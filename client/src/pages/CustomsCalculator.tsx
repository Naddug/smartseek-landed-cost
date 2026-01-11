import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calculator, Globe, ArrowRight, DollarSign, Percent, FileText, 
  Landmark, Receipt, Shield, Info, Loader2, Download, Hash,
  Ship, Plane, Package, AlertTriangle, CheckCircle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COUNTRIES = [
  "China", "United States", "Germany", "United Kingdom", "France", "Japan", 
  "South Korea", "India", "Vietnam", "Thailand", "Indonesia", "Mexico", 
  "Turkey", "Canada", "Australia", "Netherlands", "Italy", "Spain",
  "Brazil", "Poland", "Belgium", "Switzerland", "Sweden", "Austria",
  "Malaysia", "Singapore", "Taiwan", "Hong Kong", "United Arab Emirates",
  "Saudi Arabia", "Russia", "South Africa", "Ireland", "Denmark",
  "Norway", "Czech Republic", "Portugal", "Philippines", "Bangladesh",
  "Pakistan", "Egypt", "Israel", "Argentina", "Chile", "Colombia",
  "New Zealand", "Finland", "Greece", "Romania", "Hungary"
];

const INCOTERMS = [
  { value: "FOB", label: "FOB - Free on Board" },
  { value: "CIF", label: "CIF - Cost, Insurance & Freight" },
  { value: "EXW", label: "EXW - Ex Works" },
  { value: "DDP", label: "DDP - Delivered Duty Paid" },
  { value: "DAP", label: "DAP - Delivered at Place" },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CustomsCalculator() {
  const [formData, setFormData] = useState({
    productName: "",
    hsCode: "",
    originCountry: "China",
    destinationCountry: "United States",
    productValue: "",
    quantity: "1",
    incoterm: "FOB",
    freightCost: "",
    insuranceCost: "",
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateDuties = async () => {
    if (!formData.productValue || !formData.originCountry || !formData.destinationCountry) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call - In production, this would call a real customs API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const value = parseFloat(formData.productValue) * parseInt(formData.quantity);
    const freight = parseFloat(formData.freightCost) || value * 0.05;
    const insurance = parseFloat(formData.insuranceCost) || value * 0.01;
    const cifValue = value + freight + insurance;
    
    // Simulate duty calculation based on origin/destination
    const dutyRate = formData.originCountry === "China" ? 0.25 : 0.05;
    const vatRate = formData.destinationCountry === "United Kingdom" ? 0.20 : 
                    formData.destinationCountry === "Germany" ? 0.19 : 0.0;
    const mpfRate = formData.destinationCountry === "United States" ? 0.003464 : 0;
    const hmfRate = formData.destinationCountry === "United States" ? 0.00125 : 0;
    
    const importDuty = cifValue * dutyRate;
    const vat = (cifValue + importDuty) * vatRate;
    const mpf = Math.min(Math.max(cifValue * mpfRate, 27.98), 538.40);
    const hmf = cifValue * hmfRate;
    const brokerageFee = 150;
    
    const totalFees = importDuty + vat + mpf + hmf + brokerageFee;
    const landedCost = cifValue + totalFees;

    setResult({
      productValue: value,
      freightCost: freight,
      insuranceCost: insurance,
      cifValue,
      dutyRate: dutyRate * 100,
      importDuty,
      vatRate: vatRate * 100,
      vat,
      mpf,
      hmf,
      brokerageFee,
      totalFees,
      landedCost,
      costPerUnit: landedCost / parseInt(formData.quantity),
      hsCode: formData.hsCode || "8471.30.01",
    });
    
    setIsCalculating(false);
  };

  const chartData = result ? [
    { name: 'Product', value: result.productValue, color: '#3b82f6' },
    { name: 'Freight', value: result.freightCost, color: '#10b981' },
    { name: 'Import Duty', value: result.importDuty, color: '#f59e0b' },
    { name: 'VAT/Tax', value: result.vat, color: '#ef4444' },
    { name: 'Other Fees', value: result.mpf + result.hmf + result.brokerageFee, color: '#8b5cf6' },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Customs Fee Calculator</h1>
        <p className="text-muted-foreground">
          Calculate import duties, taxes, and total landed cost for any product
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Product Details
            </CardTitle>
            <CardDescription>
              Enter your product information to calculate customs fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Product Name</Label>
                <Input 
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  data-testid="input-product-name"
                />
              </div>
              <div className="space-y-2">
                <Label>HS Code (Optional)</Label>
                <Input 
                  placeholder="e.g., 8518.30.20"
                  value={formData.hsCode}
                  onChange={(e) => setFormData({...formData, hsCode: e.target.value})}
                  data-testid="input-hs-code"
                />
              </div>
              <div className="space-y-2">
                <Label>Incoterm</Label>
                <Select value={formData.incoterm} onValueChange={(v) => setFormData({...formData, incoterm: v})}>
                  <SelectTrigger data-testid="select-incoterm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOTERMS.map((term) => (
                      <SelectItem key={term.value} value={term.value}>{term.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origin Country</Label>
                <Select value={formData.originCountry} onValueChange={(v) => setFormData({...formData, originCountry: v})}>
                  <SelectTrigger data-testid="select-origin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination Country</Label>
                <Select value={formData.destinationCountry} onValueChange={(v) => setFormData({...formData, destinationCountry: v})}>
                  <SelectTrigger data-testid="select-destination">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Value (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    className="pl-8"
                    type="number"
                    placeholder="10000"
                    value={formData.productValue}
                    onChange={(e) => setFormData({...formData, productValue: e.target.value})}
                    data-testid="input-value"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input 
                  type="number"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  data-testid="input-quantity"
                />
              </div>
              <div className="space-y-2">
                <Label>Freight Cost (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    className="pl-8"
                    type="number"
                    placeholder="Auto-estimate"
                    value={formData.freightCost}
                    onChange={(e) => setFormData({...formData, freightCost: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Insurance Cost (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input 
                    className="pl-8"
                    type="number"
                    placeholder="Auto-estimate"
                    value={formData.insuranceCost}
                    onChange={(e) => setFormData({...formData, insuranceCost: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={calculateDuties} 
              disabled={isCalculating || !formData.productValue}
              data-testid="button-calculate"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Duties & Fees
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Trade Route Header */}
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto mb-1 text-primary" />
                      <div className="font-medium">{formData.originCountry}</div>
                      <div className="text-xs text-muted-foreground">Origin</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      <Ship className="w-6 h-6 text-blue-500" />
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto mb-1 text-green-500" />
                      <div className="font-medium">{formData.destinationCountry}</div>
                      <div className="text-xs text-muted-foreground">Destination</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-sm">
                      <Hash className="w-3 h-3 mr-1" />
                      HS Code: {result.hsCode}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Landed Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Total Landed Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center mb-4 text-green-600">
                    ${result.landedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-center text-muted-foreground mb-6">
                    ${result.costPerUnit.toFixed(2)} per unit ({formData.quantity} units)
                  </div>
                  
                  {/* Cost Breakdown Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-primary" />
                    Fee Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Product Value (FOB)</TableCell>
                        <TableCell className="text-right">${result.productValue.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Freight Cost</TableCell>
                        <TableCell className="text-right">${result.freightCost.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Insurance</TableCell>
                        <TableCell className="text-right">${result.insuranceCost.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">CIF Value</TableCell>
                        <TableCell className="text-right font-bold">${result.cifValue.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Import Duty ({result.dutyRate}%)
                        </TableCell>
                        <TableCell className="text-right text-amber-600">${result.importDuty.toLocaleString()}</TableCell>
                      </TableRow>
                      {result.vat > 0 && (
                        <TableRow>
                          <TableCell className="font-medium">
                            VAT/GST ({result.vatRate}%)
                          </TableCell>
                          <TableCell className="text-right text-red-600">${result.vat.toLocaleString()}</TableCell>
                        </TableRow>
                      )}
                      {result.mpf > 0 && (
                        <TableRow>
                          <TableCell className="font-medium">Merchandise Processing Fee</TableCell>
                          <TableCell className="text-right">${result.mpf.toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                      {result.hmf > 0 && (
                        <TableRow>
                          <TableCell className="font-medium">Harbor Maintenance Fee</TableCell>
                          <TableCell className="text-right">${result.hmf.toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">Customs Brokerage</TableCell>
                        <TableCell className="text-right">${result.brokerageFee}</TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/10 font-bold text-lg">
                        <TableCell>Total Landed Cost</TableCell>
                        <TableCell className="text-right text-primary">${result.landedCost.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Info Note */}
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Disclaimer</p>
                      <p>
                        These calculations are estimates based on standard tariff rates. 
                        Actual duties may vary based on specific HS code classification, 
                        trade agreements, and current regulations. Consult a licensed 
                        customs broker for official guidance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Enter Product Details</h3>
                <p className="text-muted-foreground">
                  Fill in the form to calculate customs duties and landed costs
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
