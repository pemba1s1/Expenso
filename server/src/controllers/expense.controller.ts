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
  amount: number;
  description: string | null;
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

    try {
      // Calculate total amount from items
      const totalAmount = receiptData.rawExtractedData.items.reduce(
        (sum: number, item: ReceiptItem) => sum + item.price,
        0
      );

      // Create receipt first
      const receipt = await createReceipt({
        userId: user.id,
        groupId,
        totalAmount,
        taxAmount: receiptData.rawExtractedData.tax,
        receiptImageUrl: imageUrl,
      });

      if (!receipt) {
        throw new Error('Failed to create receipt');
      }

      // Create expenses with receipt ID
      const allExpensesFromReceipt: Expense[] = [];

      for (const item of receiptData.rawExtractedData.items as ReceiptItem[]) {
        if (!item.category) {
          throw new Error('Failed to extract category from receipt item');
        }

        const category = await getCategoryByName(item.category) as { id: string };
        const expense = await createExpense({
          amount: item.price.toString(),
          categoryId: category.id,
          description: item.name,
          receiptId: receipt.id,
        });

        allExpensesFromReceipt.push(expense);
      }

      return res.status(200).json({
        message: 'Receipt and expenses created successfully',
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

  try {
    // Get category ID first
    const category = await getCategoryByName(categoryName) as { id: string };

    // Create a receipt if there's a receipt image
    let receiptId: string | undefined;
    let imageUrl: string | undefined;
    if (receiptImage) {
      const imageUrl = await uploadImageToS3(receiptImage.buffer);
    }
    const receipt = await createReceipt({
      userId: user.id,
      groupId,
      totalAmount: parseFloat(amount),
      taxAmount: 0, // Individual expenses don't typically have tax info
      receiptImageUrl: imageUrl ? imageUrl : '',
    });
    receiptId = receipt.id;


    // Create the expense with optional receipt ID
    const expense = await createExpense({
      amount: amount.toString(),
      categoryId: category.id,
      description,
      receiptId,
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

  if (!id) {
    res.status(400).json({ error: 'Expense ID is missing' });
    return;
  }

  try {
    const expense = await deleteExpense(id);
    res.status(200).json(expense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getUserExpensesController = async (req: Request, res: Response) => {
  const { groupId, month, year } = req.query;
  const user: User = req.user as User;

  if (!month || !year) {
    res.status(400).json({ error: 'Month and year are required' });
    return;
  }

  if (!user.id) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { startDate, endDate } = getMonthStartEndDates(year as string, month as string);

  try {
    const receipts = await getUserExpenses(
      user.id,
      startDate,
      endDate,
      groupId as string | undefined
    );
    res.status(200).json(receipts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getExpenseByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Expense ID is missing' });
    return;
  }

  try {
    const expense = await getExpenseById(id);
    res.status(200).json(expense);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
