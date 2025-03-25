import Stripe from 'stripe';
import { config } from '../config/env';
import { StripePlan, SubscriptionInterval } from '@prisma/client';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const createCustomer = async (email: string, name: string) => {
  return await stripe.customers.create({
    email,
    name,
  });
};

export const fetchCustomer = async (customerId: string) => {
  return await stripe.customers.retrieve(customerId);
};

export const createSubscription = async (customerId: string, plan: StripePlan) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: plan.priceId }],
  });

  return subscription;
};

