import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Printer, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Logo } from "@/components/Logo";

export default function SampleReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 print:p-0 print:bg-white">
      {/* Toolbar - Hidden when printing */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Site
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* A4 Paper Layout */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl print:shadow-none p-12 text-slate-900 font-sans print:w-full print:max-w-none">
        
        {/* Header */}
        <header className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo size="sm" />
              <span className="text-xl font-bold tracking-tight">SmartSeek</span>
            </div>
            <div className="text-sm text-slate-500">AI-Powered Sourcing Intelligence</div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">Sourcing Strategy Report</h1>
            <div className="text-sm text-slate-500 mt-1">Report ID: #SS-2024-8921</div>
            <div className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</div>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-10">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <div className="text-xs font-bold uppercase text-slate-500 mb-1">Target Category</div>
                <div className="text-xl font-bold">Bamboo Packaging (Eco-Friendly)</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-500 mb-1">Target Region</div>
                <div className="text-xl font-bold">Vietnam & Southern China</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Score</div>
                <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  12/100 <CheckCircle2 size={18} />
                </div>
                <div className="text-xs text-slate-400 mt-1">Low Risk</div>
              </div>
              <div className="bg-white p-4 rounded border">
                 <div className="text-xs text-slate-500 font-bold uppercase mb-1">Projected Margin</div>
                <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                  52.4% <TrendingUp size={18} />
                </div>
                <div className="text-xs text-slate-400 mt-1">Based on $14.50 retail</div>
              </div>
              <div className="bg-white p-4 rounded border">
                 <div className="text-xs text-slate-500 font-bold uppercase mb-1">Est. Landed Cost</div>
                <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  $2.85 <DollarSign size={18} />
                </div>
                <div className="text-xs text-slate-400 mt-1">DDP to Los Angeles</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Analysis */}
        <section className="mb-10">
          <h2 className="text-lg font-bold border-l-4 border-primary pl-3 mb-4 uppercase tracking-wider text-slate-800">1. Market & Product Analysis</h2>
          <p className="text-slate-600 mb-4 leading-relaxed text-sm">
            Demand for eco-friendly packaging is trending up 15% YoY. The recommended sourcing strategy is to target 
            Vietnam for raw bamboo material availability and lower tariff risks compared to mainland China. 
            However, mature tooling exists in Ningbo, China which offers faster lead times.
          </p>
          <div className="grid grid-cols-2 gap-6">
             <div>
               <h3 className="font-bold text-sm mb-2">Key Specifications</h3>
               <ul className="text-sm text-slate-600 space-y-1">
                 <li>• Material: 100% Biodegradable Moso Bamboo</li>
                 <li>• Certification Required: FSC, FDA</li>
                 <li>• Packaging: Plastic-free kraft paper</li>
                 <li>• Tolerance: +/- 0.5mm</li>
               </ul>
             </div>
             <div>
               <h3 className="font-bold text-sm mb-2">Compliance Check</h3>
               <ul className="text-sm text-slate-600 space-y-1">
                 <li className="flex items-center gap-2 text-green-600"><CheckCircle2 size={14} /> FDA Approved Material</li>
                 <li className="flex items-center gap-2 text-green-600"><CheckCircle2 size={14} /> Low Tariff Classification (HS 4421.91)</li>
                 <li className="flex items-center gap-2 text-amber-600"><AlertTriangle size={14} /> Requires Fumigation Cert</li>
               </ul>
             </div>
          </div>
        </section>

        {/* Supplier Shortlist */}
        <section className="mb-10">
          <h2 className="text-lg font-bold border-l-4 border-primary pl-3 mb-4 uppercase tracking-wider text-slate-800">2. Supplier Shortlist</h2>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-900">Supplier Name</TableHead>
                <TableHead className="font-bold text-slate-900">Location</TableHead>
                <TableHead className="font-bold text-slate-900">MOQ</TableHead>
                <TableHead className="font-bold text-slate-900">Unit Price</TableHead>
                <TableHead className="font-bold text-slate-900">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">VietBamboo Industries</TableCell>
                <TableCell>Hanoi, VN</TableCell>
                <TableCell>500</TableCell>
                <TableCell>$1.95</TableCell>
                <TableCell className="text-amber-500 font-bold">4.8 ★</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ningbo EcoPack Ltd</TableCell>
                <TableCell>Ningbo, CN</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>$1.75</TableCell>
                <TableCell className="text-amber-500 font-bold">4.6 ★</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GreenEarth Mfg</TableCell>
                <TableCell>Ho Chi Minh, VN</TableCell>
                <TableCell>200</TableCell>
                <TableCell>$2.10</TableCell>
                <TableCell className="text-amber-500 font-bold">4.5 ★</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        {/* Action Plan */}
        <section className="mb-10">
          <h2 className="text-lg font-bold border-l-4 border-primary pl-3 mb-4 uppercase tracking-wider text-slate-800">3. Recommended Action Plan</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-bold text-sm">Request Samples from VietBamboo</h4>
                <p className="text-sm text-slate-600">Their quality/price ratio is highest. Verify finish quality and lid fitment.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-bold text-sm">Negotiate MOQ with Ningbo EcoPack</h4>
                <p className="text-sm text-slate-600">Use the Vietnam quote to leverage better terms. Aim for 500 unit trial run.</p>
              </div>
            </div>
             <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-bold text-sm">Order Fumigation Certificate</h4>
                <p className="text-sm text-slate-600">Ensure this is included in the PI (Proforma Invoice) to avoid customs delays.</p>
              </div>
            </div>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        <footer className="text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SmartSeek Intelligence. Confidential Report.</p>
          <p>Generated by AI. Verified by Data.</p>
        </footer>

      </div>
    </div>
  );
}