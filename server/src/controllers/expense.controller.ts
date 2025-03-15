import { Request, Response } from 'express';
import { createExpense, approveExpense } from '../services/expense.service';
import { processReceiptImage } from '../utils/receipt';
import { User } from '@prisma/client';

export const addExpenseController = async (req: Request, res: Response) => {
  const { groupId } = req.body;
  const user: User = req.user as User;
  const receiptImage = req.file;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    if (!receiptImage) {
      res.status(400).json({ error: 'No receipt image provided' });
      return;
    }

    // Process the receipt image and get the S3 URL
    const {amount, receiptImageUrl, details} = await processReceiptImage(receiptImage.buffer);
    
    // Create the expense
    const expense = await createExpense({ userId: user.id, groupId, amount, receiptImage: receiptImageUrl, details });

    res.status(201).json(expense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const approveExpenseController = async (req: Request, res: Response) => {
  const { expenseId } = req.body;
  const user: User = req.user as User;

  try {
    const expense = await approveExpense(expenseId, user.id);
    res.status(200).json(expense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

