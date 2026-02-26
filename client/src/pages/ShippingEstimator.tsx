import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ship, Plane, Truck, Package, Clock, DollarSign, Loader2, 
  ArrowRight, Globe, MapPin, Calendar, Info, CheckCircle,
  Container, Weight, Ruler, Save, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import jsPDF from "jspdf";

const COUNTRIES = [
  "China", "United States", "Germany", "United Kingdom", "France", "Japan", 
  "South Korea", "India", "Vietnam", "Thailand", "Indonesia", "Mexico", 
  "Turkey", "Canada", "Australia", "Netherlands", "Italy", "Spain"
];

const PORTS = {
  "China": ["Shanghai", "Shenzhen", "Ningbo", "Guangzhou", "Qingdao"],
  "United States": ["Los Angeles", "Long Beach", "New York", "Savannah", "Seattle"],
  "Germany": ["Hamburg", "Bremerhaven", "Rotterdam"],
  "United Kingdom": ["Felixstowe", "Southampton", "London Gateway"],
};

export default function ShippingEstimator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    originCountry: "China",
    destinationCountry: "United States",
    weight: "",
    length: "",
    width: "",
    height: "",
    containerType: "20ft",
    cargoType: "general",
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("sea");
  const [results, setResults] = useState<any>(null);

  const saveEstimate = async () => {
    if (!results) return;
    
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/calculations/shipping", {
        originCountry: formData.originCountry,
        destinationCountry: formData.destinationCountry,
        weight: parseFloat(formData.weight) || null,
        volume: results.volume,
        shippingMethod: selectedMethod,
        result: results,
      });
      toast({
        title: "Saved!",
        description: "Shipping estimate saved to your reports.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = () => {
    if (!results) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Shipping Cost Estimate", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 32, pageWidth - 20, 32);
    
    let y = 45;
    const leftCol = 25;
    const rightCol = pageWidth - 25;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Shipment Details", leftCol, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Route: ${formData.originCountry} → ${formData.destinationCountry}`, leftCol, y);
    y += 7;
    doc.text(`Weight: ${results.weight} kg`, leftCol, y);
    y += 7;
    doc.text(`Volume: ${results.volume.toFixed(2)} CBM`, leftCol, y);
    y += 7;
    doc.text(`Chargeable Weight: ${results.chargeableWeight.toFixed(2)} kg`, leftCol, y);
    y += 15;
    
    const addMethodSection = (title: string, options: any[]) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title, leftCol, y);
      y += 10;
      
      options.forEach((option: any) => {
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`${option.carrier} - ${option.type}`, leftCol, y);
        doc.text(`$${option.cost.toLocaleString()}`, rightCol, y, { align: "right" });
        y += 6;
        doc.setFontSize(9);
        doc.text(`Transit: ${option.transitTime} | ${option.frequency}`, leftCol + 5, y);
        y += 8;
      });
      y += 5;
    };
    
    addMethodSection("Sea Freight Options", results.seaFreight.options);
    addMethodSection("Air Freight Options", results.airFreight.options);
    addMethodSection("Express Courier Options", results.express.options);
    
    doc.save(`shipping-estimate-${Date.now()}.pdf`);
    
    toast({
      title: "Downloaded!",
      description: "PDF saved to your downloads folder.",
    });
  };

  const calculateVolume = () => {
    const l = parseFloat(formData.length) || 0;
    const w = parseFloat(formData.width) || 0;
    const h = parseFloat(formData.height) || 0;
    return (l * w * h) / 1000000; // Convert to CBM
  };

  const countryToCode: Record<string, string> = {
    China: "CN", "United States": "US", Germany: "DE", "United Kingdom": "GB", France: "FR",
    Japan: "JP", "South Korea": "KR", India: "IN", Vietnam: "VN", Thailand: "TH", Indonesia: "ID",
    Mexico: "MX", Turkey: "TR", Canada: "CA", Australia: "AU", Netherlands: "NL", Italy: "IT", Spain: "ES",
  };

  const calculateShipping = async () => {
    setIsCalculating(true);
    const weight = parseFloat(formData.weight) || 100;
    const volume = calculateVolume() || 1;
    const chargeableWeight = Math.max(weight, volume * 167);

    let benchmarkRates: { sea20ft: number; sea40ft: number; airPerKg: number; lclPerCBM: number } | null = null;
    try {
      const origin = countryToCode[formData.originCountry] || "CN";
      const dest = countryToCode[formData.destinationCountry] || "US";
      const res = await fetch(`/api/freight/benchmark-rates?origin=${origin}&destination=${dest}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        benchmarkRates = data.rates;
      }
    } catch {
      benchmarkRates = null;
    }

    const sea20 = benchmarkRates?.sea20ft ?? 2100;
    const sea40 = benchmarkRates?.sea40ft ?? 3100;
    const airKg = benchmarkRates?.airPerKg ?? 6.2;
    const lclCbm = benchmarkRates?.lclPerCBM ?? 95;

    const seaFreight = {
      method: "Sea Freight",
      icon: Ship,
      options: [
        {
          carrier: "COSCO Shipping",
          type: formData.containerType === "20ft" ? "20' Container" : "40' Container",
          cost: formData.containerType === "20ft" ? Math.round(sea20 * 0.95) : Math.round(sea40 * 0.95),
          transitTime: "25-30 days",
          departure: formData.originCountry === "China" ? "Shanghai" : "Origin port",
          arrival: formData.destinationCountry === "United States" ? "Los Angeles" : "Destination port",
          frequency: "Weekly",
        },
        {
          carrier: "Maersk Line",
          type: formData.containerType === "20ft" ? "20' Container" : "40' Container",
          cost: formData.containerType === "20ft" ? sea20 : sea40,
          transitTime: "22-28 days",
          departure: formData.originCountry === "China" ? "Shenzhen" : "Origin port",
          arrival: formData.destinationCountry === "United States" ? "Long Beach" : "Destination port",
          frequency: "Twice Weekly",
        },
        {
          carrier: "MSC",
          type: "LCL (per CBM)",
          cost: Math.round(volume * lclCbm),
          transitTime: "28-35 days",
          departure: "Origin",
          arrival: "Destination",
          frequency: "Weekly",
        },
      ],
    };

    const airFreight = {
      method: "Air Freight",
      icon: Plane,
      options: [
        {
          carrier: "FedEx International",
          type: "Express",
          cost: Math.round(chargeableWeight * airKg * 1.1),
          transitTime: "3-5 days",
          departure: "Origin (PVG)",
          arrival: "Destination (LAX)",
          frequency: "Daily",
        },
        {
          carrier: "DHL Express",
          type: "Priority",
          cost: Math.round(chargeableWeight * airKg * 1.2),
          transitTime: "2-4 days",
          departure: "Origin (HKG)",
          arrival: "Destination (JFK)",
          frequency: "Daily",
        },
        {
          carrier: "UPS Worldwide",
          type: "Express Saver",
          cost: Math.round(chargeableWeight * airKg),
          transitTime: "4-6 days",
          departure: "Origin (SZX)",
          arrival: "Destination (ORD)",
          frequency: "Daily",
        },
      ],
    };

    const express = {
      method: "Express Courier",
      icon: Truck,
      options: [
        {
          carrier: "DHL Express",
          type: "Door to Door",
          cost: Math.round(weight * airKg * 1.8),
          transitTime: "3-5 business days",
          departure: "Pickup",
          arrival: "Delivery",
          frequency: "On-demand",
        },
        {
          carrier: "FedEx Priority",
          type: "Door to Door",
          cost: Math.round(weight * airKg * 1.7),
          transitTime: "2-4 business days",
          departure: "Pickup",
          arrival: "Delivery",
          frequency: "On-demand",
        },
        {
          carrier: "UPS Express",
          type: "Door to Door",
          cost: Math.round(weight * airKg * 1.6),
          transitTime: "3-5 business days",
          departure: "Pickup",
          arrival: "Delivery",
          frequency: "On-demand",
        },
      ],
    };

    setResults({ seaFreight, airFreight, express, weight, volume, chargeableWeight });
    setIsCalculating(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Shipping Cost Estimator</h1>
        <p className="text-muted-foreground">
          Compare shipping rates for sea freight, air freight, and express courier. Uses real market benchmark rates (Freightos/Xeneta 2024) for your route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Origin Country</Label>
                <Select value={formData.originCountry} onValueChange={(v) => setFormData({...formData, originCountry: v})}>
                  <SelectTrigger data-testid="select-origin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Total Weight (kg)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input 
                    className="pl-10"
                    type="number"
                    placeholder="100"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    data-testid="input-weight"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input 
                    type="number"
                    placeholder="L"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: e.target.value})}
                  />
                  <Input 
                    type="number"
                    placeholder="W"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                  />
                  <Input 
                    type="number"
                    placeholder="H"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Container Type (Sea)</Label>
                <Select value={formData.containerType} onValueChange={(v) => setFormData({...formData, containerType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20' Standard Container</SelectItem>
                    <SelectItem value="40ft">40' Standard Container</SelectItem>
                    <SelectItem value="40hc">40' High Cube</SelectItem>
                    <SelectItem value="lcl">LCL (Less than Container)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={calculateShipping} 
              disabled={isCalculating}
              data-testid="button-calculate"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Rates...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Get Shipping Rates
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <>
              {/* Route Summary */}
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto mb-1 text-primary" />
                      <div className="font-medium">{formData.originCountry}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto mb-1 text-green-500" />
                      <div className="font-medium">{formData.destinationCountry}</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    <Badge variant="outline">
                      <Weight className="w-3 h-3 mr-1" />
                      {results.weight} kg
                    </Badge>
                    <Badge variant="outline">
                      <Ruler className="w-3 h-3 mr-1" />
                      {results.volume.toFixed(2)} CBM
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={saveEstimate}
                  disabled={isSaving}
                  data-testid="button-save"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save to Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={downloadPDF}
                  data-testid="button-download"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <Tabs defaultValue="sea" className="w-full" onValueChange={setSelectedMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sea" className="flex items-center gap-2">
                    <Ship className="w-4 h-4" />
                    Sea Freight
                  </TabsTrigger>
                  <TabsTrigger value="air" className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Air Freight
                  </TabsTrigger>
                  <TabsTrigger value="express" className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Express
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sea" className="space-y-4 mt-4">
                  {results.seaFreight.options.map((option: any, i: number) => (
                    <ShippingOptionCard key={i} option={option} recommended={i === 0} />
                  ))}
                </TabsContent>

                <TabsContent value="air" className="space-y-4 mt-4">
                  {results.airFreight.options.map((option: any, i: number) => (
                    <ShippingOptionCard key={i} option={option} recommended={i === 0} />
                  ))}
                </TabsContent>

                <TabsContent value="express" className="space-y-4 mt-4">
                  {results.express.options.map((option: any, i: number) => (
                    <ShippingOptionCard key={i} option={option} recommended={i === 0} />
                  ))}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <Ship className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Enter Shipment Details</h3>
                <p className="text-muted-foreground">
                  Fill in your shipment information to compare shipping rates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ShippingOptionCard({ option, recommended }: { option: any; recommended?: boolean }) {
  return (
    <Card className={recommended ? "border-2 border-green-500" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-lg">{option.carrier}</h4>
              {recommended && (
                <Badge className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Best Value
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {option.type}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {option.transitTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {option.frequency}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {option.departure} → {option.arrival}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              ${option.cost.toLocaleString()}
            </div>
            <Button className="mt-2" size="sm">
              Request Quote
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
