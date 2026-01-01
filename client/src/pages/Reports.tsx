import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Download, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { user, reports, spendCredits } = useStore();
  const { toast } = useToast();

  const handleDownload = (reportTitle: string) => {
    if (user?.credits !== undefined && user.credits < 1) {
       toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "PDF export costs 1 credit.",
      });
      return;
    }

    if (spendCredits(1, `PDF Export: ${reportTitle}`)) {
      toast({
        title: "Downloading...",
        description: "Your PDF report is being generated.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Reports</h1>
          <p className="text-muted-foreground">Manage your generated sourcing intelligence.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search reports..." />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg">No reports yet</h3>
              <p className="text-muted-foreground mb-4">Start a Smart Finder search to generate your first report.</p>
              <Button variant="outline" onClick={() => window.location.href='/smart-finder'}>Go to Smart Finder</Button>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{report.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.category}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open('/sample-report', '_blank')}>
                    <Download className="w-4 h-4 mr-2" /> PDF (1 Credit)
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}