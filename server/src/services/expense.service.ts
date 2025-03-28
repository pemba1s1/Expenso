import { GroupType, Receipt } from '@prisma/client';
import prisma from '../config/prismaClient';
import { logger } from '../utils/logger';

interface ExpenseDetails {
  amount: string,
  categoryId: string,
  description?: string,
  receiptId?: string,
}

interface ReceiptDetails {
  groupId: string,
  userId: string,
  totalAmount: number,
  taxAmount: number,
  receiptImageUrl: string,
}

export const createExpense = async ({
  amount,
  categoryId,
  description,
  receiptId,
}: ExpenseDetails) => {
  try {
    let status: 'pending' | 'approved' | 'rejected' | undefined = undefined;

    const totalAmount = parseFloat(amount);
    const expense = await prisma.$transaction(async (prisma) => {
      const createdExpense = await prisma.expense.create({
        data: {
          categoryId,
          amount: totalAmount,
          status,
          description,
          receiptId,
        }
      });

      return createdExpense;
    });

    return expense;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const createReceipt = async ({ groupId, userId, totalAmount, taxAmount, receiptImageUrl }: ReceiptDetails) => {
  try {
    let status: 'pending' | undefined = undefined;

    if (groupId) {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { id: true, type: true },
      });

      if (!group) {
        throw new Error('Group not found');
      }

      if (group.type === GroupType.BUSINESS) {
        status = 'pending';
      }
    }

    const receipt = await prisma.receipt.create({
      data: {
        userId,
        groupId,
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

export const deleteExpense = async (expenseId: string) => {
  try {
    const expense = await prisma.expense.delete({
      where: { id: expenseId },
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
    console.log(error);
    throw new Error('Failed to approve expense');
  }
};

export const getUserExpenses = async (userId: string, startDate: Date, endDate: Date, groupId?: string) => {
  try {
    const receipts = await prisma.receipt.findMany({
      where: {
        userId,
        ...(groupId && { groupId }),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        expenses: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return receipts;
  } catch (error) {
    throw new Error('Failed to fetch user expenses');
  }
};

export const getExpenseById = async (expenseId: string) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  } catch (error) {
    throw new Error('Failed to fetch expense');
  }
};
