import prisma from '../config/prismaClient';
import { CreateExpenseInput } from '../types/types';

export const createExpense = async ({ userId, groupId, amount, receiptImage, details }: CreateExpenseInput) => {
  try {
    const expense = await prisma.expense.create({
      data: {
        userId,
        groupId,
        amount,
        receiptImage,
        details: JSON.stringify(details),
        status: groupId ? 'pending' : undefined,
      },
    });
  
    return expense;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};
