import { Request, Response } from 'express';
import {
  getExpenseSummaryForCustomDateRange,
  getMonthlyExpenseSummary,
  getMonthlyInsight
} from '../services/expenseSummary.service';
import { User } from '@prisma/client';

export const customDateExpenseSummaryController = async (req: Request, res: Response) => {
  const { startDate, endDate, groupId } = req.query;
  const user: User = req.user as User;

  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Start date and end date are required' });
    return;
  }

  try {
    const summary = await getExpenseSummaryForCustomDateRange(new Date(startDate as string), new Date(endDate as string), user.subscriptionPlan, groupId as string);
    res.status(200).json(summary);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};


export const monthlyExpenseSummaryController = async (req: Request, res: Response) => {
  const { year, month, groupId } = req.query;
  const user: User = req.user as User;

  try {
    const summary = await getMonthlyExpenseSummary(Number(year), Number(month), user.subscriptionPlan, groupId as string);
    res.status(200).json(summary);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export const monthlyInsightController = async (req: Request, res: Response) => {
  const { groupId, year, month } = req.query;

  if (!groupId || !year || !month) {
    res.status(400).json({ error: 'Group ID, year, and month are required' });
    return;
  }

  try {
    const insight = await getMonthlyInsight(groupId as string, new Date(Number(year), Number(month) - 1));
    res.status(200).json(insight);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}
