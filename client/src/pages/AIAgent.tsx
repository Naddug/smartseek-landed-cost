import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Bot, 
  Sparkles, 
  Building2, 
  BarChart3, 
  Calculator, 
  FileText,
  Loader2,
  Copy,
  Save,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Globe,
  Package
} from "lucide-react";
import { toast } from "sonner";

interface TaskCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  task: string;
}

interface AIResult {
  id: string;
  task: string;
  query: string;
  timestamp: Date;
  data: {
    summary?: string;
    stats?: { label: string; value: string; trend?: string }[];
    table?: { headers: string[]; rows: string[][] };
    list?: string[];
    images?: string[];
  };
}

const taskCategories: TaskCategory[] = [
  {
    id: "suppliers",
    title: "Find Suppliers",
    description: "Discover and evaluate suppliers globally",
    icon: <Building2 className="w-6 h-6" />,
    task: "supplier"
  },
  {
    id: "analysis",
    title: "Analyze Trade Data",
    description: "Get insights on trade patterns and trends",
    icon: <BarChart3 className="w-6 h-6" />,
    task: "analysis"
  },
  {
    id: "costs",
    title: "Calculate Costs",
    description: "Estimate landed costs, duties, and shipping",
    icon: <Calculator className="w-6 h-6" />,
    task: "costs"
  },
  {
    id: "reports",
    title: "Generate Reports",
    description: "Create professional sourcing reports",
    icon: <FileText className="w-6 h-6" />,
    task: "reports"
  }
];

export default function AIAgent() {
  const [query, setQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AIResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTaskClick = (task: TaskCategory) => {
    setSelectedTask(task.task);
    setQuery(`Help me ${task.title.toLowerCase()}`);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          task: selectedTask || "general",
          query: query.trim(),
          context: {}
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to process request");
      }

      const data = await response.json();
      
      const newResult: AIResult = {
        id: Date.now().toString(),
        task: selectedTask || "general",
        query: query,
        timestamp: new Date(),
        data: data
      };

      setResults(prev => [newResult, ...prev]);
      setQuery("");
      setSelectedTask(null);
      toast.success("Analysis complete!");
    } catch (err) {
      clearInterval(progressInterval);
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleCopy = async (result: AIResult) => {
    const text = JSON.stringify(result.data, null, 2);
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSave = (result: AIResult) => {
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-agent-result-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Result saved");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 p-8 rounded-2xl border border-slate-500/30 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/30">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-page-title">
              AI Agent
            </h1>
            <p className="text-slate-300 text-lg">
              Your autonomous trade intelligence assistant
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-slate-600/50 border-slate-500/40 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you need help with..."
                className="min-h-[120px] bg-slate-700/50 border-slate-500/50 text-white placeholder:text-slate-400 resize-none text-lg focus:border-slate-400 focus:ring-slate-400"
                disabled={isLoading}
                data-testid="input-query"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-400">
                {selectedTask && (
                  <Badge variant="outline" className="border-slate-500 text-slate-300 bg-slate-700/50">
                    Task: {selectedTask}
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !query.trim()}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500 text-white border-0 shadow-lg px-6 py-3"
                data-testid="button-submit"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isLoading ? "Processing..." : "Send"}
              </Button>
            </div>
            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-slate-700" />
                <p className="text-sm text-slate-400 text-center">
                  Analyzing your request... {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Quick Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskCategories.map((task) => (
            <Card
              key={task.id}
              onClick={() => !isLoading && handleTaskClick(task)}
              className={`cursor-pointer transition-all duration-200 bg-slate-600/40 border-slate-500/40 hover:bg-slate-600/60 hover:border-slate-400/50 hover:shadow-lg ${
                selectedTask === task.task ? "ring-2 ring-slate-400 bg-slate-600/70" : ""
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              data-testid={`card-task-${task.id}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/30 text-slate-200">
                    {task.icon}
                  </div>
                  <h3 className="font-semibold text-slate-100">{task.title}</h3>
                  <p className="text-sm text-slate-400">{task.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-200">Results</h2>
          {results.map((result) => (
            <Card key={result.id} className="bg-slate-600/40 border-slate-500/40 shadow-lg" data-testid={`card-result-${result.id}`}>
              <CardHeader className="border-b border-slate-500/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      {result.query}
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">
                      {result.timestamp.toLocaleString()} • Task: {result.task}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(result)}
                      className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                      data-testid={`button-copy-${result.id}`}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(result)}
                      className="border-slate-500 text-slate-300 hover:bg-slate-500/30"
                      data-testid={`button-save-${result.id}`}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {result.data.summary && (
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-500/30">
                    <p className="text-slate-200 leading-relaxed">{result.data.summary}</p>
                  </div>
                )}

                {result.data.stats && result.data.stats.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.data.stats.map((stat, idx) => (
                      <div key={idx} className="bg-slate-700/40 rounded-lg p-4 border border-slate-500/30">
                        <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                        {stat.trend && (
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">{stat.trend}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {result.data.table && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-500/30">
                          {result.data.table.headers.map((header, idx) => (
                            <TableHead key={idx} className="text-slate-300 font-semibold">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.data.table.rows.map((row, rowIdx) => (
                          <TableRow key={rowIdx} className="border-slate-500/30 hover:bg-slate-600/30">
                            {row.map((cell, cellIdx) => (
                              <TableCell key={cellIdx} className="text-slate-200">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {result.data.list && result.data.list.length > 0 && (
                  <ul className="space-y-2">
                    {result.data.list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-200">
                        <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {result.data.images && result.data.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {result.data.images.map((image, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden border border-slate-500/30">
                        <img src={image} alt={`Result ${idx + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                )}

                {!result.data.summary && !result.data.stats && !result.data.table && !result.data.list && !result.data.images && (
                  <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-500/30">
                    <pre className="text-slate-200 whitespace-pre-wrap text-sm overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !isLoading && (
        <Card className="bg-slate-600/30 border-slate-500/40 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-slate-600/50 flex items-center justify-center mx-auto mb-4 border border-slate-500/30">
              <Bot className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to assist</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Select a task category above or describe what you need help with. I can find suppliers, analyze trade data, calculate costs, and generate reports.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
