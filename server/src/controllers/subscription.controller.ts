import { Request, Response } from 'express';
import { createCustomer, createSubscription, fetchCustomer } from '../services/stripe.service';
import prisma from '../config/prismaClient';
import { User } from '@prisma/client';

export const subscribeUser = async (req: Request, res: Response) => {
  const { planName } = req.body;
  const user = req.user as User;

  let plan = await prisma.stripePlan.findFirst({
    where: { name: planName },
  });

  if (!plan) {
    res.status(400).json({ error: 'Invalid plan name' });
    return;
  }

  try {
    let customer;
    if (user.stripeCustomerId) customer = await fetchCustomer(user.stripeCustomerId);

    if (!customer) customer = await createCustomer(user.email, user.name);
    
    const subscription = await createSubscription(customer.id, plan);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: customer.id,
        stripeSubscription: JSON.stringify(subscription),
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPlan: plan.type,
        subscriptionInterval: plan.interval,
        subscriptionStartDate: new Date(subscription.current_period_start * 1000),
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      },
    });

    res.status(200).json({ message: 'Subscription created successfully', subscription });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
