import { useState, useEffect, useRef } from "react";
import { useProfile, useCreateReport, useReport } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Loader2, FileText, CheckCircle,
  Package, Globe, Ship, Plane, Truck, Shield, Hash, 
  Building2, Download,
  AlertTriangle, Star, MapPin, Users, DollarSign, Calculator,
  Landmark, Receipt, Container, Percent, Send
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const EXAMPLE_PROMPTS = [
  "Find suppliers for wireless headphones",
  "Source industrial valves from China",
  "Analyze landed cost for textiles from India",
  "Compare suppliers for medical equipment"
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
  const [view, setView] = useState<'empty' | 'loading' | 'results'>('empty');
  const [reportId, setReportId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const { data: profile } = useProfile();
  const createReport = useCreateReport();
  const { data: report, refetch } = useReport(reportId || 0);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);

  useEffect(() => {
    if (view === 'loading' && reportId && report) {
      if (report.status === 'completed') {
        setView('results');
      } else if (report.status === 'failed') {
        toast.error("Report generation failed. Please try again.");
        setView('empty');
      } else {
        const timer = setTimeout(() => refetch(), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [view, reportId, report, refetch]);

  const handleSubmit = (inputQuery?: string) => {
    const searchQuery = inputQuery || query;
    if (!searchQuery.trim()) {
      toast.error("Please enter a product or sourcing query.");
      return;
    }

    if (!profile || totalCredits < 1) {
      toast.error("Insufficient credits. You need at least 1 credit to generate a report.");
      return;
    }

    setView('loading');
    
    const formData = {
      productName: searchQuery,
      productDescription: searchQuery,
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
            addBulletPoint(`${platform.platform}: ${platform.fee} (Net Profit: ${platform.netProfit})`, primaryColor);
          });
        }
        y += 5;
      }
      
      const timeline = reportData?.timeline;
      if (timeline) {
        addSectionHeader('📅', 'TIMELINE & LEAD TIMES');
        
        const timelineItems = [
          { label: 'Production Time', value: timeline.productionTime },
          { label: 'Shipping Transit', value: timeline.shippingTime },
          { label: 'Customs Clearance', value: timeline.customsClearance },
          { label: 'Total Lead Time', value: timeline.totalLeadTime, highlight: true },
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
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Report Complete
              </Badge>
              <CardTitle className="text-xl">{report.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
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
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="summary" data-testid="tab-summary">Summary</TabsTrigger>
              <TabsTrigger value="suppliers" data-testid="tab-suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="costs" data-testid="tab-costs">Costs</TabsTrigger>
              <TabsTrigger value="customs" data-testid="tab-customs">Customs</TabsTrigger>
              <TabsTrigger value="risks" data-testid="tab-risks">Risk</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Executive Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{reportData?.executiveSummary || 'No summary available.'}</p>
              </div>

              {productClass && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Hash className="w-4 h-4 text-primary" />
                    Product Classification
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">HS Code</div>
                      <div className="font-mono font-bold text-primary">{productClass.hsCode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Tariff Chapter</div>
                      <div className="font-medium text-sm">{productClass.tariffChapter}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div className="font-medium text-sm">{productClass.productCategory}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Description</div>
                      <div className="font-medium text-sm truncate">{productClass.hsCodeDescription?.slice(0, 40)}...</div>
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {seller.location}
                              <Badge variant="outline" className="text-xs">{seller.platform}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          <div>
                            <div className="text-xs text-muted-foreground">Unit Price</div>
                            <div className="font-bold text-primary">{seller.unitPrice}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">MOQ</div>
                            <div className="font-medium text-sm">{seller.moq}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Lead Time</div>
                            <div className="font-medium text-sm">{seller.leadTime}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Rating</div>
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
                          <span className="text-muted-foreground">Est. Profit</span>
                          <span className="font-bold text-green-600">{seller.estimatedProfit || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Margin</span>
                          <span className="font-bold text-green-600">{seller.profitMargin || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sellers.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
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
                    <div className="text-xs text-muted-foreground">Retail Price</div>
                    <div className="text-lg font-bold text-green-600">{profitAnalysis.recommendedRetailPrice}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
                    <div className="text-xs text-muted-foreground">Est. Profit/Unit</div>
                    <div className="text-lg font-bold text-blue-600">{profitAnalysis.estimatedProfit}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
                    <div className="text-xs text-muted-foreground">Break-Even Qty</div>
                    <div className="text-lg font-bold text-purple-600">{profitAnalysis.breakEvenQuantity}</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="customs" className="space-y-4">
              {customsData?.customsFees && (
                <>
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
                        <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
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
                  <p className="text-sm text-muted-foreground">{reportData.marketOverview}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  const renderLoading = () => (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Generating Intelligence Report...</h3>
              <p className="text-sm text-muted-foreground">Analyzing markets, customs duties, and supplier data</p>
            </div>
            <div className="w-full space-y-2 text-left">
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
            <p className="text-xs text-muted-foreground">This usually takes 20-40 seconds</p>
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
      <p className="text-muted-foreground mb-8 max-w-md">
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
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50/50">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-8"
      >
        <div className="flex items-center justify-center min-h-full">
          {view === 'empty' && renderEmpty()}
          {view === 'loading' && renderLoading()}
          {view === 'results' && renderResults()}
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          {view === 'results' && (
            <div className="flex justify-center mb-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNewSearch}
                data-testid="button-new-search"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </div>
          )}
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What product are you sourcing?"
                className="min-h-[52px] max-h-32 resize-none pr-12 rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                rows={1}
                data-testid="input-search-query"
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!query.trim() || view === 'loading'}
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
                data-testid="button-submit-search"
              >
                {view === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Press Enter to search • Uses 1 credit per report
          </p>
        </div>
      </div>
    </div>
  );
}
