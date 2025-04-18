
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: number;
  priceId: string;
  features: PlanFeature[];
}

// Note: These are placeholder price IDs - you need to replace them with real ones from your Stripe dashboard
const plans: Plan[] = [
  {
    name: 'Free',
    price: 0,
    priceId: '', // Free plan doesn't need a price ID
    features: [
      { text: '500MB storage', included: true },
      { text: 'Max file size: 100MB', included: true },
      { text: 'Basic sharing options', included: true },
      { text: '7-day file retention', included: true },
    ],
  },
  {
    name: 'Pro',
    price: 9,
    // Replace with your actual Stripe price ID from your Stripe dashboard
    priceId: 'price_example_pro', // ⚠️ REPLACE THIS with your actual Pro plan price ID
    features: [
      { text: '25GB storage', included: true },
      { text: 'Max file size: 2GB', included: true },
      { text: 'Advanced sharing controls', included: true },
      { text: 'Password protection', included: true },
      { text: '30-day file retention', included: true },
    ],
  },
  {
    name: 'Business',
    price: 29,
    // Replace with your actual Stripe price ID from your Stripe dashboard
    priceId: 'price_example_business', // ⚠️ REPLACE THIS with your actual Business plan price ID
    features: [
      { text: '100GB storage', included: true },
      { text: 'Max file size: 10GB', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'Advanced security features', included: true },
      { text: 'Unlimited file retention', included: true },
      { text: 'Priority support', included: true },
    ],
  },
];

export const SubscriptionManager = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);
      // Add loading state indicator
      toast.loading('Creating checkout session...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        setErrorDetails(JSON.stringify(error, null, 2));
        setShowErrorDialog(true);
        toast.error('Failed to start checkout process');
        throw error;
      }
      
      if (data?.url) {
        toast.success('Redirecting to checkout...');
        window.location.href = data.url;
      } else {
        const errorMsg = 'No checkout URL returned';
        setErrorDetails(JSON.stringify(data, null, 2));
        setShowErrorDialog(true);
        toast.error(errorMsg);
        console.error(errorMsg, data);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Save detailed error information
      if (error instanceof Error) {
        setErrorDetails(JSON.stringify(error, null, 2));
      } else {
        setErrorDetails(String(error));
      }
      setShowErrorDialog(true);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscriptionLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select the plan that best fits your needs
        </p>
        <div className="mt-4 max-w-xl mx-auto bg-amber-50 border border-amber-200 p-4 rounded-md">
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 text-left">
              <strong>Important:</strong> This is a demonstration. Before using, replace the placeholder price IDs in the code with your actual Stripe price IDs from your Stripe dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            {subscription?.tier === plan.name.toLowerCase() ? (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                disabled={!plan.priceId || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.price === 0 ? 'Get Started' : 'Subscribe'
                )}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Error Details Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout Error Details</DialogTitle>
            <DialogDescription>
              There was an error processing your checkout request. Please share these details with support:
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px]">
            <pre className="text-xs whitespace-pre-wrap break-words">{errorDetails}</pre>
          </div>
          
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
