// ============================================
// STRIPE CONFIGURATION
// Replace these values with your Stripe account details
// ============================================

const STRIPE_CONFIG = {
  // Get this from: https://dashboard.stripe.com/apikeys
  publishableKey: 'pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY',

  // Create a product + price in Stripe Dashboard:
  // 1. Go to https://dashboard.stripe.com/products
  // 2. Click "+ Add product"
  // 3. Name: "UPWC Community Membership"
  // 4. Price: $40.00 / year (recurring)
  // 5. Copy the Price ID (starts with price_)
  priceId: 'price_REPLACE_WITH_YOUR_STRIPE_PRICE_ID',

  // After successful payment, redirect here
  successUrl: window.location.origin + '/dashboard?welcome=true',
  cancelUrl: window.location.origin + '/join',
};
