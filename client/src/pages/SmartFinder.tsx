import { useState, useEffect, useMemo } from "react";
import { useProfile, useCreateReport, useCreateSourcingRequest } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, Loader2, FileText, CheckCircle, ArrowRight, 
  Package, Globe, Ship, Plane, Truck, Shield, Hash, 
  Building2, Calendar, Scale, FileCheck, Search
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const HS_CODE_DATABASE: Record<string, { code: string; description: string }[]> = {
  "electronics": [
    { code: "8471.30", description: "Portable digital automatic data processing machines" },
    { code: "8517.12", description: "Telephones for cellular networks or wireless networks" },
    { code: "8518.30", description: "Headphones and earphones" },
    { code: "8528.72", description: "Television receivers, color" },
    { code: "8543.70", description: "Electrical machines and apparatus" },
  ],
  "headphones": [
    { code: "8518.30.20", description: "Headphones and earphones, combined with microphone" },
    { code: "8518.30.10", description: "Headphones and earphones, not combined with microphone" },
  ],
  "speaker": [
    { code: "8518.21", description: "Single loudspeakers, mounted in enclosures" },
    { code: "8518.22", description: "Multiple loudspeakers, mounted in same enclosure" },
    { code: "8518.29", description: "Other loudspeakers" },
  ],
  "phone": [
    { code: "8517.12.00", description: "Telephones for cellular networks" },
    { code: "8517.62", description: "Machines for reception, conversion and transmission" },
  ],
  "laptop": [
    { code: "8471.30.01", description: "Portable automatic data processing machines" },
    { code: "8471.41", description: "Data processing machines with CPU, input/output units" },
  ],
  "textile": [
    { code: "6109.10", description: "T-shirts, singlets and other vests, knitted, of cotton" },
    { code: "6110.20", description: "Jerseys, pullovers, cardigans, of cotton" },
    { code: "6203.42", description: "Men's or boys' trousers, of cotton" },
    { code: "6204.62", description: "Women's or girls' trousers, of cotton" },
  ],
  "clothing": [
    { code: "6109.10", description: "T-shirts, singlets and other vests, knitted, of cotton" },
    { code: "6110.20", description: "Jerseys, pullovers, cardigans, of cotton" },
    { code: "6203.42", description: "Men's or boys' trousers, of cotton" },
  ],
  "furniture": [
    { code: "9403.60", description: "Other wooden furniture" },
    { code: "9403.20", description: "Other metal furniture" },
    { code: "9401.61", description: "Upholstered seats with wooden frames" },
  ],
  "toys": [
    { code: "9503.00", description: "Tricycles, scooters, pedal cars, and similar wheeled toys" },
    { code: "9504.50", description: "Video game consoles and machines" },
  ],
  "cosmetics": [
    { code: "3304.99", description: "Beauty or make-up preparations" },
    { code: "3305.10", description: "Shampoos" },
    { code: "3307.20", description: "Personal deodorants and antiperspirants" },
  ],
  "machinery": [
    { code: "8479.89", description: "Machines and mechanical appliances" },
    { code: "8481.80", description: "Taps, cocks, valves and similar appliances" },
  ],
  "automotive": [
    { code: "8708.29", description: "Parts and accessories of motor vehicles" },
    { code: "8708.99", description: "Other parts and accessories of motor vehicles" },
  ],
  "food": [
    { code: "2106.90", description: "Food preparations not elsewhere specified" },
    { code: "1905.90", description: "Bread, pastry, cakes, biscuits" },
  ],
  "medical": [
    { code: "9018.90", description: "Instruments and appliances used in medical sciences" },
    { code: "3005.90", description: "Wadding, gauze, bandages and similar articles" },
  ],
  "antimony": [
    { code: "8110.10", description: "Unwrought antimony; powders" },
    { code: "8110.20", description: "Antimony waste and scrap" },
    { code: "2617.10", description: "Antimony ores and concentrates" },
  ],
  "metal": [
    { code: "7326.90", description: "Other articles of iron or steel" },
    { code: "7616.99", description: "Other articles of aluminum" },
    { code: "7419.99", description: "Other articles of copper" },
  ],
  "plastic": [
    { code: "3926.90", description: "Other articles of plastics" },
    { code: "3923.30", description: "Carboys, bottles, flasks of plastics" },
  ],
  "default": [
    { code: "9999.00", description: "Miscellaneous manufactured articles" },
  ],
};

const INCOTERMS = [
  { value: "FOB", label: "FOB - Free on Board", description: "Seller delivers goods on board vessel" },
  { value: "CIF", label: "CIF - Cost, Insurance & Freight", description: "Seller pays for freight and insurance" },
  { value: "EXW", label: "EXW - Ex Works", description: "Buyer takes all responsibility from seller's premises" },
  { value: "DDP", label: "DDP - Delivered Duty Paid", description: "Seller delivers goods cleared for import" },
  { value: "DAP", label: "DAP - Delivered at Place", description: "Seller delivers to named place of destination" },
];

