import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Send, Loader2, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, DollarSign, Package, Globe, Ship, Landmark, BarChart3,
  Lightbulb, Target, Shield, Clock, ArrowRight, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  productScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  marketTrend: 'growing' | 'stable' | 'declining';
  recommendation: string;
  keyInsights: string[];
  costBreakdown: {
    unitCost: number;
    shipping: number;
    duties: number;
    vat: number;
    total: number;
    margin: number;
  };
  suppliers: {
    name: string;
    country: string;
    price: number;
    moq: number;
    leadTime: string;
    rating: number;
    pros: string[];
    cons: string[];
  }[];
  alternatives: {
    product: string;
    reason: string;
    potentialSaving: string;
  }[];
}

export default function AIAssistant() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("analyze");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    targetPrice: "",
    quantity: "",
    destination: "",
    timeline: "",
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!formData.productName || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please provide product name and category",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisComplete(false);

    // Simulate AI analysis with progress updates
    const stages = [
      { progress: 20, delay: 500 },
      { progress: 40, delay: 800 },
      { progress: 60, delay: 600 },
      { progress: 80, delay: 700 },
      { progress: 100, delay: 400 },
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      setProgress(stage.progress);
    }

    // Generate mock analysis result
    const mockResult: AnalysisResult = {
      productScore: 78,
      riskLevel: 'medium',
      marketTrend: 'growing',
      recommendation: `Based on our AI analysis, "${formData.productName}" shows strong sourcing potential with a favorable market trend. We recommend proceeding with verified suppliers from China or Vietnam for optimal cost-quality balance.`,
      keyInsights: [
        "Market demand increased 23% in the last 12 months",
        "Average supplier lead time is 15-25 days for this category",
        "Quality certifications (CE, FCC) are required for EU/US markets",
        "Peak shipping season may affect delivery times in Q4",
        "Consider MOQ negotiation for first orders to reduce risk",
      ],
      costBreakdown: {
        unitCost: parseFloat(formData.targetPrice) || 15.00,
        shipping: 2.50,
        duties: 1.20,
        vat: 0.95,
        total: (parseFloat(formData.targetPrice) || 15.00) + 4.65,
        margin: 35,
      },
      suppliers: [
        {
          name: "Shenzhen TechPro Manufacturing",
          country: "China",
          price: (parseFloat(formData.targetPrice) || 15.00) * 0.9,
          moq: 500,
          leadTime: "18-22 days",
          rating: 4.8,
          pros: ["Verified supplier", "Fast samples", "Good communication"],
          cons: ["Higher MOQ", "Limited customization"],
        },
        {
          name: "Vietnam Quality Goods Ltd",
          country: "Vietnam",
          price: (parseFloat(formData.targetPrice) || 15.00) * 0.95,
          moq: 300,
          leadTime: "20-25 days",
          rating: 4.6,
          pros: ["Lower MOQ", "Flexible terms", "Growing capacity"],
          cons: ["Slightly longer lead time", "Newer supplier"],
        },
        {
          name: "Bangkok Industrial Co.",
          country: "Thailand",
          price: (parseFloat(formData.targetPrice) || 15.00) * 1.05,
          moq: 200,
          leadTime: "15-20 days",
          rating: 4.5,
          pros: ["Lowest MOQ", "Quality focus", "Good for testing"],
          cons: ["Higher unit price", "Smaller scale"],
        },
      ],
      alternatives: [
        {
          product: formData.productName + " (Budget Version)",
          reason: "Similar functionality with cost-effective materials",
          potentialSaving: "25-30%",
        },
        {
          product: formData.productName + " (Premium Line)",
          reason: "Higher margins with premium positioning",
          potentialSaving: "+40% margin",
        },
      ],
    };

    setResult(mockResult);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setActiveTab("results");
    
    toast({
      title: "Analysis Complete",
      description: "AI insights are ready for review",
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'growing': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            AI Decision Assistant
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered insights for smarter sourcing decisions
          </p>
        </div>
        {analysisComplete && (
          <Button variant="outline" onClick={() => { setAnalysisComplete(false); setActiveTab("analyze"); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="analyze">
            <Target className="w-4 h-4 mr-2" />
            Analyze Product
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisComplete}>
            <Lightbulb className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="compare" disabled={!analysisComplete}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare Suppliers
          </TabsTrigger>
          <TabsTrigger value="costs" disabled={!analysisComplete}>
            <DollarSign className="w-4 h-4 mr-2" />
            Cost Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter product details for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input 
                      placeholder="e.g., Bluetooth Wireless Earbuds"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      data-testid="input-product-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="apparel">Apparel & Fashion</SelectItem>
                        <SelectItem value="home">Home & Kitchen</SelectItem>
                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="beauty">Beauty & Health</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="toys">Toys & Games</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Description</Label>
                  <Textarea 
                    placeholder="Describe the product specifications, features, and requirements..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    data-testid="input-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Target Unit Price ($)</Label>
                    <Input 
                      type="number"
                      placeholder="15.00"
                      value={formData.targetPrice}
                      onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                      data-testid="input-target-price"
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
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Select value={formData.destination} onValueChange={(v) => setFormData({...formData, destination: v})}>
                      <SelectTrigger data-testid="select-destination">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(v) => setFormData({...formData, timeline: v})}>
                    <SelectTrigger data-testid="select-timeline">
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (2-4 weeks)</SelectItem>
                      <SelectItem value="normal">Normal (4-8 weeks)</SelectItem>
                      <SelectItem value="flexible">Flexible (8+ weeks)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isAnalyzing && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Analyzing product data...</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  data-testid="button-analyze"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">What You'll Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Target, label: "Product viability score", color: "text-purple-500" },
                    { icon: Globe, label: "Supplier recommendations", color: "text-blue-500" },
                    { icon: DollarSign, label: "Landed cost breakdown", color: "text-green-500" },
                    { icon: Shield, label: "Risk assessment", color: "text-amber-500" },
                    { icon: TrendingUp, label: "Market trend analysis", color: "text-cyan-500" },
                    { icon: Lightbulb, label: "Alternative suggestions", color: "text-pink-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">AI-Powered</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes thousands of data points including supplier ratings, market trends, and cost factors to provide actionable insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {result && (
            <div className="space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Product Score</span>
                      <Target className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold">{result.productScore}/100</div>
                    <Progress value={result.productScore} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <Badge className={getRiskColor(result.riskLevel)}>
                      {result.riskLevel.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Market Trend</span>
                      {getTrendIcon(result.marketTrend)}
                    </div>
                    <span className="font-semibold capitalize">{result.marketTrend}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Est. Margin</span>
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{result.costBreakdown.margin}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendation */}
              <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{result.recommendation}</p>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.keyInsights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alternatives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Alternative Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.alternatives.map((alt, i) => (
                      <div key={i} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                        <div className="font-medium mb-1">{alt.product}</div>
                        <p className="text-sm text-muted-foreground mb-2">{alt.reason}</p>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                          {alt.potentialSaving}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          {result && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Comparison</CardTitle>
                  <CardDescription>AI-ranked suppliers based on your requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.suppliers.map((supplier, i) => (
                      <div key={i} className={`p-4 border rounded-lg ${i === 0 ? 'border-primary bg-primary/5' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              {i === 0 && <Badge className="bg-primary">Recommended</Badge>}
                              <h4 className="font-semibold">{supplier.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Globe className="w-3 h-3" />
                              {supplier.country}
                              <span className="mx-1">•</span>
                              <span className="text-amber-500">{supplier.rating} ★</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${supplier.price.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">per unit</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">MOQ</span>
                            <div className="font-medium">{supplier.moq} units</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Lead Time</span>
                            <div className="font-medium">{supplier.leadTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Order</span>
                            <div className="font-medium">${(supplier.price * supplier.moq).toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating</span>
                            <div className="font-medium">{supplier.rating}/5.0</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-green-600 mb-2">Pros</div>
                            <ul className="space-y-1">
                              {supplier.pros.map((pro, j) => (
                                <li key={j} className="text-sm flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-amber-600 mb-2">Cons</div>
                            <ul className="space-y-1">
                              {supplier.cons.map((con, j) => (
                                <li key={j} className="text-sm flex items-center gap-2">
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                          <Button size="sm" className="flex-1">
                            Request Quote
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Landed Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                      <span>Unit Cost (FOB)</span>
                      <span className="font-semibold">${result.costBreakdown.unitCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Ship className="w-4 h-4 text-blue-500" />
                        Shipping
                      </div>
                      <span className="font-semibold">${result.costBreakdown.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-500" />
                        Import Duties
                      </div>
                      <span className="font-semibold">${result.costBreakdown.duties.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span>VAT/GST</span>
                      <span className="font-semibold">${result.costBreakdown.vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3 -mx-3">
                      <span className="font-bold">Total Landed Cost</span>
                      <span className="font-bold text-xl text-primary">${result.costBreakdown.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Margin Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-6 bg-green-500/10 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Estimated Gross Margin</div>
                      <div className="text-4xl font-bold text-green-600">{result.costBreakdown.margin}%</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Suggested Retail Price</span>
                        <span className="font-semibold">${(result.costBreakdown.total * 1.54).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Profit Per Unit</span>
                        <span className="font-semibold text-green-600">${(result.costBreakdown.total * 0.54).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Break-even Quantity</span>
                        <span className="font-semibold">~50 units</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-sm">AI Tip</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Negotiating a 10% lower unit price could increase your margin to 42%. 
                        Consider larger order quantities for better pricing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
