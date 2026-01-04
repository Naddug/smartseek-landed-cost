import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  quantity: number;
  type: 'credit' | 'subscription';
}

function PaymentForm({ onSuccess, onCancel, quantity, type }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const res = await apiRequest('POST', '/api/stripe/confirm-payment', { 
        paymentIntentId, 
        quantity 
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/transactions'] });
      onSuccess();
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
        confirmMutation.mutate(paymentIntent.id);
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
        onSuccess();
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
        <div className="text-sm text-red-500 flex items-center gap-2">
          <XCircle size={16} />
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

interface EmbeddedCheckoutProps {
  type: 'credit' | 'subscription';
  quantity?: number;
  priceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmbeddedCheckout({ 
  type, 
  quantity = 1, 
  priceId,
  onSuccess, 
  onCancel 
}: EmbeddedCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [intentError, setIntentError] = useState<string | null>(null);

  const { data: config } = useQuery<{ publishableKey: string }>({
    queryKey: ['/api/stripe/config'],
  });

  const createPaymentIntent = useMutation({
    mutationFn: async () => {
      if (type === 'credit') {
        const res = await apiRequest('POST', '/api/stripe/create-payment-intent', { quantity });
        return res.json();
      } else {
        const res = await apiRequest('POST', '/api/stripe/create-embedded-subscription', { priceId });
        return res.json();
      }
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setLoadingIntent(false);
    },
    onError: (err: Error) => {
      setIntentError(err.message || 'Failed to initialize payment');
      setLoadingIntent(false);
    },
  });

  useState(() => {
    createPaymentIntent.mutate();
  });

  if (loadingIntent) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (intentError) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{intentError}</p>
          <Button variant="outline" onClick={onCancel} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret || !config?.publishableKey) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground mt-4">Setting up payment...</p>
        </CardContent>
      </Card>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0070f3',
      borderRadius: '8px',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === 'credit' 
            ? `Purchase ${quantity} Credit${quantity > 1 ? 's' : ''}`
            : 'Subscribe to Monthly Plan'}
        </CardTitle>
        <CardDescription>
          {type === 'credit'
            ? `$${quantity * 10} - Credits never expire`
            : '$80/month - 10 credits refreshed each billing cycle'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements 
          stripe={loadStripe(config.publishableKey)} 
          options={{ clientSecret, appearance }}
        >
          <PaymentForm 
            onSuccess={onSuccess} 
            onCancel={onCancel}
            quantity={quantity}
            type={type}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}

export function PaymentSuccess({ 
  message, 
  onClose 
}: { 
  message: string; 
  onClose: () => void;
}) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={onClose} data-testid="button-payment-done">
          Done
        </Button>
      </CardContent>
    </Card>
  );
}
