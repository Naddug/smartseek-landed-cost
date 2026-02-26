import { useState, useEffect, useRef, useCallback } from "react";
import { useProfile, useCreateReport, useReport } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Sparkles, Loader2, FileText, CheckCircle,
  Package, Globe, Ship, Plane, Truck, Shield, Hash, 
  Building2, Download,
  AlertTriangle, Star, MapPin, Users, DollarSign, Calculator,
  Landmark, Receipt, Container, Percent, Send, CreditCard, Zap,
  Camera, X, ChevronDown, ChevronUp
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COUNTRIES = [
  "Any", "China", "United States", "Germany", "United Kingdom", "France", "Japan",
  "South Korea", "India", "Vietnam", "Thailand", "Indonesia", "Mexico", "Turkey",
  "Canada", "Australia", "Italy", "Spain", "Brazil", "Poland", "Malaysia", "Singapore",
  "Taiwan", "United Arab Emirates", "Bangladesh", "Pakistan", "Egypt", "Philippines",
];
import { toast } from "sonner";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useLocation } from "wouter";

const EXAMPLE_PROMPTS = [
  "Find suppliers for wireless headphones",
  "Source industrial valves from China",
  "Analyze landed cost for textiles from India",
  "Compare suppliers for medical equipment",
  "Tin ore suppliers from Indonesia",
  "Antimony ore and concentrates",
  "Lithium and rare earth minerals",
  "Steel and aluminum from Vietnam"
];

function CostRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number }) {
  if (value === undefined || value === null) return null;
  const displayValue = typeof value === 'number' ? `$${value.toLocaleString()}` : value;
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-medium">{displayValue}</span>
    </div>
  );
}

function parseNumericValue(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
}

