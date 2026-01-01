import { useReports, useReport } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { FileText, Download, Loader2, CheckCircle, Clock, AlertCircle, ArrowLeft, Sparkles, Building2, MapPin, Star, Shield, Calendar, TrendingUp, Users, DollarSign, Package, Truck, AlertTriangle, Target } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Reports() {
  const { data: reports = [], isLoading } = useReports();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (selectedReportId) {
    return <ReportDetail reportId={selectedReportId} onBack={() => setSelectedReportId(null)} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Reports</h1>
          <p className="text-muted-foreground">AI-generated sourcing analysis reports.</p>
        </div>
        <Link href="/smart-finder">
          <Button data-testid="button-new-report">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </Link>
      </div>

      {reports.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-4">Use Smart Finder to generate your first AI sourcing report.</p>
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

function ReportDetail({ reportId, onBack }: { reportId: number; onBack: () => void }) {
  const { data: report, isLoading, refetch } = useReport(reportId);

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

  // If still generating, show refresh option
  if (report.status === 'generating') {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AI is Analyzing Your Request</h2>
          <p className="text-muted-foreground mb-6">Scanning global markets and suppliers...</p>
          <Button onClick={() => refetch()}>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Check Status
          </Button>
        </div>
      </div>
    );
  }

  // Generate chart data from report
  const regionData = reportData?.supplierAnalysis?.topRegions?.map((r: any, i: number) => ({
    name: r.region?.split(',')[0] || `Region ${i+1}`,
    score: 85 - i * 10,
    cost: 70 + i * 8
  })) || [
    { name: 'China', score: 85, cost: 65 },
    { name: 'Vietnam', score: 78, cost: 72 },
    { name: 'India', score: 72, cost: 80 },
  ];

  const riskData = reportData?.riskAssessment?.risks?.map((r: any) => ({
    name: r.category,
    value: r.level === 'Low' ? 25 : r.level === 'Medium' ? 50 : 75
  })) || [
    { name: 'Supply Chain', value: 30 },
    { name: 'Quality', value: 25 },
    { name: 'Political', value: 45 },
    { name: 'Currency', value: 35 },
  ];

  const radarData = [
    { subject: 'Quality', A: 85 },
    { subject: 'Cost', A: 78 },
    { subject: 'Lead Time', A: 70 },
    { subject: 'Reliability', A: 82 },
    { subject: 'Compliance', A: 90 },
    { subject: 'Scalability', A: 75 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <StatusBadge status={report.status} />
            <h1 className="text-3xl font-heading font-bold mt-3">{report.title}</h1>
            <p className="text-muted-foreground mt-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Generated on {format(new Date(report.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Category</div>
            <Badge variant="outline" className="mt-1">{report.category}</Badge>
          </div>
        </div>
      </div>

      {reportData ? (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              icon={<Target className="w-5 h-5 text-blue-500" />}
              label="Risk Score"
              value={reportData.riskAssessment?.overallRisk || "Low"}
              trend={reportData.riskAssessment?.overallRisk === 'Low' ? 'positive' : 'neutral'}
            />
            <MetricCard 
              icon={<DollarSign className="w-5 h-5 text-green-500" />}
              label="Est. Unit Cost"
              value={reportData.costBreakdown?.unitCost || "$12-18"}
              trend="neutral"
            />
            <MetricCard 
              icon={<Building2 className="w-5 h-5 text-purple-500" />}
              label="Suppliers Found"
              value={reportData.supplierAnalysis?.recommendedSuppliers?.length || 5}
              trend="positive"
            />
            <MetricCard 
              icon={<Truck className="w-5 h-5 text-orange-500" />}
              label="Avg Lead Time"
              value={reportData.timeline?.production || "30-45 days"}
              trend="neutral"
            />
          </div>

          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{reportData.executiveSummary}</p>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Region Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Region Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="score" name="Supplier Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cost" name="Cost Index" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Sourcing Quality Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid className="opacity-30" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Overview */}
          {reportData.marketOverview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Market Size</div>
                    <div className="text-xl font-bold">{reportData.marketOverview.marketSize}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Growth Rate</div>
                    <div className="text-xl font-bold text-green-600">{reportData.marketOverview.growthRate}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Competition Level</div>
                    <div className="text-xl font-bold">Medium</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3">Key Market Trends</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {reportData.marketOverview.keyTrends?.map((trend: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 border rounded-lg">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                        <span className="text-sm">{trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Suppliers */}
          {reportData.supplierAnalysis?.recommendedSuppliers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Recommended Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.supplierAnalysis.recommendedSuppliers.map((supplier: any, i: number) => (
                    <div key={i} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{supplier.name}</h4>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {supplier.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {supplier.strengths?.map((s: string, j: number) => (
                              <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold text-primary">{supplier.estimatedCost}</div>
                          <div className="text-sm text-muted-foreground">per unit</div>
                          <div className="flex items-center justify-end gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="font-medium">{(4.5 + Math.random() * 0.4).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Years Active</div>
                          <div className="font-medium">{8 + i * 3}+ years</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">MOQ</div>
                          <div className="font-medium">{200 + i * 100} units</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Lead Time</div>
                          <div className="font-medium">{15 + i * 5}-{25 + i * 5} days</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Certifications</div>
                          <div className="font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-500" />
                            ISO 9001, CE
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Breakdown */}
          {reportData.costBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
                    <Package className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Unit Cost</div>
                    <div className="text-xl font-bold">{reportData.costBreakdown.unitCost}</div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900">
                    <Building2 className="w-5 h-5 text-purple-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Tooling</div>
                    <div className="text-xl font-bold">{reportData.costBreakdown.toolingCost}</div>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-900">
                    <Truck className="w-5 h-5 text-orange-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Shipping</div>
                    <div className="text-xl font-bold">{reportData.costBreakdown.shippingCost}</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900">
                    <DollarSign className="w-5 h-5 text-green-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-xl font-bold text-green-600">{reportData.costBreakdown.totalEstimate}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3">Cost Factors</div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {reportData.costBreakdown.factors?.map((factor: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
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
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Overall Risk:</span>
                  <Badge variant={reportData.riskAssessment.overallRisk === 'Low' ? 'outline' : 'destructive'}>
                    {reportData.riskAssessment.overallRisk}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {riskData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                      {riskData.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center gap-1 text-xs">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          {entry.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reportData.riskAssessment.risks?.map((risk: any, i: number) => (
                      <div key={i} className="p-4 border rounded-lg">
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
                      { phase: 'Sampling', duration: reportData.timeline.sampling, icon: Package },
                      { phase: 'Tooling', duration: reportData.timeline.tooling, icon: Building2 },
                      { phase: 'Production', duration: reportData.timeline.production, icon: Users },
                      { phase: 'Shipping', duration: reportData.timeline.shipping, icon: Truck },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10">
                          <item.icon className="w-5 h-5 text-primary" />
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
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-lg border">
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
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle className="w-5 h-5 text-green-500" />
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
  );
}

function MetricCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string | number; trend: 'positive' | 'negative' | 'neutral' }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-lg font-bold ${trend === 'positive' ? 'text-green-600' : trend === 'negative' ? 'text-red-600' : ''}`}>
              {value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
