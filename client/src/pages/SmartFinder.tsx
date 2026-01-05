import { useState, useEffect, useRef } from "react";
import { useProfile, useCreateReport, useReport } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Loader2, FileText, CheckCircle, ArrowRight, 
  Package, Globe, Ship, Plane, Truck, Shield, Hash, 
  Building2, Calendar, Scale, FileCheck, Search, Download,
  AlertTriangle, Star, MapPin, Users, DollarSign, Calculator,
  Landmark, Receipt, Container, Percent, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

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

function CostRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function SmartFinder() {
  const [view, setView] = useState<'form' | 'loading' | 'results'>('form');
  const [reportId, setReportId] = useState<number | null>(null);
  const { data: profile } = useProfile();
  const createReport = useCreateReport();
  const { data: report, refetch } = useReport(reportId || 0);
  const [isExporting, setIsExporting] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    category: "",
    hsCode: "",
    quantity: "1000",
    unitOfMeasure: "pieces",
    originCountry: "Any",
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

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);

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

  useEffect(() => {
    if (view === 'loading' && reportId && report) {
      if (report.status === 'completed') {
        setView('results');
      } else if (report.status === 'failed') {
        toast.error("Report generation failed. Please try again.");
        setView('form');
      } else {
        const timer = setTimeout(() => refetch(), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [view, reportId, report, refetch]);

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
    if (!profile || totalCredits < 1) {
      toast.error("Insufficient credits. You need at least 1 credit to generate a report.");
      return;
    }

    if (!formData.productName && !formData.category) {
      toast.error("Please enter a product name or category.");
      return;
    }

    setView('loading');
    
    createReport.mutate({
      title: `Sourcing Report: ${formData.productName || formData.category}`,
      category: formData.category || formData.productName,
      formData,
    }, {
      onSuccess: (data) => {
        setReportId(data.id);
      },
      onError: () => {
        setView('form');
      }
    });
  };

  const handleNewSearch = () => {
    setView('form');
    setReportId(null);
    setFormData({
      productName: "",
      productDescription: "",
      category: "",
      hsCode: "",
      quantity: "1000",
      unitOfMeasure: "pieces",
      originCountry: "Any",
      destinationCountry: "United States",
      preferredIncoterm: "FOB",
      shippingMethod: "sea",
      targetLeadTime: "",
      certifications: [],
      qualityRequirements: "",
      packagingRequirements: "",
      additionalRequirements: ""
    });
  };

  const exportToPDF = async () => {
    if (!report) return;
    
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const reportData = report.reportData as any;
      const savedFormData = report.formData as any;
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;
      
      const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text, contentWidth);
        lines.forEach((line: string) => {
          if (y > 270) {
            pdf.addPage();
            y = 20;
          }
          pdf.text(line, margin, y);
          y += fontSize * 0.5;
        });
        y += 3;
      };
      
      const addSection = (title: string) => {
        y += 5;
        if (y > 260) {
          pdf.addPage();
          y = 20;
        }
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, margin + contentWidth, y);
        y += 6;
        addText(title, 14, true);
        y += 2;
      };
      
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SmartSeek Sourcing Report', margin, 18);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(report.title, margin, 28);
      
      pdf.setTextColor(0, 0, 0);
      y = 45;
      
      addText(`Generated: ${format(new Date(report.createdAt), 'MMMM d, yyyy')}`, 10);
      addText(`Trade Route: ${savedFormData?.originCountry || 'China'} → ${savedFormData?.destinationCountry || 'United States'}`, 10);
      if (reportData?.productClassification?.hsCode) {
        addText(`HS Code: ${reportData.productClassification.hsCode}`, 10);
      }
      
      if (reportData?.executiveSummary) {
        addSection('EXECUTIVE SUMMARY');
        addText(reportData.executiveSummary, 10);
      }
      
      if (reportData?.productClassification) {
        addSection('PRODUCT CLASSIFICATION');
        addText(`HS Code: ${reportData.productClassification.hsCode || 'N/A'}`, 10);
        addText(`Description: ${reportData.productClassification.hsCodeDescription || 'N/A'}`, 10);
        addText(`Chapter: ${reportData.productClassification.tariffChapter || 'N/A'}`, 10);
        addText(`Category: ${reportData.productClassification.productCategory || 'N/A'}`, 10);
      }
      
      if (reportData?.customsAnalysis?.customsFees) {
        addSection('CUSTOMS DUTIES & FEES');
        const fees = reportData.customsAnalysis.customsFees;
        addText(`Import Duty Rate: ${fees.importDutyRate || 'N/A'}`, 10);
        addText(`Import Duty Amount: ${fees.importDutyAmount || 'N/A'}`, 10);
        addText(`VAT Rate: ${fees.vatRate || 'N/A'}`, 10);
        addText(`VAT Amount: ${fees.vatAmount || 'N/A'}`, 10);
        addText(`Total Customs Fees: ${fees.totalCustomsFees || 'N/A'}`, 10, true);
      }
      
      if (reportData?.landedCostBreakdown) {
        addSection('LANDED COST BREAKDOWN');
        const lc = reportData.landedCostBreakdown;
        addText(`Product Cost: ${lc.productCost || 'N/A'}`, 10);
        addText(`Freight Cost: ${lc.freightCost || 'N/A'}`, 10);
        addText(`Insurance: ${lc.insuranceCost || 'N/A'}`, 10);
        addText(`Customs Duties: ${lc.customsDuties || 'N/A'}`, 10);
        addText(`VAT/Taxes: ${lc.vatTaxes || 'N/A'}`, 10);
        addText(`Total Landed Cost: ${lc.totalLandedCost || 'N/A'}`, 10, true);
        addText(`Cost Per Unit: ${lc.costPerUnit || 'N/A'}`, 10, true);
      }
      
      if (reportData?.profitAnalysis) {
        addSection('PROFIT ANALYSIS');
        const pa = reportData.profitAnalysis;
        addText(`Recommended Retail Price: ${pa.recommendedRetailPrice || 'N/A'}`, 10);
        addText(`Estimated Profit: ${pa.estimatedProfit || 'N/A'}`, 10);
        addText(`Profit Margin: ${pa.profitMargin || 'N/A'}`, 10, true);
        addText(`Break-even Quantity: ${pa.breakEvenQuantity || 'N/A'}`, 10);
      }
      
      if (reportData?.sellerComparison?.length > 0) {
        addSection('SUPPLIER COMPARISON');
        reportData.sellerComparison.forEach((seller: any, index: number) => {
          addText(`${index + 1}. ${seller.sellerName || 'Supplier'}`, 11, true);
          addText(`   Platform: ${seller.platform || 'N/A'} | Location: ${seller.location || 'N/A'}`, 9);
          addText(`   Unit Price: ${seller.unitPrice || 'N/A'} | MOQ: ${seller.moq || 'N/A'}`, 9);
          addText(`   Rating: ${seller.rating || 'N/A'} | Lead Time: ${seller.leadTime || 'N/A'}`, 9);
          y += 2;
        });
      }
      
      if (reportData?.riskAssessment) {
        addSection('RISK ASSESSMENT');
        addText(`Overall Risk Level: ${reportData.riskAssessment.overallRisk || 'N/A'}`, 10, true);
        if (reportData.riskAssessment.risks?.length > 0) {
          reportData.riskAssessment.risks.forEach((risk: any) => {
            addText(`• ${risk.category}: ${risk.level} - ${risk.mitigation}`, 9);
          });
        }
      }
      
      if (reportData?.recommendations?.length > 0) {
        addSection('RECOMMENDATIONS');
        reportData.recommendations.forEach((rec: string) => {
          addText(`• ${rec}`, 10);
        });
      }
      
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Generated by SmartSeek - AI-Powered Sourcing Intelligence', margin, 285);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, 285);
      }
      
      const fileName = `SmartSeek_Report_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (view === 'loading') {
    return (
      <div className="max-w-4xl mx-auto py-8">
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
          <p className="text-sm text-muted-foreground">This usually takes 20-40 seconds</p>
        </div>
      </div>
    );
  }

  if (view === 'results' && report) {
    const reportData = report.reportData as any;
    const savedFormData = report.formData as any;
    const customsData = reportData?.customsAnalysis;
    const landedCost = reportData?.landedCostBreakdown;
    const sellers = reportData?.sellerComparison || [];
    const profitAnalysis = reportData?.profitAnalysis;
    const productClass = reportData?.productClassification;

    const costBreakdownData = landedCost ? [
      { name: 'Product', value: parseFloat(landedCost.productCost?.replace(/[^0-9.]/g, '') || '0'), color: '#3b82f6' },
      { name: 'Freight', value: parseFloat(landedCost.freightCost?.replace(/[^0-9.]/g, '') || '0'), color: '#10b981' },
      { name: 'Duties', value: parseFloat(landedCost.customsDuties?.replace(/[^0-9.]/g, '') || '0'), color: '#f59e0b' },
      { name: 'VAT/Tax', value: parseFloat(landedCost.vatTaxes?.replace(/[^0-9.]/g, '') || '0'), color: '#ef4444' },
      { name: 'Fees', value: parseFloat(landedCost.handlingFees?.replace(/[^0-9.]/g, '') || '0') + parseFloat(landedCost.brokerageFees?.replace(/[^0-9.]/g, '') || '0'), color: '#8b5cf6' },
    ].filter(d => d.value > 0) : [];

    const sellerComparisonData = sellers.map((s: any) => ({
      name: s.sellerName?.split(' ')[0] || 'Seller',
      price: parseFloat(s.unitPrice?.replace(/[^0-9.]/g, '') || '0'),
      margin: parseFloat(s.profitMargin?.replace(/[^0-9.]/g, '') || '0'),
      rating: s.rating || 4.0
    }));

    return (
      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge variant="outline" className="mb-2">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Report Complete
            </Badge>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">{report.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Generated on {format(new Date(report.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNewSearch} data-testid="button-new-search">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Search
            </Button>
            <Button onClick={exportToPDF} disabled={isExporting} data-testid="button-download-pdf">
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <Hash className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold font-mono">{productClass?.hsCode || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">HS Code</div>
          </Card>
          <Card className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-bold">{landedCost?.costPerUnit || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Landed Cost/Unit</div>
          </Card>
          <Card className="p-4 text-center">
            <Percent className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-bold">{profitAnalysis?.profitMargin || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Est. Margin</div>
          </Card>
          <Card className="p-4 text-center">
            <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-bold">{sellers.length}</div>
            <div className="text-xs text-muted-foreground">Suppliers Found</div>
          </Card>
        </div>

        <Tabs defaultValue="suppliers" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="suppliers" data-testid="tab-suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="summary" data-testid="tab-summary">Summary</TabsTrigger>
            <TabsTrigger value="costs" data-testid="tab-costs">Landed Cost</TabsTrigger>
            <TabsTrigger value="customs" data-testid="tab-customs">Customs</TabsTrigger>
            <TabsTrigger value="risks" data-testid="tab-risks">Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Supplier Comparison
                </CardTitle>
                <p className="text-sm text-muted-foreground">Compare suppliers with pricing, MOQ, and ratings</p>
              </CardHeader>
              <CardContent>
                {sellerComparisonData.length > 0 && (
                  <div className="h-64 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sellerComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="price" name="Unit Price ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="margin" name="Profit Margin (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-4">
                  {sellers.map((seller: any, i: number) => (
                    <div key={i} className={`p-6 rounded-xl border-2 ${i === 0 ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-border'}`}>
                      {i === 0 && (
                        <Badge className="bg-green-500 mb-3">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Recommended
                        </Badge>
                      )}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{seller.sellerName}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {seller.location}
                                <span className="mx-1">|</span>
                                <Badge variant="outline" className="text-xs">{seller.platform}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Unit Price</div>
                              <div className="text-lg font-bold text-primary">{seller.unitPrice}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">MOQ</div>
                              <div className="font-medium">{seller.moq}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Lead Time</div>
                              <div className="font-medium">{seller.leadTime}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Rating</div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-500 fill-current" />
                                <span className="font-medium">{seller.rating}</span>
                                {seller.yearsInBusiness && (
                                  <span className="text-xs text-muted-foreground">({seller.yearsInBusiness}y)</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {seller.certifications && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {seller.certifications.map((cert: string, j: number) => (
                                <Badge key={j} variant="secondary" className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="lg:w-64 space-y-3 p-4 bg-muted/50 rounded-xl">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Platform Fees</span>
                            <span className="font-medium">{seller.platformFees || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Cost</span>
                            <span className="font-medium">{seller.totalCostWithFees || 'N/A'}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Est. Profit/Unit</span>
                            <span className="font-bold text-green-600">{seller.estimatedProfit || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Profit Margin</span>
                            <span className="font-bold text-green-600">{seller.profitMargin || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      {seller.recommendation && (
                        <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
                          <Sparkles className="w-4 h-4 inline mr-1 text-primary" />
                          {seller.recommendation}
                        </p>
                      )}
                    </div>
                  ))}
                  {sellers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No suppliers found for this product.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">{reportData?.executiveSummary || 'No summary available.'}</p>
              </CardContent>
            </Card>

            {productClass && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-primary" />
                    Product Classification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">HS Code</div>
                      <div className="text-2xl font-mono font-bold text-primary">{productClass.hsCode}</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Tariff Chapter</div>
                      <div className="font-medium">{productClass.tariffChapter}</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Category</div>
                      <div className="font-medium">{productClass.productCategory}</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Classification</div>
                      <div className="font-medium text-sm">{productClass.hsCodeDescription?.slice(0, 50)}...</div>
                    </div>
                  </div>
                  {productClass.regulatoryRequirements && (
                    <div>
                      <div className="text-sm font-medium mb-2">Regulatory Requirements</div>
                      <div className="flex flex-wrap gap-2">
                        {productClass.regulatoryRequirements.map((req: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {reportData?.recommendations && reportData.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reportData.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            {landedCost && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Landed Cost Breakdown
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Complete cost from factory to your door</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {costBreakdownData.length > 0 && (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={costBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {costBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    <div className="space-y-3">
                      <CostRow icon={<Package className="text-blue-500" />} label="Product Cost (FOB)" value={landedCost.productCost} />
                      <CostRow icon={<Ship className="text-cyan-500" />} label="Freight Cost" value={landedCost.freightCost} />
                      <CostRow icon={<Shield className="text-green-500" />} label="Insurance" value={landedCost.insuranceCost} />
                      <Separator />
                      <CostRow icon={<Landmark className="text-amber-500" />} label="Customs Duties" value={landedCost.customsDuties} />
                      <CostRow icon={<Receipt className="text-red-500" />} label="VAT/Taxes" value={landedCost.vatTaxes} />
                      <CostRow icon={<Container className="text-purple-500" />} label="Handling Fees" value={landedCost.handlingFees} />
                      <CostRow icon={<FileText className="text-indigo-500" />} label="Brokerage Fees" value={landedCost.brokerageFees} />
                      <CostRow icon={<Truck className="text-orange-500" />} label="Inland Transport" value={landedCost.inlandTransport} />
                      <Separator className="border-2" />
                      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl">
                        <span className="font-bold text-lg">Total Landed Cost</span>
                        <span className="text-2xl font-bold text-primary">{landedCost.totalLandedCost}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <span className="font-medium">Cost Per Unit</span>
                        <span className="text-xl font-bold text-green-600">{landedCost.costPerUnit}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {profitAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Profit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900 text-center">
                      <div className="text-sm text-muted-foreground">Recommended Retail Price</div>
                      <div className="text-2xl font-bold text-green-600">{profitAnalysis.recommendedRetailPrice}</div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-center">
                      <div className="text-sm text-muted-foreground">Est. Profit/Unit</div>
                      <div className="text-2xl font-bold text-blue-600">{profitAnalysis.estimatedProfit}</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 text-center">
                      <div className="text-sm text-muted-foreground">Break-Even Qty</div>
                      <div className="text-2xl font-bold text-purple-600">{profitAnalysis.breakEvenQuantity}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="customs" className="space-y-4">
            {customsData?.customsFees && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-primary" />
                    Customs Duties & Fees
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Import from {customsData.originCountry || savedFormData?.originCountry} to {customsData.destinationCountry || savedFormData?.destinationCountry}
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fee Type</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Import Duty</TableCell>
                        <TableCell className="text-right">{customsData.customsFees.importDutyRate}</TableCell>
                        <TableCell className="text-right font-medium">{customsData.customsFees.importDutyAmount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">VAT/GST</TableCell>
                        <TableCell className="text-right">{customsData.customsFees.vatRate}</TableCell>
                        <TableCell className="text-right font-medium">{customsData.customsFees.vatAmount}</TableCell>
                      </TableRow>
                      {customsData.customsFees.additionalDuties?.map((duty: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{duty.name}</TableCell>
                          <TableCell className="text-right">{duty.rate}</TableCell>
                          <TableCell className="text-right font-medium">{duty.amount}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-primary/5 font-bold">
                        <TableCell colSpan={2}>Total Customs Fees</TableCell>
                        <TableCell className="text-right text-primary text-lg">{customsData.customsFees.totalCustomsFees}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {customsData.tradeAgreements && (
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-500" />
                        Applicable Trade Agreements
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {customsData.tradeAgreements.map((agreement: string, i: number) => (
                          <Badge key={i} variant="secondary">{agreement}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {customsData.requiredDocuments && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Required Documents
                      </div>
                      <ul className="space-y-1">
                        {customsData.requiredDocuments.map((doc: string, i: number) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            {reportData?.riskAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Risk Assessment
                  </CardTitle>
                  <Badge variant={reportData.riskAssessment.overallRisk === 'Low' ? 'outline' : 'destructive'}>
                    Overall Risk: {reportData.riskAssessment.overallRisk}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportData.riskAssessment.risks?.map((risk: any, i: number) => (
                      <div key={i} className="p-4 border rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{risk.category}</span>
                          <Badge variant={risk.level === 'Low' ? 'outline' : risk.level === 'Medium' ? 'secondary' : 'destructive'}>
                            {risk.level}
                          </Badge>
                        </div>
                        <Progress value={risk.level === 'Low' ? 25 : risk.level === 'Medium' ? 50 : 75} className="h-2 mb-2" />
                        <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {reportData?.marketOverview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Market Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{reportData.marketOverview}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
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
                <Label htmlFor="category">Product Category <span className="text-destructive">*</span></Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue placeholder="Select product category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Consumer Electronics</SelectItem>
                    <SelectItem value="Textiles">Textiles & Apparel</SelectItem>
                    <SelectItem value="Machinery">Industrial Machinery</SelectItem>
                    <SelectItem value="Furniture">Furniture & Decor</SelectItem>
                    <SelectItem value="Beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="Food">Food & Beverage</SelectItem>
                    <SelectItem value="Automotive">Automotive Parts</SelectItem>
                    <SelectItem value="Medical">Medical Equipment</SelectItem>
                    <SelectItem value="Metal">Metal Products</SelectItem>
                    <SelectItem value="Plastic">Plastic Products</SelectItem>
                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                    <SelectItem value="Other">Other / Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Any">Any Country (Global Sourcing)</SelectItem>
                    <Separator className="my-1" />
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
                <p className="text-xs text-muted-foreground">Select 'Any' to find the best suppliers globally</p>
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
                  Balance: {totalCredits} Credits
                </Badge>
              )}
            </div>
            <Button 
              size="lg" 
              className="px-8" 
              onClick={handleSubmit} 
              disabled={(!formData.productName && !formData.category) || createReport.isPending}
              data-testid="button-generate-report"
            >
              {createReport.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
