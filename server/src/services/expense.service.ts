import { GroupType, Receipt } from '@prisma/client';
import prisma from '../config/prismaClient';
import { logger } from '../utils/logger';

interface ExpenseDetails {
  userId: string,
  groupId: string,
  amount: string,
  receiptImageUrl?: string,
  categoryId: string,
  description?: string,
}

interface ReceiptDetails {
  groupId: string,
  expensesIds: string[],
  userId: string,
  totalAmount: number,
  taxAmount: number,
  receiptImageUrl: string,
}

export const createExpense = async ({
  userId,
  groupId,
  amount,
  receiptImageUrl,
  categoryId,
  description,
}: ExpenseDetails) => {
  try {
    let status: 'pending' | 'approved' | 'rejected' | undefined = undefined;

    if (groupId) {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { id: true, type: true },
      });

      if (!group) {
        throw new Error('Group not found');
      }

      if (group.type === GroupType.BUSINESS) status = 'pending';
    }

    const totalAmount = parseFloat(amount);
    const expense = await prisma.$transaction(async (prisma) => {
      const createdExpense = await prisma.expense.create({
        data: {
          userId,
          groupId,
          categoryId,
          amount: totalAmount,
          receiptImageUrl,
          status,
          description,
        }
      });

      return createdExpense;
    });

    return expense;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const createReceipt = async ({ groupId, expensesIds, userId, totalAmount, taxAmount, receiptImageUrl }: ReceiptDetails) => {
  try {
    const receipt = await prisma.receipt.create({
      data: {
        userId,
        groupId,
        expenses: {
          connect: expensesIds.map(id => ({ id })),
        },
        totalAmount,
        taxAmount,
        receiptImageUrl,
      },
    });

    return receipt;
  } catch (error) {
    logger.error('Failed to create receipt:', error);
    throw new Error('Failed to create receipt');
  }
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  try {
    const expense = await prisma.expense.delete({
      where: { userId, id: expenseId },
    });

    return expense;
  }
  catch (error) {
    throw new Error('Failed to delete expense');
  }
};

export const approveExpense = async (expenseId: string, adminId: string) => {
  try {
    const expense = await prisma.expense.update({
      where: { id: expenseId, status: 'pending' },
      data: { status: 'approved' },
    });

    return expense;
  } catch (error) {
    throw new Error('Failed to approve expense');
  }
};

export const getUserExpenses = async (userId: string, startDate: Date, endDate: Date, groupId?: string) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        ...(groupId && { groupId }),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        Receipt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(expenses);
    return expenses;
  } catch (error) {
    throw new Error('Failed to fetch user expenses');
  }
};

export const getExpenseById = async (userId: string, expenseId: string) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { userId, id: expenseId },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  } catch (error) {
    throw new Error('Failed to fetch expense');
  }
};
