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

export const approveExpense = async (expenseId: string, adminId: string) => {
  try {
    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'approved', approvedBy: adminId },
    });

    return expense;
  } catch (error) {
    throw new Error('Failed to approve expense');
  }
};
