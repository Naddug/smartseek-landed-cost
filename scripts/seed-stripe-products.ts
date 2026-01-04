import { getUncachableStripeClient } from '../server/stripeClient';

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating SmartSeek Stripe products...');

  // Check if products already exist
  const existingProducts = await stripe.products.search({ query: "name:'SmartSeek Monthly'" });
  if (existingProducts.data.length > 0) {
    console.log('Products already exist, skipping seed.');
    return;
  }

  // 1. Monthly Subscription Product - $80/month with 10 credits
  const monthlyProduct = await stripe.products.create({
    name: 'SmartSeek Monthly',
    description: 'Monthly subscription with 10 credits refreshed each billing month',
    metadata: {
      type: 'subscription',
      credits_per_month: '10',
    },
  });

  const monthlyPrice = await stripe.prices.create({
    product: monthlyProduct.id,
    unit_amount: 8000, // $80.00
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: {
      type: 'monthly_subscription',
    },
  });

  console.log(`Created Monthly Subscription: ${monthlyProduct.id} with price ${monthlyPrice.id}`);

  // 2. Credit Pack Product - $10 per credit (pay-as-you-go)
  const creditProduct = await stripe.products.create({
    name: 'SmartSeek Credit',
    description: 'Additional credit for SmartSeek reports - never expires',
    metadata: {
      type: 'credit',
      credits_per_unit: '1',
    },
  });

  const creditPrice = await stripe.prices.create({
    product: creditProduct.id,
    unit_amount: 1000, // $10.00 per credit
    currency: 'usd',
    metadata: {
      type: 'credit_purchase',
    },
  });

  console.log(`Created Credit Product: ${creditProduct.id} with price ${creditPrice.id}`);

  console.log('\n=== Products Created Successfully ===');
  console.log('Monthly Subscription Price ID:', monthlyPrice.id);
  console.log('Credit Purchase Price ID:', creditPrice.id);
  console.log('\nAdd these to your environment or config as needed.');
}

seedProducts().catch(console.error);
