
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
    priceId: 'price_pro', // Replace with your actual Stripe price ID
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
    priceId: 'price_business', // Replace with your actual Stripe price ID
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

  const { data: subscription, isLoading } = useQuery({
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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    }
  };

  if (isLoading) {
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
                disabled={!plan.priceId}
              >
                {plan.price === 0 ? 'Get Started' : 'Subscribe'}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
