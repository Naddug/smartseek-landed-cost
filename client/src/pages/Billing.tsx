import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, CreditCard, Zap, Loader2, ExternalLink, Gift, Calendar, Plus, Minus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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

function CheckoutForm({ 
  onSuccess, 
  onCancel, 
  quantity, 
  type,
  subscriptionId
}: { 
  onSuccess: () => void; 
  onCancel: () => void; 
  quantity: number;
  type: 'credit' | 'subscription';
  subscriptionId?: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const confirmCreditMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const res = await apiRequest('POST', '/api/stripe/confirm-payment', { 
        paymentIntentId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/transactions'] });
      onSuccess();
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to confirm payment');
    },
  });

  const confirmSubscriptionMutation = useMutation({
    mutationFn: async (subId: string) => {
      const res = await apiRequest('POST', '/api/stripe/confirm-subscription', { 
        subscriptionId: subId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/transactions'] });
      onSuccess();
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to confirm subscription');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      if (type === 'credit') {
        confirmCreditMutation.mutate(paymentIntent.id);
      } else if (subscriptionId) {
        confirmSubscriptionMutation.mutate(subscriptionId);
      } else {
        setError('Missing subscription ID');
      }
    } else {
      setError('Payment was not completed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
          data-testid="button-cancel-payment"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1"
          data-testid="button-confirm-payment"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {type === 'credit' 
            ? `Pay $${quantity * 10}` 
            : 'Subscribe - $80/month'}
        </Button>
      </div>
    </form>
  );
}

export default function Billing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const [creditQuantity, setCreditQuantity] = useState(1);
  const [checkoutType, setCheckoutType] = useState<'credit' | 'subscription' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
  });

  const { data: transactions = [] } = useQuery<CreditTransaction[]>({
    queryKey: ['/api/billing/transactions'],
  });

  // Poll credits when returning from successful payment (redirect flow)
  const paymentSuccess = params.get('success') || params.get('payment') === 'success';
  const initialCreditsRef = useRef<number | null>(null);
  if (paymentSuccess && initialCreditsRef.current === null) {
    initialCreditsRef.current = totalCredits;
  }
  useEffect(() => {
    if (!paymentSuccess) return;
    let intervalId: ReturnType<typeof setInterval>;
    const baseline = initialCreditsRef.current ?? totalCredits;
    const poll = async () => {
      try {
        const res = await fetch('/api/user/credits', { credentials: 'include' });
        if (res.ok) {
          const { credits } = await res.json();
          refetchProfile();
          if (credits > baseline) {
            window.history.replaceState({}, '', '/billing');
            if (intervalId) clearInterval(intervalId);
          }
        }
      } catch { /* ignore */ }
    };
    intervalId = setInterval(poll, 3000);
    poll(); // run immediately
    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      window.history.replaceState({}, '', '/billing');
    }, 30000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeout);
    };
  }, [paymentSuccess, refetchProfile, totalCredits]);

  const { data: products, isLoading: productsLoading } = useQuery<{ products: any[] }>({
    queryKey: ['/api/stripe/products'],
  });

  const { data: stripeConfig, isLoading: stripeConfigLoading } = useQuery<{ publishableKey: string }>({
    queryKey: ['/api/stripe/config'],
  });

  const stripePromise = useMemo(() => {
    if (!stripeConfig?.publishableKey) return null;
    return loadStripe(stripeConfig.publishableKey);
  }, [stripeConfig?.publishableKey]);

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

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  const isSubscribed = profile?.plan === 'monthly' && profile?.subscriptionStatus === 'active';

  const { data: subscriptionPrices } = useQuery<{ monthly: string | null; annual: string | null }>({
    queryKey: ['/api/stripe/subscription-prices'],
  });
  const monthlyPrice = products?.products?.find(p => p.metadata?.type === 'subscription')?.prices?.[0];
  const creditPrice = products?.products?.find(p => p.metadata?.type === 'credit')?.prices?.[0];
  const subscriptionPriceId = billingInterval === 'annual' && subscriptionPrices?.annual
    ? subscriptionPrices.annual
    : (monthlyPrice?.id || subscriptionPrices?.monthly);
  
  const checkoutReady = !productsLoading && !stripeConfigLoading && stripePromise !== null;

  const startCreditCheckout = async () => {
    if (!checkoutReady) {
      toast({
        title: "Loading",
        description: "Please wait while we load the checkout...",
        variant: "default",
      });
      return;
    }
    setLoadingCheckout(true);
    try {
      const res = await apiRequest('POST', '/api/stripe/create-payment-intent', { quantity: creditQuantity });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.clientSecret) {
        throw new Error("Failed to initialize payment. Please try again.");
      }
      setClientSecret(data.clientSecret);
      setCheckoutType('credit');
    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
    setLoadingCheckout(false);
  };

  const startSubscriptionCheckout = async () => {
    if (!checkoutReady) {
      toast({
        title: "Loading",
        description: "Please wait while we load the checkout...",
        variant: "default",
      });
      return;
    }
    if (!subscriptionPriceId) {
      toast({
        title: "Products Not Available",
        description: "Subscription product hasn't been set up yet. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }
    setLoadingCheckout(true);
    try {
      const res = await apiRequest('POST', '/api/stripe/create-embedded-subscription', { 
        priceId: subscriptionPriceId 
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.clientSecret) {
        throw new Error("Failed to initialize subscription. Please try again.");
      }
      setClientSecret(data.clientSecret);
      setSubscriptionId(data.subscriptionId);
      setCheckoutType('subscription');
    } catch (err: any) {
      toast({
        title: "Subscription Error",
        description: err.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
    setLoadingCheckout(false);
  };

  const handlePaymentSuccess = () => {
    setClientSecret(null);
    if (checkoutType === 'credit') {
      setShowSuccess(`Successfully purchased ${creditQuantity} credit${creditQuantity > 1 ? 's' : ''}!`);
    } else {
      setShowSuccess('Welcome to SmartSeek Monthly! You now have 10 credits.');
    }
    setCheckoutType(null);
    queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    queryClient.invalidateQueries({ queryKey: ['/api/credits/transactions'] });
  };

  const handleCheckoutCancel = () => {
    setClientSecret(null);
    setCheckoutType(null);
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
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBillingInterval('monthly')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        billingInterval === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingInterval('annual')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        billingInterval === 'annual' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Annual
                      <span className="text-xs bg-emerald-500/90 text-white px-1.5 py-0.5 rounded">Save 20%</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-bold text-lg">
                        {billingInterval === 'annual' ? (
                          <>$64/mo <span className="text-sm font-normal text-muted-foreground">billed as $768/year</span></>
                        ) : (
                          <>$80/month</>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Get 10 credits refreshed every month. Cancel anytime.
                      </div>
                    </div>
                    <Button 
                      onClick={startSubscriptionCheckout}
                      disabled={loadingCheckout || !checkoutReady}
                      data-testid="button-subscribe"
                    >
                      {(loadingCheckout || !checkoutReady) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Compare plans and choose what works for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Feature</TableHead>
                  <TableHead className="text-center">Free</TableHead>
                  <TableHead className="text-center">Pro Monthly</TableHead>
                  <TableHead className="text-center">Pro Annual</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Credits</TableCell>
                  <TableCell className="text-center">2 trial</TableCell>
                  <TableCell className="text-center">10/mo</TableCell>
                  <TableCell className="text-center">10/mo</TableCell>
                  <TableCell className="text-center">Custom</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Price</TableCell>
                  <TableCell className="text-center">$0</TableCell>
                  <TableCell className="text-center">$80/mo</TableCell>
                  <TableCell className="text-center">$64/mo</TableCell>
                  <TableCell className="text-center">Contact</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">AI Reports</TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Find Leads</TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Support</TableCell>
                  <TableCell className="text-center">Community</TableCell>
                  <TableCell className="text-center">Email</TableCell>
                  <TableCell className="text-center">Email</TableCell>
                  <TableCell className="text-center">Dedicated</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList>
          <TabsTrigger value="topup" data-testid="tab-buy-credits">Buy Credits</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="topup" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onClick={startCreditCheckout}
                  disabled={loadingCheckout || !checkoutReady}
                  data-testid="button-buy-credits"
                >
                  {(loadingCheckout || !checkoutReady) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy {creditQuantity} Credit{creditQuantity > 1 ? 's' : ''} - ${(10 * creditQuantity).toFixed(0)}
                </Button>
              </CardContent>
            </Card>

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

      <Dialog open={!!clientSecret && !!checkoutType} onOpenChange={() => handleCheckoutCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {checkoutType === 'credit' 
                ? `Purchase ${creditQuantity} Credit${creditQuantity > 1 ? 's' : ''}`
                : 'Subscribe to Monthly Plan'}
            </DialogTitle>
          </DialogHeader>
          {clientSecret && stripePromise && (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret, 
                appearance: { 
                  theme: 'stripe',
                  variables: { colorPrimary: '#0070f3', borderRadius: '8px' }
                } 
              }}
            >
              <CheckoutForm 
                onSuccess={handlePaymentSuccess} 
                onCancel={handleCheckoutCancel}
                quantity={creditQuantity}
                type={checkoutType || 'credit'}
                subscriptionId={subscriptionId}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!showSuccess} onOpenChange={() => setShowSuccess(null)}>
        <DialogContent className="sm:max-w-md">
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-6">{showSuccess}</p>
            <Button onClick={() => setShowSuccess(null)} data-testid="button-payment-done">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
