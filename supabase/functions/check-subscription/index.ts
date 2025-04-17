
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user?.email) {
      throw new Error('User not authenticated');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the user's subscriber record
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!subscriber?.stripe_customer_id) {
      // User is on free plan
      return new Response(
        JSON.stringify({
          tier: 'free',
          limits: {
            storage_limit: 524288000, // 500MB
            max_file_size: 104857600, // 100MB
            retention_days: 7,
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check Stripe subscription status
    const subscriptions = await stripe.subscriptions.list({
      customer: subscriber.stripe_customer_id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      // No active subscription, revert to free plan
      await supabaseClient
        .from('subscribers')
        .update({
          subscription_tier: 'free',
          storage_limit: 524288000, // 500MB
          max_file_size: 104857600, // 100MB
          file_retention_days: 7,
          password_protection: false,
          advanced_sharing: false,
          team_collaboration: false,
          advanced_security: false,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({
          tier: 'free',
          limits: {
            storage_limit: 524288000,
            max_file_size: 104857600,
            retention_days: 7,
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get the current subscription
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;

    // Define plan limits based on price
    let planLimits;
    if (priceId === 'price_pro') { // You'll need to replace with your actual price IDs
      planLimits = {
        tier: 'pro',
        storage_limit: 26843545600, // 25GB
        max_file_size: 2147483648, // 2GB
        retention_days: 30,
        password_protection: true,
        advanced_sharing: true,
      };
    } else if (priceId === 'price_business') { // You'll need to replace with your actual price IDs
      planLimits = {
        tier: 'business',
        storage_limit: 107374182400, // 100GB
        max_file_size: 10737418240, // 10GB
        retention_days: 365,
        password_protection: true,
        advanced_sharing: true,
        team_collaboration: true,
        advanced_security: true,
      };
    }

    // Update subscriber record with current plan limits
    await supabaseClient
      .from('subscribers')
      .update({
        subscription_tier: planLimits.tier,
        ...planLimits,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({
        tier: planLimits.tier,
        limits: planLimits,
        subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