const SHIPPING_METHODS = [
  { value: "sea", label: "Sea Freight", icon: Ship, description: "25-40 days, most economical" },
  { value: "air", label: "Air Freight", icon: Plane, description: "3-7 days, fastest option" },
  { value: "rail", label: "Rail Freight", icon: Truck, description: "15-20 days, China-Europe" },
];

const CERTIFICATIONS = [
  { value: "iso9001", label: "ISO 9001" },
  { value: "iso14001", label: "ISO 14001" },
  { value: "ce", label: "CE Marking" },
  { value: "fda", label: "FDA Approved" },
  { value: "rohs", label: "RoHS Compliant" },
  { value: "reach", label: "REACH Compliant" },
  { value: "bsci", label: "BSCI Certified" },
  { value: "ul", label: "UL Listed" },
];

export default function SmartFinder() {
  const [step, setStep] = useState(0);
  const { data: profile } = useProfile();
  const createReport = useCreateReport();
  const [_, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    category: "",
    hsCode: "",
    quantity: "1000",
    unitOfMeasure: "pieces",
    originCountry: "China",
    destinationCountry: "United States",
    preferredIncoterm: "FOB",
    shippingMethod: "sea",
    targetLeadTime: "",
    certifications: [] as string[],
    qualityRequirements: "",
    packagingRequirements: "",
    additionalRequirements: ""
  });

  const [suggestedHsCodes, setSuggestedHsCodes] = useState<{ code: string; description: string }[]>([]);
  const [showHsSuggestions, setShowHsSuggestions] = useState(false);

  useEffect(() => {
    const searchTerms = [formData.productName, formData.category, formData.productDescription]
      .join(" ")
      .toLowerCase();
    
    let suggestions: { code: string; description: string }[] = [];
    
    for (const [keyword, codes] of Object.entries(HS_CODE_DATABASE)) {
      if (keyword !== "default" && searchTerms.includes(keyword)) {
        suggestions = [...suggestions, ...codes];
      }
    }
    
    if (suggestions.length === 0 && searchTerms.length > 2) {
      suggestions = HS_CODE_DATABASE.default;
    }
    
    const uniqueSuggestions = suggestions.filter((item, index, self) =>
      index === self.findIndex((t) => t.code === item.code)
    );
    
    setSuggestedHsCodes(uniqueSuggestions.slice(0, 5));
  }, [formData.productName, formData.category, formData.productDescription]);

  const handleCertificationChange = (certValue: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, certValue]
      });
    } else {
      setFormData({
        ...formData,
        certifications: formData.certifications.filter(c => c !== certValue)
      });
    }
  };

  const handleSubmit = () => {
    if (!profile || profile.credits < 1) {
      toast.error("Insufficient credits. You need at least 1 credit to generate a report.");
      return;
    }

    if (!formData.productName && !formData.category) {
      toast.error("Please enter a product name or category.");
      return;
    }

    setStep(1);
    
    createReport.mutate({
      title: `Sourcing Report: ${formData.productName || formData.category}`,
      category: formData.category || formData.productName,
      formData,
    }, {
      onSuccess: () => {
        setTimeout(() => {
          setLocation('/reports');
        }, 2000);
        setStep(2);
      },
      onError: () => {
        setStep(0);
      }
    });
  };

  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold mb-2">Generating Intelligence Report...</h2>
          <p className="text-muted-foreground">Analyzing markets, customs duties, and supplier data for "{formData.productName || formData.category}"</p>
        </div>
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span>Classifying HS/GTIP codes...</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>Calculating customs duties and tariffs...</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>Identifying qualified suppliers...</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold mb-2">Report Generated Successfully</h2>
          <p className="text-muted-foreground">Your comprehensive sourcing intelligence report is ready for review.</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to Reports...</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(0)}>
            New Analysis
          </Button>
          <Button onClick={() => setLocation('/reports')}>
            <FileText className="w-4 h-4 mr-2" />
            View Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <Badge className="mb-4">AI-Powered Analysis</Badge>
        <h1 className="text-3xl font-heading font-bold mb-3">Sourcing Intelligence Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter your product specifications below. Our AI will generate a comprehensive report including 
          HS code classification, customs duties, landed costs, and verified supplier recommendations.
        </p>
      </div>

      <Card className="border-primary/10 shadow-xl">
        <CardContent className="p-8 space-y-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Product Specification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="productName"
                  placeholder="Enter specific product name (e.g., Bluetooth Wireless Headphones)"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  data-testid="input-product-name"
                />
                <p className="text-xs text-muted-foreground">Be as specific as possible for accurate HS code matching</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Product Category</Label>
                <Input 
                  id="category"
                  placeholder="e.g., Consumer Electronics, Textiles, Machinery"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  data-testid="input-category"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="productDescription">Product Description</Label>
              <Textarea 
                id="productDescription"
                placeholder="Provide detailed product specifications including materials, dimensions, features, and intended use..."
                className="h-20 resize-none"
                value={formData.productDescription}
                onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <Label htmlFor="hsCode">HS/GTIP Code (Optional)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="hsCode"
                    className="pl-10"
                    placeholder="Auto-detected from product info"
                    value={formData.hsCode}
                    onChange={(e) => setFormData({...formData, hsCode: e.target.value})}
                    onFocus={() => setShowHsSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowHsSuggestions(false), 200)}
                  />
                </div>
                {showHsSuggestions && suggestedHsCodes.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <div className="p-2 text-xs font-medium text-muted-foreground border-b">
                      <Search className="w-3 h-3 inline mr-1" />
                      Suggested HS Codes
                    </div>
                    {suggestedHsCodes.map((hs) => (
                      <button
                        key={hs.code}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                        onClick={() => {
                          setFormData({...formData, hsCode: hs.code});
                          setShowHsSuggestions(false);
                        }}
                      >
                        <span className="font-mono font-medium">{hs.code}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{hs.description}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Leave blank for AI auto-classification</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Order Quantity <span className="text-destructive">*</span></Label>
                  <Input 
                    id="quantity"
                    type="number" 
                    placeholder="1000"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    data-testid="input-quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit of Measure</Label>
                  <Select value={formData.unitOfMeasure} onValueChange={(v) => setFormData({...formData, unitOfMeasure: v})}>
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pieces">Pieces (PCS)</SelectItem>
                      <SelectItem value="sets">Sets</SelectItem>
                      <SelectItem value="kg">Kilograms (KG)</SelectItem>
                      <SelectItem value="mt">Metric Tons (MT)</SelectItem>
                      <SelectItem value="cbm">Cubic Meters (CBM)</SelectItem>
                      <SelectItem value="cartons">Cartons (CTN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Trade Route</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Origin Country (Supplier Location)</Label>
                <Select value={formData.originCountry} onValueChange={(v) => setFormData({...formData, originCountry: v})}>
                  <SelectTrigger data-testid="select-origin">
                    <SelectValue placeholder="Select origin country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Taiwan">Taiwan</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination Country (Import Market)</Label>
                <Select value={formData.destinationCountry} onValueChange={(v) => setFormData({...formData, destinationCountry: v})}>
                  <SelectTrigger data-testid="select-destination">
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="UAE">United Arab Emirates</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Belgium">Belgium</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ship className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Logistics Preferences</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Preferred Incoterm</Label>
                <Select value={formData.preferredIncoterm} onValueChange={(v) => setFormData({...formData, preferredIncoterm: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOTERMS.map((term) => (
                      <SelectItem key={term.value} value={term.value}>
                        <div className="flex flex-col">
                          <span>{term.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {INCOTERMS.find(t => t.value === formData.preferredIncoterm)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preferred Shipping Method</Label>
                <Select value={formData.shippingMethod} onValueChange={(v) => setFormData({...formData, shippingMethod: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <method.icon className="w-4 h-4" />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {SHIPPING_METHODS.find(m => m.value === formData.shippingMethod)?.description}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="leadTime">Target Lead Time</Label>
              <Input 
                id="leadTime"
                placeholder="e.g., 30-45 days from order confirmation"
                value={formData.targetLeadTime}
                onChange={(e) => setFormData({...formData, targetLeadTime: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Quality & Compliance Requirements</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Required Certifications</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CERTIFICATIONS.map((cert) => (
                    <div key={cert.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={cert.value}
                        checked={formData.certifications.includes(cert.value)}
                        onCheckedChange={(checked) => handleCertificationChange(cert.value, checked as boolean)}
                      />
                      <label htmlFor={cert.value} className="text-sm cursor-pointer">
                        {cert.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualityReqs">Quality Standards</Label>
                  <Textarea 
                    id="qualityReqs"
                    placeholder="Specify quality requirements, testing standards, AQL levels, inspection requirements..."
                    className="h-20 resize-none"
                    value={formData.qualityRequirements}
                    onChange={(e) => setFormData({...formData, qualityRequirements: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packagingReqs">Packaging Specifications</Label>
                  <Textarea 
                    id="packagingReqs"
                    placeholder="Describe packaging requirements including labeling, inner/outer packaging, pallet specifications..."
                    className="h-20 resize-none"
                    value={formData.packagingRequirements}
                    onChange={(e) => setFormData({...formData, packagingRequirements: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Additional Notes</h3>
            </div>
            
            <div className="space-y-2">
              <Textarea 
                placeholder="Any other requirements, special handling needs, material preferences, target price range, or specific questions for the analysis..."
                className="h-24 resize-none"
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
                data-testid="input-requirements"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Analysis Cost: <span className="font-semibold text-foreground ml-1">1 Credit</span>
              </div>
              {profile && (
                <Badge variant="outline" className="text-xs">
                  Balance: {profile.credits} Credits
                </Badge>
              )}
            </div>
            <Button 
              size="lg" 
              className="px-8" 
              onClick={handleSubmit} 
              disabled={(!formData.productName && !formData.category) || createReport.isPending}
            >
              {createReport.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Generate Intelligence Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
