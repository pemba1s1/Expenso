import Stripe from 'stripe';
import { config } from './src/config/env';
import { StripePlanName, SubscriptionInterval, UserRole } from '@prisma/client';
import prisma from './src/config/prismaClient';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const products = [
  {
    name: StripePlanName.PREMIUM_MONTHLY,
    description: "Premium subscription (Monthly)",
    amount: 300,
    currency: "usd",
    type: UserRole.PREMIUM,
    interval: SubscriptionInterval.MONTH
  },
  {
    name: StripePlanName.PREMIUM_SEMI_ANNUALLY,
    description: "Premium subscription (Semi-Annual)",
    amount: Math.round(300 * 6 * 0.95), // 5% off
    currency: "usd",
    type: UserRole.PREMIUM,
    interval: SubscriptionInterval.SEMI_ANNUAL
  },
  {
    name: StripePlanName.PREMIUM_ANNUALLY,
    description: "Premium subscription (Annual)",
    amount: Math.round(300 * 12 * 0.85), // 15% off
    currency: "usd",
    type: UserRole.PREMIUM,
    interval: SubscriptionInterval.YEAR
  },
  {
    name: StripePlanName.BUSINESS_PREMIUM_MONTHLY,
    description: "Business Premium subscription (Monthly)",
    amount: 3000, // This will be multiplied by the number of members when creating the price
    currency: "usd",
    type: UserRole.BUSINESS_PREMIUM,
    interval: SubscriptionInterval.MONTH
  },
  {
    name: StripePlanName.BUSINESS_PREMIUM_SEMI_ANNUALLY,
    description: "Business Premium subscription (Semi-Annual)",
    amount: Math.round(3000 * 6 * 0.95), // This will be multiplied by the number of members when creating the price
    currency: "usd",
    type: UserRole.BUSINESS_PREMIUM,
    interval: SubscriptionInterval.SEMI_ANNUAL
  },
  {
    name: StripePlanName.BUSINESS_PREMIUM_ANNUALLY,
    description: "Business Premium subscription (Annual)",
    amount: Math.round(3000 * 12 * 0.85), // This will be multiplied by the number of members when creating the price
    currency: "usd",
    type: UserRole.BUSINESS_PREMIUM,
    interval: SubscriptionInterval.YEAR
  }
];

console.log("Creating Stripe Plans");

products.forEach(async (productData) => {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      // Add other product fields as needed
    });

    // If your products have pricing, create a price object
    if (productData.amount) {
      const interval = productData.interval === SubscriptionInterval.YEAR ? 'year' : 'month';
      const interval_count = productData.interval === SubscriptionInterval.SEMI_ANNUAL ? 6 : 1;
      await stripe.prices.create({
        unit_amount: productData.amount,
        currency: productData.currency,
        product: product.id,
        recurring: {
          interval,
          interval_count,
        },
        // Add other price fields as needed
      });

      // Add the products to our database
      await prisma.stripePlan.create({
        data: {
          id: product.id,
          name: productData.name,
          description: productData.description,
          amount: productData.amount.toString(),
          currency: productData.currency,
          type: productData.type,
          interval: productData.interval
        }
      });

      console.log(`Product ${productData.name} created successfully`);
    }
    console.log("Stripe Plans Created Successfully");
  } catch (error) {
    console.error('Error creating product:', error);
  }
});
