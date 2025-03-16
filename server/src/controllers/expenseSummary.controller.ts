import { Request, Response } from 'express';
import { getExpenseSummary } from '../services/expenseSummary.service';

export const expenseSummaryController = async (req: Request, res: Response) => {
  const { startDate, endDate, groupId } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Start date and end date are required' });
    return;
  }

  try {
    const summary = await getExpenseSummary(new Date(startDate as string), new Date(endDate as string), groupId as string);
    res.status(200).json(summary);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
