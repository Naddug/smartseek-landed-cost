import { useReports, useReport, useLeadHistory, useLeadReport, useCustomsCalculations, useShippingEstimates } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  FileText, Download, Loader2, CheckCircle, Clock, AlertCircle, ArrowLeft, Sparkles, 
  Building2, MapPin, Star, Shield, Calendar, TrendingUp, Users, DollarSign, Package, 
  Truck, AlertTriangle, Target, Globe, Ship, Plane, FileCheck, Calculator, 
  BarChart3, PieChart as PieChartIcon, Percent, CreditCard, ArrowRight, ExternalLink,
  Hash, Scale, Receipt, Landmark, Container, ClipboardCheck, UserSearch
} from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, Legend } from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const { data: reports = [], isLoading, error, refetch: refetchReports } = useReports();
  const { data: leadHistory = [], isLoading: leadsLoading } = useLeadHistory();
  const { data: customsCalcs = [], isLoading: customsLoading } = useCustomsCalculations();
  const { data: shippingEsts = [], isLoading: shippingLoading } = useShippingEstimates();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedLeadReportId, setSelectedLeadReportId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("sourcing");

  const totalCalculations = customsCalcs.length + shippingEsts.length;

  if (isLoading || leadsLoading || customsLoading || shippingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    const isAuthError = error?.message?.includes("401") || error?.message?.toLowerCase().includes("not authenticated");
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to load reports</h2>
          <p className="text-muted-foreground mb-4">
            {isAuthError ? "Your session may have expired." : "Please try refreshing the page."}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" onClick={() => refetchReports()}>Retry</Button>
            {isAuthError && (
              <Link href="/login">
                <Button>Log in again</Button>
              </Link>
            )}
            {!isAuthError && (
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedReportId) {
    return <ProfessionalReportView reportId={selectedReportId} onBack={() => setSelectedReportId(null)} />;
  }

  if (selectedLeadReportId) {
    return <LeadReportView reportId={selectedLeadReportId} onBack={() => setSelectedLeadReportId(null)} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Reports</h1>
          <p className="text-muted-foreground">Professional AI-generated sourcing and lead intelligence.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/find-leads">
            <Button variant="outline" data-testid="button-new-lead-report">
              <UserSearch className="w-4 h-4 mr-2" />
              Find Leads
            </Button>
          </Link>
          <Link href="/smart-finder">
            <Button data-testid="button-new-report">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="sourcing" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Sourcing ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <UserSearch className="w-4 h-4" />
            Leads ({leadHistory.length})
          </TabsTrigger>
          <TabsTrigger value="calculations" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculations ({totalCalculations})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sourcing" className="mt-6">
          {reports.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No sourcing reports yet</h3>
                <p className="text-muted-foreground mb-4">Use SmartSeek AI to generate your first AI sourcing report.</p>
                <Link href="/smart-finder">
                  <Button>Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setSelectedReportId(report.id)} data-testid={`card-report-${report.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <StatusBadge status={report.status} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(report.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Badge variant="outline">{report.category}</Badge>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Full Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          {leadHistory.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <UserSearch className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No lead reports yet</h3>
                <p className="text-muted-foreground mb-4">Use Find Leads to discover qualified buyer contacts.</p>
                <Link href="/find-leads">
                  <Button>Find Leads</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadHistory.map((search: any) => {
                const criteria = search.searchCriteria || {};
                return (
                  <Card 
                    key={search.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group" 
                    onClick={() => setSelectedLeadReportId(search.id)}
                    data-testid={`card-lead-report-${search.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {search.resultsCount} Leads
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(search.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {criteria.industry || 'Lead Search'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {criteria.location || 'Global'}
                        </Badge>
                        {criteria.companySize && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {criteria.companySize}
                          </Badge>
                        )}
                      </div>
                      {criteria.keywords && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                          Keywords: {criteria.keywords}
                        </p>
                      )}
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Lead Report
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calculations" className="mt-6">
          {totalCalculations === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No saved calculations yet</h3>
                <p className="text-muted-foreground mb-4">Use our calculators to estimate customs duties and shipping costs.</p>
                <div className="flex gap-2 justify-center">
                  <Link href="/customs-calculator">
                    <Button variant="outline">Customs Calculator</Button>
                  </Link>
                  <Link href="/shipping-estimator">
                    <Button variant="outline">Shipping Estimator</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {customsCalcs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-primary" />
                    Customs Calculations ({customsCalcs.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customsCalcs.map((calc: any) => (
                      <Card key={calc.id} className="hover:shadow-lg transition-shadow" data-testid={`card-customs-${calc.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              <Landmark className="w-3 h-3 mr-1" />
                              Customs
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(calc.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <CardTitle className="text-base">{calc.productName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Globe className="w-4 h-4" />
                              {calc.originCountry} → {calc.destinationCountry}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Product Value:</span>
                              <span className="font-medium">${calc.productValue?.toLocaleString() || 0}</span>
                            </div>
                            {calc.result?.landedCost && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Landed Cost:</span>
                                <span className="font-bold text-green-600">${calc.result.landedCost.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {shippingEsts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Ship className="w-5 h-5 text-primary" />
                    Shipping Estimates ({shippingEsts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shippingEsts.map((est: any) => (
                      <Card key={est.id} className="hover:shadow-lg transition-shadow" data-testid={`card-shipping-${est.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">
                              <Ship className="w-3 h-3 mr-1" />
                              Shipping
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(est.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <CardTitle className="text-base">
                            {est.originCountry} → {est.destinationCountry}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-medium">{est.weight || '-'} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Method:</span>
                              <span className="font-medium capitalize">{est.shippingMethod || 'Sea'}</span>
                            </div>
                            {est.result?.seaFreight?.options?.[0]?.cost && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Lowest Rate:</span>
                                <span className="font-bold text-green-600">
                                  ${Math.min(
                                    est.result.seaFreight?.options?.[0]?.cost || Infinity,
                                    est.result.airFreight?.options?.[0]?.cost || Infinity,
                                    est.result.express?.options?.[0]?.cost || Infinity
                                  ).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed') {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Complete
      </Badge>
    );
  }
  if (status === 'generating') {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        <Clock className="w-3 h-3 mr-1" />
        Generating
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
      <AlertCircle className="w-3 h-3 mr-1" />
      Failed
    </Badge>
  );
}

function ProfessionalReportView({ reportId, onBack }: { reportId: number; onBack: () => void }) {
  const { data: report, isLoading, refetch } = useReport(reportId);
  const [activeSection, setActiveSection] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
      const formData = report.formData as any;
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
      
      // Header
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
      
      // Report Info
      addText(`Generated: ${format(new Date(report.createdAt), 'MMMM d, yyyy')}`, 10);
      addText(`Trade Route: ${formData?.originCountry || 'China'} → ${formData?.destinationCountry || 'United States'}`, 10);
      if (reportData?.productClassification?.hsCode) {
        addText(`HS Code: ${reportData.productClassification.hsCode}`, 10);
      }
      
      // Executive Summary
      if (reportData?.executiveSummary) {
        addSection('EXECUTIVE SUMMARY');
        addText(reportData.executiveSummary, 10);
      }
      
      // Product Classification
      if (reportData?.productClassification) {
        addSection('PRODUCT CLASSIFICATION');
        addText(`HS Code: ${reportData.productClassification.hsCode || 'N/A'}`, 10);
        addText(`Description: ${reportData.productClassification.hsCodeDescription || 'N/A'}`, 10);
        addText(`Chapter: ${reportData.productClassification.tariffChapter || 'N/A'}`, 10);
        addText(`Category: ${reportData.productClassification.productCategory || 'N/A'}`, 10);
      }
      
      // Customs Analysis
      if (reportData?.customsAnalysis?.customsFees) {
        addSection('CUSTOMS DUTIES & FEES');
        const fees = reportData.customsAnalysis.customsFees;
        addText(`Import Duty Rate: ${fees.importDutyRate || 'N/A'}`, 10);
        addText(`Import Duty Amount: ${fees.importDutyAmount || 'N/A'}`, 10);
        addText(`VAT Rate: ${fees.vatRate || 'N/A'}`, 10);
        addText(`VAT Amount: ${fees.vatAmount || 'N/A'}`, 10);
        addText(`Total Customs Fees: ${fees.totalCustomsFees || 'N/A'}`, 10, true);
      }
      
      // Landed Cost
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
      
      // Profit Analysis
      if (reportData?.profitAnalysis) {
        addSection('PROFIT ANALYSIS');
        const pa = reportData.profitAnalysis;
        addText(`Recommended Retail Price: ${pa.recommendedRetailPrice || 'N/A'}`, 10);
        addText(`Estimated Profit: ${pa.estimatedProfit || 'N/A'}`, 10);
        addText(`Profit Margin: ${pa.profitMargin || 'N/A'}`, 10, true);
        addText(`Break-even Quantity: ${pa.breakEvenQuantity || 'N/A'}`, 10);
      }
      
      // Supplier Comparison
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
      
      // Risk Assessment
      if (reportData?.riskAssessment) {
        addSection('RISK ASSESSMENT');
        addText(`Overall Risk Level: ${reportData.riskAssessment.overallRisk || 'N/A'}`, 10, true);
        if (reportData.riskAssessment.risks?.length > 0) {
          reportData.riskAssessment.risks.forEach((risk: any) => {
            addText(`• ${risk.category}: ${risk.level} - ${risk.mitigation}`, 9);
          });
        }
      }
      
      // Recommendations
      if (reportData?.recommendations?.length > 0) {
        addSection('RECOMMENDATIONS');
        reportData.recommendations.forEach((rec: string) => {
          addText(`• ${rec}`, 10);
        });
      }
      
      // Next Steps
      if (reportData?.nextSteps?.length > 0) {
        addSection('NEXT STEPS');
        reportData.nextSteps.forEach((step: string, index: number) => {
          addText(`${index + 1}. ${step}`, 10);
        });
      }
      
      // Footer
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
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Report not found.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const reportData = report.reportData as any;
  const formData = report.formData as any;

  if (report.status === 'generating') {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AI is Analyzing Your Request</h2>
          <p className="text-muted-foreground mb-2">Calculating customs duties, HS codes, and landed costs...</p>
          <p className="text-sm text-muted-foreground mb-6">This usually takes 20-40 seconds</p>
          <Button onClick={() => refetch()}>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Check Status
          </Button>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const customsData = reportData?.customsAnalysis;
  const landedCost = reportData?.landedCostBreakdown;
  const sellers = reportData?.sellerComparison || [];
  const profitAnalysis = reportData?.profitAnalysis;
  const productClass = reportData?.productClassification;

  // Generate chart data
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF} disabled={isExporting} data-testid="button-export-pdf">
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="bg-background">
      {/* Report Cover */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 rounded-2xl border">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={report.status} />
              <Badge variant="outline" className="text-xs">
                <Hash className="w-3 h-3 mr-1" />
                {productClass?.hsCode || 'HS Code Pending'}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{report.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Generated on {format(new Date(report.createdAt), 'MMMM d, yyyy')}
            </p>
            
            {/* Trade Route */}
            {customsData && (
              <div className="mt-4 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="font-medium">{customsData.originCountry || formData?.originCountry || 'China'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Ship className="w-5 h-5 text-blue-500" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{customsData.destinationCountry || formData?.destinationCountry || 'United States'}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-background rounded-xl border text-center">
              <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-lg font-bold">{landedCost?.costPerUnit || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Landed Cost/Unit</div>
            </div>
            <div className="p-4 bg-background rounded-xl border text-center">
              <Percent className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-lg font-bold">{profitAnalysis?.profitMargin || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Est. Margin</div>
            </div>
          </div>
        </div>
      </div>

      {reportData ? (
        <div className="space-y-8">
          {/* Executive Summary */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">{reportData.executiveSummary}</p>
            </CardContent>
          </Card>

          {/* Product Classification & HS Code */}
          {productClass && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  Product Classification (HS/GTIP Code)
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

          {/* Customs & Duties Breakdown */}
          {customsData?.customsFees && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-primary" />
                  Customs Duties & Fees Breakdown
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Import from {customsData.originCountry} to {customsData.destinationCountry}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Fees Table */}
                  <div>
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
                  </div>

                  {/* Trade Agreements & Documents */}
                  <div className="space-y-6">
                    {customsData.tradeAgreements && (
                      <div>
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
                      <div>
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          <ClipboardCheck className="w-4 h-4 text-blue-500" />
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Landed Cost Breakdown */}
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
                  {/* Cost Chart */}
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

                  {/* Cost Items */}
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

          {/* Seller Comparison */}
          {sellers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Seller Comparison & Profit Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">Compare suppliers with platform fees and profit margins</p>
              </CardHeader>
              <CardContent>
                {/* Comparison Chart */}
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

                {/* Seller Cards */}
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
                                <span className="text-xs text-muted-foreground">({seller.yearsInBusiness}y)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {seller.certifications?.map((cert: string, j: number) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="lg:w-64 space-y-3 p-4 bg-muted/50 rounded-xl">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Platform Fees</span>
                            <span className="font-medium">{seller.platformFees}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Cost</span>
                            <span className="font-medium">{seller.totalCostWithFees}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Est. Profit/Unit</span>
                            <span className="font-bold text-green-600">{seller.estimatedProfit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Profit Margin</span>
                            <span className="font-bold text-green-600">{seller.profitMargin}</span>
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Fees Analysis */}
          {profitAnalysis?.platformFees && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Platform Selling Fees Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>Fee Structure</TableHead>
                      <TableHead className="text-right">Estimated Fees</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitAnalysis.platformFees.map((platform: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{platform.platform}</TableCell>
                        <TableCell className="text-muted-foreground">{platform.feeStructure}</TableCell>
                        <TableCell className="text-right font-medium">{platform.estimatedFees}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Risk Assessment */}
          {reportData.riskAssessment && (
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

          {/* Timeline */}
          {reportData.timeline && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                  <div className="space-y-6">
                    {[
                      { phase: 'Sampling', duration: reportData.timeline.sampling, icon: Package, color: 'bg-blue-500' },
                      { phase: 'Tooling', duration: reportData.timeline.tooling, icon: Building2, color: 'bg-purple-500' },
                      { phase: 'Production', duration: reportData.timeline.production, icon: Users, color: 'bg-amber-500' },
                      { phase: 'Shipping', duration: reportData.timeline.shipping, icon: Ship, color: 'bg-cyan-500' },
                      { phase: 'Customs Clearance', duration: reportData.timeline.customsClearance, icon: Landmark, color: 'bg-orange-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center z-10`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="font-medium">{item.phase}</div>
                          <div className="text-sm text-muted-foreground">{item.duration}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-4 relative">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center z-10">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="font-medium">Total Duration</div>
                        <div className="text-lg font-bold text-green-600">{reportData.timeline.total}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {reportData.recommendations && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-xl border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {reportData.nextSteps && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.nextSteps.map((step: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="text-muted-foreground">Report data could not be generated. Please try again.</p>
          </CardContent>
        </Card>
      )}
      </div>
      {/* Footer / Bottom Actions */}
      <div className="mt-8 pt-8 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={exportToPDF} disabled={isExporting} data-testid="button-export-pdf-bottom">
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isExporting ? 'Generating PDF...' : 'Export PDF'}
        </Button>
      </div>
    </div>
  );
}

function CostRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function LeadReportView({ reportId, onBack }: { reportId: number; onBack: () => void }) {
  const { data, isLoading, error } = useLeadReport(reportId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to load lead report</h2>
          <p className="text-muted-foreground mb-4">Please try again.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const { searchQuery, leads } = data;
  const criteria = searchQuery?.searchCriteria || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-lead-report">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold">{criteria.industry || 'Lead Report'}</h1>
          <p className="text-muted-foreground">
            Generated on {format(new Date(searchQuery.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {criteria.industry || 'All Industries'}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {criteria.location || 'Global'}
            </Badge>
            {criteria.companySize && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {criteria.companySize}
              </Badge>
            )}
            {criteria.keywords && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {criteria.keywords}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-primary" />
              Qualified Leads ({leads.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No leads found for this search.</p>
          ) : (
            <div className="space-y-4">
              {leads.map((lead: any) => (
                <Card key={lead.id} className="border shadow-sm" data-testid={`lead-card-${lead.id}`}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{lead.companyName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {lead.industry}
                          <span className="mx-1">•</span>
                          <MapPin className="w-3 h-3" />
                          {lead.location}
                        </p>
                      </div>
                      {lead.website && (
                        <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Website
                          </Button>
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        {lead.employeeRange && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{lead.employeeRange} employees</span>
                          </div>
                        )}
                        {lead.revenueRange && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>{lead.revenueRange} revenue</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {lead.contactName && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{lead.contactName}{lead.contactTitle ? ` - ${lead.contactTitle}` : ''}</span>
                          </div>
                        )}
                        {lead.contactEmail && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-primary">{lead.contactEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {lead.aiSummary && (
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-sm">{lead.aiSummary}</p>
                      </div>
                    )}

                    {lead.sourcingFocus && lead.sourcingFocus.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.sourcingFocus.map((focus: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {lead.intentSignals && Object.keys(lead.intentSignals).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Intent Signals</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(lead.intentSignals).map(([key, value]: [string, any]) => (
                            <Badge key={key} className="bg-emerald-100 text-emerald-700 text-xs">
                              {key}: {String(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    </div>
  );
}
