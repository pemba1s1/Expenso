import { Request, Response } from 'express';
import {
  getMonthlyExpenseSummary,
  getMonthlyInsight
} from '../services/expenseSummary.service';
import { User } from '@prisma/client';
import { getMonthStartEndDates } from '../utils/date';

export const monthlyExpenseSummaryController = async (req: Request, res: Response) => {
  const { year, month, groupId } = req.query;
  const user: User = req.user as User;

  if (!year || !month) {
    res.status(400).json({ error: 'Year and month are required' });
    return;
  }

  const {startDate, endDate} = getMonthStartEndDates(year as string, month as string);

  if (startDate > new Date()) {
    res.status(400).json({ error: 'Cannot fetch summary for future months' });
    return;
  }

  try {
    const summary = await getMonthlyExpenseSummary(
      startDate,
      endDate,
      user.subscriptionPlan,
      user.id,
      groupId as string | undefined
    );
    res.status(200).json(summary);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export const monthlyInsightController = async (req: Request, res: Response) => {
  const { groupId, year, month, newInsight } = req.query;
  const user: User = req.user as User;

  if (!year || !month) {
    res.status(400).json({ error: 'Year and month are required' });
    return;
  }

  try {
    const insight = await getMonthlyInsight(
      month as string,
      year as string,
      newInsight ? newInsight === 'true' : false,
      user.id,
      groupId as string | undefined
    );
    res.status(200).json(insight);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}
