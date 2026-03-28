import { loadStripe } from '@stripe/stripe-js';

export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY',
  priceId: 'price_REPLACE_WITH_YOUR_STRIPE_PRICE_ID',
  successUrl: `${window.location.origin}/dashboard?welcome=true`,
  cancelUrl: `${window.location.origin}/join`,
} as const;

export const getStripe = () => loadStripe(STRIPE_CONFIG.publishableKey);
