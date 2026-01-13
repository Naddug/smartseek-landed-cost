import { useState, useRef } from "react";
import { useProfile } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Bot, 
  Sparkles, 
  Send, 
  Save, 
  Loader2,
  Video,
  Mic,
  MessageSquare,
  FileText,
  BarChart3,
  FlaskConical,
  CheckCircle,
  Copy,
  RefreshCw,
  Building2,
  MapPin,
  Shield,
  Clock,
  Star,
  Globe,
  Users,
  TrendingUp,
  Award,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type AIModel = 'chatgpt' | 'claude' | 'gemini' | 'video' | 'voice';
type FilterTab = 'all' | 'sourcing' | 'analysis' | 'research';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model: AIModel;
  timestamp: Date;
}

interface ParsedContent {
  type: 'text' | 'supplier' | 'structured';
  text?: string;
  supplier?: {
    name?: string;
    location?: string;
    verified?: boolean;
    experience?: string;
    certifications?: string[];
    rating?: string;
    employees?: string;
    products?: string;
    minOrder?: string;
    responseTime?: string;
  };
  sections?: { title: string; content: string }[];
}

const MODEL_CONFIG = {
  chatgpt: { name: 'ChatGPT', subtitle: 'GPT-4o', icon: Sparkles, color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  claude: { name: 'Claude', subtitle: 'Anthropic', icon: Bot, color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
  gemini: { name: 'Gemini', subtitle: 'Google', icon: Sparkles, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  video: { name: 'Video AI', subtitle: 'Coming Soon', icon: Video, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  voice: { name: 'Voice AI', subtitle: 'Coming Soon', icon: Mic, color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30' },
};

function parseResponseContent(content: string): ParsedContent {
  const supplierPatterns = [
    /company\s*name[:\s]+([^\n]+)/i,
    /supplier[:\s]+([^\n]+)/i,
    /manufacturer[:\s]+([^\n]+)/i,
  ];
  
  let supplierName = '';
  for (const pattern of supplierPatterns) {
    const match = content.match(pattern);
    if (match) {
      supplierName = match[1].trim();
      break;
    }
  }
  
  if (supplierName || content.toLowerCase().includes('supplier') || content.toLowerCase().includes('manufacturer')) {
    const locationMatch = content.match(/location[:\s]+([^\n]+)/i) || content.match(/based in[:\s]+([^\n]+)/i);
    const experienceMatch = content.match(/(\d+\+?\s*years?)/i);
    const certMatch = content.match(/certifications?[:\s]+([^\n]+)/i) || content.match(/certified[:\s]+([^\n]+)/i);
    const ratingMatch = content.match(/rating[:\s]+([^\n]+)/i) || content.match(/(\d\.?\d?\s*\/\s*5)/i);
    const employeesMatch = content.match(/employees?[:\s]+([^\n]+)/i) || content.match(/(\d+[\+]?\s*employees)/i);
    
    const certifications: string[] = [];
    if (certMatch) {
      const certs = certMatch[1].split(/[,;]/);
      certs.forEach(c => {
        const cleaned = c.trim();
        if (cleaned && cleaned.length < 30) certifications.push(cleaned);
      });
    }
    if (content.match(/iso\s*\d+/i)) certifications.push('ISO Certified');
    if (content.match(/verified/i) && !certifications.includes('Verified')) certifications.push('Verified');
    
    if (supplierName || certifications.length > 0 || experienceMatch || locationMatch) {
      return {
        type: 'supplier',
        text: content,
        supplier: {
          name: supplierName || 'Supplier Information',
          location: locationMatch?.[1]?.trim(),
          verified: content.toLowerCase().includes('verified'),
          experience: experienceMatch?.[1],
          certifications: [...new Set(certifications)],
          rating: ratingMatch?.[1]?.trim(),
          employees: employeesMatch?.[1]?.trim(),
        }
      };
    }
  }
  
  return { type: 'text', text: content };
}

function SupplierCard({ supplier, fullContent }: { supplier: ParsedContent['supplier']; fullContent: string }) {
  if (!supplier) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-white truncate">{supplier.name}</h4>
          {supplier.location && (
            <div className="flex items-center gap-1 text-slate-400 text-sm mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{supplier.location}</span>
            </div>
          )}
        </div>
      </div>
      
      {(supplier.verified || (supplier.certifications && supplier.certifications.length > 0) || supplier.experience) && (
        <div className="flex flex-wrap gap-2">
          {supplier.verified && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {supplier.experience && (
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
              <Clock className="w-3 h-3 mr-1" />
              {supplier.experience}
            </Badge>
          )}
          {supplier.certifications?.map((cert, idx) => (
            cert !== 'Verified' && (
              <Badge key={idx} className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30">
                <Award className="w-3 h-3 mr-1" />
                {cert}
              </Badge>
            )
          ))}
        </div>
      )}
      
      {(supplier.rating || supplier.employees) && (
        <div className="grid grid-cols-2 gap-3">
          {supplier.rating && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Rating</span>
              </div>
              <p className="text-white font-medium">{supplier.rating}</p>
            </div>
          )}
          {supplier.employees && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Team Size</span>
              </div>
              <p className="text-white font-medium">{supplier.employees}</p>
            </div>
          )}
        </div>
      )}
      
      <Separator className="bg-slate-700/50" />
      
      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
        {fullContent}
      </div>
    </div>
  );
}

function AssistantMessage({ message, onCopy }: { message: Message; onCopy: (content: string) => void }) {
  const config = MODEL_CONFIG[message.model];
  const Icon = config.icon;
  const parsed = parseResponseContent(message.content);
  
  return (
    <div className="flex justify-start" data-testid={`message-${message.id}`}>
      <div className="max-w-[85%] w-full">
        <Card className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 border ${config.borderColor} shadow-lg shadow-black/20 overflow-hidden`}>
          <div className={`${config.bgColor} px-4 py-3 border-b ${config.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 text-xs font-medium shadow-sm`}>
                    {config.name}
                  </Badge>
                  <span className="text-[10px] text-slate-500 ml-2">{config.subtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{format(message.timestamp, 'h:mm a')}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            {parsed.type === 'supplier' && parsed.supplier ? (
              <SupplierCard supplier={parsed.supplier} fullContent={message.content} />
            ) : (
              <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            )}
          </CardContent>
          
          <div className={`${config.bgColor} px-4 py-2 border-t ${config.borderColor}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                {format(message.timestamp, 'MMM d, yyyy')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(message.content)}
                className="h-7 px-3 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
                data-testid={`button-copy-${message.id}`}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Response
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end" data-testid={`message-${message.id}`}>
      <div className="max-w-[75%]">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg shadow-blue-500/20">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className="text-right mt-1">
          <span className="text-[10px] text-slate-500">{format(message.timestamp, 'h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}

export default function AIChatbot() {
  const [selectedModel, setSelectedModel] = useState<AIModel>('chatgpt');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: profile } = useProfile();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    if (selectedModel === 'video' || selectedModel === 'voice') {
      toast.info(`${MODEL_CONFIG[selectedModel].name} is coming soon!`);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      model: selectedModel,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage.content,
          model: selectedModel,
          category: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'No response received.',
        model: selectedModel,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToReports = async () => {
    if (messages.length === 0) {
      toast.error('No conversation to save');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/ai-chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages,
          model: selectedModel,
          category: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save conversation');
      }

      toast.success('Conversation saved to reports!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save conversation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleNewChat = () => {
    setMessages([]);
    setQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">SmartSeek Chat</h1>
              <p className="text-slate-400">AI-powered trade intelligence assistant</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about suppliers, trade data, market analysis..."
                className="pl-12 pr-14 py-6 text-lg bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-ai-chat-query"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!query.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                data-testid="button-send-message"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            {(Object.keys(MODEL_CONFIG) as AIModel[]).map((model) => {
              const config = MODEL_CONFIG[model];
              const Icon = config.icon;
              const isSelected = selectedModel === model;
              const isDisabled = model === 'video' || model === 'voice';
              
              return (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    isSelected 
                      ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-lg` 
                      : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  data-testid={`button-model-${model}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{config.name}</span>
                  <span className="text-xs opacity-75">({config.subtitle})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)} className="w-full">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList className="bg-slate-800/80 border border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-all">
              <MessageSquare className="w-4 h-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="sourcing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-sourcing">
              <FileText className="w-4 h-4 mr-2" />
              Sourcing
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-analysis">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-research">
              <FlaskConical className="w-4 h-4 mr-2" />
              Research
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              data-testid="button-new-chat"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <Button
              onClick={handleSaveToReports}
              disabled={messages.length === 0 || isSaving}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white"
              data-testid="button-save-to-reports"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save to Reports
            </Button>
          </div>
        </div>
      </Tabs>

      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl min-h-[400px]">
        <CardContent className="p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-6 border border-slate-600 shadow-lg">
                <Bot className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Start a Conversation</h3>
              <p className="text-slate-400 max-w-md mb-8">
                Ask me about suppliers, trade data, market analysis, or any trade-related questions.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Find suppliers for electronics', 'Analyze China import trends', 'Compare shipping costs'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                    data-testid={`button-suggestion-${suggestion.slice(0, 10)}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-400" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  message.role === 'user' ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage key={message.id} message={message} onCopy={handleCopy} />
                  )
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600 shadow-lg max-w-[85%]">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${MODEL_CONFIG[selectedModel].color} flex items-center justify-center shadow-md`}>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          </div>
                          <div>
                            <p className="text-slate-300 text-sm font-medium">Generating response...</p>
                            <p className="text-slate-500 text-xs">This may take a moment</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
