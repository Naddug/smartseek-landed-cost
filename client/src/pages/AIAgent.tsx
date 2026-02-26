import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Bot, 
  Phone,
  Mail,
  Search,
  Settings,
  User,
  Building2,
  Briefcase,
  Loader2,
  Copy,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface AgentSettings {
  agentName: string;
  emailSignature: string;
  phoneScriptTone: "professional" | "friendly" | "direct";
  emailTemplate: "formal" | "casual" | "sales";
  targetIndustries: string[];
}

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  email?: string;
  phone?: string;
}

interface OutputContent {
  id: string;
  type: "call" | "email";
  leadName: string;
  content: string;
  status: "draft" | "ready" | "sent";
  createdAt: Date;
}

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Education",
  "Construction",
  "Logistics",
  "Energy",
];

const defaultSettings: AgentSettings = {
  agentName: "Sales Agent",
  emailSignature: "Best regards,\nYour Name\nYour Company",
  phoneScriptTone: "professional",
  emailTemplate: "formal",
  targetIndustries: [],
};

export default function AIAgent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState<AgentSettings>(() => {
    const saved = localStorage.getItem("aiAgentSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [outputs, setOutputs] = useState<OutputContent[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [companyToResearch, setCompanyToResearch] = useState("");
  const [researchResult, setResearchResult] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("aiAgentSettings", JSON.stringify(settings));
  }, [settings]);

  const handleSaveSettings = () => {
    localStorage.setItem("aiAgentSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  const handleSearchLeads = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter search criteria");
      return;
    }

    setIsLoading(true);
    setActiveTask("search_leads");

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: "search_leads",
          query: `Find business owners and decision makers matching: ${searchQuery}. Target industries: ${settings.targetIndustries.join(", ") || "any"}. Return as JSON array with fields: name, title, company, industry, email, phone.`,
          context: { settings },
        }),
      });

      if (!response.ok) throw new Error("Failed to search leads");

      const data = await response.json();
      const content = data.response?.content || "";
      
      try {
        let parsedLeads: any[] = [];
        const jsonMatch = content.match(/\{[\s\S]*"leads"[\s\S]*\}/) || content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          parsedLeads = Array.isArray(parsed) ? parsed : (parsed.leads || []);
        }
        if (parsedLeads.length > 0) {
          setLeads(parsedLeads.map((l: any, i: number) => ({ ...l, id: `lead-${i}` })));
        } else {
          setLeads([]);
        }
      } catch {
        setLeads([]);
      }
      
      toast.success("Leads found successfully");
    } catch (error: any) {
      const msg = error?.message || "Failed to search leads";
      toast.error(msg.includes("401") ? "Please log in again" : msg);
    } finally {
      setIsLoading(false);
      setActiveTask(null);
    }
  };

  const handlePrepareCall = async (lead: Lead) => {
    setIsLoading(true);
    setActiveTask("prepare_call");
    setSelectedLead(lead);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: "prepare_call",
          query: `Generate a ${settings.phoneScriptTone} phone call script for reaching out to ${lead.name}, ${lead.title} at ${lead.company} in the ${lead.industry} industry. Include talking points, objection handling, and a clear call-to-action.`,
          context: { settings, lead },
        }),
      });

      if (!response.ok) throw new Error("Failed to prepare call script");

      const data = await response.json();
      const newOutput: OutputContent = {
        id: `output-${Date.now()}`,
        type: "call",
        leadName: lead.name,
        content: data.response?.content || "No script generated",
        status: "draft",
        createdAt: new Date(),
      };
      setOutputs((prev) => [newOutput, ...prev]);
      toast.success("Call script prepared");
    } catch (error: any) {
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Failed to prepare call script");
    } finally {
      setIsLoading(false);
      setActiveTask(null);
      setSelectedLead(null);
    }
  };

  const handlePrepareEmail = async (lead: Lead) => {
    setIsLoading(true);
    setActiveTask("prepare_email");
    setSelectedLead(lead);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: "prepare_email",
          query: `Draft a ${settings.emailTemplate} outreach email for ${lead.name}, ${lead.title} at ${lead.company} in the ${lead.industry} industry. Use signature: ${settings.emailSignature}`,
          context: { settings, lead },
        }),
      });

      if (!response.ok) throw new Error("Failed to prepare email");

      const data = await response.json();
      const newOutput: OutputContent = {
        id: `output-${Date.now()}`,
        type: "email",
        leadName: lead.name,
        content: data.response?.content || "No email generated",
        status: "draft",
        createdAt: new Date(),
      };
      setOutputs((prev) => [newOutput, ...prev]);
      toast.success("Email draft prepared");
    } catch (error: any) {
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Failed to prepare email");
    } finally {
      setIsLoading(false);
      setActiveTask(null);
      setSelectedLead(null);
    }
  };

  const handleResearchCompany = async () => {
    if (!companyToResearch.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    setIsLoading(true);
    setActiveTask("research_company");

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: "research_company",
          query: `Provide a comprehensive research report on ${companyToResearch}. Include company overview, key decision makers, recent news, industry position, potential pain points, and opportunities for engagement.`,
          context: { settings },
        }),
      });

      if (!response.ok) throw new Error("Failed to research company");

      const data = await response.json();
      setResearchResult(data.response?.content || "No research data available");
      toast.success("Company research complete");
    } catch (error: any) {
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Failed to research company");
    } finally {
      setIsLoading(false);
      setActiveTask(null);
    }
  };

  const handleCopyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const updateOutputStatus = (id: string, status: "draft" | "ready" | "sent") => {
    setOutputs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    toast.success(`Status updated to ${status}`);
  };

  const toggleIndustry = (industry: string) => {
    setSettings((prev) => ({
      ...prev,
      targetIndustries: prev.targetIndustries.includes(industry)
        ? prev.targetIndustries.filter((i) => i !== industry)
        : [...prev.targetIndustries, industry],
    }));
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)]">
      <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen} className="flex">
        <CollapsibleContent className="w-80 border-r border-slate-600/50 bg-slate-700/30 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Agent Name</Label>
                <Input
                  value={settings.agentName}
                  onChange={(e) => setSettings({ ...settings, agentName: e.target.value })}
                  className="bg-slate-600/50 border-slate-500/50 text-slate-100"
                  data-testid="input-agent-name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Email Signature</Label>
                <Textarea
                  value={settings.emailSignature}
                  onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                  className="bg-slate-600/50 border-slate-500/50 text-slate-100 min-h-[80px]"
                  data-testid="input-email-signature"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Phone Script Tone</Label>
                <Select
                  value={settings.phoneScriptTone}
                  onValueChange={(v) => setSettings({ ...settings, phoneScriptTone: v as any })}
                >
                  <SelectTrigger className="bg-slate-600/50 border-slate-500/50 text-slate-100" data-testid="select-phone-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Email Template</Label>
                <Select
                  value={settings.emailTemplate}
                  onValueChange={(v) => setSettings({ ...settings, emailTemplate: v as any })}
                >
                  <SelectTrigger className="bg-slate-600/50 border-slate-500/50 text-slate-100" data-testid="select-email-template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Target Industries</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INDUSTRIES.map((industry) => (
                    <Badge
                      key={industry}
                      variant={settings.targetIndustries.includes(industry) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        settings.targetIndustries.includes(industry)
                          ? "bg-slate-500 hover:bg-slate-400"
                          : "border-slate-500 text-slate-300 hover:bg-slate-600/50"
                      }`}
                      onClick={() => toggleIndustry(industry)}
                      data-testid={`badge-industry-${industry.toLowerCase()}`}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                className="w-full bg-slate-500 hover:bg-slate-400 text-white"
                data-testid="button-save-settings"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </CollapsibleContent>

        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-auto rounded-none border-r border-slate-600/50 bg-slate-700/20 hover:bg-slate-600/30 text-slate-400"
            data-testid="button-toggle-sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-600/50 border border-slate-500/30">
                <Bot className="w-6 h-6 text-slate-200" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100" data-testid="text-page-title">
                  {settings.agentName}
                </h1>
                <p className="text-slate-400 text-sm">AI-powered sales assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
              <span className="text-sm text-slate-400" data-testid="text-agent-status">
                {isLoading ? "Processing..." : "Ready"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="bg-slate-600/40 border-slate-500/40 hover:bg-slate-600/60 hover:border-slate-400/50 transition-all cursor-pointer"
              onClick={() => document.getElementById("search-input")?.focus()}
              data-testid="card-action-search"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/30">
                    <Search className="w-6 h-6 text-slate-200" />
                  </div>
                  <h3 className="font-semibold text-slate-100">Search Leads</h3>
                  <p className="text-sm text-slate-400">Find business owners & decision makers</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-slate-600/40 border-slate-500/40 hover:bg-slate-600/60 hover:border-slate-400/50 transition-all ${
                leads.length === 0 ? "opacity-50" : "cursor-pointer"
              }`}
              data-testid="card-action-call"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/30">
                    <Phone className="w-6 h-6 text-slate-200" />
                  </div>
                  <h3 className="font-semibold text-slate-100">Prepare Phone Call</h3>
                  <p className="text-sm text-slate-400">Generate call scripts with talking points</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-slate-600/40 border-slate-500/40 hover:bg-slate-600/60 hover:border-slate-400/50 transition-all ${
                leads.length === 0 ? "opacity-50" : "cursor-pointer"
              }`}
              data-testid="card-action-email"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/30">
                    <Mail className="w-6 h-6 text-slate-200" />
                  </div>
                  <h3 className="font-semibold text-slate-100">Prepare Email</h3>
                  <p className="text-sm text-slate-400">Draft professional outreach emails</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-600/40 border-slate-500/40 hover:bg-slate-600/60 hover:border-slate-400/50 transition-all cursor-pointer"
              onClick={() => document.getElementById("research-input")?.focus()}
              data-testid="card-action-research"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/30">
                    <Building2 className="w-6 h-6 text-slate-200" />
                  </div>
                  <h3 className="font-semibold text-slate-100">Research Company</h3>
                  <p className="text-sm text-slate-400">Deep dive on a specific company</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-600/40 border-slate-500/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search for Leads
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter criteria to find business owners and decision makers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  id="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., SaaS company CEOs in San Francisco, Manufacturing directors in Texas..."
                  className="flex-1 bg-slate-700/50 border-slate-500/50 text-slate-100 placeholder:text-slate-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchLeads()}
                  data-testid="input-search-leads"
                />
                <Button
                  onClick={handleSearchLeads}
                  disabled={isLoading && activeTask === "search_leads"}
                  className="bg-slate-500 hover:bg-slate-400 text-white"
                  data-testid="button-search-leads"
                >
                  {isLoading && activeTask === "search_leads" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {leads.length > 0 && (
            <Card className="bg-slate-600/40 border-slate-500/40">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Lead Search Results
                  <Badge variant="secondary" className="ml-2 bg-slate-500/50">
                    {leads.length} found
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-500/40 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-500/40 hover:bg-slate-600/30">
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">Title</TableHead>
                        <TableHead className="text-slate-300">Company</TableHead>
                        <TableHead className="text-slate-300">Industry</TableHead>
                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow
                          key={lead.id}
                          className="border-slate-500/40 hover:bg-slate-600/30"
                          data-testid={`row-lead-${lead.id}`}
                        >
                          <TableCell className="text-slate-100 font-medium">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400" />
                              {lead.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              {lead.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-400" />
                              {lead.company}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-500 text-slate-300">
                              {lead.industry}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePrepareCall(lead)}
                                disabled={isLoading}
                                className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                                data-testid={`button-call-${lead.id}`}
                              >
                                {isLoading && selectedLead?.id === lead.id && activeTask === "prepare_call" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Phone className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePrepareEmail(lead)}
                                disabled={isLoading}
                                className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                                data-testid={`button-email-${lead.id}`}
                              >
                                {isLoading && selectedLead?.id === lead.id && activeTask === "prepare_email" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Mail className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-600/40 border-slate-500/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Research
              </CardTitle>
              <CardDescription className="text-slate-400">
                Get detailed insights on a specific company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  id="research-input"
                  value={companyToResearch}
                  onChange={(e) => setCompanyToResearch(e.target.value)}
                  placeholder="Enter company name..."
                  className="flex-1 bg-slate-700/50 border-slate-500/50 text-slate-100 placeholder:text-slate-400"
                  onKeyDown={(e) => e.key === "Enter" && handleResearchCompany()}
                  data-testid="input-research-company"
                />
                <Button
                  onClick={handleResearchCompany}
                  disabled={isLoading && activeTask === "research_company"}
                  className="bg-slate-500 hover:bg-slate-400 text-white"
                  data-testid="button-research-company"
                >
                  {isLoading && activeTask === "research_company" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Research
                </Button>
              </div>

              {researchResult && (
                <div className="bg-slate-700/40 rounded-lg p-5 border border-slate-500/30">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-100">Research Results</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(researchResult)}
                        className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                        data-testid="button-copy-research"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setResearchResult(null)}
                        className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
                    {researchResult}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {outputs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Generated Content
              </h2>
              {outputs.map((output) => (
                <Card key={output.id} className="bg-slate-600/40 border-slate-500/40" data-testid={`card-output-${output.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {output.type === "call" ? (
                          <Phone className="w-5 h-5 text-slate-300" />
                        ) : (
                          <Mail className="w-5 h-5 text-slate-300" />
                        )}
                        <div>
                          <CardTitle className="text-slate-100 text-base">
                            {output.type === "call" ? "Call Script" : "Email Draft"} for {output.leadName}
                          </CardTitle>
                          <p className="text-sm text-slate-400">
                            {output.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={output.status}
                          onValueChange={(v) => updateOutputStatus(output.id, v as any)}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs bg-slate-700/50 border-slate-500/50" data-testid={`select-status-${output.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge
                          variant="outline"
                          className={`capitalize ${
                            output.status === "sent"
                              ? "border-green-500 text-green-400"
                              : output.status === "ready"
                              ? "border-blue-500 text-blue-400"
                              : "border-slate-500 text-slate-300"
                          }`}
                          data-testid={`badge-status-${output.id}`}
                        >
                          {output.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-500/30">
                      <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
                        {output.content}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(output.content)}
                        className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                        data-testid={`button-copy-${output.id}`}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {leads.length === 0 && outputs.length === 0 && !researchResult && (
            <Card className="bg-slate-600/30 border-slate-500/40 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-xl bg-slate-600/50 flex items-center justify-center mx-auto mb-4 border border-slate-500/30">
                  <Bot className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to assist</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Search for leads, prepare phone call scripts, draft emails, or research companies. Configure your preferences in the settings panel.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
