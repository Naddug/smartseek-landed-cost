import { useState, useEffect, useRef } from "react";
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
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Brain,
  Shield,
  Globe,
  AlertTriangle,
  ArrowRight,
  Send,
  MessageSquare,
  Lightbulb,
  Activity,
  Package,
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
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
  score?: number;
  research?: string;
}

interface OutputContent {
  id: string;
  type: "call" | "email";
  leadName: string;
  content: string;
  status: "draft" | "ready" | "sent";
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  type?: "text" | "leads" | "research" | "pipeline" | "call" | "email";
  data?: any;
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

const CAPABILITIES = [
  { icon: BarChart3, label: "Market Intelligence", desc: "Trend analysis & price monitoring", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { icon: Target, label: "Supplier Discovery", desc: "Find & qualify suppliers globally", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  { icon: Shield, label: "Risk Analysis", desc: "Geopolitical & supply chain risks", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { icon: Zap, label: "Cost Optimization", desc: "Landed cost & shipping routes", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { icon: FileText, label: "Trade Compliance", desc: "HS codes, customs & regulations", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
];

const PROACTIVE_INSIGHTS = [
  { type: "alert" as const, icon: TrendingUp, title: "Market Alert", message: "Copper prices up 3.2% this week — consider locking in contracts with current suppliers.", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", badgeColor: "bg-blue-100 text-blue-700" },
  { type: "opportunity" as const, icon: Globe, title: "Opportunity", message: "New ASEAN–Turkey trade agreement reduces tariffs on textiles and electronics by 12%.", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", badgeColor: "bg-emerald-100 text-emerald-700" },
  { type: "risk" as const, icon: AlertTriangle, title: "Risk Alert", message: "Supply chain disruption detected in Southeast Asia — semiconductor lead times extended 3 weeks.", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", badgeColor: "bg-amber-100 text-amber-700" },
];

const SUGGESTION_CHIPS = [
  { label: "Analyze copper market trends", icon: TrendingUp },
  { label: "Find suppliers in Vietnam", icon: Target },
  { label: "Compare shipping costs to Turkey", icon: Package },
  { label: "Generate risk assessment for China imports", icon: Shield },
  { label: "Research trade compliance for EU", icon: FileText },
  { label: "Optimize landed costs for electronics", icon: Zap },
];

const PIPELINE_STEPS = [
  { key: "Prospector", label: "Prospecting", icon: Search, desc: "Finding qualified leads" },
  { key: "Enricher", label: "Enriching", icon: Brain, desc: "Gathering company intelligence" },
  { key: "Qualifier", label: "Qualifying", icon: Target, desc: "Scoring & ranking leads" },
  { key: "Outreach", label: "Outreach", icon: Send, desc: "Preparing personalized content" },
];

export default function AIAgent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [pipelineStep, setPipelineStep] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [completedPipelineSteps, setCompletedPipelineSteps] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("aiAgentSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const addChatMessage = (role: "user" | "agent", content: string, type: ChatMessage["type"] = "text", data?: any) => {
    setChatMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, role, content, timestamp: new Date(), type, data },
    ]);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("aiAgentSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  const handleSearchLeads = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter search criteria");
      return;
    }

    addChatMessage("user", searchQuery);
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
          const mapped = parsedLeads.map((l: any, i: number) => ({ ...l, id: `lead-${i}` }));
          setLeads(mapped);
          addChatMessage("agent", `Found ${mapped.length} leads matching your criteria. You can prepare call scripts or emails for any of them.`, "leads", mapped);
        } else {
          setLeads([]);
          addChatMessage("agent", "I couldn't find specific leads for that query. Try refining your search criteria or broadening the industry scope.");
        }
      } catch {
        setLeads([]);
        addChatMessage("agent", content || "Search completed but no structured leads were returned.");
      }

      toast.success("Leads found successfully");
    } catch (error: any) {
      const msg = error?.message || "Failed to search leads";
      toast.error(msg.includes("401") ? "Please log in again" : msg);
      addChatMessage("agent", "Sorry, I encountered an error while searching. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveTask(null);
      setSearchQuery("");
    }
  };

  const handlePrepareCall = async (lead: Lead) => {
    setIsLoading(true);
    setActiveTask("prepare_call");
    setSelectedLead(lead);
    addChatMessage("user", `Prepare a call script for ${lead.name} at ${lead.company}`);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: "prepare_call",
          query: `Generate a ${settings.phoneScriptTone || "professional"} phone call script for reaching out to ${lead.name}, ${lead.title} at ${lead.company} in the ${lead.industry} industry. Include talking points, objection handling, and a clear call-to-action.`,
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
      addChatMessage("agent", data.response?.content || "No script generated", "call", newOutput);
      toast.success("Call script prepared");
    } catch (error: any) {
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Failed to prepare call script");
      addChatMessage("agent", "Sorry, I couldn't generate the call script. Please try again.");
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
    addChatMessage("user", `Draft an outreach email for ${lead.name} at ${lead.company}`);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: "prepare_email",
          query: `Draft a ${settings.emailTemplate || "formal"} outreach email for ${lead.name}, ${lead.title} at ${lead.company} in the ${lead.industry} industry. Use signature: ${settings.emailSignature || "Best regards"}`,
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
      addChatMessage("agent", data.response?.content || "No email generated", "email", newOutput);
      toast.success("Email draft prepared");
    } catch (error: any) {
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Failed to prepare email");
      addChatMessage("agent", "Sorry, I couldn't generate the email draft. Please try again.");
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

    addChatMessage("user", `Research company: ${companyToResearch}`);
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
      const result = data.response?.content || "No research data available";
      setResearchResult(result);
      addChatMessage("agent", result, "research");
      toast.success("Company research complete");
    } catch (error: any) {
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Failed to research company");
      addChatMessage("agent", "Sorry, I couldn't complete the company research. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveTask(null);
      setCompanyToResearch("");
    }
  };

  const handleRunPipeline = async () => {
    if (!searchQuery.trim()) {
      toast.error("Enter search criteria first.");
      document.getElementById("chat-input")?.focus();
      return;
    }
    addChatMessage("user", `Run full pipeline: ${searchQuery}`);
    setIsLoading(true);
    setActiveTask("pipeline");
    setPipelineStep("Prospector");
    setCompletedPipelineSteps([]);
    addChatMessage("agent", "Starting the full pipeline — Prospecting → Enriching → Qualifying → Outreach. This may take a moment...", "pipeline");

    try {
      const steps = ["Prospector", "Enricher", "Qualifier", "Outreach"];
      let stepIdx = 0;
      const stepInterval = setInterval(() => {
        setCompletedPipelineSteps((prev) => [...prev, steps[stepIdx]]);
        stepIdx = Math.min(stepIdx + 1, steps.length - 1);
        setPipelineStep(steps[stepIdx]);
      }, 8000);
      const response = await fetch("/api/ai-agent/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          searchCriteria: searchQuery.trim(),
          targetIndustries: settings.targetIndustries,
          topN: 3,
          settings: {
            phoneScriptTone: settings.phoneScriptTone || "professional",
            emailTemplate: settings.emailTemplate || "formal",
            emailSignature: settings.emailSignature || "Best regards",
          },
        }),
      });
      clearInterval(stepInterval);
      setCompletedPipelineSteps(steps);
      setPipelineStep(null);
      if (!response.ok) throw new Error("Pipeline failed");
      const data = await response.json();
      const pipelineLeads = (data.leads || []).map((l: any, i: number) => ({ ...l, id: `lead-${i}` }));
      setLeads(pipelineLeads);
      const ts = Date.now();
      const newOutputs: OutputContent[] = [];
      if (data.callScript && data.topLead) {
        newOutputs.push({
          id: `output-${ts}-call`,
          type: "call",
          leadName: data.topLead.name,
          content: data.callScript,
          status: "draft",
          createdAt: new Date(),
        });
      }
      if (data.emailDraft && data.topLead) {
        newOutputs.push({
          id: `output-${ts}-email`,
          type: "email",
          leadName: data.topLead.name,
          content: data.emailDraft,
          status: "draft",
          createdAt: new Date(),
        });
      }
      if (newOutputs.length > 0) {
        setOutputs((prev) => [...newOutputs, ...prev]);
      }
      addChatMessage("agent", `Pipeline complete! Found ${pipelineLeads.length} leads${data.topLead ? ` — top lead: ${data.topLead.name} at ${data.topLead.company}` : ""}. ${newOutputs.length > 0 ? "Call script and email draft are ready." : ""}`, "leads", pipelineLeads);
      toast.success(data.summary || "Pipeline complete.");
    } catch (error: any) {
      setPipelineStep(null);
      setCompletedPipelineSteps([]);
      toast.error(error?.message?.includes("401") ? "Please log in again" : "Pipeline failed. Try again.");
      addChatMessage("agent", "The pipeline encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveTask(null);
      setSearchQuery("");
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

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const input = chatInput.trim().toLowerCase();

    if (input.startsWith("research ") || input.startsWith("research:")) {
      const company = chatInput.trim().replace(/^research[:\s]+/i, "");
      setCompanyToResearch(company);
      setChatInput("");
      setTimeout(() => handleResearchCompany(), 0);
      return;
    }

    setSearchQuery(chatInput.trim());
    setChatInput("");
    setTimeout(() => handleSearchLeads(), 0);
  };

  const handleSuggestionClick = (label: string) => {
    setChatInput(label);
    setSearchQuery(label);
    setTimeout(() => {
      addChatMessage("user", label);
      handleSearchLeads();
    }, 0);
  };

  const currentPipelineStepIndex = pipelineStep
    ? PIPELINE_STEPS.findIndex((s) => s.key === pipelineStep)
    : -1;

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)] bg-gray-50/80">
      {/* Settings Sidebar */}
      <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen} className="flex">
        <CollapsibleContent className="w-72 border-r border-gray-200 bg-white overflow-y-auto shadow-sm">
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                <Settings className="w-4 h-4 text-gray-500" />
                Configuration
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agent Name</Label>
                <Input
                  value={settings.agentName}
                  onChange={(e) => setSettings({ ...settings, agentName: e.target.value })}
                  className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-9"
                  data-testid="input-agent-name"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Signature</Label>
                <Textarea
                  value={settings.emailSignature}
                  onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                  className="bg-gray-50 border-gray-200 text-gray-800 text-sm min-h-[60px]"
                  data-testid="input-email-signature"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Script Tone</Label>
                <Select
                  value={settings.phoneScriptTone}
                  onValueChange={(v) => setSettings({ ...settings, phoneScriptTone: v as any })}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-9" data-testid="select-phone-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Template</Label>
                <Select
                  value={settings.emailTemplate}
                  onValueChange={(v) => setSettings({ ...settings, emailTemplate: v as any })}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-9" data-testid="select-email-template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Industries</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {INDUSTRIES.map((industry) => (
                    <Badge
                      key={industry}
                      variant={settings.targetIndustries.includes(industry) ? "default" : "outline"}
                      className={`cursor-pointer text-xs transition-all ${
                        settings.targetIndustries.includes(industry)
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                          : "border-gray-300 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9"
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
            className="h-auto rounded-none border-r border-gray-200 bg-white hover:bg-gray-50 text-gray-400"
            data-testid="button-toggle-sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200/50">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900" data-testid="text-page-title">
                {settings.agentName}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5" data-testid="text-agent-status">
                <Activity className="w-3 h-3" />
                {isLoading ? (
                  <span className="text-amber-600 font-medium">
                    {activeTask === "pipeline" ? `Running pipeline — ${pipelineStep || "Processing"}...` : "Processing..."}
                  </span>
                ) : (
                  <span className="text-emerald-600">Ready — Trade & Sourcing Intelligence</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs h-8"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Settings
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
                  {/* Welcome */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-200/40">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Smart Sourcing Agent</h2>
                  <p className="text-sm text-gray-500 mb-8 text-center max-w-md">
                    Your AI-powered trade intelligence assistant. Search leads, analyze markets, assess risks, and optimize your supply chain.
                  </p>

                  {/* Capabilities */}
                  <div className="grid grid-cols-5 gap-3 w-full mb-8">
                    {CAPABILITIES.map((cap) => (
                      <div key={cap.label} className={`flex flex-col items-center text-center p-3 rounded-xl ${cap.bg} border ${cap.border} transition-all hover:shadow-sm`}>
                        <cap.icon className={`w-5 h-5 ${cap.color} mb-2`} />
                        <span className="text-xs font-medium text-gray-800 leading-tight">{cap.label}</span>
                        <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">{cap.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div className="w-full">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Try asking
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {SUGGESTION_CHIPS.map((chip) => (
                        <button
                          key={chip.label}
                          onClick={() => handleSuggestionClick(chip.label)}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all text-left group"
                        >
                          <chip.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                          <span>{chip.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : ""}`}>
                        {msg.role === "agent" && (
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                              <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">{settings.agentName}</span>
                            <span className="text-[10px] text-gray-400">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-800 rounded-tl-md shadow-sm"
                          }`}
                        >
                          {msg.type === "leads" && msg.data && Array.isArray(msg.data) && msg.data.length > 0 ? (
                            <div>
                              <p className="mb-3">{msg.content}</p>
                              <div className="space-y-2">
                                {msg.data.slice(0, 5).map((lead: Lead) => (
                                  <div key={lead.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                                      <p className="text-xs text-gray-500 truncate">{lead.title} at {lead.company}</p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2 shrink-0">
                                      {lead.score != null && (
                                        <Badge className="bg-blue-100 text-blue-700 text-[10px] mr-1">{lead.score}</Badge>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handlePrepareCall(lead)}
                                        disabled={isLoading}
                                        className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                        data-testid={`button-call-${lead.id}`}
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handlePrepareEmail(lead)}
                                        disabled={isLoading}
                                        className="h-7 w-7 p-0 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                                        data-testid={`button-email-${lead.id}`}
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : msg.type === "call" || msg.type === "email" ? (
                            <div>
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                                {msg.type === "call" ? <Phone className="w-4 h-4 text-blue-500" /> : <Mail className="w-4 h-4 text-indigo-500" />}
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  {msg.type === "call" ? "Call Script" : "Email Draft"}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopyToClipboard(msg.content)}
                                  className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                              <div className="whitespace-pre-wrap text-gray-700">{msg.content}</div>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          )}
                        </div>
                        {msg.role === "user" && (
                          <p className="text-[10px] text-gray-400 mt-1 text-right">
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pipeline Progress */}
                  {activeTask === "pipeline" && pipelineStep && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-500">Pipeline Progress</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-4 shadow-sm">
                          <div className="space-y-3">
                            {PIPELINE_STEPS.map((step, idx) => {
                              const isCompleted = completedPipelineSteps.includes(step.key);
                              const isCurrent = step.key === pipelineStep;
                              const isPending = !isCompleted && !isCurrent;
                              return (
                                <div key={step.key} className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 ${
                                    isCompleted ? "bg-emerald-100" : isCurrent ? "bg-blue-100" : "bg-gray-100"
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    ) : isCurrent ? (
                                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    ) : (
                                      <step.icon className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium transition-colors ${
                                      isCompleted ? "text-emerald-700" : isCurrent ? "text-blue-700" : "text-gray-400"
                                    }`}>
                                      {step.label}
                                    </p>
                                    <p className={`text-xs ${
                                      isCompleted ? "text-emerald-500" : isCurrent ? "text-blue-500" : "text-gray-400"
                                    }`}>
                                      {isCompleted ? "Complete" : isCurrent ? step.desc : "Waiting"}
                                    </p>
                                  </div>
                                  {idx < PIPELINE_STEPS.length - 1 && (
                                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? "text-emerald-400" : "text-gray-300"}`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing indicator */}
                  {isLoading && activeTask !== "pipeline" && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Contextual Suggestions (shown when chat has messages) */}
            {chatMessages.length > 0 && !isLoading && (
              <div className="px-6 pb-2 flex gap-2 overflow-x-auto shrink-0">
                {SUGGESTION_CHIPS.slice(0, 4).map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleSuggestionClick(chip.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all whitespace-nowrap shrink-0"
                  >
                    <chip.icon className="w-3 h-3" />
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="border-t border-gray-200 bg-white px-6 py-3 shrink-0">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    id="chat-input"
                    value={chatInput}
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    placeholder="Search leads, research companies, analyze markets..."
                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 pr-24 h-11 rounded-xl text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                    disabled={isLoading}
                    data-testid="input-search-leads"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRunPipeline}
                      disabled={isLoading || !chatInput.trim()}
                      className="h-8 px-2.5 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Run full pipeline"
                      data-testid="button-run-pipeline"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Pipeline
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleChatSubmit}
                  disabled={isLoading || !chatInput.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 px-5 rounded-xl shadow-md shadow-blue-200/30"
                  data-testid="button-search-leads"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel — Insights & Results */}
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto hidden lg:block">
            <div className="p-4 space-y-4">
              {/* Proactive Insights */}
              <div>
                <button
                  onClick={() => setInsightsExpanded(!insightsExpanded)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Market Intelligence
                  </h3>
                  {insightsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                {insightsExpanded && (
                  <div className="space-y-2.5">
                    {PROACTIVE_INSIGHTS.map((insight, idx) => (
                      <div key={idx} className={`p-3 rounded-xl ${insight.bg} border ${insight.border} transition-all hover:shadow-sm`}>
                        <div className="flex items-start gap-2.5">
                          <insight.icon className={`w-4 h-4 ${insight.color} mt-0.5 shrink-0`} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${insight.badgeColor} text-[10px] px-1.5 py-0 font-medium border-0`}>
                                {insight.title}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{insight.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setChatInput("Find top suppliers"); document.getElementById("chat-input")?.focus(); }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                    data-testid="card-action-search"
                  >
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[11px] font-medium text-gray-600 group-hover:text-blue-700">Find Leads</span>
                  </button>
                  <button
                    onClick={() => {
                      if (leads.length === 0) {
                        toast.error("Search for leads first.");
                        document.getElementById("chat-input")?.focus();
                      } else {
                        handlePrepareCall(leads[0]);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                    data-testid="card-action-call"
                  >
                    <Phone className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[11px] font-medium text-gray-600 group-hover:text-blue-700">Call Script</span>
                  </button>
                  <button
                    onClick={() => {
                      if (leads.length === 0) {
                        toast.error("Search for leads first.");
                        document.getElementById("chat-input")?.focus();
                      } else {
                        handlePrepareEmail(leads[0]);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                    data-testid="card-action-email"
                  >
                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-[11px] font-medium text-gray-600 group-hover:text-indigo-700">Email Draft</span>
                  </button>
                  <button
                    onClick={() => { setChatInput("Research "); document.getElementById("chat-input")?.focus(); }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                    data-testid="card-action-research"
                  >
                    <Building2 className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-[11px] font-medium text-gray-600 group-hover:text-indigo-700">Research</span>
                  </button>
                </div>
              </div>

              {/* Leads Summary */}
              {leads.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Leads
                    <Badge className="bg-indigo-100 text-indigo-700 text-[10px] ml-auto border-0">{leads.length}</Badge>
                  </h3>
                  <div className="space-y-1.5">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group" data-testid={`row-lead-${lead.id}`}>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-800 truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{lead.company}</p>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" onClick={() => handlePrepareCall(lead)} disabled={isLoading} className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handlePrepareEmail(lead)} disabled={isLoading} className="h-6 w-6 p-0 text-gray-400 hover:text-indigo-600">
                            <Mail className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Content */}
              {outputs.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Generated Content
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px] ml-auto border-0">{outputs.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {outputs.slice(0, 5).map((output) => (
                      <div key={output.id} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors" data-testid={`card-output-${output.id}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            {output.type === "call" ? <Phone className="w-3 h-3 text-blue-500" /> : <Mail className="w-3 h-3 text-indigo-500" />}
                            <span className="text-[11px] font-medium text-gray-700">
                              {output.type === "call" ? "Call" : "Email"} — {output.leadName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Select value={output.status} onValueChange={(v) => updateOutputStatus(output.id, v as any)}>
                              <SelectTrigger className="w-16 h-5 text-[10px] border-gray-200 bg-white px-1.5" data-testid={`select-status-${output.id}`}>
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
                              className={`text-[9px] px-1 py-0 capitalize ${
                                output.status === "sent"
                                  ? "border-emerald-300 text-emerald-600"
                                  : output.status === "ready"
                                  ? "border-blue-300 text-blue-600"
                                  : "border-gray-300 text-gray-500"
                              }`}
                              data-testid={`badge-status-${output.id}`}
                            >
                              {output.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{output.content.slice(0, 120)}...</p>
                        <div className="flex justify-end mt-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyToClipboard(output.content)}
                            className="h-5 px-1.5 text-[10px] text-gray-400 hover:text-gray-600"
                            data-testid={`button-copy-${output.id}`}
                          >
                            <Copy className="w-2.5 h-2.5 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
