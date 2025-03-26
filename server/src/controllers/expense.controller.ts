import { Request, Response } from 'express';
import { createExpense, approveExpense, getUserExpenses, getExpenseById, deleteExpense, createReceipt } from '../services/expense.service';
import { User } from '@prisma/client';
import { uploadImageToS3 } from '../utils/s3';
import { getReceiptData } from '../utils/openai';
import { getCategoryByName } from '../services/category.service';
import { getMonthStartEndDates } from '../utils/date';

export interface ReceiptItem {
  category: string;
  price: number;
  name: string;
}

export interface Expense {
  id: string;
  userId: string;
  groupId: string | null;
  amount: number;
  description: string | null;
  receiptImageUrl: string | null;
  categoryId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  receiptId: string | null;
}

export const addExpenseFromReceiptController = async (req: Request, res: Response) => {
  const { groupId } = req.body;
  const user: User = req.user as User;
  const receiptImage = req.file;

  // TODO: fix user able to add expenses to a group they are not a member of
  if (!groupId) {
    res.status(400).json({ error: 'Group ID is missing' });
    return;
  }

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    if (!receiptImage) {
      res.status(400).json({ error: 'No receipt image provided' });
      return;
    }

    // save image to s3 and get image url
    const imageUrl = await uploadImageToS3(receiptImage.buffer);
    const receiptData = await getReceiptData(imageUrl);

    // Validate receipt data
    if (!receiptData.rawExtractedData.items?.length) {
      res.status(400).json({ error: 'No items found in receipt' });
      return;
    }

    // Create expenses and collect them
    const allExpensesFromReceipt: Expense[] = [];
    
    try {
      // Add each item as a separate expense
      for (const item of receiptData.rawExtractedData.items as ReceiptItem[]) {
        if (!item.category) {
          res.status(400).json({ error: 'Failed to extract category from receipt item' });
          return;
        }

        const category = await getCategoryByName(item.category) as { id: string };
        const expense = await createExpense({
          userId: user.id,
          groupId,
          amount: item.price.toString(),
          receiptImageUrl: imageUrl,
          categoryId: category.id,
          description: item.name,
        });
        
        allExpensesFromReceipt.push(expense);
      }

      // Validate we have expenses before creating receipt
      if (allExpensesFromReceipt.length === 0) {
        throw new Error('No expenses were created from the receipt');
      }

      // Create receipt only if we have successfully created all expenses
      const receipt = await createReceipt({
        userId: user.id,
        groupId,
        expensesIds: allExpensesFromReceipt.map((expense: { id: string }) => expense.id),
        totalAmount: allExpensesFromReceipt.reduce((sum, expense) => sum + expense.amount, 0),
        taxAmount: receiptData.rawExtractedData.tax,
        receiptImageUrl: imageUrl,
      });

      if (!receipt) {
        throw new Error('Failed to create receipt');
      }

      return res.status(200).json({ 
        message: 'All expenses from the receipt added successfully',
        expenseCount: allExpensesFromReceipt.length,
        receiptId: receipt.id
      });
    } catch (error) {
      // If any operation fails, let the outer try-catch handle it
      // This will trigger a rollback in the database
      throw error;
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const addIndividualExpenseController = async (req: Request, res: Response) => {
  // TODO: IDOR - user can add expenses to a group they are not a member of
  const { amount, groupId, description, receiptImage, categoryName } = req.body;
  const user: User = req.user as User;

  if (!amount || !description || !groupId || !categoryName) {
    res.status(400).json({ error: 'Amount, details, and group ID are required' });
    return;
  }

  let receiptImageUrl = "";
  if (receiptImage) {
    // save image to s3 and get image url
    receiptImageUrl = await uploadImageToS3(receiptImage.buffer);
  }

  try {
    const expense = await createExpense({
      userId: user.id,
      groupId,
      amount: amount.toString(),
      receiptImageUrl,
      categoryId: await getCategoryByName(categoryName).then((category: { id: string }) => category.id),
      description,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.log(error);
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

export const deleteExpenseController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user: User = req.user as User;

  if (!id) {
    res.status(400).json({ error: 'Expense ID is missing' });
    return;
  }

  try {
    const expense = await deleteExpense(user.id, id);
    res.status(200).json(expense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getUserExpensesController = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const { groupId, month, year } = req.query;
  
  if (!month || !year) {
    res.status(400).json({ error: 'Month and year are required' });
    return;
  }

  const {startDate, endDate} = getMonthStartEndDates(year as string, month as string);

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const expenses = await getUserExpenses(user.id, startDate, endDate, groupId as string);
    res.status(200).json(expenses);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getExpenseByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user: User = req.user as User;

  if (!id) {
    res.status(400).json({ error: 'Expense ID is missing' });
    return;
  }

  try {
    const expense = await getExpenseById(user.id, id);
    res.status(200).json(expense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
