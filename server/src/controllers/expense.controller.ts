import { Request, Response } from 'express';
import { createExpense } from '../services/expense.service';
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
      throw new Error('No receipt image provided');
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
