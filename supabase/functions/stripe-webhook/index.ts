// Supabase Edge Function: Stripe Webhook Handler
// Deploy with: supabase functions deploy stripe-webhook
//
// Required secrets (set via Supabase Dashboard > Edge Functions > Secrets):
//   STRIPE_SECRET_KEY     - sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET - whsec_...
//
// Stripe webhook events to configure (in Stripe Dashboard > Webhooks):
//   - checkout.session.completed
//   - customer.subscription.updated
//   - customer.subscription.deleted
//   - invoice.payment_failed

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyStripeSignature(body: string, signature: string): Promise<any> {
  // Simple Stripe signature verification
  const crypto = globalThis.crypto;
  const encoder = new TextEncoder();

  const parts = signature.split(',').reduce((acc: Record<string, string>, part: string) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const expectedSig = parts['v1'];
  const payload = `${timestamp}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(STRIPE_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const computedSig = Array.from(new Uint8Array(signed))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (computedSig !== expectedSig) {
    throw new Error('Invalid signature');
  }

  return JSON.parse(body);
}

async function updateMembership(stripeCustomerId: string, status: string, subscriptionId?: string, periodEnd?: number) {
  const update: Record<string, any> = {
    membership_status: status,
  };
  if (subscriptionId) update.stripe_subscription_id = subscriptionId;
  if (periodEnd) update.subscription_end = new Date(periodEnd * 1000).toISOString();

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('stripe_customer_id', stripeCustomerId);

  if (error) console.error('Failed to update membership:', error);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await verifyStripeSignature(body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId) {
          await supabase.from('profiles').update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            membership_status: 'active',
          }).eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : 'canceled';

        await updateMembership(
          subscription.customer,
          status,
          subscription.id,
          subscription.current_period_end
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await updateMembership(subscription.customer, 'canceled');
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await updateMembership(invoice.customer, 'past_due');
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
