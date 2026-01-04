import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, CreditCard, Zap, Loader2, ExternalLink, Gift, Calendar, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface UserProfile {
  userId: string;
  plan: 'free' | 'monthly';
  monthlyCredits: number;
  topupCredits: number;
  hasUsedFreeTrial: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
}

interface CreditTransaction {
  id: number;
  amount: number;
  type: string;
  creditSource: string;
  description: string;
  createdAt: string;
}

export default function Billing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [creditQuantity, setCreditQuantity] = useState(1);

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
  });

  const { data: transactions = [] } = useQuery<CreditTransaction[]>({
    queryKey: ['/api/credits/transactions'],
  });

  const { data: products } = useQuery<{ products: any[] }>({
    queryKey: ['/api/stripe/products'],
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const res = await apiRequest('POST', '/api/stripe/create-subscription-checkout', { priceId });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const creditMutation = useMutation({
    mutationFn: async ({ priceId, quantity }: { priceId: string; quantity: number }) => {
      const res = await apiRequest('POST', '/api/stripe/create-credit-checkout', { priceId, quantity });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/stripe/create-portal-session');
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  // Handle success/cancel from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'subscription') {
      toast({
        title: "Subscription Active!",
        description: "Welcome to SmartSeek Monthly! You now have 10 credits.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      window.history.replaceState({}, '', '/billing');
    } else if (params.get('success') === 'credits') {
      const quantity = params.get('quantity') || '1';
      toast({
        title: "Credits Purchased!",
        description: `Successfully added ${quantity} credit(s) to your account.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      window.history.replaceState({}, '', '/billing');
    } else if (params.get('canceled')) {
      toast({
        title: "Checkout Canceled",
        description: "Your checkout was canceled. No charges were made.",
      });
      window.history.replaceState({}, '', '/billing');
    }
  }, [location, toast, queryClient]);

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  const isSubscribed = profile?.plan === 'monthly' && profile?.subscriptionStatus === 'active';

  // Find prices from Stripe products
  const monthlyPrice = products?.products?.find(p => p.metadata?.type === 'subscription')?.prices?.[0];
  const creditPrice = products?.products?.find(p => p.metadata?.type === 'credit')?.prices?.[0];

  const handleSubscribe = () => {
    if (monthlyPrice?.id) {
      subscriptionMutation.mutate(monthlyPrice.id);
    } else {
      toast({
        title: "Products Not Available",
        description: "Stripe products haven't been set up yet. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handleBuyCredits = () => {
    if (creditPrice?.id) {
      creditMutation.mutate({ priceId: creditPrice.id, quantity: creditQuantity });
    } else {
      toast({
        title: "Products Not Available",
        description: "Stripe products haven't been set up yet. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto" data-testid="billing-page">
      <div>
        <h1 className="text-3xl font-heading font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground">Manage your subscription and credit balance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance Card */}
        <Card className="bg-sidebar-primary text-sidebar-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">Credit Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold mb-2" data-testid="text-total-credits">{totalCredits}</div>
            <div className="text-sm opacity-80">Total Credits Available</div>
            <div className="mt-4 pt-4 border-t border-white/20 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="opacity-80">Monthly credits:</span>
                <span className="font-medium" data-testid="text-monthly-credits">{profile?.monthlyCredits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Top-up credits:</span>
                <span className="font-medium" data-testid="text-topup-credits">{profile?.topupCredits || 0}</span>
              </div>
            </div>
            {isSubscribed && profile?.currentPeriodEnd && (
              <div className="mt-4 pt-4 border-t border-white/20 text-sm flex items-center gap-2">
                <Calendar size={14} className="opacity-80" />
                <span className="opacity-80">Next refresh:</span>
                <span className="font-medium">
                  {new Date(profile.currentPeriodEnd).toLocaleDateString()}
                </span>
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
                <CardDescription>
                  {isSubscribed ? (
                    <>You're on the <span className="font-bold text-primary">Monthly Plan</span></>
                  ) : (
                    <>You're on the <span className="font-bold text-amber-600">Free Trial</span></>
                  )}
                </CardDescription>
              </div>
              {isSubscribed ? (
                <Badge className="bg-primary text-primary-foreground">Active Subscriber</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  <Gift size={12} className="mr-1" />
                  Free Trial
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                <div className="space-y-1">
                  <div className="font-bold text-lg">Monthly Plan - $80/month</div>
                  <div className="text-sm text-muted-foreground">
                    10 credits refreshed each billing month. Cancel anytime.
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => portalMutation.mutate()}
                  disabled={portalMutation.isPending}
                  data-testid="button-manage-subscription"
                >
                  {portalMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage Subscription
                  <ExternalLink size={14} className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift size={18} className="text-primary" />
                    <span className="font-bold text-lg">Free Trial: {profile?.topupCredits || 2} Credits</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every new user gets 2 free credits to try SmartSeek. No credit card required.
                  </p>
                </div>
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-bold text-lg">Upgrade to Monthly - $80/month</div>
                    <div className="text-sm text-muted-foreground">
                      Get 10 credits refreshed every month. Cancel anytime.
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubscribe}
                    disabled={subscriptionMutation.isPending}
                    data-testid="button-subscribe"
                  >
                    {subscriptionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Subscribe Now
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList>
          <TabsTrigger value="topup" data-testid="tab-buy-credits">Buy Credits</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="topup" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pay-as-you-go Card */}
            <Card className="border-primary shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Pay-as-you-go Credits</CardTitle>
                <CardDescription>$10 per credit - Never expires</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-4">
                  ${(10 * creditQuantity).toFixed(0)}
                </div>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCreditQuantity(Math.max(1, creditQuantity - 1))}
                    disabled={creditQuantity <= 1}
                    data-testid="button-decrease-credits"
                  >
                    <Minus size={16} />
                  </Button>
                  <div className="text-2xl font-bold w-16 text-center" data-testid="text-credit-quantity">
                    {creditQuantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCreditQuantity(creditQuantity + 1)}
                    data-testid="button-increase-credits"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center justify-center gap-2">
                    <Check size={14} className="text-green-500"/> Credits never expire
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check size={14} className="text-green-500"/> Use for any sourcing report
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check size={14} className="text-green-500"/> Buy anytime you need more
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={handleBuyCredits}
                  disabled={creditMutation.isPending}
                  data-testid="button-buy-credits"
                >
                  {creditMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy {creditQuantity} Credit{creditQuantity > 1 ? 's' : ''} - ${(10 * creditQuantity).toFixed(0)}
                </Button>
              </CardContent>
            </Card>

            {/* How Credits Work Card */}
            <Card>
              <CardHeader>
                <CardTitle>How Credits Work</CardTitle>
                <CardDescription>Understanding your credit system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Credit Deduction Order</h4>
                  <p className="text-sm text-muted-foreground">
                    When you generate a report, monthly credits are used first. 
                    Top-up credits are only used after monthly credits are exhausted.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Monthly Credits</h4>
                  <p className="text-sm text-muted-foreground">
                    With the Monthly Plan ($80/mo), you get 10 credits refreshed each billing cycle. 
                    Monthly credits do <strong>not</strong> roll over.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Top-up Credits</h4>
                  <p className="text-sm text-muted-foreground">
                    Pay-as-you-go credits at $10 each. These credits <strong>never expire</strong> 
                    and roll over indefinitely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No transactions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                        <TableCell>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell className="capitalize">
                          <Badge variant="outline" className={
                            tx.type === 'spend' ? 'text-red-500 border-red-200' : 
                            tx.type === 'topup' ? 'text-blue-500 border-blue-200' :
                            tx.type === 'subscription_refresh' ? 'text-green-500 border-green-200' :
                            'text-purple-500 border-purple-200'
                          }>
                            {tx.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {tx.creditSource || '-'}
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
