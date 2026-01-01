import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";

export default function Shortlists() {
  const { user, shortlists } = useStore();
  const isPro = user?.plan === 'pro';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Curated Shortlists</h1>
          <p className="text-muted-foreground">Vetted suppliers by category. Hand-picked by our experts.</p>
        </div>
        {!isPro && (
          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Lock size={16} />
            Upgrade to Pro to access Premium lists
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shortlists.map((list) => {
          const isLocked = list.isPremium && !isPro;
          
          return (
            <Card key={list.id} className={`flex flex-col ${isLocked ? 'opacity-75' : ''} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={list.isPremium ? "default" : "secondary"}>
                    {list.isPremium ? 'Premium' : 'Free'}
                  </Badge>
                  {isLocked ? <Lock size={18} className="text-muted-foreground" /> : <Unlock size={18} className="text-green-500" />}
                </div>
                <CardTitle className="text-xl">{list.title}</CardTitle>
                <div className="text-sm text-muted-foreground font-normal">{list.category}</div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{list.itemCount}</span> Vetted Suppliers
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={isLocked ? "outline" : "default"} disabled={isLocked}>
                  {isLocked ? "Unlock with Pro" : "View Suppliers"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}