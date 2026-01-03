import { useState } from "react";
import { useProfile, useCreateReport, useCreateSourcingRequest } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Ship, Plane } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, FileText, CheckCircle, AlertTriangle, ArrowRight, Download, Ticket } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

// Steps: 0 = Form, 1 = Loading/Generating, 2 = Result
export default function SmartFinder() {
  const [step, setStep] = useState(0);
  const { data: profile } = useProfile();
  const createReport = useCreateReport();
  const createSourcingRequest = useCreateSourcingRequest();
  const [_, setLocation] = useLocation();
  const [reportId, setReportId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    budget: "",
    targetRegion: "Global",
    quantity: "1000",
    originCountry: "China",
    destinationCountry: "United States",
    additionalRequirements: ""
  });

  const handleSubmit = () => {
    // Check credits
    if (!profile || profile.credits < 1) {
      toast.error("Insufficient credits. You need at least 1 credit to generate a report.");
      return;
    }

    setStep(1);
    
    // Create report with real API
    createReport.mutate({
      title: `Sourcing Report: ${formData.productName || formData.category}`,
      category: formData.category,
      formData,
    }, {
      onSuccess: (data) => {
        setReportId(data.id);
        // Redirect to reports page to see the full report
        setTimeout(() => {
          setLocation('/reports');
        }, 2000);
        setStep(2);
      },
      onError: () => {
        setStep(0); // Go back to form on error
      }
    });
  };

  const handlePdfExport = () => {
    if (!profile || profile.credits < 1) {
      toast.error("Insufficient credits. PDF export costs 1 credit.");
      return;
    }
    
    toast.success("PDF export feature coming soon!");
  };

  const handlePremiumRequest = () => {
    if (!profile || profile.credits < 10) {
      toast.error("Insufficient credits. Premium requests cost 10 credits.");
      return;
    }
    
    createSourcingRequest.mutate({
      title: `Premium Request: ${formData.productName || formData.category}`,
      description: `Product: ${formData.productName}\nCategory: ${formData.category}\nBudget: ${formData.budget}\nQuantity: ${formData.quantity}\n\nRequirements:\n${formData.additionalRequirements || "None specified"}`,
    });
  }


  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold mb-2">Analyzing Global Markets...</h2>
          <p className="text-muted-foreground">AI is scanning 50+ regions for "{formData.productName || formData.category}"</p>
        </div>
        <div className="w-full max-w-md space-y-2">
          <div className="text-xs text-left text-muted-foreground">Checking Compliance...</div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress w-2/3"></div>
          </div>
          <div className="text-xs text-right text-muted-foreground">Calculating Landed Costs...</div>
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
          <h2 className="text-2xl font-heading font-bold mb-2">Report Created Successfully!</h2>
          <p className="text-muted-foreground">Your AI sourcing report for "{formData.productName || formData.category}" is being generated.</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to Reports page...</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(0)}>
            Create Another
          </Button>
          <Button onClick={() => setLocation('/reports')}>
            <FileText className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-bold mb-3">AI Smart Finder</h1>
        <p className="text-muted-foreground">
          Tell us what you want to source. Our AI consultant will build a complete strategy.
        </p>
      </div>

      <Card className="border-primary/10 shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Input 
                placeholder="e.g. Wireless Headphones" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Budget (Per Unit)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input 
                  className="pl-8" 
                  placeholder="15.00" 
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label>Product Name</Label>
              <Input 
                placeholder="e.g. Smart Speaker Model X" 
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                data-testid="input-product-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Order Quantity</Label>
              <Input 
                type="number" 
                placeholder="1000" 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                data-testid="input-quantity"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Origin Country (Supplier)</Label>
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Country (Import)</Label>
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
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="Turkey">Turkey</SelectItem>
                  <SelectItem value="Netherlands">Netherlands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Requirements</Label>
            <Textarea 
              placeholder="Describe materials, certifications, packaging needs, or specific features..." 
              className="h-24 resize-none"
              value={formData.additionalRequirements}
              onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
              data-testid="input-requirements"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t mt-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 mr-2 text-accent" />
              Cost: 1 Credit
            </div>
            <Button size="lg" className="px-8" onClick={handleSubmit} disabled={!formData.category}>
              Generate Report <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SupplierCard({ name, region, rating, price, moq }: any) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{region}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
            <span className="flex items-center text-amber-500">★ {rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">{price}</div>
          <div className="text-xs text-muted-foreground">MOQ: {moq}</div>
        </div>
      </CardContent>
    </Card>
  )
}