import { useState } from "react";
import { useProfile } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Search, Loader2, Building2, MapPin, Users, Mail, Phone, Globe, 
  TrendingUp, Target, Briefcase, Download, Star, CheckCircle, CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Lead {
  companyName: string;
  industry: string;
  location: string;
  employeeRange: string;
  revenueRange: string;
  website: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  sourcingFocus: string[];
  aiSummary: string;
  intentSignals: {
    recentActivity?: string;
    importTrends?: string;
    growthIndicators?: string;
  };
}

const INDUSTRIES = [
  "Manufacturing",
  "Electronics & Technology",
  "Consumer Goods & Retail",
  "Automotive & Transportation",
  "Healthcare & Medical Devices",
  "Construction & Materials",
  "Food & Beverage",
  "Textiles & Apparel",
  "Chemicals & Plastics",
  "Metals & Mining",
  "Aerospace & Defense",
  "Energy & Utilities"
];

const COMPANY_SIZES = [
  "1-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees"
];

const REGIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "China",
  "Japan",
  "India",
  "Australia",
  "Brazil",
  "Mexico",
  "UAE",
  "Singapore",
  "South Korea",
  "Turkey"
];

export default function FindLeads() {
  const { data: profile } = useProfile();
  const [, setLocation] = useLocation();
  
  const [industry, setIndustry] = useState("");
  const [location, setLeadLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  const isAdmin = profile?.role === 'admin';

  const handleSearch = async () => {
    if (!industry || !location) {
      toast.error("Please select an industry and location");
      return;
    }

    if (totalCredits < 1 && !isAdmin) {
      setShowCreditsDialog(true);
      return;
    }

    setIsSearching(true);
    setLeads([]);

    try {
      const response = await apiRequest("POST", "/api/leads/search", {
        industry,
        location,
        companySize: companySize === "any" ? undefined : companySize,
        keywords: keywords || undefined
      });

      const data = await response.json();
      console.log("Search response:", data);
      
      if (data.leads && Array.isArray(data.leads)) {
        setLeads(data.leads);
        if (data.leads.length > 0) {
          toast.success(`Found ${data.leads.length} leads`);
        } else {
          toast.info("No leads matched your criteria. Try broadening your search.");
        }
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Lead search error:", error);
      toast.error(error.message || "Failed to search for leads");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Credits Required
            </DialogTitle>
            <DialogDescription>
              You need at least 1 credit to search for leads. Subscribe to our monthly plan or purchase credits to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={() => setLocation("/billing")} className="w-full">
              View Plans & Get Credits
            </Button>
            <Button variant="outline" onClick={() => setShowCreditsDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700/50 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Find Buyer Leads</h1>
            <p className="text-slate-400">Discover qualified procurement contacts with AI-powered lead intelligence</p>
          </div>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Search className="w-5 h-5" />
            Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry" data-testid="select-industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Region *</Label>
              <Select value={location} onValueChange={setLeadLocation}>
                <SelectTrigger id="location" data-testid="select-location">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((reg) => (
                    <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger id="companySize" data-testid="select-company-size">
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any size</SelectItem>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input 
                id="keywords" 
                placeholder="e.g., automotive parts, packaging"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                data-testid="input-keywords"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-500">
              {isAdmin ? (
                <span className="text-emerald-600 font-medium">Admin: Unlimited searches</span>
              ) : (
                <>Uses 1 credit • You have <span className="font-semibold">{totalCredits}</span> credits</>
              )}
            </p>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !industry || !location}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-search-leads"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Leads
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearching && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin mx-auto"></div>
                <Target className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-600 mt-4 font-medium">Analyzing market data and finding leads...</p>
              <p className="text-slate-400 text-sm mt-1">This may take a few seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {leads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Found {leads.length} Leads
            </h2>
            <Button variant="outline" size="sm" data-testid="button-export-leads">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead, index) => (
              <Card 
                key={index} 
                className="bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedLead(lead)}
                data-testid={`card-lead-${index}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 line-clamp-1">{lead.companyName}</h3>
                        <p className="text-xs text-slate-500">{lead.industry}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      <Star className="w-3 h-3 mr-1" />
                      Match
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {lead.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      {lead.employeeRange}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {lead.contactTitle}
                    </div>
                  </div>

                  {lead.sourcingFocus && lead.sourcingFocus.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {lead.sourcingFocus.slice(0, 3).map((focus, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-slate-100">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="block">{selectedLead.companyName}</span>
                    <span className="text-sm font-normal text-slate-500">{selectedLead.industry}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="font-medium">{selectedLead.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Company Size</p>
                      <p className="font-medium">{selectedLead.employeeRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="font-medium">{selectedLead.revenueRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Website</p>
                      <p className="font-medium text-blue-600">{selectedLead.website}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Key Contact
                  </h4>
                  <div className="bg-gradient-to-r from-slate-50 to-emerald-50 p-4 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-800">{selectedLead.contactName}</p>
                    <p className="text-sm text-slate-600">{selectedLead.contactTitle}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-blue-600">{selectedLead.contactEmail}</span>
                    </div>
                  </div>
                </div>

                {selectedLead.sourcingFocus && selectedLead.sourcingFocus.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Sourcing Focus
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.sourcingFocus.map((focus, i) => (
                        <Badge key={i} className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    AI Insights
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedLead.aiSummary}</p>
                </div>

                {selectedLead.intentSignals && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      Intent Signals
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedLead.intentSignals.recentActivity && (
                        <p className="text-slate-600">
                          <span className="font-medium">Recent Activity:</span> {selectedLead.intentSignals.recentActivity}
                        </p>
                      )}
                      {selectedLead.intentSignals.importTrends && (
                        <p className="text-slate-600">
                          <span className="font-medium">Import Trends:</span> {selectedLead.intentSignals.importTrends}
                        </p>
                      )}
                      {selectedLead.intentSignals.growthIndicators && (
                        <p className="text-slate-600">
                          <span className="font-medium">Growth Indicators:</span> {selectedLead.intentSignals.growthIndicators}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
