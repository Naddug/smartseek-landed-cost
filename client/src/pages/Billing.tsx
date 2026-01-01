import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, CreditCard, Zap, Package, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Billing() {
  const { user, ledger, upgradeToPro, buyCredits } = useStore();
  const { toast } = useToast();

  const handleUpgrade = () => {
    upgradeToPro();
    toast({
      title: "Welcome to Pro!",
      description: "You've been upgraded and received 30 credits.",
    });
  };

  const handleTopUp = (packId: 'pack_25' | 'pack_100' | 'pack_250', amount: number) => {
    buyCredits(packId);
    toast({
      title: "Credits Added",
      description: `Successfully added ${amount} credits to your account.`,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground">Manage your subscription, credit balance, and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance Card */}
        <Card className="bg-sidebar-primary text-sidebar-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold mb-2">{user?.credits}</div>
            <div className="text-sm opacity-80">Credits Available</div>
            {user?.plan === 'pro' && (
               <div className="mt-4 pt-4 border-t border-white/20 text-sm">
                 Next refill: {user.nextRefillDate} (+30)
               </div>
            )}
          </CardContent>
        </Card>

        {/* Current Plan Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the <span className="font-bold text-primary capitalize">{user?.plan} Plan</span></CardDescription>
              </div>
              {user?.plan === 'free' ? (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Upgrade Recommended</Badge>
              ) : (
                <Badge className="bg-primary text-primary-foreground">Active Pro Member</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
             {user?.plan === 'free' ? (
               <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                 <div className="space-y-1">
                   <div className="font-bold text-lg">Upgrade to Pro - $10/mo</div>
                   <div className="text-sm text-muted-foreground">Get 30 monthly credits + Premium Shortlists access.</div>
                 </div>
                 <Button onClick={handleUpgrade}>Upgrade Now</Button>
               </div>
             ) : (
               <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                 <div className="space-y-1">
                   <div className="font-bold text-lg">Pro Subscription Active</div>
                   <div className="text-sm text-muted-foreground">Your next billing date is {user?.nextRefillDate}.</div>
                 </div>
                 <Button variant="outline" disabled>Manage Subscription</Button>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList>
          <TabsTrigger value="topup">Buy Credits</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="topup" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CreditPackCard 
              amount={25} 
              price={10} 
              popular={false} 
              onBuy={() => handleTopUp('pack_25', 25)} 
            />
            <CreditPackCard 
              amount={100} 
              price={35} 
              popular={true} 
              onBuy={() => handleTopUp('pack_100', 100)} 
            />
            <CreditPackCard 
              amount={250} 
              price={75} 
              popular={false} 
              onBuy={() => handleTopUp('pack_250', 250)} 
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Credit Ledger</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No transactions yet.</TableCell>
                    </TableRow>
                  ) : (
                    ledger.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell className="capitalize">
                          <Badge variant="outline" className={
                            tx.type === 'spend' ? 'text-red-500 border-red-200' : 
                            tx.type === 'earn' ? 'text-green-500 border-green-200' :
                            'text-blue-500 border-blue-200'
                          }>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-mono font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreditPackCard({ amount, price, popular, onBuy }: { amount: number, price: number, popular: boolean, onBuy: () => void }) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${popular ? 'border-primary shadow-md' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
          BEST VALUE
        </div>
      )}
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">{amount} Credits</CardTitle>
        <CardDescription>One-time purchase</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-2xl font-bold mb-4">${price}</div>
        <ul className="text-sm text-muted-foreground space-y-2 mb-6">
          <li className="flex items-center justify-center gap-2"><Check size={14} className="text-green-500"/> Valid forever</li>
          <li className="flex items-center justify-center gap-2"><Check size={14} className="text-green-500"/> Use for any tool</li>
        </ul>
        <Button className="w-full" variant={popular ? 'default' : 'outline'} onClick={onBuy}>
          Buy Pack
        </Button>
      </CardContent>
    </Card>
  );
}