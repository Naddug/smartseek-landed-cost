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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1"
          data-testid="button-confirm-payment"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {type === 'credit'
            ? t("billing.checkout.payButton", { amount: quantity * 10 })
            : t("billing.checkout.subscribeButton")}
        </Button>
      </div>
    </form>
  );
}

export default function Billing() {
  const { t } = useTranslation();
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

  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);

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
        title: t("common.loading"),
        description: t("billing.checkout.loadingMessage"),
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
        throw new Error(t("billing.error.initializePaymentFailed"));
      }
      setClientSecret(data.clientSecret);
      setCheckoutType('credit');
    } catch (err: any) {
      toast({
        title: t("billing.error.checkoutErrorTitle"),
        description: err.message || t("billing.error.startCheckoutFailed"),
        variant: "destructive",
      });
    }
    setLoadingCheckout(false);
  };

  const startSubscriptionCheckout = async () => {
    if (!checkoutReady) {
      toast({
        title: t("common.loading"),
        description: t("billing.checkout.loadingMessage"),
        variant: "default",
      });
      return;
    }
    if (!subscriptionPriceId) {
      toast({
        title: t("billing.error.productsNotAvailable"),
        description: t("billing.error.subscriptionNotSetup"),
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
        throw new Error(t("billing.error.initializeSubscriptionFailed"));
      }
      setClientSecret(data.clientSecret);
      setSubscriptionId(data.subscriptionId);
      setCheckoutType('subscription');
    } catch (err: any) {
      toast({
        title: t("billing.error.subscriptionErrorTitle"),
        description: err.message || t("billing.error.startCheckoutFailed"),
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
        <h1 className="text-3xl font-heading font-bold">{t("billing.page.title")}</h1>
        <p className="text-muted-foreground">{t("billing.page.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-sidebar-primary text-sidebar-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">{t("billing.creditBalance.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold mb-2" data-testid="text-total-credits">{totalCredits}</div>
            <div className="text-sm opacity-80">{t("billing.creditBalance.subtitle")}</div>
            <div className="mt-4 pt-4 border-t border-white/20 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="opacity-80">{t("billing.creditBalance.monthlyLabel")}</span>
                <span className="font-medium" data-testid="text-monthly-credits">{profile?.monthlyCredits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">{t("billing.creditBalance.topupLabel")}</span>
                <span className="font-medium" data-testid="text-topup-credits">{profile?.topupCredits || 0}</span>
              </div>
            </div>
            {isSubscribed && profile?.currentPeriodEnd && (
              <div className="mt-4 pt-4 border-t border-white/20 text-sm flex items-center gap-2">
                <Calendar size={14} className="opacity-80" />
                <span className="opacity-80">{t("billing.creditBalance.nextRefreshLabel")}</span>
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
                <CardTitle>{t("billing.currentPlan.title")}</CardTitle>
                <CardDescription>
                  {isSubscribed ? (
                    <>{t("billing.currentPlan.monthlyText")}</>
                  ) : (
                    <>{t("billing.currentPlan.freeTrialText")}</>
                  )}
                </CardDescription>
              </div>
              {isSubscribed ? (
                <Badge className="bg-primary text-primary-foreground">{t("billing.currentPlan.activeBadge")}</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  <Gift size={12} className="mr-1" />
                  {t("billing.currentPlan.freeBadge")}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                <div className="space-y-1">
                  <div className="font-bold text-lg">{t("billing.plans.monthlyTitle")}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("billing.plans.monthlyDescription")}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => portalMutation.mutate()}
                  disabled={portalMutation.isPending}
                  data-testid="button-manage-subscription"
                >
                  {portalMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("billing.plans.manageButton")}
                  <ExternalLink size={14} className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift size={18} className="text-primary" />
                    <span className="font-bold text-lg">{t("billing.plans.freeCreditsBadge", { count: profile?.topupCredits || 2 })}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("billing.plans.freeTrialDescription")}
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
                      {t("billing.interval.monthly")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingInterval('annual')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        billingInterval === 'annual' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t("billing.interval.annual")}
                      <span className="text-xs bg-emerald-500/90 text-white px-1.5 py-0.5 rounded">{t("billing.interval.saveBadge")}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-bold text-lg">
                        {billingInterval === 'annual' ? (
                          <>{t("billing.plans.annualPrice")}</>
                        ) : (
                          <>{t("billing.plans.monthlyPrice")}</>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("billing.plans.refreshDescription")}
                      </div>
                    </div>
                    <Button
                      onClick={startSubscriptionCheckout}
                      disabled={loadingCheckout || !checkoutReady}
                      data-testid="button-subscribe"
                    >
                      {loadingCheckout && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {!checkoutReady ? t("common.loading") : t("billing.plans.subscribeButton")}
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
          <CardTitle>{t("billing.comparison.title")}</CardTitle>
          <CardDescription>{t("billing.comparison.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">{t("billing.comparison.featureHeader")}</TableHead>
                  <TableHead className="text-center">{t("billing.comparison.freeHeader")}</TableHead>
                  <TableHead className="text-center">{t("billing.comparison.monthlyHeader")}</TableHead>
                  <TableHead className="text-center">{t("billing.comparison.annualHeader")}</TableHead>
                  <TableHead className="text-center">{t("billing.comparison.enterpriseHeader")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{t("billing.comparison.creditsRow")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.freeCredits")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.monthlyCredits")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.annualCredits")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.enterpriseCredits")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t("billing.comparison.priceRow")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.freePrice")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.monthlyPriceValue")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.annualPriceValue")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.enterprisePrice")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t("billing.comparison.aiReportsRow")}</TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t("billing.comparison.findLeadsRow")}</TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check size={16} className="inline text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t("billing.comparison.supportRow")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.freeSupport")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.monthlySupport")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.annualSupport")}</TableCell>
                  <TableCell className="text-center">{t("billing.comparison.enterpriseSupport")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList>
          <TabsTrigger value="topup" data-testid="tab-buy-credits">{t("billing.tabs.buyCreditsTab")}</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">{t("billing.tabs.historyTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="topup" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">{t("billing.credits.title")}</CardTitle>
                <CardDescription>{t("billing.credits.subtitle")}</CardDescription>
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
                    <Check size={14} className="text-green-500"/> {t("billing.credits.neverExpiresFeature")}
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check size={14} className="text-green-500"/> {t("billing.credits.useAnyReportFeature")}
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check size={14} className="text-green-500"/> {t("billing.credits.buyAnytimeFeature")}
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={startCreditCheckout}
                  disabled={loadingCheckout || !checkoutReady}
                  data-testid="button-buy-credits"
                >
                  {loadingCheckout && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("billing.credits.buyButton", { count: creditQuantity, s: creditQuantity > 1 ? 's' : '', amount: (10 * creditQuantity).toFixed(0) })}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("billing.creditsInfo.title")}</CardTitle>
                <CardDescription>{t("billing.creditsInfo.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">{t("billing.creditsInfo.deductionTitle")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("billing.creditsInfo.deductionDescription")}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">{t("billing.creditsInfo.monthlyTitle")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("billing.creditsInfo.monthlyDescription")}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">{t("billing.creditsInfo.topupTitle")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("billing.creditsInfo.topupDescription")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader><CardTitle>{t("billing.history.title")}</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billing.history.dateHeader")}</TableHead>
                    <TableHead>{t("billing.history.descriptionHeader")}</TableHead>
                    <TableHead>{t("billing.history.typeHeader")}</TableHead>
                    <TableHead>{t("billing.history.sourceHeader")}</TableHead>
                    <TableHead className="text-right">{t("billing.history.amountHeader")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t("billing.history.noTransactions")}
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
                ? t("billing.checkout.purchaseTitle", { count: creditQuantity, s: creditQuantity > 1 ? 's' : '' })
                : t("billing.checkout.subscribeTitle")}
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
            <h3 className="text-xl font-bold mb-2">{t("billing.success.title")}</h3>
            <p className="text-muted-foreground mb-6">{showSuccess}</p>
            <Button onClick={() => setShowSuccess(null)} data-testid="button-payment-done">
              {t("common.done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