export default function SmartFinder() {
  const [view, setView] = useState<'empty' | 'loading' | 'results'>('empty');
  const [reportId, setReportId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [originCountry, setOriginCountry] = useState("Any");
  const [destinationCountry, setDestinationCountry] = useState("United States");
  const [quantity, setQuantity] = useState("1000");
  const [budget, setBudget] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [, navigate] = useLocation();
  const { data: profile } = useProfile();
  const createReport = useCreateReport();
  const { data: report, refetch } = useReport(reportId || 0);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  const isAdmin = profile?.role === 'admin';
  const canGenerateReport = isAdmin || totalCredits >= 1 || (profile && !profile.hasUsedFreeTrial);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Poll for report status when loading
  useEffect(() => {
    if (view !== 'loading' || !reportId) return;

    const pollReport = async () => {
      try {
        const { data: latestReport } = await refetch();
        if (latestReport?.status === 'completed') {
          setView('results');
        } else if (latestReport?.status === 'failed') {
          toast.error("Report generation failed. Please try again.");
          setView('empty');
        }
      } catch (error) {
        console.error("Error polling report:", error);
      }
    };

    // Initial poll
    pollReport();

    // Set up interval polling
    const intervalId = setInterval(pollReport, 2000);

    return () => clearInterval(intervalId);
  }, [view, reportId, refetch]);

  const handleSubmit = async (inputQuery?: string) => {
    let searchQuery = inputQuery || query;
    
    if (!profile || !canGenerateReport) {
      setShowCreditsPopup(true);
      return;
    }

    if (selectedImage && imagePreview) {
      setIsAnalyzingImage(true);
      setView('loading');
      try {
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ imageData: imagePreview })
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }
        
        const result = await response.json();
        searchQuery = result.productName || result.description || 'Unknown product';
        toast.success(`Identified: ${searchQuery}`);
        removeImage();
      } catch (error) {
        console.error('Image analysis error:', error);
        toast.error('Failed to analyze image. Please try again or enter product name manually.');
        setView('empty');
        setIsAnalyzingImage(false);
        return;
      }
      setIsAnalyzingImage(false);
    }

    if (!searchQuery.trim()) {
      toast.error("Please enter a product or sourcing query.");
      return;
    }

    setView('loading');
    
    const formData = {
      productName: searchQuery,
      productDescription: searchQuery,
      category: searchQuery,
      targetRegion: originCountry === "Any" ? "Global" : originCountry,
      budget: budget || "competitive",
      quantity: quantity,
      originCountry,
      destinationCountry,
      additionalRequirements: additionalRequirements.trim()
    };
    
    createReport.mutate({
      title: `Sourcing Report: ${searchQuery}`,
      category: searchQuery,
      formData,
    }, {
      onSuccess: (data) => {
        setReportId(data.id);
        setQuery("");
      },
      onError: () => {
        setView('empty');
      }
    });
  };

  const handleExampleClick = (prompt: string) => {
    setQuery(prompt);
    handleSubmit(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewSearch = () => {
    setView('empty');
    setReportId(null);
    setQuery("");
    setOriginCountry("Any");
    setDestinationCountry("United States");
    setQuantity("1000");
    setBudget("");
    setAdditionalRequirements("");
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
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;
      let currentPage = 1;
      
      const primaryColor = { r: 59, g: 130, b: 246 };
      const secondaryColor = { r: 16, g: 185, b: 129 };
      const accentColor = { r: 245, g: 158, b: 11 };
      const dangerColor = { r: 239, g: 68, b: 68 };
      const grayColor = { r: 107, g: 114, b: 128 };
      const lightGray = { r: 243, g: 244, b: 246 };
      
      const checkPageBreak = (requiredSpace: number = 30) => {
        if (y > pageHeight - requiredSpace - 20) {
          pdf.addPage();
          currentPage++;
          y = 20;
          return true;
        }
        return false;
      };
      
      const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color?: {r: number, g: number, b: number}, maxWidth?: number) => {
        if (!text) return;
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        if (color) {
          pdf.setTextColor(color.r, color.g, color.b);
        } else {
          pdf.setTextColor(0, 0, 0);
        }
        const lines = pdf.splitTextToSize(text, maxWidth || contentWidth);
        lines.forEach((line: string) => {
          checkPageBreak();
          pdf.text(line, margin, y);
          y += fontSize * 0.4 + 1;
        });
        y += 2;
      };
      
      const addSectionHeader = (icon: string, title: string, bgColor?: {r: number, g: number, b: number}) => {
        checkPageBreak(40);
        y += 6;
        
        if (bgColor) {
          pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
          pdf.roundedRect(margin, y - 5, contentWidth, 10, 2, 2, 'F');
          pdf.setTextColor(255, 255, 255);
        } else {
          pdf.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
          pdf.setLineWidth(0.5);
          pdf.line(margin, y, margin + contentWidth, y);
          pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        }
        
        y += 3;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${icon} ${title}`, margin + 3, y);
        y += 8;
        pdf.setTextColor(0, 0, 0);
      };
      
      const addKeyMetricBox = (label: string, value: string, x: number, width: number, color: {r: number, g: number, b: number}) => {
        pdf.setFillColor(color.r, color.g, color.b);
        pdf.roundedRect(x, y, width, 18, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(label, x + width/2, y + 5, { align: 'center' });
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value || 'N/A', x + width/2, y + 13, { align: 'center' });
      };
      
      const addInfoRow = (label: string, value: string, indent: number = 0) => {
        if (!value) return;
        checkPageBreak();
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
        pdf.text(label + ':', margin + indent, y);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        const labelWidth = pdf.getTextWidth(label + ': ');
        pdf.text(value, margin + indent + labelWidth, y);
        y += 5;
      };
      
      const addBulletPoint = (text: string, bulletColor?: {r: number, g: number, b: number}) => {
        if (!text) return;
        checkPageBreak();
        pdf.setFontSize(9);
        if (bulletColor) {
          pdf.setFillColor(bulletColor.r, bulletColor.g, bulletColor.b);
          pdf.circle(margin + 2, y - 1.5, 1.5, 'F');
        } else {
          pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
          pdf.text('•', margin, y);
        }
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const lines = pdf.splitTextToSize(text, contentWidth - 8);
        lines.forEach((line: string, idx: number) => {
          pdf.text(line, margin + 6, y);
          y += 4;
        });
        y += 1;
      };
      
      pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, 8, 35, 12, 2, 2, 'F');
      pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SmartSeek', margin + 17.5, 16, { align: 'center' });
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SOURCING INTELLIGENCE REPORT', margin + 40, 16);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(report.title, margin, 32);
      pdf.setFontSize(9);
      pdf.text(`Generated: ${format(new Date(report.createdAt), 'MMMM d, yyyy')} | Trade Route: ${savedFormData?.originCountry || 'China'} → ${savedFormData?.destinationCountry || 'United States'}`, margin, 40);
      
      y = 55;
      
      const productClass = reportData?.productClassification;
      const landedCost = reportData?.landedCostBreakdown;
      const profitAnalysis = reportData?.profitAnalysis;
      const sellers = reportData?.sellerComparison || [];
      
      pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
      pdf.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');
      
      y += 5;
      pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('KEY METRICS AT A GLANCE', margin + 5, y);
      y += 5;
      
      const boxWidth = (contentWidth - 20) / 4;
      addKeyMetricBox('HS CODE', productClass?.hsCode || 'N/A', margin + 2, boxWidth, primaryColor);
      addKeyMetricBox('LANDED COST/UNIT', landedCost?.costPerUnit || 'N/A', margin + 4 + boxWidth, boxWidth, secondaryColor);
      addKeyMetricBox('PROFIT MARGIN', profitAnalysis?.profitMargin || 'N/A', margin + 6 + boxWidth * 2, boxWidth, accentColor);
      addKeyMetricBox('SUPPLIERS FOUND', String(sellers.length), margin + 8 + boxWidth * 3, boxWidth, { r: 139, g: 92, b: 246 });
      
      y += 26;
      
      pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
      pdf.roundedRect(margin, y, contentWidth, 45, 3, 3, 'F');
      y += 5;
      pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TABLE OF CONTENTS', margin + 5, y);
      y += 6;
      
      const tocItems = [
        '1. Executive Summary',
        '2. Product Classification',
        '3. Market Overview',
        '4. Customs Analysis & Trade Agreements',
        '5. Landed Cost Breakdown',
        '6. Supplier Comparison Table',
        '7. Supplier Regions Analysis',
        '8. Profit Analysis',
        '9. Timeline & Lead Times',
        '10. Risk Assessment',
        '11. Recommendations & Next Steps'
      ];
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const tocColWidth = contentWidth / 2 - 5;
      tocItems.forEach((item, idx) => {
        const col = idx < 6 ? 0 : 1;
        const row = idx < 6 ? idx : idx - 6;
        pdf.text(item, margin + 5 + col * tocColWidth, y + row * 5);
      });
      y += 38;
      
      if (reportData?.executiveSummary) {
        addSectionHeader('📋', 'EXECUTIVE SUMMARY', primaryColor);
        pdf.setFillColor(240, 249, 255);
        const summaryLines = pdf.splitTextToSize(reportData.executiveSummary, contentWidth - 10);
        const summaryHeight = summaryLines.length * 5 + 10;
        pdf.roundedRect(margin, y - 3, contentWidth, summaryHeight, 2, 2, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        summaryLines.forEach((line: string) => {
          pdf.text(line, margin + 5, y + 3);
          y += 5;
        });
        y += 8;
      }
      
      if (productClass) {
        addSectionHeader('🏷️', 'PRODUCT CLASSIFICATION');
        
        pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
        pdf.roundedRect(margin, y, 50, 12, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text('HS CODE', margin + 25, y + 4, { align: 'center' });
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(productClass.hsCode || 'N/A', margin + 25, y + 10, { align: 'center' });
        
        const classX = margin + 55;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Description: ${productClass.hsCodeDescription || 'N/A'}`, classX, y + 3);
        pdf.text(`Tariff Chapter: ${productClass.tariffChapter || 'N/A'}`, classX, y + 8);
        pdf.text(`Category: ${productClass.productCategory || 'N/A'}`, classX, y + 13);
        y += 18;
        
        if (productClass.regulatoryRequirements?.length > 0) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Regulatory Requirements:', margin, y);
          y += 5;
          productClass.regulatoryRequirements.forEach((req: string) => {
            addBulletPoint(req, secondaryColor);
          });
        }
        y += 3;
      }
      
      const marketOverview = reportData?.marketOverview;
      if (marketOverview && typeof marketOverview === 'object') {
        addSectionHeader('🌍', 'MARKET OVERVIEW');
        
        pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
        pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
        
        const moColWidth = contentWidth / 2 - 5;
        pdf.setFontSize(9);
        addInfoRow('Market Size', marketOverview.marketSize, 3);
        const tempY = y - 5;
        pdf.text('Growth Rate:', margin + moColWidth + 3, tempY);
        pdf.setFont('helvetica', 'bold');
        pdf.text(marketOverview.growthRate || 'N/A', margin + moColWidth + 35, tempY);
        y += 10;
        
        if (marketOverview.keyTrends?.length > 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.text('Key Market Trends:', margin, y);
          y += 5;
          marketOverview.keyTrends.forEach((trend: string) => {
            addBulletPoint(trend, accentColor);
          });
        }
        
        if (marketOverview.majorExporters?.length > 0 || marketOverview.majorImporters?.length > 0) {
          y += 3;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          if (marketOverview.majorExporters?.length > 0) {
            pdf.text('Major Exporters: ', margin, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(marketOverview.majorExporters.join(', '), margin + 32, y);
            y += 5;
          }
          if (marketOverview.majorImporters?.length > 0) {
            pdf.setFont('helvetica', 'bold');
            pdf.text('Major Importers: ', margin, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(marketOverview.majorImporters.join(', '), margin + 32, y);
            y += 5;
          }
        }
        y += 3;
      }
      
      const customsAnalysis = reportData?.customsAnalysis;
      if (customsAnalysis) {
        addSectionHeader('🏛️', 'CUSTOMS ANALYSIS & FEES');
        
        if (customsAnalysis.tradeAgreements?.length > 0) {
          pdf.setFillColor(220, 252, 231);
          pdf.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(22, 101, 52);
          pdf.text('Applicable Trade Agreements:', margin + 3, y + 5);
          pdf.setFont('helvetica', 'normal');
          pdf.text(customsAnalysis.tradeAgreements.join(' | '), margin + 50, y + 5);
          y += 15;
          pdf.setTextColor(0, 0, 0);
        }
        
        if (customsAnalysis.customsFees) {
          const fees = customsAnalysis.customsFees;
          
          pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
          pdf.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Fee Type', margin + 3, y + 5);
          pdf.text('Rate', margin + 70, y + 5);
          pdf.text('Amount', margin + 110, y + 5);
          y += 9;
          
          const feeRows = [
            ['Import Duty', fees.importDutyRate, fees.importDutyAmount],
            ['VAT/GST', fees.vatRate, fees.vatAmount],
          ];
          
          if (fees.additionalDuties?.length > 0) {
            fees.additionalDuties.forEach((duty: any) => {
              feeRows.push([duty.name, duty.rate, duty.amount]);
            });
          }
          
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          feeRows.forEach((row, idx) => {
            if (idx % 2 === 1) {
              pdf.setFillColor(250, 250, 250);
              pdf.rect(margin, y - 3, contentWidth, 6, 'F');
            }
            pdf.text(row[0] || '', margin + 3, y);
            pdf.text(row[1] || 'N/A', margin + 70, y);
            pdf.text(row[2] || 'N/A', margin + 110, y);
            y += 6;
          });
          
          pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
          pdf.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.text('TOTAL CUSTOMS FEES', margin + 3, y + 5);
          pdf.text(fees.totalCustomsFees || 'N/A', margin + 110, y + 5);
          y += 12;
          pdf.setTextColor(0, 0, 0);
        }
        
        if (customsAnalysis.requiredDocuments?.length > 0) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Required Documents:', margin, y);
          y += 5;
          customsAnalysis.requiredDocuments.forEach((doc: string) => {
            addBulletPoint(doc, primaryColor);
          });
        }
        
        if (customsAnalysis.complianceNotes?.length > 0) {
          y += 3;
          pdf.setFillColor(254, 243, 199);
          pdf.roundedRect(margin, y, contentWidth, 5 + customsAnalysis.complianceNotes.length * 5, 2, 2, 'F');
          y += 4;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(146, 64, 14);
          pdf.text('⚠ Compliance Notes:', margin + 3, y);
          y += 5;
          pdf.setFont('helvetica', 'normal');
          customsAnalysis.complianceNotes.forEach((note: string) => {
            pdf.text('• ' + note, margin + 5, y);
            y += 5;
          });
          pdf.setTextColor(0, 0, 0);
        }
        y += 5;
      }
      
      if (landedCost) {
        addSectionHeader('💰', 'LANDED COST BREAKDOWN');
        
        const costItems = [
          { label: 'Product Cost (FOB)', value: landedCost.productCost, color: primaryColor },
          { label: 'Freight Cost', value: landedCost.freightCost, color: { r: 6, g: 182, b: 212 } },
          { label: 'Insurance', value: landedCost.insuranceCost, color: secondaryColor },
          { label: 'Customs Duties', value: landedCost.customsDuties, color: accentColor },
          { label: 'VAT/Taxes', value: landedCost.vatTaxes, color: dangerColor },
          { label: 'Handling Fees', value: landedCost.handlingFees, color: { r: 139, g: 92, b: 246 } },
          { label: 'Brokerage Fees', value: landedCost.brokerageFees, color: { r: 99, g: 102, b: 241 } },
          { label: 'Port Charges', value: landedCost.portCharges, color: { r: 236, g: 72, b: 153 } },
          { label: 'Inland Transport', value: landedCost.inlandTransport, color: { r: 249, g: 115, b: 22 } },
        ].filter(item => item.value);
        
        costItems.forEach((item, idx) => {
          if (idx % 2 === 0) {
            pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
            pdf.rect(margin, y - 2, contentWidth, 6, 'F');
          }
          pdf.setFillColor(item.color.r, item.color.g, item.color.b);
          pdf.circle(margin + 3, y, 2, 'F');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(item.label, margin + 8, y + 1);
          pdf.setFont('helvetica', 'bold');
          pdf.text(item.value, margin + contentWidth - 40, y + 1);
          y += 6;
        });
        
        y += 2;
        pdf.setFillColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
        pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TOTAL LANDED COST', margin + 5, y + 7);
        pdf.text(landedCost.totalLandedCost || 'N/A', margin + contentWidth - 40, y + 7);
        y += 13;
        
        pdf.setFillColor(16, 185, 129);
        pdf.roundedRect(margin, y, contentWidth / 2 - 2, 10, 2, 2, 'F');
        pdf.text('Cost Per Unit: ' + (landedCost.costPerUnit || 'N/A'), margin + 5, y + 7);
        y += 15;
        pdf.setTextColor(0, 0, 0);
      }
      
      if (sellers.length > 0) {
        addSectionHeader('👥', 'SUPPLIER COMPARISON', primaryColor);
        
        const colWidths = [35, 22, 30, 20, 18, 15, 20, 30];
        const headers = ['Supplier', 'Platform', 'Location', 'Price', 'MOQ', 'Rating', 'Lead Time', 'Certifications'];
        
        pdf.setFillColor(59, 130, 246);
        pdf.rect(margin, y, contentWidth, 7, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        let xPos = margin + 1;
        headers.forEach((header, idx) => {
          pdf.text(header, xPos, y + 5);
          xPos += colWidths[idx];
        });
        y += 9;
        
        sellers.forEach((seller: any, index: number) => {
          checkPageBreak(25);
          
          if (index === 0) {
            pdf.setFillColor(220, 252, 231);
          } else if (index % 2 === 1) {
            pdf.setFillColor(250, 250, 250);
          } else {
            pdf.setFillColor(255, 255, 255);
          }
          pdf.rect(margin, y - 3, contentWidth, 8, 'F');
          
          if (index === 0) {
            pdf.setFillColor(22, 163, 74);
            pdf.circle(margin + 2, y, 2, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(5);
            pdf.text('★', margin + 0.8, y + 1);
          }
          
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          
          xPos = margin + 1;
          const rowData = [
            (seller.sellerName || 'N/A').substring(0, 18),
            seller.platform || 'N/A',
            (seller.location || 'N/A').substring(0, 15),
            seller.unitPrice || 'N/A',
            seller.moq || 'N/A',
            seller.rating ? String(seller.rating) : 'N/A',
            seller.leadTime || 'N/A',
            (seller.certifications?.slice(0, 2).join(', ') || 'N/A').substring(0, 18)
          ];
          
          rowData.forEach((data, idx) => {
            if (idx === 0) pdf.setFont('helvetica', 'bold');
            else pdf.setFont('helvetica', 'normal');
            pdf.text(data, xPos, y + 1);
            xPos += colWidths[idx];
          });
          y += 8;
          
          if (seller.recommendation && index === 0) {
            pdf.setFillColor(240, 253, 244);
            pdf.roundedRect(margin + 2, y - 1, contentWidth - 4, 6, 1, 1, 'F');
            pdf.setFontSize(6);
            pdf.setTextColor(22, 101, 52);
            pdf.setFont('helvetica', 'italic');
            pdf.text('★ TOP PICK: ' + (seller.recommendation || '').substring(0, 100), margin + 4, y + 3);
            y += 8;
            pdf.setTextColor(0, 0, 0);
          }
        });
        y += 5;
      }
      
      const supplierAnalysis = reportData?.supplierAnalysis;
      if (supplierAnalysis?.topRegions?.length > 0) {
        addSectionHeader('🗺️', 'SUPPLIER REGIONS ANALYSIS');
        
        supplierAnalysis.topRegions.forEach((region: any) => {
          checkPageBreak(25);
          pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
          pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(region.region || 'N/A', margin + 3, y + 6);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
          pdf.text('Price Range: ' + (region.avgPriceRange || 'N/A'), margin + 100, y + 6);
          pdf.setTextColor(0, 0, 0);
          
          pdf.setFontSize(7);
          if (region.advantages?.length > 0) {
            pdf.setTextColor(22, 163, 74);
            pdf.text('✓ ' + region.advantages.slice(0, 3).join(' | '), margin + 3, y + 12);
          }
          if (region.considerations?.length > 0) {
            pdf.setTextColor(202, 138, 4);
            pdf.text('⚠ ' + region.considerations.slice(0, 2).join(' | '), margin + 3, y + 17);
          }
          pdf.setTextColor(0, 0, 0);
          y += 24;
        });
      }
      
      if (profitAnalysis) {
        addSectionHeader('📊', 'PROFIT ANALYSIS');
        
        const profitBoxWidth = (contentWidth - 10) / 3;
        
        pdf.setFillColor(220, 252, 231);
        pdf.roundedRect(margin, y, profitBoxWidth, 20, 2, 2, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
        pdf.text('Retail Price', margin + profitBoxWidth/2, y + 5, { align: 'center' });
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(22, 163, 74);
        pdf.text(profitAnalysis.recommendedRetailPrice || 'N/A', margin + profitBoxWidth/2, y + 14, { align: 'center' });
        
        pdf.setFillColor(219, 234, 254);
        pdf.roundedRect(margin + profitBoxWidth + 5, y, profitBoxWidth, 20, 2, 2, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
        pdf.text('Est. Profit/Unit', margin + profitBoxWidth * 1.5 + 5, y + 5, { align: 'center' });
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(37, 99, 235);
        pdf.text(profitAnalysis.estimatedProfit || 'N/A', margin + profitBoxWidth * 1.5 + 5, y + 14, { align: 'center' });
        
        pdf.setFillColor(243, 232, 255);
        pdf.roundedRect(margin + (profitBoxWidth + 5) * 2, y, profitBoxWidth, 20, 2, 2, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
        pdf.text('Profit Margin', margin + profitBoxWidth * 2.5 + 10, y + 5, { align: 'center' });
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(147, 51, 234);
        pdf.text(profitAnalysis.profitMargin || 'N/A', margin + profitBoxWidth * 2.5 + 10, y + 14, { align: 'center' });
        
        y += 25;
        pdf.setTextColor(0, 0, 0);
        addInfoRow('Break-Even Quantity', profitAnalysis.breakEvenQuantity);
        
        if (profitAnalysis.platformFees?.length > 0) {
          y += 3;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Platform Fee Comparison:', margin, y);
          y += 5;
          profitAnalysis.platformFees.forEach((platform: any) => {
            const fee = platform.fee || platform.feeStructure || platform.estimatedFees || 'N/A';
            const net = platform.netProfit || 'N/A';
            addBulletPoint(`${platform.platform}: ${fee} (Net Profit: ${net})`, primaryColor);
          });
        }
        y += 5;
      }
      
      const timeline = reportData?.timeline;
      if (timeline) {
        addSectionHeader('📅', 'TIMELINE & LEAD TIMES');
        
        const timelineItems = [
          { label: 'Production Time', value: timeline.productionTime ?? timeline.production },
          { label: 'Shipping Transit', value: timeline.shippingTime ?? timeline.shipping },
          { label: 'Customs Clearance', value: timeline.customsClearance },
          { label: 'Total Lead Time', value: timeline.totalLeadTime ?? timeline.total, highlight: true },
        ].filter(item => item.value);
        
        timelineItems.forEach((item) => {
          if (item.highlight) {
            pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
            pdf.roundedRect(margin, y - 2, contentWidth, 8, 2, 2, 'F');
            pdf.setTextColor(255, 255, 255);
          }
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(item.label + ':', margin + 3, y + 2);
          pdf.setFont('helvetica', 'bold');
          pdf.text(item.value, margin + 60, y + 2);
          if (item.highlight) {
            pdf.setTextColor(0, 0, 0);
          }
          y += 8;
        });
        y += 5;
      }
      
      const riskAssessment = reportData?.riskAssessment;
      if (riskAssessment) {
        addSectionHeader('⚠️', 'RISK ASSESSMENT');
        
        if (riskAssessment.overallRisk) {
          const riskColor = riskAssessment.overallRisk === 'Low' ? secondaryColor : 
                           riskAssessment.overallRisk === 'Medium' ? accentColor : dangerColor;
          pdf.setFillColor(riskColor.r, riskColor.g, riskColor.b);
          pdf.roundedRect(margin, y, 50, 8, 2, 2, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Overall: ' + riskAssessment.overallRisk, margin + 25, y + 5, { align: 'center' });
          y += 12;
          pdf.setTextColor(0, 0, 0);
        }
        
        if (riskAssessment.risks?.length > 0) {
          riskAssessment.risks.forEach((risk: any) => {
            checkPageBreak(15);
            const riskColor = risk.level === 'Low' ? secondaryColor : 
                             risk.level === 'Medium' ? accentColor : dangerColor;
            pdf.setFillColor(riskColor.r, riskColor.g, riskColor.b);
            pdf.circle(margin + 2, y, 2, 'F');
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.text(risk.category + ' (' + risk.level + ')', margin + 6, y + 1);
            y += 5;
            if (risk.mitigation) {
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
              const mitigationLines = pdf.splitTextToSize('Mitigation: ' + risk.mitigation, contentWidth - 10);
              mitigationLines.forEach((line: string) => {
                pdf.text(line, margin + 6, y);
                y += 4;
              });
              pdf.setTextColor(0, 0, 0);
            }
            y += 3;
          });
        }
        y += 5;
      }
      
      if (reportData?.recommendations?.length > 0 || reportData?.nextSteps?.length > 0) {
        addSectionHeader('✅', 'RECOMMENDATIONS & NEXT STEPS');
        
        if (reportData.recommendations?.length > 0) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Key Recommendations:', margin, y);
          y += 5;
          reportData.recommendations.forEach((rec: string, idx: number) => {
            addBulletPoint(`${idx + 1}. ${rec}`, primaryColor);
          });
        }
        
        if (reportData.nextSteps?.length > 0) {
          y += 5;
          pdf.setFillColor(240, 253, 244);
          const stepsHeight = 8 + reportData.nextSteps.length * 5;
          pdf.roundedRect(margin, y, contentWidth, stepsHeight, 2, 2, 'F');
          y += 5;
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(22, 101, 52);
          pdf.text('Next Steps:', margin + 3, y);
          y += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          reportData.nextSteps.forEach((step: string, idx: number) => {
            pdf.text(`${idx + 1}. ${step}`, margin + 5, y);
            y += 5;
          });
          pdf.setTextColor(0, 0, 0);
        }
      }
      
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        pdf.setFillColor(lightGray.r, lightGray.g, lightGray.b);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
        pdf.setDrawColor(grayColor.r, grayColor.g, grayColor.b);
        pdf.setLineWidth(0.2);
        pdf.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
        
        pdf.setFontSize(7);
        pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
        pdf.setFont('helvetica', 'normal');
        pdf.text('SmartSeek - AI-Powered Sourcing Intelligence | Confidential Report', margin, pageHeight - 7);
        pdf.text(`Generated: ${format(new Date(), 'MMM d, yyyy')}`, pageWidth/2, pageHeight - 7, { align: 'center' });
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
      }
      
      const fileName = `SmartSeek_Report_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);
      toast.success("Professional PDF report downloaded successfully!");
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderResults = () => {
    if (!report) return null;
    
    const reportData = report.reportData as any;
    const savedFormData = report.formData as any;
    const customsData = reportData?.customsAnalysis;
    const landedCost = reportData?.landedCostBreakdown;
    const sellers = reportData?.sellerComparison || [];
    const profitAnalysis = reportData?.profitAnalysis;
    const productClass = reportData?.productClassification;

    const costBreakdownData = landedCost ? [
      { name: 'Product', value: parseNumericValue(landedCost.productCost), color: '#3b82f6' },
      { name: 'Freight', value: parseNumericValue(landedCost.freightCost), color: '#10b981' },
      { name: 'Duties', value: parseNumericValue(landedCost.customsDuties), color: '#f59e0b' },
      { name: 'VAT/Tax', value: parseNumericValue(landedCost.vatTaxes), color: '#ef4444' },
      { name: 'Fees', value: parseNumericValue(landedCost.handlingFees) + parseNumericValue(landedCost.brokerageFees), color: '#8b5cf6' },
    ].filter(d => d.value > 0) : [];

    const sellerComparisonData = sellers.map((s: any) => ({
      name: s.sellerName?.split(' ')[0] || 'Seller',
      price: parseNumericValue(s.unitPrice),
      margin: parseNumericValue(s.profitMargin),
      rating: s.rating || 4.0
    }));

    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-white overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Report Complete
              </Badge>
              <CardTitle className="text-xl">{report.title}</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Generated on {format(new Date(report.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
            <Button onClick={exportToPDF} disabled={isExporting} className="shrink-0" data-testid="button-download-pdf">
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <Hash className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-bold font-mono text-blue-900">{productClass?.hsCode || 'N/A'}</div>
              <div className="text-xs text-blue-600">HS Code</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-green-900">{landedCost?.costPerUnit || 'N/A'}</div>
              <div className="text-xs text-green-600">Landed Cost/Unit</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <Percent className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-purple-900">{profitAnalysis?.profitMargin || 'N/A'}</div>
              <div className="text-xs text-purple-600">Est. Margin</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <Users className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-amber-900">{sellers.length}</div>
              <div className="text-xs text-amber-600">Suppliers Found</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="flex w-full overflow-x-auto flex-nowrap gap-1 p-1 mb-4 h-auto [&::-webkit-scrollbar]:hidden">
              <TabsTrigger value="summary" data-testid="tab-summary" className="shrink-0">Summary</TabsTrigger>
              <TabsTrigger value="countries" data-testid="tab-countries" className="shrink-0">Countries</TabsTrigger>
              <TabsTrigger value="suppliers" data-testid="tab-suppliers" className="shrink-0">Suppliers</TabsTrigger>
              <TabsTrigger value="costs" data-testid="tab-costs" className="shrink-0">Costs</TabsTrigger>
              <TabsTrigger value="customs" data-testid="tab-customs" className="shrink-0">Customs</TabsTrigger>
              <TabsTrigger value="risks" data-testid="tab-risks" className="shrink-0">Risk</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Executive Summary
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{reportData?.executiveSummary || 'No summary available.'}</p>
              </div>

              {productClass && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Hash className="w-4 h-4 text-primary" />
                    Product Classification
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-xs text-slate-600">HS Code</div>
                      <div className="font-mono font-bold text-primary">{productClass.hsCode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Tariff Chapter</div>
                      <div className="font-medium text-sm text-slate-800">{productClass.tariffChapter}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Category</div>
                      <div className="font-medium text-sm text-slate-800">{productClass.productCategory}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">Description</div>
                      <div className="font-medium text-sm text-slate-800 truncate">{productClass.hsCodeDescription?.slice(0, 40)}...</div>
                    </div>
                  </div>
                </div>
              )}

              {reportData?.recommendations && reportData.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {reportData.recommendations.slice(0, 4).map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="countries" className="space-y-4">
              {reportData?.marketOverview && typeof reportData.marketOverview === 'object' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-semibold flex items-center gap-2 mb-3 text-slate-800">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Market Overview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                    <div>
                      <span className="text-xs font-medium text-slate-600">Market Size</span>
                      <p className="text-sm font-medium">{reportData.marketOverview.marketSize || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-600">Growth Rate</span>
                      <p className="text-sm font-medium">{reportData.marketOverview.growthRate || 'N/A'}</p>
                    </div>
                    {reportData.marketOverview.keyTrends?.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-xs font-medium text-slate-600">Key Trends</span>
                        <ul className="mt-1 space-y-1">
                          {reportData.marketOverview.keyTrends.map((t: string, i: number) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {reportData.marketOverview.majorExporters?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-slate-600">Major Exporters</span>
                        <p className="text-sm">{reportData.marketOverview.majorExporters.join(', ')}</p>
                      </div>
                    )}
                    {reportData.marketOverview.majorImporters?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-slate-600">Major Importers</span>
                        <p className="text-sm">{reportData.marketOverview.majorImporters.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {reportData?.supplierAnalysis?.topRegions?.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2 text-slate-800">
                    <MapPin className="w-4 h-4 text-primary" />
                    Country & Region Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reportData.supplierAnalysis.topRegions.map((region: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border border-gray-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-800">{region.region}</span>
                          <Badge variant="outline" className="text-xs text-slate-700">{region.avgPriceRange || 'N/A'}</Badge>
                        </div>
                        {region.advantages?.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-slate-600">Advantages</span>
                            <ul className="mt-1 space-y-0.5">
                              {region.advantages.map((a: string, j: number) => (
                                <li key={j} className="text-sm text-slate-700 flex items-start gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {region.considerations?.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-slate-600">Considerations</span>
                            <ul className="mt-1 space-y-0.5">
                              {region.considerations.map((c: string, j: number) => (
                                <li key={j} className="text-sm text-slate-700 flex items-start gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !reportData?.marketOverview || typeof reportData.marketOverview !== 'object' ? (
                  <div className="text-center py-6 text-slate-600">
                    No country or region analysis available for this report.
                  </div>
                ) : null
              )}
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              {sellerComparisonData.length > 0 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sellerComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="price" name="Unit Price ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="margin" name="Profit Margin (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-3">
                {sellers.map((seller: any, i: number) => (
                  <div key={i} className={`p-4 rounded-lg border ${i === 0 ? 'border-green-300 bg-green-50/50' : 'border-gray-200'}`}>
                    {i === 0 && (
                      <Badge className="bg-green-500 mb-2 text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Recommended
                      </Badge>
                    )}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="font-bold">{seller.sellerName}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <MapPin className="w-3 h-3" />
                              {seller.location}
                              <Badge variant="outline" className="text-xs">{seller.platform}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          <div>
                            <div className="text-xs text-slate-600">Unit Price</div>
                            <div className="font-bold text-primary">{seller.unitPrice}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600">MOQ</div>
                            <div className="font-medium text-sm">{seller.moq}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600">Lead Time</div>
                            <div className="font-medium text-sm">{seller.leadTime}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600">Rating</div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <span className="font-medium text-sm">{seller.rating}</span>
                            </div>
                          </div>
                        </div>

                        {seller.certifications && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {seller.certifications.slice(0, 3).map((cert: string, j: number) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                <Shield className="w-2 h-2 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="lg:w-48 space-y-2 p-3 bg-gray-100 rounded-lg text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Est. Profit</span>
                          <span className="font-bold text-green-600">{seller.estimatedProfit || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Margin</span>
                          <span className="font-bold text-green-600">{seller.profitMargin || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sellers.length === 0 && (
                  <div className="text-center py-6 text-slate-600">
                    No suppliers found for this product.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4">
              {landedCost && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {costBreakdownData.length > 0 && (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
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

                  <div className="space-y-2">
                    <CostRow icon={<Package className="text-blue-500" />} label="Product Cost (FOB)" value={landedCost.productCost} />
                    <CostRow icon={<Ship className="text-cyan-500" />} label="Freight Cost" value={landedCost.freightCost} />
                    <CostRow icon={<Shield className="text-green-500" />} label="Insurance" value={landedCost.insuranceCost} />
                    <Separator />
                    <CostRow icon={<Landmark className="text-amber-500" />} label="Customs Duties" value={landedCost.customsDuties} />
                    <CostRow icon={<Receipt className="text-red-500" />} label="VAT/Taxes" value={landedCost.vatTaxes} />
                    <CostRow icon={<Container className="text-purple-500" />} label="Handling Fees" value={landedCost.handlingFees} />
                    <CostRow icon={<Truck className="text-orange-500" />} label="Inland Transport" value={landedCost.inlandTransport} />
                    <Separator className="border-2" />
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <span className="font-bold">Total Landed Cost</span>
                      <span className="text-xl font-bold text-primary">{landedCost.totalLandedCost}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium text-sm">Cost Per Unit</span>
                      <span className="font-bold text-green-600">{landedCost.costPerUnit}</span>
                    </div>
                  </div>
                </div>
              )}

              {profitAnalysis && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center border border-green-100">
                    <div className="text-xs text-slate-600">Retail Price</div>
                    <div className="text-lg font-bold text-green-600">{profitAnalysis.recommendedRetailPrice}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
                    <div className="text-xs text-slate-600">Est. Profit/Unit</div>
                    <div className="text-lg font-bold text-blue-600">{profitAnalysis.estimatedProfit}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
                    <div className="text-xs text-slate-600">Break-Even Qty</div>
                    <div className="text-lg font-bold text-purple-600">{profitAnalysis.breakEvenQuantity}</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="customs" className="space-y-4">
              {customsData?.customsFees && (
                <>
                  <div className="overflow-x-auto -mx-2 sm:mx-0">
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
                        <TableCell className="text-right text-primary">{customsData.customsFees.totalCustomsFees}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  </div>

                  {customsData.tradeAgreements && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
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
                </>
              )}
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              {reportData?.riskAssessment && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold">Risk Assessment</span>
                    <Badge variant={reportData.riskAssessment.overallRisk === 'Low' ? 'outline' : 'destructive'}>
                      Overall: {reportData.riskAssessment.overallRisk}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reportData.riskAssessment.risks?.map((risk: any, i: number) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{risk.category}</span>
                          <Badge variant={risk.level === 'Low' ? 'outline' : risk.level === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                            {risk.level}
                          </Badge>
                        </div>
                        <Progress value={risk.level === 'Low' ? 25 : risk.level === 'Medium' ? 50 : 75} className="h-1.5 mb-2" />
                        <p className="text-xs text-slate-600">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {reportData?.marketOverview && typeof reportData.marketOverview === 'string' && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Market Overview
                  </h4>
                  <p className="text-sm text-slate-600">{reportData.marketOverview}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const loadingSteps = [
    { icon: <Hash className="w-5 h-5" />, label: "Classifying HS/GTIP codes", duration: 3000 },
    { icon: <Globe className="w-5 h-5" />, label: "Analyzing market trends", duration: 4000 },
    { icon: <DollarSign className="w-5 h-5" />, label: "Calculating customs duties", duration: 5000 },
    { icon: <Ship className="w-5 h-5" />, label: "Estimating shipping costs", duration: 4000 },
    { icon: <Building2 className="w-5 h-5" />, label: "Identifying qualified suppliers", duration: 6000 },
    { icon: <Calculator className="w-5 h-5" />, label: "Computing landed costs", duration: 4000 },
    { icon: <FileText className="w-5 h-5" />, label: "Compiling final report", duration: 3000 },
  ];

  useEffect(() => {
    if (view !== 'loading') {
      setLoadingProgress(0);
      setLoadingStep(0);
      return;
    }

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return 95;
        return Math.min(prev + Math.random() * 3 + 1, 95);
      });
    }, 500);

    // Animate steps
    let stepTimer: ReturnType<typeof setTimeout>;
    const animateSteps = (index: number) => {
      if (index >= loadingSteps.length || view !== 'loading') return;
      setLoadingStep(index);
      stepTimer = setTimeout(() => animateSteps(index + 1), loadingSteps[index].duration);
    };
    animateSteps(0);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimer);
    };
  }, [view]);

  const renderLoading = () => (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" 
             style={{ width: `${loadingProgress}%`, transition: 'width 0.5s ease-out' }} />
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-blue-400 border-l-blue-400/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <Sparkles className="absolute inset-0 m-auto text-primary w-7 h-7 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-1">Generating Intelligence Report</h3>
              <p className="text-sm text-slate-600">AI is analyzing markets, customs duties, and supplier data</p>
            </div>
            
            <div className="w-full space-y-3">
              {loadingSteps.map((step, index) => {
                const isActive = index === loadingStep;
                const isCompleted = index < loadingStep;
                const isPending = index > loadingStep;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      isActive ? 'bg-primary/10 border border-primary/30 scale-[1.02]' :
                      isCompleted ? 'bg-green-50 border border-green-200' :
                      'bg-muted/30 border border-transparent opacity-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-primary text-white animate-pulse' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-muted text-slate-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-primary' :
                      isCompleted ? 'text-green-700' :
                      'text-slate-600'
                    }`}>
                      {step.label}
                      {isActive && <span className="animate-pulse">...</span>}
                    </span>
                    {isCompleted && (
                      <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200 text-xs">
                        Done
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="w-full">
              <div className="flex justify-between text-xs text-slate-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
            
            <p className="text-xs text-slate-600">This usually takes 20-40 seconds</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <Sparkles className="w-12 h-12 text-primary/60 mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        What are you sourcing today?
      </h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Describe the product you want to source and get a comprehensive report with suppliers, costs, and customs analysis.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {EXAMPLE_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleExampleClick(prompt)}
            className="p-4 text-left border rounded-xl hover:bg-gray-50 hover:border-primary/30 transition-all group"
            data-testid={`example-prompt-${i}`}
          >
            <span className="text-sm text-gray-700 group-hover:text-primary">{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-gray-50/50 min-w-0">
      <div className="border-b bg-white p-3 sm:p-4 shrink-0">
        <div className="max-w-3xl mx-auto w-full min-w-0">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Selected product" 
                className="h-20 w-20 object-cover rounded-lg border shadow-sm"
                data-testid="image-preview"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                data-testid="button-remove-image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="space-y-3">
            <div className="relative flex items-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
                data-testid="input-image-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-[52px] w-12 rounded-xl border-gray-300 shadow-sm hover:border-primary"
                disabled={view === 'loading'}
                data-testid="button-upload-image"
              >
                <Camera className="w-5 h-5 text-slate-600" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedImage ? "Analyzing image..." : "What product are you sourcing?"}
                  className="min-h-[52px] max-h-32 resize-none pr-12 rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-gray-900 placeholder:text-gray-500"
                  rows={1}
                  data-testid="input-search-query"
                />
                <Button
                  onClick={() => handleSubmit()}
                  disabled={(!query.trim() && !selectedImage) || view === 'loading'}
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
                  data-testid="button-submit-search"
                >
                  {view === 'loading' || isAnalyzingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Origin</Label>
                <Select value={originCountry} onValueChange={setOriginCountry}>
                  <SelectTrigger className="h-9 text-sm text-slate-800">
                    <SelectValue placeholder="Origin country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Destination</Label>
                <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                  <SelectTrigger className="h-9 text-sm text-slate-800">
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.filter((c) => c !== "Any").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Quantity</Label>
                <Input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 1000"
                  className="h-9 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Budget (optional)</Label>
                <Input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $5/unit"
                  className="h-9 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                />
              </div>
            </div>
            {showAdvanced && (
              <div className="space-y-1 pt-2 border-t">
                <Label className="text-xs font-medium text-slate-700">Additional requirements</Label>
                <Textarea
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. ISO certified, MOQ under 500, FOB terms..."
                  className="min-h-[60px] text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  rows={2}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800"
            >
              {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showAdvanced ? "Hide" : "Show"} advanced filters
            </button>
          </div>
          <p className="text-xs text-center text-slate-600 mt-2">
            {selectedImage ? "Click the sparkle button to analyze image" : "Press Enter to search • Upload an image or type • Uses 1 credit per report"}
          </p>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-8"
      >
        <div className="flex flex-col items-center min-h-full">
          {view === 'results' && (
            <div className="flex justify-center mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNewSearch}
                className="shrink-0"
                data-testid="button-new-search"
              >
                <Sparkles className="w-4 h-4 mr-2 shrink-0" />
                <span className="whitespace-nowrap">New Search</span>
              </Button>
            </div>
          )}
          {view === 'empty' && renderEmpty()}
          {view === 'loading' && renderLoading()}
          {view === 'results' && renderResults()}
        </div>
      </div>

      <Dialog open={showCreditsPopup} onOpenChange={setShowCreditsPopup}>
        <DialogContent className="sm:max-w-md" data-testid="credits-exhausted-popup">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Credits Exhausted
            </DialogTitle>
            <DialogDescription className="pt-2">
              {profile?.hasUsedFreeTrial 
                ? "You've used all your credits. Subscribe to our Monthly Plan or purchase credits to continue generating reports."
                : "Your free trial has ended. Subscribe to continue using SmartSeek's powerful sourcing tools."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Monthly Plan - $80/month</h4>
                  <p className="text-sm text-slate-600">10 credits refreshed every month</p>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Pay-as-you-go</h4>
                  <p className="text-sm text-slate-600">$10 per credit - never expires</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCreditsPopup(false)}
                data-testid="button-cancel-credits-popup"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  setShowCreditsPopup(false);
                  navigate('/billing');
                }}
                data-testid="button-subscribe-credits-popup"
              >
                View Plans
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
